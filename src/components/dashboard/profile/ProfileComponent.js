import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { IconCalendar, IconIdea } from "@/assets/icons/IconsComponent";
import AccordionComponent from "@/components/dashboard/elements/AccordionComponent";
import FieldComponent from "@/components/elements/FieldComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { getFormattedDate } from "@/contexts/functions";
import { languages, NS_DASHBOARD_PROFILE, NS_FORM, NS_LANGS, NS_ROLES } from "@/contexts/i18n/settings";
import { useLanguage } from "@/contexts/LangProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Backdrop, Box, Button, CircularProgress, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Field from "../elements/Field";
import { ClassUser } from "@/classes/users/ClassUser";
import SelectComponent from "@/components/elements/SelectComponent";
import { THEME_DARK, THEME_LIGHT } from "@/contexts/constants/constants";
import FieldTextComponent from "@/components/elements/FieldTextComponent";
import CardComponent from "@/components/elements/CardComponent";
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
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(initialUser);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setDraft((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleEdit = () => {
        setDraft(user);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDraft(user);
        setIsEditing(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setUser(draft);
        setIsEditing(false);

        // Ici tu pourras appeler ton API / Firestore / etc.
        // ex: await fetch("/api/user", { method: "PUT", body: JSON.stringify(draft) })
        console.log("Profil sauvegardé :", draft);
    };

    return (
        <div className="page">
            <main className="container">
                <header className="header">
                    <div className="avatar">
                        {user.firstName[0]}
                        {user.lastName[0]}
                    </div>
                    <div>
                        <h1>
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="muted">
                            #{user.userNumber} • {user.role} • {user.type}
                        </p>
                    </div>
                    <div className="header-actions">
                        {!isEditing && (
                            <button className="btn primary" onClick={handleEdit}>
                                Modifier le profil
                            </button>
                        )}
                        {isEditing && (
                            <>
                                <button className="btn" onClick={handleCancel}>
                                    Annuler
                                </button>
                                <button className="btn primary" onClick={handleSave}>
                                    Enregistrer
                                </button>
                            </>
                        )}
                    </div>
                </header>

                <form onSubmit={handleSave} className="grid">
                    {/* Infos personnelles */}
                    <section className="card">
                        <h2>Informations personnelles</h2>
                        <div className="field">
                            <label>Prénom</label>
                            <input
                                type="text"
                                name="firstName"
                                value={draft.firstName}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="field">
                            <label>Nom</label>
                            <input
                                type="text"
                                name="lastName"
                                value={draft.lastName}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="field">
                            <label>Date de naissance</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={draft.birthDate}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="field">
                            <label>Email personnel</label>
                            <input
                                type="email"
                                name="personalEmail"
                                value={draft.personalEmail}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="field">
                            <label>Email de l&apos;école</label>
                            <input
                                type="email"
                                name="schoolEmail"
                                value={draft.schoolEmail}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </section>

                    {/* Infos système / compte */}
                    <section className="card">
                        <h2>Informations de compte</h2>
                        <div className="field">
                            <label>Rôle</label>
                            <select
                                name="role"
                                value={draft.role}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="Étudiant">Étudiant</option>
                                <option value="Professeur">Professeur</option>
                                <option value="Admin">Admin</option>
                                <option value="Super admin">Super admin</option>
                            </select>
                        </div>

                        <div className="field">
                            <label>Type</label>
                            <select
                                name="type"
                                value={draft.type}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="Temps plein">Temps plein</option>
                                <option value="Temps partiel">Temps partiel</option>
                                <option value="Invité">Invité</option>
                            </select>
                        </div>

                        <div className="field">
                            <label>Numéro d&apos;utilisateur</label>
                            <input
                                type="text"
                                name="userNumber"
                                value={draft.userNumber}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <hr className="divider" />

                        <h3>Paramètres</h3>

                        <div className="field inline">
                            <label>
                                <input
                                    type="checkbox"
                                    name="notificationsEmail"
                                    checked={draft.notificationsEmail}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                                Recevoir les notifications par email
                            </label>
                        </div>

                        <div className="field inline">
                            <label>
                                <input
                                    type="checkbox"
                                    name="newsletter"
                                    checked={draft.newsletter}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                                Recevoir la newsletter
                            </label>
                        </div>

                        <div className="field">
                            <label>Langue de l&apos;interface</label>
                            <select
                                name="language"
                                value={draft.language}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="fr">Français</option>
                                <option value="en">Anglais</option>
                                <option value="pt">Portugais</option>
                            </select>
                        </div>

                        <div className="field">
                            <label>Thème</label>
                            <select
                                name="theme"
                                value={draft.theme}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="light">Clair</option>
                                <option value="dark">Sombre</option>
                            </select>
                        </div>
                    </section>
                </form>
            </main>

            <style jsx>{`
        .page {
          min-height: 100vh;
          background: #0f172a;
          padding: 40px 16px;
          color: #e5e7eb;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 1100px;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .header h1 {
          margin: 0;
          font-size: 1.8rem;
        }

        .header-actions {
          margin-left: auto;
          display: flex;
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
          margin: 4px 0 0;
          font-size: 0.9rem;
          color: #9ca3af;
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
          background: #020617;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #1f2937;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
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
          border-top: 1px solid #1f2937;
          margin: 12px 0;
        }
      `}</style>
        </div>
    );
}
export default function ProfileComponent() {
    const { t } = useTranslation([NS_DASHBOARD_PROFILE]);
    const form = t('form', {returnObjects:true});
    const {
        'title-account': title_account,
        'title-perso': title_perso,
        'title-settings': title_settings,
        email: title_email,
        phone_number:title_phone_number,
        uid:title_uid,
        display_name:title_name,
        first_name:title_first_name,
        last_name:title_last_name,
        role: title_role,
        birthday: title_birthday,
        lang: title_lang,
        theme: title_theme,
      } = form;
    console.log("FORM",t('form', {returnObjects:true}))
    const { lang, changeLang } = useLanguage();
    const { user, isLoading } = useAuth();
    const [userInfo, setUserInfo] = useState(new ClassUser());
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (!isLoading) {
            setUserInfo(user.clone());
        }
    }, [isLoading]);
    const { theme, changeTheme, mode } = useThemeMode();
    const { primary, primaryShadow, greyLight, text } = theme.palette;
    const completeName = user?.first_name.concat(' ').concat(user?.last_name) || '';
    const onChangeField = (e) => {
        const { value, name, type } = e.target;
        console.log("EVENT", name, type, userInfo)
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
        setUserInfo(prev => {
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
        setUserInfo(prev => {
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
        setUserInfo(prev => {
            if (!prev) return prev;
            prev.update({ [name]: user?.[name] });
            return prev.clone();
        });
    }
    const onEditForm = async () => {
        setIsEditing(true);
        const _errors = {};
        if (!userInfo.validLastName()) {
            _errors.last_name = "erreur nom";
        }
        if (!userInfo.validFirstName()) {
            _errors.first_name = "erreur prénom";
        }
        setErrors(_errors);
        if (Object.keys(_errors).length > 0) {
            console.log("Aucune erreur");
            return;
        }
        //setUserInfo();
        await ClassUser.update(user.uid, userInfo.toJSON());
        setIsEditing(false);
        // On EDIT infos
    }
    return (<Stack sx={{ background: '', width: '100%', }} spacing={{ xs: 1.5, sm: 2 }}>
        <ProfilePage />
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems={'center'} justifyContent={'space-between'} sx={{ width: '100%', background: '', }}>
            <Stack spacing={{ xs: 1, sm: 2 }} direction={{ xs: 'column', sm: 'row' }} alignItems={'center'} sx={{ background: '' }}>
                {
                    user?.showAvatar({ size: 55, fontSize: '18px' })
                }
                <Stack alignItems={{ xs: 'center', sm: 'start' }}>
                    <Typography sx={{ textAlign: 'center' }} variant="h1">{user?.getCompleteName() || ''}</Typography>
                    <Stack justifyContent={'center'} alignItems={{ xs: 'center', sm: 'start' }} sx={{ color: greyLight.main }}>
                        <Typography variant="caption" sx={{ color: text.main }}>{user?.email_academy || ''}</Typography>
                        <Typography variant="caption" sx={{ color: primary.main }}>{t(user?.role, { ns: NS_ROLES })}</Typography>
                    </Stack>

                </Stack>
            </Stack>

            {
                isEditing && <Stack direction={'row'} alignItems={'center'} sx={{ background: 'green' }} spacing={1}>
                    <ButtonCancel
                        label="Annuler"
                        //loading={true}
                        //disabled={true}
                        onClick={() => {
                            setUserInfo(user.clone());
                            setIsEditing(false);
                        }}
                    />
                    <ButtonConfirm
                        label="Confirmer"
                        //loading={true}
                        //isabled={true}
                        onClick={() => {
                            onEditForm();
                            //alert('click okay');

                        }}
                    />
                </Stack>
            }
        </Stack>
        <Grid container spacing={1.5} sx={{ background: '' }}>
            <Grid size={{ xs: 12, sm: 6.5 }} sx={{
                //background: 'var(--card-color)',
                //borderRadius: '10px',
                //padding: { xs: '15px', sm: '20px' },
                //border: `1px solid ${greyLight.main}`,
                //boxShadow: ` 0 18px 45px rgba(0, 0, 0, 0.4)`,
            }}>
                <Stack spacing={1}>
                    <CardComponent>
                    <Stack spacing={1.5}>
                        <Typography variant="h2">{title_account}</Typography>
                        <Stack spacing={1}>
                            <FieldTextComponent
                                label={title_role}
                                name={'role'}
                                value={t(userInfo?.role, { ns: NS_ROLES })}
                                values={ClassUser.ALL_ROLES.map(role => ({ id: role, value: t(role, { ns: NS_ROLES }) }))}
                                disabled={true}
                            />
                            <FieldTextComponent
                                label={title_uid}
                                name={'uid'}
                                value={userInfo?.uid}
                                type='text'
                                disabled={true}
                                error={errors.uid}
                            />
                            <FieldTextComponent
                                label={title_name}
                                name={'display_name'}
                                value={userInfo?.display_name}
                                type='text'
                                disabled={true}
                                error={errors.display_name}
                            />
                            <FieldTextComponent
                                label={title_email}
                                name={'email_academy'}
                                value={userInfo?.email_academy}
                                type='email'
                                disabled={true}
                                error={errors.email_academy}
                                onChange={onChangeField}

                            />



                        </Stack>
                    </Stack>
                    </CardComponent>
                </Stack>

            </Grid>
            <Grid size={{ xs: 12, sm: 'grow' }}>
                <Stack spacing={1}>
                <CardComponent>
                    <Stack spacing={1.5}>
                        <Typography variant="h2">{title_perso}</Typography>
                        <Stack spacing={1}>
                            <FieldTextComponent
                                label={title_email}
                                name={'email'}
                                value={userInfo?.email}
                                type='email'
                                disabled={true}
                                error={errors.email}
                            />
                            {
                                user?.phone_number && <FieldTextComponent
                                    label={title_phone_number}
                                    name={'phone_number'}
                                    value={userInfo?.phone_number}
                                    type='phone'
                                    disabled={true}
                                    error={errors.phone_number}
                                />
                            }
                            <FieldTextComponent
                                label={title_birthday}
                                name={'birthday'}
                                value={getFormattedDate(userInfo?.birthday, lang)}
                                type='date'
                                disabled={true}
                                error={errors.birthday}
                                onChange={onChangeField}
                            />
                            <FieldComponent
                                label={title_first_name}
                                name={'first_name'}
                                value={userInfo?.first_name}
                                type='text'
                                disabled={false}
                                error={errors.first_name}
                                onChange={onChangeField}
                                onClear={() => {
                                    onClearField('first_name');
                                }}
                                editable={userInfo?.first_name !== user?.first_name}
                                onCancel={() => {
                                    onResetField('first_name');
                                }}
                                onSubmit={onEditForm}
                            />
                            <FieldComponent
                                label={title_last_name}
                                name={'last_name'}
                                value={userInfo?.last_name}
                                type='text'
                                disabled={false}
                                error={errors.last_name}
                                onChange={onChangeField}
                                onClear={() => {
                                    onClearField('last_name');
                                }}
                                editable={userInfo?.last_name !== user?.last_name}
                                onCancel={() => {
                                    setErrors(prev => prev.last_name = '');
                                    setUserInfo(prev => {
                                        if (!prev) return prev;
                                        prev.update({ last_name: user.last_name });
                                        return prev.clone();
                                    });
                                }}
                                onSubmit={onEditForm}
                            />
                        </Stack>
                    </Stack>
                </CardComponent>
                <CardComponent>
                    <Stack spacing={1.5}>
                        <Typography variant="h2">{title_settings}</Typography>
                        <Stack spacing={1}>
                            <SelectComponent
                                label={title_lang}
                                name={'lang'}
                                value={lang}
                                values={languages.map(lang => ({ id: lang, value: t(lang, { ns: NS_LANGS }) }))}
                                onChange={(e) => {
                                    //console.log("NEW VALUE", e.target.value)
                                    changeLang(e.target.value);
                                }}
                                hasNull={false}
                            />
                            <SelectComponent
                                label={title_theme}
                                name={'theme'}
                                //display={false}
                                value={mode}
                                values={[THEME_LIGHT, THEME_DARK].map(_theme => ({ id: _theme, value: t(_theme, { ns: NS_LANGS }) }))}
                                onChange={(e) => {
                                    //console.log("NEW VALUE", e.target.value)
                                    changeTheme(e.target.value);
                                }}
                                hasNull={false}
                            />
                        </Stack>
                    </Stack>
                </CardComponent>
                </Stack>
            </Grid>
        </Grid>
    </Stack>)
}