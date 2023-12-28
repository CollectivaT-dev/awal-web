import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { OtherLanguagesConfig } from '@/app/(settings)/SettingsConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const languages = [
    { label: 'English', value: 'english' },
    { label: 'Spanish', value: 'spanish' },
    { label: 'Catala', value: 'catala' },
    { label: 'Arabic', value: 'arabic' },
    { label: 'French', value: 'french' },
] as const;
const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number,
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;

    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};
const OtherLanguages = ({
    sendData,
    fetchData,
}: {
    fetchData?: OtherLanguagesConfig.OtherLanguagesProps[];
    sendData: (data: OtherLanguagesConfig.OtherLanguagesGroup) => void;
}) => {
    const [selectedLanguages, setSelectedLanguages] =
        useState<OtherLanguagesConfig.OtherLanguagesProps>({
            english: false,
            spanish: false,
            catala: false,
            arabic: false,
            french: false,
        });
    const form = useForm<OtherLanguagesConfig.OtherLanguagesProps>({
        resolver: zodResolver(OtherLanguagesConfig.OtherLangFormSchema),
    });
    const debouncedSendData = useMemo(
        () => debounce((data) => sendData(data), 500),
        [sendData],
    );

    useEffect(() => {
        if (fetchData && fetchData.length > 0) {
            const languageSettings = fetchData[0];
            console.log('Fetched Data:', languageSettings); // Debug log
            const updatedLanguages = { ...selectedLanguages };
            languages.forEach((lang) => {
                updatedLanguages[lang.value] =
                    languageSettings[lang.value] || false;
            });
            setSelectedLanguages(updatedLanguages);
        }
    }, [fetchData]);

    const handleLanguageSelect = (selectedValue: string) => {
        const languageKey = languages.find(
            (lang) => lang.label === selectedValue,
        )?.value;
        if (languageKey) {
            setSelectedLanguages((prev) => ({
                ...prev,
                [languageKey]: !prev[languageKey],
            }));
        }
    };

    const handleLanguageDelete = (
        languageKey: keyof OtherLanguagesConfig.OtherLanguagesProps,
    ) => {
        setSelectedLanguages((prevLanguages) => ({
            ...prevLanguages,
            [languageKey]: false,
        }));
    };

    useEffect(() => {
        sendData({ otherLanguages: selectedLanguages });
    }, [selectedLanguages, sendData]);

    return (
        <div className="flex flex-col justify-start items-center">
            <Form {...form}>
                <FormItem className="flex flex-col">
                    <FormLabel>Choose Languages</FormLabel>
                    <select
                        onChange={(e) => handleLanguageSelect(e.target.value)}
                    >
                        <option value="">Selecciona l&apos;idioma</option>
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.label}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </FormItem>
            </Form>
            <div className="mt-10 flex flex-row justify-center items-center gap-4">
                {Object.entries(selectedLanguages)
                    .filter(([_, value]) => value)
                    .map(([key]) => (
                        <Badge
                            variant={'default'}
                            key={key}
                            className=" text-clay-100 cursor-default text-sm"
                        >
                            {key}
                            <Button
                                size={'icon'}
                                onClick={() =>
                                    handleLanguageDelete(
                                        key as keyof OtherLanguagesConfig.OtherLanguagesProps,
                                    )
                                }
                                className="ml-2 bg-transparent hover:bg-transparent"
                            >
                                <X size={24} />
                            </Button>
                        </Badge>
                    ))}
            </div>
        </div>
    );
};

export default OtherLanguages;
