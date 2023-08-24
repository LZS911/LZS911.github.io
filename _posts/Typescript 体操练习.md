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

## 3. 使用数组长度进行数值计算

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

### 加法运算

```typescript
type Add<Num1 extends number, Num2 extends number> = [...BuildArray<Num1>, ...BuildArray<Num2>]['length']
```

![alt](/assets/typescript/example-8.png)

![alt](/assets/typescript/example-9.png)

### 减法运算

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

### 乘法运算

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

### 除法运算

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

## 4. 判断两个正整数的大小

### 比较是否相等

```typescript
type NumberIsEqual<Num1 extends number, Num2 extends number> = Num1 extends Num2 ? true : false;
```

![alt](/assets/typescript/example-16.png)

![alt](/assets/typescript/example-17.png)

### 判断是否大于

大致思路: 利用构造数组, 递归对构造出来的数组进行 Pop 操作, 通过判断数组的长度是否为 0 来确定大小.

在开始实现钱先实现几个工具类, 减少重复代码和提高可读性.

**注: 后续使用到同名工具类时默认为这几个类型**

```typescript
type Or<Case1 extends boolean, Case2 extends boolean> = Case1 extends true
  ? true
  : Case2 extends true
  ? true
  : false;

type ArrayPop<Arr extends unknown[]> = Arr extends [...infer Left, infer Last]
  ? Left
  : never;

type NumberIsZero<Num extends number> = Num extends 0 ? true : false;
```

最终代码

```typescript
type NumberIsCompare<
  Num1 extends number,
  Num2 extends number,
  Arr1 extends unknown[] = BuildArray<Num1>,
  Arr2 extends unknown[] = BuildArray<Num2>
> = NumberIsEqual<Num1, Num2> extends false
  ? Or<NumberIsZero<Arr1['length']>, NumberIsZero<Arr2['length']>> extends true
    ? NumberIsZero<Arr1['length']> extends true
      ? false
      : true
    : NumberIsCompare<ArrayPop<Arr1>['length'], ArrayPop<Arr2>['length']>
  : false;

```

![alt](/assets/typescript/example-18.png)
![alt](/assets/typescript/example-19.png)
![alt](/assets/typescript/example-20.png)
![alt](/assets/typescript/example-21.png)
![alt](/assets/typescript/example-22.png)

### 判断是否小与

过滤掉相等情况后对大于取反就好了.

```typescript
type NumberIsLess<Num1 extends number, Num2 extends number> = NumberIsEqual<
  Num1,
  Num2
> extends false
  ? NumberIsCompare<Num1, Num2> extends true
    ? false
    : true
  : false;
```

## 5. 实现 IndexOf - 从左往右查找子串的位置

核心原理

![alt](/assets/typescript/example-23.png)

最后实现一个获取字符串长度的工具类型即可获得最终结果

**注意: `['a']['length']的值为数组长度, 而 'aa'['length']` 的值为 number**

所以我们可以将字符串切割为数组, 然后来获取长度.

```typescript
type Split<
  S extends string,
  Element extends string = '',
  ResultArray extends string[] = []
> = S extends ''
  ? [...ResultArray, S]
  : S extends `${infer Left}${Element}${infer Rest}`
    ? Split<Rest, Element, [...ResultArray, Left]>
    : [...ResultArray, S];
```

![alt](/assets/typescript/example-24.png)
![alt](/assets/typescript/example-25.png)
![alt](/assets/typescript/example-26.png)

```typescript
type GetStringLength<S extends string> =  Split<S> extends never ? never : Split<S>['length']
```

最后结果

```typescript
type IndexOf<
  S1 extends string,
  S2 extends string,
  Len1 extends number = GetStringLength<S1>,
  Len2 extends number = GetStringLength<S2>
> = Or<NumberIsCompare<Len1, Len2>, NumberIsEqual<Len1, Len2>> extends false
  ? -1
  : S1 extends `${infer Left}${S2}${infer Rest}`
  ? GetStringLength<Left>
  : -1;
```

![alt](/assets/typescript/example-27.png)
![alt](/assets/typescript/example-28.png)
![alt](/assets/typescript/example-29.png)
![alt](/assets/typescript/example-30.png)

## 6. 实现字符串的 Replace 与 ReplaceAll

