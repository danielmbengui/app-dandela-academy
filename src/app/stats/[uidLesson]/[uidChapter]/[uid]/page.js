"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { ClassLessonChapter, ClassLessonChapterTranslation } from "@/classes/lessons/ClassLessonChapter";
import { useLanguage } from "@/contexts/LangProvider";
import { useParams, useRouter } from "next/navigation";
import { useLesson } from "@/contexts/LessonProvider";
import { Trans, useTranslation } from "react-i18next";
import { ClassLesson } from "@/classes/ClassLesson";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { ClassLessonSubchapterTranslation } from "@/classes/lessons/ClassLessonSubchapter";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { IconArrowBack, IconArrowLeft, IconArrowRight, IconBookOpen, IconCalendar, IconCertificate, IconDuration, IconLessons, IconLevel, IconObjective, IconQuizz, IconStats } from "@/assets/icons/IconsComponent";
import { NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS, NS_STATS_ONE } from "@/contexts/i18n/settings";
import { PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { ClassLessonChapterQuestion, ClassLessonChapterQuestionTranslation, ClassLessonChapterQuiz } from "@/classes/lessons/ClassLessonChapterQuiz";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import { addDaysToDate, capitalizeFirstLetter, formatChrono, getFormattedDateComplete, getFormattedDateCompleteNumeric, mixArray } from "@/contexts/functions";
import AlertComponent from "@/components/elements/AlertComponent";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useAuth } from "@/contexts/AuthProvider";
import CircularProgressWithLabelComponent from "@/components/elements/CircularProgressWithLabelComponent";
import AccordionComponent from "@/components/dashboard/elements/AccordionComponent";
import StatsListComponent from "@/components/stats/StatsListComponent";
import { useStat } from "@/contexts/StatProvider";
import OneStatComponent from "@/components/stats/OneStatComponent";
import { useChapter } from "@/contexts/ChapterProvider";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import Link from "next/link";
import StatsChartsComponent from "@/components/stats/StatsChartsComponent";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StatsOneStatListComponent from "@/components/stats/stat/StatsOneStatListComponent";
import StatsOneStatBarChart from "@/components/stats/stat/StatsOneStatBarChart";
import OtherPageWrapper from "@/components/wrappers/OtherPageWrapper";
import NotAuthorizedStatComponent from "@/components/stats/NotAuthorizedStatComponent";

