'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';

const PwaContext = createContext(null);
export const usePwa = () => useContext(PwaContext);

export default function PwaProvider({ children }) {
  const deferredPromptRef = useRef(null);

  const [isPWA, setIsPWA] = useState(false);
  const [isMacOS, setIsMacOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isBrowser, setIsBrowser] = useState(true);
  const [canInstall, setCanInstall] = useState(false);

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStandalone = () => {
      const standalone =
        window.matchMedia?.('(display-mode: standalone)')?.matches ||
        window.navigator.standalone === true;

      setIsPWA(standalone);
      setIsBrowser(!standalone); // chez toi ça veut dire "pas en mode app"
      return standalone;
    };

    // Initial checks
    const standalone = checkStandalone();

    const ua = window.navigator.userAgent;

    const ios =
      /iphone|ipad|ipod/i.test(ua) &&
      !(window.matchMedia?.('(display-mode: standalone)')?.matches);

    const mac_os =
      /Macintosh|Mac OS X/i.test(ua) &&
      !/iphone|ipad|ipod/i.test(ua);

    // Safari "vrai" (évite Chrome/Edge iOS qui contiennent aussi 'Safari' dans UA)
    const safari =
      /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS|OPiOS|Android/i.test(ua);

    setIsMacOS(mac_os);
    setIsIOS(ios);
    setIsSafari(safari);

    const onBeforeInstallPrompt = (e) => {
      // IMPORTANT: tu prends le contrôle du prompt
      e.preventDefault();
      deferredPromptRef.current = e;
      setCanInstall(true);
      // optionnel: tu peux choisir d'afficher ta banner ici
      // setShow(true);
      console.log('beforeinstallprompt fired, canInstall = true');
    };

    const onAppInstalled = () => {
      console.log('appinstalled fired');
      deferredPromptRef.current = null;
      setCanInstall(false);
      setShow(false);
      checkStandalone();
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    // Si l’utilisateur passe en standalone autrement, on sync
    const mq = window.matchMedia?.('(display-mode: standalone)');
    const onMqChange = () => checkStandalone();
    mq?.addEventListener?.('change', onMqChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
      mq?.removeEventListener?.('change', onMqChange);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const evt = deferredPromptRef.current;
    if (!evt) {
      console.log('No deferredPrompt -> cannot prompt install');
      return false;
    }

    // Doit être appelé DIRECTEMENT dans un geste utilisateur (onClick)
    evt.prompt();

    const choice = await evt.userChoice; // { outcome: 'accepted'|'dismissed', platform: ... }
    console.log('userChoice:', choice);

    deferredPromptRef.current = null;
    setCanInstall(false);

    return choice.outcome === 'accepted';
  }, []);

  // garde ton alias installPwa
  const installPwa = promptInstall;

  const value = useMemo(
    () => ({
      show,
      setShow,
      isPWA,
      isMacOS,
      isIOS,
      isSafari,
      isBrowser,
      canInstall,
      promptInstall,
      installPwa,
    }),
    [show, isPWA, isMacOS, isIOS, isSafari, isBrowser, canInstall, promptInstall]
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}
