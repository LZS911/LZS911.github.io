---
title: React 编译器
date: "2024-05-22"
image: 
headerImage: false
star: true
category: blog
author: Ai.Haibara
excerpt: 
theme: fancy
---


发布于 2022年3月的 React 18 正式版已经“服役”两年多的时间了，现在终于要迎来 React 19 了。这个版本将引入期待已久的全新 [React 19 RC](https://react.dev/blog/2024/04/25/react-19) 编译器！它通过自动化优化来简化前端开发流程，减少手动进行记忆化优化的需求。本文就来看看 React 编译器是什么？它是如何工作的？又带来了哪些好处？

## React 编译器介绍

React 编译器是一款新的构建时工具，可自动优化 React 应用以提高其性能，尤其是在更新（重新渲染）时。在深入探究 React 编译器的工作原理之前，我们先回顾一下 React 的核心思维模型。

### React 心智模型

React的核心是一个声明式和基于组件的心智模型。在前端开发中，声明式编程意味着描述 UI 的期望最终状态，而无需通过 DOM 操作来指定达到该状态的每一步。同时，基于组件的方法将 UI 元素分解为可重用、简洁、自包含的构建块，促进了模块化并简化了维护。

为了有效地识别需要更新的特定 DOM 元素，React使用了一个称为虚拟 DOM 的内存中UI表示。当应用状态发生变化时，React会将虚拟DOM与真实DOM进行比较，识别出所需的最小更改集，并精确地更新真实DOM。

简而言之，React的心智模型是：每当应用状态发生变化时，React就会重新渲染。然而，有时React可能会过于“反应灵敏”，导致不必要的重新渲染，从而降低应用的性能。

### ReRender 的困境

React 对应用状态变化的快速响应能力是一把双刃剑。一方面，由于其声明式方法，它简化了前端开发。另一方面，它可能导致 UI 中组件对状态变化的过度重新渲染。

当处理如对象和数组这样的 JavaScript 数据结构时，重新渲染问题尤为常见。问题在于，JavaScript中没有一种计算效率高的方法来比较两个对象或数组是否相等（即具有相同的键和值）。

考虑以下场景：有一个React组件，它在每次渲染时都会生成一个新的对象或数组，如下所示：

```jsx
const ListDemo:React.FC = () => {
  const list = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div>
      <h2>List Demo</h2>
      <ul>
        {list.map((letter, index) => (
          <li key={index}>{letter}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListDemo;
```

尽管React组件在每次渲染时可能生成内容相同的本地数组，但React无法直接识别出这一点，因此可能会不必要地触发依赖于该数组中值的组件及其嵌套DOM元素的重新渲染，即使 UI 实际上没有变化。这种不受控制的重新渲染会很快导致性能下降，影响用户体验。

为了优化这种情况并减少不必要的重新渲染，React 开发人员可以利用记忆化技术。记忆化允许缓存基于特定输入的计算结果或组件输出，并在输入未变时直接复用这些结果。这种方法能够显著减少组件的重新渲染次数，提高 React 应用的整体性能和效率。

React 提供了以下记忆化工具来帮助我们实现这一目标：

- `React.memo()`：一个高阶组件，允许基于props的浅比较来避免组件的重新渲染，只要props没有发生变化。
- `useMemo()`：用于在组件重新渲染之间缓存计算的结果。只有当依赖项之一发生变化时，useMemo()才会重新计算并返回新的结果。
- `useCallback()`：用于缓存函数的定义，确保在依赖项未变时不会重新创建函数。

>通过使用useMemo() Hook，可以优化<ListDemo>组件，避免在其依赖的数据（如数组）未发生变化时进行不必要的重新渲染。然而，性能优化总是会有成本，但并不总是带来好处。具体可见： https://kentcdodds.com/blog/usememo-and-usecallback

### React 编译器的诞生

React 的记忆化工具确实在提升性能上起到了关键作用，但它们确实增加了开发者的工作量和代码复杂度，因为它要求开发者不仅描述 UI 的状态，还需显式管理渲染的优化。这在一定程度上违背了 React 强调的声明式编程哲学。

为了减轻开发者的负担，理想的解决方案是一个智能的编译器或工具链，它能够自动分析 React 组件的依赖关系，并生成优化的代码。这样的工具能够确保组件仅在状态值发生实质性变化时重新渲染，从而在不牺牲性能的前提下，保持代码的简洁性和可维护性。

为了优化应用程序，React Compiler 会自动记忆代码，也就是说无需开发者再去手动添加 `React.memo()`、`useMemo()`、`useCallback()` 这些记忆优化工具。 

编译器利用其对 JavaScript 和 [React 规则](https://react.dev/reference/rules) 的了解，自动记住组件和钩子中的值或值组。如果检测到违反规则的情况，它将自动跳过这些组件或钩子，并继续安全地编译其他代码。

### 编译器做了什么

首先了解目前 React 中记忆化的主要用例会很有帮助：

1. 跳过组件的级联重新渲染（perf）
   - 重新渲染<Parent />会导致组件树中的许多组件重新渲染，即使只有部分组件<Parent />发生了变化
2. 跳过 React 外部的昂贵计算（perf）
   - 例如，expensivelyProcessAReallyLargeArrayOfObjects()在需要该数据的组件或钩子内部调用
3. 将 deps 记忆化为效果
   - 确保钩子的依赖项仍在===重新渲染，以防止钩子中的无限循环，例如useEffect()

React Compiler 的初始版本主要致力于提高更新性能（即重新渲染现有组件），因此它主要关注前两种用例。

#### 优化 ReRender
在以下示例中，每当 `<FriendList />` 的状态发生变化时，`<MessageButton>` 都会重新渲染：

```jsx
import { useState } from 'react';
import { useFriendOnlineCount } from './hooks/useFriendOnlineCount';

type Props = {
  friends: Array<{ name: string; id: number }>;
};

function NoFriends() {
  console.log('====== re render NoFriends ======');
  return <div>no friend</div>;
}

function FriendListCard({ friend }: { friend: { name: string; id: number } }) {
  console.log('====== re render FriendListCard ======');
  return <div>friend name: {friend.name}</div>;
}

function MessageButton() {
  console.log('====== re render MessageButton ======');
  const [messageCount, setMessageCount] = useState(0);
  return (
    <button
      onClick={() => {
        setMessageCount(messageCount + 1);
      }}
    >
      send message
    </button>
  );
}

export function FriendList({ friends }: Props) {
  console.log('====== re render FriendList ======');

  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}

```

> 当 `friends` 发生变化后触发的 ReRender

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/e5252e3c-2982-4a43-a025-4f0691f97586)

React Compiler 自动应用相当于手动记忆的功能，确保只有应用程序的相关部分在状态更改时重新渲染，这有时被称为“细粒度反应性”。在上面的示例中，React Compiler 确定 <FriendListCard /> 的返回值即使在 `friends` 发生引用变化时也可以重用，并且可以避免重新创建此 JSX 时重新渲染 <MessageButton>。

> 当 `friends` 发生变化后触发的 ReRender

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/6c0022af-8c46-44d4-9ff6-146dcad8fb46)


