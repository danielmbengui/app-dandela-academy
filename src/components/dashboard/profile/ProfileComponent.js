import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { IconCalendar, IconIdea } from "@/assets/icons/IconsComponent";
import AccordionComponent from "@/components/dashboard/elements/AccordionComponent";
import FieldComponent from "@/components/elements/FieldComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { getFormattedDate, getFormattedDateCompleteNumeric } from "@/contexts/functions";
import { languages, NS_COMMON, NS_DASHBOARD_PROFILE, NS_FORM, NS_LANGS, NS_ROLES } from "@/contexts/i18n/settings";
import { useLanguage } from "@/contexts/LangProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Backdrop, Box, Button, CircularProgress, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Field from "../elements/Field";
import { ClassUser } from "@/classes/users/ClassUser";
import SelectComponent from "@/components/elements/SelectComponent";
import { THEME_DARK, THEME_LIGHT, THEME_SYSTEM } from "@/contexts/constants/constants";
import FieldTextComponent from "@/components/elements/FieldTextComponent";
import CardComponent from "@/components/elements/CardComponent";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import { t } from "i18next";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import { ClassColor } from "@/classes/ClassColor";
const initialUser = {
    firstName: "Daniel",
    lastName: "Mbengui",
    birthDate: "1994-05-20", // format YYYY-MM-DD
    personalEmail: "daniel@example.com",
    schoolEmail: "daniel@dandela-academy.com",
    role: "Étudiant",
    type: "Temps plein",
    userNumber: "DA-2025-000123",
    // paramètres
    notificationsEmail: true,
    newsletter: true,
    language: "fr",
    theme: "light",
};
function ProfilePage() {
    const { lang, changeLang } = useLanguage();
    const { user, isLoading, update, processing } = useAuth();
    const { t } = useTranslation([ClassUser.NS_COLLECTION, NS_ROLES, NS_DASHBOARD_PROFILE]);
    const translateLabels = t('form', {ns:NS_DASHBOARD_PROFILE, returnObjects: true})
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
        <div className="page">
            <main className="container">
                <header className="header">
                    {
                        user?.showAvatar({ size: 60, fontSize: '18px' })
                    }
                    <div>
                        <h1>
                            {user?.first_name} {user?.last_name.toUpperCase()}
                        </h1>
                        <p className="muted">
                            @{user?.display_name} • {t(user?.role, { ns: NS_ROLES })} • {user?.type}
                        </p>
                    </div>
                    <div className="header-actions">
                        {
                            user && userEdit && !user.same(userEdit) && <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                <ButtonCancel
                                    label="Annuler"
                                    onClick={() => setUserEdit(user.clone())}
                                    disabled={processing}
                                />
                                <ButtonConfirm
                                    label="Modifier mon profil"
                                    onClick={handleSave}
                                    loading={processing}
                                />
                            </Stack>
                        }
                    </div>
                </header>

                <form onSubmit={handleSave} className="grid">
                    {/* Infos personnelles */}
                    <section className="card">
                        <h2>{translateLabels.title_perso}</h2>
                        <div className="field">
                            <FieldComponent
                                label={'prénom(s)'}
                                name={'first_name'}
                                type="text"
                                value={userEdit?.first_name}
                                onChange={handleChange}
                                onClear={() => handleClear('first_name')}
                                error={errors.first_name}
                            />
                        </div>
                        <div className="field">
                            <FieldComponent
                                label={'nom(s)'}
                                name={'last_name'}
                                type="text"
                                value={userEdit?.last_name}
                                onChange={handleChange}
                                onClear={() => handleClear('last_name')}
                                error={errors.last_name}
                            />
                        </div>
                        <div className="field">
                            <FieldComponent
                                label={'Nom dhtilisateur'}
                                name={'display_name'}
                                type="text"
                                value={userEdit?.display_name}
                                onChange={handleChange}
                                disabled={true}
                                //onClear={()=>handleClear('first_name')}
                                error={errors.display_name}
                            />
                        </div>
                        <div className="field">
                            <FieldComponent
                                label={'Email personnel'}
                                name={'email'}
                                type="email"
                                value={userEdit?.email}
                                onChange={handleChange}

                                //onClear={()=>handleClear('first_name')}
                                error={errors.email}
                            />
                        </div>
                        <div className="field">
                            <FieldComponent
                                label={`Email de l'école`}
                                name={'email_academy'}
                                type="email"
                                value={userEdit?.email_academy}
                                onChange={handleChange}
                                disabled={true}
                                //onClear={()=>handleClear('first_name')}
                                error={errors.email_academy}
                            />
                        </div>
                        <div className="field">
                            <FieldComponent
                                label={'date de naissance'}
                                name={'birthday'}
                                type="date"
                                value={userEdit?.birthday}
                                onChange={handleChange}
                                disabled={true}
                                //onClear={()=>handleClear('first_name')}
                                error={errors.birthday}
                            />
                        </div>
                    </section>

                    {/* Infos système / compte */}
                    <section className="card">
                        <h2>{translateLabels.title_account}</h2>
                        <div className="field">
                            <FieldComponent
                                label={'uid utilisateur'}
                                name={'uid'}
                                type="text"
                                value={userEdit?.uid}
                                onChange={handleChange}
                                disabled={true}
                                //onClear={()=>handleClear('first_name')}
                                error={errors.uid}
                            />
                        </div>
                        <div className="field">
                            <SelectComponentDark
                                label={`Role`}
                                name={'role'}
                                value={userEdit?.role}
                                values={ClassUser.ALL_ROLES.map(role => ({ id: role, value: t(role, { ns: NS_ROLES }) }))}
                                onChange={handleChange}
                                disabled={true}
                                //onClear={()=>handleClear('first_name')}
                                error={errors.role}
                            />
                        </div>
                        <div className="field">
                            <FieldTextComponent
                                label={'date création'}
                                name={'created_time'}
                                type="date"
                                value={getFormattedDateCompleteNumeric(userEdit?.created_time, lang)}
                                onChange={handleChange}
                                disabled={true}
                                //onClear={()=>handleClear('first_name')}
                                error={errors.created_time}
                            />
                        </div>
                        <div className="field">
                            <FieldTextComponent
                                label={'date dernière mise à jour'}
                                name={'last_edit_time'}
                                type="date"
                                value={getFormattedDateCompleteNumeric(userEdit?.last_edit_time, lang)}
                                onChange={handleChange}
                                disabled={true}
                                //onClear={()=>handleClear('first_name')}
                                error={errors.last_edit_time}
                            />
                        </div>

                        <hr className="divider" />

                        <h3>{translateLabels.title_settings}</h3>
                        <div className="field inline">
                            <CheckboxComponent
                                label={'Recevoir la newsletter'}
                                name={'newsletter'}
                                checked={userEdit?.newsletter}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="field inline">
                            <CheckboxComponent
                                label={'Recevoir les notifications par email'}
                                name={'notif_by_email'}
                                checked={userEdit?.notif_by_email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field">
                            <SelectComponentDark
                                label={'langue'}
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
                                label={'theme'}
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
                </form>
            </main>

            <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 20px 0px;
          color: var(--font-color);
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
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
export default function ProfileComponent() {
    const { t } = useTranslation([NS_DASHBOARD_PROFILE, NS_COMMON, NS_LANGS]);
    const form = t('form', { returnObjects: true });
    const {
        'title-account': title_account,
        'title-perso': title_perso,
        'title-settings': title_settings,
        email: title_email,
        phone_number: title_phone_number,
        uid: title_uid,
        display_name: title_name,
        first_name: title_first_name,
        last_name: title_last_name,
        role: title_role,
        birthday: title_birthday,
        lang: title_lang,
        theme: title_theme,
    } = form;
    console.log("FORM", t('form', { returnObjects: true }))
    const { lang, changeLang } = useLanguage();
    const { user, isLoading } = useAuth();
    const [userEdit, setUserEdit] = useState(new ClassUser());
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        setUserEdit(user.clone());
    }, [user]);
    const { theme, changeTheme, mode, modeApp } = useThemeMode();
    const { primary, primaryShadow, greyLight, text } = theme.palette;
    const completeName = user?.first_name.concat(' ').concat(user?.last_name) || '';
    const onChangeField = (e) => {
        const { value, name, type } = e.target;
        console.log("EVENT", name, type, userEdit)
        //e.preventDefault();
        //userInfo.update({ first_name: value });
        //setErrors(prev => ({ ...prev, [name]: '' }));
        setErrors(prev => {
            delete prev[name];
            return prev;
        });
        /*
        if (user[name] !== value) {
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
        */
        setUserEdit(prev => {
            if (!prev) return user;
            prev.update({ [name]: value });
            return prev.clone();
        });
    }
    const onClearField = (name) => {
        //e.preventDefault();
        //userInfo.update({ first_name: value });
        //setIsEditing(true);
        setErrors(prev => {
            delete prev[name];
            return prev;
        });
        setUserEdit(prev => {
            if (!prev) return prev;
            prev.update({ [name]: '' });
            return prev.clone();
        });
    }
    const onResetField = (name) => {
        //e.preventDefault();
        //userInfo.update({ first_name: value });
        //setIsEditing(true);
        setErrors(prev => {
            delete prev[name];
            return prev;
        });
        setUserEdit(prev => {
            if (!prev) return prev;
            prev.update({ [name]: user?.[name] });
            return prev.clone();
        });
    }
    const onEditForm = async () => {
        setIsEditing(true);
        const _errors = {};
        if (!userEdit.validLastName()) {
            _errors.last_name = "erreur nom";
        }
        if (!userEdit.validFirstName()) {
            _errors.first_name = "erreur prénom";
        }
        setErrors(_errors);
        if (Object.keys(_errors).length > 0) {
            console.log("Aucune erreur");
            return;
        }
        //setUserInfo();
        await ClassUser.update(user.uid, userEdit.toJSON());
        setIsEditing(false);
        // On EDIT infos
    }
    return (<Stack sx={{ background: '', width: '100%', }} spacing={{ xs: 1.5, sm: 2 }}>
        <ProfilePage />
    </Stack>)
}