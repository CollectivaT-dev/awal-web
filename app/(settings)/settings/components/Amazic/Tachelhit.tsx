import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AmazicConfig } from '@/app/(settings)/SettingsConfig';
import { SelectButton } from '../SelectButton';
import { Input } from '@/components/ui/input';

//unchecked status
const LanguageSchema = z.object({
    isChecked: z.literal(false),
});

//checked status
const checkedLanguageSchema = z
    .object({
        isChecked: z.literal(true),
        oral: z
            .number({ required_error: 'Please enter a number from 1 to 5' })
            .min(1)
            .max(5),
        written_tif: z
            .number({ required_error: 'Please enter a number from 1 to 5' })
            .min(1)
            .max(5),
        written_lat: z
            .number({ required_error: 'Please enter a number from 1 to 5' })
            .min(1)
            .max(5),
    })
    .required({ oral: true, written_tif: true, written_lat: true });

// set isChecked as condition

const FormSchema = z.discriminatedUnion('isChecked', [
    checkedLanguageSchema,
    LanguageSchema,
]);
type LanguageFormSchema = z.infer<typeof FormSchema>;
const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number,
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;

    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

const Tachelhit = ({
    sendData,
    fetchData,
}: {
    sendData: (data: AmazicConfig.AmazicProps) => void;
    fetchData?: AmazicConfig.AmazicProps[];
}) => {
    const isFetchDataArray = Array.isArray(fetchData);

    const initialFormState =
        isFetchDataArray && fetchData.length > 0
            ? {
                  isChecked: fetchData[0].isChecked ?? false,
                  oral: fetchData[0].oral ?? 1,
                  written_lat: fetchData[0].written_lat ?? 1,
                  written_tif: fetchData[0].written_tif ?? 1,
              }
            : null;

    const [formState, setFormState] = useState<AmazicConfig.AmazicProps | null>(
        initialFormState,
    );
    const form = useForm<LanguageFormSchema>({
        resolver: zodResolver(FormSchema),
    });

    useEffect(() => {
        if (fetchData && fetchData.length > 0) {
            const { isChecked, oral, written_lat, written_tif } = fetchData[0];
            form.reset({
                isChecked: isChecked ?? false,
                oral: oral ?? 1,
                written_lat: written_lat ?? 1,
                written_tif: written_tif ?? 1,
            });
        }
    }, [fetchData, form]);

    const handleButtonChange = useCallback(
        (field: keyof AmazicConfig.AmazicProps, value: number) => {
            form.setValue(field, value, { shouldValidate: true });
            setFormState((prevState) => {
                // Ensure prevState is not null
                if (prevState) {
                    return {
                        ...prevState,
                        [field]: value,
                    };
                }
                return null;
            });
        },
        [form],
    );

    const handleChecked = () => {
        const newChecked = !form.getValues('isChecked');
        form.setValue('isChecked', newChecked, { shouldValidate: true });

        setFormState((prevState) => {
            if (!prevState) return null;

            // Update the state with new values or existing ones if undefined
            return {
                ...prevState,
                isChecked: newChecked,
                oral: prevState.oral ?? 1,
                written_lat: prevState.written_lat ?? 1,
                written_tif: prevState.written_tif ?? 1,
            };
        });
    };

    const debouncedSendData = useMemo(
        () => debounce(sendData, 500),
        [sendData],
    );

    useEffect(() => {
        if (formState) {
            debouncedSendData(formState);
        }
    }, [formState, debouncedSendData]);

    const isCheckedBox = form.watch('isChecked');
    // console.log('Conditional Rendering - isChecked:', isCheckedBox);
    // if (isCheckedBox) {
    //     console.log('Render form fields for checked state');
    // } else {
    //     console.log('Render form fields for unchecked state');
    // }
    // console.log(formState);
    // console.log('isChecked state:', formState.isChecked);
    // console.log('isChecked form watch:', form.watch('isChecked'));

    return (
        <div>
            <Form {...form}>
                <form>
                    <div>
                        {/* //> isChecked */}
                        <FormField
                            name="isChecked"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex justify-start items-center">
                                    <FormLabel> Tachelhit</FormLabel>
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={form.watch('isChecked')}
                                            className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                            onChange={handleChecked}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* //> only showing if the dialect is checked */}
                    {isCheckedBox && (
                        <div className="flex flex-col gap-2 p-2 ">
                            <FormField
                                control={form.control}
                                name="oral"
                                render={(field) => (
                                    <FormItem>
                                        <FormLabel> Oral</FormLabel>

                                        <FormControl>
                                            <SelectButton
                                                currentValue={form.watch(
                                                    'oral',
                                                )}
                                                name="oral"
                                                onChange={handleButtonChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="written_lat"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>
                                            {' '}
                                            Escrit (llat&#237;)
                                        </FormLabel>
                                        <FormControl>
                                            <SelectButton
                                                currentValue={form.watch(
                                                    'written_lat',
                                                )}
                                                name="written_lat"
                                                onChange={handleButtonChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="written_tif"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Escrit (tifinagh)</FormLabel>
                                        <FormControl>
                                            <SelectButton
                                                currentValue={form.watch(
                                                    'written_tif',
                                                )}
                                                name="written_tif"
                                                onChange={handleButtonChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                    {/* <pre>{JSON.stringify(form.watch(), null, 2)}</pre> */}
                </form>
            </Form>
        </div>
    );
};

export default Tachelhit;
