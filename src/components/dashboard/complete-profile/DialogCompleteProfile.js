import React, { useEffect, useState } from "react";
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { IconCalendar, IconEdit, IconLessons, IconProfile } from "@/assets/icons/IconsComponent";
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LangProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { NS_ROLES } from "@/contexts/i18n/settings";
import ButtonConfirm from "../elements/ButtonConfirm";
import ButtonCancel from "../elements/ButtonCancel";
import { useSession } from "@/contexts/SessionProvider";
import { getFormattedDateNumeric, getFormattedHour } from "@/contexts/functions";
import CompleteProfileComponent from "./CompleteProfileComponent";
import { auth } from "@/contexts/firebase/config";
import { updateProfile } from "firebase/auth";
import { useAuth } from "@/contexts/AuthProvider";

export default function DialogCompleteProfile({ isOpen = false }) {
    const {sendVerification} = useAuth();
    const { t } = useTranslation([NS_ROLES]);
    const { lang } = useLanguage();
    const { session, setUidSession, slot } = useSession();
    const { theme } = useThemeMode();
    const { blueDark, primary, cardColor, text, greyLight } = theme.palette;
    const [wantSubscribe, setWantSubscribe] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [lessonEdit, setLessonEdit] = useState(null);
    const [scroll, setScroll] = useState('paper');

    const handleClose = () => {
        setUidSession(null);
    };
    return (
        <Stack sx={{ width: '100%', height: '100%' }}>
            <Dialog
                //fullWidth
                maxWidth={'sm'}
                open={isOpen}
                onClose={handleClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                sx={{
                    color: text.main,
                    //cursor:'pointer',
                    '& .MuiDialog-container': {
                        p: 1,
                        cursor: 'pointer',
                        //background: 'red'
                        //alignItems: 'stretch', // ⬅️ étire le container sur toute la hauteur
                    },
                    '& .MuiDialog-paper': {
                        borderRadius: '10px',
                        background: cardColor.main,
                        cursor: "auto",
                        //color: 'white',
                        // minWidth: { xs: '100%', md: '600px' },
                        //width: { xs: '100%', md: '100%' },
                        //maxWidth: { xs: '100%', md: '80%' },
                        //maxWidth: '100%',
                        margin: 1,
                        //borderRadius: 0,
                        //height: '100vh',      // ⬅️ plein écran en hauteur
                        //maxHeight: '100vh',   // ⬅️ enlève la limite par défaut
                        display: 'flex',
                        flexDirection: 'column',
                    },
                    // 🔹 Bordures générées par `DialogContent dividers`
                    '& .MuiDialogContent-dividers': {
                        borderTopColor: cardColor.main,    // ou une couleur de ton thème
                        //borderBottomColor: greyLight.main,
                        //borderTop: `0.1px solid ${greyLight.main}`,
                        borderBottom: `0.1px solid ${greyLight.main}`,
                    },

                    // 🔹 Si tu utilises aussi des <Divider /> à l’intérieur
                    '& .MuiDivider-root': {
                        //borderColor: 'rgba(255,255,255,0.2)',
                    },
                }}
                slotProps={{
                    backdrop: {
                        sx: {
                            cursor: 'pointer !important', // pour passer devant un style global
                        },
                    },
                    paper: {
                        sx: {
                            cursor: 'normal'
                        }
                    }
                }}
            >
                {
                    <>
                        <DialogTitle id="scroll-dialog-title">
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
                                    <IconProfile />
                                    <Stack>
                                        <Typography variant='h4' sx={{ lineHeight: '1.5rem' }}>{"Profil"}</Typography>
                                        <Typography variant='h5' color='greyLight'>{`Complète les informations de ton profil`}</Typography>
                                    </Stack>
                                </Stack>
                                <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                            </Stack>
                        </DialogTitle>
                        <DialogContent dividers={scroll === 'paper'} sx={{ p: { xs: 1, md: 2 }, background: 'var(--background)' }}>
                            <CompleteProfileComponent session={session} selectedSlot={slot} />
                        </DialogContent>
                        <DialogActions sx={{ minHeight: '20px' }}>
                        </DialogActions>
                    </>
                }
            </Dialog>
        </Stack>
    );
}