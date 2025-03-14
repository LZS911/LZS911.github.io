---
title: Node.js-Stream学习记录
date: "2024-12-20"
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

## 什么是 Stream（流）

先看一下 Node 官网中对于 Stream 的介绍

> A stream is an abstract interface for working with streaming data in Node.js.

其实我们写的 Node.js 代码经常会用到流。

来看一段代码

``` typescript
// src/test.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const server = http.createServer(async function (req, res) {
  const data = fs.readFileSync(
    path.join(import.meta.dirname, '..', 'package.json'),
    'utf-8'
  );
  res.end(data);
});

server.listen(8000);
```

我们跑了个 http 服务。

用 fs.readFileSync 读取项目中 package.json 的内容返回。

启动服务后使用 curl 访问下

``` shell
curl -i http://localhost:8000
```

![image](https://github.com/user-attachments/assets/775ccae6-26e8-4149-abbe-8244ce84b035)

因为是全部读完返回的，所以可以知道 Content-Length，也就是响应体的长度。

当文件比较小的时候，这样读取、返回没啥问题。

那如果文件非常大呢？

比如有好几百 M，这时候全部读取完再返回是不是就合适了？

因为要等好久才能读取完文件，之后才有响应。

这就需要用到流了：

``` typescript
//更新 src/test.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const server = http.createServer(async function (req, res) {
  const readStream = fs.createReadStream(
    path.join(import.meta.dirname, '..', 'package.json'),
    'utf-8'
  );
  readStream.pipe(res);
});

server.listen(8000);
```

![image](https://github.com/user-attachments/assets/7d9096be-3d6b-4640-ac7d-09a3700b32b2)

结果一样，但是因为现在是流式返回的，并不知道响应体的 Content-Length。

所以是用 Transfer-Encoding: chunked 的方式返回流式内容。

从服务器下载一个文件的时候，如何知道文件下载完了呢？

有两种方式：

一种是 header 里带上 Content-Length，浏览器下载到这个长度就结束。

![image](https://github.com/user-attachments/assets/05f39e48-2f39-4fdd-9c51-2a1f4736991e)

另一种是设置 transfer-encoding:chunked，它是不固定长度的，服务器不断返回内容，直到返回一个空的内容代表结束。

比如这样：

``` shell
5
Hello
1
,
5
World
1
!
0
```

这里分了 “Hello” “,” “World”“!” 这 4 个块，长度分别为 5、1、5、1

最后以一个长度为 0 的块代表传输结束。

这样，不管内容多少都可以分块返回，就不用指定 Content-Length 了。

这就是大文件的流式传输的原理，就是 transfer-encoding:chunked。

当然，这是 http 传输时的流，在用 shell 命令的时候，也经常会用到流：

比如

``` shell
ls | grep pack
```

![image](https://github.com/user-attachments/assets/e7d69e47-5a8a-4717-b3e7-7251d5924dc6)

ls 命令的输出流，作为 grep 命令的输入流。

当然，我们也可以把 grep 命令的输出流，作为 node 脚本的输入流。

``` javascript
//src/read.mjs
process.stdin.on('readable', function () {
    const buf = process.stdin.read();
    console.log(buf?.toString('utf-8'));
});
```

process.stdin 就是输入流，监听 readable 事件，用 read 读取数据。

执行一下

``` shell
ls | grep pack | node src/read.mjs
```

![image](https://github.com/user-attachments/assets/e51ce88c-f842-4e5c-8758-4d203085a0ac)

可以看到，我们的 node 脚本接收到了 grep 的输出流作为输入流。

这就是管道 pipe 的含义。

综上，可以小结下我们对流的认识：

**流就是分段的传输内容，比如从服务端像浏览器返回响应数据的流，读取文件的流等。**

**流和流之间可以通过管道 pipe 连接，上个流的输出作为下个流的输入。**

## 流的类型

在 node 里，流一共有 4 种：可读流 Readable、可写流 Writable、双工流 Duplex、转换流 Transform。

``` javascript
import stream from 'node:stream';

// 可读流
const Readable = stream.Readable;
// 可写流
const Writable = stream.Writable;
// 双工流
const Duplex = stream.Duplex;
// 转换流
const Transform = stream.Transform;
```

其余的流都是基于这 4 种流封装出来的。

### Readable

Readable 要实现 _read 方法，通过 push 返回具体的数据。

``` javascript
//readable.mjs
import { Readable } from 'node:stream';

const readableStream = new Readable();

readableStream._read = function() {
    this.push('阿门阿前一棵葡萄树，');
    this.push('阿东阿东绿的刚发芽，');
    this.push('阿东背着那重重的的壳呀，');
    this.push('一步一步地往上爬。')
    this.push(null);
}

readableStream.on('data', (data)=> {
    console.log(data.toString())
});

readableStream.on('end', () => {
    console.log('done');
});
```

当 push 一个 null 时，就代表结束流。

执行一下

``` shell
node src/readable.mjs
```

![image](https://github.com/user-attachments/assets/184fe685-1a0b-4a88-b846-c4ebe37a705c)

创建 Readable 流也可以通过继承的方式：

``` javascript
// src/readable2.mjs
import { Readable } from 'node:stream';

class ReadableDong extends Readable {

    _read() {
        this.push('阿门阿前一棵葡萄树，');
        this.push('阿东阿东绿的刚发芽，');
        this.push('阿东背着那重重的的壳呀，');
        this.push('一步一步地往上爬。')
        this.push(null);
    }

}

const readableStream = new ReadableDong();

readableStream.on('data', (data)=> {
    console.log(data.toString())
});

readableStream.on('end', () => {
    console.log('done');
});

```

![image](https://github.com/user-attachments/assets/267137eb-e992-4c71-9bd3-3325e05a74a7)

可读流是生成内容的，那么很自然可以和生成器结合：

``` javascript
// src/readable3.mjs

import { Readable } from 'node:stream';

class ReadableDong extends Readable {

    constructor(iterator) {
        super();
        this.iterator = iterator;
    }

    _read() {
        const next = this.iterator.next();
        if(next.done) {
            return this.push(null);
        } else {
            this.push(next.value)
        }
    }

}

function *songGenerator() {
    yield '阿门阿前一棵葡萄树，';
    yield '阿东阿东绿的刚发芽，';
    yield '阿东背着那重重的的壳呀，';
    yield '一步一步地往上爬。';
}

const songIterator = songGenerator();

const readableStream = new ReadableDong(songIterator);

readableStream.on('data', (data)=> {
    console.log(data.toString())
});

readableStream.on('end', () => {
    console.log('done');
});
```

* 和 yield 是 js 的 generator 的语法，它是异步返回 yield 后的内容，通过 iterator 的 next 来取下一个。

![image](https://github.com/user-attachments/assets/c2290823-cc7b-45b7-b2d6-cbcd5febfaaf)

我们封装个工厂方法：

``` javascript
function createReadStream(iterator) {
  return new ReadableDong(iterator);
}

const readableStream = createReadStream(songIterator);

readableStream.on('data', (data) => {
  console.log(data.toString());
});

readableStream.on('end', () => {
  console.log('done');
});
```

是不是就和 fs.createReadStream 很像了？

``` javascript
// 创建 src/fsReadStream.mjs
import fs from 'node:fs';
import path from 'node:path';

const readStream = fs.createReadStream(
  path.join(import.meta.dirname, '..', 'package.json'),
  'utf-8'
);

readStream.on('data', (data) => {
  console.log(data.toString());
});

readStream.on('end', () => {
  console.log('done');
});
```

![image](https://github.com/user-attachments/assets/1e7bb2ed-6be6-479f-a4fe-f3318766f17d)

其实文件的 ReadStream 就是基于 stream 的 Readable 封装出来的。

这就是可读流。

http 服务的 request 就是 Readable 的实例：

![image](https://github.com/user-attachments/assets/bca3ed3c-fd44-4ff4-974e-7e5830ae21b7)

所以我们可以这样写：

``` javascript
// src/test2.mjs
import http from 'node:http';
import fs from 'node:fs';

const server = http.createServer(async function (req, res) {
    const writeStream = fs.createWriteStream('aaa.txt', 'utf-8');
    req.pipe(writeStream);
    res.end('done');
});

server.listen(8000);
```

启动服务后访问一下

```
curl -X POST -d "a=1&b=2" http://localhost:8000
```

![image](https://github.com/user-attachments/assets/df08f683-77d2-4252-84fe-742c42d5c230)

可以看到，从 request 的流中读出的内容写入了文件的 WriteStream

### Writable
