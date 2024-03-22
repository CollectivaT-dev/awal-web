'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MessagesProps, getDictionary } from '@/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
interface ResetPasswordFormProps {
    data: { id: string; resetPasswordTokenExpiration: string; token: string };
}

const formSchema = z
    .object({
        password: z.string().min(1, { message: 'Necessari' }),
        confirmPassword: z.string().min(1, { message: 'Necessari' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les contrasenyes no coincideixen',
        path: ['confirmPassword'],
    });

const ResetPasswordForm = ({
    data: { id, resetPasswordTokenExpiration, token },
}: ResetPasswordFormProps) => {
    const { locale } = useLocaleStore();
    const [dictionary, setDictionary] = useState<MessagesProps>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();
    const url =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://awaldigital.org';
    console.log(token);
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
        try {
            const res = await axios.patch(`${url}/api/auth/reset-password`, {
                token,
                data,
            });
            if (res.status === 200) {
                toast.success('password Updated,please sign in again');
                router.refresh();
                signOut({
                    redirect: true,
                    callbackUrl: '/signIn',
                });
            }
            if (res.status === 406) {
                toast.error(`${dictionary?.email.verification.token_error}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //  console.log(isVerified);
    // useEffect(() => {
    //     setTimeout(() => {
    //         router.push('/', { scroll: false });
    //     }, 2000);
    // }, [router, user]);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{dictionary?.user.password}</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {dictionary?.user.confirm_password}
                            </FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};
export default ResetPasswordForm;
