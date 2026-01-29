import { useAuth } from "@/contexts/AuthProvider";
import { PAGE_DASHBOARD_HOME } from "@/contexts/constants/constants_pages";
import { NS_HOME } from "@/contexts/i18n/settings";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import { IconCheckFilled, IconDashboard } from "@/assets/icons/IconsComponent";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function AlreadyConnectedComponent() {
    const { t } = useTranslation([NS_HOME]);
    const { ['btn-dashboard']: btnDashboard } = t('already-connected', { returnObjects: true });
    const { user } = useAuth();
    
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '600px',
                mx: 'auto',
                background: 'var(--card-color)',
                borderRadius: '16px',
                border: '1px solid var(--card-border)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(-2px)',
                },
                overflow: 'hidden',
            }}
        >
            <Stack 
                spacing={3} 
                sx={{ 
                    color: "var(--font-color)", 
                    width: '100%', 
                    py: { xs: 4, sm: 5 }, 
                    px: { xs: 3, sm: 4, md: 5 },
                }}
            >
                {/* Icône de succès avec animation */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 1,
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                            boxShadow: '0 4px 14px 0 var(--primary-shadow-md)',
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            '@keyframes pulse': {
                                '0%, 100%': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                },
                                '50%': {
                                    opacity: 0.8,
                                    transform: 'scale(1.05)',
                                },
                            },
                        }}
                    >
                        <CheckCircleIcon 
                            sx={{ 
                                fontSize: 48, 
                                color: 'var(--font-reverse-color)',
                                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                            }} 
                        />
                    </Box>
                </Box>

                {/* Titre et sous-titre */}
                <Stack spacing={1.5} alignItems={'center'} sx={{ textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                            color: 'var(--font-color)',
                            lineHeight: 1.2,
                        }}
                    >
                        {t('title')}
                    </Typography>
                    <Typography 
                        variant="body1"
                        sx={{ 
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: 'var(--grey-dark)',
                            maxWidth: '500px',
                            lineHeight: 1.6,
                        }}
                    >
                        {t('subtitle')}
                    </Typography>
                </Stack>

                {/* Message de bienvenue avec email */}
                <Box
                    sx={{
                        width: '100%',
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: '12px',
                        background: 'var(--background)',
                        border: '1px solid var(--card-border)',
                        textAlign: 'center',
                    }}
                >
                    <Trans
                        ns={NS_HOME}
                        i18nKey="already-connected.message"
                        values={{ email: user?.email || '' }}
                        components={{
                            div: <div style={{ 
                                display: 'block', 
                                lineHeight: '1.6rem',
                                fontSize: '0.95rem',
                                color: 'var(--font-color)',
                            }} />,
                            b: <strong style={{ 
                                color: 'var(--primary)',
                                fontWeight: 600,
                            }} />,
                        }}
                    />
                </Box>

                {/* Bouton d'action */}
                <Stack spacing={1} alignItems={'center'} sx={{ width: '100%', pt: 1 }}>
                    <Link href={PAGE_DASHBOARD_HOME} style={{ width: '100%', textDecoration: 'none' }}>
                        <ButtonConfirm
                            label={btnDashboard}
                            icon={<IconDashboard width={20} height={20} />}
                            onClick={async () => {
                                // Navigation gérée par le Link
                            }}
                            fullWidth
                            size="medium"
                            sx={{
                                mt: 1,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                            }}
                        />
                    </Link>
                </Stack>
            </Stack>
        </Box>
    );
}