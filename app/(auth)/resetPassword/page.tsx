'use client';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import ResetPasswordForm from './ResetPasswordForm';
import toast from 'react-hot-toast';
import { FormProvider } from 'react-hook-form';

interface ResetPasswordPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}
const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
    searchParams,
}) => {
    const [formData, setFormData] = useState(null);
    const token = searchParams?.token || '';
    const url =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://awaldigital.org';
    // console.log(token);
    useEffect(() => {
        const handleTokenVerify = async () => {
            try {
                const res = await axios.post(`${url}/api/auth/reset-password`, {
                    token,
                });
                console.log(res.data);
                console.log(res.status);
                if (res.status === 200) {
                    setFormData(res.data);
                }
            } catch (error) {
                console.log(error);
                // console.log(error);
                // if (axios.isAxiosError(error) && error.response) {
                //     console.log(error);
                //     if (error.message.includes('Invalid')) {
                //         toast.error('token is invalid');
                //     } else if (error.message.includes('Expired')) {
                //         toast.error('token is expired');
                //     }
                // }
            }
        };
        handleTokenVerify();
    }, [token, url]);
    return (
        <div>
            {formData ? (
                <ResetPasswordForm data={formData} />
            ) : (
                <div>Verifying token...</div>
            )}
        </div>
    );
};
export default ResetPasswordPage;
