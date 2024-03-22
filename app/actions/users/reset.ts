'use server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { SendEmail } from '../emails/SendEmail';
import ResetPassword from '@/app/components/Emails/ResetPassword';
import { Niconne } from 'next/font/google';
export const resetPassword = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    //  console.log(user);
    if (!user) {
        return (
            JSON.stringify({ message: 'User not found', status: 404 }),
            { message: 'User not found', status: 404 }
        );
    }
    // generate token
    const resetPasswordToken = crypto.randomBytes(32).toString('base64url');
    const today = new Date();
    // expires in 2 hrs
    const resetPasswordTokenExpiration = new Date(
        today.setHours(today.getHours() + 2),
    );
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
            to: 'nine.slide@gmail.com',
            subject: 'Reset password',
            react: ResetPassword({
                email,
                resetPasswordToken,
            }) as React.ReactElement,
        });
    } catch (error) {
        //  console.log(error);
    }
    // return { message: 'Email sent successfully', status: 200 };
};
