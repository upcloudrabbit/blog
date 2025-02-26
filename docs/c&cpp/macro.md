---
title: macro
tags:
  - macro
  - c&cpp
createTime: 2025/02/26 22:54:10
permalink: /article/j3k55ocb/
---
# 宏描述
C 语言中的宏（macro）是一种预处理指令，可以在编译前将代码中的符号替换为指定的文本。宏可以简化代码并提高可读性，也可以用来实现一些高级的功能。

语法为 `#define 自定义名称 内容`

C 语言中有一些宏可能写的特别复杂，可以通过`gcc sourcefile -E -o targetfile.i`来查看宏展开后情况

# 宏常量
语法 `#define MAX(a, b) ((a) > (b) ? (a) : (b))`在使用宏定义时，待替换的文本尽量使用 `()`进行包裹，否则很可能出现运算符优先级问题

```c
#define MAX(a, b) ((a) > (b) ? (a) : (b))
int main() {
    MAX(1, 2);
}
// 结果
int main() {
    ((1) > (2) ? (1) : (2));
}
```

# 宏函数
语法`#define SQUARE(x) ((x) * (x))`

```c
#define SQUARE(x) ((x) * (x))
int main() {
    int y = 10;
    int square_value = SQUARE(y);
}
// 结果
int main() {
    int y = 10;
    int square_value = ((y) * (y));
}
```

# 宏控制结构
宏定义实现了一个调试信息输出的功能。当编译时定义了 DEBUG 宏时，调用 DEBUG_PRINT 会将信息输出到标准错误流中；否则， DEBUG_PRINT 会被替换为空语句

```c
#ifdef DEBUG
#define DEBUG_PRINT(fmt, args...) fprintf(stderr, fmt, ##args)
#else
#define DEBUG_PRINT(fmt, args...)
#endif
```

# 字符串处理 
+ 使用`#`可以将宏的参数变为对应的字符串
+ 使用`##`可以将参数拼接起来

```c
#define STR(x) #x
#define CONCAT(x, y) x##y

int main() {
    printf("%s\n", STR(hello)); 
    int CONCAT(var, 1) = 10;
}
// 结果
int main() {
    printf("%s\n", "hello");
    int var1 = 10;
}
```

# 匿名函数
该宏定义实现了一个匿名函数，计算输入参数的平方。在代码中可以直接使用 SQUARE(y) 来计算 y 的平方（如果宏定义过长可以使用 \ 继续书写）

```c
#define SQUARE(x) ({        \
        __typeof__(x) _x = x; \
        _x * _x;              \
    })

int main() {
    int y = 10;
    int square_value = SQUARE(y);
}
// 结果
int main() {
    int y = 10;
    int square_value = ({ __typeof__(y) _x = y; _x * _x; });
}
```

# 类型泛化
宏可以用于实现类型泛化，即实现一些函数或数据结构，使其适用于多种数据类型。

```c
#define SORT(type, arr, len)  \
    qsort(arr, len, sizeof(type), compare_##type)

int compare_int(const void *a, const void *b) {
    return *(int*)a - *(int*)b;
}

int compare_double(const void *a, const void *b) {
    return *(double*)a - *(double*)b;
}
int main() {
    int arr1[] = { 3, 1, 4, 2 };
    double arr2[] = { 3.0, 1.0, 4.0, 2.0 };
    
    SORT(int, arr1, 4);
    SORT(double, arr2, 4);
}
// 结果
int main() {
    int arr1[] = { 3, 1, 4, 2 };
    double arr2[] = { 3.0, 1.0, 4.0, 2.0 };

    qsort(arr1, 4, sizeof(int), compare_int);
    qsort(arr2, 4, sizeof(double), compare_double);
}
```

# 调试
宏可以用于调试程序，比如在程序中加入调试信息、跟踪程序执行等。这里的 \_\_FILE__、__LINE__属于内置宏，分别代表当前文件、当前行

