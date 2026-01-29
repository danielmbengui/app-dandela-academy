"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
  Paper,
  Grid,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useLesson } from "@/contexts/LessonProvider";
import { useTranslation } from "react-i18next";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { IconDuration, IconProgressUp, IconStar, IconStats } from "@/assets/icons/IconsComponent";
import { NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { formatChrono, getFormattedDateNumeric } from "@/contexts/functions";
import AlertComponent from "@/components/elements/AlertComponent";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useAuth } from "@/contexts/AuthProvider";
import { useChapter } from "@/contexts/ChapterProvider";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import Link from "next/link";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InsightsIcon from "@mui/icons-material/Insights";
import { useStat } from "@/contexts/StatProvider";
import StatsLessonListComponent from "@/components/stats/lesson/StatsLessonListComponent";
import StatsChartsComponent from "@/components/stats/StatsChartsComponent";
import StatsLessonLineChart from "@/components/stats/lesson/StatsLessonLineChart";
import StatsLessonBarChart from "@/components/stats/lesson/StatsLessonBarChart";

const CardHeader = () => {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const { lesson, lessons, setUidLesson } = useLesson();
  const { stats } = useStat();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        background: 'var(--card-color)',
        borderRadius: 3,
        width: '100%',
        border: '1px solid var(--card-border)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        mb: 3,
      }}
    >
      <Stack spacing={2.5}>
        <Stack spacing={1}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2rem' },
              color: 'var(--font-color)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {`${lesson?.uid_intern}. `}{lesson?.translate?.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'var(--grey-light)',
              lineHeight: 1.6,
              fontSize: '1rem',
            }}
          >
            {lesson?.translate?.subtitle}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Link href={`${PAGE_LESSONS}/${lesson?.uid}`}>
            <ButtonCancel label={t('btn-see-lesson')} />
          </Link>
        </Stack>

        {stats.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              background: 'var(--primary-shadow-xs)',
              borderRadius: 2,
              border: '1px solid var(--card-border)',
              display: 'inline-block',
              width: 'fit-content',
            }}
          >
            <Stack spacing={1.5}>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--primary)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.75rem',
                }}
              >
                {t('lessons')}
              </Typography>
              <Box sx={{ width: 'fit-content' }}>
                <SelectComponentDark
                  value={lesson?.uid || ''}
                  values={lessons.map(c => ({ id: c.uid, value: c.translate?.title }))}
                  onChange={(e) => {
                    setUidLesson(e.target.value);
                  }}
                  hasNull={false}
                />
              </Box>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
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
  
  let icon = <IconProgressUp />;
  let background = "";
  let border = "1px solid var(--card-border)";
  let borderIcon = "1px solid transparent";
  let fontColor = "var(--font-color)";
  let borderChip = "1px solid var(--card-border)";
  let backgroundChip = "transparent";
  let colorChip = "var(--font-color)";
  let fontWeight = 500;
  
  if (stat?.status === ClassUserStat.STATUS.MAX) {
    icon = <EmojiEventsIcon />;
    background = color?.background;
    border = `2px solid ${color?.border}`;
    borderIcon = `1px solid ${color?.border}`;
    fontColor = color?.color;
    borderChip = `1px solid ${color?.border}`;
    backgroundChip = color?.background_bubble;
    colorChip = color?.color;
    fontWeight = 700;
  } else if (stat?.status === ClassUserStat.STATUS.EXCELLENT || stat?.status === ClassUserStat.STATUS.GOOD) {
    icon = <IconStar />;
  } else {
    icon = <IconProgressUp />;
  }
  
  useEffect(() => {
    if (stat) {
      const _lesson = getOneLesson(uidLesson);
      const _chapter = getOneChapter(uidChapter);
      setLesson(stat?.lesson);
      setChapter(stat?.chapter);
    } else {
      setLesson(null);
      setChapter(null);
    }
  }, [uidLesson, uidChapter, stat?.uid_lesson, stat?.uid_chapter, getOneLesson, getOneChapter, chapters]);
  
  if (!stat) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: 3,
          border: "1px solid var(--card-border)",
          bgcolor: 'var(--card-color)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--grey-light)' }}>
          {t('no-result')}
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 3,
        border: border,
        bgcolor: background || 'var(--card-color)',
        maxWidth: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-4px)',
          borderColor: color?.border || 'var(--primary)',
        },
      }}
      onClick={() => router.push(`${PAGE_STATS}/${stat.uid_lesson}/${stat.uid_chapter}/${stat.uid}`)}
    >
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: color?.background_icon || 'var(--primary-shadow-xs)',
                color: color?.color_icon || 'var(--primary)',
                border: borderIcon,
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                color: color?.color || 'var(--font-color)',
              }}
            >
              {t(stat?.status)}
            </Typography>
          </Stack>
          <Chip
            size="small"
            label={`${parseInt((stat?.score / stat?.answers?.length) * 100)}%`}
            sx={{
              fontWeight: 700,
              bgcolor: color?.background_bubble,
              color: color?.color,
              border: `1px solid ${color?.border}`,
            }}
          />
        </Stack>

        <Stack spacing={0.5}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: fontColor,
            }}
          >
            {lesson?.translate?.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: fontColor,
              opacity: 0.8,
            }}
          >
            {chapter?.translate?.title}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip
            size="small"
            label={`${stat?.score}/${stat?.answers?.length}`}
            sx={{
              fontWeight: fontWeight,
              bgcolor: backgroundChip,
              color: colorChip,
              border: borderChip,
            }}
          />
          <Chip
            size="small"
            label={formatChrono(stat?.duration)}
            sx={{
              fontWeight: fontWeight,
              bgcolor: backgroundChip,
              color: colorChip,
              border: borderChip,
            }}
          />
          <Chip
            size="small"
            label={getFormattedDateNumeric(stat?.end_date)}
            sx={{
              fontWeight: fontWeight,
              bgcolor: backgroundChip,
              color: colorChip,
              border: borderChip,
            }}
          />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={clamp((stat?.score / stat?.answers?.length) * 100)}
          sx={{
            height: 8,
            borderRadius: 999,
            bgcolor: color?.background_bubble || 'var(--primary-shadow-sm)',
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              bgcolor: color?.background_bar || 'var(--primary)',
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
        p: 3,
        borderRadius: 3,
        border: '1px solid var(--card-border)',
        background: 'var(--card-color)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-4px)',
          borderColor: 'var(--primary)',
        },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'var(--primary-shadow-xs)',
              color: 'var(--primary)',
              border: '1px solid var(--primary-shadow-sm)',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'var(--grey-light)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2rem' },
                color: 'var(--primary)',
                lineHeight: 1.1,
              }}
            >
              {value}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: 'var(--grey-light)',
            fontSize: '0.9rem',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </Typography>

        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="space-between">
            <LinearProgress
              variant="determinate"
              value={clamp(progress)}
              sx={{
                height: 8,
                flex: 1,
                borderRadius: 999,
                bgcolor: 'var(--primary-shadow-sm)',
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  bgcolor: 'var(--primary)',
                },
              }}
            />
            {total && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--grey-light)',
                  minWidth: 'fit-content',
                }}
              >
                {total}
              </Typography>
            )}
          </Stack>
        </Stack>
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
export default function StatsLessonsPage() {
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

  return (
    <DashboardPageWrapper
      titles={[
        { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: PAGE_STATS },
        { name: `${lesson?.uid_intern}. ${lesson?.translate?.title}`, url: `` },
      ]}
      icon={<IconStats height={18} width={18} />}
    >
      <Container maxWidth="lg" disableGutters>
        {isLoadingStats ? (
          <Stack alignItems={'center'} sx={{ py: 4 }}>
            <CircularProgress size={24} sx={{ color: 'var(--primary)' }} />
          </Stack>
        ) : (
          <Stack spacing={3}>
            <CardHeader />
            
            {stats.length === 0 && <NoStatComponent />}
            
            {stats.length > 0 && (
              <>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <KpiCard
                      icon={<InsightsIcon sx={{ fontSize: '1.5rem' }} />}
                      title={t('global-rating')}
                      value={`${percent > 0 ? percent.toFixed(1) : 0}%`}
                      subtitle={`${t('score')} : ${score}/${countQuestions}`}
                      progress={percent}
                      total={`${score}/${countQuestions}`}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <KpiCard
                      icon={<SchoolIcon sx={{ fontSize: '1.5rem' }} />}
                      title={t('global-cover')}
                      value={`${countChapters}`}
                      subtitle={`${countChapters}/${countChaptersTotal} ${t('chapters')} • ${statsFiltered.length} ${t('attempts')}`}
                      progress={Math.min(100, (countChapters / Math.max(1, countChaptersTotal)) * 100)}
                      total={`${countChapters}/${countChaptersTotal}`}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <KpiCard
                      icon={<IconDuration height={24} width={24} color="var(--primary)" />}
                      title={t('global-duration')}
                      value={formatChrono(duration)}
                      subtitle={`${t('duration')} : ${formatChrono(duration)}`}
                      progress={Math.min(100, (duration / Math.max(1, durationTotal)) * 100)}
                      total={formatChrono(durationTotal)}
                    />
                  </Grid>
                </Grid>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid var(--card-border)',
                    background: 'var(--card-color)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <StatsChartsComponent
                    listComponent={<StatsLessonListComponent isOpenDetails={isOpenDetails} setIsOpenDetails={setIsOpenDetails} viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                    listAverageComponent={<StatsLessonListComponent isOpenDetails={isOpenDetails} setIsOpenDetails={setIsOpenDetails} viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
                    evolutionComponent={<StatsLessonLineChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                    evolutionAverageComponent={<StatsLessonLineChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
                    compareComponent={<StatsLessonBarChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                    compareAverageComponent={<StatsLessonBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
                  />
                </Paper>
              </>
            )}
          </Stack>
        )}
      </Container>
    </DashboardPageWrapper>
  );
}
