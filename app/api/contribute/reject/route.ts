import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const contributionId = body.id; // ID of the contribution seen by the user
        const validatorId = body.validatorId;

        // Start a transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Check if the user has already validated this contribution
            const user = await prisma.user.findUnique({
                where: { id: validatorId },
                select: { validationEntries: true },
            });

            if (user && !user.validationEntries.includes(contributionId)) {
                // User has not validated this contribution yet
                const validationCountUpdate = body.validation - 1;
                const isDiscarded = validationCountUpdate <= -2;

                // Update user validation entries and score
                const updatedUser = await prisma.user.update({
                    where: { id: validatorId },
                    data: {
                        score: { increment: 3 },
                        lastContribution: new Date(),
                        validationEntries: { push: contributionId },
                    },
                });

                // Update contribution validation count and discard status
                const updatedEntry = await prisma.contribution.update({
                    where: { id: contributionId },
                    data: {
                        validation: validationCountUpdate,
                        isDiscarded,
                    },
                });
                // Return both updated user and entry for the response
                return { updatedUser, updatedEntry };
            } else {
                // If user already validated this entry, return null or user data to indicate no update
                return { user };
            }
        });
        // Check the result to determine the appropriate response
        if (result.user) {
            // User had already validated this contribution, or no update was made
            return new NextResponse(JSON.stringify({ user: result.user }), {
                status: 406,
                headers: { 'Content-Type': 'application/json' },
                statusText: 'Already validated this entry',
            });
        } else {
            // Successful transaction with updates
            return new NextResponse(JSON.stringify(result), {
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error(error);
        return new NextResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
