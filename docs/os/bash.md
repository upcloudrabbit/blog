---
title: bash
tags:
  - bash
  - os
createTime: 2025/03/03 21:33:39
permalink: /article/yauuumex/
---
# 统计接口日志平均耗时
```bash
# 参数解析
# xxx 是文件名
# grep xxx 是过滤出指定关键字
# -F 指定分割字符，默认空格
# $7 是分割后的时间下标，从 1 开始算
# NR 是关键字，代表总行数
cat xxx | grep xxx | awk -F "," '{ sum += $7; } END { print "sum = " sum; print "average = " sum/NR }'
```

# telnet 远程连接 redis 集群
+ 随便找台节点 telnet ip port
+ 登陆后(可能需要账号密码) 输入 info 获取 master 节点
+ quit 退出
+ 再次登录 master 节点(<font style="color:#E8323C;">记得选择数据库</font>)

# 文件隐藏属性
+ lsattr 用于展示文件的隐藏属性
+ chattr 用于修改文件的隐藏属性

```bash
# 显示文件隐藏属性
lsattr fileName
# -R 表示可以修改整个文件夹下的隐藏属性 - 表示去除属性 + 表示添加属性
charrt [-RVf] [-+=aAcCdDeijsStTu] aa.txt 
# 例如去除文件的不可删除属性 i
charrt -i aa.txt 
```

文件常见隐藏属性：

| 属性选项 |功能|
|------| - |
| i    |如果对文件设置 i 属性，那么不允许对文件进行删除、改名，也不能添加和修改数据；<br/>如果对目录设置 i 属性，那么只能修改目录下文件中的数据，但不允许建立和删除文件； |
| a    |如果对文件设置 a 属性，那么只能在文件中増加数据，但是不能删除和修改数据；如果对目录设置 a 属性，那么只允许在目录中建立和修改文件，但是不允许删除文件；|
| u    |设置此属性的文件或目录，在删除时，其内容会被保存，以保证后期能够恢复，常用来防止意外删除文件或目录。|
| s    |和 u 相反，删除文件或目录时，会被彻底删除（直接从硬盘上删除，然后用 0 填充所占用的区域），不可恢复。|
| c    | 允许这个文件能被内核自动压缩/解压 |
| d    | 在进行文件系统备份时，dump程序将忽略这个文件 |
| S    | 一旦应用程序对这个文件执行了写操作，使系统立刻把修改的结果写到磁盘 |


# find
## 根据文件名查找
```bash
# 查找文件忽略大小写
find / -iname "test"
# 只查找目录
find / -type d -name "test"
# 只查找文件
find / -type f -name "test"
```

## 根据权限查找
```bash
# 查找拥有 777 权限的文件，这里的第一位表示隐藏权限 SUID 4、SGID 2、SBIT 1
find / -perm 0777
# 查找不含 777 权限的文件
find / ! -perm 0777
# 查找空文件
find / -type f -empty
# 查找空目录
find / -type d -empty
```

## 基于所有者和组查找
```bash
# 查找 root 用户文件
find / -user root
# 查找 root 用户组文件
find / -group root
```

## 根据日期和时间查找
```bash
# 参数包含 atime ctime mtime 分别对应 最近一次访问文件时间（单位：天）、
# 文件状态改变时间（权限、用户、组等等变更）、最近一次修改文件内容时间
# 以下示例均以 mtime 给出
# 假如今天是 10-10 则以下命令表示 最近一次修改日期在 10-07 到 10-08 之间的文件
find / -mtime 3
# 假如今天是 10-10 则以下命令表示 最近一次修改日期在 10-07 到 现在的文件
find / -mtime -3
# 假如今天是 10-10 则以下命令表示 最近一次修改日期在 从文件创建以来到 10-07 的文件
find / -mtime +3
# amin cmin mmin 单位变更为分钟
```

## 根据文件大小查找
```bash
# 寻找文件并执行之后的指令（这里不可使用指令，例如：ll）
find /usr/bin /usr/sbin -perm /7000 -exec ls -l {} \;
# 查找等于 50MB 的文件
find / -size 50M
# 查找大于 50MB 的文件
find / -size +50M
# 查找小于 50MB 的文件
find / -size -50M
# 查找在 50MB - 100MB 之间的文件
find / -size +50M -size -100M
```

# 字符大小写转换
```bash
# 小写转换
echo "AAAAA" | awk '{print tolower($0)}'
# 大写转换
echo "aaaaa" | awk '{print toupper($0)}'
```

# windows 下编辑的 bash 在 linux 上运行失败
主要原因是 windows 和 linux 的换行符不一致导致的（Windos 下是 \r\n，Linux 下是 \n），运行以下命令可直接替换换行符`sed -i -e 's/\r$//' xxx`

# 清空指定目录下的文件内容（多用于日志文件）
```bash
# 清空指定路径下的全部日志文件内容（不清除日志文件本身）
find /路径 -type f -exec sh -c '> "{}"' \;
# 删除指定路径下的文件夹
find /路径 -type d -name '文件夹名称' -exec sh -c 'rm -rf "{}"' \;
```

