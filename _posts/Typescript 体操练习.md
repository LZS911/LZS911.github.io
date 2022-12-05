---
title: Typescript 体操练习
layout: post
date: '2022-09-26'
image:
headerImage: false
tag:
  - Typescript
star: true
category: blog
author: LZS_911
description: blog
excerpt: '学习下平常工作中不太会用到的一些 Typescript 工具类型以及新特性'
coverImage: '/assets/blog/image/cover.jpg'
ogImage:
  url: '/assets/blog/image/cover.jpg'
theme: fancy
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

## 2. 将索引类型转化为联合类型

* 索引类型是一个聚合了多个元素的类型，对象、类、元组等都是索引类型, 举个栗子:

```Typescript
type ExampleType = {
  name: string;
  sex: boolean;
  age: number;
  hobbies: string[];
}
```

* 联合类型. 顾名思义, 它是一个联合了多种类型的集合, 取值可以取其中任意一种类型.

```Typescript
type UnionTypes = { name: string } | { sex: boolean } | { age: number} | { hobbies: string[] };
```

* 需求: 实现一个工具类, 将 `ExampleType` 转化为 `UnionTypes`

* 实现:

    ```Typescript
    type SpiltObj<T> = {
      [key in keyof T]: {
        [key2 in key]:T[key2]
      }
    }[keyof T]
    ```

* 拆分, 先看第一部分

    ```Typescript
    type SpiltObj<T> = {
      [key in keyof T]: {
        [key2 in key]:T[key2]
      }
    }
    ```

    ```Typescript
      type Res = SpiltObj<ExampleType>

      /** type Res = {
       name: string;
       } | {
           sex: boolean;
       } | {
           age: number;
       } | {
           hobbies: string[];
       } **/
     ```

    第二部分

    ```Typescript
      type ExampleType = {
        name: string;
        sex: boolean;
        age: number;
        hobbies: string[];
      }

      type res = ExampleType[keyof ExampleType]

      //type res = string | number | boolean | string[]
    ```

* 拓展, 实现一个工具类, 拿到索性类型键值路径的联合类型

    ```Typescript
    type Template = {
      aa: {
        bb: string;
      };
      cc: number;
      dd: {
        ee: {
          ff: string;
        }
      };
      gg: {
        hh: number
      };
    }

    type demo = 'aa' | 'cc' | 'dd' | 'gg' | 'aa.bb' |'dd.ee' | 'dd.ee.ff' | 'gg.hh'

    type TemplateKeyPath<T> ={
       [key in keyof T]: key extends string ? T[key] extends Record<string, any> ? key | `${key}.${TemplateKeyPath<T[key]>}` : key : never;
    }[keyof T]

    type res2 = TemplateKeyPath<Template>
    //type res2 = "aa" | "cc" | "dd" | "gg" | "aa.bb" | "dd.ee" | "dd.ee.ff" | "gg.hh"
    ```
