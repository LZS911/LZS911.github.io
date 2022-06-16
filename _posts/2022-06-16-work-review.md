---
title: work review
layout: post
date: "2022-06-16"
image: 
headerImage: false
tag:
- istanbul
- babel
- javascript
star: true
category: blog
author: LZS_911
description: blog
---


## [前端代码覆盖率](<https://juejin.cn/post/7022928631756226591>)

实现代码插桩插件: `babel-plugin-istanbul`

### 具体方案

1. 确定当前环境是否需要收集代码覆盖率

2. 加载 `babel-plugin-istanbul` 插件, 获得覆盖率(一般保存在 `window.__coverage__` 中)

3. 上传覆盖率到服务端

4. 服务端展示

这里重点主要放在前三步, 实现方案

### `webpack` 项目方案

1. 在启动服务或者打包时(`start、build`)时添加自定义 `options`, 然后再通过 `process.argv` 判断是否存在该 `options`

    ```json
    "scripts": {
       "coverage-build": "node scripts/build.js --coverageReport=true",
    }
    ```

2. 正常的加载 `babel` 插件模式, 需要判断当前环境是否为收集覆盖率环境

   ```javascript
    if (isCoverageReport) {
      babelPlugins.push([
        'istanbul',
        {
          exclude: ['./node_modules/*'],
        },
      ]);
    }
   ```

3. 轮询调用接口上传 `window.__coverage__` 中的内容, 同样需要注意的是只有在收集覆盖率环境中才会执行这段代码

    ```javascript
   module.exports = {
      entry: [
        isCoverageReport && require.resolve('../coverageScript'), //上传覆盖率代码
        appIndexJs //项目入口文件
      ]
    };
    ```

### `vite` 项目方案

1. 利用 `vite` 的 [mode options](https://cn.vitejs.dev/guide/env-and-mode.html), 指定当前环境的 `mode`, 在 `vite.config.js` 中判断当前 `mode`.

   ```javascript
   export default defineConfig((config) => {
     var isCoverage = config.mode === 'coverage';
     var isDebug = config.mode === 'development';
     var isProduction = config.mode === 'production';
   
     return {
       //....
     }
   }
   ```

2. 同样是正常的加载 `babel` 插件

     ```javascript
     //....
     return {
       //...
        plugins: [
           react({
             babel: {
               plugins: isCoverage ? ['istanbul'] : [],
             },
           })
        ]
     }
     ```

3. 虽然 `vite.config` 中也提供了 `rollupOptions` , 能够类似 `webpack` 中自定义指定入口文件, 但是 `vite` 的开发服务器使用的 `esBuild`, 这样便没法使用开发环境测试在不同的环境中是否有加载上传覆盖率的代码. 所以, 这里可以换个思路使用条件编译来实现该需求.

    一个简单的 `vite` 实现条件编译的插件 <https://www.npmjs.com/package/vite-plugin-conditional-compile>

    最后只需要在项目入口文件中添加该段代码即可

    ``` javascript
        /* IFTRUE_isCoverage */
        import '../scripts/coverageScript';
        /*FITRUE_isCoverage*/
    ```

## 鼠标移到表格的操作列的更多按钮的下拉时依然保持 hover 效果

主要思路: 将下拉菜单与表格当前行绑定, 下拉菜单打开时给当前行设置 class, 让其具有 hover 效果.

第一个思路:

  设置一个 `currentHoverData` 的状态, 当 `dropdown` 打开时设置成当前行数据, 关闭时置成 `null`, 再通过表格的 `rowClassName` 来给每一行数据设置一个 `class`, 若当前行数据与 `currentHoverData` 能匹配上则给其具有 `hover` 效果的 `class`, 来实现鼠标移走后也能有 `hover` 效果.

  弊端:

  1. 显而易见的缺陷是当表格数据量过大时, 每一行数据都要去进行计算, 造成性能问题.
  2. 因为下拉菜单的组件中并没有办法获取当前行数据, 只能去修改所有页面的 `tableHeader.tsx`文件, 这也太蠢了...

第二个思路:
  
  主题思路没有发生变化, 主要的变化是怎样将当前打开的这个下拉菜单与当前行绑定. 这里使用的是通过 `element` 之间的联系来进行绑定.
  
  找到下拉菜单与表格行的公共元素, 即触发下拉菜单显示的按钮, 它是存在于表格行中的. 通过找该元素的第一个节点类型是 `TR` 的父节点, 该元素即为需要显示 `hover` 效果的当前列, 后续给其添加 `class` 即可.

在处理这个需求一直想的是怎样通过 **数据** 来将下拉菜单与表格行数据进行绑定, 并没有去考虑使用 `javascript` 的一些操作元素的原生方法来进行处理, 于是陷入了一个死胡同...
