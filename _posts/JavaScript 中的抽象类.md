---
title: JavaScript 中的抽象类
layout: post
date: '2025-03-05'
image:
headerImage: false
tag:
  - next.js
  - react
star: true
category: blog
author: LZS_911
description: blog
theme: condensed-night-purple
---

在 JavaScript 中，抽象类的概念并不像 Java、TypeScript 和 Python 等其他语言那样得到原生支持。然而，我们可以通过编写自定义代码来模拟 JavaScript 中抽象类的行为。

本文将解释什么是抽象类、抽象类与函数式编程的对比，以及如何在 JavaScript 中实现抽象类。鉴于 TypeScript 是一种基于 JavaScript 的编程语言，这里将用它来解释抽象类的概念，以便于理解。

## 什么是抽象类？

在面向对象编程（OOP）中，所有的对象都是通过类来描述的。然而，并不是所有的类都用于描述具体的对象。如果一个类中没有包含足够的信息来描述一个具体的对象，这样的类就是**抽象类**。

抽象类除了不能实例化对象之外，类的其他功能依然存在。成员变量、成员方法和构造方法的访问方式与普通类一样。

由于抽象类不能实例化对象，因此抽象类必须被继承才能使用。这也是为什么通常在设计阶段就要决定是否要设计抽象类。

父类包含了子类集合的常见方法，但由于父类本身是抽象的，因此不能直接使用这些方法。

### 示例：TypeScript中的抽象类

> TypeScript 中的类、方法和字段可能是抽象的。
> 抽象方法或抽象字段是尚未提供实现的方法或字段。这些成员必须存在于抽象类中，而抽象类不能直接实例化。
> 抽象类的作用是作为子类的基类，子类会实现所有抽象成员。如果一个类没有任何抽象成员，则称其为具体类。


### 示例：TypeScript 中的抽象类

在 TypeScript 中，类、方法和字段可以是抽象的。抽象方法或抽象字段是尚未提供实现的方法或字段。这些成员必须存在于抽象类中，而抽象类不能直接实例化。

抽象类的作用是作为子类的基类，子类会实现所有抽象成员。如果一个类没有任何抽象成员，则称其为**具体类**。

以下是一个抽象类 `BaseConfigUtils` 的示例：

```typescript
export abstract class BaseConfigUtils<
  T extends BaseConfig,
  InitOptions extends BaseOptions,
  ResolvedOptions extends InitOptions
> {
  // ...existing code...

  constructor(options: ConfigOptions<T, InitOptions, ResolvedOptions>) {
    // ...existing code...
  }

  async resolveConfig(opts: unknown): Promise<T> {
    // ...existing code...
  }

  protected async handleNonInteractiveMode(
    opts: InitOptions,
    existingConfig: T | null
  ): Promise<T> {
    // ...existing code...
  }

  protected abstract handleInteractiveMode(
    opts: InitOptions,
    existingConfig: T | null
  ): Promise<T>;

  protected abstract mergeConfig(
    opts: InitOptions,
    existingConfig: T
  ): Promise<T>;

  protected abstract transformToConfig(opts: ResolvedOptions): T;

  protected abstract getConfigIdentifier(opts: InitOptions): string;

  // ...existing code...
}
```

在这个示例中，`BaseConfigUtils` 定义了处理配置文件的结构。子类必须实现 `handleInteractiveMode`、`mergeConfig`、`transformToConfig` 和 `getConfigIdentifier` 等方法。

## 函数式编程方法

函数式编程（FP）是一种将计算视为数学函数求值的范式，它避免改变状态和可变数据。FP 不使用类和继承，而是依赖纯函数和高阶函数。

### 示例：TypeScript中的函数式编程

以下是使用函数式编程实现类似功能的示例：

```typescript
type ConfigKey = 'client' | 'mocks';

interface BaseConfig {
  [key: string]: string;
}

interface BaseOptions {
  yes: boolean;
  cwd: string;
  [key: string]: unknown;
}

interface ConfigOptions<T extends BaseConfig, InitOptions extends BaseOptions, ResolvedOptions extends InitOptions> {
  configKey: ConfigKey;
  initOptionsSchema: z.ZodSchema<InitOptions>;
  resolvedOptionsSchema: z.ZodSchema<ResolvedOptions>;
  defaultConfig: T;
  command: Command;
  cwd: string;
}

const resolveConfig = async <T extends BaseConfig, InitOptions extends BaseOptions, ResolvedOptions extends InitOptions>(
  options: ConfigOptions<T, InitOptions, ResolvedOptions>,
  opts: unknown
): Promise<T> => {
  const validatedOpts = await options.initOptionsSchema.parseAsync(opts).catch((error) => {
    handleSchemaError(error, options.command);
  });

  const existingConfig = await getRawConfigs(options.cwd, options.configKey, getConfigIdentifier(validatedOpts));

  if (validatedOpts.yes) {
    return handleNonInteractiveMode(options, validatedOpts, existingConfig);
  }

  return handleInteractiveMode(options, validatedOpts, existingConfig);
};

const handleNonInteractiveMode = async <T extends BaseConfig, InitOptions extends BaseOptions, ResolvedOptions extends InitOptions>(
  options: ConfigOptions<T, InitOptions, ResolvedOptions>,
  opts: InitOptions,
  existingConfig: T | null
): Promise<T> => {
  if (existingConfig) {
    return mergeConfig(opts, existingConfig);
  }

  try {
    const validatedOpts = await options.resolvedOptionsSchema.parseAsync(opts);
    return transformToConfig(validatedOpts);
  } catch (error) {
    handleSchemaError(error, options.command);
  }
};

// 定义其他函数，如 handleInteractiveMode、mergeConfig、transformToConfig、getConfigIdentifier 和 getRawConfigs
```

## 抽象类与函数式编程的比较

### 抽象类
- **优点**：
  - 结构清晰，组织有序。
  - 强制一致的接口。
  - 对于熟悉面向对象编程（OOP）的开发人员来说更容易理解。
- **缺点**：
  - 可能导致复杂的继承层次结构。
  - 在组合方面灵活性较差。

### 函数式编程
- **优点**：
  - 提倡不变性和纯函数。
  - 更容易组合和重用函数。
  - 避免了继承的陷阱。
- **缺点**：
  - 对于习惯于 OOP 的开发人员来说可能更难理解。
  - 在管理状态和依赖项时可能会导致更多的样板代码。
 
## JavaScript 中的抽象类

```
class Base {
  constructor(name) {
    if (this.constructor == Base) {
      throw new Error("Class is of abstract type and can't be instantiated");
    }

    if (this.getName == undefined) {
      throw new Error('getName method must be implemented');
    }
    this.name = name;
  }

  printName() {
    console.log('Hello, ' + this.getName());
  }
}

class Derived extends Base {
  getName() {
     return 'world';
  }
}

// const b = new Base();
const d = new Derived();

d.printName();
```

## 结论

抽象类和函数式编程各有优缺点。抽象类提供了一种清晰且结构化的方法来强制接口和共享行为，而函数式编程则提供了灵活性并提倡不变性。选择哪种方法取决于项目的具体需求和团队对每种范式的熟悉程度。

如果想要在 JavaScript 中创建抽象类，建议使用 TypeScript，因为它不仅提供了类型安全性，还原生支持抽象类的概念。
