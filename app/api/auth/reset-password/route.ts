import prisma from '@/lib/prisma';
import { time } from 'console';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log(body);
    const currentTimer = new Date();
    try {
        const token = body.token ?? '';
        const requestedUser = await prisma.user.findUnique({
            where: {
                resetPasswordToken: token,
            },
            select: {
                id: true,
                resetPasswordTokenExpiration: true,
            },
        });
        if (!requestedUser) {
            return new NextResponse(
                JSON.stringify({
                    message: 'Invalid Token',
                }),
                {
                    status: 406,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }
        if (
            currentTimer.getTime() >
            requestedUser?.resetPasswordTokenExpiration!.getTime()
        ) {
            return new NextResponse(
                JSON.stringify({
                    message: 'Token Expired',
                }),
                {
                    status: 406,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }
        return new NextResponse(JSON.stringify({ ...requestedUser, token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: 'Internal Server Error',
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const currentTime = new Date();
    console.log(body);
    try {
        const user = await prisma.user.findUnique({
            where: {
                resetPasswordToken: body.token,
            },
            select: {
                id: true,
                resetPasswordToken: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return new NextResponse(
                JSON.stringify({
                    message: 'no user found with this token',
                }),
                {
                    status: 405,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }
        if (body.data.password !== body.data.confirmPassword) {
            return new NextResponse(
                JSON.stringify({
                    message: 'Passwords do not match',
                }),
                {
                    status: 406,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }
        const hashedPassword = bcrypt.hashSync(body.data.password, 10);
        const updatedToken =
            crypto.randomBytes(32).toString('base64url') + 'updated';
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
                resetPasswordToken: updatedToken,
                updatedAt: currentTime,
            },
        });
        const updatedUserWithoutPassword = { hashedPassword, ...updatedUser };
        return new NextResponse(JSON.stringify(updatedUserWithoutPassword), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: 'Internal Server Error',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
    }
}
