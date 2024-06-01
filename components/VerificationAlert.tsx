'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import toast from 'react-hot-toast';
interface VerificationAlertProps {
    data: { userId?: string; email: string; isVerified?: boolean };
}
const VerificationAlert: React.FC<VerificationAlertProps> = ({ data }) => {
    // console.log(data);
    const { locale } = useLocaleStore();
    const [dictionary, setDictionary] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://awaldigital.org';
    const [open, setOpen] = useState(true);
    const handleVerification = async () => {
        try {
            const res = await axios.post(`${url}/api/auth/verify-email`, JSON.stringify(data.userId));
            if (res.status === 200) {
                toast.success(`${dictionary?.email?.verification.success_email}`);
            }
            // console.log(res);
        } catch (error) {
            if (error) {
                toast.error(`${dictionary?.email?.verification.error_email}`);
            }
            // console.log(error);
        }
    };
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    className="flex flex-row mx-auto p-3 bg-slate-300 h-[5vh] mt-10 relative"
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="underline cursor-pointer flex justify-end lg:text-base text-sm" onClick={handleVerification}>
                        {dictionary?.email?.verification.alert}
                    </div>
                    <X className=" justify-start flex lg:text-base text-sm absolute " size={15} onClick={() => setOpen(false)} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default VerificationAlert;
