---
title: Rest-VS-GraphQL
date: "2023-06-10"
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


## 什么是 REST？

`REST（Representational State Transfer` 是一种通过 HTTP 协议访问 Web 资源的架构。RESTful API 以资源为中心，资源通过 URL 唯一标识。
客户端通过 HTTP 方法（如 GET、POST、PUT 和 DELETE）对资源进行操作。REST API 返回 JSON、XML 或其他格式的数据。

RESTful 设计的核心原则是无状态性、可缓存性、可见性和可扩展性。

1. 无状态性要求每个请求都包含足够的信息，以便服务器可以理解该请求。
2. 可缓存性可以提高性能并减少网络带宽的使用。可见性要求 API 的行为对开发人员是可见的且易于理解。
3. 可扩展性要求 API 可以轻松地扩展以支持新的客户端和资源类型。

REST 的核心思想是资源。

### REST 缺点

虽然 RESTful API 很流行并且易于理解，但它可能存在一些缺点。

RESTful API 的一个主要缺点是，客户端经常需要从多个端点获取数据，这导致了所谓的“过度获取”问题。此外，RESTful API 的设计和更改需要与客户端进行协商，这可能会导致 API 的版本控制问题。

## 什么是 GraphQL？

`GraphQL` 是一种由 Facebook 开发的 API 查询语言和运行时。GraphQL 允许客户端指定其需要的数据，从而减少了过度获取的问题。客户端通过发送查询声明来定义数据的结构和关系，服务器根据查询声明返回特定的数据。

GraphQL 的一个主要优点是它可以减少网络带宽的使用，因为客户端只能获得它们需要的数据。此外，GraphQL API 可以轻松地扩展以支持新的客户端和资源类型。GraphQL 还提供了一种类型系统，开发人员可以利用该系统来捕获 API 的行为并提供有关可用字段和查询的文档。

### GraphQL 缺点

尽管 GraphQL 有许多优点，但它也存在一些缺点。

GraphQL 的一个主要缺点是学习曲线较陡峭，因为它涉及到新的查询语言和概念。此外，GraphQL 查询比 RESTful 请求更复杂，可能需要更长的时间来编写和调试。

## GraphQL vs REST

GraphQL 和 REST 之间的差异在于它们如何描述 API 和如何处理数据。

RESTful API 指定了资源和操作，并使用 HTTP 方法对资源进行操作。GraphQL API 允许客户端指定其需要的数据，服务器根据查询声明返回特定的数据。

RESTful API 擅长处理简单的请求和响应，例如读取和写入单个资源。GraphQL 更适合处理复杂的数据结构和关系，例如连接多个资源并按需获取数据。

在选择 RESTful API 还是 GraphQL API 时，需要考虑应用程序的需求和复杂性。如果应用程序需要获取大量数据或涉及多个资源和关系，则可能需要考虑使用 GraphQL。如果应用程序的需求较为简单，则 RESTful API 可能更适合。

### 资源获取

REST 的核心思想是资源。每个资源都由一个 URL 标识，可以通过 GET 向该 URL 发送请求来检索该资源。

```json
// GET /books/1 

{
  "title": "朝花夕拾",
  "author": { 
    "name": "鲁迅",
    "id": "1"
  }
  // ... more fields here
}
```

在上面的示例中，REST API 会将 “author” 作为单独的资源返回。

在 REST 中需要注意的一件事是资源的类型或形状与获取该资源的方式是耦合的, GraphQL 在这方面有很大的不同，因为在 GraphQL 中这两个概念是完全分开的。正常情况下, 应该会有以下两种实体类型:

```typescript
type Book {
  id: ID,
  title: String,
  published: Date,
  price: String,
  author: Author
}

type Author {
  id: ID,
  name: String,
  books: [Book]
}
```

请注意，现在我们已经描述了可用数据的种类，但此描述并未告诉我们有关如何从客户端获取这些对象的任何信息。这是 REST 和 GraphQL 之间的一个核心区别——特定资源的描述与检索它的方式无关。

为了能够实际访问特定的书籍或作者，我们需要 Query 在我们的模式中创建一个类型：

```typescript
type Query {
  book(id: ID!): Book,
  author(id: ID!): Author
}
```

现在，我们可以发送一个类似于上面 REST 请求的请求，但这次使用 GraphQL：

