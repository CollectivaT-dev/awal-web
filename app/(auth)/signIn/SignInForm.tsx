'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Clipboard } from 'lucide-react';
import axios from 'axios';

interface SignInFormProps {
    className?: string;
    callbackUrl?: string;
}

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
});

type SignInFormValue = z.infer<typeof formSchema>;
const SignInForm: React.FC<SignInFormProps> = ({ callbackUrl }) => {
    const form = useForm<SignInFormValue>({
        resolver: zodResolver(formSchema),
    });
    const [loginError, setLoginError] = useState('');
    const router = useRouter();
    const { locale } = useLocaleStore();
    const { data: session } = useSession();
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    if (session?.user) {
        router.push('/', { scroll: false });
    }

    async function onSubmit(data: SignInFormValue) {
        try {
            const { email, password } = data;
            const res = await signIn(`credentials`, {
                email,
                password,
                redirect: false,
            });
            console.log(res);

            if (res?.status === 200) {
                toast.success(`${d?.toasters.success_signIn}`);
            } else {
                // if return is not 200
                if (res?.error) {
                    setLoginError(res?.error);
                }
                toast.error(`${d?.toasters.alert_email_pwd}`);
            }
        } catch (error) {
            // in case of res undefined
            console.log(error);
            // handle 401 and 405
            if (axios.isAxiosError(error) && error.response && (error?.response?.status === 405 || error?.response?.status === 401)) {
                console.log(error);
                const errorMsg = error?.response?.data?.message;
                setLoginError(errorMsg);
            }
            // handle unexpected
            if (axios.isAxiosError(error) && error.response) {
                setLoginError(error.response.data.message);
            }
            toast.error(`${d?.toasters.alert_try_again}`);
        }
    }
    return (
        <div className="min-h-screen flex-col-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10">
                    <div className="flex flex-col justify-center items-center">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{d?.user.email}</FormLabel>
                                    <FormControl>
                                        <Input type="text" id="email" placeholder={`${d?.user.email}`} {...field} />
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
                                    <FormLabel>{d?.user.password}</FormLabel>
                                    <FormControl>
                                        <Input type="password" id="password" placeholder={`${d?.user.password}`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col  gap-y-5 justify-center items-center">
                        <Button variant={'outline'} type="submit" className="capitalize cursor-pointer">
                            {d?.nav.signIn}
                        </Button>
                        <Button>
                            <Link href={'/resetPassword'} className="underline select-none">
                                {d?.nav.passwordResetBtn}
                            </Link>
                        </Button>
                    </div>
                </form>
            </Form>
            <div className="mt-10 select-none">
                {d?.texts.login_to_signup_1}{' '}
                <Link href={'/register'} className="underline">
                    {d?.texts.login_to_signup_2}
                </Link>
            </div>
            {loginError ? (
                <Alert className="w-[50vw] m-4">
                    <AlertCircle className="h-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="flex flex-row  justify-between items-center ">
                        {loginError}
                        <div>
                            <Clipboard
                                onClick={() => {
                                    navigator.clipboard.writeText(loginError), toast.success(`error copied to clipboard, send it to admin`);
                                }}
                            />
                        </div>
                    </AlertDescription>
                </Alert>
            ) : null}
        </div>
    );
};
export default SignInForm;
