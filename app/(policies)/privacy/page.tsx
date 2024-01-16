'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import { useEffect, useState } from 'react';
const PrivacyPage = () => {
    const { locale } = useLocaleStore();

    const [d, setDictionary] = useState<MessagesProps>();

    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m);
        };

        fetchDictionary();
    }, [locale]);

    return (
        <div className="min-h-screen flex flex-col  space-y-5 text-[1.2rem] m-10 leading-8 whitespace-pre-wrap">
            <h1 className="text-3xl font-semibold text-center">
                {d?.privacy.privacy_heading}
            </h1>
            <p>{d?.privacy.privacy_item_1_txt_1}</p>
            <ol className="list-disc pl-4">
                <li>{d?.privacy.privacy_item_1_li_1}</li>
                <li>{d?.privacy.privacy_item_1_li_2}</li>
             
            </ol>
            <p>{d?.privacy.privacy_item_1_txt_2}</p>
            <ol className="list-disc pl-4">
                <li>{d?.privacy.privacy_item_1_li_3}</li>
                <li>{d?.privacy.privacy_item_1_li_4}</li>
                <li>{d?.privacy.privacy_item_1_li_5}</li>
            </ol>
        </div>
    );
};
export default PrivacyPage;
