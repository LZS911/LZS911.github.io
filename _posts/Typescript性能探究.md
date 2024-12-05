---
title: Typescript性能探究
date: "2024-12-05"
image: 
headerImage: false
tag:
  - Typescript
star: true
category: blog
author: Ai.Haibara
excerpt: 
theme: orange
---



## 为什么 TypeScript 性能很重要

TypeScript 性能问题会严重影响开发体验，尤其是在 IDE 响应能力可能受到影响的大型项目中。理解和实施性能优化​​策略对于保持顺畅的开发工作流程至关重要。


## 关键优化策略

>原文地址：https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections

### 优先选择 Interface 而不是 Intersection Types

大多数时候，对象类型的简单类型别名的作用与接口非常相似。

```
interface Foo { prop: string }

type Bar = { prop: string };
```

但是，一旦您需要组合两个或多个类型，您就可以选择使用接口扩展这些类型，或者在类型别名中将它们相交，此时差异就开始变得重要了。

1. interface 创建了一个单一的平面对象类型，可以检测属性冲突，这通常是需要解决的重要问题！ 另一方面，intersections 只是递归合并属性，在某些情况下永远不会产生属性冲突。
![image](https://github.com/user-attachments/assets/65b15da2-9a72-4ece-adf2-4346eb86d947)
![image](https://github.com/user-attachments/assets/f8d16d70-92bf-491f-88c9-70f485249327)

2. interface 的显示效果也更好，而 intersections 的类型别名不能显示为其他交集的一部分。 interface 之间的类型关系也会被缓存，而 intersections 类型则不会被整体缓存。

3. 最后一个值得注意的区别是，在针对目标交叉类型进行检查时，在针对 "有效"/"扁平化 "类型进行检查之前，会先检查每个类型。

因此，建议使用interfaces/ extends来扩展类型，而不是创建交集类型。

```
- type Foo = Bar & Baz & {
-     someProp: string;
- }
+ interface Foo extends Bar, Baz {
+     someProp: string;
+ }
```

### 显示标注类型而不是依赖类型推断

添加类型注解，尤其是返回类型，可以为编译器节省大量工作。 部分原因是命名类型往往比匿名类型（编译器可能会推断出匿名类型）更紧凑，这就减少了读写声明文件（例如增量编译）所花费的时间。 类型推断非常方便，因此没有必要普遍使用，但如果你发现代码中有一段运行速度较慢，可以尝试使用。

```
- import { otherFunc } from "other";
+ import { otherFunc, OtherType } from "other";

- export function func() {
+ export function func(): OtherType {
      return otherFunc();
  }
```

### 优先选择基本类型而不是联合类型

联合类型很棒 - 它们可以让您表达类型的可能值的范围。

```
interface WeekdaySchedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  wake: Time;
  startWork: Time;
  endWork: Time;
  sleep: Time;
}

interface WeekendSchedule {
  day: "Saturday" | "Sunday";
  wake: Time;
  familyMeal: Time;
  sleep: Time;
}

declare function printSchedule(schedule: WeekdaySchedule | WeekendSchedule);
```

然而，它们也是有代价的。每次将参数传递给printSchedule时，都必须将其与并集的每个元素进行比较。对于二元联合来说，这是微不足道且廉价的。
但是，如果您的联合体有十多个元素，则可能会导致编译速度出现实际问题。
例如，为了从联合中消除冗余成员，必须将元素进行成对比较，这是二次的。当与大型联合相交时，可能会发生这种检查，其中对每个联合成员进行相交可能会产生巨大的类型，然后需要减少这些类型。避免这种情况的一种方法是使用子类型，而不是联合。


```
interface Schedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  wake: Time;
  sleep: Time;
}

interface WeekdaySchedule extends Schedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  startWork: Time;
  endWork: Time;
}

interface WeekendSchedule extends Schedule {
  day: "Saturday" | "Sunday";
  familyMeal: Time;
}

declare function printSchedule(schedule: Schedule);
```

当尝试对每个内置 DOM 元素类型进行建模时，可能会出现一个更现实的示例。在这种情况下，最好创建一个具有DivElement 、 ImgElement等所有扩展的通用成员的基本HtmlElement类型，而不是创建一个详尽的联合，例如 DivElement | /*...*/ | ImgElement | /*...*/ 。


### 命名复杂类型

可以在允许类型注释的任何地方编写复杂类型。

```
interface SomeType<T> {
    foo<U>(x: U):
        U extends TypeA<T> ? ProcessTypeA<U, T> :
        U extends TypeB<T> ? ProcessTypeB<U, T> :
        U extends TypeC<T> ? ProcessTypeC<U, T> :
        U;
}
```

这很方便，但现在，每次调用foo时，TypeScript 都必须重新运行条件类型。此外，关联SomeType的任何两个实例需要重新关联foo返回类型的结构。

如果此示例中的返回类型被提取到类型别名，则编译器可以缓存更多信息：

```
type FooResult<U, T> =
    U extends TypeA<T> ? ProcessTypeA<U, T> :
    U extends TypeB<T> ? ProcessTypeB<U, T> :
    U extends TypeC<T> ? ProcessTypeC<U, T> :
    U;

interface SomeType<T> {
    foo<U>(x: U): FooResult<U, T>;
}
```

### 项目拆分

当使用 TypeScript 构建任何规模不小的代码库时，将代码库组织成几个独立的项目会很有帮助。每个项目都有自己的tsconfig.json ，它依赖于其他项目。这有助于避免在一次编译中加载太多文件，并且还使某些代码库布局策略更容易组合在一起。

有一些非常基本的方法可以将代码库组织到项目中。例如，一个程序可能包含一个客户端项目、一个服务器项目以及一个在两者之间共享的项目。

```
              ------------
              |          |
              |  Shared  |
              ^----------^
             /            \
            /              \
------------                ------------
|          |                |          |
|  Client  |                |  Server  |
-----^------                ------^-----
```

测试也可以分解到自己的项目中。

```
              ------------
              |          |
              |  Shared  |
              ^-----^----^
             /      |     \
            /       |      \
------------  ------------  ------------
|          |  |  Shared  |  |          |
|  Client  |  |  Tests   |  |  Server  |
-----^------  ------------  ------^-----
     |                            |
     |                            |
------------                ------------
|  Client  |                |  Server  |
|  Tests   |                |  Tests   |
------------                ------------
```


### 指定文件

您应该始终确保您的配置文件不会同时包含太多文件。

在tsconfig.json中，有两种方法可以指定项目中的文件。

1. files列表
2. include和exclude列表

两者之间的主要区别在于files需要源文件的文件路径列表，并且include / exclude使用通配模式来匹配文件。

虽然指定files将允许 TypeScript 直接快速加载文件，但如果您的项目中有很多文件而只有几个顶级入口点，则可能会很麻烦。此外，很容易忘记将新文件添加到tsconfig.json中，这意味着您最终可能会遇到奇怪的编辑器行为，其中这些新文件被错误地分析。所有这些都可能很麻烦。

include / exclude有助于避免需要指定这些文件，但代价是：必须通过遍历包含的目录来发现文件。当运行大量文件夹时，这可能会减慢编译速度。此外，有时编译会包含大量不必要的.d.ts文件和测试文件，这会增加编译时间和内存开销。
最后，虽然exclude有一些合理的默认值，但某些配置（如 mono-repos）意味着“重”文件夹（如node_modules仍然可以被包含在内。

对于最佳实践，我们建议如下：

1. 仅指定项目中的输入文件夹（即要包含其源代码以进行编译/分析的文件夹）。
2. 不要在同一文件夹中混合来自其他项目的源文件。
3. 如果将测试与其他源文件保存在同一文件夹中，请为它们指定一个不同的名称，以便可以轻松排除它们。
4. 避免大型构建工件和依赖项文件夹，例如源目录中的node_modules 。

**注意：如果没有exclude列表，则默认排除node_modules ；一旦添加，将node_modules显式添加到列表中非常重要。**

### 控制@types范围

默认情况下，TypeScript 会自动包含它在node_modules文件夹中找到的每个@types包，无论您是否导入它。这是为了让某些事情在使用 Node.js、Jasmine、Mocha、Chai 等时“正常工作”，因为这些工具/包不是导入的 - 它们只是加载到全局环境中。

有时，这种逻辑会在编译和编辑场景中减慢程序构建时间，甚至可能导致多个声明冲突的全局包出现问题，从而导致诸如

```
Duplicate identifier 'IteratorResult'.
Duplicate identifier 'it'.
Duplicate identifier 'define'.
Duplicate identifier 'require'.
```

在不需要全局包的情况下，修复就像在tsconfig.json / jsconfig.json中为"types"选项指定一个空字段一样简单
```
// src/tsconfig.json
{
   "compilerOptions": {
       // ...

       // Don't automatically include anything.
       // Only include `@types` packages that we need to import.
       "types" : []
   },
   "files": ["foo.ts"]
}
```

如果您仍然需要一些全局包，请将它们添加到types字段。

```
// tests/tsconfig.json
{
   "compilerOptions": {
       // ...

       // Only include `@types/node` and `@types/mocha`.
       "types" : ["node", "mocha"]
   },
   "files": ["foo.test.ts"]
}
```

### 跳过.d.ts检查

默认情况下，TypeScript 会重新检查项目中的所有 .d.ts 文件，以查找问题和不一致之处；但这通常是不必要的。 在大多数情况下，.d.ts 文件已知已经正常工作--类型之间相互扩展的方式已经验证过一次，重要的声明无论如何都会被检查。

TypeScript 提供了使用skipDefaultLibCheck标志跳过对其附带的.d.ts文件（例如lib.d.ts ）的类型检查的选项。

或者，您还可以启用skipLibCheck标志来跳过检查编译中的所有.d.ts文件。

这两个选项通常会隐藏.d.ts文件中的错误配置和冲突，因此我们建议仅将它们用于更快的构建。
