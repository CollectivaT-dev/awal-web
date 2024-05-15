import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MessagesProps, User } from '@/i18n';
interface FormInputProps {
    d?: MessagesProps;
    form: any;
    loading: boolean;
    fieldLabel: keyof User;
}
export const TextInput = ({ d, form, loading, fieldLabel }: FormInputProps) => {
    return (
        <FormField
            control={form.control}
            name={fieldLabel as string}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{d?.user[fieldLabel]}</FormLabel>
                    <FormControl>
                        <Input disabled={loading} {...field} placeholder={d?.user[fieldLabel]} />
                    </FormControl>
                    <FormMessage className="text-white" />
                </FormItem>
            )}
        />
    );
};
