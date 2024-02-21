interface ResetPasswordProps {
    email: string;
    resetPasswordToken: string;
}
const ResetPassword: React.FC<ResetPasswordProps> = ({
    email,
    resetPasswordToken,
}) => {
    return (
        <div>
            <h1>
                Reset Password for <b>{email}</b>{' '}
            </h1>
        </div>
    );
};
export default ResetPassword;
