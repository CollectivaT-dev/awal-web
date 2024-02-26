
export default async function VerificationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const user = await getCurrentUser();

    return (
        <>
            <div>{children}</div>
        </>
    );
}
