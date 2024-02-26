'use client';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
interface VerifyEmailPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => {
    const verificationToken = searchParams?.token || '';
	// console.log(verificationToken)
    const { data: session, update } = useSession();
    const user = session?.user;
    // console.log(update, session);
    // console.log(searchParams.token);
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();
    const url =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://awaldigital.org';

    useEffect(() => {
        //IIFE
        const handleVerification = async () => {
            try {
                const res = await axios.patch(`${url}/api/auth/verify-email`, {
                    token: verificationToken,
                });
                console.log(res.status);
                console.log(res.data);
                if (res.status === 200) {
                    setIsVerified(true);
                    router.refresh();
                }
                if (res.status === 406) {
                    toast.error(
                        'validation token not valid, please try to resend the verification email',
                    );
                }
            } catch (error) {
                console.log(error);
            }
        };
        handleVerification();
    }, [url, verificationToken, update]);
    // console.log(isVerified);
    useEffect(() => {
        if (isVerified) {
            setTimeout(() => {
                update({ user: { ...user, isVerified: true } });
                router.push('/',{scroll:false});
            }, 2000);
        }
    }, [isVerified, update, router, user]);
    if (isVerified) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-2">
                <h1 className="text-3xl my-3 font-semibold">
                    Thank your Verifying the Email
                </h1>
                <span>Now Redirecting to</span>{' '}
                <Link href={'/'} className="underline">
                    Home
                </Link>
            </div>
        );
    } else {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-2">
                <h1 className="text-3xl font-semibold">Verify Email failed</h1>
                <p>
                    {' '}
                    some thing went wrong, or this email has been verified,
                    please try to resend verification email. if problem persist,
                    contact us for help
                </p>
            </div>
        );
    }
};
export default VerifyEmailPage;
