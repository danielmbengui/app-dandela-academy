// app/providers.js
'use client';
import { AuthProvider } from "./AuthProvider";
import { LangProvider } from "./LangProvider";
import PwaProvider from "./PwaProvider";
import { SchoolProvider } from "./SchoolProvider";
import { ThemeProvider } from "./ThemeProvider";
import { UserDeviceProvider } from "./UserDeviceProvider";
//import {HeroUIProvider} from '@heroui/react';

//import { AuthProvider } from '@/contexts/AuthProvider';
//import { LangProvider } from '@/contexts/LangProvider';
//import { ThemeProvider } from '@/contexts/ThemeProvider';
export default function Providers({ children }) {
    return (<ThemeProvider>
        <UserDeviceProvider>
        <PwaProvider>
        <LangProvider>
           <AuthProvider>
           <SchoolProvider>
           {children}
           </SchoolProvider>
           </AuthProvider>
        </LangProvider>
        </PwaProvider>
        </UserDeviceProvider>
    </ThemeProvider>);
}
/*
export default function Providers({ children }) {
    return <ThemeProvider>
       <LangProvider>
       <AuthProvider>
        {children}
        </AuthProvider>
       </LangProvider>
    </ThemeProvider>;
}
*/
