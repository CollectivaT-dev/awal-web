import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
interface ReqBodyProps {
    email: string;
    password: string;
}

export async function POST(req: Request) {
    const body: ReqBodyProps = await req.json();

    console.log(body);
    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
        },
    });

if (user && (await bcrypt.compare(body.password, user.password as string))) {
        const { password, ...userWithoutPassword } = user;
		console.log(JSON.stringify(userWithoutPassword))
        return new Response(JSON.stringify(userWithoutPassword));
    }
    return new Response('Invalid credentials', {
        status: 401,
    });
}
