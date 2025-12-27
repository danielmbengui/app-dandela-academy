// src/components/CourseHero.js
"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";

export default function CourseHero({ title, subtitle, level, hours }) {
  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 4 },
        borderRadius: 3,
        background:
          "linear-gradient(135deg, rgba(30,64,175,0.10), rgba(30,64,175,0.03))",
        border: "1px solid rgba(30,64,175,0.15)",
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={level} variant="outlined" />
          <Chip label={`${hours}h estimées`} variant="outlined" />
        </Stack>

        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          {title}
        </Typography>

        <Typography sx={{ color: "text.secondary", maxWidth: 900 }}>
          {subtitle}
        </Typography>
      </Stack>
    </Box>
  );
}
