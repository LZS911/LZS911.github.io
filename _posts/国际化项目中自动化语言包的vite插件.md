---
title: 国际化项目中自动化语言包的vite插件
layout: post
date: '2021-11-23'
image:
headerImage: false
tag:
  - vite plugin
  - react
  - i18n
star: true
category: blog
author: LZS_911
description: blog
excerpt: ''
coverImage: '/assets/blog/image/cover.jpg'
ogImage:
  url: '/assets/blog/image/cover.jpg'
theme: nico  
---

## 前言

---

在包含国际化的前端项目中, 需要提取出对应语言的文本数据, 在代码中使用函数调用的方式来添加文本[(react 国际化插件](https://react.i18next.com/)). 这样在开发过程中每添加一行文本信息就得去对应的语言包文件中添加对应的数据, 若只有中文和英语还好, 只需要添加两种语言数据, 可当对应的语言包很多时, 有没有一种简单的方式来自动添加呢?

## `vite` 插件介绍

---

官方文档链接: <https://cn.vitejs.dev/guide/api-plugin.html>

`vite` 插件通常的惯例为返回一个实际插件对象的工厂函数, 该函数可以接受允许用户自定义插件行为的选项.

在这里只需要用到 `vite` 的独有钩子函数 [handleHotUpdate](https://cn.vitejs.dev/guide/api-plugin.html#handlehotupdate). 它可以执行自定义 `HMR` 更新处理, 在代码文件更新时去添加或者修改语言包文件.

## 准备

---

1. 定义用户自定义插件的选项

   |    name     |                     defaultValue                     |   type   |    description     |
   | :---------: | :--------------------------------------------------: | :------: | :----------------: |
   |   funName   |                          t                           |  string  | function call name |
   |  splitCode  |                          #                           |  string  |     split code     |
   | languageDir |           ['locale/zh-CN', 'locale/en-US']           | string[] |   localeage path   |
   |   include   | ['src/\*\*/\*.{js,jsx,ts,tsx}', '!src/\*\*/\*.d.ts'] | string[] | include directory  |

2. 代码解析工具 —— `babel`

   - [babel-parse(parseSync)](https://babeljs.io/docs/en/babel-parser#docsNav): 将字符串格式的 `javascript` 源码解析为 `AST` , 同时也支持 `JSX、 Flow、 Typescript` (使用各种插件).
   - [babel-preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript#docsNav): 支持 `parse` 来解析 `typescript` 类型文件的插件.
   - [babel-traverse](https://babeljs.io/docs/en/babel-traverse#docsNav): 遍历所有 `AST` 节点和更新节点.
   - [babel-generator](https://babeljs.io/docs/en/babel-generator#docsNav): 将 `AST` 转换为代码, `parse` 的逆向操作.
   - [babel-types](https://babeljs.io/docs/en/babel-types#docsNav): 手动构建 `AST` 和检查 `AST` 节点类型.

3. 其他工具
   - [fast-glob](https://www.npmjs.com/package/fast-glob): 根据指定的参数获取符合规则的所有文件名称, 用来排除无需执行自定义更新处理的文件(例如 `index.d.ts` 类型文件).
   - [prettier](https://www.npmjs.com/package/prettier): 在写入文件前对字符串格式的代码进行格式化.
   - [chalk](https://www.npmjs.com/package/chalk): 控制台输出文本高亮显示, 用来显示错误信息.
   - [fs](http://nodejs.cn/api/fs.html): `node` 中操作文件的 `API`.

## 实现

---

### 1. 构建工厂函数

```typescript
export default function (userOptions: Options = {}): Plugin {
  return {
    name: 'vite-plugin-watch-i18',
    async handleHotUpdate(ctx) {
      //get options default value
      const {
        funName = 't',
        splitCode = '#',
        languageDir = ['locale/zh-CN', 'locale/en-US'],
        include = ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
      } = userOptions;
      //...
    },
  };
}
```

### 2. 排除无需处理文件

```typescript
import fg from 'fast-glob';
const filePath = ctx.file;
const allFile = await fg(include);
if (!allFile.some((i) => path.resolve(i) === filePath)) {
  return;
}
```

### 3. 处理源代码文件

- 将代码解析为 `AST`

  ```typescript
  const isTs = /^.+\.(ts|tsx)$/.test(filePath);
  const ast = isTs
    ? parseSync(fileCode, {
        presets: [require('@babel/preset-typescript').default],
        filename: filePath,
      })
    : parseSync(fileCode, {});
  ```

  通过文件后缀名判断是否为 `typescript` 类型文件, 然后使用 `babel-parse` 中的同步方法将其解析为 `AST`,

- 遍历 `AST` 中的 [CallExpression](https://babeljs.io/docs/en/babel-types#callexpression) 类型节点, 找到所有函数名为 `funName`的节点, 拿到参数信息. 这里需要注意的是一般会有两种调用方式( `t('') || i18n.t('')` )

  ```typescript
  const localeInfo: string[] = [];
  const localeFileNameArr: string[] = [];
  let index = 0;
  traverse(ast, {
    CallExpression(_path) {
      let isFun = false;
      const { node } = _path;
      if (node.callee.type === 'Identifier') {
        isFun = node.callee.name === funName;
      } else if (node.callee.type === 'MemberExpression') {
        isFun = (node.callee.property as any).name === funName;
      }
      if (isFun) {
        const arg = (node.arguments[0] as any).value;
        if (
          !arg.includes(splitCode) ||
          arg.split(splitCode).length !== langLength + 1
        ) {
          return;
        }
        localeInfo.push(arg.split(splitCode));
        localeFileNameArr.push(arg.split('.')[0]);
        const replaceArgs = node.arguments.slice() as any;
        replaceArgs[0].value = localeInfo[index][0];
        _path.replaceWith(t.callExpression(node.callee, replaceArgs));
        _path.skip();
        index++;
      }
    },
  });
  const code = !!ast
    ? generator(ast, { jsescOption: { minimal: true } })?.code ?? ''
    : '';
  const formatCode = prettier.format(code, { parser: 'typescript' });
  const formatOriginCode = prettier.format(fileCode, { parser: 'typescript' });
  formatCode !== formatOriginCode && writeFile(filePath, code);
  ```

  因为 `AST` 节点往往会是一个很复杂的对象, 所以在判断节点时一般是先拿到所有的节点信息, 然后反过来和代码进行比较, 以此来作为判断条件. 最后获取到参数信息, 收集参数信息, 并将参数中多余的部分移除, 最后将 `AST` 还原为字符串格式, 并写入文件.

  注意点:

  1. 在写入源文件时需在写入语言包文件后, 不然会造成源文件修改而语言包未添加等异常.
  2. 需要进行额外的校验, 只有当源文件发生改变后才重新写入, 因为 `vite HMR` 是在保存文件后立刻执行, 不会判断文件是否改变, 若直接重新写入会造成无限循环.
  3. 需要判断通过 `splitCode` 分割后的数组长度是否与 `languageDir.length + 1` 相等.

  最后, 这一段代码拿到的信息为两个数组, 分别是 `funName` 函数中参数的第一段, 也就是要写入的文件名, 以及一个二维数组, 其中每项为 `funName` 函数参数通过 `splitCode` 分割后的数组.

  举个栗子:

  ```typescript
  t("Common.index.confirm#确认#confirm");
  t("Common.index.cancel#取消#cancel");

  /**
   * 获取到的信息:
   * localeInfo: [['Common.index.confirm', '确认', 'confirm'], ['Common.index.cancel', '取消', 'cancel']]
   * localeFileNameArr: ['Common', 'Common']
   * /
  ```

### 4 处理语言包文件

遍历参数 `languageDir`, 找到需要添加语言包的目录, 同时将源文件中获取的信息与对应的语言包路径传入处理函数中.(源文件中语言包数据顺序需与语言包路径顺序对应)

```typescript
languageDir.forEach((v, index) => {
  writeLocale({
    localeDir: normalizePath(v),
    localeFileNameArr,
    isTs,
    localeInfo: localeInfo.map((info) => ({
      path: info[0].split('.'),
      value: info[index + 1],
    })),
  });
});
```

`writeLocale` 函数作用为修改语言包文件, 在这步中对上步过程中获取的信息进行二次处理, 分别处理对应的语言包文件.

先抛开 `AST` 部分将这其转换为算法:

`给定一个对象 obj、数组 path, 字符串 value, 其中数组类型为字符串数组, 按数组顺序将键值写入 obj, 值为 value. 例: obj: { a:1, b:{ c:2 } }, path: ['a', 'b', 'd'], value: 'add', 最后需要得到 obj: {a: 1, b: { c: 2, d: 'add' } }`

其中需要注意在 `path` 与 `obj` 同层有重复键值情况下:

- 当重复键为 `path` 中最后一项时, 若 `obj` 中重复键值类型为基础类型时, 进行替换操作
- 当重复键为 `path` 中最后一项时, 若 `obj` 中重复键值类型为对象时, 不进行替换操作
- 当重复键值为 `path` 中不为最后一项时, 若 `obj` 中重复键值类型为对象时, 继续执行
- 当重复键值为 `path` 中不为最后一项时, 若 `obj` 中重复键值类型为基础类型时时, 停止执行

具体实现方式应该有多种, 这里放上递归版本(包含 `AST` 节点操作)

```typescript
/**
 * origin: 原始 ast 节点
 * localeInfo: 数组结构, 插入多项数据
 **/
const assemblyLocaleObj = (
  origin: any,
  localeInfo: Array<{ path: string[]; value: string }>
) => {
  const addProp = (objPath: string[], value: string, originAst = []) => {
    // 当 path 最后一层时
    if (objPath.length === 1) {
      const existProp: any = originAst.find(
        (o: any) => o.key.name === objPath[0]
      );
      //存在相同键, 且值类型为 string, 进行值的替换
      if (existProp?.value?.type === 'StringLiteral') {
        originAst.forEach((o: any) => {
          if (o.key.name === objPath[0]) {
            o.value.value = value;
          }
        });
        return originAst;
      }

      //值不为 string, 抛出异常, 在外层函数中进行捕获
      if (existProp?.value?.type === 'ObjectExpression') {
        throw new Error(
          'ERROR: There are duplicates in the locale, please check the data!'
        );
      }

      //不存在相同键, 进行正常添加
      const item = t.objectProperty(
        t.identifier(objPath[0]),
        t.stringLiteral(value)
      );
      return [...originAst, item];
    }
    // 存在相同键, 但不为 path 最后一层时
    if (originAst.some((o: any) => o.key.name === objPath[0])) {
      const existProp: any = originAst.find(
        (o: any) => o.key.name === objPath[0]
      );
      //判断存在键的值的类型是否为object
      if (existProp?.value?.type !== 'ObjectExpression') {
        throw new Error(
          'ERROR: There are duplicates in the locale, please check the data!'
        );
      }
      //继续往下层查找, 拿到 path 最后一层时的返回值
      const item = addProp(objPath.slice(1), value, existProp.value.properties);
      const tmp = originAst.slice();
      //进行替换操作
      tmp.forEach((o: any) => {
        if (o.key.name === objPath[0]) {
          o.value.properties = item;
        }
      });
      return tmp;
    }
    //不存在相同键时
    const ast = t.objectProperty(
      t.identifier(objPath[0]),
      t.objectExpression(addProp(objPath.slice(1), value))
    );
    return [...originAst, ast];
  };
  let properties = Array.isArray(origin) ? origin.slice() : origin;
  localeInfo.forEach((info: any) => {
    //递归入口
    properties = addProp(info.path, info.value, properties);
  });
  return properties;
};
```

最后拿到新的 `AST` 后进行替换然后转换为字符串格式并写入文件即可.

### 5. 新增语言包

对要写入的语言包文件进行是否存在判断, 若不存在, 则创建新文件, 并将其导入添加至当前目录下的 `index.ts 或 index.js` 文件中.

举个栗子:

![example](https://raw.githubusercontent.com/LZS911/LZS911.github.io/main/assets/images/vite-plugin/watch-i18/example/new.gif)

具体实现也是通过对 `AST` 节点的操作, 直接放代码.

```typescript
const addLocaleImport = ({ localeDir, fileName, isTs }: any) => {
  try {
    const root = isTs
      ? path.resolve(path.join('src', localeDir), 'index.ts')
      : path.resolve(path.join('src', localeDir), 'index.js');

    if (!existsSync(root)) {
      throw new Error('The default export language pack file was not found!');
    }

    const code =
      readFileSync(root, 'utf-8') || `export default {translation:{}}`;
    const ast = isTs
      ? parseSync(code, {
          presets: [require('@babel/preset-typescript').default],
          filename: root,
        })
      : parseSync(code, {});
    traverse(ast, {
      //添加import语句
      Program(_path) {
        _path.unshiftContainer(
          'body',
          t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(fileName))],
            t.stringLiteral(`./${fileName}`)
          )
        );
      },
      //添加导出对象
      ExportDefaultDeclaration(_path) {
        const properties = (_path.node.declaration as any).properties.slice();
        properties[0].value.properties.push(
          t.objectProperty(t.identifier(fileName), t.identifier(fileName))
        );
        _path.replaceWith(
          t.exportDefaultDeclaration(t.objectExpression(properties))
        );
        _path.skip();
      },
    });
    //写入文件
    writeFile(
      root,
      !!ast
        ? generator(ast, { jsescOption: { minimal: true } })?.code ?? ''
        : ''
    );
  } catch (error) {
    console.trace(red(error));
  }
};
```

## 总结

---

以上代码便使用 `babel` 实现了一个简单的 `vite` 插件, 它可以在工作中或者在平时编码中自动添加语言包, 提高编码效率.

之前有看到尤雨溪的一篇[采访](https://mp.weixin.qq.com/s?src=11&timestamp=1637831843&ver=3458&signature=0YFjtA3N5CYF9IPtO30ywCaa4ti5J*zPSuiUyckkYr9gEFbFgEmqFrYZpAm*FgxTlIqPoUWTLxzGd6xikJ0JHjNtaA0511q5C7k3S7NXC*vpMvVIW2QeKbK-p2gCGBmr&new=1), 里面一段内容使我感触很深, 也是这个插件诞生的初衷. 希望以后能以此为初心, 一直坚持下去 ✊.

> 如果想要跳出这种单纯做业务的状态，就得去寻找在当前的业务场景下，是否有更有意义、更有价值的这些问题去解决，或者说有没有什么机会可以让团队的效率更高，或者说业务上有什么痛点可以用我的技术去解决。前端在整个产品里面扮演着一个怎样的角色，有没有什么机会在前端这个环节给整个链路去创造一些价值。
>
> 如果能找到这样的东西，如何跟我擅长的技术去结合起来，或者说我觉得这个东西很值得解决，我通过怎样的学习可以让自己能够去解决这个问题。找到更高、更明确的目标，这样在学习的时候会更有指向性。还有另一种选择，如果你发现你所在的岗位完全没有任何可以用前端去创造改变的可能性，那么可以跳个槽，提升一下技术能力，进大厂找找机会。

最后附上项目地址: <https://github.com/LZS911/vite-plugin-watch-i18>
