---
title: mouse-animation-effect
date: "2022-12-07"
image: 
headerImage: false
tag:
  -
star: true
category: project
author: Ai.Haibara
description: blog
excerpt: A Tool Library for Adding Mouse Animation Effects
theme: fancy
---

## INSTALL

```ssh
npm install mouse-animation-effect
//or
yarn add mouse-animation-effect
```

## USAGE

```typescript
import generateMouseEffect from 'mouse-animation-effect';
import "mouse-animation-effect/dist/index.css";

const { initMouseEffect, removeMouseEffect } = generateMouseEffect({});
```

## Options

| name | defaultValue | type | description |
| :-:  | :-:          | :-:  | :-:         |
| content | ❤ | string  | content displayed after mouse click |
| delay | 1900 | number | displayed content duration |

## Example

<https://lzs911.github.io/>
