# LZS_911 的个人空间

- 工作中遇到的一些问题与解决方案

- 工作之余学习的前端知识和个人的玩具项目

- 分享一些优秀文章和优秀书籍

- 分享一些优秀的工具

- 算法练习

## 个人主页: [https://lzs911.github.io]

## Feature

- [x] 个人信息展示页

- [x] 博客主页以及博客内容展示页

- [x] 项目主页以及项目介绍页

- [x] 博客内容美化

- [x] 导航页

- [x] 博客页面添加锚点功能

## 存储系统

本项目支持两种存储模式，可通过环境变量配置：

1. **文件系统存储**（默认）：适用于本地开发环境和支持文件系统的部署环境
2. **数据库存储**：适用于 Vercel 等无服务器环境，使用 Prisma ORM 操作 PostgreSQL 数据库存储临时图片和预览内容

详细配置请参考：
- [环境变量配置说明](./docs/environment-variables.md)
- [Vercel 部署指南](./docs/vercel-deployment.md)

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma (用于数据库存储)
