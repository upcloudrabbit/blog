---
title: java编译器
tags:
  - java
createTime: 2026/06/16 20:51:29
permalink: /article/5ysstzav/
categories:
  - java
---

# java 编译器

# Javac
javac 编译代码的过程

1. 词法分析：Java 源码 -> Token 流
2. 语法分析：Token 流 -> 抽象语法树
3. 语义分析：抽象语法树 -> 标注语法树
4. 代码生成：标注语法树 -> 字节码

# Javac 源码路径
jdk 中的 提供编译的 javac 工具是由 java 语言编写的，除此之外还有很多工具也是，都位于 源码包下的：langtools 模块下，openjdk.langtools.src.share.classes.com.sun.tools

javac 编译命令入口 com.sun.tools.javac.Main#main
