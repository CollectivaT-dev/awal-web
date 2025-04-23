'use server';
import { SendEmail } from '@/app/actions/emails/SendEmail';
import ResetPassword from '@/app/components/Emails/ResetPassword';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    const userId = await req.json();
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                email: true,
            },
        });
        if (user) {
            const resetPasswordToken = crypto.randomBytes(32).toString('base64url');

            try {
                await SendEmail({
                    from: 'Awal Email Verification<do-not-reply@awaldigital.org>',
                    to: [user.email],
                    subject: 'Verify your email address',
                    react: ResetPassword({
                        email: user.email!,
                        resetPasswordToken,
                    }) as React.ReactElement,
                });
                await prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        resetPasswordToken,
                    },
                    // ! for dev purpose
                    // select: {
                    //     email: true,
                    //     emailVerificationToken: true,
                    // },
                });
                //console.log(updatedUser)
            } catch (error) {
                // console.log(error);
                return new NextResponse(
                    JSON.stringify({
                        message: 'Failed to send verification email',
                    }),
                    {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );
            }
            return new NextResponse(JSON.stringify(user), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new NextResponse(JSON.stringify(user), {
            status: 200,
        });
    } catch (error) {
        // console.log(error);
        return error;
    }
}
export async function PATCH(req: Request) {
    const { token: resetPasswordToken, password } = await req.json();

    if (!resetPasswordToken || typeof resetPasswordToken !== 'string') {
        return NextResponse.json({ message: 'Missing token' }, { status: 400 });
    }
    // token validation to prevent multiple password reset
    const validToken = await prisma.user.findUnique({
        where: {
            resetPasswordToken,
        },
        select: {
            resetPasswordTokenExpiration: true,
        },
    });

    if (!validToken) {
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 404 });
    }
    // check for expired token
    const now = new Date();
    if (validToken?.resetPasswordTokenExpiration && validToken.resetPasswordTokenExpiration < now) {
        return NextResponse.json({ message: 'Token expired' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
        where: {
            resetPasswordToken,
        },
    });

    if (!user) {
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 404 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashed,
            resetPasswordToken: undefined,
            resetPasswordTokenExpiration: undefined,
        },
    });

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
}
