"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Stack, CircularProgress, Grid } from "@mui/material";
import { ClassSession } from "@/classes/ClassSession";
import { ClassUserTeacher } from "@/classes/users/ClassUser";
import { ClassCountry } from "@/classes/ClassCountry";
import { useAuth } from "@/contexts/AuthProvider";
import { useSession } from "@/contexts/SessionProvider";
import { NS_DASHBOARD_MENU, NS_BUTTONS } from "@/contexts/i18n/settings";
import { PAGE_TEACHER_SESSIONS_LIST } from "@/contexts/constants/constants_pages";
import { IconSession } from "@/assets/icons/IconsComponent";
import TeacherPageWrapper from "@/components/wrappers/TeacherPageWrapper";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import AlertComponent from "@/components/elements/AlertComponent";
import DialogConfirmAction from "@/components/dashboard/elements/DialogConfirmAction";
import FieldComponent from "@/components/elements/FieldComponent";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import Preloader from "@/components/shared/Preloader";

function EditSessionContent() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    // Dans Next.js App Router avec /teacher/[uid]/sessions/[uid]
    // Le layout parent /teacher/[uid]/layout.js nous donne déjà le contexte du teacher
    // Le paramètre uid dans cette page correspond à la session
    const uidTeacher = user instanceof ClassUserTeacher ? user.uid : null;
    // Le uid de la session est dans params.uid de cette page
    // Note: Next.js met chaque segment dynamique dans params avec son nom
    // Donc params.uid ici correspond au deuxième [uid] dans la route
    const uidSession = params.uidSession;
    const { t } = useTranslation([ClassSession.NS_COLLECTION, NS_DASHBOARD_MENU, NS_BUTTONS]);
    const { session, update, setUidSession, isLoading } = useSession();
    const errorsTranslate = t('errors', { returnObjects: true });

    const [sessionEdit, setSessionEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [wantUpdate, setWantUpdate] = useState(false);

    // Charger la session
    useEffect(() => {
        if (uidSession) {
            setUidSession(uidSession);
        }
        return () => setUidSession(null);
    }, [uidSession, setUidSession]);

    // Initialiser sessionEdit avec les données de session
    useEffect(() => {
        if (session && !sessionEdit) {
            setSessionEdit(session.clone());
        }
    }, [session]);

    // Mettre à jour sessionEdit quand session change
    useEffect(() => {
        if (session) {
            setSessionEdit(session.clone());
        }
    }, [session?.uid]);

    const isAuthorized = useMemo(() => {
        return user instanceof ClassUserTeacher && user?.uid === uidTeacher;
    }, [user, uidTeacher]);

    const onChangeValue = (e) => {
        const { value, name, type } = e.target;
        setErrors(prev => ({ ...prev, [name]: '', main: '' }));
        setSessionEdit(prev => {
            if (!prev) return null;
            const updated = prev.clone();
            if (type === 'number') {
                updated[name] = parseFloat(value) || 0;
            } else {
                updated[name] = value;
            }
            return updated;
        });
    };

    const onClearValue = (name) => {
        setErrors(prev => ({ ...prev, [name]: '', main: '' }));
        setSessionEdit(prev => {
            if (!prev) return null;
            const updated = prev.clone();
            if (name === 'price' || name === 'old_price') {
                updated[name] = 0;
            } else {
                updated[name] = '';
            }
            return updated;
        });
    };

    // Validation et mise à jour de la session
    const onUpdateSession = async () => {
        setProcessing(true);
        const _errors = {};

        try {
            setErrors({});

            // Validation des champs
            if (sessionEdit?.price === undefined || sessionEdit?.price === null || sessionEdit?.price < 0) {
                _errors.price = errorsTranslate.price || "Indique un prix valide";
            }
            if (!sessionEdit?.currency || sessionEdit?.currency.trim() === '') {
                _errors.currency = errorsTranslate.currency || "Indique une devise";
            }
            if (sessionEdit?.old_price !== undefined && sessionEdit?.old_price !== null && sessionEdit?.old_price < 0) {
                _errors.old_price = "L'ancien prix doit être positif";
            }

            if (Object.keys(_errors).length > 0) {
                _errors.main = errorsTranslate['before-continue'] || "Veuillez corriger les erreurs avant de continuer";
                setErrors(_errors);
                return;
            }

            // Mettre à jour la session
            const updatedSession = await update(sessionEdit);
            
            if (updatedSession) {
                // Rediriger vers la page des sessions
                router.push(PAGE_TEACHER_SESSIONS_LIST(uidTeacher));
            }
        } catch (error) {
            console.log("ERROR", error);
            _errors.main = errorsTranslate['main'] || "Une erreur est survenue. Veuillez réessayer plus tard.";
            setErrors(_errors);
        } finally {
            setProcessing(false);
            setWantUpdate(false);
        }
    };

    const handleConfirmUpdate = async () => {
        await onUpdateSession();
    };

    if (isLoading && !session) {
        return (
            <TeacherPageWrapper
                titles={[
                    { name: t('sessions', { ns: NS_DASHBOARD_MENU }), url: PAGE_TEACHER_SESSIONS_LIST(uidTeacher) },
                    { name: t('edit_session', { ns: ClassSession.NS_COLLECTION }) || 'Modifier la session', url: '' }
                ]}
                isAuthorized={isAuthorized}
                icon={<IconSession />}
            >
                <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
                    <Preloader />
                </Stack>
            </TeacherPageWrapper>
        );
    }

    if (!session && !isLoading) {
        return (
            <TeacherPageWrapper
                titles={[
                    { name: t('sessions', { ns: NS_DASHBOARD_MENU }), url: PAGE_TEACHER_SESSIONS_LIST(uidTeacher) },
                    { name: t('not_found', { ns: ClassSession.NS_COLLECTION }) || 'Session non trouvée', url: '' }
                ]}
                isAuthorized={isAuthorized}
                icon={<IconSession />}
            >
                <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
                    <AlertComponent severity="error" title={t('not_found', { ns: ClassSession.NS_COLLECTION }) || 'Session non trouvée'} />
                    <ButtonCancel
                        label={t('back', { ns: NS_BUTTONS }) || 'Retour'}
                        onClick={() => router.push(PAGE_TEACHER_SESSIONS_LIST(uidTeacher))}
                    />
                </Stack>
            </TeacherPageWrapper>
        );
    }

    return (
        <TeacherPageWrapper
            titles={[
                { name: t('sessions', { ns: NS_DASHBOARD_MENU }), url: PAGE_TEACHER_SESSIONS_LIST(uidTeacher) },
                { name: session?.code || session?.title || t('session', { ns: ClassSession.NS_COLLECTION }), url: '' },
                { name: t('edit_session', { ns: ClassSession.NS_COLLECTION }) || 'Modifier', url: '' }
            ]}
            isAuthorized={isAuthorized}
            icon={<IconSession />}
        >
            <Stack spacing={3} sx={{ width: '100%', minHeight: '100%' }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldComponent
                            required
                            name="price"
                            type="number"
                            label={t('price', { ns: ClassSession.NS_COLLECTION })}
                            value={sessionEdit?.price || 0}
                            onChange={onChangeValue}
                            onClear={() => onClearValue('price')}
                            error={errors?.price}
                            inputProps={{ min: 0, step: 0.01 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldComponent
                            name="old_price"
                            type="number"
                            label={t('old_price', { ns: ClassSession.NS_COLLECTION })}
                            value={sessionEdit?.old_price || 0}
                            onChange={onChangeValue}
                            onClear={() => onClearValue('old_price')}
                            error={errors?.old_price}
                            inputProps={{ min: 0, step: 0.01 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <SelectComponentDark
                            required
                            name="currency"
                            label={t('currency', { ns: ClassSession.NS_COLLECTION })}
                            values={ClassCountry.CURRENCIES.map(currency => ({
                                value: currency,
                                id: currency
                            }))}
                            value={sessionEdit?.currency || ''}
                            onChange={onChangeValue}
                            hasNull={!sessionEdit?.currency}
                            error={errors?.currency}
                        />
                    </Grid>
                </Grid>

                <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
                    {errors.main && (
                        <AlertComponent severity="error" title={errors.main} />
                    )}
                    <ButtonCancel
                        label={t('back', { ns: NS_BUTTONS }) || 'Annuler'}
                        onClick={() => router.push(PAGE_TEACHER_SESSIONS_LIST(uidTeacher))}
                    />
                    <ButtonConfirm
                        label={t('btn-save', { ns: ClassSession.NS_COLLECTION }) || 'Enregistrer'}
                        loading={processing}
                        disabled={processing}
                        onClick={() => setWantUpdate(true)}
                    />
                </Stack>
            </Stack>
            <DialogConfirmAction
                title={t('dialog.title-edit-session', { ns: ClassSession.NS_COLLECTION }) || "Modifier cette session ?"}
                setOpen={setWantUpdate}
                open={wantUpdate}
                actionCancel={() => setWantUpdate(false)}
                actionConfirm={handleConfirmUpdate}
                labelConfirm={t('btn-save', { ns: ClassSession.NS_COLLECTION }) || "Enregistrer"}
                labelCancel={t('back', { ns: NS_BUTTONS }) || 'Annuler'}
            />
        </TeacherPageWrapper>
    );
}

export default function EditSessionPage() {
    return <EditSessionContent />;
}
