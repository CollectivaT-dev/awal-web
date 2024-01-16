'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
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

import {
    ContributionLanguageRelations,
    getLanguageCode,
} from '../TranslatorConfig';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';

import { AlertDialog, AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import {
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContributeCompProps {
    userId: string;
}

const ContributeComp: React.FC<ContributeCompProps> = ({ userId }) => {
    const [sourceText, setSourceText] = useState('');
    const [targetText, setTargetText] = useState('');
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    const [fetchedText, setFetchedText] = useState('');
    const [randomClicked, setRandomClicked] = useState(false);
    const [translateClicked, setTranslateClicked] = useState(false);
    const levenshtein = require('js-levenshtein');
    const { data: session } = useSession();
    const [entryScore, setEntryScore] = useState(0);
    const [initialTranslatedText, setInitialTranslatedText] = useState('');

    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);

    const [sourceLanguage, setSourceLanguage] = useState(
        localStorage.getItem('sourceLanguage') || 'ca',
    );
    const [targetLanguage, setTargetLanguage] = useState(
        localStorage.getItem('targetLanguage') || 'es',
    );
    const [tgtVar, setLeftRadioValue] = useState(
        localStorage.getItem('tgtVar') || '',
    );
    const [srcVar, setRightRadioValue] = useState(
        localStorage.getItem('srcVar') || '',
    );
    const [totalScore, setTotalScore] = useState(session?.user?.score || 0);

    // check if the user modified the machine translation, if they used the translate button, this is done simply checking if the contribution field has any manual changes
    const [translated, setTranslated] = useState(false);
    const router = useRouter();
    console.log(session);
    const { update: sessionUpdate } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    // read from local storage

    useEffect(() => {
        localStorage.setItem('sourceLanguage', sourceLanguage);
        localStorage.setItem('targetLanguage', targetLanguage);
        localStorage.setItem('tgtVar', tgtVar);
        localStorage.setItem('srcVar', srcVar);
    }, [sourceLanguage, targetLanguage, tgtVar, srcVar]);

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
                                    onCheckedChange={() => {
                                        side === 'left'
                                            ? setRightRadioValue(value)
                                            : setLeftRadioValue(value);
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

    // check point
    useEffect(() => {
        console.log('Left Radio Value:', srcVar);
        console.log('Right Radio Value:', tgtVar);
    }, [tgtVar, srcVar]);
    // Update target language options when source language changes
    useEffect(() => {
        const updateLanguages = () => {
            const relatedToSource =
                ContributionLanguageRelations[sourceLanguage] || [];
            const relatedToTarget =
                ContributionLanguageRelations[targetLanguage] || [];

            if (!relatedToSource.includes(targetLanguage)) {
                setTargetLanguage(
                    relatedToSource.length > 0 ? relatedToSource[0] : '',
                );
            } else if (!relatedToTarget.includes(sourceLanguage)) {
                setSourceLanguage(
                    relatedToTarget.length > 0 ? relatedToTarget[0] : '',
                );
            }
        };

        updateLanguages();
    }, [sourceLanguage, targetLanguage]);

    const contributeLanguages: { [key: string]: string } = useMemo(
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
    const getNextLanguage = (
        currentLanguage: string,
        availableLanguages: string[],
    ) => {
        if (availableLanguages.length === 0) return 'ca';
        const currentIndex = availableLanguages.indexOf(currentLanguage);
        const nextIndex = (currentIndex + 1) % availableLanguages.length;
        return availableLanguages[nextIndex];
    };

    const handleSourceLanguageChange = (language: string) => {
        setSourceLanguage(language);
        const availableTargetLanguages =
            ContributionLanguageRelations[language] || [];
        if (!availableTargetLanguages.includes(targetLanguage)) {
            setTargetLanguage(availableTargetLanguages[0] || 'ca');
        }
        // Resetting the dialect selection
        if (!['zgh', 'ber'].includes(language)) setLeftRadioValue('');
    };

    const handleTargetLanguageChange = (language: string) => {
        setTargetLanguage(language);
        const availableSourceLanguages = Object.keys(
            ContributionLanguageRelations,
        ).filter((key) =>
            ContributionLanguageRelations[key].includes(language),
        );
        if (!availableSourceLanguages.includes(sourceLanguage)) {
            setSourceLanguage(
                getNextLanguage(sourceLanguage, availableSourceLanguages),
            );
        }
        // Resetting the dialect selection
        if (!['zgh', 'ber'].includes(language)) setRightRadioValue('');
    };

    const renderLanguageOptions = useCallback(
        (isSourceLanguage: boolean) => {
            let availableLanguages = isSourceLanguage
                ? Object.keys(ContributionLanguageRelations)
                : ContributionLanguageRelations[sourceLanguage] || [];

            return availableLanguages
                .sort((a, b) =>
                    contributeLanguages[a].localeCompare(
                        contributeLanguages[b],
                    ),
                )
                .map((key) => (
                    <DropdownMenuRadioItem key={key} value={key}>
                        {contributeLanguages[key]}
                    </DropdownMenuRadioItem>
                ));
        },
        [sourceLanguage, contributeLanguages],
    );

    // src_text generate get route
    const handleGenerate = async () => {
        setRandomClicked(true);
        const srcLanguageCode = getLanguageCode(sourceLanguage);
        console.log(srcLanguageCode);
        const config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `${process.env.NEXT_PUBLIC_API_URL}/translate/random/${srcLanguageCode}`,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        try {
            const res = await axios.request(config);
            console.log(res.data.sentence);
            setSourceText(res.data.sentence);
            setFetchedText(res.data.sentence);
        } catch (error) {
            console.log(error);
        }
    };

    // contribution score calc logic
    useEffect(() => {
        let distance = 0;
        if (targetText.length === 0 && translated) {
            setTranslateClicked(false);
            distance = 0;
        }
        let comparisonText = translateClicked ? initialTranslatedText : '';
        distance = levenshtein(comparisonText, targetText);
        let srcScore = randomClicked ? 0 : sourceText.length;
        setEntryScore(srcScore + distance);
        setTotalScore((prevScore) => prevScore + srcScore + distance);

        console.log(srcScore);
        console.log(distance);

        console.log(totalScore);
    }, [
        initialTranslatedText,
        targetText,
        translated,
        randomClicked,
        sourceText,
        translateClicked,
    ]);
    console.log('fetchedText', fetchedText);
    console.log('entryScore', entryScore);
    console.log('totalScore', totalScore);
    console.log('randomClicked', randomClicked);
    console.log('transclicked', translateClicked);
    console.log('translated', translated);

    // contribution post route
    const handleContribute = async () => {
        const srcLanguageCode = getLanguageCode(sourceLanguage);
        const tgtLanguageCode = getLanguageCode(targetLanguage);
        const contributionPoint = entryScore;
        if (translateClicked && !translated) {
            toast.error(`${d?.toasters.alert_no_modify}`);
            return;
        }
        const data = {
            src: srcLanguageCode,
            tgt: tgtLanguageCode,
            src_text: sourceText,
            tgt_text: targetText,
            contributionPoint,
            userId,
            srcVar,
            tgtVar,
        };
        // input length check
        if (data.src_text.length === 0 || data.tgt_text.length === 0) {
            toast.error(`${d?.toasters.alert_no_text}`);
            return;
        }
        if (
            ((srcLanguageCode === 'ber' || srcLanguageCode === 'zgh') &&
                !srcVar) ||
            ((tgtLanguageCode === 'ber' || tgtLanguageCode === 'zgh') &&
                !tgtVar)
        ) {
            toast.error(`${d?.toasters.select_var}`);
            return;
        }
        console.log(data);
        if (data.userId.length === 0) {
            router.push('/signIn', { scroll: false });
        }
        try {
            setIsLoading(true);
            const res = await axios.post(
                `/api/contribute`,
                JSON.stringify(data),
            );

            toast.success(
                <span>
                    {d?.toasters.success_contribution}{' '}
                    <span className="font-bold text-clay-500">
                        {contributionPoint}
                    </span>{' '}
                    {d?.toasters.success_contribution_points}
                </span>,
            );
            router.refresh();
            if (res.status === 200) {
                setSourceText('');
                setTargetText('');
                setTranslateClicked(false);
                setRandomClicked(false);
                setTranslated(false);
            }
            const updatedUser = res.data;
            console.log(res.data.score);
            sessionUpdate({ user: updatedUser });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
        setTimeout(async () => {
            const updatedSession = await getSession();
            console.log(updatedSession);
        }, 1000); // Delay of 1 second
    };

    // machine translation route
    const handleTranslate = async () => {
        if (!sourceText || sourceLanguage === targetLanguage) {
            setTargetText('');
            setTranslateClicked(true);
            setTranslated(false);
            return;
        }
        setTranslateClicked(true);
        setTranslated(false);

        const srcLanguageCode = sourceLanguage;
        const tgtLanguageCode = targetLanguage;

        // send request data differently according to line break: (text or batch ['',''])
        let requestData;
        // remove the last line if there are any \n
        const processedSource = sourceText.replace(/\n$/, '');

        if (sourceText.includes('\n') && !sourceText.endsWith('\n')) {
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
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.NEXT_PUBLIC_API_URL}/translate/`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestData,
        };
        try {
            const response = await axios.request(config);
            setInitialTranslatedText(response.data.translation);

            console.log(response.data);
            // Check if response data is an array
            if (Array.isArray(response.data.translation)) {
                // If it's an array, join the array elements with a newline character to form a string
                setTargetText(response.data.translation.join('\n'));
            } else {
                // If it's not an array, assume it's a string and set it directly
                setTargetText(response.data.translation);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleReport = async () => {
        toast.error('Report not yet implemented');
    };

    return (
        <div className="text-translator ">
            <div className="flex flex-row justify-center items-baseline px-10 space-x-10">
                <div className="w-1/2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mb-5" asChild>
                            <Button
                                variant="outline"
                                className="text-text-primary  bg-transparent border-text-primary"
                            >
                                {contributeLanguages[sourceLanguage]}
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

                    <div className="relative">
                        <Textarea
                            value={sourceText}
                            className="border border-gray-300 h-[50vh] rounded-md shadow"
                            placeholder={
                                d?.translator.placeholder.type_to_translate
                            }
                            id="src_message"
                            onChange={(e) => setSourceText(e.target.value)}
                        />

                        <Button
                            variant={'outline'}
                            className="absolute bottom-2 right-2"
                            onClick={() => {
                                setSourceText('');
                                setRandomClicked(false);
                            }}
                        >
                            {d?.btn.clear}
                        </Button>
                    </div>

                    {renderRadioGroup('left')}
                    <div className="flex flex-row justify-between items-center pt-10 w-full">
                        <div className="flex flex-row space-x-3">
                            <Button
                                onClick={handleGenerate}
                                variant="default"
                                className="rounded-full bg-text-secondary"
                            >
                                {d?.translator.generate}
                            </Button>
                            <Button
                                onClick={handleTranslate}
                                variant="default"
                                className="rounded-full bg-text-primary"
                            >
                                {d?.translator.translate}
                            </Button>
                        </div>
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
                                    {contributeLanguages[targetLanguage]}
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
                                    {d?.how_to_contribute_heading}
                                    <HelpCircle className="ml-2" size={15} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="flex flex-col  max-h-[50%] overflow-auto">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center justify-center">
                                        <h4 className="text-sm font-semibold capitalize">
                                            {d?.translator.help_pop_up.header}
                                        </h4>
                                    </AlertDialogTitle>
                                </AlertDialogHeader>{' '}
                                <div className="flex-grow overflow-auto">
                                    <AlertDialogDescription className="text-left whitespace-pre-wrap">
                                        {d?.how_it_works_contribution}
                                        <ol className="list-disc space-y-2 my-4 mx-5 flex-row ">
                                            <li>
                                                {d?.how_it_works_contribution_1}
                                            </li>
                                            <li>
                                                {d?.how_it_works_contribution_2}
                                            </li>
                                            <li>
                                                {d?.how_it_works_contribution_3}
                                            </li>
                                            <li>
                                                {d?.how_it_works_contribution_4}
                                            </li>
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
                    <div className="relative">
                        <Textarea
                            id="tgt_message"
                            className="border border-gray-300 rounded-md h-[50vh] shadow"
                            placeholder={
                                d?.translator.placeholder.translation_box
                            }
                            value={targetText}
                            onChange={(e) => {
                                setTargetText(e.target.value);
                                setTranslated(true);
                            }}
                        />

                        <Button
                            variant={'outline'}
                            className="absolute bottom-2 right-2"
                            onClick={() => {
                                setTargetText('');
                                setTranslateClicked(false); // Reset because the translation is cleared
                                setTranslated(false);
                            }}
                        >
                            {d?.btn.clear}
                        </Button>
                    </div>

                    {renderRadioGroup('right')}
                    <div className="flex justify-end mt-10">
                        <Button
                            variant={'default'}
                            onClick={handleContribute}
                            className="rounded-full bg-text-primary"
                        >
                            {d?.btn.contribute}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex flex-col bg-[#EFBB3F] w-1/3 rounded-md shadow-sm px-4 py-5 ml-10 mb-5">
                <h1 className="font-bold capitalize">
                    {d?.text_with_link.dic_link.text_before_link}
                </h1>
                <Link href={'https://www.amazic.cat/'} target="_blank">
                    {d?.text_with_link.dic_link.link_text_1}
                </Link>
                <Link
                    href={'https://tal.ircam.ma/dglai_new/'}
                    target="_blank"
                    scroll={false}
                >
                    {d?.text_with_link.dic_link.link_text_2}
                </Link>
                <Link
                    href={'https://amazigh.moroccanlanguages.com/'}
                    target="_blank"
                    scroll={false}
                >
                    {d?.text_with_link.dic_link.link_text_3}
                </Link>
            </div>
        </div>
    );
};

export default ContributeComp;
