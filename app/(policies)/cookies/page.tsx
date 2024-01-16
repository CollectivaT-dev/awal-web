'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import { useEffect, useState } from 'react';
const CookiesPage = () => {
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
        <div className="h-[100vh] flex justify-center items-center text-xl">
            <div className="min-h-screen flex flex-col  space-y-5 text-[1.2rem] m-10 leading-8 whitespace-pre-wrap">
                <h1 className="text-3xl font-semibold text-center">
                    {d?.cookies.cookies_heading}
                </h1>
                <p>{d?.cookies.cookies_text_1}</p>
                <ol className="list-disc pl-4">
                    <li>{d?.cookies.cookies_list_1}</li>
                    <li>{d?.cookies.cookies_list_2}</li>
                    <li>{d?.cookies.cookies_list_3}</li>
                    <li>{d?.cookies.cookies_list_4}</li>
                </ol>
                <p>{d?.cookies.cookies_text_2}</p>
            </div>
        </div>
    );
};
export default CookiesPage;
