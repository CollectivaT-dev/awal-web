'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import Heading from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { MessagesProps, getDictionary } from '@/i18n';
import { useEffect, useState } from 'react';
import Image from 'next/image';
const ProjectIntro = () => {
    const router = useRouter();
    const { data: session } = useSession();
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
        <div className=" py-10 whitespace flex-col-center mx-10 text-text-primary">
            {/* header */}
            <h1 className="text-3xl font-semibold ">{d?.page_intro?.title}</h1>
            {/* body */}
            <div className="flex-row-center ">
                <div className="flex flex-col w-1/2   text-gray-700">
                    <p>{d?.page_intro?.CTA_text}</p>
                    <p className="pt-2">
                        <Heading
                            title={`${d?.page_intro.heading_1}`}
                            titleClassName="text-xl mb-2"
                        />

                        <ul className="list-disc space-y-3">
                            <li className="ml-4">
                                <strong>{d?.page_intro.item_1_strong}</strong>
                                {d?.page_intro.item_1_normal}
                            </li>
                            <li className="ml-4">
                                <strong>{d?.page_intro.item_2_strong}</strong>
                                {d?.page_intro.item_2_normal}
                            </li>
                            <li className="ml-4">
                                <strong>{d?.page_intro.item_3_strong}</strong>{' '}
                                {d?.page_intro.item_3_normal}
                            </li>
                        </ul>
                    </p>
                </div>
                <Image
                    src={'/intro-icon.svg'}
                    alt="amazic-logo"
                    width={100}
                    height={200}
			className='mr-3'
                />
                <div className="flex flex-col w-1/2   text-gray-700">
				<Heading
                        title={`${d?.page_intro.heading_2}`}
                        titleClassName="text-xl pt-5"
                    />

                    <p className="">{d?.page_intro.text_2}</p>
                    <Heading
                        title={`${d?.page_intro.heading_3}`}
                        titleClassName="text-xl pt-5"
                    />

                    <p className="">{d?.page_intro.text_3}</p>
                    <Heading
                        title={`${d?.page_intro.heading_4}`}
                        titleClassName="text-xl pt-5"
                    />
                    <p>{d?.page_intro.text_4}</p>
                </div>
            </div>
            {/* sign in button */}
            {session ? (
                ''
            ) : (
                <Button
                    variant="default"
                    size="xl"
                    className="mt-5 bg-text-primary text-sm mobile:text-xl"
                    onClick={() => router.push('/signIn', { scroll: false })}
                >
                    {d?.page_intro.CTA_button}
                </Button>
            )}
        </div>
    );
};
export default ProjectIntro;
