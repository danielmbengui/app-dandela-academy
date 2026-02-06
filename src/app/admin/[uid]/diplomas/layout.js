"use client";

import { DiplomaProvider } from "@/contexts/DiplomaProvider";

export default function DiplomasLayout({ children }) {
    return (
        <DiplomaProvider>
            {children}
        </DiplomaProvider>
    );
}
