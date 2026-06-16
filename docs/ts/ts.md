---
title: ts
tags:
  - ts
createTime: 2026/06/16 20:51:29
permalink: /article/qh7bi91y/
categories:
  - ts
---

# ts

# Windows 下管理 Node 版本

可以使用 [nvm](https://github.com/coreybutler/nvm-windows) 进行管理

1. 直接下载二进制文件即可, 然后解压到安装目录下
2. 以管理员权限执行 `install.cmd`并手动填写安装目录
3. 编辑 `settings.txt`添加镜像源

```plain
root: D:\Coding\nvm 
path: C:\Program Files\nodejs 
arch: 64 
proxy: none
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

# vue-cli-service 配置跨域

vue-cli-service 是把 webpack-dev-server 包装了一层，所以，webpack-dev-server的配置方法都可以拿过来用。

该工具配置可参考 [vue-cli](https://cli.vuejs.org/zh/config/#devserver-proxy) 配置跨域，如果和 package.json 同级目录下没有 vue.config.js 文件 则可以自己创建一个，配置代理如下：

```javascript
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: '<url>',
                ws: true,
                changeOrigin: true
            },
            '/foo': {
                target: '<other_url>'
            }
        }
    }
}
```

# var 作用域提升

js 的 var 关键字用于声明变量，var 对变量的声明存在作用域提升。此外 var 优先针对函数的变量提升而不是变量

```javascript
a = 10
var a
console.log(a) // 10
// 对于 js 的编译器来说这段代码顺序如下
// var a
// a = 10
// console.log(a) // 10
```

例如回调中的 var 和 let 区别

```javascript
// var 的作用域提升到了整个for循环期间，在触发 setTimeout 回调函数时，i 已经变成了 3
for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i)
    }, 0)
}
// 3
// 3
// 3
// let 拥有自己的作用域，每次循环传入 setTimeout 回调函数都是独立的 i，因此会正常输出
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i)
    }, 0)
}
// 0
// 1
// 2
```

# 闭包

js 中处处可见闭包（各种回调函数，封装方法等等）

```javascript
// 正常情况下 a 被调用后作用域内的变量应该要被垃圾回收器回收，但是由于闭包的存在这个操作不会被执行
function a() {
    let a = 1
    return function () {
        console.log(a++)
    }
}
let b = a()
b() // 1
b() // 2
a()() // 1
a()() // 1
```

# 简单模块封装

以下代码实现的大致实现了 es6 模块的基本功能（只是类似，实际 es6 的模块化有自己的实现）

```javascript
var MyModules = (function () {

        var modules = {}

        function define(name, deps, impl) {
            for (var i = 0; i < deps.length; i++) {
                deps[i] = modules[deps[i]]
            }
            modules[name] = impl.apply(impl, deps)
        }

        function get(name) {
            return modules[name]
        }

        return {
            define,
            get
        }
    }
)()

MyModules.define("bar", [], function () {
    function hello(who) {
        return "Let me introduce: " + who
    }

    return {
        hello
    }
})

MyModules.define("foo", ["bar"], function (bar) {
    var hungry = "hippo"
    function awesome(who) {
        console.log(bar.hello(hungry).toUpperCase())
    }

    return {
        awesome
    }
})

var bar = MyModules.get("bar")
var foo = MyModules.get("foo")

console.log(
    bar.hello("hippo")
)

