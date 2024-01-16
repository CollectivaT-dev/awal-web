import getCurrentUser from '@/app/actions/get/getCurrentUser';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

import { NextResponse } from 'next/server';
import { parse } from 'url';

export async function GET(req: Request, res: Response) {
    try {
        const { query } = parse(req.url, true);
        console.log(query);
        const src = Array.isArray(query.src) ? query.src[0] : query.src;
        const tgt = Array.isArray(query.tgt) ? query.tgt[0] : query.tgt;
        const src_var = Array.isArray(query.src_var)
            ? query.src_var[0]
            : query.src_var || null;
        const tgt_var = Array.isArray(query.tgt_var)
            ? query.tgt_var[0]
            : query.tgt_var || null;
        console.log(src_var);
        console.log(tgt_var);
        const session = await getCurrentUser();
        console.log(session);
        console.log(src);
        console.log(tgt);
        if (!src || !tgt) {
            return new NextResponse(null, {
                status: 400,
                statusText: 'Language pair not valid',
            });
        }
        const user = await prisma.user.findUnique({
            where: { id: session?.id },
            select: {
                validationEntries: true,
            },
        });
        const randomEntry = await prisma.contribution.findFirst({
            where: {
                src: src,
                tgt: tgt,
                srcVar: src_var,
                tgtVar: tgt_var,
                isValidated: false,
                AND: {
                    id: {
                        notIn: session?.validationEntries,
                    },
                },
            },
        });
        console.log(randomEntry);
        if (!randomEntry) {
            return new NextResponse(null, {
                status: 406,
                statusText: 'No more entries for validation',
            });
        }
        return new NextResponse(JSON.stringify(randomEntry), {
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
}

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        console.log(body);
        const existingUser = await prisma.user.findUnique({
            where: {
                id: body.userId,
            },
        });
        console.log(existingUser);
        if (!existingUser) {
            redirect('/signIn');
        }
        let updatedScore = existingUser.score + body.contributionPoint;
        console.log(updatedScore);
        const updatedUserScore = await prisma.user.updateMany({
            where: {
                id: body.userId,
            },
            data: {
                score: updatedScore,
                lastContribution: new Date(),
            },
        });
        console.log(updatedScore);
        // check if languages are zgh or zgh-ber
        let srcVar =
            body.src === 'ber' || body.src === 'zgh' ? body.srcVar : null;
        let tgtVar =
            body.tgt === 'ber' || body.tgt === 'zgh' ? body.tgtVar : null;

        // create contribution entry
        const contribution = await prisma.contribution.create({
            data: {
                userId: body.userId,
                src: body.src,
                tgt: body.tgt,
                src_text: body.src_text,
                tgt_text: body.tgt_text,
                srcVar,
                tgtVar,
                isValidated: false,
                validation: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        const updatedUser = await prisma.user.findUnique({
            where: {
                id: body.userId,
            },
        });
        console.log(contribution);
        console.log(updatedUser);
        return new NextResponse(JSON.stringify(updatedUser), {});
    } catch (error) {
        return console.log(error);
    }
}

export async function PATCH(req: Request, res: Response) {
    try {
        const body = await req.json();
        console.log(body);
        const contributionId = body.id; // ID of the contribution seen by the user
        const user = await prisma.user.findUnique({
            where: { id: body.validatorId },
            select: {
                validationEntries: true,
            },
        });
        // check if the entry is already in the string[]
        if (!user?.validationEntries.includes(contributionId)) {
            const updatedUser = await prisma.user.update({
                where: { id: body.validatorId },
                data: {
                    validationEntries: {
                        push: contributionId, // Append the contribution ID to the seenContributions array
                    },
                },
            });
            console.log(updatedUser);
            return new NextResponse(JSON.stringify({ updatedUser }), {});
        } else {
            // If the contributionId is already present, just return the user data without updating
            console.log(user);
            return new NextResponse(JSON.stringify({ user }), {});
        }
    } catch (error) {
        return new NextResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
}