#### 记忆昂贵的计算

编译器还可以自动记忆第二种用例：

```jsx
// **Not** memoized by React Compiler, since this is not a component or hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ } 

// Memoized by React Compiler since this is a component
function TableContainer({ items }) {
  // This function call would be memoized:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```

但是，如果 `expensivelyProcessAReallyLargeArrayOfObjects` 确实是一个昂贵的函数，您可能需要考虑在 React 之外实现自己的记忆功能，因为：

- React Compiler 仅记忆 React 组件和 hooks，而不是每个函数
- React Compiler 的记忆功能不会在多个组件或钩子之间共享

因此，如果 `expensivelyProcessAReallyLargeArrayOfObjects` 在许多不同的组件中使用，即使传递了相同的项目，也会重复运行昂贵的计算。我们建议先[进行分析](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive)，看看它是否真的那么昂贵，然后再使代码变得更复杂。

#### 仍在的研究领域：useEffect 的记忆

编译器的记忆化方式有时会与代码最初的记忆化方式不同。通常情况下，这是件好事，因为编译器可以比手动memoize更精细地进行memoize。例如，编译器使用底层原语而不是通过 useMemo 进行记忆化，因此在生成记忆化代码时无需遵循钩子规则，同时仍可安全地对钩子调用进行记忆化。

然而，如果以前以某种方式记忆化的内容不再以完全相同的方式记忆化，这可能会导致问题。最常见的例子是依赖于依赖项不发生变化以防止无限循环或过渡触发——例如 `useEffect`、`useLayoutEffect`。

这对于React团队来说仍然是一个研究的开放领域，他们正在寻找解决这个问题的最佳方式。目前，编译器将静态验证自动备忘与现有手动备忘的匹配情况。如果无法证明它们是相同的，组件或钩子将被安全地跳过。

因此，目前建议保留任何现有的useMemo()或useCallback()调用，以确保不改变 useEffect 的行为。React编译器仍将尝试产生更优化的记忆化代码，但如果它不能保持原始的记忆化行为，将跳过编译。

同时，建议不要删除现有的useMemo和useCallback，而是在编写新代码时完全不依赖它们。

### React 编译器的预设条件

1. React 编译器假定您的代码：
   - 是有效、符合语义的 JavaScript
   - 在访问可空/可选值和属性之前，测试它们是否已定义（例如，如果使用 TypeScript，则启用 strictNullChecks），即 if (object.nullableProperty) { object.nullableProperty.foo } 或使用可选链 object.nullableProperty?.foo
2. 遵循 [React 规则](https://react.dev/reference/rules)
   - React 编译器可以静态验证许多 React 规则，并在检测到错误时跳过编译。要查看错误，建议同时安装 eslint-plugin-react-compiler。

### React 编译器的作用范围

目前，React编译器一次只处理一个文件，这意味着它只使用单个文件中的信息来执行其优化。虽然这乍一看可能看起来有限，但由于React使用普通的JavaScript值以及编译器友好的约定和规则的编程模型，这种方法出奇地有效。
当然，也有权衡，比如不能使用另一个文件中的信息，这将允许更细粒度的记忆化。但当前的单文件方法在编译器的复杂性与输出质量之间取得了平衡，结果显示这是一个好的权衡。

虽然编译器目前不使用来自TypeScript或Flow等类型化JavaScript语言的类型信息，但在内部它有自己的类型系统，这有助于它更好地理解代码。

> 参考至：
> 1. https://github.com/reactwg/react-compiler/discussions/5
> 2. https://react.dev/blog/2024/04/25/react-19#actions
> 3. https://mp.weixin.qq.com/s/5F5HgOmzQLQhcEu8EIZCMw
> 4. https://react.dev/learn/react-compiler#other-issues