```typescript
// GET /graphql?query={ book(id: "1") { title, author { name } } }

{
 "title": "朝花夕拾",
  "author": { 
    "name": "鲁迅",
  }
}
```

我们可以立即看到关于 GraphQL 的一些与 REST 截然不同的事情，即使两者都可以通过 URL 请求，并且都可以返回相同形状的 JSON 响应。

首先，我们可以看到带有 GraphQL 查询的 URL 指定了我们要请求的资源以及我们关心的字段。此外，不是服务器作者为我们决定是否 author 需要包含相关资源，而是 API 的使用者来决定。

但最重要的是，资源的身份、书籍和作者的概念与获取它们的方式无关。我们可能会通过许多不同类型的查询和不同的字段集来检索同一本书。

### 结论

我们已经确定了一些相同点和不同点：

1. 两者都有资源的概念，并且可以为这些资源指定ID。
2. 两者都可以通过带有 URL 的 HTTP GET 请求获取。
3. 都可以在请求中返回JSON数据。
4. 在 REST 中，调用的端点是该对象的标识。在 GraphQL 中，身份与获取它的方式是分开的。
5. 在 REST 中，资源的形状和大小由服务器决定。在 GraphQL 中，服务器声明可用的资源，然后客户端询问它当时需要什么。

## URL 路由与 GraphQL 架构

如果 API 不可预测，它就没有用。当我们使用 API 时，通常将它作为某个程序的一部分来执行，该程序需要知道它可以调用什么以及它应该期望收到什么结果，以便它可以对该结果进行操作。

因此，API 最重要的部分之一是对可以访问的内容的描述。这就是在阅读 API 文档时正在学习的内容，并且使用 GraphQL 内省和 REST API 模式系统（如 Swagger），可以通过编程方式检查此信息。

在今天的 REST API 中，API 通常被描述为端点列表：

```typescript
GET /books/:id
GET /author/:id
GET /books/:id/comment
POST /books/:id/comment
```

所以可以说 API 的结构是线性的——有一个你可以访问的列表。当我们在检索数据或保存某些内容时，要问的第一个问题是“我应该调用哪个端点”？

如上所述，在 GraphQL 中，不使用 URL 来识别 API 中可用的内容。

GraphQL 模式：

```typescript
type Query {
  book(id: ID!): Book
  author(id: ID!): Author
}

type Mutation {
  addComment(input: AddCommentInput): Comment
}

type Book { ... }
type Author { ... }
type Comment { ... }
input AddCommentInput { ... }
```

与类似数据集的 REST 路由相比，这里有一些有趣的地方。首先，GraphQL 没有向同一个 URL 发送不同的 HTTP 动词来区分读取和写入，而是使用了不同的 初始类型 ——Mutation 与 Query。在 GraphQL 文档中，可以使用关键字选择要发送的操作类型：

```typescript
query { ... }
mutation { ... }
```

可以看到类型上的字段 Query 与我们上面的 REST 路由非常匹配。这是因为这种特殊类型是我们数据的入口点，所以这是 GraphQL 中与端点 URL 最等价的概念。

从 GraphQL API 获取初始资源的方式与 REST 非常相似——你传递一个名称和一些参数——但主要区别在于你可以从那里去哪里。

在 GraphQL 中，我们可以发送一个复杂的查询，根据模式中定义的关系获取额外的数据，但在 REST 中，便必须通过多个请求来完成，将相关数据构建到初始响应中，或者在用于修改响应的 URL。

### 总结

在 REST 中，可访问数据的空间被描述为端点的线性列表，而在 GraphQL 中，它是一个具有关系的模式。

1. REST API 中的端点列表类似于 GraphQL API 中的 字段列表 Query 和 类型。Mutation它们都是数据的入口点。
2. 两者都有办法区分 API 请求是读取数据还是写入数据。
3. 在 GraphQL 中，您可以在单个请求中按照模式中定义的关系从入口点遍历到相关数据。在 REST 中，您必须调用多个端点来获取相关资源。
4. 在 GraphQL 中，类型上的字段与任何其他类型上的字段之间没有区别 Query ，只是在查询的根部只能访问查询类型。例如，您可以在查询的任何字段中使用参数。在 REST 中，没有嵌套 URL 的一流概念。
5. GET在 REST 中，您通过将 HTTP 动词从 更改 为其他内容来  指定写入 POST。在 GraphQL 中，您可以更改查询中的关键字。

