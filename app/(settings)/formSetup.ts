import * as z from 'zod';

export const formSchema = z
    .object({
        name: z.string(),
        surname: z.string(),
        username: z.string().min(1),
        email: z.string().email(),
        age: z.number().max(120).default(0),
        gender: z.string(),
        score: z.number(),
        isVerified: z.boolean().optional(),
        residence: z.object({
            country: z.string().default('').optional(),
            province: z.string().default('').optional(),
            city: z.string().default('').optional(),
        }),
        languages: z
            .object({
                english: z.boolean().default(false),
                french: z.boolean().default(false),
                catalan: z.boolean().default(false),
                spanish: z.boolean().default(false),
                arabic: z.boolean().default(false),
            })
            .partial(),
        central: z.object({
            isChecked: z.boolean().default(false),
            oral: z.number().optional(),
            written_tif: z.number().optional(),
            written_lat: z.number().optional(),
        }),
        tachelhit: z.object({
            isChecked: z.boolean().default(false),
            oral: z.number().optional(),
            written_tif: z.number().optional(),
            written_lat: z.number().optional(),
        }),
        tarifit: z.object({
            isChecked: z.boolean().default(false),
            oral: z.number().optional(),
            written_tif: z.number().optional(),
            written_lat: z.number().optional(),
        }),
        other: z.object({
            isChecked: z.boolean().default(false),
            body: z.string(),
        }),
        isSubscribed: z.boolean().default(false).optional(),
    })
    .partial();

export const defaultValues = {
    name: '',
    surname: '',
    email: '',
    username: '',
    isSubscribed: false,
    age: 0,
    residence: {
        country: '',
        province: '',
        city: '',
    },
    central: {
        isChecked: false,
        oral: 1,
        written_lat: 1,
        written_tif: 1,
    },
    tachelhit: {
        isChecked: false,
        oral: 1,
        written_lat: 1,
        written_tif: 1,
    },
    tarifit: {
        isChecked: false,
        oral: 1,
        written_lat: 1,
        written_tif: 1,
    },
    languages: {
        english: false,
        spanish: false,
        catalan: false,
        arabic: false,
        french: false,
    },
    other: {
        isChecked: false,
        body: '',
    },
};

export const formResetData = (mergedData: any) => ({
    name: mergedData.name || '',
    surname: mergedData.surname || '',
    email: mergedData.email,
    username: mergedData.username,
    age: mergedData.age || 0,
    gender: mergedData.gender || '',
    residence: {
        country: mergedData.residence?.country || '',
        province: mergedData.residence?.province || '',
        city: mergedData.residence?.city || '',
    },
    isSubscribed: mergedData.isSubscribed || false,
    other: {
        isChecked: mergedData.other?.isChecked || false,
        body: mergedData.other?.body || '',
    },
    central: {
        isChecked: mergedData.central?.isChecked || false,
        oral: mergedData.central?.oral || 0,
        written_lat: mergedData.central?.written_lat || 0,
        written_tif: mergedData.central?.written_tif || 0,
    },
    tachelhit: {
        isChecked: mergedData.tachelhit?.isChecked || false,
        oral: mergedData.tachelhit?.oral || 0,
        written_lat: mergedData.tachelhit?.written_lat || 0,
        written_tif: mergedData.tachelhit?.written_tif || 0,
    },
    tarifit: {
        isChecked: mergedData.tarifit?.isChecked || false,
        oral: mergedData.tarifit?.oral || 0,
        written_lat: mergedData.tarifit?.written_lat || 0,
        written_tif: mergedData.tarifit?.written_tif || 0,
    },
    languages: mergedData.languages || {
        english: false,
        spanish: false,
        catalan: false,
        arabic: false,
        french: false,
    },
});

export const formUpdateData = (form: any) => ({
    residence: {
        country: form.getValues('residence.country') ?? '',
        province: form.getValues('residence.province') ?? '',
        city: form.getValues('residence.city') ?? '',
    },
    other: {
        isChecked: form.getValues('other.isChecked'),
        body: form.getValues('other.body') || '',
    },
    central: {
        isChecked: form.getValues('central.isChecked'),
        oral: form.getValues('central.oral') ?? 0,
        written_lat: form.getValues('central.written_lat') ?? 0,
        written_tif: form.getValues('central.written_tif') ?? 0,
    },
    tachelhit: {
        isChecked: form.getValues('tachelhit.isChecked'),
        oral: form.getValues('tachelhit.oral') ?? 0,
        written_lat: form.getValues('tachelhit.written_lat') ?? 0,
        written_tif: form.getValues('tachelhit.written_tif') ?? 0,
    },
    tarifit: {
        isChecked: form.getValues('tarifit.isChecked'),
        oral: form.getValues('tarifit.oral') ?? 0,
        written_lat: form.getValues('tarifit.written_lat') ?? 0,
        written_tif: form.getValues('tarifit.written_tif') ?? 0,
    },
    languages: form.getValues('languages') || {
        // fallback value
        english: false,
        spanish: false,
        catalan: false,
        arabic: false,
        french: false,
    },
});
