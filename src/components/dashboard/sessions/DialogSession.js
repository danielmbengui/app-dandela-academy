import React, { useEffect, useState } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from "@mui/material";
import { IconCalendar, IconCertificate, IconEdit, IconHour, IconLessons, IconProfile, IconTeachers } from "@/assets/icons/IconsComponent";
import CloseIcon from '@mui/icons-material/Close';
import { useLanguage } from "@/contexts/LangProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import ButtonCancel from "../elements/ButtonCancel";
import SessionComponent from "./SessionComponent";
import { getFormattedDateNumeric, getFormattedHour, isValidURL } from "@/contexts/functions";
import DialogSubscribeSession from "./DialogSubscribeSession";
import { useSession } from "@/contexts/SessionProvider";
import { ClassLesson } from "@/classes/ClassLesson";
import { useTranslation } from "react-i18next";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClassSession, ClassSessionSlot } from "@/classes/ClassSession";
import ButtonConfirm from "../elements/ButtonConfirm";
import { useAuth } from "@/contexts/AuthProvider";
import { ClassUserAdministrator, ClassUserIntern } from "@/classes/users/ClassUser";
import SessionCreateComponent from "./SessionCreateComponent";
import AlertComponent from "@/components/elements/AlertComponent";
import { ClassHardware } from "@/classes/ClassDevice";

