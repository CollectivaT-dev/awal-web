'use client';
import Link from 'next/link';
import { Separator } from './separator';
import { RiTwitterXFill, RiFacebookFill, RiInstagramFill, RiGithubFill } from 'react-icons/ri';
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
        <div className='flex-col-center h-[10%]'>
          
		  <Separator className="bg-text-primary" />
            <div className="flex items-center justify-evenly h-auto ">
				
                <ul className="flex flex-col items-end justify-end h-auto w-[33%]  my-5">
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
                        <Link href={'/leaderboard'}>{d?.footer.leaderboard}</Link>
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

                <div className="flex flex-row items-center justify-center h-auto w-[33%] space-x-3">
                    <Link target="_blank" href={'https://www.facebook.com/aawaldigital'} scroll={false} className="text-sm">
                        <RiFacebookFill className="text-slate-600" />
                    </Link>
                    <Link target="_blank" href={'https://twitter.com/Awaldigital'} scroll={false}>
                        <RiTwitterXFill />
                    </Link>
                    <Link target="_blank" href={'https://www.instagram.com/awaldigital/'} scroll={false}>
                        <RiInstagramFill />
                    </Link>
                    <Link target="_blank" href={'https://github.com/CollectivaT-dev/awal-web'} scroll={false}>
                        <RiGithubFill />
                    </Link>
                    <Link target="_blank" href={'mailto:awal@collectivat.cat'} scroll={false}>
                        <Mail />
                    </Link>
                    <Link target="_blank" href={'https://t.me/awaldigital'} scroll={false}>
                        <LiaTelegramPlane size={10} />
                    </Link>
                </div>

                <ul className="flex flex-col items-center justify-center h-auto my-5 w-[33%]">
                    <li>
                        <Link href={'/about'} scroll={false}>
                            {d?.menu.about}
                        </Link>
                    </li>
                    <li>
                        <Link href={'/legal'}> {d?.footer.legal}</Link>
                    </li>
                    <li>
                        <Link href={'/contribution-terms'}>{d?.footer.contributionTerms}</Link>
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
    );
};
export default Footer;
