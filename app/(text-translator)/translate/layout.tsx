import TextTranslator from '@/app/components/textTranslator/translator/TextTranslator';
import TranslatorNav from '@/components/ui/Navbar/TranslatorNav';
import ClientProvider from '@/providers/ClientProvider';

export default async function TranslatePageLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div >
            <TranslatorNav />
            <TextTranslator />
            {children}
        </div>
    );
}
