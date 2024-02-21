'use client';

import axios from 'axios';
import { useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
interface VerificationAlertProps {
    data: { userId?: string; email: string; isVerified?: boolean };
}
const VerificationAlert: React.FC<VerificationAlertProps> = ({ data }) => {
    // console.log(data);
    const url =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://awaldigital.org';
    const [open, setOpen] = useState(true);
    const handleVerification = async () => {
        try {
            const res = await axios.post(
                `${url}/api/auth/verify-email`,
                JSON.stringify(data.userId),
            );
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-row justify-center items-center py-1 bg-slate-300">
                        <span className="mx-auto">
                            Please{' '}
                            <span
                                className="underline cursor-pointer"
                                onClick={handleVerification}
                            >
                                verify your email
                            </span>
                        </span>
                        <X className="mx-2" onClick={() => setOpen(false)} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default VerificationAlert;