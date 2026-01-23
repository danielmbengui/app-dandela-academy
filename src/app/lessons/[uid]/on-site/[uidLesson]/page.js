"use client"
import React, { useEffect, useMemo } from "react";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { useLesson } from "@/contexts/LessonProvider";
import { NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { IconLessons } from "@/assets/icons/IconsComponent";
import { ClassLesson } from "@/classes/ClassLesson";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import LessonComponent from "@/components/dashboard/lessons/LessonComponent";
import { LessonTeacherProvider, useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import LessonTeacherComponent from "@/components/dashboard/lessons/LessonTeacherComponent";
import { useUsers } from "@/contexts/UsersProvider";

export default function OneLessonSitePage() {
    const params = useParams();
    const {uid:uidLesson, uidLesson: uidLessonTeacher } = params; // <- ici tu récupères l'uid
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_DASHBOARD_MENU]);
    const { lesson, isLoading: isLoadingLessons, setUidLesson } = useLesson();
    const { lesson: lessonTeacher, isLoading: isLoadingLessonsTeacher, setUidLesson: setUidLessonTeacher } = useLessonTeacher();
    const {getOneUser} = useUsers();
    useEffect(() => {
        if (uidLessonTeacher && !isLoadingLessonsTeacher) {
            setUidLesson(uidLesson);
            setUidLessonTeacher(uidLessonTeacher);
        }
    }, [uidLesson,uidLessonTeacher, isLoadingLessonsTeacher]);
    const teacher = useMemo(()=>{
        return getOneUser(lessonTeacher?.uid_teacher);
    }, [lessonTeacher])
    useEffect(() => {
        console.log("leesosn teacher", lessonTeacher)
    }, [lessonTeacher])
    return (<DashboardPageWrapper
        titles={[
            { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_LESSONS },
            { name: lesson?.translate?.title, url: `${PAGE_LESSONS}/${lesson?.uid}` },
            { name: teacher?.getCompleteName(), url: '' },
            //{ name: lessonTeacher?.translate?.title, url: '' },
           // { name: lessonTeacher?.translate?.title, url: '' },
        ]}
        //title={`Cours / ${lesson?.title}`}
        //subtitle={lesson?.translate?.subtitle}
        icon={<IconLessons />}
    >
        <LessonTeacherComponent lesson={lessonTeacher} />
    </DashboardPageWrapper>);
}