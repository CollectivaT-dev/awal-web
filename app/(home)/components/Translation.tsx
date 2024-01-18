'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { Badge } from '@/components/ui/badge';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { MessagesProps, getDictionary } from '@/i18n';
import axios from 'axios';
import { Languages, Mic2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface TranslationProps {
    totalEntries: number;
    totalValidation: number;
}
const Translation: React.FC<TranslationProps> = ({
    totalEntries,
    totalValidation,
}) => {
    const isAboveMediumScreen = useMediaQuery('(min-width: 1024px)');

    const router = useRouter();
    const { locale } = useLocaleStore();
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);

    console.log(totalEntries);
    const handleTextTranslation = () => {
        router.push('/translate', { scroll: false });
    };
    console.log(d?.texts);
    return (
        <>
            {/* // changed w-full => w-[100vw] */}
            {isAboveMediumScreen ? (
                <div className="w-full h-[50vh] flex-row-center">
                    {/* Text Translation */}
                    <div
                        onClick={handleTextTranslation}
                        // deleted rouned-2xl
                        className="textTranslatorParent "
                        // changed style={{ width: 'calc(50% - 2rem)', height: '100%' }}
                    >
                        <h1 className="text-3xl text-[#FFE7EE] mr-auto">
                            {d?.menu.translator}
                            <br /> AWAL
                        </h1>
                        <div className="rounded-full p-10 bg-[#FFE7EE]">
                            <Image
                                src={'/Icon/Translation.svg'}
                                alt="Text Translation"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        </div>
                        <div className="mt-auto flex-col-center text-white">
                            {totalEntries ? (
                                <div className="relative">
                                    {totalEntries} {d?.texts.total_entries}
                                </div>
                            ) : (
                                <Skeleton />
                            )}

                            {totalValidation ? (
                                <div className="relative">
                                    {totalValidation}{' '}
                                    {d?.texts.total_validated_entries}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    {/* Voice Translation */}

                    <div
                        className="transVoiceParent"
                        onClick={() =>
                            window.open('https://commonvoice.mozilla.org/zgh')
                        }
                    >
                        <h1 className="text-3xl mr-auto text-text-primary">
                            {d?.menu.voice} <br />
                            AWAL
                        </h1>
                        <div className="transVoiceChild">
                            <Mic2 className="h-10 w-10" />
                        </div>
                        <div className="mt-auto flex-col-center">
                            <span>{d?.texts.total_voice_entries}</span>
                            <span>{d?.texts.total_voice_validation}</span>
                        </div>
                    </div>
                </div>
            ) : (
                // mobile view
                <ResizablePanelGroup
                    direction="horizontal"
                    className="max-w-screen rounded-lg"
                >
                    <ResizablePanel
                        defaultSize={50}
                        onClick={handleTextTranslation}
                    >
                        <div className="flex h-[200px] items-center justify-center p-6 bg-text-primary ">
                            <h1 className="text-3xl text-[#FFE7EE] mr-auto">
                                {d?.menu.translator}
                                <br /> AWAL
                            </h1>
                            <div>
                                <span className="flex-col-center space-y-2 items-center  text-white">
                                    {totalEntries ? (
                                        <div className="flex-col-center ">
                                            <span>
                                                {d?.texts.total_entries}
                                            </span>
                                            <span>{totalEntries}</span>
                                        </div>
                                    ) : (
                                        <Skeleton />
                                    )}
                                    <Separator />
                                    {totalValidation ? (
                                        <div className="flex-col-center">
                                            <span>
                                                {
                                                    d?.texts
                                                        .total_validated_entries
                                                }
                                            </span>
                                            <span>{totalValidation}</span>
                                        </div>
                                    ) : null}
                                </span>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel
                        defaultSize={50}
                        onClick={() =>
                            window.open('https://commonvoice.mozilla.org/zgh')
                        }
                    >
                        <div className="flex-row flex h-[200px] items-center justify-around p-6 mx-auto bg-[#EFBB3F]">
                            <h1 className="text-3xl text-text-primary">
                                {d?.menu.voice}
                                <br />
                                AWAL
                            </h1>
                            <div>
                                <span className="flex-col-center space-y-2  text-white">
                                    <span>{d?.texts.total_voice_entries}</span>
                                    <Separator />

                                    <span>
                                        {d?.texts.total_voice_validation}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
                // <div className="w-screen flex-col-center">
                //     <div
                //         className="textTranslatorParent"
                //         onClick={handleTextTranslation}
                //     ></div>
                //     <div className="transVoiceParent"></div>

                //     <div></div>
                // </div>
            )}
        </>
    );
};
export default Translation;
