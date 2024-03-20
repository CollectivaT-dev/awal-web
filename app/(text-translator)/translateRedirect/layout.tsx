import TranslatorNav from '@/components/ui/Navbar/TranslatorNav';

export default async function ValidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
			
           
            {children}
        </div>
    );
}
