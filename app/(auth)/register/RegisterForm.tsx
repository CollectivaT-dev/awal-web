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

const formSchema = z
    .object({
        username: z.string().min(1,{ message: 'Necessari' }),
        email: z.string().email("L'adreça de correu no es vàlida"),
        password: z.string().min(1, { message: 'Necessari' }),
        confirmPassword: z.string().nonempty({ message: 'Necessari' }),
        isPrivacy: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les contrasenyes no coincideixen',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof formSchema>;
export default function RegisterForm() {
    const router = useRouter();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(formSchema),
    });
    const onSubmit = async (data: RegisterFormValues) => {
        const { username, email, password, isPrivacy } = data;
        if (!data.isPrivacy) {
            toast.error(
                'Si us plau, llegeixi i accepti els termes de contribució per continuar',
                { position: 'bottom-center' },
            );
            return;
        }
        try {
            // Attempt to register the user
            const registrationResponse = await axios.post(`/api/register`, {
                username,
                email,
                password,
                isPrivacy,
            });

            if (registrationResponse.status === 200) {
                toast.success('Registre Amb Èxit', {
                    position: 'bottom-center',
                });
            } else {
                toast.error('Si us plau, torneu-ho a provar més tard.', {
                    position: 'bottom-center',
                });
            }

            const loginAttempt = await axios.post(`/api/signIn`, {
                email,
                password,
            });

            // Redirect to signIn page
            if (loginAttempt.status === 200) {
				router.push('/signIn', { scroll: false });;
            }
            router.push('/', { scroll: false });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // console.error(error.data);
                const errorData = error.response.data;
				console.log(errorData)
                console.log(error);
                if (error.response.status === 409) {
                    if (errorData && typeof errorData === 'object') {
                        if (errorData.email) {
                            toast.error('Correu electrònic ja en ús', {
                                position: 'bottom-center',
                            });
                        } else if (errorData.username) {
                            toast.error("Nom d'usuari ja agafat", {
                                position: 'bottom-center',
                            });
                        } else {
                            toast.error(
                                "Nom d'usuari o correu electrònic ja en ús",
                                { position: 'bottom-center' },
                            );
                        }
                    } else {
                        toast.error(
                            'Si us plau, torneu-ho a intentar més tard.',
                            { position: 'bottom-center' },
                        );
                    }
                } else {
                    // Handle other types of errors
                    const errorMessage =
                        errorData?.message ||
                        'Ha ocorregut un error inesperat.';
                    toast.error(errorMessage, { position: 'bottom-center' });
                }
            }
        }
    };

	if (form.formState.errors.username?.message?.includes('Required')) {
		form.formState.errors.username.message = 'Necessari'
	}
	if (form.formState.errors.email?.message?.includes('Required')) {
		form.formState.errors.email.message = 'Necessari'
	}
	if (form.formState.errors.password?.message?.includes('Required')) {
		form.formState.errors.password.message = 'Necessari'
	}
	if (form.formState.errors.confirmPassword?.message?.includes('Required')) {
		form.formState.errors.confirmPassword.message = 'Necessari'
	}
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 h-[100vh] flex flex-col justify-center items-center"
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>usuari</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="usuari" />
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
                            <FormLabel>email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="email" />
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
                                contrasenya
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder="contrasenya"
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
                                confirmar contrasenya
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder="confirmar contrasenya"
                                />
                            </FormControl>

                            {form.formState.errors.confirmPassword && (
                                <FormMessage className="text-white">
                                    {
                                        'requiremos que la contrasenya coincideixen'
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
                                    Accepta{' '}
                                    <Link
                                        href={'/privacy'}
                                        target="_blank"
                                        scroll={false}
                                        className="text-blue-500"
                                    >
                                        els termes de contribuci&#243;
                                    </Link>{' '}
                                    abans de finalitzar el registre.
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit">Registre</Button>
            </form>
        </Form>
    );
}
