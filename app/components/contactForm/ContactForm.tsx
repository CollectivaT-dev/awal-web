'use client';
import { SendEmail } from '@/app/actions/emails/SendEmail';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import ContactFormTemplate from '@/app/components/Emails/ContactFormTemplate';
import { useEffect } from 'react';
const formSchema = z.object({
    email: z.string().email(),
    subject: z.string().min(5),
    message: z.string().min(10),
});
interface ContactFormProps {
    data: {
        email?: string;
        username?: string;
        id?: string;
    };
}
const ContactForm: React.FC<ContactFormProps> = ({
    data: { email, id, username },
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email || '',
            subject: '',
            message: '',
        },
    });
    useEffect(() => {
        form.reset({
            email: email || '',
        });
    }, [email]);
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            await SendEmail({
                from: 'ContactForm<user@awaldigital.org>',
                // destination email
                // to: 'awal@collectivat.cat',
                subject: `${values.subject} from ${email}`,
                react: ContactFormTemplate({
                    email,
                    id,
                    username,
                    subject: values.subject,
                    message: values.message,
                }),
            });
            toast.success('Email sent successfully');
            form.reset({
                email: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            // console.log(error);
            toast.error(
                'error while sending email, please send an email manually to awal@collectivat.cat',
            );
        }
    };
	
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8 w-[50vw]"
            >
                <div className="flex flex-col">
                    <div className="flex flex-col justify-center items-center w-full md:flex-row">
                        {' '}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex-2 flex flex-col">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            // value={email || ''}
                                            placeholder={'email'}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        input your email
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem className="flex-1 flex flex-col ml-5">
                                    <FormLabel>Subject</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={'subject'}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        input your email
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>message</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about your problem"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>description</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};
export default ContactForm;
