import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
interface ReqBodyProps {
    email: string;
    password: string;
}

export async function POST(req: Request) {
    const body: ReqBodyProps = await req.json();
	console.log(body)
    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
        },
    });
    // console.log(!user);

    if (!user) {
        return new NextResponse(
            JSON.stringify({ message: 'check your password and email' }),
            {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
    const passwordCheck = await bcrypt.compare(
        body.password,
        user.password as string,
    );
    console.log(passwordCheck);
    if (!passwordCheck) {
        return new NextResponse(
            JSON.stringify({ message: 'check your password and email' }),
            {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    const { password, ...userWithoutPassword } = user;
    return new NextResponse(JSON.stringify(userWithoutPassword), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
