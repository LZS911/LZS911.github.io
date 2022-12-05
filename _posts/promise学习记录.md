---
title: promise学习记录
layout: post
date: '2022-03-01'
image:
headerImage: false
tag:
  - javascript
  - promise
star: true
category: blog
author: LZS_911
description: blog
excerpt: ''
coverImage: '/assets/blog/image/cover.jpg'
ogImage:
  url: '/assets/blog/image/cover.jpg'
theme: simplicity-green  
---

## 1. 一些相关的概念

### 1.1 JavaScript 中的异步

在 `JavaScript` 中, 程序中将来执行的部分并不一定在现在运行的部分执行完之后立即执行. 换句话说, 现在无法完成的任务将会异步完成, 因此并不会出现阻塞行为.

来看一段代码:

```javascript
//现在执行的
const url = 'http://some.url.1';
//将来执行的
const data = ajax(url);
//接着现在执行的
console.log(data);
```

这里的 `data` 通常是不会包含 `ajax` 请求所返回的数据的. 因为用户在请求网络资源时并不希望阻塞所有的 UI 交互.

### 1.2 回调函数

从现在到将来的等待, 最简单的办法(并不唯一, 甚至不是最优办法)是使用一个通常称为回调函数的函数.
来看一段代码:

```javascript
const url = 'http://some.url.1';
ajax(url, (data) => {
  console.log(data);
});
```

为什么说 回调不是最优的解决办法, 还是先来看一段代码:

```javascript
listen('click', (evt) => {
  setTimeout(() => {
    ajax('http://some.url.1', (text) => {
      if (text === 'hello') {
        handle();
      } else {
        request();
      }
    });
  }, 500);
});

//node 范式的回调
readFile('hello.txt', (err, data) => {
  if (err) {
    throw Error(err);
  }
  if (data.toString() === 'hello') {
    writeFile('hello.txt', 'hello world!', (err, data) => {
      if (err) {
        throw Error(err);
      }
      //todo...
    });
  }
});
```

上面这段代码常常被称为 “回调地狱”, 虽然已经使用箭头函数来减少复杂度了, 但是看起来却还是不太优雅. 当然, 这仅仅是一个小问题. 上述这段代码的执行顺序还是比较好理解的, 往往在业务开发中, 会产生一些更严重的问题. 来看下面一段伪代码:

```javascript
doA(() => {
  doB();
  doC(() => {
    doD();
  });
  doE();
});
doF();
```

上述代码的执行顺序便会更加复杂一点了, 实际运行顺序是:

`doA() -> doF() -> doB() -> doC() -> doE() -> doD()`

所以, 我们需要比回调更好的机制, 需要一种更同步、更顺序、更阻塞的方式来表达异步.

## 2. Promise

抛砖引玉结束, 现在回到本文的主题, 来好好了解 `Promise` 吧.

### 2.1 什么是 `Promise`

Promise 是抽象异步处理对象以及对其进行各种操作的组件. Promise 最初被提出是在 E 语言中, 它是基于并列/并行处理设计的一种编程语言.

#### 2.1.1 Constructor

`Promise` 类似于 `XMLHttpRequest`, 从构造函数 `Promise` 来创建一个新建新 `promise` 对象作为接口.

要想创建一个 `promise` 对象、可以使用 `new` 来调用 `Promise` 的构造器来进行实例化。

```javascript
const promise = new Promise(function (resolve, reject) {
  // 异步处理
  // 处理结束后、调用resolve 或 reject
});
```

#### 2.1.2 Instance Method

对通过 `new` 生成的 `promise` 对象为了设置其值在 `resolve(成功)` / `reject(失败)` 时调用的回调函数, 可以使用`promise.then()` 实例方法。

```javascript
promise.then(onFulfilled, onRejected),
```

`resolve` (成功)时 `onFulfilled` 会被调用

`reject`(失败)时 `onRejected` 会被调用

`onFulfilled、onRejected` 两个都为可选参数.

`promise.then` 成功和失败时都可以使用。 另外在只想对异常进行处理时可以采用 `promise.then(undefined, onRejected)` 这种方式，只指定 `reject` 时的回调函数即可. 不过这种情况下 `promise.catch(onRejected)` 应该是个更好的选择.

```javascript
promise.catch(onRejected);
```

### 2.1.3 Static Method

像 `Promise` 这样的全局对象还拥有一些静态方法.

包括 `Promise.all()` 还有 `Promise.resolve()` 等在内，主要都是一些对 `Promise` 进行操作的辅助方法.

### 2.2 Promise 工作流程与状态

看一下下面的示例代码:

```javascript
const asyncFn = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('async hello world!');
    }, 500);
  });
};

asyncFn
  .then((res) => {
    console.log(res); //async hello world!
  })
  .catch((err) => {
    console.log(err);
  });
```

我们已经大概了解了 `Promise` 的处理流程，接下来让我们来稍微整理一下 `Promise` 的状态.

用 `new Promise` 实例化的 `promise` 对象有以下三个状态.