# 文件同步脚本
命名为 `xsync`，具体实现参照 `sync` 命令（方便的将指定目录及其文件同步到其它服务器）最好添加到环境变量中 `ln -s xxx/xync /usr/local/bin`（该命令将会以源机器目录为准，同步目录一致，删除的文件也会同步删除）

```bash
#!/bin/bash
if [ $# -lt 1 ]
then
    echo Not Enough Arguement!
    exit;
fi
for host in hadoop14 hadoop15 hadoop16
do
    echo ================== $host ==================
    for file in $@
    do
        if [ -e $file ]
        then
            pdir=$(cd -P $(dirname $file); pwd)
            fname=$(basename $file)
            ssh $host "mkdir -p $pdir"
            rsync -qazrpogt $pdir/$fname $host:$pdir
        else
            echo $file does not exists!
        fi
    done
done
```

# 配置免密登录
首先需要在本机上生成公私钥，可使用 linux 自带的 ssh-keygen 工具生成`ssh-keygen -t rsa`（连敲三次回车），然后开始分发密钥达成免密登录 `ssh-copy-id username@host`（默认与当前用户一致）需要输入目的机器的密码。（<font style="color:#DF2A3F;">最好对自己也做一次</font>）

如果没有目标机器用户的密码则可以按照以下操作完成

1. 首先执行命令输出公钥 `cat ~/.ssh/id_rsa.pub`
2. 在目标机器的目标用户目录下创建文件 `vim ~/.ssh/authorized_keys`
3. 将步骤 1 的结果写入到步骤 2 创建的文件保存即可
4. 首次登录需要输入 yes

# curl 命令使用
curl 命令详细参数 [文档](https://wangchujiang.com/linux-command/c/curl.html)

1. 最多等待 10 秒就超时`curl -s -k -m 10 "https://www.baidu.com"`
2. 使用代理发送请求 `curl -x http://127.0.0.1:9100 "https://www.google.com"`
3. 只返回状态码 `curl -o /dev/null -w '%{http_code}' -s -k -m 10 "https://www.baidu.com"`
4. 发送请求时自定义请求头`curl -X POST -H "Content-Type: application/json" -d '{"name": "John", "message": "This is a \"test\" message."}' "https://www.baidu.com"`
5. 下载文件 `curl http://example.com/test.iso -o filename.iso --progress`<font style="background-color:rgb(246, 248, 250);">（-O 则直接使用远程服务器的文件名）</font>
6. 探测存活脚本

```bash
success_prefix='{"state":-1}'
result=$(curl -s -k -m 10 "http://www.baidu.com")
if [[ $result == $success_prefix* ]]; then
  echo "url is normal"
else
  echo "url is error"
fi
```

# 服务器 TCP 连接情况查询
```bash
# 查看状态为 TIME_WAIT 的 TCP 连接
netstat -tan | grep TIME_WAIT
# 统计 TCP 各种状态的连接数
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(i in S) print i, S[i]}'
# 统计监听端口 8080 的应用所有连接状态（如果只想查看某一种状态可以添加 -o state established）
ss -t -a 'sport = :8080 or dport = :8080' | awk '{print $1}' | sort | uniq -c
# 列出监听指定端口的所有 TCP 状态
ss -t -a '( sport = :8080 or dport = :8080 )'
# 各类情况统计
netstat -n | awk '/^tcp/ {++state[$NF]} END {for(key in state) print key,"\t",state[key]}'
```

# 删除注释行
```bash
# 删除 # 开头的整行（删除注释行）
sed -i '/^#/d' filename
# 以下命令会同时删除 # 开头的整行和空白整行（删除注释和空白行）
sed -i '/^#/d;/^$/d' filename
# 以下命令将删除文件所有行开头中的 # 以及后面的空白字符（取消注释）
sed -i 's/^#\s*//' filename
```

# 根据 PID 查看进程监听的端口
可以使用 ss 或者 netstat 命令

```bash
netstat -tulpn | grep <PID>
ss -lptn | grep <PID>
```

# 查看指定服务端口是否连通
可以使用 telnet 或者 nc 命令

```bash
# telnet 测试的端口必需有服务在监听
telnet ip port 
# -w 表示超时时间（单位秒）
nc -vzw5 ip port 
# 如果目标服务端口没有应用监听端口则可以使用 nc 来启动监听端口服务
nc -lkp port
```

# 服务器通过开放的端口实现文件传输
可以使用 nc 命令 或者 python 自带的服务

```bash
# 首先需要在接受方开启监听 fileName 需要自定义名称（建议与发送方保持一致）
# 每次只能接收一个文件（用于简单传输小文件）
nc -lp port > fileName
# 然后在发送方传输文件（传输完成后需要手动 ctrl c 退出）
nc -nv ip port < fileName

# 可以通过 python 内置的 http 服务启动文件服务（不支持文件上传）
# python2 
python -m SimpleHTTPServer port
# python3
python -m http.server port
# 可通过 wget 命令进行文件下载
```

# 统一的将指定文件夹下的文件/文件夹设置属性
可以通过 find 命令和 exec 配合实现

```bash
# 将当前文件夹下的所有文件夹都设置为 755
find . -type d -exec chmod 755 '{}' \;
# 将当前文件夹下的所有文件都设置为 777
find . -exec chmod 777 '{}' \;
```

