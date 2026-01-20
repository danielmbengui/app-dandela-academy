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
  LinearProgress,
} from "@mui/material";


import { useParams, useRouter } from "next/navigation";
import { useLesson } from "@/contexts/LessonProvider";
import { Trans, useTranslation } from "react-i18next";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { IconArrowBack, IconArrowDown, IconArrowLeft, IconArrowRight, IconArrowUp, IconBookOpen, IconCertificate, IconDuration, IconLessons, IconObjective, IconProgressUp, IconQuizz, IconStar, IconStats } from "@/assets/icons/IconsComponent";
import { NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS, NS_STATS_ONE } from "@/contexts/i18n/settings";
import { PAGE_CHAPTERS, PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { ClassLessonChapterQuestion, ClassLessonChapterQuestionTranslation, ClassLessonChapterQuiz } from "@/classes/lessons/ClassLessonChapterQuiz";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import { addDaysToDate, capitalizeFirstLetter, formatChrono, getFormattedDateComplete, getFormattedDateCompleteNumeric, getFormattedDateNumeric, mixArray } from "@/contexts/functions";
import AlertComponent from "@/components/elements/AlertComponent";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useAuth } from "@/contexts/AuthProvider";
import OneStatComponent from "@/components/stats/OneStatComponent";
import { useChapter } from "@/contexts/ChapterProvider";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import Link from "next/link";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InsightsIcon from "@mui/icons-material/Insights";
import QuizIcon from "@mui/icons-material/Quiz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useStat } from "@/contexts/StatProvider";
import { ClassLesson } from "@/classes/ClassLesson";
import StatsChartsComponent from "@/components/stats/StatsChartsComponent";
import StatsChapterListComponent from "@/components/stats/chapter/StatsChapterListComponent";
import StatsChapterLineChart from "@/components/stats/chapter/StatsChapterLineChart";
import StatsChapterBarChart from "@/components/stats/chapter/StatsChapterBarChart";
import { user } from "@heroui/react";


