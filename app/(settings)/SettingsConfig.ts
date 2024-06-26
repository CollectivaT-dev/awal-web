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
        catalan?: boolean;
        arabic?: boolean;
        spanish?: boolean;
    }
    export const otherLanguageInitialState = {
        otherLanguages: {
            english: false,
            french: false,
            catalan: false,
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
            catalan: z.boolean(),
            arabic: z.boolean(),
            spanish: z.boolean(),
        })
        .partial();
}
