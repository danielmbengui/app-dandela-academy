"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  Grid,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";

/**
 * Page Détail d'un résultat (1 tentative / 1 quiz)
 * ✅ Résumé: score, %, durée, date
 * ✅ Répartition: bonnes / mauvaises (bar)
 * ✅ Liste questions: correct / incorrect + réponse donnée + bonne réponse + explication
 * ✅ Filtre: Toutes / Correctes / Incorrectes
 *
 * À brancher :
 * - Fetch attempt by uid_attempt (Firestore)
 * - attempt.questions[] avec:
 *   { question, choices?, user_answer, correct_answer, is_correct, explanation?, points? }
 */
export default function ResultAttemptDetailsPage() {
  // ---- MOCK (remplace par Firestore) ----
  const attempt = useMemo(
    () => ({
      uid: "attempt_001",
      course_title: "Excel Débutant",
      course_code: "EXCEL-101",
      chapter_title: "Formules (SOMME, MOYENNE)",
      date: "2025-12-20",
      duration_sec: 380,
      score: 9,
      total: 10,
      questions: [
        {
          uid: "q1",
          question: "Quelle formule permet de calculer une somme ?",
          choices: ["=SOMME()", "=MOYENNE()", "=MIN()", "=MAX()"],
          user_answer: "=SOMME()",
          correct_answer: "=SOMME()",
          is_correct: true,
          explanation: "SOMME additionne une plage de cellules (ex: =SOMME(A1:A10)).",
        },
        {
          uid: "q2",
          question: "Que renvoie =MOYENNE(A1:A4) ?",
          choices: ["Le total", "La valeur la plus grande", "La moyenne", "La valeur la plus petite"],
          user_answer: "Le total",
          correct_answer: "La moyenne",
          is_correct: false,
          explanation: "MOYENNE renvoie la moyenne arithmétique d’une plage.",
        },
        {
          uid: "q3",
          question: "Quelle est la bonne écriture d’une plage ?",
          choices: ["A1-A10", "A1:A10", "A1..A10", "A1|A10"],
          user_answer: "A1:A10",
          correct_answer: "A1:A10",
          is_correct: true,
          explanation: "Excel utilise ':' pour représenter une plage continue (A1:A10).",
        },
      ],
    }),
    []
  );

  const [filter, setFilter] = useState("all"); // all | correct | wrong

  const percent = attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0;
  const correctCount = attempt.questions.filter((q) => q.is_correct).length;
  const wrongCount = attempt.questions.filter((q) => !q.is_correct).length;

  const questionsFiltered = useMemo(() => {
    if (filter === "correct") return attempt.questions.filter((q) => q.is_correct);
    if (filter === "wrong") return attempt.questions.filter((q) => !q.is_correct);
    return attempt.questions;
  }, [attempt.questions, filter]);

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
            background:
              "linear-gradient(135deg, rgba(11,27,77,1) 0%, rgba(37,99,235,1) 55%, rgba(96,165,250,1) 100%)",
            color: "white",
          }}
        >
          <Stack spacing={1.4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => history.back()}
                sx={{
                  borderRadius: 3,
                  fontWeight: 950,
                  textTransform: "none",
                  color: "white",
                  borderColor: "rgba(255,255,255,0.35)",
                  bgcolor: "rgba(255,255,255,0.10)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
                }}
                variant="outlined"
              >
                Retour
              </Button>

              <Chip
                label={`${percent}%`}
                sx={{
                  fontWeight: 950,
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.14)",
                  borderColor: "rgba(255,255,255,0.22)",
                }}
                variant="outlined"
              />
            </Stack>

            <Stack spacing={0.4}>
              <Typography variant="h4" sx={{ fontWeight: 950, lineHeight: 1.05 }}>
                Détails du test
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                <b>{attempt.course_title}</b> ({attempt.course_code}) • {attempt.chapter_title}
              </Typography>
            </Stack>

            {/* Quick stats */}
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={4}>
                <MiniStat label="Score" value={`${attempt.score}/${attempt.total}`} icon={<QuizIcon fontSize="small" />} />
              </Grid>
              <Grid item xs={12} md={4}>
                <MiniStat label="Durée" value={formatDuration(attempt.duration_sec)} icon={<AccessTimeIcon fontSize="small" />} />
              </Grid>
              <Grid item xs={12} md={4}>
                <MiniStat label="Date" value={attempt.date} icon={<SchoolIcon fontSize="small" />} />
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        {/* Breakdown */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 5,
                p: 2.2,
                border: "1px solid rgba(15, 23, 42, 0.10)",
              }}
            >
              <Stack spacing={1.2}>
                <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                  Répartition
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={`${correctCount} bonnes`}
                    sx={chipGood}
                    variant="outlined"
                  />
                  <Chip
                    icon={<CancelIcon />}
                    label={`${wrongCount} fausses`}
                    sx={chipBad}
                    variant="outlined"
                  />
                </Stack>

                <Stack spacing={0.8}>
                  <Typography variant="caption" color="text.secondary">
                    Bonnes réponses
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={attempt.questions.length ? (correctCount / attempt.questions.length) * 100 : 0}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      bgcolor: "rgba(34,197,94,0.10)",
                      "& .MuiLinearProgress-bar": { bgcolor: "#22C55E", borderRadius: 999 },
                    }}
                  />

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Mauvaises réponses
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={attempt.questions.length ? (wrongCount / attempt.questions.length) * 100 : 0}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      bgcolor: "rgba(239,68,68,0.10)",
                      "& .MuiLinearProgress-bar": { bgcolor: "#EF4444", borderRadius: 999 },
                    }}
                  />
                </Stack>

                <Divider sx={{ borderColor: "rgba(15,23,42,0.10)" }} />

                <Typography variant="body2" color="text.secondary">
                  Idées d’infos à afficher ici :
                  <br />• temps moyen par question
                  <br />• niveau (débutant / intermédiaire…)
                  <br />• progression vs dernière tentative
                  <br />• points forts / points faibles
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 5,
                p: 2.2,
                border: "1px solid rgba(15, 23, 42, 0.10)",
              }}
            >
              <Stack spacing={1.2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                    Questions
                  </Typography>

                  <ToggleButtonGroup
                    exclusive
                    value={filter}
                    onChange={(_, v) => v && setFilter(v)}
                    size="small"
                    sx={{
                      "& .MuiToggleButton-root": {
                        borderRadius: 3,
                        fontWeight: 900,
                        textTransform: "none",
                        borderColor: "rgba(15,23,42,0.10)",
                      },
                    }}
                  >
                    <ToggleButton value="all">Toutes</ToggleButton>
                    <ToggleButton value="correct">Justes</ToggleButton>
                    <ToggleButton value="wrong">Fausses</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                <Divider sx={{ borderColor: "rgba(15,23,42,0.10)" }} />

                <Stack spacing={1.2}>
                  {questionsFiltered.map((q, index) => (
                    <QuestionCard key={q.uid} q={q} index={index} />
                  ))}

                  {!questionsFiltered.length ? (
                    <Typography variant="body2" color="text.secondary">
                      Aucune question pour ce filtre.
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

/* -------------------- UI components -------------------- */

function MiniStat({ label, value, icon }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        p: 1.6,
        bgcolor: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.18)",
        color: "white",
      }}
    >
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          {icon}
        </Box>
        <Stack spacing={0.1} sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 950, lineHeight: 1.05 }} noWrap title={String(value)}>
            {value}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

