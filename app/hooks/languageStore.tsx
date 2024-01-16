import { create } from 'zustand';
interface useLocaleStoreProps {
    locale: string;
    setLocale: (newLocale: string) => void;
}
const useLocaleStore = create<useLocaleStoreProps>((set) => ({
    locale:
        typeof window !== 'undefined'
            ? localStorage.getItem('locale') || 'ca'
            : 'ca',
    setLocale: (newLocale) => {
        localStorage.setItem('locale', newLocale);
        set({ locale: newLocale });
    },
}));

export default useLocaleStore;
