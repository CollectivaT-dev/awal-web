'use client';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
interface VerifyEmailPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => {
    const verificationToken = searchParams?.token || '';
const {data:session, update}=useSession()
    // console.log(update, session);
    // console.log(searchParams.token);
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
                if (res.status === 400) {
                    console.log('400 error');
                }
if(res.status ===200 && res.data.isVerified){
update({user:res.data)}
                // await getSession();
            } catch (error) {
                console.log(error);
            }
        })();
    }, [verificationToken]);

    if (searchParams.token) {
        return (
            <div className="h-screen">
                <h1>Thank your Verifying the Email</h1>
                <a href={'/'} className="underline">
                    HomePage
                </a>
            </div>
        );
    } else {
        return (
            <div className="h-screen ">
                <h1>Verify Email</h1>
                Email has been verified. Check your email for instructions,
            </div>
        );
    }
};
export default VerifyEmailPage;
