'use client'

import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StatsProps {
    user: {
		name?: string|null,
		email?: string,
		
		id?: string,
		username?: string,
		gender?:string|null,
		age?: number|null,
		isSubscribed?: boolean|null,
		isPrivacy: boolean|null,
		surname: string|null,
		score?:number|null
	};
}

const Stats= () => {
	const {data:session} = useSession()
	const {locale} = useLocaleStore();
	const [dictionary, setDictionary] = useState<MessagesProps>();

	useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m);
        };

        fetchDictionary();
    }, [locale]);

    return (
        <div className="w-full h-full p-10 flex flex-col justify-center items-center">
			
		</div>
    );
};
export default Stats;
