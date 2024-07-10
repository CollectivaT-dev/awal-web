import { MDXComponents } from 'mdx/types';

const CustomH1 = (props: any) => <h1 className="text-3xl font-bold" {...props} />;
const CustomH2 = (props: any) => <h2 className="text-2xl font-semibold mt-5" {...props} />;
const CustomH3 = (props: any) => <h3 className="text-xl font-normal" {...props} />;
const CustomP = (props: any) => <p className="text-lg font-normal leading-8" {...props} />;
const CustomLink = (props: any) => <a style={{ textDecoration: 'underline' }} className="hover:text-blue-500" {...props} />;

const MdxStyle: MDXComponents = {
    h1: CustomH1,
    h2: CustomH2,
    h3: CustomH3,
    p: CustomP,
    a: CustomLink,
};
export default MdxStyle;
