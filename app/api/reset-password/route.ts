import { SendEmail } from '@/app/actions/emails/SendEmail';
import ResetPassword from '@/app/components/Emails/ResetPassword';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
    const body = await request.json();
    console.log(body.email);
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
        console.log(user);

        if (!user) {
            return new NextResponse(
                JSON.stringify({
                    message: null,
                }),
                {
                    status: 406,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const resetPasswordToken = crypto.randomBytes(32).toString('base64url');
        const today = new Date();
        const resetPasswordTokenExpiration = new Date(
            today.setHours(today.getHours() + 2),
        );
        await prisma.user.update({
            where: {
                email: body.email,
            },
            data: {
                resetPasswordToken,
                resetPasswordTokenExpiration,
            },
        });
        try {
            await SendEmail({
                from: 'Awal Reset Password<do-not-reply@awaldigital.org>',
                to: [body.email],
                subject: 'Reset password',
                react: ResetPassword({
                    email: body.email,
                    resetPasswordToken,
                }) as React.ReactElement,
            });
        } catch (error) {
            console.log(error);
            return new NextResponse(JSON.stringify({ message: error }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.log(error);

        return new NextResponse(JSON.stringify({ message: error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
