import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
interface VariantsRadioGroupProps {
    isContributor: boolean;
    side: 'left' | 'right';
    sourceLanguage: string;
    targetLanguage: string;
    srcVar: string;
    tgtVar: string;
    setLeftRadioValue: (value: string) => void;
    setRightRadioValue: (value: string) => void;
}
const variants = ['Standard', 'Central', 'Tarifit', 'Tachelhit', 'Other']; // List of all variants

export const VariantsRadioGroup = ({
    isContributor,
    side,
    sourceLanguage,
    targetLanguage,
    srcVar,
    tgtVar,
    setLeftRadioValue,
    setRightRadioValue,
}: VariantsRadioGroupProps) => {
    const languagesToRender =
        (side === 'left' && ['zgh', 'ber'].includes(sourceLanguage)) ||
        (side === 'right' && ['zgh', 'ber'].includes(targetLanguage));

    if (languagesToRender) {
        const radioGroupValue = side === 'left' ? srcVar : tgtVar;

        return (
            <RadioGroup className="flex flex-row mt-3 justify-between">
                {variants.map((value) => (
                    <div
                        className="flex flex-row justify-start items-center space-x-2"
                        key={value}
                    >
                        <Checkbox
                            value={value}
                            id={`${value}-${side}`}
                            checked={radioGroupValue === value}
                            onCheckedChange={
                                isContributor
                                    ? (checkedValue) => {
                                          const newValue = checkedValue
                                              ? value
                                              : '';
                                          if (side === 'left') {
                                              setLeftRadioValue(newValue);
                                          } else {
                                              setRightRadioValue(newValue);
                                          }
                                      }
                                    : () => {}
                            }
                            disabled={!isContributor}
                        />

                        <Label htmlFor={`${value}-${side}`}>{value}</Label>
                    </div>
                ))}
            </RadioGroup>
        );
    } else {
        return null;
    }
};
