import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
                const url = 'httplocalhost:3000';
                const reqUrl = (req?.headers as any).origin;
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }
                //> the local host needs to be changed to actual url
                const res = await fetch(
                    `${
                        url === reqUrl
                            ? 'httplocalhost:3000/api/signIn'
                            : 'httpsawaldigital.org/api/signIn'
                    }`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(credentials),
                    },
                );
                const data = await res.json();
                //   console.log(data);
                if (res.ok && data.email) {
                    return data;
                }
                //   console.log(data);
                return null;
            },
        }),
    ],
    // session: {
    //     strategy: 'jwt',
    //     maxAge: 15 * 24 * 60 * 60,
    // },
    callbacks: {
        jwt({ token, trigger, session, user }) {
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
            return { ...token, ...user };
        },
        async session({ session, token }) {
            session.user = token as any;
            return session;
        },
    },
    //the customized pages must be located in @/auth/... httpsnext-auth.js.org/configuration/pages folder names and path must coincides, route.ts cant be in the same folder
    pages: {
        signIn: '/signIn',
    },
});

export { handler as GET, handler as POST };
