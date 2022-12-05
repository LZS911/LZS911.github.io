---
title: React中的受控组件与非受控组件
layout: post
date: '2022-09-14'
image:
headerImage: false
tag:
  - React
star: true
category: blog
author: LZS_911
description: blog
excerpt: ''
coverImage: '/assets/blog/image/cover.jpg'
ogImage:
  url: '/assets/blog/image/cover.jpg'
theme: jzman  
---

## 什么是受控组件和非受控组件?

1. 非受控组件

   ```jsx
   const Input: FC = () => {
     const [value, setValue] = useState('');

     return <input value={value} onChange={(e) => setValue(e.target.value)} />;
   };
   ```

   首先我们看一段代码, 代码定义了一个自定义 `Input` 组件, 并且不接收任何 `props`. 所以该组件的 `value` 只能通过用户的操作来更改, 而不能通过代码去控制, 所以叫做 **非受控组件**.

2. 受控组件

   > 在 HTML 中, 表单元素 (如\<input>、 \<textarea> 和 \<select>)通常自己维护 state, 并根据用户输入进行更新.而在 React 中, 可变状态 (mutable state)通常保存在组件的 state 属性中, 并且只能通过使用 setState()来更新.
   > 我们可以把两者结合起来, 使 React 的 state 成为“唯一数据源”.渲染表单的 React 组件还控制着用户输入过程中表单发生的操作.被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”.

   ```tsx
    const Input:FC = ({value:string,  onChange:(val:string) => void}) => {
      return <input value={value} onChange={e => onChange(e.target.value)}/>
    }
   ```

   对之前的非受控 `Input` 组件的代码稍微做一点调整, 将它内部的状态改为 `props` 传入, 它就变成了受控组件, 因为此时 `Input` 组件的值取决于外部传递进来的 `props`.

了解了这两个概念后, 我们思考一个问题, `ant-design` 中的 `Input` 组件是受控组件还是非受控组件?

答案是它既可以是受控组件, 也可以是非受控组件, 完全取决于项目中怎么去使用.

## 如何实现?

### 最简单的方案: 内外两个状态, 手动同步

考虑到实现成本的复杂度, 我们需要让组件逻辑在两种模式下, 尽可能的保持一致, 减少逻辑分支意味着更好的可维护性和可读性. 所以, 自然而然的, 我们可以很容易想到这个方案:

`Child` 组件内部始终存在一个状态, 不管它处于哪种模式, 它都直接使用自己内部的状态. 而当它处于受控模式时, 我们让它的内部状态和 `Parent` 组件中的状态手动保持同步.

代码如下:

```tsx
const Input: React.FC<{ value?: string; onChange?: (val: string) => void }> = ({
  value,
  onChange,
}) => {
  const isControlled = value !== undefined;

  const [innerValue, setInnerValue] = useState(value);

  useEffect(() => {
    if (isControlled) {
      setInnerValue(value);
    }
  });

  return (
    <input
      value={innerValue}
      onChange={(e) => {
        if (!isControlled) {
          setInnerValue(e.target.value);
        }
        onChange(e.target.value);
      }}
    />
  );
};
```

仔细看上面的代码, 我们会发现在受控模式下存在两个问题:

原子性: `Child` 内部状态的更新会比 `Parent` 组件晚一个渲染周期, 存在 `tearing` 的问题
性能:因为是在 `useEffect` 中通过 `setState` 来做的状态同步, 所以会额外的触发一次渲染, 存在性能问题
明确问题之后, 我们来逐个解决:

### 原子性

这个问题其实很好解决, 我们其实并不需要 Child 和 Parent 的状态保持非常严格的每时每刻都一致, 我们只需要判断, 如果组件此时处于受控模式, 那么直接使用来自外部的状态就可以了:

这样, 即便状态的同步是存在延迟的, 但是 Child 组件所真正使用到的值一定是最新的.

代码如下:

```tsx
const Input: React.FC<{ value?: string; onChange?: (val: string) => void }> = ({
  value,
  onChange,
}) => {
  const isControlled = value !== undefined;

  const [innerValue, setInnerValue] = useState(value);

  useEffect(() => {
    if (isControlled) {
      setInnerValue(value);
    }
  });

  const finalValue = isControlled ? value : innerValue;

  return (
    <input
      value={finalValue}
      onChange={(e) => {
        setInnerValue(e.target.value);
        onChange(e.target.value);
      }}
    />
  );
};
```

### 性能