foo.awesome()
```

# 硬绑定和软绑定

* 硬绑定

以下代码通过方法内部再封装一个方法，内部方法指定 this 指向。ES5 提供内置的 bind 方法Function.prototype.bind ，该方法将调用方与参数的对象进行绑定，改变方法内部的 this 为参数对象，返回绑定好上下文的方法（如果参数是基本类型 1, '1' 等 则会自动转换为对象 new Number(1) new String('1')）

```javascript
function foo() {
    console.log(this.a)
}
var obj = {
    a: 2
}
var obj1 = {
    a: 2
}
var bar = function () {
    // 始终指向 obj
    foo.call(obj)
}
bar() // 2
setTimeout(bar, 100) // 2
bar.call(this) // 2 
// 使用 bind 方法
var baz = foo.bind(obj)
baz() // 2
var bac = baz.bind(obj)
bac() // 2  一旦调用 bind 以后的绑定均不生效
```

* 软绑定

这种实现方式会对外暴露 fn 和 arg，存在被污染的可能性

```javascript
Function.prototype.softBind = function (obj) {
    var fn = this
    // 捕获所有 curried 参数
    var curried = [].slice.call(arguments, 1)
    var bound = function () {
        return fn.apply((!this || this === (global || window)) ? obj : this,
            curried.concat.apply(curried, arguments)
        )
    }
    bound.prototype = Object.create(fn.prototype)
    return bound
}
function foo() {
    console.log(this.a)
}
var obj1 = {
    a: 1
}
var obj2 = {
    a: 2
}
var obj3 = {
    a: 3
}
var foo1 = foo.softBind(obj1)
foo1() // 1
var foo2 = foo.softBind(obj2)
foo2() // 2
var foo3 = foo.softBind(obj3)
foo3() // 3
```

# JS 修改 this 指向

在 js 中修改 this 指向共有 3 种方法，非严格模式下 apply、call、bind 更改的指向 this 若是基本类型则会变为包装类型 1 -> Number(1)   "1" -> String("1")  true -> Boolean(true)   而 undefined、null 则不会改变 this 指向this 依旧使用默认值（js 是 window node 是 global）严格模式下这些转换都不会发生，this 将绑定传入值

1. apply 函数：fn.apply(this, \[1, 2, 3])  // 参数以数组传入
2. call 函数：fn.call(this, 1, 2, 3) // 参数以 "," 号分割
3. bind 函数：var bindFn = fn.bind(this)

以上 3 种改变 this 指向的方式对 ES6 新增的箭头函数均无效，甚至通过 new 构造方法调用都不能改变

# TS 基础

## 基本类型注意点

1. void 可以定义 undefined 和 null 类型（非严格模式下通过，严格模式不行）

```typescript
let a: void = undefined
let b: void = null
```

2. undefined 和 null 类型可以赋值给基本类型（非严格模式下通过，严格模式不行）

```typescript
let a: null = undefined
let b: undefined = null
let c: number = 123
c = a
c = b
```

3. TS 关闭严格模式（默认开启）需要在当前工程根路径下新建 tsconfig.json 文件然后写入以下信息

```json
{
    "compilerOptions":{
        "strict": false
    }
}
```

## any 和 unknown

any 可以看作是任何类型，它可以被赋值给任意类型，任意类型也可以赋值给 any，TS 3.0 引入 unknown 类型，它基本等同于 any，区别在于 unknown 只能赋值给 unknown 或 any 并且 unknown 不可以调用对象中的属性及方法

```typescript
let a: any = 1
let b: void = undefined
b = a

let c: unknown = 1
let d: unknown = "2"

c = d
a = d
// 错误 unknown 只能赋值给 unknown 或 any
b = d

let e: any = {a : 1}
e.b
let f: unknown = {a : 1, b : () => {}}
// 错误 unknown 不可以调用属性
f.a
// 错误 unknown 不可以调用方法
f.b
```

## Interface

TS 中的 interface 类似 java 提供了约束子类的作用，TS 的 interface 可以重名但是属性会合并，当定义 interface 的任意属性 \[propName: string] : any 那么其它属性都必须是它的子类

## Array

用接口表示数组时，索引的类型必须时数字，参数的类型是 IArguments

```typescript
interface A {
  // index 的类型必须是数字
  [index: number] : string
}

let c: A = ["1", "2"]
console.log(c)

// 参数的类型是 IArguments
let f = (...args : any) : void => {
  let c : IArguments = args
  console.log(c)
}
f(1, 2, 3)

//其中 IArguments 是 TypeScript 中定义好了的类型，它实际上就是：
interface IArguments {
  [index: number]: any;
  length: number;
  callee: Function;
}
```

## 断言

* TS 中的断言仅仅只是将对象强制当成某种类型去使用，实际类型本身并不会发生改变。断言分为两种形式，`(a as string)` 或者 `<string>a`

```typescript
let a = (b : any) : boolean => {
    return <boolean>b
}
// 输出 1
console.log(a(1))
```

* TS 中对字面值的断言会使得这个对象包括它的引用都不能再发生改变（编译期间完成，运行时依旧可以修改）编译前：const 修饰只能修改引用类型的引用内部，字面值的断言不能修改引用类型的引用内部，编译后与 const 一致

```typescript
// 字面量断言将不可以进行显示修改，但是运行时修改却可以
let a = {k1: 1, k2: 2} as const
// 失败
a.k2 = 3
// 成功
let b : string = 'k2'
a[b] = 3

// --------------- 编译后的 JS ---------------
// 比较简陋，这里可以用 configuration 限制运行时也为只读
var a = { k1: 1, k2: 2 };
var b = 'k2';
a[b] = 3;
```

## 元组类型

元组类型就是数组类型的变种，具体实现如下

```typescript
// 只能按照下标进行限定类型的赋值
let a : readonly [boolean, number, string] = [true, 1, '1']
console.log(a)
```

## 枚举类型

* 对于普通枚举 TS 会将其编译成为对象，常量枚举会直接进行替换，类似 C 语言中的 #define

```typescript
const enum A {
    A1,
    A2
}
// 这里在编译后会被直接替换为 0
console.log(A.A1)

