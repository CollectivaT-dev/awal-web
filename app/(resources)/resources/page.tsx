'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import Link from 'next/link';
import { useEffect, useState } from 'react';
const ResourcesPage = () => {
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
                <h1 className="text-3xl font-semibold mb-10 text-center">
                    {d?.resources.resources_heading}
                </h1>
            <ol className="list-disc pl-4">
                <li>
                    <Link
                        scroll={false}
                        target="_blank"
                        href={
                            'https://huggingface.co/datasets/collectivat/amazic'
                        }
                    >
                        {d?.resources.awal_huggingface}
                    </Link>
                </li>
                <li>
                    <Link
                        scroll={false}
                        target="_blank"
                        href={'https://huggingface.co/Tamazight-NLP'}
                    >
                        {d?.resources.tamazight_NLP_huggingface}
                    </Link>
                </li>
                <li>
                    <Link
                        scroll={false}
                        target="_blank"
                        href={'https://zgh.wikipedia.org/wiki/'}
                    >
                        {d?.resources.tamazight_wiki}
                    </Link>
                </li>
                <li>
                    <Link
                        scroll={false}
                        target="_blank"
                        href={'https://tal.ircam.ma/talam/'}
                    >
                        {d?.resources.TALAM_groups}
                    </Link>
                </li>
            </ol>
        </div>
    );
};
export default ResourcesPage;
