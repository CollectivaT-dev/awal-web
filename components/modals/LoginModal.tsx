'use client';

import { FcGoogle } from 'react-icons/fc';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useRegister from '@/app/hooks/useRegister';
import { useCallback, useState } from 'react';
import Modal from './Modal';
import Heading from '@/components/ui/Heading';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import { PrimaryButton } from '@/components/ui/button';
import useLogin from '@/app/hooks/useLogin';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginModal = () => {
    const router = useRouter();
    const registerModal = useRegister();
    const loginModal = useLogin();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        signIn('credentials', {
            ...data,
            redirect: false,
        }).then((callback) => {
            setIsLoading(false);

            if (callback?.ok) {
                toast.success('Logged In');
                router.refresh();
                loginModal.onClose();
            }
            if (callback?.error) {
                toast.error(callback.error);
            }
        });
    };
    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4 capitalize">
            <Heading title="welcome back" subtitle="log in to your account" />
            <Input
                id="email"
                label="email"
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
        <div className="flex-col flex gap-4 mt-3">
            <hr />
            <PrimaryButton label="Continue with Google" icon={FcGoogle} onClick={() => signIn('google')}>
			
            
            </PrimaryButton>
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="flex flex-row items-center gap-2 capitalize justify-center">
                    <div>login modal</div>
                    <div
                        onClick={toggle}
                        className="text-neutral-800 capitalize cursor-pointer hover:underline"
                    >
                        Create an account
                    </div>
                </div>
            </div>
        </div>
    );
    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default LoginModal;
