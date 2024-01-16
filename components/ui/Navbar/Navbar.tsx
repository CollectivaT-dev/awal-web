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
import { Globe } from 'lucide-react';

const AppBar = () => {
    const { data: session, status } = useSession();
    const user = session?.user;
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    // get locale and set new local
    const { locale, setLocale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);

    const changeLocale = (newLocale: string) => {
        setLocale(newLocale);
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
    return (
        <div
            className="relative flex flex-row   items-center gap-4 p-4 " // Use flex-col and flex-row classes for responsive behavior
            ref={menuRef}
        >
            {/* menu button */}
            <motion.button
                variants={{
                    open: { rotate: 90, scale: 1 },
                    closed: { rotate: 0, scale: 1 },
                }}
                animate={open ? 'open' : 'closed'}
            >
                <Button
                    size={'icon'}
                    onClick={handleClick}
                    className="bg-transparent hover:bg-transparent mr-3"
                >
                    {open ? (
                        <Image
                            src={'/logo_line.svg'}
                            height={100}
                            width={100}
                            alt="menu_icon"
                        />
                    ) : (
                        <Image
                            src={'/logo_line.svg'}
                            height={100}
                            width={100}
                            alt="menu_icon"
                        />
                    )}
                </Button>
            </motion.button>
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
            {/* sign in */}
			<div className='flex flex-row items-center justify-center space-x-3 ml-auto'>
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
                            <Button variant="outline">
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
                    className="absolute top-full left-3 bg-text-accent py-4 px-10 z-10 rounded-xl"
                >
                    <ul className="space-y-2 mt-2">
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
                    </ul>
                </motion.div>
            )}
        </div>
    );
};

export default AppBar;
