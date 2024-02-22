'use client';
import ProjectIntro from './components/ProjectIntro';
import Stats from './components/Stats';
import Translation from './components/Translation';
import ClientProvider from '@/providers/ClientProvider';
import EventCarousel from './components/EventCarousel';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import useLocaleStore from '../hooks/languageStore';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import getCurrentUser from '../actions/get/getCurrentUser';

export default function HomepageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { update, data: session } = useSession();
    const [totalEntries, setTotalEntries] = useState(0);
    const [topTen, setTopTen] = useState([]);
    const [totalValidation, setTotalValidation] = useState(0);
    const apiUrl =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : `https://awaldigital.org`;
    console.log(session);
    const { setLocale } = useLocaleStore();
    const lang = useSearchParams().get('lang') || 'ca';
	const a = async () => {
       updateUser= await getCurrentUser();
    };
    console.log(updateUser);
    useEffect(() => {
        if (session?.user?.isVerified === true) {
            update({ user: session?.user });
        }
    }, []);
    useEffect(() => {
        if (lang) {
            setLocale(lang);
        }
    }, [lang, setLocale]);
    // get total entries
    useEffect(() => {
        const fetchData = async () => {
            try {
                // delete dependency array to fetch on page refresh
                const req = await axios.get(`${apiUrl}/api/stats`);
                console.log(req.data.topTen);
                console.log(req.data.totalValidation);
                setTotalEntries(req.data.totalEntries);
                setTopTen(req.data.topTen);
                setTotalValidation(req.data.totalValidation);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        fetchData();
    }, [apiUrl]);
    console.log(topTen);
    console.log(totalValidation);
    return (
        <div className="flex flex-col items-center justify-center">
            <ClientProvider>
                <Translation
                    totalEntries={totalEntries}
                    totalValidation={totalValidation}
                />
                <ProjectIntro />
                <EventCarousel />
                <Stats users={topTen} />
                {children}
            </ClientProvider>
        </div>
    );
}
