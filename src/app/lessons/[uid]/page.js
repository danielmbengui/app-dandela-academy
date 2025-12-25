"use client"
import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { useLesson } from "@/contexts/LessonProvider";
import { NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { IconLessons } from "@/assets/icons/IconsComponent";
import { ClassLesson } from "@/classes/ClassLesson";
import { useTranslation } from "react-i18next";
import { useSession } from "@/contexts/SessionProvider";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import LessonComponent from "@/components/dashboard/lessons/LessonComponent";
import DialogSession from "@/components/dashboard/sessions/DialogSession";

export default function DashboardOneLesson() {
    const params = useParams();
    const { uid: uidLesson } = params; // <- ici tu récupères l'uid
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_DASHBOARD_MENU]);
    const { user } = useAuth();
    const { lesson, isLoading: isLoadingLessons, getOneLesson, setUidLesson } = useLesson();
    const { session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('read');

    console.log("LESSSON", lesson);
    useEffect(() => {
        if (uidLesson && !isLoadingLessons) {
            const _lesson = getOneLesson(uidLesson);
            //setLesson(_lesson);
            setUidLesson(uidLesson);
            console.log("UUUID lesson", uidLesson)
        }
    }, [uidLesson, isLoadingLessons]);
    return (<DashboardPageWrapper
        titles={[
            { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_LESSONS },
            { name: lesson?.translate?.title, url: '' }
        ]}
        //title={`Cours / ${lesson?.title}`}
        //subtitle={lesson?.translate?.subtitle}
        icon={<IconLessons />}
    >
        <LessonComponent lesson={lesson} />
    </DashboardPageWrapper>);
}