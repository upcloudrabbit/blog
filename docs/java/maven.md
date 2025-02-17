---
title: maven
tags:
  - java
  - maven
createTime: 2025/02/17 23:04:27
permalink: /article/7uzmq0e4/
---
# maven 打包排除父类依赖的插件
有些奇葩的项目喜欢在父 pom 定义一些奇怪的插件导致其他人不能打包（这个父 pom 被打包成私有 jar 当作三方依赖引入），解决方案

1. 如果是公用的打包插件被定义在父 pom 中，那么子 pom 只需要添加以下标签即可排除（前提是这个插件提供可排除配置选项）

```xml
<!--<configuration>
  <skip>true</skip>
</configuration>-->

<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-xxx-plugin</artifactId>
	<version>2.11</version>
	<configuration>
		<skip>true</skip>
	</configuration>
</plugin>
```

2. 当父 pom 配置了自动触发插件而子 pom 不需要触发这个插件则添加以下标签表示不触发对应插件功能（前提是这个插件提供可配置选项）

```xml
<!-- mainClass 设置为 none 即可 -->
<plugin>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-maven-plugin</artifactId>
	<configuration>
		<mainClass>none</mainClass>
	</configuration>
</plugin>
```

3. 上 2 的另一种解决方案，可以在子 pom 中重新引入父 pom 的打包插件，重写其打包规则（前提是父 pom 的插件配置了 ID）

```xml
<!-- 将 phase 设置为空 -->
<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-xxx-plugin</artifactId>
	<version>2.11</version>
	<executions>
        <execution>
            <id>这里是parent里的插件id</id>
            <phase>none</phase>
        </execution>
    </executions>
</plugin>
```

4. 上 3 如果父 pom 中没有配置 ID 可以采用以下方案

```xml
<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-xxx-plugin</artifactId>
	<version>2.11</version>
	<executions>
		<!--加一个execution , phase设置成空-->
		<execution>
			<phase/>
		</execution>
		<!--加一个有自己id的execution，id随便，其余可以不写-->
		<execution>
			<id>myid</id>
		</execution>
	</executions>
</plugin>
```

5. <font style="color:rgb(38, 38, 38);">一定能解决的方案，直接在子pom 中去除 parent 标签，把父 pom 中需要的依赖都复制过来，其它的按子 pom 需求改动即可</font>

# Win10 系统下打包 Springboot3.0 Native
1. 按照正常 Maven 项目创建
2. win + q 搜索打开 x64 Native Tools Command Prompt for VS 2022 （安装Visual Studio 2022）然后进入项目根路径
3. 键入打包命令：mvn clean -Dmaven.test.skip=true -Pnative native:compile （直接使用 IDEA 命令打包会失败）

# Maven 打包跳过测试
1. mvn clean install -DskipTests（不执行测试，但是会编译）
2. mvn clean install -Dmaven.test.skip=true（既不编译也不执行测试）
3. 在项目 pom 中添加以下配置跳过测试

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <!-- maven 打包时跳过测试 -->
            <configuration>
                <skip>true</skip>
            </configuration>
        </plugin>
    </plugins>
<build>    
```

# SpringBoot 打包时引入本地三方 jar 包
首先要在 pom 中明确引入本地的三方 jar（这里引入后在本地编译时正常，但是打包成 jar 时会丢失 三方 jar）

```xml
<!-- 例如要引入本地工程 libs 目录下的 progress.jar -->
<dependency>
  <groupId>com.baidu</groupId>
  <artifactId>progress</artifactId>
  <version>12.0</version>
  <scope>system</scope>
  <systemPath>${project.basedir}/libs/progress.jar</systemPath>
</dependency>
```

需要在指定 <font style="color:rgb(51, 51, 51);">includeSystemScope 为 true</font>

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <includeSystemScope>true</includeSystemScope>
    </configuration>
</plugin>
```

# 高版本 maven 编译运行 jdk1.6
高版本的 maven 不能直接打包低版本 jdk，可看 [对应关系](https://maven.apache.org/docs/history.html)。需要引入插件进行打包，以下为示例使用高版本打包 jdk1.6 的工程（maven 运行还是需要对应的 jdk 版本——maven 运行和打包使用的版本是不一样的）

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-toolchains-plugin</artifactId>
  <version>1.1</version>
  <executions>
    <execution>
      <goals>
        <goal>toolchain</goal>
      </goals>
    </execution>
  </executions>
  <configuration>
    <toolchains>
      <jdk>
        <version>1.6</version>
        <vendor>sun</vendor>
      </jdk>
    </toolchains>
  </configuration>
</plugin>
<!-- 该插件只是用作指定编译时的工程版本和编码 -->
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <version>3.1</version>
  <configuration>
    <source>6</source>
    <target>6</target>
  </configuration>
</plugin>
```

然后创建文件 `toolchains.xml`

```xml
<?xml version="1.0" encoding="UTF8"?>
<toolchains>
    <toolchain>
        <type>jdk</type>
        <provides>
            <version>1.6</version>
            <vendor>sun</vendor>
        </provides>
        <configuration>
          <!-- 本机实际的 jdk 路径 -->
            <jdkHome>D:\Coding\java\jdk-6u45</jdkHome>
        </configuration>
    </toolchain>
</toolchains>
```

打包命令添加参数 `mvn clean package --global-toolchains xxx\toolchains.xml -X`

