---
title: Parallel GC
tags:
  - java
  - hotspot
  - jvm
createTime: 2026/06/15 22:58:26
permalink: /article/9upw6vis/
categories:
  - java
---
# Parallel GC

> 生成日期：2026-06-14 20:16
> 数据来源：JDK 26 Parallel GC 源码分析

---

## 重点关注

- [ ] PSScavenge::invoke() 中 ScavengeRootsTask 并行根扫描的负载均衡策略
- [ ] PSPromotionManager::copy_to_survivor_space 中 CAS + PLAB + 工作窃取的三重并发保障
- [ ] PSParallelCompact 五阶段算法中影子区域（Shadow Region）解决区域依赖的原理
- [ ] 密集前缀（Dense Prefix）优化在老年代压缩中的性能收益
- [ ] PSAdaptiveSizePolicy 基于吞吐量目标的代大小调整是否能在突变负载下收敛

---

## 功能概述

Parallel GC（Parallel Scavenge + Parallel Old）是 JDK 中吞吐量优先的默认垃圾回收器，面向多核处理器和大堆内存的批处理场景。它的核心设计理念是最大化应用吞吐量，即最小化 GC 时间占总运行时间的比例。

主要特征：
- **全并行架构**：Young GC 和 Full GC 均使用所有可用工作线程并行执行
- **固定代边界**：年轻代（Eden + From + To）与老年代在虚拟地址空间中连续排列，代间边界在启动后固定
- **自适应调整**：`PSAdaptiveSizePolicy` 根据吞吐量目标（`-XX:GCTimeRatio`）动态调整代大小
- **并行标记-压缩**：Full GC 使用五阶段并行标记-压缩算法，避免内存碎片

---

## 核心概念

### 1. ParallelScavengeHeap — 堆容器

**定义**：Parallel GC 的堆容器，管理年轻代（`PSYoungGen`）和老年代（`PSOldGen`）。

**作用**：
- 统一管理堆生命周期，代间共享内存池
- 提供分配入口，委托给各代的 MutableSpace
- 协调 Young GC 和 Full GC 的触发

**三维评估**：

| 维度 | 评估 |
|------|------|
| 好处 | 简单的两代设计，分配路径极短（TLAB → CAS bump-pointer） |
| 替代方案 | Region 化设计（如 G1），增加局部细化但引入额外开销 |
| 风险 | 固定代边界不灵活，大对象晋升过快可能触发不必要的 Full GC |

### 2. PSYoungGen — 年轻代

**定义**：包含 Eden、From Survivor、To Survivor 三块 MutableSpace 的年轻代管理器。

**作用**：
- 管理 Eden 分配和新对象晋升
- GC 后执行 From/To 空间互换（`swap_spaces()`）
- 根据 `PSAdaptiveSizePolicy` 动态调整三块空间比例

**三维评估**：

| 维度 | 评估 |
|------|------|
| 好处 | 三空间结构实现高效复制回收，无碎片产生 |
| 替代方案 | G1 的多个 Eden/Survivor Region；管理粒度更细但更复杂 |
| 风险 | Survivor 空间不足导致过早晋升到老年代 |

### 3. PSOldGen — 老年代

**定义**：存放长期存活对象的连续 MutableSpace。

**作用**：
- 接收 Young GC 中晋升的对象
- 在 Full GC 中通过并行标记-压缩回收和整理
- 支持大对象直接分配

**三维评估**：

| 维度 | 评估 |
|------|------|
| 好处 | 连续空间分配，访问局部性好 |
| 替代方案 | G1 的 Old Region 集合；打破连续性但便于并行回收 |
| 风险 | Full GC 前碎片化严重可能导致 `PromotionFailed` |

### 4. PSScavenge — Young GC 入口

**定义**：Parallel GC 年轻代回收的入口类和核心控制逻辑。

**作用**：
- `invoke()` 方法触发整轮 Young GC
- 并行根扫描（`ScavengeRootsTask`）——线程栈、JNI 句柄、CLD、CardTable 老年代跨代引用
- 引用处理、弱根处理、元空间阈值检查
- 失败时 `restore_preserved_marks()` 并触发 Full GC

**三维评估**：

| 维度 | 评估 |
|------|------|
| 好处 | 全并行 Scavenge 速度极快，多核下吞吐量高 |
| 替代方案 | G1 的 Young Collector；更复杂的 SATB 和 RSet 管理 |
| 风险 | 晋升失败时缺乏优雅降级，直接回退到 Full GC |

