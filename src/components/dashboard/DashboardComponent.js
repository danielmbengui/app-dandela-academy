"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { IconCheckFilled, IconDashboard, IconDropDown, IconDropUp, IconLogoImage, } from "@/assets/icons/IconsComponent";
import { WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_DASHBOARD_HOME, NS_DAYS, } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import ComputersComponent from '@/components/dashboard/computers/ComputersComponent';
import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material';
import { ClassSchool } from '@/classes/ClassSchool';
import { ClassRoom } from '@/classes/ClassRoom';
import { ClassHardware } from '@/classes/ClassDevice';
import { ClassUser, ClassUserStudent, ClassUserTeacher } from '@/classes/users/ClassUser';
import { useSession } from '@/contexts/SessionProvider';
import { ClassColor } from '@/classes/ClassColor';
import Link from 'next/link';
import { PAGE_DASHBOARD_CALENDAR, PAGE_DASHBOARD_COMPUTERS, PAGE_DASHBOARD_PROFILE, PAGE_DASHBOARD_USERS, PAGE_LESSONS, PAGE_STATS } from '@/contexts/constants/constants_pages';
import { getFormattedDateCompleteNumeric, getFormattedDateNumeric, getFormattedHour, useFormatDateToRelative } from '@/contexts/functions';
import DialogCompleteProfile from '@/components/dashboard/complete-profile/DialogCompleteProfile';
import { useStat } from '@/contexts/StatProvider';
import { ClassUserStat } from '@/classes/users/ClassUserStat';
import { useLesson } from '@/contexts/LessonProvider';
import { useChapter } from '@/contexts/ChapterProvider';
import { useRouter } from 'next/navigation';
import { t } from 'i18next';


