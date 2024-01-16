import SignInForm from './SignInForm';
interface SignInPageProps {
    searchParams?: Record<'callbackUrl' | 'error', string>;
}
const SignInPage: React.FC<SignInPageProps> = ({ searchParams }) => {
    return <SignInForm callbackUrl={searchParams?.callbackUrl} />;
};
export default SignInPage;