### 5. PSPromotionManager — 每线程晋升管理器

**定义**：每个 GC 工作线程私有的对象晋升管理器，使用 PLAB + 工作窃取。

**作用**：
- `copy_to_survivor_space()`：通过 CAS 获取对象所有权后复制到 to-space 或老年代
- `push_contents()`：将复制后对象的子引用压入本地栈
- 任务窃取（`TaskTerminator`）：空闲线程从繁忙线程窃取任务

**三维评估**：

| 维度 | 评估 |
|------|------|
| 好处 | CAS + PLAB 减少锁争用；工作窃取保证负载均衡 |
| 替代方案 | G1 的 G1ParScanThreadState；功能类似但集成度更高 |
| 风险 | 工作窃取末端检测的终止协议（Termination Protocol）存在活锁风险 |

### 6. PSParallelCompact — Full GC 入口

**定义**：并行老年代标记-压缩算法的入口和核心编排器。

**作用**：
- `invoke()` 驱动五阶段 Full GC
- Phase 1（并行标记）：`ParMarkBitMap` 标记存活对象
- Phase 2（摘要）：单线程计算压缩目标和密集前缀边界
- Phase 3（转发）：并行计算每个对象的新地址
- Phase 4（调整指针）：并行更新所有引用
- Phase 5（并行压缩）：影子区域 + 工作窃取实现区域级并行复制

**三维评估**：

| 维度 | 评估 |
|------|------|
| 好处 | 五阶段算法吞吐量极高，大堆压缩效率优越 |
| 替代方案 | G1 FullCollector 五阶段（类似但 Region 化）；Shenandoah FullGC 单线程 |
| 风险 | 单线程摘要阶段是大堆的瓶颈；STW 暂停时间与堆大小线性相关 |

### 7. ParallelCompactData — 区域级元数据

**定义**：Full GC 中用于管理压缩区域划分和目标的元数据结构。

**作用**：
- 将堆划分为等大小的 Region，记录每个 Region 的存活数据大小
- `summarize()` 计算每个 Region 的目标地址、源区域、存活计数
- 处理空间溢出和区域分割

**三维评估**：

| 维度 | 评估 |
|------|------|
| 好处 | 区域化元数据使压缩阶段高度并行化 |
| 替代方案 | Serial GC 的单线程滑动压缩；无需区域元数据 |
| 风险 | 分区粒度过细导致元数据膨胀；过粗降低并行度 |

### 8. ParMarkBitMap — 标记位图

**定义**：Full GC 标记阶段使用的并行安全位图，记录对象存活状态。

**作用**：
- `mark_obj()` / `is_marked()`：原子操作设置/查询标记位
- 并行标记任务并发操作不冲突
- 提供对象起始地址定位，支持压缩阶段的地址计算

**三维评估**：

| 维度 | 评估 |
|------|------|
| 好处 | 位图操作极快，原子 CAS 保证并发安全 |
| 替代方案 | SATB 位图（G1）；支持并发标记但复杂度更高 |
| 风险 | 位图遍历顺序影响压缩算法效率 |

### 9. PSAdaptiveSizePolicy — 自适应调整

**定义**：Parallel GC 专用的自适应调整策略，继承自 `AdaptiveSizePolicy`。

**作用**：
- 基于 GC 暂停时间、吞吐量、分配率等统计指标动态计算各代最优大小
- 调整 tenuring threshold 以避免 Survivor 溢出
- 调整 Eden / Survivor 比例以平衡 GC 频率和暂停时间

**三维评估**：

| 维度 | 评估 |
|------|------|
| 好处 | 复杂多变量优化自动权衡吞吐量和响应时间 |
| 替代方案 | 手动固定 `-Xmn`、`-XX:SurvivorRatio`；静态配置无法适应负载变化 |
| 风险 | 多目标优化可能不收敛（吞吐量 vs 暂停时间相互制约） |

---

## 关键流程

### Young GC

