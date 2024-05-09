import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
interface RadioGroupProps {
    side: 'left' | 'right';
    sourceLanguage: string;
    targetLanguage: string;
    srcVar: string;
    tgtVar: string;
    setLeftRadioValue: (value: string) => void;
    setRightRadioValue: (value: string) => void;
}
export const LanguageRadioGroup = ({
    side,
    sourceLanguage,
    targetLanguage,
    srcVar,
    tgtVar,
    setLeftRadioValue,
    setRightRadioValue,
}: RadioGroupProps) => {
    const languagesToRender =
        (side === 'left' && ['zgh', 'ber'].includes(sourceLanguage)) ||
        (side === 'right' && ['zgh', 'ber'].includes(targetLanguage));

    if (languagesToRender) {
        const radioGroupValue = side === 'left' ? srcVar : tgtVar;

        return (
            // TODO: adding standing when api is ready
            <RadioGroup className="flex flex-row mt-3 justify-between">
                {['Central', 'Tarifit', 'Tachelhit', 'Other'].map((value) => (
                    <div
                        className="flex flex-row justify-start items-center space-x-2"
                        key={value}
                    >
                        <Checkbox
                            value={value}
                            id={`${value}-${side}`}
                            checked={radioGroupValue === value}
                            onCheckedChange={(checkedValue) => {
                                const newValue = checkedValue ? value : '';
                                side === 'left'
                                    ? setRightRadioValue(newValue)
                                    : setLeftRadioValue(newValue);
                            }}
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
