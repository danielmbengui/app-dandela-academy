import ButtonCancel from "@/app/dashboard/elements/ButtonCancel";
import ButtonConfirm from "@/app/dashboard/elements/ButtonConfirm";
import { IconCalendar, IconIdea } from "@/assets/icons/IconsComponent";
import AccordionComponent from "@/components/elements/AccordionComponent";
import FieldComponent from "@/components/elements/FieldComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { getFormattedDate } from "@/contexts/functions";
import { NS_DASHBOARD_PROFILE, NS_ROLES } from "@/contexts/i18n/settings";
import { useLanguage } from "@/contexts/LangProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Box, Button, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
    const { lang } = useLanguage();
    const { user } = useAuth();
    const { theme } = useThemeMode();
    const { primary, primaryShadow } = theme.palette;
    const completeName = user?.first_name.concat(' ').concat(user?.last_name) || '';
    return (<Stack sx={{ background: 'red', width: '100%', }} spacing={1}>
        <Stack spacing={2} direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ width: '100%', background: 'orange', }}>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ background: 'yellow' }}>
                {
                    user?.showAvatar({ size: 55, fontSize: '18px' })
                }
                <Stack>
                    <Typography variant="h1">{completeName || ''}</Typography>
                    <Typography variant="caption">#{user?.email_academy || ''} • {t(user?.role, { ns: NS_ROLES })} • {user?.type}</Typography>
                </Stack>
            </Stack>

            <Stack direction={'row'} alignItems={'center'} sx={{ background: 'green' }} spacing={1}>
                <ButtonCancel
                    label="Annuler"
                    loading={true}
                    disabled={true}
                    onClick={() => {
                        alert('click okay')
                    }}
                />
                <ButtonConfirm
                    label="Confirmer"
                    //loading={true}
                    //isabled={true}
                    onClick={() => {
                        alert('click okay')
                    }}
                />


            </Stack>
        </Stack>
        <Grid container sx={{ background: 'purple' }}>
            <Grid size={7} sx={{
                background: '#020617',
                borderRadius: '16px',
                padding: '20px',
                border: `1px solid #1f2937`,
                boxShadow: ` 0 18px 45px rgba(0, 0, 0, 0.4)`,
            }}>
                <Stack>
                   <Typography sx={{color:'red'}}>
                    <Typography>{ 'YEEEEEES'}</Typography>
                   </Typography>
                </Stack>

            </Grid>
             <Grid size={'auto'} sx={{
                background: '#020617',
                borderRadius: '16px',
                padding: '20px',
                border: `1px solid #1f2937`,
                boxShadow: ` 0 18px 45px rgba(0, 0, 0, 0.4)`,
            }}>

            </Grid>
        </Grid>
        <ProfilePage />
        <Paper elevation={0}>
            <Stack spacing={2} direction={'row'} alignItems={'center'} sx={{ py: 2, px: { xs: 1, sm: 3 }, width: '100%', }}>
                <Stack alignItems={'center'} spacing={0.5}>
                    {
                        user?.showAvatar({ size: 50, fontSize: '14px' })
                    }
                    <Box sx={{ background: primaryShadow.main, border: `1.5px solid ${primary.main}`, borderRadius: '20px', py: 0.5, px: 1 }}>
                        <Typography sx={{ color: primary.main, lineHeight: 1, fontSize: '12px' }}>{t(user?.role, { ns: NS_ROLES }) || ''}</Typography>
                    </Box>
                </Stack>
                <Stack alignItems={'start'} >
                    <Typography sx={{ fontWeight: 'bold', lineHeight: 1, mb: 0.5 }}>{user?.getCompleteName() || ''}</Typography>
                    <Typography sx={{ lineHeight: 1, mb: 0.5 }}>{user?.display_name || ''}</Typography>
                    <Typography sx={{ lineHeight: 1, mb: 0.5 }}>{user?.email_academy || ''}</Typography>
                    <Stack direction={'row'} alignItems={'center'}>
                        <IconCalendar height={14} />
                        <Typography>{getFormattedDate(user?.birthday, lang)}</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    </Stack>)
}