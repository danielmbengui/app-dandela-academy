"use client"
import React, { useEffect, useMemo } from "react";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import { NS_BUTTONS, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_ADMIN_LESSONS } from "@/contexts/constants/constants_pages";
import { useLesson } from "@/contexts/LessonProvider";
import { IconLessons } from "@/assets/icons/IconsComponent";
import Link from "next/link";
import { ClassLesson, ClassLessonTeacher } from "@/classes/ClassLesson";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import LessonTeacherEditComponent from "@/components/teacher/LessonTeacherEditComponent";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { CircularProgress, Stack } from "@mui/material";
import { ClassUserAdministrator } from "@/classes/users/ClassUser";
import { useAuth } from "@/contexts/AuthProvider";
import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import { useUsers } from "@/contexts/UsersProvider";

export default function AdminOneLessonTeacherUpdatePage() {
    const params = useParams();
    const { user } = useAuth();
    const { uid, uidLesson, uidLessonTeacher } = params;
    const { t } = useTranslation([ClassLessonTeacher.NS_COLLECTION, ClassLesson.NS_COLLECTION, NS_DASHBOARD_MENU, NS_BUTTONS]);
    const { lesson: lessonTeacher, isLoading: isLoadingLessonsTeacher, setUidLesson: setUidLessonTeacher } = useLessonTeacher();
    const { lesson: lessonParent, isLoading: isLoadingLessonParent, setUidLesson: setUidLessonParent } = useLesson();
    const { getOneUser } = useUsers();
    
    useEffect(() => {
        if (uidLesson && !isLoadingLessonParent) {
            setUidLessonParent(uidLesson);
        }
    }, [uidLesson, isLoadingLessonParent, setUidLessonParent]);
    
    useEffect(() => {
        if (uidLessonTeacher && !isLoadingLessonsTeacher) {
            setUidLessonTeacher(uidLessonTeacher);
        }
    }, [uidLessonTeacher, isLoadingLessonsTeacher, setUidLessonTeacher]);
    
    const isAuthorized = useMemo(() => {
        return user instanceof ClassUserAdministrator;
    }, [user]);
    
    const isLoading = isLoadingLessonsTeacher || isLoadingLessonParent;
    const lesson = lessonTeacher;
    const teacher = lessonTeacher ? getOneUser(lessonTeacher.uid_teacher) : null;
    const teacherName = teacher ? `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() : '';
    
    return (
        <AdminPageWrapper
            titles={[
                { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uid) },
                { name: lessonParent?.title || lessonParent?.translate?.title || '', url: `${PAGE_ADMIN_LESSONS(uid)}/${uidLesson}` },
                { name: teacherName, url: '' }
            ]}
            isAuthorized={isAuthorized}
            icon={<IconLessons width={22} height={22} />}
        >
            <Stack spacing={2} sx={{ width: '100%' }}>
                {!isLoading && isAuthorized && (
                    <Stack spacing={1} direction="row" justifyContent="start" sx={{ width: '100%' }}>
                        <Link 
                            href={`${PAGE_ADMIN_LESSONS(uid)}/${uidLesson}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <ButtonCancel 
                                label={t('back', { ns: NS_BUTTONS }) || 'Retour'}
                                isAdmin={true}
                            />
                        </Link>
                    </Stack>
                )}
                {
                    isLoading && <CircularProgress size={'16px'} color="warning" />
                }
                {
                   !isLoading && isAuthorized && <LessonTeacherEditComponent />
                }
            </Stack>
        </AdminPageWrapper>
    );
}
