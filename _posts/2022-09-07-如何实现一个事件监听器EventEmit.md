---
title: 如何实现一个EventEmit?
layout: post
date: "2022-09-07"
image: 
headerImage: false
tag:
- node
- javascript
- EventEmit
star: true
category: blog
author: LZS_911
description: blog
---

## EventEmit 简介

`node.js` 所有的异步 `I/O` 操作在完成时都会发送一个事件到事件队列. 一个 `fs.readStream` 对象会在文件被打开的时候触发一个事件. 所有这些产生事件的对象都是 `events.EventEmitter` 的实例.

`EventEmit` 是 `node.js` 内置模块 `events` 提供的一个 `class`, 在 `node.js` 环境中可以直接 `require` 后使用. 在 `web` 环境中我们可以使用第三方 `npm` 包或者原生的 [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget). 当然, 也可以自己实现一个类似 `node.js` 的简易版本.

我们先来看下 `EventEmit` 的基本使用方法:

```javascript
const { EventEmitter } = require("node:events");

const event = new EventEmitter();

const fn = () => {
  console.log('event 事件触发!')
}

//为指定事件注册一个监听器
event.addListener("event", fn);

//触发监听器
event.emit("event");

//移除监听器
event.removeListener("event", fn);
```

其中, 当我们添加新的监听器时, `newListener` 事件会触发, `当监听器被移除时，removeListener` 事件被触发.

### 实现的 Api 介绍

  1. `emitter.addListener(eventName, listener)` 为指定事件注册一个监听器，接受一个 `string` (或 `symbol`) 类型的 `eventName` 和一个回调函数. 返回值为 `EventEmit` 的实例, 以便链式调用.
      * `eventName` `<string>` | `<symbol>`
      * `listener` `<Function>`
      * `Returns` `<EventEmit>`
  
  2. `emitter.emit(eventName, [...args])` 同步调用为名为 `eventName` 的事件注册的每个监听器, 按照它们注册的顺序, 将提供的参数传递给每个侦听器, 如果存在该监听器, 则返回 `True`, 否则返回 `False`
      * `eventName` `<string>` | `<symbol>`
      * `...args` `<any>`
      * `Returns` `<boolean>`
  
  3. `emitter.once(eventName, listener)` 和 `addListener` 类似, 但只触发一次, 随后便解除事件监听.

  4. `emitter.removeListener(eventName, listener)` 移除指定事件的某个监听回调.
      * `eventName` `<string>` | `<symbol>`
      * `listener` `<Function>`
      * `Returns` `<EventEmit>`

  5. `emitter.removeAllListeners([eventName])` 删除所有监听器, 或删除指定 `eventName` 的监听器.
      * `eventName` `<string>` | `<symbol>`
      * `Returns`  `<EventEmitter>`

  6. `emitter.setMaxListeners(n)` 用于修改监听器的默认限制的数量. (默认大于10个监听回调时会产生警告)
      * `n` `<integer>`
      * `Returns`  `<EventEmitter>`

  7. `emitter.getMaxListeners()` 获取限制监听器的数量

  8. `emitter.listeners(eventName)` 返回名为 `eventName` 的事件的监听器数组的副本.
      * `eventName` `<string>` | `<symbol>`
      * `Returns`  `<Function>`

  9. `emitter.listenerCount(eventName)` 返回监听名为 `eventName` 的事件的监听器数量

  10. `emitter.on` `emitter.addListener`的别名函数

  11. `emitter.off` `emitter.removeListener`的别名函数

### 构造函数

```javascript
  #maxListeners = 10;
  constructor() {
    this.listeners = Object.create(null);
    this.#maxListeners = 10;
  }
```

其中 `listeners` 的结构如下:

```JSON
{
  "event1": [f1,f2,f3]，
  "event2": [f4,f5]，
  ...
}
```

### addListener 方法

1. 判断该事件监听器数组是否初始化，若未初始化，则将 `listeners[event]` 初始化为数组，并加入监听器 `cb`, 并触发 `newListener` 事件.

2. 判断该事件的监听器数量是否已超限，超限则报警告.

3. 判断数组中是否已存在 `cb`, 不存在则添加，已存在则不做操作.

4. 指定 `on` 等于 `addListener` 方法

```javascript
  addListener(eventName, cb) {
    if (
      !this.listeners[eventName || !Array.isArray(this.listeners[eventName])]
    ) {
      this.listeners[eventName] = [cb];
      if (eventName !== "newListener") {
        this.emit("newListener");
      }
      return this;
    }
    if (this.listeners[eventName].length >= this.#maxListeners) {
      console.error(
        "MaxListenersExceededWarning: Possible EventEmitter memory leak detected. %d event6 listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit",
        this.#maxListeners
      );
    }

    this.listeners[eventName].push(cb);
    return this;
  }

```

### emit 方法

遍历监听器,通过 `apply` 方法把上面得到的 `args` 参数传进去, 需要注意的是不要漏了返回值.

```javascript
  emit(eventName, ...args) {
    const isExistEvent =
      this.listeners[eventName] && this.listeners[eventName].length > 0;

    if (isExistEvent) {
      this.listeners[eventName].forEach((cb) => {
        cb.apply(null, args);
      });
    }
    return isExistEvent;
  }
```

### removeListener 方法

```javascript
  removeListener(eventName, listener) {
    const index = (this.listeners[eventName] || []).indexOf(listener);
    if (index !== -1) {
      this.listeners[eventName].splice(index, 1);
      if (eventName !== "removeListener") {
        this.emit("removeListener");
      }
    }
    return this;
  }
```

### once 方法

`once` 方法是 `on` 方法和 `removeListener` 方法的结合：用 `on` 方法监听，在回调结束的最后位置，通过`removeListener` 删掉监听函数自身

```javascript
  once(eventName, listener) {
    const fn = (...args) => {
      listener.apply(null, args);
      this.removeListener(eventName, fn);
    };
    this.on(eventName, fn);
    return this;
  }
```

### removeAllListeners 方法

```javascript
  removeAllListeners(eventNames = []) {
    if (eventNames.length === 0) {
      this.listeners = Object.create(null);
    } else {
      eventNames.forEach((v) => {
        this.listeners[v] = null;
      });
    }
    return this;
  }
```

### setMaxListeners、getMaxListeners、listenerCount、on、off 方法

```javascript
  setMaxListeners(maxListeners) {
    this.#maxListeners = maxListeners;
  }
  getMaxListeners() {
    return this.#maxListeners;
  }
  listenerCount(eventName) {
    return this.listeners[eventName]?.length ?? 0;
  }

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
```

#### 完整代码地址: <https://github.com/LZS911/EventEmit>
