'use client';
import { useEffect, useState } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import axios from 'axios';
import remarkFrontmatter from 'remark-frontmatter';

interface FrontMatter {
    title: string;
    date?: string;
}

interface FetchMdxContentResult {
    mdxSource: MDXRemoteSerializeResult | null;
    frontMatter: FrontMatter | null;
}

const useMdxContent = (apiEndpoint: string, locale: string): FetchMdxContentResult => {
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const [frontMatter, setFrontMatter] = useState<FrontMatter | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(apiEndpoint, { params: { locale } });
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
    }, [apiEndpoint, locale]);

    return { mdxSource, frontMatter };
};

export default useMdxContent;
