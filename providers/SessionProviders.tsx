'use client'
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProvidersProps {
    children: ReactNode;
}
const SessionProviders = ({ children }: SessionProvidersProps) => {
    return <SessionProvider>{children}</SessionProvider>;
};
export default SessionProviders;
