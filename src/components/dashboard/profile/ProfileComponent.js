import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { IconCalendar, IconIdea } from "@/assets/icons/IconsComponent";
import AccordionComponent from "@/components/dashboard/elements/AccordionComponent";
import FieldComponent from "@/components/elements/FieldComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { getFormattedDate, getFormattedDateCompleteNumeric } from "@/contexts/functions";
import { languages, NS_COMMON, NS_PROFILE, NS_FORM, NS_LANGS, NS_ROLES } from "@/contexts/i18n/settings";
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

function ProfilePage() {
    const { lang, changeLang } = useLanguage();
    const { user, isLoading, update, processing } = useAuth();
    const { t } = useTranslation([ClassUser.NS_COLLECTION, NS_ROLES, NS_PROFILE]);
    const translateLabels = t('form', {ns:NS_PROFILE, returnObjects: true})
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
                                label={t('first_name')}
                                name={'first_name'}
                                type="text"
                                value={userEdit?.first_name}
                                onChange={handleChange}
                                disabled={true}
                                onClear={() => handleClear('first_name')}
                                error={errors.first_name}
                                fullWidth
                            />
                        </div>
                        <div className="field">
                            <FieldComponent
                                label={t('last_name')}
                                name={'last_name'}
                                type="text"
                                value={userEdit?.last_name}
                                onChange={handleChange}
                                disabled={true}
                                onClear={() => handleClear('last_name')}
                                error={errors.last_name}
                                fullWidth
                            />
                        </div>
                        <div className="field">
                            <FieldComponent
                                label={t('display_name')}
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
                                label={t('email_academy')}
                                name={'email_academy'}
                                type="email"
                                value={userEdit?.email_academy}
                                onChange={handleChange}
                                disabled={true}
                                //onClear={()=>handleClear('first_name')}
                                error={errors.email_academy}
                                fullWidth
                            />
                        </div>
                        <div className="field">
                            <FieldComponent
                                label={t('birthday')}
                                name={'birthday'}
                                type="date"
                                value={userEdit?.birthday}
                                onChange={handleChange}
                                disabled={true}
                                //onClear={()=>handleClear('first_name')}
                                error={errors.birthday}
                                fullWidth
                            />
                        </div>
                    </section>

                    {/* Infos système / compte */}
                    <section className="card">
                        <h2>{translateLabels.title_account}</h2>
                        <div className="field">
                            <FieldComponent
                                label={t('uid')}
                                name={'uid'}
                                type="text"
                                value={userEdit?.uid}
                                onChange={handleChange}
                                disabled={true}
                                //onClear={()=>handleClear('first_name')}
                                error={errors.uid}
                                fullWidth
                            />
                        </div>
                        <div className="field">
                            <SelectComponentDark
                                label={t('role')}
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
                                label={t('created_time')}
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
                                label={t('last_edit_time')}
                                name={'last_edit_time'}
                                type="date"
                                value={getFormattedDateCompleteNumeric(userEdit?.last_edit_time, lang)}
                                onChange={handleChange}
                                disabled={true}
                                //onClear={()=>handleClear('first_name')}
                                error={errors.last_edit_time}
                            />
                        </div>
                    </section>
                </form>
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
          gap: 20px;
          margin-bottom: 24px;
          padding: 24px;
          background: var(--card-color);
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease-in-out;
        }

        .header:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .header h1 {
          margin: 0;
          font-size: 1.75rem;
          line-height: 1.5rem;
          font-weight: 600;
          background: linear-gradient(135deg, var(--font-color) 0%, var(--font-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-actions {
          margin-left: auto;
          display: flex;
          align-items:center;
          gap: 12px;
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
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          transition: transform 0.2s ease;
        }

        .avatar:hover {
          transform: scale(1.05);
        }

        .muted {
          margin: 4px 0 0 0;
          font-size: 0.9rem;
          color: var(--grey-light);
          line-height: 1.4;
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 20px;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .header {
            align-items: flex-start;
            flex-direction: column;
            padding: 20px;
          }
          .header-actions {
            margin-left: 0;
            width: 100%;
            justify-content: flex-end;
          }
        }

        .card {
          background: var(--card-color);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid var(--card-border);
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease-in-out;
        }

        .card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }

        .card h2 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--font-color);
        }

        .card h3 {
          margin-top: 16px;
          margin-bottom: 8px;
          font-size: 1rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
          font-size: 0.9rem;
        }

        .field:last-child {
          margin-bottom: 0;
        }

        .field label {
          margin-bottom: 4px;
          color: var(--grey-light);
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
          background: var(--card-color);
          border-radius: 12px;
          border: 1px solid var(--card-border);
          padding: 10px 14px;
          color: var(--font-color);
          outline: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        input:focus,
        select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }

        input:disabled,
        select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: rgba(0,0,0,0.02);
        }

        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .btn {
          border-radius: 12px;
          padding: 10px 18px;
          border: 1px solid var(--card-border);
          background: var(--card-color);
          color: var(--font-color);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .btn.primary {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border-color: transparent;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .divider {
          border: none;
          border-top: 1px solid var(--card-border);
          margin: 16px 0;
          opacity: 0.3;
        }
      `}</style>
        </div>
    );
}
export default function ProfileComponent() {
    const { t } = useTranslation([NS_PROFILE, NS_COMMON, NS_LANGS]);
    const form = t('form', { returnObjects: true });
    const { user, isLoading } = useAuth();
    const [userEdit, setUserEdit] = useState(new ClassUser());
    useEffect(() => {
        setUserEdit(user.clone());
    }, [user]);
    return (<Stack sx={{ background: '', width: '100%', }} spacing={{ xs: 2, sm: 3 }}>
        <ProfilePage />
    </Stack>)
}