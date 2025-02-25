---
title: mongodb
tags:
  - mongodb
  - database
createTime: 2025/02/25 21:38:22
permalink: /article/tm7k59or/
---
[官方文档](https://www.mongodb.com/docs/manual/)

# $lookup 中的 localField 不能使用 $
$lookup 一般用于集合之间的连接查询，其语法如下

```json
{
   $lookup:
     {
       from: "要连接的集合",
       localField: "当前文档的字段",
       foreignField: "要连接集合的主键",
       as: "输出字段名称, 这里将会输出为数组类型"
     }
}
```

但是如果当前文档要进行连接的字段类型是 DBRef, 那么就不能在 localField 直接写 a.$id, 会出现以下错误

```json
assert: command failed:
{ "ok" : 0, "errmsg" : "FieldPath field names may not start with '$'.", "code" : 16410 }
```

原因是管道函数中限制了 fieldName 不能以 $ 开始, 所以此处会报错。解决办法：在 lookup 前加入下面管道代码生成一个去掉 $ 的 field

```json
{
        $addFields: {
            "taskNos": 
            {
                $arrayToObject: {
                    $map: {
                        input: {
                            $objectToArray: "$taskNos"
                        },
                        in: {
                            k: {
                                $cond: [
                                    {
                                        $eq: [{
                                            "$substrCP": ["$$this.k", 0, 1]
                                        }, {
                                            $literal: "$"
                                        }]
                                    },
                                    {
                                        $substrCP: ["$$this.k", 1, {
                                            $strLenCP: "$$this.k"
                                        }]
                                    },
                                    "$$this.k"
                                ]
                            },
                            v: "$$this.v"
                        }
                    }
                }
            }
        }
    }
```

# MongoTemplate 组合任意查询语句
可以使用通用 api 进行任意创建

```java
import org.springframework.data.mongodb.MongoExpression;
import org.bson.Document;
// 这里的表达式是不需要加 { } 的
AggregationExpression.from(MongoExpression
                           .create("k: {$cond: [{$eq: [{\"$substrCP\": [\"$$taskNo.k\", 0, 1] }, {$literal: \"$\"}] }, {$substrCP: [\"$$taskNo.k\", 1, {$strLenCP: \"$$taskNo.k\"}] }, \"$$taskNo.k\"] }, v: \"$$taskNo.v\""))))
// 如果是要加 k: v 这种 map 形式的表达式, 则可以使用 Document
doc -> new Document().append("appName", "$$app.k").append("appValue", "$$app.v")
```

# Windows 下 MongoDB 安装
1. 首先去<font style="color:#2F4BDA;"> </font>[官网](https://www.mongodb.com/try/download/community) 选择版本后下载二进制包
2. 解压到安装目录，然后在 mongo 的根目录下创建 data、logs 两个文件夹
3. 在 mongo 的根目录下创建 mongo.cfg文件然后写入以下内容

```json
systemLog:
  destination: file
  logAppend: true
  path: xxx/logs/mongo.log
storage:
  dbPath: xxx/data
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1
net:
  port: 27000
  bindIp: 0.0.0.0
```

4. 使用管理员权限打开终端（如果是 PowerShell 则需要允许执行脚本，建议使用 cmd）执行以下命令 mongod.exe --config "xxx/mongo.cfg" --install（默认安装的服务名为 MongoDB 如果没有此服务名可以去日志目录下查看日志信息）
5. win + r 执行 services.msc 找到服务名并启动
6. 键入 mongo.exe 可查看是否启动成功

