'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Copy, Loader, Loader2 } from 'lucide-react';
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
import axios from 'axios';

import { LanguageRelations } from '../TranslatorConfig';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import Link from 'next/link';

const TextTranslator = () => {
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);
    const { data: session } = useSession();
    console.log(session);
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('ca');
    const [targetLanguage, setTargetLanguage] = useState('zgh');
    const [isLoading, setIsLoading] = useState(false);
    const translationRequestIdRef = useRef<number | null>(null);

    const translateLanguages: { [key: string]: string } = {
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

    const handleCopy = () => {
        if (target) {
            navigator.clipboard
                .writeText(target)
                .then(() => {
                    toast.success(`${d?.toasters.success_copy}`);
                })
                .catch((err) => {
                    console.error(`${d?.toasters.alert_try_again}`, err);
                    toast.error(`${d?.toasters.alert_copy}`);
                });
        }
    };
    const handleTranslate = useCallback(async () => {
        if (!source || sourceLanguage === targetLanguage) {
            setTarget('');
            setIsLoading(false);
            return;
        }
        const srcLanguageCode = sourceLanguage;
        const tgtLanguageCode = targetLanguage;

        // send request data differently according to line break: (text or batch ['',''])
        let requestData;
        // remove the last line if there are any \n
        const processedSource = source.replace(/\n$/, '');

        if (source.includes('\n') && !source.endsWith('\n')) {
            requestData = {
                src: srcLanguageCode,
                tgt: tgtLanguageCode,
                batch: processedSource.split('\n'),
                token: process.env.NEXT_PUBLIC_API_TOKEN,
            };
        } else {
            requestData = {
                src: srcLanguageCode,
                tgt: tgtLanguageCode,
                text: processedSource,
                token: process.env.NEXT_PUBLIC_API_TOKEN,
            };
        }
        console.log(requestData?.batch);
        console.log(source);
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.NEXT_PUBLIC_API_URL}/translate/`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestData,
        };

        const currentTranslationRequestId = Date.now();
        translationRequestIdRef.current = currentTranslationRequestId;

        try {
            setIsLoading(true);
            const response = await axios.request(config);
            console.log(response.data);
            if (
                currentTranslationRequestId === translationRequestIdRef.current
            ) {
                if (Array.isArray(response.data.translation)) {
                    setTarget(response.data.translation.join('\n'));
                } else {
                    setTarget(response.data.translation);
                }
            }
        } catch (error) {
            console.log('Error:', error);
        } finally {
            if (
                currentTranslationRequestId === translationRequestIdRef.current
            ) {
                setIsLoading(false);
            }
        }
    }, [source, sourceLanguage, targetLanguage]);

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

    useEffect(() => {
        handleTranslate();
    }, [source, sourceLanguage, targetLanguage]);

    return (
        <div className="text-translator min-h-screen">
            <div className="flex flex-row justify-center items-center px-10 mb-5 space-x-10">
                <div className="w-1/2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mb-5" asChild>
                            <Button
                                variant="outline"
                                className="text-text-primary  bg-transparent border-text-primary"
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
                    <Textarea
                        value={source}
                        onChange={handleInputChange}
                        className=" bg-gray-100 h-[50vh] text-text-primary rounded-md shadow"
                        placeholder={
                            d?.translator.placeholder.type_to_translate
                        }
                        id="message"
                    />
                </div>

                <div className="w-1/2 ">
                    <div className="flex flex-row justify-between items-center">
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
                                    {renderLanguageOptions(
                                        sourceLanguage,
                                        false,
                                    )}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size={'icon'} onClick={handleCopy}>
                            <Copy size={20} />
                        </Button>
                    </div>
                    <div className="relative">
                        <Textarea
                            id="message"
                            value={target}
                            className="bg-gray-200 h-[50vh] text-text-primary rounded-md shadow"
                            placeholder={
                                d?.translator.placeholder.translation_box
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
                <h2 className="text-sm mobile:text-xl font-semibold w-[33%] mobile:w-1/2 mt-10">
                    {d?.translator.notice}
                </h2>
                {!session && (
                    <div className="mt-5">
                        <Link href={'register'}>
                            <Button>{d?.nav.signUp}</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextTranslator;