1. `Replace`

    ```typescript
    type Replace<
      Str extends string,
      MatchStr extends string,
      ReplaceStr extends string
    > = Str extends `${infer Left}${MatchStr}${infer Rest}`
      ? `${Left}${ReplaceStr}${Rest}`
      : Str;
    ```

    ![alt](/assets/typescript/example-31.png)
    ![alt](/assets/typescript/example-32.png)
    ![alt](/assets/typescript/example-33.png)

2. `ReplaceAll`

    ```typescript
    type ReplaceAll<
      Str extends string,
      MatchStr extends string,
      ReplaceStr extends string
    > = Str extends `${infer Left}${MatchStr}${infer Rest}`
      ? Rest extends `${infer Left2}${MatchStr}${infer Rest2}`
        ? ReplaceAll<`${Left}${ReplaceStr}${Rest}`, MatchStr, ReplaceStr>
        : `${Left}${ReplaceStr}${Rest}`
      : Str;
    ```

    ![alt](/assets/typescript/example-34.png)
    ![alt](/assets/typescript/example-35.png)

## 7. 实现类似 Vue 的类型支持的简化版本

通过提供一个函数SimpleVue（类似于Vue.extend或defineComponent），它应该正确地推断出 computed 和 methods 内部的this类型。

在此挑战中，我们假设SimpleVue接受只带有data，computed和methods字段的Object作为其唯一的参数，

data是一个简单的函数，它返回一个提供上下文this的对象，但是你无法在data中获取其他的计算属性或方法。

computed是将this作为上下文的函数的对象，进行一些计算并返回结果。在上下文中应暴露计算出的值而不是函数。

methods是函数的对象，其上下文也为this。函数中可以访问data，computed以及其他methods中的暴露的字段。 computed与methods的不同之处在于methods在上下文中按原样暴露为函数。

SimpleVue的返回值类型可以是任意的。

```JavaScript
const instance = SimpleVue({
  data() {
    return {
      firstname: 'Type',
      lastname: 'Challenges',
      amount: 10,
    }
  },
  computed: {
    fullname() {
      return this.firstname + ' ' + this.lastname
    }
  },
  methods: {
    hi() {
      alert(this.fullname.toLowerCase())
    }
  }
})

```

实现:

```TypeScript
type Computed<C extends Record<PropertyKey, () => any>> = {
  [CK in keyof C]: ReturnType<C[CK]>;
};

type SimpleVueType<D extends Record<PropertyKey, any>, C extends Record<PropertyKey, any>, M extends Record<PropertyKey, any>> = (arg: {
  data:() => D;
  computed:C & ThisType<D>;
  methods: M & ThisType<D & M & Computed<C>>;
}) => any
```

## 8. 函数柯里化

Currying 是一种将带有多个参数的函数转换为每个带有一个参数的函数序列的技术。

例如：

```TypeScript
const add = (a: number, b: number) => a + b
const three = add(1, 2)

const curriedAdd = Currying(add)
const five = curriedAdd(2)(3)
```

传递给 Currying 的函数可能有多个参数，您需要正确键入它。
在此挑战中，curried 函数一次仅接受一个参数。分配完所有参数后，它应返回其结果。

实现:

```TypeScript
type CurryingType<T> = T extends (...args: [infer Left, ...infer Rest]) => infer R
    ? Rest['length'] extends 0
        ? T
        : (arg: Left) => CurryingType<(...args: Rest) => R>
    : never
```

## 9. UnionToIntersection

``type I = Union2Intersection<'foo' | 42 | true> // expected to be 'foo' & 42 & true``

```typescript
type UnionToFunction<T> = T extends any ? (arg:T) => void : never;

type test1 = UnionToFunction<"foo" | 42 | true>;// (arg: "foo") => void | (arg: 42) => void | (arg: true) => void;

type UnionToIntersection<U> = UnionToFunction<U> extends (arg:infer T) => void ? T:never;

type test2 = UnionToIntersection<{a:string} | {b:number} | {c:boolean}>;// {a: string} & {b: number} & {c: boolean}

```

解题思路: <https://github.com/type-challenges/type-challenges/issues?q=label%3A55+label%3Aanswer+sort%3Areactions-%2B1-desc>

## 10. GetRequired and GetOptional

```typescript
type GetRequired<T> = {[P in keyof T as T[P] extends Required<T>[P] ? P : never]:T[P]}
```

```typescript
type GetOptional<T> = {[P in keyof T as T[P] extends Required<T>[P] ? never : P]:T[P]}
```

## 11. Capitalize Words

Implement CapitalizeWords<T> which converts the first letter of each word of a string to uppercase and leaves the rest as-is.

For example

