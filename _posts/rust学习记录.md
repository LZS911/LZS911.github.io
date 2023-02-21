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


```rust
let apples = 5; //不可变
let mut bananas = 5;// 可变

let mut guess = String::new(); //声明一个 String 的新实例, String::new 表示 new 为 String 类型的一个关联函数(静态方法)
```

```rust
    stdin().read_line(&mut guess).expect("Failed to read line");
```

`read_line` 返回一个 `Result` 类型的值, 需要使用 `expect` 方法来对返回值进行处理.

使用 crate 来增加更多功能. crate 类似 node.js 中的 npm, 可以应用第三方发布的包, 同时, 也存在一个类似 package.json 的文件: Cargo.toml, 可以配置项目的一些信息以及添加第三方依赖.

```toml
[dependencies]
rand = "0.8.5"
```

当执行 cargo run 出现 Blocking waiting for file lock on the registry index 的解决方案:

```sh
rm -rf ~/.cargo/.package-cache 

//或
rm -rf ~/.cargo/registry/index/*
```

运行 cargo doc --open 命令来构建所有本地依赖提供的文档，并在浏览器中打开.

```rust
    match guess.cmp(&secret_number) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => println!("You win!"),
    }
```

一个 match 表达式由 分支（arms） 构成. 一个分支包含一个 模式（pattern）和表达式开头的值与分支模式相匹配时应该执行的代码. Rust 获取提供给 match 的值并挨个检查每个分支的模式

```rust
 let mut guess = String::new();

  io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

 let guess: u32 = guess.trim().parse().expect("Please type a number!");
```

 在 rust 中可以复用同一个变量名(如上述代码). 这个功能常用在需要转换值类型之类的场景, 它允许我们复用 guess 变量的名字, 而不是被迫创建两个不同变量.

`loop` 关键字会创建一个无限循环. 当执行到 `break` 时退出循环.

```rust
    let end_flag = 10;
    let mut flag = 0;
    println!("start loop");
    loop {
        flag = flag + 1;

        if flag == end_flag {
            println!("end loop");
            break;
        }
    }
```

rust 中的类型

1. 标量类型: 整型、浮点型、布尔类型和字符类型.

2. 复合类型: 元组、数组.

元组是一个将多个其他类型的值组合进一个复合类型的主要方式, 组长度固定：一旦声明，其长度不会增大或缩小.

```rust
    let tup: (i32, f64, u8, char) = (500, 6.4, 1, 'r');
```

元组解构

```rust
    let tup: (i32, f64, u8, char) = (500, 6.4, 1, 'r');
    let (a, b, c, d) = tup;
```

rust 中的数组长度是固定的. 若需要长度可变的集合时, 可以使用 vector.

```rust
    let v1: Vec<i32> = Vec::new();
    let v2 = vec![1, 2, 3];
```

rust 中的函数

```rust

fn get_value(arg: i32) -> String {
    arg.to_string()
}

```

定义函数使用关键字 fn, 函数的返回值可以省略 return 关键字, 注意此时同时需要省略语句结尾的分号.

**rust 中的所有权**

>所有程序都必须管理其运行时使用计算机内存的方式。一些语言中具有垃圾回收机制，在程序运行时有规律地寻找不再使用的内存；在另一些语言中，程序员必须亲自分配和释放内存。Rust 则选择了第三种方式：通过所有权系统管理内存，编译器在编译时会根据一系列的规则进行检查。如果违反了任何这些规则，程序都不能编译。在运行时，所有权系统的任何功能都不会减慢程序。

<https://kaisery.github.io/trpl-zh-cn/ch04-01-what-is-ownership.html>
