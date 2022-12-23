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
theme: fancy
---

**注: Typescript 使用最新版本号 v4.94**

## 1. 将下划线模式的 string 类型转化成驼峰类型

```Typescript
type TransformToCamelCase<T extends string> =
  T extends `${infer Left}_${infer Rest}`
    ? `${Left}${TransformToCamelCase<Capitalize<Rest>>}`
    : T;

```

![alt](/assets/typescript/example-1.png)

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

![alt](/assets/typescript/example-2.png)

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
      type Res1 = SpiltObj<ExampleType>
     ```

    ![alt](/assets/typescript/example-3.png)

    第二部分

    ```Typescript
      type ExampleType = {
        name: string;
        sex: boolean;
        age: number;
        hobbies: string[];
      }

      type Res2 = ExampleType[keyof ExampleType]
    ```

    ![alt](/assets/typescript/example-4.png)

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

    type TemplateKeyPath<T> ={
       [key in keyof T]: key extends string ? T[key] extends Record<string, any> ? key | `${key}.${TemplateKeyPath<T[key]>}` : key : never;
    }[keyof T]

    type Res3 = TemplateKeyPath<Template>
    ```

    ![alt](/assets/typescript/example-5.png)

## 3. 数组长度数值计算

Typescript 本身是没有加减乘除运算符的, 所以需要取巧来处理数值的计算.

利用构造数组, 然后获取它的 `length`.

**注: 因为数组长度不会为负数, 所以这里做的数值计算只包含正整数**

![alt](/assets/typescript/example-6.png)

实现运算方法之前, 先实现一个构造数组的工具类

```Typescript
type BuildArray<
  Length extends number,
  Element = unknown,
  Array extends unknown[] = []
> = Array['length'] extends Length
  ? Array
  : BuildArray<Length, Element, [Element, ...Array]>;

```

![alt](/assets/typescript/example-7.png)

`BuildArray` 接收三个泛形, 其中第一个参数 `Length` 为需要构造出来的数组长度, `Element` 为数组类的元素类型, 默认值为 `unknown`, `Array` 为返回结果, 用来递归处理. 如果将其转化为 `javascript` 代码, 大致如下:

```javascript
const buildArray = (length, element, arr = []) => {
  if (length === arr.length) {
    return arr;
  }

  return buildArray(length, element, [element, ...arr]);
};
```

### 1. 加法运算

```typescript
type Add<Num1 extends number, Num2 extends number> = [...BuildArray<Num1>, ...BuildArray<Num2>]['length']
```

![alt](/assets/typescript/example-8.png)

![alt](/assets/typescript/example-9.png)

### 2. 减法运算

```typescript
type Subtract<
  Num1 extends number,
  Num2 extends number
> = BuildArray<Num1> extends [...arr1: BuildArray<Num2>, ...arr2: infer Rest]
  ? Rest['length']
  : never;

```

![alt](/assets/typescript/example-10.png)

![alt](/assets/typescript/example-11.png)

### 3. 乘法运算

```typescript
type Multiply<
  Num1 extends number,
  Num2 extends number,
  ResultArray extends unknown[] = []
> = Num2 extends 0
  ? ResultArray['length']
  : Multiply<Num1, Subtract<Num2, 1>, [...BuildArray<Num1>, ...ResultArray]>;
```

![alt](/assets/typescript/example-12.png)

![alt](/assets/typescript/example-13.png)

### 4. 除法运算

```typescript
type Divide<
  Num1 extends number,
  Num2 extends number,
  ResultArray extends unknown[] = []
> = Num1 extends 0
  ? ResultArray['length']
  : Divide<Subtract<Num1, Num2>, Num2, [unknown, ...ResultArray]>; 
  // [unknown, ...ResultArray] => [...BuildArray<Add<ResultArray['length'], 1> & number>]

```

![alt](/assets/typescript/example-14.png)

![alt](/assets/typescript/example-15.png)
