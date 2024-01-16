'use client';
import ContributeComp from '@/app/components/textTranslator/contributor/ContributeComp';
import useLocaleStore from '@/app/hooks/languageStore';
import TranslatorNav from '@/components/ui/Navbar/TranslatorNav';
import { useSession } from 'next-auth/react';
import { MessagesProps, getDictionary } from '@/i18n';
import { Suspense, useEffect, useState } from 'react';


export default function ContributeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);
    console.log('contribution layout page debug');
    const { data: session, status } = useSession();
    console.log('contribution layout page debug status', status);

    if (!session?.user) {
        return null;
    }
    const userId = session?.user.id;
    console.log('contribution layout page debug session user', session?.user);
    if (session?.user) {
        return (
            <div>
                <TranslatorNav />

                <ContributeComp userId={userId} />
                {children}
            </div>
        );
    }
}
