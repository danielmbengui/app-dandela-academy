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
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
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
import { formatChrono } from "@/contexts/functions";
import Link from "next/link";
import { PAGE_CHAPTERS, PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import AlertComponent from "../elements/AlertComponent";
import { NS_COMMON } from "@/contexts/i18n/settings";

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
    const { chapters, estimateChapterTimes, chapter } = useChapter();

    return (
        <Stack spacing={3} sx={{ bgcolor: "transparent", minHeight: "100vh", px: { xs: 1, sm: 2 }, py: 2 }}>
            <Stack sx={{ width: { xs: '100%', sm: '80%' } }}>
                <AlertComponent
                    title={t('title-tip')}
                    subtitle={<Typography>{t('tip')}</Typography>}
                    severity="info"
                />
            </Stack>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 9 }}>
                    <Stack spacing={2}>
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
                                const isCompleted = percent >= 100;
                                const isLocked = !hasPreviousStats;
                                
                                return (
                                    <Paper
                                        key={`${_chapter.uid}-${i}`}
                                        elevation={0}
                                        sx={{
                                            borderRadius: 3,
                                            border: `1px solid ${isLocked ? 'var(--grey-hyper-light)' : 'var(--card-border)'}`,
                                            bgcolor: isLocked ? 'var(--card-color)' : 'var(--card-color)',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            opacity: isLocked ? 0.7 : 1,
                                            '&:hover': {
                                                boxShadow: isLocked ? 'none' : '0 8px 24px rgba(0, 0, 0, 0.12)',
                                                transform: isLocked ? 'none' : 'translateY(-4px)',
                                                borderColor: isLocked ? 'var(--grey-hyper-light)' : 'var(--primary)',
                                            }
                                        }}
                                    >
                                        <Grid container spacing={0}>
                                            {/* Image Section */}
                                            {_chapter.photo_url && (
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            width: '100%',
                                                            height: { xs: 200, sm: '100%' },
                                                            minHeight: 180,
                                                            overflow: 'hidden',
                                                            bgcolor: 'var(--grey-hyper-light)',
                                                        }}
                                                    >
                                                        <Image
                                                            src={_chapter.photo_url}
                                                            alt={_chapter.translate?.title || ""}
                                                            fill
                                                            style={{ 
                                                                objectFit: "cover",
                                                                filter: isLocked ? 'grayscale(100%)' : 'none',
                                                                transition: 'filter 0.3s ease',
                                                            }}
                                                            sizes="(max-width: 600px) 100vw, 33vw"
                                                        />
                                                        {/* Status Overlay */}
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 12,
                                                                right: 12,
                                                                zIndex: 2,
                                                            }}
                                                        >
                                                            {isLocked ? (
                                                                <Chip
                                                                    icon={<LockIcon />}
                                                                    label={t('locked')}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                                        color: 'white',
                                                                        fontWeight: 600,
                                                                        backdropFilter: 'blur(10px)',
                                                                    }}
                                                                />
                                                            ) : isCompleted ? (
                                                                <Chip
                                                                    icon={<CheckCircleIcon />}
                                                                    label={t('completed')}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(34, 197, 94, 0.9)',
                                                                        color: 'white',
                                                                        fontWeight: 600,
                                                                        backdropFilter: 'blur(10px)',
                                                                    }}
                                                                />
                                                            ) : hasStats ? (
                                                                <Chip
                                                                    icon={<PlayCircleIcon />}
                                                                    label={t('in-progress')}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(37, 99, 235, 0.9)',
                                                                        color: 'white',
                                                                        fontWeight: 600,
                                                                        backdropFilter: 'blur(10px)',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Chip
                                                                    icon={<RadioButtonUncheckedIcon />}
                                                                    label={t('available')}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(34, 197, 94, 0.9)',
                                                                        color: 'white',
                                                                        fontWeight: 600,
                                                                        backdropFilter: 'blur(10px)',
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            )}
                                            
                                            {/* Content Section */}
                                            <Grid size={{ xs: 12, sm: _chapter.photo_url ? 8 : 12 }}>
                                                <Stack spacing={2} sx={{ p: 3 }}>
                                                    {/* Header */}
                                                    <Stack spacing={1}>
                                                        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    fontSize: '1.25rem',
                                                                    color: 'var(--font-color)',
                                                                    letterSpacing: '-0.01em',
                                                                }}
                                                            >
                                                                {_chapter.uid_intern}. {_chapter.translate?.title}
                                                            </Typography>
                                                        </Stack>
                                                        
                                                        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                                                            <Chip
                                                                label={t(_chapter.level)}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: 'var(--primary-shadow-xs)',
                                                                    color: 'var(--primary)',
                                                                    fontWeight: 600,
                                                                    border: '1px solid var(--primary-shadow-sm)',
                                                                }}
                                                            />
                                                            <Chip
                                                                icon={<AccessTimeIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                                label={
                                                                    <Trans
                                                                        t={t}
                                                                        i18nKey={'duration_short'}
                                                                        values={{
                                                                            start: _chapter.estimated_start_duration,
                                                                            end: _chapter.estimated_end_duration
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
                                                            <Chip
                                                                label={`${_chapter?.subchapters?.length} ${t('chapters', {ns:NS_COMMON})}`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: 'var(--card-color)',
                                                                    color: 'var(--grey-light)',
                                                                    fontWeight: 500,
                                                                    border: '1px solid var(--card-border)',
                                                                }}
                                                            />
                                                        </Stack>
                                                    </Stack>

                                                    {/* Subchapters List */}
                                                    {_chapter.subchapters?.length > 0 && (
                                                        <Stack spacing={0.5}>
                                                            <Typography variant="caption" sx={{ color: 'var(--grey-light)', fontWeight: 600, mb: 0.5 }}>
                                                                {t('subchapters')}:
                                                            </Typography>
                                                            <Stack spacing={0.5}>
                                                                {_chapter.subchapters?.map((sub, idx) => (
                                                                    <Stack
                                                                        key={`${sub.uid_intern}-${idx}`}
                                                                        direction="row"
                                                                        alignItems="center"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 1.5,
                                                                            py: 0.75,
                                                                            borderRadius: 1.5,
                                                                            bgcolor: 'var(--card-color)',
                                                                            border: '1px solid var(--card-border)',
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                color: 'var(--font-color)',
                                                                                fontWeight: 500,
                                                                                fontSize: '0.875rem',
                                                                            }}
                                                                        >
                                                                            {sub.uid_intern}. {sub.translate?.title}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="caption"
                                                                            sx={{
                                                                                color: 'var(--primary)',
                                                                                fontWeight: 600,
                                                                                ml: 'auto',
                                                                            }}
                                                                        >
                                                                            ≈{formatChrono((time[idx].duration_min + time[idx].duration_max) / 2 * 60)}
                                                                        </Typography>
                                                                    </Stack>
                                                                ))}
                                                            </Stack>
                                                        </Stack>
                                                    )}

                                                    {/* Progress Section */}
                                                    {hasStats && (
                                                        <Paper
                                                            elevation={0}
                                                            sx={{
                                                                borderRadius: 2,
                                                                p: 2,
                                                                bgcolor: 'var(--primary-shadow-xs)',
                                                                border: '1px solid var(--primary-shadow-sm)',
                                                            }}
                                                        >
                                                            <Stack spacing={1.5}>
                                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--font-color)' }}>
                                                                        <Trans
                                                                            t={t}
                                                                            i18nKey={'count-completed-quiz'}
                                                                            values={{ count: countCompletedQuiz }}
                                                                        />
                                                                    </Typography>
                                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
                                                                        {Number.isNaN(percent) ? 0 : percent.toFixed(0)}%
                                                                    </Typography>
                                                                </Stack>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={percent}
                                                                    sx={{
                                                                        height: 8,
                                                                        borderRadius: 999,
                                                                        bgcolor: 'var(--primary-shadow-sm)',
                                                                        "& .MuiLinearProgress-bar": {
                                                                            bgcolor: 'var(--primary)',
                                                                            borderRadius: 999,
                                                                        },
                                                                    }}
                                                                />
                                                            </Stack>
                                                        </Paper>
                                                    )}

                                                    {/* Actions */}
                                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                                        {hasPreviousStats ? (
                                                            <>
                                                                {hasStats && (
                                                                    <ButtonCancel
                                                                        label={t('btn-see-stats')}
                                                                        onClick={() => router.push(`${PAGE_STATS}/${firstStats.uid}`)}
                                                                    />
                                                                )}
                                                                <ButtonConfirm
                                                                    label={t('btn-see-chapter')}
                                                                    onClick={() => router.push(`${PAGE_LESSONS}/${_chapter.uid_lesson}${PAGE_CHAPTERS}/${_chapter.uid}`)}
                                                                    />
                                                            </>
                                                        ) : (
                                                            <AlertComponent
                                                                title={t('title-tip')}
                                                                subtitle={<Typography variant="body2">{t('tip')}</Typography>}
                                                                severity="warning"
                                                            />
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                );
                            })
                        }
                    </Stack>
                </Grid>
                
                {/* Sidebar */}
                {lesson?.photo_url && (
                    <Grid size={{ xs: 12, lg: 3 }}>
                        <Box
                            sx={{
                                position: { lg: 'sticky' },
                                top: 20,
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: '1px solid var(--card-border)',
                                bgcolor: 'var(--card-color)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <Image
                                src={lesson?.photo_url || ''}
                                alt={`lesson-${lesson?.uid}`}
                                quality={100}
                                width={300}
                                height={200}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                }}
                            />
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Stack>
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
