---
title: 从 Koa 到 Nest：全栈 TypeScript 应用的现代化改造.md
date: "2024-11-28"
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

## 引言

### 项目背景
项目最初采用以下技术栈构建:
后端: Koa + TypeScript
数据存储: 文件系统
前端: React + Ant Design
部署: Docker

Koa 是一个轻量级的 Node.js Web 框架,通过中间件架构提供了优雅的 API 设计。项目初期选择 Koa 是看中其简洁性和灵活性。

1. 完整技术栈
    Node
    Typescript
    Koa
    React + antd
2. 构建方式
   启动 node 环境的 docker 镜像，进入镜像 clone 代码然后通过脚本启动服务

### 痛点分析
随着项目规模扩大,原有架构暴露出几个主要问题:
1. 数据存储的局限性
- 文件系统存储难以支持复杂查询
- 数据一致性难以保证
- 性能瓶颈明显
2. 构建部署流程繁琐
- 需要在 Docker 内手动克隆代码
- 部署步骤多,容易出错
- CI/CD 支持不完善
3. 类型安全问题
- 前后端 API 类型定义分离
- 类型不一致导致运行时错误
- 代码维护成本高
4. 代码数据耦合
- 部分业务数据硬编码在代码中
- 修改数据需要重新部署
- 不利于后期维护

#### 改造的目标和预期成果。

1. 引入 MySQL 作为数据持久层
2. 优化项目构建以及发布方式
3. **前后端类型安全**
4. 代码与数据解耦

## 技术选型与评估

### 后端框架: Nest.js
选择 Nest.js 的主要原因:
- 完整的企业级框架支持
- 优秀的 TypeScript 支持
- 模块化架构,利于代码组织
- 丰富的生态系统

### ORM 层: Prisma
Prisma 作为现代化的 ORM 框架:
- 类型安全的数据库访问
- 强大的数据模型定义
- 自动生成类型定义
- 支持数据库迁移

### [ts-test](https://ts-rest.com/)

ts-rest 提供了端到端的类型安全解决方案

### 数据持久层
[MySQL](https://relph1119.github.io/mysql-learning-notes/#/mysql/00-%E4%B8%87%E9%87%8C%E9%95%BF%E5%BE%81%E7%AC%AC%E4%B8%80%E6%AD%A5%EF%BC%88%E9%9D%9E%E5%B8%B8%E9%87%8D%E8%A6%81%EF%BC%89-%E5%A6%82%E4%BD%95%E6%84%89%E5%BF%AB%E7%9A%84%E9%98%85%E8%AF%BB%E6%9C%AC%E5%B0%8F%E5%86%8C)

### UI
调整为 React + [shadcn/ui](https://ui.shadcn.com/) 的组合

### 部署方案优化
新的部署流程:
- 构建 Docker 镜像并推送到私有仓库
- 服务器拉取 docker-compose 配置
- 自动化部署和服务编排

## 改造实施
### 阶段规划
1. 数据迁移阶段
- 设计数据库模型
- 数据迁移脚本开发
- 数据一致性验证

2. 后端改造阶段
- 引入 Nest.js 框架
- 整合 Prisma ORM
- API 层重构

3. 前端改造阶段
- UI 组件迁移
- API 调用适配
- 类型系统对接

#### 数据迁移

#### 后端改造

#### 前端改造

## 项目总结

### 重构过程中遇到的一些问题
1. 依赖包 @octokit/core 类型问题
2. prisma 环境变量配置
3. api-model 包产物问题
4. 数据库结构设计的不完善导致表结构频繁更新

