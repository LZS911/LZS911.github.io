---
title: whistle学习记录.md
date: "2022-12-07"
image: 
headerImage: false
tag:
  -
star: true
category: blog
author: Ai.Haibara
description: blog
excerpt: 
theme: fancy
---

## 简介

whistle是基于Node实现的跨平台web调试代理工具，同类型的工具有Fiddler和Charles，主要用于查看、修改 HTTP、HTTPS、Websocket 的请求、响应，也可以作为HTTP代理服务器使用。
在使用了Fiddler、Charles以及whistle这三款代理工具之后，总结出来的whistle的优势有以下几点：

配置简单：whistle 的配置类似于系统hosts的配置，一切操作都可以通过配置实现，支持域名、路径、正则表达式、通配符、通配路径等多种匹配方式。
支持扩展：whistle 提供了插件扩展能力，通过插件可以新增whistle的协议实现更复杂的操作、也可以用来存储或监控指定请求、集成业务本地开发调试环境等等，基本上可以做任何你想做的事情，且开发、发布及安装whistle插件也都很简单。
内置 weinre：通过 weinre 可以修改调试移动端DOM结构、捕获页面异常等。
界面简单易懂：从界面来看，whistle 的功能划分为了 network（网络）、rules（规则）、values（数据）、pulgins（插件）四大模块，通过tab页签进行切换。
文档全面：whistle 官网提供了详细的说明文档，工作中遇到的情况只要查阅文档都能解决。

下图是whistle支持的功能:

![alt](/assets/whistle/example-1.png)

## 安装启动

### 安装Node

由于whistle是基于Node的，自然需要先安装Node环境，这里不再多做说明。下面是whistle官网对Node版本的建议：

whistle支持v0.10.0以上版本的Node，为获取更好的性能，推荐安装最新版本的Node。

### 安装whistle

Node安装完成后，执行如下命令安装whistle：

```ssh
npm install -g whistle
```

查看版本：

```ssh
whistle -V
```

如果能正确输出whistle的版本信息，就表示安装成功了。之后可通过help命令查看帮助信息：

```ssh
whistle help
```

### 启动whistle

whistle支持三种等价的命令whistle、w2、wproxy，本文使用w2命令。下面是常用的命令：
启动whistle:

```ssh
w2 start
```

whistle的默认端口是8899，如果要指定端口号，执行下面的命令：

```ssh
w2 start -p 8888
```

重启whistle（也支持指定端口）:

```ssh
w2 restart
```

停止whistle:

```ssh
w2 stop
```

## 配置代理

配置代理时有两个关键的参数：服务器IP和端口号。端口号比较简单，对应w2 start命令启动好的端口号即可。服务器IP的话需要分两种情况：一种是本地，对应127.0.0.1即可，另一种是远程，这时候需要填服务器的IP。配置所需要的信息在启动whistle时控制台会告诉我们，见下图

![alt](/assets/whistle/example-2.png)

从上面的图片可以看出，端口号为8899，IP有127.0.0.1、10.1.2.30、192.168.137.1和192.168.191.1这四个，如果是本地代理的话，这四个IP都可以（如果不想每次IP更换都要重新配置，选127.0.0.1呀），如果是远程代理，除了127.0.0.1之外，其他都可以的（仍然不建议填10.1.2.30这个IP，理由同上）。

下面来说下配置代理的几种方式：

### 浏览器代理

浏览器代理的话要使用浏览器的代理插件，这里介绍chrome和firefox两种：

chrome：使用 SwitchOmega 插件。
firefox：地址栏输入访问 about:preferences，找到 Network Proxy，选择 手动代理配置(Manual proxy configuration)，输入代理服务器地址、端口，保存即可。

### 全局代理

