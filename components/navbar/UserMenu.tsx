'use client';

import { AiOutlineMenu } from 'react-icons/ai';
import MenuItem from './MenuItem';
import { useCallback, useState } from 'react';
import { signOut } from 'next-auth/react';
import { SafeUser } from '@/app/types';
import { useRouter } from 'next/navigation';
import useRegister from '@/app/hooks/useRegister';
import useLogin from '@/app/hooks/useLogin';
import { Separator } from '@/components/ui/separator';

interface UserMenuProps {
    currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const router = useRouter();
    // console.log(currentUser);
    const register = useRegister();
    const login = useLogin();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer capitalize"
                >
                UserMenu
                </div>
                <div
                    onClick={toggleOpen}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-100 flex flex-row items-center gap-3 rounded-full hover:shadow-md transition-all cursor-pointer"
                >
                    <AiOutlineMenu />
                </div>
            </div>
            {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (
                            <>
                                <MenuItem
                                    onClick={() => router.push('/trips')}
                                    label="my trips"
                                />
                                <MenuItem
                                    onClick={() => router.push('/favorites')}
                                    label="my favorites"
                                />
                                <Separator />
                                <MenuItem
                                    onClick={() => signOut()}
                                    label="logout"
                                />
                            </>
                        ) : (
                            <>
                                <MenuItem
                                    onClick={login.onOpen}
                                    label="Login"
                                />
                                <MenuItem
                                    onClick={register.onOpen}
                                    label="Sign Up"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
