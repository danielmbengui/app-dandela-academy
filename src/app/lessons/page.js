"use client";
import React, { useEffect, useState } from 'react';
import { IconCertificate, IconDashboard, IconLessons, IconSearch, } from "@/assets/icons/IconsComponent";
import { WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_COMMON, NS_DASHBOARD_HOME, NS_DASHBOARD_MENU, NS_DASHBOARD_USERS, NS_LANGS, NS_LESSONS, NS_ROLES, } from "@/contexts/i18n/settings";
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
import Image from 'next/image';
import { ClassLessonChapter } from '@/classes/lessons/ClassLessonChapter';
import { ChapterProvider, useChapter } from '@/contexts/ChapterProvider';
import { ClassLessonSubchapter } from '@/classes/lessons/ClassLessonSubchapter';
import { useUsers } from '@/contexts/UsersProvider';


const STATUS_CONFIG_1 = {
  online: { label: "En ligne", color: "#22c55e" },
  connected: { label: "En ligne", color: "#22c55e" },
  offline: { label: "Hors ligne", color: "#6b7280" },
  disconnected: { label: "Hors ligne", color: "#6b7280" },
  away: { label: "Absent", color: "#eab308" },
  ['must-activate']: { label: 'Pas activé', color: `red` },
};

const TABLE_SPACE = `grid-template-columns:
            minmax(0, 0.5fr)
            minmax(0, 2.0fr)
            minmax(0, 1.0fr)
            minmax(0, 0.5fr)
            minmax(0, 1.0fr)
            ;`

