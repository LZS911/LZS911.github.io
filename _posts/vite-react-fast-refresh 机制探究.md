---
title: vite-react-fast-refresh 机制探究
layout: post
date: "2025-06-09"
image:
headerImage: false
star: true
category: blog
author: LZS_911
description: blog
excerpt: ''
theme: fancy  
---


## React 中的实时重载技术对比

Live Reloading、Hot Reloading 和 Fast Refresh 三种技术的主要区别：

### 技术概览

### #Live Reloading（实时重载）
- **工作原理**：当代码发生变化时，整个应用会完全重新加载
- **状态保留**：不保留应用状态，每次都是全新的应用实例
- **用户体验**：每次修改代码后页面会刷新，用户需要重新操作才能回到之前的状态

#### Hot Reloading（热重载）
- **工作原理**：只替换修改的模块，不刷新整个页面
- **状态保留**：尝试保留应用状态，但在组件有状态变更时可能会失败
- **局限性**：在处理类组件和复杂状态时经常出现问题

#### Fast Refresh（快速刷新）
- **工作原理**：React 官方开发的改进版热重载技术
- **状态保留**：能够可靠地保留 React 组件状态，即使在编辑嵌套组件时
- **错误处理**：提供更好的错误边界，在修复错误后能恢复正常渲染

在 Vite 中，Vite 与 React 结合时默认使用 Fast Refresh，`@vitejs/plugin-react` 已集成此功能。

## 项目中关于快速刷新的异常现象

**测试环境版本：**
```json
{
  "react": "18.3.20",
  "vite": "5.2.6",
  "@vitejs/plugin-react": "4.3.4",
  "eslint-plugin-react-refresh": "^0.4.20"
}
```

### 现象描述

1. **两个大写字母开头的非React组件函数**：当在 `.tsx` 文件中定义两个以大写字母开头的非React组件函数，并且同时使用非默认导出时，快速刷新失效，但未触发 [eslint-plugin-react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh) 规则。但是将两个函数调整为一个大写一个小写开头时，触发 eslint 规则，但快速刷新功能正常工作。

2. **大写函数与小写变量混合导出**：当在 `.tsx` 文件中定义一个以大写字母开头的非React组件函数以及一个小写字母开头的常规变量（例如数组），并且同时使用非默认导出时，触发 eslint 规则，并且 `vite-plugin-react` 抛出警告，但快速刷新功能正常工作。

```
Plugin: vite-plugin-eslint
File: /Users/liyu/work/actionsky/dms-ui/dms-ui/packages/base/src/page/DataSource/components/List/columns.tsx
14:57:45 [vite] hmr invalidate /src/page/DataSource/components/List/columns.tsx Could not Fast Refresh (new export)
```

