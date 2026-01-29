"use client"
import React, { useEffect, useMemo, useState } from "react";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { useLesson } from "@/contexts/LessonProvider";
import { NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { IconLessons } from "@/assets/icons/IconsComponent";
import { ClassLesson } from "@/classes/ClassLesson";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { LessonTeacherProvider, useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import LessonTeacherComponent from "@/components/dashboard/lessons/LessonTeacherComponent";
import { useUsers } from "@/contexts/UsersProvider";
import { Box, CircularProgress, Fade, Stack, Skeleton } from "@mui/material";

export default function OneLessonSitePage() {
    const params = useParams();
    const {uid:uidLesson, uidLesson: uidLessonTeacher } = params;
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_DASHBOARD_MENU]);
    const { lesson, isLoading: isLoadingLessons, setUidLesson } = useLesson();
    const { lesson: lessonTeacher, isLoading: isLoadingLessonsTeacher, setUidLesson: setUidLessonTeacher } = useLessonTeacher();
    const {getOneUser, isLoading: isLoadingUsers} = useUsers();
    const [isInitialized, setIsInitialized] = useState(false);
    
    useEffect(() => {
        if (uidLessonTeacher && !isLoadingLessonsTeacher) {
            setUidLesson(uidLesson);
            setUidLessonTeacher(uidLessonTeacher);
            setIsInitialized(true);
        }
    }, [uidLesson, uidLessonTeacher, isLoadingLessonsTeacher, setUidLesson, setUidLessonTeacher]);
    
    const teacher = useMemo(()=>{
        if (!lessonTeacher?.uid_teacher) return null;
        return getOneUser(lessonTeacher.uid_teacher);
    }, [lessonTeacher, getOneUser]);

    const isLoading = isLoadingLessons || isLoadingLessonsTeacher || isLoadingUsers || !isInitialized;
    const hasData = lesson && lessonTeacher && teacher;

    return (
        <DashboardPageWrapper
            titles={[
                { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_LESSONS },
                { name: lesson?.translate?.title || t('loading', { ns: NS_DASHBOARD_MENU }), url: lesson ? `${PAGE_LESSONS}/${lesson?.uid}` : PAGE_LESSONS },
                { name: teacher?.getCompleteName() || '', url: '' },
            ]}
            icon={<IconLessons />}
        >
            <div >
                {isLoading ? (
                    <Fade in={true} timeout={300}>
                        <div className="loading-container">
                            <Stack spacing={3} sx={{ width: '100%' }}>
                                <Skeleton 
                                    variant="rectangular" 
                                    width="100%" 
                                    height={200} 
                                    sx={{ borderRadius: 2 }}
                                    animation="wave"
                                />
                                <Stack spacing={2}>
                                    <Skeleton variant="text" width="60%" height={40} animation="wave" />
                                    <Skeleton variant="text" width="100%" height={20} animation="wave" />
                                    <Skeleton variant="text" width="80%" height={20} animation="wave" />
                                </Stack>
                                <Stack direction="row" spacing={2}>
                                    <Skeleton variant="rectangular" width="70%" height={400} sx={{ borderRadius: 2 }} animation="wave" />
                                    <Skeleton variant="rectangular" width="30%" height={400} sx={{ borderRadius: 2 }} animation="wave" />
                                </Stack>
                            </Stack>
                        </div>
                    </Fade>
                ) : hasData ? (
                    <Fade in={true} timeout={500}>
                        <div className="content-wrapper">
                            <LessonTeacherComponent lesson={lessonTeacher} />
                        </div>
                    </Fade>
                ) : (
                    <Fade in={true} timeout={300}>
                        <div className="error-container">
                            <div className="error-content">
                                <h2>{t('error', { ns: NS_DASHBOARD_MENU, defaultValue: 'Erreur' })}</h2>
                                <p>{t('lesson-not-found', { ns: NS_DASHBOARD_MENU, defaultValue: 'Leçon non trouvée' })}</p>
                            </div>
                        </div>
                    </Fade>
                )}
            </div>
            <style jsx>{`
                .page-container {
                    width: 100%;
                    min-height: 100%;
                    animation: fadeIn 0.4s ease-in-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .loading-container {
                    width: 100%;
                    padding: 20px 0;
                }

                .content-wrapper {
                    width: 100%;
                    animation: slideUp 0.5s ease-out;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .error-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    width: 100%;
                }

                .error-content {
                    text-align: center;
                    padding: 40px;
                    background: var(--card-color);
                    border-radius: 16px;
                    border: 1px solid var(--card-border);
                    max-width: 500px;
                }

                .error-content h2 {
                    margin: 0 0 16px;
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--font-color);
                }

                .error-content p {
                    margin: 0;
                    font-size: 1rem;
                    color: var(--grey-light);
                }

                @media (max-width: 600px) {
                    .loading-container {
                        padding: 10px 0;
                    }

                    .error-content {
                        padding: 24px;
                        margin: 0 16px;
                    }

                    .error-content h2 {
                        font-size: 1.25rem;
                    }
                }
            `}</style>
        </DashboardPageWrapper>
    );
}