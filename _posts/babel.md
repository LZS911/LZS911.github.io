---
title: babel
layout: post
date: '2021-11-30'
image:
headerImage: false
tag:
  - babel
  - JavaScript
  - 工具
  - 编译器
star: true
category: blog
author: LZS_911
description: blog
excerpt: ''
coverImage: '/assets/blog/image/cover.jpg'
ogImage:
  url: '/assets/blog/image/cover.jpg'
theme: Chinese-red  
---

## `babel` 介绍

---

### 1. `babel` 的诞生

在学习一个框架/库之前, 我们可以先去追根溯源了解它诞生的原因以及在开发上具体解决了什么问题, 这样可以更容易理解以及学习它.

`babel` 的前身是一个名叫 `6to5` 的库, `6to5` 的作者 是 `Facebook` 的澳大利亚的工程师 [Sebastian McKenzie](https://github.com/sebmck), 主要功能就是 `ES6` 转成 `ES5`, 它使用转换 `AST` 的引擎是 `fork` 了一个更古老的库 [acorn](https://github.com/acornjs/acorn), 在后来 `6to5` 和 `Esnext` 库的团队决定一起开发 `6to5`, 并改名为 `Babel`, 解析引擎改名为 `Babylon`, 再后来 `Babylon` 移入到 `@babel/parser`.

### 2. `babel` 含义

`babel` 指的是 通天塔, 是巴比伦文明里面的 通天塔

> 当时地上的人们都说同一种语言, 当人们离开东方之后, 他们来到了示拿之地。在那里, 人们想方设法烧砖好让他们能够造出一座城和一座高耸入云的塔来传播自己的名声, 以免他们分散到世界各地。上帝来到人间后看到了这座城和这座塔, 说一群只说一种语言的人以后便没有他们做不成的事了；于是上帝将他们的语言打乱, 这样他们就不能听懂对方说什么了, 还把他们分散到了世界各地, 这座城市也停止了修建。这座城市就被称为“巴别城”。
> -- 《创世记》
>
> 来自: <https://en.wikipedia.org/wiki/Tower_of_Babel>

果然, 大佬就是大佬, 起名都很艺术.

### 3. `babel` 的意义

为什么需要用到 `babel` 来对转换代码?

在 2015 年 `ES6` 发布后, 为了兼容某些低版本浏览器, 于是需要将代码进行转换, 当然还有一些其他的兼容方式, 例如添加 `Polyfill`, 比如如果某个版本的浏览器不支持 `Array.prototype.find` 方法, 但是我们的代码中有用到 `Array` 的 `find` 函数, 为了支持这些代码, 我们会人为的加一些兼容代码.

```javascript
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype,  'find',  {
      // 实现代码
      ...
  });
}
```

但是有一些情况我们使用到了一些新语法, 或者一些其他写法, 例如

```javascript
//箭头函数
const fn = () => 'hello javascript!';
// jsx
const Component = () => <div />;
```

因为一些浏览器根本就不识别这些代码, 这时候就需要把这些代码转换成浏览器识别的代码。`babel` 就是做这个事情的。

## `babel` 具体做了些什么

---

`babel` 在转换代码这块主要做了三件事:

- `parser` 解析我们的代码转换为 `AST`.
- `transform` 利用我们配置好的 `plugins/presets` 把 `parser` 生成的 `AST` 转变为新的 `AST`.
- `generator` 把转换后的 `AST` 生成新的代码.

![alt](https://raw.githubusercontent.com/LZS911/LZS911.github.io/backend-main/assets/images/study/babel/mind.jpg)

其中 `transform` 占了很大一块比重, 这个转换过程是 `babel` 中最为复杂的一部分, 平时所添加的 `plugins/presets` 便是在这个过程中起的作用.

先来看下 `parser` 与 `generator` 部分

1. [@babel/parser](<(https://babeljs.io/docs/en/babel-parser#docsNav)>): `parser` 主要的作用是将字符串代码转换为 `AST`, 具体过程参考: <https://mp.weixin.qq.com/s/fH2xYo_Bad0mgvo0OdYRZQ>

2. [@babel/generator](https://babeljs.io/docs/en/babel-generator): 代码生成步骤把最终（经过一系列转换之后）的 `AST` 转换成字符串形式的代码, 同时还会创建源码映射（`source maps`）。代码生成过程采用[深度优先遍历](https://segmentfault.com/a/1190000018706578)整个 `AST`, 然后构建可以表示转换后代码的字符串。

## `transform`

---

在拿到 `parser` 生成的 `AST` 结构后, 经过一系列的操作对 `AST` 节点进行变更, 然后转换成字符串代码. 那么如何去修改 `AST` 节点呢?

[babel 插件形式](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-writing-your-first-babel-plugin)

依葫芦画瓢来一个简单的栗子:

代码地址: <https://codesandbox.io/s/node-js-forked-ub0e6?file=/remove-clg/example/index.js>

```javascript
// example/index.js
const babel = require('@babel/core');
const removeClg = require('../index');

const code = `
const num = 123;
console.log(num);
console.info(num);
const fn = () => 123
fn();
`;
const result = babel.transform(code, {
  plugins: [removeClg],
});

console.log(result); // code : const num = 123;\n\nconst fn = () => 123;\n\nfn();
```

```javascript
//index.js
const visitor = {
  CallExpression(_path) {
    const isClg =
      _path.node?.callee?.type === 'MemberExpression' &&
      _path.node?.callee?.object?.name === 'console';

    if (isClg) {
      _path.remove();
    }
  },
};
//如果 plugins 是个函数则返回的对象要有 visitor 属性, 如果是个对象则直接定义 visitor 属性
module.exports = { visitor };
```

这样便简单实现了一个移除代码中的 `console.xxx` 的 `babel` 插件.

那么当遍历到对应类型节点时这个 `_path` 是什么呢?

`visitor` 在遍历到对应节点执行对应函数时候会给我们传入 `_path` 参数, 辅助我们完成替换节点等操作。注意 `_path` 是表示两个节点之间连接的对象, 而不是当前节点. 大致结构如下:

```javascript
{
  parent: {
    type: "ExpressionStatement"
    // ...
  },
  node: {
    type: "CallExpression"
    // ...
  }
}
```

我们可以通过 `_path` 访问到当前节点、父节点以及一系列跟节点操作相关的方法(例如: `remove`, `replaceWith`)

[@babel/traverse](https://babeljs.io/docs/en/babel-traverse#docsNav): 该工具提供遍历 `AST` 节点功能, 使用该工具时, 我们可以不使用插件形式来操作 `AST` 节点.

举个栗子: [一个并没啥用的 `vite` 插件](https://lzs911.github.io/posts/%E5%9B%BD%E9%99%85%E5%8C%96%E9%A1%B9%E7%9B%AE%E4%B8%AD%E8%87%AA%E5%8A%A8%E5%8C%96%E8%AF%AD%E8%A8%80%E5%8C%85%E7%9A%84vite%E6%8F%92%E4%BB%B6)

## `plugin`、`preset`

---

`plugin` 应该不用再过多的介绍了, 它是对 `AST` 节点进行操作的关键工具, 那么 `preset` 又起到什么作用呢?

`babel` 插件在设计时一般拆成了最小粒度, 开发者可按需引用. 比如 `ES6` 转 `ES5` 的功能, `babel` 官方拆成了很多个独立的插件.
这样的好处显而易见, 既提高了性能, 也提高了扩展性.

比如开发者想要体验 `ES6` 的箭头函数特性, 那他只需要引入 `transform-es2015-arrow-functions` 插件就可以, 而不是加载 `ES6` 全家桶.

但很多时候, 逐个插件引入的效率比较低下. 比如在项目开发中, 开发者想要将所有 `ES6` 的代码转成 `ES5`, 插件逐个引入的方式令人抓狂.

这个时候, 可以采用 `preset`, 可以简单的把 `preset` 视为 `plugin` 的集合。比如 `babel-preset-es2015` 就包含了所有跟 `ES6` 转换有关的插件. 换个角度可以理解成脚手架中的预设模版.

### `plugin` 与 `preset` 的执行顺序

如果 `babel` 中配置的多个插件都将对节点进行操作时, 那么这个时候插件的执行顺序便很重要, 那么它们的执行顺序是什么样的呢?

这里直接从 `babel` 官网中拿到结果:

- 插件在预设之前运行.
- 插件排序从头到尾.
- 预设顺序颠倒（从后到前).

### 一些常用的 `plugin` 与 `preset`

1. [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env):

   首先, 介绍下历史背景. 最初, 为了让开发者能够尽早用上新的 `JS` `特性, babel` 团队开发了 `babel-preset-latest`。这个 `preset` 比较特殊, 它是多个 `preset` 的集合(`es2015+`), 并且随着 `ECMA` 规范的更新更增加它的内容.

   比如, 在 2018 年时, 它包含的 `preset` 包括：`es2017、es2016、es2015`.

   到了 2019, 可能它包含的 `preset` 就包括：`es2018、es2017、es2016、es2015`.

   随着时间的推移, `babel-preset-latest` 包含的插件越来越多, 这带来了如下问题：

   加载的插件越来越多, 编译速度会越来越慢. 随着用户浏览器的升级, `ECMA` 规范的支持逐步完善, 编译至低版本规范的必要性在减少. 因此, `babel` 官方推出了 `babel-preset-env` 插件.

   它可以根据开发者的配置, 按需加载插件, 主要配置项:

   - `targets`: 可以利用 [browserslist](https://github.com/browserslist/browserslist) 来指定来兼容哪些浏览器.

     配置方式:

     ```javascript
     //在配置文件中
     plugins: [
       [
         '@babel/preset-env',
         {
           targets: '> 0.25%, not dead',
         },
       ],
     ];
     ```

     在 package.json 中

     ```json
     {
       "browserslist": {
         "production": [">0.2%", "not dead", "not ie <= 11", "not op_mini all"],
         "development": [
           "last 1 chrome version",
           "last 1 firefox version",
           "last 1 safari version"
         ]
       }
     }
     ```

     - 0.2%：所有浏览器至少占全球市场份额的 0.2%
     - not dead: 24 个月内没有官方支持的浏览器
     - not ie <= 11：排除 IE 11 和旧版本
     - not op_mini all：排除 Opera Mini

     当然也可以直接指定浏览器以及版本:

     ```javascript
     //在配置文件中
     plugins: [
       [
         '@babel/preset-env',
         {
           targets: {
             chrome: '58',
             ie: '11',
           },
         },
       ],
     ];
     ```

   - `useBuiltIns`: 该配置指定 `@babel/preset-env` 如何处理 `polyfill`, 主要用来配合 `@babel/polyfill` .

     1. `false`: 不做任何处理.
     2. `entry`: 主动引入 `@babel/polyfill`, 会进行全量引入.
     3. `usage`: 只会引入使用到的 `polyfill`.

2. [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react): 看名字应该就可以猜出该预设主要是为了处理 `react` 项目中的文件转换. 该预设始终包含一下三个插件

   - [@babel/plugin-syntax-jsx](https://www.babeljs.cn/docs/babel-plugin-syntax-jsx): 解析 `JSX` 语法.
   - [@babel/plugin-transform-react-jsx](https://www.babeljs.cn/docs/babel-plugin-transform-react-jsx): 转换 `JSX` 语法, 在 `babel v7.9.0` 中添加自动运行时功能, 将自动导入 JSX 编译成的函数. 也就是 `React 17.0` 中提供的全新的 `JSX` 转换, 在文件中不导入 `react` 包的情况下直接使用 `JSX` 语法.
   - [@babel/plugin-transform-react-display-name](https://babeljs.io/docs/en/babel-plugin-transform-react-display-name)

3. [@babel/polyfill、@babel/plugin-transform-runtime、core-js3](https://zhuanlan.zhihu.com/p/361874935)

## `babel` 与 `webpack`

---

在 `webpack` 中提供了 `babel-loader` 来配置 `babel`

```javascript
module: {
  rules: [
    {
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                corejs: 3,
              },
            ],
          ],
        },
      },
    },
  ];
}
```
