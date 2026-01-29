import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useAuth } from "@/contexts/AuthProvider";
import Link from "next/link";
import { PAGE_LOGIN, PAGE_REGISTER } from "@/contexts/constants/constants_pages";
import { ClassColor } from "@/classes/ClassColor";
import { useTranslation } from "react-i18next";
import { NS_HOME } from "@/contexts/i18n/settings";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import AlreadyConnectedComponent from "../wrappers/AlreadyConnectedComponent";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const NotConnectedComponent = ({ title = "", subtitle = "" }) => {
    const { t } = useTranslation([NS_HOME]);
    const { message, ['btn-login']: btnLogin, ['btn-create']: btnCreate } = t('not-connected', { returnObjects: true });

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
                overflow: 'hidden',
            }}
        >
            <Stack 
                spacing={3} 
                sx={{ 
                    color: 'var(--font-color)', 
                    width: '100%', 
                    py: { xs: 4, sm: 5 }, 
                    px: { xs: 3, sm: 4, md: 5 },
                }}
            >
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
                        {title}
                    </Typography>
                    <Typography 
                        variant="body1"
                        sx={{ 
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: ClassColor.GREY_LIGHT,
                            maxWidth: '500px',
                            lineHeight: 1.6,
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Stack>

                {/* Message */}
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
                    <Typography
                        sx={{
                            fontSize: '0.95rem',
                            color: 'var(--font-color)',
                            lineHeight: 1.6,
                        }}
                    >
                        {message}
                    </Typography>
                </Box>

                {/* Boutons d'action */}
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2} 
                    alignItems={'stretch'} 
                    justifyContent={'center'}
                    sx={{ width: '100%', pt: 1 }}
                >
                    <Link href={PAGE_LOGIN} style={{ flex: 1, textDecoration: 'none' }}>
                        <ButtonCancel
                            label={btnLogin}
                            icon={<LoginIcon />}
                            fullWidth
                            size="medium"
                            sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                            }}
                        />
                    </Link>
                    <Link href={PAGE_REGISTER} style={{ flex: 1, textDecoration: 'none' }}>
                        <ButtonConfirm
                            label={btnCreate}
                            icon={<PersonAddIcon />}
                            fullWidth
                            size="medium"
                            sx={{
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
};

export default function HomeComponent() {
    const { user, isLoading } = useAuth();
    const { t } = useTranslation([NS_HOME]);

    // Afficher un loader pendant la vérification de l'authentification
    if (isLoading) {
        return (
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                }}
            >
                <Typography sx={{ color: 'var(--font-color)' }}>
                    {t('loading', { defaultValue: 'Chargement...' })}
                </Typography>
            </Box>
        );
    }

    // Afficher le composant approprié selon l'état de connexion
    return user ? (
        <AlreadyConnectedComponent />
    ) : (
        <NotConnectedComponent title={t('title')} subtitle={t('subtitle')} />
    );
}
