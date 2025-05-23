import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProviders from '@/providers/SessionProviders';
import Navbar from '@/components/ui/Navbar/Navbar';
import { ToastProvider } from '@/providers/ToastProvider';
import ClientProvider from '@/providers/ClientProvider';
import Footer from '@/components/ui/Footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import Loading from './loading';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Awal',
    description: "Internet parla l'Amazic!",
    keywords: 'translation, amazic, catalan, tamazight, marginalized',
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const headersList = await headers(); // ✅ Now allowed
    const Locale = headersList.get('accept-language') || 'en'; // fallback if null

    return (
        <html lang={Locale}>
            <body className={inter.className}>
                <div className="bg-bg-gradient">
                    <ClientProvider>
                        <SessionProviders>
                            <ToastProvider />
                            <Suspense fallback={<Loading />}>
                                <Navbar />
                            </Suspense>
                            {children}
                            <Footer />
                        </SessionProviders>
                    </ClientProvider>
                </div>
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
