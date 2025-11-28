import React from "react";
import { Stack, Typography } from "@mui/material";

export default function DialogTypographyComponent({ title = "", value = "" }) {
    return (<Stack direction={'row'} spacing={1.5} justifyContent={'space-between'} sx={{ background: '' }}>
      <Typography fontWeight={'bold'}>{title}</Typography>
      <Typography noWrap sx={{lineHeight:1.15}}>{value}</Typography>
    </Stack>)
  }