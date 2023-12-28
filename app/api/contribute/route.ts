import prisma from '@/lib/prisma';
import { NextApiRequest } from 'next';
import { redirect } from 'next/navigation';

import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest) {

	try {
        const { src, tgt } = req.query; // Accessing parameters from the query
        if (!src || !tgt) {
            return new NextResponse(null, { status: 400, statusText: "Missing required query parameters" });
        }
        // Rest of the code remains the same
    } catch (error) {
        console.log(error);
        return new NextResponse(null, { status: 500, statusText: "Internal Server Error" });
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
        if (body.src === body.tgt) {
        }
        // update contribution score
        const updatedUserScore = await prisma.user.updateMany({
            where: {
                id: body.userId,
            },
            data: {
                score: updatedScore,
            },
        });
        // check if languages are zgh or zgh-ber
        let srcVar =
            body.src === 'ber' || body.src === 'zgh' ? body.srcVar : null;
        let tgtVar =
            body.tgt === 'ber' || body.tgt === 'zgh' ? body.tgtVar : null;

        // create contribution entry
        const contribution = await prisma.contribution.create({
            data: {
                username: existingUser.username,
                userId: body.userId,
                src: body.src,
                tgt: body.tgt,
                src_text: body.src_text,
                tgt_text: body.tgt_text,
                srcVar,
                tgtVar,
            
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
	
}