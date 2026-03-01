import path from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // @ts-ignore - Turbopack root configuration
    turbopack: {
        root: path.resolve(process.cwd(), '..'),
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
        reactRemoveProperties: process.env.NODE_ENV === 'production',
    },
    compress: true,
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1:8000/:path*',
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/FAQ',
                destination: '/faq',
                permanent: true,
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'flagcdn.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
