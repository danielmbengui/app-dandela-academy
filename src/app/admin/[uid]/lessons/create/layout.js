"use client";

import { LessonProvider } from "@/contexts/LessonProvider";

export default function CreateLessonLayout({ children }) {
    return (
        <LessonProvider>
            {children}
        </LessonProvider>
    );
}
