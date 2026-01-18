import { NextResponse } from "next/server";
import { prisma } from "@repo/prisma";

export async function GET() {
    const results: any = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        checks: {},
    };

    // 1. Check if DATABASE_URL exists
    results.checks.databaseUrlExists = !!process.env.DATABASE_URL;
    results.checks.databaseUrlFormat = process.env.DATABASE_URL?.startsWith('postgresql://') || process.env.DATABASE_URL?.startsWith('postgres://');

    // Safely show partial connection string (hide password)
    if (process.env.DATABASE_URL) {
        try {
            const url = new URL(process.env.DATABASE_URL);
            results.checks.databaseHost = url.hostname;
            results.checks.databasePort = url.port || '5432';
            results.checks.databaseName = url.pathname.slice(1);
        } catch (e) {
            results.checks.urlParseError = 'Failed to parse DATABASE_URL';
        }
    }

    // 2. Test Prisma Client initialization
    try {
        results.checks.prismaClientExists = !!prisma;
        results.checks.prismaClientType = typeof prisma;
    } catch (error: any) {
        results.checks.prismaClientError = error.message;
    }

    // 3. Test database connection with a simple query
    try {
        await prisma.$connect();
        results.checks.connectionSuccess = true;

        // Try a simple query
        const userCount = await prisma.user.count();
        results.checks.querySuccess = true;
        results.checks.userCount = userCount;

        await prisma.$disconnect();
    } catch (error: any) {
        results.checks.connectionSuccess = false;
        results.checks.connectionError = error.message;
        results.checks.errorCode = error.code;
        results.checks.errorStack = error.stack?.split('\n').slice(0, 5).join('\n');
    }

    // 4. Check Prisma adapter
    try {
        // @ts-expect-error - accessing internal property for debugging
        const adapter = prisma._engineConfig?.adapter;
        results.checks.adapterExists = !!adapter;
        results.checks.adapterType = adapter?.constructor?.name;
    } catch (error: any) {
        results.checks.adapterCheckError = error.message;
    }

    // 5. Environment variables check
    results.checks.envVars = {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
    };

    return NextResponse.json(results, {
        status: results.checks.connectionSuccess ? 200 : 500
    });
}
