'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import { Languages, Mic2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Translation = () => {
    const router = useRouter();
const {locale} = useLocaleStore();
console.log(locale)

    const handleTextTranslation = () => {
        router.push('/translate', { scroll: false });
    };
    return (
        // changed w-full => w-[100vw]
        <div className="flex justify-center items-center h-[50vh] my-10 w-full">
            <div className="flex justify-around items-center w-full h-full">
                {/* Text Translation */}
                <div
                    onClick={handleTextTranslation}
                    // deleted rouned-2xl
                    className="relative flex justify-center items-center bg-text-primary  px-20 py-13 cursor-pointer transition duration-500"
                    // changed style={{ width: 'calc(50% - 2rem)', height: '100%' }}
                    style={{ width: 'calc(50%)', height: '100%' }}
                >
                    <h1 className="absolute top-10 left-10 text-3xl text-[#FFE7EE]">
                        Traductor
                        <br /> AWAL
                    </h1>
                    <div className="flex justify-center items-center rounded-full p-10 cursor-pointer transition duration-500 bg-[#FFE7EE]">
                        <Image
                            src={'/Icon/Translation.svg'}
                            alt="Text Translation"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    </div>
                </div>

                {/* Voice Translation */}
                <div
                    className="relative flex justify-center items-center bg-[#EFBB3F]  px-20 py-13 cursor-pointer transition duration-500"
                    style={{ width: 'calc(50%)', height: '100%' }}
                    onClick={() =>
                        window.open('https://commonvoice.mozilla.org/zgh')
                    }
                >
                    <h1 className="absolute top-10 left-10 text-3xl text-text-primary">
                        Veu <br />
                        AWAL
                    </h1>
                    <div className="flex justify-center items-center rounded-full p-10 cursor-pointer transition duration-500 bg-[#FFE7EE]">
                        <Mic2 className="h-10 w-10 " />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Translation;
