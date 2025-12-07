import React, { useEffect, useState } from "react";
import { ClassUser } from "@/classes/users/ClassUser";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from "@mui/material";
import { IconEdit, IconProfile } from "@/assets/icons/IconsComponent";
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthProvider";
import { useLanguage } from "@/contexts/LangProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { NS_LANGS, NS_ROLES } from "@/contexts/i18n/settings";
import DialogTypographyComponent from "../elements/DialogTypographyComponent";
import { cutString, getFormattedDate, getFormattedDateCompleteNumeric } from "@/contexts/functions";
import ButtonConfirm from "../elements/ButtonConfirm";
import ButtonCancel from "../elements/ButtonCancel";
import BadgeStatusLesson from "./BadgeStatusLesson";
import Image from "next/image";
import LessonComponent from "./LessonComponent";

export default function DialogLesson({ lesson = null, isOpen = false, setIsOpen = null }) {
    const { t } = useTranslation([ClassUser.NS_COLLECTION, NS_ROLES]);
    const { lang } = useLanguage();
    const { theme } = useThemeMode();
    const { blueDark, primary, cardColor, text, greyLight } = theme.palette;
    const [processing, setProcessing] = useState(false);
    const [lessonEdit, setLessonEdit] = useState(null);
    const [scroll, setScroll] = useState('paper');
    useEffect(() => {
        setLessonEdit(lesson);
    }, [lesson]);

    const handleClose = () => {
        //setOpen(false);
        //setIsOpen(false);
        //setDevice(null);
        //setUserDialog(null);
        setLessonEdit(null);
        setIsOpen(false);
    };
    return (
        <Stack sx={{ width: '100%', height: '100%' }}>
            <Dialog
                //fullWidth
                maxWidth={'lg'}
                open={isOpen}
                onClose={handleClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                sx={{
                    color: text.main,
                    '& .MuiDialog-container': {
                        p: 1,
                        //background: 'red'
                        //alignItems: 'stretch', // ⬅️ étire le container sur toute la hauteur
                    },
                    '& .MuiDialog-paper': {
                        borderRadius: '10px',
                        background: cardColor.main,
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
            >
                <DialogTitle id="scroll-dialog-title">
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
                            <IconProfile />
                            <Stack>
                                <Typography variant='h4'>{lessonEdit?.getCompleteName?.() || '---'}</Typography>
                                <Typography variant='h5' color='greyLight'>{t(lessonEdit?.role, { ns: NS_ROLES }) || '---'}</Typography>
                            </Stack>
                        </Stack>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                    </Stack>
                </DialogTitle>
                <DialogContent dividers={scroll === 'paper'} sx={{ p: { xs: 1, md: 2 }, background:'var(--background)' }}>
                    <LessonComponent lesson={lesson} />
                </DialogContent>
                <DialogActions sx={{ minHeight: '20px' }}>
                    <Stack sx={{ width: '100%' }} direction={'row'} spacing={1} justifyContent={'end'} alignItems={'center'}>
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                            <ButtonCancel label={'cancel'} variant='contained' onClick={async () => {

                            }} />
                            <ButtonConfirm label={'edit'} variant='contained' onClick={async () => {

                            }} />
                        </Stack>
                        <IconButton size={'small'}>
                            <IconEdit width={20} height={20} color={primary.main} />
                        </IconButton>
                    </Stack>


                </DialogActions>
            </Dialog>
        </Stack>
    );
}