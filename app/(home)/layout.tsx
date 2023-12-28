import Footer from '@/components/ui/Footer';
import ProjectIntro from './components/ProjectIntro';
import Stats from './components/Stats';
import Translation from './components/Translation';
import ClientProvider from '@/providers/ClientProvider';
import EventCarousel from './components/EventCarousel';

export default async function HomepageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center " >
            <ClientProvider>
                <Translation />
                <ProjectIntro />
                <EventCarousel />
                {/* <Stats /> */}
                {children}
            </ClientProvider>
        </div>
    );
}
