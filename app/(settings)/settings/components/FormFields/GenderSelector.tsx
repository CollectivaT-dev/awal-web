import { FormControl, FormField, FormItem, FormLabel, FormMessage  } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessagesProps } from '@/i18n';

interface GenderSelectorProps {
    d?: MessagesProps;
    form: any;
}
const GenderSelector = ({ d, form }: GenderSelectorProps) => {
    return (
		
        <FormField 
            control={form.control}
            name="gender"
            render={({ field }) => {
                // console.log("Gender field value:", field.value); // Log the current value
                return (
                    <FormItem>
                        <FormLabel>{d?.user.gender}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={d?.setting.gender.select ? d?.setting.gender.select : 'Select'} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value={'m'}>{d?.setting.gender.m ? d?.setting.gender.m : 'Male'}</SelectItem>
                                <SelectItem value="f">{d?.setting.gender.f ? d?.setting.gender.f : 'Female'}</SelectItem>
                                <SelectItem value="nb">{d?.setting.gender.nb ? d?.setting.gender.nb : 'Non-binary'}</SelectItem>
                                <SelectItem value="tr">{d?.setting.gender.tr ? d?.setting.gender.tr : 'Transgender'}</SelectItem>
                                <SelectItem value="other">{d?.setting.gender.other ? d?.setting.gender.other : 'Other'}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage className="text-white" />
                    </FormItem>
                );
            }}
        />
    );
};
export default GenderSelector;
