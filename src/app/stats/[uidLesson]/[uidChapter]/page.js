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

          <Stack spacing={1} direction={'row'} sx={{pt:1}} alignItems={'center'}>
          <Link href={`${PAGE_LESSONS}/${lesson?.uid}`}>
          <ButtonCancel label={t('btn-see-lesson')} />
          </Link>
          <Link href={`${PAGE_LESSONS}/${lesson?.uid}${PAGE_CHAPTERS}/${chapter?.uid}`}>
          <ButtonCancel label={t('btn-see-chapter')} />
          </Link>
          </Stack>

          <Stack spacing={1} alignItems={'start'} sx={{
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
        </Box>
      </Grid>
    </Grid>
  </Stack>)
}
function StatsList({ stats = [] }) {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const { chapters } = useChapter();
  const { getBestStat } = useStat();
  const [direction, setDirection] = useState('asc');
  const [sort, setSort] = useState('date');
  const SORTS = [
    { id: "date", value: t('sort.date') },
    { id: "score", value: t('sort.score') },
    { id: "duration", value: t('sort.duration') },
  ];
  const statsFiltered = useMemo(() => {
    var filtered = stats.sort((a, b) => b.score - a.score);
    if (sort === 'date') {
      if (direction === 'asc') {
        return stats.sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
      }
      return stats.sort((a, b) => b.end_date.getTime() - a.end_date.getTime());
    }
    if (sort === 'score') {
      if (direction === 'asc') {
        return stats.sort((a, b) => a.score - b.score);
      }
      return stats.sort((a, b) => b.score - a.score);
    }
    if (sort === 'duration') {
      if (direction === 'asc') {
        return stats.sort((a, b) => a.duration - b.duration);
      }
      return stats.sort((a, b) => b.duration - a.duration);
    }
    return filtered;
  }, [stats, sort, direction]);
  return (<Grid container spacing={1} sx={{ background: '', width: '100%', }}>
    <Grid size={12}>
      <Stack spacing={1} alignItems={'center'} sx={{ background: '' }} direction={'row'}>
        <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ background: 'var(--primary-shadow)', py: 1, px: 1.5, borderRadius: '10px' }}>
          <SelectComponentDark
            name={'sort'}
            value={sort}
            values={SORTS}
            onChange={(e) => {
              const { value } = e.target;
              setSort(value);
            }}
            hasNull={false}
          />
          <Stack direction={'row'} alignItems={'center'}>
            <Box
              onClick={() => setDirection('asc')}
              sx={{
                color: direction === 'asc' ? 'var(--primary)' : '',
                cursor: 'pointer'
              }}
            >
              <IconArrowUp />
            </Box>
            <Box
              onClick={() => setDirection('desc')}
              sx={{
                color: direction === 'desc' ? 'var(--primary)' : '',
                cursor: 'pointer'
              }}
            >
              <IconArrowDown />
            </Box>
          </Stack>
        </Stack>
        <Typography variant="caption">{stats.length} {t('attempts')}</Typography>
      </Stack>
    </Grid>
    {
      statsFiltered?.map((stat, i) => {
        return (<Grid size={'auto'} key={`${stat.uid}`}>
          <StatCard
            uidLesson={stat.uid_lesson}
            uidChapter={stat.uid_chapter}
            title="Meilleur résultat"
            icon={stat.score === stat.answers.length ? <EmojiEventsIcon /> : <IconStar />}
            //attempt={filteredStats.best}
            tone="good"
            //status={bestStat?.status}
            stat={stat}
          />
        </Grid>)
      })
    }
  </Grid>)
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
export default function ExcelBeginnerCoursePage() {
  const router = useRouter();
  const { uidLesson, uidChapter } = useParams();
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const { uid: uidStat } = useParams();
  //console.log("uid", uidStat)
  // const { lang } = useLanguage();
  //const { user } = useAuth();
  const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
  const { stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
  const { chapters, chapter, setUidChapter } = useChapter();
  useEffect(() => {
    for (const c of chapters) {
      router.prefetch(`${PAGE_STATS}/${uidLesson}/${c.uid}`);
    }
  }, [chapters]);
  useEffect(() => {
    setUidLesson(uidLesson);
    setUidChapter(uidChapter);
  }, [uidLesson, uidChapter]);

  const filteredStats = useMemo(() => {
    return stats.filter(s => s.uid_chapter === uidChapter);
  }, [uidChapter, stats]);

  const { countQuestions, score, percent, duration, durationTotal } = useMemo(() => {
    return {
      score: getGlobalScore(uidLesson, uidChapter),
      countQuestions: getGlobalCountQuestions(uidLesson, uidChapter),
      percent: getGlobalPercent(uidLesson, uidChapter),
      duration: getGlobalDuration(uidLesson, uidChapter),
      durationTotal: getGlobalDuration(uidLesson),
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
          <Grid size={12}>
             <StatsChartsComponent
                        listComponent={<StatsList stats={filteredStats} />}
                       // listAverageComponent={<StatsLessonListComponent isOpenDetails={isOpenDetails} setIsOpenDetails={setIsOpenDetails} viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
                       // evolutionComponent={<StatsLessonLineChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                       // evolutionAverageComponent={<StatsLessonLineChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
                       // compareComponent={<StatsLessonBarChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                       // compareAverageComponent={<StatsLessonBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
                      />
          </Grid>
          {
            filteredStats.length === 0 && <Paper
              elevation={0}
              sx={{
                borderRadius: 5,
                p: 2.2,
                border: "1px solid rgba(15, 23, 42, 0.10)",
              }}
            >
              <Typography variant="h5" noWrap sx={{ fontWeight: 950 }}>
                {chapter?.translate?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('no-result')}
              </Typography>
            </Paper>
          }

          {
            filteredStats.length > 0 && <>
              <Grid size={{ xs: 12, sm: 4 }}>
                <KpiCard
                  icon={<InsightsIcon />}
                  title={t('global-rating')}
                  value={`${percent > 0 ? percent.toFixed(2) : 0}%`}
                  subtitle={`${score}/${countQuestions} • ${filteredStats.length} ${t('attempts')}`}
                  progress={percent}
                  total={`${score}/${countQuestions}`}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <KpiCard
                  icon={<IconDuration />}
                  title={t('global-duration')}
                  value={formatChrono(duration)}
                  subtitle={t('duration')}
                  progress={Math.min(1000, (duration / Math.max(1, (durationTotal))) * 100)}
                  total={formatChrono(durationTotal)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12 }}>
                <StatsList stats={filteredStats} />
              </Grid>
            </>
          }
        </Grid>
      }
    </Container>
  </DashboardPageWrapper>);
}
