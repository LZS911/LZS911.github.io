---
title: 解析前端数据加载：BOM字节、Response-Type与Excel文件兼容性
date: "2024-04-10"
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

## 引言

在开发 To B 端的项目时，导出 CSV 文件进行数据分析是一项常规操作。然而，这一过程并非总是顺畅无阻。试想一下，当你信心满满地将一个 CSV 文件拖入 Excel ，期待看到一个整齐的数据表格时，却遭遇了乱码的尴尬场景。这不仅令人沮丧，而且可能严重影响工作效率。那么，CSV 文件与 Excel 之间存在哪些差异？我们如何确保在 Excel 中能够正常打开 CSV 文件？

本文将针对这些疑问展开探讨，从一次 CSV 文件导入 Excel 时出现的乱码问题入手，逐步剖析背后的原因。重点探讨`BOM（Byte Order Mark）`字节和 HTTP 响应中的`Content-Type`如何影响前端对数据的加载和解析，以及这些因素对 Excel 文件兼容性的影响。

## CSV文件与Excel的差异 [^1]

1. Excel是一个二进制文件，它保存有关工作簿中所有工作表的信息。CSV代表 Comma Separated Values 。这是一个纯文本格式，用逗号分隔一系列值。
2. Excel不仅可以存储数据，还可以对数据进行操作。CSV文件只是一个文本文件，它存储数据，但不包含格式，公式，宏等。它也被称为平面文件。
3. Excel是一个电子表格，将文件保存为自己的专有格式，即xls或xlsx。CSV是将表格信息保存为扩展名为.csv的分隔文本文件的格式。
4. 保存在excel中的文件不能被文本编辑器打开或编辑。CSV文件可以通过文本编辑器（如记事本）打开或编辑。

## BOM字节的概念与作用

在解释BOM字节前，我们先看一下 CSV 文件在 WPS 和 Microsoft Excel 中的表现区别

### WPS

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/6c8989cf-0386-4f4b-bcdb-1dfef747f2dc)

### Microsoft Excel

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/1eb61e35-19f5-4aaa-b1fa-b0f6a5be24f7)

### 为什么会出现中文乱码？

当出现乱码后，首先应该考虑的是文件的编码格式问题。通常，CSV 文件采用 UTF-8 编码，这是一种广泛使用的字符编码，支持包括中文在内的多种语言。然而 Microsoft Excel 会默认使用 ANSI 编码来解析文件，而 ANSI 编码实际上是依赖于系统区域设置的特定编码，比如在中文 Windows 系统中通常是GBK。

### 解决方案

1. 修改csv文件编码格式。 执行命令 `iconv -f UTF-8 -t GB18030 old_file.csv > new_file.csv`（在 macos 中能够正常执行，若 Windows 无法执行需寻找替代方案，例如使用文本编辑器（如Notepad++）的另存为功能，选择GBK作为保存编码），重新生成的 new_file 便能正常在 Microsoft Excel 中显示中文了。
   尽管使用命令行工具进行编码转换对于技术用户来说是一个高效的方法，但确实可能对普通用户来说有一定的使用门槛。
2. 使用 BOM 来进行编码表示。 BOM是一个特殊的字节序列，用于标识文件的编码格式。UTF-8编码的BOM字节序列是`0xEF 0xBB 0xBF`。当Excel打开带有BOM的CSV文件时，BOM帮助Excel识别文件是以UTF-8编码的，从而避免了使用错误的编码解析文件内容。
   代码案例：<https://github.com/LZS911/csv-bom-excel-example> [^2]

   ![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/260b5efb-a0a9-4b2b-a4ed-8e8e84a8ddd8)
   ![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/aeade430-b59a-4e57-a92f-f81f1604f48e)

   >其中文件大小为 60b 的为附带了 BOM 字节的 csv 文件

## Response-Type在HTTP响应中的作用

我们来看一行代码： <https://github.com/LZS911/csv-bom-excel-example/blob/main/index.html#L15>

首先了解下 ResponseType[^3] 的作用
>`XMLHttpRequest` 属性 `responseType` 是一个枚举字符串值，用于指定响应中包含的数据类型。
>它还允许作者更改响应类型。如果将 `responseType` 的值设置为空字符串，则会使用 `'text'` 作为默认值。

文章可能看的有点迷糊，我们直接将这行代码注释，然后观察下载得到的文件的表现
![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/d6084364-3e6b-4beb-a012-02efede30366)
![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/0434db6d-3f2e-4ed1-aa37-c81b7bf6cd7f)

可以发现，前端获取到的 csv 文件又丢失掉了后端附加的 BOM 字节，导致在 Microsoft Excel 中出现了乱码。

所以，可以得出结论：

当服务端端在返回数据首部添加字节`BOM（Byte Order Mark）`时，前端如果没有特别设置 `XMLHttpRequest的responseType` 为 `'blob'`，会丢失BOM字节。

这是因为`XMLHttpRequest`的默认`responseType`是 `'text'`，当设置为`'text'`时，浏览器会尝试将响应体解码为字符串文本。

## 如何避免BOM字节的丢失

### 后端处理

在前端不进行任何额外的处理情况下，后端可以使用字符串首部添加字节 `\ufeff` 的方式。 见代码：<https://github.com/LZS911/csv-bom-excel-example/blob/main/server.js#L5>。当然，最后代码能不能过 review 就不好说了🤪。

### 前端处理

1. 前端手动添加 `{responseType: 'blob'}`， 存在一定的心智负担。
2. 统一在请求在 `context-type` 为 'text/csv' 的情况下，在返回的data前部加上 `\ufeff`。 同样需要经过代码 review 的考验。

### 最佳实践

目前对比下来，上述的几种方案都不是特别完美。但我们可以通过综合利用项目中现有的工具和流程来找寻到最佳实践。

我们的前端项目使用了 `Typescript`，并且 api 定义部分使用一段脚本通过获取后端的 swagger.json 文件来自动生成，例如下面这段代码：<https://github.com/actiontech/dms-ui/blob/08f7de1a9e724008e18f73e498eaa9aca456ed1d/packages/shared/lib/api/sqle/service/task/index.ts#L206>

![image](https://github.com/LZS911/LZS911.github.io/assets/42765421/0ca221f5-4417-4d12-b257-08c90d5ab709)

于是我们可以根据后端的 swagger 定义，确定需要设置 {responseType: 'blob'} 的接口，然后在 api 模板部分自动添加上该参数，便能减少心智负担，确保该参数的存在。

## 结语[^4]

在本文中，我们深入探讨了在 Web 开发过程中处理CSV文件时可能会遇到的一个棘手问题——乱码，以及与之相关的技术细节。我们分析了乱码产生的原因，主要集中在字符编码的不匹配，尤其是当 CSV 文件使用 UTF-8 编码且带有BOM字节，而前端或 Excel 等电子表格软件未能正确识别和处理这些字节时。
通过提供一系列的解决方案，包括在服务端正确设置 HTTP 响应的`Content-Type`头部，以及在前端通过`XMLHttpRequest`以适当的`responseType`接收二进制数据，我们展示了如何有效地避免数据在传输和加载过程中出现乱码。

## 附录
> 通过 [Kimi](https://kimi.moonshot.cn/) 辅助生成文章标题以及具体大纲，并且进行细节优化。
[^1]:[CSV文件与Excel的差异](https://zhuanlan.zhihu.com/p/148209693)
[^2]:[示例代码由 Kimi 生成](https://github.com/LZS911/csv-bom-excel-example)
[^3]:[ResponseType](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType)
[^4]:[来自 Kimi](https://kimi.moonshot.cn/)
