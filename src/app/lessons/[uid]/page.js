"use client"
import React, { useEffect } from "react";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { useLesson } from "@/contexts/LessonProvider";
import { NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { IconLessons } from "@/assets/icons/IconsComponent";
import { ClassLesson } from "@/classes/ClassLesson";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import LessonComponent from "@/components/dashboard/lessons/LessonComponent";
import LessonEditComponent from "@/components/dashboard/lessons/LessonEditComponent";

export default function DashboardOneLessonPage() {
    const params = useParams();
    const { uid: uidLesson } = params; // <- ici tu récupères l'uid
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_DASHBOARD_MENU]);
    const { lesson, isLoading: isLoadingLessons, setUidLesson } = useLesson();
    useEffect(() => {
        if (uidLesson && !isLoadingLessons) {
            setUidLesson(uidLesson);
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
        {
            //<LessonEditComponent />
        }
        <LessonComponent lesson={lesson} />
    </DashboardPageWrapper>);
}