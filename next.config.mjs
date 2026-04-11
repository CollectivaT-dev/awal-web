import withMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const config = {
    pageExtensions: ['js', 'jsx', 'mdx', 'md', 'ts', 'tsx'],
    typescript: {
        ignoreBuildErrors: true,
    },
};

const nextConfig = withMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [['remark-frontmatter']],
    },
})(config);

export default nextConfig;
