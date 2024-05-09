'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Eraser, HelpCircle } from 'lucide-react';
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
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import {
    HandleTranslate,
    HandleGenerate,
    EntryScoreCalc,
} from './contributorUtils';
import { LanguageRadioGroup } from './LanguageRadioGroup';
import { LanguageSelectorDropdown } from '../LanguageSelectorDropdown';
interface ContributeCompProps {
    userId: string;
    username: string;
}

const ContributeComp: React.FC<ContributeCompProps> = ({
    userId,
    username,
}) => {
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
            setD(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);

    const [sourceLanguage, setSourceLanguage] = useState(
        localStorage.getItem('sourceLanguage') ?? 'ca',
    );
    const [targetLanguage, setTargetLanguage] = useState(
        localStorage.getItem('targetLanguage') ?? 'es',
    );
    const [tgtVar, setLeftRadioValue] = useState(
        localStorage.getItem('tgtVar') ?? '',
    );
    const [srcVar, setRightRadioValue] = useState(
        localStorage.getItem('srcVar') ?? '',
    );
    const [totalScore, setTotalScore] = useState(session?.user?.score || 0);

    // check if the user modified the machine translation, if they used the translate button, this is done simply checking if the contribution field has any manual changes
    const [translated, setTranslated] = useState(false);
    const router = useRouter();
    //console.log(session);
    const { update: sessionUpdate } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    // read from local storage
    useEffect(() => {
        localStorage.setItem('sourceLanguage', sourceLanguage);
        localStorage.setItem('targetLanguage', targetLanguage);
        localStorage.setItem('tgtVar', tgtVar);
        localStorage.setItem('srcVar', srcVar);
    }, [sourceLanguage, targetLanguage, tgtVar, srcVar]);

    // check point
    // useEffect(() => {
    //     //console.log('Left Radio Value:', srcVar);
    //     //console.log('Right Radio Value:', tgtVar);
    // }, [tgtVar, srcVar]);
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

    // contribution score calc logic
    useEffect(() => {
        EntryScoreCalc({
            targetText,
            sourceText,
            translated,
            initialTranslatedText,
            translateClicked,
            setTranslateClicked,
            randomClicked,
            setEntryScore,
            setTotalScore,
        });
    }, [
        initialTranslatedText,
        targetText,
        translated,
        randomClicked,
        sourceText,
        translateClicked,
    ]);

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
            username,
            srcVar,
            tgtVar,
        };
        // input length check
        if (data.src_text.length === 0 || data.tgt_text.length === 0) {
            toast.error(`${d?.toasters.alert_no_text}`);
            return;
        }
        // if (
        //     ((srcLanguageCode === 'ber' || srcLanguageCode === 'zgh') &&
        //         !srcVar) ||
        //     ((tgtLanguageCode === 'ber' || tgtLanguageCode === 'zgh') &&
        //         !tgtVar)
        // ) {
        //     toast.error(`${d?.toasters.select_var}`);
        //     return;
        // }
        //console.log(data);
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
            // //console.log(res.data.score);
            sessionUpdate({ user: updatedUser });
        } catch (error) {
            //console.log(error);
        } finally {
            setIsLoading(false);
        }
        setTimeout(async () => {
            const updatedSession = await getSession();
            //console.log(updatedSession);
        }, 1000); // Delay of 1 second
    };
    const SrcLanguageSelection = () => (
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
                    {/* {LanguageSelectorDropdown({sourceLanguage,isSourceLanguage:true})} */}
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
                    {/* {LanguageSelectorDropdown({sourceLanguage,isSourceLanguage:false})} */}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
    return (
        <div className="text-translator">
            <div className="lg:flex-row flex flex-col justify-center items-baseline px-10 lg:space-x-10">
                <div className="lg:w-1/2 w-full mb-10 flex-col">
                    <div className="flex flex-row justify-between lg:items-center items-baseline">
                        <SrcLanguageSelection />
                        <Button
                            onClick={() =>
                                HandleGenerate({
                                    setRandomClicked,
                                    sourceLanguage,
                                    setSourceText,
                                    setFetchedText,
                                    d,
                                })
                            }
                            variant="default"
                            className="rounded-full bg-text-secondary"
                        >
                            {d?.translator.generate}
                        </Button>
                    </div>
                    <div className="relative">
                        <Textarea
                            value={sourceText}
                            className="border border-gray-300 lg:h-[50vh] h-auto rounded-md shadow"
                            placeholder={d?.texts.contributor_input_placeholder}
                            id="src_message"
                            onChange={(e) => setSourceText(e.target.value)}
                        />
                        {sourceText && (
                            <Button
                                size={'icon'}
                                className="absolute bottom-2 right-2"
                                onClick={() => {
                                    setSourceText('');
                                    setRandomClicked(false);
                                }}
                            >
                                <Eraser />
                            </Button>
                        )}
                    </div>
                    <div>
                        {LanguageRadioGroup({
                            side: 'left',
                            sourceLanguage,
                            targetLanguage,
                            srcVar,
                            tgtVar,
                            setLeftRadioValue,
                            setRightRadioValue,
                        })}
                    </div>
                    <div className="flex flex-row justify-between items-center w-full my-5">
                        <div className="flex flex-row space-x-3">
                            <Button
                                onClick={() =>
                                    HandleTranslate({
                                        sourceText,
                                        sourceLanguage,
                                        targetLanguage,
                                        setTargetText,
                                        setTranslateClicked,
                                        setTranslated,
                                        setInitialTranslatedText,
                                        d,
                                    })
                                }
                                variant="default"
                                className="rounded-full bg-text-primary"
                            >
                                {d?.translator.translate}
                            </Button>
                        </div>
                        {/* <Button
                            variant={'destructive'}
                            className="rounded-full bg-red-500"
                            onClick={handleReport}
                        >
                            {d?.translator.report}
                        </Button> */}
                    </div>
                </div>

                <div className="lg:w-1/2 w-full ">
                    <div className="flex flex-row justify-between lg:items-center items-baseline">
                        <TgtLanguageSelection />

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
                            <AlertDialogContent className="flex flex-col max-h-[50%] overflow-auto">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center justify-center">
                                        <h4 className="text-sm font-semibold capitalize">
                                            {d?.how_to_contribute_heading}
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
                            className="border border-gray-300 rounded-md lg:h-[50vh] h-auto shadow"
                            placeholder={
                                d?.translator.placeholder.translation_box
                            }
                            value={targetText}
                            onChange={(e) => {
                                setTargetText(e.target.value);
                                setTranslated(true);
                            }}
                        />
                        {targetText && (
                            <Button
                                size={'icon'}
                                className="absolute bottom-2 right-2"
                                onClick={() => {
                                    setTargetText('');
                                    setTranslateClicked(false); // Reset because the translation is cleared
                                    setTranslated(false);
                                }}
                            >
                                <Eraser />
                            </Button>
                        )}
                    </div>

                    {LanguageRadioGroup({
                        side: 'right',
                        sourceLanguage,
                        targetLanguage,
                        srcVar,
                        tgtVar,
                        setLeftRadioValue,
                        setRightRadioValue,
                    })}
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

            <div className="mt-10 flex flex-col bg-[#EFBB3F] lg:w-1/3 max-w-full rounded-md shadow-sm lg:px-4  p-5 lg:ml-10 mx-10 mb-5">
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
                <Link
                    href={'https://amawalwarayni.com/'}
                    target="_blank"
                    scroll={false}
                >
                    {d?.text_with_link.dic_link.link_text_4}
                </Link>
            </div>
        </div>
    );
};

export default ContributeComp;
