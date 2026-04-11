'use server';
import { Resend } from 'resend';

export const SendEmail = async (payloads: any, options?: any) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    return resend.emails.send(payloads, options);
};
