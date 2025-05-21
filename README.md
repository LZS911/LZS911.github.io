# LZS_911 的个人博客

这是一个基于 Next.js 15 构建的个人博客网站，支持 Markdown 文章展示、主题切换、文章搜索等功能。采用现代前端技术栈，具有良好的性能和用户体验。

## 在线预览

[https://lzs-911-github-io.vercel.app/](https://lzs-911-github-io.vercel.app/)

## 主要功能

- 📝 Markdown 文章展示
  - 支持代码高亮
  - 文章目录导航
  - 锚点定位
- 🎨 主题切换
  - 内置多款精美主题
  - 支持自定义主题
- 🔍 文章搜索
- 📱 响应式设计
- 🚀 优秀的性能
  - 基于 App Router 的服务端渲染
  - 自动图片优化
  - 路由预加载
- 📂 双模式存储系统
  - 文件系统存储（默认）
  - PostgreSQL 数据库存储

## 技术栈

- **框架**: [Next.js 15](https://nextjs.org/) (App Router)
- **运行时**: [React 19](https://react.dev/)
- **语言**: [TypeScript 5](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/)
- **数据库**: [Prisma 6](https://www.prisma.io/) (用于数据库存储模式)
- **包管理**: [Bun](https://bun.sh/)
- **部署**: [Vercel](https://vercel.com/)

## 项目结构

\`\`\`
.
├── _posts/           # Markdown 文章目录
├── src/
│   ├── app/         # Next.js 页面和路由
│   ├── ui/          # UI 组件
│   ├── lib/         # 工具函数和业务逻辑
│   ├── styles/      # 全局样式
│   └── types/       # TypeScript 类型定义
├── public/          # 静态资源
├── prisma/          # 数据库 schema 和配置
└── docs/            # 项目文档
\`\`\`

## 存储系统配置

本项目支持两种存储模式，通过环境变量 \`STORAGE_TYPE\` 配置：

1. **文件系统存储**（默认）
   - 适用于本地开发和支持文件系统的部署环境
   - 文章直接存储在 \`_posts\` 目录

2. **数据库存储**
   - 适用于 Vercel 等无服务器环境
   - 使用 PostgreSQL 存储文章内容
   - 需要配置数据库连接信息