function LessonsComponent() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { theme } = useThemeMode();
  const { text, cardColor, } = theme.palette;
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_LESSONS, NS_ROLES, ClassUser.NS_COLLECTION, ClassLessonChapter.NS_COLLECTION]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [lessonsFilter, setLessonsFilter] = useState([]);
  //const [_, setLessons] = useState([]);
  const { lessons, changeLesson } = useLesson();

  

  const [filter, setFilter] = useState({
    search: "",
  })

  useEffect(() => {
    //let list = [...lessons];
    for(const lesson of lessons) {
      router.prefetch(`${PAGE_LESSONS}/${lesson.uid}`);
    }
  }, [lessons]);
  useEffect(() => {
    let list = [...lessons];
    if (filter.search.length) {
      list = list.filter((u) => {
        const cond_title = u.translate.title.toLowerCase().includes(filter.search.toLowerCase());
        const cond_category = t(u.category)?.toLowerCase().includes(filter.search.toLowerCase());
        return cond_title || cond_category;
      });
    }
    setLessonsFilter(list);
  }, [filter.search, lessons]);
  return (
    <div className="page">
      <main className="container">
        {/* HEADER */}
        {/* BARRE DE FILTRES */}
        <Grid container sx={{ mb: 2.5 }} direction={'row'} alignItems={'center'} spacing={{ xs: 1, sm: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ background: '' }}>
            <FieldComponent
              name={'search'}
              value={filter.search || ""}
              placeholder={t('placeholder_search', { ns: NS_LESSONS })}
              fullWidth
              type='text'
              icon={<IconSearch width={18} />}
              onChange={(e) => {
                e.preventDefault();
                setFilter(prev => ({
                  ...prev,
                  search: e.target.value,
                }));
              }}
              onClear={() => setFilter(prev => ({
                ...prev,
                search: "",
              }))}
            />
          </Grid>
        </Grid>

        {/* TABLE / LISTE */}
        <section className="card">
          <div className="table-header">
            <span className="th th-user">{""}</span>
            <span className="th th-user">{t('lesson')}</span>
            <span className="th th-user">{t('level')}</span>
            <span className="th th-user">{t('chapters')}</span>
            <span className="th th-user">{t('certified_short')}</span>
          </div>

          <div className="table-body">
            {lessonsFilter.length === 0 && (
              <div className="empty-state">
                {t('not-found', { ns: NS_LESSONS })}
              </div>
            )}

            {lessonsFilter.map((lesson, i) => {
              //console.log("one lesson while", await lesson.getMinLevel(lang))
              return (
                <Box key={`${lesson.uid}`} onClick={() => {
                  //setUserDialog(user);
                  //changeLesson(lesson.uid);
                  router.push(`${PAGE_LESSONS}/${lesson.uid}`)
                }} sx={{ cursor: 'pointer' }}>
                  <ChapterProvider uidLesson={lesson.uid}>
                    <LessonRow lesson={lesson} lastChild={i === lessons.length - 1} />
                  </ChapterProvider>
                </Box>
              )
            })}
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
          border: 0.1px solid var(--card-border);
          
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
          border-bottom: 0.1px solid var(--card-border);
          background: var(--blackColor);
        }

        @media (max-width: 900px) {
          .table-header {
            display: none;
          }
        }

        .th {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
function LessonRow({ lesson = null, lastChild = false }) {
  const router = useRouter();
  const { theme } = useThemeMode();
  const { greyLight, cardColor, text } = theme.palette;
  const { lang } = useLanguage();
  const { chapters, getMinLevel, getMaxLevel, getCountSubchapters } = useChapter();
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, ClassLessonChapter.NS_COLLECTION, NS_LANGS, NS_ROLES, ClassUser.NS_COLLECTION]);
  const FORMAT_CONFIG = ClassLesson.FORMAT_CONFIG;
  const roleCfg = FORMAT_CONFIG[lesson?.format];
  const statusCfg = STATUS_CONFIG_1[lesson.status || (lesson.activated ? 'activated' : 'no-activated')];
  //console.log("LESSON", lesson);

  const {minLevelId,minLevelValue, maxLevelId, maxLevelValue} = useMemo(() => {
    return {
      minLevelId:getMinLevel(lesson?.id)?.id,
      minLevelValue:getMinLevel(lesson?.id)?.value,
      maxLevelId:getMaxLevel(lesson?.id)?.id,
      maxLevelValue:getMaxLevel(lesson?.id)?.value,
    };
}, [lesson]);
  return (
    <>
      <div className={`row ${lastChild ? 'last-child' : ''}`}>
        {/* Image */}
        <div className="cell cell-image">
          {
            lesson?.translate?.photo_url && <Box sx={{ background: '', width: {sm:'50%'} }}>
              <Image
                src={lesson?.translate?.photo_url}
                alt={`lesson-${lesson?.uid}`}
                quality={100}
                width={300}
                height={150}
                //loading="lazy"
                priority
                style={{
                  width: '100%',
                  height: 'auto',
                  //maxHeight:'400px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            </Box>
          }
        </div>
        {/* Cours */}
        <div className="cell cell-lesson">
          {lesson?.showAvatar?.({ size: 30, fontSize: '14px' })}
          <div className="user-text">
            <p className="user-name">{lesson?.translate?.title}</p>
            <p className="user-id">{t(lesson?.category)}</p>
          </div>
        </div>

        {/* Niveau */}
        <div className="cell cell-level">
          {lesson?.showAvatar?.({ size: 30, fontSize: '14px' })}
          <div className="user-text">
          
            <p className="user-name">{t(minLevelValue)}-{t(maxLevelValue)}</p>
            <p className="user-id">{t('level')} : {minLevelId}-{maxLevelId}</p>
          </div>
        </div>

        {/* Chapitres */}
        <div className="cell cell-chapters">
          <p className="text-main">{chapters.length} {t('chapters', { ns: NS_COMMON })}</p>
          <p className="text-sub">{getCountSubchapters()} {t('subchapters', { ns: NS_COMMON })}</p>
        </div>

        {/* Certificé */}
        <div className="cell cell-certified">
          <p className="text-main">{lesson?.level}</p>
          <Stack direction={'row'} alignItems={'center'} spacing={0.5} sx={{ display: lesson?.certified ? 'flex' : 'none' }}>
            <IconCertificate color='var(--primary)' height={15} width={15} />
            <p className="text-sub" style={{
              marginLeft: "1px",
              fontSize: '0.75rem',
              color: '#6b7280',
            }}>{t('certified')}</p>
          </Stack>
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
          background: ${roleCfg?.color};
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
            border: 0.1px solid var(--card-border);
          }

        .row.last-child {
          border: 0.1px solid var(--card-border);
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

export default function LessonsPage() {
  const { t } = useTranslation([NS_LESSONS, NS_DASHBOARD_MENU]);

  return (<DashboardPageWrapper
    //title={'Cours'} 
    titles={[{ name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: '' }]}
    subtitle={t('subtitle')}
    icon={<IconLessons width={22} height={22} />}
  >
    <Stack sx={{ width: '100%', height: '100%' }}>
      <LessonsComponent />
    </Stack>
  </DashboardPageWrapper>)
}
