---
title: rust学习记录
date: "2022-12-30"
image: 
headerImage: false
tag:
  - rust
star: true
category: blog
author: Ai.Haibara
excerpt: 
theme: fancy
---


 rustup docs  获取相关学习资源

```rust
let apples = 5; //不可变
let mut bananas = 5;// 可变

let mut guess = String::new(); //声明一个 String 的新实例, String::new 表示 new 为 String 类型的一个关联函数(静态方法)
```

```rust
    stdin().read_line(&mut guess).expect("Failed to read line");
```

`read_line` 返回一个 `Result` 类型的值, 需要使用 `expect` 方法来对返回值进行处理.
