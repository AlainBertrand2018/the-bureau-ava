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
        const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
        return [
            {
                source: '/api/:path*',
                destination: `${backendUrl}/:path*`,
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
