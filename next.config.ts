import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: process.env.GITHUB_ACTION ? 'export' : undefined,
  images: {
    unoptimized: true
  },
  reactStrictMode: true
};

export default nextConfig;
