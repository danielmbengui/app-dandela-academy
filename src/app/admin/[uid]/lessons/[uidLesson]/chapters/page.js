"use client"
import React, { useEffect, useMemo, useState } from "react";
import { useLesson } from "@/contexts/LessonProvider";
import { useChapter } from "@/contexts/ChapterProvider";
import { NS_BUTTONS, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_ADMIN_CHAPTERS, PAGE_ADMIN_CREATE_CHAPTER, PAGE_ADMIN_LESSONS, PAGE_ADMIN_ONE_CHAPTER, PAGE_ADMIN_ONE_LESSON } from "@/contexts/constants/constants_pages";
import { IconLessons } from "@/assets/icons/IconsComponent";
import Link from "next/link";
import { ClassLesson } from "@/classes/ClassLesson";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import LessonAdminEditComponent from "@/components/admin/lessons/LessonAdminEditComponent";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { Box, CircularProgress, List, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { ClassUserAdministrator, ClassUserDandela } from "@/classes/users/ClassUser";
import { useAuth } from "@/contexts/AuthProvider";
import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import { ChapterProvider } from "@/contexts/ChapterProvider";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { ClassLessonChapter } from "@/classes/lessons/ClassLessonChapter";

function AdminOneLessonContent() {
    const params = useParams();
    const { user } = useAuth();
    const { uid: uidUser, uidLesson } = params;
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_DASHBOARD_MENU, NS_BUTTONS]);
    const { lesson, isLoading: isLoadingLessons, setUidLesson } = useLesson();
    const { chapters, isLoading: isLoadingChapters } = useChapter();

    useEffect(() => {
        if (uidLesson && !isLoadingLessons) {
            setUidLesson(uidLesson);
        }
    }, [uidLesson, isLoadingLessons, setUidLesson]);

    const isAuthorized = useMemo(() => {
        return user instanceof ClassUserDandela;
    }, [user, lesson]);

    return (
        <AdminPageWrapper
            titles={[
                { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uidUser) },
                { name: lesson?.title || lesson?.translate?.title || '', url: PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson) },
                { name: t('chapters', { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_CHAPTERS(uidUser, uidLesson) }
            ]}
            isAuthorized={isAuthorized}
            icon={<IconLessons width={22} height={22} />}
        >
            <Stack spacing={2} sx={{ width: '100%' }}>
                {!isLoadingLessons && isAuthorized && (
                    <Stack spacing={1} direction="row" justifyContent="start" sx={{ width: '100%' }}>
                        <Link
                            href={PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson)}
                            style={{ textDecoration: 'none' }}
                        >
                            <ButtonCancel
                                label={t('back', { ns: NS_BUTTONS }) || 'Retour'}
                                isAdmin={true}
                            />
                        </Link>
                        <Link
                            href={PAGE_ADMIN_CREATE_CHAPTER(uidUser, uidLesson)}
                            style={{ textDecoration: 'none' }}
                        >
                            <ButtonConfirm
                                label={t('create-chapter', { ns: NS_BUTTONS }) || 'Créer chapitre'}
                                isAdmin={true}
                            />
                        </Link>
                    </Stack>
                )}
                {
                    isLoadingLessons && <CircularProgress size={'16px'} color="warning" />
                }
                {!isLoadingLessons && isAuthorized && <Stack spacing={1}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--font-color)' }}>
                                    {t('chapters', { ns: ClassLesson.NS_COLLECTION })}
                                </Typography>
                                {isLoadingChapters ? (
                                    <CircularProgress size={20} color="warning" />
                                ) : chapters?.length > 0 ? (
                                    <List disablePadding sx={{ bgcolor: 'var(--card-bg)', borderRadius: 1, border: '1px solid var(--card-border)' }}>
                                        {chapters.map((chapter) => (
                                            <ListItemButton
                                                key={chapter.uid}
                                                component={Link}
                                                href={PAGE_ADMIN_ONE_CHAPTER(uidUser, uidLesson, chapter.uid)}
                                                sx={{ borderBottom: '1px solid var(--card-border)', '&:last-child': { borderBottom: 0 } }}
                                            >
                                                <ListItemText
                                                    primary={`${chapter?.uid_intern ?? ''}. ${chapter?.translate?.title || ''}` || chapter?.title || `${t('chapter', { ns: ClassLesson.NS_COLLECTION })} ${chapter?.uid_intern ?? ''}`}
                                                    primaryTypographyProps={{ sx: { color: 'var(--font-color)' } }}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" sx={{ color: 'var(--grey-light)' }}>
                                        {t('no_chapters', { ns: ClassLesson.NS_COLLECTION })}
                                    </Typography>
                                )}
                            </Stack>}
            </Stack>
        </AdminPageWrapper>
    );
}

export default function AdminOneLessonUpdatePage() {
    return (<AdminOneLessonContent />);
}
