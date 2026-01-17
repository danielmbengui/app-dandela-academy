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
import SelectComponentDark from "../elements/SelectComponentDark";
import { useLesson } from "@/contexts/LessonProvider";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useTranslation } from "react-i18next";
import { cutString, formatChrono, formatDuration, getFormattedDateNumeric } from "@/contexts/functions";
import { ChapterProvider, useChapter } from "@/contexts/ChapterProvider";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import Link from "next/link";
import { PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import { useRouter } from "next/navigation";
import CircularProgressStatComponent from "../elements/CircularProgressStatComponent";
import { IconCharts, IconDropDown, IconDropUp } from "@/assets/icons/IconsComponent";
import LinearProgressStat from "../elements/LinearProgressStat";
import LinearProgressCountScore from "../elements/LinearProgressCountScore";
import CircularProgressChapter from "./CircularProgressChapter";


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
export default function StatsListComponent({ isOpenDetails = false, setIsOpenDetails = null, viewMode = ClassUserStat.VIEW_MODE_SCORE }) {
    const isViewScore = viewMode === ClassUserStat.VIEW_MODE_SCORE;
    const { lessons } = useLesson();
    const [selectedUid, setSelectedUid] = useState('');

    return (<Box sx={{ width: '100%', bgcolor: "", }}>
        <Grid container spacing={2}>
            {
                lessons.map((lesson, i) => {
                    return (<Grid size={{ xs: 12, sm: 12 }} key={lesson?.uid}>
                        <CourseResultsBlock
                            lesson={lesson}
                            course={lesson}
                            selectedUid={selectedUid}
                            setSelectedUid={setSelectedUid}
                            isOpenDetails={isOpenDetails}
                            setIsOpenDetails={setIsOpenDetails}
                            isViewScore={isViewScore}
                        />
                    </Grid>)
                })
            }
        </Grid>
    </Box>);
}

/* -------------------- Components -------------------- */
function LinearProgressChapter({ label = "", percent = 0, value = 0, status }) {
    const good = true;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
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
    return (<Stack direction={'row'} alignItems={'center'} spacing={1}>
        <Typography noWrap variant="body2" color="var(--grey-light)">{label}</Typography>
        <LinearProgress
            variant="determinate"
            value={percent}
            sx={{
                height: 10,
                borderRadius: 999,
                width: '100%',
                bgcolor: color?.background_bubble,
                border: `0.1px solid transparent`,
                "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    bgcolor: color?.background_bar,
                },
            }}
        />
        <Typography variant="caption">{value}</Typography>
    </Stack>)
}

