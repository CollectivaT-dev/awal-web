import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
interface ReqBodyProps {
    username: string;
    email: string;
    password: string;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(body);
        // Check if username already exists
        const existingUsernameUser = await prisma.user.findUnique({
            where: { username: body.username },
        });

        if (existingUsernameUser) {
            return new NextResponse(
                JSON.stringify({ error: 'Username already in use' }),
                {
                    status: 409,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }
        const existingEmailUser = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (existingEmailUser) {
            return new NextResponse(
                JSON.stringify({ error: 'Email already in use' }),
                {
                    status: 409,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }

        console.log(existingUsernameUser, existingEmailUser);
        const user = await prisma.user.create({
            data: {
                username: body.username,
                email: body.email,
                password: await bcrypt.hash(body.password, 10),
                isPrivacy: body.isPrivacy,
                isSubscribed: body.isSubscribed,
                score: 0,
                gender: 'other',
            },
        });
        console.log(user);
        console.log(user);

        const { password, ...userWithoutPassword } = user;

        return new NextResponse(JSON.stringify(userWithoutPassword), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(null, { status: 500 });
    }
}
