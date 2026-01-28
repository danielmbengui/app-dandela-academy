"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    Container,
    Box,
    Typography,
    Chip,
    Stack,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Grid,
    Card,
    CardContent,
    IconButton,
    CircularProgress,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { ClassLessonChapter, ClassLessonChapterTranslation } from "@/classes/lessons/ClassLessonChapter";
import { useLanguage } from "@/contexts/LangProvider";
import { useParams, useRouter } from "next/navigation";
import { useLesson } from "@/contexts/LessonProvider";
import { Trans, useTranslation } from "react-i18next";
import { ClassLesson } from "@/classes/ClassLesson";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { ClassLessonSubchapterTranslation } from "@/classes/lessons/ClassLessonSubchapter";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { IconArrowBack, IconArrowLeft, IconArrowRight, IconBookOpen, IconCertificate, IconDuration, IconLessons, IconObjective, IconQuizz } from "@/assets/icons/IconsComponent";
import { NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS } from "@/contexts/i18n/settings";
import { PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { ClassLessonChapterQuestion, ClassLessonChapterQuestionTranslation, ClassLessonChapterQuiz } from "@/classes/lessons/ClassLessonChapterQuiz";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import { addDaysToDate, formatChrono, getFormattedDateComplete, getFormattedDateCompleteNumeric, getFormattedDateNumeric, mixArray } from "@/contexts/functions";
import AlertComponent from "@/components/elements/AlertComponent";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useAuth } from "@/contexts/AuthProvider";
import CircularProgressWithLabelComponent from "@/components/elements/CircularProgressWithLabelComponent";
import AccordionComponent from "@/components/dashboard/elements/AccordionComponent";
import { useChapter } from "@/contexts/ChapterProvider";
import { useStat } from "@/contexts/StatProvider";
import Link from "next/link";
import CircularProgressStatComponent from "@/components/elements/CircularProgressStatComponent";
import { ClassUser } from "@/classes/users/ClassUser";
import CircularProgressChapter from "@/components/stats/CircularProgressChapter";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const CongratulationsComponent = ({ stat = null, setIndexSub = null }) => {
    const { t } = useTranslation([ClassLessonChapterQuiz.NS_COLLECTION]);
    const router = useRouter();
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const colorStat = STATUS_CONFIG[stat?.status];
    const goBack = () => {
        setIndexSub(prev => prev - 1);
    }
    const goAnswer = () => {
        router.push(ClassUserStat.createUrl(stat?.uid_lesson, stat?.uid_chapter, stat?.uid));
    }
    const percentage = stat?.score / stat?.answers?.length * 100;
    
    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                background: 'linear-gradient(135deg, var(--card-color) 0%, var(--winner-shadow-xs) 100%)',
                borderRadius: 4,
                width: '100%',
                border: `2px solid ${colorStat?.border || 'var(--success)'}`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Confetti Animation */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 0,
                    '@keyframes makeItRain': {
                        from: {
                            opacity: 0,
                        },
                        '50%': {
                            opacity: 1,
                        },
                        to: {
                            transform: 'translateY(250px)',
                        },
                    },
                }}
            >
                {[...Array(20)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            width: '10px',
                            height: '20px',
                            bgcolor: ['var(--success)', 'var(--primary)', 'var(--warning)', '#ff6b6b', '#4ecdc4'][i % 5],
                            top: 0,
                            left: `${(i * 5) % 100}%`,
                            opacity: 0,
                            animation: 'makeItRain 3000ms infinite linear',
                            animationDelay: `${(i * 100)}ms`,
                            animationDuration: `${2000 + (i * 50)}ms`,
                        }}
                    />
                ))}
            </Box>

            <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                {/* Icon and Progress */}
                <Stack alignItems={'center'} spacing={2}>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: '50%',
                            bgcolor: colorStat?.background_bubble || 'var(--success-shadow-xs)',
                            border: `2px solid ${colorStat?.border || 'var(--success)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <EmojiEventsIcon sx={{ color: colorStat?.color || 'var(--success)', fontSize: '3rem' }} />
                    </Box>
                    <CircularProgressStatComponent
                        score={stat?.score}
                        questions={stat?.answers?.length}
                        percent={percentage}
                        duration={stat?.duration}
                        size="large"
                        status={stat?.status}
                    />
                    <Chip
                        label={getFormattedDateCompleteNumeric(stat?.end_date)}
                        sx={{
                            fontWeight: 700,
                            bgcolor: colorStat?.background_bubble || 'var(--success-shadow-xs)',
                            color: colorStat?.color || 'var(--success)',
                            border: `1px solid ${colorStat?.border || 'var(--success)'}`,
                            px: 2,
                            py: 0.5,
                        }}
                    />
                </Stack>

                {/* Congratulations Text */}
                <Stack alignItems={'center'} spacing={1}>
                    <Typography
                        variant="h4"
                        sx={{
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            fontWeight: 700,
                            color: 'var(--font-color)',
                            textAlign: 'center',
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                        }}
                    >
                        {t('finished.congrats')}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'var(--grey-light)',
                            textAlign: 'center',
                            fontSize: '1.1rem',
                        }}
                    >
                        {t('finished.max-score')}
                    </Typography>
                </Stack>

                {/* Action Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent={'center'}>
                    <ButtonCancel onClick={goBack} label={t('btn-back')} />
                    <ButtonConfirm onClick={goAnswer} label={t('btn-see-answers')} />
                </Stack>
            </Stack>
        </Paper>
    )
}
const CardHeader = () => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const { chapter } = useChapter();
    const { lesson } = useLesson();
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                background: 'var(--card-color)',
                borderRadius: 3,
                width: '100%',
                border: '1px solid var(--card-border)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                mb: 3,
            }}
        >
            <Stack spacing={2}>
                <Stack direction={'row'} alignItems={'center'} spacing={1.5} flexWrap="wrap">
                    <Chip
                        label={t(lesson?.category, { ns: ClassLesson.NS_COLLECTION })}
                        size="small"
                        sx={{
                            bgcolor: 'var(--primary-shadow-xs)',
                            color: 'var(--primary)',
                            fontWeight: 600,
                            border: '1px solid var(--primary-shadow-sm)',
                        }}
                    />
                    <Chip
                        label={t(chapter?.level)}
                        size="small"
                        sx={{
                            bgcolor: 'var(--card-color)',
                            color: 'var(--font-color)',
                            fontWeight: 600,
                            border: '1px solid var(--card-border)',
                        }}
                    />
                    <Chip
                        icon={<IconDuration height={16} width={16} color="var(--grey-light)" />}
                        label={
                            <Trans
                                t={t}
                                i18nKey={'duration_short'}
                                values={{
                                    start: chapter?.estimated_start_duration,
                                    end: chapter?.estimated_end_duration
                                }}
                            />
                        }
                        size="small"
                        sx={{
                            bgcolor: 'var(--card-color)',
                            color: 'var(--grey-light)',
                            fontWeight: 500,
                            border: '1px solid var(--card-border)',
                        }}
                    />
                </Stack>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        color: "var(--font-color)",
                        fontWeight: 700,
                        fontSize: { xs: '1.75rem', sm: '2rem' },
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                    }}
                >
                    {chapter?.translate?.title}
                </Typography>
                {chapter?.translate?.description && (
                    <Typography
                        variant="body1"
                        sx={{
                            color: "var(--grey-light)",
                            lineHeight: 1.7,
                            fontSize: '1rem',
                        }}
                    >
                        {chapter?.translate?.description}
                    </Typography>
                )}
            </Stack>
        </Paper>
    );
}
const CardGoals = () => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const { chapter } = useChapter();
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                background: 'var(--card-color)',
                borderRadius: 3,
                width: '100%',
                border: '1px solid var(--card-border)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
        >
            <Stack spacing={2}>
                <Stack direction={'row'} spacing={1.5} alignItems={'center'}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor: 'var(--primary-shadow-xs)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <IconObjective height={20} width={20} color="var(--primary)" />
                    </Box>
                    <Stack>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--font-color)', letterSpacing: '-0.01em' }}>
                            {t('goals')}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--grey-light)', mt: 0.5 }}>
                            {t('goals-subtitle')}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack spacing={1.5}>
                    {chapter?.translate?.goals?.map((goal, i) => (
                        <Paper
                            key={`${goal}-${i}`}
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid var(--card-border)',
                                bgcolor: 'var(--card-color)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'var(--primary)',
                                    bgcolor: 'var(--primary-shadow-xs)',
                                    transform: 'translateX(4px)',
                                }
                            }}
                        >
                            <Stack direction={'row'} alignItems={'flex-start'} spacing={1.5}>
                                <CheckCircleIcon
                                    sx={{
                                        color: 'var(--success)',
                                        fontSize: '1.5rem',
                                        flexShrink: 0,
                                        mt: 0.25,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        color: 'var(--font-color)',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {goal}
                                </Typography>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </Stack>
        </Paper>
    );
}
const CardSubChapters = ({
    index = -1,
    setIndex = null,
    //subchapters = [] 
}) => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
    const { chapter, chapters, subchapters, lastStat, setUidChapter, subchapter, setSubchapter, stats } = useChapter();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                background: 'var(--card-color)',
                borderRadius: 3,
                width: '100%',
                border: '1px solid var(--card-border)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
        >
            <Stack spacing={2}>
                {/* Header */}
                <Stack direction={'row'} spacing={1.5} alignItems={'center'}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor: 'var(--primary-shadow-xs)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <IconBookOpen height={20} width={20} color="var(--primary)" />
                    </Box>
                    <Stack>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--font-color)', letterSpacing: '-0.01em' }}>
                            {t('subchapters')}
                        </Typography>
                        {chapter?.translate?.subchapters_title && (
                            <Typography variant="caption" sx={{ color: 'var(--grey-light)', mt: 0.5 }}>
                                {chapter?.translate?.subchapters_title}
                            </Typography>
                        )}
                    </Stack>
                </Stack>

                {!chapter?.translate?.subchapters_title && (
                    <Typography variant="body2" sx={{ color: 'var(--grey-light)', mb: 1 }}>
                        {t('subchapters-subtitle')}
                    </Typography>
                )}

                {/* Subchapters List */}
                <Stack spacing={1.5}>
                    {subchapters?.sort((a, b) => a.uid_intern - b.uid_intern).map((sub, i) => {
                        const isActive = index === i;
                        return (
                            <Paper
                                key={`${sub.uid_intern}`}
                                elevation={0}
                                onClick={() => setIndex(i)}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    border: `1px solid ${isActive ? 'var(--primary)' : 'var(--card-border)'}`,
                                    bgcolor: isActive ? 'var(--primary-shadow-xs)' : 'var(--card-color)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        borderColor: 'var(--primary)',
                                        bgcolor: isActive ? 'var(--primary-shadow-xs)' : 'var(--primary-shadow-xs)',
                                        transform: 'translateX(4px)',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                    }
                                }}
                            >
                                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 2,
                                            bgcolor: isActive ? 'var(--primary)' : 'var(--grey-hyper-light)',
                                            color: isActive ? 'white' : 'var(--grey-light)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            flexShrink: 0,
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {sub.uid_intern}
                                    </Box>
                                    <Stack direction={'row'} alignItems={'center'} spacing={1.5} sx={{ flex: 1 }}>
                                        <MenuBookIcon
                                            sx={{
                                                fontSize: '1.25rem',
                                                color: isActive ? 'var(--primary)' : 'var(--grey-light)',
                                                transition: 'color 0.3s ease',
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: '0.95rem',
                                                fontWeight: isActive ? 600 : 500,
                                                color: isActive ? 'var(--primary)' : 'var(--font-color)',
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            {sub.translate?.title}
                                        </Typography>
                                    </Stack>
                                    {isActive && (
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: 'var(--primary)',
                                                boxShadow: '0 0 12px var(--primary)',
                                                flexShrink: 0,
                                            }}
                                        />
                                    )}
                                </Stack>
                            </Paper>
                        );
                    })}

                    {/* Quiz Item */}
                    <Paper
                        elevation={0}
                        onClick={() => setIndex(subchapters.length)}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: `1px solid ${index === subchapters.length ? 'var(--primary)' : 'var(--card-border)'}`,
                            bgcolor: index === subchapters.length ? 'var(--primary-shadow-xs)' : 'var(--card-color)',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: index === subchapters.length
                                ? 'linear-gradient(135deg, var(--primary-shadow-xs) 0%, var(--primary-shadow-sm) 100%)'
                                : 'var(--card-color)',
                            '&:hover': {
                                borderColor: 'var(--primary)',
                                bgcolor: index === subchapters.length ? 'var(--primary-shadow-xs)' : 'var(--primary-shadow-xs)',
                                transform: 'translateX(4px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            }
                        }}
                    >
                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 2,
                                    bgcolor: index === subchapters.length ? 'var(--primary)' : 'var(--success)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    flexShrink: 0,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {subchapters.length + 1}
                            </Box>
                            <Stack direction={'row'} alignItems={'center'} spacing={1.5} sx={{ flex: 1 }}>
                                <QuizIcon
                                    sx={{
                                        fontSize: '1.25rem',
                                        color: index === subchapters.length ? 'var(--primary)' : 'var(--success)',
                                        transition: 'color 0.3s ease',
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontSize: '0.95rem',
                                        fontWeight: index === subchapters.length ? 600 : 500,
                                        color: index === subchapters.length ? 'var(--primary)' : 'var(--font-color)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {t('quiz')}
                                </Typography>
                            </Stack>
                            {index === subchapters.length && (
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'var(--primary)',
                                        boxShadow: '0 0 12px var(--primary)',
                                        flexShrink: 0,
                                    }}
                                />
                            )}
                        </Stack>
                    </Paper>
                </Stack>
            </Stack>
        </Paper>
    );
}
const CardSubChaptersContent = ({
    index = -1,
    setIndex = null,
    //chapter = null,
    //subchapters = [],
    //subchapter = null,
    //setSubchapter = null,
}) => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
    const { chapter, chapters, subchapters, lastStat, setUidChapter, subchapter, setSubchapter, stats } = useChapter();

    //const { chapter, subchapters, subchapter, setSubchapter } = useChapter();
    //const [subchapter, setSubchapter] = useState(null);
    useEffect(() => {
        if (index >= 0 && subchapters.length > 0) {
            setSubchapter(subchapters[index]);
        } else {
            setSubchapter(null);
        }
    }, [index, subchapters]);
    const goBack = () => {
        setIndex(prev => prev - 1);
    }
    const goNext = () => {
        setIndex(prev => prev + 1);
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                background: 'var(--card-color)',
                borderRadius: 3,
                width: '100%',
                border: '1px solid var(--card-border)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
        >
            <Stack spacing={3}>
                {/* Header with Navigation */}
                <Stack direction={'row'} spacing={2} alignItems={'center'} justifyContent={'space-between'}>
                    <Stack direction={'row'} spacing={1.5} alignItems={'center'} sx={{ flex: 1 }}>
                        <IconButton
                            onClick={() => setIndex(prev => prev - 1)}
                            disabled={index === 0}
                            sx={{
                                color: index === 0 ? 'var(--grey-light)' : 'var(--primary)',
                                border: '1px solid var(--card-border)',
                                '&:hover': {
                                    bgcolor: 'var(--primary-shadow-xs)',
                                    borderColor: 'var(--primary)',
                                },
                                '&:disabled': {
                                    opacity: 0.5,
                                }
                            }}
                        >
                            <IconArrowLeft />
                        </IconButton>
                        <Stack sx={{ flex: 1 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '1.25rem',
                                    color: 'var(--font-color)',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {`${subchapter?.uid_intern}. `}{subchapter?.translate?.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--grey-light)', mt: 0.5 }}>
                                {t('subchapters')} • {index + 1} / {subchapters.length}
                            </Typography>
                        </Stack>
                        <IconButton
                            onClick={() => setIndex(prev => prev + 1)}
                            disabled={index === subchapters.length - 1}
                            sx={{
                                color: index === subchapters.length - 1 ? 'var(--grey-light)' : 'var(--primary)',
                                border: '1px solid var(--card-border)',
                                '&:hover': {
                                    bgcolor: 'var(--primary-shadow-xs)',
                                    borderColor: 'var(--primary)',
                                },
                                '&:disabled': {
                                    opacity: 0.5,
                                }
                            }}
                        >
                            <IconArrowRight />
                        </IconButton>
                    </Stack>
                </Stack>

                <Grid container spacing={3}>
                    {/* Content Section */}
                    <Grid size={{ xs: 12, sm: subchapter?.translate?.photo_url ? 6 : 12 }}>
                        <Stack spacing={2.5}>
                            {/* Goals */}
                            {subchapter?.translate?.goals?.length > 0 && (
                                <Stack spacing={1.5}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--font-color)' }}>
                                        {t('goals')}
                                    </Typography>
                                    <Stack spacing={1}>
                                        {subchapter?.translate?.goals?.map?.((goal, i) => (
                                            <Paper
                                                key={`${goal}-${i}`}
                                                elevation={0}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    border: '1px solid var(--card-border)',
                                                    bgcolor: 'var(--card-color)',
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--font-color)' }}>
                                                    {goal}
                                                </Typography>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}

                            {/* Keys */}
                            {subchapter?.translate?.keys?.length > 0 && (
                                <Stack spacing={1.5}>
                                    <Chip
                                        label={t('keys')}
                                        size="small"
                                        sx={{
                                            bgcolor: 'var(--primary-shadow-xs)',
                                            color: 'var(--primary)',
                                            fontWeight: 600,
                                            border: '1px solid var(--primary-shadow-sm)',
                                            width: 'fit-content',
                                        }}
                                    />
                                    <Stack spacing={1}>
                                        {subchapter?.translate?.keys?.map?.((key, i) => (
                                            <Stack
                                                key={`${key}-${i}`}
                                                direction={'row'}
                                                spacing={1.5}
                                                sx={{
                                                    px: 2,
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    border: '1px solid var(--card-border)',
                                                    bgcolor: 'var(--card-color)',
                                                }}
                                            >
                                                <CheckCircleIcon
                                                    sx={{
                                                        color: 'var(--primary)',
                                                        fontSize: '1.25rem',
                                                        flexShrink: 0,
                                                        mt: 0.25,
                                                    }}
                                                />
                                                <Typography sx={{ fontSize: '0.9rem', color: 'var(--font-color)', lineHeight: 1.6 }}>
                                                    {key}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}

                            {/* Exercises */}
                            {subchapter?.translate?.exercises?.length > 0 && (
                                <Stack spacing={1.5}>
                                    <Chip
                                        label={t('exercises')}
                                        size="small"
                                        sx={{
                                            bgcolor: 'var(--success-shadow-xs)',
                                            color: 'var(--success)',
                                            fontWeight: 600,
                                            border: '1px solid var(--success-shadow-sm)',
                                            width: 'fit-content',
                                        }}
                                    />
                                    <Stack spacing={1}>
                                        {subchapter?.translate?.exercises?.map?.((exercise, i) => (
                                            <Stack
                                                key={`${exercise}-${i}`}
                                                direction={'row'}
                                                spacing={1.5}
                                                sx={{
                                                    px: 2,
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    border: '1px solid var(--card-border)',
                                                    bgcolor: 'var(--card-color)',
                                                }}
                                            >
                                                <AssignmentTurnedInIcon
                                                    sx={{
                                                        color: 'var(--success)',
                                                        fontSize: '1.25rem',
                                                        flexShrink: 0,
                                                        mt: 0.25,
                                                    }}
                                                />
                                                <Typography sx={{ fontSize: '0.9rem', color: 'var(--font-color)', lineHeight: 1.6 }}>
                                                    {exercise}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}

                            {/* Navigation Buttons */}
                            <Stack direction={'row'} spacing={1.5} sx={{ pt: 2 }}>
                                {index > 0 && (
                                    <ButtonCancel
                                        onClick={goBack}
                                        disabled={index === 0}
                                        label={t('previous', { ns: NS_BUTTONS })}
                                    />
                                )}
                                {index < subchapters.length - 1 && (
                                    <ButtonConfirm
                                        onClick={goNext}
                                        disabled={index === subchapters.length - 1}
                                        label={t('next', { ns: NS_BUTTONS })}
                                    />
                                )}
                                {index === subchapters.length - 1 && (
                                    <ButtonConfirm
                                        onClick={goNext}
                                        disabled={index < subchapters.length - 1}
                                        label={t('quiz-btn')}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Image Section */}
                    {subchapter?.translate?.photo_url && (
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    border: '1px solid var(--card-border)',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                    }
                                }}
                            >
                                <Image
                                    src={subchapter?.translate?.photo_url || ""}
                                    alt={subchapter?.translate?.title || ""}
                                    width={600}
                                    height={400}
                                    style={{
                                        objectFit: "cover",
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                    }}
                                    sizes="(max-width: 600px) 100vw, 50vw"
                                />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Stack>
        </Paper>
    )
}
const NewQuizComponent = ({ setIndexSub = null }) => {
    const router = useRouter();
    const { t } = useTranslation([ClassLessonChapterQuiz.NS_COLLECTION, NS_BUTTONS]);
    const { lesson } = useLesson();
    const { chapter, chapters, subchapters, lastStat, setUidChapter, subchapter, setSubchapter } = useChapter();
    //const { stats } = useStat();
    const { stats, setUidStat, getMostRecentStat, getBestStat, isLoading: isLoadingStats } = useStat();
    const [mostResentStat, setMostResentStat] = useState(null);
    const [bestStat, setBestStat] = useState(null);

    //const { stats, setUidStat } = useStat();
    const { user } = useAuth();
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [stat, setStat] = useState(null);
    const [duration, setDuration] = useState(0);
    const [finished, setFinished] = useState(false);
    const [process, setProcess] = useState(false);
    useEffect(() => {
        async function init() {
            const _most_recent_stat = getMostRecentStat(chapter.uid_lesson, chapter.uid);
            const _best_stat = getBestStat(chapter.uid_lesson, chapter.uid);
            //setHasStat(stats.length > 0);
            setMostResentStat(_most_recent_stat);
            setBestStat(_best_stat);
        }
        if (user && lesson && chapter && !isLoadingStats) {
            init();
        }
    }, [lesson, chapter, user, isLoadingStats]);
    useEffect(() => {
        if (user && lesson && chapter && chapter?.quiz?.questions?.length > 0) {
            const _questions = chapter.quiz.questions;
            const _answers = _questions.map(q => ({
                uid_question: q.uid_intern,
                uid_answer: q.translate?.answer?.uid_intern,
                uid_proposal: '',
            }));
            setQuestions(_questions);
            setStat(new ClassUserStat({
                uid_user: user.uid,
                user: user,
                uid_lesson: chapter?.uid_lesson,
                lesson: lesson,
                uid_chapter: chapter?.uid,
                chapter: chapter,
                //uid_user: user.uid,
                //uid_lesson: chapter?.uid_lesson,
                //uid_chapter: chapter?.uid,
                start_date: new Date(),
                answers: _answers,
            }))
            //const arr = Array(chapter.quiz.questions.length).fill({});
            setAnswers(_answers);
        } else {
            setQuestions([]);
            setAnswers([]);
        }
    }, [user, lesson, chapter]);
    useEffect(() => {
        if (index < 0) return;
        if (finished) return;

        const time = 1000;
        const intervalId = setInterval(() => {
            setDuration(prev => {
                const _duration = prev + 1;
                setStat(prev => {
                    if (!prev || prev === null) return new ClassUserStat({
                        start_date: new Date(),
                    });
                    prev.update({ duration: _duration });
                    return prev.clone();
                })
                return _duration;
            });

        }, time);

        return () => clearInterval(intervalId);
    }, [index, finished]);
    useEffect(() => {
        if (index >= 0 && questions?.length > 0) {
            setQuestion(questions[index]);
            setProposals(questions[index].translate?.proposals);
        } else {
            setQuestion(null);
            setProposals([]);
        }
    }, [index, questions]);
    const goBack = () => {
        setIndex(prev => prev - 1);
    }
    const goNext = () => {
        setIndex(prev => prev + 1);
    }
    const submitQuiz = async () => {
        try {
            setProcess(true);
            var _score = answers.filter(item => item.uid_proposal === item.uid_answer).length || 0;
            //const _user_stat_object = new ClassUserStat(stat.toJSON());
            stat.update({
                end_date: new Date(),
                answers: answers,
                /*
                uid_user: user.uid,
                user: user,
                uid_lesson: chapter?.uid_lesson,
                lesson: lesson,
                uid_chapter: chapter?.uid,
                chapter: chapter,
                */
                next_trying_date: _score === answers.length ? new Date() : null,
                score: _score,
            });
            
            const user_stat = await stat.createFirestore();
            setStat(user_stat.clone());
            setFinished(true);
        } catch (error) {

        } finally {
            setProcess(false);
        }
    }
    return (<Grid size={{ xs: 12, sm: 10 }}>
        <Typography sx={{ display: 'none' }}>{`${t('quiz-duration')} : ${formatChrono(duration)}`}</Typography>
        <Stack alignItems={'start'} spacing={1.5} sx={{ py: 2, px: 1.5, border: '0.1px solid var(--card-border)', borderRadius: '10px', width: '100%' }}>
            {
                !finished && <>
                    {
                        <Typography sx={{ fontWeight: 500 }}>{question?.uid_intern}. {question?.translate?.question}</Typography>
                    }
                    {
                        proposals?.map?.((proposal, i) => {
                            return (<CheckboxComponent
                                checked={answers[index].uid_proposal === proposal.uid_intern}
                                onChange={(e) => {
                                    const _answers = [...answers];
                                    _answers[index] = { ..._answers[index], uid_proposal: proposal.uid_intern };
                                    setAnswers(_answers)
                                }}
                                //name={`proposal${i}`} 
                                key={`${proposal.uid_intern}-${i}`}
                                label={proposal.value}
                            />)
                        })
                    }
                    <Stack direction={'row'} sx={{ pt: 3 }} spacing={0.5} alignItems={'center'}>
                        {
                            index > 0 && <ButtonCancel onClick={goBack} disabled={index === 0} label={t('previous', { ns: NS_BUTTONS })} />
                        }
                        {
                            index < questions?.length - 1 && <ButtonConfirm
                                onClick={goNext}
                                disabled={index === questions?.length - 1 || !answers[index].uid_proposal}
                                label={t('next', { ns: NS_BUTTONS })} />
                        }
                        {
                            index === questions?.length - 1 && <ButtonConfirm
                                onClick={submitQuiz}
                                loading={process}
                                disabled={index < questions?.length - 1 || !answers[questions?.length - 1].uid_proposal}
                                label={t('save', { ns: NS_BUTTONS })} />
                        }
                    </Stack>
                </>
            }
            {
                finished &&
                <>
                    {
                        stat?.score < stat?.answers?.length && <AlertComponent
                            severity="success"
                            title={<Trans
                                t={t}
                                i18nKey={'finished.title'}
                                components={{
                                    b: <strong />,
                                    //br: <br />,
                                }}
                            />}
                            subtitle={<Stack spacing={0.5} sx={{ py: 1 }}>
                                <Typography sx={{ color: 'inherit', fontWeight: 500 }} variant="caption">
                                    <Trans
                                        t={t}
                                        i18nKey={'finished.score'}
                                        values={{
                                            score: `${stat?.score}/${stat?.answers?.length}`,
                                            //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                            //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                            //duration: formatChrono(duration),
                                        }}
                                        components={{
                                            caption: <Typography variant="caption" sx={{ color: 'inherit' }} />,
                                            //br: <br />,
                                        }}
                                    />
                                </Typography>
                                <Typography sx={{ color: 'inherit', fontWeight: 500 }} variant="caption">
                                    <Trans
                                        t={t}
                                        i18nKey={'finished.percentage'}
                                        values={{
                                            //score: `${stat?.score}/${stat?.answers?.length}`,
                                            //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                            percentage: stat ? (stat?.score / stat?.answers?.length * 100).toFixed(2) : 0,
                                            //duration: formatChrono(duration),
                                        }}
                                        components={{
                                            caption: <Typography variant="caption" sx={{ color: 'inherit' }} />,                                    //br: <br />,
                                        }}
                                    />
                                </Typography>
                                <Typography sx={{ color: 'inherit', fontWeight: 500 }} variant="caption">
                                    <Trans
                                        t={t}
                                        i18nKey={'finished.time'}
                                        values={{
                                            //score: `${stat?.score}/${stat?.answers?.length}`,
                                            //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                            //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                            duration: formatChrono(stat?.duration),
                                        }}
                                        components={{
                                            caption: <Typography variant="caption" sx={{ color: 'inherit' }} />,
                                            //br: <br />,
                                        }}
                                    />
                                </Typography>
                                <br />
                                <Typography sx={{ color: 'inherit' }} variant="caption">
                                    <Trans
                                        t={t}
                                        i18nKey={stat?.score === stats?.answers?.length ? 'finished.max-score' : 'finished.next-trying-date'}
                                        values={{
                                            //score: `${stat?.score}/${stat?.answers?.length}`,
                                            nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date) || new Date(),
                                            //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                            //duration: formatChrono(duration),
                                        }}
                                        components={{
                                            caption: <Typography variant="caption" sx={{ color: 'inherit' }} />,
                                            b: <strong />,
                                        }}
                                    />
                                </Typography>
                            </Stack>
                            }
                            buttonConfirmComponent={<ButtonConfirm
                                onClick={() => {
                                    const url = ClassUserStat.createUrl(lesson?.uid, chapter?.uid, stat?.uid);
                                    router.push(url);
                                }}
                                sx={{ background: 'var(--success-dark)' }}
                                label={t('btn-see-answers')} />}
                            buttonCancelComponent={<ButtonCancel
                                sx={{
                                    border: '0.1px solid var(--success-dark)',
                                    '&:hover': {
                                        //bgcolor: 'primary.dark',
                                        border: '1px solid var(--success-dark)',
                                        color: 'var(--success-dark)',
                                    },
                                }}
                                label={t('btn-back')}
                                onClick={goBack}
                            />}
                        />
                    }
                    {
                        stat?.score === stat?.answers?.length &&
                        <Stack maxWidth={'xs'} sx={{ position: 'relative', background: '' }}>
                            <CongratulationsComponent setIndexSub={setIndexSub} stat={stat} />
                        </Stack>
                    }
                </>
            }
        </Stack>
    </Grid>)
}
const CardQuizz = ({
    indexSub = -1,
    setIndexSub = null,
    //quiz = null, 
    //subChapters: subchapters = [], 
    //lesson = null,
    //chapter = null 
    //chapter = null,
    //subchapters = [],
    //subchapter, setSubchapter
}) => {
    const { t } = useTranslation([ClassLessonChapterQuiz.NS_COLLECTION, NS_DAYS]);
    const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
    const { chapter, chapters, subchapters, lastStat, setUidChapter, subchapter, setSubchapter } = useChapter();
    const { stats, setUidStat, getMostRecentStat, getBestStat, isLoading: isLoadingStats } = useStat();
    //const { lesson, } = useLesson();
    //const { stats, chapters, lastStat, setUidChapter, subchapter, setSubchapter } = useChapter();
    const [hasStat, setHasStat] = useState(false);
    const [mostResentStat, setMostResentStat] = useState(null);
    const [bestStat, setBestStat] = useState(null);
    const [index, setIndex] = useState(-1);
    const { user } = useAuth();
    //const [subChapter, setSubChapter] = useState(null);
    const [question, setQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [duration, setDuration] = useState(0);
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [nextDate, setNextDate] = useState(null);
    const [stat, setStat] = useState(null);
    const [showComponent, setShowComponent] = useState(false);
    const [canStartQuiz, setCanStartQuiz] = useState(false);
    //const [stats, setStats] = useState([]);
    //const [isLoadingStats, setIsLoadingStats] = useState(true);
    useEffect(() => {
        async function init() {
            const _user_stat_object = new ClassUserStat({
                uid_user: user.uid,
                uid_lesson: lesson.uid,
                uid_chapter: chapter.uid,
            });
            const _stat = await _user_stat_object.getStat();
            const _most_recent_stat = getMostRecentStat(chapter.uid_lesson, chapter.uid);
            const _best_stat = getBestStat(chapter.uid_lesson, chapter.uid);
            setHasStat(stats.length > 0);
            setMostResentStat(_most_recent_stat);
            setBestStat(_best_stat);
            if (!_most_recent_stat) {
                setCanStartQuiz(true);
            } else if (_most_recent_stat) {

                if (_most_recent_stat.next_trying_date?.getTime() <= new Date().getTime()) {
                    setCanStartQuiz(true);
                } else {
                    setCanStartQuiz(false);
                }
            } else if (_best_stat && _best_stat.score < _best_stat.answers?.length) {
                setCanStartQuiz(true);
            }
            setShowComponent(true);
        }
        if (user && lesson && chapter && !isLoadingStats) {
            init();

        }
    }, [lesson, chapter, user, isLoadingStats])
    useEffect(() => {
        if (chapter?.quiz?.questions?.length > 0) {
            const _questions = chapter.quiz.questions;
            setQuestions(_questions);
            const arr = Array(chapter.quiz.questions.length).fill({});

            setAnswers(_questions.map(q => ({
                uid_question: q.uid_intern,
                uid_answer: q.translate?.answer?.uid_intern,
                uid_proposal: '',
            })));
        } else {
            setQuestions([]);
            setAnswers([]);
        }
    }, [chapter]);
    useEffect(() => {
        if (indexSub < subchapters.length - 1) {
            setDuration(0);
        }
    }, [indexSub]);
    useEffect(() => {
        if (index < 0) return;
        if (finished) return;

        const time = 1000;
        const intervalId = setInterval(() => {
            setDuration(prev => prev + 1);
        }, time);

        return () => clearInterval(intervalId);
    }, [index, finished]);
    useEffect(() => {
        if (index >= 0 && questions?.length > 0) {
            setQuestion(questions[index]);
            setProposals(questions[index].translate?.proposals);
        } else {
            setQuestion(null);
            setProposals([]);
        }
    }, [index, questions]);
    const goBackSub = () => {
        setIndexSub(prev => prev - 1);
    }
    const startQuiz = () => {
        setIndex(0);
        const _user_stat_object = new ClassUserStat({
            uid_user: user?.uid,
            uid_lesson: lesson?.uid,
            uid_chapter: chapter?.uid,
            start_date: new Date(),
            questions_length: questions?.length || 0
            //next_trying_date:addDaysToDate(new Date(), 30),
        });
        setStat(prev => {
            if (!prev || prev === null) return _user_stat_object;
            prev.update(_user_stat_object.toJSON());
            return prev;
        });
    }


    return (<Stack alignItems={'start'} spacing={1.5} sx={{ background: '', width: '100%' }}>
        <Grid container spacing={1.5} sx={{ width: '100%' }}>
            <Grid size={{ xs: 12, sm: 8 }}>

                <Stack spacing={1} sx={{ py: 2, px: 1.5, background: 'var(--card-color)', borderRadius: '10px', width: '100%' }}>
                    {
                        !showComponent && <CircularProgress size={'16px'} sx={{ fontSize: '16px' }} />
                    }
                    {
                        showComponent && <Stack spacing={1}>
                            <Stack maxWidth={'sm'} spacing={0.5}>
                                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                    <IconQuizz color={'var(--primary)'} />
                                    <Typography sx={{ color: 'var(--font-color)' }}>{t('title')}</Typography>
                                </Stack>
                                {
                                    index < 0 && <Stack spacing={0.5}>
                                        {
                                            !mostResentStat && <>
                                                {
                                                    //(!mostResentStat || mostResentStat===null) && 
                                                    //(bestStat && bestStat.score < bestStat.answers?.length) &&
                                                    //stats?.[0]?.score < stats?.[0]?.answers?.length && stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() && 
                                                    <Typography variant="caption" sx={{ color: 'red', fontWeight: 300 }}>{t('subtitle')}</Typography>
                                                }
                                                {
                                                    <AlertComponent
                                                        severity="warning"
                                                        subtitle={<Typography>
                                                            <Trans
                                                                t={t}
                                                                i18nKey={'warning'}
                                                                values={{
                                                                    quiz_delay_days: chapter?.quiz_delay_days
                                                                }}
                                                                components={{
                                                                    b: <strong />
                                                                }}
                                                            />
                                                        </Typography>}
                                                    />
                                                }
                                            </>
                                        }
                                        {
                                            mostResentStat && bestStat && bestStat.score < bestStat.answers?.length && <>
                                                {
                                                    mostResentStat.next_trying_date.getTime() <= new Date().getTime() &&
                                                    //(bestStat && bestStat.score < bestStat.answers?.length) &&
                                                    //stats?.[0]?.score < stats?.[0]?.answers?.length && stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() && 
                                                    <AlertComponent
                                                        severity={'info'}
                                                        subtitle={<Typography>
                                                            <Trans
                                                                t={t}
                                                                i18nKey={'finished.next-trying-date'}
                                                                values={{
                                                                    nextDate: t('now', { ns: NS_DAYS })
                                                                }}
                                                                components={{
                                                                    b: <strong />
                                                                }}
                                                            />
                                                        </Typography>}
                                                    />
                                                }
                                                {
                                                    mostResentStat.next_trying_date.getTime() > new Date().getTime() &&
                                                    //(bestStat && bestStat.score < bestStat.answers?.length) &&
                                                    //stats?.[0]?.score < stats?.[0]?.answers?.length && stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() && 
                                                    <AlertComponent
                                                        severity={"error"}
                                                        subtitle={<Typography>
                                                            <Trans
                                                                t={t}
                                                                i18nKey={'finished.next-trying-date'}
                                                                values={{
                                                                    nextDate: getFormattedDateCompleteNumeric(stats?.[0]?.next_trying_date)
                                                                }}
                                                                components={{
                                                                    b: <strong />
                                                                }}
                                                            />
                                                        </Typography>}
                                                    />
                                                }
                                            </>
                                        }
                                    </Stack>

                                }

                            </Stack>
                            {
                                index < 0 && <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                                    {
                                        //index < 0 &&
                                        (!mostResentStat || (bestStat && bestStat.score < bestStat.answers?.length)) &&
                                        //stats?.[0]?.score < stats?.[0]?.answers?.length && stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() && 
                                        <ButtonCancel label={t('btn-back')} onClick={goBackSub} />
                                    }
                                    {
                                        // index < 0 &&
                                        canStartQuiz &&
                                        (!bestStat || (bestStat && bestStat.score < bestStat.answers?.length)) &&
                                        //stats?.[0]?.score < stats?.[0]?.answers?.length && stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() && 
                                        <ButtonConfirm label={t('btn-start')} onClick={startQuiz} />
                                    }
                                    {
                                        // index < 0 &&
                                        //canStartQuiz &&
                                        (mostResentStat && (bestStat && bestStat.score < bestStat.answers?.length)) &&
                                        <Link href={ClassUserStat.createUrl(mostResentStat?.uid_lesson, mostResentStat?.uid_chapter, mostResentStat?.uid)}>
                                            <ButtonConfirm label={t('btn-see-answers')} />
                                        </Link>
                                    }
                                </Stack>
                            }
                            <Grid container spacing={{ xs: 0.5, sm: 1 }} alignItems={'start'} sx={{ background: '', width: '100%', maxWidth: '100vw', }}>
                                {
                                    index >= 0 &&
                                    <NewQuizComponent setIndexSub={setIndexSub} />
                                }
                            </Grid>
                            {
                                bestStat && bestStat.score === bestStat.answers?.length && <Grid container>
                                    <Grid size={{ xs: 12, sm: 'auto' }}>
                                        <Stack maxWidth={'sm'} sx={{ position: 'relative', background: '' }}>
                                            <CongratulationsComponent stat={bestStat} setIndexSub={setIndexSub} />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            }
                        </Stack>
                    }
                </Stack>
            </Grid>
            {
                lesson?.photo_url && <Grid size={{ xs: 12, sm: 'grow' }}>
                    <Stack
                        sx={{
                            position: "relative",
                            width: "100%",
                            //height: 220,
                            //borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid",
                            border: "0.1px solid transparent",
                        }}
                    >
                        {
                            <Image
                                src={lesson?.photo_url}
                                alt="Interface Excel - grille et ruban"
                                //fill
                                priority
                                height={100}
                                width={200}
                                style={{ objectFit: "cover", width: '100%', height: 'auto', borderRadius: '10px' }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        }
                    </Stack>
                </Grid>
            }
        </Grid>
    </Stack>)
}
export default function ExcelBeginnerCoursePage() {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    //const { lang } = useLanguage();
    const { uid: uidLess, chapter: uidChapter } = useParams();
    //const { user } = useAuth();
    const { lesson, setUidLesson,} = useLesson();
    const { chapter, chapters, subchapters, setUidChapter, setSubchapter, isLoading: isLoadingChapters } = useChapter();
    //const [chapter, setChapter] = useState();
    //const [subchapters, setSubChapters] = useState([]);
    //const [subchapter, setSubchapter] = useState(null);
    const { stats,isLoading: isLoadingStats } = useStat();
    const [showComponent, setShowComponent] = useState(false);
    //const hasPreviousStats = i === 0 ? true : i > 0 && stats?.filter(s => s.uid_chapter === chapters[i - 1].uid)?.length > 0;
    const [hasPreviousStats, setHasPreviousStats] = useState(false);
    const [previousChapter, setPreviousChapter] = useState(null);
    const [indexSub, setIndexSub] = useState(0);
    useEffect(() => {
        if (chapter && indexSub >= 0 && indexSub < subchapters.length) {
            setSubchapter(chapter.subchapters?.[indexSub] || null);
        }
    }, [indexSub]);

    useEffect(() => {
        setUidLesson(uidLess);
        setUidChapter(uidChapter);
    }, [uidLess, uidChapter]);
    useEffect(() => {
        if (chapter && !isLoadingChapters && !isLoadingStats) {
            if (chapter?.uid_intern === 1) {
                setHasPreviousStats(true);
                setPreviousChapter(chapter);
            } else {
                const indexChapter = chapters.findIndex(c => c.uid_intern === chapter.uid_intern);
                const _previous = chapters[indexChapter - 1];
                setPreviousChapter(_previous);
                if (stats?.filter(s => s.uid_chapter === _previous.uid)?.length > 0) {
                    setHasPreviousStats(true);
                } else {
                    setHasPreviousStats(false);
                }
            }
        }
        setShowComponent(true);
    }, [chapter, isLoadingChapters, isLoadingStats]);
    return (<DashboardPageWrapper
        titles={[
            { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_LESSONS },
            { name: lesson?.translate?.title, url: `${PAGE_LESSONS}/${lesson?.uid}` },
            { name: t('chapters', { ns: NS_DASHBOARD_MENU }), url: `${PAGE_LESSONS}/${lesson?.uid}/chapters` },
            { name: `${chapter?.uid_intern}. ${chapter?.translate?.title}`, url: '' },
        ]}
        //title={`Cours / ${lesson?.title}`}
        //subtitle={lesson?.translate?.subtitle}
        icon={<IconLessons />}
    >
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2 }, py: 2, background: 'transparent' }}>
            <Stack spacing={3}>
                <CardHeader lesson={lesson} chapter={chapter} />
                
                {!showComponent && (
                    <Stack alignItems={'center'} sx={{ py: 4 }}>
                        <CircularProgress size={24} sx={{ color: 'var(--primary)' }} />
                    </Stack>
                )}
                
                {showComponent && previousChapter && !hasPreviousStats && (
                    <AlertComponent
                        severity="error"
                        title={t('title-tip')}
                        subtitle={t('tip')}
                        buttonConfirmComponent={
                            <Link href={`${PAGE_LESSONS}/${lesson?.uid}/chapters/${previousChapter?.uid}`}>
                                <ButtonConfirm
                                    label={t('btn-previous-chapter')}
                                    style={{ background: 'var(--error)', color: 'var(--card-color)' }}
                                />
                            </Link>
                        }
                    />
                )}

                {showComponent && previousChapter && hasPreviousStats && indexSub < subchapters.length && (
                    <>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, lg: 6 }}>
                                <CardGoals />
                            </Grid>
                            <Grid size={{ xs: 12, lg: 6 }}>
                                <CardSubChapters
                                    index={indexSub}
                                    setIndex={setIndexSub}
                                />
                            </Grid>
                        </Grid>
                        <CardSubChaptersContent
                            index={indexSub}
                            setIndex={setIndexSub}
                        />
                    </>
                )}
                
                {showComponent && previousChapter && hasPreviousStats && indexSub === subchapters.length && (
                    <CardQuizz
                        indexSub={indexSub}
                        setIndexSub={setIndexSub}
                    />
                )}
            </Stack>
        </Container>
    </DashboardPageWrapper>);
}
