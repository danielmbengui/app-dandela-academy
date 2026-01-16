"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { IconArrowBack, IconArrowDown, IconArrowLeft, IconArrowRight, IconArrowUp, IconBookOpen, IconCertificate, IconCharts, IconDuration, IconLessons, IconObjective, IconProgressUp, IconQuizz, IconStar, IconStats } from "@/assets/icons/IconsComponent";
import { PAGE_CHAPTERS, PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import { addDaysToDate, capitalizeFirstLetter, formatChrono, getFormattedDateComplete, getFormattedDateCompleteNumeric, getFormattedDateNumeric, mixArray } from "@/contexts/functions";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useChapter } from "@/contexts/ChapterProvider";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useStat } from "@/contexts/StatProvider";
import CircularProgressStatComponent from "@/components/elements/CircularProgressStatComponent";
import CircularProgressChapter from "../CircularProgressChapter";

export default function StatsChapterListComponent({ stats = [], isOpenDetails = false, setIsOpenDetails = null, viewMode = ClassUserStat.VIEW_MODE_SCORE }) {
    const isViewScore = viewMode === ClassUserStat.VIEW_MODE_SCORE;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { lesson, } = useLesson();
    const { chapter, chapters } = useChapter();
    const { getBestStat } = useStat();

    return (<Grid container spacing={1} sx={{ background: '', width: '100%', }}>

        {
            isViewScore && <ViewScoreComponent chapter={chapter} />
        }

        <Grid size={12}>
            {
                !isViewScore && <ViewAverageComponent lesson={lesson} chapter={chapter} />
            }
        </Grid>
    </Grid>)
}
function NoStatsComponent() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    return(<Stack sx={{p:1.5, my:1, border:'0.1px solid var(--card-border)'}} alignItems={'start'}>
      <Typography>{t('no-result')}</Typography>
    </Stack>)
  }
