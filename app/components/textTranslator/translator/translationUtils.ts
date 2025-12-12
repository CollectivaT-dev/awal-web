import { Client } from "@gradio/client";

interface TranslationUtilsProps {
    source: string;
    sourceLanguage: string;
    targetLanguage: string;
    translationRequestIdRef: React.MutableRefObject<number | null>;
    setTarget: (value: string) => void;
    setIsLoading: (value: boolean) => void;
}

// Map your platform's language codes to Gradio's pretty names
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

    // Convert language codes to Gradio format
    const sourceGradioLang = LANGUAGE_CODE_TO_GRADIO[sourceLanguage];
    const targetGradioLang = LANGUAGE_CODE_TO_GRADIO[targetLanguage];

    if (!sourceGradioLang || !targetGradioLang) {
        console.error(`Unsupported language: ${sourceLanguage} -> ${targetLanguage}`);
        setIsLoading(false);
        return;
    }

    const currentTranslationRequestId = Date.now();
    translationRequestIdRef.current = currentTranslationRequestId;

    try {
        setIsLoading(true);
        
        const client = await Client.connect("Tamazight-NLP/Finetuned-Quantized-NLLB");
        
        const lines = source.includes('\n') 
            ? source.replace(/\n$/, '').split('\n')
            : [source.replace(/\n$/, '')];
        
        const translations = await Promise.all(
            lines.map(async (line) => {
                const result = await client.predict("/predict", {
                    text: line,
                    source_lang: sourceGradioLang,
                    target_lang: targetGradioLang,
                    max_length: 250,
                    num_beams: 1,
                    repetition_penalty: 1.2,
                });
                return result.data;
            })
        );

        if (currentTranslationRequestId === translationRequestIdRef.current) {
            setTarget(translations.join('\n'));
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (currentTranslationRequestId === translationRequestIdRef.current) {
            setIsLoading(false);
        }
    }
};
