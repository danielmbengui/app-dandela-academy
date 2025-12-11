import { useAuth } from "@/contexts/AuthProvider";
import { PAGE_DASHBOARD_HOME } from "@/contexts/constants/constants_pages";
import { NS_HOME } from "@/contexts/i18n/settings";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
export default function AlreadyConnectedComponent () {
    const { t } = useTranslation([NS_HOME]);
    const { ['btn-dashboard']: btnDashboard } = t('already-connected', { returnObjects: true });
    const { user } = useAuth();
    return (<Stack spacing={3} sx={{ color: "var(--font-color)", width: '100%', py: 3, px: { xs: 3, sm: 5 }, background: 'var(--card-color)', borderRadius: '5px' }}>
        <Stack spacing={0.5} alignItems={'center'} sx={{ textAlign: 'center' }}>
            <Typography variant="h4">
                {t('title')}
            </Typography>
            <Typography variant="caption">
                {t('subtitle')}
            </Typography>
        </Stack>
        <Stack spacing={1} alignItems={'center'} sx={{ width: '100%', textAlign: 'center' }}>
            <Trans
                ns={NS_HOME}
                i18nKey="already-connected.message"
                values={{ email: user.email }}
                components={{
                    div: <div style={{ display: 'block', lineHeight: '1.15rem' }}></div>,
                    b: <strong></strong>,
                }}
            />
            <Link href={PAGE_DASHBOARD_HOME}>
                <ButtonConfirm
                    //loading={isLoading}
                    label={btnDashboard}
                    onClick={async () => {
                        //router.push(PAGE_DASHBOARD_HOME);
                    }}
                />
            </Link>
        </Stack>
    </Stack>)
}