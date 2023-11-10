'use client';

import axios from 'axios';
// import { AiFillGithub } from 'react-icons/ai';
// import { FcGoogle } from 'react-icons/fc';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useRegister from '@/app/hooks/useRegister';
import { useCallback, useState } from 'react';
import Modal from './Modal';
import Heading from '@/components/ui/Heading';
import Input from '@/components/inputs/Input';
import { toast } from 'react-hot-toast';
import { PrimaryButton } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import useLogin from '@/app/hooks/useLogin';

const RegisterModal = () => {
    const registerModal = useRegister();
    const loginModal = useLogin();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios
            .post('/api/register', data)
            .then(() => {
                toast.success('Registration successful');
                registerModal.onClose();
                loginModal.onOpen();
            })
            .catch(() => {
				
                toast.error('error',data);
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
            <Heading title="Welcome" subtitle="create an account" />
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

    // const footerContent = (
    //     <div className="flex-col flex gap-4 mt-3 capitalize">
    //         <hr />
    //         <Button
    //             outline
    //             label="continue with google"
    //             icon={FcGoogle}
    //             onClick={() => signIn('google')}
    //         />
    //         <Button
    //             outline
    //             label="continue with github"
    //             icon={AiFillGithub}
    //             onClick={() => signIn('github')}
    //         />
    //         <div className="text-neutral-500 text-center mt-4 font-light">
    //             <div className="flex flex-row items-center gap-2 capitalize justify-center">
    //                 <div>already have an account?</div>
    //                 <div
    //                     onClick={toggle}
    //                     className="text-neutral-800 cursor-pointer hover:underline"
    //                 >
    //                     log in
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            // footer={footerContent}
        />
    );
};

export default RegisterModal;
