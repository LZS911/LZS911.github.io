---
title: Vite 依赖预构建分析
date: "2024-04-12"
image: 
headerImage: false
star: true
category: blog
author: Ai.Haibara
excerpt: 
theme: fancy
---

## 概念

[依赖预构建](https://cn.vitejs.dev/guide/dep-pre-bundling)

>当你首次启动 vite 时，Vite 在本地加载你的站点之前预构建了项目依赖。默认情况下，它是自动且透明地完成的。

依赖预构建指的是在 DevServer 启动之前，Vite 会扫描使用到的依赖从而进行构建，之后在代码中每次导入(import)时会动态地加载构建过的依赖这一过程。

简单来说，Vite 在一开始将应用中的模块区分为 依赖 和 源码 两类：

1. 依赖部分 更多指的是代码中使用到的第三方模块，比如 react、lodash、antd 等。
Vite 将会使用 esbuild 在应用启动时对于依赖部分进行预构建依赖。
2. 源码部分 比如说平常我们书写的一个一个 js、tsx、vue 等文件，这部分代码会在运行时被编译，并不会进行任何打包。
Vite 以 原生 ESM 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作，所以 Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

## 什么是预构建
我们在使用 vite 启动项目时，会发现项目 node_modules 目录下会额外增加一个 node_modules/.vite/deps 的目录

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/da97a147-c4d0-4533-9db9-3ffac630ce34)

这个目录就是 vite 在开发环境下预编译的产物。

项目中的依赖部分： ahooks、antd、react 等部分会被预编译成为一个一个 .js 文件。

同时，.vite/deps 目录下还会存在一个 _metadata.json：

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/b703a956-64b1-44ee-918b-9c351ceea730)

_metadata.json 中存在一些特殊属性：
hash
browserHash
optimized
chunks

简单来说 vite 在预编译时会对于项目中使用到的第三方依赖进行依赖预构建，将构建后的产物存放在 node_modules/.vite/deps 目录中，比如 ahooks.js、react.js 等。

同时，预编译阶段也会生成一个 _metadata.json 的文件用来保存预编译阶段生成文件的映射关系(optimized 字段)，方便在开发环境运行时重写依赖路径。

## 为什么需要预构建

首先第一点，我们都清楚 Vite 是基于浏览器 Esmodule 进行模块加载的方式。

那么，对于一些非 ESM 模块规范的第三方库，比如 react。在开发阶段，我们需要借助预构建的过程将这部分非 esm 模块的依赖模块转化为 esm 模块。从而在浏览器中进行 import 这部分模块时也可以正确识别该模块语法。

另外一个方面，同样是由于 Vite 是基于 Esmodule 这一特性。在浏览器中每一次 import 都会发送一次请求，部分第三方依赖包中可能会存在许多个文件的拆分从而导致发起多次 import 请求。

比如 lodash-es 中存在超过 600 个内置模块，当我们执行 import { debounce } from 'lodash' 时，如果不进行预构建浏览器会同时发出 600 多个 HTTP 请求，这无疑会让页面加载变得明显缓慢。

正式通过依赖预构建，将 lodash-es 预构建成为单个模块后仅需要一个 HTTP 请求就可以解决上述的问题。

基于上述两点，Vite 中正是为了模块兼容性以及性能这两方面大的原因，所以需要进行依赖预构建。

### 依赖预构建的过程

1. 调用 npm run dev(vite) 启动开发服务器。 首先，当我们在 vite 项目中首次启动开发服务器时，默认情况下（未指定 build.rollupOptions.input/optimizeDeps.entries 情况下），Vite 抓取项目目录下的所有的(config.root) .html 文件来检测需要预构建的依赖项（忽略了node_modules、build.outDir、__tests__ 和 coverage）。
通常情况下，单个项目我们仅会使用单个 index.html 作为入口文件。
2. 分析 index.html 入口文件内容。 其次，当首次运行启动命令后。Vite 会寻找到入口 HTML 文件后会分析该入口文件中的 <script> 标签寻找引入的 js/ts 资源（图中为 /src/main.ts）。
3. 分析 /src/main.ts 模块依赖 之后，会进入 /src/main.ts 代码中进行扫描，扫描该模块中的所有 import 导入语句。这一步主要会将依赖分为两种类型从而进行不同的处理方式：
4. 对于源码中引入的第三方依赖模块，比如 lodash、react 等第三方模块。Vite 会在这个阶段将导入的第三方依赖的入口文件地址记录到内存中，简单来说比如当碰到 import antd from 'antd'时 Vite 会记录 { antd: '/Users/liyu/work/actionsky/dms-ui/dms-ui/node_modules/antd/es/index.js' }，同时会将第三方依赖当作外部(external)进行处理（并不会递归进入第三方依赖进行扫描）。
5. 对于模块源代码，就比如我们在项目中编写的源代码。Vite 会依次扫描模块中所有的引入，对于非第三方依赖模块会再次递归进入扫描。
6. 递归分析非第三方模块中的依赖引用 同时，在扫描完成 /src/main.ts 后，Vite 会对于该模块中的源码模块进行递归分析。这一步会重新进行第三步骤，唯一不同的是扫描的为 /src/App.tsx。

