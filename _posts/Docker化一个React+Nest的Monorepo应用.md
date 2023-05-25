---
title: Docker化一个React+Nest的Monorepo应用
date: "2023-04-25"
image: 
headerImage: false
tag:
  - Docker
  - Docker Compose
  - React
  - Nest
  - Monorepo
  - Pnpm
  - Nginx
  - Jenkins
  - PostgreSQL
star: true
category: blog
author: Ai.Haibara
excerpt: 
theme: orange
---

## 目标

使用 `Docker` 和 `Docker Compose` 将一个使用 [React](https://react.dev/) + [NestJS](https://nestjs.com/) + [PostgreSQL](https://www.postgresql.org/) + [prisma](https://www.prisma.io/) 构建的 Web 应用程序 **Dockerize**。

## 前置准备

* 安装 [Node.js](https://nodejs.org/en), 且保证 Node.js 版本为 v14.17.0 或者更高版本.
* 安装 [Nest.js CLI](https://docs.nestjs.com/cli/overview)
* 安装 [Pnpm](https://pnpm.io/)
* 安装 [Docker Engine](https://docs.docker.com/engine/install/)
* 安装 [Docker Compose](https://docs.docker.com/compose/install/)
* 安装 [Make](https://opensource.com/article/18/8/what-how-makefile)

## 项目结构

### 使用 Pnpm 的 [Workspace](https://pnpm.io/workspaces) 功能构建一个 Monorepo

对于一个 `Monorepo`, 我们需要创建在项目根路径创建一个 `packages` 文件夹. `packages` 里面包含了由 [create-vite](https://www.npmjs.com/package/create-vite) 创建的 `React` 项目以及由 `Nest.js CLI` 创建的后端服务. 当然, 在项目根路径也需要创建一些全局的配置文件.

具体操作步骤如下:

* 在根目录初始化一个新的 git 仓库并创建以下文件:

    ```sh
    .dockerignore
    .gitignore
    .env
    .docker-compose.yaml
    Makefile
    ```

* 创建 packages 文件用于存放前后端项目:
  
  ```sh
  mkdir packages && cd packages
  ```

* 创建前端项目, 并添加 Dockerfile.local 以及 Dockerfile.production 文件
  
  ```sh
  pnpm create vite
  ```

* 创建后端项目, 并且在执行完后手动删除 node_modules, 同时也添加 Dockerfile.local 以及 Dockerfile.production 文件
  
  ```sh
  nest new backend
  ```

* 重新配置 tsconfig.json:
  
  首先在项目根目录执行: `tsc --init`, 初始化一份 `tsconfig.json`, 并且将文件内容修改至以下内容:

  ```json
    {
     "compilerOptions": {
       "module": "commonjs",
       "declaration": true,
       "removeComments": true,
       "emitDecoratorMetadata": true,
       "experimentalDecorators": true,
       "allowSyntheticDefaultImports": true,
       "target": "es2017",
       "sourceMap": true,
       "outDir": "./dist",
       "baseUrl": "./",
       "incremental": true,
       "skipLibCheck": true,
       "strictNullChecks": false,
       "noImplicitAny": false,
       "strictBindCallApply": false,
       "forceConsistentCasingInFileNames": true,
       "noFallthroughCasesInSwitch": false,
       "strict": true,
       "jsx": "react-jsx"
     },
     "include": ["packages/*/src"]
    }
  ```

  最后将前后端项目中由工具创建的 `tsconfig.json` 文件内容修改至以下内容:

  ```json
    {
     "extends": "../../tsconfig.json",
     "include": ["./src"]
    }
  ```

* 创建 pnpm-workspace.yml, 填充以下内容:

   ```yml
     packages:
    - 'packages/**'
   ```

* 在根目录创建 package.json 文件, 并且将前后端相同的依赖项提取至其中. 执行 ``pnpm install -r`` , 完成依赖的安装.

最后, 得到的项目结构应如下图所示

![alt](/assets/docker-react-nest/example1.png)

## Dockerize

### Backend Dockerfile

回到本文主题, 现在, 我们的 Backend 文件夹中包含了两个 Dockerfile 文件. 其中一个用于在本地运行项目, 它用于docker-compose.yaml 文件, 而另一个用于生产环境.

现在将以下内容填充至 Dockerfile.local:

```dockerfile
#获取node镜像源
FROM node:16.16.0-alpine

#设置工作目录
WORKDIR /projects

# 将 pnpm-lock.yaml 拷贝至工作目录, 为后续的 pnpm fetch 做准备
COPY ./pnpm-lock.yaml ./

# 安装 pnpm, 并且固定版本, 也可以考虑在获取node镜像源时直接获取带有pnpm的镜像, 这样就能省略这一步了
RUN npm install -g pnpm@8.3.1

# pnpm fetch 通过提供仅使用锁定文件中的信息将包加载到虚拟存储中的能力，完美地解决了上述问题. 具体见: https://pnpm.io/cli/fetch
RUN pnpm fetch

COPY . .

# 安装依赖, 关于 --offline 见: https://pnpm.io/cli/fetch
RUN pnpm install -r --offline

# https://zhuanlan.zhihu.com/p/89335014
VOLUME ["/projects/node_modules/", "/projects/packages/backend/node_modules/", "/projects/.pnpm-store/"]

# https://yeasy.gitbook.io/docker_practice/image/dockerfile/expose
EXPOSE $BACKEND_PORT

# 启动后端服务
CMD rm -rf dist && cd packages/backend && pnpm start:debug
```

### Frontend Dockerfile

前端文件夹下的 Dockerfile:

```dockerfile
#获取node镜像源
FROM node:16.16.0-alpine

#设置工作目录
WORKDIR /app

# 将 pnpm-lock.yaml 拷贝至工作目录, 为后续的 pnpm fetch 做准备
COPY ./pnpm-lock.yaml ./

# 安装 pnpm, 并且固定版本, 也可以考虑在获取node镜像源时直接获取带有pnpm的镜像, 这样就能省略这一步了
RUN npm install -g pnpm@8.3.1

# pnpm fetch 通过提供仅使用锁定文件中的信息将包加载到虚拟存储中的能力，完美地解决了上述问题. 具体见: https://pnpm.io/cli/fetch
RUN pnpm fetch

COPY . .

# 安装依赖, 关于 --offline 见: https://pnpm.io/cli/fetch
RUN pnpm install -r --offline

# https://zhuanlan.zhihu.com/p/89335014
VOLUME ["/app/node_modules/", "/app/packages/frontend/node_modules/", "/app/.pnpm-store/"]

# 启动前端服务
CMD cd packages/frontend && pnpm start

```

### 创建 Docker Compose 文件并运行项目

1. 配置环境变量: 将以下内容填充至 `<rootDir>/.env`

   ```sh
      NODE_ENV=development
      FRONTEND_PORT=7879
      BACKEND_PORT=7878
      JWT_SECRET=jwt_secret_key_here
      JWT_EXPIRES_IN=30d
      DB_HOST=bp-pg-db
      DB_NAME=bp-pg-db
      DB_USER=postgres
      DB_PASSWORD=root
      DB_PORT=5432
      PGADMIN_DEFAULT_EMAIL=admin@backend.com
      PGADMIN_DEFAULT_PASSWORD=pass@123
      PGADMIN_PORT=5055
   ```

2. 将以下内容填充至 `<rootDIr>/docker-compose.yml`

   ```yml
       version: '3.9'
       services:
         frontend:
           container_name: frontend
           build:
             context: ./
             dockerfile: ./packages/frontend/Dockerfile.local
           restart: always
           env_file: .env
           ports:
             - '${FRONTEND_PORT}:${FRONTEND_PORT}'
           volumes:
             - .:/app
           networks:
             bp-network:
               ipv4_address: 172.25.0.3
         backend:
           container_name: backend
           build:
             context: ./
             dockerfile: ./packages/backend/Dockerfile.local
           restart: always
           env_file: .env
           volumes:
             - .:/app
           networks:
             bp-network:
               ipv4_address: 172.25.0.2
           ports:
             - '${BACKEND_PORT}:${BACKEND_PORT}'
           depends_on:
             - bp-pg-db
           links:
             - bp-pg-db
         bp-pg-db:
           image: postgres:12-alpine
           restart: always
           container_name: bp-pg-db
           env_file:
             - .env
           environment:
             POSTGRES_PASSWORD: ${DB_PASSWORD}
             PGDATA: /var/lib/postgresql/data
             POSTGRES_USER: ${DB_USER}
             POSTGRES_DB: ${DB_NAME}
           ports:
             - '${DB_PORT}:${DB_PORT}'
           volumes:
             - pgdata:/var/lib/postgresql/data
           networks:
             bp-network:
               ipv4_address: 172.25.0.5
         pgadmin-portal:
           image: dpage/pgadmin4
           restart: always
           container_name: pgadmin-portal
           env_file:
             - .env
           environment:
             PGADMIN_DEFAULT_PASSWORD: '${PGADMIN_DEFAULT_PASSWORD}'
             PGADMIN_DEFAULT_EMAIL: '${PGADMIN_DEFAULT_EMAIL}'
           volumes:
             - pgadmin:/root/.pgadmin
           ports:
             - '${PGADMIN_PORT}:80'
           depends_on:
             - bp-pg-db
           networks:
             bp-network:
               ipv4_address: 172.25.0.6
       volumes:
         pgdata:
         pgadmin:
       networks:
         bp-network:
           driver: bridge
           ipam:
             config:
               - subnet: 172.25.0.0/16
       
   ```

   1. `Services`: 每个服务代表一个将要创建的 Docker 容器
     * frontend: 基于前端项目的 Dockerfile.local 构建镜像以及容器. 此容器将会控制前端服务的启停.
     * backend: 基于后端项目的 Dockerfile.local 构建镜像以及容器. 此容器将会控制后端服务的启停.
     * bp-pg-db: 基于镜像 postgres:12-alpine 构建的 postgres 数据库容器.
     * pgadmin-portal: 基于镜像 dpage/pgadmin4 构建的 postgres 可视化界面操作服务.
  
3. 添加 Makefile 用来启动:

   ```Makefile
   local: 
      docker-compose stop && docker-compose up --build -d --remove-orphans
   ```

使用 `make local` 命令后, 将构建镜像并启动容器服务, 此时便能通过配置中暴露出的端口号来正常的访问到前端、后端以及数据库服务. 同时, 得益于 `VOlUME`, 我们在本地修改代码后能及时的映射到容器的挂卷中, 通过项目的热更新来开发项目.

## 生产环境部署

todo...