enum B {
    A1,
    A2
}

// ------------------编译后代码------------------
// 这里被直接用 0 替换了
console.log(0 /* A.A1 */);
// 普通的枚举会被编译成对象
var B;
(function (B) {
    B[B["A1"] = 0] = "A1";
    B[B["A2"] = 1] = "A2";
})(B || (B = {}));
```

* 枚举类型可以进行双向查找，当 value 对应多个 key 时只会返回最后匹配的 key

```typescript
enum A {
    A1 = 0,
    A2 = 0,
    A3 = 0,
}
// 正向查找 0
console.log(A.A1)
// 反向查找 A3
console.log(A[0])
```

## 类型别名

TS 中可以类似 C 语言一样给比较长的类型定义别名，使用 type 关键字。也可以定义值的别名，和枚举效果类似

```typescript
// 类型别名
type a = string | number
// 值别名
type b = "1" | 1 | null
let c : a = 1
let d : a = "1"
let e : b = "1"
// 错误，f 只能是 "1"、1、null
let f : b = "2"
```

## Never

TS 中的 never 表示一个不该存在的状态，比如方法抛异常，怎么都不该走到判断分支，无限循环，无限等待等等

```typescript
let a = () : never => {
    throw new Error()
}

let b = () : never => {
    while(true) {}
}

interface A {
    type: 'A'
}
interface B {
    type: 'B'
}
type All = A | B ;
function handleValue(val: All) {
    switch (val.type) {
        case 'A':
            break;
        case 'B':
            break
        default:
            //兜底逻辑 如果进来是程序异常
            const unReach:never = val
            break
    }
}
```

## 泛型

TS 的泛型和 java 一样都是编译期间生效，绕过编译期间检查的语法都不受泛型约束

* 函数泛型约束

```typescript
let foo: { <T>(arg: T): T }
foo = function <T>(arg:T):T {
   return arg
}
```

* keyof 返回对象的属性，同样可以用于泛型的约束

```typescript
// K 只能是 T 的属性名称
function prop<T, K extends keyof T>(obj: T, key: K) {
    return obj[key]
}
```

## TSC 参数

详细参数见 [文档](https://www.typescriptlang.org/docs/)。tsconfig.json 可以通过命令 tsc --init 生成，也可以直接创建，以下为基本配置

```json

"compilerOptions": {
  "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
  "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
  "diagnostics": true, // 打印诊断信息 
  "target": "ES5", // 目标语言的版本
  "module": "CommonJS", // 生成代码的模板标准
  "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
  "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
  "allowJs": true, // 允许编译器编译JS，JSX文件
  "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
  "outDir": "./dist", // 指定输出目录
  "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
  "declaration": true, // 生成声明文件，开启后会自动生成声明文件
  "declarationDir": "./file", // 指定生成声明文件存放目录
  "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
  "sourceMap": true, // 生成目标文件的sourceMap文件
  "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
  "declarationMap": true, // 为声明文件生成sourceMap
  "typeRoots": [], // 声明文件目录，默认时node_modules/@types
  "types": [], // 加载的声明文件包
  "removeComments":true, // 删除注释 
  "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
  "noEmitOnError": true, // 发送错误时不输出任何文件
  "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
  "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
  "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
  "strict": true, // 开启所有严格的类型检查
  "alwaysStrict": true, // 在代码中注入'use strict'
  "noImplicitAny": true, // 不允许隐式的any类型
  "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
  "strictFunctionTypes": true, // 不允许函数参数双向协变
  "strictPropertyInitialization": true, // 类的实例属性必须初始化
  "strictBindCallApply": true, // 严格的bind/call/apply检查
  "noImplicitThis": true, // 不允许this有隐式的any类型
  "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
  "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
  "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
  "noImplicitReturns": true, //每个分支都会有返回值
  "esModuleInterop": true, // 允许export=导出，由import from 导入
  "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
  "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
  "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
  "paths": { // 路径映射，相对于baseUrl
    // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
    "jquery": ["node_modules/jquery/dist/jquery.min.js"]
  },
  "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
  "listEmittedFiles": true, // 打印输出文件
  "listFiles": true// 打印编译的文件(包括引用的声明文件)
}

// 指定一个匹配列表（属于自动指定该路径下的所有ts相关文件）
"include": [
  "src/**/*"
],
// 指定一个排除列表（include的反向操作）
"exclude": [
  "demo.ts"
],
// 指定哪些文件使用该配置（属于手动一个个指定文件）
"files": [
  "demo.ts"
]
```
