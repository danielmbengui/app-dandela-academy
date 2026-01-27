"use client"
import React, { useEffect, useMemo, useState } from "react";
import { useLesson } from "@/contexts/LessonProvider";
import { NS_BUTTONS, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_ADMIN_LESSONS } from "@/contexts/constants/constants_pages";
import { IconLessons } from "@/assets/icons/IconsComponent";
import Link from "next/link";
import { ClassLesson } from "@/classes/ClassLesson";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import LessonAdminEditComponent from "@/components/admin/lessons/LessonAdminEditComponent";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { Box, CircularProgress, Stack } from "@mui/material";
import { ClassUserAdministrator } from "@/classes/users/ClassUser";
import { useAuth } from "@/contexts/AuthProvider";
import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";

export default function AdminOneLessonUpdatePage() {
    const params = useParams();
    const { user } = useAuth();
    const { uid, uidLesson } = params;
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_DASHBOARD_MENU, NS_BUTTONS]);
    const { lesson, isLoading: isLoadingLessons, setUidLesson } = useLesson();
    
    useEffect(() => {
        if (uidLesson && !isLoadingLessons) {
            setUidLesson(uidLesson);
        }
    }, [uidLesson, isLoadingLessons, setUidLesson]);
    
    const isAuthorized = useMemo(() => {
        return user instanceof ClassUserAdministrator || lesson?.uid_teacher === user?.uid;
    }, [user, lesson]);
    
    return (
        <AdminPageWrapper
            titles={[
                { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uid) },
                { name: lesson?.title || lesson?.translate?.title || '', url: '' }
            ]}
            isAuthorized={isAuthorized}
            icon={<IconLessons width={22} height={22} />}
        >
            <Stack spacing={2} sx={{ width: '100%' }}>
                {!isLoadingLessons && isAuthorized && (
                    <Stack spacing={1} direction="row" justifyContent="start" sx={{ width: '100%' }}>
                        <Link 
                            href={PAGE_ADMIN_LESSONS(uid)}
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
                    isLoadingLessons && <CircularProgress size={'16px'} color="warning" />
                }
                {
                   !isLoadingLessons && isAuthorized && <LessonAdminEditComponent />
                }
            </Stack>
        </AdminPageWrapper>
    );
}
