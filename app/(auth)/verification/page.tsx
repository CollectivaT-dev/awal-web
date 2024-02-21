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
        console.log(user);
        if (!user) {
            return { message: 'User not found', status: 404 };
        }

        const updatedUser = await prisma.user.update({
            where: {
                emailVerificationToken: searchParams.token as string,
            },
            data: {
                isVerified: true,
                emailVerificationToken: `${searchParams.token}_verified`,
            },
            select: {
                isVerified: true,
            },
        });
        // console.log(updatedUser);
        // if (user?.isVerified) {
        //     return;
        // }
        return (
            <div className="h-screen">
                <h1>Thank your Verifying the Email</h1>
                <a href={'/'} className="underline">
                    HomePage
                </a>
            </div>
        );
    } else {
        return (
            <div className="h-screen ">
                <h1>Verify Email</h1>
                Email has been verified. Check your email for instructions,
            </div>
        );
    }
};
export default VerifyEmailPage;
