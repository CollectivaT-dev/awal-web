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
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface SignInFormProps {
    className?: string;
    callbackUrl?: string;
}

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
});

type SignInFormValue = z.infer<typeof formSchema>;
const SignInForm: React.FC<SignInFormProps> = ({ className, callbackUrl }) => {
    const form = useForm<SignInFormValue>({
        resolver: zodResolver(formSchema),
    });
    const router = useRouter();
    const { data: session } = useSession();
    if (session?.user) {
        router.push('/', { scroll: false });
    }
    async function onSubmit(data: SignInFormValue) {
        try {
            const { email, password } = data;
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            if (res?.status === 200) {
                toast.success('Iniciat sessió amb exit', {
                    position: 'bottom-center',
                });
            } else {
                toast.error(
                    'Proporcioneu una adreça de correu electrònic vàlida i una contrasenya.',
                    { position: 'bottom-center' },
                );
            }
            if (!res?.error) {
                router.push(callbackUrl ?? '/', { scroll: false });
            }
        } catch (error) {
            toast.error('Alguna cosa ha anat malament', {
                position: 'bottom-center',
            });
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 h-screen"
            >
                <div className="flex flex-col justify-center items-center">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correu Electr&#242;nic</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        id="email"
                                        placeholder="Email"
                                        {...field}
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
                                <FormLabel>Contrasenya</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-3 justify-center items-center">
                    <Button variant={'outline'} type="submit" className='capitalize'>
                        iniciar sessi&#243;
                    </Button>
                    {/* <Button>
                        <Link href={'/'}>Cancel·lar</Link>
                    </Button> */}
                </div>
            </form>
        </Form>
    );
};
export default SignInForm;
