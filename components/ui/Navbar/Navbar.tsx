'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import SignInButton from './SignInButton';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Skeleton } from '../skeleton';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../dropdown-menu';
import { Globe, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loading from '@/loading';
import { SendEmail } from '@/app/actions/emails/SendEmail';
import Publication from '@/app/components/Emails/Publication';
import { isAxiosError } from 'axios';
import VerificationAlert from '@/components/VerificationAlert';

const AppBar = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    // get locale and set new local
    const { locale, setLocale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://awaldigital.org';
    const changeLocale = (newLocale: string) => {
        setLocale(newLocale);
        //console.log(newLocale);
        try {
            setLoading(true);
            router.push(`${url}/?lang=${newLocale}`, {
                scroll: false,
            });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    // hardcoded for now, need to fetch from prisma later according to sub status
    const mailingList = ['yuxuan<yuxuan.peng@pm.me>'];
    // publication temp button
    const handleEmail = async () => {
        try {
            await SendEmail({
                from: 'Awal<do-not-reply@awaldigital.org>',
                // ! need to change for publication
                to: mailingList,
                subject: 'test email',
                react: Publication({
                    firstName: 'yuxuan',
                }) as React.ReactElement,
            });

            toast.success('Email sent successfully');
        } catch (error) {
            if (isAxiosError(error)) throw new Error(error.message);
            else {
                //console.log(error);
            }
            toast.error('error while sending email, try again later');
        }
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    const handleClick = () => {
        setOpen(!open);
    };
    if (loading) {
        return <Loading />;
    }
    console.log(locale);
    console.log(d?.language?.zgh);
    return (
        <div className="flex flex-col h-auto w-auto justify-stretch items-baseline">
            <header className="relative">
                <div className="flex items-center justify-between px-4 py-3" ref={menuRef}>
                    <div className="flex items-center gap-4">
                        <motion.button animate={open ? 'open' : 'closed'}>
                            <Button size={'icon'} onClick={handleClick} className="bg-transparent hover:bg-transparent mr-3">
                                {open ? <X height={100} width={100} className="left-0 top-0 text-black" /> : <Image src={'/logo_line.svg'} height={100} width={100} alt="menu_icon" />}
                            </Button>
                        </motion.button>
                        <div className="flex items-center">
                            <Link href={'/'} scroll={false} className="w-[10em] hidden lg:flex">
                                <Image src={'/logo_awal.svg'} width={100} height={100} alt="logo_zgh" className="bg-yellow-500 px-2 py-1 " />
                            </Link>

                            {/* awal link */}
                            <Link className="text-yellow-500/95 text-md font-bold md:font-normal md:text-[2.5rem] lg:ml-5" href={'/'} scroll={false}>
                                AWAL
                            </Link>
                        </div>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="flex items-center gap-4">
                        <SignInButton />
                        <div className="hidden lg:flex lg:flex-row lg:relative">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button className="w-[10rem]">
                                        <Globe className="mr-3" color="white" />
                                        {locale === 'es' && d?.language?.es}
                                        {locale === 'ca' && d?.language?.ca}
                                        {locale === 'en' && d?.language?.en}
                                        {locale === 'fr' && d?.language?.fr}
                                        {locale === 'zgh' && d?.language?.zgh}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="absolute right-[2vw]  w-56 flex flex-col items-center justify-center h-auto ">
                                    <DropdownMenuLabel>{d?.translator.select_lang}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={locale} onValueChange={changeLocale}>
                                        <DropdownMenuRadioItem value="ca">{d?.language?.ca}a</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="es">{d?.language?.es}</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="en">{d?.language?.en}</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="fr">{d?.language?.fr}</DropdownMenuRadioItem>

                                        <DropdownMenuRadioItem value="zgh">{d?.language?.zgh}</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {/* for small screen */}
                        <div className="lg:hidden flex flex-row relative">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button size={'icon'}>
                                        <Globe className="m-3" color="white" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="absolute right-[2vw] mt-2 w-[10rem] flex flex-col items-center justify-center h-auto ">
                                    <DropdownMenuLabel className="whitespace-nowrap">{d?.translator.select_lang}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={locale} onValueChange={changeLocale}>
                                        <DropdownMenuRadioItem value="ca">{d?.language?.ca}a</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="es">{d?.language?.es}</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="en">{d?.language?.en}</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="fr">{d?.language?.fr}</DropdownMenuRadioItem>

                                        <DropdownMenuRadioItem value="zgh">{d?.language?.zgh}</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="hidden lg:flex"></div>
                    </div>
                </div>
                <div className="pl-[5%]">
                    {open && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    scale: 0.95,
                                    transition: {
                                        duration: 0.2,
                                    },
                                },
                                visible: {
                                    opacity: 1,
                                    scale: 1,
                                    transition: {
                                        duration: 0.2,
                                    },
                                },
                            }}
                            className="bg-text-accent py-4 px-5 rounded-xl w-[20%] z-50 flex flex-col items-center justify-start "
                        >
                            <ul className="space-y-2 mt-2 bg-text-accent">
                                {user?.email?.includes('test' || 'alp') && <Button onClick={handleEmail}>send test email</Button>}
                                <li>
                                    <Link href={'/translate'} scroll={false}>
                                        {d?.menu.translator}
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
                                <li>
                                    <Link href={'/leaderboard'} scroll={false}>
                                        {d?.footer.leaderboard}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/faq'} scroll={false}>
                                        {d?.menu.faq}
                                    </Link>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </div>
            </header>

            {!user?.isVerified && user?.email && user && (
                <VerificationAlert
                    data={{
                        userId: user?.id,
                        email: user?.email,
                        isVerified: user?.isVerified as boolean,
                    }}
                />
            )}
        </div>
    );
};

export default AppBar;
