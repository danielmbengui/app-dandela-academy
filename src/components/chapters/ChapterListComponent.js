"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography,
    Grid,
    TextField,
    InputAdornment,
    LinearProgress,
    Tabs,
    Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useLesson } from "@/contexts/LessonProvider";
import TextFieldComponent from "../elements/TextFieldComponent";
import { IconSearch } from "@/assets/icons/IconsComponent";
import { ClassLessonChapter } from "@/classes/lessons/ClassLessonChapter";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import { Trans, useTranslation } from "react-i18next";
import { useChapter } from "@/contexts/ChapterProvider";
import { StatProvider, useStat } from "@/contexts/StatProvider";
import Image from "next/image";
import AccordionComponent from "../dashboard/elements/AccordionComponent";
import { formatChrono } from "@/contexts/functions";
import Link from "next/link";
import { PAGE_CHAPTERS, PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import AlertComponent from "../elements/AlertComponent";

const ROYAL = "#2563EB";
const NAVY = "#0B1B4D";

export default function ChapterListComponent() {
    const { lesson } = useLesson();
    const { chapters, estimateChapterTimes, chapter, setUidChapter } = useChapter();
    useEffect(() => {
        if (chapters.length > 0) {
            setUidChapter(chapters[0].uid);
        }
    }, [chapters.length]);
    return (<StatProvider>
        <ChapterComponent />
    </StatProvider>)
}

function ChapterComponent() {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [level, setLevel] = useState("Débutant"); // Débutant | Intermédiaire | Avancé
    const [selectedLevel, setSelectedLevel] = useState(ClassLessonChapter.ALL_LEVELS[0]); // Débutant | Intermédiaire | Avancé
    const { lesson } = useLesson();
    const { stats, getGlobalPercent } = useStat();
    const [percent, setPercent] = useState(0);
    const { chapters, estimateChapterTimes, chapter, setUidChapter } = useChapter();
    useEffect(() => {
        if (chapters.length > 0 && (!chapter || chapter === null)) {
            //setUidChapter(chapters[0].uid);

        }

    }, [chapters.length]);

    useEffect(() => {
        if (chapter && lesson) {
            setPercent(getGlobalPercent(lesson.uid, chapter.uid));
        }
        console.log("STATTS", stats)
    }, [chapter, lesson, stats?.length])
    // console.log("levels", ClassLessonChapter.ALL_LEVELS);
    const filteredChapters = useMemo(() => {
        const q = query.trim().toLowerCase();
        const _chapters = chapters.filter(c => c.level === selectedLevel);
        //if (!q) return currentLevel.chapters;
        return _chapters;
    }, [chapters, selectedLevel]);
    const filteredSubchapters = useMemo(() => {
        const q = query.trim().toLowerCase();
        const _chapters = [...filteredChapters];
        const uids = Array.from(new Set(_chapters.map(c => c.uid)));
        const _subchapters = [];
        for (const c of _chapters) {
            const time = estimateChapterTimes({
                totalMinHours: c.estimated_start_duration,
                totalMaxHours: c.estimated_end_duration,
                chapterCount: c.subchapters?.length,
                level: c.level,
            });
            console.log("YAAAA", time);
            if (uids.includes(c.uid)) {
                _subchapters.push(...c.subchapters);
            }
        }
        //if (!q) return currentLevel.chapters;
        return _subchapters;
    }, [filteredChapters, selectedLevel]);
    // --- MOCK: 5 chapitres par niveau ---
    const course = useMemo(
        () => ({
            uid: "lesson_excel_101",
            code: "EXCEL",
            title: "Excel",
            subtitle: "Apprends Excel étape par étape, avec exercices et quiz.",
            levels: [
                {
                    key: "Débutant",
                    progress: 60, // %
                    chapters: [
                        { uid: "b1", index: 1, title: "Introduction & interface", duration_min: 12, status: "done" },
                        { uid: "b2", index: 2, title: "Cellules, lignes, colonnes", duration_min: 15, status: "done" },
                        { uid: "b3", index: 3, title: "Saisie & formats (nombres, dates)", duration_min: 18, status: "current" },
                        { uid: "b4", index: 4, title: "Formules simples (SOMME, MOYENNE)", duration_min: 20, status: "locked" },
                        { uid: "b5", index: 5, title: "Mise en forme conditionnelle", duration_min: 16, status: "locked" },
                    ],
                },
                {
                    key: "Intermédiaire",
                    progress: 20,
                    chapters: [
                        { uid: "i1", index: 1, title: "Références relatives/absolues", duration_min: 18, status: "done" },
                        { uid: "i2", index: 2, title: "Fonctions SI & logique", duration_min: 22, status: "current" },
                        { uid: "i3", index: 3, title: "Tri, filtres, tableaux", duration_min: 24, status: "locked" },
                        { uid: "i4", index: 4, title: "RechercheV / XLOOKUP", duration_min: 26, status: "locked" },
                        { uid: "i5", index: 5, title: "Graphiques & mise en page", duration_min: 20, status: "locked" },
                    ],
                },
                {
                    key: "Avancé",
                    progress: 0,
                    chapters: [
                        { uid: "a1", index: 1, title: "Tableaux croisés dynamiques", duration_min: 28, status: "locked" },
                        { uid: "a2", index: 2, title: "Power Query (nettoyage)", duration_min: 30, status: "locked" },
                        { uid: "a3", index: 3, title: "Modèle de données (Power Pivot)", duration_min: 30, status: "locked" },
                        { uid: "a4", index: 4, title: "Dashboards & KPIs", duration_min: 35, status: "locked" },
                        { uid: "a5", index: 5, title: "Mini-projet final", duration_min: 40, status: "locked" },
                    ],
                },
            ],
        }),
        []
    );
    const currentLevel = useMemo(
        () => course.levels.find((l) => l.key === level) || course.levels[0],
        [course.levels, level]
    );
    const chaptersFiltered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return currentLevel.chapters;
        return currentLevel.chapters.filter((c) => c.title.toLowerCase().includes(q));
    }, [currentLevel.chapters, query]);
    const handleOpenChapter = (chapter) => {
        if (chapter.status === "locked") return;
        // adapte vers ta page chapitre existante :
        router.push(`/dashboard/lessons/${course.uid}/chapters/${chapter.uid}`);
    };
    return (
        <Stack spacing={3} sx={{ bgcolor: "var(--card-color)", borderRadius: '10px', minHeight: "100vh", px: 1.5, py: 2 }}>
            <Stack sx={{ width: { xs: '100%', sm: '70%' } }}>
                <AlertComponent
                    title={t('title-tip')}
                    subtitle={<Typography>{t('tip')}</Typography>}
                    severity="info"
                //buttonConfirmComponent={<ButtonConfirm label="Le quiz" style={{ background: 'var(--warning)' }} />}
                />
            </Stack>
            <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 8 }}>
                    <Stack spacing={0.5}>
                        {
                            chapters?.map((_chapter, i) => {
                                const percent = getGlobalPercent(_chapter.uid_lesson, _chapter.uid);
                                const time = estimateChapterTimes({
                                    totalMinHours: _chapter.estimated_start_duration,
                                    totalMaxHours: _chapter.estimated_end_duration,
                                    chapterCount: _chapter.subchapters?.length,
                                    level: _chapter.level,
                                });
                                const countCompletedQuiz = stats?.filter(s => s.uid_chapter === _chapter.uid).length || 0;
                                const hasStats = stats?.filter(s => s.uid_chapter === _chapter.uid)?.length > 0 || false;
                                const hasPreviousStats = i === 0 ? true : i > 0 && stats?.filter(s => s.uid_chapter === chapters[i - 1].uid)?.length > 0;
                                const firstStats = hasStats ? stats?.filter(s => s.uid_chapter === _chapter.uid)?.[0] : null;
                                const hasCompletedPrevious = i > 0 && stats?.filter(s => s.uid_chapter === chapters[i - 1].uid)?.length > 0 ? true : false || true;
                                console.log("has stat", i, hasPreviousStats);
                                return (<AccordionComponent
                                    disabled={!hasPreviousStats}
                                    title={
                                        <Typography>{`${_chapter.uid_intern}. ${_chapter.translate?.title} (${t(_chapter.level)})`}
                                            <span style={{ color: 'var(--grey-light)', }}>
                                                {" - "}
                                                <Trans
                                                    t={t}
                                                    i18nKey={'duration_short'}
                                                    values={{
                                                        start: _chapter.estimated_start_duration,
                                                        end: _chapter.estimated_end_duration
                                                    }}
                                                />
                                            </span>
                                        </Typography>}
                                    key={`${_chapter.uid}-${i}`}>
                                    <Grid container sx={{ px: 1, py: 1.5 }} spacing={1} justifyContent={'space-between'}>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <Stack>
                                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap">
                                                    <Chip label={`${t(_chapter?.level)} • ${_chapter?.subchapters?.length} chapitres`} variant="outlined" sx={chipHeader} />
                                                    {
                                                        hasStats && <Chip label={`${t('progression')}: ${percent.toFixed(2)}%`} variant="outlined" sx={chipHeader} />
                                                    }
                                                </Stack>
                                                <Stack sx={{ px: 1.5, py: 1 }}>
                                                    {
                                                        _chapter.subchapters?.map((sub, i) => {
                                                            return (<Typography noWrap variant="caption" key={`${sub.uid_intern}-${i}`}>{sub.uid_intern}. {sub.translate?.title} (<span style={{ color: 'var(--primary)' }}>≈{formatChrono((time[i].duration_min + time[i].duration_max) / 2 * 60)}</span>)</Typography>)
                                                        })
                                                    }
                                                </Stack>
                                            </Stack>

                                            <Stack spacing={1} sx={{
                                                my: 1,
                                                mx: 1.5,
                                            }}>
                                                {
                                                    hasStats && <Stack spacing={1}>
                                                        {/* Progress bar */}
                                                        <Paper
                                                            elevation={0}
                                                            sx={{
                                                                borderRadius: 1.5,
                                                                p: 1.5,
                                                                border: "0.1px solid var(--primary-shadow-xs)",
                                                                bgcolor: "",
                                                            }}
                                                        >
                                                            <Stack spacing={0.7}>
                                                                <Stack sx={{ color: 'var(--primary)' }} direction="row" justifyContent="space-between" alignItems="center">
                                                                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                                                                        <Trans
                                                                            t={t}
                                                                            i18nKey={'count-completed-quiz'}
                                                                            values={{
                                                                                count: countCompletedQuiz
                                                                            }}
                                                                        />
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ fontWeight: 950 }}>
                                                                        {Number.isNaN(percent) ? 0 : percent.toFixed(2)}%
                                                                    </Typography>
                                                                </Stack>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={percent}
                                                                    sx={{
                                                                        height: 10,
                                                                        borderRadius: 999,
                                                                        bgcolor: "var(--primary-shadow-lg)",
                                                                        "& .MuiLinearProgress-bar": { bgcolor: "var(--primary)", borderRadius: 999 },
                                                                    }}
                                                                />
                                                            </Stack>
                                                        </Paper>

                                                    </Stack>
                                                }
                                                {
                                                    hasPreviousStats && <Stack alignItems={'center'} direction={'row'} spacing={1}>
                                                        {
                                                            hasStats && <ButtonCancel label={t('btn-see-stats')} onClick={() => {
                                                                router.push(`${PAGE_STATS}/${firstStats.uid}`);
                                                            }} />
                                                        }
                                                        <ButtonConfirm label={t('btn-see-chapter')} onClick={() => {
                                                            router.push(`${PAGE_LESSONS}/${_chapter.uid_lesson}${PAGE_CHAPTERS}/${_chapter.uid}`);
                                                        }} />
                                                    </Stack>
                                                }

                                                {
                                                    !hasPreviousStats && <AlertComponent
                                                        title={t('title-tip')}
                                                        subtitle={<Typography>{t('tip')}</Typography>}
                                                        severity="warning"
                                                        //buttonConfirmComponent={<ButtonConfirm label="Le quiz" style={{ background: 'var(--warning)' }} />}
                                                    />
                                                }
                                            </Stack>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 'grow' }}>
                                            <Stack
                                                sx={{
                                                    position: "relative",
                                                    width: "100%",
                                                    //height: 220,
                                                    //borderRadius: 2,
                                                    overflow: "hidden",
                                                    border: "1px solid",
                                                    border: "0.1px solid transparent",
                                                    //background:'red',

                                                }}
                                            >
                                                {
                                                    _chapter.photo_url && <Image
                                                        src={_chapter.photo_url}
                                                        alt={_chapter.translate?.title || ""}
                                                        //fill
                                                        height={100}
                                                        width={200}
                                                        style={{ objectFit: "cover", width: '100%', height: 'auto', borderRadius: '10px' }}
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                    />
                                                }
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </AccordionComponent>)
                            })
                        }
                    </Stack>
                </Grid>
                {
                    lesson?.photo_url && <Grid size={{ xs: 12, sm: 'auto' }}>
                        <Box sx={{ background: '', width: '100%' }}>
                            <Image
                                src={lesson?.photo_url || ''}
                                alt={`lesson-${lesson?.uid}`}
                                quality={100}
                                width={300}
                                height={150}
                                //loading="lazy"
                                priority
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    //maxHeight:'400px',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                    </Grid>
                }
            </Grid>
        </Stack>
    );
}

