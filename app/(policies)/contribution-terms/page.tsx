'use client';
import { useEffect, useState } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkFrontmatter from 'remark-frontmatter';
import useLocaleStore from '@/app/hooks/languageStore';
import axios from 'axios';
import MdxStyle from '@/components/MdxStyle';
interface FrontMatter {
    title: string;
    // date: string;
}
const PolicyPage = () => {
    const { locale } = useLocaleStore();
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const [frontMatter, setFrontMatter] = useState<FrontMatter | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`/api/content/policies/contribution-terms`, { params: { locale } });

            const { content, frontMatter } = res.data;

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

export default PolicyPage;
