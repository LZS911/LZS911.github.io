---
title: 如何使用jest测试 Date.now?
layout: post
date: '2022-07-06'
image:
headerImage: false
tag:
  - jest
  - javascript
star: true
category: blog
author: LZS_911
description: blog
excerpt: ''
coverImage: '/assets/blog/image/cover.jpg'
ogImage:
  url: '/assets/blog/image/cover.jpg'
theme: awesome-green  
---

最近工作中遇到一个需求, 需要在 `post` 接口 `request` 的 `headers` 中塞一个 `timestamp` 字段, 值为当前时间的时间戳. 实现方式很简单, 只需要在 `api` 封装的 `post` 方法的 `headers` 中新增 `timestamp: Date.now()` 即可. 然后想当然的在单元测试关于 `headers` 的 `toEqual` 中同时也加上该字段, 跑一遍 `ut`, 发现测试能过, 于是开了一个 `MR` 指给复审人, 可是此时却发现 `ci` 上的 `ut` 关于这里的断言却是有错误的. 在本地多跑几遍后, 发现确实有可能出现 `Date.now()` 对应不上的情况.

后续仔细一想发现跑不过其实应该才是普遍的现象, 毕竟在给对象添加 `timestamp` 字段的时间戳不可能与 `toEqual` 时的时间戳完全一致. 找到错误原因后解决的思路就很简单了, 只需要在 `ut` 时给 `Date.now()` 一个固定值就好了.

大致代码:

```javascript
const MOCK_DATE_NOW = 1530518207007;

const realDateNow = Date.now.bind(global.Date);

describe('api test', () => {
  beforeAll(() => {
    const dateNowStub = jest.fn(() => MOCK_DATE_NOW);
    global.Date.now = dateNowStub;
  });

  afterAll(() => {
    global.Date.now = realDateNow;
  });
}

```
