import React from "react";
import { Alert, Stack, Typography } from "@mui/material";

export default function AlertComponent({ title = "", subtitle = "", severity = "error" }) {
    return (
        <Alert severity={severity}>
            <Stack justifyContent={'center'} sx={{height:'100%'}}>
                {
                    title && <Typography><b>{title}</b></Typography>
                }
                {
                    subtitle && <Typography>{subtitle}</Typography>
                }
            </Stack>
        </Alert>
    );
}