由于上述相似性列表中的第一点，人们通常开始将类型上的字段 Query 称为 GraphQL“端点”或“查询”。虽然这是一个合理的比较，但它可能会导致一种误导性的看法，即 Query 类型的工作方式与其他类型有很大不同，但事实并非如此。

## 路由处理程序与解析器

那么当实际调用 API 时会发生什么？通常它会在收到请求的服务器上执行一些代码。该代码可能会执行计算、从数据库加载数据、调用不同的 API 或真正执行任何操作。
整个想法是你不需要从外面知道它在做什么。但是 REST 和 GraphQL 都有非常标准的方法来实现该 API 的内部，比较它们以了解这些技术的不同之处很有用。

让我们看一个使用 express 的 hello world 示例，express 是一个流行的 Node API 库：

```typescript
app.get('/hello', function (req, res) {
  res.send('Hello World!')
})
```

在这里可以看到我们创建了一个 `/hello` 返回字符串的端点 'Hello World!'。从此示例中，我们可以看到 REST API 服务器中 HTTP 请求的生命周期：

1. 服务器接收请求并检索 HTTP 谓词（GET 在本例中）和 URL 路径
2. API 库将动词和路径与服务器代码注册的函数相匹配
3. 该函数执行一次，并返回一个结果
4. API 库序列化结果，添加适当的响应代码和标头，并将其发送回客户端

GraphQL 的工作方式非常相似，对于同一个 hello world 示例， 它实际上是相同的：

```typescript
const resolvers = {
  Query: {
    hello: () => {
      return 'Hello world!';
    },
  },
};
```

如您所见，我们没有为特定的 URL 提供函数，而是提供了一个匹配类型上特定字段的函数，在本例中为 类型 `hello` 上的字段 `Query` 。在 GraphQL 中，这个实现字段的函数称为 **解析器**。

要发出请求，我们需要一个查询：

```typescript
query {
  hello
}
```

所以当我们的服务器收到 GraphQL 请求时会发生以下情况：

1. 服务器接收请求，并检索 GraphQL 查询
2. 遍历查询，并为每个字段调用适当的解析器。在这种情况下，只有一个字段 ， `hello` 它在 `Query` 类型上
3. 函数被调用，并返回结果
4. GraphQL 库和服务器将该结果附加到与查询形状匹配的响应

所以将得到以下返回值:

```json
{ "hello": "Hello, world!" }
```

但这里有一个技巧，我们实际上可以调用该字段两次！

```typescript
query {
  hello
  secondHello: hello
}
```

在这种情况下，发生与上面相同的生命周期，但由于我们使用别名两次请求相同的字段，解析器 hello 实际上被调用了 两次。这显然是一个人为的例子，但重点是可以在一个请求中执行多个字段，并且可以在查询的不同点多次调用同一个字段。

如果没有“嵌套”解析器的示例，这将是不完整的：

```typescript
{
  Query: {
    author: (root, { id }) => find(authors, { id: id }),
  },
  Author: {
    posts: (author) => filter(posts, { authorId: author.id }),
  },
}
```

这些解析器将能够完成如下查询：

```typescript
query {
  author(id: 1) {
    name
    posts {
      title
    }
  }
}
```

因此，即使解析器集实际上是扁平的，因为它们附加到各种类型，也可以将它们构建到嵌套查询中。

### 结论

归根结底，REST 和 GraphQL API 都只是通过网络调用函数的奇特方式。如果熟悉构建 REST API，那么实现 GraphQL API 不会有太大不同。但是 GraphQL 有很大的优势，因为它允许调用多个相关函数而无需多次往返。

1. REST 中的端点和 GraphQL 中的字段最终都会调用服务器上的函数。
2. REST 和 GraphQL 通常都依赖框架和库来处理具体的网络样板。
3. 在 REST 中，每个请求通常只调用一个路由处理函数。在 GraphQL 中，一个查询可以调用多个解析器来构建具有多个资源的嵌套响应。
4. 在 REST 中，您自己构造响应的形状。在 GraphQL 中，响应的形状由 GraphQL 执行库构建以匹配查询的形状。
5.

从本质上讲，我们可以将 GraphQL 视为一个在一个请求中调用许多嵌套端点的系统。几乎就像一个多路复用的 REST。
