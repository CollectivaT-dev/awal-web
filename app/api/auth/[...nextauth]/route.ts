import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export const handler: AuthOptions = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'email',
                    type: 'text',
                    placeholder: 'email',
                },
                password: {
                    label: 'password',
                    type: 'password',
                    placeholder: 'password',
                },
            },
            async authorize(credentials, req) {
                const url = 'http://localhost:3000';
                const reqUrl = (req?.headers as any).origin;
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }
                //> the local host needs to be changed to actual url
                const res = await fetch(`${url === reqUrl ? 'http://localhost:3000/api/signIn' : 'https://awaldigital.org/api/signIn'}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                });
                console.log(res);
                const data = await res.json();
                // console.log('auth log' + { ...data });
                if (res.ok && data.email) {
                    // console.log('res ok data log' + JSON.stringify(data));
                    return data;
                }
                console.log('auth log 2' + data);
                return null;
            },
        }),
    ],
	session: {
		strategy: 'jwt',
		maxAge: 24 * 60 * 60, // 24 hours
	},
    callbacks: {
       async jwt({ token, trigger, session, user }) {
            //   console.log(trigger);
            //   console.log(session?.user);

            //   console.log(session);
            if (session?.user.gender === null) {
                session.user.gender = 'other';
            }
            //   console.log(token);
            if (trigger === 'update' && session.user) {
                //   console.log(session.user);
                token.score = session.user.score;

                token.username = session.user.username;
                token.isVerified = session.user.isVerified;
                //   console.log(token);
            }
            //   console.log(token); 
			if (user) {
                token.id = user.id;
            }
            return { ...token, ...user };
        },
		async session({ session, token }) {
            // Fetch user data from Prisma based on the ID stored in the token
            const user = await prisma.user.findUnique({
                where: { id: token.id as string },
            });
			console.log(session)
            // Add user data to the session
            if (user) {
                session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    score: user.score?? undefined,
                    gender: user.gender?? undefined,
                    age: user.age,
                    role: user.role,
                    residence: user.residence,
                    isSubscribed: user.isSubscribed,
                    isPrivacy: user.isPrivacy,
                    isVerified: user.isVerified ?? undefined,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    lastContribution: user.lastContribution,
                    contributions: user.contributions,
                    validationEntries: user.validationEntries,
                    reportedEntries: user.reportedEntries,
                    languages: user.languages,
                    tachelhit: user.tachelhit,
       	             central: user.central,
                    tarifit: user.tarifit,
                    other: user.other,
                };
            }
console.log(session)
            return session;
        },
    },
	jwt: {
        secret: process.env.JWT_SECRET,
        encode: async ({ secret, token }) => {
            const payload = { id: token?.id };
            const encodedToken = jwt.sign(payload, secret, { algorithm: 'HS256' });
            return encodedToken;
        },
        decode: async ({ secret, token }) => {
            const decodedToken = jwt.verify(token, secret, { algorithms: ['HS256'] });
            return decodedToken;
        },
    },
   
    //the customized pages must be located in @/auth/... https://next-auth.js.org/configuration/pages folder names and path must coincides, route.ts cant be in the same folder
    pages: {
        signIn: '/signIn',
    },
});

export { handler as GET, handler as POST };
