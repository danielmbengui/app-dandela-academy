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

const InternetContext = createContext(null);
export const useInternet = () => useContext(InternetContext);

export default function InternetProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // SSR safe
    if (typeof window === "undefined") return;

    const update = () => setIsOnline(navigator.onLine);

    // init
    update();

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const value = useMemo(
    () => ({
      isOnline, 
      isOffline: !isOnline
    }),
    [isOnline]
  );

  return <InternetContext.Provider value={value}>{children}</InternetContext.Provider>;
}
