---
title: os
tags:
  - os
createTime: 2026/06/16 20:51:29
permalink: /article/mkfjikzf/
categories:
  - os
---

# os

Linux 发行版本国内源：[清华源](https://mirrors.tuna.tsinghua.edu.cn/)、[阿里源](https://developer.aliyun.com/mirror/)、[腾讯源](https://mirrors.tencent.com/)、[华为源](https://mirrors.huaweicloud.com/home)、[网易源](http://mirrors.163.com/)、[中科大源](https://mirrors.ustc.edu.cn/)

# Linux 安装 Python3

* 依次运行以下命令安装

```bash
# 安装 python3 需要的依赖，当 python 版本大于 3.10 时需要添加 zip* 
yum -y install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gcc make libffi-devel zip*
# 首先需要安装 openssl-1.1.1
wget http://www.openssl.org/source/openssl-1.1.1.tar.gz
tar -xf openssl-1.1.1.tar.gz && cd openssl-1.1.1 && ./config --prefix=/usr/local/openssl shared zlib
mkdir -p /usr/local/openssl make && make install
# 设置环境变量
echo "export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/openssl/lib" >> /etc/profile && source /etc/profile
# 下载 python 安装包
wget https://www.python.org/ftp/python/3.7.1/Python-3.7.1.tar.xz
# 解压至指定目录
tar -Jxvf Python-3.7.1.tar.xz -C /opt/softs/
# 进入目录开始编译
cd /opt/softs/Python-3.7.1
# 这里可以开启编译优化 --enable-shared --enable-optimizations 但是需要 gcc 8.1.0 以上才行
./configure prefix=/usr/local/python3 --with-openssl=/usr/local/openssl
make && make install
# 建立软链或者也可以配置环境变量
ln -s /usr/local/python3/bin/python3.7 /usr/local/bin/python3
ln -s /usr/local/python3/bin/pip3.7 /usr/local/bin/pip3
```

* 某些包的安装可能需要升级 pip

```bash
# 在线安装
pip3 install --upgrade pip3
# 离线安装需要提前下载对应的 pip包
pip3 download pip -i http://mirrors.aliyun.com/pypi/simple --trusted-host mirrors.aliyun.com 
# 然后再拷贝下载的安装包去要升级的机器
pip3 install --upgrade pip-23.0-py3-none-any.whl
```

* pip 离线安装需要的依赖

```bash
# 首先需要找一台能联网的机器下载依赖（对应的 python 大版本必须一致）首先固定依赖信息
pip3 freeze > requirements.txt
# 开始下载到本地（建一个文件夹方便打包）
pip3 download -i https://pypi.tuna.tsinghua.edu.cn/simple -d /opt/packages/packages -r requirements.txt
# 打包压缩一下（打完的包为第一个参数，后面的是需要打包压缩的文件）
tar -zcf tmp.tar.gz packages requirements.txt
# 解压后执行批量安装
pip3 install --no-index --find-links=/opt/packages/packages/ -r requirements.txt
# 如果之前没有导出 requirements.txt 文件那就指定文件夹即可
pip3 install /path/to/folder/*.whl
```

# Linux 安装 Miniconda3，修改源

* 去 [清华源](https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/Miniconda3-latest-Linux-x86_64.sh) 下载 `wget https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/Miniconda3-latest-Linux-x86_64.sh --no-check-certificate`
* 赋予可执行权限后直接安装 <code>chmod +x Miniconda3-latest-Linux-x86_64.sh && bash Miniconda3-latest-Linux-x86_64.sh</code>
* 刷新环境变量 `source /root/.bashrc`
* 生成配置文件 `conda config --set show_channel_urls yes`
* 配置清华源 `vim ~/.condarc`

```yaml
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch-lts: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
ssl_verify: false
```

* 清除之前的缓存源 `conda clean -i`
* 设置默认的环境（可选）`echo "conda activate xxx" >> ~/.bashrc`
* 下载包时指定清华源并关闭 SSL 检查 `pip install openpyxl --trusted-host pypi.tuna.tsinghua.edu.cn -i https://pypi.tuna.tsinghua.edu.cn/simple`

# TCP 连接快速回收设置

`vim /etc/sysctl.conf`

```properties

net.ipv4.ip_forward = 0

# Controls source route verification
net.ipv4.conf.default.rp_filter = 1

# Do not accept source routing
net.ipv4.conf.default.accept_source_route = 0

# Controls the System Request debugging functionality of the kernel
kernel.sysrq = 0

# Controls whether core dumps will append the PID to the core filename.
# Useful for debugging multi-threaded applications.
kernel.core_uses_pid = 1

# Controls the use of TCP syncookies
net.ipv4.tcp_syncookies = 1

# Controls the default maxmimum size of a mesage queue
kernel.msgmnb = 65536

# Controls the maximum size of a message, in bytes
kernel.msgmax = 65536

# Controls the maximum shared segment size, in bytes
kernel.shmmax = 68719476736

# Controls the maximum number of shared memory segments, in pages
kernel.shmall = 4294967296
# tcp 头部是否携带时间戳（可防止 ddos 攻击）0 为关闭，1 为开启。开启需要占用一定网络性能
# 该参数开启 net.ipv4.tcp_tw_reuse 才能开启否则无效，而且对端也要开启此参数否则无效
net.ipv4.tcp_timestamps = 1
# 处于 TIME_WAIT 状态的连接是否可以复用（作为客户端发起方使用）
net.ipv4.tcp_tw_reuse = 1
# 该参数在 4.10内核已不在使用，4.12版本的内核相关代码正式删除
# 在 NAT 环境下会导致 TCP 连接错误，原因为：PAWS 原则（RFC1323）
# TCP存在一种机制，per-host 会缓存保留已建立连接的最新一个 timestamp，而该 timestamp 要遵循 PAWS 的机制，具体作用就是如果下次接收的数据报文的时间戳早于记录的最后一个报文的时间戳，则直接丢弃该报文
# 当在 NAT 环境中，一般指多台服务器出公网都是由 NAT 地址转换的形式，则很难保证后端服务器时间是同步的，而引起的时间戳错乱，导致连接的数据报被 drop
# net.ipv4.tcp_tw_recycle = 1
# tcp 可用服务器端口范围
net.ipv4.ip_local_port_range = 10000 65000
# fin 包超时时间（单位：秒）
net.ipv4.tcp_fin_timeout = 3
# 会话发起存活探测时间（单位：秒）
net.ipv4.tcp_keepalive_time = 10
# 总共发起探测次数
net.ipv4.tcp_keepalive_intvl = 3
net.ipv4.tcp_keepalive_probes = 2
# 该值要设置的比 net.ipv4.ip_local_port_range 小，便于快速回收 TIME_WAIT 连接
# 内核持有的状态为TIME_WAIT的最大连接数。如果超过这个数字，新的TIME_WAIT的连接会被立即销毁，并打印警告
net.ipv4.tcp_max_tw_buckets = 20000

net.core.netdev_max_backlog = 2048
net.core.somaxconn = 2048
```

修改完成后执行命令生效 `sysctl -p`

# Linux 普通用户无法 sudo

编辑 `/etc/sudoers`复制 root 改为当前用户名

# Linux 桌面启动关闭自动休眠

`sudo vim /etc/systemd/logind.conf`修改`#HandleLidSwitch=suspend`为`HandleLidSwitch=ignore`然后重启
