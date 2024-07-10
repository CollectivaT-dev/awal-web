'use client';
import dynamic from 'next/dynamic';
import useLocaleStore from '@/app/hooks/languageStore';
import MdxStyle from '@/components/MdxStyle';
import useMdxContent from '../hooks/useMdxContent';

const MDXRemote = dynamic(() => import('next-mdx-remote').then((mod) => mod.MDXRemote), { ssr: false });

interface MdxContentProps {
    apiEndpoint: string;
}

const MdxContent: React.FC<MdxContentProps> = ({ apiEndpoint }) => {
    const { locale } = useLocaleStore();
    const { mdxSource, frontMatter } = useMdxContent(apiEndpoint, locale);

    if (!mdxSource) {
        return null;
    }

    return (
        <div>
            {frontMatter && <h1 className="text-3xl font-semibold text-center my-3">{frontMatter.title}</h1>}
            <MDXRemote {...mdxSource} components={MdxStyle} />
        </div>
    );
};

export default MdxContent;
