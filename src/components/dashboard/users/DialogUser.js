import React, { useEffect, useState } from "react";
import { ClassUser } from "@/classes/users/ClassUser";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { IconProfile } from "@/assets/icons/IconsComponent";
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthProvider";
import { useLanguage } from "@/contexts/LangProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { NS_LANGS, NS_ROLES } from "@/contexts/i18n/settings";
import BadgeStatusUser from "./BadgeStatusUser";
import DialogTypographyComponent from "../elements/DialogTypographyComponent";
import { cutString, getFormattedDate, getFormattedDateCompleteNumeric } from "@/contexts/functions";

export default function DialogUser({ userDialog = null, setUserDialog = null }) {
    const { t } = useTranslation([ClassUser.NS_COLLECTION, NS_ROLES]);
    const { user } = useAuth();
    const { lang } = useLanguage();
    const { theme } = useThemeMode();
    const { blueDark } = theme.palette;
    const [processing, setProcessing] = useState(false);
    const [changeUser, setChangeUser] = useState(null);
    const [scroll, setScroll] = useState('paper');
    useEffect(() => {
        setChangeUser(userDialog);
    }, [userDialog]);

    const handleClose = () => {
        //setOpen(false);
        //setIsOpen(false);
        //setDevice(null);
        setUserDialog(null);
    };

    return (
        <Stack sx={{ width: '100%', height: '100%' }}>
            <Dialog
                //fullWidth
                maxWidth={'md'}
                open={changeUser}
                onClose={handleClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                sx={{

                    '& .MuiDialog-container': {
                        p: 1,
                        //alignItems: 'stretch', // ⬅️ étire le container sur toute la hauteur
                    },
                    '& .MuiDialog-paper': {
                        borderRadius: '10px',
                        background: blueDark.main,
                        color: 'white',
                        minWidth: { xs: '100%', md: '400px' },
                        width: { xs: '100%', md: '' },
                        maxWidth: { xs: '100%', md: '50%' },
                        maxWidth: '100%',
                        margin: 1,
                        //borderRadius: 0,
                        //height: '100vh',      // ⬅️ plein écran en hauteur
                        //maxHeight: '100vh',   // ⬅️ enlève la limite par défaut
                        display: 'flex',
                        flexDirection: 'column',
                    },
                    // 🔹 Bordures générées par `DialogContent dividers`
                    '& .MuiDialogContent-dividers': {
                        borderTopColor: 'rgba(255,255,255,0.2)',    // ou une couleur de ton thème
                        borderBottomColor: 'rgba(255,255,255,0.2)',
                    },

                    // 🔹 Si tu utilises aussi des <Divider /> à l’intérieur
                    '& .MuiDivider-root': {
                        borderColor: 'rgba(255,255,255,0.2)',
                    },
                }}
            >
                <DialogTitle id="scroll-dialog-title">
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
                            <IconProfile />
                            <Stack>
                                <Typography variant='h4'>{changeUser?.getCompleteName?.() || '---'}</Typography>
                                <Typography variant='h5' color='greyLight'>{t(changeUser?.role, { ns: NS_ROLES }) || '---'}</Typography>
                            </Stack>
                        </Stack>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                    </Stack>
                </DialogTitle>
                <DialogContent dividers={scroll === 'paper'} sx={{ p: { xs: 1, md: 2 } }}>
                    <Stack spacing={2.5}>
                        <Stack spacing={1} alignItems={'center'} sx={{ width: '100%' }}>
                            {
                                changeUser?.showAvatar({ size: 70, fontSize: '18px' })
                            }
                            <BadgeStatusUser status={changeUser?.status} />
                            <Typography>{changeUser?.email_academy}</Typography>
                            {
                                /*
                                <ComputerIconLarge status={device.status} />
                            <StatusBadge status={device.status} big />
                            
                            <TypographyComponent title={t('uid')} value={device.uid} />
                                */
                            }
                        </Stack>
                        <Stack spacing={1} sx={{ width: '100%' }}>
                            <DialogTypographyComponent title="Nom(s)" value={changeUser?.last_name || '---'} />
                            <DialogTypographyComponent title="Prénom(s)" value={changeUser?.first_name || '---'} />
                            <DialogTypographyComponent title="Nom d'utilisateur" value={changeUser?.display_name || '---'} />
                            <DialogTypographyComponent title="Email compte" value={cutString(changeUser?.email_academy, 20) || '---'} />
                            <DialogTypographyComponent title="Role compte" value={t(changeUser?.role, { ns: NS_ROLES }) || '---'} />
                            <DialogTypographyComponent title="Date de naissance" value={getFormattedDate(changeUser?.birthday, lang) || '---'} />
                            <DialogTypographyComponent title="Email personnelle" value={changeUser?.email || '---'} />
                            <DialogTypographyComponent title="Téléphone" value={changeUser?.phone_number || '---'} />
                            <DialogTypographyComponent title="Langue" value={t(changeUser?.preferred_language, { ns: NS_LANGS }) || '---'} />

                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ minHeight: '20px' }}>
                    <Stack sx={{ width: '100%' }} spacing={1} alignItems={'end'}>
                        <Stack sx={{ width: '100%' }} spacing={1} alignItems={'start'}>
                            <Typography variant="caption">{`Dernière connexion : ${getFormattedDateCompleteNumeric(changeUser?.last_active_time) || '---'}`}</Typography>
                            <Typography variant="caption">{`Date création : ${getFormattedDateCompleteNumeric(changeUser?.created_time) || '---'}`}</Typography>
                            <Typography variant="caption">{`Date modification : ${getFormattedDateCompleteNumeric(changeUser?.last_edit_time) || '---'}`}</Typography>
                        </Stack>
                        <Button variant='contained' onClick={async () => {

                        }}>{t('btn-edit')}</Button>
                    </Stack>


                </DialogActions>
            </Dialog>
        </Stack>
    );
}