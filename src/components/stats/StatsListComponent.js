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
import { IconDropDown } from "@/assets/icons/IconsComponent";


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
export default function StatsListComponent() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const STATUS = Object.values(ClassUserStat.STATUS) || [];
    const { lessons, lesson, setUidLesson } = useLesson();
    const { stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
    //const { getGlobalCountQuiz, getGlobalPercent, getBestStat, getWorstStat } = useStat();
    //const countQuiz = getGlobalCountQuiz(chapter.uid_lesson, chapter.uid);
    //const percent = getGlobalPercent(chapter.uid_lesson, chapter.uid);

    //const [uidLesson, setUidLesson] = useState('');
    // ---- MOCK DATA (remplace par Firestore) ----
    const data = useMemo(
        () => ({
            student: { uid: "u_01", name: "Daniel" },
            courses: [
                {
                    uid: "lesson_excel_101",
                    title: "Excel Débutant",
                    code: "EXCEL-101",
                    chapters: [
                        {
                            uid: "ch_01",
                            title: "Interface & cellules",
                            attempts: [
                                { date: "2025-12-01", score: 7, total: 10, duration_sec: 420 },
                                { date: "2025-12-20", score: 9, total: 10, duration_sec: 380 },
                            ],
                        },
                        {
                            uid: "ch_02",
                            title: "Formules (SOMME, MOYENNE)",
                            attempts: [{ date: "2025-12-05", score: 6, total: 10, duration_sec: 540 }],
                        },
                        {
                            uid: "ch_03",
                            title: "Mise en forme",
                            attempts: [{ date: "2025-12-08", score: 8, total: 10, duration_sec: 460 }],
                        },
                    ],
                },
                {
                    uid: "lesson_word_101",
                    title: "Word Débutant",
                    code: "WORD-101",
                    chapters: [
                        {
                            uid: "ch_01",
                            title: "Mise en page & styles",
                            attempts: [
                                { date: "2025-11-20", score: 5, total: 10, duration_sec: 610 },
                                { date: "2025-12-15", score: 7, total: 10, duration_sec: 520 },
                            ],
                        },
                        {
                            uid: "ch_02",
                            title: "Table des matières",
                            attempts: [{ date: "2025-12-18", score: 9, total: 10, duration_sec: 410 }],
                        },
                    ],
                },
                {
                    uid: "lesson_pp_101",
                    title: "PowerPoint Débutant",
                    code: "PPT-101",
                    chapters: [
                        {
                            uid: "ch_01",
                            title: "Slides & design",
                            attempts: [{ date: "2025-12-10", score: 8, total: 10, duration_sec: 470 }],
                        },
                    ],
                },
            ],
        }),
        []
    );

    const [courseFilter, setCourseFilter] = useState("ALL"); // ALL ou uid du cours

    const allChaptersAttempts = useMemo(() => {
        const out = [];
        for (const c of data.courses) {
            for (const ch of c.chapters) {
                for (const a of ch.attempts) {
                    out.push({
                        course_uid: c.uid,
                        course_title: c.title,
                        course_code: c.code,
                        chapter_uid: ch.uid,
                        chapter_title: ch.title,
                        ...a,
                    });
                }
            }
        }
        return out;
    }, [data]);

    const filteredCourses = useMemo(() => {
        if (courseFilter === "ALL") return data.courses;
        return data.courses.filter((c) => c.uid === courseFilter);
    }, [data.courses, courseFilter]);

    const filteredAttempts = useMemo(() => {
        if (courseFilter === "ALL") return allChaptersAttempts;
        return allChaptersAttempts.filter((a) => a.course_uid === courseFilter);
    }, [allChaptersAttempts, courseFilter]);

    const globalStats = useMemo(() => {
        if (!allChaptersAttempts.length) return emptyStats();

        const totalQuestions = allChaptersAttempts.reduce((s, a) => s + (a.total || 0), 0);
        const totalCorrect = allChaptersAttempts.reduce((s, a) => s + (a.score || 0), 0);
        const totalDuration = allChaptersAttempts.reduce((s, a) => s + (a.duration_sec || 0), 0);

        const avgPercent = totalQuestions ? (totalCorrect / totalQuestions) * 100 : 0;
        const avgScore10 = Math.round((avgPercent / 10) * 10) / 10; // note /10 approx

        const attemptsCount = allChaptersAttempts.length;
        const chaptersCount = uniqueCount(allChaptersAttempts.map((a) => `${a.course_uid}_${a.chapter_uid}`));
        const coursesCount = uniqueCount(allChaptersAttempts.map((a) => a.course_uid));

        // Best/Worst attempt
        const best = [...allChaptersAttempts].sort((x, y) => percent(y) - percent(x))[0];
        const worst = [...allChaptersAttempts].sort((x, y) => percent(x) - percent(y))[0];

        return {
            coursesCount,
            chaptersCount,
            attemptsCount,
            totalDuration,
            avgPercent,
            avgScore10,
            best,
            worst,
        };
    }, [allChaptersAttempts]);

    const filteredStats = useMemo(() => {
        if (!filteredAttempts.length) return emptyStats();

        const totalQuestions = filteredAttempts.reduce((s, a) => s + (a.total || 0), 0);
        const totalCorrect = filteredAttempts.reduce((s, a) => s + (a.score || 0), 0);
        const totalDuration = filteredAttempts.reduce((s, a) => s + (a.duration_sec || 0), 0);

        const avgPercent = totalQuestions ? (totalCorrect / totalQuestions) * 100 : 0;
        const avgScore10 = Math.round((avgPercent / 10) * 10) / 10;

        const attemptsCount = filteredAttempts.length;
        const chaptersCount = uniqueCount(filteredAttempts.map((a) => `${a.course_uid}_${a.chapter_uid}`));
        const coursesCount = uniqueCount(filteredAttempts.map((a) => a.course_uid));

        const best = [...filteredAttempts].sort((x, y) => percent(y) - percent(x))[0];
        const worst = [...filteredAttempts].sort((x, y) => percent(x) - percent(y))[0];

        return {
            coursesCount,
            chaptersCount,
            attemptsCount,
            totalDuration,
            avgPercent,
            avgScore10,
            best,
            worst,
        };
    }, [filteredAttempts]);

    return (
        <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'start', sm: 'end' }}>
                <SelectComponentDark
                    label={t('uid_lesson')}
                    name={'uid_lesson'}
                    value={lesson?.uid || ''}
                    values={[{ id: '', value: t('all') }, ...lessons.map(lesson => ({ id: lesson.uid, value: cutString(lesson.translate?.title, 20) }))]}
                    hasNull={false}
                    onChange={(e) => {
                        const { value } = e.target;
                        setUidLesson(value);
                    }}
                />
                <ButtonConfirm
                    label={t('btn-reset')}
                    disabled={!lesson?.uid}
                    onClick={() => setUidLesson('')}
                />
            </Stack>

            <Box sx={{ minHeight: "100vh", width: '100%', bgcolor: "var(--card-color)", borderRadius: '20px', py: 2, px: { xs: 1.5, sm: 2 } }}>

                <Stack maxWidth={'xl'} spacing={2}>
                    {/* Top KPI cards */}
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <KpiCard
                                icon={<InsightsIcon />}
                                title={t('global-rating')}
                                value={`${(getGlobalPercent().toFixed(2))}%`}
                                subtitle={`≈ ${getGlobalScore()}/${getGlobalCountQuestions()} • ${stats.length} ${t('quizs')}`}
                                progress={getGlobalPercent()}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <KpiCard
                                icon={<SchoolIcon />}
                                title={t('global-cover')}
                                value={`${getGlobalCountChapters()} ${t('chapters')}`}
                                subtitle={`${getGlobalCountLesson()} ${t('uid_lesson')} • ${stats.length} ${t('attempts')}`}
                                progress={Math.min(100, (filteredStats.chaptersCount / Math.max(1, globalStats.chaptersCount)) * 100)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <KpiCard
                                icon={<TrendingUpIcon />}
                                title={t('global-duration')}
                                value={formatChrono(getGlobalDuration())}
                                subtitle={t('duration')}
                                progress={Math.min(1000, (getGlobalDuration() / Math.max(1, (countHourTotalLessons * 60 * 60))) * 100)}
                                total={formatDuration(countHourTotalLessons)}
                            />
                        </Grid>
                    </Grid>
                    <ChaptersList />

                    {
                        <Grid container spacing={2}>
                            {
                                lessons.map((lesson, i) => {
                                    return (<Grid size={{ xs: 12, sm: 12 }} key={lesson?.uid}>
                                        <CourseResultsBlock

                                            lesson={lesson}
                                            course={lesson}
                                            onOpenCourse={() => console.log("open course page", course.uid)}
                                            onOpenChapter={(ch) => console.log("open chapter page", ch.uid)}
                                        />
                                    </Grid>)
                                })
                            }
                        </Grid>

                    }
                </Stack>
            </Box>
        </Stack>
    );
}

