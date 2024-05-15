import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessagesProps } from '@/i18n';
import { CountryRegionData } from 'react-country-region-selector';
interface OriginSelectorProps {
    d?: MessagesProps;
    form: any;
}
const OriginSelector = ({ d, form }: OriginSelectorProps) => {
    const countryData = CountryRegionData.map((country) => ({
        name: country[0],
        code: country[1],
    }));
    const selectedCountryName = countryData.find((country) => country.code === form.watch('origin'))?.name;
    return (
        <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{d?.user.origin} </FormLabel>
                    <Select
                        onValueChange={(value) => {
                            const selectedCountry = countryData.find((country) => country.name === value);
                            if (selectedCountry) {
                                field.onChange(selectedCountry.code);
                            }
                        }}
                        value={selectedCountryName ?? ''}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={selectedCountryName} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {countryData.map((country, index) => (
                                <SelectItem key={index} value={country.name}>
                                    {country.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage className="text-white" />
                </FormItem>
            )}
        />
    );
};
export default OriginSelector;
