'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AmazicConfig, OtherLanguagesConfig } from '../SettingsConfig';
import { useSession } from 'next-auth/react';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import Heading from '@/components/ui/Heading';
import { Checkbox } from '@/components/ui/checkbox';
import { MessagesProps, getDictionary } from '@/i18n';
import useLocaleStore from '@/app/hooks/languageStore';
import { Separator } from '@/components/ui/separator';
import { SelectButton } from './components/SelectButton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Loading from '@/app/loading';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import useMediaQuery from '@/app/hooks/useMediaQuery';

const formSchema = z
    .object({
        name: z.string(),
        surname: z.string(),
        username: z.string().min(1),
        email: z.string().email(),
        age: z.number().max(120).default(0),
        gender: z.string(),
        score: z.number(),
        isVerified: z.boolean().optional(),
        languages: z
            .object({
                english: z.boolean().default(false),
                french: z.boolean().default(false),
                catala: z.boolean().default(false),
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

type SettingFormValues = z.infer<typeof formSchema>;

const languages = [
    { label: 'english', value: 'english' },
    { label: 'Spanish', value: 'spanish' },
    { label: 'Catala', value: 'catala' },
    { label: 'Arabic', value: 'arabic' },
    { label: 'French', value: 'french' },
] as const;
export function SettingsPage() {
    const { locale } = useLocaleStore();
    const { data: session, update: sessionUpdate, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [fetchedData, setFetchedData] =
        useState<AmazicConfig.AmazicLanguageProps | null>(null);
    const router = useRouter();
    const userId = session?.user?.id;
    const [d, setD] = useState<MessagesProps>();
    const appStatus = process.env.NODE_ENV;
    const [selectedLanguages, setSelectedLanguages] =
        useState<OtherLanguagesConfig.OtherLanguagesProps>({
            english: false,
            spanish: false,
            catala: false,
            arabic: false,
            french: false,
        });
    const [otherVar, setOtherVar] = useState('');
    const [formState, setFormState] =
        useState<AmazicConfig.AmazicProps | null>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    if (appStatus === 'development') {
        console.log(session);
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            username: '',
            isSubscribed: false,
            age: 0,
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
                catala: false,
                arabic: false,
                french: false,
            },
            other: {
                isChecked: false,
                body: '',
            },
        },
    });

    //# 1 fetch userData and set form values
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/settings');
                const userData = response.data;
                console.log(userData);
                const defaultData = {
                    age: 0,
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
                        catala: false,
                        arabic: false,
                        french: false,
                    },
                    other: {
                        isChecked: false,
                        body: '',
                    },
                };
                const mergedData = {
                    ...userData,
                    age: userData.age || defaultData.age,
                    central: userData.central || defaultData.central,
                    tachelhit: userData.tachelhit || defaultData.tachelhit,
                    tarifit: userData.tarifit || defaultData.tarifit,
                    languages: userData.languages || defaultData.languages,
                    other: userData.other || defaultData.other,
                };
                setFetchedData(mergedData);
                form.reset({
                    name: mergedData.name || '',
                    surname: mergedData.surname || '',
                    email: mergedData.email,
                    username: mergedData.username,
                    age: mergedData.age || 0,
                    gender: mergedData.gender || '',
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
                        catala: false,
                        arabic: false,
                        french: false,
                    },
                });
                setSelectedLanguages(mergedData.languages);
                setLoading(false);
            } catch (error) {
                console.error('error fetching data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [form]);
    console.log(form.formState);
    console.log(selectedLanguages);
    //# 2 update user data
    const handleUpdate = async (updateData: SettingFormValues) => {
        const { score, ...dataWithoutScore } = updateData;
        const newData = {
            ...updateData,
            other: {
                isChecked: form.getValues('other.isChecked'),
                body: form.getValues('other.body') || '',
            },
            central: {
                isChecked: form.getValues('central.isChecked'),
                oral: form.getValues('central.oral') || 0,
                written_lat: form.getValues('central.written_lat') || 0,
                written_tif: form.getValues('central.written_tif') || 0,
            },
            tachelhit: {
                isChecked: form.getValues('tachelhit.isChecked'),
                oral: form.getValues('tachelhit.oral') || 0,
                written_lat: form.getValues('tachelhit.written_lat') || 0,
                written_tif: form.getValues('tachelhit.written_tif') || 0,
            },
            tarifit: {
                isChecked: form.getValues('tarifit.isChecked'),
                oral: form.getValues('tarifit.oral') || 0,
                written_lat: form.getValues('tarifit.written_lat') || 0,
                written_tif: form.getValues('tarifit.written_tif') || 0,
            },
            languages: form.getValues('languages') || {
                // fallback value
                english: false,
                spanish: false,
                catala: false,
                arabic: false,
                french: false,
            },
        };
        console.log(updateData);
        console.log(newData);

        const toastId = toast.loading(`${d?.toasters.loading_updating}`);

        try {
            setLoading(true);
            const res = await axios.patch(`/api/settings`, newData);
            toast.success(`${d?.toasters.success_update}`, {
                id: toastId,
            });
            console.log(updateData);
            sessionUpdate({ user: { ...session?.user, ...dataWithoutScore } });
            router.refresh();
            setLoading(false);
        } catch (error) {
            // if error then dismiss the loading toast
            toast.dismiss(toastId);
            if (axios.isAxiosError(error) && error.response) {
                const serverErrMsg = error.response.data.error;
                if (serverErrMsg.includes('variation')) {
                    toast.error(`${d?.toasters.alert_select_variant}`);
                } else if (serverErrMsg.includes('String')) {
                    toast.error(`${d?.toasters.alert_input}`);
                } else if (serverErrMsg.includes('email')) {
                    toast.error(`${d?.toasters.alert_email_username}`);
                } else {
                    toast.error(`${d?.toasters.alert_general}`);
                }
            } else {
                // Handle non-Axios errors
                toast.error("S'ha produït un error inesperat.");
            }
        } finally {
            setLoading(false);
        }
    };
    const onSubmit = async (data: SettingFormValues) => {
        console.log('submit', data);
        setLoading(true);
        const combinedData = {
            userId,
            ...data,
            isSubscribed: form.getValues('isSubscribed'),
        };
        console.log(combinedData);
        await handleUpdate(combinedData);
    };
    console.log(form.formState);
    //# 3 dialect settings
    const handleCentralChecked = () => {
        const isChecked = !form.getValues('central.isChecked');
        form.setValue(`central.isChecked`, isChecked, {
            shouldValidate: true,
        });

        setFormState((prevState) => ({
            ...prevState,
            isChecked,
            oral: prevState?.oral ?? 1,
            written_tif: prevState?.written_tif ?? 1,
            written_lat: prevState?.written_lat ?? 1,
        }));
    };
    const handleTachelhitChecked = () => {
        const isChecked = !form.getValues('tachelhit.isChecked');
        form.setValue(`tachelhit.isChecked`, isChecked, {
            shouldValidate: true,
        });

        setFormState((prevState) => ({
            ...prevState,
            isChecked,
            oral: prevState?.oral ?? 1,
            written_tif: prevState?.written_tif ?? 1,
            written_lat: prevState?.written_lat ?? 1,
        }));
    };
    const handleTarifitChecked = () => {
        const isChecked = !form.getValues('tarifit.isChecked');
        form.setValue(`tarifit.isChecked`, isChecked, {
            shouldValidate: true,
        });

        setFormState((prevState) => ({
            ...prevState,
            isChecked,
            oral: prevState?.oral ?? 1,
            written_tif: prevState?.written_tif ?? 1,
            written_lat: prevState?.written_lat ?? 1,
        }));
    };
    const handleOtherChecked = () => {
        const isChecked = !form.getValues('other.isChecked');
        form.setValue(`other.isChecked`, isChecked, {
            shouldValidate: true,
        });

        setFormState((prevState) => ({
            ...prevState,
            isChecked,
            body: prevState?.body ?? '',
        }));
    };
    handleOtherChecked;
    const handleButtonChange = useCallback(
        (field: string, value: number) => {
            form.setValue(field as keyof SettingFormValues, value, {
                shouldValidate: true,
            });
            setFormState((prevState) => ({
                ...prevState,
                [field]: value,
                isChecked: prevState?.isChecked ?? false,
                oral: prevState?.oral ?? 1,
                written_tif: prevState?.written_tif ?? 1,
                written_lat: prevState?.written_lat ?? 1,
            }));
        },
        [form],
    );

    //# 4 other language
    const handleLanguageSelect = (selectedValue: string) => {
        const languageKey = languages.find(
            (lang) => lang.label === selectedValue,
        )?.value;
        if (languageKey) {
            setSelectedLanguages((prevLanguages) => {
                const newLanguages = {
                    ...prevLanguages,
                    [languageKey]: !prevLanguages[languageKey],
                };
                form.setValue('languages', newLanguages);
                return newLanguages;
            });
        }
    };
    const handleLanguageDelete = (languageKey: string) => {
        setSelectedLanguages((prevLanguages) => {
            const newLanguages = {
                ...prevLanguages,
                [languageKey]: false,
            };
            form.setValue('languages', newLanguages);
            return newLanguages;
        });
    };

    const isCentralCheckedBox = form.watch('central.isChecked');
    const isTachelhitCheckedBox = form.watch('tachelhit.isChecked');
    const isTarifitCheckedBox = form.watch('tarifit.isChecked');
    const isOtherCheckedBox = form.watch('other.isChecked');
    // console.log(fetchedData);
    // console.log(userId);
    // console.log(form.formState);
    if (form.formState?.errors.age?.message?.includes('120')) {
        form.formState.errors.age.message = d?.error_msg.alert_age;
    }
    return (
        <div className="pb-[2em] block min-h-screen">
            <Suspense fallback={<Loading />}>
                <Heading
                    title={`${d?.nav.settings}`}
                    titleClassName="flex-row-center my-5"
                />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className=" space-y-8 w-full px-4"
                    >
                        {/* 
						//> user info
						  */}
                        <div className="grid grid-cols-2 gap-8">
                            {/* name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{d?.user.name}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                {...field}
                                                placeholder={d?.user.name}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-white" />
                                    </FormItem>
                                )}
                            />
                            {/* surname */}
                            <FormField
                                control={form.control}
                                name="surname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{d?.user.surname}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                {...field}
                                                placeholder={d?.user.surname}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-white" />
                                    </FormItem>
                                )}
                            />
                            {/* username */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {d?.user.username}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                {...field}
                                                placeholder={d?.user.username}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-white" />
                                    </FormItem>
                                )}
                            />
                            {/* email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{d?.user.email}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                {...field}
                                                placeholder={d?.user.email}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-white" />
                                    </FormItem>
                                )}
                            />
                            {/* // age */}
                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{d?.user.age}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                {...field}
                                                placeholder={d?.user.age}
                                                onChange={(e) => {
                                                    const age = parseInt(
                                                        e.target.value,
                                                        10,
                                                    );
                                                    if (!isNaN(age)) {
                                                        form.setValue(
                                                            'age',
                                                            age,
                                                        );
                                                    } else {
                                                        form.setValue('age', 0);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-white" />
                                    </FormItem>
                                )}
                            />
                            {/* //> gender */}
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => {
                                    // console.log("Gender field value:", field.value); // Log the current value
                                    return (
                                        <FormItem>
                                            <FormLabel>
                                                {d?.user.gender}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                d?.setting
                                                                    .gender
                                                                    .select
                                                                    ? d?.setting
                                                                          .gender
                                                                          .select
                                                                    : 'Select'
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={'m'}>
                                                        {d?.setting.gender.m
                                                            ? d?.setting.gender
                                                                  .m
                                                            : 'Male'}
                                                    </SelectItem>
                                                    <SelectItem value="f">
                                                        {d?.setting.gender.f
                                                            ? d?.setting.gender
                                                                  .f
                                                            : 'Female'}
                                                    </SelectItem>
                                                    <SelectItem value="nb">
                                                        {d?.setting.gender.nb
                                                            ? d?.setting.gender
                                                                  .nb
                                                            : 'Non-binary'}
                                                    </SelectItem>
                                                    <SelectItem value="tr">
                                                        {d?.setting.gender.tr
                                                            ? d?.setting.gender
                                                                  .tr
                                                            : 'Transgender'}
                                                    </SelectItem>
                                                    <SelectItem value="other">
                                                        {d?.setting.gender.other
                                                            ? d?.setting.gender
                                                                  .other
                                                            : 'Other'}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-white" />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        {/* subscribe check */}
                        <FormField
                            control={form.control}
                            name="isSubscribed"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <FormLabel className="ml-2">
                                        {d?.texts.subscribe}
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <Separator />
                        {/* //> variations */}
                        <div className="flex flex-col items-between justify-center space-y-10">
                            <h1 className="text-sm mobile:text-2xl capitalize font-normal mobile:font-semibold">
                                {d?.setting.mark_proficiency_tamazight}
                            </h1>
                            <div className="grid grid-rows-1 lg:grid-cols-4">
                                {/*// > central */}
                                <div className="flex flex-col">
                                    <FormField
                                        name="central.isChecked"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="flex justify-start items-center space-x-2">
                                                <FormLabel>
                                                    {' '}
                                                    {d?.variation.central}
                                                </FormLabel>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={form.watch(
                                                            'central.isChecked',
                                                        )}
                                                        className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                                        onChange={
                                                            handleCentralChecked
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {isCentralCheckedBox && (
                                        <div className="flex flex-col gap-2 p-2">
                                            <FormField
                                                control={form.control}
                                                name="central.oral"
                                                render={(field) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            {d?.setting.oral}{' '}
                                                        </FormLabel>

                                                        <FormControl>
                                                            <SelectButton
                                                                currentValue={
                                                                    form.watch(
                                                                        'central.oral',
                                                                    ) || 0
                                                                }
                                                                name="central.oral"
                                                                onChange={
                                                                    handleButtonChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="central.written_lat"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            {
                                                                d?.setting
                                                                    .written_lat
                                                            }
                                                        </FormLabel>
                                                        <FormControl>
                                                            <SelectButton
                                                                currentValue={
                                                                    form.watch(
                                                                        'central.written_lat',
                                                                    ) || 0
                                                                }
                                                                name="central.written_lat"
                                                                onChange={
                                                                    handleButtonChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="central.written_tif"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            {
                                                                d?.setting
                                                                    .written_tif
                                                            }{' '}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <SelectButton
                                                                currentValue={
                                                                    form.watch(
                                                                        'central.written_tif',
                                                                    ) || 0
                                                                }
                                                                name="central.written_tif"
                                                                onChange={
                                                                    handleButtonChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/*//> tachelhit central */}
                                <div className="flex flex-col ">
                                    <FormField
                                        name="tachelhit.isChecked"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="flex justify-start items-center space-x-2">
                                                <FormLabel>
                                                    {' '}
                                                    {d?.variation.tachelhit}
                                                </FormLabel>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={form.watch(
                                                            'tachelhit.isChecked',
                                                        )}
                                                        className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full "
                                                        onChange={
                                                            handleTachelhitChecked
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {isTachelhitCheckedBox && (
                                        <div className="flex flex-col gap-2 p-2 ">
                                            <FormField
                                                control={form.control}
                                                name="tachelhit.oral"
                                                render={(field) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            {' '}
                                                            {
                                                                d?.setting.oral
                                                            }{' '}
                                                        </FormLabel>

                                                        <FormControl>
                                                            <SelectButton
                                                                currentValue={
                                                                    form.watch(
                                                                        'tachelhit.oral',
                                                                    ) || 0
                                                                }
                                                                name="tachelhit.oral"
                                                                onChange={
                                                                    handleButtonChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tachelhit.written_lat"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            {' '}
                                                            {
                                                                d?.setting
                                                                    .written_lat
                                                            }{' '}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <SelectButton
                                                                currentValue={
                                                                    form.watch(
                                                                        'tachelhit.written_lat',
                                                                    ) || 0
                                                                }
                                                                name="tachelhit.written_lat"
                                                                onChange={
                                                                    handleButtonChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tachelhit.written_tif"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            {
                                                                d?.setting
                                                                    .written_tif
                                                            }{' '}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <SelectButton
                                                                currentValue={
                                                                    form.watch(
                                                                        'tachelhit.written_tif',
                                                                    ) || 0
                                                                }
                                                                name="tachelhit.written_tif"
                                                                onChange={
                                                                    handleButtonChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/*// > tarifit */}
                                <div className="flex flex-col">
                                    <FormField
                                        name="tarifit.isChecked"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="flex justify-start items-center space-x-2">
                                                <FormLabel>
                                                    {' '}
                                                    {d?.variation.tif}
                                                </FormLabel>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={form.watch(
                                                            'tarifit.isChecked',
                                                        )}
                                                        className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                                        onChange={
                                                            handleTarifitChecked
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {isTarifitCheckedBox && (
                                        <div className="flex flex-col gap-2 p-2 ">
                                            <FormField
                                                control={form.control}
                                                name="tarifit.oral"
                                                render={(field) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            {' '}
                                                            {
                                                                d?.setting.oral
                                                            }{' '}
                                                        </FormLabel>

                                                        <FormControl>
                                                            <SelectButton
                                                                currentValue={
                                                                    form.watch(
                                                                        'tarifit.oral',
                                                                    ) || 0
                                                                }
                                                                name="tarifit.oral"
                                                                onChange={
                                                                    handleButtonChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tarifit.written_lat"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            {
                                                                d?.setting
                                                                    .written_lat
                                                            }
                                                        </FormLabel>
                                                        <FormControl>
                                                            <SelectButton
                                                                currentValue={
                                                                    form.watch(
                                                                        'tarifit.written_lat',
                                                                    ) || 0
                                                                }
                                                                name="tarifit.written_lat"
                                                                onChange={
                                                                    handleButtonChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tarifit.written_tif"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            {
                                                                d?.setting
                                                                    .written_tif
                                                            }
                                                        </FormLabel>
                                                        <FormControl>
                                                            <SelectButton
                                                                currentValue={
                                                                    form.watch(
                                                                        'tarifit.written_tif',
                                                                    ) || 0
                                                                }
                                                                name="tarifit.written_tif"
                                                                onChange={
                                                                    handleButtonChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* other variation */}
                                <div className="flex flex-col">
                                    <FormField
                                        name="other.isChecked"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="flex justify-start items-center space-x-2">
                                                <FormLabel>
                                                    {' '}
                                                    {d?.variation.other}
                                                </FormLabel>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={form.watch(
                                                            'other.isChecked',
                                                        )}
                                                        className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                                        onChange={
                                                            handleOtherChecked
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {isOtherCheckedBox && (
                                        <FormField
                                            control={form.control}
                                            name="other.body"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            disabled={loading}
                                                            {...field}
                                                            placeholder={
                                                                d?.setting
                                                                    .specify
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-white" />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            </div>
                            {/* other lang */}
                        </div>

                        {/* other lang */}
                        <div>
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    {d?.translator.select_lang}
                                </FormLabel>
                                <select
                                    onChange={(e) =>
                                        handleLanguageSelect(e.target.value)
                                    }
                                >
                                    <option>{d?.translator.select_lang}</option>
                                    {languages.map((lang) => (
                                        <option
                                            key={lang.value}
                                            value={lang.label}
                                        >
                                            {lang.label}
                                        </option>
                                    ))}
                                </select>
                            </FormItem>
                            <div className="mt-10 flex flex-row justify-center items-center gap-4">
                                {selectedLanguages &&
                                    Object.entries(selectedLanguages)
                                        .filter(([_, value]) => value)
                                        .map(([key, _]) => (
                                            <Badge
                                                variant={'default'}
                                                key={key}
                                                className="text-clay-100 cursor-default text-sm capitalize"
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
                                                    value={key}
                                                >
                                                    <X size={24} />
                                                </Button>
                                            </Badge>
                                        ))}
                            </div>
                        </div>
                        <Button type="submit">{d?.texts.save_settings}</Button>
                    </form>
                    {process.env.NODE_ENV === 'development' && (
                        <pre className="flex flex-row h-screen w-screen">
                            {JSON.stringify(form.watch(), null, 2)}
                        </pre>
                    )}
                </Form>
            </Suspense>
        </div>
    );
}
export default SettingsPage;
