'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import Link from 'next/link';
import { MessagesProps, getDictionary } from '@/i18n';
import { useEffect, useRef, useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import useMediaQuery from '@/app/hooks/useMediaQuery';
const EventCarousel = () => {
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    const isAboveLgScreen = useMediaQuery('(min-width: 1024px)');
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);
    const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
    return (
        <>
            {isAboveLgScreen ? (
                <Carousel
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    opts={{
                        align: 'center',
                    }}
                    className="w-1/2"
                >
                    <CarouselContent>
                        {/* new item, change class name basis-1/2 for card size and responsiveness <></> */}
                        <CarouselItem>
                            <div className="p-1">
                                <Card>
                                    <Link href={'/'} scroll={false}>
                                        <CardContent className="flex-col-center">
                                            <span className="py-10 flex flex-col justify-between items-center space-y-2 ">
                                                <h1 className="text-3xl font-bold">
                                                    {d?.texts.data_marathon}
                                                </h1>
                                                <p>17/02/2024</p>
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
            ) : (
                <Carousel
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    opts={{
                        align: 'center',
                        loop: true,
                    }}
                    className=" w-1/2 "
                >
                    <CarouselContent>
                        <CarouselItem>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="flex-col-center text-center space-y-2">
                                            <h1 className="text-xl font-semibold">
                                                {d?.texts.data_marathon}
                                            </h1>
                                            <p>17/02/2024</p>
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                        {/* <CarouselItem>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-4xl font-semibold">
                                            b
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem> */}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            )}
        </>
    );
};
export default EventCarousel;
