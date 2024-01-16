export const LanguageRelations: { [key: string]: string[] } = {
    ary: ['zgh', 'ber'],
    ca: ['zgh', 'ber'],
    en: ['ber', 'zgh'],
    es: ['zgh', 'ber'],
    fr: ['zgh', 'ber'],
    ber: ['en', 'es', 'ca', 'fr', 'ary'],
    zgh: ['en', 'es', 'ca', 'fr', 'ary'],
};

export const ContributionLanguageRelations: { [key: string]: string[] } = {
    ary: ['zgh', 'ber'],
    ca: ['zgh', 'ber'],
    en: ['ber', 'zgh'],
    es: ['zgh', 'ber'],
    fr: ['zgh', 'ber'],
    ber: ['en', 'es', 'ca', 'fr', 'ary'],
    zgh: ['en', 'es', 'ca', 'fr', 'ary'],
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
        default:
            return 'unknown';
    }
};
