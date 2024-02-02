---
title: 探索 Linux 权限问题：GoCD 流水线频繁出现错误的事故
date: "2024-02-02"
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


## 问题背景

团队使用前后端分离的开发模式来开发代码，并使用 GoCD 来自动化项目前后端的构建过程。

前置准备：设置需要 clone 的仓库地址

具体流程如下：

1. 更新仓库代码，并使用 `git clean -dfx` 移除未跟踪文件、目录以及 .gitignore 中过滤的文件，例如前端项目中的 node_modules 或 dist 目录。
2. 使用 Docker 镜像构建指定版本的前端产物， 指令为：`$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app -w /usr/src/app --rm $(DOCKER_IMAGE) sh -c "pnpm install --frozen-lockfile"
`·
3. 将前端项目产物复制到后端项目中指定的目录下
4. 构建服务，并将最终产物上传至 ftp

在过去的一段时间里，GoCD流水线开始频繁出现错误，导致构建失败和部署延迟。且这种错误存在一定的「偶发性」，当然，定义为「偶发性」错误时，我还并没有去深入细究出现错误的原因，仅仅根据不会稳定出现这个错误而草草的下了定义。

## 错误排查

![alt](/assets/gocd-error/example-1.png)

通过报错信息可以定位到错误发生在第一阶段移除前端项目中某些文件时发生。该文件为前端使用 pnpm 包管理器构建项目时生成的依赖文件。

![alt](/assets/gocd-error/example-2.png)

如上图所示，进入 GoCD 所在的服务器后，发现该文件所属权限为 root 用户，而在整个 GoCD 流程构建中，所属用户应该为 go 用户。

先跳过这个问题，我们先来探查为什么该问题会偶发出现。正常来说，go 用户每次去执行 `git clean -dfx` 都应该抛出错误。

![alt](/assets/gocd-error/example-3.png)

找到 GoCD 配置后，发现在前端产物构建成功后，会执行一次授权，保证下次流程的 clean 操作能正常执行，而每次清除文件失败都是跟在上一次前端构建失败后触发（例如前端依赖下载由于超时导致失败）。这样就能解释问什么 「偶发」出现错误了。

## pnpm 依赖安装分析

既然问题出现在 pnpm 安装这一过程，那先来了解下 pnpm 相关知识。

<https://pnpm.io/zh/faq>

经过初步分析，问题可能出现在 pnpm 安装 .pnpm-store 过程中，那实际操作看看在 Docker 镜像中下载依赖时，保存的 .pnpm-store 路径具体在哪。

在使用 pnpm 镜像启动的容器中执行 `pnpm config get store path` 后发现该路径位于容器工作目录下，并不会导致上述问题出现，故排除 pnpm 依赖下载问题。

## pnpm Docker 镜像

pnpm Docker 镜像构建时并没有使用 USER 指定用户，而 Docker 镜像的默认用户为 root，所以在使用 Docker 容器构建前端项目时，虽然执行者为 go 用户，但是后续 sh -c 中执行的语句的所有者为 root 用户， 所以导致通过 pnpm install 得到的目录的所有者为 root。

## 解决办法

1. 构建镜像时指定用户。

   问题：无法直接获取到当前用户，需要指定某个具体的用户。

2. 使用 Docker 容器构建产物时指定当前用户。修改指令为： `$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app --user $(UID):$(GID) -w /usr/src/app --rm $(DOCKER_IMAGE) sh -c "pnpm install --frozen-lockfile"`
   问题：使用当前用户后， sh -c 中执行的语句也只能拥有当前用户的权限，无法获取到 pnpm 的一些配置选项，例如无法在命令中设置 registry 。
