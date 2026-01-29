"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { IconDashboard, IconLessons, IconSession } from "@/assets/icons/IconsComponent";
import { NS_DASHBOARD_HOME, NS_LESSONS, NS_COMMON } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import { Box, Button, Card, CardContent, Chip, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material';
import { ClassUserTeacher } from '@/classes/users/ClassUser';
import { useLanguage } from '@/contexts/LangProvider';
import { ClassLesson } from '@/classes/ClassLesson';
import { useRouter } from 'next/navigation';
import { PAGE_TEACHER_LESSONS } from '@/contexts/constants/constants_pages';
import { LessonTeacherProvider, useLessonTeacher } from '@/contexts/LessonTeacherProvider';
import { SessionProvider, useSession } from '@/contexts/SessionProvider';
import Link from 'next/link';
import { getFormattedDateNumeric, getFormattedHour } from '@/contexts/functions';
import { ClassColor } from '@/classes/ClassColor';
import { ClassSession } from '@/classes/ClassSession';
import Image from 'next/image';

function TeacherStatsCards() {
  const { t } = useTranslation([NS_DASHBOARD_HOME, NS_LESSONS]);
  const { lessons, isLoading: isLoadingLessons } = useLessonTeacher();
  const { sessions, isLoading: isLoadingSessions } = useSession();
  const { user } = useAuth();

  const stats = useMemo(() => {
    const today = new Date();
    const upcomingSessions = sessions.filter(session => {
      const slots = session.slots || [];
      return slots.some(slot => slot.start_date && slot.start_date.getTime() > today.getTime());
    });
    
    const pastSessions = sessions.filter(session => {
      const slots = session.slots || [];
      return slots.some(slot => slot.start_date && slot.start_date.getTime() <= today.getTime());
    });

    return {
      totalLessons: lessons.length,
      totalSessions: sessions.length,
      upcomingSessions: upcomingSessions.length,
      pastSessions: pastSessions.length,
    };
  }, [lessons, sessions]);

  if (isLoadingLessons || isLoadingSessions) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress size={40} sx={{ color: "var(--primary)" }} />
      </Stack>
    );
  }

  const statCards = [
    {
      title: t('lessons', { ns: NS_LESSONS }),
      value: stats.totalLessons,
      subtitle: t('total-courses-created', { ns: NS_DASHBOARD_HOME }),
      icon: "📚",
      color: "var(--primary)",
    },
    {
      title: t('sessions', { ns: NS_COMMON }),
      value: stats.totalSessions,
      subtitle: t('total-sessions', { ns: NS_DASHBOARD_HOME }),
      icon: "📅",
      color: "var(--success)",
    },
    {
      title: t('upcoming-sessions', { ns: NS_DASHBOARD_HOME }),
      value: stats.upcomingSessions,
      subtitle: t('sessions-to-come', { ns: NS_DASHBOARD_HOME }),
      icon: "⏰",
      color: "var(--warning)",
    },
    {
      title: t('past-sessions', { ns: NS_DASHBOARD_HOME }),
      value: stats.pastSessions,
      subtitle: t('completed-sessions', { ns: NS_DASHBOARD_HOME }),
      icon: "✅",
      color: "var(--grey-light)",
    },
  ];

  return (
    <Grid container spacing={2}>
      {statCards.map((stat, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: 'var(--card-color)',
              border: '0.1px solid var(--card-border)',
              borderRadius: '16px',
              height: '100%',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'var(--primary)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: stat.color,
                      fontSize: '2rem',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Box
                    sx={{
                      fontSize: '2rem',
                      lineHeight: 1,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Stack>
                <Stack spacing={0.5}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: 'var(--font-color)',
                      fontSize: '0.95rem',
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'var(--grey-light)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {stat.subtitle}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function TeacherLessonsList() {
  const router = useRouter();
  const { t } = useTranslation([NS_LESSONS, NS_DASHBOARD_HOME]);
  const { lessons, isLoading } = useLessonTeacher();
  const { user } = useAuth();

  const displayedLessons = useMemo(() => {
    return lessons.slice(0, 5);
  }, [lessons]);

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress size={40} sx={{ color: "var(--primary)" }} />
      </Stack>
    );
  }

  return (
    <Paper
      sx={{
        background: 'var(--card-color)',
        border: '0.1px solid var(--card-border)',
        borderRadius: '16px',
        p: 2.5,
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'var(--font-color)',
              fontSize: '1.1rem',
            }}
          >
            {t('my-courses', { ns: NS_DASHBOARD_HOME })}
          </Typography>
          {lessons.length > 5 && (
            <Button
              size="small"
              onClick={() => router.push(PAGE_TEACHER_LESSONS(user?.uid))}
              sx={{
                color: 'var(--primary)',
                textTransform: 'none',
                fontSize: '0.85rem',
              }}
            >
              {t('see-all', { ns: NS_DASHBOARD_HOME })}
            </Button>
          )}
        </Stack>

        {displayedLessons.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--grey-light)',
                textAlign: 'center',
              }}
            >
              {t('no-courses-created', { ns: NS_DASHBOARD_HOME })}
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {displayedLessons.map((lesson) => (
              <Box
                key={lesson.uid}
                onClick={() => router.push(`${PAGE_TEACHER_LESSONS(user?.uid)}/${lesson.uid_lesson}/${lesson.uid}`)}
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: 1.5,
                  borderRadius: '12px',
                  border: '0.1px solid var(--card-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'var(--primary)',
                    backgroundColor: 'var(--card-hover)',
                  },
                }}
              >
                {lesson.translate?.photo_url && (
                  <Box
                    sx={{
                      width: 80,
                      height: 60,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={lesson.translate.photo_url}
                      alt={lesson.translate.title}
                      width={80}
                      height={60}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                )}
                <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: 'var(--font-color)',
                      fontSize: '0.95rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lesson.translate?.title || lesson.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'var(--grey-light)',
                      fontSize: '0.8rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lesson.translate?.subtitle || lesson.subtitle}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={t(lesson.format || ClassLesson.FORMAT.ONSITE, { ns: ClassLesson.NS_COLLECTION })}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        height: 20,
                        bgcolor: 'var(--primary-shadow-sm)',
                        color: 'var(--primary)',
                        border: '1px solid var(--primary)',
                      }}
                    />
                    {lesson.certified && (
                      <Chip
                        label={t('certified', { ns: NS_LESSONS })}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: 20,
                          bgcolor: 'var(--success-shadow-sm)',
                          color: 'var(--success)',
                          border: '1px solid var(--success)',
                        }}
                      />
                    )}
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

function TeacherSessionsList() {
  const router = useRouter();
  const { t } = useTranslation([NS_DASHBOARD_HOME, NS_COMMON]);
  const { sessions, isLoading, getOneSession } = useSession();
  const { user } = useAuth();
  const { lessons } = useLessonTeacher();

  const upcomingSessions = useMemo(() => {
    const today = new Date();
    const upcoming = [];
    
    sessions.forEach(session => {
      const slots = session.slots || [];
      slots.forEach(slot => {
        if (slot.start_date && slot.start_date.getTime() > today.getTime()) {
          upcoming.push({
            session,
            slot,
          });
        }
      });
    });

    return upcoming
      .sort((a, b) => a.slot.start_date.getTime() - b.slot.start_date.getTime())
      .slice(0, 5);
  }, [sessions]);

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress size={40} sx={{ color: "var(--primary)" }} />
      </Stack>
    );
  }

  return (
    <Paper
      sx={{
        background: 'var(--card-color)',
        border: '0.1px solid var(--card-border)',
        borderRadius: '16px',
        p: 2.5,
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'var(--font-color)',
              fontSize: '1.1rem',
            }}
          >
            {t('upcoming-sessions', { ns: NS_DASHBOARD_HOME })}
          </Typography>
        </Stack>

        {upcomingSessions.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--grey-light)',
                textAlign: 'center',
              }}
            >
              {t('no-upcoming-sessions', { ns: NS_DASHBOARD_HOME })}
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {upcomingSessions.map(({ session, slot }) => {
              const lesson = lessons.find(l => l.uid_lesson === session.uid_lesson);
              return (
                <Box
                  key={`${session.uid}-${slot.uid_intern}`}
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    border: '0.1px solid var(--card-border)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'var(--primary)',
                      backgroundColor: 'var(--card-hover)',
                    },
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: 'var(--font-color)',
                          fontSize: '0.95rem',
                        }}
                      >
                        {lesson?.translate?.title || session.lesson?.translate?.title || 'Cours'}
                      </Typography>
                      <Chip
                        label={slot.status || ClassSession.STATUS.OPEN}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: 20,
                          bgcolor: slot.status === ClassSession.STATUS.FULL 
                            ? 'var(--error-shadow-sm)' 
                            : 'var(--success-shadow-sm)',
                          color: slot.status === ClassSession.STATUS.FULL 
                            ? 'var(--error)' 
                            : 'var(--success)',
                          border: `1px solid ${slot.status === ClassSession.STATUS.FULL 
                            ? 'var(--error)' 
                            : 'var(--success)'}`,
                        }}
                      />
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'var(--grey-light)',
                          fontSize: '0.8rem',
                        }}
                      >
                        📅 {getFormattedDateNumeric(slot.start_date)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'var(--grey-light)',
                          fontSize: '0.8rem',
                        }}
                      >
                        ⏰ {getFormattedHour(slot.start_date)} - {getFormattedHour(slot.end_date)}
                      </Typography>
                      {session.room && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'var(--grey-light)',
                            fontSize: '0.8rem',
                          }}
                        >
                          📍 {session.room.translate?.name || session.room.name}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

