// app/providers.js
'use client';
import { CertifProvider } from "../CertifProvider";
import { ChapterProvider } from "../ChapterProvider";
import { LessonProvider } from "../LessonProvider";
import { SchoolProvider } from "../SchoolProvider";
import { SessionProvider } from "../SessionProvider";
import { StatProvider } from "../StatProvider";
import { UsersProvider } from "../UsersProvider";

export default function ProviderCertifs({ children, uidUser = "" }) {
    return (<SchoolProvider>
        <UsersProvider>
        <LessonProvider>
           <ChapterProvider>
           <StatProvider uidLesson="zlUoi3t14wzC5cNhfS3J">
            <CertifProvider uidUser={uidUser}>
                {children}
            </CertifProvider>
            </StatProvider>
           </ChapterProvider>
        </LessonProvider>
    </UsersProvider>
    </SchoolProvider>);
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
