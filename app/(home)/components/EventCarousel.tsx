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

interface Carousel {
    [key: string]: {
        heading: string;
        body: string;
        link: string;
    };
}
const EventCarousel = () => {
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    const isAboveLgScreen = useMediaQuery('(min-width: 1024px)');
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m as unknown as MessagesProps);
        };
        fetchDictionary();
    }, [locale]);
    const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
    // get carousel object from json
   const c: Carousel = d?.carousel ?? {};
    // console.log(c);
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
                        {Object.keys(c).map((key) => (
                            <CarouselItem key={key} >
                                <div className="p-1">
                                    <Card className='bg-yellow-100'>
                                        <Link
                                            href={c[key].link}
                                            scroll={false}
                                            target="_blank"
                                        >
                                            <CardContent className="py-10 flex flex-col justify-evenly items-center min-h-[250px]">
                                                <h1 className="text-3xl font-bold">
                                                    {c[key].heading}
                                                </h1>
                                                <p className="whitespace-pre-wrap text-center">
                                                    {c[key].body}
                                                </p>
                                            </CardContent>
                                        </Link>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
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
                    className="w-1/2"
                >
                    <CarouselContent>
                        {Object.keys(c).map((key) => (
                            <CarouselItem key={key}>
                                <div className="p-1">
                                    <Card>
                                        <Link href={c[key].link} scroll={false}>
                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                <span className="flex-col-center text-center space-y-2">
                                                    <h1 className="text-xl font-semibold">
                                                        {c[key].heading}
                                                    </h1>
                                                    <p> {c[key].body}</p>
                                                </span>
                                            </CardContent>
                                        </Link>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            )}
        </>
    );
};
export default EventCarousel;
