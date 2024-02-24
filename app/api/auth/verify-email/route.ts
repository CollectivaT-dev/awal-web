'use server';
import { SendEmail } from '@/app/actions/emails/SendEmail';
import EmailVerification from '@/app/components/Emails/EmailVerification';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { STATUS_CODES } from 'http';

export async function POST(req: Request) {
    const userId = await req.json();
    // console.log(userId);
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                email: true,
                isVerified: true,
            },
        });
        console.log(user);
        if (user?.isVerified === false || user?.isVerified === null) {
            const emailVerificationToken = crypto
                .randomBytes(32)
                .toString('base64');

            try {
                await SendEmail({
                    from: 'Awal Email Verification<do-not-reply@awaldigital.org>',
                    //! need to change
                    to: [user.email],
                    subject: 'Verify your email address',
                    react: EmailVerification({
                        email: user.email!,
                        emailVerificationToken,
                    }) as React.ReactElement,
                });
                const updatedUser = await prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        emailVerificationToken,
                    },
                    // ! for dev purpose
                    // select: {
                    //     email: true,
                    //     emailVerificationToken: true,
                    // },
                });
                // console.log(updatedUser)
            } catch (error) {
                console.log(error);
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
        console.log(error);
        return error;
    }
}
export async function PATCH(req: Request) {
    const { token: emailVerificationToken } = await req.json();
    console.log(emailVerificationToken);

    const user = await prisma.user.findUnique({
        where: {
            emailVerificationToken,
        },
    });
    if (!user) {
        return new NextResponse(
            JSON.stringify({
                message: 'Invalid token',
            }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }
    console.log(user);
    if (!user) {
    return new NextResponse(
 JSON.stringyify(
{message:"token doesn't match anything"}
),{status:406,headers:{'Content-Type':'application/json'}
})}

    const updatedUser = await prisma.user.update({
        where: {
            emailVerificationToken,
        },
        data: {
            isVerified: true,
            emailVerificationToken: `${emailVerificationToken}_verified`,
        },
    });
    

    return new NextResponse(JSON.stringify(updatedUser), {
        status:200,header:{"Content-Type":"application/json " }
    });
}