/* -------------------- Components -------------------- */

function SubchapterCard({ subchapter = null, onOpen }) {
    const locked = subchapter?.status === "locked";
    const done = subchapter?.status === "done";
    const current = subchapter?.status === "current";
    //console.log("SUB",subchapter)
    return (
        <Paper
            elevation={0}
            onClick={() => !locked && onOpen()}
            sx={{
                borderRadius: 5,
                p: 2.0,
                border: "0.1px solid var(--card-border)",
                cursor: locked ? "not-allowed" : "pointer",
                opacity: locked ? 0.7 : 1,
                position: "relative",
                overflow: "hidden",
                "&:hover": locked
                    ? {}
                    : {
                        borderColor: "rgba(37,99,235,0.35)",
                        boxShadow: "0 16px 40px rgba(2,6,23,0.08)",
                        transform: "translateY(-1px)",
                    },
                transition: "all .18s ease",
            }}
        >
            {/* subtle gradient accent */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background: current
                        ? "linear-gradient(135deg, rgba(37,99,235,0.10) 0%, rgba(96,165,250,0.05) 55%, rgba(255,255,255,0) 100%)"
                        : "linear-gradient(135deg, rgba(11,27,77,0.06) 0%, rgba(37,99,235,0.04) 55%, rgba(255,255,255,0) 100%)",
                    pointerEvents: "none",
                }}
            />

            <Stack spacing={1.1} sx={{ position: "relative" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Stack spacing={0.2} sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
                            Chapitre {subchapter?.uid_intern}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: NAVY, lineHeight: 1.1 }} noWrap>
                            {subchapter?.translate?.title}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        {done ? <Chip size="small" icon={<CheckCircleIcon />} label="Terminé" sx={chipDone} /> : null}
                        {current ? <Chip size="small" label="En cours" sx={chipCurrent} /> : null}
                        {locked ? <Chip size="small" icon={<LockIcon />} label="Verrouillé" sx={chipLocked} /> : null}
                    </Stack>
                </Stack>

                <Divider sx={{ borderColor: "rgba(15,23,42,0.08)" }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip
                        size="small"
                        icon={<AccessTimeIcon />}
                        label={`${subchapter?.duration} min`}
                        sx={chipMeta}
                    />

                    <Button
                        endIcon={<ArrowForwardIcon />}
                        variant="text"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!locked) onOpen();
                        }}
                        sx={{
                            fontWeight: 950,
                            textTransform: "none",
                            borderRadius: 3,
                            color: locked ? "rgba(11,27,77,0.45)" : ROYAL,
                        }}
                        disabled={locked}
                    >
                        Ouvrir
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}

