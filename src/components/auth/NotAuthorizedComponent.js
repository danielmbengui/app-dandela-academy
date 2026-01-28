import { Chip, CircularProgress, Stack, Typography, Box, Paper } from "@mui/material";
import { useAuth } from "@/contexts/AuthProvider";
import Link from "next/link";
import { PAGE_DASHBOARD_HOME } from "@/contexts/constants/constants_pages";
import { Trans, useTranslation } from "react-i18next";
import { NS_NOT_AUTHORIZED, NS_ROLES } from "@/contexts/i18n/settings";
import LockIcon from "@mui/icons-material/Lock";
import ButtonCancel from "../dashboard/elements/ButtonCancel";

export default function NotAuthorizedComponent() {
    const { t } = useTranslation([NS_NOT_AUTHORIZED, NS_ROLES]);
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                <CircularProgress size={32} />
            </Stack>
        );
    }
    
    return (
        <Paper
            elevation={0}
            sx={{
                maxWidth: 'sm',
                width: '100%',
                p: { xs: 3, sm: 4 },
                bgcolor: 'var(--card-color)',
                borderRadius: 3,
                border: '1px solid var(--card-border)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
        >
            <Stack spacing={3} alignItems="center">
                <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'var(--error-shadow-xs)',
                            color: 'var(--error)',
                            mb: 1,
                        }}
                    >
                        <LockIcon sx={{ fontSize: 32 }} />
                    </Box>
                    
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: 'var(--font-color)',
                        }}
                    >
                        {t('title')}
                    </Typography>
                    
                    <Trans
                        t={t}
                        i18nKey={'subtitle'}
                        values={{ email: user?.email }}
                        components={{
                            span: <Typography variant="body2" sx={{ color: 'var(--grey-light)' }} />,
                            b: <strong />
                        }}
                    />
                </Stack>

                <Stack spacing={1.5} alignItems="center" sx={{ textAlign: 'center', width: '100%' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: 'var(--font-color)',
                        }}
                    >
                        {t('role')}
                    </Typography>
                    <Chip
                        label={t(user?.role, { ns: NS_ROLES })}
                        variant="outlined"
                        size="small"
                        sx={{
                            fontWeight: 600,
                            borderColor: 'var(--primary)',
                            color: 'var(--primary)',
                        }}
                    />

                    <Typography
                        variant="caption"
                        sx={{
                            color: 'var(--grey-light)',
                            mt: 1,
                        }}
                    >
                        {t('error')}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1, width: '100%' }}>
                    <Link href={PAGE_DASHBOARD_HOME} style={{ width: '100%' }}>
                        <ButtonCancel
                            label={t('btn-back')}
                            fullWidth
                        />
                    </Link>
                </Stack>
            </Stack>
        </Paper>
    );
}