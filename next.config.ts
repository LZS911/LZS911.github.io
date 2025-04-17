import type { NextConfig } from 'next';
console.log(process.env.GITHUB_ACTION);

const nextConfig: NextConfig = {
  reactStrictMode: true
};

if (process.env.NODE_ENV === 'production') {
  if (process.env.GITHUB_ACTION) {
    nextConfig.pageExtensions = ['jsx', 'tsx'];
    nextConfig.output = 'export';
  }
}

export default nextConfig;
