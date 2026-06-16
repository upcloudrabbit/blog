---
title: ogg同步db2至kafka
tags:
  - work
createTime: 2026/06/16 20:51:29
permalink: /article/914r2lj6/
categories:
  - work
---

# ogg 同步 db2 至 kafka

# 准备环境

* OGG for DB2 [下载地址](https://www.oracle.com/middleware/technologies/goldengate-downloads.html) （Oracle GoldenGate 12.3.0.1.2 for DB2 9.7 on Linux x86-64）下载完成后直接解压到 DB2 的服务器上
* OGG for BigData [下载地址](https://www.oracle.com/middleware/technologies/goldengate-downloads.html) （Oracle GoldenGate for Big Data 21.4.0.0.0 on Linux x86-64）下载完成后直接解压到 kafka 服务器上
* DB2 需要开启归档日志
* 首先验证一下是否开启了归档模式 `db2 get db cfg for umpayods | grep LOGARCHMETH1` （这个 umpayods 指代连接的数据库名）结果中有输出则代表归档模式已经开启，否则需要手动开启：
  1. 首先登录一下 `dblogin userid db2inst1 password db2inst1`
  2. 然后开启 `db2 update db cfg DB_NAME using LOGRETAIN ON` 或者 `db2 update db cfg DB_NAME using LOGARCHMETH1 “DISK:/opt/DB2/arch"`
  3. 然后重启数据库 `db2stop force && db2start`
  4. 再运行命令查看一下 `db2 get db cfg for umpayods | grep LOGARCHMETH1`

# 全量同步

这里的 zookeeper 单独部署的 3.7.1 版本 kafka 部署的 2.12 - 2.4.1 版本

1. 记录一下开始同步的日期，比如 2023-04-17
2. 首先配置 DB2，切换至对应同步的 DB2 用户 db2inst1 （有对应的权限即可）
3. 依次执行以下命令

```plain
# 配置环境变量
vim /etc/profile
# 末尾添加
export LD_LIBRARY_PATH=/opt/IBM/db2/V9.7/lib64:$LD_LIBRARY_PATH
# 重新加载环境变量
source /etc/profile
# 进入 ogg
./ggsci
# 初始化一下
create subdirs
# 配置管理器 mgr
edit param mgr
# 写入以下信息
PORT 7809
DYNAMICPORTLIST 7810-7909
AUTORESTART EXTRACT *,RETRIES 5,WAITMINUTES 3
PURGEOLDEXTRACTS ./dirdat/*,usecheckpoints, minkeepdays 3
ACCESSRULE, PROG *, IPADDR *, ALLOW
# PORT 即 mgr 的默认监听端口；DYNAMICPORTLIST 动态端口列表，当指定的 mgr 端口不可用时，会在这个端口列表中选择一个，最大指定范围为 256 个；AUTORESTART 重启参数设置表示重启所有 EXTRACT 进程，最多 5 次，每次间隔3分钟；PURGEOLDEXTRACTS 即 TRAIL 文件的定期清理
# 配置抽取进程
edit param ext0
# 写入以下信息
EXTRACT ext0
userid db2inst1,password db2inst1
rmthost 10.10.178.109,mgrport 7809
rmttask replicat,group rep0
TRANLOGOPTIONS ALLOWTABLECOMPRESSION
SOURCEDB umpayods
TABLE ODS.T_*;
# rmthost 指定远程 kafka 端所部署的 ogg 机器的端口。TABLE 指定同步的表，可以使用通配符，tableexclude 可以加在 TABLE 前表示不想同步的表，依旧可以使用通配符
add extract ext0 ,sourceistable
# sourceistable 表示全表抽取
# 启动 mgr
start mgr

```

4. 开始配置 kafka 端

```plain
# 配置环境变量，末尾添加
JAVA_HOME=/opt/softs/jdk8
PATH=$PATH:$JAVA_HOME/bin
export JAVA_HOME
export PATH
export KAFKA_HOME=/usr/mpsp/softs/kafka_2.12-2.6.3
export OGG_HOME=/usr/mpsp/softs/ogg
export LD_LIBRARY_PATH=$KAFKA_HOME/libs:$JAVA_HOME/jre/lib/amd64/libjava.so:$JAVA_HOME/jre/lib/amd64:$JAVA_HOME/jre/lib/amd64/server:$JAVA_HOME/jre/lib/amd64/libjsig.so:$JAVA_HOME/jre/lib/amd64/server/libjvm.so:$OGG_HOME/lib
export PATH=$PATH:$OGG_HOME:$OGG_HOME/bin
export CLASSPATH=$KAFKA_HOME/libs:$JAVA_HOME/jre/lib/ext:$JAVA_HOME/lib/tools.jar
# 进入 ogg
./ggsci
# 初始化
create subdirs
# 配置管理器 mgr
edit param mgr
# 写入以下信息
PORT 7809
DYNAMICPORTLIST 7810-7909
AUTORESTART EXTRACT *,RETRIES 5,WAITMINUTES 3
PURGEOLDEXTRACTS ./dirdat/*,usecheckpoints, minkeepdays 3
ACCESSRULE, PROG *, IPADDR *, ALLOW
# 配置 replicate 进程
edit params rep0
# 写入以下信息
REPLICAT rep0
TARGETDB LIBFILE libggjava.so SET property=./dirprm/kafka.props
REPLACEBADCHAR SKIP
SOURCECHARSET OVERRIDE GBK
map ODS.T_*, target ODS.T_*;
#　SPECIALRUN 将　replicat　设定为一次性运行，不需要checkpoint，END RUNTIME 当　load　完成后终结　replicat
# 添加进程
add replicat rep0 ,specialrun
# 启动管理器
start mgr
# 退出 ogg
quit
# 配置 kakfa
vim ./dirprm/kafka.props
# 写入以下信息（虽然是 kafka 文件，但是 ogg 读取是不支持注释的，必须去除 # 部分）
gg.handlerlist=kafkahandler
gg.handler.kafkahandler.type=kafka
gg.handler.kafkahandler.KafkaProducerConfigFile=custom_kafka_producer.properties
gg.handler.kafkahandler.topicMappingTemplate=${tableName}
gg.handler.kafkahandler.format=json
gg.handler.kafkahandler.mode=op
gg.classpath=dirprm/:/usr/mpsp/softs/kafka_2.12-2.6.3/libs/*:/usr/mpsp/softs/ogg/:/usr/mpsp/softs/ogg/lib/*

# gg.handler.kafkahandler.format：传输文件的格式，支持json，xml，avro_op 等
# gg.handler.kafkahandler.mode：传输模式，op为一次SQL传输一次，tx为一次事务传输一次
# gg.classpath：须指定相应的lib路径

# 再创建 kafka 配置文件
vim ./dirprm/custom_kafka_producer.properties
bootstrap.servers=10.10.178.109:19092
acks=1
compression.type=gzip
reconnect.backoff.ms=1000
value.serializer=org.apache.kafka.common.serialization.ByteArraySerializer
key.serializer=org.apache.kafka.common.serialization.ByteArraySerializer
batch.size=102400
linger.ms=10000

# 
```

5. 在 DB2 端启动同步进程，观察运行情况 `start ext0`，查看 ext0 运行日志 `view report ext0`，然后在Kafka 端查看运行日志 `view report rep0`
6. 查看 kafka 中的数据

```plain
# 查看全部队列，每张表一个主题
./kafka-topics.sh --list --bootstrap-server 10.10.178.109:19092
# 消费一个队列查看情况
./kafka-console-consumer.sh --bootstrap-server 10.10.178.109:19092 --topic T_TABLE_DEFINE --from-beginning
```

# 增量同步

1. 在 DB2 端执行以下命令

```plain
# 进入 ogg 命令行
./ggsci
# 配置抽取进程 ext1
edit params ext1
# 写入以下信息
EXTRACT ext1
userid db2inst1,password db2inst1
SOURCEDB umpayods
TRANLOGOPTIONS ALLOWTABLECOMPRESSION
EXTTRAIL ./dirdat/e1
TABLE ODS.T_*;
# 添加 extract 进程并指定同步开始时间，这个可以是 now 或者时间或者 lsn 号
add extract ext1,tranlog,begin 2023-04-16 17:10
# 添加 trail 文件的定义与 extract 进程绑定
add exttrail ./dirdat/e1,extract ext1
# 配置 pump 进程 pump1
edit param pump1
# 写入以下信息
extract pump1
passthru
userid db2inst1,password db2inst1
rmthost 10.10.178.109 mgrport 7809
rmttrail ./dirdat/e1
TABLE ODS.T_*;
# 分别将本地 tail 文件和目标端的 trail 文件绑定到 extract 进程
add extract pump1,exttrailsource ./dirdat/e1
add rmttrail ./dirdat/e1,extract pump1
```

2. 在 Kafka 端执行以下命令

```plain
# 进入 ogg 命令行
./ggsci
# 配置同步进程 replicat
edit param rep1
# 写入以下内容
REPLICAT rep1
targetdb libfile libggjava.so set property=./dirprm/kafka.props
REPORTCOUNT EVERY 1 MINUTES, RATE
GROUPTRANSOPS 10000
map ODS.T_*, target ODS.T_*;
# 添加 trail 文件到 replicate 进程
add replicat rep1 exttrail ./dirdat/e1
```

启动顺序按照源 mgr —— 目标 mgr—— 源 ext1 —— 源 pump1 ——目标 rep1 来完成
