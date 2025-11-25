import React from "react";
import { Stack, Typography } from "@mui/material";

export default function CardComponent({children}) {
    return( <Stack spacing={3} sx={{
        background: 'var(--card-color)',
        borderRadius: '10px',
        //padding: '20px',
        padding: { xs: '15px', sm: '20px' },
    }}>
        {children}
    </Stack>)
}