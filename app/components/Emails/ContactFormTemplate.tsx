interface ContactFormTemplateProps {
    email?: string;
    id?: string;
    username?: string;
    subject?: string;
    message?: string;
}

const ContactFormTemplate: React.FC<ContactFormTemplateProps> = ({
    email,
    id,
    username,
    subject,
    message,
}) => {
    return (
        <table width="100%" border={0} cellSpacing="0" cellPadding="0">
            <tr>
                <td align="center" style={{ padding: '20px' }}>
                    <table
                        border={0}
                        cellSpacing="0"
                        cellPadding="0"
                        style={{ maxWidth: '600px', width: ' 100%' }}
                    >
                        <tr>
                            <td
                                align="center"
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    paddingBottom: '10px',
                                    textDecoration: 'capitalize',
                                }}
                            >
                                User Feedback - {subject}
                            </td>
                        </tr>
                        <tr>
                            <td
                                align="left"
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    padding: ' 10px 0',
                                }}
                            >
                                User Info:
                                <ol>
                                    <li>Email:{email},</li>
                                    <li>id:{id},</li>
                                    <li>username:{username},</li>
                                </ol>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style={{ padding: '10px 0' }}>
                                <p style={{ fontSize: '18px' }}>
                                    message:{message}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    );
};
export default ContactFormTemplate;
