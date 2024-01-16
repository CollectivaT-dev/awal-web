'use client';

import useLocaleStore from '@/app/hooks/languageStore';

const RedirectPage = () => {
    const { locale } = useLocaleStore();

    return <div className="flex justify-center items-center h-screen"></div>;
};
export default RedirectPage;
