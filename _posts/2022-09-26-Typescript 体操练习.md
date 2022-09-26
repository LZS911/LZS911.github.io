---
title: Typescript 体操练习
layout: post
date: "2022-09-26"
image: 
headerImage: false
tag:
- Typescript
star: true
category: blog
author: LZS_911
description: blog
---

## 1. 将下划线模式的 string 类型转化成驼峰类型

```Typescript
type TransformToCamelCase<T extends string> =
  T extends `${infer Left}_${infer Rest}`
    ? `${Left}${TransformToCamelCase<Capitalize<Rest>>}`
    : T;

type res1 = TransformToCamelCase<'aa_bb_cc_dd'>; //type res1 = "aaBbCcDd"

```

注意点:

需要递归继续处理剩余的部分.

### 应用: 当服务端定义的实体中的 `key` 的模式为下环线, 但前端代码中需要使用驼峰模式时

实现:

```Typescript
type CamelCase<T extends Record<string, any>> = T extends any
  ? {
      [key in keyof T as TransformToCamelCase<
        key & string
      >]: T[key] extends Array<infer Element>
        ? Array<
            Element extends string
              ? TransformToCamelCase<Element>
              : CamelCase<Element>
          >
        : T[key] extends Record<string, any>
        ? CamelCase<T[key]>
        : T[key];
    }
  : never;
```

注意点:

1. 当某项 `key` 的类型仍然满足 `Record<string, any>` 时, 需要递归继续.
2. 因为 `Typescript` 不会去计算递归中的表达式, 所以需要加上一个一定为 `true` 的判断, 让他去执行, 也就是 `T extends any`.
3. 需要注意 `Array` 的情况.
