import type { NextConfig } from 'next';
type ImageConfig = {
    remotePatterns: {
        protocol: 'http' | 'https';
        hostname: string;
        port?: string;
        pathname: string;
    }[];
};

const imageConfig: ImageConfig = {
    remotePatterns: [
        {
            protocol: 'https' as const,
            hostname: 's2.coinmarketcap.com' as const,
            port: '' as const,
            pathname: '/static/img/coins/**' as const,
        },
    ],
};

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: imageConfig,
    sassOptions: {
        includePaths: ['./src/styles'],
    },
};

export default nextConfig;
