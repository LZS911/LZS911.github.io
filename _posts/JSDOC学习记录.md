---
title: JSDOC学习记录
date: "2023-11-30"
image: 
headerImage: false
tag:
  -
star: true
category: blog
author: Ai.Haibara
excerpt: 
theme: fancy
---

在聊 JSDOC 之前，我们先看一篇新闻:

在这篇新闻中（<https://devclass.com/2023/05/11/typescript-is-not-worth-it-for-developing-libraries-says-svelte-author-as-team-switches-to-javascript-and-jsdoc/>），Svelte 的作者表示，对于开发库而言，TypeScript 并不值得使用，并转而选择 JavaScript 和 JSDoc。让我们来看看 JSDoc 是什么以及它是否能够实现与 TypeScript 相同的功能。

![alt](/assets/jsdoc/example-1.png)

TypeScript 是一种为 JavaScript 添加类型支持的语言，它提供了类型提示和类型检查等功能，相信大家对它都很熟悉。

那么，JSDoc 能否完成与 TypeScript 相同的功能呢？为什么 Svelte 选择放弃 TypeScript 呢？

让我们带着这些疑问来了解一下 JSDoc 是什么东西。

## 从零开始的 JSDoc

了解一个第三方库最好的办法一定是找到它的 [Getting started](https://jsdoc.app/about-getting-started)，通过简单的阅读，我们可以知道 JSDoc 提供了通过在代码块上方添加注释的方式来生成一个网站.

![alt](/assets/jsdoc/example-2.png)

但是仅仅只有这个功能的情况下，它又是怎么能够替代 Typescript 的呢?

## Typescript && JSDoc

在 Typescript 3.7 之后，TypeScript 添加了对使用 JSDoc 语法从 JavaScript 生成 .d.ts 文件的支持。 下面是具体的文档地址:

[Creating .d.ts Files from .js files](https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html)

看到这里后，我想文章开头的疑问便很好的得到了解释. 其实，并不存在什么放弃，typescript 只是换了一种形式仍然存在我们的项目中。

通过这个新功能，我们可以使用 JSDoc 注释来为 JavaScript 代码添加类型信息，并生成对应的声明文件（.d.ts），以提供类型检查和类型提示的支持。

好了，说了这么多，我们来看下具体的实践吧.

### 实践

![alt](/assets/jsdoc/example-7.png)

由于 vite 包中提供了 UserConfig 的类型， 所以我们可以在 JSDoc 中直接 `import` 该类型， 这样， 在 js 文件中，同样能够获取到类型提示以及类型检查的功能。

![alt](/assets/jsdoc/example-3.png)

在我们开启了 tsconfig 中的 `allowJs` 以及 `checkJs` 后，即使在 js 文件中，依然会为我们检查出类型错误。

现在，我们给这个函数加上 JSDoc 注释:

![alt](/assets/jsdoc/example-4.png)

此时已经能够正确的推导出类型了，接下来，我们来个稍微复杂点的函数。

![alt](/assets/jsdoc/example-5.png)

接下来， 在项目中执行 `npx tsc`， 可以看到， typescript 已经为我们生成了 index.d.ts 的文件， 这样， 当其他人来引用这个项目时， 同样也能享受到类型提示以及类型检查。

![alt](/assets/jsdoc/example-6.png)

通过这些功能，TypeScript 提供了一种逐渐引入类型检查和类型提示的方式，使我们能够在 JavaScript 项目中享受到 TypeScript 的优势，同时保留项目的灵活性和兼容性。
