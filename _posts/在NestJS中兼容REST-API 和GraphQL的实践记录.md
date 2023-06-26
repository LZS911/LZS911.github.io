---
title: 在 NestJS 中兼容REST API 和 GraphQL 的实践记录
date: "2023-06-10"
image: 
headerImage: false
tag:
  -
star: true
category: blog
author: Ai.Haibara
excerpt: 
theme: fancy
---

> 前置准备: 已经拥有一个使用 nestjs 构建的 web 服务

## 依赖安装

使用包管理器安装以下依赖包

1. npm

   ```ssh
      npm i --save @nestjs/graphql @nestjs/apollo @apollo/server graphql
   ```

2. yarn

   ```ssh
      yarn add @nestjs/graphql @nestjs/apollo @apollo/server graphql
   ```

3. pnpm

   ```ssh
      pnpm i @nestjs/graphql @nestjs/apollo @apollo/server graphql--filter <package.json name 字短对应值>
   ```

> ⚠️ @nestjs/graphql@>=9 和 @nestjs/apollo^10 软件包与 Apollo v3 兼容，而 @nestjs/graphql@^8 仅支持 Apollo v2（例如 apollo-server-express@2.x.x 包）。

## 概述

Nest 提供了两种构建 GraphQL 应用程序的方式，**模式优先**和**代码优先**。

1. 代码优先: 将仅使用装饰器和 TypeScript 类来生成相应的 GraphQL schema。如果更喜欢使用 TypeScript 来工作并想要避免语言语法之间的上下文切换，那这种方式会更有效。

2. 模式优先: 本质是 GraphQL SDL（模式定义语言）。它以一种与语言无关的方式，基本允许在不同平台之间共享模式文件。此外，Nest 将根据GraphQL 模式（通过类或接口）自动生成 TypeScript 定义，以减少冗余。

##