因为我们是在 `useEffect` 去做状态同步的, 所以自然会额外的多触发一次 `Child` 组件的重渲染.如果 `Child` 组件比较简单的话, 那出现的性能影响可以忽略不计.但是对于一些复杂的组件 (例如 `Picker`), 多渲染一次带来的性能问题是比较严重的.

那有没有办法在 `Child` 组件的 `render` 阶段就直接更新 `value` 状态呢?

我们重新考虑一下这行 `useState` 的代码:

```js
const [innerValue, setInnerValue] = useState(value);
```

当我们创建这个 `State` 时? 我们的目的是什么? `State` 的本质是什么?

如果比较简单粗暴的分析, 我们可以把 `State` 拆成两部分:

`State` 是用来存放数据的, 它让我们在组件的渲染函数之外, 可以“持久化”一些数据
`State` 的更新可以触发重新渲染, 因为 `React` 会感知 `State` 的更新
如果写一个公式的话, 可以写成:

`State = 存放数据 + 触发重新渲染`

而但就存放数据来看, 我们可以直接使用 Ref；同样, 如果只是需要触发重新渲染, 我们可以使用类似于 `setFlag({})` 或者 `setCount(v => v + 1)` 这样的强制方式 (虽然很蠢, 但想必 90% 的 React 开发者都曾经这么写过).

那我们根据这个推断来调整一下上面的公式:

`State = Ref + forceUpdate()`

我们已经非常接近了, 根据这个公式, 我们可以把 `Child` 组件中的 `State` 拆成一个 `Ref` 和一个 `forceUpdate` 函数:

这样一来, 我们就可以直接在 `render` 阶段直接更新 `ref` 的值了:

```tsx
const Input: React.FC<{ value: string; onChange: (val: string) => void }> = ({
  value,
  onChange,
}) => {
  const isControlled = value !== undefined;

  const stateRef = useRef<T | undefined>(value);

  const [, setFlag] = useState({});

  const forceUpdate = () => {
    setFlag({});
  };

  const finalValue = isControlled ? value : stateRef.current;

  return (
    <input
      value={finalValue}
      onChange={(e) => {
        stateRef.current = e.target.value;
        forceUpdate();
        onChange(e.target.value);
      }}
    />
  );
};
```

再回头看下代码, 会发现, 为什么还需要判断根据受控和非受控模式来使用不同的值呢? 既然 `stateRef.current` 一定是最新的值, 那么完全可以简化成 `Child` 组件永远使用内部存放的数据 (`Ref`):

```tsx
const Input: React.FC<{ value: string; onChange: (val: string) => void }> = ({
  value,
  onChange,
}) => {
  const isControlled = value !== undefined;

  const stateRef = useRef<T | undefined>(value);

  if (isControlled) {
    stateRef.current = props.value;
  }
  const [, setFlag] = useState({});

  const forceUpdate = () => {
    setFlag({});
  };

  return (
    <input
      value={finalValue}
      onChange={(e) => {
        stateRef.current = e.target.value;
        forceUpdate();
        onChange(e.target.value);
      }}
    />
  );
};
```

### 抽象与复用: usePropsValue

上述代码仅实现了一个 `Input` 组件, 当需要定义其他组件时, 仍需要重复上述中的某些代码, 所以我们把核心代码抽离成一个自定义 `Hooks`, 同时完善一些细节. 代码如下:

```ts
import { useUpdate } from 'ahooks';
import { isFunction } from 'lodash-es';
import { SetStateAction, useRef } from 'react';
export type usePropsValueOptions<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value?: T) => void;
};

const usePropsValue = <T>({
  value,
  defaultValue,
  onChange,
}: usePropsValueOptions<T>): [
  T | undefined,
  (v: SetStateAction<T | undefined>) => void
] => {
  const isControlled = value !== undefined;
  const update = useUpdate();
  const stateRef = useRef<T | undefined>(isControlled ? value : defaultValue);

  if (isControlled) {
    stateRef.current = value;
  }

  const setState = (v: SetStateAction<T | undefined>) => {
    const nextValue = isFunction(v) ? v(stateRef.current) : v;

    if (nextValue === stateRef.current) {
      return;
    }

    stateRef.current = nextValue;
    update();
    onChange?.(nextValue);
  };
  return [stateRef.current, setState];
};

export default usePropsValue;
```

这样, 在各种组件中, 我们可以直接使用 `usePropsValue`, 用法和 `useState` 非常接近:

```ts
const [internalValue, setInternalValue] = usePropsValue<string>({
  defaultValue,
  value,
  onChange,
});

return (
  <input
    value={internalValue}
    onChange={(e) => {
      setInternalValue(e.target.value);
    }}
  />
);
```
