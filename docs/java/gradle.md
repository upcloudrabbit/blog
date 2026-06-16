---
title: gradle
tags:
  - java
createTime: 2026/06/16 20:51:29
permalink: /article/e0kae401/
categories:
  - java
---

# gradle

# Gradle 配置
1. [官网](https://gradle.org/releases/) 下载 Gradle
2. 解压至任意目录即可完成安装
3. 配置环境变量以及本地仓库存放位置

win + i 选中系统环境变量配置，依次添加 GRADLE_HOME -> 解压路径、GRADLE_USER_HOME -> 本地仓库路径，添加 %GRADLE_HOME%\ 至系统环境变量

4. cmd 键入命令 gradle -version
5. 重启下电脑刷新环境变量，即使 cmd 生效 IDEA 有时还是读不到，重启解决问题。

# Win10 系统下打包 Springboot3.0 Native
1. 按照正常 Gradle 项目创建
2. win + q 搜索打开 x64 Native Tools Command Prompt for VS 2022 （安装Visual Studio 2022）然后进入项目根路径
3. 键入命令 gradle naviteBuild（直接使用 IDEA 命令打包会失败，如果需要跳过测试则直接在 build.gradle 中添加跳过测试即可，或者再添加打包参数 -x test）

```groovy
test {
    enabled(false)
    // 或者 enable = false
}
```
