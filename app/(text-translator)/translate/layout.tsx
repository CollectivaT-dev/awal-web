import TextTranslator from '@/app/components/textTranslator/translator/TextTranslator';
import TranslatorNav from '@/components/ui/Navbar/TranslatorNav';

export default async function TranslatePageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <TranslatorNav />
            <TextTranslator />
            {children}
        </div>
    );
}
