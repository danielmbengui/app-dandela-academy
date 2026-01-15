import React from "react";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { LinearProgress, Stack, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";

export default function LinearProgressChapter({ label = "", percent = 0, value = 0, status }) {
    const good = true;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const color = STATUS_CONFIG[status] || {
        background_bar: "var(--primary)",
        background_bubble:"var(--primary-shadow-xs)"
    };
    return (<Stack direction={'row'} alignItems={'center'} spacing={1}>
        {
            label && <Typography noWrap variant="body2" color="var(--grey-light)">{label}</Typography>
        }
        <LinearProgress
            variant="determinate"
            value={percent}
            sx={{
                height: 10,
                borderRadius: 999,
                width: '100%',
                bgcolor: color?.background_bubble,
                border: `0.1px solid transparent`,
                "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    bgcolor: color?.background_bar,
                },
            }}
        />
        <Typography variant="caption">{value}</Typography>
    </Stack>)
}