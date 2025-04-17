---
title:  vite-plugin-watch-i18
layout: post
date: "2022-12-01"
image: 
headerImage: false
tag:
  -
star: true
category: project
author: Ai.Haibara
description: blog
excerpt: 自动生成语言包代码的一个 vite 插件
coverImage: '/assets/blog/image/cover.jpg'
ogImage: 
  url: '/assets/blog/image/cover.jpg'
---

## Install

``npm install vite-plugin-watch-i18``

## Usage

```typescript
import viteWatchI18Plugin from 'vite-plugin-watch-i18';

export default defineConfig({
  plugins: [react(), viteWatchI18Plugin()]
}
```

## Prettier Config

The prettier configuration when the plugin saves the file:

```javascript
module.exports = {
  tabWidth: 2,
  semi: true,
  printWidth: 80,
  trailingComma: 'es5',
  arrowParens: 'always',
  proseWrap: 'preserve',
  useTabs: false,
  singleQuote: true,
  bracketSpacing: true,
  jsxBracketSameLine: false,
};

```

Project synchronization Prettier Config:

Create prettier.config.js

```javascript
const viteWatchI18nPrettierConfig = require('vite-plugin-watch-i18/dist/prettier.config');
module.exports = {
  plugins: [],
  ...viteWatchI18nPrettierConfig,
};

```

## Options

| name | defaultValue | type | description |
| :-: | :-: | :-: | :-: |
| funName | t | string | function call name |
| splitCode | # | string | split code |
| languageDir | ['locale/zh-CN', 'locale/en-US'] | string[] | language package path |
| include | ['src/\*\*/\*.{js,jsx,ts,tsx}', '!src/\*\*/\*.d.ts'] | string[] | include directory |

## Warn

**Currently only supports locale file format**:

```javascript
export default {
  index: {
    confirm: '确认',
  },
};
```

**Not supports**:

```javascript
const Locale = {
  index: {
    confirm: '确认',
  },
};
export default Locale;
```

**The default export file of the language pack is index.ts or index.js**

## Example

## Add

![example](https://raw.githubusercontent.com/LZS911/LZS911.github.io/backend-main/assets/images/vite-plugin/watch-i18/example/add.gif)

## Modify

![example](https://raw.githubusercontent.com/LZS911/LZS911.github.io/backend-main/assets/images/vite-plugin/watch-i18/example/modify.gif)

## New Locale

![example](https://raw.githubusercontent.com/LZS911/LZS911.github.io/backend-main/assets/images/vite-plugin/watch-i18/example/new.gif)

## Param

![example](https://raw.githubusercontent.com/LZS911/LZS911.github.io/backend-main/assets/images/vite-plugin/watch-i18/example/param.gif)