最终，经过上述步骤 Vite 会从入口文件出发扫描出项目中所有依赖的第三方依赖，同时会存在一份类似于如下的映射关系表： json { "antd": { // key 为引入的第三方依赖名称，value 为该包的入口文件地址 "src": "/Users/liyu/work/actionsky/dms-ui/dms-ui/node_modules/antd/es/index.js" }， // ... } 

经过上述的步骤，我们已经生成了一份源码中所有关于第三方导入的依赖映射表。 最后，Vite 会根据这份映射表调用 EsBuild 对于扫描出的所有第三方依赖入口文件进行打包。将打包后的产物存放在 node_modules/.vite/deps 文件中。 比如，源码中导入的 antd 最终会被构建为一个单独的 antd.js 文件存放在 node_modules/.vite/deps/antd.js 中。

简单来说，预构建对于第三方依赖生成 node_modules/.vite/deps 资源后。在开发环境下 vite 会“拦截”所有的 ESM 请求，将源码中对于第三方依赖的请求地址重写为我们预构建之后的资源产物，比如我们在源码中编写的 antd 导入：

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/cc104e6f-4ff5-4b76-b12b-e4ca0f54d0ba)

最终在开发环境下 Vite 会将对于第三方模块的导入路径重写为：

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/eca33bb0-3401-48c1-8d83-9689339af013)

## 简单实现

### 创建开发服务器
```typescript
//server/index.ts

import { createServer } from './create-server';

(async () => {
  const server = await createServer();

  server.listen(3434, () => {
    console.log('start server on http://127.0.0.1:3434');
  });
})();

//server/create-server.ts
import connect from 'connect';
import http from 'node:http';
import { resolveConfig } from './resolve-config';
import { staticMiddleware } from './middleware/static-middleware';

export const createServer = async () => {
  const app = connect();

  const config = await resolveConfig();
  app.use(staticMiddleware(config));

  const server = {
    async listen(port: number, callback: () => void) {
      http.createServer(app).listen(port, callback);
    },
  };
  return server;
};


//server/resolve-config.ts
import { normalizePath } from './utils/index.js';

export const resolveConfig = async () => {
  const config = {
    root: normalizePath(process.cwd()), //项目根目录
  };
  return config;
};

//server/utils/index.ts
export function normalizePath(path: string) {
  return path.replace(/\\/g, '/');
}

//server/middleware/static-middleware
import serveStatic from 'serve-static';
import { MockViteConfig } from '../resolve-config';

export const staticMiddleware = ({ root }: MockViteConfig) => {
  return serveStatic(root);
};
```

在 resolveConfig 中我们模拟了一个 config 对象进行返回，此时 config 对象是一个固定的路径：为启动服务时的 pwd 路径。

关于 root 配置项的作用：https://cn.vitejs.dev/config/shared-options.html#root

初始化配置文件后，我们再次调用 app.use(staticMiddleware(config))。 为服务使用了静态资源目录的中间件，保证启动服务时目录下的静态资源在服务上的可访问性。

接下来，我们在项目 package.json 中添加脚本：
```json
 "scripts": {
    "dev": "nodemon -e ts,tsx --exec 'node --inspect=0.0.0.0:9229 --require ts-node/register server/index.ts'" //使用 nodemon 来启动 node ts 代码，并设置9229端口来 debug 服务
 }
```

添加入口文件
```html
//index.html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    Hello vite use
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

接下来，执行 `yarn dev`， 控制台出现以下信息：
![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/f0bf73d1-2bb6-457d-9cf9-31ecfd13997b)

访问  http://127.0.0.1:3434 后效果

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/b965893b-6291-4b52-adc5-9a5f08f54175)

现在，我们的 vite-demo 便拥有了最基本的一键启动开发环境的功能。

### 解析 html 文件

我们先使用 yarn creat vite 创建一个 react 的模板项目，然后启动服务观察下浏览器 network 请求

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/01e99000-f189-4092-8e02-062f176125e6)

network 中的请求顺序分别为 index.html => main.tsx => react，这里我们先专注预构建过程忽略其他的请求以及 react.js 后边的查询参数。

当我们打开 main.tsx 查看 sourceCode 时，会发现这个文件中关于 react 的引入已经完全更换了一个路径：

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/ca4ccb45-23cc-4be9-8926-e0607846cdba)

前边我们说过 vite 在启动开发服务器时对于第三方依赖会进行预构建的过程， 这里，/node_modules/.vite/deps/react.js 正是启动开发服务时 react 的预构建产物。

接下来打开源码目录查看下

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/56f2df19-dfaf-404f-b755-2c938ac90c10)

启动开发服务器时，会首先根据 index.html 中的脚本分析模块依赖，将所有项目中引入的第三方依赖（这里为 react） 进行预构建。

将构建后的产物存储在 .vite/deps 目录中，同时将映射关系保存在 .vite/deps/_metadata.json 中，其中 optimized 对象中的 react 表示原始依赖的入口文件而 file 则表示经过预构建后生成的产物（两者皆为相对路径）。

之后，简单来说我们只要在开发环境下判断如果请求的文件名命中 optimized 对象的 key 时（这里为 react）则直接预构建过程中生成的文件 (file 字段对应的文件路径即可）。

接下来，我们来尝试自己实现这一步骤。

首先，让我们从寻找 index.html 中出发：

```typescript
// server/resolve-config.ts

