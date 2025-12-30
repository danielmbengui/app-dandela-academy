"use client";

import { useMemo, useState } from "react";
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
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InsightsIcon from "@mui/icons-material/Insights";
import QuizIcon from "@mui/icons-material/Quiz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

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
export default function ResultsDashboardPage() {
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
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", py: 3 }}>
      <Stack sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 } }} spacing={2}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            p: 2.6,
            border: "1px solid rgba(15, 23, 42, 0.10)",
            background: "linear-gradient(135deg, rgba(11,27,77,1) 0%, rgba(37,99,235,1) 55%, rgba(96,165,250,1) 100%)",
            color: "white",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
            <Stack spacing={0.6}>
              <Typography variant="h4" sx={{ fontWeight: 950, lineHeight: 1.05 }}>
                Résultats & progression
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Résultats par chapitre, par cours, et performance globale.
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ width: { xs: "100%", md: "auto" } }}>
              <FormControl
                size="small"
                sx={{
                  minWidth: 240,
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderRadius: 3,
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.9)" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.25)" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.55)" },
                  "& .MuiSvgIcon-root": { color: "white" },
                  "& .MuiOutlinedInput-input": { color: "white", fontWeight: 800 },
                }}
              >
                <InputLabel id="course-filter">Cours</InputLabel>
                <Select
                  labelId="course-filter"
                  label="Cours"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Tous les cours</MenuItem>
                  {data.courses.map((c) => (
                    <MenuItem key={c.uid} value={c.uid}>
                      {c.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  fontWeight: 950,
                  textTransform: "none",
                  borderColor: "rgba(255,255,255,0.35)",
                  color: "white",
                  "&:hover": { borderColor: "rgba(255,255,255,0.8)", bgcolor: "rgba(255,255,255,0.12)" },
                }}
                onClick={() => setCourseFilter("ALL")}
              >
                Réinitialiser
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Top KPI cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <KpiCard
              icon={<InsightsIcon />}
              title="Performance moyenne"
              value={`${Math.round(filteredStats.avgPercent)}%`}
              subtitle={`≈ ${filteredStats.avgScore10}/10 • ${filteredStats.attemptsCount} tests`}
              progress={filteredStats.avgPercent}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard
              icon={<SchoolIcon />}
              title="Couverture"
              value={`${filteredStats.chaptersCount} chapitres`}
              subtitle={`${filteredStats.coursesCount} cours • ${filteredStats.attemptsCount} tentatives`}
              progress={Math.min(100, (filteredStats.chaptersCount / Math.max(1, globalStats.chaptersCount)) * 100)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard
              icon={<TrendingUpIcon />}
              title="Temps total"
              value={formatDuration(filteredStats.totalDuration)}
              subtitle="Temps passé sur les quiz (sélection)"
              progress={Math.min(100, (filteredStats.totalDuration / Math.max(1, globalStats.totalDuration)) * 100)}
            />
          </Grid>
        </Grid>

        {/* Best/Worst */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <HighlightCard
              title="Meilleur résultat"
              icon={<EmojiEventsIcon />}
              attempt={filteredStats.best}
              tone="good"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <HighlightCard
              title="À améliorer"
              icon={<QuizIcon />}
              attempt={filteredStats.worst}
              tone="warn"
            />
          </Grid>
        </Grid>

        {/* Per course blocks */}
        <Stack spacing={2}>
          {filteredCourses.map((course) => (
            <CourseResultsBlock
              key={course.uid}
              course={course}
              onOpenCourse={() => console.log("open course page", course.uid)}
              onOpenChapter={(ch) => console.log("open chapter page", ch.uid)}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

/* -------------------- Components -------------------- */

function KpiCard({ icon, title, value, subtitle, progress = 0 }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 5,
        p: 2.2,
        border: "1px solid rgba(15, 23, 42, 0.10)",
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

        <LinearProgress
          variant="determinate"
          value={clamp(progress)}
          sx={{
            height: 10,
            borderRadius: 999,
            bgcolor: "rgba(37,99,235,0.10)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              bgcolor: "#2563EB",
            },
          }}
        />
      </Stack>
    </Paper>
  );
}

function HighlightCard({ title, icon, attempt, tone }) {
  if (!attempt) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 5,
          p: 2.2,
          border: "1px solid rgba(15, 23, 42, 0.10)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 950 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aucun résultat pour l’instant.
        </Typography>
      </Paper>
    );
  }

  const p = percent(attempt);
  const good = tone === "good";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 5,
        p: 2.2,
        border: "1px solid rgba(15, 23, 42, 0.10)",
        bgcolor: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
      }}
    >
      <Stack spacing={1.1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.2} alignItems="center">
            <AvatarIcon
              sx={{
                bgcolor: good ? "rgba(34,197,94,0.14)" : "rgba(245,158,11,0.18)",
                color: good ? "#15803D" : "#B45309",
              }}
            >
              {icon}
            </AvatarIcon>
            <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
              {title}
            </Typography>
          </Stack>
          <Chip
            size="small"
            label={`${Math.round(p)}%`}
            sx={{
              fontWeight: 950,
              bgcolor: good ? "rgba(34,197,94,0.14)" : "rgba(245,158,11,0.18)",
              color: good ? "#15803D" : "#B45309",
              border: "1px solid rgba(15,23,42,0.10)",
            }}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          <b>{attempt.course_title}</b> • {attempt.chapter_title}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip size="small" label={`${attempt.score}/${attempt.total}`} sx={softChip()} />
          <Chip size="small" label={formatDuration(attempt.duration_sec)} sx={softChip()} />
          <Chip size="small" label={attempt.date} sx={softChip()} />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={clamp(p)}
          sx={{
            height: 10,
            borderRadius: 999,
            bgcolor: "rgba(15,23,42,0.06)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              bgcolor: good ? "#22C55E" : "#F59E0B",
            },
          }}
        />
      </Stack>
    </Paper>
  );
}