```mermaid
%%{init: {'theme':'dark'}}%%
sequenceDiagram
    participant App as Java 应用线程
    participant VM as VMThread
    participant Heap as ParallelScavengeHeap
    participant YGC as PSScavenge
    participant PM as PSPromotionManager
    participant Gen as PSYoungGen
    participant Policy as PSAdaptiveSizePolicy

    App->>App: Eden 分配失败

    App->>VM: VM_ParallelCollectForAllocation
    VM->>Heap: satisfy_failed_allocation()
    Heap->>YGC: PSScavenge::invoke()

    YGC->>YGC: retire TLABs（刷新所有线程 TLAB）
    YGC->>YGC: ScavengeRootsTask 并行根扫描
    YGC->>YGC: CardTable 扫描（老年代→年轻代跨代引用）

    par 每线程 PSPromotionManager
        PM->>PM: copy_unmarked_to_survivor_space()
        PM->>PM: CAS 争夺对象所有权
        alt 年龄 < tenuring_threshold
            PM->>Gen: PLAB → to-space 复制
        else 年龄 >= tenuring_threshold
            PM->>Heap: PLAB → 老年代晋升
        end
        PM->>PM: push_contents() 处理子引用
    end

    YGC->>YGC: 任务窃取 + 终止检测
    YGC->>YGC: 引用处理（ReferenceProcessor）
    YGC->>YGC: 弱根处理（WeakProcessor）

    alt 晋升失败
        YGC->>Heap: restore_preserved_marks()
        Heap->>Heap: 触发 Full GC
    else 成功
        YGC->>Gen: swap_spaces() (From ↔ To 互换)
        YGC->>Policy: AdaptiveSizePolicy::update()
        Policy->>Policy: 计算期望 Eden / Survivor 大小
        Gen->>Gen: resize_after_young_gc()
        VM-->>App: 恢复分配
    end
```

### Full GC（并行标记-压缩）

```mermaid
%%{init: {'theme':'dark'}}%%
sequenceDiagram
    participant PS as PSParallelCompact
    participant Mark as 标记阶段
    participant Summary as 摘要阶段
    participant Forward as 转发阶段
    participant Adjust as 调整指针阶段
    participant Compact as 压缩阶段

    PS->>PS: pre_compact() 设置

    Note over PS: Phase 1: 并行标记 (Parallel Marking)
    PS->>Mark: marking_phase()
    Mark->>Mark: MarkFromRootsTask（多线程）
    Mark->>Mark: ParMarkBitMap 原子标记位
    Mark->>Mark: 任务窃取 + 终止协议
    Mark->>Mark: 引用对象处理
    Mark->>Mark: 弱根处理 + 类卸载

    Note over PS: Phase 2: 摘要 (单线程)
    PS->>Summary: summary_phase()
    Summary->>Summary: 计算密集前缀边界（不移动的存活区域）
    Summary->>Summary: 遍历 ParallelCompactData Region
    Summary->>Summary: 设置每个 Region 的目标地址 / 源区域 / 存活计数
    Summary->>Summary: 处理空间溢出 → 区域分割

    Note over PS: Phase 3: 转发地址计算
    PS->>Forward: forward_to_new_addr()
    Forward->>Forward: 并行计算每个存活对象的新地址
    Forward->>Forward: 设置 FullGCForwarding 映射表

    Note over PS: Phase 4: 调整指针
    PS->>Adjust: adjust_pointers()
    Adjust->>Adjust: PSAdjustTask（并行）
    Adjust->>Adjust: 更新堆内指针 → 新地址
    Adjust->>Adjust: 更新线程栈 / JNI 句柄 / CLD / 代码缓存

    Note over PS: Phase 5: 并行压缩
    PS->>Compact: compact()
    Compact->>Compact: 初始化影子区域（Shadow Region）
    Compact->>Compact: prepare_region_draining_tasks()
    Compact->>Compact: FillDensePrefixAndCompactionTask
    Compact->>Compact: fill_region() 区域级并行复制
    Compact->>Compact: 影子区域 + 工作窃取

    PS->>PS: post_compact() 清理
    PS->>PS: resize_after_full_gc()
```

---

## 类继承关系