import { normalizePath } from './utils/index';
import path from 'path';

export type MockViteConfig = {
  root: string;
};

export const resolveConfig = async () => {
  const config = {
    root: normalizePath(process.cwd()),
    entryPoints: [path.resolve('index.html')], // 增加一个 entryPoints 文件
  };
  return config;
};
```
这里，我们在之前的基础上添加了 entryPoints， 用来设置项目的入口文件。

```typescript
// server/create-server.ts

import connect from 'connect';
import http from 'node:http';
import { MockViteConfig, resolveConfig } from './resolve-config';
import { staticMiddleware } from './middleware/static-middleware';
import { createOptimizeDepsRun } from './optimizer';

export const createServer = async () => {
  const app = connect();

  const config = await resolveConfig();
  app.use(staticMiddleware(config));

  const server = {
    async listen(port: number, callback: () => void) {
      // 启动服务之前进行预构建
      await runOptimize(config);

      http.createServer(app).listen(port, callback);
    },
  };
  return server;
};

async function runOptimize(config: MockViteConfig) {
  await createOptimizeDepsRun(config);
}
```
上边我们对于 server/create-server.ts 中 createServer 方法进行了修改，在 listen 启动服务之前增加了 runOptimize 方法的调用。

所谓 runOptimize 方法正是在启动服务之前的预构建函数。可以看到在 runOptimize 中调用了一个 createOptimizeDepsRun 方法。

接下来，我们要实现这个 createOptimizeDepsRun 方法。这个方法的核心思路正是我们希望借助 Esbuild 在启动开发服务器前对于整个项目进行扫描，寻找出项目中所有的第三方依赖进行预构建。

新建一个 /server/optimizer/index.ts 文件：
```typescript
import { MockViteConfig } from '../resolve-config';
import { scanImports } from './scan';

/**
 * 分析项目中的第三方依赖
 * @param {*} config
 */
async function createOptimizeDepsRun(config: MockViteConfig) {
  // 通过 scanImports 方法寻找项目中的所有需要预构建的模块
  const deps = await scanImports(config);
  console.log(deps, 'deps');
}

export { createOptimizeDepsRun };
```

继续新增 /server/optimizer/scan.ts 以及 /server/optimizer/scan-plugin.ts

```typescript
// server/optimizer/scan.ts 
import { build } from 'esbuild';
import { MockViteConfig } from '../resolve-config';
import { esbuildScanPlugin } from './scan-plugin';

/**
 * 分析项目中的 Import
 * @param {*} config
 */
async function scanImports(config: MockViteConfig) {
  // 保存扫描到的依赖（暂时还未用到）
  const desImports = {};

  // 创建 Esbuild 扫描插件（这一步是核心）
  const scanPlugin = await esbuildScanPlugin();
  // 借助 EsBuild 进行依赖预构建
  await build({
    absWorkingDir: config.root, // esbuild 当前工作目录
    entryPoints: config.entryPoints, // 入口文件
    bundle: true, // 是否需要打包第三方依赖，默认 Esbuild 并不会，这里我们声明为 true 表示需要
    format: 'esm', // 打包后的格式为 esm
    write: false, // 不需要将打包的结果写入硬盘中
    plugins: [scanPlugin], // 自定义的 scan 插件
  });
}

export { scanImports };


// server/optimizer/scan-plugin.ts
import nodePath from 'path';
import fs from 'fs-extra';
import { Plugin } from 'esbuild';

const htmlTypesReg = /(\.html)$/;

const scriptModuleReg = /<script\s+type="module"\s+src\="(.+?)">/;

function esbuildScanPlugin(): Plugin {
  return {
    name: 'ScanPlugin',
    setup(build) {
      // 引入时处理 HTML 入口文件
      build.onResolve({ filter: htmlTypesReg }, async ({ path, importer }) => {
        // 将传入的路径转化为绝对路径 这里简单先写成 path.resolve 方法
        const resolved = await nodePath.resolve(path);
        if (resolved) {
          return {
            path: resolved,
            namespace: 'html',
          };
        }
      });

      // 当加载命名空间为 html 的文件时
      build.onLoad(
        { filter: htmlTypesReg, namespace: 'html' },
        async ({ path }) => {
          // 将 HTML 文件转化为 js 入口文件
          const htmlContent = fs.readFileSync(path, 'utf-8');
          console.log(htmlContent, 'htmlContent'); // htmlContent 为读取的 html 字符串
          const [, src] = htmlContent.match(scriptModuleReg)!;
          console.log('匹配到的 src 内容', src); // 获取匹配到的 src 路径：/main.js
          const jsContent = `import ${JSON.stringify(src)}`;
          return {
            contents: jsContent,
            loader: 'js',
          };
        }
      );
    },
  };
}