function CourseResultsBlock({ course, onOpenCourse, onOpenChapter }) {
  const courseStats = useMemo(() => {
    const allAttempts = [];
    for (const ch of course.chapters) {
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

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 5,
        border: "1px solid rgba(15, 23, 42, 0.10)",
        overflow: "hidden",
      }}
    >
      <Stack sx={{ p: 2.2 }} spacing={1.2}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={1.2}>
          <Stack spacing={0.2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                {course.title}
              </Typography>
              <Chip size="small" label={course.code} sx={softChip()} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {courseStats.attemptsCount} tests • {formatDuration(courseStats.totalDuration)} • Moyenne {Math.round(courseStats.avg)}%
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              sx={outlineBtnSx}
              onClick={onOpenCourse}
            >
              Voir le cours
            </Button>
          </Stack>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={clamp(courseStats.avg)}
          sx={{
            height: 10,
            borderRadius: 999,
            bgcolor: "rgba(37,99,235,0.10)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              bgcolor: "#2563EB",
            },
          }}
        />

        <Divider sx={{ borderColor: "rgba(15,23,42,0.10)" }} />

        <Grid container spacing={1.2}>
          {course.chapters.map((ch) => (
            <Grid key={ch.uid} item xs={12} md={6}>
              <ChapterResultCard chapter={ch} onOpen={() => onOpenChapter(ch)} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Paper>
  );
}

function ChapterResultCard({ chapter, onOpen }) {
  const lastAttempt = chapter.attempts?.[chapter.attempts.length - 1] || null;
  const bestAttempt = chapter.attempts?.length
    ? [...chapter.attempts].sort((a, b) => percent(b) - percent(a))[0]
    : null;

  const avg = chapter.attempts?.length
    ? chapter.attempts.reduce((s, a) => s + percent(a), 0) / chapter.attempts.length
    : 0;

  return (
    <Paper
      elevation={0}
      onClick={onOpen}
      sx={{
        borderRadius: 4,
        p: 1.7,
        border: "1px solid rgba(15, 23, 42, 0.10)",
        cursor: "pointer",
        "&:hover": {
          borderColor: "rgba(37,99,235,0.35)",
          boxShadow: "0 16px 40px rgba(2,6,23,0.08)",
          transform: "translateY(-1px)",
        },
        transition: "all .18s ease",
      }}
    >
      <Stack spacing={1.1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Typography variant="body1" sx={{ fontWeight: 950, lineHeight: 1.1 }} noWrap title={chapter.title}>
            {chapter.title}
          </Typography>
          <Chip size="small" label={`${chapter.attempts?.length || 0} test(s)`} sx={softChip()} />
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip size="small" label={`Moy. ${Math.round(avg)}%`} sx={softChip()} />
          {bestAttempt ? <Chip size="small" label={`Best ${bestAttempt.score}/${bestAttempt.total}`} sx={softChip()} /> : null}
          {lastAttempt ? <Chip size="small" label={`Dernier ${lastAttempt.score}/${lastAttempt.total}`} sx={softChip()} /> : null}
        </Stack>

        <LinearProgress
          variant="determinate"
          value={clamp(avg)}
          sx={{
            height: 10,
            borderRadius: 999,
            bgcolor: "rgba(15,23,42,0.06)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              bgcolor: "#2563EB",
            },
          }}
        />

        <Typography variant="caption" color="text.secondary">
          Clique pour voir les tentatives et détails →
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

function formatDuration(sec) {
  const s = Math.max(0, Number(sec || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m < 60) return `${m}m ${String(r).padStart(2, "0")}s`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}h ${String(mm).padStart(2, "0")}m`;
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

function softChip() {
  return {
    bgcolor: "rgba(37,99,235,0.08)",
    color: "var(--blue-dark)",
    border: "1px solid rgba(37,99,235,0.18)",
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