export default function OneStatPage() {
  const router = useRouter();
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const { uidLesson, uidChapter, uid: uidStat } = useParams();
  const { user } = useAuth();
  const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
  const { chapter, setUidChapter } = useChapter();
  const { setUidUser, getOneStatIndex, getGlobalCountQuiz, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();

  useEffect(() => {
    for (const s of stats) {
      router.prefetch(`${PAGE_STATS}/${uidLesson}/${uidChapter}/${s.uid}`);
    }
  }, [stats]);
  useEffect(() => {
    setUidUser(user?.uid || "");
    setUidLesson(uidLesson);
    setUidChapter(uidChapter);
    setUidStat(uidStat);
  }, [user, uidLesson, uidChapter, uidStat]);
  const { indexStat, level, score, countQuestions, average, duration, endDate } = useMemo(() => {
    const indexStat = getOneStatIndex(uidStat, stats);
    const level = chapter?.level;
    const score = stat?.score;
    const countQuestions = stat?.answers?.length;
    const average = stat?.percentage;
    const duration = stat?.duration;
    const endDate = stat?.end_date;
    return {
      indexStat,
      level,
      score,
      countQuestions,
      average,
      duration,
      endDate
    }
  }, [chapter, stats, uidStat]);

  const isAllowed = useMemo(() => {
    if (!user || !stat) return false;
    if (user.uid !== stat.uid_user) return false;
    //const menus = user?.menuDashboard?.() || [];
    // Choisis la règle :
    //return menus.some(m => path === m.path || path.startsWith(m.path + "/") || path.startsWith(m.path));
    return true;
  }, [user, stat]);


  if (user && !isAllowed) {
    return(<OtherPageWrapper>
      <NotAuthorizedStatComponent />
    </OtherPageWrapper>)
  }

  return (<DashboardPageWrapper
    titles={[
      { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: PAGE_STATS },
      { name: lesson?.translate?.title, url: `${PAGE_STATS}/${lesson?.uid}` },
      { name: chapter?.translate?.title, url: `${PAGE_STATS}/${lesson?.uid}/${chapter?.uid}` },
      { name: `${capitalizeFirstLetter(t('quiz'))} n°${indexStat + 1}`, url: `` },
      //{ name: t('chapters', { ns: NS_DASHBOARD_MENU }), url: `${PAGE_LESSONS}/${lesson?.uid}/chapters` },
      //{ name: `${chapter?.uid_intern}. ${chapter?.translate?.title}`, url: '' },
    ]}
    //title={`Cours / ${lesson?.title}`}
    //subtitle={lesson?.translate?.subtitle}
    icon={<IconStats height={18} width={18} />}
  >
    <Container maxWidth="lg" disableGutters sx={{ p: 0, background: '' }}>
      {
        isLoadingStats ? <CircularProgress size={"16px"} /> : <Grid container spacing={1}>
          <Grid size={12}>
            <CardHeader indexStat={indexStat} />
          </Grid>
          {
            stats.length === 0 && <NoStatComponent />
          }
          {
            stats.length>0 && <>
            <Stack sx={{ background: '' }} alignItems={'start'} maxWidth={'md'} spacing={1.5}>
            {/* Quick stats */}
            <Grid container spacing={1} sx={{ width: '100%', background: '' }}>
              <Grid size={{ xs: 6, sm: 'auto' }}>
                <MiniStat label={t('level')} value={`${t(level)}`} icon={<IconLevel height={25} width={25} color="var(--primary)" />} />
              </Grid>
              <Grid size={{ xs: 6, sm: 'auto' }}>
                <MiniStat label={t('score')} value={`${score}/${countQuestions}`} icon={<EmojiEventsIcon height={15} fontSize="small" sx={{ color: "var(--primary)" }} />} />
              </Grid>
              <Grid size={{ xs: 6, sm: 'auto' }}>
                <MiniStat label={t('average')} value={`${parseInt(average)}%`} icon={<IconStats height={15} fontSize="small" color="var(--primary)" />} />
              </Grid>

              <Grid size={{ xs: 6, sm: 'auto' }}>
                <MiniStat label={t('duration_short')} value={formatChrono(duration)} icon={<IconDuration color="var(--primary)" fontSize="small" />} />
              </Grid>
              <Grid size={{ xs: 6, sm: 'auto' }}>
                <MiniStat label={t('date')} value={getFormattedDateCompleteNumeric(endDate)} icon={<IconCalendar color="var(--primary)" fontSize="small" />} />
              </Grid>
            </Grid>
          </Stack>
          <Grid size={12}>
            <StatsChartsComponent
              listComponent={<OneStatComponent stat={stat} viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              listAverageComponent={<StatsOneStatListComponent viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
              //listAverageComponent={<StatsChapterListComponent viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
              //evolutionComponent={<StatsChapterLineChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              //evolutionAverageComponent={<StatsChapterLineChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
              showEvolution={false}
              showEvolutionAverage={false}
              compareComponent={<StatsOneStatBarChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              compareAverageComponent={<StatsOneStatBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
            //={<StatsChapterBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
            />
          </Grid>
            </>
          }
        </Grid>
      }
    </Container>
  </DashboardPageWrapper>);
}
function NoStatComponent() {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  return(<Grid size={12} sx={{py:1}}>
    <Stack maxWidth={'sm'}>
    <AlertComponent title={t('no-stats-title')} subtitle={t('no-stats-subtitle')} severity="info" />
  </Stack>
  </Grid>)
}
const CardHeader = ({ indexStat = -1 }) => {
  const router = useRouter();
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const { lesson } = useLesson();
  const { chapter } = useChapter();
  const { stat, stats, setUidStat } = useStat();
  const disabledBack = useMemo(() => {
    return indexStat === 0;
  }, [stats, stat]);
  const disabledNext = useMemo(() => {
    return indexStat === stats?.length - 1;
  }, [stats, stat]);

  return (<Stack sx={{ background: '', width: '100%' }}>
    <Grid container>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, my: 0.5 }}>
            {`${lesson?.uid_intern}. `}{lesson?.translate?.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {`${chapter?.uid_intern}. `}{chapter?.translate?.title} • {t(chapter?.level)} • {capitalizeFirstLetter(t('quiz'))}{" n°"}{indexStat + 1}
          </Typography>

          <Stack spacing={1} direction={'row'} sx={{ pt: 1 }} alignItems={'center'}>
            <Link href={`${PAGE_STATS}/${stat?.uid_lesson}/${stat?.uid_chapter}`}>
              <ButtonCancel label={t('btn-see-results')} />
            </Link>
          </Stack>

         {
          stats.length > 0 &&  <Stack maxWidth={'xl'} direction={'row'} spacing={1} alignItems={'center'} sx={{
            py: 1,
            background: 'var(--primary-shadow)',
            borderRadius: '10px',
            my: 1.5,
            py: 1.5,
            px: 1,
            color: 'var(--primary-dark)',
            width: { xs: '100%', sm: '50%' }
          }}>
            <IconButton
              disabled={disabledBack}
              onClick={() => {
                //const currentIndex = getOneStatIndex(stat?.uid);
                const uid = stats?.[indexStat - 1]?.uid || "";
                //setUidStat(uid);
                router.push(`${PAGE_STATS}/${stat?.uid_lesson}/${stat?.uid_chapter}/${uid}`);
              }}
              sx={{
                color: !disabledBack ? 'var(--primary)' : ''
              }}
            >
              <IconArrowBack />
            </IconButton>
            {
              <Typography>{capitalizeFirstLetter(t('quiz'))} {indexStat + 1}{"/"}{stats?.length}</Typography>
            }                <IconButton
              disabled={disabledNext}
              onClick={() => {
                const uid = stats?.[indexStat + 1]?.uid || "";
                //setUidStat(uid);
                router.push(`${PAGE_STATS}/${stat?.uid_lesson}/${stat?.uid_chapter}/${uid}`);
              }}
              sx={{
                color: !disabledNext ? 'var(--primary)' : ''
              }}
            >
              <IconArrowRight />
            </IconButton>
          </Stack>
         }
        </Box>
      </Grid>
    </Grid>
  </Stack>)
}
function MiniStat({ label, value, icon }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '10px',
        p: 1.6,
        bgcolor: "rgba(255,255,255,0.12)",
        bgcolor: "var(--primary-shadow)",
        border: "0.1px solid var(--primary-shadow-xs)",
        color: "white",
      }}
    >
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            bgcolor: "var(--primary-shadow-xs)",
            coor: "var(--primary)",
            border: "1px solid var(--primary-shadow-xs)",
          }}
        >
          {icon}
        </Box>
        <Stack spacing={0.1} sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: "var(--primary-dark)", opacity: 0.9 }}>
            {label}
          </Typography>
          <Typography variant="h6" sx={{ color: "var(--primary)", fontWeight: 950, lineHeight: 1.05 }} noWrap title={String(value)}>
            {value}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}