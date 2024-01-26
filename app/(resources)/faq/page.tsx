'use client';
import { MessagesProps, getDictionary } from '@/i18n';
import { useEffect, useState } from 'react';
import useLocaleStore from '@/app/hooks/languageStore';
interface FAQ {
    [key: string]: {
        q: string;
        a: string;
    };
}
const FaqPage = () => {
    const { locale } = useLocaleStore();
    const [d, setDictionary] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m as unknown as MessagesProps);
            console.log(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    const faq: FAQ = d?.faq || {};
    return (
        <div className="flex-col flex m-5 min-h-[80vh]">
            <h1 className="text-3xl text-center capitalize font-semibold my-5">
                {d?.texts.faq_heading}
            </h1>
            {Object.keys(faq).map((key) => (
                <div
                    className="flex flex-col items-start justify-start space-y-3 mx-2"
                    key={key}
                >
                    <h2 className="text-xl font-semibold mt-3">{faq[key].q}</h2>
                    <p className="text-md my-3 pl-2">{faq[key].a}</p>
                </div>
            ))}
        </div>
    );
};
export default FaqPage;
