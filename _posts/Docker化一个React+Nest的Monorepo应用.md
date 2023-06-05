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

### frontend 项目

**目标: 利用 github webhook 在项目push代码后自动触发 jenkins 流水线用来构建项目**

环境准备:

1. 创建以下文件夹:
    * jenkins/jenkins/home: 用来存放 jenkins 配置文件以及插件和 jenkins 的工作区等内容.
    * nginx/default.conf: nginx 的配置文件
    * webserver/static/jenkins/dist: 存放前端项目打包后的产物
    * docker-compose.yml: docker-compose 的配置文件

    default.conf 内容如下(本文不涉及 nginx 配置知识, 所以这里使用一个最基本的配置文件):

    ```conf
      server{
        listen  80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
      
        location / {
           try_files $uri $uri/ /index.html =404;
        }
              
      # location /v {
      # 根据项目配置反向代理  
      #   proxy_pass <http://localhost:7878>
      # }
    }
    ```

2. 编写 `docker-compose.yml` 来构建 jenkins 容器以及部署前端项目的 nginx 容器, 内容如下:

   ```yml
      version: "3.9"
        services:                                      
          docker_jenkins:
            environment:
              - TZ=Asia/Shanghai
            user: root                                
            restart: always                           
            image: jenkins/jenkins:lts              
            container_name: cicd-jenkins                 
            ports:                                
              - 8077:8080                             
              - 50000:50000                          
            volumes:                               
              - ./jenkins/jenkins_home/:/var/jenkins_home  
              - /var/run/docker.sock:/var/run/docker.sock
              - /usr/bin/docker:/usr/bin/docker              
              - /usr/local/bin/docker-compose:/usr/local/bin/docker-compose
          docker_nginx:
            environment:
              - TZ=Asia/Shanghai
            restart: always
            image: nginx:stable-alpine               
            container_name: cicd-nginx
            ports:
              - 7070:80                             
            volumes:
              - ./nginx/:/etc/nginx/conf.d/
              - ./webserver/static/jenkins/dist/:/usr/share/nginx/html/
    ```

3. 执行 `docker-compose up --build -d --remove-orphans` 后, 此时应该会成功启动两个容器, 可以使用 `docker container ls` 查看:, 大致内容如下:

   ![alt](/assets/docker-react-nest/example2.png)

   此时在本地访问 `http://ip(容器的宿主主机ip地址):8077` 应该能够正常访问 jenkins 服务, 初始化界面应该如下:

   ![alt](/assets/docker-react-nest/example3.png)

   在宿主主机上执行 `docker logs [container_id]`, 从 log 信息从获取管理源密码, 然后进入插件安装页面, 这里安装推荐插件即可.

4. 插件安装完成且创建用户进入 jenkins 后点击 **Manage Jenkins**, 然后再点击进入**Manage Plugins**. 这里需要安装 `Node` 插件以及 `Publish over SSH`.

   前者为构建流程提供 `NodeJs` 环境, 后者将构建完成后得到的前端产物压缩包上传至目标服务器.

   ![alt](/assets/docker-react-nest/example4.png)

5. 配置 `NodeJs` 环境. 点击 **系统管理**, 然后再点击进入**全局工具配置**, 找到 NodeJS, 点击 **新增NodeJS**. 最后根据项目的需求进行选择 `Node` 版本以及是否要安装全局工具即可.

   ![alt](/assets/docker-react-nest/example5.png)
  
6. 点击系统管理中的**Credentials**, 然后添加 github 的凭据. 可以添加 github 的 token、账号密码以及公私钥三种类型的凭据.

