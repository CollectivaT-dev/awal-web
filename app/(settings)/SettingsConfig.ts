import * as z from 'zod';
export namespace AmazicConfig {
    export interface AmazicProps {
        isChecked: boolean;
        oral: number;
        written_tif: number;
        written_lat: number;
    }

    export interface AmazicLanguageProps {
        central: AmazicProps;
        tachelhit: AmazicProps;
        tarifit: AmazicProps;
    }

    export const initialAmazicState: AmazicLanguageProps = {
        central: { isChecked: false, oral: 1, written_tif: 1, written_lat: 1 },
        tachelhit: {
            isChecked: false,
            oral: 1,
            written_tif: 1,
            written_lat: 1,
        },
        tarifit: { isChecked: false, oral: 1, written_tif: 1, written_lat: 1 },
    };

    export const AmazicFormSchema = z.object({
        isChecked: z.boolean(),
        oral: z.number().min(1).max(5),
        written_tif: z.number().min(1).max(5),
        written_lat: z.number().min(1).max(5),
    });
}
export namespace OtherLanguagesConfig {
    export interface OtherLanguagesProps {
        english?: boolean;
        french?: boolean;
        catala?: boolean;
        arabic?: boolean;
        spanish?: boolean;
    }
    export const otherLanguageInitialState = {
        otherLanguages: {
            english: false,
            french: false,
            catala: false,
            arabic: false,
            spanish: false,
        },
    };

    export interface OtherLanguagesGroup {
        otherLanguages: OtherLanguagesProps;
    }

    export const OtherLangFormSchema = z
        .object({
            english: z.boolean(),
            french: z.boolean(),
            catala: z.boolean(),
            arabic: z.boolean(),
            spanish: z.boolean(),
        })
        .partial();
}
export namespace ConsentConfig {
    export interface ConsentProps {
        isPrivacy: boolean;
        isSubscribed: boolean;
    }
    export interface ConsentGroup {
        isConsent: ConsentProps;
    }
    export const initialState: ConsentGroup = {
        isConsent: {
            isPrivacy: false,
            isSubscribed: false,
        },
    };
    export const ConsentFormSchema = z.object({
        isPrivacy: z.boolean(),
        isSubscribed: z.boolean().optional(),
    });
}
