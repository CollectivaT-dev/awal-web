import { MessagesProps } from '@/i18n';
import axios from 'axios';
import { getLanguageCode } from '../TranslatorConfig';
import toast from 'react-hot-toast';
import { Dispatch, SetStateAction } from 'react';
const levenshtein = require('js-levenshtein');

interface ContributorProps {
    sourceLanguage: string;
    d?: MessagesProps;
}
interface HandleTranslateProps extends ContributorProps {
    sourceText: string;
    targetLanguage: string;
    setInitialTranslatedText: Dispatch<SetStateAction<string>>;
    setTranslateClicked: Dispatch<SetStateAction<boolean>>;
    setTranslated: Dispatch<SetStateAction<boolean>>;
    setTargetText: Dispatch<SetStateAction<string>>;
}
interface HandleGenerateProps extends ContributorProps {
    sourceLanguage: string;
    setRandomClicked: Dispatch<SetStateAction<boolean>>;
    setSourceText: Dispatch<SetStateAction<string>>;
    setFetchedText: Dispatch<SetStateAction<string>>;
}

interface EntryScoreCalcProps {
    targetText: string;
    sourceText: string;
    translated: boolean;
    initialTranslatedText: string;
    translateClicked: boolean;
    randomClicked: boolean;
    setTranslateClicked: Dispatch<SetStateAction<boolean>>;
    setEntryScore: Dispatch<SetStateAction<number>>;
    setTotalScore: Dispatch<SetStateAction<number>>;
}

export const HandleTranslate = ({
    sourceText,
    sourceLanguage,
    targetLanguage,
    setTargetText,
    setTranslateClicked,
    setTranslated,
    setInitialTranslatedText,
    d,
}: HandleTranslateProps) => {
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

    const requestData = {
        src: srcLanguageCode,
        tgt: tgtLanguageCode,
        token: process.env.NEXT_PUBLIC_API_TOKEN,
        ...(sourceText.includes('\n')
            ? { batch: sourceText.replace(/\n$/, '').split('\n') }
            : { text: sourceText.replace(/\n$/, '') }),
    };
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.NEXT_PUBLIC_API_URL}/translate/`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: requestData,
    };
    const translate = async () => {
        try {
            const response = await axios.request(config);
            setInitialTranslatedText(response.data.translation);
            // Check if response data is an array
            if (Array.isArray(response.data.translation)) {
                // If it's an array, join the array elements with a newline character to form a string
                setTargetText(response.data.translation.join('\n'));
            } else {
                // If it's not an array, assume it's a string and set it directly
                setTargetText(response.data.translation);
            }
        } catch (error) {
            //console.log('Error:', error);
        }
    };
    toast.promise(translate(), {
        loading: `${d?.toasters.translating}`,
        success: `${d?.toasters.success_translate}`,
        error: (err) => `${d?.toasters.alert_api}${console.error(err)}`,
    });
};

export const HandleGenerate = ({
    setRandomClicked,
    sourceLanguage,
    setSourceText,
    setFetchedText,
    d,
}: HandleGenerateProps) => {
    setRandomClicked(true);
    const srcLanguageCode = getLanguageCode(sourceLanguage);
    const config = {
        method: 'GET',
        maxBodyLength: Infinity,
        url: `${process.env.NEXT_PUBLIC_API_URL}/translate/random/${srcLanguageCode}`,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const fetchData = async () => {
        try {
            const res = await axios.request(config);

            setSourceText(res.data.sentence);
            setFetchedText(res.data.sentence);
        } catch (error) {}
    };
    toast.promise(fetchData(), {
        loading: `${d?.texts.loading}`,
        success: `${d?.toasters.success_loading}`,
        error: (err) => `${d?.toasters.alert_api}${console.error(err)}`,
    });
};

export const EntryScoreCalc = ({
    targetText,
    sourceText,
    translated,
    initialTranslatedText,
    translateClicked,
    randomClicked,
    setTranslateClicked,
    setEntryScore,
    setTotalScore,
}: EntryScoreCalcProps) => {
    let distance;
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

};
