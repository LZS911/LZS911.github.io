---
title: Next.js 学习记录
layout: post
date: '2022-09-28'
image:
headerImage: false
tag:
  - next.js
  - react
star: true
category: blog
author: LZS_911
description: blog
excerpt: ''
coverImage: '/assets/blog/image/cover.jpg'
ogImage:
  url: '/assets/blog/image/cover.jpg'
theme: condensed-night-purple
---

`Next.js` 是一个 `React` 应用框架, 使用它可以快速上手开发 `React` 应用. `React` 作为一个用来构建 `UI` 的库, 对于开发一个完整的 `React` 应用是远远不够的.我们还需要构建、打包和运行等开发工具, 比如使用 `Babel` 转换使用了新特性的 `JavaScript` 代码、处理 `SASS` 和 `LESS` 样式文件等.开发功能时, 除了构建界面, 还需要处理页面路由、获取服务端数据、管理应用状态等.为了让应用对搜索引擎友好, 最好支持服务端渲染.如果自己从零去安装配置各种开发工具, 需要花费许多时间和精力, 因此 `React` 官方提供了 `Create React App`（简称 `CRA` ）工具来降低上手开发 `React` 应用的门槛. `Next.js` 可以看作是 `CRA` 的升级版.

### 初始化 Next.js APP

进入项目文件夹后执行:

`npx create-next-app Next.js-blog --use-npm --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"`

关于 `npx`: <https://medium.com/itsems-frontend/whats-npx-e83400efe7f8>

`--example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"` 指定链接地址作为初始化项目的模板

### 项目目录结构

1. `pages`(必需):`pages` 目录是 `Next.js` 中最重要的一个目录, 这个目录的每一个文件都会对应到每一个页面, 可以根据地址栏的路由进行跳转.若 `pages` 下的 `js` 文件在一个目录下, 那么 `Next.js` 默认会将这个目录也当作路由的路径.
2. `components`(非必需): `components` 目录存放的是一些公用的组件, 这些代码不能放在 `pages` 下, 不然的话就会以页面的形式进行导出.
3. `lib`(非必需):`lib` 目录存放一些工具方法, 比如 `util` 等等.
4. `static`(非必需):`static` 目录存放一些静态资源文件.

### 默认文件

`index.js`: `Next.js` 的 `pages` 下默认入口文件, 这个文件会对应浏览器地址栏为根路径的那个页面.

### 内置组件

1. `Link`: 网页中两个页面之间的跳转一般使用 `a` 标签. 在 `Next.js` 中, 可以使用 `Link` 组件 `next/link` 在应用程序中的页面之间进行链接. `Link` 允许进行客户端导航并接受一些属性.

   ```JavaScript
   //index.js
   import Link from 'next/link';


   // href="/posts/first-post" : 跳转至 pages 目录下的 posts/first-post.js
   <h1 className="title">
     Read <Link href="/posts/first-post">this page!</Link>
   </h1>
   ```

   在 pages 目录下新建 posts/first-post.js

   ```JavaScript
   //posts/first-post.js
   import Link from 'next/link';

   export default function FirstPost() {
     return (
       <>
         <h1>First Post</h1>
         <h2>
           <Link href="/">Back to home</Link>
         </h2>
       </>
     );
   }
   ```

2. `Image`: 提供对图片资源自动进行优化的功能.

   使用常规 HTML 添加个人资料图片如下所示:

   ```HTML
     <img src="/images/profile.jpg" alt="Your Name" />
   ```

   这种情况下必须手动处理:

   - 确保您的图像在不同的屏幕尺寸上响应
   - 使用第三方工具或库优化您的图像
   - 仅在图像进入视口时加载图像

   使用图像组件

   ```JavaScript
   import Image from 'next/image';

   const YourComponent = () => (
     <Image
       src="/images/profile.jpg" // Route of the image file
       height={144} // Desired size with correct aspect ratio
       width={144} // Desired size with correct aspect ratio
       alt="Your Name"
     />
   );
   ```

   `Next.js` 不是在构建时优化图像, 而是在用户请求时按需优化图像.与静态站点生成器和纯静态解决方案不同, 构建时间不会增加, 无论是发送 10 个图像还是 1000 万个图像.

   默认情况下, 图像是延迟加载的.这意味着您的页面速度不会因视口之外的图像而受到惩罚.图像在滚动到视口时加载.

