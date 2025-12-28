"use client"
import React, { useState } from "react"
import { Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { ClassLessonChapter } from "@/classes/lessons/ClassLessonChapter"
import SelectComponentDark from "@/components/elements/SelectComponentDark"
import { useLesson } from "@/contexts/LessonProvider"
import { ClassSession, ClassSessionSlot } from "@/classes/ClassSession"
import FieldComponent from "@/components/elements/FieldComponent"
import { NS_LESSONS, NS_LEVELS } from "@/contexts/i18n/settings"
import { ClassLesson } from "@/classes/ClassLesson"
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm"
import { useRouter } from "next/navigation"

export default function TestCreateChapter() {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const { lessons } = useLesson();
    const router = useRouter();
    const [form, setForm] = useState({
        uid_lesson: "",
        level: "",
    })
    return (<Stack>
        <Typography>
            Create chapter
        </Typography>
        <SelectComponentDark
            label={t('uid_lesson', { ns: ClassSession.NS_COLLECTION })}
            value={form.uid_lesson}
            values={lessons?.map(lesson => ({ id: lesson.uid, value: lesson.translate?.title }))}
            onChange={(e) => {
                const { value } = e.target;
                setForm(prev => ({ ...prev, uid_lesson: value }));
            }}
        />
        <SelectComponentDark
            label={t('level')}
            value={form.level}
            values={ClassLesson.ALL_LEVELS.map(level => ({ id: level, value: t(level, { ns: ClassSession.NS_COLLECTION }) }))}
            onChange={(e) => {
                const { value } = e.target;
                setForm(prev => ({ ...prev, level: value }));
            }}
        />
        <FieldComponent
            label={t('duration-start-estimated')}
            type={'number'}
        />
        <FieldComponent
            label={t('duration-end-estimated')}
            type={'number'}
        />
        <FieldComponent
            label={t('title')}
            type={'text'}
            //minRows={2}
            //maxRows={10}
            fullWidth
        />
        <FieldComponent
            label={t('description')}
            type={'multiline'}
            minRows={2}
            maxRows={10}
            fullWidth
        />
        <ButtonConfirm
            label="créer"
            onClick={async () => {
                const newChapter = new ClassLessonChapter({ uid_lesson: form.uid_lesson, level: form.level });
                const _ok = await newChapter.createFirestore();
            }}
        />
    </Stack>)
}