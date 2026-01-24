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
import ButtonConfirm from "../elements/ButtonConfirm";
import ButtonCancel from "../elements/ButtonCancel";
import { useLesson } from "@/contexts/LessonProvider";
import LessonEditComponent from "../../admin/lessons/LessonEditComponent";

export default function DialogLesson({ isOpen = false, setIsOpen = null }) {
    const { lesson, setUidLesson } = useLesson();
    const [lessonEdit, setLessonEdit] = useState(null);
    const [sameDatas, setSameDatas] = useState(true);
    const { t } = useTranslation([ClassUser.NS_COLLECTION, NS_ROLES]);
    const { lang } = useLanguage();
    const { theme } = useThemeMode();
    const { blueDark, primary, cardColor, text, greyLight } = theme.palette;
    const [scroll, setScroll] = useState('paper');
    useEffect(() => {
        if (lesson) {
            setLessonEdit(lesson.clone());
            setSameDatas(true);
        } else {
            setLessonEdit(null);
            setSameDatas(false);
        }
        setLessonEdit(lesson?.clone?.());
    }, [lesson]);
    function hasSameDatas() {
        if (lesson?.translate?.title?.trim() != lessonEdit?.translate?.title?.trim()) {
            return false;
        }
        if (lesson?.translate?.subtitle?.trim() != lessonEdit?.translate?.subtitle?.trim()) {
            return false;
        }
        if (lesson?.translate?.description?.trim() != lessonEdit?.translate?.description?.trim()) {
            return false;
        }
        
        if (lesson?.format != lessonEdit?.format) {
            return false;
        }
        if (lesson?.certified != lessonEdit?.certified) {
            return false;
        }
        if (lesson?.category != lessonEdit?.category) {
            return false;
        }
        if (lesson?.level != lessonEdit?.level) {
            return false;
        }
        if (lesson?.lang != lessonEdit?.lang) {
            return false;
        }
        if (lesson?.duration != lessonEdit?.duration) {
            return false;
        }
        return true;
    }
    const handleClose = () => {
        //setOpen(false);
        //setIsOpen(false);
        //setDevice(null);
        //setUserDialog(null);
        //setUidLesson(null);
        //setLessonEdit(null);
        setIsOpen(false);
    };
    return (
        <Stack sx={{ width: '100%', height: '100%' }}>
            <Dialog
                //fullWidth
                maxWidth={'md'}
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
                                <Typography variant='h4'>{lesson?.translate?.title || '---'}</Typography>
                                <Typography variant='h5' color='greyLight'>{lesson?.translate?.subtitle || '---'}</Typography>
                            </Stack>
                        </Stack>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                    </Stack>
                </DialogTitle>
                <DialogContent dividers={scroll === 'paper'} sx={{ p: { xs: 1, md: 2 }, background: 'var(--background)' }}>
                    {
                        <LessonEditComponent setSameDatas={setSameDatas} lessonEdit={lessonEdit} setLessonEdit={setLessonEdit} />
                    }
                </DialogContent>
                <DialogActions sx={{ minHeight: '20px' }}>
                    {
                        !hasSameDatas() && <Stack sx={{ width: '100%' }} direction={'row'} spacing={1} justifyContent={'end'} alignItems={'center'}>
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <ButtonCancel label={'Annuler'} variant='contained'
                                    onClick={ () => {
                                        setLessonEdit(lesson?.clone())
                                    }} />
                                <ButtonConfirm label={'edit'} variant='contained' onClick={async () => {

                                }} />
                            </Stack>
                        </Stack>
                    }



                </DialogActions>
            </Dialog>
        </Stack>
    );
}