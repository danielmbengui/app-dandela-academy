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
import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { ClassSchool } from '@/classes/ClassSchool';
import { ClassRoom } from '@/classes/ClassRoom';
import { ClassHardware } from '@/classes/ClassDevice';
import { ClassUser, ClassUserStudent, ClassUserTeacher } from '@/classes/users/ClassUser';
import { useSession } from '@/contexts/SessionProvider';
import { ClassColor } from '@/classes/ClassColor';
import Link from 'next/link';
import { PAGE_DASHBOARD_CALENDAR, PAGE_DASHBOARD_COMPUTERS, PAGE_DASHBOARD_PROFILE, PAGE_DASHBOARD_USERS, PAGE_LESSONS, PAGE_STATS } from '@/contexts/constants/constants_pages';
import { getFormattedDateCompleteNumeric, getFormattedDateNumeric, getFormattedHour, translateWithVars } from '@/contexts/functions';
import DialogCompleteProfile from '@/components/dashboard/complete-profile/DialogCompleteProfile';
import { useStat } from '@/contexts/StatProvider';
import { ClassUserStat } from '@/classes/users/ClassUserStat';
import { useLesson } from '@/contexts/LessonProvider';
import { useChapter } from '@/contexts/ChapterProvider';
import { useRouter } from 'next/navigation';
import { t } from 'i18next';

