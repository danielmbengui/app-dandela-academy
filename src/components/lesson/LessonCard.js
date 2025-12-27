// src/components/LessonCard.js
"use client";

import Link from "next/link";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

export default function LessonCard({ basePath, lesson }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip size="small" label={`Partie ${lesson.partKey}`} variant="outlined" />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {lesson.partTitle}
            </Typography>
          </Stack>

          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.3 }}>
            {lesson.title}
          </Typography>

          <Typography sx={{ color: "text.secondary" }}>
            {lesson.goal}
          </Typography>

          <Box>
            <Button
              component={Link}
              href={`${basePath}/${lesson.slug}`}
              variant="contained"
              sx={{
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Ouvrir la leçon
            </Button>

            <Button
              component={Link}
              href={`${basePath}/${lesson.slug}/exercise`}
              variant="text"
              sx={{ ml: 1, borderRadius: 2.5, textTransform: "none", fontWeight: 700 }}
            >
              Exercice
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
