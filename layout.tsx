import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProviders from '@/providers/SessionProviders';
import Navbar from '@/components/ui/Navbar/Navbar';
import { ToastProvider } from '@/providers/ToastProvider';
import ClientProvider from '@/providers/ClientProvider';
import Footer from '@/components/ui/Footer';
import { Analytics } from '@vercel/analytics/react';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import Loading from './loading';
const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
    title: 'Awal',
    description: "Internet parla l'Amazic!",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const Locale = headers().get('Accept-Language')?.slice(0, 2) ?? 'ca';

    return (
        <html lang={Locale}>
            <body className={inter.className}>
                <div className=" bg-bg-gradient">
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
                <Analytics />
            </body>
        </html>
    );
}
