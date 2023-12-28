'use client';
import ContributeComp from '@/app/components/textTranslator/contributor/ContributeComp';
import ValidateComp from '@/app/components/textTranslator/validator/ValidateComp';
import useLocaleStore from '@/app/hooks/languageStore';
import TranslatorNav from '@/components/ui/Navbar/TranslatorNav';
import { useSession } from 'next-auth/react';

export default function ValidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
	const {locale} = useLocaleStore();

    console.log('Validate layout page debug');
    const { data: session, status } = useSession();
    console.log('Validate layout page debug status', status);
    if (status === 'loading') {
        return <div>Carregant...</div>;
    }
    if (!session?.user) {
        return null;
    }
    const userId = session?.user.id;
    console.log('Validate layout page debug session user', session?.user);
    if (session?.user) {
        return (
            <div>
                <TranslatorNav />
                <ValidateComp userId={userId} />
                {children}
            </div>
        );
    }
}
