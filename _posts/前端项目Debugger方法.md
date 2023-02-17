---
title: 前端项目Debugger方法
date: "2023-02-16"
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

## 1. Console

`console` 对象提供了浏览器控制台调试的接口, 能够直接将内容输出在浏览器控制台上, 类似 c 语言中的 `printf`. 同时 `node.js` 也提供了 `node:console` 模块, 效果与浏览器类似. 具体 Api 介绍:

* [Web](https://developer.mozilla.org/zh-CN/docs/Web/API/Console)
* [Node.js](https://nodejs.org/api/console.html)

## 2. 浏览器开发者工具

当我们调试一个 web 项目时, 我们可以使用浏览器自带的 developer tools, 这里我们以 chrome 为例:

![example-1](/assets/debugger_methods/example-1.gif)

## 3. vscode Debugger

vscode 提供了 “Run and Debug” 视窗, 默认情况它长这个样:

![example-2](/assets/debugger_methods/example-2.png)

这里我们点击 `create launch.json file` 来创建一个配置文件后即可开始调试. 具体配置见: <https://code.visualstudio.com/docs/editor/debugging#_run-and-debug-view>

接下来看下使用 Debug 视窗调试一个 node 项目会带来哪些提升.

### 1. Breakpoint

当我们开始调试并设置断点后可以看到以下画面:

![example-2](/assets/debugger_methods/example-3.png)

设置断点后我们可以更方便的观察到运行环境中的变量以及一些全局方法和全局变量, 并且可以以更高的效率去阅读一些项目源码.

### 2. LogPoint

添加 LogPoint 后, 当执行到该处时, 便会在 debug 控制台输出 log 信息, 在实现 console 功能的同时无需修改代码.

![example-2](/assets/debugger_methods/example-4.gif)

### 3. Debugger Web项目

除了 node 项目, vscode Debugger 同时也是可以调试一个 web 项目. 同样, 我们需要创建一个 `launch.json` 文件, 环境我们这里以 chrome 为例. 创建配置文件将 url 的值配置为开发环境下项目的地址, 我们便可以开始 Debugger 一个 web 项目了.

![example-2](/assets/debugger_methods/example-5.png)

当我们开始调试时, vscode 会帮助我们新开一个 chrome 窗口, 我们在这个窗口下的操作都触发我们添加的 Breakpoint 以及 LogPoint.

![example-2](/assets/debugger_methods/example-6.gif)

## 4. 在调试过程中融入自动化操作

当我们在开发项目业务逻辑, 特别是长表单提交逻辑时, 每次调试都需要填一大堆东西, 并且在开始调试时, 都先需要进行登录操作, 然后进入到开发页面进行操作, 这个操作还是比较繁琐的. 这个时候我们是否能通过自动脚本在调试时自动执行这一部分流程呢?

### 1. 选择一个自动化工具

这里我们选择 [Puppeteer](https://github.com/puppeteer/puppeteer). Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome. 和我们的调试环境完美适配, 接下来看怎样将其融合进调试流程中.

### 2. 将 Puppeteer 融合进调试流程

首先来看一下一段 node 脚本:

```javascript
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 0,
      height: 0,
    },
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:4546/login");
  await page.waitForSelector("#emailAddress");

  const $emailAddress = await page.$("#emailAddress");
  await $emailAddress.type("demo@gmail.com", {
    delay: 100,
  });

  const $password = await page.$("#password");
  await $password.type("123456", {
    delay: 100,
  });

  const $button = await page.$('button[type="submit"]');
  await $button.click();
})();
```

使用 Puppeteer 启动一个 chrome 窗口, headless 设置为 false 表示需要显示窗口, 同时设置视窗宽高. 打开新页面, 将其导航至指定的地址, 等待 `#emailAddress` 元素出现后, 输入邮箱地址和密码, 点击提交按钮.

现在我们成功执行了一段浏览器自动化脚本, 但是存在一个问题: vscode debug 打开的 chrome 视窗与 Puppeteer 打开的并不相同, 在 Puppeteer 执行自动化脚本时, 并不会进入 vscode 中的 Breakpoint, 有没有办法使它们使用同一个chrome 视窗呢?

现在我们回到调试的配置文件, 其中有一个关键字段: request, 它有两个值, `Launch` 以及 `Attach`, 创建后的默认值为 `Launch`, 其代表调试时新开一个窗口, 而 `Attach` 表示附加到某一浏览器中. 具体解释见: <https://code.visualstudio.com/Docs/editor/debugging#_launch-versus-attach-configurations>

现在我们便可等 Puppeteer 新开窗口后, 将调试进程附加到上面, 便可以进行融合了, 我们来具体试一下:

修改 Puppeteer 脚本:

```javascript
const puppeteer = require("puppeteer");
const readline = require("readline");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 0,
      height: 0,
    },
    debuggingPort: 9222,
  });

  const page = await browser.newPage();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", async (str) => {
    if (str === "login") {
      await login(page);
    }
    if (str === "operationRecord") {
      await testOperationRecord(page);
    }
  });
})();

const login = async (page) => {
  await page.goto("http://localhost:4546");
  await page.waitForSelector("#emailAddress");
  const $emailAddress = await page.$("#emailAddress");
  await $emailAddress.type("demo@gmail.com", {
    delay: 100,
  });

  const $password = await page.$("#password");
  await $password.type("123456", {
    delay: 100,
  });

  const $button = await page.$('button[type="submit"]');
  await $button.click();
};
```

同时更改 `launch.file`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-chrome",
      "request": "attach",
      "port": 9222,
      "name": "Launch Chrome against localhost",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

最终效果如下:

![example-2](/assets/debugger_methods/example-7.gif)