7. 配置 github-webhook. 点击系统管理中的**系统配置**, 找到 Github, 然后点击**添加Github**服务器, 在凭据一栏添加在上一步添加的 Github 凭据.

   ![alt](/assets/docker-react-nest/example6.png)
  
   找到最下方的更多按钮, 点击后会出现覆盖 Hook URL的选项, 将这里的地址绑定到 github 项目上的 webhook 即可.
   当然, 如果 jenkins 容器宿主主机为本地主机或者为内网主机, 可使用 [ngrok](https://dashboard.ngrok.com/) 实现内网穿透, 来保证 github 能访问到 jenkins.

   注意事项:
     1. github-webhook地址前缀需与 jenkins 配置中的 **Jenkins URL** 保持一致.
     2. 关于 [github webhook](https://docs.github.com/en/webhooks-and-events/webhooks/about-webhooks).

8. 添加服务器信息. 在系统配置中找到**Publish over SSH**, 在 Passphrase 一栏填入服务器密码, 然后点击**新增**, 填入服务器信息.

   ![alt](/assets/docker-react-nest/example7.png)

9. 创建任务
   * 点击新建任务, 输入任务名称后选择**构建一个自由风格的软件项目**
     ![alt](/assets/docker-react-nest/example8.png)

   * 源码管理里输入项目地址、添加 Github 凭据, 选择项目分支.
     ![alt](/assets/docker-react-nest/example9.png)

   * 构建触发器里选择 **GitHub hook trigger for GITScm polling**
     ![alt](/assets/docker-react-nest/example10.png)
   * 选择构建环境
     ![alt](/assets/docker-react-nest/example11.png)
   * 添加构建步骤. 这里可以将步骤放在 `Makefile` 文件中或者 `sh` 脚本中, 这样每次更新步骤只需要更新配置文件, 而不用修改 jenkins 配置. 当然这一步也可以用 [Jenkinsfile](https://www.jenkins.io/zh/doc/book/pipeline/jenkinsfile/)替代.
     ![alt](/assets/docker-react-nest/example12.png)

     `build.sh`:

        ```sh
         pnpm fetch
         pnpm install -r --offline
         
         # frontend
         pnpm build:frontend
         cd ./packages/frontend
         tar zcf frontend.tar.gz ./dist
         mv ./frontend.tar.gz ../../frontend.tar.gz
     ```

   * 添加构建后的操作. 这里选择 **Send build artifacts over SSH**, 填入以下内容:
     ![alt](/assets/docker-react-nest/example13.png)
     其中 SSH Server Name 为上一步添加的服务器名称.

到这里, 一个前端项目的自动化部署基本完成了. 在提交项目代码后, 便会自动触发任务, 进行项目构建, 并将构建后的产物上传至目标服务器. 然后将文件内容映射到 nginx 容器中.

关于 `NestJs` 服务的部署, 将构建开发环境中的 `docker-compose.yml`稍微进行改造即可, 内容如下:

```yml
version: '3.9'
services:
  backend-prod:
    container_name: backend-prod
    user: root
    build:
      context: ./
      dockerfile: ./packages/backend/Dockerfile.prod
    image: webserver-backend-prod
    restart: always
    env_file: .env
    networks:
      bp-network:
        ipv4_address: 172.25.0.2
    ports:
      - '${BACKEND_PORT}:3535'
    depends_on:
      - bp-pg-db-prod
    command: [sh, -c, "cd packages/backend && pnpm migrate:postgres && pnpm prisma:gen && pnpm build && pnpm start:prod"]
  bp-pg-db-prod:
    image: postgres:12-alpine
    restart: always
    container_name: bp-pg-db-prod
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
  pgadmin-portal-prod:
    image: dpage/pgadmin4
    restart: always
    container_name: pgadmin-portal-prod
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
      - bp-pg-db-prod
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

Dockerfile.prod:

```dockerfile
FROM node:16.16.0-alpine


WORKDIR /app

COPY ./pnpm-lock.yaml ./

RUN npm install -g pnpm@8.3.1

RUN pnpm fetch

COPY . .

RUN pnpm install -r --offline

VOLUME ["/app/node_modules/", "/app/packages/backend/node_modules/", "/app/.pnpm-store/"]
```

由于本文所构建项目为一个 Monorepo, 所以在提交前端代码时同时会触发后端项目的构建, 所以我们仅需将以下内容添加至前端构建流程中的 `./scripts/build.sh`即可:

```sh
docker-compose -f docker-compose.server.yaml stop && docker-compose -f docker-compose.server.yaml up --build -d --remove-orphans
```

注意事项:

 1. 需要移除 docker-compose 中后端服务的 volume. 由于jenkins在构建完成后会清空工作区, 所以这里不需要同构建开发环境一样进行文件映射.
 2. NestJS 项目中开发环境以及生产环境中环境变量的区分.

最后, 构建完成后, 宿主主机上容器列表如下:

![alt](/assets/docker-react-nest/example14.png)

通过 http:[ip]:7878 即可正常访问后端服务, http:[ip]:5055 可访问 pgadmin.

项目地址: <https://github.com/LZS911/todo-react-nest-docker>

jenkins+nginx容器构建: <https://github.com/LZS911/jenkins-nginx-docker>
