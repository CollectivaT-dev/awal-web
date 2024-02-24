'use client';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast'
interface VerifyEmailPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => {
    const verificationToken = searchParams?.token || '';
const {data:session, update}=useSession()
    // console.log(update, session);
    // console.log(searchParams.token);
const [isVerified, setIsVerified]=useState(false)
    const url =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://awaldigital.org';
    useEffect(() => {
        //IIFE
        (async () => {
            try {
                const res = await axios.patch(`${url}/api/auth/verify-email`, {
                    token: verificationToken,
                });
                console.log(res);
                if (res.status === 406) {
                    toast.error('validation token not valid, please try to resend the verification email')
                }
if(res.status ===200 && res.data.isVerified){
update({user:res.data})
setIsVerified(true)
                // await getSession();
            } catch (error) {
                console.log(error);
            }
        })();
    }, [verificationToken]);

    if (isVerfied) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-2">
                <h1 className='text-3xl my-3 font-semibold'>Thank your Verifying the Email</h1>
                <a href={'/'} className="underline">
                    HomePage
                </a>
            </div>
        );
    } else {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-2">
                <h1 className='text-3xl font-semibold'>Verify Email failed</h1>
                <p> some thing went wrong, or this email has been verified, please try to resend verification email. if problem persist, contact us for help</p>
            </div>
        );
    }
};
export default VerifyEmailPage;
