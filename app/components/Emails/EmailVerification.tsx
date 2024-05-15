interface EmailVerificationProps {
    email: string;
    emailVerificationToken: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email, emailVerificationToken }) => {
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://awaldigital.org';

    return (
        <table width="100%" border={0} cellSpacing="0" cellPadding="0">
            <tr>
                <td align="center" style={{ padding: '20px;' }}>
                    <table border={0} cellSpacing="0" cellPadding="0" style={{ maxWidth: '600px', width: ' 100%;' }}>
                        <tr>
                            <td
                                align="center"
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    paddingBottom: '10px;',
                                    textDecoration: 'capitalize',
                                }}
                            >
                                Welcome to AWAL, verify your{' '}
                                <a
                                    href={email}
                                    style={{
                                        color: '#000000',
                                        textDecoration: 'none;',
                                    }}
                                >
                                    Email
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td
                                align="center"
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    padding: ' 10px 0',
                                }}
                            >
                                Thank you for registering AWAL, Please verify your Email address: {email}
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style={{ padding: '10px 0;' }}>
                                <p style={{ fontSize: '18px' }}>Click on the button to verify your Email address.</p>
                                <a
                                    href={`${url}/verification?token=${emailVerificationToken}`}
                                    style={{ backgroundColor: '#000000', color: '#ffffff', padding: '10px 20px', textDecoration: ' none', fontWeight: 'bold' }}
                                >
                                    Click me
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    );
};
export default EmailVerification;
