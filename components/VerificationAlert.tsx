'use client';
import prisma from '@/lib/prisma';
import { Button } from './ui/button';
import crypto from 'crypto';
import { SendEmail } from '@/app/actions/emails/SendEmail';
import EmailVerification from '@/app/components/Emails/EmailVerification';
import axios from 'axios';
import { useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
interface VerificationAlertProps {
    data: { userId?: string; email: string; isVerified?: boolean };
}
const VerificationAlert: React.FC<VerificationAlertProps> = ({ data }) => {
    const emailVerificationToken = crypto
        .randomBytes(32)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    console.log(data);
    const [open, setOpen] = useState(true);
    const handleVerification = async () => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/auth/verify-email',
                JSON.stringify(data.userId),
            );
            console.log(res)
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
