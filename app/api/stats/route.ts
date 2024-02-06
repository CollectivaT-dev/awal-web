import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// vercel deployment, for ISR cache
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
    try {
        //# data form homepage
        // total entries and validations for homepage
        const totalEntries = await prisma.contribution.count();
        const totalValidation = await prisma.contribution.count({
            where: { isValidated: true, validation: 2 },
        });
        // top ten for homepage
        const topTen = await prisma.user.findMany({
            take: 10, // Limit the result to top 10
            orderBy: { score: 'desc' },
            select: { id: true, username: true, score: true },
            where: {
                email: {
                    not: {
                        contains: 'test',
                    },
                },
                score: {
                    not: {
                        equals: 0,
                    },
                },
            },
        });
        // data for leaderboard page
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = 10; // Fixed number of items per page
        const skip = (page - 1) * limit;
        // Fetch paginated data
        const totalLeaderboardEntries = await prisma.user.count({
            where: {
                email: { not: { contains: 'test' } },
                score: { not: { equals: 0 } },
            },
        });

        const leaderboard = await prisma.user.findMany({
            skip: skip,
            take: limit,
            orderBy: { score: 'desc' },
            select: { id: true, username: true, score: true },
            where: {
                email: {
                    not: {
                        contains: 'test',
                    },
                },
                score: {
                    not: {
                        equals: 0,
                    },
                },
            },
        });
        console.log(topTen);
        console.log(totalValidation);
        // Send the response with topTen, totalEntries, totalValidation and leaderboard
        return new NextResponse(
            JSON.stringify({
                topTen: topTen,
                totalEntries,
                totalValidation,
                leaderboard,
                totalLeaderboardEntries,
            }),
            {
                status: 200,
            },
        );
    } catch (error) {
        // Send an error response
        return new NextResponse(
            JSON.stringify({ error: 'Failed to get data' }),
            { status: 500 },
        );
    }
}
