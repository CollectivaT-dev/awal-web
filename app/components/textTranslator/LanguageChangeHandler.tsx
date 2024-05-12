import { Dispatch, SetStateAction } from 'react';
import { ContributionLanguageRelations } from './TranslatorConfig';

interface HandleLanguageChangeProps {
    isSourceLanguage: boolean;
    sourceLanguage: string;
    targetLanguage: string;
    setSourceLanguage: Dispatch<SetStateAction<string>>;
    setTargetLanguage: Dispatch<SetStateAction<string>>;
    setRightRadioValue: Dispatch<SetStateAction<string>>;
    setLeftRadioValue: Dispatch<SetStateAction<string>>;
}
const getNextLanguage = (
    currentLanguage: string,
    availableLanguages: string[],
) => {
    if (availableLanguages.length === 0) return 'ca';
    const currentIndex = availableLanguages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    return availableLanguages[nextIndex];
};

export const HandleLanguageChange = (params: HandleLanguageChangeProps) => {
    return (newLanguage: string) => {
        const {
            sourceLanguage,
            targetLanguage,
            isSourceLanguage,
            setSourceLanguage,
            setTargetLanguage,
            setRightRadioValue,
            setLeftRadioValue,
        } = params;
        // Always set the language based on whether it's source or target
        if (isSourceLanguage) {
            setSourceLanguage(newLanguage);
        } else {
            setTargetLanguage(newLanguage);
        }

        // Now handle the language-dependent logic
        if (isSourceLanguage) {
            const availableTargetLanguages =
                ContributionLanguageRelations[newLanguage] || [];
            if (!availableTargetLanguages.includes(targetLanguage)) {
                setTargetLanguage(availableTargetLanguages[0] || 'ca'); // Default to 'ca' if no valid target found
            }
            if (!['zgh', 'ber'].includes(newLanguage)) {
                setLeftRadioValue(''); // Reset the left radio value if the new language is not 'zgh' or 'ber'
            }
        } else {
            const availableSourceLanguages = Object.keys(
                ContributionLanguageRelations,
            ).filter((key) =>
                ContributionLanguageRelations[key].includes(newLanguage),
            );
            if (!availableSourceLanguages.includes(sourceLanguage)) {
                const nextLanguage = getNextLanguage(
                    sourceLanguage,
                    availableSourceLanguages,
                );
                setSourceLanguage(nextLanguage); // Update source language if the current one isn't available
            }
            if (!['zgh', 'ber'].includes(newLanguage)) {
                setRightRadioValue(''); // Reset the right radio value if the new language is not 'zgh' or 'ber'
            }
        }
    };
};
