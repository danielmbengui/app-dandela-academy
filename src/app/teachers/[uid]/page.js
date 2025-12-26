"use client"

import { IconTeachers } from "@/assets/icons/IconsComponent"
import OneTeacherComponent from "@/components/teacher/OneTeacherComponent"
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper"
import { PAGE_TEACHERS } from "@/contexts/constants/constants_pages"
import { NS_DASHBOARD_MENU, NS_TEACHERS } from "@/contexts/i18n/settings"
import { useLesson } from "@/contexts/LessonProvider"
import { useSession } from "@/contexts/SessionProvider"
import { useTeachers } from "@/contexts/TeachersProvider"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function OneTeacherPage() {
    const params = useParams();
    const { uid: uidTeacher } = params; // <- ici tu récupères l'uid
    const { setUidTeacher, isLoading, getOneTeacher,teacher } = useTeachers();
    const { t } = useTranslation([NS_TEACHERS]);
    const {lessons} = useLesson();
    const {sessions} = useSession();
    useEffect(() => {
        if (uidTeacher && !isLoading) {
            //const _teacher = getOneTeacher(uidTeacher);
            //setLesson(_lesson);
            setUidTeacher(uidTeacher);
            console.log("UUUID lesson", uidTeacher)
        }
        console.log("Lessons from lesson provider", lessons, sessions)
    }, [uidTeacher, isLoading]);
    return (        <DashboardPageWrapper
            titles={[
                { name: t('title'), url: PAGE_TEACHERS },
                { name: teacher?.getCompleteName?.(), url: '' }
            ]}
            //title={`Cours / ${lesson?.title}`}
            //subtitle={lesson?.translate?.subtitle}
            icon={<IconTeachers />}
        >
            <OneTeacherComponent />
        </DashboardPageWrapper>)
}