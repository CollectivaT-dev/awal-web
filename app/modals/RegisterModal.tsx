'use client';

import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useRegisterModal from '../hooks/useRegisterModal';
import { useCallback, useState } from 'react';
import Modal from './Modal';
import Heading from '@/components/ui/Heading';
import {Input} from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import {Button} from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import useLoginModal from '@/app/hooks/useLoginModal';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
const formSchema = z
    .object({
        username: z.string(),
        email: z.string().email(),
        password: z.string(),
        confirmPassword: z.string(),
        isPrivacy: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });
	type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } =  useForm<RegisterFormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios
            .post('/api/register', data)
            .then(() => {
                toast.success('Registre Amb Èxit', {position:'bottom-center'});
                registerModal.onClose();
                loginModal.onOpen();
            })
            .catch(() => {
                toast.error('Si us plau, torneu-ho a provar més tard.', {position:'bottom-center'});
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4 capitalize">
            <Heading title="welcome to airbnb" description="create an account" />
            <Input
                id="email"
                label="email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="name"
                label="name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                label="password"
                type="password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    const footerContent = (
        <div className="flex-col flex gap-4 mt-3 capitalize">
            <hr />
          
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="flex flex-row items-center gap-2 capitalize justify-center">
                    <div>already have an account?</div>
                    <div
                        onClick={toggle}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    >
                        log in
                    </div>
                </div>
            </div>
        </div>
    );
    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default RegisterModal;
