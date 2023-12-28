export const locales = ['ca', 'en', 'zgh', 'fr', 'ary', 'es'];
export type Locale = (typeof locales)[number];

export const defaultLocale = locales[0];
export const isAvailableLocale = (locale: unknown): locale is Locale =>
    typeof locale === 'string' && locales.includes(locale);
export interface MessagesProps {
    nav: {
        signUp: string;
        Points: string;
        signIn: string;
        settings: string;
        signOut: string;
        translator: string;
        contribute: string;
    };
    language: {
        zgh: string;
        ca: string;
        es: string;
        en: string;
        fr: string;
        ary: string;
    };
    variation: {
        central: string;
        tif: string;
        tachlit: string;
        other: string;
    };
    menu: {
        translator: string;
        voice: string;
        about: string;
        resources: string;
    };
    user: {
        username: string;
        email: string;
        password: string;
        confirm_password: string;
        age: string;
        gender: string;
        name: string;
        surname: string;
    };
    translator: {
        select_lang: string;
        generate: string;
        translate: string;
        report: string;
        placeholder: {
            type_to_translate: string;
            dictionary_cat: string;
            translation_box: string;
        };
    };
    footer: {
        legal: string;
        privacy: string;
        cookie: string;
    };
    toasters: {
        under_construction: string;
        success_contribution: string;
        select_var: string;
        alert_no_text: string;
        alert_no_modify: string;
        alert_privacy_check: string;
        alert_general: string;
        alert_username: string;
        alert_email: string;
        alert_email_username: string;
        success_update: string;
        success_registration?: string;
    };
}

const dictionaries = {
    ca: () => import('@/messages/ca.json').then((module) => module.default),
    en: () => import('@/messages/en.json').then((module) => module.default),
    es: () => import('@/messages/es.json').then((module) => module.default),
    zgh: () => import('@/messages/zgh.json').then((module) => module.default),
    ary: () => import('@/messages/ary.json').then((module) => module.default),
    fr: () => import('@/messages/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    if (isAvailableLocale(locale)) {
        return dictionaries[locale as keyof typeof dictionaries]();
    } else {
        return dictionaries[defaultLocale as keyof typeof dictionaries]();
    }
};
