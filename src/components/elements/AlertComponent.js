import React from "react";
import { Alert, Stack, Typography } from "@mui/material";

export default function AlertComponent({
    title = "",
    subtitle = "",
    buttonCancelComponent = <></>,
    buttonConfirmComponent = <></>,
    severity = "error",
    color = "" }) {
    return (
        <Alert
            severity={severity}
            color={color && severity !== color ? color : severity}
            action={<Stack direction={'row'} spacing={0.5} alignItems={'center'} sx={{height:'100%'}}>
                {buttonCancelComponent} 
                {buttonConfirmComponent}
            </Stack>}
        >
            <Stack justifyContent={'center'} sx={{ height: '100%' }}>
                {
                    title && <Typography><b>{title}</b></Typography>
                }
                {
                    subtitle
                }
            </Stack>
        </Alert>
    );
}