`"has-resolution"` - Fulfilled
resolve(成功)时, 此时会调用 onFulfilled

`"has-rejection"` - Rejected
reject(失败)时, 此时会调用 onRejected

`"unresolved"` - Pending
既不是 resolve 也不是 reject 的状态, 也就是 promise 对象刚被创建后的初始化状态等.

`promise`对象的状态

从 `Pending` 转换为 `Fulfilled` 或 `Rejected` 之后, 这个 `promise` 对象的状态就不会再发生任何变化.

也就是说, Promise 与 Event 等不同, 在.then 后执行的函数可以肯定地说只会被调用一次.

另外, Fulfilled 和 Rejected 这两个中的任一状态都可以表示为 Settled(不变的).

### 2.3 实现上述工作流与状态控制

```typescript
type TGlPromiseStatus = "pending" | "fulfilled" | "rejected";

interface PromiseLike<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2>;
}
interface IGlPromise<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): GlPromise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): GlPromise<T | TResult>;
}

export default class GlPromise<T> implements IGlPromise<T> {
  /**
   * 构造函数
   * @param executor 初始化 Promise 时传入的 callback, 类型为 : (resolve, reject) => void
   */
  constructor(
    executor: (
      resolve: (value: T) => void,
      reject: (reason: any) => void
    ) => void
  ) {
    // 执行传入的callback, 将 resolve, reject作为参数执行
    executor(this.resolve, this.reject);
  }

  //状态
  private PromiseStatus: TGlPromiseStatus = "pending";

  //最终结果
  private PromiseResult: T = undefined as any;

  /**
   * resolve函数,
   *  构造函数中的回调函数的第一个参数
   * 进行操作:
   * 0. 判断状态时候为  pending, 不为 pending 代表该 promise 已经有结果了, 无法更改状态, 直接 return
   * 1. 将 PromiseStatus 从 pending ===> fulfilled, 状态改变后, then中的成功回调才会执行
   * 2. 将参数赋值给 PromiseResult
   * @param: value: T
   * @returns: void
   **/
  private resolve = (value: T) => {
    if (this.PromiseStatus !== "pending") return;
    this.PromiseResult = value;
    this.PromiseStatus = "fulfilled";
    while (this.onfulfilledCallbacks.length) {
      this.onfulfilledCallbacks.shift()!(this.PromiseResult);
    }
  };

  /**
   * reject函数,
   * 构造函数中的回调函数的第二个参数
   * 进行操作:
   * 0. 判断状态时候为  pending, 不为 pending 代表该 promise 已经有结果了, 无法更改状态, 直接 return
   * 1. 将 PromiseStatus 从 pending ===> rejected, 状态改变后, catch中的成功回调才会执行
   * 2. 将参数赋值给 PromiseResult
   * @param reason:any
   * @returns void
   */
  private reject = (reason: any) => {
    if (this.PromiseStatus !== "pending") return;
    this.PromiseResult = reason;
    this.PromiseStatus = "rejected";
    while (this.onrejectedCallbacks.length) {
      this.onrejectedCallbacks.shift()!(this.PromiseResult);
    }
  };

  private onfulfilledCallbacks: Array<((value?: T) => void) | null> = [];

  private onrejectedCallbacks: Array<((value?: T) => void) | null> = [];

  /**
   * 核心: then 函数
   */
  public then = <TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ) =>
    new GlPromise<TResult1 | TResult2>((resolve, reject) => {
      const thenPromise = (
        cb: (
          values: T
        ) => PromiseLike<TResult1 | TResult2> | TResult1 | TResult2
      ) => {
        //模拟微任务
        setTimeout(() => {
          try {
            const val = cb(this.PromiseResult);
            if (val instanceof GlPromise) {
              val.then(resolve, reject);
            } else {
              this.resolve(val as any);
            }
          } catch (error) {
            this.reject(error);
          }
        });
      };

      if (this.PromiseStatus === "fulfilled") {
        onfulfilled && thenPromise(onfulfilled);
      } else if (this.PromiseStatus === "rejected") {
        onrejected && thenPromise(onrejected);
      } else if (this.PromiseStatus === "pending") {
        onfulfilled &&
          this.onfulfilledCallbacks.push(thenPromise.bind(this, onfulfilled));
        onrejected &&
          this.onrejectedCallbacks.push(thenPromise.bind(this, onrejected));
      }
    });

  public catch = <TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ) => this.then(null, onrejected);
```

### 2.3 静态方式的使用与实现

#### 2.3.1 Promise.resolve

静态方法 `Promise.resolve(value)` 可以认为是 `new Promise()` 方法的快捷方式.

比如 `Promise.resolve(42);` 可以认为是以下代码的语法糖:

```javascript
new Promise(function (resolve) {
  resolve(42);
});
```

在这段代码中的 `resolve(42);` 会让这个 `promise` 对象立即进入确定（即 `resolved` ）状态, 并将 42 传递给后面`then`里所指定的 `onFulfilled` 函数.

方法 `Promise.resolve(value);` 的返回值也是一个 `promise` 对象, 所以我们可以像下面那样接着对其返回值进行 `.then` 调用.

