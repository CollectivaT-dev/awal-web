'use client';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import axios from 'axios';
import useLocaleStore from '@/app/hooks/languageStore';
import { useEffect, useState } from 'react';
import { getDictionary, MessagesProps } from '@/i18n';

const schema = z
    .object({
        password: z.string().min(8, 'Password requires minimum of 8 characters'),
        confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
        message: 'Passwords do not match',
        path: ['confirm'],
    });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('t');
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    const form = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const req = await axios.patch('/api/auth/reset-password', {
                token,
                password: data.password,
            });

            if (req.status === 200) {
                toast.success(`${d?.email.verification.reset_success}`);
            } else {
                toast.error(req.data.message || 'Error resetting password');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Something went wrong');
        }
    };
    return (
        <div className="flex-col-center h-screen">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4  w-2/3 relative">
                <div className="space-y-2">
                    <Input type="password" {...form.register('password')} placeholder={d?.email.verification.new_password} />
                    {form.formState.errors.password && <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                    <Input type="password" {...form.register('confirm')} placeholder={d?.email.verification.confirm_password} />
                    {form.formState.errors.confirm && <p className="text-red-500 text-sm">{form.formState.errors.confirm.message}</p>}
                </div>
                <Button type="submit" className="absolute right-0 ">
                    {d?.email.verification.reset_password}
                </Button>
            </form>
        </div>
    );
}
