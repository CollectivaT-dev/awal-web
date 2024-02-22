import Link from 'next/link';

interface EmailVerificationProps {
    email: string;
    emailVerificationToken: string;
}
const EmailVerification: React.FC<EmailVerificationProps> = ({
    email,
    emailVerificationToken,
}) => {
    const url =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://awaldigital.org';
    return (
        <div>
            <h1>
                welcome to AWAL, verify your <b>{email} </b>
            </h1>
            <p>click on the link below to verify your email address.</p>
            <Link
                href={`${url}/verify-email?t=${emailVerificationToken}`}
                scroll={false}
                target="_blank"
            >
                Click Here
            </Link>
        </div>
    );
};
export default EmailVerification;
