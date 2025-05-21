#!/usr/bin/env node

/**
 * 开发环境数据库设置脚本
 * 此脚本用于在开发环境中自动设置SQLite数据库
 *
 * 使用方法:
 * 1. 运行 `node prisma/setup-dev-db.js` 设置开发环境
 * 2. 脚本会自动创建一个临时的schema文件使用SQLite进行DB push
 * 3. 然后恢复原始schema以避免影响生产环境
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, 'schema.prisma');
const schemaBackupPath = path.join(__dirname, 'schema.backup.prisma');
const sqliteDbPath = path.join(__dirname, 'dev.db');

// SQLite版本的schema内容
const sqliteSchema = (originalSchema: string) => {
  return originalSchema.replace(
    'datasource db {\n  provider = "postgresql"',
    'datasource db {\n  provider = "sqlite"'
  );
};

async function main() {
  console.log('设置开发环境SQLite数据库...');

  try {
    // 读取当前schema文件
    const originalSchema = fs.readFileSync(schemaPath, 'utf8');

    // 备份原始schema
    fs.writeFileSync(schemaBackupPath, originalSchema);
    console.log('✅ 原始schema已备份');

    // 修改schema为SQLite版本
    const modifiedSchema = sqliteSchema(originalSchema);
    fs.writeFileSync(schemaPath, modifiedSchema);
    console.log('✅ 已临时修改schema为SQLite版本');

    // 执行prisma db push
    console.log('🔄 正在同步数据库架构...');
    await execAsync('bun run prisma:push');
    console.log('✅ 数据库架构已同步');

    // 恢复原始schema
    fs.writeFileSync(schemaPath, originalSchema);
    console.log('✅ 已恢复原始schema');

    // 设置环境变量
    console.log('📝 开发环境SQLite数据库设置完成！');
    console.log(`\n请在开发中使用以下环境变量:
    DATABASE_URL=file:${sqliteDbPath}
    
    或直接在lib/prisma.ts中已自动处理环境变量。`);
  } catch (error) {
    console.error('❌ 设置开发环境SQLite数据库时出错:', error);

    // 尝试恢复原始schema
    if (fs.existsSync(schemaBackupPath)) {
      try {
        const backup = fs.readFileSync(schemaBackupPath, 'utf8');
        fs.writeFileSync(schemaPath, backup);
        console.log('✅ 已从备份恢复原始schema');
      } catch (restoreError) {
        console.error('❌ 恢复原始schema失败:', restoreError);
      }
    }

    process.exit(1);
  } finally {
    // 清理备份文件
    if (fs.existsSync(schemaBackupPath)) {
      fs.unlinkSync(schemaBackupPath);
    }
  }
}

main();
