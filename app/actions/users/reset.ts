import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
export const resetPassword = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        return new NextResponse(null, {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
            statusText: 'user not found',
        });
    }
    // generate token
    const resetPasswordToken = crypto.randomBytes(32).toString('base64url');
    const today = new Date();
    // expires in 2 hrs
    const expirationDate = new Date(today.setHours(today.getHours() + 2));
    await prisma.user.update({
        where: {
            email,
        },
        data: {
            resetPasswordToken,
            resetPasswordTokenExpiration: expirationDate,
        },
    });
};
