'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const PwaContext = createContext(null);
export const usePwa = () => useContext(PwaContext);

export default function PwaProvider({ children }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isPWA, setIsPWA] = useState(false);
    const [isMacOS, setIsMaOS] = useState(false);
    const [isSafari, setIsSafari] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isBrowser, setIsBrowser] = useState(true);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;

        setIsPWA(isStandalone);
        setIsBrowser(!isStandalone);

        const ios =
            /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
            !window.matchMedia("(display-mode: standalone)").matches;
        const mac_os =
            /Macintosh|Mac OS X/i.test(navigator.userAgent) &&
            !/iphone|ipad|ipod/i.test(navigator.userAgent);
            const safari =
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        setIsMaOS(mac_os);
        setIsIOS(ios);
        setIsSafari(safari);

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const promptInstall = useCallback(async () => {
        if (!deferredPrompt) return false;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        return outcome === "accepted";
    }, [deferredPrompt]);
    const installPwa = useCallback(async () => {
        if (!deferredPrompt) return false;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        setDeferredPrompt(null);
        return outcome === "accepted";
    }, [deferredPrompt]);
    

    const value = {
        show,
        setShow,
        isPWA,
        isMacOS,
        isIOS,
        isSafari,
        isBrowser,
        canInstall: !!deferredPrompt,
        promptInstall,
        installPwa,
    };
    return <PwaContext.Provider value={value}>
        {children}
    </PwaContext.Provider>;
}
