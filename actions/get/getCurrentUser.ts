import { getServerSession } from 'next-auth/next';

import { handler } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function getSession() {
    return await getServerSession(handler);
}

export default async function getCurrentUser() {
    try {
        const session = await getSession();
        console.log(session);
        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string,
            },
        });
        console.log(currentUser);
        if (!currentUser) {
            return null;
        }

        return {
            ...currentUser,
        };
    } catch (error: any) {
        return null;
    }
}
