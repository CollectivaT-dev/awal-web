import prisma from '@/lib/prisma';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';

export const authOptions : AuthOptions = ({
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
                // Change the local host to actual URL
                const res = await fetch(`${url === reqUrl ? 'http://localhost:3000/api/signIn' : 'https://awaldigital.org/api/signIn'}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                });
                const data = await res.json();
                if (res.ok && data.email) {
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
            if (session?.user?.gender === null) {
                session.user.gender = 'other';
            }
            if (trigger === 'update' && session?.user) {
                token.score = session.user.score;
                token.username = session.user.username;
                token.isVerified = session.user.isVerified;
            }
            if (user) {
                token.id = user.id;
            }
            return { ...token, ...user };
        },
        async session({ session, token }) {
            const user = await prisma.user.findUnique({
                where: { id: token.id as string },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    name: true,
                    surname: true,
                    score: true,
                    gender: true,
                    age: true,
                    role: true,
                    residence: true,
                    isSubscribed: true,
                    isPrivacy: true,
                    isVerified: true,
                    createdAt: true,
                    updatedAt: true,
                    lastContribution: true,
                    contributions: true,
                    validationEntries: true,
                    reportedEntries: true,
                    languages: true,
                    tachelhit: true,
                    central: true,
                    tarifit: true,
                    other: true,
                }
            });
            if (user) {
                session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    score: user.score ?? undefined,
                    gender: user.gender ?? undefined,
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
    pages: {
        signIn: '/signIn',
    },
});
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
