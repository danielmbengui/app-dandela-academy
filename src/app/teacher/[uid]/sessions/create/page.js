"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Stack, CircularProgress } from "@mui/material";
import { ClassSession, ClassSessionSlot } from "@/classes/ClassSession";
import { ClassUserTeacher } from "@/classes/users/ClassUser";
import { useAuth } from "@/contexts/AuthProvider";
import { useSession } from "@/contexts/SessionProvider";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import { useUsers } from "@/contexts/UsersProvider";
import { NS_DASHBOARD_MENU, NS_BUTTONS } from "@/contexts/i18n/settings";
import { PAGE_TEACHER_SESSIONS_LIST } from "@/contexts/constants/constants_pages";
import { IconLessons } from "@/assets/icons/IconsComponent";
import TeacherPageWrapper from "@/components/wrappers/TeacherPageWrapper";
import SessionCreateComponent from "@/components/dashboard/sessions/SessionCreateComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import AlertComponent from "@/components/elements/AlertComponent";
import DialogConfirmAction from "@/components/dashboard/elements/DialogConfirmAction";
import { isValidURL } from "@/contexts/functions";

function CreateSessionContent() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { uid: uidTeacher } = params;
    const { t } = useTranslation([ClassSession.NS_COLLECTION, NS_DASHBOARD_MENU, NS_BUTTONS]);
    const { lesson, lessons: lessonsTeacher, isLoading: isLoadingLesson, changeLesson } = useLessonTeacher();
    const { create } = useSession();
    const { getOneUser } = useUsers();
    const errorsTranslate = t('errors', { returnObjects: true });
    const dialogTranslate = t('dialog', { returnObjects: true });

    const [sessionNew, setSessionNew] = useState(null);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [disabledCreate, setDisabledCreate] = useState(true);
    const [wantCreate, setWantCreate] = useState(false);

    // Récupérer le teacher depuis l'uid
    const teacher = useMemo(() => {
        if (uidTeacher) {
            return getOneUser(uidTeacher) || (user instanceof ClassUserTeacher && user.uid === uidTeacher ? user : null);
        }
        return null;
    }, [uidTeacher, getOneUser, user]);

    // Référence pour éviter les réinitialisations multiples
    const initializedRef = useRef(false);
    const uidTeacherRef = useRef(uidTeacher);

    // Initialiser la session avec uid_teacher pré-rempli
    useEffect(() => {
        // Réinitialiser le flag si uidTeacher change
        if (uidTeacherRef.current !== uidTeacher) {
            uidTeacherRef.current = uidTeacher;
            initializedRef.current = false;
        }

        if (uidTeacher && !isLoadingLesson && !initializedRef.current && !sessionNew) {
            initializedRef.current = true;
            const defaultSlot = new ClassSessionSlot({
                uid_intern: 1,
                status: ClassSessionSlot.STATUS.OPEN,
            });
            const newSession = new ClassSession({
                uid_teacher: uidTeacher,
                teacher: teacher,
                slots: [defaultSlot],
            });
            setSessionNew(newSession);
        }
    }, [uidTeacher, isLoadingLesson]);

    // Mettre à jour le lesson dans useLessonTeacher quand uid_lesson change
    const lastUidLessonRef = useRef(null);
    useEffect(() => {
        const currentUidLesson = sessionNew?.uid_lesson;
        
        // Éviter les appels multiples pour la même valeur
        if (lastUidLessonRef.current === currentUidLesson) {
            return;
        }
        
        if (currentUidLesson && lessonsTeacher?.length > 0) {
            // Trouver le ClassLessonTeacher correspondant au uid_lesson sélectionné
            const lessonTeacher = lessonsTeacher.find(lt => lt.uid_lesson === currentUidLesson);
            if (lessonTeacher) {
                lastUidLessonRef.current = currentUidLesson;
                // Mettre à jour le lesson dans useLessonTeacher
                changeLesson(lessonTeacher.uid);
            } else {
                lastUidLessonRef.current = null;
                // Si aucun ClassLessonTeacher trouvé, réinitialiser
                changeLesson('', 'create');
            }
        } else if (!currentUidLesson) {
            if (lastUidLessonRef.current !== null) {
                lastUidLessonRef.current = null;
                // Si aucun uid_lesson sélectionné, réinitialiser
                changeLesson('', 'create');
            }
        }
    }, [sessionNew?.uid_lesson, lessonsTeacher?.length]);

    // Vérifier si tous les champs requis sont remplis
    const isFormValid = useMemo(() => {
        if (!sessionNew) return false;
        
        const slot = sessionNew.slots?.[0];
        if (!slot) return false;

        // Champs de base requis
        if (!sessionNew.uid_lesson) return false;
        if (!sessionNew.uid_teacher) return false;
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

        // Vérifier que la date de début n'est pas dans le passé
        if (slot.start_date) {
            const startDate = slot.start_date instanceof Date ? slot.start_date : new Date(slot.start_date);
            if (startDate < new Date()) {
                return false;
            }
        }

        return true;
    }, [sessionNew]);

    // Mettre à jour l'état du bouton selon la validité du formulaire
    useEffect(() => {
        setDisabledCreate(!isFormValid || processing);
    }, [isFormValid, processing]);

    // Validation et création de la session
    const onCreateSession = async () => {
        setProcessing(true);
        const _errors = {};

        try {
            setErrors({});
            setDisabledCreate(false);

            // Validation des champs requis
            if (!sessionNew?.uid_lesson) {
                _errors.uid_lesson = errorsTranslate.uid_lesson;
            }
            if (!sessionNew?.uid_teacher) {
                _errors.uid_teacher = errorsTranslate.uid_teacher;
            }
            if (!sessionNew?.slots?.[0]?.start_date) {
                _errors.start_date = errorsTranslate.start_date;
            } else {
                if (sessionNew?.slots?.[0]?.start_date < new Date()) {
                    _errors.start_hour = errorsTranslate.start_hour_before;
                }
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
            if (sessionNew?.slots?.[0]?.format === ClassSession.FORMAT.HYBRID || 
                sessionNew?.slots?.[0]?.format === ClassSession.FORMAT.ONLINE) {
                if (!sessionNew?.slots?.[0].seats_availables_online || 
                    sessionNew?.slots?.[0].seats_availables_online <= 0) {
                    _errors.seats_availables_online = errorsTranslate.seats_availables_online;
                }
            }
            if (sessionNew?.slots?.[0]?.format === ClassSession.FORMAT.HYBRID || 
                sessionNew?.slots?.[0]?.format === ClassSession.FORMAT.ONSITE) {
                if (!sessionNew?.slots?.[0].seats_availables_onsite || 
                    sessionNew?.slots?.[0].seats_availables_onsite <= 0) {
                    _errors.seats_availables_onsite = errorsTranslate.seats_availables_onsite;
                }
            }
            if (sessionNew?.slots?.[0]?.url?.length > 0 && 
                !isValidURL(sessionNew?.slots?.[0]?.url)) {
                _errors.url = errorsTranslate['url-invalid'];
            }

            if (Object.keys(_errors).length > 0) {
                _errors.main = errorsTranslate['before-continue'];
                setErrors(_errors);
                setDisabledCreate(true);
                return;
            }

            // Calculer last_subscribe_time (3 heures avant le début)
            const start_date = sessionNew?.slots?.[0]?.start_date;
            const last_subscribe_time = new Date(start_date);
            last_subscribe_time.setHours(last_subscribe_time.getHours() - 3);
            const slot = sessionNew.slots?.[0] || new ClassSessionSlot();
            slot.update({ last_subscribe_time: last_subscribe_time });
            sessionNew.update({ slots: [slot] });

            // Créer la session
            const createdSession = await create(sessionNew);
            
            if (createdSession) {
                // Rediriger vers la page des sessions
                router.push(PAGE_TEACHER_SESSIONS_LIST(uidTeacher));
            }
        } catch (error) {
            console.log("ERROR", error);
            _errors.main = errorsTranslate['main'];
            setErrors(_errors);
        } finally {
            setProcessing(false);
            setWantCreate(false);
        }
    };

    const handleConfirmCreate = async () => {
        await onCreateSession();
    };

    const isAuthorized = useMemo(() => {
        return user instanceof ClassUserTeacher && user?.uid === uidTeacher;
    }, [user, uidTeacher]);

    if (isLoadingLesson) {
        return (
            <TeacherPageWrapper
                titles={[
                    { name: t('sessions', { ns: NS_DASHBOARD_MENU }), url: PAGE_TEACHER_SESSIONS_LIST(uidTeacher) },
                    { name: dialogTranslate['title-create-session'], url: '' }
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
                { name: dialogTranslate['title-create-session'], url: '' }
            ]}
            isAuthorized={isAuthorized}
            icon={<IconLessons />}
        >
            <Stack spacing={3} sx={{ width: '100%', minHeight: '100%' }}>
                <SessionCreateComponent
                    sessionNew={sessionNew}
                    setSessionNew={setSessionNew}
                    errors={errors}
                    setErrors={setErrors}
                    mode="create"
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
                    {errors.main && (
                        <AlertComponent severity="error" title={errors.main} />
                    )}
                    <ButtonCancel
                        label={t('back', { ns: NS_BUTTONS }) || 'Annuler'}
                        onClick={() => router.back()}
                    />
                    <ButtonConfirm
                        label={dialogTranslate['btn-create-session']}
                        loading={processing}
                        disabled={disabledCreate}
                        onClick={() => setWantCreate(true)}
                    />
                </Stack>
            </Stack>
            <DialogConfirmAction
                title={dialogTranslate['title-create-session'] || "Créer cette session ?"}
                setOpen={setWantCreate}
                open={wantCreate}
                actionCancel={() => setWantCreate(false)}
                actionConfirm={handleConfirmCreate}
                labelConfirm={dialogTranslate['btn-create-session'] || "Créer"}
                labelCancel={t('back', { ns: NS_BUTTONS }) || 'Annuler'}
            />
        </TeacherPageWrapper>
    );
}

export default function CreateSessionPage() {
    return <CreateSessionContent />;
}
