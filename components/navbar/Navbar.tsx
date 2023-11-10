'use client';



import UserMenu from './UserMenu';
import { SafeUser } from '@/app/types';

interface NavbarProps {
    currentUser?: SafeUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
    // console.log(currentUser);
    return (
        <div className="fixed w-full bg-white z-10 shadow-sm">
            <div className="py-4 border-b-[1px]">

                    <div className="flex flex-row items-center justify-between gap-3 md:gap-0">

                        <UserMenu currentUser={currentUser} />
                    </div>

            </div>

        </div>
    );
};
