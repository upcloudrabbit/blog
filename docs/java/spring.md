---
title: spring
tags:
  - java
createTime: 2026/06/16 20:51:29
permalink: /article/5scj62c1/
categories:
  - java
---

# spring

# @Transaction 注解 Commit 钩子
有些时候很多方法一开始就用了 @Transaction 注解开启事务，但是有时候希望这个方法内部的部分方法或是业务代码需要在这个事务提交后执行。Spring 官方为此提供了钩子方法，通过 TransactionSynchronizationManager 类实现

```java
class A {
    @Transactional
    public void updateA(..) {
        insert(..);
        update(..);
        // 该类有多个钩子方法包含事务提交前后和执行后 TransactionSynchronization
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                doSomething();
            }
        });
    }
```
