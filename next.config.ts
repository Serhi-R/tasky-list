import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
      },
    sassOptions: {
        includePaths: ['./src/styles'],
    },
};

export default nextConfig;
