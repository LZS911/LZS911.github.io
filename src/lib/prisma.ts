// 在开发环境中复用 PrismaClient 实例
// 这可以避免在开发热重载时创建多个连接
// 详情参见: https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from '../generated/prisma';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 检查开发环境并设置SQLite数据库URL
const setupDevDatabase = () => {
  // 只在开发环境中执行
  if (process.env.NODE_ENV === 'development') {
    const sqliteDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const sqliteURL = `file:${sqliteDbPath}`;

    // 如果环境变量还未设置，则设置开发环境数据库URL
    if (
      !process.env.DATABASE_URL ||
      !process.env.DATABASE_URL.includes('sqlite')
    ) {
      process.env.DATABASE_URL = sqliteURL;

      // 确保已执行Prisma迁移
      try {
        if (!fs.existsSync(sqliteDbPath)) {
          execSync('npx prisma db push', { stdio: 'inherit' });
        }
      } catch (error) {
        console.error('SQLite数据库设置失败:', error);
      }
    }
  }
};

// 在初始化Prisma客户端前设置开发环境数据库
setupDevDatabase();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
