'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import { useState } from 'react';
import axios from 'axios';
import { resetPassword } from '@/app/actions/users/reset';

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
    // const [message, setMessage] = useState<string>('');
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const message = await resetPassword(data.email);
        console.log(message);
        try {
            const res = axios.post('api/auth/reset-password');
        } catch (error) {}
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="example@awaldigital.org"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Email for recovery
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