1. [Windows](http://jingyan.baidu.com/article/0aa22375866c8988cc0d648c.html)

2. [Mac](http://jingyan.baidu.com/article/a378c960849144b3282830dc.html): System Preferences > Network > Advanced > Proxies > HTTP or HTTPS

   ![alt](/assets/whistle/example-3.png)

3. Linux: Settings > Network > VPN > Network Proxy > Manual

   ![alt](/assets/whistle/example-4.png)

4. 移动端需要在设置中配置当前 Wi-Fi 的代理，以 iOS 为例：

   ![alt](/assets/whistle/example-5.png)

## 安装https证书

关闭防火墙或者给 whistle 设置了白名单之后，如果whistle的设置页面可以正常打开，这表示说我们可以代理http请求了。
如果你的页面和接口全部是http请求，就可以忽略安装https证书的这一步了。但现实是除了本地或者预发环境，我们很难找到不是https的了（很多预发环境也是https的），因此还是建议提前把证书装上。
如果你的环境中出现了以下情况（当然，没有装好证书的话这些情况基本都会出现的），就是https证书没有安装或者没装好：

1. whistle 的配置页面可以打开，但是网页不能打开或者只加载了一部分页面
2. 京东App数据更新不了或展示不全，或者扫码提示“无法获取信息”
3. whistle配置页面中network中443端口的请求前面有小锁，或者抓不到请求
4. 浏览器提示“您的连接不是私密连接”

### 下载证书并开启拦截https

我们可以通过下面的方式下载证书：

1. 在配置代理的设备上打开浏览器，在浏览器中输入 rootca.pro 即可下载，这种是最便捷的方式
2. 在启动了whistle的机器上用浏览器打开配置页面，点击https，会弹出一个带二维码的界面，点击Download RootCA 或者扫二维码下载   ![alt](/assets/whistle/example-6.png)

## 基础篇

### 控制台

whistle控制台核心部分的分区如下

   ![alt](/assets/whistle/example-7.png)

1. NetWork: 查看请求响应的详细信息及请求列表的Timeline
2. Rules: 匹配规则，whistle核心，详见下一节配置方式
3. Values: 配置key-value的数据，在Rules里面配置可以通过{key}获取
4. Plugins: 显示所有已安装的插件列表，开启关闭插件功能

## 配置方式

在文章的开头就说过，whistle的所有操作都可以通过配置实现，配置方式扩展于系统 hosts 配置方式(ip domain或组合方式ip domain1 domain2 domainN)，具有更丰富的匹配模式及更灵活的配置方式。
whistle默认的配置方式是将匹配模式(pattern)写在左边，操作uri(operatorURI)写在右边。这样，whistle会将请求的url与pattern进行匹配，如果匹配上就执行operatorURI对应的操作：

```code
pattern operatorURI
```

>pattern和operatorURI也可以左右互换（[link](http://wproxy.org/whistle/mode.html)），为了行文的清晰，不造成新的混淆，这里只介绍我常用的配置方式，我认为只掌握一种就够了。

我们配置hosts时，如果一个IP要对应多个域名，会这样子写：

```code
127.0.0.1  www.domain1.com www.domain2.com www.domainN.com
```

和系统hosts一样，如果一个pattern要对应多个操作，whistle 也支持组合方式的配置。使用组合方式时，whistle会按照从左到右的顺序执行operatorURI。

```code
pattern operatorURI1 operatorURI2 operatorURIn
```

在简单了解了配置方式之后，我们就可以按照pattern operatorURI的模式为 whistle 添加规则了。
还是再回到 whistle 控制台的界面，选中Rules。我们可以像使用SwitchHosts软件管理hosts一样对规则进行分组管理。默认情况下，whistle只有一个Default的分组，如下：

   ![alt](/assets/whistle/example-8.png)

我们可以点击Create按钮添加一个单品页的分组，在这个分组里可以加上所有与单品页相关的配置（如果要禁用某个配置，可以使用Ctrl + /的快捷键，或者直接在前面加#）如果要配置的分组生效，需要双击左侧单品页的tab，出现对号就表示生效了，没有在使用的分组是没有对号的，也可以同时使用多个分组。如下图:

   ![alt](/assets/whistle/example-9.png)

### 匹配方式

whistle的匹配模式分为以下几种：

1. 域名匹配：域名匹配不仅支持匹配某个域名，也可以限定端口号、协议

     ```code
     // 匹配www.domain.com域名下的所有请求，包括http、https、ws、wss，tunnel
     www.domain.com operatorURI
     
     // 匹配www.domain.com域名下的http请求
     
     http://www.domain.com operatorURI
     
     // 匹配www.domain.com域名下81端口的请求(http请求默认为80端口，https请求默认为443端口)
     www.domain.com:81 operatorURI
     ```

2. 路径匹配：指定匹配某个路径，也可以限定端口号、协议

     ```code
     // 匹配www.domain.com:81/path路径及其子路径（如www.domain.com:81/path/child）的请求
  
     www.domain.com:81/path operatorURI
     ```

3. 精确匹配：与上面的路径匹配不同，路径匹配不仅匹配对应的路径，而且还会匹配该路径下面的子路径，而精确匹配只能指定的路径，只要在路径前面加$即可变成精确匹配

     ```code
      // 匹配www.domain.com:81/path的路径，不包含子路径
      $www.domain.com:81/path operatorURI
     ```

4. 正则匹配：正则的语法及写法跟js的正则表达式一致，支持两种模式：/reg/、/reg/i 忽略大小写，支持子匹配，但不支持/reg/g，且可以通过正则的子匹配把请求url里面的部分字符串传给operatorURI

     ```code
     // 匹配所有请求
     * operatorURI
     
     // 匹配url中包含keyword的请求，且忽略大小写
     /keyword/i operatorURI
     
     // 利用子匹配把url里面的参数带到匹配的操作uri
     // 下面正则将把请求里面的文件名称，带到匹配的操作uri
     // 最多支持10个子匹配 $0...9，其中$0表示整个请求url，其它跟正则的子匹配一样
     /[^?#]\/([^\/]+)\.html/ protocol://...$1...
     ```

5. 通配符匹配：通常，域名匹配和路径匹配可以满足我们大部分的需要，不满足的部分也可以用正则匹配来补充，但正则对大部分人来说还是有门槛的，whistle
很贴心的为我们提供了更简单的通配符匹配方式。目前我还没用过通配符匹配，这里依然简单介绍下，完整通配符匹配: <http://wproxy.org/whistle/pattern.html>

    * 通配符匹配

      ```code
       // 以 ^ 开头
       ^www.example.com/test/*** protocol://...$1...

       // 限定结束位置
       ^www.example.com/test/***test$ protocol://...$1...
      ```

    * 通配域名匹配

      ```code
        // 匹配以 .com 结尾的所有url，如: test.com, abc.com，但不包含 *.xxx.com
        *.com protocol://...$1...
        // 匹配 test.com 的子域名，不包括 test.com
        // 也不包括诸如 *.xxx.test.com 的四级域名，只能包含: a.test.com，www.test.com 等test.com的三级域名
        *.test.com protocol://...$1...
        
        // 如果要配置所有子域名生效，可以使用 **
        **.com protocol://...$1...
       ```

    * 通配路径匹配

      ```code
        // 对所有域名对应的路径 protocol://a.b.c/xxx[/yyy]都生效
        */ 127.0.0.1
      ```

### 操作值operatorURI

whistle官网将 whistle 的操作值分为字符串和JSON对象两种。本文按照配置方式的不同，将 whistle 的操作值分为两种：带空格的和不带空格的。

1. 带空格：带空格的字符串和保留缩进格式的JSON对象
2. 不带空格：不带空格的字符串和序列化了的不带空格的JSON对象

不带空格的操作值可以直接在operatorURI中写入，模式为pattern opProtocol://(strValue)，注意字符串必须要用括号包裹：

```code
// 将符合pattern的url的返回内容用helloWorld代替
pattern resBody://(helloWorld)
```

1. 带空格的操作值需要将操作值保存在Values

    在 whistle 控制台中打开Values标签，点击Create，增加名称为test.json的操作值，并在右侧编辑test.json的内容，可按照pattern opProtocol://{valueName}来使用，注意value名称是用打括号包裹的，如下：

    ![alt](/assets/whistle/example-10.png)

    ```code
     // 将符合pattern的url的返回内容用test.json文件中的内容代替
     pattern resBody://{test.json}
    ```
