import path from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // @ts-ignore - Turbopack root configuration
    turbopack: {
        root: path.resolve(process.cwd(), '..'),
    },
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
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
