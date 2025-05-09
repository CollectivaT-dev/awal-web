'use client';
import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { ChevronDown, Loader } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import debounce from 'lodash.debounce';

import { LanguageRelations } from '../TranslatorConfig';
import { useSession } from 'next-auth/react';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import Link from 'next/link';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { CopyButton } from '../../../../components/CopyButton';
import { handleTranslate } from './translationUtils';
import { DebouncedFunc } from 'lodash';

const TextTranslator = () => {
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
    const { data: session } = useSession();
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('ca');
    const [targetLanguage, setTargetLanguage] = useState('zgh');
    const [isLoading, setIsLoading] = useState(false);
    const translationRequestIdRef = useRef<number | null>(null);

    const translateLanguages: { [key: string]: string } = {
		ar:"لعربية الفصحى",
        ca: 'Català',
        en: 'English',
        zgh: 'ⵜⴰⵎⴰⵣⵉⵖⵜ',
        ber: 'Tamaziɣt',
        es: 'Español',
        fr: 'Français',
        ary: 'الدارجة',
    };

    // Define language relations

    // Function to get the next available language
    const getNextLanguage = (currentLanguage: string) => {
        const languages = LanguageRelations[currentLanguage];
        const defaultIndex = languages.indexOf('en');
        const nextIndex =
            (languages.indexOf(targetLanguage) + 1) % languages.length;
        return languages[nextIndex === -1 ? defaultIndex : nextIndex];
    };

    // Function to render language options
    const renderLanguageOptions = (
        currentLanguage: string,
        isSource: boolean,
    ) => {
        let languages = isSource
            ? Object.keys(LanguageRelations)
            : LanguageRelations[currentLanguage];

        // Sort languages alphabetically based on their display names
        languages.sort((a, b) =>
            translateLanguages[a].localeCompare(translateLanguages[b]),
        );

        return languages.map((lang) => (
            <DropdownMenuRadioItem key={lang} value={lang}>
                {translateLanguages[lang]}
            </DropdownMenuRadioItem>
        ));
    };

    // Handlers for language selection
    const handleSourceLanguageChange = (newLanguage: string) => {
        setSourceLanguage(newLanguage);
        if (newLanguage === targetLanguage) {
            setTargetLanguage(getNextLanguage(newLanguage));
        }
    };

    const handleTargetLanguageChange = (newLanguage: string) => {
        setTargetLanguage(newLanguage);
        if (newLanguage === sourceLanguage) {
            setSourceLanguage(getNextLanguage(newLanguage));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        setSource(inputValue);
        if (!inputValue) {
            setTarget('');
        }
    };

    useEffect(() => {
        if (!LanguageRelations[sourceLanguage].includes(targetLanguage)) {
            const firstAvailableLanguage = Object.keys(LanguageRelations).find(
                (key) =>
                    key !== sourceLanguage && LanguageRelations[key].length > 0,
            );
            if (firstAvailableLanguage) {
                setTargetLanguage(firstAvailableLanguage);
            }
        }
    }, [sourceLanguage, targetLanguage]);
    //' reusable comps
    const SrcLangSelection = () => (
        <DropdownMenu>
            <DropdownMenuTrigger className="mb-5" asChild>
                <Button
                    variant="outline"
                    className="text-text-primary bg-transparent border-text-primary"
                >
                    {translateLanguages[sourceLanguage]}
                    <ChevronDown className="pl-2 " />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#EFBB3F] border-[#EFBB3F] text-text-primary">
                <DropdownMenuLabel>
                    {d?.translator.select_lang}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-text-primary" />
                <DropdownMenuRadioGroup
                    value={sourceLanguage}
                    onValueChange={handleSourceLanguageChange}
                >
                    {renderLanguageOptions(sourceLanguage, true)}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
    const TgtLanguageSelection = () => (
        <DropdownMenu>
            <DropdownMenuTrigger className="mb-5" asChild>
                <Button
                    variant="outline"
                    className="text-text-primary  bg-transparent border-text-primary"
                >
                    {translateLanguages[targetLanguage]}
                    <ChevronDown className="pl-2 " />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#EFBB3F] border-[#EFBB3F] text-text-primary">
                <DropdownMenuLabel>
                    {d?.translator.select_lang}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-text-primary" />
                <DropdownMenuRadioGroup
                    value={targetLanguage}
                    onValueChange={handleTargetLanguageChange}
                >
                    {renderLanguageOptions(sourceLanguage, false)}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
    // useMemo ensures that the debounce function is only recreated when one of its dependencies (source, sourceLanguage, targetLanguage, translationRequestIdRef, setTarget, or setIsLoading) changes. Without useMemo, the debounce function would be recreated on every render, potentially leading to unnecessary performance overhead.
    const debouncedHandleTranslate: DebouncedFunc<() => Promise<void>> =
        useMemo(
            () =>
                debounce(
                    () =>
                        handleTranslate({
                            source,
                            sourceLanguage,
                            targetLanguage,
                            translationRequestIdRef,
                            setTarget,
                            setIsLoading,
                        }),
                    // debounce times = 1s
                    1000,
                ),
            [
                source,
                sourceLanguage,
                targetLanguage,
                translationRequestIdRef,
                setTarget,
                setIsLoading,
            ],
        );

    // Use the debounced function in useEffect
    useEffect(() => {
        debouncedHandleTranslate();
        return () => {
            debouncedHandleTranslate.cancel(); // Cancel the debounced function on unmount or dependency change
        };
    }, [debouncedHandleTranslate]);
    return (
        <>
            {isAboveLgScreen ? (
                <div className="text-translator min-h-screen">
                    <div className="flex flex-row justify-center items-center px-10 mb-5 space-x-10">
                        <div className="w-1/2">
                            <SrcLangSelection />
                            <Textarea
                                value={source}
                                onChange={handleInputChange}
                                className=" bg-gray-100 h-[50vh] text-text-primary rounded-md shadow-sm"
                                placeholder={
                                    d?.translator.placeholder.type_to_translate
                                }
                                id="message"
                            />
                        </div>

                        <div className="w-1/2 ">
                            <div className="flex flex-row justify-between items-center">
                                <TgtLanguageSelection />
                                <CopyButton text={target} d={d} />
                            </div>
                            <div className="relative">
                                <Textarea
                                    id="message"
                                    value={target}
                                    className="bg-gray-200 h-[50vh] text-text-primary rounded-md shadow-sm"
                                    placeholder={
                                        d?.translator.placeholder
                                            .translation_box
                                    }
                                    readOnly
                                />
                                {isLoading && (
                                    <span className="absolute bottom-2 right-2">
                                        <Loader
                                            className="animate-spin text-yellow-500"
                                            size={40}
                                        />
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-col-center mt-5">
                        <h2 className="text-sm md:text-xl font-semibold w-[33%] lg:w-1/2 mt-10 text-center">
                            {d?.translator.notice}
                        </h2>
                        {!session && (
                            <div className="mt-5">
                                <Link href={'/register'}>
                                    <Button>{d?.nav.signUp}</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // mobile view
                <div className="text-translator min-h-screen">
                    <div className="flex-col-center px-10">
                        <div className="w-full mb-5">
                            <SrcLangSelection />
                            <Textarea
                                value={source}
                                onChange={handleInputChange}
                                className=" bg-gray-100 h-auto text-text-primary rounded-md shadow-sm"
                                placeholder={
                                    d?.translator.placeholder.type_to_translate
                                }
                                id="message"
                            />
                        </div>

                        <div className="w-full">
                            <div className="flex flex-row justify-between items-center">
                                <TgtLanguageSelection />
                                <CopyButton text={target} d={d} />
                            </div>
                            <div className="relative">
                                <Textarea
                                    id="message"
                                    value={target}
                                    className="bg-gray-200 h-auto text-text-primary rounded-md shadow-sm"
                                    placeholder={
                                        d?.translator.placeholder
                                            .translation_box
                                    }
                                    readOnly
                                />
                                {isLoading && (
                                    <span className="absolute bottom-2 right-2">
                                        <Loader
                                            className="animate-spin text-yellow-500"
                                            size={40}
                                        />
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-col-center mt-5">
                        <h2 className="text-md font-semibold min-w-full p-10 text-center">
                            {d?.translator.notice}
                        </h2>
                        {!session && (
                            <div className="mt-5">
                                <Link href={'/register'}>
                                    <Button>{d?.nav.signUp}</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default TextTranslator;
