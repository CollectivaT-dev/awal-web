import { MessagesProps } from '@/i18n';
import axios from 'axios';

import toast from 'react-hot-toast';
interface ContributorProps {
    sourceLanguage: string;
    targetLanguage: string;

    setTranslateClicked: (value: boolean) => void;
    setTranslated: (value: boolean) => void;
    setTargetText: (value: string) => void;
    d?: MessagesProps;
}
interface HandleTranslateProps extends ContributorProps {
    sourceText: string;
    setInitialTranslatedText: (value: string) => void;
}


export const HandleTranslate = async ({
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
