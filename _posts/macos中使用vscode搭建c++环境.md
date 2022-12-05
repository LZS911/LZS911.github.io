---
title: macos中使用vscode搭建c++环境
layout: post
date: '2022-02-10'
image:
headerImage: false
tag:
  - c++
  - vscode
  - macos
star: true
category: blog
author: LZS_911
description: blog
excerpt: ''
coverImage: '/assets/blog/image/cover.jpg'
ogImage:
  url: '/assets/blog/image/cover.jpg'
theme: arknights  
---

在之前刷算法题时使用的语言一般是 `typescript`, 因为种种原因准备换成 `C++` 来刷题. 写点简单的算法题便不想使用厚重的各种 `IDE` 了, 于是最终选择了 `vscode`.

前置环境照着 [vscode 官网](https://code.visualstudio.com/docs/cpp/config-clang-mac) 搭建后却发现在 `debug` 时程序一直不能在断点处停下来. 在网上搜索各种资料后发现 微软官方提供的 `c/c++` 插件目前并不支持 `Apple M1` ( [issue](https://github.com/microsoft/vscode-cpptools/issues/6779) 地址).

不过在 `issue` 中也给出了解决方法, 那就是使用插件 [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb). 安装插件后只需要将前置操作中的 `launch.json` 文件中的 `type` 的值由 `cppdbg` 更改为 `lldb` 后即可正常调试了.

`launch.json` 中的 `type` 字段:

> the type of debugger to use for this launch configuration. Every installed debug extension introduces a type: node for the built-in Node debugger, for example, or php and go for the PHP and Go extensions.
