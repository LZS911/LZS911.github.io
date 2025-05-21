# 开发环境设置指南

## 数据库配置

本项目支持两种数据库环境：

- **开发环境**: 使用 SQLite 作为本地开发数据库
- **生产环境**: 使用 PostgreSQL 作为生产数据库

### 设置开发环境数据库（SQLite）

我们提供了一个简便的脚本，用于自动设置开发环境下的SQLite数据库：

```bash
# 使用Bun运行设置脚本
bun setup:dev-db
```

这个脚本会:

1. 临时修改 Prisma schema 使用 SQLite
2. 创建并同步 SQLite 数据库架构
3. 恢复原始 schema 配置（保持生产环境不受影响）

### 如何工作

开发环境配置使用以下技术实现数据库差异化：

1. 在 `src/lib/prisma.ts` 中，我们通过检测 `NODE_ENV` 来自动配置开发环境使用 SQLite
2. 设置脚本会创建 `prisma/dev.db` SQLite 数据库文件
3. 自动设置 `DATABASE_URL` 环境变量指向本地 SQLite 数据库

### 数据库操作

无论使用哪种数据库，你都可以使用相同的 Prisma 命令进行数据库操作：

```bash
# 查看数据库内容（会使用当前环境数据库）
bun prisma:studio

# 生成Prisma客户端
bun prisma:generate

# 创建迁移（开发环境会使用SQLite）
bun prisma:migrate
```

### 注意事项

- SQLite 数据库仅供开发测试使用，与生产环境可能有细微差异
- 推荐定期运行 `bun setup:dev-db` 以保持开发数据库架构与最新模型同步
- 如果需要保留开发数据，请在更新前备份 `prisma/dev.db` 文件
