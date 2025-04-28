'use server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { SendEmail } from '../emails/SendEmail';
import ResetPassword from '@/app/components/Emails/ResetPassword';
export const resetPassword = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        return JSON.stringify({ message: 'User not found', status: 404 }), { message: 'User not found', status: 404 };
    }
    // generate token
    const resetPasswordToken = crypto.randomBytes(32).toString('base64url');
    const today = new Date();
    // expires in 30 minutes
    const resetPasswordTokenExpiration = new Date(today.setMinutes(today.getMinutes() + 30));
    console.log(resetPasswordToken, resetPasswordTokenExpiration);
    await prisma.user.update({
        where: {
            email,
        },
        data: {
            resetPasswordToken,
            resetPasswordTokenExpiration,
        },
    });
    try {
        await SendEmail({
            from: 'Awal Reset Password<do-not-reply@awaldigital.org>',
            to: [user.email],
            subject: 'Reset password',
            react: ResetPassword({
                email,
                resetPasswordToken,
            }) as React.ReactElement,
        });
        return { message: 'Email sent successfully', status: 200 };
    } catch (error) {
        return { message: 'error while sending email, try again later', status: 500 };
    }
};
