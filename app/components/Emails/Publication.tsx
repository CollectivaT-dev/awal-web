interface PublicationProps {
    firstName: string;
}
const Publication: React.FC<Readonly<PublicationProps>> = ({ firstName }) => (
    <div>
        <h1>Welcome, {firstName}!</h1>
    </div>
);
export default Publication;