为了排除特定依赖版本的影响，创建了一个最小复现仓库：[react-fast-refresh-demo](https://github.com/LZS911/react-fast-refresh-demo)

**最新测试环境版本：**
```json
{
  "react": "19.1.6",
  "vite": "6.3.5",
  "@vitejs/plugin-react": "4.5.0",
  "eslint-plugin-react-refresh": "^0.4.20"
}
```


## 快速刷新技术

### 什么是快速刷新

Fast Refresh 是"热重载"的重新实现，并得到了 React 的全面支持。它最初是为 [React Native](https://x.com/dan_abramov/status/1169687758849400832) 开发的，但大部分实现与平台无关。我们计划将其全面推广——作为纯用户态解决方案（例如 `react-hot-loader`）的替代品。

#### 技术组成

快速刷新依赖于几个部分的协同工作：
- **模块系统中的"热模块替换"机制**：这通常由打包器提供。例如在 webpack 中，`module.hot` API 允许执行此操作。
- **React 渲染器 16.9.0+**：例如 `React DOM 16.9` 或 `react-reconciler@0.21.0` 更高版本（对于自定义渲染器）
- **react-refresh/runtime 入口点**
- **react-refresh/babel Babel 插件**

> 引用来源：[React Fast Refresh 官方介绍](https://github.com/facebook/react/issues/16604#issuecomment-528663101)

#### 与 Vite 的集成方式

集成功能主要由 Vite 插件 `@vitejs/plugin-react` 实现。

详细介绍可参考：[@vitejs/plugin-react 实现详细介绍](https://juejin.cn/post/7145036892784820254)


### 刷新策略

- **仅导出 React 组件的模块**：Fast Refresh 只会更新该模块的代码，并重新渲染组件。你可以编辑文件里面的任何内容，包括样式、渲染逻辑、事件处理或者 effects。

- **不导出 React 组件的模块**：Fast Refresh 将会重新运行该模块，以及其他引入该模块的模块文件。例如，`Button.js` 和 `Modal.js` 同时引入了 `Theme.js`，编辑 `theme.js` 时，`Button.js` 和 `Modal.js` 都会更新。

- **被 React 渲染树之外的模块引入**：Fast Refresh 将会回退到完全刷新。你可能有一个文件，该文件渲染了一个 React 组件，同时又导出了一个被其他非 React 组件引入的值。在这种情况下，考虑将常量迁移到一个单独的文件并将其导入到两个文件中，这样 Fast Refresh 才能重新生效。

## 场景复现现象解释

### 场景1: React树外部的文件

**文件**: `scenario1-non-react-file.ts`

**特点**:
- 纯TypeScript文件，不包含React组件
- 导出普通函数和配置对象

**测试代码**:
```typescript
export const nonReactFunction = (): string => {
  console.log('这是一个非React文件中的函数');
  return 'Hello from non-React file';
};

export const someConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};
```

**结果**: ✅ **触发浏览器完全刷新 (reload)**

**现象**: 修改文件内容后，浏览器会完全重新加载页面

---

### 场景2: 正常的React组件

**文件**: `scenario2-normal-react-component.tsx`

**特点**:
- 标准的React组件定义
- 使用JSX语法在App中引用: `<NormalReactComponent />`

**测试代码**:
```tsx
import { useState } from 'react';

const NormalReactComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>正常的React组件</h2>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加计数
      </button>
    </div>
  );
};

export default NormalReactComponent;
```

**使用方式**:
```tsx
// 在App中使用
<NormalReactComponent />
```

**结果**: ✅ **触发React Fast Refresh**

**现象**: 修改组件内容后，组件会立即更新，状态保持不变

---

### 场景3: React组件采用函数调用形式

**文件**: `scenario3-react-component-function-call.tsx`

**特点**:
- 定义了React组件
- 在App中采用函数调用形式: `{ReactComponentAsFunction()}`

**测试代码**:
```tsx
import { useState } from 'react';

const ReactComponentAsFunction = () => {
  const [value, setValue] = useState('初始值');

  return (
    <div>
      <h3>作为函数调用的React组件</h3>
      <p>当前值: {value}</p>
      <input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
    </div>
  );
};

export { ReactComponentAsFunction };
```

**使用方式**:
```tsx
// 在App中使用
{ReactComponentAsFunction()}
```

**结果**: ❌ **无法触发任何热更新功能**

**现象**: 修改文件内容后，页面没有任何变化

---

### 场景4: 大写字母开头的普通函数

**文件**: `scenario4-uppercase-function-call.tsx`

**特点**:
- 大写字母开头的函数（非真正的React组件）
- 在App中采用函数调用形式

**测试代码**:
```tsx
const UppercaseFunction = () => {
  return ['大写字母开头的普通函数', '修改这里的内容不会触发热更新'].join('\n');
};

export { UppercaseFunction };
```

**结果**: ❌ **无法触发任何热更新功能**

**现象**: 修改文件内容后，页面没有任何变化

---

### 场景5: React组件 + 数组定义

**文件**: `scenario5-react-component-with-array.tsx`

**特点**:
- 定义了React组件和数组
- 在App中采用函数调用形式
- 数组未导出

**测试代码**:
```tsx
import { useState } from 'react';

const ReactComponentWithArray = () => {
  const [selectedItem, setSelectedItem] = useState('');

  return (
    <div>
      <h3>带有数组的React组件</h3>
      <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
        {items.map(item => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  );
};

const items = ['项目1', '项目2', '项目3', '项目4']; // 未导出

export { ReactComponentWithArray };
```

**结果**: ❌ **无法触发任何热更新功能**

**现象**: 修改文件内容后，页面没有任何变化

---

### 场景6: React组件 + 导出数组

**文件**: `scenario6-react-component-exported-array.tsx`

**特点**:
- 定义了React组件和数组
- 在App中采用函数调用形式
- 数组被导出

**测试代码**:
```tsx
import { useState } from 'react';

const ReactComponentWithExportedArray = () => {
  const [theme, setTheme] = useState('light');

  return (
    <div style={{ 
      background: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#333' : '#fff'
    }}>
      <h3>带有导出数组的React组件</h3>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        {themes.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
    </div>
  );
};

const themes = [
  { value: 'light', label: '浅色主题' },
  { value: 'dark', label: '深色主题' }
];

export { ReactComponentWithExportedArray, themes }; // 导出了数组
```

**结果**: ⚠️ **快速刷新功能降级为热更新**

**现象**: 
- 修改文件内容后会触发ESLint警告
- 控制台显示 "TestApp组件 hmr update"

---

### 场景7: 大写函数 + 导出数组

**文件**: `scenario7-uppercase-function-exported-array.tsx`

**特点**:
- 大写字母开头的函数
- 定义并导出了数组
- 在App中采用函数调用形式

**测试代码**:
```tsx
const UppercaseFunctionWithExportedArray = () => {
  return (
    <div>
      <h3>大写字母开头的函数（带导出数组）</h3>
      <ul>
        {colors.map(color => (
          <li key={color.name} style={{ color: color.hex }}>
            {color.name}: {color.hex}
          </li>
        ))}
      </ul>
    </div>
  );
};

const colors = [
  { name: '红色', hex: '#FF0000' },
  { name: '绿色', hex: '#00FF00' }
];

export { UppercaseFunctionWithExportedArray, colors };
```

**结果**: ⚠️ **效果同场景6，快速刷新降级为热更新**

**现象**: 与场景6相同的行为

## React Fast Refresh 工作原理深度解析

### React Fast Refresh 的检测机制

React Fast Refresh 的核心检测机制主要通过以下几个关键函数实现：

#### 1. `isLikelyComponentType` - 组件类型检测

```javascript
function isLikelyComponentType(type) {
  switch (typeof type) {
    case 'function': {
      // 处理类组件
      if (type.prototype != null) {
        if (type.prototype.isReactComponent) {
          return true; // React 类组件
        }
        // 检查是否为普通类
        const ownNames = Object.getOwnPropertyNames(type.prototype)
        if (ownNames.length > 1 || ownNames[0] !== 'constructor') {
          return false; // 普通类，不是组件
        }
        if (type.prototype.__proto__ !== Object.prototype) {
          return false; // 有父类，不是组件
        }
      }
      // 对于普通函数和箭头函数，使用名称作为启发式判断
      const name = type.name || type.displayName
      return typeof name === 'string' && /^[A-Z]/.test(name)
    }
    case 'object': {
      if (type != null) {
        switch (getProperty(type, '$$typeof')) {
          case REACT_FORWARD_REF_TYPE:
          case REACT_MEMO_TYPE:
            return true; // 明确的 React 组件
          default:
            return false
        }
      }
      return false
    }
    default: {
      return false
    }
  }
}
```

**关键点**：
- 对于函数类型，主要通过**函数名是否以大写字母开头**来判断是否为 React 组件
- 这就解释了为什么大写字母开头的普通函数会被误判为组件
- React 官方组件（如 forwardRef、memo）通过 `$$typeof` 属性明确识别

#### 2. `registerExportsForReactRefresh` - 导出注册机制

```javascript
export function registerExportsForReactRefresh(filename, moduleExports) {
  for (const key in moduleExports) {
    if (key === '__esModule') continue
    const exportValue = moduleExports[key]
    if (isLikelyComponentType(exportValue)) {
      register(exportValue, filename + ' export ' + key)
    }
  }
}
```

**工作原理**：
- 遍历模块的所有导出
- 对每个导出值调用 `isLikelyComponentType` 进行检测
- 只有被识别为组件的导出才会被注册到快速刷新系统中

#### 3. `register` - 组件注册与家族管理

```javascript
function register(type, id) {
  if (type === null) return
  if (typeof type !== 'function' && typeof type !== 'object') return

  if (allFamiliesByType.has(type)) return // 避免重复注册

  let family = allFamiliesByID.get(id)
  if (family === undefined) {
    family = { current: type }
    allFamiliesByID.set(id, family)
  } else {
    pendingUpdates.push([family, type]) // 记录更新
  }
  allFamiliesByType.set(type, family)
}
```

**核心概念 - 组件家族 (Family)**：
- 每个组件都属于一个"家族"，用于跟踪组件的不同版本
- 当组件更新时，新版本会加入同一个家族
- 这是实现状态保持的关键机制

#### 4. `validateRefreshBoundaryAndEnqueueUpdate` - 刷新边界验证

```javascript
export function validateRefreshBoundaryAndEnqueueUpdate(id, prevExports, nextExports) {
  const ignoredExports = window.__getReactRefreshIgnoredExports?.({ id }) ?? []
  
  // 检查是否有导出被移除
  if (predicateOnExport(ignoredExports, prevExports, (key) => key in nextExports) !== true) {
    return 'Could not Fast Refresh (export removed)'
  }
  
  // 检查是否有新的导出
  if (predicateOnExport(ignoredExports, nextExports, (key) => key in prevExports) !== true) {
    return 'Could not Fast Refresh (new export)'
  }

  let hasExports = false
  const allExportsAreComponentsOrUnchanged = predicateOnExport(
    ignoredExports,
    nextExports,
    (key, value) => {
      hasExports = true
      if (isLikelyComponentType(value)) return true
      return prevExports[key] === nextExports[key] // 非组件导出必须保持不变
    },
  )
  
  if (hasExports && allExportsAreComponentsOrUnchanged === true) {
    enqueueUpdate() // 触发快速刷新
  } else {
    return `Could not Fast Refresh ("${allExportsAreComponentsOrUnchanged}" export is incompatible)`
  }
}
```

**验证逻辑**：
- **导出一致性检查**：确保导出的项目在更新前后保持一致
- **组件兼容性检查**：所有导出要么是组件，要么保持不变
- **边界安全验证**：确保刷新操作不会破坏应用结构

#### 5. `enqueueUpdate` - 更新队列机制

```javascript
const enqueueUpdate = debounce(async () => {
  if (hooks.length) await Promise.all(hooks.map((cb) => cb()))
  performReactRefresh()
}, 16)
```

**防抖机制**：
- 使用 16ms 的防抖延迟，优化性能
- 批量处理多个快速连续的更新
- 支持插件钩子，允许其他插件参与更新过程

### 为什么函数调用形式无法触发热更新

**根本原因**：React Fast Refresh 基于 **React 的协调算法 (Reconciliation)** 工作，需要通过 React 的组件树来跟踪和更新组件。

#### 技术层面的解释：

1. **JSX 语法 vs 函数调用**：
   ```tsx
   // ✅ JSX 语法 - 创建 React 元素
   <MyComponent />
   // 等价于：React.createElement(MyComponent, null)
   
   // ❌ 函数调用 - 直接执行函数
   {MyComponent()}
   ```

2. **React 协调过程**：
   - 使用 JSX 语法时，React 会为每个组件创建 Fiber 节点
   - Fiber 节点包含组件的类型信息，Fast Refresh 可以通过这些信息找到需要更新的组件
   - 函数调用绕过了 React 的组件系统，直接返回 JSX 结果

3. **组件实例跟踪**：
   ```javascript
   // Fast Refresh 的工作流程
   1. 注册组件类型 → register(ComponentType, id)
   2. React 渲染时创建组件实例
   3. 建立组件类型与实例的关联
   4. 更新时通过类型找到对应实例进行热替换
   
   // 函数调用时的问题
   1. 组件被注册 ✅
   2. 但 React 看到的不是组件类型，而是函数执行结果 ❌
   3. 无法建立正确的关联关系 ❌
   4. 更新时找不到目标实例 ❌
   ```

### 导出非组件内容的影响机制

#### 快速刷新降级的触发条件

当模块同时导出 React 组件和其他内容时，`validateRefreshBoundaryAndEnqueueUpdate` 函数会进行严格检查：

```javascript
// 检查所有导出是否为组件或保持不变
const allExportsAreComponentsOrUnchanged = predicateOnExport(
  ignoredExports,
  nextExports,
  (key, value) => {
    if (isLikelyComponentType(value)) return true
    return prevExports[key] === nextExports[key] // 非组件导出必须完全相同
  },
)
```

#### 降级原因分析

1. **安全性考虑**：
   - 非组件导出可能被其他模块引用
   - 这些引用可能不在 React 组件树中
   - 直接替换可能导致应用状态不一致

2. **边界完整性**：
   - Fast Refresh 需要确保"刷新边界"的完整性
   - 混合导出破坏了这种边界的清晰度
   - 系统选择降级到更安全的热更新模式

3. **实际降级行为**：
   ```javascript
   // 场景6和场景7中，当检测到混合导出时：
   // 1. validateRefreshBoundaryAndEnqueueUpdate 返回错误信息
   // 2. Vite 接收到错误，回退到 HMR 模式
   // 3. 触发父级组件的重新渲染，而不是精确的组件替换
   ```

### 完全无热更新的深层原因

#### 场景3、4、5 无法更新的技术原因

1. **模块加载与执行分离**：
   ```javascript
   // 当模块更新时，Vite 会：
   1. 重新加载模块代码 ✅
   2. 执行 registerExportsForReactRefresh ✅
   3. 调用 validateRefreshBoundaryAndEnqueueUpdate ✅
   4. 但由于使用函数调用形式，React 无法感知到组件的变化 ❌
   ```

2. **React 渲染上下文缺失**：
   - 函数调用形式绕过了 React 的组件生命周期
   - React DevTools 无法追踪到这些"组件"
   - Fast Refresh 系统无法建立正确的更新路径

3. **状态管理问题**：
   - 即使强制触发更新，由于没有正确的组件实例
   - React 的状态管理机制无法正确保持和恢复状态
   - 这违背了 Fast Refresh 的核心价值

### 最佳实践建议

基于以上技术分析，建议：

1. **始终使用 JSX 语法渲染组件**：
   ```tsx
   // ✅ 正确
   <MyComponent />
   
   // ❌ 错误  
   {MyComponent()}
   ```

2. **保持模块导出的纯净性**：
   ```tsx
   // ✅ 仅导出组件
   export default MyComponent
   export { AnotherComponent }
   
   // ❌ 混合导出
   export { MyComponent, someData }
   ```

3. **分离关注点**：
   ```tsx
   // ✅ 将常量和配置分离到独立文件
   // constants.ts
   export const themes = [...]
   
   // MyComponent.tsx
   import { themes } from './constants'
   export default MyComponent
   ```
