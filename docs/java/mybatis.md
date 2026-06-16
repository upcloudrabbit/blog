---
title: mybatis
tags:
  - java
createTime: 2026/06/16 20:51:29
permalink: /article/q8u2p8qd/
categories:
  - java
---

# mybatis

# MyBatis 标签配置字符串比较
mybatis 映射文件中，if标签判断字符串相等，两种方式：

1. 使用 ognl 表达式

```xml
<if test = "name=='Tom'.toString()"></if>
```

2. ' 和 " 反着写

```xml
<if test = 'name=="Tom"'></if>
```
