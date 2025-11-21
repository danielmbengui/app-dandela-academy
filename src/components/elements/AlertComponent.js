import React from "react";
import { Alert, Stack, Typography } from "@mui/material";

export default function AlertComponent({ title = "", subtitle = "", severity = "error" }) {
    return (
        <Alert severity={severity}>
            <Stack>
                <Typography><b>{title}</b></Typography>
                <Typography>{subtitle}</Typography>
            </Stack>
        </Alert>
    );
}