export { esbuildScanPlugin };

```

Esbuild 在进行构建时会对每一次 import 语句匹配插件的 build.onResolve 钩子，匹配的规则核心为两个参数，分别为：

filter: 该字段可以传入一个正则表达式，Esbuild 会为每一次导入的路径与该正则进行匹配，如果一致则认为通过，否则则不会进行该钩子。
namespace: 每个模块都有一个关联的命名空间，默认每个模块的命名空间为 file （表示文件系统），我们可以显示声明命名空间规则进行匹配，如果一致则认为通过，否则则不会进行该钩子。

上述的 scanPlugin 的核心思路为：

当运行 build 方法时，首先入口文件地址会进入 ScanPlugn 的 onResolve 钩子。

此时，由于 filter 的正则匹配为后缀为 .html，并不存在 namespace(默认为 file)。则此时，index.html 会进入 ScanPlugin 的 onResolve 钩子中。

在 build.onResolve 中，我们先将传入的 path 转化为磁盘上的绝对路径，将 html 的绝对路径进行返回，同时修改入口 html 的 namespace 为自定义的 html。

需要注意的是如果同一个 import （导入）如果存在多个 onResolve 的话，会按照代码编写的顺序进行顺序匹配，如果某一个 onResolve 存在返回值，那么此时就不会往下继续执行其他 onResolve 而是会进行到下一个阶段(onLoad)，Esbuild 中其他 hook 也同理。

之后，由于我们在 build.onResolve 中对于入口 html 文件进行了拦截处理，在 onLoad 钩子中依然进行匹配。

onLoad 钩子中我们的 filter 规则同样为 htmlTypesRe,同时增加了匹配 namespace 为 html 的导入。

此时，我们在上一个 onResove 返回的 namspace 为 html 的入口文件会进行该 onLoad 钩子。

build.onLoad 该钩子的主要作用加载对应模块内容，如果 onResolve 中返回 contents 内容，则 Esbuild 会将返回的 contents 作为内容进行后续解析（并不会对该模块进行默认加载行为解析），否则默认会为 namespace 为 file 的文件进行 IO 读取文件内容。

我们在 build.onlod 钩子中，首先根据传入的 path 读取入口文件的 html 字符串内容获得 htmlContent。

之后，我们根据正则对于 htmlContent 进行了截取，获取 <script type="module" src="/main.js />" 中引入的 js 资源 /main.js。

此时，虽然我们的入口文件为 html 文件，但是我们通过 EsbuildPlugin 的方式从 html 入口文件中截取到了需要引入的 js 文件。

之后，我们拼装了一个 import "/main.js" 的 jsContent 在 onLoad 钩子函数中进行返回，同时声明该资源类型为 js。

简单来说 Esbuild 中内置部分文件类型，我们在 plugin 的 onLoad 钩子中通过返回的 loader 关键字来告诉 Esbuild 接下来使用哪种方式来识别这些文件。

此时，Esbuil 会对于返回的 import "/main.js" 当作 JavaScript 文件进行递归处理，这样也就达成了我们解析 HTML 文件的目的。

我们来回过头稍微总结下，之所以 Vite 中可以将 HTML 文件作为入口文件。

其实正是借助了 Esbuild 插件的方式，在启动项目时利用 Esbuild 使用 HTML 作为入口文件之后利用 Plugin 截取 HTML 文件中的 script 脚本地址返回，从而寻找到了项目真正的入口 js 资源进行递归分析。

### 递归解析 JS 文件

现在我们已经可以通过 HTML 文件寻找到引入的 /main.js 了，那么接下来自然我们需要对 js 文件进行递归分析寻找项目中需要被依赖预构建的所有模块。

递归寻找需要被预构建的模块的思路同样也是通过 Esbuild 中的 Plugin 机制来实现，简单来说我们会根据上一步转化得到的 import "/main.js" 导入来进行递归分析。

对于 /main.js 的导入语句会分为以下两种情况分别进行不同的处理：

1. 对于 /main.js 中的导入的源码部分会进入该部分进行递归分析，比如 /main.js 中如果又引入了另一个源码模块 ./module.js 那么此时会继续进入 ./module.js 递归这一过程。
2. 对于 /main.js 中导入的第三方模块会通过 Esbuild 将该模块标记为 external ，从而记录该模块的入口文件地址以及导入的模块名。

比如 /main.js 中存在 import react from 'react'，此时首先我们会通过 Esbuild 忽略进入该模块的扫描同时我们也会记录代码中依赖的该模块相关信息。

>标记为 external 后，esbuild 会认为该模块是一个外部依赖，所以就不会进入该模块进行任何扫描。

接下来，我们继续完善上面的代码

```typescript
// server/optimizer/scan.ts
import { build } from 'esbuild';
import { MockViteConfig } from '../resolve-config';
import { esbuildScanPlugin } from './scan-plugin';

