import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/lessons/:slug',
        destination: '/lessons/legacy/:slug',
      },
    ];
  },
};

export default nextConfig;
