---
title: interviewlog
tags:
  - work
createTime: 2026/06/16 20:51:29
permalink: /article/vuffs9mk/
categories:
  - work
---

# interview log

# 转转一面（4年经验，社招）
全程 45 分钟八股 + 15 分钟笔试

自称架构，他首先介绍了一下自己

1. 面试官举例自定义一个对象 hashcode 不重写会有什么问题（不明白他想考什么，只能回答重写和不用写 hashcode 的区别）？
2.  synchronized  和 ReentrantLock 区别，到源码层（吵了起来，谈到 graal 我一展开就马上打断。最后说我双标，疑似面试官分不清 协程、线程）
3. spring 创建 bean 怎么切构造方法（回答了 @PostConstruct，和 initMethod 没达到他预期，不知道要问什么）
4. 聚簇索引等于主键索引他不认同，要我反驳（回答聚簇索引理念，未达到预期）
5. ACID 问 I 是什么（脑子空白太紧张没记起来）
6. 线程池核心线程数设置 5 丢 3 个任务，最后创建了几个线程（3个，这里太久没用忘了延迟创建）
7. mybatis 只使用接口便能创建对象的原理（回答代理 + 字节码生成技术，说回答的太笼统）
8. spring 事务里面创建事务，问怎么知道当前方法已经在事务里了（原问题有十几秒前摇，上面是提炼。回答通过 ThreadLocal 存储状态，这里应该是通过 ConcurrentHashmap 存储的状态，key 是方法签名，值是事务属性信息）
9. leetcode  977：https://leetcode.cn/problems/squares-of-a-sorted-array/description 需要实现进阶的 O(n)（说了思路，最后写完代码要调试时告知不能调试，不用提交？？？）

反问：

1. 贵部门的项目时属于大数据还是高 QPS？

回答：说是干中间件和工具类的，都有

2. 我简历上的没有一个能引起面试官注意的么？

回答：一面只问八股
