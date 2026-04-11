import { create } from 'zustand';

const COOKIE_NAME = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const readLocaleCookie = (): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${COOKIE_NAME}=`));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const writeLocaleCookie = (value: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
        value,
    )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
};

interface useLocaleStoreProps {
    locale: string;
    setLocale: (newLocale: string) => void;
}

const useLocaleStore = create<useLocaleStoreProps>((set) => ({
    locale: readLocaleCookie() || 'ca',
    setLocale: (newLocale) => {
        writeLocaleCookie(newLocale);
        set({ locale: newLocale });
    },
}));

export default useLocaleStore;
