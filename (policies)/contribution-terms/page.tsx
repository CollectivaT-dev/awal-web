'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import { MessagesProps, getDictionary } from '@/i18n';
import Link from 'next/link';
import { useEffect, useState } from 'react';
const ContributionTermsPage = () => {
    const { locale } = useLocaleStore();

    const [d, setDictionary] = useState<MessagesProps>();

    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m);
        };

        fetchDictionary();
    }, [locale]);

    return (
        <div className="min-h-screen mx-10 flex-col-center text-xl whitespace-pre-wrap leading-8 mt-10">
            <div className="space-y-10">
                <div>
                    {d?.terms.contribution_terms}{' '}
                    <Link
                        href={'https://commonvoice.mozilla.org/en/terms'}
                        scroll={false}
                        target="_blank"
                        className="underline"
                    >
                        {d?.terms.mozilla_terms}
                    </Link>{' '}
                    <br />
                    {d?.terms.contribution_terms_continued}
                </div>
                <div>
                    <h1 className="font-semibold text-2xl">
                        {d?.terms.translation_contribution_heading}
                    </h1>
                    {d?.terms.translation_contributions}{' '}
                    <Link
                        href={'https://creativecommons.org/licenses/by/4.0/'}
                        className="underline"
                        scroll={false}
                        target="_blank"
                    >
                        {d?.terms.cc_license_link_text}
                    </Link>{' '}
                    {d?.terms.translation_continued_1}{' '}
                    <Link
                        href={
                            'https://huggingface.co/datasets/collectivat/amazic'
                        }
                        className="underline"
                        scroll={false}
                        target="_blank"
                    >
                        {d?.terms.repo_link_text}
                    </Link>{' '}
                    {d?.terms.translation_continued_2}
                </div>
                <div>
                    <h1 className="font-semibold text-2xl">
                        {d?.terms.random_sentence_heading}
                    </h1>
                    {d?.terms.random_sentence}{' '}
                    <Link
                        href={'https://tatoeba.org/en/'}
                        target="_blank"
                        scroll={false}
                        className="underline"
                    >
                        {d?.terms.tatoeba_platform_link_text}
                    </Link>{' '}
                    {d?.terms.random_sentence_continued}
                </div>
                <div>
                    <h1 className="font-semibold text-2xl">
                        {d?.terms.machine_translation_heading}
                    </h1>
                    {d?.terms.machine_translation}{' '}
                    <Link
                        href={
                            'https://ai.meta.com/blog/nllb-200-high-quality-machine-translation/'
                        }
                        target="_blank"
                        scroll={false}
                        className="underline"
                    >
                        {d?.terms.machine_translation_link_text}
                    </Link>{' '}
                    {d?.terms.machine_translation_continued}
                </div>
                <div>
                    <h1 className="font-semibold text-2xl">
                        {d?.terms.validation_heading}
                    </h1>
                    {d?.terms.validation}
                </div>
                <div className="text-slate-200 space-y-10">
                    <div>
                        <h1 className="font-semibold text-2xl">
                            {d?.terms.profile_heading}
                        </h1>
                        {d?.terms.profile}
                    </div>
                    <div>
                        <h1 className="font-semibold text-2xl">
                            {d?.terms.scoring_heading}
                        </h1>
                        {d?.terms.scoring}
                    </div>
                    <div>
                        <h1 className="font-semibold text-2xl">
                            {d?.terms.communication_heading}
                        </h1>
                        {d?.terms.communication}
                    </div>
                    <div>
                        <h1 className="font-semibold text-2xl">
                            {d?.terms.disclaimer_heading}
                        </h1>
                        {d?.terms.disclaimer}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ContributionTermsPage;
