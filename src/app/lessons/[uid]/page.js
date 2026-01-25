"use client"
import React, { useEffect, useMemo, useState } from "react";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { useLesson } from "@/contexts/LessonProvider";
import { NS_BUTTONS, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_ADMIN_UPDATE_ONE_LESSON, PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { IconLessons } from "@/assets/icons/IconsComponent";
import { ClassLesson } from "@/classes/ClassLesson";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import LessonComponent from "@/components/dashboard/lessons/LessonComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { Stack } from "@mui/material";
import { ClassUserAdministrator } from "@/classes/users/ClassUser";
import { useAuth } from "@/contexts/AuthProvider";
import Link from "next/link";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";

export default function DashboardOneLessonPage() {
    const params = useParams();
    const { user } = useAuth();
    const { uid: uidLesson } = params; // <- ici tu récupères l'uid
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_DASHBOARD_MENU, NS_BUTTONS]);
    const { lesson, isLoading: isLoadingLessons, setUidLesson } = useLesson();
    const { lessons } = useLessonTeacher();
    console.log("LEEESONS", lessons)
    useEffect(() => {
        if (uidLesson && !isLoadingLessons) {
            setUidLesson(uidLesson);
        }
    }, [uidLesson, isLoadingLessons]);
    const canEdit = useMemo(() => {
        return user instanceof ClassUserAdministrator || lesson?.uid_teacher === user?.uid;
    }, [user, lesson]);
    return (<DashboardPageWrapper
        titles={[
            { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_LESSONS },
            { name: lesson?.title, url: '' }
        ]}
        //title={`Cours / ${lesson?.title}`}
        //subtitle={lesson?.translate?.subtitle}
        icon={<IconLessons />}
    >
        <Stack spacing={1.5} alignItems={'start'}>
            <LessonComponent />
        </Stack>
    </DashboardPageWrapper>);
}