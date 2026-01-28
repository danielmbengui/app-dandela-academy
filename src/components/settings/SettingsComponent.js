import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import FieldComponent from "@/components/elements/FieldComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { getFormattedDateCompleteNumeric } from "@/contexts/functions";
import { languages, NS_COMMON, NS_PROFILE, NS_LANGS, NS_ROLES, NS_SETTINGS, NS_BUTTONS, NS_COMPLETE_PROFILE } from "@/contexts/i18n/settings";
import { useLanguage } from "@/contexts/LangProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { ClassUser } from "@/classes/users/ClassUser";
import { THEME_DARK, THEME_LIGHT, THEME_SYSTEM } from "@/contexts/constants/constants";
import FieldTextComponent from "@/components/elements/FieldTextComponent";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import { ClassColor } from "@/classes/ClassColor";
import { useTranslation } from "react-i18next";
import FieldPhoneComponent from "../elements/FieldPhoneComponent";
import TextFieldComponent from "../elements/TextFieldComponent";
import { ClassLessonTeacher } from "@/classes/ClassLesson";
import { ClassCountry } from "@/classes/ClassCountry";

function AccountSettingsComponent() {
    const { lang, changeLang } = useLanguage();
    const { user, update, processing } = useAuth();
    const { t } = useTranslation([NS_SETTINGS, ClassUser.NS_COLLECTION, NS_ROLES, NS_PROFILE]);
    const { theme, changeTheme, mode, modeApp } = useThemeMode();
    const { greyLight } = theme.palette;

    const [userEdit, setUserEdit] = useState(user);
    const [errors, setErrors] = useState({});
    
    useEffect(() => {
        setUserEdit(user?.clone());
    }, [user]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : type === 'date' ? new Date(value) || null : value;
        
        setUserEdit(prev => {
            if (!prev || prev === null) {
                return prev;
            }
            prev.update({ [name]: newValue });
            const updated = prev.clone();
            
            // Valider le téléphone si c'est le champ phone_number
            if (name === 'phone_number') {
                if (!value || value.trim() === '') {
                    setErrors(prev => ({ ...prev, [name]: '' }));
                } else {
                    const codeCountry = ClassCountry.extractCodeCountryFromPhoneNumber(value);
                    if (updated.isErrorPhoneNumber(codeCountry)) {
                        setErrors(prev => ({ ...prev, [name]: t('errors.phone_number', { ns: ClassUser.NS_COLLECTION }) }));
                    } else {
                        setErrors(prev => ({ ...prev, [name]: '' }));
                    }
                }
            } else {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
            
            return updated;
        });
    };
    
    const handleSave = async () => {
        if (!userEdit || processing) return;
        
        // Valider le téléphone avant de sauvegarder
        const _errors = {};
        if (userEdit.phone_number && userEdit.phone_number.trim() !== '') {
            const codeCountry = ClassCountry.extractCodeCountryFromPhoneNumber(userEdit.phone_number);
            if (userEdit.isErrorPhoneNumber(codeCountry)) {
                _errors.phone_number = t('errors.phone_number', { ns: ClassUser.NS_COLLECTION });
            }
        }
        
        setErrors(_errors);
        if (Object.keys(_errors).length > 0) {
            return;
        }
        
        try {
            const updatedUser = await userEdit.updateFirestore();
            if (updatedUser) {
                // Mettre à jour l'utilisateur dans le contexte Auth
                await update(updatedUser);
                setUserEdit(updatedUser.clone());
                setErrors({});
                console.log("Numéro de téléphone sauvegardé :", updatedUser);
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error);
        }
    };
    
    const handleReset = () => {
        if (processing) return;
        setUserEdit(user?.clone());
        setErrors({});
    };
    
    const hasChanges = useMemo(() => {
        if (!user || !userEdit) return false;
        const phoneChanged = (user.phone_number || '') !== (userEdit.phone_number || '');
        return phoneChanged;
    }, [user?.phone_number, userEdit?.phone_number]);
    
    // Désactiver le bouton save si il y a des erreurs
    const canSave = useMemo(() => {
        return hasChanges && Object.keys(errors).length === 0;
    }, [hasChanges, errors]);

    return (
        <>
            <section className="card">
                <h2>{t('title_account')}</h2>
                <Grid container alignItems={'center'} spacing={1} sx={{width:'100%', background:'re', mb:2.5}}>
                     <Grid size={'grow'}>
                      <TextFieldComponent
                        label={t('email')}
                        name={'email'}
                        type="text"
                        value={user?.email}
                        disabled={true}
                        fullWidth={true}
                        sx={{width:'100%'}}
                    />
                     </Grid>
                    <Grid size={'auto'} sx={{display:'none'}}>
                      <ButtonConfirm label={t('edit', {ns:NS_BUTTONS})} />
                    </Grid>
                </Grid>
                <div className="field">
                          <FieldPhoneComponent
                            label={t('phone_number')}
                            placeholder={t('phone_number_placeholder')}
                            type="phone"
                            name={"phone_number"}
                            value={userEdit?.phone_number || ''}
                            onChange={handleChange}
                            onClear={() => {
                                setUserEdit(prev => {
                                    if (!prev) return prev;
                                    prev.update({ phone_number: '' });
                                    return prev.clone();
                                });
                            }}
                            error={errors['phone_number']}
                            fullWidth={true}
                            style={{ width: '100%' }}
                          />
                </div>
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3, pt: 2, borderTop: '1px solid var(--card-border)' }}>
                    <ButtonCancel
                        label={t('reset', { ns: NS_BUTTONS })}
                        onClick={handleReset}
                        disabled={processing || !hasChanges}
                        loading={processing}
                        size="medium"
                    />
                    <ButtonConfirm
                        label={t('save', { ns: NS_BUTTONS })}
                        onClick={handleSave}
                        loading={processing}
                        disabled={processing || !hasChanges}
                        size="medium"
                    />
                </Stack>
                <div className="field">
                    <SelectComponentDark
                        label={t('lang')}
                        name={'lang'}
                        value={lang}
                        values={languages.map(lang => ({ id: lang, value: t(lang, { ns: NS_LANGS }) }))}
                        onChange={(e) => {
                            //console.log("NEW VALUE", e.target.value)
                            changeLang(e.target.value);
                        }}
                        hasNull={false}
                    />
                </div>
                <div className="field">
                    <SelectComponentDark
                        label={t('theme')}
                        name={'theme'}
                        //display={false}
                        value={modeApp}
                        values={[THEME_LIGHT, THEME_DARK, THEME_SYSTEM].map(_theme => ({ id: _theme, value: t(_theme, { ns: NS_COMMON }) }))}
                        onChange={(e) => {
                            //console.log("NEW VALUE", e.target.value)
                            changeTheme(e.target.value);
                        }}
                        hasNull={false}
                    />
                </div>
            </section>

            <style jsx>{`
        .page {          
          padding: 0;
          color: var(--font-color);
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          height:100%;
          padding:0px;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 15px;
        }

        .header h1 {
          margin: 0;
          font-size: 1.5rem;
          line-height: 1.5rem;
        }

        .header-actions {
          margin-left: auto;
          display: flex;
          align-items:center;
          gap: 8px;
        }

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.3rem;
        }

        .muted {
          margin: 0;
          font-size: 0.9rem;
          color: ${greyLight.main};
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .header {
            align-items: flex-start;
            flex-direction: column;
          }
          .header-actions {
            margin-left: 0;
          }
        }

        .card {
          background: var(--card-color);
          border-radius: 10px;
          padding: 20px;
          border: 1px solid var(--card-color);
          
        }

        .card h2 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 1.2rem;
        }

        .card h3 {
          margin-top: 16px;
          margin-bottom: 8px;
          font-size: 1rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
          font-size: 0.9rem;
        }

        .field label {
          margin-bottom: 4px;
          color: #9ca3af;
        }

        .field.inline {
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        input[type="text"],
        input[type="email"],
        input[type="date"],
        select {
          background: #020617;
          border-radius: 10px;
          border: 1px solid #1f2937;
          padding: 8px 10px;
          color: #e5e7eb;
          outline: none;
          font-size: 0.9rem;
        }

        input:disabled,
        select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }

        .btn {
          border-radius: 999px;
          padding: 8px 14px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .btn.primary {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border-color: transparent;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .divider {
          border: none;
          border-top: 1px solid ${ClassColor.GREY_HYPER_LIGHT};
          margin: 12px 0;
        }
      `}</style>
        </>
    );
}
function NotificationSettingsComponent() {
    const { lang, changeLang } = useLanguage();
    const { user, isLoading, update, processing } = useAuth();
    const { t } = useTranslation([NS_SETTINGS, ClassUser.NS_COLLECTION, NS_ROLES, NS_PROFILE]);
    const translateLabels = t('form', { ns: NS_PROFILE, returnObjects: true })
    const { theme, changeTheme, mode, modeApp } = useThemeMode();
    const { greyLight } = theme.palette;

    const [userEdit, setUserEdit] = useState(user);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        setUserEdit(user.clone());
    }, [user]);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setErrors(prev => ({ ...prev, [name]: '' }));
        setUserEdit(prev => {
            if (!prev || prev === null) {
                return prev;
            }
            prev.update({ [name]: type === "checkbox" ? checked : type === 'date' ? new Date(value) || null : value });
            return prev.clone();
        });
    };
    const handleClear = (name) => {
        setErrors(prev => ({ ...prev, [name]: '' }));
        setUserEdit(prev => {
            if (!prev || prev === null) {
                return prev;
            }
            prev.update({ [name]: '' });
            return prev.clone();
        });
    };
    const handleSave = async () => {
        if (!userEdit || processing) return;
        try {
            const updatedUser = await userEdit.updateFirestore();
            if (updatedUser) {
                // Mettre à jour l'utilisateur dans le contexte Auth
                await update(updatedUser);
                setUserEdit(updatedUser.clone());
                setErrors({});
                console.log("Paramètres de notification sauvegardés :", updatedUser);
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error);
        }
    };
    
    const handleReset = () => {
        if (processing) return;
        setUserEdit(user.clone());
        setErrors({});
    };
    
    const hasChanges = useMemo(() => {
        if (!user || !userEdit) return false;
        const newsletterChanged = user.newsletter !== userEdit.newsletter;
        const notifByEmailChanged = user.notif_by_email !== userEdit.notif_by_email;
        const okayWhatsappChanged = user.okay_whatsapp !== userEdit.okay_whatsapp;
        const hasAnyChange = newsletterChanged || notifByEmailChanged || okayWhatsappChanged;
        return hasAnyChange;
    }, [user?.newsletter, user?.notif_by_email, user?.okay_whatsapp, userEdit?.newsletter, userEdit?.notif_by_email, userEdit?.okay_whatsapp]);
    
    // Désactiver le bouton save si il y a des erreurs
    const canSave = useMemo(() => {
        return hasChanges && Object.keys(errors).length === 0;
    }, [hasChanges, errors]);
    
    return (
        <>
            <section className="card">
                <h2>{t('title_notifications')}</h2>
                <h3>{t('email_notifications')}</h3>
                <div className="field inline">
                    <CheckboxComponent
                        label={t('email_newsletter')}
                        name={'newsletter'}
                        checked={userEdit?.newsletter}
                        onChange={handleChange}
                    />
                </div>
                <div className="field inline">
                    <CheckboxComponent
                        label={t('email_message')}
                        name={'notif_by_email'}
                        checked={userEdit?.notif_by_email}
                        onChange={handleChange}
                    />
                </div>
                <hr className="divider" />
                <h3>{t('phone_notifications')}</h3>
                <div className="field inline">
                    <CheckboxComponent
                        label={t('phone_whatsapp')}
                        name={'okay_whatsapp'}
                        disabled={!userEdit?.phone_number || userEdit?.phone_number === ''}
                        checked={userEdit?.okay_whatsapp}
                        onChange={handleChange}
                    />
                    {(!userEdit?.phone_number || userEdit?.phone_number === '') && (
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: -0.5, ml: 1 }}>
                            <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                    color: 'var(--error)',
                                    fontWeight: 600,
                                }}
                            >
                                *
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                    color: 'var(--grey)',
                                    fontStyle: 'italic',
                                }}
                            >
                                {t('phone-required-for-whatsapp', { ns: NS_COMPLETE_PROFILE })}
                            </Typography>
                        </Stack>
                    )}
                </div>
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3, pt: 2, borderTop: '1px solid var(--card-border)' }}>
                    <ButtonCancel
                        label={t('reset', { ns: NS_BUTTONS })}
                        onClick={handleReset}
                        disabled={processing || !hasChanges}
                        loading={processing}
                        size="medium"
                    />
                    <ButtonConfirm
                        label={t('save', { ns: NS_BUTTONS })}
                        onClick={handleSave}
                        loading={processing}
                        disabled={processing || !canSave}
                        size="medium"
                    />
                </Stack>
            </section>

            <style jsx>{`
        .page {          
          padding: 0;
          color: var(--font-color);
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          height:100%;
          padding:0px;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 15px;
        }

        .header h1 {
          margin: 0;
          font-size: 1.5rem;
          line-height: 1.5rem;
        }

        .header-actions {
          margin-left: auto;
          display: flex;
          align-items:center;
          gap: 8px;
        }

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.3rem;
        }

        .muted {
          margin: 0;
          font-size: 0.9rem;
          color: ${greyLight.main};
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .header {
            align-items: flex-start;
            flex-direction: column;
          }
          .header-actions {
            margin-left: 0;
          }
        }

        .card {
          background: var(--card-color);
          border-radius: 10px;
          padding: 20px;
          border: 1px solid var(--card-color);
          
        }

        .card h2 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 1.2rem;
        }

        .card h3 {
          margin-top: 16px;
          margin-bottom: 8px;
          font-size: 1rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
          font-size: 0.9rem;
        }

        .field label {
          margin-bottom: 4px;
          color: #9ca3af;
        }

        .field.inline {
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        input[type="text"],
        input[type="email"],
        input[type="date"],
        select {
          background: #020617;
          border-radius: 10px;
          border: 1px solid #1f2937;
          padding: 8px 10px;
          color: #e5e7eb;
          outline: none;
          font-size: 0.9rem;
        }

        input:disabled,
        select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }

        .btn {
          border-radius: 999px;
          padding: 8px 14px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .btn.primary {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border-color: transparent;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .divider {
          border: none;
          border-top: 1px solid ${ClassColor.GREY_HYPER_LIGHT};
          margin: 12px 0;
        }
      `}</style>
        </>
    );
}
function SettingsPage() {
    const { lang, changeLang } = useLanguage();
    const { user, isLoading, update, processing } = useAuth();
    const { t } = useTranslation([ClassUser.NS_COLLECTION, NS_ROLES, NS_PROFILE]);
    const translateLabels = t('form', { ns: NS_PROFILE, returnObjects: true })
    const { theme, changeTheme, mode, modeApp } = useThemeMode();
    const { greyLight } = theme.palette;

    const [userEdit, setUserEdit] = useState(user);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        setUserEdit(user.clone());
    }, [user]);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setErrors(prev => ({ ...prev, [name]: '' }));
        setUserEdit(prev => {
            if (!prev || prev === null) {
                return prev;
            }
            prev.update({ [name]: type === "checkbox" ? checked : type === 'date' ? new Date(value) || null : value });
            return prev;
        });
    };
    const handleClear = (name) => {
        setErrors(prev => ({ ...prev, [name]: '' }));
        setUserEdit(prev => {
            if (!prev || prev === null) {
                return prev;
            }
            prev.update({ [name]: '' });
            return prev;
        });
    };
    const handleSave = async (e) => {
        //e.preventDefault();
        //setUser(draft);
        //setIsEditing(false);
        await update(userEdit);
        // Ici tu pourras appeler ton API / Firestore / etc.
        // ex: await fetch("/api/user", { method: "PUT", body: JSON.stringify(draft) })
        console.log("Profil sauvegardé :", userEdit);
    };
    return (
        <div>
            <main>
                {
                    // <Header />
                }
                <div className="grid">
                    <AccountSettingsComponent />
                    <NotificationSettingsComponent />
                </div>
            </main>

            <style jsx>{`
        .page {          
          padding: 0;
          color: var(--font-color);
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          height:100%;
          padding:0px;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 15px;
        }

        .header h1 {
          margin: 0;
          font-size: 1.5rem;
          line-height: 1.5rem;
        }

        .header-actions {
          margin-left: auto;
          display: flex;
          align-items:center;
          gap: 8px;
        }

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.3rem;
        }

        .muted {
          margin: 0;
          font-size: 0.9rem;
          color: ${greyLight.main};
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .header {
            align-items: flex-start;
            flex-direction: column;
          }
          .header-actions {
            margin-left: 0;
          }
        }

        .card {
          background: var(--card-color);
          border-radius: 10px;
          padding: 20px;
          border: 1px solid var(--card-color);
          
        }

        .card h2 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 1.2rem;
        }

        .card h3 {
          margin-top: 16px;
          margin-bottom: 8px;
          font-size: 1rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
          font-size: 0.9rem;
        }

        .field label {
          margin-bottom: 4px;
          color: #9ca3af;
        }

        .field.inline {
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        input[type="text"],
        input[type="email"],
        input[type="date"],
        select {
          background: #020617;
          border-radius: 10px;
          border: 1px solid #1f2937;
          padding: 8px 10px;
          color: #e5e7eb;
          outline: none;
          font-size: 0.9rem;
        }

        input:disabled,
        select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }

        .btn {
          border-radius: 999px;
          padding: 8px 14px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .btn.primary {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border-color: transparent;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .divider {
          border: none;
          border-top: 1px solid ${ClassColor.GREY_HYPER_LIGHT};
          margin: 12px 0;
        }
      `}</style>
        </div>
    );
}
export default function SettingsComponent() {
    const { t } = useTranslation([NS_PROFILE, NS_COMMON, NS_LANGS]);
    const form = t('form', { returnObjects: true });
    const { user, isLoading } = useAuth();
    const [userEdit, setUserEdit] = useState(new ClassUser());
    useEffect(() => {
        setUserEdit(user.clone());
        async function init() {
          const _list = await ClassLessonTeacher.fetchFromFirestore("FGGHDFSGFSDGFS");
          console.log("LIIIIST", _list);
        }
        init();
    }, [user]);
    return (<Stack sx={{ background: '', width: '100%', }} spacing={{ xs: 1.5, sm: 2 }}>
        <SettingsPage />
    </Stack>)
}