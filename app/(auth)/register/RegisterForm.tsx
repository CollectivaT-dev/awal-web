'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import { useEffect, useState } from 'react';
const formSchema = z
    .object({
        username: z.string().min(1, { message: 'Necessari' }),
        email: z.string().email("L'adreça de correu no es vàlida"),
        password: z.string().min(1, { message: 'Necessari' }),
        confirmPassword: z.string().nonempty({ message: 'Necessari' }),
        isPrivacy: z.boolean(),
        isSubscribed: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les contrasenyes no coincideixen',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof formSchema>;
export default function RegisterForm() {
    const { locale } = useLocaleStore();
    const [dictionary, setDictionary] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m);
        };
        fetchDictionary();
    }, [locale]);
    const router = useRouter();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(formSchema),
    });
    const onSubmit = async (data: RegisterFormValues) => {
        const { username, email, password, isPrivacy, isSubscribed } = data;
        if (!data.isPrivacy) {
            toast.error(`${dictionary?.toasters.alert_privacy_check}`);
            return;
        }
        try {
            // Attempt to register the user
            const registrationResponse = await axios.post(`/api/register`, {
                username,
                email,
                password,
                isPrivacy,
                isSubscribed: isSubscribed || false,
            });

            if (registrationResponse.status === 200) {
                toast.success(`${dictionary?.toasters.success_registration}`);
            } else {
                toast.error(`${dictionary?.toasters.alert_try_again}`);
            }

            const loginAttempt = await axios.post(`/api/signIn`, {
                email,
                password,
            });

            // Redirect to signIn page
            if (loginAttempt.status === 200) {
                router.push('/signIn', { scroll: false });
            }
            router.push('/', { scroll: false });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorData = error.response.data;
                console.log(errorData);
                console.log(error);
                // check first for username dup then for email, error msg in such order
                if (error.response.status === 409) {
                    if (errorData && typeof errorData === 'object') {
                        if (errorData.error.includes('Email')) {
                            toast.error(`${dictionary?.toasters.alert_email}`);
                        } else if (errorData.error.includes('Username')) {
                            toast.error(
                                `${dictionary?.toasters.alert_username}`,
                            );
                        } else {
                            toast.error(
                                `${dictionary?.toasters.alert_email_username}`,
                            );
                        }
                    } else {
                        toast.error(`${dictionary?.toasters.alert_try_again}`);
                    }
                } else {
                    // Handle other types of errors
                    const errorMessage =
                        errorData?.message ||
                        `${dictionary?.toasters.alert_general}`;
                    toast.error(errorMessage);
                }
            }
        }
    };

    if (form.formState.errors.username?.message?.includes('Required')) {
        form.formState.errors.username.message = `${dictionary?.error_msg.alert_required}`;
    }
    if (form.formState.errors.email?.message?.includes('Required')) {
        form.formState.errors.email.message = `${dictionary?.error_msg.alert_required}`;
    }
    if (form.formState.errors.password?.message?.includes('Required')) {
        form.formState.errors.password.message = `${dictionary?.error_msg.alert_required}`;
    }
    if (form.formState.errors.confirmPassword?.message?.includes('Required')) {
        form.formState.errors.confirmPassword.message = `${dictionary?.error_msg.alert_required}`;
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 h-[100vh] flex flex-col justify-center items-center"
            >``
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{dictionary?.user.username}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={`${dictionary?.user.username}`}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{dictionary?.user.email}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={`${dictionary?.user.email}`}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className={`capitalize ${
                                    form.formState.errors.password
                                        ? 'text-white'
                                        : ''
                                }`}
                            >
                                {dictionary?.user.password}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder={`${dictionary?.user.password}`}
                                />
                            </FormControl>
                            <FormMessage className="text-white" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className={`capitalize ${
                                    form.formState.errors.confirmPassword
                                        ? 'text-white'
                                        : ''
                                }`}
                            >
                                {dictionary?.user.confirm_password}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder={`${dictionary?.user.confirm_password}`}
                                />
                            </FormControl>

                            {form.formState.errors.confirmPassword && (
                                <FormMessage className="text-white">
                                    {
                                        dictionary?.error_msg
                                            .alert_password_coincide
                                    }
                                </FormMessage>
                            )}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isPrivacy"
                    render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>

                            <div className="">
                                <FormLabel
                                    className={`capitalize ${
                                        form.formState.errors.isPrivacy
                                            ? 'text-white'
                                            : ''
                                    }`}
                                >
                                    {
                                        dictionary?.text_with_link.accept_terms
                                            .text_before_link
                                    }{' '}
                                    <Link
                                        href={'/privacy'}
                                        target="_blank"
                                        scroll={false}
                                        className="text-blue-500"
                                    >
                                        {
                                            dictionary?.text_with_link
                                                .accept_terms.link_text
                                        }
                                    </Link>{' '}
                                    {
                                        dictionary?.text_with_link.accept_terms
                                            .text_after_link
                                    }
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isSubscribed"
                    render={({ field }) => (
                        <FormItem className="flex flex-row justify-center items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>

                            <FormLabel>{dictionary?.texts.subscribe}</FormLabel>
                        </FormItem>
                    )}
                />
                <Button type="submit">{dictionary?.nav.signUp}</Button>
            </form>
        </Form>
    );
}
