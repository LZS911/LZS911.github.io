---
title: 如何正确的使用useEffect?
layout: post
date: "2022-02-20"
image: 
headerImage: false
tag:
- react
- hooks
- useEffect
star: true
category: blog
author: LZS_911
description: blog
---

最近浏览知乎时看到一篇关于 `React Hooks` 的文章. 题目标题为 [React Hooks 使用误区，驳官方文档](https://zhuanlan.zhihu.com/p/450513902). 文章作者是社区知名 `aHooks` 库的作者, 初读文章时并没有感觉到什么奇怪, 平时开发过程中对于官方 `hooks` 的使用也大致与它描述的相同, 可能是原文标题攻击性过强, 当翻到评论区时, 对于 `useEffect` 的使用却是大片的反对声音, 甚至有人专门[另开一篇文章](https://www.zhihu.com/question/508780830)来讨论该篇文章. 最主要的原因来自 `useEffect` 的依赖项问题, 具体观点可以阅读原文了解, 本篇文章仅表述下自己的看法以及开发习惯.

前面有说道在初读原文时并没有感觉到什么异样, 因为下意识的将 `useEffect` 等同于了 `componentDidMount / componentDidUpdate`, 或者说是 `vue` 中的 `mounted\destroyed\watch`. 开发过程中确实会遇到不需要某个依赖改变时去执行某个副作用, 便不添加到依赖项中, `eslint` 的 `友情提示` 也会直接被我强硬的注释掉.

当然会有这篇文章也就是说明我现在的思路有了一定的转变, 具体转变原因来自与原文的一条指路[博客](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/#tldr)评论. 该博客大致讲述了以下几点:

1. 如何用 `useEffect` 模拟 `componentDidMount` 生命周期？
2. 如何正确地在 `useEffect` 里请求数据？[]又是什么？
3. 我应该把函数当做 `effect` 的依赖吗？
4. 为什么有时候会出现无限重复请求的问题？
5. 为什么有时候在effect里拿到的是旧的state或prop？

最后结论: 我认为正常情况下, `useEffect` 的依赖项就是应该 `诚实以待`, 这样会极大程度的减少 `bug` 以及 `善待后人`, 但是在某些特殊情况下, 禁用 `eslint` 也是可以的, 只要你自己清楚的知道这里要干什么.
