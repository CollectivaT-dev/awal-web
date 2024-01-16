import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, res: Response) {
    try {
        const body = await req.json();
        const validationCount = body.validation - 1;
        const isValidated = validationCount <= -2;
        console.log(body);
        const contributionId = body.id; // ID of the contribution seen by the user
        const user = await prisma.user.findUnique({
            where: { id: body.validatorId },
            select: {
                validationEntries: true,
            },
        });
        console.log(user);
        // check if the entry is already in the string[]
        if (!user?.validationEntries.includes(contributionId)) {
            const updatedUser = await prisma.user.update({
                where: { id: body.validatorId },
                data: {
                    score: { increment: 1 },
                    lastContribution: new Date(),
                    validationEntries: {
                        push: contributionId, // Append the contribution ID to the seenContributions array
                    },
                },
            });
            console.log(updatedUser);
            const updatedEntry = await prisma.contribution.updateMany({
                where: { id: body.id },
                data: {
                    validation: validationCount,
                    isValidated,
                },
            });
            console.log(updatedEntry);
            console.log(updatedUser);
            return new NextResponse(
                JSON.stringify({ ...updatedUser, updatedEntry }),
                {},
            );
        } else {
            // If the contributionId is already present, just return the user data without updating
            console.log(user);
            return new NextResponse(JSON.stringify({ user }), {
                status: 406,
                statusText: 'already validated this entry',
            });
        }
    } catch (error) {
        return new NextResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
}
