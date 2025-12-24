"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  LinearProgress,
  Chip,
  Divider
} from "@mui/material";

const THEMES = [
  { value: "culture", label: "Culture & Histoire" },
  { value: "geographie", label: "Géographie" },
  { value: "sports", label: "Sports" },
  { value: "economie", label: "Économie & Société" },
  { value: "education", label: "Éducation" },
  { value: "musique", label: "Musique & Arts" },
];

const ZONES = [
  { value: "Angola", label: "Angola" },
  { value: "SADC", label: "Pays autour (SADC)" },
  { value: "Afrique", label: "Afrique" },
  { value: "Monde", label: "Monde" },
];

const LEVELS = [
  { value: "facile", label: "Facile" },
  { value: "moyen", label: "Moyen" },
  { value: "difficile", label: "Difficile" },
];

const LANGS = [
  { value: "fr", label: "Français" },
  { value: "pt", label: "Português" },
  { value: "en", label: "English" },
];

function pointsFor(level) {
  if (level === "facile") return 0.1;
  if (level === "moyen") return 0.5;
  return 1.2;
}

export default function QuizPage() {
  const [theme, setTheme] = React.useState("culture");
  const [zone, setZone] = React.useState("Angola");
  const [level, setLevel] = React.useState("facile");
  const [count, setCount] = React.useState(10);
  const [lang, setLang] = React.useState("fr");

  const [loading, setLoading] = React.useState(false);
  const [quiz, setQuiz] = React.useState(null);

  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [answers, setAnswers] = React.useState([]); // {questionId, chosenIndex, correct, earnedPoints}

  const current = quiz?.quiz?.questions?.[index] ?? null;
  const totalQ = quiz?.quiz?.questions?.length ?? 0;

  const score = answers.reduce((acc, a) => acc + (a.earnedPoints || 0), 0);
  const correctCount = answers.filter(a => a.correct).length;

  const progress = totalQ ? Math.round(((index) / totalQ) * 100) : 0;

  async function generate() {
    setLoading(true);
    setQuiz(null);
    setIndex(0);
    setSelected(null);
    setAnswers([]);

    try {
      const res = await fetch("/api/quizz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          zone,
          level,
          count,
          lang,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Generation failed");
      }

      const data = await res.json();

      // On injecte des points selon ton système si l’API ne le fait pas
      const pts = pointsFor(level);
      data.quiz.questions = data.quiz.questions.map(q => ({
        ...q,
        difficultyPoints: typeof q.difficultyPoints === "number" ? q.difficultyPoints : pts,
      }));

      setQuiz(data);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  function submitAnswer() {
    if (!current) return;
    if (selected == null) return;

    const correct = selected === current.answerIndex;
    const earnedPoints = correct ? (current.difficultyPoints ?? 0) : 0;

    setAnswers(prev => [
      ...prev,
      {
        questionId: current.id,
        chosenIndex: selected,
        correct,
        earnedPoints,
      }
    ]);

    setSelected(null);

    // next
    if (index < totalQ - 1) setIndex(i => i + 1);
  }

  function restart() {
    setQuiz(null);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
  }

  const finished = quiz && answers.length === totalQ;

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>
      <Stack spacing={2} sx={{ maxWidth: 980, mx: "auto" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Typography variant="h5" fontWeight={800}>
            Quiz Angola
          </Typography>

          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip label={`Zone: ${zone}`} />
            <Chip label={`Thème: ${theme}`} />
            <Chip label={`Niveau: ${level}`} />
            <Chip label={`Score: ${score.toFixed(2)}`} />
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography fontWeight={700}>Créer un entraînement</Typography>

              <Stack direction={{ xs: "column", md: "row" }} gap={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Thème</InputLabel>
                  <Select label="Thème" value={theme} onChange={(e) => setTheme(e.target.value)}>
                    {THEMES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Zone</InputLabel>
                  <Select label="Zone" value={zone} onChange={(e) => setZone(e.target.value)}>
                    {ZONES.map(z => <MenuItem key={z.value} value={z.value}>{z.label}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Niveau</InputLabel>
                  <Select label="Niveau" value={level} onChange={(e) => setLevel(e.target.value)}>
                    {LEVELS.map(l => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} gap={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Langue</InputLabel>
                  <Select label="Langue" value={lang} onChange={(e) => setLang(e.target.value)}>
                    {LANGS.map(l => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>)}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  size="small"
                  label="Nombre de questions"
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  inputProps={{ min: 3, max: 30, step: 1 }}
                  helperText="Entre 3 et 30"
                />

                <Button
                  variant="contained"
                  onClick={generate}
                  disabled={loading}
                  sx={{ minWidth: 220, height: 40 }}
                >
                  {loading ? "Génération..." : "Générer le quiz"}
                </Button>
              </Stack>

              {loading && <LinearProgress />}
            </Stack>
          </CardContent>
        </Card>

        {quiz && (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={800}>
                    {finished ? "Résultats" : `Question ${index + 1}/${totalQ}`}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {finished ? `${correctCount}/${totalQ} correct` : `Progression: ${progress}%`}
                  </Typography>
                </Stack>

                {!finished && current && (
                  <>
                    <Typography variant="h6" fontWeight={800}>
                      {current.question}
                    </Typography>

                    <Stack spacing={1}>
                      {current.choices.map((c, i) => (
                        <Button
                          key={i}
                          variant={selected === i ? "contained" : "outlined"}
                          onClick={() => setSelected(i)}
                          sx={{ justifyContent: "flex-start", textTransform: "none" }}
                        >
                          {String.fromCharCode(65 + i)}. {c}
                        </Button>
                      ))}
                    </Stack>

                    <Stack direction="row" gap={1} justifyContent="flex-end">
                      <Button variant="text" onClick={restart}>
                        Annuler
                      </Button>
                      <Button variant="contained" disabled={selected == null} onClick={submitAnswer}>
                        Valider
                      </Button>
                    </Stack>
                  </>
                )}

                {finished && (
                  <>
                    <Typography>
                      Score total: <b>{score.toFixed(2)}</b> — Bonnes réponses: <b>{correctCount}</b> / {totalQ}
                    </Typography>

                    <Divider />

                    <Stack spacing={1}>
                      {quiz.quiz.questions.map((q, i) => {
                        const a = answers[i];
                        const ok = a?.correct;
                        return (
                          <Box key={q.id} sx={{ p: 1.25, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                              <Typography fontWeight={700} sx={{ flex: 1 }}>
                                {i + 1}. {q.question}
                              </Typography>
                              <Chip
                                label={ok ? `+${(q.difficultyPoints ?? 0).toFixed(2)}` : "0"}
                                variant={ok ? "filled" : "outlined"}
                              />
                            </Stack>

                            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                              Ta réponse: <b>{a ? `${String.fromCharCode(65 + a.chosenIndex)}. ${q.choices[a.chosenIndex]}` : "-"}</b>
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.85 }}>
                              Bonne réponse: <b>{`${String.fromCharCode(65 + q.answerIndex)}. ${q.choices[q.answerIndex]}`}</b>
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 0.75 }}>
                              Explication: {q.explanation}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                              Source hint: {q.source_hint}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>

                    <Stack direction="row" justifyContent="flex-end" gap={1}>
                      <Button variant="outlined" onClick={restart}>Nouveau quiz</Button>
                    </Stack>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
