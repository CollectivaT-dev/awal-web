'use client';

import { create } from 'zustand';
interface useRegisterProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}
const useRegister = create<useRegisterProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useRegister;