function ChapterCard({ chapter, onOpen }) {
    const locked = chapter.status === "locked";
    const done = chapter.status === "done";
    const current = chapter.status === "current";

    return (
        <Paper
            elevation={0}
            onClick={() => !locked && onOpen()}
            sx={{
                borderRadius: 5,
                p: 2.0,
                border: "1px solid rgba(15,23,42,0.10)",
                cursor: locked ? "not-allowed" : "pointer",
                opacity: locked ? 0.7 : 1,
                position: "relative",
                overflow: "hidden",
                "&:hover": locked
                    ? {}
                    : {
                        borderColor: "rgba(37,99,235,0.35)",
                        boxShadow: "0 16px 40px rgba(2,6,23,0.08)",
                        transform: "translateY(-1px)",
                    },
                transition: "all .18s ease",
            }}
        >
            {/* subtle gradient accent */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background: current
                        ? "linear-gradient(135deg, rgba(37,99,235,0.10) 0%, rgba(96,165,250,0.05) 55%, rgba(255,255,255,0) 100%)"
                        : "linear-gradient(135deg, rgba(11,27,77,0.06) 0%, rgba(37,99,235,0.04) 55%, rgba(255,255,255,0) 100%)",
                    pointerEvents: "none",
                }}
            />

            <Stack spacing={1.1} sx={{ position: "relative" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Stack spacing={0.2} sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
                            Chapitre {chapter.index}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 950, color: NAVY, lineHeight: 1.1 }} noWrap title={chapter.title}>
                            {chapter.title}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        {done ? <Chip size="small" icon={<CheckCircleIcon />} label="Terminé" sx={chipDone} /> : null}
                        {current ? <Chip size="small" label="En cours" sx={chipCurrent} /> : null}
                        {locked ? <Chip size="small" icon={<LockIcon />} label="Verrouillé" sx={chipLocked} /> : null}
                    </Stack>
                </Stack>

                <Divider sx={{ borderColor: "rgba(15,23,42,0.08)" }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip
                        size="small"
                        icon={<AccessTimeIcon />}
                        label={`${chapter.duration_min} min`}
                        sx={chipMeta}
                    />

                    <Button
                        endIcon={<ArrowForwardIcon />}
                        variant="text"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!locked) onOpen();
                        }}
                        sx={{
                            fontWeight: 950,
                            textTransform: "none",
                            borderRadius: 3,
                            color: locked ? "rgba(11,27,77,0.45)" : ROYAL,
                        }}
                        disabled={locked}
                    >
                        Ouvrir
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}