```typescript
type capitalized = CapitalizeWords<'hello world, my friends'> // expected to be 'Hello World, My Friends'
```

```typescript
type CapitalizeRest<T> = T extends `${infer Left}${infer Rest}` ? `${Left}${CapitalizeRest<Capitalize<Left> extends Lowercase<Left> ? Capitalize<Rest> : Rest>}`

 : T;

type CapitalizeWords<S extends string> = Capitalize<CapitalizeRest<S>>;
```

## 12 CamelCase

Implement CamelCase<T> which converts snake_case string to camelCase.

For example

```typescript
type camelCase1 = CamelCase<'hello_world_with_types'> // expected to be 'helloWorldWithTypes'
type camelCase2 = CamelCase<'HELLO_WORLD_WITH_TYPES'> // expected to be same as previous one
```

```typescript
type IsGap<T extends string> = Uppercase<T> extends Lowercase<T> ? true : false;

type CamelCase<S extends string> = S extends Lowercase<S>
  ? S extends `${infer L}_${infer C}${infer R}`
    ? C extends '_'
      ? `${L}_${CamelCase<`_${R}`>}`
      : `${L}${IsGap<C> extends true ? `_${C}` : Uppercase<C>}${CamelCase<R>}`
    : S
  : CamelCase<Lowercase<S>>;

```

## 13 C-printf Parser

```typescript
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<ParsePrintFormat<''>, []>>,
  Expect<Equal<ParsePrintFormat<'Any string.'>, []>>,
  Expect<Equal<ParsePrintFormat<'The result is %d.'>, ['dec']>>,
  Expect<Equal<ParsePrintFormat<'The result is %%d.'>, []>>,
  Expect<Equal<ParsePrintFormat<'The result is %%%d.'>, ['dec']>>,
  Expect<Equal<ParsePrintFormat<'The result is %f.'>, ['float']>>,
  Expect<Equal<ParsePrintFormat<'The result is %h.'>, ['hex']>>,
  Expect<Equal<ParsePrintFormat<'The result is %q.'>, []>>,
  Expect<Equal<ParsePrintFormat<'Hello %s: score is %d.'>, ['string', 'dec']>>,
  Expect<Equal<ParsePrintFormat<'The result is %'>, []>>,
]
```

```typescript
type ControlsMap = {
  c: 'char'
  s: 'string'
  d: 'dec'
  o: 'oct'
  h: 'hex'
  f: 'float'
  p: 'pointer'
}

type ParsePrintFormat<S extends string> = S extends `${infer Start}%${infer Letter}${infer Rest}`
  ? (Letter extends keyof ControlsMap
      ? [ControlsMap[Letter], ...ParsePrintFormat<Rest>]
      : ParsePrintFormat<Rest>)
  : []

```

## 14. Typed Get

实现以下功能的工具类型:

```typescript
type Data = {
  foo: {
    bar: {
      value: 'foobar',
      count: 6,
    },
    included: true,
  },
  hello: 'world'
}
  
type A = Get<Data, 'hello'> // 'world'
type B = Get<Data, 'foo.bar.count'> // 6
type C = Get<Data, 'foo.bar'> // { value: 'foobar', count: 6 }
```

```typescript
type Split<S extends string, Element extends string = '.'> = S extends ''
  ? []
  : S extends `${infer Left}${Element}${infer Rest}`
  ? [Left, Rest]
  : [S];

type Get<T, K extends string> = K extends keyof T
  ? T[K]
  : Split<K>['length'] extends 2
  ? Split<K>[0] extends keyof T
    ? Split<K>[1] extends string
      ? Get<T[Split<K>[0]], Split<K>[1]>
      : never
    : never
  : never;
```

## 15. String to Number

```typescript
type cases = [
  Expect<Equal<ToNumber<'0'>, 0>>,
  Expect<Equal<ToNumber<'5'>, 5>>,
  Expect<Equal<ToNumber<'12'>, 12>>,
  Expect<Equal<ToNumber<'27'>, 27>>,
  Expect<Equal<ToNumber<'18@7_$%'>, never>>,
]
```

```typescript
type ToNumber<S extends string> = S extends `${infer N extends number}` ? N : never;
```

## 16. Tuple Filter

