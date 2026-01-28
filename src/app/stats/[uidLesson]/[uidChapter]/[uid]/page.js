"use client";

import React, { useEffect, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
  Stack,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useLesson } from "@/contexts/LessonProvider";
import { useTranslation } from "react-i18next";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { IconArrowBack, IconArrowRight, IconCalendar, IconDuration, IconLevel, IconStats } from "@/assets/icons/IconsComponent";
import { NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_STATS } from "@/contexts/constants/constants_pages";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { capitalizeFirstLetter, formatChrono, getFormattedDateCompleteNumeric } from "@/contexts/functions";
import AlertComponent from "@/components/elements/AlertComponent";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useAuth } from "@/contexts/AuthProvider";
import { useStat } from "@/contexts/StatProvider";
import OneStatComponent from "@/components/stats/OneStatComponent";
import { useChapter } from "@/contexts/ChapterProvider";
import Link from "next/link";
import StatsChartsComponent from "@/components/stats/StatsChartsComponent";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StatsOneStatListComponent from "@/components/stats/stat/StatsOneStatListComponent";
import StatsOneStatBarChart from "@/components/stats/stat/StatsOneStatBarChart";
import NotAuthorizedStatComponent from "@/components/stats/NotAuthorizedStatComponent";

export default function OneStatPage() {
  const router = useRouter();
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const { uidLesson, uidChapter, uid: uidStat } = useParams();
  const { user, isLoading: isLoadingUser } = useAuth();
  const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
  const { chapter, setUidChapter } = useChapter();
  const { setUidUser, getOneStatIndex, stat, setUidStat, isLoading: isLoadingStats, stats } = useStat();

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

  // Vérifier si on est en train de charger
  const isLoading = isLoadingUser || isLoadingStats || isLoadingLesson;

  // Vérifier l'autorisation seulement quand les données sont chargées
  const isAllowed = useMemo(() => {
    // Si on charge encore, on ne peut pas déterminer l'autorisation
    if (isLoading) return null;
    // Si pas d'utilisateur ou pas de stat après chargement, pas autorisé
    if (!user || !stat) return false;
    // Vérifier que l'utilisateur est le propriétaire de la stat
    if (user.uid !== stat.uid_user) return false;
    return true;
  }, [user, stat, isLoading]);

  // Afficher le loader pendant le chargement
  if (isLoading) {
    return (
      <DashboardPageWrapper
        titles={[
          { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: PAGE_STATS },
        ]}
        icon={<IconStats height={18} width={18} />}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
          <Stack alignItems="center" justifyContent="center" sx={{ py: 8, minHeight: '50vh' }}>
            <CircularProgress size={40} />
          </Stack>
        </Container>
      </DashboardPageWrapper>
    );
  }

  // Afficher le composant non autorisé seulement si on est sûr que l'utilisateur n'est pas autorisé
  if (isAllowed === false) {
    return (
      <DashboardPageWrapper
        titles={[
          { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: PAGE_STATS },
        ]}
        icon={<IconStats height={18} width={18} />}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
          <NotAuthorizedStatComponent />
        </Container>
      </DashboardPageWrapper>
    );
  }

  return (
    <DashboardPageWrapper
      titles={[
        { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: PAGE_STATS },
        { name: lesson?.translate?.title, url: `${PAGE_STATS}/${lesson?.uid}` },
        { name: chapter?.translate?.title, url: `${PAGE_STATS}/${lesson?.uid}/${chapter?.uid}` },
        { name: `${capitalizeFirstLetter(t('quiz'))} n°${indexStat + 1}`, url: `` },
      ]}
      icon={<IconStats height={18} width={18} />}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
        {isLoadingStats ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
            <CircularProgress size={32} />
          </Stack>
        ) : (
          <Stack spacing={3}>
            <CardHeader indexStat={indexStat} />
            
            {stats.length === 0 && <NoStatComponent />}
            
            {stats.length > 0 && (
              <>
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 4, md: 'auto' }}>
                      <MiniStat
                        label={t('level')}
                        value={`${t(level)}`}
                        icon={<IconLevel height={24} width={24} color="var(--primary)" />}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 'auto' }}>
                      <MiniStat
                        label={t('score')}
                        value={`${score}/${countQuestions}`}
                        icon={<EmojiEventsIcon sx={{ fontSize: 20, color: "var(--primary)" }} />}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 'auto' }}>
                      <MiniStat
                        label={t('average')}
                        value={`${parseInt(average)}%`}
                        icon={<IconStats height={20} width={20} color="var(--primary)" />}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 'auto' }}>
                      <MiniStat
                        label={t('duration_short')}
                        value={formatChrono(duration)}
                        icon={<IconDuration height={20} width={20} color="var(--primary)" />}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 'auto' }}>
                      <MiniStat
                        label={t('date')}
                        value={getFormattedDateCompleteNumeric(endDate)}
                        icon={<IconCalendar height={20} width={20} color="var(--primary)" />}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    p: 3,
                    border: '1px solid var(--card-border)',
                    bgcolor: 'var(--card-color)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <StatsChartsComponent
                    listComponent={<OneStatComponent stat={stat} viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                    listAverageComponent={<StatsOneStatListComponent viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
                    showEvolution={false}
                    showEvolutionAverage={false}
                    compareComponent={<StatsOneStatBarChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
                    compareAverageComponent={<StatsOneStatBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
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
  const { stat, stats } = useStat();
  const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
  const colorStat = STATUS_CONFIG[stat?.status];
  
  const disabledBack = useMemo(() => {
    return indexStat === 0;
  }, [indexStat]);
  
  const disabledNext = useMemo(() => {
    return indexStat === stats?.length - 1;
  }, [indexStat, stats?.length]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 3,
        border: '1px solid var(--card-border)',
        bgcolor: 'var(--card-color)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Stack spacing={2.5}>
        <Stack spacing={1}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--font-color)',
            }}
          >
            {lesson?.uid_intern}. {lesson?.translate?.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'var(--grey-light)',
            }}
          >
            {chapter?.uid_intern}. {chapter?.translate?.title} • {t(chapter?.level)} • {capitalizeFirstLetter(t('quiz'))} n°{indexStat + 1}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Link href={`${PAGE_STATS}/${stat?.uid_lesson}/${stat?.uid_chapter}`}>
            <ButtonCancel label={t('btn-see-results')} />
          </Link>
        </Stack>

        {stats.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              bgcolor: colorStat?.background || 'var(--primary-shadow-xs)',
              borderRadius: 2,
              border: `1px solid ${colorStat?.border || 'var(--card-border)'}`,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              justifyContent="center"
            >
              <IconButton
                disabled={disabledBack}
                onClick={() => {
                  const uid = stats?.[indexStat - 1]?.uid || "";
                  router.push(`${PAGE_STATS}/${stat?.uid_lesson}/${stat?.uid_chapter}/${uid}`);
                }}
                sx={{
                  color: disabledBack ? 'var(--grey-light)' : (colorStat?.color || 'var(--primary)'),
                  transition: 'all 0.2s',
                  '&:hover:not(:disabled)': {
                    bgcolor: colorStat?.background_icon || 'var(--primary-shadow-xs)',
                    transform: 'scale(1.1)',
                  },
                  '&:disabled': {
                    opacity: 0.4,
                  },
                }}
              >
                <IconArrowBack />
              </IconButton>
              
              <Typography
                sx={{
                  fontWeight: 600,
                  color: colorStat?.color || 'var(--font-color)',
                  minWidth: '80px',
                  textAlign: 'center',
                }}
              >
                {capitalizeFirstLetter(t('quiz'))} {indexStat + 1}/{stats?.length}
              </Typography>
              
              <IconButton
                disabled={disabledNext}
                onClick={() => {
                  const uid = stats?.[indexStat + 1]?.uid || "";
                  router.push(`${PAGE_STATS}/${stat?.uid_lesson}/${stat?.uid_chapter}/${uid}`);
                }}
                sx={{
                  color: disabledNext ? 'var(--grey-light)' : (colorStat?.color || 'var(--primary)'),
                  transition: 'all 0.2s',
                  '&:hover:not(:disabled)': {
                    bgcolor: colorStat?.background_icon || 'var(--primary-shadow-xs)',
                    transform: 'scale(1.1)',
                  },
                  '&:disabled': {
                    opacity: 0.4,
                  },
                }}
              >
                <IconArrowRight />
              </IconButton>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
};
function MiniStat({ label, value, icon }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 2.5,
        bgcolor: 'var(--card-color)',
        border: '1px solid var(--card-border)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)',
          borderColor: 'var(--primary)',
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'var(--primary-shadow-xs)',
            color: 'var(--primary)',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Stack spacing={0.3} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'var(--grey-light)',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.7rem',
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'var(--font-color)',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
            noWrap
            title={String(value)}
          >
            {value}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}