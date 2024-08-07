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
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { LiaTelegramPlane } from 'react-icons/lia';
const Footer = () => {
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    const isAboveLgScreen = useMediaQuery('(min-width: 1024px)');
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);

    return (
        <>
            <Separator className="bg-text-primary" />
            {isAboveLgScreen ? (
                <div className="flex-row-center space-x-10 text-clay-100">
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
                                <Link href={'/leaderboard'}>
                                    {d?.footer.leaderboard}
                                </Link>
                            </li>
                            <li>
                                <Link href={'/faq'} scroll={false}>
                                    {d?.menu.faq}
                                </Link>
                            </li>
                            <li>
                                <Link href={'/resources'} scroll={false}>
                                    {d?.menu.resources}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-row-center space-x-3">
                        <Link
                            target="_blank"
                            href={'https://www.facebook.com/aawaldigital'}
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
                            href={'mailto:awal@collectivat.cat'}
                            scroll={false}
                        >
                            <Mail size={30} />
                        </Link>
                        <Link
                            target="_blank"
                            href={'https://t.me/awaldigital'}
                            scroll={false}
                        >
                            <LiaTelegramPlane size={30} />
                        </Link>
                    </div>
                    <div>
                        <ul className="flex flex-col items-start justify-between my-5">
                            <li>
                                <Link href={'/about'} scroll={false}>
                                    {d?.menu.about}
                                </Link>
                            </li>
                            <li>
                                <Link href={'/legal'}> {d?.footer.legal}</Link>
                            </li>
                            <li>
                                <Link href={'/contribution-terms'}>
                                    {d?.footer.contributionTerms}
                                </Link>
                            </li>

                            <li>
                                <Link href={'/privacy'}>
                                    {d?.footer.privacy}
                                </Link>
                            </li>
                            <li>
                                <Link href={'/cookies'}>
                                    {d?.footer.cookie}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-row flex items-center justify-evenly text-clay-100">
                        <div>
                            <ul className="flex flex-col my-5 justify-center items-end ">
                                <li>
                                    <Link href={'/translate'} scroll={false}>
                                        {d?.nav.translator}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/'} scroll={false}>
                                        {d?.menu.voice}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/leaderboard'}>
                                        {d?.footer.leaderboard}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/faq'} scroll={false}>
                                        {d?.menu.faq}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/resources'} scroll={false}>
                                        {d?.menu.resources}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul className="flex flex-col items-start justify-between my-5">
                                <li>
                                    <Link href={'/about'} scroll={false}>
                                        {d?.menu.about}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/legal'}>
                                        {d?.footer.legal}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/contribution-terms'}>
                                        {d?.footer.contributionTerms}
                                    </Link>
                                </li>

                                <li>
                                    <Link href={'/privacy'}>
                                        {d?.footer.privacy}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/cookies'}>
                                        {d?.footer.cookie}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex-row-center space-x-3 pb-10 text-clay-100">
                        <Link
                            target="_blank"
                            href={'https://www.facebook.com/aawaldigital'}
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
                            href={'mailto:awal@collectivat.cat'}
                            scroll={false}
                        >
                            <Mail size={30} />
                        </Link>
                        <Link
                            target="_blank"
                            href={'https://t.me/awaldigital'}
                            scroll={false}
                        >
                            <LiaTelegramPlane size={30} />
                        </Link>
                    </div>
                </>
            )}
        </>
    );
};
export default Footer;
