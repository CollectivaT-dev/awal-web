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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../dropdown-menu';
import { Globe, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { SendEmail } from '@/app/actions/emails/SendEmail';
import Publication from '@/app/components/Emails/Publication';
import { isAxiosError } from 'axios';
import VerificationAlert from '@/components/VerificationAlert';

const AppBar = () => {
    // console.log(user.isVerified);
    const {data:session } = useSession();
    const user = session?.user
	const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    // get locale and set new local
    const { locale, setLocale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    const router = useRouter();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    const changeLocale = (newLocale: string) => {
        try {
            setLocale(newLocale);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
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
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
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
    const pathname = usePathname();
    const navItems = [
        { key: 'translator', href: '/translate', label: d?.menu.translator },
        { key: 'voice', href: '/', label: d?.menu.voice },
        { key: 'about', href: '/about', label: d?.menu.about },
        { key: 'resources', href: '/resources', label: d?.menu.resources },
        { key: 'leaderboard', href: '/leaderboard', label: d?.footer.leaderboard },
        { key: 'faq', href: '/faq', label: d?.menu.faq },
    ];
    return (
        <>
            <div
                className="relative flex flex-row items-center gap-4 p-4 " // Use flex-col and flex-row classes for responsive behavior
                ref={menuRef}
            >
                {/* menu button - small screens only, desktop uses the top nav below */}
                <Button
                    size={'icon'}
                    onClick={handleClick}
                    className="lg:hidden"
                    aria-label={d?.menu.label}
                    aria-expanded={open}
                    aria-haspopup="menu"
                >
                    {open ? (
                        <X width={22} height={22} />
                    ) : (
                        <Menu width={22} height={22} />
                    )}
                </Button>
                {/* tifinagh glyph - home link on large screens */}
                <Link
                    href={'/'}
                    scroll={false}
                    className="hidden lg:inline-block mr-3"
                >
                    <Image
                        src={'/logo_line.svg'}
                        height={28}
                        width={28}
                        alt="Awal"
                    />
                </Link>
                {/* char logo */}
                <div className="w-[7%] hidden lg:inline-block">
                    <Link href={'/'} scroll={false}>
                        <Image
                            src={'/logo_awal.svg'}
                            width={`${110}`}
                            height={30}
                            alt="logo_zgh"
                            className=" bg-yellow-500 w-full px-[3px] py-[3px] laptop:px-[8px] laptop:py-[6px]"
                        />
                    </Link>
                </div>
                {/* awal link */}
                <Link
                    className=" text-yellow-500 text-md font-bold md:font-normal md:text-[2.5rem] "
                    href={'/'}
                    scroll={false}
                >
                    AWAL
                </Link>
                {/* top nav - large screens */}
                <nav
                    aria-label={d?.menu.label}
                    className="hidden lg:flex lg:items-center gap-3 ml-2 text-xs xl:gap-5 xl:ml-6 xl:text-sm"
                >
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                scroll={false}
                                aria-current={
                                    isActive ? 'page' : undefined
                                }
                                className={cn(
                                    'transition-colors hover:text-yellow-500',
                                    isActive
                                        ? 'text-yellow-500 font-semibold underline underline-offset-4'
                                        : 'text-foreground'
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                {/* sign in */}
                <div className="flex flex-row items-center justify-center space-x-3 ml-auto">
                    <SignInButton />
                    {/* user info rendering */}

                    <div className="flex lg:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size={'icon'}>
                                    <Globe width={20} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>
                                    {d?.translator.select_lang}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={locale}
                                    onValueChange={changeLocale}
                                >
                                    <DropdownMenuRadioItem value="ca">
                                        {d?.language?.ca}
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="es">
                                        {d?.language?.es}
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="en">
                                        {d?.language?.en}
                                    </DropdownMenuRadioItem>

                                    <DropdownMenuRadioItem value="fr">
                                        {d?.language?.fr}
                                    </DropdownMenuRadioItem>
                                    {/* <DropdownMenuRadioItem value="ary">
                            {d?.language?.ary}
                        </DropdownMenuRadioItem> */}
                                    <DropdownMenuRadioItem value="zgh">
                                        {d?.language?.zgh}
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="hidden lg:flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    <Globe className="mr-3" />
                                    {locale === 'es' && d?.language?.es}
                                    {locale === 'ca' && d?.language?.ca}
                                    {locale === 'en' && d?.language?.en}
                                    {/* {locale === 'ary' && d?.language?.ary} */}
                                    {locale === 'fr' && d?.language?.fr}
                                    {locale === 'zgh' && d?.language?.zgh}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>
                                    {d?.translator.select_lang}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={locale}
                                    onValueChange={changeLocale}
                                >
                                    <DropdownMenuRadioItem value="ca">
                                        {d?.language?.ca}
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="es">
                                        {d?.language?.es}
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="en">
                                        {d?.language?.en}
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="fr">
                                        {d?.language?.fr}
                                    </DropdownMenuRadioItem>
                                    {/* <DropdownMenuRadioItem value="ary">
                            {d?.language?.ary}
                        </DropdownMenuRadioItem> */}
                                    <DropdownMenuRadioItem value="zgh">
                                        {d?.language?.zgh}
                                    </DropdownMenuRadioItem>
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
                        className="absolute top-full left-3 bg-text-accent py-4 px-10 z-10 rounded-xl lg:hidden"
                    >
                        <ul className="space-y-2 mt-2">
                            {user?.email?.includes('test' || 'alp') && (
                                <Button onClick={handleEmail}>
                                    send test email
                                </Button>
                            )}
                            {navItems.map((item) => (
                                <li key={item.key}>
                                    <Link href={item.href} scroll={false}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
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
        </>
    );
};

export default AppBar;
