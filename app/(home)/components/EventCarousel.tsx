'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import { ChevronLeftSquareIcon, ChevronRightSquareIcon } from 'lucide-react';
import Link from 'next/link';

import { MessagesProps, getDictionary } from '@/i18n';
import { useEffect, useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
const EventCarousel = () => {
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);

    return (
        <>
            <Carousel
                opts={{
                    align: 'center',
                }}
                className=" w-1/2 "
            >
                <CarouselContent>
                    {/* new item, change class name basis-1/2 for card size and responsiveness <></> */}
                    <CarouselItem>
                        <div className="p-1">
                            <Card>
                                <Link href={'/'} scroll={false}>
                                    <CardContent className="flex-col-center ">
                                        <span className=" py-10 flex flex-col justify-between items-center space-y-2 ">
                                            <h1 className="text-3xl font-bold">
                                                {d?.texts.data_marathon}
                                            </h1>
                                            <p>10/02/2024</p>
                                        </span>
                                    </CardContent>
                                </Link>
                            </Card>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </>
    );
};
export default EventCarousel;
