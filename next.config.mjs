import MillionLint from '@million/lint';
import withMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const config = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    typescript: {
        ignoreBuildErrors: true,
    },
};

// Apply the MillionLint plugin
const configWithMillionLint = MillionLint.next({ rsc: true })(config);

// Apply the MDX plugin
const nextConfig = withMDX()(configWithMillionLint);

export default nextConfig;