/** Carte “accès rapide” */
function QuickLink({ emoji, label, description, link = "" }) {
  return (
    <>
      <button type="button" className="quick-link">
        <Link href={link}>

          <Stack spacing={1} type="button">
            <div className="q-emoji">{emoji}</div>
            <div className="q-text">
              <p className="q-label">{label}</p>
              <p className="q-desc">{description}</p>
            </div>
          </Stack>
        </Link>
      </button>

      <style jsx>{`
        .quick-link {
          border-radius: 12px;
          border: 0.1px solid var(--card-border);
          background: var(--card-color);
          padding: 10px 10px;
          display: flex;
          gap: 8px;
          cursor: pointer;
          text-align: left;
          color: var(--font-color);
        }

        .quick-link:hover {
          background: radial-gradient(circle at top left, #1d4ed822, #020617);
          border-color: #1f2937;

          background: var(--card-color);
          border: 0.1px solid var(--primary);
          color:var(-background);
        }

        .q-emoji {
          font-size: 1.2rem;
        }

        .q-text {
          font-size: 0.85rem;
          font-color: var(--font-color);
        }

        .q-label {
          margin: 0 0 2px;
          font-weight: 300;
         
        }

        .q-desc {
          margin: 0;
          font-size: 0.78rem;
          color: #9ca3af;
        }
      `}</style>
    </>
  );
}
function EvolutionCard({ stat = null, previousStat = null }) {
  const { t } = useTranslation([NS_DASHBOARD_HOME]);
  const { getOneLesson } = useLesson();
  const { getOneChapter } = useChapter();
  const { emoji, text, lesson, chapter, percentStat, percentPreviousStat, progressScore } = useMemo(() => {
    var emoji = "ℹ️";
    var text = t('events.new-quiz');
    const lesson = getOneLesson(stat.uid_lesson);
    const chapter = getOneChapter(stat.uid_chapter);
    const percentPreviousStat = (previousStat?.score / previousStat?.answers?.length) * 100;
    const percentStat = (stat?.score / stat?.answers?.length) * 100;
    const progressScore = stat?.score - previousStat?.score;
    if (stat.isFirst) {
      emoji = "1️⃣";
      text = t('events.new-quiz');
    } else if (stat.isBest) {
      emoji = "🏆";
      text = t('events.max-quiz');
    } else if (stat.isGood) {
      emoji = "✅";
      text = t('events.good-quiz');
    } else if (stat.isWorst) {
      emoji = "❌";
      text = t('events.worst-quiz');
    } else if (stat.isNotGood) {
      emoji = "⚠️";
      text = t('events.not-good-quiz');
    } else if (stat.hasProgress) {
      emoji = "📈";
      text = t('events.has-progress-quiz');
    }
    return ({ emoji: emoji, text: text, lesson: lesson, chapter: chapter, percentStat, progressScore, percentPreviousStat: percentPreviousStat });
  }, [stat, previousStat]);

  return (
    <>
      <div className="dash-msg">
        <div className="dash-emoji">{emoji}</div>
        <div className="dash-body">
          <Stack className="dash-header" direction={'row'} alignItems={'start'} spacing={1} justifyContent={'space-between'}>
            <span className="dash-from">{text}</span>
            <Typography variant='caption' noWrap style={{ fontSize: '12px' }}>{useFormatDateToRelative(stat.end_date)}</Typography>
          </Stack>
          <Stack sx={{ width: '100%', background: '' }} spacing={0.5}>
            <Typography variant='caption' fontSize={'0.8rem'}>{lesson?.uid_intern}{". "}{lesson?.translate?.title}</Typography>
            <Typography variant='caption' fontSize={'0.8rem'}>{chapter?.uid_intern}{". "}{chapter?.translate?.title}</Typography>
            <Stack spacing={1} sx={{ py: 1 }}>
              <Grid container spacing={1}>
                {
                  previousStat && <Grid size={{ xs: 12, sm: 'auto' }}>
                    <Chip
                      label={`${t('events.previous')} : ${previousStat?.score}/${previousStat?.answers?.length}`}
                      size='small'
                      sx={{
                        fontWeight: 950,
                        borderRadius: 3,
                        bgcolor: "var(--primary-shadow-xs)",
                        color: "var(--primary)",
                        px: 1,
                        borderColor: "var(--primary-shadow-md)",
                        "& .MuiChip-icon": { color: "var(--primary)", marginRight: 0 },
                      }}
                      variant="outlined"
                    />
                  </Grid>
                }
                <Grid size={{ xs: 12, sm: 'auto' }}>
                  <Chip
                    label={`${t('events.score')} : ${stat.score}/${stat.answers?.length}`}
                    size='small'
                    sx={{
                      fontWeight: 950,
                      borderRadius: 3,
                      bgcolor: "var(--primary-shadow-xs)",
                      color: "var(--primary)",
                      px: 1,
                      borderColor: "var(--primary-shadow-md)",
                      "& .MuiChip-icon": { color: "var(--primary)", marginRight: 0 },
                    }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {
                previousStat && <Grid container spacing={1}>
                  <>
                    <Grid size={{ xs: 12, sm: 'auto' }}>
                      <Chip
                        label={`${t('events.evolution')} : ${progressScore > 0 ? "+" : ''}${progressScore} point(s)`}
                        size='small'
                        sx={{
                          fontWeight: 950,
                          borderRadius: 3,
                          bgcolor: `var(--${progressScore >= 0 ? 'success' : 'error'}-shadow-xs)`,
                          color: `var(--${progressScore >= 0 ? 'success' : 'error'})`,
                          px: 1,
                          borderColor: `var(--${progressScore >= 0 ? 'success' : 'error'}-shadow-md)`,
                          "& .MuiChip-icon": { color: "var(--${progressScore>=0 ? 'success' : 'error'})", marginRight: 0 },
                        }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 'auto' }}>
                      <Chip
                        label={`${t('events.progress')} : ${parseInt(percentStat - percentPreviousStat)}%`}
                        size='small'
                        sx={{
                          fontWeight: 950,
                          borderRadius: 3,
                          bgcolor: `var(--${progressScore >= 0 ? 'success' : 'error'}-shadow-xs)`,
                          color: `var(--${progressScore >= 0 ? 'success' : 'error'})`,
                          px: 1,
                          borderColor: `var(--${progressScore >= 0 ? 'success' : 'error'}-shadow-md)`,
                          "& .MuiChip-icon": { color: "var(--${progressScore>=0 ? 'success' : 'error'})", marginRight: 0 },
                        }}
                        variant="outlined"
                      />
                    </Grid>
                  </>
                </Grid>
              }
            </Stack>
          </Stack>
        </div>
      </div>
      <style jsx>{`
          .dash-msg {
            display: flex;
            gap: 8px;
            padding: 12px 10px;
            border-radius: 10px;
            border: 0.1px solid var(--card-border);
            color:var(--font-color);
          }
  
          .dash-emoji {
            font-size: 1.1rem;
          }
  
          .dash-body {
            flex: 1;
            font-size: 0.82rem;
            width:100%;
          }
  
          .dash-header {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
          }
  
          .dash-from {
            font-weight: 600;
          }
  
          .dash-time {
            color: #6b7280;
          }
  
          .dash-preview {
            margin: 3px 0 0;
            color: #e5e7eb;
          }
        `}</style>
    </>
  );
}
function EvolutionListComponent() {
  const { t } = useTranslation([NS_DASHBOARD_HOME]);
  const DEFAULT_VIEW = 1;
  const router = useRouter();
  const { stats, getBestStat, getWorstStat } = useStat();
  const [countView, setCountView] = useState(DEFAULT_VIEW);
  const seeMore = () => {
    setCountView(stats.length);
  }
  const seeLess = () => {
    setCountView(DEFAULT_VIEW);
  }
  const statsFiltered = useMemo(() => {
    var _stats = [...stats].sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
    _stats = _stats.map((stat, i) => {
      const array = [..._stats].filter(s => s.uid_chapter === stat.uid_chapter);
      //const max = getBestStat(stat.uid_lesson, stat.uid_chapter);
      //const min = getWorstStat(stat.uid_lesson, stat.uid_chapter);
      const score = stat.answers.filter(a => a.uid_answer === a.uid_proposal).length;
      const previousStat = i > 0 ? array.length > 1 ? array[i - 1] : null : null;
      return ({
        ...stat.toJSON(),
        score,
        isFirst: i === 0,
        isBest: score === stat.answers.length,
        isGood: stat.status === ClassUserStat.STATUS.GOOD || stat.status === ClassUserStat.STATUS.EXCELLENT,
        isNotGood: stat.status === ClassUserStat.STATUS.NOT_GOOD,
        isWorst: score === 0,
        previousStat: previousStat,
        hasProgress: previousStat ? score > previousStat.score : false,
      })
    });
    //console.log("STTTTAS", _stats);
    _stats = _stats.sort((a, b) => b.end_date.getTime() - a.end_date.getTime());
    for (const stat of _stats) {
      router.prefetch(ClassUserStat.createUrl(stat.uid_lesson, stat.uid_chapter, stat.uid));
    }
    return _stats.slice(0, countView);
  }, [stats, countView]);
  return (<>
    <div className="card">
      <div className="card-header">
        <h2>{t('recent-actualities')}</h2>
        <Link href={PAGE_STATS}>
          <button className="link-btn">{t('see-all')}</button>
        </Link>
      </div>
      <Stack spacing={1}>
        {statsFiltered.map((stat) => (
          <Link key={stat.uid} href={ClassUserStat.createUrl(stat.uid_lesson, stat.uid_chapter, stat.uid)}>
            <EvolutionCard stat={stat} previousStat={stat.previousStat} />
          </Link>
        ))}
      </Stack>
      <Stack sx={{ background: 'yellow', color: 'var(--primary)', py: 0.5 }} justifyContent={'center'} alignItems={'center'} spacing={0.5}>
        {
          countView < stats.length && <Stack
            onClick={seeMore}
            direction={'row'} sx={{ cursor: 'pointer', background: 'yellow', color: 'var(--primary)', py: 1 }} justifyContent={'center'} alignItems={'center'} spacing={0.5}>
            <IconDropDown height={12} width={12} color='inherit' />
            <Typography variant='caption' sx={{ color: 'inherit' }}>{`Voir plus`}</Typography>
          </Stack>
        }
        {
          countView === stats.length && <Stack
            onClick={seeLess}
            direction={'row'} sx={{ cursor: 'pointer', background: 'yellow', color: 'var(--primary)', py: 1 }} justifyContent={'center'} alignItems={'center'} spacing={0.5}>
            <IconDropUp height={12} width={12} color='inherit' />
            <Typography variant='caption' sx={{ color: 'inherit' }}>{`Voir moins`}</Typography>
          </Stack>
        }
      </Stack>
    </div>
    <style jsx>{`  
        .card {
          background: var(--card-color);
          border-radius: 10px;
          border: 0.1px solid var(--card-border);
          padding: 14px 14px 16px;
        }
  
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          color:${ClassColor.GREY_LIGHT};
        }
  
        .card-header h2 {
          margin: 0;
          font-size: 1.05rem;
        }
  
        .link-btn {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          font-size: 0.8rem;
          color: #60a5fa;
          cursor: pointer;
          color: var(--primary);
        }

        .message-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
  </>)
}
function DandelaDashboardHome() {
  const { t } = useTranslation([NS_DASHBOARD_HOME]);
  const [activeMenu, setActiveMenu] = useState("accueil");
  const { sessions, slots } = useSession();
  const [countObj, setCountObj] = useState({
    students: 0,
    teachers: 0,
    devices: 0,
    sessions: 0,
    slots: 0
  });
  useEffect(() => {
    async function init() {
      const results = await Promise.allSettled([
        ClassUserStudent.count(),
        ClassUserTeacher.count(),
        ClassHardware.count(),
      ]);
      const count_sessions = sessions.length || 0;
      const count_slots = slots.length || 0;

      setCountObj(prev => ({
        ...prev,
        sessions: count_sessions,
        slots: count_slots
      }))

      results.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          //console.log('OK', index, res.value, res);
          setCountObj(prev => ({
            ...prev,
            [Object.keys(prev)[index]]: res.value
          }))
        } else {
          console.error('ERROR', index, res.reason);
        }
      });
    }
    init();
  }, [sessions])

  return (<>
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Stack spacing={1}>
          <div className="card">
            <div className="card-header">
              <h2>{t('fast-access')}</h2>
            </div>
            <div className="quick-links">
              <QuickLink
                label={t('links.lessons.title')}
                description={t('links.lessons.subtitle')}
                emoji="📘"
                link={PAGE_LESSONS}
              />
              <QuickLink
                label={t('links.results.title')}
                description={t('links.results.subtitle')}
                emoji="🏆"
                link={PAGE_STATS}
              />
              <QuickLink
                label={t('links.calendar.title')}
                description={t('links.calendat.subtitle')}
                emoji="📅"
                link={PAGE_DASHBOARD_CALENDAR}
              />
              <QuickLink
                label={t('links.profile.title')}
                description={t('links.profile.subtitle')}
                emoji="👥"
                link={PAGE_DASHBOARD_PROFILE}
              />
            </div>
          </div>


        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Stack spacing={1}>
          <div className="side-col">
            <EvolutionListComponent />
          </div>
        </Stack>
      </Grid>
    </Grid>
    <style jsx>{`
        .page {
          min-height: 100vh;
          background: radial-gradient(circle at top, #111827, #020617 55%);
          background: transparent;
          padding: 0px 0px;
          color: #e5e7eb;
          display: flex;
          justify-content: center;
        }
  
        .shell {
          width: 100%;
          max-width: 1280px;
          border-radius: 10px;
          border: 0.1px solid var(--card-border);
          background: red;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
  
        .layout {
          display: grid;
          grid-template-columns: 220px minmax(1fr, 1fr);
          min-height: 520px;
        }
  
        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }
  
        .sidebar {
          border-right: 1px solid #111827;
          padding: 14px 10px 10px;
          background: radial-gradient(circle at top, #020617, #020617 55%);
        }
  
        @media (max-width: 900px) {
          .sidebar {
            display: none;
          }
        }
  
        .nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
  
        .sidebar-footer {
          margin-top: 18px;
          font-size: 0.75rem;
          color: #6b7280;
        }
  
        .sidebar-hint span {
          color: #e5e7eb;
        }
  
        .content {
          padding: 0;
          background:blue;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
  
        .content-header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          flex-wrap: wrap;
        }
  
        .welcome-text {
          margin: 0 0 4px;
          font-size: 0.85rem;
          color: ${ClassColor.GREY_LIGHT};
        }
  
        h1 {
          margin: 0;
          font-size: 1.7rem;
          color:var(--font-color);
        }
  
        .muted {
          margin: 4px 0 0;
          font-size: 0.9rem;
          color: #9ca3af;
          max-width: 500px;
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
  
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
  
        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
  
        @media (max-width: 650px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
  
        .main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.2fr);
          gap: 14px;
          margin-top: 4px;
        }
  
        @media (max-width: 980px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }
  
        .main-col,
        .side-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
  
        .card {
          background: var(--card-color);
          border-radius: 10px;
          border: 0.1px solid var(--card-border);
          padding: 14px 14px 16px;
        }
  
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          color:${ClassColor.GREY_LIGHT};
        }
  
        .card-header h2 {
          margin: 0;
          font-size: 1.05rem;
        }
  
        .link-btn {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          font-size: 0.8rem;
          color: #60a5fa;
          cursor: pointer;
          color: var(--primary);
        }
  
        .lesson-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
  
        .lesson-item {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          border: 0.1px solid var(--card-border);
          background: var(--card-color);
          color: var(--font-color);
          font-weight: 300;
        }
  
        .lesson-title {
          margin: 0 0 3px;
          font-size: 0.95rem;
        }
  
        .lesson-sub {
          margin: 0;
          font-size: 0.78rem;
          color: #9ca3af;
        }
  
        .lesson-time {
          margin: 4px 0 0;
          font-size: 0.78rem;
          color: #60a5fa;
          color: var(--primary);
        }
  
        .lesson-meta {
          min-width: 90px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          gap: 2px;
        }
  
        .lesson-counter {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
        }
  
        .lesson-counter-sub {
          margin: 0;
          font-size: 0.75rem;
          color: #9ca3af;
        }
  
        .mini-btn {
          border-radius: 999px;
          padding: 4px 10px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.75rem;
          cursor: pointer;
        }
  
        .quick-links {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
  
        @media (max-width: 700px) {
          .quick-links {
            grid-template-columns: 1fr;
          }
        }
  
        .message-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
  
        .system-list {
          list-style: none;
          padding: 0;
          margin: 0 0 8px;
          font-size: 0.85rem;
        }
  
        .system-list li {
          margin-bottom: 4px;
        }
  
        .system-list span {
          color: #9ca3af;
        }
  
        .system-note {
          margin: 4px 0 0;
          font-size: 0.78rem;
          color: #6b7280;
        }
      `}</style>
  </>);
}
export default function DashboardComponent() {
  const { theme } = useThemeMode();
  const { text } = theme.palette;
  const { t } = useTranslation([NS_DASHBOARD_HOME]);
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, logout } = useAuth();
  //static async create(data = {})
  const [processing, setProcessing] = useState(false);


  return (<>
    <div className="page">
      <DandelaDashboardHome />
    </div>
  </>)
}
