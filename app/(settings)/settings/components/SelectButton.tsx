import { AmazicConfig } from '@/app/(settings)/SettingsConfig';
import { Button } from '@/components/ui/button';
export interface SelectButtonProps {
    name: keyof AmazicConfig.AmazicProps;
    currentValue: number;
    onChange: (field: keyof AmazicConfig.AmazicProps, value: number) => void;
}
export const SelectButton: React.FC<SelectButtonProps> = ({
    name,
    currentValue,
    onChange,
}) => {
    const val = [1, 2, 3, 4, 5];
    return (
        <div className="flex space-x-2">
            {val.map((value) => (
                <Button
                    key={value}
                    type="button"
                    className={`px-4 py-2 border rounded-sm transition duration-500 ${currentValue === value ? 'bg-blue-500' : 'bg-gray-300'}`}
                    onClick={() => onChange(name, value)}
                >
                    {value}
                </Button>
            ))}
        </div>
    );
};