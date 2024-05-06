import axios from 'axios';

interface TranslationUtilsProps {
    source: string;
    sourceLanguage: string;
    targetLanguage: string;
    translationRequestIdRef: React.MutableRefObject<number | null>;
    setTarget: (value: string) => void;
    setIsLoading: (value: boolean) => void;
}

export const handleTranslate = async ({
    source,
    sourceLanguage,
    targetLanguage,
    translationRequestIdRef,
    setTarget,
    setIsLoading,
}: TranslationUtilsProps) => {
    if (!source || sourceLanguage === targetLanguage) {
        setTarget('');
        setIsLoading(false);
        return;
    }
    const srcLanguageCode = sourceLanguage;
    const tgtLanguageCode = targetLanguage;

    // send request data differently according to line break: (text or batch ['',''])
    const requestData = {
        src: srcLanguageCode,
        tgt: tgtLanguageCode,
        token: process.env.NEXT_PUBLIC_API_TOKEN,
        ...(source.includes('\n') && !source.endsWith('\n')
            ? { batch: source.replace(/\n$/, '').split('\n') }
            : { text: source.replace(/\n$/, '') }),
    };

    const axiosConfig = {
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
        const response = await axios.request(axiosConfig);

        if (
            currentTranslationRequestId === translationRequestIdRef.current &&
            !Array.isArray(response.data.translation)
        ) {
            setTarget(response.data.translation);
        } else {
            setTarget(response.data.translation.join('\n'));
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (currentTranslationRequestId === translationRequestIdRef.current) {
            setIsLoading(false);
        }
    }
};
