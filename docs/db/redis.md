---
title: redis
tags:
  - redis
  - database
createTime: 2025/02/25 21:39:12
permalink: /article/y8calcxq/
---
# 大 key 统计与删除
redis 中的大 key 使用 keys * 获取时会阻塞整个 redis 应用，不推荐使用。如果要获取 redis 中的 key 以下提供两种方案

1. 拷贝 rdb 文件后使用 redis-rdb-tools 工具直接分析或者转成 csv 导入数据库后分析（rdb 中的文件不是实时的）

```bash
# rdb 转 csv
rdb -c memory /mnt/data/redis/dump.rdb >  /mnt/data/redis/memory.csv
# rdb 转 json
rdb -c json /mnt/data/redis/dump.rdb >  /mnt/data/redis/du.json
```

2. 使用 scan 命令导出 key，该命令有 3 个参数，起始下标、匹配表达式、本次获取数量（类似 SQL 语句中的分页）[详见](https://www.redis.com.cn/commands/scan.html) （该方案需要编写脚本批量执行导出，同时如果遍历 key 期间有 增删 也会导致最终的导出 key 不是实时的）

当删除 key 的 value 非常大时，如果 value 是简单类型可以用 del 直接删除， 如果 value 是集合或者字典类型时可以使用 unlink 命令删除（该命令是异步的），但是需要 redis 版本大于 4.0 。如果 redis 版本不满足那就只能编写脚本使用 lpop 这样的命令去一条条删除集合中的值，当集合为空时再删除 key

# 查看 key 类型
`type key`