```javascript
Promise.resolve(42).then(function (value) {
  console.log(value);
});
```

实现:

```typescript
  public static resolve = <T>(value: T) => {
    return new GlPromise((resolve) => {
      resolve(value);
    });
  };
```

#### 2.3.2 Promise.reject

基本类似与 Promise.resolve

#### 2.3.3 Promise.all

Promise.all() 方法接收一个 promise 的 iterable 类型（注：Array，Map，Set 都属于 ES6 的 iterable 类型）的输入，并且只返回一个 Promise 实例， 那个输入的所有 promise 的 resolve 回调的结果是一个数组。这个 Promise 的 resolve 回调执行是在所有输入的 promise 的 resolve 回调都结束，或者输入的 iterable 里没有 promise 了的时候。它的 reject 回调执行是，只要任何一个输入的 promise 的 reject 回调执行或者输入不合法的 promise 就会立即抛出错误，并且 reject 的是第一个抛出的错误信息。

基本使用方式:

```javascript
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2);
  }, 2000);
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(4);
  }, 1000);
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(4);
  }, 1000);
});
Promise.all([p1, p2]).then((res) => {
  console.log(res);
}); //[2, 4]
Promise.all([p1, p2, p3])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  }); //4
```

实现:

```typescript
  public static all = <T>(promises: Array<PromiseLike<T>>) => {
    const result: T[] = [];
    let count = 0;
    return new GlPromise((resolve, reject) => {
      const addData = (index: number, value: T) => {
        result[index] = value;
        count++;
        if (count === promises.length) {
          resolve(result);
        }
      };
      promises.forEach((promise, index) => {
        if (promise instanceof GlPromise) {
          promise.then((res) => {
            addData(index, res);
          }, (err) => {
            reject(err);
          });
        } else {
          addData(index, promise as any);
        }
      });
    });
  }
```

### 2.3.4 Promise.any

Promise.any() 接收一个 Promise 可迭代对象，只要其中的一个 promise 成功，就返回那个已经成功的 promise 。如果可迭代对象中没有一个 promise 成功（即所有的 promises 都失败/拒绝），就返回一个失败的 promise 和 AggregateError 类型的实例，它是 Error 的一个子类，用于把单一的错误集合在一起。本质上，这个方法和 Promise.all()是相反的。

```javascript
const pErr = new Promise((resolve, reject) => {
  reject('总是失败');
});

const pSlow = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, '最终完成');
});

const pFast = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, '很快完成');
});

Promise.any([pErr, pSlow, pFast]).then((value) => {
  console.log(value); // "很快完成"
});
```

实现:

```typescript
  public static any = <T>(promises: Array<PromiseLike<T>>) => new GlPromise((resolve, reject) => {
    let count = 0;
    promises.forEach((promise) => {
      if (promise instanceof GlPromise) {
        promise.then((res) => resolve(res), () => {
          count++;
          if (count === promises.length) {
            reject('All promises were rejected');
          }
        });
      } else {
        resolve(promise as any);
      }
    });
  })

```

### 2.3.5 Promise.race

Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。

```javascript
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2])
  .then((value) => {
    console.log(value); // two
  })
  .catch((err) => {
    console.log(err);
  });
```

实现:

```typescript
  public static race = <T>(promises: Array<PromiseLike<T>>) => new GlPromise((resolve, reject) => {
    promises.forEach((promise) => {
      if (promise instanceof GlPromise) {
        promise.then((res) => resolve(res), (err) => reject(err));
      } else {
        resolve(promise);
      }
    });
  })
```

### 2.3.6 Promise.allSettled

该 Promise.allSettled()方法返回一个在所有给定的 promise 都已经 fulfilled 或 rejected 后的 promise，并带有一个对象数组，每个对象表示对应的 promise 结果。

当有多个彼此不依赖的异步任务成功完成时，或者总是想知道每个 promise 的结果时，通常使用它。

相比之下，Promise.all() 更适合彼此相互依赖或者在其中任何一个 reject 时立即结束。

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) =>
  setTimeout(reject, 100, 'foo')
);
const promises = [promise1, promise2];

Promise.allSettled(promises).then((results) =>
  results.forEach((result) => console.log(result.status))
);

// "fulfilled"
// "rejected"
```

实现:

```typescript
 public static allSettled = <T>(promises: Array<PromiseLike<T>>) => new GlPromise((resolve, reject) => {
    const result: Array<{ status: 'fulfilled' | 'rejected', value: T }> = [];
    let count = 0;

    const addData = (index: number, value: T, status: 'fulfilled' | 'rejected') => {
      result[index] = {
        status, value
      };
      count++;
      if (count === promises.length) resolve(result);
    };

    promises.forEach((promise, index) => {
      if (promise instanceof GlPromise) {
        promise.then((res) => addData(index, res, 'fulfilled'), (err) => addData(index, err, 'rejected'));
      } else {
        addData(index, promise as any, 'fulfilled');
      }
    });
  })
```
