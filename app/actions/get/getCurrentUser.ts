import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// Function to get the current session


export async function getSession() {
    const session = await getServerSession(authOptions);
    return session;
}


export default async function getCurrentUser() {
    try {
        const session = await getSession(); // Get the current session
        console.log(session);
        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string,
            },
        });
        // console.log(currentUser);
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
