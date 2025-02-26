---
title: conan
tags:
  - package
  - c&cpp
createTime: 2025/02/26 22:52:39
permalink: /article/nekyd12y/
---
[conan](https://conan.io/) 作为一个开源、去中心化和多平台的软件包管理器，用于创建和共享所有本地二进制文件.

# 安装
1. conan 通过 pip 进行安装，因此需要提前安装 python3 环境（这里选择用 conda 安装最新的 python3 版本即可）
2. 运行命令直接安装`pip install conan -i https://pypi.tuna.tsinghua.edu.cn/simple`
3. conan 默认会在`用户目录/.conan2`可通过添加环境变量`CONAN_HOME`进行修改
4. 运行`conan version`输出则安装完成，然后进行配置文件初始化

# 集成 CMake
1. 首先需要创建一个标准的 cmake 项目，编辑其中 CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.29)
project(codexperiment)
set(CMAKE_CXX_STANDARD 20)
# 这里以引入 Boost 库作为测试
find_package(Boost REQUIRED)
add_executable(codexperiment src/main.cpp)
# 这里的 target_link_libraries 可以参考后续的命令输出来确认
target_link_libraries(codexperiment boost::boost)
```

2. 新建 conanfile.txt 文件写入以下内容

```toml
[requires]
boost/1.85.0

[generators]
CMakeDeps
CMakeToolchain
```

3. 运行命令初始化配置文件`conan profile detect --force`（该文件默认会创建到 根路径/.conan2/profiles 目录下，也可以自己手写然后指定）
4. 执行命令编译依赖的库文件`conan install . --output-folder=cmake-build-debug --build=missing -s -build_type=Debug`（这里由于使用的是 CLion 因此输出文件夹直接写 cmake-build-debug，也可以自定义）
5. 执行命令进行编译`cmake . -DCMAKE_TOOLCHAIN_FILE=cmake-build-debug/conan_toolchain.cmake -DCMAKE_BUILD_TYPE=Debug`（如果是 Clion 则需要打开设置修改 CMake 设置，添加 CMake Options`-DCMAKE_TOOLCHAIN_FILE=cmake-build-debug/conan_toolchain.cmake`）

