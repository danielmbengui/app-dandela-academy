"use client"
import React, { useEffect, useState } from "react"
import { Stack, Typography } from "@mui/material"
import { useParams } from "next/navigation"
import { ClassLessonChapter } from "@/classes/lessons/ClassLessonChapter";
import { useLanguage } from "@/contexts/LangProvider";

export default function TestCreateOneChapter() {
    const { uid } = useParams();
    const {lang} = useLanguage();
    const [chapter, setChapter] = useState(null);
    useEffect(() => {
        if (lang && 
            uid) {
            async function init() {
                const _chapter = await ClassLessonChapter.fetchFromFirestore(uid, lang);
                setChapter(_chapter);
            }
            init()
        } else {
            setChapter(null);
        }
    }, [lang, uid])
    return (<Stack>
        <Typography>
            Create chapter {chapter?.uid}
        </Typography>
    </Stack>)
}