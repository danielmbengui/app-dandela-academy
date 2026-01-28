"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
    Grid,
    LinearProgress,
    Rating,
    CircularProgress,
    Container,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InsightsIcon from "@mui/icons-material/Insights";
import QuizIcon from "@mui/icons-material/Quiz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useStat } from "@/contexts/StatProvider";
import { useLesson } from "@/contexts/LessonProvider";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetter, cutString, formatChrono, formatDuration, getFormattedDateNumeric } from "@/contexts/functions";
import { ChapterProvider, useChapter } from "@/contexts/ChapterProvider";
import Link from "next/link";
import { PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import { useRouter } from "next/navigation";
import { IconCharts, IconDropDown, IconDropUp } from "@/assets/icons/IconsComponent";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import LinearProgressCountScore from "@/components/elements/LinearProgressCountScore";
import CircularProgressStatComponent from "@/components/elements/CircularProgressStatComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import LinearProgressStat from "@/components/elements/LinearProgressStat";
import LinearProgressChapter from "../LinearProgressChapter";
import CircularProgressChapter from "../CircularProgressChapter";


/**
 * Page "Résultats" (tests/quiz)
 * ✅ Global : score moyen, réussite, chapitres, temps total, tendance
 * ✅ Par cours : résumé + chapitres (quiz) + détails
 * ✅ Filtre : choisir un cours
 * ✅ Affichage : cartes modernes + barres de progression
 *
 * À brancher :
 * - fetch des résultats (Firestore) : par course_uid -> chapters -> attempts
 * - calculs : moyenne, % réussite, best/worst, progression, etc.
 */

export default function StatsLessonListComponent({ isOpenDetails = false, setIsOpenDetails = null, viewMode = ClassUserStat.VIEW_MODE_SCORE }) {
    const isViewScore = viewMode === ClassUserStat.VIEW_MODE_SCORE;
    const { chapters } = useChapter();
    const [selectedUid, setSelectedUid] = useState('');
    const uidMemo = useMemo(()=>{
        return selectedUid;
    }, [selectedUid]);
    
    return (
        <Stack spacing={2}>
            <Box sx={{
                //minHeight: "100vh", 
                width: '100%',
                bgcolor: "",
                //borderRadius: '20px', 
                py: 2,
                //px: { xs: 1.5, sm: 2 } 
            }}>
                <Stack maxWidth={'xl'} spacing={1}>

                    <Grid container spacing={2} sx={{ background: '' }}>
                        {
                            chapters.map(chapter => {
                                return (<Grid key={chapter.uid} size={{ xs: 12, sm: isOpenDetails ? 12 : 'auto' }}>
                                    <ChapterResultCard
                                        isOpenDetails={isOpenDetails}
                                        setIsOpenDetails={setIsOpenDetails}
                                        selectedUid={selectedUid}
                                        setSelectedUid={setSelectedUid}
                                        chapter={chapter}
                                        isViewScore={isViewScore}
                                    />
                                </Grid>)
                            })
                        }
                    </Grid>
                </Stack>
            </Box>
        </Stack>
    );
}

/* -------------------- Components -------------------- */
function ChaptersList() {
    const { chapters } = useChapter();
    const { getBestStat } = useStat();
    return (<Grid container spacing={1} sx={{ background: '', width: '100%', }}>

        {
            chapters.map((chapter, i) => {
                const bestStat = getBestStat(chapter.uid_lesson, chapter.uid);
                console.log("beeest ststa", bestStat)
                return (<Grid key={`${chapter.uid}-${i}`} size={{ xs: 12, sm: 'auto' }}>
                    <Link href={`${PAGE_STATS}/${bestStat?.uid}`}>
                        <HighlightCard
                            uidLesson={chapter.uid_lesson}
                            uidChapter={chapter.uid}
                            title="Meilleur résultat"
                            icon={<EmojiEventsIcon />}
                            //attempt={filteredStats.best}
                            tone="good"
                            status={bestStat?.status}
                            stat={bestStat}
                        />
                    </Link>
                </Grid>)
            })
        }
    </Grid>)
}
function HighlightCard({ title, icon, attempt, tone, status = "", stat = null, uidLesson = "", uidChapter = "" }) {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { getOneLesson } = useLesson();
    const { getOneChapter, chapters } = useChapter();
    const [lesson, setLesson] = useState(stat?.lesson);
    const [chapter, setChapter] = useState(stat?.chapter);
    const good = tone === "good";
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const color = STATUS_CONFIG[status] || {
        background: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
        background_icon: good ? "rgba(34,197,94,0.14)" : "rgba(245,158,11,0.18)",
        glow: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
        color: good ? "#15803D" : "#B45309",
        border: "rgba(15, 23, 42, 0.10)",
        border_icon: "rgba(15, 23, 42, 0.10)",
        color_icon: good ? "#15803D" : "#B45309",
        background_bar: good ? "#15803D" : "#B45309",
    };
    //console.log("COLORS", color);
    useEffect(() => {
        if (stat) {
            const _lesson = getOneLesson(uidLesson);
            const _chapter = getOneChapter(uidChapter);
            setLesson(stat?.lesson);
            setChapter(stat?.chapter);
            console.log("HSPTER", stat.uid_lesson, stat.uid_chapter, chapters)
        } else {
            setLesson(null);
            setChapter(null);
        }
    }, [uidLesson, uidChapter, stat?.uid_lesson, stat?.uid_chapter]);
    if (!stat) {
        return (
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 5,
                    p: 2.2,
                    border: "1px solid rgba(15, 23, 42, 0.10)",
                }}
            >
                <Typography variant="h5" noWrap sx={{ fontWeight: 950 }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('no-result')}
                </Typography>
            </Paper>
        );
    }
    //const p = percent(attempt);
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 5,
                p: 2,
                border: `0.1px solid ${color?.border}`,
                bgcolor: color?.background,
                maxWidth: '300px'
            }}
        >
            <Stack spacing={1} sx={{ width: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: color?.color }}>
                        <AvatarIcon
                            sx={{
                                bgcolor: color?.background_icon,
                                color: color?.color_icon,
                                borderColor: color?.border
                            }}
                        >
                            {icon}
                        </AvatarIcon>
                        <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                            {t(stat?.status)}
                        </Typography>
                    </Stack>
                    <Chip
                        size="small"
                        label={`${parseInt((stat?.score / stat?.answers?.length) * 100)}%`}
                        sx={{
                            fontWeight: 950,
                            bgcolor: color?.background_bubble,
                            color: color?.color,
                            border: `1px solid ${color?.border}`,
                        }}
                    />
                </Stack>

                <Typography variant="body2" color={color?.color}>
                    <b>{lesson?.translate?.title}</b>
                </Typography>
                <Typography variant="body2" color={color?.color}>
                    {chapter?.translate?.title}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip size="small"
                        label={`${stat?.score}/${stat?.answers?.length}`} sx={{
                            fontWeight: 950,
                            bgcolor: color?.background_bubble,
                            color: color?.color,
                            border: `1px solid ${color?.border}`,
                        }} />
                    <Chip size="small"
                        label={formatChrono(stat?.duration)} sx={{
                            fontWeight: 950,
                            bgcolor: color?.background_bubble,
                            color: color?.color,
                            border: `1px solid ${color?.border}`,
                        }} />
                    <Chip size="small" label={getFormattedDateNumeric(stat?.end_date)} sx={{
                        fontWeight: 950,
                        bgcolor: color?.background_bubble,
                        color: color?.color,
                        border: `1px solid ${color?.border}`,
                    }} />
                </Stack>

                <LinearProgress
                    variant="determinate"
                    value={clamp((stat?.score / stat?.answers?.length) * 100)}
                    sx={{
                        height: 10,
                        borderRadius: 999,
                        bgcolor: color?.background_bubble,
                        border: `0.1px solid ${color?.border}`,
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            bgcolor: color?.background_bar,
                        },
                    }}
                />
            </Stack>
        </Paper>
    );
}
function ViewScoreComponent({ chapter = null }) {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const router = useRouter();
    const { stats } = useStat();
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    
    const { statsFiltered } = useMemo(() => {
        if (!chapter?.uid) return { statsFiltered: [] };
        const filtered_stats = [...stats]
            .filter(s => s.uid_chapter === chapter.uid)
            .sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
        return {
            statsFiltered: filtered_stats,
        };
    }, [chapter?.uid, stats]);

    if (statsFiltered.length === 0) {
        return (
            <Typography
                variant="body2"
                sx={{
                    color: 'var(--grey-light)',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    py: 2,
                }}
            >
                {t('no-result')}
            </Typography>
        );
    }

    return (
        <Grid container spacing={2} sx={{ width: '100%' }}>
            {statsFiltered.map((stat, i) => {
                const hasMaxStats = stat?.score === stat?.answers?.length;
                const colorBest = STATUS_CONFIG[stat?.status];
                
                return (
                    <Grid key={`${stat.uid}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Paper
                            elevation={0}
                            onClick={() => {
                                router.push(`${PAGE_STATS}/${stat.uid_lesson}/${stat.uid_chapter}/${stat.uid}`);
                            }}
                            sx={{
                                p: 2.5,
                                border: '1px solid var(--card-border)',
                                borderRadius: 3,
                                bgcolor: 'var(--card-color)',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                '&:hover': {
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                    transform: 'translateY(-4px)',
                                    borderColor: colorBest?.border || 'var(--primary)',
                                },
                            }}
                        >
                            <Stack
                                justifyContent="center"
                                alignItems="center"
                                spacing={1.5}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: colorBest?.background_icon || 'var(--primary-shadow-xs)',
                                        color: colorBest?.color_icon || 'var(--primary)',
                                        flexShrink: 0,
                                    }}
                                >
                                    {hasMaxStats ? (
                                        <EmojiEventsIcon sx={{ fontSize: '28px' }} />
                                    ) : (
                                        <IconCharts height={28} width={28} color={colorBest?.color_icon} />
                                    )}
                                </Box>
                                
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'var(--font-color)',
                                        textAlign: 'center',
                                    }}
                                >
                                    {capitalizeFirstLetter(t('quiz').substring(0, 5))}. {i + 1}
                                </Typography>
                                
                                <CircularProgressStatComponent
                                    score={stat?.score}
                                    questions={stat?.answers?.length}
                                    percent={(stat?.score / stat?.answers?.length) * 100}
                                    showPercent={false}
                                    duration={stat?.duration}
                                    size="small"
                                    status={stat?.status}
                                />
                                
                                <Chip
                                    size="small"
                                    label={getFormattedDateNumeric(stat?.end_date)}
                                    sx={{
                                        fontWeight: 600,
                                        bgcolor: colorBest?.background_bubble,
                                        color: colorBest?.color,
                                        border: `1px solid ${colorBest?.border}`,
                                    }}
                                />
                            </Stack>
                        </Paper>
                    </Grid>
                );
            })}
        </Grid>
    );
}
function ViewAverageComponent({ chapter = null, lesson = null }) {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const { getGlobalCountQuiz, stats, getGlobalDuration, getGlobalPercent, getGlobalScore, getGlobalCountQuestions } = useStat();
    const { chapters } = useChapter();
    
    const { statsFiltered, statusTab } = useMemo(() => {
        if (!lesson?.uid) return { statsFiltered: [], statusTab: [] };
        const statsFiltered = stats
            .filter(s => s.uid_lesson === lesson.uid)
            .sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
        const statusTab = [...ClassUserStat.ALL_STATUS].reverse();
        return {
            statsFiltered,
            statusTab,
        };
    }, [lesson?.uid, stats]);

    const countQuiz = getGlobalCountQuiz(chapter?.uid_lesson, chapter?.uid);
    const chapterStats = [...statsFiltered].filter(s => s.uid_chapter === chapter?.uid);
    const hasStats = chapterStats.length > 0;
    
    if (!hasStats) {
        return (
            <Typography
                variant="body2"
                sx={{
                    color: 'var(--grey-light)',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    py: 2,
                }}
            >
                {t('no-result')}
            </Typography>
        );
    }

    const countScore = getGlobalScore(chapter?.uid_lesson, chapter?.uid, chapterStats);
    const countQuestions = getGlobalCountQuestions(chapter?.uid_lesson, chapter?.uid, chapterStats);
    const totalDuration = getGlobalDuration(chapter?.uid_lesson, chapter?.uid, chapterStats);
    const percent = getGlobalPercent(chapter?.uid_lesson, chapter?.uid, chapterStats);
    const colorAverage = STATUS_CONFIG['average'];

    return (
        <Stack spacing={3} sx={{ py: 1 }}>
            <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: '1px solid var(--card-border)',
                            borderRadius: 3,
                            bgcolor: 'var(--card-color)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <Chip
                            size="small"
                            label={t('average')}
                            sx={{
                                fontWeight: 700,
                                bgcolor: colorAverage.background_bubble,
                                color: colorAverage.color_icon,
                                border: `1px solid ${colorAverage.border}`,
                                mb: 2,
                            }}
                        />
                        <CircularProgressChapter
                            score={countScore}
                            questions={countQuestions}
                            percent={percent}
                            duration={totalDuration}
                            size="large"
                            status="average"
                        />
                    </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                    <Stack spacing={2}>
                        <Grid container spacing={2}>
                            {statusTab.map((status) => {
                                const _stats = [...chapterStats].filter(stat => stat.status === status);
                                const sizeStats = _stats.length;
                                const percent = sizeStats / countQuiz * 100;
                                const countScore = getGlobalScore(chapter?.uid_lesson, chapter?.uid, _stats);
                                const countQuestions = getGlobalCountQuestions(chapter?.uid_lesson, chapter?.uid, _stats);
                                const duration = getGlobalDuration(chapter?.uid_lesson, chapter?.uid, _stats);
                                const colorBest = STATUS_CONFIG[status];
                                
                                return (
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`${status}`}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                border: '1px solid var(--card-border)',
                                                borderRadius: 3,
                                                bgcolor: 'var(--card-color)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                                    transform: 'translateY(-2px)',
                                                    borderColor: colorBest?.border || 'var(--primary)',
                                                },
                                            }}
                                        >
                                            <Chip
                                                size="small"
                                                label={t(status)}
                                                sx={{
                                                    fontWeight: 700,
                                                    bgcolor: colorBest.background_bubble,
                                                    color: colorBest.color_icon,
                                                    border: `1px solid ${colorBest.border}`,
                                                    mb: 2,
                                                }}
                                            />
                                            <CircularProgressChapter
                                                score={countScore}
                                                questions={countQuestions}
                                                percent={percent}
                                                duration={duration}
                                                size="small"
                                                status={status}
                                            />
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        
                        <AverageComponent chapter={chapter} />
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    );
}
function AverageComponent({ chapter = null }) {
    //if (!chapter) return;
    const router = useRouter();
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const {getOneStatIndex, getGlobalCountQuiz, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
    const { statsFiltered,
        averageQuestions, averagePercent, averageDuration, averageScore,
        bestStat, bestUidIntern,
        worstStat,worstUidIntern,
        colorBest, colorWorst } = useMemo(() => {
            const filtered_stats = [...stats].filter(s => s.uid_chapter === chapter?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
            const averageQuestions = getGlobalCountQuestions(chapter.uid_lesson, chapter.uid, filtered_stats);
            const averagePercent = getGlobalPercent(chapter.uid_lesson, chapter.uid, filtered_stats);
            const averageDuration = getGlobalDuration(chapter.uid_lesson, chapter.uid, filtered_stats);
            const totalScore = getGlobalScore(chapter.uid_lesson, chapter.uid, filtered_stats);
            const totalQuestions = getGlobalCountQuestions(chapter.uid_lesson, chapter.uid, filtered_stats);
            const averageScore = totalScore;
            const bestStat = getBestStat(chapter.uid_lesson, chapter.uid, filtered_stats);
            const bestUidIntern = getOneStatIndex(bestStat.uid, filtered_stats) + 1;
            
            const worstStat = getWorstStat(chapter.uid_lesson, chapter.uid, filtered_stats);
            const worstUidIntern = getOneStatIndex(worstStat.uid, filtered_stats) + 1;
            const colorBest = STATUS_CONFIG[bestStat?.status];
            const colorWorst = STATUS_CONFIG[worstStat?.status];
            return {
                statsFiltered: filtered_stats,
                averageQuestions,
                averagePercent,
                averageDuration,
                averageScore,
                bestStat,
                bestUidIntern,
                worstStat,
                worstUidIntern,
                colorBest,
                colorWorst
            };
        }, [chapter]);

    return (<Grid container
        alignItems={'center'}
        justifyContent={'start'}
        spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }} alignItems={'center'}>
            <Stack justifyContent={'center'} alignItems={'center'} spacing={1}
            onClick={()=>router.push(ClassUserStat.createUrl(chapter.uid_lesson, chapter.uid, worstStat.uid))}
                sx={{
                    py: 1,
                    px: 1.5,
                    border: '0.1px solid var(--card-border)',
                    borderRadius: '10px',
                    cursor:'pointer'
                }}>
                <Typography>{t('worst')}</Typography>
                {
                    worstStat && worstStat.score === worstStat.answers?.length ?
                        <EmojiEventsIcon sx={{ color: colorWorst?.color_icon, fontSize: '30px' }} /> :
                        <IconCharts height={30} width={30} color={colorWorst?.color_icon} />
                }

                <CircularProgressStatComponent
                    score={worstStat?.score}
                    questions={worstStat?.answers?.length}
                    percent={worstStat?.score / worstStat?.answers?.length * 100}
                    duration={worstStat?.duration}
                    size="medium"
                    status={worstStat?.status}
                />
                <Typography sx={{ color: colorWorst?.color }}>{capitalizeFirstLetter(t('quiz'))} n°{worstUidIntern}</Typography>
                <Chip size="small" label={getFormattedDateNumeric(worstStat?.end_date)} sx={{
                    fontWeight: 950,
                    bgcolor: colorWorst?.background_bubble,
                    color: colorWorst?.color,
                    border: `1px solid ${colorWorst?.border}`,
                }} />
            </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} alignItems={'center'}>
            <Stack justifyContent={'center'} alignItems={'center'} spacing={1}
            onClick={()=>router.push(ClassUserStat.createUrl(chapter.uid_lesson, chapter.uid, bestStat.uid))}
                sx={{
                    py: 1,
                    px: 1.5,
                    border: '0.1px solid var(--card-border)',
                    borderRadius: '10px',
                    cursor:'pointer'
                }}>
                <Typography>{t('best')}</Typography>
                {
                    bestStat && bestStat.score === bestStat.answers?.length ?
                        <EmojiEventsIcon sx={{ color: colorBest?.color_icon, fontSize: '30px' }} /> :
                        <IconCharts height={30} width={30} color={colorBest?.color_icon} />
                }

                <CircularProgressStatComponent
                    score={bestStat?.score}
                    questions={bestStat?.answers?.length}
                    percent={bestStat?.score / bestStat?.answers?.length * 100}
                    duration={bestStat?.duration}
                    progress={42} stat={bestStat}
                    size="medium"
                    status={bestStat?.status}
                />
                <Typography sx={{ color: colorWorst?.color }}>{capitalizeFirstLetter(t('quiz'))} n°{bestUidIntern}</Typography>
                <Chip size="small" label={getFormattedDateNumeric(bestStat?.end_date)} sx={{
                    fontWeight: 950,
                    bgcolor: colorBest?.background_bubble,
                    color: colorBest?.color,
                    border: `1px solid ${colorBest?.border}`,
                }} />
            </Stack>
        </Grid>
    </Grid>)
}
function ChapterResultCard({selectedUid, setSelectedUid, chapter, isOpenDetails = false, setIsOpenDetails = null, isViewScore = true }) {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { getOneLesson } = useLesson();
    const { stats, getGlobalCountQuiz, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountQuestions, getGlobalScore, getGlobalDuration } = useStat();
    const router = useRouter();

    const averageQuestions = getGlobalCountQuestions(chapter.uid_lesson, chapter.uid);
    const averagePercent = getGlobalPercent(chapter.uid_lesson, chapter.uid);
    const averageDuration = getGlobalDuration(chapter.uid_lesson, chapter.uid);

    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];

    const lesson = useMemo(() => {
        return getOneLesson(chapter.uid_lesson);
    }, [chapter?.uid_lesson, getOneLesson]);

    const onSeeMore = (uid) => {
        setSelectedUid(uid);
        if (setIsOpenDetails) setIsOpenDetails(true);
    };
    
    const onSeeLess = () => {
        setSelectedUid('');
        if (setIsOpenDetails) setIsOpenDetails(false);
    };

    const {
        hasStats,
        bestStat,
        colorBest,
        valueAverage,
        percentAverage,
        totalScore,
        totalQuestions,
        averageScore,
        countQuiz,
    } = useMemo(() => {
        const _stats = [...stats].filter(s => s.uid_chapter === chapter.uid);
        const hasStats = _stats.length > 0;
        const bestStat = getBestStat(chapter.uid_lesson, chapter.uid, _stats);
        const colorBest = STATUS_CONFIG[bestStat?.status];
        const totalScore = getGlobalScore(chapter?.uid_lesson, chapter?.uid, _stats);
        const totalQuestions = getGlobalCountQuestions(chapter?.uid_lesson, chapter?.uid, _stats);
        const countQuiz = getGlobalCountQuiz(chapter?.uid_lesson, chapter?.uid, _stats);
        
        let averageScore = totalScore / countQuiz;
        let averageTotal = totalQuestions / countQuiz;
        let valueAverage = `${totalScore % countQuiz === 0 ? averageScore : averageScore.toFixed(2)}/${averageTotal}`;
        let percentAverage = averageScore / averageTotal * 100;
        
        if (!isViewScore) {
            const averagePercent = getGlobalPercent(chapter.uid_lesson, chapter.uid);
            valueAverage = averagePercent % parseInt(averagePercent) === 0 ? averagePercent : `${averagePercent.toFixed(2)}%`;
            percentAverage = averagePercent;
        }
        
        return {
            totalScore,
            totalQuestions,
            countQuiz,
            averageScore: (totalScore / totalQuestions * 100),
            valueAverage,
            percentAverage,
            hasStats,
            bestStat,
            colorBest,
        };
    }, [chapter, stats, isViewScore, getBestStat, getGlobalScore, getGlobalCountQuestions, getGlobalCountQuiz, getGlobalPercent, STATUS_CONFIG]);

    const isExpanded = selectedUid === chapter.uid;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                p: 3,
                border: "1px solid var(--card-border)",
                bgcolor: 'var(--card-color)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-2px)',
                    borderColor: colorBest?.border || 'var(--primary)',
                },
            }}
        >
            <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: 'var(--font-color)',
                        }}
                        title={chapter.title}
                    >
                        {chapter?.uid_intern}. {chapter?.translate?.title || chapter?.title}
                    </Typography>
                    {hasStats && (
                        <ButtonCancel
                            label={t('btn-see-results')}
                            onClick={() => router.push(`${PAGE_STATS}/${chapter?.uid_lesson}/${chapter?.uid}`)}
                        />
                    )}
                </Stack>

                {!hasStats && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'var(--grey-light)',
                            fontStyle: 'italic',
                        }}
                    >
                        {t('no-result')}
                    </Typography>
                )}

                {hasStats && (
                    <>
                        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                            <Chip
                                size="small"
                                label={`${countQuiz} ${t('quizs')}`}
                                sx={{
                                    ...softChip(),
                                    fontWeight: 600,
                                }}
                            />
                            <Chip
                                size="small"
                                label={`${t('duration_short')}: ${formatChrono(averageDuration)}`}
                                sx={{
                                    bgcolor: 'transparent',
                                    color: 'var(--font-color)',
                                    border: '1px solid var(--card-border)',
                                    fontWeight: 500,
                                }}
                            />
                            <Chip
                                size="small"
                                label={`${t('average').substring(0, 3)}. ${valueAverage}`}
                                sx={{
                                    bgcolor: 'transparent',
                                    color: 'var(--font-color)',
                                    border: '1px solid var(--card-border)',
                                    fontWeight: 500,
                                }}
                            />
                        </Stack>

                        <LinearProgressChapter
                            percent={percentAverage}
                            value={valueAverage}
                            score={averageScore}
                            questions={averageQuestions}
                            duration={averageDuration}
                            size="medium"
                            status="average"
                        />

                        {isExpanded && (
                            <Stack spacing={2.5} sx={{ pt: 1 }}>
                                <Stack
                                    onClick={onSeeLess}
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    spacing={0.5}
                                    sx={{
                                        color: 'var(--primary)',
                                        cursor: 'pointer',
                                        transition: 'opacity 0.2s',
                                        '&:hover': {
                                            opacity: 0.8,
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'inherit',
                                        }}
                                    >
                                        {t('btn-close-details')}
                                    </Typography>
                                    <IconDropUp height={12} />
                                </Stack>

                                {isViewScore && <ViewScoreComponent chapter={chapter} />}
                                {!isViewScore && <ViewAverageComponent lesson={lesson} chapter={chapter} />}
                            </Stack>
                        )}

                        {!isExpanded && (
                            <Typography
                                onClick={() => onSeeMore(chapter.uid)}
                                variant="body2"
                                sx={{
                                    color: 'var(--primary)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    transition: 'opacity 0.2s',
                                    '&:hover': {
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                {t('btn-see-details')} →
                            </Typography>
                        )}
                    </>
                )}
            </Stack>
        </Paper>
    );
}
function AvatarIcon({ children, sx }) {
    return (
        <Box
            sx={{
                width: 40,
                height: 40,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(37,99,235,0.12)",
                color: "#2563EB",
                border: "1px solid rgba(37,99,235,0.18)",
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}
/* -------------------- Helpers -------------------- */
function percent(a) {
    const t = Number(a?.total || 0);
    const s = Number(a?.score || 0);
    if (!t) return 0;
    return (s / t) * 100;
}
function clamp(v) {
    const n = Number(v || 0);
    return Math.max(0, Math.min(100, n));
}
function uniqueCount(arr) {
    return new Set(arr).size;
}
function emptyStats() {
    return {
        coursesCount: 0,
        chaptersCount: 0,
        attemptsCount: 0,
        totalDuration: 0,
        avgPercent: 0,
        avgScore10: 0,
        best: null,
        worst: null,
    };
}
function chapterChip({ background = "", color = "", borderColor = "" }) {
    return {
        bgcolor: background,
        color: color,
        border: `0.1px solid ${borderColor}`,
        fontWeight: 500,
    };
}
function softChip() {
    return {
        bgcolor: "var(--primary-shadow-xs)",
        color: "var(--primary)",
        border: "0.1px solid var(--primary)",
        fontWeight: 500,
    };
}
const outlineBtnSx = {
    borderRadius: 3,
    fontWeight: 950,
    textTransform: "none",
    borderColor: "rgba(37,99,235,0.35)",
    color: "#2563EB",
    "&:hover": { borderColor: "#2563EB", bgcolor: "rgba(37,99,235,0.06)" },
};