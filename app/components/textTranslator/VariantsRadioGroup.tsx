import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { MessagesProps } from '@/i18n';
import { Dispatch, SetStateAction } from 'react';
interface VariantsRadioGroupProps {
    isContributor: boolean;
    side: 'left' | 'right';
    sourceLanguage: string;
    targetLanguage: string;
    srcVar: string;
    tgtVar: string;
    d?: MessagesProps;
    setSrcVar: Dispatch<SetStateAction<string>>;
    setTgtVar: Dispatch<SetStateAction<string>>;
}

export const VariantsRadioGroup = ({ isContributor, side, sourceLanguage, targetLanguage, srcVar, tgtVar, setSrcVar, setTgtVar, d }: VariantsRadioGroupProps) => {
    const languagesToRender = (side === 'left' && ['zgh', 'ber'].includes(sourceLanguage)) || (side === 'right' && ['zgh', 'ber'].includes(targetLanguage));
    const variants = [d?.variation.std as string, d?.variation.central as string, d?.variation.tif as string, d?.variation.tachelhit as string, d?.variation.other as string]; // List of all variants
    if (languagesToRender) {
        const radioGroupValue = side === 'left' ? srcVar : tgtVar;
        return (
            <RadioGroup className="flex flex-row mt-3 justify-between">
                {variants.map((value) => (
                    <div className="flex flex-row justify-start items-center space-x-2" key={value}>
                        <Checkbox
                            value={value}
                            id={`${value}-${side}`}
                            checked={radioGroupValue === value}
                            onCheckedChange={
                                isContributor
                                    ? (checkedValue) => {
                                          console.log('🚀 ~ checkedValue:', checkedValue, value);
                                          const newValue = checkedValue ? value : '';
                                          console.log(newValue);
                                          if (side === 'left') {
                                              setSrcVar(newValue);
                                          } else {
                                              setTgtVar(newValue);
                                          }
                                      }
                                    : () => {
                                          console.log('in validator comp, radio not selectable');
                                      }
                            }
                        />

                        <Label htmlFor={`${value}-${side}`} className=" lg:text-base text-[12px]">
                            {value}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        );
    } else {
        return null;
    }
};
