'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
interface VerifyEmailPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => {
	const { locale } = useLocaleStore();
    const [dictionary, setDictionary] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    const verificationToken = searchParams?.token || '';
    const { data: session, update } = useSession();
    const user = session?.user;

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
                //  console.log(res.status);
                // console.log(res.data);
                if (res.status === 200) {
                    setIsVerified(true);
                    router.refresh();
                }
                if (res.status === 406) {
                    toast.error(
                        `${dictionary?.email.verification.token_error}`,
                    );
                }
            } catch (error) {
                // console.log(error);
            }
        };
        handleVerification();
    }, [url, verificationToken, update, dictionary]);
    //  console.log(isVerified);
    useEffect(() => {
        if (isVerified) {
            setTimeout(() => {
                update({ user: { ...user, isVerified: true } });
                router.push('/', { scroll: false });
            }, 2000);
        }
    }, [isVerified, update, router, user]);
    if (isVerified) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-2">
                <h1 className="text-3xl my-3 font-semibold">
                    {dictionary?.email.verification.success_title}
                </h1>
                <span>{dictionary?.email.verification.page_redirect}</span>
                <Link href={'/'} className="underline">
                    {dictionary?.texts.home}
                </Link>
            </div>
        );
    } else {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-2">
                <h1 className="text-3xl font-semibold">
                    {dictionary?.email.verification.error_title}
                </h1>
                <p>{dictionary?.email.verification.error_msg}</p>
            </div>
        );
    }
};
export default VerifyEmailPage;
