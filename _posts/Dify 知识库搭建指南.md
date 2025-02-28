---
title: Dify 知识库搭建指南
layout: post
date: '2025-02-20'
image:
headerImage: false
tag:
  - DeepSeek
  - Dify
star: true
category: blog
author: LZS_911
description: blog
excerpt: ''
theme: Chinese-red  
---

## Dify介绍

### 什么是 Dify？

`Dify 一词源自 Define + Modify，意指定义并且持续的改进你的 AI 应用，它是为你而做的（Do it for you）。`

Dify 是一款开源的大语言模型(LLM) 应用开发平台。它融合了后端即服务（Backend as Service）和 LLMOps 的理念，使开发者可以快速搭建生产级的生成式 AI 应用。即使你是非技术人员，也能参与到 AI 应用的定义和数据运营过程中。

由于 Dify 内置了构建 LLM 应用所需的关键技术栈，包括对数百个模型的支持、直观的 Prompt 编排界面、高质量的 RAG 引擎、稳健的 Agent 框架、灵活的流程编排，并同时提供了一套易用的界面和 API。这为开发者节省了许多重复造轮子的时间，使其可以专注在创新和业务需求上。

### Dify 能做什么？

- 创业，快速的将你的 AI 应用创意变成现实，无论成功和失败都需要加速。在真实世界，已经有几十个团队通过 Dify 构建 MVP（最小可用产品）获得投资，或通过 POC（概念验证）赢得了客户的订单。

- 将 LLM 集成至已有业务，通过引入 LLM 增强现有应用的能力，接入 Dify 的 RESTful API 从而实现 Prompt 与业务代码的解耦，在 Dify 的管理界面是跟踪数据、成本和用量，持续改进应用效果。

- 作为企业级 LLM 基础设施，一些银行和大型互联网公司正在将 Dify 部署为企业内的 LLM 网关，加速 GenAI 技术在企业内的推广，并实现中心化的监管。

- 探索 LLM 的能力边界，即使你是一个技术爱好者，通过 Dify 也可以轻松的实践 Prompt 工程和 Agent 技术，在 GPTs 推出以前就已经有超过 60,000 开发者在 Dify 上创建了自己的第一个应用。

### Dify 云服务

Dify 为所有人提供了[云服务](https://cloud.dify.ai/apps)，用户无需自行部署服务器，只需注册账号即可使用。云服务版本提供了自动备份、安全加密等高级功能，适合对数据安全要求较高的用户。

### Dify 社区版

Dify 社区版即开源版本，你可以通过以下两种方式之一部署 Dify 社区版：

- [Docker Compose 部署](https://docs.dify.ai/zh-hans/getting-started/install-self-hosted/docker-compose)

- [本地源码启动](https://docs.dify.ai/zh-hans/getting-started/install-self-hosted/local-source-code)

## 搭建具有知识库功能的聊天机器人

### 接入大模型

云服务版本对于普通用户免费提供每月 200 次 gpt4o 的额度，所以在这里主要分享如何在本地搭建的 Dify 上接入免费的 Deepseek 70b

https://www.cnblogs.com/xiao987334176/p/18699605

### 创建本地知识库

### Embedding模型介绍

Embedding模型是一种将数据转换为向量表示的技术，核心思想是通过学习数据的内在结构和语义信息，将其映射到一个低维向量空间中，使得相似的数据点在向量空间中的位置相近，从而通过计算向量之间的相似度来衡量数据之间的相似性。Embedding模型可以将单词、句子或图像等数据转换为低维向量，使得计算机能够更好地理解和处理这些数据。在NLP领域，Embedding模型可以将单词、句子或文档转换为向量，用于文本分类、情感分析。机器翻译等任务。在计算机视觉中，Embedding模型可以用于图像识别和检索等任务。

### 添加Embedding模型

云服务版本依旧有免费的Embedding模型额度，对于本地 Dify，可以在添加大模型时选择 Text Embedding 类型的模型

![image](https://github.com/user-attachments/assets/903ca8ae-18d1-4630-89e5-0fed9ef6d237)

### 创建知识库

知识库数据源可以通过以下三种方式，这里我们选择导入本地文件

![image](https://github.com/user-attachments/assets/674a1a89-bd23-4812-a984-c273901e0f81)

在对文本进行分段处理完成索引后，我们来进行召回测试

![image](https://github.com/user-attachments/assets/9d0d5227-0b5e-41a5-bae1-3e0e361eaf20)

### 外部知识库以及知识库同步功能

TODO

### 构建应用
Dify 提供了一系列模板来方便我们快捷构建应用，这里我们选择使用知识库的聊天机器人助手模板

![image](https://github.com/user-attachments/assets/4e1337f1-085f-47b1-8b4f-730757c4e888)

该模板预设流程如下：

![image](https://github.com/user-attachments/assets/4afa23a1-5000-495d-8c91-266d5120161c)

流程包含以下几个节点：

1. 知识库内容检索
  ![image](https://github.com/user-attachments/assets/cc65c644-b783-4ac2-87c7-600d1aa09ee2)
  我们需要在此步骤绑定相关联的知识库

2. 调用语言大模型
   ![image](https://github.com/user-attachments/assets/52180f5c-b50f-4c9d-a4ca-f77fd4a51fbe)
   在这里我们需要设置大模型并设置提示语

### 发布应用

在发布应用前，我们可以先使用预览功能，来进行验证

![image](https://github.com/user-attachments/assets/a15f43b9-8a8b-45a0-b97d-dc644408e729)

发布应用后，便可以通过在线访问或者嵌入其他网站以及 API 调用的形式来访问该 API 应用了。
