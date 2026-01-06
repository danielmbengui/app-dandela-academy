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
import { useTranslation } from "react-i18next";
import { useChapter } from "@/contexts/ChapterProvider";
import { StatProvider, useStat } from "@/contexts/StatProvider";
import Image from "next/image";

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
    return (<StatProvider uidLesson={lesson?.uid} uidChapter={chapter?.uid}>
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
            setUidChapter(chapters[0].uid);
        }
        console.log("STATTS", stats)
    }, [chapters.length]);

    useEffect(() => {
        if (chapter && lesson) {
            setPercent(getGlobalPercent(lesson.uid, chapter.uid));
        }
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
        <Box sx={{ bgcolor: "var(--card-color)", borderRadius: '10px', minHeight: "100vh", px: 1.5, py: 2 }}>
            {
                chapter && <Tabs
                    value={chapter?.uid || ''}
                    //onChange={handleChange} 
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="basic tabs chapters"
                >
                    {
                        chapters.map((c, i) => {
                            return (<Tab
                                key={`${c}-${i}`} wrapped
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.85rem'
                                }}
                                label={c.translate?.title}
                                value={c.uid}
                                onClick={() => setUidChapter(c.uid)}
                            />)
                        })
                    }
                </Tabs>
            }

            <Stack spacing={2} justifyContent={'center'} sx={{ width: { xs: '100%', sm: '60%' }, py: 3,px:2 }}>
                <Stack spacing={1}>
                    <Typography variant="h4">{chapter?.uid_intern}. {chapter?.translate?.title} {chapter?.duration}</Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip label={`${t(chapter?.level)} • ${chapter?.subchapters?.length} chapitres`} variant="outlined" sx={chipHeader} />
                        <Chip label={`Progression: ${currentLevel.progress}%`} variant="outlined" sx={chipHeader} />
                    </Stack>
                </Stack>
                {/* Progress bar */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 1.5,
                        p: 1.2,
                        border: "0.1px solid var(--primary-shadow-xs)",
                        bgcolor: "var(--primary-shadow)",
                    }}
                >
                    <Stack spacing={0.7}>
                        <Stack sx={{ color: 'var(--primary)' }} direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" sx={{ fontWeight: 900 }}>
                                {stats?.length} questionnaires completés
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

            <Stack spacing={1} sx={{px:2}}>
                <Grid container sx={{ background: 'red' }} spacing={2}>
                    <Grid size={12}>
                        <Grid container spacing={1}>
                            {chapter?.subchapters?.map((sub) => (
                                <Grid size={{ xs: 12, sm: 'auto' }} key={sub.uid_intern}>
                                    <SubchapterCard subchapter={sub} onOpen={() => handleOpenChapter(ch)} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 'auto' }}>
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
                                chapter?.photo_url && <Image
                                    src={chapter?.photo_url}
                                    alt={chapter?.translate?.title || ""}
                                    //fill
                                    height={100}
                                    width={200}
                                    style={{ objectFit: "cover", width: '100%', height: 'auto',maxHeight:'300px',borderRadius:'10px' }}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            }
                        </Stack>
                    </Grid>
                </Grid>


            </Stack>

            {/* HERO */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, rgba(11,27,77,1) 0%, rgba(37,99,235,1) 55%, rgba(96,165,250,1) 100%)",
                    color: "white",
                    pb: 9,
                }}
            >
                <Stack sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, pt: 3 }} spacing={2}>
                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2}>
                        <Stack spacing={0.6}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Avatar
                                    sx={{
                                        bgcolor: "rgba(255,255,255,0.14)",
                                        border: "1px solid rgba(255,255,255,0.18)",
                                        color: "white",
                                    }}
                                >
                                    <SchoolIcon />
                                </Avatar>
                                <Stack spacing={0.1}>
                                    <Typography variant="h3" sx={{ fontWeight: 950, lineHeight: 1 }}>
                                        {course.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        {course.subtitle}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip label={course.code} variant="outlined" sx={chipHero} />
                                <Chip label={`${level} • 5 chapitres`} variant="outlined" sx={chipHero} />
                                <Chip label={`Progression: ${currentLevel.progress}%`} variant="outlined" sx={chipHero} />
                            </Stack>
                        </Stack>

                        {/* Search */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                p: 0.8,
                                border: "1px solid rgba(255,255,255,0.22)",
                                bgcolor: "rgba(255,255,255,0.12)",
                                width: { xs: "100%", md: 420 },
                            }}
                        >
                            <TextField
                                fullWidth
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Rechercher un chapitre…"
                                variant="standard"
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: "rgba(255,255,255,0.85)" }} />
                                        </InputAdornment>
                                    ),
                                    sx: { color: "white", fontWeight: 800 },
                                }}
                            />
                        </Paper>
                    </Stack>

                    {/* Level switch */}
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {course.levels.map((l) => (
                            <Button
                                key={l.key}
                                onClick={() => setLevel(l.key)}
                                variant={l.key === level ? "contained" : "outlined"}
                                sx={l.key === level ? levelBtnActive : levelBtn}
                            >
                                {l.key}
                            </Button>
                        ))}
                    </Stack>

                    {/* Progress bar */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            p: 1.2,
                            border: "1px solid rgba(255,255,255,0.18)",
                            bgcolor: "rgba(255,255,255,0.10)",
                        }}
                    >
                        <Stack spacing={0.7}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" sx={{ fontWeight: 900 }}>
                                    Progression — {level}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 950 }}>
                                    {currentLevel.progress}%
                                </Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={currentLevel.progress}
                                sx={{
                                    height: 10,
                                    borderRadius: 999,
                                    bgcolor: "rgba(255,255,255,0.18)",
                                    "& .MuiLinearProgress-bar": { bgcolor: "rgba(255,255,255,0.85)", borderRadius: 999 },
                                }}
                            />
                        </Stack>
                    </Paper>
                </Stack>
            </Box>

            {/* CONTENT */}
            <Stack sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, mt: -6, pb: 4 }} spacing={2}>
                <Grid container spacing={2}>
                    {chaptersFiltered.map((ch) => (
                        <Grid item xs={12} md={6} key={ch.uid}>
                            <ChapterCard chapter={ch} onOpen={() => handleOpenChapter(ch)} />
                        </Grid>
                    ))}

                    {!chaptersFiltered.length ? (
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ borderRadius: 5, p: 3, border: "1px solid rgba(15,23,42,0.10)" }}>
                                <Typography variant="h5" sx={{ fontWeight: 950, color: NAVY }}>
                                    Aucun chapitre trouvé
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Essaie une autre recherche.
                                </Typography>
                            </Paper>
                        </Grid>
                    ) : null}
                </Grid>

                {/* Footer hint */}
                <Paper elevation={0} sx={{ borderRadius: 5, p: 2.2, border: "1px solid rgba(15,23,42,0.10)", bgcolor: "rgba(37,99,235,0.04)" }}>
                    <Typography variant="h5" sx={{ fontWeight: 950, color: NAVY }}>
                        Astuce
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Termine le chapitre en cours pour débloquer le suivant. Chaque chapitre a un exercice + un quiz de validation.
                    </Typography>
                </Paper>
            </Stack>
        </Box>
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