/**
 * 分析项目中的 Import
 * @param {*} config
 */
async function scanImports(config: MockViteConfig) {
  // 保存扫描到的依赖
  const desImports: Record<string, any> = {};

  // 创建 Esbuild 扫描插件（这一步是核心）
  const scanPlugin = await esbuildScanPlugin(config, desImports);
  // 借助 EsBuild 进行依赖预构建
  await build({
    absWorkingDir: config.root, // esbuild 当前工作目录
    entryPoints: config.entryPoints, // 入口文件
    bundle: true, // 是否需要打包第三方依赖，默认 Esbuild 并不会，这里声明为 true 表示需要
    format: 'esm', // 打包后的格式为 esm
    write: false, // 不需要将打包的结果写入硬盘中
    plugins: [scanPlugin], // 自定义的 scan 插件
  });

  return desImports;
}

export { scanImports };
```

完善 esbuildScanPlugin 方法：

```typescript
import fs from 'fs-extra';
import { Plugin } from 'esbuild';
import { createPluginContainer } from '../plugins/plugin-container';
import { MockViteConfig } from '../resolve-config';
import resolvePlugin from '../plugins/resolve';

const htmlTypesReg = /(\.html)$/;

const scriptModuleReg = /<script\s+type="module"\s+src\="(.+?)">/;

async function esbuildScanPlugin(
  config: MockViteConfig,
  desImports: Record<string, any>
): Promise<Plugin> {
  // 1. Vite 插件容器系统
  const container = await createPluginContainer({
    plugins: [resolvePlugin({ root: config.root })],
    root: config.root,
  });

  const resolveId = async (path: string, importer?: string) => {
    return await container?.resolveId?.(path, importer);
  };

  return {
    name: 'ScanPlugin',
    setup(build) {
      // 引入时处理 HTML 入口文件
      build.onResolve({ filter: htmlTypesReg }, async ({ path, importer }) => {
        // 将传入的路径转化为绝对路径 这里简单先写成 path.resolve 方法
        const resolved = await resolveId(path);
        if (resolved) {
          return {
            path: resolved.id,
            namespace: 'html',
          };
        }
      });

      // 当加载命名空间为 html 的文件时
      build.onLoad(
        { filter: htmlTypesReg, namespace: 'html' },
        async ({ path }) => {
          // 将 HTML 文件转化为 js 入口文件
          const htmlContent = fs.readFileSync(path, 'utf-8');
          const [, src] = htmlContent.match(scriptModuleReg)!;
          const jsContent = `import ${JSON.stringify(src)}`;
          return {
            contents: jsContent,
            loader: 'js',
          };
        }
      );

      // 2. 额外增加一个 onResolve 方法来处理其他模块(非html，比如 js 引入)
      build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
        const resolved = await resolveId(path, importer);
        if (resolved) {
          const id = resolved.id;
          if (id.includes('node_modules')) {
            desImports[path] = id;
            return {
              path: id,
              external: true,
            };
          }
          return {
            path: id,
          };
        }
      });
    },
  };
}

export { esbuildScanPlugin };

```

新增 /plugins/plugin-container 文件

```typescript
import { PluginContainer } from 'vite';
import { normalizePath } from '../utils';

/**
 * 创建 Vite 插件容器
 * Vite 中正是自己实现了一套所谓的插件系统，可以完美的在 Vite 中使用 RollupPlugin。
 * @param plugin 插件数组
 * @param root 项目根目录
 */
async function createPluginContainer({ plugins }: any) {
  const container: Partial<PluginContainer> = {
    /**
     * ResolveId 插件容器方法
     * @param {*} path
     * @param {*} importer
     * @returns
     */
    async resolveId(path: string, importer?: string) {
      let resolved = path;
      for (const plugin of plugins) {
        if (plugin.resolveId) {
          const result = await plugin.resolveId(resolved, importer);
          if (result) {
            resolved = result.id || result;
            break;
          }
        }
      }
      return {
        id: normalizePath(resolved),
      };
    },
  };

  return container;
}

export { createPluginContainer };

```

新增 /plugins/resolve.ts

```typescript
import os from 'os';
import path from 'path';
import resolve from 'resolve';
import fs from 'fs';
import { MockViteConfig } from '../resolve-config';

const windowsDrivePathPrefixRE = /^[A-Za-z]:[/\\]/;

const isWindows = os.platform() === 'win32';

// 裸包导入的正则
const bareImportRE = /^(?![a-zA-Z]:)[\w@](?!.*:\/\/)/;

