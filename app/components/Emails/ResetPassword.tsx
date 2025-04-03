interface ResetPasswordProps {
    email: string;
    resetPasswordToken: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ email, resetPasswordToken }) => {
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://awaldigital.org';

    return (
        <div>
            <h1>
                Reset Password for <b>{email}</b>
            </h1>
            <p>To reset your password, click the link below:</p>
            <a
                href={`${url}/pwd-resetting?t=${resetPasswordToken}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: '#000',
                    color: '#fff',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    marginTop: '10px',
                }}
            >
                Reset Password
            </a>
        </div>
    );
};

export default ResetPassword;
