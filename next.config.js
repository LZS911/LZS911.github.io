/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  // 添加basePath配置，确保在GitHub Pages上正确加载资源
  basePath: '',
  // 添加assetPrefix配置，确保在GitHub Pages上正确加载静态资源
  assetPrefix: '',
  // 配置rewrites，处理API请求
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