```mermaid
%%{init: {'theme':'dark'}}%%
classDiagram
    class CollectedHeap {
        <<abstract>>
        +collect(GCCause) bool
        +mem_allocate(size_t) HeapWord*
    }

    class ParallelScavengeHeap {
        -_young_gen PSYoungGen
        -_old_gen PSOldGen
        -_size_policy PSAdaptiveSizePolicy
        +mem_allocate(size_t) HeapWord*
        +collect_at_safepoint(GCCause) void
        +satisfy_failed_allocation(size_t) HeapWord*
    }

    class PSYoungGen {
        -_eden_space MutableSpace
        -_from_space MutableSpace
        -_to_space MutableSpace
        +swap_spaces() void
        +resize_after_young_gc() void
        +eden_in_bytes() size_t
        +survivor_in_bytes() size_t
    }

    class PSOldGen {
        -_object_space MutableSpace
        -_object_start_array ObjectStartArray
        +allocate(size_t) HeapWord*
        +resize(size_t) void
    }

    class PSScavenge {
        +invoke() bool
        +invoke_no_policy() void
        -scavenge_failed() bool
    }

    class PSPromotionManager {
        +copy_unmarked_to_survivor_space(oop) oop
        +push_contents(oop) void
        +drain_stacks() void
        -_claimed_stack OopStarTaskQueue
    }

    class PSParallelCompact {
        +invoke() bool
        -marking_phase() void
        -summary_phase() void
        -compact() void
        -forward_to_new_addr() void
        -adjust_pointers() void
    }

    class ParallelCompactData {
        +summarize() void
        +calc_new_pointer(HeapWord*) HeapWord*
        -_region_data RegionData[]
    }

    class ParMarkBitMap {
        +mark_obj(oop) bool
        +is_marked(oop) bool
        +iterate_live_addresses() void
    }

    class PSAdaptiveSizePolicy {
        +compute_tenuring_threshold() uint
        +desired_eden_size() size_t
        +desired_survivor_size() size_t
        +avg_minor_pause() double
    }

    CollectedHeap <|-- ParallelScavengeHeap
    ParallelScavengeHeap *-- PSYoungGen
    ParallelScavengeHeap *-- PSOldGen
    ParallelScavengeHeap *-- PSAdaptiveSizePolicy
    PSScavenge ..> ParallelScavengeHeap : 调⽤
    PSScavenge ..> PSPromotionManager : 创建
    PSParallelCompact ..> ParallelCompactData
    PSParallelCompact ..> ParMarkBitMap
    PSPromotionManager ..> PSYoungGen : 复制到 to-space
    PSPromotionManager ..> PSOldGen : 晋升
```

---

## 三维评估表

| 维度 | 好处 | 替代方案 | 风险 |
|------|------|----------|------|
| 吞吐量 | 多核全并行，吞吐量通常高于所有其他 GC | G1/ZGC 并发设计；吞吐量低于 Parallel | 大堆 Full GC STW 时间长 |
| 自适应调优 | `PSAdaptiveSizePolicy` 自动调优，减少人工干预 | 固定代大小；无法自适应负载变化 | 多目标优化可能不收敛 |
| 成熟稳定 | 20+ 年生产验证，行为可预测 | Serial 更简单但不可扩展 | 低概率的晋升失败/并发模式失败 |
| 内存布局 | 连续空间分配，TLAB 路径极短 | G1 Region 化；空间局部性更好 | 固定代边界不灵活 |
| 并行压缩 | 影子区域 + 工作窃取效率极高 | Serial 单线程压缩；无法并行 | 单线程摘要是大堆瓶颈 |

  - java
  - hotspot
  - jvm
tags:
---

## 核心文件说明

| 文件路径 | 核心类/结构 | 功能描述 |
|----------|------------|---------|
| `src/hotspot/share/gc/parallel/parallelScavengeHeap.hpp` | `ParallelScavengeHeap` | Parallel GC 堆容器，管理年轻代和老年代 |
| `src/hotspot/share/gc/parallel/psYoungGen.hpp` | `PSYoungGen` | 年轻代管理器（Eden + From + To） |
| `src/hotspot/share/gc/parallel/psOldGen.hpp` | `PSOldGen` | 老年代管理器（MutableSpace + ObjectStartArray） |
| `src/hotspot/share/gc/parallel/psScavenge.hpp` | `PSScavenge` | Young GC 入口和核心控制 |
| `src/hotspot/share/gc/parallel/psPromotionManager.hpp` | `PSPromotionManager` | 每线程晋升管理器（PLAB + 工作窃取） |
| `src/hotspot/share/gc/parallel/psParallelCompact.hpp` | `PSParallelCompact` | Full GC 五阶段并行标记-压缩入口 |
| `src/hotspot/share/gc/parallel/parallelCompact.hpp` | `ParallelCompactData` | 区域级元数据管理和压缩目标计算 |
| `src/hotspot/share/gc/parallel/parMarkBitMap.hpp` | `ParMarkBitMap` | 并行安全标记位图 |
| `src/hotspot/share/gc/parallel/psAdaptiveSizePolicy.hpp` | `PSAdaptiveSizePolicy` | 自适应代大小调整策略 |
