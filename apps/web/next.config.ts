import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@studyhub/config'],
  allowedDevOrigins: ['172.30.86.248'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
};

export default nextConfig;
