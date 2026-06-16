import{M as e,f as t,m as n}from"./vendor~app~CodeEditor~SearchBox~index.html~index.html~index.html~404.html~摘要~对象初~i0gft6pz-B1nAx4dK.js";import{Jr as r}from"./common-BsC7Bxmr.js";var i=JSON.parse(`{"path":"/article/914r2lj6/","title":"ogg同步db2至kafka | Blog","lang":"zh-CN","frontmatter":{"title":"ogg同步db2至kafka","tags":["work"],"createTime":"2026/06/16 20:51:29","permalink":"/article/914r2lj6/","categories":["work"],"description":"准备环境 OGG for DB2 下载地址 （Oracle GoldenGate 12.3.0.1.2 for DB2 9.7 on Linux x86-64）下载完成后直接解压到 DB2 的服务器上 OGG for BigData 下载地址 （Oracle GoldenGate for Big Data 21.4.0.0.0 on Linux x86...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"ogg同步db2至kafka\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2026-06-16T13:56:32.000Z\\",\\"author\\":[]}"],["meta",{"property":"og:url","content":"https://upcloudrabbit.github.io/blog/blog/article/914r2lj6/"}],["meta",{"property":"og:site_name","content":"upcloudrabbit blog"}],["meta",{"property":"og:title","content":"ogg同步db2至kafka"}],["meta",{"property":"og:description","content":"准备环境 OGG for DB2 下载地址 （Oracle GoldenGate 12.3.0.1.2 for DB2 9.7 on Linux x86-64）下载完成后直接解压到 DB2 的服务器上 OGG for BigData 下载地址 （Oracle GoldenGate for Big Data 21.4.0.0.0 on Linux x86..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-06-16T13:56:32.000Z"}],["meta",{"property":"article:tag","content":"work"}],["meta",{"property":"article:modified_time","content":"2026-06-16T13:56:32.000Z"}]]},"readingTime":{"minutes":4.09,"words":1226},"git":{"createdTime":1781618192000,"updatedTime":1781618192000,"contributors":[{"name":"haochuliu","username":"haochuliu","email":"1814876440@qq.com","commits":1,"avatar":"https://avatars.githubusercontent.com/haochuliu?v=4","url":"https://github.com/haochuliu"}]},"autoDesc":true,"filePathRelative":"work/ogg同步db2至kafka.md","headers":[],"categoryList":[{"id":"67e92c","sort":10007,"name":"work"}]}`),a={name:`ogg同步db2至kafka.md`};function o(r,i,a,o,s,c){return e(),t(`div`,null,[...i[0]||=[n(`<h1 id="准备环境" tabindex="-1"><a class="header-anchor" href="#准备环境"><span>准备环境</span></a></h1><ul><li>OGG for DB2 <a href="https://www.oracle.com/middleware/technologies/goldengate-downloads.html" target="_blank" rel="noopener noreferrer">下载地址</a> （Oracle GoldenGate 12.3.0.1.2 for DB2 9.7 on Linux x86-64）下载完成后直接解压到 DB2 的服务器上</li><li>OGG for BigData <a href="https://www.oracle.com/middleware/technologies/goldengate-downloads.html" target="_blank" rel="noopener noreferrer">下载地址</a> （Oracle GoldenGate for Big Data 21.4.0.0.0 on Linux x86-64）下载完成后直接解压到 kafka 服务器上</li><li>DB2 需要开启归档日志</li><li>首先验证一下是否开启了归档模式 <code>db2 get db cfg for umpayods | grep LOGARCHMETH1</code> （这个 umpayods 指代连接的数据库名）结果中有输出则代表归档模式已经开启，否则需要手动开启： <ol><li>首先登录一下 <code>dblogin userid db2inst1 password db2inst1</code></li><li>然后开启 <code>db2 update db cfg DB_NAME using LOGRETAIN ON</code> 或者 <code>db2 update db cfg DB_NAME using LOGARCHMETH1 “DISK:/opt/DB2/arch&quot;</code></li><li>然后重启数据库 <code>db2stop force &amp;&amp; db2start</code></li><li>再运行命令查看一下 <code>db2 get db cfg for umpayods | grep LOGARCHMETH1</code></li></ol></li></ul><h1 id="全量同步" tabindex="-1"><a class="header-anchor" href="#全量同步"><span>全量同步</span></a></h1><p>这里的 zookeeper 单独部署的 3.7.1 版本 kafka 部署的 2.12 - 2.4.1 版本</p><ol><li>记录一下开始同步的日期，比如 2023-04-17</li><li>首先配置 DB2，切换至对应同步的 DB2 用户 db2inst1 （有对应的权限即可）</li><li>依次执行以下命令</li></ol><div class="language-plain line-numbers-mode" data-highlighter="shiki" data-ext="plain" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-plain"><span class="line"><span># 配置环境变量</span></span>
<span class="line"><span>vim /etc/profile</span></span>
<span class="line"><span># 末尾添加</span></span>
<span class="line"><span>export LD_LIBRARY_PATH=/opt/IBM/db2/V9.7/lib64:$LD_LIBRARY_PATH</span></span>
<span class="line"><span># 重新加载环境变量</span></span>
<span class="line"><span>source /etc/profile</span></span>
<span class="line"><span># 进入 ogg</span></span>
<span class="line"><span>./ggsci</span></span>
<span class="line"><span># 初始化一下</span></span>
<span class="line"><span>create subdirs</span></span>
<span class="line"><span># 配置管理器 mgr</span></span>
<span class="line"><span>edit param mgr</span></span>
<span class="line"><span># 写入以下信息</span></span>
<span class="line"><span>PORT 7809</span></span>
<span class="line"><span>DYNAMICPORTLIST 7810-7909</span></span>
<span class="line"><span>AUTORESTART EXTRACT *,RETRIES 5,WAITMINUTES 3</span></span>
<span class="line"><span>PURGEOLDEXTRACTS ./dirdat/*,usecheckpoints, minkeepdays 3</span></span>
<span class="line"><span>ACCESSRULE, PROG *, IPADDR *, ALLOW</span></span>
<span class="line"><span># PORT 即 mgr 的默认监听端口；DYNAMICPORTLIST 动态端口列表，当指定的 mgr 端口不可用时，会在这个端口列表中选择一个，最大指定范围为 256 个；AUTORESTART 重启参数设置表示重启所有 EXTRACT 进程，最多 5 次，每次间隔3分钟；PURGEOLDEXTRACTS 即 TRAIL 文件的定期清理</span></span>
<span class="line"><span># 配置抽取进程</span></span>
<span class="line"><span>edit param ext0</span></span>
<span class="line"><span># 写入以下信息</span></span>
<span class="line"><span>EXTRACT ext0</span></span>
<span class="line"><span>userid db2inst1,password db2inst1</span></span>
<span class="line"><span>rmthost 10.10.178.109,mgrport 7809</span></span>
<span class="line"><span>rmttask replicat,group rep0</span></span>
<span class="line"><span>TRANLOGOPTIONS ALLOWTABLECOMPRESSION</span></span>
<span class="line"><span>SOURCEDB umpayods</span></span>
<span class="line"><span>TABLE ODS.T_*;</span></span>
<span class="line"><span># rmthost 指定远程 kafka 端所部署的 ogg 机器的端口。TABLE 指定同步的表，可以使用通配符，tableexclude 可以加在 TABLE 前表示不想同步的表，依旧可以使用通配符</span></span>
<span class="line"><span>add extract ext0 ,sourceistable</span></span>
<span class="line"><span># sourceistable 表示全表抽取</span></span>
<span class="line"><span># 启动 mgr</span></span>
<span class="line"><span>start mgr</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li>开始配置 kafka 端</li></ol><div class="language-plain line-numbers-mode" data-highlighter="shiki" data-ext="plain" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-plain"><span class="line"><span># 配置环境变量，末尾添加</span></span>
<span class="line"><span>JAVA_HOME=/opt/softs/jdk8</span></span>
<span class="line"><span>PATH=$PATH:$JAVA_HOME/bin</span></span>
<span class="line"><span>export JAVA_HOME</span></span>
<span class="line"><span>export PATH</span></span>
<span class="line"><span>export KAFKA_HOME=/usr/mpsp/softs/kafka_2.12-2.6.3</span></span>
<span class="line"><span>export OGG_HOME=/usr/mpsp/softs/ogg</span></span>
<span class="line"><span>export LD_LIBRARY_PATH=$KAFKA_HOME/libs:$JAVA_HOME/jre/lib/amd64/libjava.so:$JAVA_HOME/jre/lib/amd64:$JAVA_HOME/jre/lib/amd64/server:$JAVA_HOME/jre/lib/amd64/libjsig.so:$JAVA_HOME/jre/lib/amd64/server/libjvm.so:$OGG_HOME/lib</span></span>
<span class="line"><span>export PATH=$PATH:$OGG_HOME:$OGG_HOME/bin</span></span>
<span class="line"><span>export CLASSPATH=$KAFKA_HOME/libs:$JAVA_HOME/jre/lib/ext:$JAVA_HOME/lib/tools.jar</span></span>
<span class="line"><span># 进入 ogg</span></span>
<span class="line"><span>./ggsci</span></span>
<span class="line"><span># 初始化</span></span>
<span class="line"><span>create subdirs</span></span>
<span class="line"><span># 配置管理器 mgr</span></span>
<span class="line"><span>edit param mgr</span></span>
<span class="line"><span># 写入以下信息</span></span>
<span class="line"><span>PORT 7809</span></span>
<span class="line"><span>DYNAMICPORTLIST 7810-7909</span></span>
<span class="line"><span>AUTORESTART EXTRACT *,RETRIES 5,WAITMINUTES 3</span></span>
<span class="line"><span>PURGEOLDEXTRACTS ./dirdat/*,usecheckpoints, minkeepdays 3</span></span>
<span class="line"><span>ACCESSRULE, PROG *, IPADDR *, ALLOW</span></span>
<span class="line"><span># 配置 replicate 进程</span></span>
<span class="line"><span>edit params rep0</span></span>
<span class="line"><span># 写入以下信息</span></span>
<span class="line"><span>REPLICAT rep0</span></span>
<span class="line"><span>TARGETDB LIBFILE libggjava.so SET property=./dirprm/kafka.props</span></span>
<span class="line"><span>REPLACEBADCHAR SKIP</span></span>
<span class="line"><span>SOURCECHARSET OVERRIDE GBK</span></span>
<span class="line"><span>map ODS.T_*, target ODS.T_*;</span></span>
<span class="line"><span>#　SPECIALRUN 将　replicat　设定为一次性运行，不需要checkpoint，END RUNTIME 当　load　完成后终结　replicat</span></span>
<span class="line"><span># 添加进程</span></span>
<span class="line"><span>add replicat rep0 ,specialrun</span></span>
<span class="line"><span># 启动管理器</span></span>
<span class="line"><span>start mgr</span></span>
<span class="line"><span># 退出 ogg</span></span>
<span class="line"><span>quit</span></span>
<span class="line"><span># 配置 kakfa</span></span>
<span class="line"><span>vim ./dirprm/kafka.props</span></span>
<span class="line"><span># 写入以下信息（虽然是 kafka 文件，但是 ogg 读取是不支持注释的，必须去除 # 部分）</span></span>
<span class="line"><span>gg.handlerlist=kafkahandler</span></span>
<span class="line"><span>gg.handler.kafkahandler.type=kafka</span></span>
<span class="line"><span>gg.handler.kafkahandler.KafkaProducerConfigFile=custom_kafka_producer.properties</span></span>
<span class="line"><span>gg.handler.kafkahandler.topicMappingTemplate=\${tableName}</span></span>
<span class="line"><span>gg.handler.kafkahandler.format=json</span></span>
<span class="line"><span>gg.handler.kafkahandler.mode=op</span></span>
<span class="line"><span>gg.classpath=dirprm/:/usr/mpsp/softs/kafka_2.12-2.6.3/libs/*:/usr/mpsp/softs/ogg/:/usr/mpsp/softs/ogg/lib/*</span></span>
<span class="line"><span></span></span>
<span class="line"><span># gg.handler.kafkahandler.format：传输文件的格式，支持json，xml，avro_op 等</span></span>
<span class="line"><span># gg.handler.kafkahandler.mode：传输模式，op为一次SQL传输一次，tx为一次事务传输一次</span></span>
<span class="line"><span># gg.classpath：须指定相应的lib路径</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 再创建 kafka 配置文件</span></span>
<span class="line"><span>vim ./dirprm/custom_kafka_producer.properties</span></span>
<span class="line"><span>bootstrap.servers=10.10.178.109:19092</span></span>
<span class="line"><span>acks=1</span></span>
<span class="line"><span>compression.type=gzip</span></span>
<span class="line"><span>reconnect.backoff.ms=1000</span></span>
<span class="line"><span>value.serializer=org.apache.kafka.common.serialization.ByteArraySerializer</span></span>
<span class="line"><span>key.serializer=org.apache.kafka.common.serialization.ByteArraySerializer</span></span>
<span class="line"><span>batch.size=102400</span></span>
<span class="line"><span>linger.ms=10000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5"><li>在 DB2 端启动同步进程，观察运行情况 <code>start ext0</code>，查看 ext0 运行日志 <code>view report ext0</code>，然后在Kafka 端查看运行日志 <code>view report rep0</code></li><li>查看 kafka 中的数据</li></ol><div class="language-plain line-numbers-mode" data-highlighter="shiki" data-ext="plain" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-plain"><span class="line"><span># 查看全部队列，每张表一个主题</span></span>
<span class="line"><span>./kafka-topics.sh --list --bootstrap-server 10.10.178.109:19092</span></span>
<span class="line"><span># 消费一个队列查看情况</span></span>
<span class="line"><span>./kafka-console-consumer.sh --bootstrap-server 10.10.178.109:19092 --topic T_TABLE_DEFINE --from-beginning</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="增量同步" tabindex="-1"><a class="header-anchor" href="#增量同步"><span>增量同步</span></a></h1><ol><li>在 DB2 端执行以下命令</li></ol><div class="language-plain line-numbers-mode" data-highlighter="shiki" data-ext="plain" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-plain"><span class="line"><span># 进入 ogg 命令行</span></span>
<span class="line"><span>./ggsci</span></span>
<span class="line"><span># 配置抽取进程 ext1</span></span>
<span class="line"><span>edit params ext1</span></span>
<span class="line"><span># 写入以下信息</span></span>
<span class="line"><span>EXTRACT ext1</span></span>
<span class="line"><span>userid db2inst1,password db2inst1</span></span>
<span class="line"><span>SOURCEDB umpayods</span></span>
<span class="line"><span>TRANLOGOPTIONS ALLOWTABLECOMPRESSION</span></span>
<span class="line"><span>EXTTRAIL ./dirdat/e1</span></span>
<span class="line"><span>TABLE ODS.T_*;</span></span>
<span class="line"><span># 添加 extract 进程并指定同步开始时间，这个可以是 now 或者时间或者 lsn 号</span></span>
<span class="line"><span>add extract ext1,tranlog,begin 2023-04-16 17:10</span></span>
<span class="line"><span># 添加 trail 文件的定义与 extract 进程绑定</span></span>
<span class="line"><span>add exttrail ./dirdat/e1,extract ext1</span></span>
<span class="line"><span># 配置 pump 进程 pump1</span></span>
<span class="line"><span>edit param pump1</span></span>
<span class="line"><span># 写入以下信息</span></span>
<span class="line"><span>extract pump1</span></span>
<span class="line"><span>passthru</span></span>
<span class="line"><span>userid db2inst1,password db2inst1</span></span>
<span class="line"><span>rmthost 10.10.178.109 mgrport 7809</span></span>
<span class="line"><span>rmttrail ./dirdat/e1</span></span>
<span class="line"><span>TABLE ODS.T_*;</span></span>
<span class="line"><span># 分别将本地 tail 文件和目标端的 trail 文件绑定到 extract 进程</span></span>
<span class="line"><span>add extract pump1,exttrailsource ./dirdat/e1</span></span>
<span class="line"><span>add rmttrail ./dirdat/e1,extract pump1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>在 Kafka 端执行以下命令</li></ol><div class="language-plain line-numbers-mode" data-highlighter="shiki" data-ext="plain" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-plain"><span class="line"><span># 进入 ogg 命令行</span></span>
<span class="line"><span>./ggsci</span></span>
<span class="line"><span># 配置同步进程 replicat</span></span>
<span class="line"><span>edit param rep1</span></span>
<span class="line"><span># 写入以下内容</span></span>
<span class="line"><span>REPLICAT rep1</span></span>
<span class="line"><span>targetdb libfile libggjava.so set property=./dirprm/kafka.props</span></span>
<span class="line"><span>REPORTCOUNT EVERY 1 MINUTES, RATE</span></span>
<span class="line"><span>GROUPTRANSOPS 10000</span></span>
<span class="line"><span>map ODS.T_*, target ODS.T_*;</span></span>
<span class="line"><span># 添加 trail 文件到 replicate 进程</span></span>
<span class="line"><span>add replicat rep1 exttrail ./dirdat/e1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动顺序按照源 mgr —— 目标 mgr—— 源 ext1 —— 源 pump1 ——目标 rep1 来完成</p>`,16)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};