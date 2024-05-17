import { useMemo, Dispatch, SetStateAction } from 'react';
import { ContributionLanguageRelations } from './TranslatorConfig';
import {
    DropdownMenuRadioItem,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MessagesProps } from '@/i18n';
import { ChevronDown } from 'lucide-react';
import { HandleLanguageChange } from './LanguageChangeHandler';

interface LanguageSelectorDropdownProps {
    isSourceLanguage: boolean;
    sourceLanguage: string;
}
interface LanguageSelectionDropdownProps {
    isOriginLanguage: boolean;
    d?: MessagesProps;
    sourceLanguage: string;
    targetLanguage: string;
    setSourceLanguage: Dispatch<SetStateAction<string>>;
    setTargetLanguage: Dispatch<SetStateAction<string>>;
    setTgtVar: Dispatch<SetStateAction<string>>;
    setSrcVar: Dispatch<SetStateAction<string>>;
}
interface ContributeLanguages {
    [key: string]: string;
}

export const RenderLanguageOptions = ({
    isSourceLanguage,
    sourceLanguage,
}: LanguageSelectorDropdownProps) => {
    const contributeLanguages: ContributeLanguages = useMemo(
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
    const availableLanguages = useMemo(() => {
        return isSourceLanguage
            ? Object.keys(ContributionLanguageRelations)
            : ContributionLanguageRelations[sourceLanguage] || [];
    }, [isSourceLanguage, sourceLanguage]);

    // Sort the languages
    const sortedLanguages = useMemo(() => {
        return availableLanguages.sort((lang1, lang2) =>
            contributeLanguages[lang1].localeCompare(
                contributeLanguages[lang2],
            ),
        );
    }, [availableLanguages, contributeLanguages]);

    // Map the sorted languages to components
    const languageItems = useMemo(() => {
        return sortedLanguages.map((languageKey) => (
            <DropdownMenuRadioItem key={languageKey} value={languageKey}>
                {contributeLanguages[languageKey]}
            </DropdownMenuRadioItem>
        ));
    }, [sortedLanguages, contributeLanguages]);

    return <div>{languageItems}</div>;
};

export const LanguageSelection = ({
    isOriginLanguage,
    d,
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    setTgtVar,
    setSrcVar,
}: LanguageSelectionDropdownProps) => {
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
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="mb-5" asChild>
                <Button
                    variant="outline"
                    className="text-text-primary  bg-transparent border-text-primary"
                >
                    {isOriginLanguage
                        ? contributeLanguages[sourceLanguage]
                        : contributeLanguages[targetLanguage]}
                    <ChevronDown className="pl-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#EFBB3F] border-[#EFBB3F] text-text-primary">
                <DropdownMenuLabel>
                    {d?.translator.select_lang}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    value={isOriginLanguage ? sourceLanguage : targetLanguage}
                    onValueChange={HandleLanguageChange({
                        sourceLanguage,
                        targetLanguage,
                        isSourceLanguage: isOriginLanguage,
                        setSourceLanguage,
                        setTargetLanguage,
                        setTgtVar,
                        setSrcVar,
                    })}
                >
                    {RenderLanguageOptions({
                        isSourceLanguage: isOriginLanguage,
                        sourceLanguage: sourceLanguage,
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
