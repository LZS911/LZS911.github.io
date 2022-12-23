---
title: TypeScript中的 infer 与 TemplateLiteral
layout: post
date: "2022-11-21"
image: 
headerImage: false
tag:
  -
star: true
category: blog
author: LZS_911
description: blog
excerpt: 
coverImage: '/assets/blog/image/cover.jpg'
ogImage: 
  url: '/assets/blog/image/cover.jpg'
theme: fancy 
---

## infer

在介绍 infer 之前, 我们需要先了解一个前置知识点: extends, 也就是条件类型.

来自 Typescript 官网的介绍:

>大多数有效程序的核心是，我们必须依据输入做出一些决定。 JavaScript 程序也是如此，但是由于值可以很容易地被内省，这些决定也是基于输入的类型。 条件类型 有助于描述输入和输出类型之间的关系。

```Typescript
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}
 
type Example1 = Dog extends Animal ? number : string;
        
// type Example1 = number
 
type Example2 = RegExp extends Animal ? number : string;
        
// type Example2 = string
```

可以看到 extends 的用法与 javascript 中的三元表达式没有太多的区别. 接下来, 回到文章的主题 --- infer 关键字.

首先, 我们先来实现一个工具类型: *判断接受的泛型是否为一个函数, 如果是, 则返回函数的返回值类型, 否则返回它自己*

```Typescript
type f1 = () => void;
type f2 = (arg: string, arg2: number) => number;
type f3 = (arg: number) => string;
type t4 = { name: string };

type Example1<T> = T extends ((...arg: infer params) => infer ResultType) ? ResultType : T;
```

![alt](/assets/infer_templateLiteral/example-1.png)
![alt](/assets/infer_templateLiteral/example-2.png)
![alt](/assets/infer_templateLiteral/example-3.png)
![alt](/assets/infer_templateLiteral/example-4.png)

在这里, 我们通过 infer 关键字引入了类型一个名为 ResultType 的新泛型类型变量, 或者可以理解为一个占位符, 当条件类型成立时, ResultType 会替换为满足条件类型时所需的类型, 在这个栗子中 ResultType 代表的是函数的返回类型, 也就完成了我们需要的工具类型.

同样, 我们也可以实现一个 *提取元组类型中最后一个元素的类型*

```Typescript
type lastArrType<T extends unknown[]> = T extends [
  ...infer rest,
  infer ResultType
]
  ? ResultType
  : never;
```

![alt](/assets/infer_templateLiteral/example-5.png)

## Template Literal

我们先看下基础的字符串文字类型:

``` Typescript
type Demo = 'demo';
```

模版文字类型是建立在字符串文字类型上的, 举个栗子

```Typescript
type Hello = 'hello';
type HelloWorld = `${Hello} world`; //type HelloWorld = "hello world"
```

单从语法上来说, 也是和 javascript 中的模版字符串大同小异.

配合联合类型时, 会生成出每个联合成员可以表示的每个可能的字符串文字的集合.

``` Typescript
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
```

![alt](/assets/infer_templateLiteral/example-6.png)

## 实践

结合 infer 以及 Template Literal 实现一个类似 `String.replace` 的工具类型

```Typescript
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : Str;
```

![alt](/assets/infer_templateLiteral/example-7.png)

对更多实践感兴趣的可以转到: <https://lzs911.github.io/posts/Typescript%20%E4%BD%93%E6%93%8D%E7%BB%83%E4%B9%A0>