function ViewScoreComponent({ lesson = null }) {
    //if (!lesson) return;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const router = useRouter();
    const { getGlobalCountQuiz, stats, getGlobalScore, getGlobalCountQuestions, getGlobalDuration, getBestStat, getWorstStat } = useStat();
    const { chapters } = useChapter();
    const { statsFiltered, chaptersFiltered } = useMemo(() => {
        const chaptersFiltered = chapters.filter(c => c.uid_lesson === lesson?.uid);
        const statsFiltered = stats.filter(s => s.uid_lesson === lesson?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
        return {
            statsFiltered,
            chaptersFiltered,
        };
    }, [lesson, stats, chapters]);
    return (<Grid container spacing={1}>
        {
            chaptersFiltered.map((chapter, i) => {
                const _stats = [...statsFiltered].filter(s => s.uid_chapter === chapter.uid);
                const hasStats = _stats.length > 0;

                const score = getGlobalScore(chapter.uid_lesson, chapter.uid, _stats);
                const countQuestions = getGlobalCountQuestions(chapter.uid_lesson, chapter.uid, _stats);
                const duration = getGlobalDuration(chapter.uid_lesson, chapter.uid, _stats);

                const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
                const colorStat = ClassUserStat.getPercentageColor(score / countQuestions);
                const status = ClassUserStat.getStatusFromPercentage(score / countQuestions);
                return (<Grid key={`${chapter.uid}`} size={'auto'}>
                    <Stack justifyContent={'center'} alignItems={'center'} spacing={0.5}
                        onClick={() => {
                            if (hasStats) {
                                router.push(`${PAGE_STATS}/${chapter.uid_lesson}/${chapter.uid}`);
                            }
                        }}
                        sx={{
                            py: 1,
                            px: 1.5,
                            border: '0.1px solid var(--card-border)',
                            borderRadius: '10px',
                            cursor: hasStats ? 'pointer' : 'default'
                        }}>
                        <Typography>{chapter.uid_intern}. {chapter.translate.title} {status}</Typography>
                        {
                            !hasStats && <Typography variant="caption">{t('no-result')}</Typography>
                        }
                        {
                            hasStats && <>
                                {
                                    status === ClassUserStat.STATUS.MAX ?
                                        <EmojiEventsIcon sx={{ color: colorStat?.color_icon, fontSize: '30px' }} /> :
                                        <IconCharts height={30} width={30} color={colorStat?.color_icon} />

                                }
                                <Stack spacing={1}>
                                    <CircularProgressStatComponent
                                        score={score}
                                        questions={countQuestions}
                                        percent={score / countQuestions * 100}
                                        showPercent={false}
                                        duration={duration}
                                        //progress={42} 
                                        //stat={stat}
                                        size="large"
                                        status={status}
                                    />
                                    <Chip size="small" label={t(status)} sx={{
                                        fontWeight: 950,
                                        bgcolor: colorStat?.background_bubble,
                                        color: colorStat?.color,
                                        border: `1px solid ${colorStat?.border}`,
                                    }} />
                                </Stack>
                            </>
                        }
                    </Stack>
                </Grid>)
            })
        }
    </Grid>)
}
function ViewAverageComponent({ lesson = null }) {
    //if (!lesson) return;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const { getGlobalCountQuiz, stats, getGlobalDuration, getGlobalPercent, getGlobalScore, getGlobalCountQuestions, getBestStat, getWorstStat } = useStat();
    const { chapters } = useChapter();
    const { statsFiltered, chaptersFiltered, statusTab } = useMemo(() => {
        const chaptersFiltered = chapters.filter(c => c.uid_lesson === lesson?.uid);
        const statsFiltered = stats.filter(s => s.uid_lesson === lesson?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
        const statusTab = [...ClassUserStat.ALL_STATUS].reverse();
        return {
            statsFiltered,
            chaptersFiltered,
            statusTab,
        };
    }, [lesson, stats, chapters]);
    const colorAverage = STATUS_CONFIG['average'];
    const countQuiz = getGlobalCountQuiz(lesson.uid, "");
    const lessonStats = [...statsFiltered].filter(s => s.uid_lesson === lesson.uid);
    const hasStats = lessonStats.length > 0;
    const countScore = getGlobalScore(lesson.uid, "", lessonStats);
    const countQuestions = getGlobalCountQuestions(lesson.uid, "", lessonStats);
    const totalDuration = getGlobalDuration(lesson.uid, "", lessonStats);
    const percent = getGlobalPercent(lesson.uid,"", lessonStats);

    return (<>
{
            !hasStats && <Typography variant="caption">{t('no-result')}</Typography>
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
                                    const _stats = [...lessonStats].filter(stat => stat.status === status);
                                    const sizeStats = _stats.length;
                                    const percent = sizeStats / countQuiz * 100;
                                    //const percent = getGlobalPercent(lesson.uid, chapter.uid, _stats);
                                    const countScore = getGlobalScore(lesson.uid, "", _stats);
                                    const countQuestions = getGlobalCountQuestions(lesson.uid, "", _stats);
                                    const duration = getGlobalDuration(lesson.uid, "", _stats);
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
                                                score={countScore}
                                                questions={countQuestions}
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
                        <AverageComponent lesson={lesson} />
                    </Stack>
                </Grid>
            </Grid>
        }        
    </>)
}
function AverageComponent({ lesson = null}) {
   // if (!lesson) return;
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const router = useRouter();
    const {getOneChapter} = useChapter();
    const { getOneStatIndex, getGlobalCountQuiz, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
    const { statsFiltered,
        averageQuestions, averagePercent, averageDuration, averageScore,
        bestStat,bestChapter,bestUidIntern,
         worstStat,worstChapter,worstUidIntern,
        colorBest, colorWorst } = useMemo(() => {
            const filtered_stats = [...stats].filter(s => s.uid_lesson === lesson?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
            const averageQuestions = getGlobalCountQuestions(lesson.uid, "", filtered_stats);
            const averagePercent = getGlobalPercent(lesson.uid, "", filtered_stats);
            const averageDuration = getGlobalDuration(lesson.uid, "", filtered_stats);
            const totalScore = getGlobalScore(lesson.uid, "", filtered_stats);
            const totalQuestions = getGlobalCountQuestions(lesson.uid, "", filtered_stats);
            const averageScore = totalScore;
            const bestStat = getBestStat(lesson.uid, "", filtered_stats);
            const bestChapter = getOneChapter(bestStat.uid_chapter);
            const bestUidIntern = getOneStatIndex(bestStat.uid, filtered_stats);
            
            const worstStat = getWorstStat(lesson.uid, "", filtered_stats);
            const worstChapter = getOneChapter(worstStat.uid_chapter);
            const worstUidIntern = getOneStatIndex(worstStat.uid, filtered_stats);
            const colorBest = STATUS_CONFIG[bestStat?.status];
            const colorWorst = STATUS_CONFIG[worstStat?.status];
            return {
                statsFiltered: filtered_stats,
                averageQuestions,
                averagePercent,
                averageDuration,
                averageScore,
                bestStat,
                bestChapter,
                bestUidIntern,
                worstStat,
                worstChapter,
                worstUidIntern,
                colorBest,
                colorWorst
            };
        }, [lesson]);

    return (<Grid container
        alignItems={'center'}
        justifyContent={'start'}
        spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }} alignItems={'center'}>
            <Stack justifyContent={'center'} alignItems={'center'} spacing={1}
            onClick={()=>router.push(ClassUserStat.createUrl(worstStat.uid_lesson,worstStat.uid_chapter,worstStat.uid))}
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
               <Stack alignItems={'center'} spacing={0.5}>
               <Typography sx={{fontWeight:500, color: colorWorst?.color }}>{worstChapter?.uid_intern}. {worstChapter?.translate?.title}</Typography>
               <Typography sx={{fontWeight:300, color: colorWorst?.color }}>{t('quiz')} n°{worstUidIntern}</Typography>
               </Stack>
                
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
             onClick={()=>router.push(ClassUserStat.createUrl(bestStat.uid_lesson,bestStat.uid_chapter,bestStat.uid))}
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
                <Stack alignItems={'center'} spacing={0.5}>
                <Typography sx={{fontWeight:500, color: colorBest?.color }}>{bestChapter?.uid_intern}. {bestChapter?.translate?.title}</Typography>
                <Typography sx={{fontWeight:300, color: colorBest?.color }}>{t('quiz')} n°{bestUidIntern}</Typography>
                </Stack>
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

function CourseResultsBlock({ lesson = null, isOpenDetails = false, setIsOpenDetails = null, course, selectedUid, setSelectedUid, isViewScore = true }) {
    const router = useRouter();
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION])
    // const [selectedUid, setSelectedUid] = useState('');
    const { getGlobalCountQuiz, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
    const { chapters, chapter, setUidChapter } = useChapter();
    const { statsFiltered, chaptersFiltered, bestStat, bestValue, bestPercent, worstValue, worstPercent } = useMemo(() => {
        const filtered_chapters = chapters.filter(c => c.uid_lesson === lesson?.uid);
        const filtered_stats = stats.filter(s => s.uid_lesson === lesson?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
        const bestStat = getBestStat(lesson?.uid, "", filtered_stats);
        const worstStat = getWorstStat(lesson?.uid, "", filtered_stats);
        return {
            statsFiltered: filtered_stats,
            chaptersFiltered: filtered_chapters,
            bestStat: bestStat,
            bestValue: `${bestStat?.score}/${bestStat?.answers?.length}`,
            bestPercent: bestStat?.score / bestStat?.answers?.length * 100,
            worstValue: `${worstStat?.score}/${worstStat?.answers?.length}`,
            worstPercent: worstStat?.score / worstStat?.answers?.length * 100,
        };
    }, [lesson, stats, chapters]);
    const { best, score, countQuestions, percent, duration, durationTotal, countChapters, countChaptersTotal } = useMemo(() => {
        return {
            score: getGlobalScore(),
            countQuestions: getGlobalCountQuestions(),
            percent: getGlobalPercent(),
            duration: getGlobalDuration(),
            durationTotal: getGlobalDuration(),
            countChapters: getGlobalCountChapters(),
            countChaptersTotal: chaptersFiltered.length,
        };
    }, [statsFiltered, chaptersFiltered]);
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const colorBest = STATUS_CONFIG[bestStat?.status];

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2.5,
                border: "0.1px solid var(--card-border)",
                //background: "0.1px solid var(--card-border)",
                overflow: "hidden",
            }}
        >

            <Stack sx={{ py: 2, px: 2 }} spacing={1}>
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={1.2}>
                    <Stack spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                            <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                                {`${lesson?.uid_intern}. `}{lesson?.translate?.title || course?.title}
                            </Typography>
                            <Chip size="small" label={t(lesson?.category) || course?.code} sx={softChip()} />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            {t('chapters')} {`${countChapters}/${countChaptersTotal}`} • {statsFiltered.length} {t('quizs')} • {formatChrono(getGlobalDuration(lesson?.uid))} • {t('average')} {`${getGlobalPercent(lesson?.uid).toFixed(2)}%`}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Link href={`${PAGE_STATS}/${lesson?.uid}`}>
                            <ButtonCancel
                                label={t('btn-see-results')}
                            />
                        </Link>
                    </Stack>
                </Stack>
                <LinearProgress
                    variant="determinate"
                    value={clamp(getGlobalPercent(lesson?.uid))}
                    sx={{
                        height: 10,
                        width: '100%',
                        borderRadius: 999,
                        bgcolor: "var(--primary-shadow-xs)",
                        border: "0.1px solid transparent",
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            bgcolor: "var(--primary)",
                        },
                    }}
                />
                <Stack>
                    {
                        !isOpenDetails && <Typography onClick={() => { setSelectedUid(lesson.uid); setIsOpenDetails(true); }} variant="caption" color="var(--primary)" sx={{ cursor: 'pointer' }}>{t('btn-see-details')}</Typography>
                    }
                    {
                        isOpenDetails && <Stack onClick={() => { setSelectedUid(''); setIsOpenDetails(false); }} direction={'row'} alignItems={'center'} sx={{ color: 'var(--primary)', cursor: 'pointer' }}>
                            <Typography variant="caption" sx={{ color: 'inherit' }}>{t('btn-close-details')}</Typography>
                            <IconDropUp height={10} />
                        </Stack>
                    }

                    {
                        isOpenDetails && <Stack spacing={1} sx={{ py: 1 }}>
                            {
                                isViewScore && <ViewScoreComponent lesson={lesson} />
                            }
                            {
                                !isViewScore && <ViewAverageComponent lesson={lesson} />
                            }
                        </Stack>
                    }
                </Stack>
            </Stack>
        </Paper>
    );
}
/* -------------------- Helpers -------------------- */
function clamp(v) {
    const n = Number(v || 0);
    return Math.max(0, Math.min(100, n));
}
function softChip() {
    return {
        bgcolor: "var(--primary-shadow-xs)",
        color: "var(--primary)",
        border: "0.1px solid var(--primary)",
        fontWeight: 500,
    };
}