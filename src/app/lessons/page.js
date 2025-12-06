"use client";
import React, { useEffect, useState } from 'react';
import { IconCertificate, IconDashboard, } from "@/assets/icons/IconsComponent";
import { WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_DASHBOARD_HOME, NS_DASHBOARD_MENU, NS_DASHBOARD_USERS, NS_LANGS, NS_ROLES, } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import ComputersComponent from '@/components/dashboard/computers/ComputersComponent';


import { useMemo } from "react";
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { ClassSchool } from '@/classes/ClassSchool';
import { ClassRoom } from '@/classes/ClassRoom';
import { ClassHardware } from '@/classes/ClassDevice';
import SelectComponentDark from '@/components/elements/SelectComponentDark';
import { ClassUser } from '@/classes/users/ClassUser';
import { formatDuration, getFormattedDateComplete, getFormattedDateCompleteNumeric, getFormattedDateNumeric } from '@/contexts/functions';
import { useLanguage } from '@/contexts/LangProvider';
import TextFieldComponentDark from '@/components/elements/TextFieldComponentDark';
import TextFieldComponent from '@/components/elements/TextFieldComponent';
import FieldComponent from '@/components/elements/FieldComponent';
import DialogUser from '@/components/dashboard/users/DialogUser';
import ButtonConfirm from '@/components/dashboard/elements/ButtonConfirm';
import { ClassColor } from '@/classes/ClassColor';
import { ClassLesson } from '@/classes/ClassLesson';
import BadgeFormatLesson from '@/components/dashboard/lessons/BadgeFormatLesson';
import BadgeStatusLesson from '@/components/dashboard/lessons/BadgeStatusLesson';
import { useRouter } from 'next/navigation';
import { PAGE_LESSONS } from '@/contexts/constants/constants_pages';
import { useLesson } from '@/contexts/LessonProvider';

const USERS_MOCK = [
  {
    id: "u1",
    firstName: "Daniel",
    lastName: "Mbengui",
    username: "daniel.mb",
    role: "student",
    type: "Étudiant",
    email: "daniel@example.com",
    schoolEmail: "daniel@dandela-academy.com",
    avatarUrl: "",
    status: "online", // online | offline | away
    mainGroup: "Cohorte 2025",
    language: "Français",
  },
  {
    id: "u2",
    firstName: "Ana",
    lastName: "Silva",
    username: "ana.silva",
    role: "tutor",
    type: "Professeure",
    email: "ana.silva@example.com",
    schoolEmail: "ana.silva@dandela-academy.com",
    avatarUrl: "",
    status: "online",
    mainGroup: "Formateurs bureautique",
    language: "Portugais",
  },
  {
    id: "u3",
    firstName: "João",
    lastName: "Pereira",
    username: "joao.p",
    role: "tutor",
    type: "Professeur IA",
    email: "joao.p@example.com",
    schoolEmail: "joao.p@dandela-academy.com",
    avatarUrl: "",
    status: "away",
    mainGroup: "Formateurs IA",
    language: "Portugais",
  },
  {
    id: "u4",
    firstName: "Marie",
    lastName: "Dupont",
    username: "marie.d",
    role: "admin",
    type: "Admin pédagogique",
    email: "marie.d@example.com",
    schoolEmail: "marie.d@dandela-academy.com",
    avatarUrl: "",
    status: "online",
    mainGroup: "Administration",
    language: "Français",
  },
  {
    id: "u5",
    firstName: "Alex",
    lastName: "Ngombo",
    username: "alex.ng",
    role: "super-admin",
    type: "Direction",
    email: "alex.ng@example.com",
    schoolEmail: "alex.ng@dandela-academy.com",
    avatarUrl: "",
    status: "online",
    mainGroup: "Direction",
    language: "Français",
  },
  {
    id: "u6",
    firstName: "Inès",
    lastName: "Costa",
    username: "ines.c",
    role: "team",
    type: "Stagiaire",
    email: "ines.c@example.com",
    schoolEmail: "ines.c@dandela-academy.com",
    avatarUrl: "",
    status: "offline",
    mainGroup: "Support",
    language: "Anglais",
  },
  // tu peux en rajouter facilement
];

