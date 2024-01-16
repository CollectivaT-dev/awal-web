import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// vercel deployment, for ISR cache
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
    try {
        const totalEntries = await prisma.contribution.count();
        const topTen = await prisma.user.findMany({
            take: 10, // Limit the result to top 10
            orderBy: { score: 'desc' },
            select: { id: true, username: true, score: true },
        });
        console.log(topTen);
        // Send the response with both totalEntries and topTen as JSON
        return new NextResponse(
            JSON.stringify({ topTen: topTen, totalEntries }),
            {
                status: 200,
            },
        );
    } catch (error) {
        console.log('Failed to get data:', error.message);
        // Send an error response
        return new NextResponse(
            JSON.stringify({ error: 'Failed to get data' }),
            { status: 500 },
        );
    }
}
