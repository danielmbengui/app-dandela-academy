"use client"
import React, { useEffect, useMemo, useState } from "react";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { useLesson } from "@/contexts/LessonProvider";
import { NS_BUTTONS, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_ADMIN_LESSONS, PAGE_LESSONS, PAGE_TEACHER_LESSONS } from "@/contexts/constants/constants_pages";
import { IconLessons } from "@/assets/icons/IconsComponent";
import { ClassLesson } from "@/classes/ClassLesson";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import LessonComponent from "@/components/dashboard/lessons/LessonComponent";
import LessonEditComponent from "@/components/admin/lessons/LessonEditComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { Box, CircularProgress, Stack } from "@mui/material";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { ClassUserAdministrator, ClassUserTeacher } from "@/classes/users/ClassUser";
import { useAuth } from "@/contexts/AuthProvider";
import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import TeacherPageWrapper from "@/components/wrappers/TeacherPageWrapper";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import LessonTeacherEditComponent from "@/components/teacher/LessonTeacherEditComponent";

export default function TeacherOneLessonUpdatePage() {
    const params = useParams();
    const { user } = useAuth();
    const { uidLesson } = params; // <- ici tu récupères l'uid
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_DASHBOARD_MENU, NS_BUTTONS]);
    const { lesson, isLoading: isLoadingLessons, setUidLesson } = useLessonTeacher();
    const [view, setView] = useState('read');
    useEffect(() => {
        if (uidLesson && !isLoadingLessons) {
            setUidLesson(uidLesson);
        }
    }, [uidLesson, isLoadingLessons]);
    const isAuthorized = useMemo(() => {
        return user instanceof ClassUserTeacher && lesson?.uid_teacher === user?.uid;
    }, [user, lesson]);
    return (<TeacherPageWrapper
        titles={[
            { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_TEACHER_LESSONS(user?.uid) },
            { name: lesson?.title, url: '' }
        ]}
        //title={`Cours / ${lesson?.title}`}
        //subtitle={lesson?.translate?.subtitle}
        isAuthorized={isAuthorized}
        icon={<IconLessons />}
    >
        {
            isLoadingLessons && <CircularProgress size={'16px'} color="warning" />
        }
        {
           !isLoadingLessons &&  <LessonTeacherEditComponent />
        }
    </TeacherPageWrapper>);
}