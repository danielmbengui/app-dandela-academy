"use client";

import React, { useEffect, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
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
import { IconDuration, IconStats } from "@/assets/icons/IconsComponent";
import { NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_CHAPTERS, PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { formatChrono } from "@/contexts/functions";
import AlertComponent from "@/components/elements/AlertComponent";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useAuth } from "@/contexts/AuthProvider";
import { useChapter } from "@/contexts/ChapterProvider";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import Link from "next/link";
import SchoolIcon from "@mui/icons-material/School";
import InsightsIcon from "@mui/icons-material/Insights";
import { useStat } from "@/contexts/StatProvider";
import StatsChartsComponent from "@/components/stats/StatsChartsComponent";
import StatsChapterListComponent from "@/components/stats/chapter/StatsChapterListComponent";
import StatsChapterLineChart from "@/components/stats/chapter/StatsChapterLineChart";
import StatsChapterBarChart from "@/components/stats/chapter/StatsChapterBarChart";


export default function OneStatChapterPage() {
  const router = useRouter();
  const { uidLesson, uidChapter } = useParams();
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  //console.log("uid", uidStat)
  // const { lang } = useLanguage();
  const { user } = useAuth();
  const { lesson, setUidLesson } = useLesson();
  const { setUidUser, getGlobalCountQuiz, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent } = useStat();
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

  const { countQuestions, score, percent, duration, durationTotal, countStats, countStatsTotal } = useMemo(() => {
    const countStats = getGlobalCountQuiz(uidLesson, uidChapter, filteredStats);
    const countStatsTotal = getGlobalCountQuiz(uidLesson, "");
    return {
      score: getGlobalScore(uidLesson, uidChapter, filteredStats),
      countQuestions: getGlobalCountQuestions(uidLesson, uidChapter, filteredStats),
      percent: getGlobalPercent(uidLesson, uidChapter, filteredStats),
      duration: getGlobalDuration(uidLesson, uidChapter, filteredStats),
      durationTotal: getGlobalDuration(uidLesson),
      countStats,
      countStatsTotal,
    };
  }, [uidLesson, uidChapter, filteredStats, getGlobalCountQuiz, getGlobalScore, getGlobalCountQuestions, getGlobalPercent, getGlobalDuration]);

  return (
    <DashboardPageWrapper
      titles={[
        { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: PAGE_STATS },
        { name: `${lesson?.uid_intern}. ${lesson?.translate?.title}`, url: `${PAGE_STATS}/${lesson?.uid}` },
        { name: `${chapter?.uid_intern}. ${chapter?.translate?.title}`, url: `` },
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
                      value={`${countStats}`}
                      subtitle={`${t('attempts')} : ${countStats}/${countStatsTotal}`}
                      progress={Math.min(100, (countStats / Math.max(1, countStatsTotal)) * 100)}
                      total={`${countStats}/${countStatsTotal}`}
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
                    listComponent={<StatsChapterListComponent viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                    listAverageComponent={<StatsChapterListComponent viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
                    evolutionComponent={<StatsChapterLineChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                    evolutionAverageComponent={<StatsChapterLineChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
                    showEvolutionAverage={false}
                    compareComponent={<StatsChapterBarChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                    compareAverageComponent={<StatsChapterBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
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
function NoStatComponent() {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  return (
    <Grid size={12} sx={{ py: 2 }}>
      <Stack maxWidth={'sm'}>
        <AlertComponent
          title={t('no-stats-title')}
          subtitle={t('no-stats-subtitle')}
          severity="info"
        />
      </Stack>
    </Grid>
  );
}

const CardHeader = () => {
  const router = useRouter();
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const { lesson } = useLesson();
  const { chapters, chapter } = useChapter();
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
            {`${chapter?.uid_intern}. `}{chapter?.translate?.title} • {t(chapter?.level)}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Link href={`${PAGE_LESSONS}/${lesson?.uid}`}>
            <ButtonCancel label={t('btn-see-lesson')} />
          </Link>
          <Link href={`${PAGE_LESSONS}/${lesson?.uid}${PAGE_CHAPTERS}/${chapter?.uid}`}>
            <ButtonCancel label={t('btn-see-chapter')} />
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
                {t('chapters')}
              </Typography>
              <Box sx={{ width: 'fit-content' }}>
                <SelectComponentDark
                  value={chapter?.uid || ''}
                  values={chapters.map(c => ({ id: c.uid, value: c.translate?.title }))}
                  onChange={(e) => {
                    const { value: uidChapter } = e.target;
                    router.push(`${PAGE_STATS}/${lesson?.uid}/${uidChapter}`);
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