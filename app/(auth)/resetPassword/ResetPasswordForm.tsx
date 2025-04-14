'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { resetPassword } from '@/app/actions/users/reset';
import toast from 'react-hot-toast';
import useLocaleStore from '@/app/hooks/languageStore';
import { getDictionary, MessagesProps } from '@/i18n';

const FormSchema = z.object({
    email: z.string().email(),
});
export function ResetPasswordForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
        },
    });
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    // const [message, setMessage] = useState<string>('');
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const response = await resetPassword(data.email);

        if (response.status === 200) {
            toast.success(`${d?.email.verification.reset_email_send_success}`);
        } else if (response.status === 404) {
            toast.error('user not found');
        } else {
            toast.error(`${d?.email.verification.reset_email_send_error}`);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 ">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="example@awaldigital.org" {...field} />
                            </FormControl>
                            <FormDescription>
                                {d?.email.verification.email_recovery}
                                <p>Please check your spam if you didn&apos;t receive the email</p>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">{d?.email.verification.submit_btn}</Button>
            </form>
        </Form>
    );
}
