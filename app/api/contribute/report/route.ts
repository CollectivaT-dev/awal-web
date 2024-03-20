import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, res: Response) {
    try {
        const body = await req.json();
        const validationCount = body.validation - 2;
        const isDiscarded = validationCount <= -2;
         // console.log(body);
        const contributionId = body.id; // ID of the contribution seen by the user
        const user = await prisma.user.findUnique({
            where: { id: body.validatorId },
            select: {
                reportedEntries: true,
            },
        });
         // console.log(user);
        // check if the entry is already in the reportedEntries string[], in this case, if the user report this sentence, it will not show again
        if (!user?.reportedEntries.includes(contributionId)) {
            const updatedUser = await prisma.user.update({
                where: { id: body.validatorId },
                data: {
                    lastContribution: new Date(),
                    reportedEntries: {
                        push: contributionId, // Append the contribution ID to the seenContributions array
                    },
                },
            });
             // console.log(updatedUser);
            const updatedEntry = await prisma.contribution.updateMany({
                where: { id: body.id },
                data: {
                    reportMsg: body.reportMsg,
                    isReported: true,
                    validation: validationCount,
                    isDiscarded,
                },
            });
             // console.log(updatedEntry);
             // console.log(updatedUser);
            return new NextResponse(
                JSON.stringify({ ...updatedUser, updatedEntry }),
                {},
            );
        } else {
            // If the contributionId is already reported, just return the user data without updating
             // console.log(user);
            return new NextResponse(JSON.stringify({ user }), {
                status: 406,
                statusText: 'already reported',
            });
        }
    } catch (error) {
        return new NextResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
}