function QuestionCard({ q, index }) {
  const isCorrect = !!q.is_correct;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 5,
        p: 1.8,
        border: "1px solid rgba(15, 23, 42, 0.10)",
        bgcolor: isCorrect ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
      }}
    >
      <Stack spacing={1.1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Stack spacing={0.35} sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 900 }}>
              Question {index + 1}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 950, lineHeight: 1.2 }}>
              {q.question}
            </Typography>
          </Stack>

          <Chip
            icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
            label={isCorrect ? "Juste" : "Faux"}
            sx={isCorrect ? chipGood : chipBad}
            variant="outlined"
          />
        </Stack>

        {/* Choices */}
        {Array.isArray(q.choices) && q.choices.length ? (
          <Stack spacing={0.6}>
            <Typography variant="caption" color="text.secondary">
              Choix proposés
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {q.choices.map((c) => {
                const isUser = c === q.user_answer;
                const isRight = c === q.correct_answer;
                return (
                  <Chip
                    key={c}
                    label={c}
                    icon={isRight ? <CheckCircleIcon /> : isUser ? <HelpOutlineIcon /> : undefined}
                    sx={{
                      fontWeight: 800,
                      borderRadius: 3,
                      border: "1px solid rgba(15,23,42,0.10)",
                      bgcolor: isRight
                        ? "rgba(34,197,94,0.12)"
                        : isUser
                        ? "rgba(37,99,235,0.10)"
                        : "rgba(15,23,42,0.04)",
                      color: isRight ? "#15803D" : isUser ? "#1D4ED8" : "#0B1B4D",
                      "& .MuiChip-icon": { color: isRight ? "#22C55E" : "#2563EB" },
                    }}
                    size="small"
                  />
                );
              })}
            </Stack>
          </Stack>
        ) : null}

        <Grid container spacing={1.2}>
          <Grid item xs={12} md={6}>
            <InfoBox
              label="Ta réponse"
              value={q.user_answer || "—"}
              tone={isCorrect ? "good" : "bad"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoBox label="Bonne réponse" value={q.correct_answer || "—"} tone="good" />
          </Grid>
        </Grid>

        {q.explanation ? (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              p: 1.3,
              border: "1px solid rgba(15,23,42,0.10)",
              bgcolor: "rgba(255,255,255,0.6)",
            }}
          >
            <Stack spacing={0.4}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
                Explication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {q.explanation}
              </Typography>
            </Stack>
          </Paper>
        ) : null}

        <Typography variant="caption" color="text.secondary">
          Détails possibles ici : points, thème, difficulté, temps/question, compétence évaluée, lien vers le cours.
        </Typography>
      </Stack>
    </Paper>
  );
}

