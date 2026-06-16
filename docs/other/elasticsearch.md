---
title: elasticsearch
tags:
  - other
createTime: 2026/06/16 20:51:29
permalink: /article/te3z4t34/
categories:
  - other
---

# elasticsearch

# ES 7.17.10 集群搭建

以下操作为配置 3 个节点的 ES 集群

1. 首先下载 [ES](https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.17.10-no-jdk-linux-x86_64.tar.gz) 和 [JDK11](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html)（这里单独下载 jdk，也可以使用 ES 自带的 jdk，但是这个版本自带的 jdk 是 13），然后分别解压到 `/opt/softs`
2. 开始配置系统参数，编辑文件 `vim /etc/security/limits.conf`在文件末尾添加以下内容

```properties
* soft nproc   unlimited # The maximum number of processes available to a single user
* hard nproc   unlimited
* soft memlock unlimited # The maximum size that may be locked into memory
* hard memlock unlimited
* soft core    unlimited # The maximum size of core files created
* hard core    unlimited
* soft stack   unlimited
* hard stack   unlimited
```

3. 编辑文件 `vim /etc/systemd/system.conf`在文件末尾添加以下内容（如果当前操作系统版本低于包含等于 CentOS6，则不需要进行操作）

```properties
DefaultLimitMEMLOCK=infinity
```

4. 编辑文件 <code>vim /etc/sysctl.conf</code>在文件末尾添加以下内容

```properties
vm.max_map_count=655360
```

5. 开始修改 ES 的配置文件 `vim /opt/softs/elasticsearch-7.17.10/config/elasticsearch.yml`，改完成后复制两份到另外的两个节点上，其它两个节点的配置文件需要修改 node.name 为对应的节点名称

```properties
# 集群名称，一个集群的名称需要一致
cluster.name: my-application
# 当前节点名称
node.name: node-1
# 启动时锁定内存，centos6 以下需要关闭此参数
bootstrap.memory_lock: true
# 绑定本机网络
network.host: 0.0.0.0
# 开放给外部调用的端口
http.port: 9200
# 集群间通信端口
transport.tcp.port: 9300
# 该节点是否可被选为 master
node.master: true
# 该节点是否存储数据
node.data: true
# 为了避免脑裂，集群节点数最少为 半数+1
discovery.zen.minimum_master_nodes: 2
# 只要指定数量的节点加入集群，就开始进行恢复
gateway.recover_after_nodes: 2
# ES 的查询参数限制，默认是限制只能传入1024个参数
indices.query.bool.max_clause_count: 10240
# 将阻止主副本分片被分配到同一台物理机，提高可用性
cluster.routing.allocation.same_shard.host: true
# 设置是否压缩tcp传输时的数据，默认为 false，不压缩。 
transport.tcp.compress: true
# 是否支持跨域
http.cors.enabled: true
http.cors.allow-origin: "*"
# 数据存储路径
path.data: /opt/softs/elasticsearch-7.17.10/data
# 日志存储路径
path.logs: /opt/softs/elasticsearch-7.17.10/logs
# 该配置将用作发现其它节点
discovery.seed_hosts: ["192.168.6.100:9300", "192.168.6.101:9300", "192.168.6.102:9300"]
# 集群初始化时的主节点候选，一旦启动集群成功后需要删除所有节点的该配置选项
cluster.initial_master_nodes: ["node-1", "node-2", "node-3"]
```

5. 修改 jvm 配置文件 `vim /opt/softs/elasticsearch-7.17.10/config/jvm.options`

```properties
# 以下为联系配置，服务器按照 63G 内存以下直接除 2 配置，64G 以上为 接除 2 - 1
-Xms128m
-Xmx128m

# 这里是动态配置垃圾回收期可以打开注释，但是我这边用的 jdk11 想 G1 进行搭建回收
## GC configuration
#8-13:-XX:+UseConcMarkSweepGC
#8-13:-XX:CMSInitiatingOccupancyFraction=75
#8-13:-XX:+UseCMSInitiatingOccupancyOnly

## G1GC Configuration
# NOTE: G1 GC is only supported on JDK version 10 or later
# to use G1GC, uncomment the next two lines and update the version on the
# following three lines to your version of the JDK
# 10-13:-XX:-UseConcMarkSweepGC
# 10-13:-XX:-UseCMSInitiatingOccupancyOnly
-XX:+UseG1GC

## JVM temporary directory
-Djava.io.tmpdir=${ES_TMPDIR}

## heap dumps

# generate a heap dump when an allocation from the Java heap fails; heap dumps
# are created in the working directory of the JVM unless an alternative path is
# specified
-XX:+HeapDumpOnOutOfMemoryError

# exit right after heap dump on out of memory error. Recommended to also use
# on java 8 for supported versions (8u92+).
9-:-XX:+ExitOnOutOfMemoryError

# specify an alternative path for heap dumps; ensure the directory exists and
# has sufficient space
-XX:HeapDumpPath=data

# specify an alternative path for JVM fatal error logs
-XX:ErrorFile=logs/hs_err_pid%p.log

## JDK 8 GC logging
8:-XX:+PrintGCDetails
8:-XX:+PrintGCDateStamps
8:-XX:+PrintTenuringDistribution
8:-XX:+PrintGCApplicationStoppedTime
8:-Xloggc:logs/gc.log
8:-XX:+UseGCLogFileRotation
8:-XX:NumberOfGCLogFiles=32
8:-XX:GCLogFileSize=64m

# JDK 9+ GC logging
9-:-Xlog:gc*,gc+age=trace,safepoint:file=logs/gc.log:utctime,pid,tags:filecount=32,filesize=64m
```

6. 指定使用的 jdk `vim /opt/softs/elasticsearch-7.17.10/bin/elasticsearch`这里需要在文件头部添加以下内容

```bash
export ES_JAVA_HOME=/opt/softs/jdk-11.0.18
export PATH=$ES_JAVA_HOME/bin:$PATH

#添加jdk判断
if [ -x "$ES_JAVA_HOME/bin/java" ]; then
  JAVA="/opt/softs/jdk-11.0.18/bin/java"
else
  JAVA=`which java`
fi
```

或者编辑（选择一种即可） `vim /opt/softs/elasticsearch-7.17.10/bin/elasticsearch-env`，直接头部声明变量即可

```bash
export ES_JAVA_HOME=/opt/softs/jdk-11.0.18
```

7. 由于 ES 不允许使用 root 用户启动，因此需要创建一个新的用户来启动 ES，如果有其它建好的也可以直接使用。以下命令为添加用户并修改对应的权限`useradd es && chown -R /opt/softs/elasticsearch-7.17.10`
8. 不分先后，启动各个服务器上的 ES `nohup ./bin/elasticsearch >>elasticsearch.log &`
9. 以下命令为基本的运维命令

```bash
# 查看集群健康度（直接看整体是否是绿色即可）
curl http://localhost:9200/_cat/health?v
# 查看主节点在哪台机器上
curl http://localhost:9200/_cat/master
# 查看当前节点信息
curl localhost:9200
```
