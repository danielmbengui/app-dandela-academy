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
import { PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
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
import StatsListComponent from "@/components/stats/StatsListComponent";
import StatsLessonListComponent from "@/components/stats/lesson/StatsLessonListComponent";
import StatsChartsComponent from "@/components/stats/StatsChartsComponent";
import StatsLineChart from "@/components/stats/StatsLineChart";
import StatsBarChart from "@/components/stats/StatsBarChart";
import StatsLessonLineChart from "@/components/stats/lesson/StatsLessonLineChart";
import StatsLessonBarChart from "@/components/stats/lesson/StatsLessonBarChart";

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
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const { lesson, lessons, setUidLesson } = useLesson();
  const { stat, stats } = useStat();
  const indexStat = useMemo(() => {
    return stats.findIndex(s => s.uid === stat?.uid);
  }, [stats, stat]);
  const disabledBack = useMemo(() => {
    return indexStat === 0;
  }, [stats, stat]);
  const disabledNext = useMemo(() => {
    return indexStat === stats?.length - 1;
  }, [stats, stat]);
  return (<Stack sx={{ color: 'var(--font-color)', width: '100%' }}>
    <Grid container>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, my: 0.5 }}>
            {`${lesson?.uid_intern}. `}{lesson?.translate?.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {lesson?.translate?.subtitle}
          </Typography>

          <Stack sx={{ pt: 1 }} alignItems={'start'}>
            <Link href={`${PAGE_LESSONS}/${lesson?.uid}`}>
              <ButtonCancel label={t('btn-see-lesson')} />
            </Link>
          </Stack>

          {
            stats.length>0 && <Stack spacing={1} alignItems={'start'} sx={{
              background: 'var(--primary-shadow)',
              borderRadius: '10px',
              my: 1.5,
              py: 1.5,
              px: 1,
            }}>
              <Typography variant="body1" sx={{ color: "var(--primary-shadow-xl)" }}>
                {t('lessons')}
              </Typography>
              <SelectComponentDark
                value={lesson?.uid || ''}
                values={lessons.map(c => ({ id: c.uid, value: c.translate?.title }))}
                onChange={(e) => {
                  setUidLesson(e.target.value);
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

function StatCard({ title, tone, stat = null, uidLesson = "", uidChapter = "" }) {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const router = useRouter();
  const { getOneLesson } = useLesson();
  const { getOneChapter, chapters } = useChapter();
  const [lesson, setLesson] = useState(stat?.lesson);
  const [chapter, setChapter] = useState(stat?.chapter);
  const good = tone === "good";
  const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
  const color = STATUS_CONFIG[stat?.status] || {
    background: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
    background_icon: good ? "rgba(34,197,94,0.14)" : "rgba(245,158,11,0.18)",
    glow: good ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.07)",
    color: good ? "#15803D" : "#B45309",
    border: "rgba(15, 23, 42, 0.10)",
    border_icon: "rgba(15, 23, 42, 0.10)",
    color_icon: good ? "#15803D" : "#B45309",
    background_bar: good ? "#15803D" : "#B45309",
  };
  var icon = <IconProgressUp />;
  var background = "";
  var border = "0.1px solid var(--card-border)";
  var borderIcon = "0.1px solid transparent";
  var fontColor = "var(--font-color)";
  var borderChip = "1px solid var(--card-border)";
  var backgroundChip = "transparent";
  var colorChip = "var(--font-color)";
  var fontWeight = 500;
  if (stat.status === ClassUserStat.STATUS.MAX) {
    icon = <EmojiEventsIcon />;
    background = color?.background;
    border = `0.1px solid ${color?.border}`;
    borderIcon = `0.1px solid ${color?.border}`;
    fontColor = color?.color;
    borderChip = `1px solid ${color?.border}`;
    backgroundChip = color?.background_bubble;
    colorChip = color?.color;
    fontWeight = 950;
  } else if (stat.status === ClassUserStat.STATUS.EXCELLENT || stat.status === ClassUserStat.STATUS.GOOD) {
    icon = <IconStar />;
  } else {
    icon = <IconProgressUp />;
  }
  //console.log("COLORS", color);
  useEffect(() => {
    if (stat) {
      const _lesson = getOneLesson(uidLesson);
      const _chapter = getOneChapter(uidChapter);
      setLesson(stat?.lesson);
      setChapter(stat?.chapter);
      console.log("HSPTER", stat.uid_lesson, stat.uid_chapter, chapters)
    } else {
      setLesson(null);
      setChapter(null);
    }
  }, [uidLesson, uidChapter, stat?.uid_lesson, stat?.uid_chapter]);
  if (!stat) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 5,
          p: 2.2,
          border: "1px solid rgba(15, 23, 42, 0.10)",
        }}
      >
        <Typography variant="h5" noWrap sx={{ fontWeight: 950 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('no-result')}
        </Typography>
      </Paper>
    );
  }
  //const p = percent(attempt);
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 5,
        p: 2,
        border: border,
        bgcolor: background,
        maxWidth: '350px',
        cursor: 'pointer'
      }}
      onClick={() => router.push(`${PAGE_STATS}/${stat.uid_lesson}/${stat.uid_chapter}/${stat.uid}`)}
    >
      <Stack spacing={1} sx={{ width: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: color?.color }}>
            <AvatarIcon
              sx={{
                bgcolor: color?.background_icon,
                color: color?.color_icon,
                border: borderIcon
              }}
            >
              {icon}
            </AvatarIcon>
            <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
              {t(stat?.status)}
            </Typography>
          </Stack>
          <Chip
            size="small"
            label={`${parseInt((stat?.score / stat?.answers?.length) * 100)}%`}
            sx={{
              fontWeight: 950,
              bgcolor: color?.background_bubble,
              color: color?.color,
              border: `1px solid ${color?.border}`,
            }}
          />
        </Stack>

        <Typography variant="body2" color={fontColor}>
          <b>{lesson?.translate?.title}</b>
        </Typography>
        <Typography variant="caption" color={fontColor}>
          {chapter?.translate?.title}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip size="small"
            label={`${stat?.score}/${stat?.answers?.length}`} sx={{
              fontWeight: fontWeight,
              bgcolor: backgroundChip,
              color: colorChip,
              border: borderChip,
            }} />
          <Chip size="small"
            label={formatChrono(stat?.duration)} sx={{
              fontWeight: fontWeight,
              bgcolor: backgroundChip,
              color: colorChip,
              border: borderChip,
            }} />
          <Chip size="small"
            label={getFormattedDateNumeric(stat?.end_date)} sx={{
              fontWeight: fontWeight,
              bgcolor: backgroundChip,
              color: colorChip,
              border: borderChip,
            }} />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={clamp((stat?.score / stat?.answers?.length) * 100)}
          sx={{
            height: 10,
            borderRadius: 999,
            bgcolor: color?.background_bubble,
            border: `0.1px solid ${color?.background_bubble}`,
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              bgcolor: color?.background_bar,
            },
          }}
        />
      </Stack>
    </Paper>
  );
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
function NoStatComponent() {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  return(<Grid size={12} sx={{py:1}}>
    <Stack maxWidth={'sm'}>
    <AlertComponent title={t('no-stats-title')} subtitle={t('no-stats-subtitle')} severity="info" />
  </Stack>
  </Grid>)
}
export default function ExcelBeginnerCoursePage() {
  const { uidLesson } = useParams();
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  // const { lang } = useLanguage();
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const { user } = useAuth();
  const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
  const { setUidUser,stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
  const { chapters, chapter, setUidChapter } = useChapter();
  useEffect(() => {
    setUidUser(user?.uid || '');
    setUidLesson(uidLesson);
  }, [user, uidLesson]);
  const statsFiltered = useMemo(() => {
    const filtered = stats.filter(s => s.uid_lesson === lesson?.uid);
    return filtered;
  }, [uidLesson, stats]);

  const { score, countQuestions, percent, duration, durationTotal, countChapters, countChaptersTotal } = useMemo(() => {
    return {
      score: getGlobalScore(uidLesson),
      countQuestions: getGlobalCountQuestions(uidLesson),
      percent: getGlobalPercent(uidLesson),
      duration: getGlobalDuration(uidLesson),
      durationTotal: getGlobalDuration(),
      countChapters: getGlobalCountChapters(),
      countChaptersTotal: chapters.length,
    };
  }, [uidLesson, statsFiltered]);

  return (<DashboardPageWrapper
    titles={[
      { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: PAGE_STATS },
      { name: `${lesson?.uid_intern}. ${lesson?.translate?.title}`, url: `` },
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
              value={`${countChapters} ${t('chapters')}`}
              subtitle={`${countChapters}/${countChaptersTotal} ${t('chapters')} • ${stats.length} ${t('attempts')}`}
              progress={Math.min(100, (countChapters / Math.max(1, countChaptersTotal)) * 100)}
              total={`${countChapters}/${countChaptersTotal}`}
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
          <Grid size={{ xs: 12, sm: 12 }}>
            <StatsChartsComponent
              listComponent={<StatsLessonListComponent isOpenDetails={isOpenDetails} setIsOpenDetails={setIsOpenDetails} viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              listAverageComponent={<StatsLessonListComponent isOpenDetails={isOpenDetails} setIsOpenDetails={setIsOpenDetails} viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
              evolutionComponent={<StatsLessonLineChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              evolutionAverageComponent={<StatsLessonLineChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
              compareComponent={<StatsLessonBarChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              compareAverageComponent={<StatsLessonBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
            />
          </Grid>
            </>
          }
        </Grid>
      }
    </Container>
  </DashboardPageWrapper>);
}