const ROLE_CONFIG = {
  student: { label: "Étudiant", color: "#22c55eff", background: "rgba(34, 197, 94, 0.5)" },
  team: { label: "Équipe", color: "#fff317ff" },
  teacher: { label: "Professeur", color: "#3b82f6" },
  tutor: { label: "Professeur", color: "#3b82f6" },
  admin: { label: "Admin", color: "#f97316" },
  super_admin: { label: "Super-Admin", color: "#a855f7" },
  ['super-admin']: { label: "Super-Admin", color: "#a855f7" },
  intern: { label: "Stagiaire", color: "#e5e7eb" },
};

const STATUS_CONFIG_1 = {
  online: { label: "En ligne", color: "#22c55e" },
  connected: { label: "En ligne", color: "#22c55e" },
  offline: { label: "Hors ligne", color: "#6b7280" },
  disconnected: { label: "Hors ligne", color: "#6b7280" },
  away: { label: "Absent", color: "#eab308" },
  ['must-activate']: { label: 'Pas activé', color: `red` },
};

const TABLE_SPACE = `grid-template-columns:
            minmax(0, 2.0fr)
            minmax(0, 2.0fr)
            minmax(0, 1.5fr)
            minmax(0, 1.5fr)
            minmax(0, 3.0fr)
            minmax(0, 1.5fr)
            minmax(0, 2.25fr)
            minmax(0, 1.75fr)
            minmax(0, 1.5fr);`

