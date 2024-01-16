declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: typeof google;
    }
}
export {};
