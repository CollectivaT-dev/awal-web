import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import {NextResponse } from 'next/server';
interface ReqBodyProps {
    username: string;
    email: string;
    password: string;
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		console.log(body);
		const checkExistingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: body.email },
                    { username: body.username }
                ],
            },
        });
		if (checkExistingUser) {
			return new NextResponse(JSON.stringify(checkExistingUser), {
				status: 409,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}
		console.log(checkExistingUser);
		const user = await prisma.user.create({
			data: {
				username: body.username,
				email: body.email,
				password: await bcrypt.hash(body.password, 10),
				isPrivacy:body.isPrivacy,
				score:0
			},
		});
		console.log(user)
		console.log(user);
	
		const { password, ...userWithoutPassword } = user;
	
		return new NextResponse(JSON.stringify(userWithoutPassword), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.log(error);
        return new NextResponse(null, { status: 500 });
	}
   
}