function MetaChipTitle({ label, value, status = '' }) {
    const STATUS_CONFIG = ClassSession.STATUS_CONFIG;
    const colors = STATUS_CONFIG[status] || [];
    const Icon = () => {
        switch (label) {
            case 'certified':
                return <IconCertificate height={14} width={14} />;
            case 'date':
                return <IconCalendar height={14} width={14} />;
            case 'hour':
                return <IconHour height={14} width={14} />;
            case 'teacher':
                return <IconTeachers height={14} width={14} />;
            default:
                return null;
        }
    }
    console.log("STATUS", status)
    return (
        <>
            <div className="meta-chip">
                <Icon />
                <span className="meta-value">{value}</span>
            </div>

            <style jsx>{`
        .meta-chip {
          border-radius: 999px;
          background: #020617;
          background: transparent;
          border: 0.1px solid ${colors?.color};
          padding: 4px 7px;
          font-size: 0.78rem;
          display: inline-flex;
          gap: 6px;
          color: ${colors?.color};
        }

        .meta-label {
          color: #9ca3af;
          color: var(--font-color);
        }

        .meta-value {
          color: var(--font-color);
          font-weight: 500;
        }
      `}</style>
        </>
    );
}
export default function DialogSession({ mode = '', setMode = null, isOpen = false, setIsOpen = null }) {
    const { t } = useTranslation([ClassSession.NS_COLLECTION]);
    const errorsTranslate = t('errors', { returnObjects: true });
    const { user } = useAuth();
    const STATUS_CONFIG = ClassSession.STATUS_CONFIG;
    const { session, slot, setUidSession, setUidSlot } = useSession();
    const colors = STATUS_CONFIG[slot?.status] || [];
    const { lang } = useLanguage();
    const path = usePathname();
    const [sessionNew, setSessionNew] = useState(null);
    const [errors, setErrors] = useState({});
    const { theme } = useThemeMode();
    const { blueDark, primary, cardColor, text, greyLight } = theme.palette;
    const [wantSubscribe, setWantSubscribe] = useState(false);
    const [disabledCreate, setDisabledCreate] = useState(false);
    const [processing, setProcessing] = useState(false);

    console.log("PAAATH ERRORS", errors)
    const handleClose = () => {
        console.log("click close")
        setUidSession(null);
        setUidSlot(null);
        setIsOpen(false);
        setMode('');
    };
    useEffect(() => {
        var disabled = false;

        setDisabledCreate(disabled);
    }, [sessionNew]);

    const onSubmit = async () => {
        setProcessing(true);
        const _errors = {};
        try {
            setErrors({});
            setDisabledCreate(false);
            if (!sessionNew?.uid_lesson) {
                _errors.uid_lesson = errorsTranslate.uid_lesson;
            }
            if (!sessionNew?.uid_teacher) {
                _errors.uid_teacher = errorsTranslate.uid_teacher;
            }
            if (!sessionNew?.slots?.[0]?.start_date) {
                _errors.start_date = errorsTranslate.start_date;
            }
            if (!sessionNew?.slots?.[0]?.duration) {
                _errors.duration = errorsTranslate.duration;
            }
            if (!sessionNew?.slots?.[0]?.lang) {
                _errors.lang = errorsTranslate.lang;
            }
            if (!sessionNew?.slots?.[0]?.level) {
                _errors.level = errorsTranslate.level;
            }
            if (!sessionNew?.slots?.[0]?.format) {
                _errors.format = errorsTranslate.format;
            }
            if (sessionNew?.slots?.[0]?.format === ClassSession.FORMAT.HYBRID || sessionNew?.slots?.[0]?.format === ClassSession.FORMAT.ONLINE) {
                if (!sessionNew?.slots?.[0].seats_availables_online || sessionNew?.slots?.[0].seats_availables_online <= 0) {
                    _errors.seats_availables_online = errorsTranslate.seats_availables_online;
                }
            }
            if (sessionNew?.slots?.[0]?.url?.length > 0 && !isValidURL(sessionNew?.slots?.[0]?.url)) {
                _errors.url = errorsTranslate['url-invalid'];
            }
            if (Object.keys(_errors).length > 0) {
                _errors.main = errorsTranslate['before-continue'];
                setErrors(_errors);
                setDisabledCreate(true);
                return;
            }
            /*
            if (sessionNew?.slots?.[0]?.format === ClassSession.FORMAT.HYBRID || sessionNew?.slots?.[0]?.format === ClassSession.FORMAT.ONSITE) {
                var count = sessionNew?.room?.computers?.filter(item => item.status === ClassHardware.STATUS.AVAILABLE || item.status === ClassHardware.STATUS.BUSY).length || 0;
                sessionNew?.slots?.[0]?.format
                const slot = sessionNew?.slots[0] || new ClassSessionSlot();
                slot.update({ seats_availables_onsite: count });
                prev.update({ slots: [slot] });
            }
            */
            //last_subscribe_time
            const start_date = sessionNew?.slots?.[0]?.start_date;
            const last_subscribe_time = new Date(start_date);
            last_subscribe_time.setHours(start_date.getHours() - 3);
            const slot = sessionNew.slots?.[0] || new ClassSessionSlot();
            slot.update({ last_subscribe_time: last_subscribe_time });
            sessionNew.update({ slots: [slot] });
            await sessionNew.createFirestore();
            handleClose();
        } catch (error) {
            console.log("ERROR", error);
            _errors.main = errorsTranslate['main'];
            setErrors(_errors);
        } finally {
            setProcessing(false);
        }
    }

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
                    //cursor:'pointer',
                    '& .MuiDialog-container': {
                        //p: 1,
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
                        padding: 0,
                        //borderRadius: 0,
                        //height: '100vh',      // ⬅️ plein écran en hauteur
                        //maxHeight: '100vh',   // ⬅️ enlève la limite par défaut
                        display: 'flex',
                        flexDirection: 'column',
                    },
                    // 🔹 Bordures générées par `DialogContent dividers`
                    '& .MuiDialogContent-dividers': {
                        //borderTopColor: cardColor.main,    // ou une couleur de ton thème
                        //borderBottomColor: greyLight.main,
                        borderTop: `0.1px solid var(--card-border)`,
                        borderBottom: `0.1px solid var(--card-border)`,
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
                            cursor: 'normal',
                        }
                    }
                }}
            >
                {
                    <>
                        <DialogTitle id="scroll-dialog-title" sx={{ background: '', py: 1.5, px: { xs: 1.5, sm: 2.5 } }}>
                            <Grid container spacing={1} sx={{ background: '' }}>
                                <Grid size={'grow'} sx={{ background: '', width: '100%' }}>
                                    <Stack spacing={0.5}>
                                        <Stack sx={{ width: '100%' }} direction={'row'} alignItems={'center'} spacing={0.5}>
                                            <IconLessons height={20} width={20} color={primary.main} />
                                            {
                                                mode !== 'create' && <Typography noWrap variant='h4' sx={{ lineHeight: '1.5rem', }}>{`${session?.code} - ${t(slot?.level, { ns: ClassLesson.NS_COLLECTION })}`}</Typography>
                                            }
                                            {
                                                mode === 'create' && <Typography noWrap variant="h4" sx={{ lineHeight: '1.5rem', }}>{`Nouvelle session`}</Typography>
                                            }
                                        </Stack>
                                        {
                                            mode !== 'create' && <Grid container spacing={0.5}>
                                                <Grid size={'auto'}>
                                                    <MetaChipTitle
                                                        status={slot?.status}
                                                        label={'date'}
                                                        value={getFormattedDateNumeric(slot?.start_date, lang)}
                                                    /></Grid>
                                                <Grid size={'auto'}>
                                                    <MetaChipTitle
                                                        status={slot?.status}
                                                        label={'hour'}
                                                        value={`${getFormattedHour(slot?.start_date, lang)}-${getFormattedHour(slot?.end_date, lang)}`}
                                                    /></Grid>
                                                <Grid size={'auto'}>
                                                    <MetaChipTitle
                                                        status={slot?.status}
                                                        label={'teacher'}
                                                        value={`${session?.teacher?.first_name?.[0]}. ${session?.teacher?.last_name}`}
                                                    /></Grid>
                                            </Grid>
                                        }
                                    </Stack>
                                </Grid>
                                <Grid size={'auto'} sx={{ background: '' }}>
                                    <Stack alignItems={'end'}>
                                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogTitle>
                        <DialogContent dividers={true} sx={{ p: { xs: 1, md: 2 }, background: 'var(--background)' }}>
                            {
                                mode === 'read' && <SessionComponent session={session} selectedSlot={slot} />
                            }
                            {
                                mode === 'create' && <SessionCreateComponent
                                    sessionNew={sessionNew}
                                    setSessionNew={setSessionNew}
                                    errors={errors}
                                    setErrors={setErrors}
                                    mode={mode} />
                            }
                        </DialogContent>
                        <DialogActions sx={{ minHeight: '20px' }}>
                            {
                                mode === 'read' && <Stack direction={'row'} spacing={1}>
                                    {
                                        !path?.startsWith(PAGE_LESSONS) && <Stack sx={{ width: '100%' }} direction={'row'} spacing={1} justifyContent={'end'} alignItems={'center'}>
                                            <Link href={`${PAGE_LESSONS}/${session?.lesson?.uid}`} target="_blank" style={{ textDecoration: 'none' }}>
                                                <ButtonCancel label={t('btn-see-lesson')} variant='outlined' />
                                            </Link>
                                        </Stack>
                                    }
                                    {
                                        user instanceof ClassUserIntern && <Box>
                                            <ButtonConfirm
                                                label={t('btn-subscribe-user')}
                                            />
                                        </Box>
                                    }
                                    {
                                        user instanceof ClassUserAdministrator && <Stack justifyContent={'center'} sx={{ background: '', cursor: 'pointer' }}>
                                            <IconEdit color="var(--primary)" />
                                        </Stack>
                                    }
                                </Stack>
                            }
                            {
                                mode === 'create' && <Stack alignItems={'center'} direction={'row'} spacing={1}>
                                    {
                                        errors.main && <AlertComponent severity="error" title={errors.main} />
                                    }
                                    {

                                        <Box>
                                            <ButtonConfirm
                                                label={'Créer'}
                                                loading={processing}
                                                disabled={disabledCreate}
                                                onClick={onSubmit}
                                            />
                                        </Box>
                                    }
                                </Stack>
                            }


                        </DialogActions>
                    </>
                }
            </Dialog>
            <DialogSubscribeSession
                //session={session}
                // selectedSlot={slot}
                open={wantSubscribe}
                setOpen={setWantSubscribe}
            />
        </Stack>
    );
}