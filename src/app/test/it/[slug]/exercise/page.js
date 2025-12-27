// src/app/courses/it-intro/[slug]/exercise/page.js
"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { COURSE_IT_INTRO, getLessonBySlug } from "@/data/course_it_intro";
//import { COURSE_IT_INTRO, getLessonBySlug } from "@/data/course_it_intro";

export default function ExercisePage({ params }) {
  const { slug } = params;
  const lesson = getLessonBySlug(COURSE_IT_INTRO, slug);

  const checklist = useMemo(() => lesson?.exercise?.checklist || [], [lesson]);
  const [checks, setChecks] = useState(() => checklist.map(() => false));

  if (!lesson?.exercise) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Exercice introuvable
        </Typography>
        <Button component={Link} href="/courses/it-intro" sx={{ mt: 2 }}>
          Retour au cours
        </Button>
      </Container>
    );
  }

  const done = checks.filter(Boolean).length;
  const total = checks.length;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={2.5}>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
          {lesson.exercise.title}
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          Leçon : <b>{lesson.title}</b>
        </Typography>

        <Stack direction="row" spacing={1.2}>
          <Button
            component={Link}
            href={`/courses/it-intro/${lesson.slug}`}
            variant="text"
            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 800 }}
          >
            Retour à la leçon
          </Button>
          <Button
            component={Link}
            href="/courses/it-intro"
            variant="text"
            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 800 }}
          >
            Catalogue
          </Button>
        </Stack>

        <Divider />

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
            Étapes
          </Typography>
          <Stack component="ol" sx={{ pl: 2.5, m: 0 }} spacing={0.7}>
            {(lesson.exercise.steps || []).map((s, i) => (
              <Typography key={i} component="li">
                {s}
              </Typography>
            ))}
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
            Checklist ({done}/{total})
          </Typography>

          <Stack
            spacing={1}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(0,0,0,0.02)",
            }}
          >
            {checklist.map((label, idx) => (
              <FormControlLabel
                key={idx}
                control={
                  <Checkbox
                    checked={checks[idx]}
                    onChange={(e) => {
                      const next = [...checks];
                      next[idx] = e.target.checked;
                      setChecks(next);
                    }}
                  />
                }
                label={label}
              />
            ))}

            {total > 0 && done === total && (
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: 2.5,
                  border: "1px solid rgba(30,64,175,0.18)",
                  background:
                    "linear-gradient(135deg, rgba(30,64,175,0.10), rgba(30,64,175,0.02))",
                }}
              >
                <Typography sx={{ fontWeight: 900 }}>
                  Bravo 🎉 Exercice terminé !
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Tu peux passer à la prochaine leçon depuis le catalogue.
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