3. `Head`: 代替 `Html5` 中的 `<head>` 标签

   ```Html
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
   ```

### 关于 CSS

1. `css` 模块. `css` 模块允许通过自动创建唯一的类名来在组件级别本地限定 `css`. 这允许您在不同的文件中使用相同的 `css` 类名, 而不必担心类名冲突

   `utils.module.cs`

   ````css
   .maxW100{
     max-width:100rem;
   }
   ``
   pages/index.j
   ```jsx
   import utilStyles from "../styles/utils.module.css";

   <div className={utilStyles.maxW100}>test style</div>
   ``

   ````

2. 通过其他方式来设置 `Next.js` 应用程序的样式
   - `SASS`
   - `PostCss` 库, 例如 [TailwindCss](https://tailwindcss.com/docs/installation)
   - `CSS-in-JS` 库, 例如 [styled-jsx](https://nextjs.org/blog/styling-next-with-styled-jsx)、[styled-components](https://styled-components.com/) 和 [Emotion](<https://github.com/emotion-js/emotion>
3. 添加全局样式时, 需要创建一个名为 `pages/_app.js` 的文件, 其内容如下

   ```jsx
   import '../styles/global.css';
   export default function App({ Component, pageProps }) {
     return <Component {...pageProps} />;
   }
   ```

   该 `App` 组件是所有不同页面通用的顶级组件.

### 预渲染与数据获取

1. `Next.js` 的预渲染功能

   - 什么是预渲染

     默认情况下, `Next.js` 预渲染每个页面.这意味着 `Next.js` 会提前为每个页面生成 `HTML`, 而不是全部由客户端 `JavaScript` 完成.预渲染可以带来更好的性能和 [SEO](https://zh.wikipedia.org/wiki/%E6%90%9C%E5%B0%8B%E5%BC%95%E6%93%8E%E6%9C%80%E4%BD%B3%E5%8C%96).

     每个生成的 HTML 都与该页面所需的最少 `JavaScript` 代码相关联.当浏览器加载页面时, 其 `JavaScript` 代码将运行并使页面完全交互.(这个过程称为水合作用.)

   - 两种形式的预渲染

     1. `SSR`: 服务器端渲染是在每个请求上生成 `HTML` 的预渲染方法.
     2. `SSG`: 静态生成是在构建时生成 `HTML` 的预渲染方法.然后在每个请求上重用预呈现的 HTML

   - `SSG`: 静态生成
     `Next.js` 提供了 `getStaticProps` 这样一个方法, 将其定义在需要获取数据的页面组件中, 并将其导出.
     两个注意点:

     1. `dev` 环境中, `getStaticProps` 会在每一个请求上运行, `product` 环境会在构建时运行
     2. 在函数内部可以获取外部的数据并将其以 `props` 的形式传递至组件中

     ```jsx
     const Home = (props) => { ... }
     export const getStaticProps = async () => {
       const data = [];

       return {
         props: data
       }
     }
     export default Home
     ```

   - `SSR`: 服务端渲染
     如果需要在请求时而不是构建时获取数据, 可以使用服务端渲染. `Next.js` 同样提供了一个名为 `getServerSideProps` 的函数.

     ```JavaScript
     export const getServerSideProps = (context) => {
       return {
         props:{}
       }
     }
     ```

     因为 `getServerSideProps` 是在请求时调用的, 所以它的参数 `context` 包含了请求特定的参数.
