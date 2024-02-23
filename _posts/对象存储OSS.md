---
title: OSS服务
date: "2024-02-23"
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

## 什么是 OSS？

[阿里云 OSS 介绍](<https://help.aliyun.com/zh/oss/product-overview/what-is-oss>)

## 如何自己搭建一个 OSS 服务？

### MinIO

[开源分布式对象存储-MinIO](https://zhuanlan.zhihu.com/p/103803549)

### 使用 Docker 部署 OSS 服务

1. 先确定需要使用的 docker 镜像：[bitnami/minio](https://hub.docker.com/r/bitnami/minio)
2. 编写 `docker-compose.yaml` 文件

   ```yaml
   version: "2.4"
  
   services:
     minio:
       restart: always
       image: "bitnami/minio:latest"
       ports:
           - "9000:9000"
           - "9001:9001"
       environment:
           - TZ=Asia/Shanghai
           - MINIO_ROOT_USER=liyu
           - MINIO_ROOT_PASSWORD=liyu@911.com
           - MINIO_PUBLIC_ADDRESS=http://47.115.219.196:9001/
       container_name: liyu_minio
       volumes:
           - minio_data:/bitnami/minio/data

   volumes:
     minio_data:
       driver: local
   ```

3. 启动容器：`docker-compose -f docker-compose.yaml up --build -d --remove-orphans`

### 管理界面操作

### 使用 sdk 操作

```js
const Minio = require('minio');
const fs = require('fs');

const minioClient = new Minio.Client({
  endPoint: '47.115.219.196',
  port: 9000,
  useSSL: false,
  accessKey: 'zgJ83Buz1v9Q7s060fTS',
  secretKey: 'duysuG1vlfco6ozl8BtMkdY9Q3zm6fxDB02pRijT',
});

function put() {
  minioClient.fPutObject(
    'liyu-test',
    'Union-put.svg',
    './Union-get.svg',
    function (err, etag) {
      if (err) return console.log(err);
      console.log('上传成功');
    }
  );
}

function get() {
  minioClient.getObject('liyu-test', 'Union.svg', (err, stream) => {
    if (err) return console.log(err);
    stream.pipe(fs.createWriteStream('./Union-get.svg'));
  });
}

function main() {
  // get();

  put();
}

main();
```
