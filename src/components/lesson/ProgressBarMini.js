// src/components/ProgressBarMini.js
"use client";

import { Box, LinearProgress, Stack, Typography } from "@mui/material";

export default function ProgressBarMini({ value = 0, label = "Progression" }) {
  return (
    <Stack spacing={0.75}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {Math.round(value)}%
        </Typography>
      </Stack>
      <Box sx={{ width: "100%" }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
    </Stack>
  );
}
