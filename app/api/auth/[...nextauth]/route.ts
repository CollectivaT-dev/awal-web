import prisma from '@/lib/prisma';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';

export const authOptions: AuthOptions = {
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
                const reqUrl = (req?.headers as any).origin;
                console.log(reqUrl);
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }
                // Change the local host to actual URL
                const res = await fetch(`${reqUrl}/api/signIn`, {
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
                return null;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
        jwt({ token, trigger, session, user }) {
            if (session?.user.gender === null) {
                session.user.gender = 'other';
            }
            if (trigger === 'update' && session.user) {
                token.score = session.user.score;
                token.username = session.user.username;
                token.isVerified = session.user.isVerified;
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
                },
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
            console.log(session);
            return session;
        },
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        encode: async ({ secret, token }) => {
            if (!secret) throw new Error('No secret provided to encode JWT token');
            const payload = { id: token?.id };
            console.log('🚀 ~ encode: ~ payload:', payload);
            const encodedToken = jwt.sign(payload, secret, { algorithm: 'HS256' });
            console.log('🚀 ~ encode: ~ encodedToken:', encodedToken);
            return encodedToken;
        },
        decode: async ({ secret, token }) => {
            if (!token) {
                throw new Error('Token is undefined');
            }
            try {
                const decodedToken = jwt.verify(token, secret, { algorithms: ['HS256'] });
                return decodedToken as JWT;
            } catch (error) {
                // Handle the error here
                throw new Error('Failed to decode token');
            }
        },
    },
    pages: {
        signIn: '/signIn',
    },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
