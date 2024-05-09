import { useCallback, useMemo } from 'react';
import { ContributionLanguageRelations } from './TranslatorConfig';
import { DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';

interface LanguageSelectorDropdownProps {
    isSourceLanguage: boolean;
	sourceLanguage: string;
}

export const LanguageSelectorDropdown = ({
    isSourceLanguage,sourceLanguage,
}: LanguageSelectorDropdownProps) => {
    const contributeLanguages = useMemo(
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

    useCallback(
        (isSourceLanguage: boolean) => {
            let availableLanguages = isSourceLanguage
                ? Object.keys(ContributionLanguageRelations)
                : ContributionLanguageRelations[sourceLanguage] || [];

            return availableLanguages
                .sort((lang1, lang2) =>
                    contributeLanguages[lang1].localeCompare(contributeLanguages[lang2])
                )
                .map(languageKey => (
                    <DropdownMenuRadioItem key={languageKey} value={languageKey}>
                        {contributeLanguages[languageKey]}
                    </DropdownMenuRadioItem>
                ));
        },
        [sourceLanguage, contributeLanguages]
    );

    const sortedLanguages = useMemo(() => getSortedLanguages(true), [getSortedLanguages]);

    return (
        <div>
            {sortedLanguages}
        </div>
    );
};
