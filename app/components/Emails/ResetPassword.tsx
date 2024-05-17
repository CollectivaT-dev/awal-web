import Link from 'next/link';

interface ResetPasswordProps {
    email: string;
    resetPasswordToken: string;
}
const ResetPassword: React.FC<ResetPasswordProps> = ({ email, resetPasswordToken }) => {
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://awaldigital.org';
    return (
        <div>
            <h1>
                Reset Password for <b>{email}</b>{' '}
            </h1>
            <p>to reset password, click on the link below</p>
            <Link href={`${url}/api/auth/reset-password?t=${resetPasswordToken}`} scroll={false} target="_blank">
                Reset Password
            </Link>
        </div>
    );
};
export default ResetPassword;
