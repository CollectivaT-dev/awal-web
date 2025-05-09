export const locales = ['ca', 'en', 'zgh', 'fr', 'ary', 'es'];
export type Locale = (typeof locales)[number];

export const defaultLocale = locales[0];
export const isAvailableLocale = (locale: unknown): locale is Locale => typeof locale === 'string' && locales.includes(locale);

const dictionaries = {
    ca: () => import('@/static/messages/ca.json').then((module) => module.default),
    en: () => import('@/static/messages/en.json').then((module) => module.default),
    es: () => import('@/static/messages/es.json').then((module) => module.default),
    zgh: () => import('@/static/messages/zgh.json').then((module) => module.default),
    // ary: () => import('@/messages/ary.json').then((module) => module.default),
    fr: () => import('@/static/messages/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    if (isAvailableLocale(locale)) {
        return dictionaries[locale as keyof typeof dictionaries]();
    } else {
        return dictionaries[defaultLocale as keyof typeof dictionaries]();
    }
};

export interface MessagesProps {
    nav: Nav;
    language: Language;
    variation: Variation;
    menu: Menu;
    user: User;
    translator: Translator;
    footer: Footer;
    toasters: Toasters;
    text_with_link: Textwithlink;
    error_msg: Errormsg;
    page_intro: Pageintro;
    texts: Texts;
    validator: Validator;
    btn: Btn;
    setting: Setting;
    about: About;
    terms: Terms;
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
    legal: Legal;
    cookies: Cookies;
    privacy: Privacy;
    resources: Resources;
    faq: Faq;
    carousel: Carousel;
    email: Email;
}

interface Email {
    verification: Verification;
}

interface Verification {
    page_redirect: string;
    token_error: string;
    success_title: string;
    error_title: string;
    error_msg: string;
    success_email: string;
    alert: string;
    error_email: string;
    reset_password: string;
    reset_success: string;
    reset_email_send_success: string;
    email_recovery: string;
    submit_btn: string;
    reset_email_send_error: string;
    password_mismatch: string;
    new_password: string;
    confirm_password: string;
	check_spam:string;
	password_min_char:string;

}

interface Carousel {
    c1: C1;
    c2: C1;
    c3: C1;
}

interface C1 {
    heading: string;
    body: string;
    link: string;
}

interface Faq {
    q1: Q1;
    q2: Q1;
    q3: Q1;
    q4: Q1;
    q5: Q1;
    q6: Q1;
}

interface Q1 {
    q: string;
    a: string;
}

interface Resources {
    resources_heading: string;
    awal_huggingface: string;
    NLLB: string;
    tamazight_NLP_huggingface: string;
    tamazight_wiki: string;
    TALAM_groups: string;
    darija_open: string;
    tamazight_for_all: string;
}

interface Privacy {
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
}

interface Cookies {
    cookies_heading: string;
    cookies_text_1: string;
    cookies_list_1: string;
    cookies_list_2: string;
    cookies_list_3: string;
    cookies_list_4: string;
    cookies_text_2: string;
}

interface Legal {
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
}

interface Terms {
    contribution_terms_heading: string;
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
}

interface About {
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
    contributor_brahim_photo: string;
    contributor_brahim_website: string;
    contributor_brahim_intro: string;
    contact_heading: string;
    contact_info: string;
    contact_text: string;
}

interface Setting {
    oral: string;
    written_tif: string;
    written_lat: string;
    mark_proficiency_tamazight: string;
    mark_proficiency_other: string;
    gender: Gender;
    specify: string;
}

interface Gender {
    select: string;
    m: string;
    f: string;
    nb: string;
    tr: string;
    other: string;
}

interface Btn {
    continue: string;
    cancel: string;
    contribute: string;
    clear: string;
    skip: string;
}

interface Validator {
    alert_no_more_entries: string;
    alert_loading: string;
    success_loading: string;
    success_validation: Successvalidation;
}

interface Successvalidation {
    text_before_link: string;
    text_after_link: string;
}

interface Texts {
    accept_mail_list: string;
    save_settings: string;
    loading: string;
    welcome: string;
    welcome_m: string;
    welcome_f: string;
    subscribe: string;
    total_entries: string;
    total_validated_entries: string;
    total_voice_entries_number: string;
    total_voice_entries: string;
    total_voice_validation_number: string;
    total_voice_validation: string;
    have_account: string;
    login_to_signup_1: string;
    login_to_signup_2: string;
    statistic: string;
    validate_report_heading: string;
    validate_report_text: string;
    faq_heading: string;
    rank: string;
    home: string;
    contributor_input_placeholder: string;
    contributor_output_placeholder: string;
}

interface Pageintro {
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
}

interface Errormsg {
    alert_required: string;
    alert_password_coincide: string;
    alert_age: string;
}

interface Textwithlink {
    accept_terms: Acceptterms;
    dic_link: Diclink;
}

interface Diclink {
    text_before_link: string;
    link_text_1: string;
    link_text_2: string;
    link_text_3: string;
    link_text_4: string;
}

interface Acceptterms {
    text_before_link: string;
    link_text: string;
    text_after_link: string;
}

interface Toasters {
    under_construction: string;
    loading_updating: string;
    translating: string;
    select_var: string;
    alert_no_text: string;
    alert_no_modify: string;
    alert_privacy_check: string;
    alert_general: string;
    alert_username: string;
    alert_email: string;
    alert_email_username: string;
    alert_email_pwd: string;
    alert_copy: string;
    alert_try_again: string;
    alert_select_variant: string;
    success_contribution: string;
    success_contribution_points: string;
    alert_input: string;
    alert_api: string;
    success_translate: string;
    success_update: string;
    success_loading: string;
    success_registration: string;
    success_copy: string;
    success_signIn: string;
    validation_success_report: string;
}

interface Footer {
    legal: string;
    privacy: string;
    cookie: string;
    contributionTerms: string;
    leaderboard: string;
}

interface Translator {
    select_lang: string;
    generate: string;
    translate: string;
    report: string;
    placeholder: Placeholder;
    notice: string;
}

interface Placeholder {
    type_to_translate: string;
    translation_box: string;
}

export interface User {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    age: string;
    gender: string;
    name: string;
    surname: string;
    residence_country: string;
    residence_province: string;
    residence_city: string;
}

interface Menu {
    translator: string;
    voice: string;
    about: string;
    resources: string;
    faq: string;
}

interface Variation {
    std: string;
    central: string;
    tif: string;
    tachelhit: string;
    other: string;
}

interface Language {
    zgh: string;
    ber: string;
    ca: string;
    es: string;
    en: string;
    fr: string;
    ary: string;
}

interface Nav {
    signUp: string;
    points: string;
    signIn: string;
    settings: string;
    signOut: string;
    translator: string;
    contribute: string;
    validate: string;
    passwordResetBtn: string;
}
