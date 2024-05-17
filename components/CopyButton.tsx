import { Button } from '@/components/ui/button';
import { MessagesProps } from '@/i18n';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';
interface TextCopyProps {
    text: string;
    d?: MessagesProps;
}
export const CopyButton: React.FC<TextCopyProps> = ({ text, d }) => {
    const handleCopy = () => {
        if (text) {
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    toast.success(`${d?.toasters.success_copy}`);
                })
                .catch((err) => {
                    console.error(`${d?.toasters.alert_try_again}`, err);
                    toast.error(`${d?.toasters.alert_copy}`);
                });
        }
    };
    return (
        <Button size={'icon'} onClick={handleCopy}>
            <Copy size={20} />
        </Button>
    );
};