/**
 * 这个函数的作用就是寻找模块的入口文件
 * 这块我们简单写，源码中多了 exports、imports、main、module、yarn pnp 等等之类的判断
 * @param {*} id
 * @param {*} importer
 */
function tryNodeResolve(id: string, importer: string, root: string) {
  const pkgDir = resolve.sync(`${id}/package.json`, {
    basedir: root,
  });
  const pkg = JSON.parse(fs.readFileSync(pkgDir, 'utf-8'));
  const entryPoint = pkg.module ?? pkg.main;
  const entryPointsPath = path.join(path.dirname(pkgDir), entryPoint);
  return {
    id: entryPointsPath,
  };
}

function withTrailingSlash(path: string) {
  if (path[path.length - 1] !== '/') {
    return `${path}/`;
  }
  return path;
}

/**
 * path.isAbsolute also returns true for drive relative paths on windows (e.g. /something)
 * this function returns false for them but true for absolute paths (e.g. C:/something)
 */
export const isNonDriveRelativeAbsolutePath = (p: string) => {
  if (!isWindows) return p[0] === '/';
  return windowsDrivePathPrefixRE.test(p);
};

/**
 * 寻找模块所在绝对路径的插件
 * 既是一个 vite 插件，也是一个 Rollup 插件
 * @param {*} param0
 * @returns
 */
function resolvePlugin({ root }: Pick<MockViteConfig, 'root'>) {
  // 相对路径
  // window 下的 /
  // 绝对路径
  return {
    name: 'vite:resolvePlugin',

    async resolveId(id: string, importer: string) {
      // 如果是 / 开头的绝对路径，同时前缀并不是在该项目（root） 中，那么 vite 会将该路径当作绝对的 url 来处理（拼接项目所在前缀）
      // /foo -> /fs-root/foo
      if (id[0] === '/' && !id.startsWith(withTrailingSlash(root))) {
        const fsPath = path.resolve(root, id.slice(1));
        return fsPath;
      }

      // 相对路径
      if (id.startsWith('.')) {
        const basedir = importer ? path.dirname(importer) : process.cwd();
        const fsPath = path.resolve(basedir, id);

        return {
          id: fsPath,
        };
      }

      // drive relative fs paths (only windows)
      if (isWindows && id.startsWith('/')) {
        // 同样为相对路径
        const basedir = importer ? path.dirname(importer) : process.cwd();
        const fsPath = path.resolve(basedir, id);
        return {
          id: fsPath,
        };
      }

      // 绝对路径
      if (isNonDriveRelativeAbsolutePath(id)) {
        return {
          id,
        };
      }

      // bare package imports, perform node resolve
      if (bareImportRE.test(id)) {
        // 寻找包所在的路径地址
        const res = tryNodeResolve(id, importer, root);
        return res;
      }
    },
  };
}

export default resolvePlugin;

