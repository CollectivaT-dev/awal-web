'use client';
import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Badge } from '../badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { X } from 'lucide-react';
import { Skeleton } from '../skeleton';
import { usePathname } from 'next/navigation';
import { Span } from 'next/dist/trace';
const SignInButton = () => {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    console.log('sign in button check', session);
    const pathname = usePathname();

    if (status === 'loading') {
        return (
            <div className="flex flex-row items-center justify-center space-x-4">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        );
    }
    if (session && session.user) {
        return (
            <div className="ml-auto flex flex-row space-x-1 lg:space-x-3 items-center justify-center ">
                <p className="text-text-primary text-sm lg:text-lg">
                    Benvingudes de nou{' '}
                    <span className="font-bold">{session.user.username}</span>
                </p>{' '}
                {/* Larger font size on desktop */}
                <Badge className="lg:px-3 px-2 lg:py-1 py-[1px] text-[12px] lg:text-[16px]">
                    Punts de contribuci&#243;{` : ${session.user.score}`}
                </Badge>
                <Button
                    variant={'outline'}
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-clay-500 bg-transparent border-transparent ml-3 "
                >
                    <span className="lg:font-bold lg:text-[14px] font-semibold text-xs ">
                        Tanca la sessió
                    </span>
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Button
                variant={'outline'}
                onClick={() => signIn()}
                className="text-text-primary bg-transparent border-transparent "
            >
                <span className=" lg:text-[14px] text-xs">
                    {pathname === '/signIn' ? (
                        <span className="font-bold capitalize">
                            Iniciar sessió
                        </span>
                    ) : (
                        <span className="capitalize">Iniciar sessió</span>
                    )}
                </span>
            </Button>
            <Button
                variant={'outline'}
                className="text-text-primary bg-transparent border-transparent "
            >
                <Link href={'/register'}>
                    {pathname === '/register' ? (
                        <span className="font-bold">Registre</span>
                    ) : (
                        <span> Registre</span>
                    )}
                </Link>
            </Button>
        </div>
    );
};

export default SignInButton;
