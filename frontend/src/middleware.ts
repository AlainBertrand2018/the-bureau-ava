import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    return NextResponse.next();
}

// Ensure static files at /public/ root bypass all middleware to avoid Vercel permissions errors
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|llms-full.txt).*)'],
};
