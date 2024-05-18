export const LanguageRelations: { [key: string]: string[] } = {
    ar: ['zgh', 'ber'],
    ary: ['zgh', 'ber'],
    ca: ['zgh', 'ber'],
    en: ['ber', 'zgh'],
    es: ['zgh', 'ber'],
    fr: ['zgh', 'ber'],
    ber: ['en', 'es', 'ca', 'fr', 'ary', 'zgh', 'ar'],
    zgh: ['en', 'es', 'ca', 'fr', 'ary', 'ber', 'ar'],
};

export const ContributionLanguageRelations: { [key: string]: string[] } = {
    ar: ['zgh', 'ber'],
    ary: ['zgh', 'ber'],
    ca: ['zgh', 'ber'],
    en: ['ber', 'zgh'],
    es: ['zgh', 'ber'],
    fr: ['zgh', 'ber'],
    ber: ['en', 'es', 'ca', 'fr', 'ary', 'ar'],
    zgh: ['en', 'es', 'ca', 'fr', 'ary', 'ar'],
};
export const getLanguageCode = (languageStateValue: string) => {
    switch (languageStateValue) {
        case 'en':
            return 'en';
        case 'ca':
            return 'ca';
        case 'zgh':
            return 'zgh';
        case 'ber':
            return 'ber';
        case 'es':
            return 'es';
        case 'fr':
            return 'fr';
        case 'ary':
            return 'ary';
        case 'ar':
            return 'ar';
        default:
            return 'unknown';
    }
};
