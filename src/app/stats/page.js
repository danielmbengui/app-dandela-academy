"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { useTranslation } from "react-i18next";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { IconDuration, IconStats } from "@/assets/icons/IconsComponent";
import { NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { formatChrono } from "@/contexts/functions";
import AlertComponent from "@/components/elements/AlertComponent";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useAuth } from "@/contexts/AuthProvider";
import StatsListComponent from "@/components/stats/StatsListComponent";
import { useStat } from "@/contexts/StatProvider";
import { useChapter } from "@/contexts/ChapterProvider";
import SchoolIcon from "@mui/icons-material/School";
import InsightsIcon from "@mui/icons-material/Insights";
import StatsChartsComponent from "@/components/stats/StatsChartsComponent";
import StatsLineChart from "@/components/stats/StatsLineChart";
import StatsBarChart from "@/components/stats/StatsBarChart";

const CardHeader = () => {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
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
          {t('title')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'var(--grey-light)',
            lineHeight: 1.6,
            fontSize: '1rem',
          }}
        >
          {t('subtitle')}
        </Typography>
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

export default function StatsPage() {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const {user} = useAuth();
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const { setUidUser, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getGlobalCountChapters } = useStat();
  const { chapters } = useChapter();
  
  useEffect(() => {
    setUidUser(user?.uid || "");
  }, [user]);
  
  const { score, countQuestions, percent, duration, durationTotal, countChapters, countChaptersTotal } = useMemo(() => {
    return {
      score: getGlobalScore(),
      countQuestions: getGlobalCountQuestions(),
      percent: getGlobalPercent(),
      duration: getGlobalDuration(),
      durationTotal: getGlobalDuration(),
      countChapters: getGlobalCountChapters(),
      countChaptersTotal: chapters.length,
    };
  }, [stats, chapters]);

  return (
    <DashboardPageWrapper
      titles={[
        { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: '' },
      ]}
      //subtitle={t('subtitle')}
      icon={<IconStats height={18} width={18} />}
    >
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2 }, py: 2, background: 'transparent' }}>
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
                      subtitle={`${countChapters}/${countChaptersTotal} ${t('chapters')} • ${stats.length} ${t('attempts')}`}
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
                    listComponent={<StatsListComponent isOpenDetails={isOpenDetails} setIsOpenDetails={setIsOpenDetails} viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                    listAverageComponent={<StatsListComponent isOpenDetails={isOpenDetails} setIsOpenDetails={setIsOpenDetails} viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
                    evolutionComponent={<StatsLineChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                    evolutionAverageComponent={<StatsLineChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
                    compareComponent={<StatsBarChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                    compareAverageComponent={<StatsBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
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
