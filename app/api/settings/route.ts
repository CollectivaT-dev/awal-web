import getCurrentUser from '@/app/actions/get/getCurrentUser';
import PostAmazicLanguage from '@/app/actions/post/postAmazicLanguage';
import PostOtherLanguages from '@/app/actions/post/postOtherLanguages';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function PATCH(req: Request) {
	console.log(req)
    try {
        const body = await req.json();
        console.log(body.userId);
		console.log(body)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username: body.username }, { email: body.email }],
                NOT: { id: body.userId },
            },
        });
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
                isPrivacy: body.isPrivacy ? body.isPrivacy : true,
            },
        });
        console.log(user);
        // const centralResult = await PostAmazicLanguage(
        //     body.userId,
        //     body.central,
        //     'central',
        // );
        // const tachelhitResult = await PostAmazicLanguage(
        //     body.userId,
        //     body.tachelhit,
        //     'tachelhit',
        // );
        // const tarifitResult = await PostAmazicLanguage(
        //     body.userId,
        //     body.tarifit,
        //     'tarifit',
        // );
        // const otherLanguages = await PostOtherLanguages(
        //     body.userId,
        //     body.otherLanguages,
        // );
        return NextResponse.json({
            user,
            // centralResult,
            // tarifitResult,
            // tachelhitResult,
            // otherLanguages,
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

export async function GET(_req: Request) {
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
        include: {
            language: true,
            tachelhit: true,
            tarifit: true,
            central: true,
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
