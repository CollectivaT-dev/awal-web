import MillionLint from '@million/lint';
import withMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';

/** @type {import('next').NextConfig} */
const config = {
    pageExtensions: ['js', 'jsx', 'mdx', 'md', 'ts', 'tsx'],
    typescript: {
        ignoreBuildErrors: true,
    },
};

// Apply the MillionLint plugin
const configWithMillionLint = MillionLint.next({ rsc: true })(config);

// Apply the MDX plugin with remarkFrontmatter
const nextConfig = withMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [remarkFrontmatter],
    },
})(configWithMillionLint);

export default nextConfig;
