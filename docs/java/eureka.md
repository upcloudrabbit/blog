---
title: eureka
tags:
  - java
createTime: 2026/06/16 20:51:29
permalink: /article/b0oqethx/
categories:
  - java
---

# eureka

# Eureka 主动下线服务
有时候基于 eureka 自身的服务注册规则，会对一些频繁连接不上的服务进行主动下线（可能是由于应用的频繁启停）这时候应用会一直是 OUT_OF_SERVICE 状态，需要手动发送命令让其上线（首先应用要处于上线状态）多个 eureka 情况下只用向其中一台发送请求即可

+ 查看所有应用状态

```bash
# @ 符号前面分别代表用户名和密码，可以直接复制应用内部的配置文件
curl http://root:root@172.17.23.35:8004/eureka/apps
```

+ 上线应用（必须发送 DELETE 方法）

```bash
# 这里必须发送 DELETE 请求。需要结合 查看应用状态的命令
# 第一级是注册到 eureka 的应用名称，第二级是 eureka 分配给应用的实例 ID 用于区分应用的多个节点 
curl -X DELETE "http://root:root@172.17.23.35:8004/eureka/apps/HPAY-TRADE-CORE/pbpp17-vm23-35:hpay-trade-core:8001/status?value=UP"
```

+ 下线应用（必须发送 PUT 方法）

```bash
# 这里必须发送 PUT 请求。需要结合 查看应用状态的命令
# 第一级是注册到 eureka 的应用名称，第二级是 eureka 分配给应用的实例 ID 用于区分应用的多个节点 
curl -X PUT "http://root:root@172.17.23.35:8004/eureka/apps/HPAY-TRADE-CORE/pbpp17-vm23-35:hpay-trade-core:8001/status?value=OUT_OF_SERVICE"
```

# Eureka 自我注册
+ eureka 自身不具有鉴权的能力，主要是依赖 spring-security 来实现的鉴权。如果要去除 eureka 的权限认证，那么只需去除 pom 中依赖的 spring-security 模块即可
+ 有些时候，部分应用间的网络延迟较大，部分应用会自动的进入 OUT_OF_SERVICE 状态，这时重启应用是不管用的，只能手动的使用命令重新让它上线。这里是由于 eureka 的自我保护机制发生效果，可以关闭或者提高心跳间隔来避免此类问题。
