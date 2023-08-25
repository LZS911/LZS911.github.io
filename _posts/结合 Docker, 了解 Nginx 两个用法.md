---
title: 结合 Docker, 了解 Nginx 的两个用法
date: "2023-08-20"
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



## 前置准备

首先需要安装  [Docker Desktop](https://www.docker.com/products/docker-desktop/)  

它是一个可以在桌面端管理docker镜像和容器的应用程序

![alt](/assets/docker_nginx/example-1.png)

同时, 也可以在终端里面执行 docker 相关的命令了

![alt](/assets/docker_nginx/example-2.png)

接下来, 我们来跑一个 nginx 的镜像

![alt](/assets/docker_nginx/example-3.png)

输入容器名以及映射的端口号

![alt](/assets/docker_nginx/example-4.png)

 这里我们将宿主的 8001 端口映射到容器的 80 端口, 点击 Run 后, 就可以看到 docker 容器成功的运行起来了, 并且可以看到日志信息:

![alt](/assets/docker_nginx/example-5.png)

浏览器访问下 <http://localhost:8001> 可以看到 nginx 欢迎页面：

![alt](/assets/docker_nginx/example-6.png)

但是现在的页面是默认的，我想用 nginx 来托管我的一些静态 html 页面怎么做呢？

首先我们要知道现在的配置文件和页面都存在哪里.

在 files 面板可以看到容器内的文件, 里面的 /usr/share/nginx/html/ 目录下面就是所有的静态文件.

双击点开 index.html 后可以看到：

![alt](/assets/docker_nginx/example-7.png)

这个 html 内容和默认内容完全一致

也就是说，这个目录就是保存静态文件的目录, 所以我们只需要将自己的 html 文件存放在这里就行了.

我们先将这个文件从容器中复制出来:

`docker cp nginx1:/usr/share/nginx/html ~/code/nginx/nginx-html`

同样的, 我们在 files 中找到 /etc/nginx 目录, 这里面存放着关于 nginx 的主配置文件以及一些其他配置信息, 我们同样的将其从容器中复制出来

`docker cp nginx1:/etc/nginx ~/code/nginx`

现在我们删除容器, 并重新 Run nginx 镜像, 这次我们添加上 volumes, 也就是添加了宿主目录与容器目录的映射.

![alt](/assets/docker_nginx/example-8.png)

此时, 我们在 <http://localhost:8001> 上仍然能看到 nginx 默认页.
当我们修改本地 nginx-html/html/index.html 的内容后, 刷新浏览器, 能看到默认页发生对应的改变, 这就是我们添加的目录映射的功劳.

![alt](/assets/docker_nginx/example-9.png)

![alt](/assets/docker_nginx/example-10.png)

同样, 我们在本地的 nginx-html/html/ 下新增 test.html, 然后访问 localhost:8081/test.html, 同样也能访问到 test.html 的内容.

到目前为止, 我们正常的配置了一个使用 docker 的 nginx 容器, 接下来我们看下 nginx 的两个核心用法.

## nginx 配置文件

首先, 我们先找到从容器中复制出来的 nginx 目录, 打开 nginx.conf 文件, 这是 nginx 的主配置文件:

```conf

user  nginx; #指定Nginx worker进程的运行用户为nginx
worker_processes  auto; #设置worker进程的数量，使用auto表示根据系统的CPU核心数自动设置

error_log  /var/log/nginx/error.log notice; # 指定错误日志文件的路径和级别，此处为/var/log/nginx/error.log，并设置级别为notice.
pid        /var/run/nginx.pid; #指定Nginx主进程的PID文件路径.


events {
    worker_connections  1024;
}


http # 定义Nginx的HTTP模块，包括HTTP服务器的全局配置和默认行为. {
    include       /etc/nginx/mime.types; #引入MIME类型配置文件，该文件定义了文件扩展名与MIME类型的映射关系.
    default_type  application/octet-stream; #设置默认的Content-Type，即当无法从文件扩展名中确定MIME类型时使用的默认类型.

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"'; #配置日志格式，定义了日志中的字段和格式化方式.

    access_log  /var/log/nginx/access.log  main; #指定访问日志文件的路径和使用的日志格式.

    sendfile        on; #开启sendfile机制，用于优化发送静态文件的性能.
    #tcp_nopush     on;

    keepalive_timeout  65; #设置长连接的超时时间，即空闲连接保持的时间.

    #gzip  on;

    include /etc/nginx/conf.d/*.conf; #引入/conf.d/目录下的所有.conf文件，用于包含额外的配置文件.
}
```

这里面一般做一些全局的配置，比如错误日志的目录等等.

可以看到 http 下面有个 include 引入了 /etc/nginx/conf.d/*.conf 的配置.

一般具体的路由配置都是在这些子配置文件里.

接下来我们看下 conf.d 下的 default.conf 文件:

![alt](/assets/docker_nginx/example-11.png)

这里面就配置了 localhost:80 的虚拟主机下的所有路由, 也就是宿主主机下的 localhost:8081

虚拟主机是什么呢？

就是可以用一台 nginx 服务器来为多个域名和端口的提供服务.

只要多加几个 server 配置就可以.

这里我们就配置 localhost:80 这一个虚拟主机.

下面的 location 就是路由配置.

比如这个配置：

![alt](/assets/docker_nginx/example-12.png)

它就配置了 / 下的所有路由，都是在 root 指定的目录查找.

所以 <http://localhost/aaa.html> 就是从 /usr/share/nginx/html/aaa.html 找的.

location 支持的语法有好几个，我们分别试一下：

![alt](/assets/docker_nginx/example-13.png)

把之前的 location / 注释掉，添加这样几个路由配置, 然后在容器内的 terminal 执行以下命令:

`nginx -s reload`

重新加载配置文件(⚠️: 每次修改配置文件后都需要重新加载下配置文件)

然后来看第一条路由

```code
  location = /111/ {
    default_type text/plain;
    return 200 "111 success";
    }
```

location 和路径之间加了个 =，代表精准匹配，也就是只有完全相同的 url 才会匹配这个路由.

![alt](/assets/docker_nginx/example-14.png)

不带 = 代表根据前缀匹配，后面可以是任意路径, 这里的 $uri 是取当前路径.

```code
    location /222 {
        default_type text/plain;
        return 200 $uri;
    }

```

![alt](/assets/docker_nginx/example-15.png)

如果想支持正则，就可以加个 ~

```conf
    location ~ ^/333/bbb.*\.html$ {
        default_type text/plain;
        return 200 $uri;
    }
```

![alt](/assets/docker_nginx/example-16.png)

这里的正则语法不难看懂，就是 /333/bbb 开头，然后中间是任意字符，最后 .html 结尾的 url.

当然, 这样是会区分大小写的, 例如这样的路径就不支持了

![alt](/assets/docker_nginx/example-17.png)

如果想让正则不区分大小写，可以再加个 *

```conf
    
    location ~* ^/444/AAA.*\.html$ {
        default_type text/plain;
        return 200 $uri;
    }
```

![alt](/assets/docker_nginx/example-18.png)

此外，还有一种语法：

在配置文件加上这个配置：

```conf
location /444 {
    default_type text/plain;
    return 200 'xxxx';
}
```

这时候就有两个 /444 的路由了, 这时候浏览器访问，还是匹配上面的那个路由：

![alt](/assets/docker_nginx/example-19.png)

如果想提高优先级，可以使用 ^~

改成这样：

```conf
location ^~ /444 {
    default_type text/plain;
    return 200 'xxxx';
}
```

这时候同一个 url，匹配的就是下面的路由了：

![alt](/assets/docker_nginx/example-20.png)

也就是说 ^~ 能够提高前缀匹配的优先级.

总结一下，一共 4 个 location 语法：

location = /aaa 是精确匹配 /aaa 的路由.

location /bbb 是前缀匹配 /bbb 的路由.

location ~ /ccc.*.html 是正则匹配.可以再加个* 表示不区分大小写 location ~*/ccc.*.html

location ^~ /ddd 是前缀匹配，但是优先级更高.

这 4 种语法的优先级是这样的：

**精确匹配（=） > 高优先级前缀匹配（^~） > 正则匹配（～ ~*） > 普通前缀匹配**

我们现在是直接用 return 返回的内容，其实应该返回 html 文件.

可以这样改：

```conf
location /222 {
    alias /usr/share/nginx/html;
}

location ~ ^/333/bbb.*\.html$ {
    alias /usr/share/nginx/html/test.html;
}
```

![alt](/assets/docker_nginx/example-21.png)

![alt](/assets/docker_nginx/example-22.png)

前面用过 root：

```conf
 location / {
      root   /usr/share/nginx/html;
      index  index.html index.htm;
  }
```

root 和 alias 有什么区别呢？

比如这样的两个配置：

```conf
location /222 {
    alias /dddd;
}

location /222 {
    root /dddd;
}
```

同样是 /222/xxx/yyy.html，如果是用 root 的配置，会把整个 uri 作为路径拼接在后面.

也就是会查找 /dddd/222/xxx/yyy.html 文件.

如果是 alias 配置，它会把去掉 /222 之后的部分路径拼接在后面.

也就是会查找 /dddd/xxx/yyy.html 文件.

也就是 我们 **root 和 alias 的区别就是拼接路径时是否包含匹配条件的路径**

这就是 nginx 的第一个功能：静态文件托管.

主配置文件在 /etc/nginx/nginx.conf，而子配置文件在 /etc/nginx/conf.d 目录下.

默认的 html 路径是 /usr/share/nginx/html.

然后来看下 nginx 的第二大功能：动态资源的反向代理.

关于 [正向代理以及反向代理](https://cloud.tencent.com/developer/article/1418457)

测试 nginx 做反向代理服务器之前，我们先创建个 nest 服务.

```npx nest new nest-app -p npm```

浏览器就访问 <http://localhost:3000> 看到 hello world 就代表 nest 服务跑成功了：

![alt](/assets/docker_nginx/example-23.png)

添加一个全局的前缀 /v1

![alt](/assets/docker_nginx/example-24.png)

改下 nginx 配置，添加个路由：

```code
    location ^~ /v1 {
        proxy_pass http://192.168.21.242:3000;
    }    
```

这个路由是根据前缀匹配 /v1 开头的 url， ^~ 是提高优先级用的.

然后你访问 <http://localhost:8001/v1> 就可以看到 nest 服务返回的响应了：

![alt](/assets/docker_nginx/example-25.png)

为什么要多 nginx 这一层代理呢？

自然是可以在这一层做很多事情的.

比如修改 header：

```code
    location ^~ /v1 {
        proxy_set_header name liyu; #新增
        proxy_pass http://192.168.21.242:3000;
    }    

```

在 nest 服务的 handler 里注入 headers，打印一下：

![alt](/assets/docker_nginx/example-26.png)

然后浏览器访问下.

直接访问 nest 服务的话，是没有这个 header 的：

![alt](/assets/docker_nginx/example-27.png)

访问 nginx 的反向代理服务器，做一次中转：

![alt](/assets/docker_nginx/example-28.png)

这就是反向代理服务器的作用，可以透明的修改请求、响应.

而且，还可以用它实现负载均衡.

在 controlller 里打印下访问日志, 并修改端口 3001, 新开端口重新使用 `yarn start` 启动服务

![alt](/assets/docker_nginx/example-29.png)

这个时候, 我们就有 3000 和 3001 两个服务了, 浏览器访问下, 都是正常的
![alt](/assets/docker_nginx/example-30.png)

![alt](/assets/docker_nginx/example-31.png)

问题来了，现在有一个 nginx 服务器，两个 nest 服务器了，nginx 该如何应对呢？

nginx 的解决方式就是负载均衡，把请求按照一定的规则分到不同的服务器.

改下 nginx 配置文件：

![alt](/assets/docker_nginx/example-32.png)

在 upstream 里配置它代理的目标服务器的所有实例.

下面 proxy_pass 通过 upstream 的名字来指定.

这时候我访问 <http://localhost:8001/v1> 刷新 5 次页面：

![alt](/assets/docker_nginx/example-33.png)

可以看到两个 nest 服务，一个 3 次，一个 2 次.

因为默认是轮询的方式.

一共有 4 种负载均衡策略：

轮询：默认方式.
weight：在轮询基础上增加权重，也就是轮询到的几率不同.
ip_hash：按照 ip 的 hash 分配，保证每个访客的请求固定访问一个服务器，解决 session 问题.
fair：按照响应时间来分配，这个需要安装 nginx-upstream-fair 插件.
我们测试下 weight 和 ip_hash 的方式.

添加一个 weight=2，默认是 1，这样两个服务器轮询到的几率是 2 比 1.

![alt](/assets/docker_nginx/example-34.png)

然后我访问了 8 次 <http://localhost:8001/v1>

看打印的日志来看，差不多就是 2:1 的轮询几率.

![alt](/assets/docker_nginx/example-35.png)

这就是带权重的轮询.

我们再试下 ip_hash 的方式；

![alt](/assets/docker_nginx/example-36.png)

再次访问了 <http://localhost:8001/v1>
可以看到一直请求到了一台服务器：
![alt](/assets/docker_nginx/example-37.png)

这就是 Nginx 的负载均衡的策略.

这就是 Nginx 的负载均衡的策略.

## 总结

我们通过 docker 跑了 nginx 服务器，并使用了它的静态资源托管功能，还有动态资源的反向代理功能.

nginx 的配置文件在 /etc/nginx/nginx.conf 里，它默认还引入了 /etc/nginx/conf.d 下的子配置文件.

默认 html 都放在 /usr/share/nginx/html 下.

我们可以通过 docker cp 来把容器内文件复制到宿主机, 然后进行文件映射, 最后通过修改宿主上的配置文件来修改容器中的配置文件.

修改 nginx 配置，在 server 里配置路由，根据不同的 url 返回不同的静态文件.

有 4 种 location 语法：

1. location /aaa 根据前缀匹配
2. location ^~ /aaa 根据前缀匹配，优先级更高
3. location = /aaa 精准匹配
4. location ~ /aaa/.*html 正则匹配
   `location ~* /aaa/.*html`正则匹配，而且不区分大小写

优先级是 精确匹配（=） > 高优先级前缀匹配（^~） > 正则匹配（～ ~*） > 普通前缀匹配

除了静态资源托管外，nginx 还可以对动态资源做反向代理.

也就是请求发给 nginx，由它转发给应用服务器，这一层也可以叫做网关.

nginx 反向代理可以修改请求、响应信息，比如设置 header.

当有多台应用服务器的时候，可以通过 upstream 配置负载均衡，有 4 种策略：轮询、带权重的轮询、ip_hash、fair.

掌握了静态资源托管、动态资源的反向代理+负载均衡.
