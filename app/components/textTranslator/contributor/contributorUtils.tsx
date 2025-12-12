import { MessagesProps } from '@/i18n';
import { Client } from "@gradio/client";
import toast from 'react-hot-toast';
import { Dispatch, SetStateAction } from 'react';
const levenshtein = require('js-levenshtein');

// Map language codes to Gradio's pretty names
const LANGUAGE_CODE_TO_GRADIO: Record<string, string> = {
    'ca': 'Catalan',
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'zgh': 'Standard Moroccan Tamazight',
    'ber': 'Tachelhit/Central Atlas Tamazight (Latin)',
    'ary': 'Moroccan Darija',
    'ar': 'Modern Standard Arabic',
    'de': 'German',
    'nl': 'Dutch',
    'ru': 'Russian',
    'it': 'Italian',
    'tr': 'Turkish',
    'eo': 'Esperanto',
};

// Map your platform's language codes to Tatoeba's 3-letter ISO 639-3 codes
const LANGUAGE_CODE_TO_TATOEBA: Record<string, string> = {
    'ca': 'cat',
    'en': 'eng',
    'es': 'spa',
    'fr': 'fra',
    'zgh': 'zgh',
    'ber': 'ber',
    'ary': 'ary',
    'ar': 'ara',
    'de': 'deu',
    'nl': 'nld',
    'ru': 'rus',
    'it': 'ita',
    'tr': 'tur',
    'eo': 'epo',
};

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

    // Convert language codes to Gradio format
    const sourceGradioLang = LANGUAGE_CODE_TO_GRADIO[sourceLanguage];
    const targetGradioLang = LANGUAGE_CODE_TO_GRADIO[targetLanguage];

    if (!sourceGradioLang || !targetGradioLang) {
        console.error(`Unsupported language: ${sourceLanguage} -> ${targetLanguage}`);
        toast.error(d?.toasters.alert_api || 'Unsupported language pair');
        return;
    }

    const translate = async () => {
        try {
            const client = await Client.connect("Tamazight-NLP/Finetuned-Quantized-NLLB");
            
            // Handle line breaks - translate each line separately if needed
            const lines = sourceText.includes('\n') 
                ? sourceText.replace(/\n$/, '').split('\n')
                : [sourceText.replace(/\n$/, '')];
            
            const translations = await Promise.all(
                lines.map(async (line) => {
                    const result = await client.predict("/predict", {
                        text: line,
                        source_lang: sourceGradioLang,
                        target_lang: targetGradioLang,
                        max_length: 400,
                        num_beams: 4,
                        repetition_penalty: 1.2,
                    });
                    return result.data;
                })
            );

            const translatedText = translations.join('\n');
            setInitialTranslatedText(translatedText);
            setTargetText(translatedText);
        } catch (error) {
            console.error('Translation error:', error);
            throw error;
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
    
    const fetchData = async () => {
        // Call our API route
        const response = await fetch(`/api/contribute/random-sentence?lang=${sourceLanguage}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch sentence');
        }

        const data = await response.json();
        
        setSourceText(data.sentence);
        setFetchedText(data.sentence);
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
