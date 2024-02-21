import prisma from '@/lib/prisma';
import React from 'react';
interface VerifyEmailPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
    console.log(searchParams);
    if (searchParams.token) {
        const user = await prisma.user.findUnique({
            where: {
                emailVerificationToken: searchParams.token as string,
            },
        });
        if (!user) {
            return { message: 'User not found', status: 404 };
        }

        await prisma.user.update({
            where: {
                emailVerificationToken: searchParams.token as string,
            },
            data: {
                isVerified: true,
                emailVerificationToken: null,
            },
        });

        return (
            <div>
                <h1>Thank your Verifying the Email</h1>
                <a href={'/'} className="underline">
                    HomePage
                </a>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Verify Email</h1>
                No email verification token found. Check your email.
            </div>
        );
    }
};
export default VerifyEmailPage;
