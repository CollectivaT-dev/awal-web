'use server';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
// payloads:CreateEmailOptions options:CreateEmailRequestOptions
export const SendEmail = async (payloads: any, options?: any) => {
    const data = resend.emails.send(payloads, options);
    console.log('email status', data);
    return data;
};
