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
export default function StatsListComponent({isOpenDetails=false, setIsOpenDetails=null, viewMode = ClassUserStat.VIEW_MODE_SCORE }) {
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
                            isOpenDetails={isOpenDetails} setIsOpenDetails={setIsOpenDetails}
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

function CourseResultsBlock({ lesson = null,isOpenDetails=false, setIsOpenDetails=null, course, selectedUid, setSelectedUid, isViewScore = true }) {
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

        console.log("Beeeest", bestStat)

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
                        <Link href={`${PAGE_STATS}/${lesson?.uid}`} target={"_blank"}>
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
                        !isOpenDetails && <Typography onClick={() => { setSelectedUid(lesson.uid);setIsOpenDetails(true); }} variant="caption" color="var(--primary)" sx={{ cursor: 'pointer' }}>{t('btn-see-details')}</Typography>
                    }
                    {
                        isOpenDetails && <Stack onClick={() => { setSelectedUid('');setIsOpenDetails(false); }} direction={'row'} alignItems={'center'} sx={{ color: 'var(--primary)', cursor: 'pointer' }}>
                            <Typography variant="caption" sx={{ color: 'inherit' }}>{t('btn-close-details')}</Typography>
                            <IconDropUp height={10} />
                        </Stack>
                    }
                    {
                        isOpenDetails && <Stack spacing={1} sx={{ py: 1 }}>
                            {
                                chaptersFiltered.map((chapter, i) => {
                                    const countQuiz = getGlobalCountQuiz(lesson?.uid, chapter.uid);
                                    const hasStats = countQuiz > 0;
                                    const bestStat = getBestStat(lesson?.uid, chapter.uid);
                                    const hasMaxStats = bestStat?.score === bestStat?.answers?.length;
                                    const worstStat = getWorstStat(lesson?.uid, chapter.uid);
                                    const bestValue = `${bestStat?.score}/${bestStat?.answers?.length}`;
                                    const bestPercent = bestStat?.score / bestStat?.answers?.length * 100;
                                    const worstValue = `${worstStat?.score}/${worstStat?.answers?.length}`;
                                    const worstPercent = worstStat?.score / worstStat?.answers?.length * 100;
                                    const averageScore = getGlobalScore(lesson?.uid, chapter.uid);
                                    const averageQuestions = getGlobalCountQuestions(lesson?.uid, chapter.uid);
                                    const averagePercent = averageScore / averageQuestions * 100;
                                    const averageValue = `${averageScore % countQuiz === 0 ? averageScore / countQuiz : `~${(averageScore / countQuiz).toFixed(2)}`}/${parseInt(averageQuestions / countQuiz)}`;
                                    const averageStatus = ClassUserStat.getStatusFromPercentage(averagePercent / 100);
                                    if (isViewScore) {
                                        const chapterStats = [...statsFiltered].filter(s => s.uid_chapter === chapter.uid);
                                        const hasStats = chapterStats.length > 0;
                                        return (<Stack key={`score-${chapter.uid}`} spacing={0.5} sx={{ border: `0.1px solid var(--card-border)`, px: 1.5, py: 1, borderRadius: '5px' }}>
                                            <Typography>{`${chapter.uid_intern}. ${chapter.translate?.title} ${hasStats ? `→ ${countQuiz} ${t('quizs')}` : ''}`}</Typography>
                                            {
                                                !hasStats && <Typography variant="caption">{t('no-result')}</Typography>
                                            }
                                            {
                                                hasStats && <Grid container spacing={1}>
                                                {
                                                    chapterStats.map((stat, i) => {
                                                        const hasMaxStats = stat?.score === stat?.answers?.length;
                                                        const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
                                                        const colorBest = STATUS_CONFIG[stat?.status];
                                                        return (<Grid key={`${stat.uid}`} size={'auto'}>
                                                            <Stack justifyContent={'center'} alignItems={'center'} spacing={1}
                                                                sx={{
                                                                    py: 1,
                                                                    px: 1.5,
                                                                    border: '0.1px solid var(--card-border)',
                                                                    borderRadius: '10px',
                                                                }}>
                                                                {
                                                                    bestStat && hasMaxStats ?
                                                                        <EmojiEventsIcon sx={{ color: colorBest?.color_icon, fontSize: '30px' }} /> :
                                                                        <IconCharts height={30} width={30} color={colorBest?.color_icon} />

                                                                }

                                                                <CircularProgressStatComponent
                                                                    score={stat?.score}
                                                                    questions={stat?.answers?.length}
                                                                    percent={stat?.score / stat?.answers?.length * 100}
                                                                    showPercent={false}
                                                                    duration={stat?.duration}
                                                                    //progress={42} 
                                                                    //stat={stat}
                                                                    size="small"
                                                                    status={stat?.status}
                                                                />
                                                                <Chip size="small" label={getFormattedDateNumeric(bestStat?.end_date)} sx={{
                                                                    fontWeight: 950,
                                                                    bgcolor: colorBest?.background_bubble,
                                                                    color: colorBest?.color,
                                                                    border: `1px solid ${colorBest?.border}`,
                                                                }} />
                                                            </Stack>
                                                        </Grid>);
                                                    })
                                                }
                                            </Grid>
                                            }
                                        </Stack>)
                                    }


                                    return (<Stack key={`${chapter.uid}`} spacing={0.5} sx={{ border: `0.1px solid var(--card-border)`, px: 1.5, py: 1, borderRadius: '5px' }}>
                                        <Typography>{`${chapter.uid_intern}. ${chapter.translate?.title} ${hasStats ? `→ ${countQuiz} ${t('quizs')}` : ''}`}</Typography>
                                        <Stack sx={{ px: 1 }} spacing={0.5}>
                                            {
                                                !hasStats && <Typography variant="caption">{t('no-result')}</Typography>
                                            }
                                            {
                                                hasStats && <>
                                                    <LinearProgressChapter label={`${t('worst')} (${t(worstStat?.status)})`} percent={worstPercent} value={worstValue} status={worstStat?.status} />
                                                    <LinearProgressChapter label={`${t('average')} (${t(averageStatus)})`} percent={averagePercent} value={averageValue} status={averageStatus} />
                                                    <LinearProgressChapter label={`${t('best')} (${t(bestStat?.status)})`} percent={bestPercent} value={bestValue} status={bestStat?.status} />
                                                </>
                                            }
                                        </Stack>
                                    </Stack>)
                                })
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