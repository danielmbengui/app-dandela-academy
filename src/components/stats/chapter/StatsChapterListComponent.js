"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Chip,
    Stack,
    Paper,
    Grid,
    LinearProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useLesson } from "@/contexts/LessonProvider";
import { useTranslation } from "react-i18next";
import { IconArrowDown, IconArrowUp, IconCharts, IconProgressUp, IconStar } from "@/assets/icons/IconsComponent";
import { PAGE_STATS } from "@/contexts/constants/constants_pages";
import { capitalizeFirstLetter, formatChrono, getFormattedDateNumeric } from "@/contexts/functions";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useChapter } from "@/contexts/ChapterProvider";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useStat } from "@/contexts/StatProvider";
import CircularProgressStatComponent from "@/components/elements/CircularProgressStatComponent";
import CircularProgressChapter from "../CircularProgressChapter";

function NoStatsComponent() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid var(--card-border)',
                bgcolor: 'var(--card-color)',
                width: '100%',
            }}
        >
            <Typography sx={{ color: 'var(--grey-light)' }}>{t('no-result')}</Typography>
        </Paper>
    );
}
function ViewScoreComponent({ chapter = null }) {
   // if (!chapter) return;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const router = useRouter();
    const { stats, getOneStatIndex } = useStat();
    const [direction, setDirection] = useState('asc');
    const [sort, setSort] = useState('date');
    const SORTS = [
        { id: "date", value: t('sort.date') },
        { id: "score", value: t('sort.score') },
        { id: "duration", value: t('sort.duration') },
    ];
    const { statsFiltered, hasStats } = useMemo(() => {
        var filtered_stats = [...stats].filter(s => s.uid_chapter === chapter.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
        if (sort === 'date') {
            if (direction === 'asc') {
                filtered_stats = filtered_stats.sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
            } else {
                filtered_stats = filtered_stats.sort((a, b) => b.end_date.getTime() - a.end_date.getTime());
            }
        } else if (sort === 'score') {
            if (direction === 'asc') {
                filtered_stats = filtered_stats.sort((a, b) => a.score - b.score);
            } else {
                filtered_stats = filtered_stats.sort((a, b) => b.score - a.score);
            }
        } else if (sort === 'duration') {
            if (direction === 'asc') {
                filtered_stats = filtered_stats.sort((a, b) => a.duration - b.duration);
            } else {
                filtered_stats = filtered_stats.sort((a, b) => b.duration - a.duration);
            }
        }
        const hasStats = filtered_stats.length > 0;
        return { statsFiltered: filtered_stats, hasStats };
    }, [chapter, stats, sort, direction]);

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            {!hasStats && <NoStatsComponent />}
            {hasStats && (
                <>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid var(--card-border)',
                            bgcolor: 'var(--card-color)',
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        bgcolor: 'var(--primary-shadow-xs)',
                                        border: '1px solid var(--card-border)',
                                    }}
                                >
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <SelectComponentDark
                                            name={'sort'}
                                            value={sort}
                                            values={SORTS}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setSort(value);
                                            }}
                                            hasNull={false}
                                        />
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Box
                                                onClick={() => setDirection('asc')}
                                                sx={{
                                                    color: direction === 'asc' ? 'var(--primary)' : 'var(--grey-light)',
                                                    cursor: 'pointer',
                                                    transition: 'color 0.2s ease',
                                                    '&:hover': {
                                                        color: 'var(--primary)',
                                                    },
                                                }}
                                            >
                                                <IconArrowUp />
                                            </Box>
                                            <Box
                                                onClick={() => setDirection('desc')}
                                                sx={{
                                                    color: direction === 'desc' ? 'var(--primary)' : 'var(--grey-light)',
                                                    cursor: 'pointer',
                                                    transition: 'color 0.2s ease',
                                                    '&:hover': {
                                                        color: 'var(--primary)',
                                                    },
                                                }}
                                            >
                                                <IconArrowDown />
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Stack>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'var(--grey-light)',
                                    fontWeight: 500,
                                }}
                            >
                                {statsFiltered.length} {t('attempts')}
                            </Typography>
                        </Stack>
                    </Paper>
                    <Grid container spacing={2}>
                        {statsFiltered?.map((stat) => {
                            const uidIntern = getOneStatIndex(stat.uid, statsFiltered) + 1;
                            return (
                                <Grid size={{ xs: 12, sm: 'auto' }} key={`${stat.uid}`}>
                                    <StatCard
                                        uidLesson={stat.uid_lesson}
                                        uidChapter={stat.uid_chapter}
                                        title="Meilleur résultat"
                                        statUidIntern={uidIntern}
                                        icon={stat.score === stat.answers.length ? <EmojiEventsIcon /> : <IconStar />}
                                        tone="good"
                                        stat={stat}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </>
            )}
        </Stack>
    );
}
function ViewAverageComponent({ chapter = null, lesson = null }) {
    //if (!lesson || !chapter) return;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const { getGlobalCountQuiz, stats, getGlobalDuration, getGlobalScore, getGlobalCountQuestions } = useStat();
    const { chapters } = useChapter();
    const { statsFiltered, statusTab, countQuiz } = useMemo(() => {
        const statsFiltered = stats.filter(s => s.uid_lesson === lesson?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
        const statusTab = [...ClassUserStat.ALL_STATUS].reverse();
        const countQuiz = getGlobalCountQuiz(chapter.uid_lesson, chapter.uid, statsFiltered);
        return {
            statsFiltered,
            statusTab,
            countQuiz
        };
    }, [chapter, lesson, stats, getGlobalCountQuiz]);

    const chapterStats = [...statsFiltered].filter(s => s.uid_chapter === chapter.uid);
    const hasStats = chapterStats.length > 0;
    const countScore = getGlobalScore(chapter.uid_lesson, chapter.uid, chapterStats);
    const countQuestions = getGlobalCountQuestions(chapter.uid_lesson, chapter.uid, chapterStats);
    const totalDuration = getGlobalDuration(chapter.uid_lesson, chapter.uid, chapterStats);
    const percent = getGlobalPercent(chapter.uid_lesson, chapter.uid, chapterStats);

    const colorAverage = STATUS_CONFIG['average'];
    return (
        <Stack spacing={2} sx={{ py: 1 }}>
            {!hasStats && <NoStatsComponent />}
            {hasStats && (
                <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid var(--card-border)',
                                borderRadius: 3,
                                bgcolor: 'var(--card-color)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                height: '100%',
                            }}
                        >
                            <Stack justifyContent={'center'} alignItems={'center'} spacing={2}>
                                <Chip
                                    size="small"
                                    label={t('average')}
                                    sx={{
                                        fontWeight: 700,
                                        bgcolor: colorAverage.background_bubble,
                                        color: colorAverage.color_icon,
                                        border: `1px solid ${colorAverage.border}`,
                                    }}
                                />
                                <CircularProgressChapter
                                    score={countScore}
                                    questions={countQuestions}
                                    percent={percent}
                                    duration={totalDuration}
                                    size="large"
                                    status={'average'}
                                />
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 9 }}>
                        <Stack spacing={2}>
                            <Grid container spacing={2}>
                                {statusTab.map((status) => {
                                    const _stats = [...chapterStats].filter(stat => stat.status === status);
                                    const sizeStats = _stats.length;
                                    const percent = sizeStats / countQuiz * 100;
                                    const countScore = getGlobalScore(chapter.uid_lesson, chapter.uid, _stats);
                                    const countQuestions = getGlobalCountQuestions(chapter.uid_lesson, chapter.uid, _stats);
                                    const duration = getGlobalDuration(chapter.uid_lesson, chapter.uid, _stats);
                                    const colorBest = STATUS_CONFIG[status];
                                    return (
                                        <Grid size={{ xs: 12, sm: 'auto' }} key={`${status}`}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2.5,
                                                    border: '1px solid var(--card-border)',
                                                    borderRadius: 3,
                                                    bgcolor: 'var(--card-color)',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                                                        transform: 'translateY(-2px)',
                                                    },
                                                }}
                                            >
                                                <Stack justifyContent={'center'} alignItems={'center'} spacing={1.5}>
                                                    <Chip
                                                        size="small"
                                                        label={t(status)}
                                                        sx={{
                                                            fontWeight: 700,
                                                            bgcolor: colorBest.background_bubble,
                                                            color: colorBest.color_icon,
                                                            border: `1px solid ${colorBest.border}`,
                                                        }}
                                                    />
                                                    <CircularProgressChapter
                                                        score={sizeStats}
                                                        questions={countQuiz}
                                                        percent={percent}
                                                        duration={duration}
                                                        size="small"
                                                        status={status}
                                                    />
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                            <AverageComponent chapter={chapter} />
                        </Stack>
                    </Grid>
                </Grid>
            )}
        </Stack>
    );
}
function AverageComponent({ chapter = null }) {
    const router = useRouter();
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { getOneStatIndex, stats, getBestStat, getWorstStat } = useStat();
    const { bestStat, bestUidIntern, worstStat, worstUidIntern, colorBest, colorWorst } = useMemo(() => {
        const filtered_stats = [...stats].filter(s => s.uid_chapter === chapter?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
        const bestStat = getBestStat(chapter.uid_lesson, chapter.uid, filtered_stats);
        const bestUidIntern = getOneStatIndex(bestStat.uid, filtered_stats) + 1;
        const worstStat = getWorstStat(chapter.uid_lesson, chapter.uid, filtered_stats);
        const worstUidIntern = getOneStatIndex(worstStat.uid, filtered_stats) + 1;
        const colorBest = STATUS_CONFIG[bestStat?.status];
        const colorWorst = STATUS_CONFIG[worstStat?.status];
        return {
            bestStat,
            bestUidIntern,
            worstStat,
            worstUidIntern,
            colorBest,
            colorWorst
        };
    }, [chapter, stats, getBestStat, getWorstStat, getOneStatIndex]);

    return (
        <Grid container spacing={2} alignItems={'center'} justifyContent={'start'}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                    elevation={0}
                    onClick={() => router.push(ClassUserStat.createUrl(chapter.uid_lesson, chapter.uid, worstStat.uid))}
                    sx={{
                        p: 3,
                        border: `1px solid ${colorWorst?.border || 'var(--card-border)'}`,
                        borderRadius: 3,
                        bgcolor: 'var(--card-color)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            transform: 'translateY(-4px)',
                            borderColor: colorWorst?.border || 'var(--primary)',
                        },
                    }}
                >
                    <Stack justifyContent={'center'} alignItems={'center'} spacing={2}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: 'var(--font-color)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                            }}
                        >
                            {t('worst')}
                        </Typography>
                        {worstStat && worstStat.score === worstStat.answers?.length ? (
                            <EmojiEventsIcon sx={{ color: colorWorst?.color_icon, fontSize: '3rem' }} />
                        ) : (
                            <IconCharts height={40} width={40} color={colorWorst?.color_icon} />
                        )}
                        <CircularProgressStatComponent
                            score={worstStat?.score}
                            questions={worstStat?.answers?.length}
                            percent={worstStat?.score / worstStat?.answers?.length * 100}
                            duration={worstStat?.duration}
                            size="medium"
                            status={worstStat?.status}
                        />
                        <Typography
                            sx={{
                                fontWeight: 600,
                                color: colorWorst?.color,
                                fontSize: '0.95rem',
                            }}
                        >
                            {capitalizeFirstLetter(t('quiz'))} n°{worstUidIntern}
                        </Typography>
                        <Chip
                            size="small"
                            label={getFormattedDateNumeric(worstStat?.end_date)}
                            sx={{
                                fontWeight: 700,
                                bgcolor: colorWorst?.background_bubble,
                                color: colorWorst?.color,
                                border: `1px solid ${colorWorst?.border}`,
                            }}
                        />
                    </Stack>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                    elevation={0}
                    onClick={() => router.push(ClassUserStat.createUrl(chapter.uid_lesson, chapter.uid, bestStat.uid))}
                    sx={{
                        p: 3,
                        border: `1px solid ${colorBest?.border || 'var(--card-border)'}`,
                        borderRadius: 3,
                        bgcolor: 'var(--card-color)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            transform: 'translateY(-4px)',
                            borderColor: colorBest?.border || 'var(--primary)',
                        },
                    }}
                >
                    <Stack justifyContent={'center'} alignItems={'center'} spacing={2}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: 'var(--font-color)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                            }}
                        >
                            {t('best')}
                        </Typography>
                        {bestStat && bestStat.score === bestStat.answers?.length ? (
                            <EmojiEventsIcon sx={{ color: colorBest?.color_icon, fontSize: '3rem' }} />
                        ) : (
                            <IconCharts height={40} width={40} color={colorBest?.color_icon} />
                        )}
                        <CircularProgressStatComponent
                            score={bestStat?.score}
                            questions={bestStat?.answers?.length}
                            percent={bestStat?.score / bestStat?.answers?.length * 100}
                            duration={bestStat?.duration}
                            size="medium"
                            status={bestStat?.status}
                        />
                        <Typography
                            sx={{
                                fontWeight: 600,
                                color: colorBest?.color,
                                fontSize: '0.95rem',
                            }}
                        >
                            {capitalizeFirstLetter(t('quiz'))} n°{bestUidIntern}
                        </Typography>
                        <Chip
                            size="small"
                            label={getFormattedDateNumeric(bestStat?.end_date)}
                            sx={{
                                fontWeight: 700,
                                bgcolor: colorBest?.background_bubble,
                                color: colorBest?.color,
                                border: `1px solid ${colorBest?.border}`,
                            }}
                        />
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    );
}
function StatCard({ title, tone, statUidIntern = 0, stat = null, uidLesson = "", uidChapter = "" }) {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const router = useRouter();
    const { getOneLesson } = useLesson();
    const { getOneChapter } = useChapter();
    const [lesson, setLesson] = useState(stat?.lesson);
    const [chapter, setChapter] = useState(stat?.chapter);
    const good = tone === "good";
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const color = STATUS_CONFIG[stat?.status] || {
        background: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
        background_icon: good ? "rgba(34,197,94,0.14)" : "rgba(245,158,11,0.18)",
        glow: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
        color: good ? "#15803D" : "#B45309",
        border: "rgba(15, 23, 42, 0.10)",
        border_icon: "rgba(15, 23, 42, 0.10)",
        color_icon: good ? "#15803D" : "#B45309",
        background_bar: good ? "#15803D" : "#B45309",
    };
    let icon = <IconProgressUp />;
    let background = "";
    let border = "1px solid var(--card-border)";
    let borderIcon = "1px solid transparent";
    let fontColor = "var(--font-color)";
    let borderChip = "1px solid var(--card-border)";
    let backgroundChip = "transparent";
    let colorChip = "var(--font-color)";
    let fontWeight = 500;
    
    if (stat?.status === ClassUserStat.STATUS.MAX) {
        icon = <EmojiEventsIcon />;
        background = color?.background;
        border = `2px solid ${color?.border}`;
        borderIcon = `1px solid ${color?.border}`;
        fontColor = color?.color;
        borderChip = `1px solid ${color?.border}`;
        backgroundChip = color?.background_bubble;
        colorChip = color?.color;
        fontWeight = 700;
    } else if (stat?.status === ClassUserStat.STATUS.EXCELLENT || stat?.status === ClassUserStat.STATUS.GOOD) {
        icon = <IconStar />;
    } else {
        icon = <IconProgressUp />;
    }
    
    useEffect(() => {
        if (stat) {
            const _lesson = getOneLesson(stat?.uid_lesson);
            const _chapter = getOneChapter(stat?.uid_chapter);
            setLesson(_lesson);
            setChapter(_chapter);
        } else {
            setLesson(null);
            setChapter(null);
        }
    }, [uidLesson, uidChapter, stat?.uid_lesson, stat?.uid_chapter, getOneLesson, getOneChapter]);
    
    if (!stat) {
        return (
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    p: 3,
                    border: "1px solid var(--card-border)",
                    bgcolor: 'var(--card-color)',
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--grey-light)' }}>
                    {t('no-result')}
                </Typography>
            </Paper>
        );
    }
    
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                p: 3,
                border: border,
                bgcolor: background || 'var(--card-color)',
                maxWidth: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-4px)',
                    borderColor: color?.border || 'var(--primary)',
                },
            }}
            onClick={() => router.push(`${PAGE_STATS}/${stat.uid_lesson}/${stat.uid_chapter}/${stat.uid}`)}
        >
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color: color?.color || 'var(--primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '0.75rem',
                    }}
                >
                    {t('quiz')} n°{statUidIntern}
                </Typography>
                
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: color?.background_icon || 'var(--primary-shadow-xs)',
                                color: color?.color_icon || 'var(--primary)',
                                border: borderIcon,
                                flexShrink: 0,
                            }}
                        >
                            {icon}
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.2,
                                color: color?.color || 'var(--font-color)',
                            }}
                        >
                            {t(stat?.status)}
                        </Typography>
                    </Stack>
                    <Chip
                        size="small"
                        label={`${parseInt((stat?.score / stat?.answers?.length) * 100)}%`}
                        sx={{
                            fontWeight: 700,
                            bgcolor: color?.background_bubble,
                            color: color?.color,
                            border: `1px solid ${color?.border}`,
                        }}
                    />
                </Stack>

                <Stack spacing={0.5}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 600,
                            color: fontColor,
                        }}
                    >
                        {lesson?.translate?.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: fontColor,
                            opacity: 0.8,
                        }}
                    >
                        {chapter?.translate?.title}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip
                        size="small"
                        label={`${stat?.score}/${stat?.answers?.length}`}
                        sx={{
                            fontWeight: fontWeight,
                            bgcolor: backgroundChip,
                            color: colorChip,
                            border: borderChip,
                        }}
                    />
                    <Chip
                        size="small"
                        label={formatChrono(stat?.duration)}
                        sx={{
                            fontWeight: fontWeight,
                            bgcolor: backgroundChip,
                            color: colorChip,
                            border: borderChip,
                        }}
                    />
                    <Chip
                        size="small"
                        label={getFormattedDateNumeric(stat?.end_date)}
                        sx={{
                            fontWeight: fontWeight,
                            bgcolor: backgroundChip,
                            color: colorChip,
                            border: borderChip,
                        }}
                    />
                </Stack>

                <LinearProgress
                    variant="determinate"
                    value={clamp((stat?.score / stat?.answers?.length) * 100)}
                    sx={{
                        height: 8,
                        borderRadius: 999,
                        bgcolor: color?.background_bubble || 'var(--primary-shadow-sm)',
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            bgcolor: color?.background_bar || 'var(--primary)',
                        },
                    }}
                />
            </Stack>
        </Paper>
    );
}
function clamp(v) {
    const n = Number(v || 0);
    return Math.max(0, Math.min(100, n));
}
export default function StatsChapterListComponent({ stats = [], isOpenDetails = false, setIsOpenDetails = null, viewMode = ClassUserStat.VIEW_MODE_SCORE }) {
    const isViewScore = viewMode === ClassUserStat.VIEW_MODE_SCORE;
    const { lesson } = useLesson();
    const { chapter } = useChapter();

    return (
        <Stack spacing={3} sx={{ width: '100%' }}>
            {isViewScore && <ViewScoreComponent chapter={chapter} />}
            {!isViewScore && <ViewAverageComponent lesson={lesson} chapter={chapter} />}
        </Stack>
    );
}
