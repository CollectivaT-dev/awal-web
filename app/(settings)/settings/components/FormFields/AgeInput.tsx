import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MessagesProps } from '@/i18n';

interface AgeInputProps {
    d?: MessagesProps;
    form: any;
    loading: boolean;
}
const AgeInput = ({ d, form, loading }: AgeInputProps) => {
    return (
        <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{d?.user.age}</FormLabel>
                    <FormControl>
                        <Input
                            disabled={loading}
                            {...field}
                            placeholder={d?.user.age}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const age = parseInt(e.target.value, 10);
                                if (!isNaN(age)) {
                                    form.setValue('age', age);
                                } else {
                                    form.setValue('age', 0);
                                }
                            }}
                        />
                    </FormControl>
                    <FormMessage className="text-white" />
                </FormItem>
            )}
        />
    );
};
export default AgeInput;