```c
#define DEBUG(fmt, ...) printf("[DEBUG] %s:%d: " fmt "\n", __FILE__, __LINE__, ##__VA_ARGS__)
int main() {
    int x = 10;
    DEBUG("x = %d", x);
}

```

# 防止重复定义
如果头文件被多次包含，会导致编译错误或者程序出现意料之外的行为。具体来说，头文件被多次包含可能会产生以下两种问题：

1. 编译错误：如果头文件中定义了类型、变量、函数等，多次包含会导致这些定义重复，从而导致编译错误。
2. 意外行为：如果头文件中定义了宏、内联函数等，多次包含会导致这些定义重复，从而导致程序出现意外的行为。

```c
#ifndef _HEADER_H_
#define _HEADER_H_

// 头文件内容

#endif /* _HEADER_H_ */
```

# 条件编译
配合 makefile 提供的额外参数可构建不同的平台，不同环境下的代码

```c
#ifdef DEBUG
#define LOG(fmt, ...) printf("[DEBUG] " fmt "\n", ##__VA_ARGS__)
#else
#define LOG(fmt, ...)
#endif

LOG("x = %d", x);   // 在DEBUG模式下输出调试信息，否则不输出
```

# 复杂宏示例
## jvm 源码 `hotspot/src/share/vm/memory/allocation.hpp`
关于类型判断的宏定义如下

```c
#define METASPACE_OBJ_TYPES_DO(f) \
  f(Unknown) \
  f(Class) \
  f(Symbol) \
  f(TypeArrayU1) \
  f(TypeArrayU2) \
  f(TypeArrayU4) \
  f(TypeArrayU8) \
  f(TypeArrayOther) \
  f(Method) \
  f(ConstMethod) \
  f(MethodData) \
  f(ConstantPool) \
  f(ConstantPoolCache) \
  f(Annotation) \
  f(MethodCounters) \
  f(Deallocated)

#define METASPACE_OBJ_TYPE_DECLARE(name) name ## Type,
#define METASPACE_OBJ_TYPE_NAME_CASE(name) case name ## Type: return #name;

enum Type {
// Types are MetaspaceObj::ClassType, MetaspaceObj::SymbolType, etc
METASPACE_OBJ_TYPES_DO(METASPACE_OBJ_TYPE_DECLARE)
_number_of_types
};

static const char * type_name(Type type) {
switch(type) {
METASPACE_OBJ_TYPES_DO(METASPACE_OBJ_TYPE_NAME_CASE)
default:
  ShouldNotReachHere();
  return NULL;
}
}
```

最终代码为

```c
enum Type {
    // Types are MetaspaceObj::ClassType, MetaspaceObj::SymbolType, etc
    UnknownType,
    ClassType,
    SymbolType,
    TypeArrayU1Type,
    TypeArrayU2Type,
    TypeArrayU4Type,
    TypeArrayU8Type,
    TypeArrayOtherType,
    MethodType,
    ConstMethodType,
    MethodDataType,
    ConstantPoolType,
    ConstantPoolCacheType,
    AnnotationType,
    MethodCountersType,
    DeallocatedType,
    _number_of_types
};

  static const char * type_name(Type type) {
    switch(type) {
    case UnknownType: return "Unknown";
    case ClassType: return "Class";
    case SymbolType: return "Symbol";
    case TypeArrayU1Type: return "TypeArrayU1";
    case TypeArrayU2Type: return "TypeArrayU2";
    case TypeArrayU4Type: return "TypeArrayU4";
    case TypeArrayU8Type: return "TypeArrayU8";
    case TypeArrayOtherType: return "TypeArrayOther";
    case MethodType: return "Method";
    case ConstMethodType: return "ConstMethod";
    case MethodDataType: return "MethodData";
    case ConstantPoolType: return "ConstantPool";
    case ConstantPoolCacheType: return "ConstantPoolCache";
    case AnnotationType: return "Annotation";
    case MethodCountersType: return "MethodCounters";
    case DeallocatedType: return "Deallocated";
    default:
      ShouldNotReachHere();
      return NULL;
    }
  }
```

