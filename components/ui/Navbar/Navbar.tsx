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
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../dropdown-menu';
import { Globe, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loading from '@/loading';
import { SendEmail } from '@/app/actions/emails/SendEmail';
import Publication from '@/app/components/Emails/Publication';
import { isAxiosError } from 'axios';
import VerificationAlert from '@/components/VerificationAlert';

const AppBar = () => {
    // console.log(user.isVerified);
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
    return (
        <div className="flex flex-col h-auto justify-stretch items-baseline">
            <div
                className="flex flex-row justify-center items-center relative" // Use flex-col and flex-row classes for responsive behavior
                ref={menuRef}
            >
                {/* menu button */}
                <motion.button animate={open ? 'open' : 'closed'}>
                    <Button size={'icon'} onClick={handleClick} className="bg-transparent hover:bg-transparent mr-3 absolute left-1 top-2">
                        {open ? <X height={100} width={100} className="left-0 top-0 text-black" /> : <Image src={'/logo_line.svg'} height={100} width={100} alt="menu_icon" />}
                    </Button>
                </motion.button>
                {/* char logo */}
                <div className="absolute left-20 top-0">
                    <div className="w-[7%] hidden lg:inline-block">
                        <Link href={'/'} scroll={false}>
                            <Image src={'/logo_awal.svg'} width={`${110}`} height={30} alt="logo_zgh" className=" bg-yellow-500 px-[3px] py-[3px] laptop:px-[8px] laptop:py-[6px]" />
                        </Link>
                    </div>
                    {/* awal link */}
                    <Link className=" text-yellow-500 text-md font-bold md:font-normal md:text-[2.5rem] lg:ml-5" href={'/'} scroll={false}>
                        AWAL
                    </Link>
                </div>
                {/* sign in */}
                <div className="flex flex-row items-center justify-center space-x-3 ml-auto">
                    <SignInButton />
                    {/* user info rendering */}

                    <div className="flex lg:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size={'icon'}>
                                    <Globe width={50}  className='text-slate-100'/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>{d?.translator.select_lang}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={locale} onValueChange={changeLocale}>
                                    <DropdownMenuRadioItem value="ca">{d?.language?.ca}</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="es">{d?.language?.es}</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="en">{d?.language?.en}</DropdownMenuRadioItem>

                                    <DropdownMenuRadioItem value="fr">{d?.language?.fr}</DropdownMenuRadioItem>
                                    {/* <DropdownMenuRadioItem value="ary">
                            {d?.language?.ary}
                        </DropdownMenuRadioItem> */}
                                    <DropdownMenuRadioItem value="zgh">{d?.language?.zgh}</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="hidden lg:flex w-auto h-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    <Globe className="mr-3" />
                                    {locale === 'es' && d?.language?.es}
                                    {locale === 'ca' && d?.language?.ca}
                                    {locale === 'en' && d?.language?.en}
                                    {locale === 'fr' && d?.language?.fr}
                                    {locale === 'zgh' && d?.language?.zgh}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>{d?.translator.select_lang}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={locale} onValueChange={changeLocale}>
                                    <DropdownMenuRadioItem value="ca">{d?.language?.ca}</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="es">{d?.language?.es}</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="en">{d?.language?.en}</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="fr">{d?.language?.fr}</DropdownMenuRadioItem>
                                    {/* <DropdownMenuRadioItem value="ary">
                            {d?.language?.ary}
                        </DropdownMenuRadioItem> */}
                                    <DropdownMenuRadioItem value="zgh">{d?.language?.zgh}</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
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
                        className="absolute top-full left-3 bg-text-accent py-4 px-10 z-10 rounded-xl"
                    >
                        <ul className="space-y-2 mt-2">
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
                            </li>{' '}
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
