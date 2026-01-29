"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Stack, CircularProgress, Grid, Box, Typography } from "@mui/material";
import { ClassSession, ClassSessionSlot } from "@/classes/ClassSession";
import { ClassUserTeacher } from "@/classes/users/ClassUser";
import { ClassLesson } from "@/classes/ClassLesson";
import { useAuth } from "@/contexts/AuthProvider";
import { SessionProvider, useSession } from "@/contexts/SessionProvider";
import { LessonTeacherProvider, useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import { useUsers } from "@/contexts/UsersProvider";
import { NS_DASHBOARD_MENU, NS_BUTTONS, NS_LANGS } from "@/contexts/i18n/settings";
import { PAGE_TEACHER_SESSIONS_LIST } from "@/contexts/constants/constants_pages";
import { IconLessons, IconCategory, IconDuration, IconLevel, IconTranslation } from "@/assets/icons/IconsComponent";
import TeacherPageWrapper from "@/components/wrappers/TeacherPageWrapper";
import SessionCreateComponent from "@/components/dashboard/sessions/SessionCreateComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import AlertComponent from "@/components/elements/AlertComponent";
import DialogConfirmAction from "@/components/dashboard/elements/DialogConfirmAction";
import { isValidURL, formatDuration } from "@/contexts/functions";
import Image from "next/image";
import { LessonProvider } from "@/contexts/LessonProvider";

function MetaChip({ label, value }) {
    return (
        <>
            <div className="meta-chip">
                <span className="meta-label">{label}</span>
                <span className="meta-value">{value}</span>
            </div>
            <style jsx>{`
                .meta-chip {
                    border-radius: 999px;
                    border: 0.1px solid var(--card-border);
                    background: transparent;
                    padding: 4px 10px;
                    font-size: 0.78rem;
                    display: inline-flex;
                    gap: 6px;
                }
                .meta-label {
                    color: var(--font-color);
                }
                .meta-value {
                    color: #9ca3af;
                    font-weight: 500;
                }
            `}</style>
        </>
    );
}

function MetaChipIcon({ label, value, icon = <></> }) {
    return (
        <>
            <div className="meta-chip">
                <Stack alignItems={'center'} direction={'row'} spacing={0.5}>
                    <Stack justifyContent={'center'}>
                        <Box sx={{
                            background: 'var(--primary)',
                            color: 'var(--card-color)',
                            border: '0.1px solid var(--primary)',
                            borderRadius: '50%',
                            p: 0.3,
                        }}>
                            {icon}
                        </Box>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'} spacing={0.25}>
                        {label && (
                            <Typography className="meta-label" sx={{
                                fontSize: '0.85rem',
                                color: 'var(--grey-dark)',
                                fontWeight: 500,
                            }}>{label}</Typography>
                        )}
                        <Typography
                            className="meta-value"
                            sx={{
                                width: '100%',
                                fontSize: '0.8rem',
                                color: 'var(--font-color)',
                                fontWeight: 400,
                            }}>{value}</Typography>
                    </Stack>
                </Stack>
            </div>
            <style jsx>{`
                .meta-chip {
                    border-radius: 999px;
                    border: 0.1px solid var(--card-border);
                    background: transparent;
                    padding: 4px 10px;
                    font-size: 0.78rem;
                    display: inline-flex;
                    gap: 6px;
                }
                .meta-label {
                    color: var(--font-color);
                }
                .meta-value {
                    color: var(--font-color);
                    font-weight: 500;
                    font-size: 0.85rem;
                }
            `}</style>
        </>
    );
}

function EditSessionContent() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { uid: uidTeacher, uidSession } = params;
    const { t } = useTranslation([ClassSession.NS_COLLECTION, NS_DASHBOARD_MENU, NS_BUTTONS, NS_LANGS]);
    const { lesson, lessons: lessonsTeacher, isLoading: isLoadingLesson, changeLesson, setUidLesson } = useLessonTeacher();
    const { session, update, isLoading: isLoadingSession, setUidSession } = useSession();
    const { getOneUser } = useUsers();
    const errorsTranslate = t('errors', { returnObjects: true });
    const dialogTranslate = t('dialog', { returnObjects: true });

    const [sessionEdit, setSessionEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [disabledUpdate, setDisabledUpdate] = useState(true);
    const [wantUpdate, setWantUpdate] = useState(false);
console.log("is loading", isLoadingLesson, isLoadingSession, !session,!sessionEdit)
    // Charger la session depuis le provider
    useEffect(() => {
        if (uidSession) {
            setUidSession(uidSession);
        }
    }, [uidSession]);

    // Initialiser sessionEdit avec la session chargée
    useEffect(() => {
        if (session && !sessionEdit) {
            console.log("SESSION useEffect", session);
            // Cloner la session pour l'édition
            const clonedSession = session.clone();
            clonedSession.lesson = session.lesson;
            clonedSession.teacher = session.teacher;
            clonedSession.room = session.room;
            setSessionEdit(clonedSession);
            setUidLesson(session.uid_lesson);
        }
        console.log("leeeeewojs", session?.uid_lesson_source);
    }, [session]);

    // Mettre à jour le lesson dans useLessonTeacher quand uid_lesson change
    const lastUidLessonRef = useRef(null);
    useEffect(() => {
        const currentUidLesson = sessionEdit?.uid_lesson;

        if (lastUidLessonRef.current === currentUidLesson) {
            return;
        }

        if (currentUidLesson && lessonsTeacher?.length > 0) {
            const lessonTeacher = lessonsTeacher.find(lt => lt.uid_lesson === currentUidLesson);
            if (lessonTeacher) {
                lastUidLessonRef.current = currentUidLesson;
                changeLesson(lessonTeacher.uid);
            } else {
                lastUidLessonRef.current = null;
                changeLesson('', 'create');
            }
        } else if (!currentUidLesson) {
            if (lastUidLessonRef.current !== null) {
                lastUidLessonRef.current = null;
                changeLesson('', 'create');
            }
        }
    }, [sessionEdit?.uid_lesson, lessonsTeacher?.length]);

    // Vérifier si tous les champs requis sont remplis
    const isFormValid = useMemo(() => {
        if (!sessionEdit) return false;

        const slot = sessionEdit.slots?.[0];
        if (!slot) return false;

        // Champs de base requis
        if (!sessionEdit.uid_lesson) return false;
        if (!sessionEdit.uid_teacher) return false;
        if (!slot.start_date) return false;
        if (!slot.duration || slot.duration <= 0) return false;
        if (!slot.lang) return false;
        if (!slot.level) return false;
        if (!slot.format) return false;

        // Validation conditionnelle selon le format
        if (slot.format === ClassSession.FORMAT.HYBRID ||
            slot.format === ClassSession.FORMAT.ONLINE) {
            if (!slot.seats_availables_online || slot.seats_availables_online <= 0) {
                return false;
            }
        }

        if (slot.format === ClassSession.FORMAT.HYBRID ||
            slot.format === ClassSession.FORMAT.ONSITE) {
            if (!slot.seats_availables_onsite || slot.seats_availables_onsite <= 0) {
                return false;
            }
        }

        return true;
    }, [sessionEdit]);

    // Détecter les changements entre session et sessionEdit
    const hasChanges = useMemo(() => {
        if (!session || !sessionEdit) return false;

        // Comparer les propriétés de la session
        if (session.uid_lesson !== sessionEdit.uid_lesson) return true;
        if (session.uid_teacher !== sessionEdit.uid_teacher) return true;
        if (session.price !== sessionEdit.price) return true;
        if (session.currency !== sessionEdit.currency) return true;

        // Comparer le slot
        const originalSlot = session.slots?.[0];
        const editedSlot = sessionEdit.slots?.[0];
        if (!originalSlot || !editedSlot) return false;

        // Comparer les dates
        if (originalSlot.start_date?.getTime() !== editedSlot.start_date?.getTime()) return true;
        if (originalSlot.end_date?.getTime() !== editedSlot.end_date?.getTime()) return true;

        // Comparer les autres propriétés du slot
        if (originalSlot.duration !== editedSlot.duration) return true;
        if (originalSlot.lang !== editedSlot.lang) return true;
        if (originalSlot.level !== editedSlot.level) return true;
        if (originalSlot.format !== editedSlot.format) return true;
        if (originalSlot.seats_availables_online !== editedSlot.seats_availables_online) return true;
        if (originalSlot.seats_availables_onsite !== editedSlot.seats_availables_onsite) return true;
        if (originalSlot.url !== editedSlot.url) return true;
        if (originalSlot.location !== editedSlot.location) return true;

        return false;
    }, [session, sessionEdit]);

    // Mettre à jour l'état du bouton selon la validité du formulaire et les changements
    useEffect(() => {
        // En mode edit, le bouton doit être désactivé s'il n'y a pas de changements OU si le formulaire n'est pas valide OU si on est en train de traiter
        setDisabledUpdate(!hasChanges || !isFormValid || processing);
    }, [hasChanges, isFormValid, processing]);

    // Fonction pour réinitialiser les données
    const handleReset = () => {
        if (session) {
            const clonedSession = session.clone();
            clonedSession.lesson = session.lesson;
            clonedSession.teacher = session.teacher;
            clonedSession.room = session.room;
            setSessionEdit(clonedSession);
            setErrors({});
        }
    };

    // Validation et mise à jour de la session
    const onUpdateSession = async () => {
        setProcessing(true);
        const _errors = {};

        try {
            setErrors({});
            setDisabledUpdate(false);

            // Validation des champs requis
            if (!sessionEdit?.uid_lesson) {
                _errors.uid_lesson = errorsTranslate.uid_lesson;
            }
            if (!sessionEdit?.uid_teacher) {
                _errors.uid_teacher = errorsTranslate.uid_teacher;
            }
            if (!sessionEdit?.slots?.[0]?.start_date) {
                _errors.start_date = errorsTranslate.start_date;
            }
            if (!sessionEdit?.slots?.[0]?.duration) {
                _errors.duration = errorsTranslate.duration;
            }
            if (!sessionEdit?.slots?.[0]?.lang) {
                _errors.lang = errorsTranslate.lang;
            }
            if (!sessionEdit?.slots?.[0]?.level) {
                _errors.level = errorsTranslate.level;
            }
            if (!sessionEdit?.slots?.[0]?.format) {
                _errors.format = errorsTranslate.format;
            }
            if (sessionEdit?.slots?.[0]?.format === ClassSession.FORMAT.HYBRID ||
                sessionEdit?.slots?.[0]?.format === ClassSession.FORMAT.ONLINE) {
                if (!sessionEdit?.slots?.[0].seats_availables_online ||
                    sessionEdit?.slots?.[0].seats_availables_online <= 0) {
                    _errors.seats_availables_online = errorsTranslate.seats_availables_online;
                }
            }
            if (sessionEdit?.slots?.[0]?.format === ClassSession.FORMAT.HYBRID ||
                sessionEdit?.slots?.[0]?.format === ClassSession.FORMAT.ONSITE) {
                if (!sessionEdit?.slots?.[0].seats_availables_onsite ||
                    sessionEdit?.slots?.[0].seats_availables_onsite <= 0) {
                    _errors.seats_availables_onsite = errorsTranslate.seats_availables_onsite;
                }
            }
            if (sessionEdit?.slots?.[0]?.url?.length > 0 &&
                !isValidURL(sessionEdit?.slots?.[0]?.url)) {
                _errors.url = errorsTranslate['url-invalid'];
            }

            if (Object.keys(_errors).length > 0) {
                _errors.main = errorsTranslate['before-continue'];
                setErrors(_errors);
                setDisabledUpdate(true);
                return;
            }

            // Calculer last_subscribe_time (3 heures avant le début)
            const start_date = sessionEdit?.slots?.[0]?.start_date;
            const last_subscribe_time = new Date(start_date);
            last_subscribe_time.setHours(last_subscribe_time.getHours() - 3);
            const slot = sessionEdit.slots?.[0] || new ClassSessionSlot();
            slot.update({ last_subscribe_time: last_subscribe_time });
            sessionEdit.update({ slots: [slot] });

            // Mettre à jour la session
            const updatedSession = await update(sessionEdit);

            if (updatedSession) {
                // Rediriger vers la page des sessions
                router.push(PAGE_TEACHER_SESSIONS_LIST(uidTeacher));
            }
        } catch (error) {
            console.log("ERROR", error);
            _errors.main = errorsTranslate['main'];
            setErrors(_errors);
        } finally {
            setProcessing(false);
            setWantUpdate(false);
        }
    };

    const handleConfirmUpdate = async () => {
        await onUpdateSession();
    };

    const isAuthorized = useMemo(() => {
        return user instanceof ClassUserTeacher && user?.uid === uidTeacher;
    }, [user, uidTeacher]);

    const slot = sessionEdit?.slots?.[0] || session?.slots?.[0];

    if (isLoadingLesson || isLoadingSession || !session || !sessionEdit) {
        return (
            <TeacherPageWrapper
                titles={[
                    { name: t('sessions', { ns: NS_DASHBOARD_MENU }), url: PAGE_TEACHER_SESSIONS_LIST(uidTeacher) },
                    { name: dialogTranslate['title-edit-session'] || 'Modifier la session', url: '' }
                ]}
                isAuthorized={isAuthorized}
                icon={<IconLessons />}
            >
                <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
                    <CircularProgress size={24} color="primary" />
                </Stack>
            </TeacherPageWrapper>
        );
    }

    return (
        <TeacherPageWrapper
            titles={[
                { name: t('sessions', { ns: NS_DASHBOARD_MENU }), url: PAGE_TEACHER_SESSIONS_LIST(uidTeacher) },
                { name: dialogTranslate['title-edit-session'] || 'Modifier la session', url: '' }
            ]}
            isAuthorized={isAuthorized}
            icon={<IconLessons />}
        >
            <Stack spacing={3} sx={{ width: '100%', minHeight: '100%' }}>
                {/* Card avec les informations du cours */}
                {session?.lesson && (
                    <Box
                        sx={{
                            background: 'var(--card-color)',
                            borderRadius: '18px',
                            border: '0.1px solid var(--card-border)',
                            padding: '18px',
                            marginBottom: '10px',
                        }}
                    >
                        <Grid spacing={1.5} container>
                            <Grid size={{ xs: 12, sm: 7 }}>
                                <Stack spacing={1}>
                                    <div>
                                        <div style={{ marginBottom: '5px' }}>
                                            <MetaChip
                                                value={t(session?.lesson?.category, { ns: ClassLesson.NS_COLLECTION })}
                                            />
                                        </div>
                                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                            {session?.lesson?.translate?.title}
                                        </Typography>
                                        <Grid container spacing={1} sx={{ marginY: 1, width: '100%' }}>
                                            {slot?.level && (
                                                <Grid size={'auto'}>
                                                    <MetaChipIcon
                                                        value={t(slot?.level)}
                                                        icon={<IconLevel height={16} width={16} />}
                                                    />
                                                </Grid>
                                            )}
                                            {slot?.duration && (
                                                <Grid size={'auto'}>
                                                    <MetaChipIcon
                                                        value={formatDuration(slot?.duration)}
                                                        icon={<IconDuration height={16} width={16} />}
                                                    />
                                                </Grid>
                                            )}
                                            {slot?.lang && (
                                                <Grid size={'auto'}>
                                                    <MetaChipIcon
                                                        value={t(slot?.lang, { ns: NS_LANGS })}
                                                        icon={<IconTranslation height={16} width={16} />}
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>
                                    </div>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 5 }}>
                                <Box sx={{ width: '100%' }}>
                                    {(session?.lesson?.photo_url || session?.lesson?.translate?.photo_url) && (
                                        <Image
                                            src={session?.lesson?.photo_url || session?.lesson?.translate?.photo_url}
                                            alt={`lesson-${session?.lesson?.uid}`}
                                            quality={100}
                                            width={300}
                                            height={150}
                                            priority
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                <SessionCreateComponent
                    sessionNew={sessionEdit}
                    setSessionNew={setSessionEdit}
                    errors={errors}
                    setErrors={setErrors}
                    mode="edit"
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
                    {errors.main && (
                        <AlertComponent severity="error" title={errors.main} />
                    )}
                    <ButtonCancel
                        label={hasChanges ? (t('reset', { ns: NS_BUTTONS }) || 'Réinitialiser') : (t('back', { ns: NS_BUTTONS }) || 'Annuler')}
                        onClick={hasChanges ? handleReset : () => router.back()}
                    />
                    <ButtonConfirm
                        label={dialogTranslate['btn-update-session'] || 'Modifier'}
                        loading={processing}
                        disabled={disabledUpdate}
                        onClick={() => setWantUpdate(true)}
                    />
                </Stack>
            </Stack>
            <DialogConfirmAction
                title={dialogTranslate['title-edit-session'] || "Modifier cette session ?"}
                setOpen={setWantUpdate}
                open={wantUpdate}
                actionCancel={() => setWantUpdate(false)}
                actionConfirm={handleConfirmUpdate}
                labelConfirm={dialogTranslate['btn-update-session'] || "Modifier"}
                labelCancel={t('back', { ns: NS_BUTTONS }) || 'Annuler'}
            />
        </TeacherPageWrapper>
    );
}

export default function EditSessionPage() {
    const params = useParams();
    const { uid: uidTeacher, uidLesson, uidSession } = params;
    return (
        <LessonProvider uidTeacher={uidTeacher}>
            <LessonTeacherProvider uidTeacher={uidTeacher}>
                <SessionProvider uidTeacher={uidTeacher}>
                    <EditSessionContent />
                </SessionProvider>
            </LessonTeacherProvider>
        </LessonProvider>
    );
}