function InfoBox({ label, value, tone }) {
  const isGood = tone === "good";
  const isBad = tone === "bad";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        p: 1.3,
        border: "1px solid rgba(15,23,42,0.10)",
        bgcolor: isGood ? "rgba(34,197,94,0.06)" : isBad ? "rgba(239,68,68,0.06)" : "rgba(15,23,42,0.04)",
      }}
    >
      <Stack spacing={0.3}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 900, color: "#0B1B4D" }} noWrap title={String(value)}>
          {value}
        </Typography>
      </Stack>
    </Paper>
  );
}

/* -------------------- Helpers -------------------- */

function formatDuration(sec) {
  const s = Math.max(0, Number(sec || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m < 60) return `${m}m ${String(r).padStart(2, "0")}s`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}h ${String(mm).padStart(2, "0")}m`;
}

/* -------------------- Styles -------------------- */

const chipGood = {
  fontWeight: 950,
  borderRadius: 3,
  bgcolor: "rgba(34,197,94,0.12)",
  color: "#15803D",
  borderColor: "rgba(34,197,94,0.25)",
  "& .MuiChip-icon": { color: "#22C55E" },
};

const chipBad = {
  fontWeight: 950,
  borderRadius: 3,
  bgcolor: "rgba(239,68,68,0.10)",
  color: "#B91C1C",
  borderColor: "rgba(239,68,68,0.20)",
  "& .MuiChip-icon": { color: "#EF4444" },
};
