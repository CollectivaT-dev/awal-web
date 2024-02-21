import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
// import React from 'react';

// interface VerifyEmailPageProps {
//     searchParams: { [key: string]: string | string[] | undefined };
// }

// export const VerifyEmailPage = async ({
//     searchParams,
// }: VerifyEmailPageProps) => {
//     if (searchParams.token) {
//         const user = await prisma.user.findUnique({
//             where: {
//                 emailVerificationToken: searchParams.token as string,
//             },
//         });
//         if (!user) {
//             return { message: 'User not found', status: 404 };
//         }

//         await prisma.user.update({
//             where: {
//                 emailVerificationToken: searchParams.token as string,
//             },
//             data: {
//                 isVerified: true,
//                 emailVerificationToken: null,
//             },
//         });

//         return {
//             message: 'Email verified successfully',
//             status: 200,
//         };
//     } else {
//         return {
//             message: 'Invalid token',
//             status: 400,
//         };
//     }
// };

export async function POST(req: Request) {
    const body = await req.json();
    const userId = body.userId;
    console.log(userId);
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: body.userId,
            },
        });
        return new NextResponse(JSON.stringify(user), {
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return error;
    }
}
