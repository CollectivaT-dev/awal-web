'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import { Separator } from '@/components/ui/separator';
import { MessagesProps, getDictionary } from '@/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const AboutPage = () => {
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
        <div className="min-h-screen flex-col-center text-md mobile:text-xl mx-5 whitespace-pre-wrap mt-10 mobile:mt-20">
            {d?.about.main_string_1}
            {/*  organizations */}
            <div className=" flex flex-row items-start justify-center space-x-10 my-10 mx-10">
                <div className="flex-col-center w-1/3 whitespace-pre-line">
                    <Link
                        href={'https://www.ciemen.cat/'}
                        scroll={false}
                        target="_blank"
                        className="mb-7"
                    >
                        <Image
                            src={'/contributors/ciemen.png'}
                            alt="ciemen"
                            width={200}
                            height={50}
                        />
                    </Link>
                    <Link
                        href={'https://www.ciemen.cat/'}
                        scroll={false}
                        target="_blank"
                        className="font-semibold text-xl my-2"
                    >
                        CIEMEN
                    </Link>

                    {d?.about.ciemen_intro}
                </div>
                <div className="w-1/3 flex-col-center whitespace-pre-line ">
                    <Link
                        href={'www.collectivat.cat'}
                        scroll={false}
                        target="_blank"
                        className="mb-2"
                    >
                        <Image
                            src={'/contributors/collectivat.png'}
                            alt="collectivat"
                            width={100}
                            height={50}
                        />
                    </Link>
                    <Link
                        href={'www.collectivat.cat'}
                        scroll={false}
                        target="_blank"
                        className="font-semibold text-xl my-2"
                    >
                        Col·lectivaT{' '}
                    </Link>
                    {d?.about.collectivat_intro}
                </div>
                <div className="w-1/3 flex-col-center whitespace-pre-line">
                    <Link
                        href={'https://casaamaziga.wordpress.com/'}
                        scroll={false}
                        target="_blank"
                        className="mb-7"
                    >
                        <Image
                            src={'/contributors/casa_amaziga.png'}
                            alt="casaamaziga"
                            width={200}
                            height={50}
                        />
                    </Link>
                    <Link
                        href={'https://casaamaziga.wordpress.com/'}
                        scroll={false}
                        target="_blank"
                        className="font-semibold text-xl my-2"
                    >
                        Casa Amaziga
                    </Link>
                    {d?.about.casa_amaziga_intro}
                </div>
            </div>
            <Separator className="w-1/2 my-3" />
            <span className="my-3 whitespace-pre-line">
                {d?.about.main_text_2}
            </span>
            <Separator className="w-1/2 my-3" />

            {/* individuals */}
            <div className=" flex flex-row items-start justify-center space-x-10 my-10 mx-10">
                <div className="flex-col-center w-1/3 whitespace-pre-line">
                    <Image
                        src={'/p3.jpg'}
                        alt="Farida Boudichat Fortas"
                        width={50}
                        height={50}
                        className="mb-2"
                    />
                    <h1 className="font-semibold text-xl my-2">
                        Farida Boudichat Fortas
                    </h1>
                    {d?.about.contributor_farida_intro}
                </div>
                <div className="flex-col-center w-1/3 whitespace-pre-line">
                    <Image
                        src={'/p2.jpg'}
                        alt="Lalla Ghizlan Baryala"
                        width={50}
                        height={50}
                        className="mb-2"
                    />
                    <h1 className="font-semibold text-xl my-2">
                        Lalla Ghizlan Baryala
                    </h1>
                    {d?.about.contributor_ghizlan_intro}
                </div>
                <div className="flex-col-center w-1/3 whitespace-pre-line">
                    <Link
                        href={'https://yuxuanize.vercel.app'}
                        scroll={false}
                        target="_blank"
                    >
                        <Image
                            src={'/p1.jpg'}
                            alt="Yuxuan Peng"
                            width={50}
                            height={50}
                            className="mb-2"
                        />
                    </Link>
                    <h1 className="font-semibold text-xl my-2">Yuxuan Peng</h1>
                    {d?.about.contributor_yuxuan_intro}
                </div>
            </div>
        </div>
    );
};
export default AboutPage;
