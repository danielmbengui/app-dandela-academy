// app/providers.js
'use client';
import { ChapterProvider } from "../ChapterProvider";
import { LessonProvider } from "../LessonProvider";
import { SessionProvider } from "../SessionProvider";
import { StatProvider } from "../StatProvider";

export default function ProviderStats({ children }) {
    return (<LessonProvider>
        <SessionProvider>
            <ChapterProvider>
            <StatProvider>
                {children}
            </StatProvider>
        </ChapterProvider>
        </SessionProvider>
    </LessonProvider>);
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