function LessonsComponent({ userDialog = null, setUserDialog = null }) {
  const router = useRouter();
  const { theme } = useThemeMode();
  const { text, cardColor, greyLight, blueDark } = theme.palette;
  const { t } = useTranslation([NS_ROLES, ClassUser.NS_COLLECTION]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [_, setLessons] = useState([]);
  const {lessons, changeLesson} = useLesson();


  useEffect(() => {
    let list = [...lessons];

    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }
    if (statusFilter !== "all") {
      list = list.filter((u) => u.status === statusFilter);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((u) => {
        const completeName = `${u.completeName?.()}`.toLowerCase() || '';
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        return (
          u.completeName?.().includes(s) ||
          u.first_name?.toLowerCase().includes(s) ||
          u.last_name?.toLowerCase().includes(s) ||
          u.display_name?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          u.email_academy?.toLowerCase().includes(s) ||
          fullName.includes(s) ||
          u.username?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          u.schoolEmail?.toLowerCase().includes(s)
        );
      });
    }

    if (sortBy === "name") {
      list.sort((a, b) =>
        `${a.lastName} ${a.firstName}`.localeCompare(
          `${b.lastName} ${b.firstName}`
        )
      );
    } else if (sortBy === "role") {
      list.sort((a, b) => t(a.role).localeCompare(t(b.role)));
    }
    //const ok = ClassLesson.translate();
    
   // setUsers(list);
  }, [search, roleFilter, statusFilter, sortBy]);


  return (
    <div className="page">
      <main className="container">
        {/* HEADER */}
        {/* BARRE DE FILTRES */}
        <Grid container sx={{ mb: 2.5 }} direction={'row'} alignItems={'center'} spacing={{ xs: 1, sm: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ background: '' }}>
            <TextFieldComponentDark
              value={search}
              placeholder={t('placeholder_search', { ns: ClassUser.NS_COLLECTION })}
              fullWidth
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </Grid>
          <Grid size={'grow'}>
            <Grid container spacing={0.5} alignItems={'center'} justifyContent={{ xs: 'start', sm: 'end' }} sx={{ background: '', height: '100%' }}>
              <Grid size={'auto'}>            <SelectComponentDark
                //label={'Rôle'}
                value={roleFilter}
                values={['all', ...ClassUser.ALL_ROLES].map(item => ({ id: item, value: t(item, { ns: NS_ROLES }) }))}
                onChange={(e) => setRoleFilter(e.target.value)}
                hasNull={false}
              /></Grid>
              <Grid size={'auto'}>            <SelectComponentDark
                //label={'Rôle'}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                values={['all_status', ...ClassUser.ALL_STATUS].map(item => ({ id: item, value: t(item, { ns: ClassUser.NS_COLLECTION }) }))}
                hasNull={false}
              /></Grid>
              <Grid size={'auto'}>            <SelectComponentDark
                //label={'Rôle'}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                values={['name', 'role'].map(item => ({ id: item, value: `Trier par ${t(item, { ns: NS_ROLES })}` }))}
                hasNull={false}
              /></Grid>
            </Grid>
            <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'end'} sx={{ height: '100%' }}>
            </Stack>
          </Grid>
        </Grid>

        {/* TABLE / LISTE */}
        <section className="card">
          <div className="table-header">
            <span className="th th-user">{"Cours"}</span>
            <span className="th th-username">{"Code"}</span>
            <span className="th th-role">{"Type"}</span>
            <span className="th th-email">{"Niveau"}</span>
            <span className="th th-status">{"Date"}</span>
            <span className="th th-group">{"Prix"}</span>
            <span className="th th-actions">{"Places"}</span>
            <span className="th th-actions">{"Statut"}</span>
            <span className="th th-actions">{"Actions"}</span>
          </div>

          <div className="table-body">
            {lessons.length === 0 && (
              <div className="empty-state">
                {t('not-found', { ns: ClassLesson.NS_COLLECTION })}
              </div>
            )}

            {lessons.map((lesson, i) => (
              <Box key={`${lesson.uid}-${i}`} onClick={() => {
                //setUserDialog(user);
                //changeLesson(lesson.uid);
                router.push(`${PAGE_LESSONS}/${lesson.uid}`)
              }} sx={{ cursor: 'pointer' }}>
                <LessonRow lesson={lesson} lastChild={i === lessons.length - 1} />
              </Box>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          width:100%;
          padding:0;
          color: ${text.main};
          
        }

        .container {
          width: 100%;
          min-height: 100%;
          padding:0;
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .breadcrumb {
          margin: 0 0 4px;
          font-size: 0.75rem;
          color: #6b7280;
        }

        h1 {
          margin: 0 0 6px;
          font-size: 1.8rem;
        }

        .muted {
          margin: 0;
          font-size: 0.9rem;
          color: #9ca3af;
          max-width: 480px;
        }

        .header-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
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

        .btn.ghost {
          background: transparent;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .search-block {
          flex: 1;
          min-width: 220px;
        }

        .search-block input {
          width: 100%;
          border-radius: 999px;
          border: 1px solid #1f2937;
          padding: 5px 12px;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.9rem;
          outline: none;
        }

        .search-block input::placeholder {
          color: #6b7280;
        }

        .filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        .filters select {
          border-radius: 999px;
          border: 1px solid #1f2937;
          background: #020617;
          color: #e5e7eb;
          padding: 6px 10px;
          font-size: 0.85rem;
          outline: none;
        }

        .card {
          background: ${cardColor.main};
          border-radius: 16px;
          border: 1px solid ${cardColor.main};
          
          padding: 0;
           overflow: hidden;           /* ✅ coupe les bords des enfants, y compris au hover */
        }

        .table-header {
          display: grid;
          ${TABLE_SPACE}
          gap: 8px;
          padding: 8px 15px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: ${'white'};
          font-weight: 500;
          border-bottom: 1px solid ${'black'};
          background: ${'black'};
        }

        @media (max-width: 900px) {
          .table-header {
            display: none;
          }
        }

        .th {
          white-space: nowrap;
        }

        .table-body {
          display: flex;
          flex-direction: column;
        }

        .empty-state {
          padding: 16px;
          text-align: center;
          font-size: 0.9rem;
          color: #9ca3af;
        }

        @media (max-width: 900px) {
          .card {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}

function UserRow({ user: lesson, lastChild = false, setUserDialog = null }) {
  const { theme } = useThemeMode();
  const { greyLight, cardColor, text } = theme.palette;
  const { lang } = useLanguage();
  const { t } = useTranslation([NS_LANGS, NS_ROLES, ClassUser.NS_COLLECTION]);
  const roleCfg = ROLE_CONFIG[lesson.role];
  const statusCfg = STATUS_CONFIG_1[lesson.status || (lesson.activated ? 'activated' : 'no-activated')];

  return (
    <>
      <div className={`row ${lastChild ? 'last-child' : ''}`}>
        {/* Utilisateur */}
        <div className="cell cell-user">
          {lesson?.showAvatar?.({ size: 30, fontSize: '14px' })}
          <div className="user-text">
            <p className="user-name">
              {lesson.firstName || lesson.first_name || ''} {lesson.lastName || lesson.last_name || ''}
            </p>
            <p className="user-id">{`${t('lang', { ns: ClassUser.NS_COLLECTION })} : ${lesson.language || t(lesson.preferred_language, { ns: NS_LANGS }) || ''}` || ''}</p>
          </div>
        </div>

        {/* Username */}
        <div className="cell cell-username">
          <p className="text-main">@{lesson.username || lesson.display_name || ''}</p>
          <p className="text-sub" style={{ display: 'none' }}>{`${t('lang', { ns: ClassUser.NS_COLLECTION })} : ${lesson.language || t(lesson.preferred_language, { ns: NS_LANGS }) || ''}` || ''}</p>
        </div>

        {/* Rôle */}
        <div className="cell cell-role">
          <span
            className="role-badge"
            style={{
              borderColor: roleCfg?.color || '',
              color: '',
            }}
          >
            <span
              className="role-dot"
              style={{ backgroundColor: roleCfg?.color || '', display: 'none' }}
            />
            {t(lesson?.role, { ns: NS_ROLES }) || ''}
          </span>
        </div>

        {/* Email */}
        <div className="cell cell-email">
          <p className="text-main">{lesson.schoolEmail || lesson.email_academy || ''}</p>
          <p className="text-sub" style={{ display: 'none' }}>{lesson.email_academy || ''}</p>
        </div>

        {/* Statut */}
        <div className="cell cell-status">
          <span className="status-pill">
            <span
              className="status-dot"
              style={{ backgroundColor: statusCfg?.color || '' }}
            />
            {t(lesson?.status, { ns: ClassUser.NS_COLLECTION }) || ''}
          </span>
        </div>

        {/* Groupe / Langue */}
        <div className="cell cell-group">
          <p className="text-main">{'Dernière connexion'}</p>
          <p className="text-sub">{lesson.mainGroup || getFormattedDateCompleteNumeric(lesson?.last_connexion_time, lang) || ''}</p>
        </div>

        {/* Actions */}
        <div className="cell cell-actions">
          <ButtonConfirm
            label='Voir'
            onClick={() => {
              setUserDialog(lesson);
            }}
          />
        </div>
      </div>

      {/* Styles spécifiques à la row */}
      <style jsx>{`
        .row {
          display: grid;
          grid-template-columns:
            minmax(0, 2.5fr)
            minmax(0, 1.5fr)
            minmax(0, 1.5fr)
            minmax(0, 2.3fr)
            minmax(0, 1.4fr)
            minmax(0, 2.2fr)
            minmax(0, 1.5fr);
          gap: 8px;
          padding: 10px 16px;
          font-size: 0.85rem;
          border-bottom: 0.1px solid ${ClassColor.GREY_HYPER_LIGHT};
          align-items: center;
        }

        
        .row.last-child {
          border-bottom: none;
        }

        .cell {
          min-width: 0;
        }

        .cell-user {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-text {
          min-width: 0;
        }

        .user-name {
          margin: 0;
          font-weight: 500;
        }

        .user-id {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .text-main {
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .text-sub {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          border: 1px solid;
          padding: 2px 8px;
          font-size: 0.75rem;
          background: ${roleCfg.color};
        }

        .role-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          padding: 2px 8px;
          font-size: 0.75rem;
          border: 0.1px solid ${statusCfg?.color};
          
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
        }

        .mini-btn {
          border-radius: 999px;
          padding: 4px 8px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.75rem;
          cursor: pointer;
          margin-right: 4px;
        }

        .mini-btn.ghost {
          background: transparent;
        }

        @media (max-width: 900px) {
          .row {
            grid-template-columns: 1fr;
            padding: 10px 10px;
            border-radius: 12px;
            margin-bottom: 8px;
            border: 1px solid #111827;
          }

          .row.last-child {
          border: 1px solid #111827;
        }

          .cell-email,
          .cell-group {
            margin-top: -4px;
          }

          .cell-actions {
            display: flex;
            justify-content: flex-end;
            gap: 4px;
          }
        }
      `}</style>
    </>
  );
}

function LessonRow({ lesson = null, lastChild = false, setUserDialog = null }) {
  const router = useRouter();
  const { theme } = useThemeMode();
  const { greyLight, cardColor, text } = theme.palette;
  const { lang } = useLanguage();
  const { t } = useTranslation([NS_LANGS, NS_ROLES, ClassUser.NS_COLLECTION]);
  const FORMAT_CONFIG = ClassLesson.FORMAT_CONFIG;
  const roleCfg = FORMAT_CONFIG[lesson?.format];
  const statusCfg = STATUS_CONFIG_1[lesson.status || (lesson.activated ? 'activated' : 'no-activated')];

  return (
    <>
      <div className={`row ${lastChild ? 'last-child' : ''}`}>
        {/* Utilisateur */}
        <div className="cell cell-user">
          {lesson?.showAvatar?.({ size: 30, fontSize: '14px' })}
          <div className="user-text">
            <p className="user-name">
              {lesson?.title}
            </p>
            {
              lesson?.certified && <p className="user-id">{lesson?.category}</p>
            }
          </div>
        </div>

        {/* Username */}
        <div className="cell cell-username">
          <p className="text-main">{lesson?.code}</p>
          <p className="text-sub">{`${t('lang', { ns: ClassUser.NS_COLLECTION })} : ${t(lesson.lang, { ns: NS_LANGS }) || ''}` || ''}</p>
        </div>

        {/* Rôle */}
        <div className="cell cell-role">
          <BadgeFormatLesson format={lesson?.format} />
        </div>

        {/* Email */}
        <div className="cell cell-email">
          <p className="text-main">{lesson?.level}</p>
          <Stack direction={'row'} alignItems={'center'} spacing={0.5} sx={{ display: lesson?.certified ? 'flex' : 'none' }}>
            <IconCertificate color='#6b7280' height={15} width={15} />
            <p className="text-sub" style={{
              marginLeft:"1px",
              fontSize: '0.75rem',
              color: '#6b7280',
            }}>{"Certifié"}</p>
          </Stack>
        </div>

                 {/* Dates */}
        <div className="cell cell-group">
          <p className="text-main">{`${getFormattedDateNumeric(lesson?.start_date)} - ${getFormattedDateNumeric(lesson?.end_date)}`}</p>
          <p className="text-sub">{`Durée : ${formatDuration(lesson?.duration)}`}</p>
        </div>

                         {/* Prix */}
        <div className="cell cell-group">
          <p className="text-main">{`${lesson?.price} ${lesson.currency}`}</p>
          <p className="text-sub" style={{display:'none'}}>{`Durée : ${formatDuration(lesson?.duration)}`}</p>
        </div>

                                 {/* Disponibilité */}
        <div className="cell cell-group">
          <p className="text-main">{`${lesson?.seats_taken}/${lesson?.seats_availables} inscrits`}</p>
          {
            lesson?.seats_taken < lesson?.seats_availables && <p className="text-sub">{`${lesson?.seats_availables - lesson?.seats_taken} place(s) disponible(s)`}</p>
          }
          {
            lesson?.seats_taken === lesson?.seats_availables && <p className="text-sub">{`Complet`}</p>
          }
        </div>

        {/* Statut */}
        <div className="cell cell-status">
          <BadgeStatusLesson status={lesson?.status} />
        </div>


        {/* Actions */}
        <div className="cell cell-actions">
          <ButtonConfirm
            label='Voir'
            onClick={() => {
              router.push(`${PAGE_LESSONS}/${lesson?.uid}`)
              //setUserDialog(lesson);
            }}
          />
        </div>
      </div>

      {/* Styles spécifiques à la row */}
      <style jsx>{`
        .row {
          display: grid;
          ${TABLE_SPACE}
          gap: 8px;
          padding: 10px 16px;
          font-size: 0.85rem;
          border-bottom: 0.1px solid ${ClassColor.GREY_HYPER_LIGHT};
          align-items: center;
        }

        
        .row.last-child {
          border-bottom: none;
        }

        .cell {
          min-width: 0;
        }

        .cell-user {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-text {
          min-width: 0;
        }

        .user-name {
          margin: 0;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-id {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .text-main {
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .text-sub {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          border: 1px solid;
          padding: 2px 8px;
          font-size: 0.75rem;
          background: ${roleCfg.color};
        }

        .role-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          padding: 2px 8px;
          font-size: 0.75rem;
          border: 0.1px solid ${statusCfg?.color};
          
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
        }

        .mini-btn {
          border-radius: 999px;
          padding: 4px 8px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.75rem;
          cursor: pointer;
          margin-right: 4px;
        }

        .mini-btn.ghost {
          background: transparent;
        }

        @media (max-width: 900px) {
          .row {
            grid-template-columns: 1fr;
            padding: 10px 10px;
            border-radius: 12px;
            margin-bottom: 8px;
            border: 1px solid #111827;
          }

          .row.last-child {
          border: 1px solid #111827;
        }

          .cell-email,
          .cell-group {
            margin-top: -4px;
          }

          .cell-actions {
            display: flex;
            justify-content: flex-end;
            gap: 4px;
          }
        }
      `}</style>
    </>
  );
}

function Avatar({ user }) {
  const initials = `${user?.firstName?.[0] || user?.first_name?.[0] || ''}${user.lastName?.[0] || user.last_name?.[0] || ''}`;

  if (user.avatarUrl) {
    return (
      <>
        <div className="avatar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.avatarUrl || user.photo_url || ''} alt={initials} />
        </div>

        <style jsx>{`
          .avatar {
            width: 32px;
            height: 32px;
            border-radius: 999px;
            overflow: hidden;
            border: 1px solid #1f2937;
          }
          .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="avatar-fallback">
        {initials}
      </div>

      <style jsx>{`
        .avatar-fallback {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default function LessonsPage() {
  const { theme } = useThemeMode();
  const { text } = theme.palette;
  const { t } = useTranslation([NS_DASHBOARD_USERS]);
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const { user, login, logout } = useAuth();
  //static async create(data = {})

  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");




  return (<DashboardPageWrapper 
  title={'Cours'} 
  titles={[{name:t('lessons', {ns:NS_DASHBOARD_MENU}), url:''}]}
  subtitle={"Consulte tous les cours de Dandela Academy : état des disponibilités, formats, certifications et tarifs."} icon={<IconDashboard width={22} height={22} />}>
    <DialogUser userDialog={user} setUserDialog={setUser} />
    <Stack sx={{ width: '100%', height: '100%' }}>
      <LessonsComponent userDialog={user} setUserDialog={setUser} />
    </Stack>
  </DashboardPageWrapper>)
  /*
  return (
    <LoginPageWrapper>
            <Typography>
              Se connecter
            </Typography>
            <Stack spacing={1}>
              <TextFieldComponent
                //label='email'
                name='email'
                icon={<IconEmail width={20} />}
                placeholder='adress'
                value={email}
                onChange={(e) => {
                  e.preventDefault();
                  setEmail(e.target.value);
                }}
                onClear={() => {
                  setEmail('');
                }}

              />
              <TextFieldPasswordComponent
                //label='email'
                name='password'
                placeholder='password'
                value={password}
                onChange={(e) => {
                  e.preventDefault();
                  setPassword(e.target.value);
                }}
                onClear={() => {
                  setPassword('');
                }}

              />
            </Stack>
            <ButtonNextComponent 
            label='Se connecter'
            onClick={()=>{
              login(email, password);
            }}
            />
    </LoginPageWrapper>
  );
  */
}
