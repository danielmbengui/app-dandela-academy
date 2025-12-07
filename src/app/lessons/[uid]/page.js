"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IconLessons } from "@/assets/icons/IconsComponent";
import { ClassLesson } from "@/classes/ClassLesson";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS } from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import { useLesson } from "@/contexts/LessonProvider";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import LessonComponent from "@/components/dashboard/lessons/LessonComponent";
import DialogLesson from "@/components/dashboard/lessons/DialogLesson";

export default function DashboardOneLesson() {
    const params = useParams();
    const { uid } = params; // <- ici tu récupères l'uid
    const { isLoading: isLoadingLessons, getOneLesson } = useLesson();
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
    const [lesson, setLesson] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (uid && !isLoadingLessons) {
            const _lesson = getOneLesson(uid);
            setLesson(_lesson);
        }
    }, [uid, isLoadingLessons]);


    return (
        <DashboardPageWrapper
            titles={[
                { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_LESSONS },
                { name: lesson?.translate?.title, url: '' }
            ]}
            title={`Cours / ${lesson?.code}`}
            subtitle={lesson?.translate?.subtitle}
            icon={<IconLessons />}>
                <DialogLesson lesson={lesson} isOpen={false} setIsOpen={setIsOpen} />
            <LessonComponent lesson={lesson} />
        </DashboardPageWrapper>
    );
}