/* -------------------- Styles -------------------- */

const chipHeader = {
    color: "var(--font-color)",
    bgcolor: "rgba(255,255,255,0.12)",
    borderColor: "var(--card-border)",
    fontWeight: 900,
};
const chipHero = {
    color: "white",
    bgcolor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.22)",
    fontWeight: 900,
};
const levelBtn = {
    borderRadius: 4,
    fontWeight: 950,
    textTransform: "none",
    borderColor: "rgba(255,255,255,0.35)",
    color: "white",
    bgcolor: "rgba(255,255,255,0.10)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.16)", borderColor: "rgba(255,255,255,0.6)" },
};
const levelBtnActive = {
    borderRadius: 4,
    fontWeight: 950,
    textTransform: "none",
    bgcolor: "white",
    color: NAVY,
    "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
};
const chipDone = {
    fontWeight: 900,
    bgcolor: "rgba(34,197,94,0.12)",
    color: "#15803D",
    border: "1px solid rgba(34,197,94,0.22)",
    "& .MuiChip-icon": { color: "#22C55E" },
};
const chipCurrent = {
    fontWeight: 900,
    bgcolor: "rgba(37,99,235,0.10)",
    color: "#1D4ED8",
    border: "1px solid rgba(37,99,235,0.22)",
};
const chipLocked = {
    fontWeight: 900,
    bgcolor: "rgba(15,23,42,0.06)",
    color: NAVY,
    border: "1px solid rgba(15,23,42,0.12)",
    "& .MuiChip-icon": { color: "rgba(11,27,77,0.75)" },
};
const chipMeta = {
    bgcolor: "rgba(15,23,42,0.05)",
    color: NAVY,
    border: "1px solid rgba(15,23,42,0.10)",
    fontWeight: 800,
    "& .MuiChip-icon": { color: ROYAL },
};
