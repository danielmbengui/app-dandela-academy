import React, { useState } from "react";
import { Alert, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { IconEmail } from "@/assets/icons/IconsComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { set } from "zod";
import { useThemeMode } from "@/contexts/ThemeProvider";
import Link from "next/link";
import { PAGE_ACTIVE_ACCOUNT, PAGE_DASHBOARD_HOME, PAGE_FORGOT_PASSWORD, PAGE_REGISTER, PAGE_STATS } from "@/contexts/constants/constants_pages";
import { ClassColor } from "@/classes/ClassColor";
import { Trans, useTranslation } from "react-i18next";
import { NS_LOGIN, NS_NOT_AUTHORIZED, NS_REGISTER, NS_ROLES, NS_STATS, NS_STATS_ONE } from "@/contexts/i18n/settings";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@/contexts/functions";
import { ClassUser } from "@/classes/users/ClassUser";
import FieldComponent from "@/components/elements/FieldComponent";
import AlertComponent from "@/components/elements/AlertComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import LockIcon from "@mui/icons-material/Lock";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import Preloader from "../shared/Preloader";

export default function NotAuthorizedStatComponent() {
    const router = useRouter();
    const { t } = useTranslation([NS_STATS_ONE, NS_ROLES]);
    const { user, isLoading, login, logout } = useAuth();

    if (isLoading) {
        return (<CircularProgress />)
    }
    return (<Stack spacing={3} maxWidth={'sm'} sx={{ color: "var(--font-color)", width: '100%', py: 3, px: { xs: 3, sm: 5 }, background: 'var(--card-color)', borderRadius: '5px' }}>
        <Stack spacing={3} alignItems="center">
            <Stack spacing={2} alignItems={'center'} sx={{ textAlign: 'center' }}>
                <Stack spacing={1} alignItems={'center'}>
                    <LockIcon sx={{ fontSize: 48 }} color="error" />
                    <Typography variant="h4" fontWeight={600}>
                        {t('not-authorized-title')}
                    </Typography>
                    <Trans
                        t={t}
                        i18nKey={'not-authorized-subtitle'}
                        values={{ email: user?.email }}
                        components={{
                            span: <Typography variant="body2" color="text.secondary" />,
                            b: <strong />
                        }}
                    />
                </Stack>
            </Stack>

            {(
                <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        {t('not-authorized-error')}
                    </Typography>
                </Stack>
            )}

            <Stack direction="row" spacing={2} alignItems={'center'} sx={{ mt: 1, }}>
                <Link href={PAGE_STATS}>
                    <ButtonCancel
                        //onClick={handleLogout}
                        label={t('not-authorized-btn-back')}
                        //variant="outlined"
                        fullWidth
                    />
                </Link>
            </Stack>
        </Stack>

    </Stack>);
}