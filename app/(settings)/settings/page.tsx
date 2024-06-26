'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
import Loading from '@/app/loading';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { TextInput } from './components/FormFields/TextInput';
import AgeInput from './components/FormFields/AgeInput';
import GenderSelector from './components/FormFields/GenderSelector';
import ResidenceSelector from './components/FormFields/ResidenceSelector';
import { defaultValues, formResetData, formSchema, formUpdateData } from '../formSetup';

type SettingFormValues = z.infer<typeof formSchema>;

export function SettingsPage() {
    const { locale } = useLocaleStore();
    const { data: session, update: sessionUpdate, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [fetchedData, setFetchedData] = useState<AmazicConfig.AmazicLanguageProps | null>(null);
    const router = useRouter();
    const userId = session?.user?.id;
    const [d, setD] = useState<MessagesProps>();
    const appStatus = process.env.NODE_ENV;
    const [selectedLanguages, setSelectedLanguages] = useState<OtherLanguagesConfig.OtherLanguagesProps>({
        english: false,
        spanish: false,
        catalan: false,
        arabic: false,
        french: false,
    });
    const [_formState, setFormState] = useState<AmazicConfig.AmazicProps | null>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    const languages = [
        { label: 'English', value: 'english' },
        { label: 'Spanish', value: 'spanish' },
        { label: 'Catalan', value: 'catalan' },
        { label: 'Arabic', value: 'arabic' },
        { label: 'French', value: 'french' },
    ] as const;
    if (appStatus === 'development') {
        //        console.log(session);
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    const defaultData = {
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
    //# 1 fetch userData and set form values
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/settings');
                const userData = response.data;
                //        console.log(userData);

                const mergedData = {
                    ...userData,
                    residence: userData.residence || defaultData.residence,
                    age: userData.age || defaultData.age,
                    central: userData.central || defaultData.central,
                    tachelhit: userData.tachelhit || defaultData.tachelhit,
                    tarifit: userData.tarifit || defaultData.tarifit,
                    languages: userData.languages || defaultData.languages,
                    other: userData.other || defaultData.other,
                };
                setFetchedData(mergedData);
                form.reset(formResetData(mergedData));
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
    //# 2 update user data
    const handleUpdate = async (updateData: SettingFormValues) => {
        const { score, ...dataWithoutScore } = updateData;
        // console.log(updateData)
        const newData = {
            ...updateData,
            ...formUpdateData(form),
        };
        // console.log(newData);
        //        console.log(updateData);
        //        console.log(newData);

        const toastId = toast.loading(`${d?.toasters.loading_updating}`);

        try {
            setLoading(true);
            const res = await axios.patch(`/api/settings`, newData);
            toast.success(`${d?.toasters.success_update}`, {
                id: toastId,
            });
            //        console.log(updateData);
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
        //        console.log('submit', data);
        setLoading(true);
        const combinedData = {
            userId,
            ...data,
            isSubscribed: form.getValues('isSubscribed'),
        };
        //        console.log(combinedData);
        await handleUpdate(combinedData);
    };
    // console.log(form.formState);
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
        const languageKey = languages.find((lang) => lang.label === selectedValue)?.value;
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
                <Heading title={`${d?.nav.settings}`} titleClassName="flex-row-center my-5" />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8 w-full px-4">
                        {/* 
						//> user info
						  */}
                        <div className="grid grid-cols-2 gap-8">
                            {/* //@ name */}
                            <TextInput d={d} form={form} loading={loading} fieldLabel="name" />
                            {/*//@ surname */}
                            <TextInput d={d} form={form} loading={loading} fieldLabel="surname" />
                            {/* username */}
                            <TextInput d={d} form={form} loading={loading} fieldLabel="username" />
                            {/* email */}
                            <TextInput d={d} form={form} loading={loading} fieldLabel="email" />
                            {/* // age */}
                            <AgeInput d={d} form={form} loading={loading} />
                            {/* //> gender */}
                            <GenderSelector d={d} form={form} />
                            {/* country of origin */}
                            <ResidenceSelector d={d} form={form} residence={form.getValues('residence') ?? defaultData.residence} />
                        </div>
                        {/* subscribe check */}
                        <FormField
                            control={form.control}
                            name="isSubscribed"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-end justify-center">
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    <FormLabel className="ml-2">{d?.texts.subscribe}</FormLabel>
                                </FormItem>
                            )}
                        />
                        <Separator />
                        {/* //> variations */}
                        <div className="flex flex-col items-between justify-center space-y-10">
                            <h1 className="text-sm mobile:text-2xl font-normal mobile:font-semibold">{d?.setting.mark_proficiency_tamazight}</h1>
                            <div className="grid grid-rows-1 lg:grid-cols-4">
                                {/*// > central */}
                                <div className="flex flex-col">
                                    <FormField
                                        name="central.isChecked"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="flex justify-start items-center space-x-2">
                                                <FormLabel> {d?.variation.central}</FormLabel>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={form.watch('central.isChecked')}
                                                        className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                                        onChange={handleCentralChecked}
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
                                                        <FormLabel>{d?.setting.oral} </FormLabel>

                                                        <FormControl>
                                                            <SelectButton currentValue={form.watch('central.oral') || 0} name="central.oral" onChange={handleButtonChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="central.written_lat"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>{d?.setting.written_lat}</FormLabel>
                                                        <FormControl>
                                                            <SelectButton currentValue={form.watch('central.written_lat') || 0} name="central.written_lat" onChange={handleButtonChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="central.written_tif"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>{d?.setting.written_tif} </FormLabel>
                                                        <FormControl>
                                                            <SelectButton currentValue={form.watch('central.written_tif') || 0} name="central.written_tif" onChange={handleButtonChange} />
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
                                                <FormLabel> {d?.variation.tachelhit}</FormLabel>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={form.watch('tachelhit.isChecked')}
                                                        className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full "
                                                        onChange={handleTachelhitChecked}
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
                                                        <FormLabel> {d?.setting.oral} </FormLabel>

                                                        <FormControl>
                                                            <SelectButton currentValue={form.watch('tachelhit.oral') || 0} name="tachelhit.oral" onChange={handleButtonChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tachelhit.written_lat"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel> {d?.setting.written_lat} </FormLabel>
                                                        <FormControl>
                                                            <SelectButton currentValue={form.watch('tachelhit.written_lat') || 0} name="tachelhit.written_lat" onChange={handleButtonChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tachelhit.written_tif"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>{d?.setting.written_tif} </FormLabel>
                                                        <FormControl>
                                                            <SelectButton currentValue={form.watch('tachelhit.written_tif') || 0} name="tachelhit.written_tif" onChange={handleButtonChange} />
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
                                                <FormLabel> {d?.variation.tif}</FormLabel>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={form.watch('tarifit.isChecked')}
                                                        className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                                        onChange={handleTarifitChecked}
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
                                                        <FormLabel> {d?.setting.oral} </FormLabel>

                                                        <FormControl>
                                                            <SelectButton currentValue={form.watch('tarifit.oral') || 0} name="tarifit.oral" onChange={handleButtonChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tarifit.written_lat"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>{d?.setting.written_lat}</FormLabel>
                                                        <FormControl>
                                                            <SelectButton currentValue={form.watch('tarifit.written_lat') || 0} name="tarifit.written_lat" onChange={handleButtonChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tarifit.written_tif"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>{d?.setting.written_tif}</FormLabel>
                                                        <FormControl>
                                                            <SelectButton currentValue={form.watch('tarifit.written_tif') || 0} name="tarifit.written_tif" onChange={handleButtonChange} />
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
                                                <FormLabel> {d?.variation.other}</FormLabel>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={form.watch('other.isChecked')}
                                                        className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                                        onChange={handleOtherChecked}
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
                                                        <Input disabled={loading} {...field} placeholder={d?.setting.specify} />
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
                        <Separator />
                        {/* other lang */}
                        <div>
                            <h1 className="text-sm mb-3 mobile:text-2xl font-normal mobile:font-semibold">{d?.setting.mark_proficiency_other}</h1>
                            <FormItem className="flex flex-col">
                                <select onChange={(e) => handleLanguageSelect(e.target.value)}>
                                    <option>{d?.translator.select_lang}</option>
                                    {languages.map((lang) => (
                                        <option key={lang.value} value={lang.label}>
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
                                            <Badge variant={'default'} key={key} className="text-clay-100 cursor-default text-sm capitalize">
                                                {key}
                                                <Button
                                                    size={'icon'}
                                                    onClick={() => handleLanguageDelete(key as keyof OtherLanguagesConfig.OtherLanguagesProps)}
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
                    {process.env.NODE_ENV === 'development' && <pre className="flex flex-row h-screen w-screen">{JSON.stringify(form.watch(), null, 2)}</pre>}
                </Form>
            </Suspense>
        </div>
    );
}
export default SettingsPage;
