export const locales = ['ca', 'en', 'zgh', 'fr', 'ary', 'es'];
export type Locale = (typeof locales)[number];

export const defaultLocale = locales[0];
export const isAvailableLocale = (locale: unknown): locale is Locale =>
    typeof locale === 'string' && locales.includes(locale);

const dictionaries = {
    ca: () => import('@/messages/ca.json').then((module) => module.default),
    en: () => import('@/messages/en.json').then((module) => module.default),
    es: () => import('@/messages/es.json').then((module) => module.default),
    zgh: () => import('@/messages/zgh.json').then((module) => module.default),
    // ary: () => import('@/messages/ary.json').then((module) => module.default),
    fr: () => import('@/messages/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    if (isAvailableLocale(locale)) {
        return dictionaries[locale as keyof typeof dictionaries]();
    } else {
        return dictionaries[defaultLocale as keyof typeof dictionaries]();
    }
};
export interface MessagesProps {
    nav: {
        signUp: string;
        points: string;
        signIn: string;
        settings: string;
        signOut: string;
        translator: string;
        contribute: string;
        validate: string;
    };
    language: {
        zgh: string;
        ber: string;
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
            translation_box: string;
        };
        notice: string;
        help: string;
        help_pop_up: {
            header: string;
            description: string;
        };
    };
    footer: {
        legal: string;
        privacy: string;
        cookie: string;
        terms: string;
        contributionTerms: string;
    };
    toasters: {
        under_construction: string;
        success_contribution: string;
        success_contribution_points: string;
        select_var: string;
        alert_no_text: string;
        alert_no_modify: string;
        alert_privacy_check: string;
        alert_general: string;
        alert_username: string;
        alert_email: string;
        alert_email_username: string;
        success_update: string;
        success_registration: string;
        loading_updating: string;
        alert_email_pwd: string;
        success_copy: string;
        success_signIn: string;
        alert_copy: string;
        alert_try_again: string;
    };
    text_with_link: {
        accept_terms: {
            text_before_link: string;
            link_text: string;
            text_after_link: string;
        };
        dic_link: {
            text_before_link: string;
            link_text_1: string;
            link_text_2: string;
            link_text_3: string;
        };
    };
    error_msg: {
        alert_required: string;
        alert_password_coincide: string;
        alert_age: string;
    };
    page_intro: {
        title: string;
        CTA_text: string;
        heading_1: string;
        heading_2: string;
        text_2: string;
        heading_3: string;
        text_3: string;
        heading_4: string;
        text_4_1: string;
        text_4_about: string;
        text_4_2: string;
        text_4_ins: string;
        text_4_X: string;
        text_4_3: string;
        CTA_button: string;
        item_1_strong: string;
        item_1_normal: string;
        item_2_strong: string;
        item_2_normal: string;
        item_3_strong: string;
        item_3_normal: string;
    };
    texts: {
        data_marathon: string;
        accept_mail_list: string;
        save_settings: string;
        loading: string;
        welcome: string;
        welcome_m: string;
        welcome_f: string;
        subscribe: string;
        total_entries: string;
        login_to_signup_1: string;
        login_to_signup_2: string;
    };
    validator: {
        alert_no_more_entries: string;
        alert_loading: string;
        success_loading: string;
        success_validation: {
            text_before_link: string;
            text_after_link: string;
        };
    };
    btn: {
        continue: string;
        cancel: string;
        contribute: string;
        clear: string;
    };
    setting: {
        oral: string;
        written_tif: string;
        written_lat: string;
        mark_proficiency_tamazight: string;
        mark_proficiency_other: string;
        gender: {
            select: string;
            m: string;
            f: string;
            nb: string;
            tr: string;
            other: string;
        };
    };
    about: {
        main_string_1: string;
        ciemen_logo_url: string;
        ciemen_web_url: string;
        ciemen_intro: string;
        collectivat_logo_url: string;
        collectivat_web_url: string;
        collectivat_intro: string;
        casa_amaziga_logo_url: string;
        casa_amaziga_web_url: string;
        casa_amaziga_intro: string;
        main_text_2: string;
        contributor_farida_photo: string;
        contributor_farida_website: string;
        contributor_farida_intro: string;
        contributor_ghizlan_photo: string;
        contributor_ghizlan_website: string;
        contributor_ghizlan_intro: string;
        contributor_yuxuan_photo: string;
        contributor_yuxuan_website: string;
        contributor_yuxuan_intro: string;
        contact_heading: string;

        contact_info: string;
        contact_text: string;
    };
    terms: {
        contribution_terms: string;
        mozilla_terms: string;
        contribution_terms_continued: string;
        translation_contribution_heading: string;
        translation_contributions: string;
        cc_license_link_text: string;
        translation_continued_1: string;
        repo_link_text: string;
        translation_continued_2: string;
        random_sentence_heading: string;
        random_sentence: string;
        tatoeba_platform_link_text: string;
        random_sentence_continued: string;
        machine_translation_heading: string;
        machine_translation: string;
        machine_translation_link_text: string;
        machine_translation_continued: string;
        validation_heading: string;
        validation: string;
        profile_heading: string;
        profile: string;
        scoring_heading: string;
        scoring: string;
        communication_heading: string;
        communication: string;
        disclaimer_heading: string;
        disclaimer: string;
    };
    how_to_contribute_heading: string;
    how_it_works_contribution: string;
    how_it_works_contribution_1: string;
    how_it_works_contribution_2: string;
    how_it_works_contribution_3: string;
    how_it_works_contribution_4: string;
    how_it_works_contribution_continued: string;
    how_to_validate_heading: string;
    how_it_works_validation: string;
    how_it_works_validation_1: string;
    how_it_works_validation_2: string;
    how_it_works_validation_2_1: string;
    how_it_works_validation_2_2: string;
    how_it_works_validation_2_3: string;
    how_it_works_validation_2_4: string;
    how_it_works_validation_2_5: string;
    how_it_works_validation_2_6: string;
    how_it_works_validation_2_7: string;
    how_it_works_validation_3: string;
    how_it_works_validation_continued: string;
    legal: {
        legal_title: string;
        legal_text_1: string;
        legal_data_1_heading: string;
        legal_data_1_text: string;
        legal_data_2_heading: string;
        legal_data_2_text: string;
        legal_data_3_heading: string;
        legal_data_3_text: string;
        legal_data_4_heading: string;
        legal_data_4_text: string;
    };
    cookies: {
        cookies_heading: string;
        cookies_text_1: string;
        cookies_list_1: string;
        cookies_list_2: string;
        cookies_list_3: string;
        cookies_list_4: string;
        cookies_text_2: string;
    };
    privacy: {
        privacy_heading: string;
        privacy_item_1_txt_1_heading: string;
        privacy_item_1_txt_1: string;
        privacy_item_1_li_1: string;
        privacy_item_1_li_2: string;
        privacy_item_1_txt_2: string;
        privacy_item_1_li_3: string;
        privacy_item_1_li_4: string;
        privacy_item_1_li_5: string;
        privacy_item_1_txt_3: string;
        privacy_item_2_txt_heading: string;
        privacy_item_2_txt: string;
        privacy_item_3_heading: string;
        privacy_item_3_txt: string;
    };
    resources: {
        resources_heading: string;
        awal_huggingface: string;
        tamazight_wiki: string;
        TALAM_groups: string;
    };
}
