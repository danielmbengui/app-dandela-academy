"use client"
import React, { useEffect, useMemo, useState } from "react";
import { useLesson } from "@/contexts/LessonProvider";
import { useChapter } from "@/contexts/ChapterProvider";
import { NS_BUTTONS, NS_DASHBOARD_MENU, NS_LESSONS } from "@/contexts/i18n/settings";
import { PAGE_ADMIN_CHAPTERS, PAGE_ADMIN_LESSONS } from "@/contexts/constants/constants_pages";
import { IconLessons, IconRemove } from "@/assets/icons/IconsComponent";
import Link from "next/link";
import { ClassLesson } from "@/classes/ClassLesson";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import LessonAdminEditComponent from "@/components/admin/lessons/LessonAdminEditComponent";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import DialogConfirmAction from "@/components/dashboard/elements/DialogConfirmAction";
import { Box, CircularProgress, Stack } from "@mui/material";
import { ClassUserAdministrator } from "@/classes/users/ClassUser";
import { useAuth } from "@/contexts/AuthProvider";
import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import { ChapterProvider } from "@/contexts/ChapterProvider";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { Icon } from "@iconify/react";

function AdminOneLessonContent() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { uid, uidLesson } = params;
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_DASHBOARD_MENU, NS_BUTTONS, NS_LESSONS]);
    const { lesson, isLoading: isLoadingLessons, setUidLesson, remove: removeLesson } = useLesson();
    const { chapters, isLoading: isLoadingChapters } = useChapter();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        if (uidLesson && !isLoadingLessons) {
            setUidLesson(uidLesson);
        }
    }, [uidLesson, isLoadingLessons, setUidLesson]);

    const isAuthorized = useMemo(() => {
        return user instanceof ClassUserAdministrator || lesson?.uid_teacher === user?.uid;
    }, [user, lesson]);

    const handleDeleteLesson = async () => {
        try {
            const removed = await removeLesson();
            if (removed) {
                router.push(PAGE_ADMIN_LESSONS(uid));
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du cours:", error);
        }
    };

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
                    <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" sx={{ width: '100%' }}>
                        <Stack spacing={1} direction="row">
                            <Link
                                href={PAGE_ADMIN_LESSONS(uid)}
                                style={{ textDecoration: 'none' }}
                            >
                                <ButtonCancel
                                    label={t('back', { ns: NS_BUTTONS }) || 'Retour'}
                                    isAdmin={true}
                                />
                            </Link>
                            <Link
                                href={PAGE_ADMIN_CHAPTERS(uid, uidLesson)}
                                style={{ textDecoration: 'none' }}
                            >
                                <ButtonConfirm
                                    label={t('edit-chapters', { ns: NS_BUTTONS }) || 'Vers chapitres'}
                                    isAdmin={true}
                                />
                            </Link>
                        </Stack>
                        <ButtonConfirm
                            label={t('delete', { ns: NS_BUTTONS }) || 'Supprimer'}
                            isAdmin={true}
                            onClick={() => setOpenDeleteDialog(true)}
                            icon={<Icon icon="ph:trash-fill" width={18} />}
                            sx={{
                                bgcolor: 'var(--error)',
                                '&:hover': { bgcolor: 'var(--error-dark, #c62828)' },
                            }}
                        />
                    </Stack>
                )}
                {
                    isLoadingLessons && <CircularProgress size={'16px'} color="warning" />
                }
                {!isLoadingLessons && isAuthorized && (
                    <LessonAdminEditComponent />
                )}
            </Stack>

            {/* Dialog de confirmation de suppression */}
            <DialogConfirmAction
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
                title={t('confirm-delete-lesson', { ns: NS_LESSONS }) || `Êtes-vous sûr de vouloir supprimer ce cours ?`}
                labelConfirm={t('delete', { ns: NS_BUTTONS }) || 'Supprimer'}
                labelCancel={t('cancel', { ns: NS_BUTTONS }) || 'Annuler'}
                actionConfirm={handleDeleteLesson}
                severity="error"
                isAdmin={true}
                icon={<Icon icon="ph:trash-fill" width={36} color="var(--error)" />}
            />
        </AdminPageWrapper>
    );
}

export default function AdminOneLessonUpdatePage() {
    const { uidLesson } = useParams();
    return (
        <ChapterProvider uidLesson={uidLesson || ''}>
            <AdminOneLessonContent />
        </ChapterProvider>
    );
}
