import getCurrentUser from '@/app/actions/get/getCurrentUser';
import PostAmazicLanguage from '@/app/actions/post/postAmazicLanguage';
import PostOtherLanguages from '@/app/actions/post/postOtherLanguages';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function PATCH(req: Request) {
    console.log(req);
    try {
        const body = await req.json();
        console.log(body.userId);
        console.log(body);
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username: body.username }, { email: body.email }],
                NOT: { id: body.userId },
            },
        });
        console.log(existingUser);
        console.log(existingUser);
        if (existingUser) {
            return new NextResponse(
                JSON.stringify({ message: 'Username or email already taken' }),
                {
                    status: 407,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }
        const user = await prisma.user.updateMany({
            where: {
                id: body.userId,
            },
            data: {
                username: body.username,
                email: body.email,
                name: body.name ? body.name : '',
                surname: body.surname ? body.surname : '',
                central: body.central.isChecked ? body.central : null,
                tachelhit: body.tachelhit.isChecked ? body.tachelhit : null,
                tarifit: body.tarifit.isChecked ? body.tarifit : null,
                isPrivacy: body.isPrivacy ? body.isPrivacy : true,
                updatedAt: new Date(),
                isSubscribed: body.isSubscribed ? body.isSubscribed : false,
                age: body.age ? body.age : null,
                gender: body.gender ? body.gender : null,
            },
        });
        console.log({ user });

        return NextResponse.json({
            user,
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ message: 'Internal Server Error' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }
}

export async function GET(req: Request) {
    const currentUser = await getCurrentUser();

    console.log(currentUser);
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
    console.log(user);

    return new NextResponse(JSON.stringify(user), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
