'use client';

import { create } from 'zustand';

interface useLoginProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}
const useLogin = create<useLoginProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
export default useLogin;
