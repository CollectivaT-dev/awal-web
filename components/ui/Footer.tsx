'use client';
import Link from 'next/link';
import { Separator } from './separator';
import {
    RiTwitterXFill,
    RiFacebookFill,
    RiInstagramFill,
    RiGithubFill,
} from 'react-icons/ri';
import useLocaleStore from '@/app/hooks/languageStore';
import { useEffect, useState } from 'react';
import { MessagesProps, getDictionary } from '@/i18n';
import { Mail } from 'lucide-react';

const Footer = () => {
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);

    return (
        <>
            <Separator className="bg-text-primary " />
            <div className="flex flex-row justify-center space-x-10 items-center">
                <div>
                    <ul className="flex flex-col my-5 justify-center items-end ">
                        <li>
                            <Link href={'/translate'} scroll={false}>
                                {d?.nav.translator}
                                {}
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'} scroll={false}>
                                {d?.menu.voice}
                            </Link>
                        </li>
                        <li>
                            <Link href={'/about'} scroll={false}>
                                {d?.menu.about}
                            </Link>
                        </li>
                        <li>
                            <Link href={'/resources'} scroll={false}>
                                {d?.menu.resources}
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-row justify-center items-center space-x-3">
                    <Link
                        target="_blank"
                        href={'https://facebook.com'}
                        scroll={false}
                    >
                        <RiFacebookFill size={30} />
                    </Link>
                    <Link
                        target="_blank"
                        href={'https://twitter.com/Awaldigital'}
                        scroll={false}
                    >
                        <RiTwitterXFill size={30} />
                    </Link>

                    <Link
                        target="_blank"
                        href={'https://www.instagram.com/awaldigital/'}
                        scroll={false}
                    >
                        <RiInstagramFill size={30} />
                    </Link>
                    <Link
                        target="_blank"
                        href={'https://github.com/CollectivaT-dev/awal-web'}
                        scroll={false}
                    >
                        <RiGithubFill size={30} />
                    </Link>
                    <Link
                        target="_blank"
                        href={'mailto:8PqFP@example.com'}
                        scroll={false}
                    >
                        <Mail size={30} />
                    </Link>
                </div>
                <div>
                    <ul className="flex flex-col items-start justify-between my-5">
                       
                        <li>
                            <Link href={'/legal'}> {d?.footer.legal}</Link>
                        </li>
						<li>
                            <Link href={'/contribution-terms'} >
                                {d?.footer.contributionTerms}
                            </Link>
                        </li>
                        <li>
                            <Link href={'/privacy'}>{d?.footer.privacy}</Link>
                        </li>
                        <li>
                            <Link href={'/cookies'}>{d?.footer.cookie}</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};
export default Footer;
