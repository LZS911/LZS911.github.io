import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com']
  }
};

if (process.env.NODE_ENV === 'production') {
  if (process.env.GITHUB_ACTION) {
    nextConfig.pageExtensions = ['jsx', 'tsx'];
    nextConfig.output = 'export';
  }
}

export default nextConfig;