function QuickActions() {
  const router = useRouter();
  const { t } = useTranslation([NS_DASHBOARD_HOME]);
  const { user } = useAuth();

  const actions = [
    {
      label: t('create-course', { ns: NS_DASHBOARD_HOME }),
      description: t('create-course-desc', { ns: NS_DASHBOARD_HOME }),
      emoji: "➕",
      link: PAGE_TEACHER_LESSONS(user?.uid),
      color: "var(--primary)",
    },
    {
      label: t('manage-sessions', { ns: NS_DASHBOARD_HOME }),
      description: t('manage-sessions-desc', { ns: NS_DASHBOARD_HOME }),
      emoji: "📅",
      link: PAGE_TEACHER_LESSONS(user?.uid),
      color: "var(--success)",
    },
  ];

  return (
    <Grid container spacing={2}>
      {actions.map((action, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6 }}>
          <Box
            component={Link}
            href={action.link}
            sx={{
              display: 'flex',
              gap: 2,
              p: 2,
              borderRadius: '12px',
              border: '0.1px solid var(--card-border)',
              background: 'var(--card-color)',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: action.color,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Box
              sx={{
                fontSize: '2rem',
                lineHeight: 1,
              }}
            >
              {action.emoji}
            </Box>
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: 'var(--font-color)',
                  fontSize: '0.95rem',
                }}
              >
                {action.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'var(--grey-light)',
                  fontSize: '0.8rem',
                }}
              >
                {action.description}
              </Typography>
            </Stack>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export default function TeacherHomeComponent() {
  const { t } = useTranslation([NS_DASHBOARD_HOME]);
  const { user } = useAuth();

  return (
    <Stack spacing={3}>
      {/* En-tête */}
      <Stack spacing={1}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'var(--font-color)',
            fontSize: '1.8rem',
          }}
        >
          {t('welcome-1', { ns: NS_DASHBOARD_HOME })}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'var(--grey-light)',
            fontSize: '0.95rem',
          }}
        >
          {t('teacher-dashboard-subtitle', { ns: NS_DASHBOARD_HOME })}
        </Typography>
      </Stack>

      {/* Cartes de statistiques */}
      <TeacherStatsCards />

      {/* Actions rapides */}
      <QuickActions />

      {/* Grille principale */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <TeacherLessonsList />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <TeacherSessionsList />
        </Grid>
      </Grid>
    </Stack>
  );
}