function FormatDateToRelative (date = new Date())  {
  const { t } = useTranslation([NS_DAYS]);
  if (!(date instanceof Date)) return null;
  const today = new Date();
  const timeToday = today.getTime();
  const timePast = date.getTime();
  if (timePast > timeToday) return 0;
  //const STEP_SECONDS = 60;
  const STEP_MINUTES = 60;
  const STEP_HOUR = STEP_MINUTES * 60;
  const STEP_DAY = STEP_HOUR * 24;
  const STEP_WEEK = STEP_DAY * 7;
  const STEP_MONTH = STEP_DAY * 30;
  const STEP_YEAR = STEP_DAY * 365;
  const seconds = (timeToday - timePast) / 1000;
  if (seconds < STEP_MINUTES) return t('now'); // moins d'une minute
  if (seconds < STEP_HOUR) return t('less-one-hour'); // moins d'une heure
  const _hour = parseInt(seconds / STEP_HOUR);
  //console.log("OOOOOK", t('upon-hour'), translateWithVars(t('upon-hour'), { hour: _hour }));
  if (seconds < STEP_DAY) return translateWithVars(t('upon-hour'), { hour: _hour }); // moins de 24h
  const _day = parseInt(seconds / STEP_DAY);
  if (seconds <= STEP_DAY * 6) return translateWithVars(t('upon-day'), { day: _day }); // jusqua 6j
  if (seconds < STEP_WEEK) return translateWithVars(t('upon-week'), { week: 1 }); // moins de 7j
  if (seconds <= STEP_DAY * 13) return translateWithVars(t('upon-day'), { day: _day }); // jusqua 13j
  if (seconds < STEP_WEEK * 2) return translateWithVars(t('upon-week'), { week: 2 }); // moins de deux semaines
  //if (seconds <= STEP_DAY * 20) return `Il ya ${_day} jour(s)`; // jusqau 21j
  if (seconds < STEP_WEEK * 3) return translateWithVars(t('upon-week'), { week: 3 }); // moins de trois semaines
  if (seconds < STEP_MONTH) return translateWithVars(t('upon-month'), { month: 1 }); // moins d'un mois
  if (seconds < STEP_MONTH * 3) return translateWithVars(t('upon-month'), { month: 3 }); // moins d'un mois
  if (seconds < STEP_MONTH * 6) return translateWithVars(t('upon-month'), { month: 6 }); // moins d'un mois
  if (seconds < STEP_MONTH * 9) return translateWithVars(t('upon-month'), { month: 9 }); // moins d'un mois
  if (seconds < STEP_YEAR) return translateWithVars(t('upon-year'), { year: 1 }); // moins d'un an
  if (seconds < STEP_YEAR * 2) t('more-year'); // moins d'un mois
  const _year = parseInt(seconds / STEP_YEAR);
  return translateWithVars(t('more-years'), { years: _year }); // moins d'un mois

  /*
  
  if (seconds < STEP_HOUR) {
    const _minutes = parseInt(seconds / STEP_MINUTES);
    const _seconds = parseInt(seconds % STEP_MINUTES);
    return `${_minutes}min${_seconds > 0 ? ` ${_seconds}s` : ''}`;
  }
  if (seconds < STEP_DAY) {
    const _hours = parseInt(seconds / STEP_HOUR);
    const _minutes = parseInt((seconds % STEP_HOUR) / STEP_MINUTES);
    const _seconds = parseInt((seconds % STEP_HOUR) % STEP_MINUTES);
    return `${_hours}h ${_minutes ? `${_minutes}min` : ''} ${_seconds ? `${_seconds}s` : ''}`;
  }
  const _days = parseInt(seconds / STEP_DAY);
  const _hours = parseInt((seconds % STEP_DAY) / STEP_HOUR);
  const _minutes = parseInt(((seconds % STEP_DAY) % STEP_HOUR) / STEP_MINUTES);
  const _seconds = parseInt(((seconds % STEP_DAY) % STEP_HOUR) % STEP_MINUTES);
  return `${_days}j ${_hours}h ${_minutes}min ${_seconds}s`;
  */
}
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
          border: 0.1px solid var(--primary);

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
function EvolutionCard({ stat = null, previousStat = null, onClick = () => { } }) {
  const { t } = useTranslation([NS_DASHBOARD_HOME]);

  const { getOneLesson } = useLesson();
  const { getOneChapter } = useChapter();
  const { emoji, text, lesson, chapter, percentStat, percentPreviousStat, progressScore } = useMemo(() => {
    var emoji = "ℹ️";
    var text = t('events.completed-quiz');
    const lesson = getOneLesson(stat.uid_lesson);
    const chapter = getOneChapter(stat.uid_chapter);
    const percentPreviousStat = (previousStat?.score / previousStat?.answers?.length) * 100;
    const percentStat = (stat?.score / stat?.answers?.length) * 100;
    const progressScore = stat?.score - previousStat?.score;
    if (stat.isFirst) {
      emoji = "💼";
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
      <div className="dash-msg" onClick={onClick}>
        <div className="dash-emoji">{emoji}</div>
        <div className="dash-body">
          <Stack className="dash-header" direction={'row'} alignItems={'start'} spacing={1} justifyContent={'space-between'}>
            <span className="dash-from">{text}</span>
            <Typography variant='caption' noWrap style={{ fontSize: '12px' }}>{FormatDateToRelative(stat.end_date)}</Typography>
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
            cursor: pointer;
          }
          .dash-msg:hover {
            border: 0.1px solid var(--primary);
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
function EvolutionListComponent({ stats = [] }) {
  const DEFAULT_VIEW = 3;
  const router = useRouter();
  const { t } = useTranslation([NS_DASHBOARD_HOME]);
  const [filter, setFilter] = useState('part');

  const seeMore = () => {
    //setCountView(stats.length);
    setFilter('all')
  }
  const seeLess = () => {
    //setCountView(DEFAULT_VIEW);
    setFilter('part');
  }
  const statsFiltered = useMemo(() => {
    var _stats = [...stats].sort((a, b) => a.end_date.getTime() - b.end_date.getTime());

    _stats = [..._stats].map((stat, i) => {
      const array = [..._stats].filter(s => s.uid_chapter === stat.uid_chapter);
      //const max = getBestStat(stat.uid_lesson, stat.uid_chapter);
      //const min = getWorstStat(stat.uid_lesson, stat.uid_chapter);
      const score = stat.answers.filter(a => a.uid_answer === a.uid_proposal).length;
      const chapterStats = _stats.filter(s => s.uid_chapter === stat.uid_chapter);
      const chapterIndex = chapterStats.findIndex(s => s.uid === stat.uid);
      const previousStat = chapterIndex > 0 ? chapterStats[chapterIndex - 1] : null;
      //const previousStat = i > 0 ? array.length > 1 ? array[i - 1] : null : null;
      return ({
        ...stat.toJSON(),
        score,
        isFirst: chapterIndex === 0,
        isBest: score === stat.answers.length,
        isGood: stat.status === ClassUserStat.STATUS.GOOD || stat.status === ClassUserStat.STATUS.EXCELLENT,
        isNotGood: stat.status === ClassUserStat.STATUS.NOT_GOOD,
        isWorst: score === 0,
        previousStat: previousStat,
        hasProgress: previousStat ? score > previousStat.score : false,
      })
    });
    _stats = [..._stats].sort((a, b) => b.end_date.getTime() - a.end_date.getTime());
    if (filter === 'part') {
      return _stats.slice(0, DEFAULT_VIEW);
    }
    return _stats;
  }, [stats, filter]);
  useEffect(() => {
    if (!stats.length) return;
    stats.forEach(stat => {
      router.prefetch(
        ClassUserStat.createUrl(stat.uid_lesson, stat.uid_chapter, stat.uid)
      );
    });
  }, [stats, router]);


  return (<>
    <div className="card">
      <div className="card-header">
        <h2>{t('recent-actualities')}</h2>
        <Link href={PAGE_STATS} >
          <span className="link-btn">{t('see-all')}</span>
        </Link>
      </div>
      <Stack spacing={1}>
        {statsFiltered.map((stat) => (
          <EvolutionCard key={stat.uid} stat={stat} previousStat={stat.previousStat} onClick={() => router.push(ClassUserStat.createUrl(stat.uid_lesson, stat.uid_chapter, stat.uid))} />
        ))}
      </Stack>
      {
        statsFiltered.length > 0 && <Stack sx={{ background: '', color: 'var(--primary)', py: 0.5 }} justifyContent={'center'} alignItems={'center'} spacing={0.5}>
          {
            filter === 'part' && <Stack
              onClick={seeMore}
              direction={'row'} sx={{ cursor: 'pointer', background: '', color: 'var(--primary)', py: 1 }} justifyContent={'center'} alignItems={'center'} spacing={0.5}>
              <IconDropDown height={12} width={12} color='inherit' />
              <Typography variant='caption' sx={{ color: 'inherit' }}>{t('see-more')}</Typography>
            </Stack>
          }
          {
            filter === 'all' && <Stack
              onClick={seeLess}
              direction={'row'} sx={{ cursor: 'pointer', background: '', color: 'var(--primary)', py: 1 }} justifyContent={'center'} alignItems={'center'} spacing={0.5}>
              <IconDropUp height={12} width={12} color='inherit' />
              <Typography variant='caption' sx={{ color: 'inherit' }}>{t('see-less')}</Typography>
            </Stack>
          }
        </Stack>
      }
    </div>
    <style jsx>{`  
        .card {
          background: var(--card-color);
          border-radius: 10px;
          border: 0.1px solid var(--card-color);
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

export default function DashboardComponent({ stats = [] }) {
  const { t } = useTranslation([NS_DASHBOARD_HOME]);
  
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
                description={t('links.calendar.subtitle')}
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
          {
            <EvolutionListComponent stats={stats} />
          }
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
          border: 0.1px solid var(--card-color);
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
