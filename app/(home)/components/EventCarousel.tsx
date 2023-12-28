'use client'
import useLocaleStore from '@/app/hooks/languageStore';
import { ChevronLeftSquareIcon, ChevronRightSquareIcon } from 'lucide-react';
import Link from 'next/link';

const EventCarousel = () => {
	const {locale} = useLocaleStore();
	
	console.log(locale)
    return (
        <>
            <main className="flex flex-row items-center justify-between bg-yellow-500 px-5 w-[80%] rounded-xl mt-10">
                <ChevronLeftSquareIcon />
                <Link href={'/'} scroll={false}>
                    <div className=" py-10 flex flex-col justify-between items-center space-y-2 ">
                        <h1 className="text-3xl font-bold">
                            Marat&#243; de dades Awal
                        </h1>
                        <p>10/02/2024</p>
                    </div>
                </Link>
                <ChevronRightSquareIcon />
            </main>
        </>
    );
};
export default EventCarousel;