function ViewScoreComponent({ chapter = null }) {
    if (!chapter) return;
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

    return (<Grid container spacing={1} sx={{ width: '100%' }}>
        {
            !hasStats && <NoStatsComponent />
        }
        {
            hasStats && <>
            <Grid size={12}>
            <Stack spacing={1} alignItems={'center'} sx={{ background: '' }} direction={'row'}>
                <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ background: 'var(--primary-shadow)', py: 1, px: 1.5, borderRadius: '10px' }}>
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
                    <Stack direction={'row'} alignItems={'center'}>
                        <Box
                            onClick={() => setDirection('asc')}
                            sx={{
                                color: direction === 'asc' ? 'var(--primary)' : '',
                                cursor: 'pointer'
                            }}
                        >
                            <IconArrowUp />
                        </Box>
                        <Box
                            onClick={() => setDirection('desc')}
                            sx={{
                                color: direction === 'desc' ? 'var(--primary)' : '',
                                cursor: 'pointer'
                            }}
                        >
                            <IconArrowDown />
                        </Box>
                    </Stack>
                </Stack>
                <Typography variant="caption">{statsFiltered.length} {t('attempts')}</Typography>
            </Stack>
        </Grid>
        {
            statsFiltered?.map((stat, i) => {
                const uidIntern = getOneStatIndex(stat.uid, statsFiltered) + 1;
                return (<Grid size={'auto'} key={`${stat.uid}`}>
                    <StatCard
                        uidLesson={stat.uid_lesson}
                        uidChapter={stat.uid_chapter}
                        title="Meilleur résultat"
                        statUidIntern={uidIntern}
                        icon={stat.score === stat.answers.length ? <EmojiEventsIcon /> : <IconStar />}
                        //attempt={filteredStats.best}
                        tone="good"
                        //status={bestStat?.status}
                        stat={stat}
                    />
                </Grid>)
            })
        }
            </>
        }
    </Grid>)
}
function ViewAverageComponent({ chapter = null, lesson = null }) {
    if (!lesson || !chapter) return;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const { getGlobalCountQuiz, stats, getGlobalDuration, getGlobalPercent, getGlobalScore, getGlobalCountQuestions, getBestStat, getWorstStat } = useStat();
    const { chapters } = useChapter();
    const { statsFiltered, chaptersFiltered, statusTab, countQuiz } = useMemo(() => {
        const chaptersFiltered = chapters.filter(c => c.uid_lesson === lesson?.uid);
        const statsFiltered = stats.filter(s => s.uid_lesson === lesson?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
        const statusTab = [...ClassUserStat.ALL_STATUS].reverse();
        const countQuiz = getGlobalCountQuiz(chapter.uid_lesson, chapter.uid, statsFiltered);
        return {
            statsFiltered,
            chaptersFiltered,
            statusTab,
            countQuiz
        };
    }, [chapter, lesson, stats, chapters]);

    const chapterStats = [...statsFiltered].filter(s => s.uid_chapter === chapter.uid);
    const hasStats = chapterStats.length > 0;
    const countScore = getGlobalScore(chapter.uid_lesson, chapter.uid, chapterStats);
    const countQuestions = getGlobalCountQuestions(chapter.uid_lesson, chapter.uid, chapterStats);
    const totalDuration = getGlobalDuration(chapter.uid_lesson, chapter.uid, chapterStats);
    const percent = getGlobalPercent(chapter.uid_lesson, chapter.uid, chapterStats);

    const colorAverage = STATUS_CONFIG['average'];
    return (<Stack spacing={1} sx={{ py: 1 }} alignItems={'start'}>
        {
            !hasStats && <NoStatsComponent />
        }
        {
            hasStats && <Grid direction="row" container spacing={1} sx={{
                background: '', justifyContent: "center",
                alignItems: "stretch",
            }}>
                <Grid size={{ xs: 12, sm: 3 }} sx={{ height: '100%', background: '' }}>
                    <Stack justifyContent={'center'} alignItems={'center'} spacing={1}
                        sx={{
                            py: 1,
                            px: 1.5,
                            border: '0.1px solid var(--card-border)',
                            borderRadius: '10px',
                        }}>
                        <Chip size="small" label={t('average')} sx={{
                            fontWeight: 950,
                            bgcolor: colorAverage.background_bubble,
                            color: colorAverage.color_icon,
                            border: colorAverage.border,
                        }} />
                        <CircularProgressChapter
                            score={countScore}
                            questions={countQuestions}
                            percent={percent}
                            duration={totalDuration}
                            size="large"
                            status={'average'}
                        />
                    </Stack>
                </Grid>
                <Grid size={'grow'}>
                    <Stack spacing={1}>
                        <Grid container spacing={1}>
                            {
                                statusTab.map((status, i) => {
                                    const _stats = [...chapterStats].filter(stat => stat.status === status);
                                    const sizeStats = _stats.length;
                                    const percent = sizeStats / countQuiz * 100;
                                    //const percent = getGlobalPercent(chapter.uid_lesson, chapter.uid, _stats);
                                    const countScore = getGlobalScore(chapter.uid_lesson, chapter.uid, _stats);
                                    const countQuestions = getGlobalCountQuestions(chapter.uid_lesson, chapter.uid, _stats);
                                    const duration = getGlobalDuration(chapter.uid_lesson, chapter.uid, _stats);
                                    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
                                    const colorBest = STATUS_CONFIG[status];
                                    return (<Grid size={{ xs: 12, sm: 'auto' }} key={`${status}`}>
                                        <Stack justifyContent={'center'} alignItems={'center'} spacing={1}
                                            sx={{
                                                py: 1,
                                                px: 1.5,
                                                border: '0.1px solid var(--card-border)',
                                                borderRadius: '10px',
                                            }}>
                                            <Chip size="small" label={t(status)} sx={{
                                                fontWeight: 950,
                                                bgcolor: colorBest.background_bubble,
                                                color: colorBest.color_icon,
                                                border: colorBest.border,
                                            }} />
                                            <CircularProgressChapter
                                                score={sizeStats}
                                                questions={countQuiz}
                                                percent={percent}
                                                duration={duration}
                                                size="small"
                                                status={status}
                                            />
                                        </Stack>
                                    </Grid>)
                                })
                            }

                        </Grid>
                        <AverageComponent chapter={chapter} />
                    </Stack>
                </Grid>
            </Grid>
        }
    </Stack>)
}
function AverageComponent({ chapter = null }) {
    if (!chapter) return;
    const router = useRouter();
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { getOneStatIndex, getGlobalCountQuiz, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
    const { statsFiltered,
        averageQuestions, averagePercent, averageDuration, averageScore,
        bestStat, bestUidIntern,
        worstStat, worstUidIntern,
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
                onClick={() => router.push(ClassUserStat.createUrl(chapter.uid_lesson, chapter.uid, worstStat.uid))}
                sx={{
                    py: 1,
                    px: 1.5,
                    border: '0.1px solid var(--card-border)',
                    borderRadius: '10px',
                    cursor: 'pointer'
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
                onClick={() => router.push(ClassUserStat.createUrl(chapter.uid_lesson, chapter.uid, bestStat.uid))}
                sx={{
                    py: 1,
                    px: 1.5,
                    border: '0.1px solid var(--card-border)',
                    borderRadius: '10px',
                    cursor: 'pointer'
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
function StatCard({ title, tone, statUidIntern = 0, stat = null, uidLesson = "", uidChapter = "" }) {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const router = useRouter();
    const { getOneLesson } = useLesson();
    const { getOneChapter, chapters } = useChapter();
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
    var icon = <IconProgressUp />;
    var background = "";
    var border = "0.1px solid var(--card-border)";
    var borderIcon = "0.1px solid transparent";
    var fontColor = "var(--font-color)";
    var borderChip = "1px solid var(--card-border)";
    var backgroundChip = "transparent";
    var colorChip = "var(--font-color)";
    var fontWeight = 500;
    if (stat.status === ClassUserStat.STATUS.MAX) {
        icon = <EmojiEventsIcon />;
        background = color?.background;
        border = `0.1px solid ${color?.border}`;
        borderIcon = `0.1px solid ${color?.border}`;
        fontColor = color?.color;
        borderChip = `1px solid ${color?.border}`;
        backgroundChip = color?.background_bubble;
        colorChip = color?.color;
        fontWeight = 950;
    } else if (stat.status === ClassUserStat.STATUS.EXCELLENT || stat.status === ClassUserStat.STATUS.GOOD) {
        icon = <IconStar />;
    } else {
        icon = <IconProgressUp />;
    }
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
                border: border,
                bgcolor: background,
                maxWidth: '350px',
                cursor: 'pointer'
            }}
            onClick={() => router.push(`${PAGE_STATS}/${stat.uid_lesson}/${stat.uid_chapter}/${stat.uid}`)}
        >
            <Stack spacing={1} sx={{ width: '100%' }}>
                <Typography>{t('quiz')} n°{statUidIntern}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: color?.color }}>
                        <AvatarIcon
                            sx={{
                                bgcolor: color?.background_icon,
                                color: color?.color_icon,
                                border: borderIcon
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

                <Typography variant="body2" color={fontColor}>
                    <b>{lesson?.translate?.title}</b>
                </Typography>
                <Typography variant="caption" color={fontColor}>
                    {chapter?.translate?.title}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip size="small"
                        label={`${stat?.score}/${stat?.answers?.length}`} sx={{
                            fontWeight: fontWeight,
                            bgcolor: backgroundChip,
                            color: colorChip,
                            border: borderChip,
                        }} />
                    <Chip size="small"
                        label={formatChrono(stat?.duration)} sx={{
                            fontWeight: fontWeight,
                            bgcolor: backgroundChip,
                            color: colorChip,
                            border: borderChip,
                        }} />
                    <Chip size="small"
                        label={getFormattedDateNumeric(stat?.end_date)} sx={{
                            fontWeight: fontWeight,
                            bgcolor: backgroundChip,
                            color: colorChip,
                            border: borderChip,
                        }} />
                </Stack>

                <LinearProgress
                    variant="determinate"
                    value={clamp((stat?.score / stat?.answers?.length) * 100)}
                    sx={{
                        height: 10,
                        borderRadius: 999,
                        bgcolor: color?.background_bubble,
                        border: `0.1px solid ${color?.background_bubble}`,
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
function clamp(v) {
    const n = Number(v || 0);
    return Math.max(0, Math.min(100, n));
}
