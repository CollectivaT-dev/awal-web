'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Check,
    CheckCircle,
    ChevronDown,
    Circle,
    HelpCircle,
    X,
} from 'lucide-react';
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

import { LanguageRelations, getLanguageCode } from '../TranslatorConfig';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getSession, useSession } from 'next-auth/react';
import { Checkbox } from '@/components/ui/checkbox';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ValidateComp = () => {
    const [sourceText, setSourceText] = useState('');
    const [targetText, setTargetText] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState(
        localStorage.getItem('sourceLanguage') || 'ca',
    );
    const [targetLanguage, setTargetLanguage] = useState(
        localStorage.getItem('targetLanguage') || 'zgh',
    );
    const [srcVar, setLeftRadioValue] = useState(
        localStorage.getItem('srcVar') || '',
    );
    const [tgtVar, setRightRadioValue] = useState(
        localStorage.getItem('tgtVar') || '',
    );
    const [triggerFetch, setTriggerFetch] = useState(0);
    // Update local storage when the language or variation changes
    useEffect(() => {
        localStorage.setItem('sourceLanguage', sourceLanguage);
        localStorage.setItem('targetLanguage', targetLanguage);
        localStorage.setItem('srcVar', srcVar);
        localStorage.setItem('tgtVar', tgtVar);
    }, [sourceLanguage, targetLanguage, srcVar, tgtVar]);

    const router = useRouter();
    const { data: session, update: sessionUpdate } = useSession();
    const [entry, setEntry] = useState<any>();
    const updatedSession = async () => {
        const session = await getSession();
        console.log(session);
    };
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    console.log(session);
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);
    // render variations conditionally
    const renderRadioGroup = (side: 'left' | 'right') => {
        const languagesToRender =
            (side === 'left' && ['zgh', 'ber'].includes(sourceLanguage)) ||
            (side === 'right' && ['zgh', 'ber'].includes(targetLanguage));

        if (languagesToRender) {
            const radioGroupValue = side === 'left' ? srcVar : tgtVar;

            return (
                <RadioGroup className="grid-cols-4 mt-3 justify-start">
                    {['Central', 'Tarifit', 'Tachelhit', 'Other'].map(
                        (value) => (
                            <div
                                className="flex flex-row justify-start items-center space-x-2"
                                key={value}
                            >
                                <Checkbox
                                    value={value}
                                    id={`${value}-${side}`}
                                    checked={radioGroupValue === value}
                                    onCheckedChange={(newCheckedState) => {
                                        if (
                                            typeof newCheckedState === 'boolean'
                                        ) {
                                            const newValue = value; // 'value' is the value of the radio item
                                            side === 'left'
                                                ? setLeftRadioValue(newValue)
                                                : setRightRadioValue(newValue);
                                        }
                                    }}
                                />
                                <Label htmlFor={`${value}-${side}`}>
                                    {value}
                                </Label>
                            </div>
                        ),
                    )}
                </RadioGroup>
            );
        } else {
            return null;
        }
    };

    useEffect(() => {
        console.log('Left Radio Value:', srcVar);
        console.log('Right Radio Value:', tgtVar);
    }, [tgtVar, srcVar]);
    // Update target language options when source language changes
    useEffect(() => {
        const updateLanguages = () => {
            const relatedToSource = LanguageRelations[sourceLanguage] || [];
            const relatedToTarget = LanguageRelations[targetLanguage] || [];

            if (!relatedToSource.includes(targetLanguage)) {
                // Update target language if current target is not related to the new source
                setTargetLanguage(
                    relatedToSource.length > 0 ? relatedToSource[0] : '',
                );
            } else if (!relatedToTarget.includes(sourceLanguage)) {
                // Update source language if current source is not related to the new target
                setSourceLanguage(
                    relatedToTarget.length > 0 ? relatedToTarget[0] : '',
                );
            }
        };

        updateLanguages();
    }, [sourceLanguage, targetLanguage]);

    const validateLanguage: { [key: string]: string } = useMemo(
        () => ({
            en: 'English',
            zgh: 'ⵜⴰⵎⴰⵣⵉⵖⵜ',
            ber: 'Tamaziɣt',
            es: 'Español',
            ca: 'Català',
            fr: 'Français',
            ary: 'الدارجة',
        }),
        [],
    );

    const handleSourceLanguageChange = (language: string) => {
        setSourceLanguage(language);
        localStorage.setItem('sourceLanguage', language);
        if (!['zgh', 'ber'].includes(language)) {
            setLeftRadioValue('');
            localStorage.setItem('srcVar', '');
        }
    };

    const handleTargetLanguageChange = (language: string) => {
        setTargetLanguage(language);
        localStorage.setItem('targetLanguage', language);
        if (!['zgh', 'ber'].includes(language)) {
            setRightRadioValue('');
            localStorage.setItem('tgtVar', '');
        }
    };
    const renderLanguageOptions = useCallback(
        (isSourceLanguage: boolean) => {
            const availableLanguages = isSourceLanguage
                ? Object.keys(LanguageRelations)
                : LanguageRelations[sourceLanguage] || [];

            return availableLanguages.map((key) => (
                <DropdownMenuRadioItem key={key} value={key}>
                    {validateLanguage[key]}
                </DropdownMenuRadioItem>
            ));
        },
        [sourceLanguage, validateLanguage],
    );
    // retrieve contribution item
    console.log();
    useEffect(() => {
        const fetchData = async () => {
            const srcLangCode = getLanguageCode(sourceLanguage);
            const tgtLangCode = getLanguageCode(targetLanguage);
            const srcLangVar = srcVar;
            const tgtLangVar = tgtVar;

            console.log(srcLangCode, srcLangVar, tgtLangVar);
            const apiUrl =
                process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3000'
                    : 'https://awaldigital.org';

            try {
                const url = `${apiUrl}/api/contribute?src=${encodeURIComponent(
                    srcLangCode,
                )}&src_var=${encodeURIComponent(
                    srcLangVar,
                )}&tgt=${encodeURIComponent(
                    tgtLangCode,
                )}&tgt_var=${encodeURIComponent(tgtLangVar)}`;
                const res = await axios.get(url);

                console.log(res);
                console.log(res.status);
                console.log(res.data);
                if (res.data) {
                    setSourceText(res.data.src_text || '');
                    setTargetText(res.data.tgt_text || '');
                    setLeftRadioValue(res.data.srcVar || '');
                    setRightRadioValue(res.data.tgtVar || '');
                    setEntry(res.data);
                    toast.success('Data fetched successfully!');
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response) {
                        setSourceText('');
                        setTargetText('');
                        switch (error.response.status) {
                            case 406:
                                throw new Error(
                                    `${
                                        d?.validator.alert_no_more_entries ||
                                        'No more entries available'
                                    }`,
                                );
                            default:
                                throw new Error('Error fetching data');
                        }
                    } else {
                        // Something happened in setting up the request that triggered an error
                        throw new Error('An unexpected error occurred');
                    }
                } else {
                    // Handle non-Axios errors
                    console.error('Non-Axios error:', error);
                }
            }
        };
        toast.promise(
            fetchData(),
            {
                loading: ``,
                success: `${d?.validator.success_loading}`,
                error: (err) => err.message,
            },
            { id: 'original-get-data' },
        );
    }, [sourceLanguage, targetLanguage, triggerFetch, srcVar, tgtVar]);

    console.log(entry);
    // validate post route
    const handleValidate = async () => {
        const data = { ...entry, validatorId: session?.user?.id };
        console.log(data);

        try {
            const res = await axios.patch('/api/contribute/accept', data);
            const validationScore = 3;
            const updatedUser = res.data;
            const { score, ...userWithoutScore } = updatedUser;
            console.log(userWithoutScore);
            sessionUpdate({ user: updatedUser });
            toast.success(
                `${
                    d?.validator.success_validation.text_before_link
                }${' '}${validationScore}${' '}${
                    d?.validator.success_validation.text_after_link
                }`,
            );
        } catch (error) {
            console.log(error);
        }
        setTriggerFetch((prev) => prev + 1);
    };

    const handleRejection = async () => {
        const data = { ...entry, validatorId: session?.user?.id };
        try {
            const res = await axios.patch('/api/contribute/reject', data);
            const validationScore = 3;
            const updatedUser = res.data;
            sessionUpdate({ user: updatedUser });
            console.log(updatedUser);
            const { score, ...userWithoutScore } = updatedUser;
            console.log(userWithoutScore);
            sessionUpdate({ user: updatedUser });
            toast.success(
                `${
                    d?.validator.success_validation.text_before_link
                }${' '}${validationScore}${' '}${
                    d?.validator.success_validation.text_after_link
                }`,
            );
        } catch (error) {
            console.log(error);
            toast(
                'An error occurred during rejection handling. probly because the pair is invalid',
                {
                    icon: '❌',
                },
            );
        }
        setTriggerFetch((prev) => prev + 1);
    };
    const handleReport = async () => {
        toast.error('Report not yet implemented');
    };

    const handleNext = async () => {
        try {
            const data = {
                ...entry,
                validatorId: session?.user?.id, // Explicitly include the ID of validator
            };
            console.log(data);
            const res = await axios.patch('/api/contribute', data);
            console.log(res);
        } catch (error) {}
        setTriggerFetch((prev) => prev + 1);
    };
    return (
        <div className="text-translator">
            <div className="flex flex-row justify-center items-baseline px-10 space-x-10">
                <div className="w-1/2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mb-5" asChild>
                            <Button
                                variant="outline"
                                className="text-text-primary  bg-transparent border-text-primary"
                            >
                                {validateLanguage[sourceLanguage]}
                                <ChevronDown className="pl-2 " />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-[#EFBB3F] border-[#EFBB3F] text-text-primary">
                            <DropdownMenuLabel>
                                {d?.translator.select_lang}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={sourceLanguage}
                                onValueChange={handleSourceLanguageChange}
                            >
                                {renderLanguageOptions(true)}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Textarea
                        value={sourceText}
                        className="border border-gray-300 h-[50vh] rounded-md shadow"
                        placeholder={
                            d?.translator.placeholder.type_to_translate
                        }
                        id="src_message"
                        readOnly
                    />
                    {renderRadioGroup('left')}
                    <div className="flex flex-row justify-between items-center pt-10 w-full">
                        {/* <Button
                            onClick={handleDataFetch}
                            variant="default"
                            className="rounded-full text-text-primary bg-text-accent"
                        >
                            Frase aleat&#242;ria
                        </Button> */}
                        <Button
                            variant={'destructive'}
                            className="rounded-full bg-red-500"
                            onClick={handleReport}
                        >
                            {d?.translator.report}
                        </Button>
                    </div>
                </div>

                <div className="w-1/2 ">
                    <div className="flex flex-row justify-between items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="mb-5" asChild>
                                <Button
                                    variant="outline"
                                    className="text-text-primary  bg-transparent border-text-primary"
                                >
                                    {validateLanguage[targetLanguage]}
                                    <ChevronDown className="pl-2 " />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-[#EFBB3F] border-[#EFBB3F] text-text-primary">
                                <DropdownMenuLabel>
                                    {d?.translator.select_lang}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={targetLanguage}
                                    onValueChange={handleTargetLanguageChange}
                                >
                                    {renderLanguageOptions(false)}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size={'lg'}
                                    className="cursor-pointer rounded-3xl m-1 text-xs capitalize"
                                >
                                    {d?.how_to_validate_heading}
                                    <HelpCircle className="ml-2" size={15} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="flex flex-col max-h-[50%] overflow-hidden">
                                <AlertDialogHeader>
                                    {' '}
                                    <AlertDialogTitle className="flex items-center justify-center">
                                        <h4 className="text-sm font-semibold capitalize">
                                            {d?.translator.help_pop_up.header}
                                        </h4>
                                    </AlertDialogTitle>
                                </AlertDialogHeader>
                                <div className="flex-grow overflow-auto">
                                    <AlertDialogDescription className="text-left whitespace-pre-wrap">
                                        {d?.how_it_works_validation}
                                        <ol className="list-disc space-y-2 my-4 mx-5 flex-row ">
                                            <li>
                                                {d?.how_it_works_validation_1}
                                            </li>
                                            <li>
                                                {d?.how_it_works_validation_2}
                                                <ol className="list-disc pl-4">
                                                    <li>
                                                        {
                                                            d?.how_it_works_validation_2_1
                                                        }
                                                    </li>
                                                    <li>
                                                        {
                                                            d?.how_it_works_validation_2_2
                                                        }
                                                    </li>
                                                    <li>
                                                        {
                                                            d?.how_it_works_validation_2_3
                                                        }
                                                    </li>
                                                    <li>
                                                        {
                                                            d?.how_it_works_validation_2_4
                                                        }
                                                    </li>

                                                    <li>
                                                        {
                                                            d?.how_it_works_validation_2_5
                                                        }
                                                    </li>

                                                    <li>
                                                        {
                                                            d?.how_it_works_validation_2_6
                                                        }
                                                    </li>
                                                    <li>
                                                        {
                                                            d?.how_it_works_validation_2_6
                                                        }
                                                    </li>
                                                    <li>
                                                        {
                                                            d?.how_it_works_validation_2_7
                                                        }
                                                    </li>
                                                </ol>
                                            </li>
                                            <li>
                                                {d?.how_it_works_validation_3}
                                            </li>
                                            {
                                                d?.how_it_works_validation_continued
                                            }
                                        </ol>
                                        {d?.how_it_works_contribution_continued}
                                    </AlertDialogDescription>
                                </div>
                                <AlertDialogFooter className="flex-shrink-0">
                                    {' '}
                                    <AlertDialogCancel>
                                        {d?.btn.cancel}
                                    </AlertDialogCancel>
                                    <AlertDialogAction>
                                        {d?.btn.continue}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <Textarea
                        id="tgt_message"
                        className="border border-gray-300 h-[50vh] rounded-md shadow"
                        placeholder={d?.translator.placeholder.translation_box}
                        value={targetText}
                        onChange={(e) => setTargetText(e.target.value)}
                        readOnly
                    />

                    {renderRadioGroup('right')}
                </div>
            </div>
            <div className="flex-row-center space-x-4 my-3">
                <Check
                    className="bg-green-500 rounded-full h-10 w-10 cursor-pointer p-2"
                    onClick={handleValidate}
                />
                <X
                    className="bg-red-500 rounded-full h-10 w-10 cursor-pointer p-2"
                    onClick={handleRejection}
                />
            </div>
            <div
                className="flex items-center justify-center my-2
			"
            >
                <Button
                    variant={'default'}
                    className="cursor-pointer"
                    onClick={handleNext}
                >
                    Skip
                </Button>
            </div>
        </div>
    );
};

export default ValidateComp;