```typescript
type cases = [
  Expect<Equal<FilterOut<[], never>, []>>,
  Expect<Equal<FilterOut<[never], never>, []>>,
  Expect<Equal<FilterOut<['a', never], never>, ['a']>>,
  Expect<Equal<FilterOut<[1, never, 'a'], never>, [1, 'a']>>,
  Expect<Equal<FilterOut<[never, 1, 'a', undefined, false, null], never | null | undefined>, [1, 'a', false]>>,
  Expect<Equal<FilterOut<[number | null | undefined, never], never | null | undefined>, [number | null | undefined]>>,
]

```

```typescript
type FilterOut<T extends any[], F> = T extends [infer R, ...infer Rest] ? [R] extends [F] ? FilterOut<Rest, F> : [R, ...FilterOut<Rest, F>] : []

```

## 17.Tuple to Enum Object

```typescript
type cases = [
  Expect<Equal<Enum<[]>, {}>>,
  Expect<Equal<
  Enum<typeof OperatingSystem>,
  {
    readonly MacOS: 'macOS'
    readonly Windows: 'Windows'
    readonly Linux: 'Linux'
  }
  >>,
  Expect<Equal<
  Enum<typeof OperatingSystem, true>,
  {
    readonly MacOS: 0
    readonly Windows: 1
    readonly Linux: 2
  }
  >>,
  Expect<Equal<
  Enum<typeof Command>,
  {
    readonly Echo: 'echo'
    readonly Grep: 'grep'
    readonly Sed: 'sed'
    readonly Awk: 'awk'
    readonly Cut: 'cut'
    readonly Uniq: 'uniq'
    readonly Head: 'head'
    readonly Tail: 'tail'
    readonly Xargs: 'xargs'
    readonly Shift: 'shift'
  }
  >>,
  Expect<Equal<
  Enum<typeof Command, true>,
  {
    readonly Echo: 0
    readonly Grep: 1
    readonly Sed: 2
    readonly Awk: 3
    readonly Cut: 4
    readonly Uniq: 5
    readonly Head: 6
    readonly Tail: 7
    readonly Xargs: 8
    readonly Shift: 9
  }
  >>,
]
```

```typescript
type TupleKeys<T extends readonly unknown[]> = T extends readonly [
  infer Head,
  ...infer Tail
]
  ? TupleKeys<Tail> | Tail["length"]
  : never;

type Enum<T extends readonly string[], N extends boolean = false> = {
  readonly [K in TupleKeys<T> as Capitalize<T[K]>]: N extends true ? K : T[K]
};
```

## 18. Deep object to unique

```typescript
type DeepObjectToUniq<O extends object> = {
  [k in keyof O]: O[k] extends object ? DeepObjectToUniq<O[k]> & { [unique: symbol]: [O, k] } : O[k]
} & { [unique: symbol]: O }

/* _____________ Test Cases _____________ */
import type { Equal, IsFalse, IsTrue } from '@type-challenges/utils'

type Quz = { quz: 4 }

type Foo = { foo: 2; baz: Quz; bar: Quz }
type Bar = { foo: 2; baz: Quz; bar: Quz & { quzz?: 0 } }

type UniqQuz = DeepObjectToUniq<Quz>
type UniqFoo = DeepObjectToUniq<Foo>
type UniqBar = DeepObjectToUniq<Bar>

declare let foo: Foo
declare let uniqFoo: UniqFoo

uniqFoo = foo
foo = uniqFoo

type cases = [
  IsFalse<Equal<UniqQuz, Quz>>,
  IsFalse<Equal<UniqFoo, Foo>>,
  IsTrue<Equal<UniqFoo['foo'], Foo['foo']>>,
  IsTrue<Equal<UniqFoo['bar']['quz'], Foo['bar']['quz']>>,
  IsFalse<Equal<UniqQuz, UniqFoo['baz']>>,
  IsFalse<Equal<UniqFoo['bar'], UniqFoo['baz']>>,
  IsFalse<Equal<UniqBar['baz'], UniqFoo['baz']>>,
  IsTrue<Equal<keyof UniqBar['baz'], keyof UniqFoo['baz']>>,
  IsTrue<Equal<keyof Foo, keyof UniqFoo & string>>,
]
```

## 19. Length of String 2

