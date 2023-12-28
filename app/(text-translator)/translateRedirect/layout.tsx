import TranslatorNav from '@/components/ui/Navbar/TranslatorNav';

export default async function ValidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
	console.log("first")
    return (
        <div>
			<TranslatorNav/>
           
            {children}
        </div>
    );
}