```

我们来一步一步分析上述增加的代码逻辑：

首先，我们为 esbuildScanPlugin 额外增加了一个 build.onResolve 来匹配任意路径文件。

对于入口的 html 文件，它会匹配我们最开始 filter 为 htmlTypesReg 的 onResolve 勾子来处理。而对于上一步我们从 html 文件中处理完成后的入口 js 文件(/main.js)，以及 /main.js 中的其他引入，比如 ./module.js 文件并不会匹配 htmlTypesReg 的 onResolve 钩子则会继续走到我们新增的 /.*/ 的 onResolve 钩子匹配中。

同时，这里我们把之前 onResolve 钩子中的 nodePath.resolve 方法变成了 resolveId(path, importer) 方法。

所谓的 resolveId 则是通过在 esbuildScanPlugin 中首先创建了一个 pluginContainer 容器，之后声明的 resolveId 方法正是调用了我们创建的 pluginContainer 容器的 resolveId 方法。(server/plugin/plugin-container.js)。

我们要理解 pluginContainer 的概念，首先要清楚在 Vite 中实际上在开发环境会使用 Esbuild 进行预构建在生产环境上使用 Rollup 进行打包构建。

通常，我们会在 vite 中使用一些 vite 自身的插件也可以直接使用 rollup 插件，这正是 pluginContainer 的作用。

Vite 中会在进行文件转译时通过创建一个所谓的 pluginContainer 从而在 pluginContainer 中使用一个类似于 Adaptor 的概念。

它会在开发/生产环境下对于文件的导入调用 pluginContainer.resolveId 方法，而 pluginContainer.resolveId 方法则会依次调用配置的 vite/Rollup 插件的 ResolveId 方法。

>当然，开发环境下对于文件的转译（比如 tsx、vue 等文件的转译）正是通过 pluginContainer 来完成的，这篇文章重点在于预构建的过程所以我们先不对于其他方面进行拓展。

上述 esbuildScanPlugin 会返回一个 Esbuild 插件，然后我们在 Esbuild 插件的 build.onResolve 钩子中实际调用的是 pluginContainer.resolveId 来处理。

其实这就是相当于我们在 Esbuild 的预构建过程中调用了 VitePlugin。

同时，我们在调用 createPluginContainer 方法时传入了一个默认的 resolvePlugin，所谓的 resolvePlugin 实际是一个 Vite 插件。

resolvePlugin(src/plugins/resolve.js) 的作用就是通过传入的 path 以及 importer 获取去引入模块在磁盘上的绝对路径。

>源码中 resolvePlugin 边界处理较多，比如虚拟模块的处理，yarn pnp、symbolic link 等一系列边界场景处理，这里我稍微做了简化，我们清楚该插件是一个内置插件用来寻找模块绝对路径的即可。

我们重新来梳理下上述流程：

1. 首先会创建 pluginContainer ，这个容器是 vite 内置实现的插件系统。
2. 之后，Esbuild 会对于入口 html 文件进行处理调用 scanPlugin 的第一个 onResolve 钩子。
3. 在第一个 onResolve 钩子由于 html 会匹配 htmlTypesReg 的正则所以进入该钩子。该 onResolve 方法会调用 Vite 插件容器(pluginContainer)的 resolvedId 方法，通过 Esbuild 插件的 onResolve 来调用 Vite 插件的 ResolveId 方法，从而获得 html 入口文件的绝对路径。
4. 之后在 Esbuild 的 onLoad 方法中截取该 html 中的 script 标签上的 src 作为模块返回值(js 类型)交给 Esbuild 继续处理(import "/main.js")。
5. 在之后，Esbuild 会处理 "/main.js" 的引入，由于第一个 onResolve 已经不匹配所以会进入第二个 onResolve 钩子，此时会进行相同的步骤调用 VitePlugin 获得该模块在磁盘上的绝对路径。

最后，我们会判断返回的路径是否包含 node_modules，如果包含则认为它是一个第三方模块依赖。

此时，我们会通过 esBuild 将该模块标记为 external: true 忽略进行该模块内部进行分析，同时在 desImports 中记录该模块的导入名以及绝对路径。

如果为一个非第三方模块，比如 /main.js 中引入的 ./module.js，那么此时我们会通过 onResolve 返回该模块在磁盘上的绝对路径。

Esbuild 会继续进入插件的 onLoad 进行匹配，由于 onLoad 的 filter 以及 namesapce 均为 htmlTypesRe 所以并不匹配，默认 Esbuild 会在文件系统中寻找该文件地址根据文件后缀名称进行递归分析。

这样，最终就达到了我们想要的结果。当我们启动服务后，会发现控制台中会打印：

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/686f80bc-8432-4810-b1d2-16a2623c5ac9)


### 生成预构建产物

上边的步骤我们借助 Esbuild 以及 scanPlugin 已经可以在启动 Vite 服务之前完成依赖扫描获得源码中的所有第三方依赖模块。

接下来我们需要做的，正是对于刚刚获取到的 deps 对象中的第三方模块进行构建输出经过预构建后的文件以及一份资产清单 _metadata.json 文件。

首先，我们先对于 server/resolve-config.js 配置文件进行简单的修改：

```typescript
import resolve from 'resolve';
import { normalizePath } from './utils/index';
import path from 'path';

export type MockViteConfig = {
  root: string;
  entryPoints: string[];
  cacheDir: string;
};

/**
 * 寻找所在项目目录（实际源码中该函数是寻找传入目录所在最近的包相关信息）
 * @param {*} basedir
 * @returns
 */
function findNearestPackageData(basedir: string) {
  // 原始启动目录
  const originalBasedir = basedir;
  const pckDir = path.dirname(resolve.sync(`${originalBasedir}/package.json`));
  return path.resolve(pckDir, 'node_modules', '.mock-vite');
}

export const resolveConfig = async () => {
  const config: MockViteConfig = {
    root: normalizePath(process.cwd()),
    entryPoints: [path.resolve('index.html')],
    cacheDir: findNearestPackageData(normalizePath(process.cwd())), // 增加一个 cacheDir 目录
  };
  return config;
};
```

我们对于 config.js 中的 config 配置进行了修改，简单增加了一个 cacheDir 的配置目录。

这个目录是用于当生成预构建文件后的存储目录，这里我们固定写死为当前项目所在的 node_modules 下的 .custom-vite 目录。

之后，我们在回到 server/optimizer/index.js 中添加 createCatchDir 函数：

```typescript
import { MockViteConfig } from '../resolve-config';
import { scanImports } from './scan';
import path from 'path';
import fs from 'fs-extra';

/**
 * 分析项目中的第三方依赖
 * @param {*} config
 */
async function createOptimizeDepsRun(config: MockViteConfig) {
  // 通过 scanImports 方法寻找项目中的所有需要预构建的模块
  const deps = await scanImports(config);
  console.log(deps, 'deps');

  createCatchDir(config, deps);
}

