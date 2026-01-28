import { CircularProgress, Stack, Typography, Box, Paper } from "@mui/material";
import { useAuth } from "@/contexts/AuthProvider";
import Link from "next/link";
import { PAGE_STATS } from "@/contexts/constants/constants_pages";
import { Trans, useTranslation } from "react-i18next";
import { NS_STATS_ONE } from "@/contexts/i18n/settings";
import LockIcon from "@mui/icons-material/Lock";
import ButtonCancel from "../dashboard/elements/ButtonCancel";

export default function NotAuthorizedStatComponent() {
    const { t } = useTranslation([NS_STATS_ONE]);
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
            <Stack spacing={3.5} alignItems="center">
                <Stack spacing={2.5} alignItems="center" sx={{ textAlign: 'center' }}>
                    <Box
                        sx={{
                            width: 72,
                            height: 72,
                            borderRadius: 3.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'var(--error-shadow-xs)',
                            color: 'var(--error)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
                            },
                        }}
                    >
                        <LockIcon sx={{ fontSize: 36 }} />
                    </Box>
                    
                    <Stack spacing={1}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.2,
                                color: 'var(--font-color)',
                            }}
                        >
                            {t('not-authorized-title')}
                        </Typography>
                        
                        <Trans
                            t={t}
                            i18nKey={'not-authorized-subtitle'}
                            values={{ email: user?.email }}
                            components={{
                                span: (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'var(--grey-light)',
                                            lineHeight: 1.6,
                                        }}
                                    />
                                ),
                                b: <strong style={{ color: 'var(--font-color)' }} />
                            }}
                        />
                    </Stack>
                </Stack>

                <Box
                    sx={{
                        width: '100%',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'var(--error-shadow-xs)',
                        border: '1px solid var(--error-shadow-sm)',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'var(--error-dark)',
                            textAlign: 'center',
                            fontWeight: 500,
                        }}
                    >
                        {t('not-authorized-error')}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1, width: '100%' }}>
                    <Link href={PAGE_STATS} style={{ width: '100%' }}>
                        <ButtonCancel
                            label={t('not-authorized-btn-back')}
                            fullWidth
                        />
                    </Link>
                </Stack>
            </Stack>
        </Paper>
    );
}