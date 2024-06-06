'use client'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import useLocaleStore from '@/app/hooks/languageStore';
import axios from 'axios';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Dynamic import for MDXRemote component
const MDXRemote = dynamic(() => import('next-mdx-remote').then(mod => mod.MDXRemote), { ssr: false });
import MdxStyle from '@/components/MdxStyle'; 


interface FrontMatter {
    title: string;
}

const ContributionTermsPage = () => {
    const { locale } = useLocaleStore();
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const [frontMatter, setFrontMatter] = useState<FrontMatter | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`/api/content/policies/contribution-terms`, { params: { locale } });

            const { content, frontMatter } = res.data;

            // Dynamic import for serialize and remarkFrontmatter
            const { serialize } = await import('next-mdx-remote/serialize');
            const remarkFrontmatter = (await import('remark-frontmatter')).default;

            const mdxSource = await serialize(content, {
                mdxOptions: {
                    remarkPlugins: [remarkFrontmatter],
                },
            });

            setFrontMatter(frontMatter);
            setMdxSource(mdxSource);
        };

        fetchData();
    }, [locale]);

    if (!mdxSource) {
        return null;
    }

    return (
        <div className="">
            {frontMatter && <h1 className="text-3xl font-semibold text-center my-3">{frontMatter.title}</h1>}
            <MDXRemote {...mdxSource} components={MdxStyle} />
        </div>
    );
};

export default ContributionTermsPage;