/* -------------------- Components -------------------- */

function KpiCard({ icon, title, value, subtitle, progress = 0, total = null }) {
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 5,
                p: 2.2,
                py: 2,
                px: 1.5,
                border: "0.1px solid var(--card-border)",
            }}
        >
            <Stack spacing={1.1}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                    <AvatarIcon>{icon}</AvatarIcon>
                    <Stack spacing={0.1} sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 950, lineHeight: 1.05 }}>
                            {value}
                        </Typography>
                    </Stack>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>

                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <LinearProgress
                        variant="determinate"
                        value={clamp(progress)}
                        sx={{
                            height: 10,
                            width: '100%',
                            borderRadius: 999,
                            bgcolor: "rgba(37,99,235,0.10)",
                            "& .MuiLinearProgress-bar": {
                                borderRadius: 999,
                                bgcolor: "#2563EB",
                            },
                        }}
                    />
                    {
                        total && <Typography variant="caption" sx={{ fontSize: '12px' }}>{total}</Typography>
                    }
                </Stack>
            </Stack>
        </Paper>
    );
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

function CourseResultsBlock({ lesson = null, course, onOpenCourse, onOpenChapter }) {
    const router = useRouter();
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION])
    const { chapters } = useChapter();
    const { getGlobalScore, getGlobalDuration, getGlobalCountQuiz, getGlobalPercent, stats } = useStat();
    const courseStats = []; /*useMemo(() => {
        const allAttempts = [];
        for (const ch of course?.chapters) {
            for (const a of ch.attempts) {
                allAttempts.push({
                    chapter_uid: ch.uid,
                    chapter_title: ch.title,
                    ...a,
                });
            }
        }
        if (!allAttempts.length) return { avg: 0, attemptsCount: 0, totalDuration: 0 };

        const totalQ = allAttempts.reduce((s, a) => s + (a.total || 0), 0);
        const totalS = allAttempts.reduce((s, a) => s + (a.score || 0), 0);
        const totalD = allAttempts.reduce((s, a) => s + (a.duration_sec || 0), 0);
        const avg = totalQ ? (totalS / totalQ) * 100 : 0;

        return { avg, attemptsCount: allAttempts.length, totalDuration: totalD };
    }, [course]);
    */

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 5,
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
                                {lesson?.translate?.title || course?.title}
                            </Typography>
                            <Chip size="small" label={t(lesson?.category) || course?.code} sx={softChip()} />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            {getGlobalCountQuiz(lesson?.uid)} {t('quizs')} • {formatChrono(getGlobalDuration(lesson?.uid))} • {t('average')} {`${getGlobalPercent(lesson?.uid).toFixed(2)}%`}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Link href={`${PAGE_LESSONS}/${lesson?.uid}`} target={"_blank"}>
                            <ButtonCancel
                                label={t('btn-see-lesson')}
                            />
                        </Link>
                    </Stack>
                </Stack>

                <LinearProgress
                    variant="determinate"
                    value={clamp(getGlobalPercent(lesson?.uid))}
                    sx={{
                        height: 10,
                        borderRadius: 999,
                        bgcolor: "var(--primary-shadow-xs)",
                        border: "0.1px solid var(--primary)",
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            bgcolor: "var(--primary)",
                        },
                    }}
                />

                <Divider sx={{ border: `0.1px solid var(--card-border)` }} />

                <Grid container spacing={1}>
                    {chapters?.filter(c => c.uid_lesson === lesson?.uid).map((ch) => (
                        <Grid key={ch.uid} size={{ xs: 12, sm: 4 }}>
                            <Link href={`${PAGE_STATS}/${stats?.[0]?.uid}`}>
                                <ChapterResultCard chapter={ch} />
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Paper>
    );
}

function ChapterResultCard({ chapter, onOpen }) {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION])
    const { getGlobalCountQuiz, getGlobalPercent, getBestStat, getWorstStat } = useStat();
    const countQuiz = getGlobalCountQuiz(chapter.uid_lesson, chapter.uid);
    const percent = getGlobalPercent(chapter.uid_lesson, chapter.uid);
    const bestStat = getBestStat(chapter.uid_lesson, chapter.uid);
    const worstStat = getWorstStat(chapter.uid_lesson, chapter.uid);
    const hasMaxStats = bestStat && bestStat.score === bestStat.answers?.length || false;
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const colorBest = STATUS_CONFIG[bestStat?.status];
    const colorWorst = STATUS_CONFIG[worstStat?.status];
    const colorPercent = ClassUserStat.getPercentageColor(percent / 100);
    const lastAttempt = chapter.attempts?.[chapter.attempts.length - 1] || null;

    return (
        <Paper
            elevation={0}
            onClick={onOpen}
            sx={{
                borderRadius: 4,
                p: 1.7,
                border: `0.1px solid var(--card-border)`,
                cursor: "pointer",
                "&:hover": {
                    borderColor: colorBest?.border,
                    boxShadow: `0 0px 5px ${colorBest?.background}`,
                    transform: "translateY(-1px)",
                },
                transition: "all .18s ease",
            }}
        >
            <Stack spacing={1.1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.15 }} title={chapter.title}>
                        {chapter?.translate?.title || chapter?.title}
                    </Typography>
                    <Chip size="small" label={`${countQuiz} ${t('quizs')}`} sx={softChip()} />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={'center'} spacing={0} flexWrap="wrap">
                    <Chip size="small"
                        label={`${t('average').substring(0, 3)}. ${percent.toFixed(2)}%`}
                        sx={chapterChip({
                            background: colorPercent.background,
                            borderColor: colorPercent.background_bar,
                            color: colorPercent.background_bar
                        })} />
                    <Stack direction={'row'} alignItems={'center'}>
                        {bestStat && <Chip size="small"
                            label={`${t('best')} ${bestStat.score}/${bestStat.answers.length}`}
                            sx={chapterChip({
                                background: "var(--card-color)", borderColor: "transparent",
                                color: colorBest.background_bar
                            })} />}
                        {countQuiz > 1 && worstStat && <Chip size="small"
                            label={`${t('worst')} ${worstStat.score}/${worstStat.answers.length}`}
                            sx={chapterChip({
                                background: "var(--card-color)", borderColor: "transparent",
                                color: colorWorst.background_bar
                            })} />}
                    </Stack>
                </Stack>

                <Stack spacing={3} alignItems={'center'}>
                    <Stack direction={'row'} alignItems={'center'} sx={{ color: 'var(--primary)' }}>
                        <Typography variant="caption" sx={{color:'inherit'}}>{'Voir moins'}</Typography>
                        <IconDropDown height={10} />
                    </Stack>
                    <Grid container sx={{ background: '' }} alignItems={'center'} justifyContent={'center'} spacing={2}>
                        <Grid size={12} sx={{ background: '' }} alignItems={'center'}>
                            <Stack justifyContent={'center'} alignItems={'center'} spacing={1}>
                                {
                                    /*
                                            background: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
            background_icon: good ? "rgba(34,197,94,0.14)" : "rgba(245,158,11,0.18)",
            glow: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
            color: good ? "#15803D" : "#B45309",
            border: "rgba(15, 23, 42, 0.10)",
            border_icon: "rgba(15, 23, 42, 0.10)",
            color_icon: good ? "#15803D" : "#B45309",
            background_bar: good ? "#15803D" : "#B45309",
                                    */
                                }
                                <Typography>{t('best')}</Typography>
                                <EmojiEventsIcon sx={{ color: hasMaxStats ? colorBest?.color_icon : 'red', fontSize: '30px' }} />

                                <CircularProgressStatComponent progress={42} stat={bestStat} />
                                <Typography sx={{ color: colorBest?.color }}>{t(bestStat?.status)?.toUpperCase()}</Typography>
                                <Chip size="small" label={getFormattedDateNumeric(bestStat?.end_date)} sx={{
                                    fontWeight: 950,
                                    bgcolor: colorBest?.background_bubble,
                                    color: colorBest?.color,
                                    border: `1px solid ${colorBest?.border}`,
                                }} />
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 'auto' }} sx={{ background: '' }} alignItems={'center'}>
                            <Stack justifyContent={'center'} alignItems={'center'} spacing={1}>
                                {
                                    /*
                                            background: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
            background_icon: good ? "rgba(34,197,94,0.14)" : "rgba(245,158,11,0.18)",
            glow: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
            color: good ? "#15803D" : "#B45309",
            border: "rgba(15, 23, 42, 0.10)",
            border_icon: "rgba(15, 23, 42, 0.10)",
            color_icon: good ? "#15803D" : "#B45309",
            background_bar: good ? "#15803D" : "#B45309",
                                    */
                                }
                                <Typography>{t('best')}</Typography>
                                <EmojiEventsIcon sx={{ color: hasMaxStats ? colorBest?.color_icon : 'red', fontSize: '30px' }} />

                                <CircularProgressStatComponent progress={42} stat={bestStat} />
                                <Typography sx={{ color: colorBest?.color }}>{t(bestStat?.status)?.toUpperCase()}</Typography>
                                <Chip size="small" label={getFormattedDateNumeric(bestStat?.end_date)} sx={{
                                    fontWeight: 950,
                                    bgcolor: colorBest?.background_bubble,
                                    color: colorBest?.color,
                                    border: `1px solid ${colorBest?.border}`,
                                }} />
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 'auto' }} sx={{ background: '' }} alignItems={'center'}>
                            <Stack justifyContent={'center'} alignItems={'center'} spacing={1}>
                                {
                                    /*
                                            background: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
            background_icon: good ? "rgba(34,197,94,0.14)" : "rgba(245,158,11,0.18)",
            glow: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
            color: good ? "#15803D" : "#B45309",
            border: "rgba(15, 23, 42, 0.10)",
            border_icon: "rgba(15, 23, 42, 0.10)",
            color_icon: good ? "#15803D" : "#B45309",
            background_bar: good ? "#15803D" : "#B45309",
                                    */
                                }
                                <Typography>{t('best')}</Typography>
                                <EmojiEventsIcon sx={{ color: hasMaxStats ? colorBest?.color_icon : 'red', fontSize: '30px' }} />

                                <CircularProgressStatComponent progress={42} stat={bestStat} />
                                <Typography sx={{ color: colorBest?.color }}>{t(bestStat?.status)?.toUpperCase()}</Typography>
                                <Chip size="small" label={getFormattedDateNumeric(bestStat?.end_date)} sx={{
                                    fontWeight: 950,
                                    bgcolor: colorBest?.background_bubble,
                                    color: colorBest?.color,
                                    border: `1px solid ${colorBest?.border}`,
                                }} />
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>

                <LinearProgress
                    variant="determinate"
                    value={clamp(48)}
                    sx={{
                        height: 10,
                        borderRadius: 999,
                        bgcolor: colorBest?.background_bubble,
                        border: `0.1px solid ${colorBest?.border}`,
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            bgcolor: colorBest?.background_bar,
                        },
                    }}
                />

                <Typography variant="caption" color="text.secondary">
                    {t('btn-see-details')}
                </Typography>
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
        fontWeight: 800,
    };
}
function softChip() {
    return {
        bgcolor: "var(--primary-shadow-xs)",
        color: "var(--blue-dark)",
        //border: "1px solid rgba(37,99,235,0.18)",
        fontWeight: 800,
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