async function createCatchDir(
  config: MockViteConfig,
  deps: Record<string, any>
) {
  // 创建缓存目录
  const { cacheDir } = config;
  const depsCacheDir = path.resolve(cacheDir, 'deps');
  // 创建缓存对象 （_metaData.json）
  const metadata: { optimized: Record<string, any> } = {
    optimized: {},
  };
  for (const dep in deps) {
    // 获取需要被依赖预构建的目录
    const entry = deps[dep];
    metadata.optimized[dep] = {
      src: entry, // 依赖模块入口文件（相对路径）
      file: path.resolve(depsCacheDir, dep + '.js'), // 预编译后的文件（绝对路径）
    };
  }
  // 将缓存文件写入文件系统中
  await fs.ensureDir(depsCacheDir);
  await fs.writeFile(
    path.resolve(depsCacheDir, '_metadata.json'),
    JSON.stringify(
      metadata,
      (key, value) => {
        if (key === 'file' || key === 'src') {
          // 注意写入的是相对路径
          return path.relative(depsCacheDir, value);
        }
        return value;
      },
      2
    )
  );
}

export { createOptimizeDepsRun };
```

在 server/optimizer/index.js 中，之前我们已经通过 scanImports 方法拿到了 deps 对象：

```json
{
  react: '/Users/liyu/code/vite/vite-demo/vite-pre-build-dep-demo/node_modules/react/index.js'
} 
```

然后，我们从 config 对象中拿到了 depsCacheDir 拼接上 deps 目录，得到的是存储预构建资源的目录。

同时创建了一个名为 metadata 的对象，遍历生成的 deps 为 metadata.optimize 依次赋值，经过 for of 循环后所有需要经过依赖预构建的资源全部存储在 metadata.optimize 对象中，这个对象的结构如下：

```json
{
  optimized: {
    react: {
      src: '/Users/liyu/code/vite/vite-demo/vite-pre-build-dep-demo/node_modules/react/index.js',
      file: '/Users/liyu/code/vite/vite-demo/vite-pre-build-dep-demo/node_modules/.mock-vite/deps/react.js'
    }
  }
}
```

>需要注意的是，我们在内存中存储的 optimize 全部为绝对路径，而写入硬盘时的路径全部为相对路径。

接下来，我们修改 server/optimizer/index.ts

```typescript
import { MockViteConfig } from '../resolve-config';
import { scanImports } from './scan';
import path from 'path';
import fs from 'fs-extra';
import { build } from 'esbuild';

/**
 * 分析项目中的第三方依赖
 * @param {*} config
 */
async function createOptimizeDepsRun(config: MockViteConfig) {
  // 通过 scanImports 方法寻找项目中的所有需要预构建的模块
  const deps = await scanImports(config);
  console.log(deps, 'deps');

  createCatchDir(config, deps);
}

async function createCatchDir(
  config: MockViteConfig,
  deps: Record<string, any>
) {
  // 创建缓存目录
  const { cacheDir } = config;
  const depsCacheDir = path.resolve(cacheDir, 'deps');
  // 创建缓存对象 （_metaData.json）
  const metadata: { optimized: Record<string, any> } = {
    optimized: {},
  };
  for (const dep in deps) {
    // 获取需要被依赖预构建的目录
    const entry = deps[dep];
    metadata.optimized[dep] = {
      src: entry, // 依赖模块入口文件（相对路径）
      file: path.resolve(depsCacheDir, dep + '.js'), // 预编译后的文件（绝对路径）
    };
  }

  // 将缓存文件写入文件系统中
  await fs.ensureDir(depsCacheDir);
  await fs.writeFile(
    path.resolve(depsCacheDir, '_metadata.json'),
    JSON.stringify(
      metadata,
      (key, value) => {
        if (key === 'file' || key === 'src') {
          // 写入相对路径
          return path.relative(depsCacheDir, value);
        }
        return value;
      },
      2
    )
  );
  // 依赖预构建
  await build({
    absWorkingDir: process.cwd(),
    define: {
      'process.env.NODE_ENV': '"development"',
    },
    entryPoints: Object.keys(deps),
    bundle: true,
    format: 'esm',
    splitting: true,
    write: true, // 是否写入硬盘
    outdir: depsCacheDir, // 写入硬盘地址
    allowOverwrite: true,
  });
}

export { createOptimizeDepsRun };
```
在这里，我们将依赖使用 EsBuild 进行 bunled，并且写入硬盘当中。

最后，启动服务，我们可以看到 mock-vite 已被写入硬盘当中

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/f28aed53-94a6-47f2-a98e-3cc766a4e05d)

## 结尾

Vite 中依赖预构建截止这里已经分享完毕了，但是在启动服务后，在访问浏览器后会发现控制台出现下面报错：

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/0f3ed97f-b5c0-499a-82d0-751776096500)

这是因为在浏览器中，import 的语句不能直接引入一个裸包（例如这里的 react），那么 Vite 在这里又是怎样做的转换处理呢？

[关于 Vite 的 transform]()




