---
title: python语法糖
tags:
  - python
createTime: 2026/06/16 20:51:29
permalink: /article/buylb1hx/
categories:
  - python
---

# python 语法糖

# 列表推导式
```python
if __name__ == '__main__':
    # 只需要次数时 i 可以用 _ 代替
    list1 = [i * 10 for i in range(10)]
    # 以下方式生成的二维数组，它的一维（[1, 2]）将被共用
    list2 = [[1, 2]] * 5
```