```typescript
type Two<S extends string,L extends string = '',R extends string = ''> =
  S extends `${infer x}${infer xs}`
    ? xs extends `${infer y}${infer ys}`
      ? Two<ys, `${L}${x}`, `${R}${y}`>
    : [`${S}${L}`,R]
  : [L,R];

type Spread<S extends string> =
  S extends ''
    ? []
  : Two<S> extends [infer L, ''] ? [L]
  : Two<S> extends [infer L, infer R]
    ? L extends string
      ? R extends string
        ? [...Spread<L>, ...Spread<R>]
      : never
    : never
  : [];
type LengthOfString<S extends string> = Spread<S>['length'];

/* _____________ Test Cases _____________ */
import type { Equal, IsTrue } from '@type-challenges/utils'

type cases = [
  IsTrue<Equal<LengthOfString<''>, 0>>,
  IsTrue<Equal<LengthOfString<'1'>, 1>>,
  IsTrue<Equal<LengthOfString<'12'>, 2>>,
  IsTrue<Equal<LengthOfString<'123'>, 3>>,
  IsTrue<Equal<LengthOfString<'1234'>, 4>>,
  IsTrue<Equal<LengthOfString<'12345'>, 5>>,
  IsTrue<Equal<LengthOfString<'123456'>, 6>>,
  IsTrue<Equal<LengthOfString<'1234567'>, 7>>,
  IsTrue<Equal<LengthOfString<'12345678'>, 8>>,
  IsTrue<Equal<LengthOfString<'123456789'>, 9>>,
  IsTrue<Equal<LengthOfString<'1234567890'>, 10>>,
  IsTrue<Equal<LengthOfString<'12345678901'>, 11>>,
  IsTrue<Equal<LengthOfString<'123456789012'>, 12>>,
  IsTrue<Equal<LengthOfString<'1234567890123'>, 13>>,
  IsTrue<Equal<LengthOfString<'12345678901234'>, 14>>,
  IsTrue<Equal<LengthOfString<'123456789012345'>, 15>>,
  IsTrue<Equal<LengthOfString<'1234567890123456'>, 16>>,
  IsTrue<Equal<LengthOfString<'12345678901234567'>, 17>>,
  IsTrue<Equal<LengthOfString<'123456789012345678'>, 18>>,
  IsTrue<Equal<LengthOfString<'1234567890123456789'>, 19>>,
  IsTrue<Equal<LengthOfString<'12345678901234567890'>, 20>>,
  IsTrue<Equal<LengthOfString<'123456789012345678901'>, 21>>,
  IsTrue<Equal<LengthOfString<'1234567890123456789012'>, 22>>,
  IsTrue<Equal<LengthOfString<'12345678901234567890123'>, 23>>,
  IsTrue<Equal<LengthOfString<'aaaaaaaaaaaaggggggggggggggggggggkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'>, 272>>,
  IsTrue<Equal<LengthOfString<'000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'>, 999>>,
]
```

## 20. Union to Tuple

```typescript
type UnionToIntersection<U> = (U extends U ? (x: U) => unknown : never) extends (
  x: infer R,
) => unknown
  ? R
  : never;

// type res = UnionToIntersection<{ a: string } | { b: number }>;

/**
 * 并集转元组
 */
type UnionToTuple<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer ReturnType
  ? [...UnionToTuple<Exclude<T, ReturnType>>, ReturnType]
  : [];

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type ExtractValuesOfTuple<T extends any[]> = T[keyof T & number]

type cases = [
  Expect<Equal<UnionToTuple<'a' | 'b'>['length'], 2>>,
  Expect<Equal<ExtractValuesOfTuple<UnionToTuple<'a' | 'b'>>, 'a' | 'b'>>,
  Expect<Equal<ExtractValuesOfTuple<UnionToTuple<'a'>>, 'a'>>,
  Expect<Equal<ExtractValuesOfTuple<UnionToTuple<any>>, any>>,
  Expect<Equal<ExtractValuesOfTuple<UnionToTuple<undefined | void | 1>>, void | 1>>,
  Expect<Equal<ExtractValuesOfTuple<UnionToTuple<any | 1>>, any | 1>>,
  Expect<Equal<ExtractValuesOfTuple<UnionToTuple<any | 1>>, any>>,
  Expect<Equal<ExtractValuesOfTuple<UnionToTuple<'d' | 'f' | 1 | never>>, 'f' | 'd' | 1>>,
  Expect<Equal<ExtractValuesOfTuple<UnionToTuple<[{ a: 1 }] | 1>>, [{ a: 1 }] | 1>>,
  Expect<Equal<ExtractValuesOfTuple<UnionToTuple<never>>, never>>,
  Expect<Equal<ExtractValuesOfTuple<UnionToTuple<'a' | 'b' | 'c' | 1 | 2 | 'd' | 'e' | 'f' | 'g'>>, 'f' | 'e' | 1 | 2 | 'g' | 'c' | 'd' | 'a' | 'b'>>,
]
```
