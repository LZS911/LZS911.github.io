---
title: swc-vs-babel
date: "2023-03-18"
image: 
headerImage: false
tag:
  -
star: true
category: talk
author: Ai.Haibara
excerpt: 
theme: fancy
---


## babel

关于 babel 的介绍: <<https://lzs911.github.io/posts/babe>

## swc

[swc](https://swc.rs/) 是通过 [rust](https://www.rust-lang.org/) 实现的一个类 babel 工具, 而且在 swc 的官网，很直白说自己和 babel 对标，swc 和 babel 命令可以相互替换，并且大部分的 babel 插件也已经实现。

对比 babel, swc 的最大优势就是快, 这是底层语言所造成的原因. 所以现在很多能用rust重写的工具都开始进行重写.

光说可能并不能具体的体会 swc 到底有多快, 所以准备同时使用 babel 以及 swc 实现一个简易版本的 `babel-import-plugin`, 也就是将 `import { A, B } from 'lib'` 转化成 `import A from lib/A; import B from lib/B;`.

## 对比

先来看下 babel 的实现

```javascript
const { traverse, parseSync, types: t } = require("@babel/core");
const generator = require("@babel/generator").default;

const transform = (content) => {
  const ast = parseSync(content);
  traverse(ast, {
    ImportDeclaration(_path) {
      const { node } = _path;

      const libraryName = node.source.value;

      const _program = _path.findParent((p) => p.isProgram());

      if (
        node.specifiers.filter((v) => v.type === "ImportDefaultSpecifier")
          .length > 0
      ) {
        return;
      }

      node.specifiers.forEach((v) => {
        const name = v.imported?.name ?? "";

        _program.pushContainer(
          "body",
          t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(name))],
            t.stringLiteral(`${libraryName}/lib/${name}`)
          )
        );
      });

      _path.remove();
      _path.skip();
    },
  });

  const out = generator(ast)?.code;
};
```

主要流程还是老三步:

1. 将原代码转化成 ast 树
2. 遍历 ast, 处理符合条件的 import 语句, 将其转化成需要的格式, 同时使用 `program.pushContainer` 添加到原树中, 并且移除掉旧的节点.
3. 将 ast 转化回字符串格式的代码.

接下来看下 swc 的实现

```javascript
const Visitor = require("@swc/core/Visitor").default;
const { transformSync } = require("@swc/core");

class PluginTransformImport extends Visitor {
  visitModuleItems(nodes) {
    const transformedNodes = [];

    for (const node of nodes) {
      const { type, source, specifiers } = node;

      if (type === "ImportDefaultSpecifier") {
        transformedNodes.push(node);
        continue;
      }

      specifiers.forEach((v) => {
        const name = v.local.value;
        const type = v.type;

        if (type === "ImportSpecifier") {
          const newSpecifier = {
            ...v,
            imported: null,
            type: "ImportDefaultSpecifier",
          };
          const value = `${source.value}/lib/${name}`;

          const copyNode = {
            ...node,
            source: {
              ...source,
              value,
            },
            specifiers: [newSpecifier],
            type: "ImportDeclaration",
          };

          transformedNodes.push(copyNode);
        }
      });
    }
    return transformedNodes;
  }
}

const transform = (content) => {
  const code =
    transformSync(content, {
      plugin: (v) => new PluginTransformImport().visitProgram(v),
    })?.code ?? "";
};

```

具体流程:

1. 新建一个类, 并且继承 `@swc/core` 提供的 `Visitor` 类.
2. 实现对应节点类型的处理函数, 这里是 `visitModuleItems`, 这里与 babel 不同的是这里是通过函数的返回值来 replace 掉旧的节点
3. 调用 transformSync, 将实现的类作为插件的形式传入

下面是两者在对 10000 条 import 语句下的表现:

![alt](/assets/swc_vs_babel/example-1.png)
![alt](/assets/swc_vs_babel/example-1.png)
