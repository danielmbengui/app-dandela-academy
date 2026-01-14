// context/DeviceProvider.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { BREAKPOINTS } from "./ThemeProvider";

const UserDeviceContext = createContext(null);
export const useUserDevice = () => useContext(UserDeviceContext);

function getDeviceType(width) {
    if (width >= BREAKPOINTS.xxl) return "xxl";
    if (width >= BREAKPOINTS.xl) return "xl";
    if (width >= BREAKPOINTS.lg) return "lg";
    if (width >= BREAKPOINTS.md) return "md";
    if (width >= BREAKPOINTS.sm) return "sm";
    return "xs";
}
function getDeviceTypeName(width) {
    if (width >= BREAKPOINTS.xxl) return "tv";
    if (width >= BREAKPOINTS.xl) return "desktop-large";
    if (width >= BREAKPOINTS.lg) return "desktop";
    if (width >= BREAKPOINTS.md) return "laptop";
    if (width >= BREAKPOINTS.sm) return "tablet";
    return "mobile";
}

/*
xs: 0,
    sm: 600,
    md: 1024,
    lg: 1440,
    xl: 1920,
    xxl: 2560,


*/

export function UserDeviceProvider({ children }) {
    const [device, setDevice] = useState("md"); // fallback SSR
    const [deviceName, setDeviceName] = useState("laptop"); // fallback SSR
    const [isMobile, setIsMobile] = useState(false); // fallback SSR
    const [isXs, setIsXs] = useState(false); // fallback SSR
    const [isSm, setIsSm] = useState(false); // fallback SSR
    const [isMd, setIsMd] = useState(false); // fallback SSR
    const [isLg, setIsLg] = useState(false); // fallback SSR
    const [isXl, setIsXl] = useState(false); // fallback SSR
    const [isXxl, setIsXxl] = useState(false); // fallback SSR
    const [width, setWidth] = useState(0); // fallback SSR

    useEffect(() => {
        const updateDevice = () => {
            const _width = window.innerWidth;
            const type = getDeviceType(_width);
            const name = getDeviceTypeName(_width);
            setWidth(_width);
            setDevice(type);
            setDeviceName(name);
            setIsMobile(_width < BREAKPOINTS.sm);

            setIsXs(_width < BREAKPOINTS.sm);
            setIsSm(_width < BREAKPOINTS.md);
            setIsMd(_width < BREAKPOINTS.lg);
            setIsLg(_width < BREAKPOINTS.xl);
            setIsXl(_width < BREAKPOINTS.xxl);
            setIsXxl(_width >= BREAKPOINTS.xxl);
        };

        updateDevice(); // initial
        window.addEventListener("resize", updateDevice);

        return () => window.removeEventListener("resize", updateDevice);
    }, []);

    const value = {
        width,
        device,
        deviceName,
        isMobile,

        //isXs,
        isSm,
        isMd,
        isLg,
        isXl,
        isXxl
    };

    return <UserDeviceContext.Provider value={value}>{children}</UserDeviceContext.Provider>;

}