export default function OneStatChapterPage() {
  const router = useRouter();
  const { uidLesson, uidChapter } = useParams();
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  //console.log("uid", uidStat)
  // const { lang } = useLanguage();
  const { user } = useAuth();
  const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
  const { setUidUser,getGlobalCountQuiz,stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
  const { chapters, chapter, setUidChapter } = useChapter();
  useEffect(() => {
    for (const c of chapters) {
      router.prefetch(`${PAGE_STATS}/${uidLesson}/${c.uid}`);
    }
  }, [chapters]);
  useEffect(() => {
    setUidUser(user?.uid || null);
    setUidLesson(uidLesson);
    setUidChapter(uidChapter);
  }, [user, uidLesson, uidChapter]);

  const filteredStats = useMemo(() => {
    const filtered = stats.filter(s => s.uid_lesson === uidLesson && s.uid_chapter===uidChapter);
    return filtered;
  }, [uidLesson,uidChapter, stats]);

  const { countQuestions, score, percent, duration, durationTotal,countStats,countStatsTotal,countChapters } = useMemo(() => {
    const countStats = getGlobalCountQuiz(uidLesson, uidChapter, filteredStats);
    const countStatsTotal = getGlobalCountQuiz(uidLesson, "");
    const countChapters = new Set([...filteredStats].map(s=>s.uid_chapter)).size;
    return {
      score: getGlobalScore(uidLesson, uidChapter, filteredStats),
      countQuestions: getGlobalCountQuestions(uidLesson, uidChapter, filteredStats),
      percent: getGlobalPercent(uidLesson, uidChapter, filteredStats),
      duration: getGlobalDuration(uidLesson, uidChapter, filteredStats),
      durationTotal: getGlobalDuration(uidLesson),
      countStats,
      countStatsTotal,
      countChapters
    };
  }, [uidLesson, uidChapter, filteredStats]);

  return (<DashboardPageWrapper
    titles={[
      { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: PAGE_STATS },
      { name: `${lesson?.uid_intern}. ${lesson?.translate?.title}`, url: `${PAGE_STATS}/${lesson?.uid}` },
      { name: `${chapter?.uid_intern}. ${chapter?.translate?.title}`, url: `` },
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
            <CardHeader />
          </Grid>
          {
            stats.length === 0 && <NoStatComponent />
          }
          {
            stats.length>0 && <>
            <Grid size={{ xs: 12, sm: 4 }}>
            <KpiCard
              icon={<InsightsIcon />}
              title={t('global-rating')}
              value={`${percent > 0 ? percent.toFixed(2) : 0}%`}
              subtitle={`${t('score')} : ${score}/${countQuestions}`}
              progress={percent}
              total={`${score}/${countQuestions}`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <KpiCard
              icon={<SchoolIcon />}
              title={t('global-cover')}
              value={`${countStats} ${t('quizs')}`}
              subtitle={`${t('attempts')} : ${countStats}/${countStatsTotal}`}
             progress={Math.min(100, (countStats / Math.max(1, countStatsTotal)) * 100)}
             total={`${countStats}/${countStatsTotal}`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <KpiCard
              icon={<IconDuration />}
              title={t('global-duration')}
              value={formatChrono(duration)}
              subtitle={`${t('duration')} : ${formatChrono(duration)}`}
              progress={Math.min(1000, (duration / Math.max(1, (durationTotal))) * 100)}
              total={formatChrono(durationTotal)}
            />
          </Grid>
          <Grid size={12}>
            <StatsChartsComponent
              listComponent={<StatsChapterListComponent viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              listAverageComponent={<StatsChapterListComponent viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
              evolutionComponent={<StatsChapterLineChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              evolutionAverageComponent={<StatsChapterLineChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
              //showEvolution={false}
              showEvolutionAverage={false}
              compareComponent={<StatsChapterBarChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              compareAverageComponent={<StatsChapterBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
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
function AvatarIcon({ children, sx }) {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 3,
        display: "grid",
        placeItems: "center",
        bgcolor: "rgba(37,99,235,0.12)",
        color: "#2563EB",
        border: "1px solid rgba(37,99,235,0.18)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
const CardHeader = () => {
  const router = useRouter();
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const { lesson } = useLesson();
  const { chapters, chapter, setUidChapter } = useChapter();
  const { stat, stats, setUidStat } = useStat();

  return (<Stack sx={{ color: 'var(--font-color)', width: '100%' }}>
    <Grid container>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, my: 0.5 }}>
            {`${lesson?.uid_intern}. `}{lesson?.translate?.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {`${chapter?.uid_intern}. `}{chapter?.translate?.title} • {t(chapter?.level)}
          </Typography>

          <Stack spacing={1} direction={'row'} sx={{ pt: 1 }} alignItems={'center'}>
            <Link href={`${PAGE_LESSONS}/${lesson?.uid}`}>
              <ButtonCancel label={t('btn-see-lesson')} />
            </Link>
            <Link href={`${PAGE_LESSONS}/${lesson?.uid}${PAGE_CHAPTERS}/${chapter?.uid}`}>
              <ButtonCancel label={t('btn-see-chapter')} />
            </Link>
          </Stack>

          {
            stats.length > 0 && <Stack spacing={1} alignItems={'start'} sx={{
              background: 'var(--primary-shadow)',
              borderRadius: '10px',
              my: 1.5,
              py: 1.5,
              px: 1,
            }}>
              <Typography variant="body1" sx={{ color: "var(--primary-dark)" }}>
                {t('chapters')}
              </Typography>
              <SelectComponentDark
                value={chapter?.uid || ''}
                values={chapters.map(c => ({ id: c.uid, value: c.translate?.title }))}
                onChange={(e) => {
                  const { value: uidChapter } = e.target;
                  //setUidChapter(uidChapter);
                  router.push(`${PAGE_STATS}/${lesson?.uid}/${uidChapter}`);
                }}
                hasNull={false}
              />
            </Stack>
          }
        </Box>
      </Grid>
    </Grid>
  </Stack>)
}

function clamp(v) {
  const n = Number(v || 0);
  return Math.max(0, Math.min(100, n));
}
function KpiCard({ icon, title, value, subtitle, progress = 0, total = null }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 5,
        p: 2.2,
        py: 2,
        px: 1.5,
        //border: "0.1px solid var(--primary-shadow-sm)",
        background: 'var(--primary-shadow)',
        borderRadius: '10px',
        color: "var(--font-color)",
      }}
    >
      <Stack spacing={1.1}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <AvatarIcon>{icon}</AvatarIcon>
          <Stack spacing={0.1} sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="var(--primary-dark)">
              {title}
            </Typography>
            <Typography variant="h4" color="var(--primary)" sx={{ fontWeight: 950, lineHeight: 1.05 }}>
              {value}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="body2" color="var(--grey-dark)">
          {subtitle}
        </Typography>

        <Grid container alignItems={'center'} spacing={1}>
          <Grid size={'grow'}>
            <LinearProgress
              variant="determinate"
              value={clamp(progress)}
              sx={{
                height: 10,
                width: '100%',
                borderRadius: 999,
                bgcolor: "var(--primary-shadow-sm)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  bgcolor: "var(--primary)",
                },
              }}
            />
          </Grid>
          {
            total && <Grid size={'auto'} alignItems={'center'}>
              <Typography variant="caption" sx={{ fontSize: '12px', width: 'auto', height: '100%' }}>{total}</Typography>
            </Grid>
          }
        </Grid>
      </Stack>
    </Paper>
  );
}