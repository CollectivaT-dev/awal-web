import getCurrentUser from '@/app/actions/get/getCurrentUser';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { patchQuery } from './query';

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: body.username.toLowerCase().replace(/\s/g, ''),
                    },
                    { email: body.email.toLowerCase() },
                ],
                NOT: { id: body.userId },
            },
        });

        if (existingUser) {
            return new NextResponse(JSON.stringify({ error: 'username and email error' }), {
                status: 406,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        //Validation checks for central, tachelhit, and tarifit
        if (
            (body.central?.isChecked && (body.central.oral === 0 || body.central.written_lat === 0 || body.central.tarifit === 0)) ||
            (body.tachelhit?.isChecked && (body.tachelhit.oral === 0 || body.tachelhit.written_lat === 0 || body.tachelhit.tarifit === 0)) ||
            (body.tarifit?.isChecked && (body.tarifit.oral === 0 || body.tarifit.written_lat === 0 || body.tarifit.written_tif === 0))
        ) {
            return new NextResponse(JSON.stringify({ error: 'variation selection error' }), {
                status: 406,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        if (body.other?.isChecked && body.other.body.length === 0) {
            return new NextResponse(JSON.stringify({ error: 'Non Empty String' }), {
                status: 406,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const user = await prisma.user.updateMany(patchQuery(body));

        return NextResponse.json({
            user,
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function GET(req: Request) {
    const currentUser = await getCurrentUser();
console.log(currentUser)
    if (!currentUser) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    const user = await prisma.user.findUnique({
        where: {
            id: currentUser.id,
        },
    });
console.log(user)
    return new NextResponse(JSON.stringify(user), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
