'use client';
import prisma from '@/lib/prisma';
import { Button } from './ui/button';
import crypto from 'crypto';
import { SendEmail } from '@/app/actions/emails/SendEmail';
import EmailVerification from '@/app/components/Emails/EmailVerification';
import axios from 'axios';
interface VerificationAlertProps {
    data: { userId?: string; email: string };
}
const VerificationAlert: React.FC<VerificationAlertProps> = ({ data }) => {
    const emailVerificationToken = crypto
        .randomBytes(32)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    console.log(data.userId);

    const handleVerification = async () => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/auth/verify-email',
                data.userId,
            );
            console.log(res);
            // await SendEmail({
            //     from: 'Awal Email Verification<do-not-reply@awaldigital.org>',
            //     to: [data.email],
            //     subject: 'Verify your email address',
            //     react: EmailVerification({
            //         email: data.email,
            //         emailVerificationToken,
            //     }),
            // });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <Button onClick={handleVerification}>d</Button>
        </div>
    );
};
export default VerificationAlert;
