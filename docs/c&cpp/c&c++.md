---
title: c&c++
tags:
  - c&cpp
createTime: 2026/06/16 20:51:29
permalink: /article/4iorm5fd/
categories:
  - c&cpp
---

# c & c++

# Include

#include 用于预编译文件导入（即在预编译阶段把需要包含的代码原封不动的复制过来）后续的需要的文件可以又两种形式表示：

* `<xxx>`：导入的文件直接从系统目录去查找
* "xxx"：先从当前目录查找，找不到再去系统目录查找

# 字符串数组初始化

* 在 C、C++ 中使用字符串字面量形式初始化一个字符数组时，编译器会在字符串的末尾自动添加`\0`用作标记字符串的结束 `char c[] = {"test"}`这个时候 c 的长度应该为 5
* 当使用 printf 函数输出字符串时，它遇到 \0 会自动停止输出，不管这个字符串以后是否有值

# GCC 源码编译

可以从 [github](https://github.com/gcc-mirror/gcc) 下载到所有的 gcc 版本，这里使用中间版本 7.4.0 用于构建 5.4.0 的桥梁

1. 首先需要安装以下三个依赖

```bash
wget ftp://ftp.gnu.org/gnu/gmp/gmp-4.3.2.tar.bz2
tar -jxf gmp-4.3.2.tar.bz2 && cd gmp-4.3.2
./configure --prefix=/usr/local/gmp-4.3.2
make && make install

wget ftp://ftp.gnu.org/gnu/mpfr/mpfr-3.1.4.tar.bz2
tar -jxf mpfr-3.1.4.tar.bz2 && cd mpfr-3.1.4
./configure --prefix=/usr/local/mpfr-3.1.4  --with-gmp=/usr/local/gmp-4.3.2
make && make install

wget https://ftp.gnu.org/gnu/mpc/mpc-1.0.3.tar.gz
tar -xf mpc-1.0.3.tar.gz && cd mpc-1.0.3
./configure --prefix=/usr/local/mpc-1.0.3  --with-gmp=/usr/local/gmp-4.3.2 --with-mpfr=/usr/local/mpfr-3.1.4
make && make install

apt-get install -y flex
```
