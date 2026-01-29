"use client";

import React, { useMemo } from "react";
import {
  PAGE_ADMIN_LESSONS,
  PAGE_ADMIN_UPDATE_ONE_LESSON,
  PAGE_DASHBOARD_USERS,
  PAGE_SESSIONS,
  PAGE_STATS,
} from "@/contexts/constants/constants_pages";
import { NS_DASHBOARD_HOME, NS_DASHBOARD_MENU, NS_ROLES } from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthProvider";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getFormattedDateNumeric, getFormattedHour } from "@/contexts/functions";
import { ClassLesson } from "@/classes/ClassLesson";
import { ClassSession } from "@/classes/ClassSession";
import { useLesson } from "@/contexts/LessonProvider";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import { useSession } from "@/contexts/SessionProvider";
import { useUsers } from "@/contexts/UsersProvider";
import Image from "next/image";

function AdminStatsCards() {
  const { t } = useTranslation([NS_DASHBOARD_HOME, NS_DASHBOARD_MENU, ClassLesson.NS_COLLECTION]);
  const { lessons, isLoading: isLoadingLessons } = useLesson();
  const { lessons: lessonsTeacher, isLoading: isLoadingTeacher } = useLessonTeacher();
  const { sessions, isLoading: isLoadingSessions } = useSession();
  const { users, isLoading: isLoadingUsers } = useUsers();

  const stats = useMemo(() => {
    const today = new Date();
    const upcomingSessions = sessions.filter((session) => {
      const slots = session.slots || [];
      return slots.some((slot) => slot.start_date && slot.start_date.getTime() > today.getTime());
    });
    const pastSessions = sessions.filter((session) => {
      const slots = session.slots || [];
      return slots.some((slot) => slot.start_date && slot.start_date.getTime() <= today.getTime());
    });
    const totalLessons = lessons.length + lessonsTeacher.length;
    return {
      totalUsers: users?.length ?? 0,
      totalLessons,
      totalLessonsOnline: lessons.length,
      totalLessonsOnsite: lessonsTeacher.length,
      totalSessions: sessions.length,
      upcomingSessions: upcomingSessions.length,
      pastSessions: pastSessions.length,
    };
  }, [lessons, lessonsTeacher, sessions, users]);

  const loading = isLoadingLessons || isLoadingTeacher || isLoadingSessions || isLoadingUsers;

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress size={40} sx={{ color: "var(--admin)" }} />
      </Stack>
    );
  }

  const statCards = [
    {
      title: t("users", { ns: NS_DASHBOARD_MENU }),
      value: stats.totalUsers,
      subtitle: t("admin-stat-users", { ns: NS_DASHBOARD_HOME }),
      icon: "👥",
      color: "var(--admin)",
    },
    {
      title: t("lessons", { ns: ClassLesson.NS_COLLECTION }),
      value: stats.totalLessons,
      subtitle: t("admin-stat-courses", { ns: NS_DASHBOARD_HOME }),
      icon: "📚",
      color: "var(--admin)",
    },
    {
      title: t("sessions", { ns: NS_DASHBOARD_MENU }),
      value: stats.totalSessions,
      subtitle: t("total-sessions", { ns: NS_DASHBOARD_HOME }),
      icon: "📅",
      color: "var(--success)",
    },
    {
      title: t("upcoming-sessions", { ns: NS_DASHBOARD_HOME }),
      value: stats.upcomingSessions,
      subtitle: t("sessions-to-come", { ns: NS_DASHBOARD_HOME }),
      icon: "⏰",
      color: "var(--warning)",
    },
    {
      title: t("past-sessions", { ns: NS_DASHBOARD_HOME }),
      value: stats.pastSessions,
      subtitle: t("completed-sessions", { ns: NS_DASHBOARD_HOME }),
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
              background: "var(--card-color)",
              border: "0.1px solid var(--card-border)",
              borderRadius: "16px",
              height: "100%",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "var(--admin)",
                transform: "translateY(-2px)",
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
                      fontSize: "2rem",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Box sx={{ fontSize: "2rem", lineHeight: 1 }}>{stat.icon}</Box>
                </Stack>
                <Stack spacing={0.5}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "var(--font-color)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "var(--grey-light)",
                      fontSize: "0.8rem",
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

function AdminUsersList() {
  const router = useRouter();
  const { t } = useTranslation([NS_DASHBOARD_HOME, NS_DASHBOARD_MENU, "dashboard/users", NS_ROLES]);
  const { users, isLoading } = useUsers();
  const displayed = useMemo(() => (users || []).slice(0, 5), [users]);

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress size={40} sx={{ color: "var(--admin)" }} />
      </Stack>
    );
  }

  return (
    <Paper
      sx={{
        background: "var(--card-color)",
        border: "0.1px solid var(--card-border)",
        borderRadius: "16px",
        p: 2.5,
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "var(--font-color)",
              fontSize: "1.1rem",
            }}
          >
            {t("users", { ns: NS_DASHBOARD_MENU })}
          </Typography>
          {(users?.length ?? 0) > 5 && (
            <Button
              size="small"
              onClick={() => router.push(PAGE_DASHBOARD_USERS)}
              sx={{
                color: "var(--admin)",
                textTransform: "none",
                fontSize: "0.85rem",
              }}
            >
              {t("see-all", { ns: NS_DASHBOARD_HOME })}
            </Button>
          )}
        </Stack>

        {displayed.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
            <Typography
              variant="body2"
              sx={{ color: "var(--grey-light)", textAlign: "center" }}
            >
              {t("admin-no-users", { ns: NS_DASHBOARD_HOME })}
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {displayed.map((u) => (
              <Box
                key={u.uid}
                onClick={() => router.push(PAGE_DASHBOARD_USERS)}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 1.5,
                  borderRadius: "12px",
                  border: "0.1px solid var(--card-border)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "var(--admin)",
                    backgroundColor: "var(--card-hover)",
                  },
                }}
              >
                {u?.showAvatar?.({
                  size: 40,
                  fontSize: "14px",
                }) ?? (
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "var(--admin)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {(u?.first_name?.[0] || u?.email?.[0] || "?").toUpperCase()}
                  </Avatar>
                )}
                <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "var(--font-color)",
                      fontSize: "0.95rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {u?.first_name} {u?.last_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "var(--grey-light)",
                      fontSize: "0.8rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {u?.email}
                  </Typography>
                  {u?.role && (
                    <Chip
                      label={t(u.role, { ns: NS_ROLES })}
                      size="small"
                      sx={{
                        fontSize: "0.7rem",
                        height: 20,
                        width: "fit-content",
                        bgcolor: "var(--admin-shadow-sm)",
                        color: "var(--admin)",
                        border: "1px solid var(--admin)",
                      }}
                    />
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

function AdminCoursesList() {
  const router = useRouter();
  const { user } = useAuth();
  const uid = useParams()?.uid;
  const { t } = useTranslation([NS_DASHBOARD_HOME, ClassLesson.NS_COLLECTION]);
  const { lessons, isLoading: isLoadingOnline } = useLesson();
  const { lessons: lessonsTeacher, isLoading: isLoadingTeacher } = useLessonTeacher();
  const loading = isLoadingOnline || isLoadingTeacher;

  const allLessons = useMemo(() => {
    const list = [...(lessons || []), ...(lessonsTeacher || [])];
    return list.slice(0, 5);
  }, [lessons, lessonsTeacher]);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress size={40} sx={{ color: "var(--admin)" }} />
      </Stack>
    );
  }

  const totalCount = (lessons?.length ?? 0) + (lessonsTeacher?.length ?? 0);
  const lessonsLink = uid ? PAGE_ADMIN_LESSONS(uid) : "#";

  return (
    <Paper
      sx={{
        background: "var(--card-color)",
        border: "0.1px solid var(--card-border)",
        borderRadius: "16px",
        p: 2.5,
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "var(--font-color)",
              fontSize: "1.1rem",
            }}
          >
            {t("admin-all-courses", { ns: NS_DASHBOARD_HOME })}
          </Typography>
          {totalCount > 5 && (
            <Button
              size="small"
              onClick={() => uid && router.push(lessonsLink)}
              sx={{
                color: "var(--admin)",
                textTransform: "none",
                fontSize: "0.85rem",
              }}
            >
              {t("see-all", { ns: NS_DASHBOARD_HOME })}
            </Button>
          )}
        </Stack>

        {allLessons.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
            <Typography
              variant="body2"
              sx={{ color: "var(--grey-light)", textAlign: "center" }}
            >
              {t("admin-no-courses", { ns: NS_DASHBOARD_HOME })}
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {allLessons.map((lesson) => {
              const isTeacher = !!lesson.uid_lesson;
              const link = isTeacher
                ? `${lessonsLink}/${lesson.uid_lesson}/${lesson.uid}`
                : `${PAGE_ADMIN_UPDATE_ONE_LESSON}/${lesson.uid}`;
              return (
                <Box
                  key={lesson.uid}
                  onClick={() => uid && router.push(link)}
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 1.5,
                    borderRadius: "12px",
                    border: "0.1px solid var(--card-border)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "var(--admin)",
                      backgroundColor: "var(--card-hover)",
                    },
                  }}
                >
                  {lesson.translate?.photo_url && (
                    <Box
                      sx={{
                        width: 80,
                        height: 60,
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={lesson.translate.photo_url}
                        alt={lesson.translate?.title || ""}
                        width={80}
                        height={60}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                  <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "var(--font-color)",
                        fontSize: "0.95rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lesson.translate?.title || lesson.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--grey-light)",
                        fontSize: "0.8rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lesson.translate?.subtitle || lesson.subtitle}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={t(lesson.format || ClassLesson.FORMAT.ONSITE, { ns: ClassLesson.NS_COLLECTION })}
                        size="small"
                        sx={{
                          fontSize: "0.7rem",
                          height: 20,
                          bgcolor: "var(--admin-shadow-sm)",
                          color: "var(--admin)",
                          border: "1px solid var(--admin)",
                        }}
                      />
                      {lesson.certified && (
                        <Chip
                          label={t("certified", { ns: ClassLesson.NS_COLLECTION })}
                          size="small"
                          sx={{
                            fontSize: "0.7rem",
                            height: 20,
                            bgcolor: "var(--success-shadow-sm)",
                            color: "var(--success)",
                            border: "1px solid var(--success)",
                          }}
                        />
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

function AdminSessionsList() {
  const { t } = useTranslation([NS_DASHBOARD_HOME]);
  const { sessions, isLoading } = useSession();
  const { lessons } = useLessonTeacher();
  const router = useRouter();

  const upcomingSessions = useMemo(() => {
    const today = new Date();
    const upcoming = [];
    sessions.forEach((session) => {
      const slots = session.slots || [];
      slots.forEach((slot) => {
        if (slot.start_date && slot.start_date.getTime() > today.getTime()) {
          upcoming.push({ session, slot });
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
        <CircularProgress size={40} sx={{ color: "var(--admin)" }} />
      </Stack>
    );
  }

  return (
    <Paper
      sx={{
        background: "var(--card-color)",
        border: "0.1px solid var(--card-border)",
        borderRadius: "16px",
        p: 2.5,
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "var(--font-color)",
              fontSize: "1.1rem",
            }}
          >
            {t("upcoming-sessions", { ns: NS_DASHBOARD_HOME })}
          </Typography>
          <Button
            size="small"
            onClick={() => router.push(PAGE_SESSIONS)}
            sx={{
              color: "var(--admin)",
              textTransform: "none",
              fontSize: "0.85rem",
            }}
          >
            {t("see-all", { ns: NS_DASHBOARD_HOME })}
          </Button>
        </Stack>

        {upcomingSessions.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
            <Typography
              variant="body2"
              sx={{ color: "var(--grey-light)", textAlign: "center" }}
            >
              {t("no-upcoming-sessions", { ns: NS_DASHBOARD_HOME })}
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {upcomingSessions.map(({ session, slot }) => {
              const lesson = lessons?.find((l) => l.uid_lesson === session.uid_lesson);
              return (
                <Box
                  key={`${session.uid}-${slot.uid_intern}`}
                  onClick={() => router.push(PAGE_SESSIONS)}
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    border: "0.1px solid var(--card-border)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "var(--admin)",
                      backgroundColor: "var(--card-hover)",
                    },
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "var(--font-color)",
                          fontSize: "0.95rem",
                        }}
                      >
                        {lesson?.translate?.title ||
                          session.lesson?.translate?.title ||
                          "Cours"}
                      </Typography>
                      <Chip
                        label={slot.status || ClassSession.STATUS.OPEN}
                        size="small"
                        sx={{
                          fontSize: "0.7rem",
                          height: 20,
                          bgcolor:
                            slot.status === ClassSession.STATUS.FULL
                              ? "var(--error-shadow-sm)"
                              : "var(--success-shadow-sm)",
                          color:
                            slot.status === ClassSession.STATUS.FULL
                              ? "var(--error)"
                              : "var(--success)",
                          border: `1px solid ${
                            slot.status === ClassSession.STATUS.FULL
                              ? "var(--error)"
                              : "var(--success)"
                          }`,
                        }}
                      />
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography
                        variant="caption"
                        sx={{ color: "var(--grey-light)", fontSize: "0.8rem" }}
                      >
                        📅 {getFormattedDateNumeric(slot.start_date)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "var(--grey-light)", fontSize: "0.8rem" }}
                      >
                        ⏰ {getFormattedHour(slot.start_date)} -{" "}
                        {getFormattedHour(slot.end_date)}
                      </Typography>
                      {session.room && (
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--grey-light)", fontSize: "0.8rem" }}
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

function AdminQuickActions() {
  const router = useRouter();
  const { t } = useTranslation([NS_DASHBOARD_HOME, NS_DASHBOARD_MENU]);
  const uid = useParams()?.uid;

  const actions = [
    {
      label: t("users", { ns: NS_DASHBOARD_MENU }),
      description: t("admin-action-users-desc", { ns: NS_DASHBOARD_HOME }),
      emoji: "👥",
      link: PAGE_DASHBOARD_USERS,
      color: "var(--admin)",
    },
    {
      label: t("lessons", { ns: NS_DASHBOARD_MENU }),
      description: t("admin-action-lessons-desc", { ns: NS_DASHBOARD_HOME }),
      emoji: "📚",
      link: uid ? PAGE_ADMIN_LESSONS(uid) : "#",
      color: "var(--admin)",
    },
    {
      label: t("sessions", { ns: NS_DASHBOARD_MENU }),
      description: t("admin-action-sessions-desc", { ns: NS_DASHBOARD_HOME }),
      emoji: "📅",
      link: PAGE_SESSIONS,
      color: "var(--success)",
    },
    {
      label: t("admin-action-results", { ns: NS_DASHBOARD_HOME }),
      description: t("admin-action-results-desc", { ns: NS_DASHBOARD_HOME }),
      emoji: "📊",
      link: PAGE_STATS,
      color: "var(--warning)",
    },
  ];

  return (
    <Grid container spacing={2}>
      {actions.map((action, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            component={Link}
            href={action.link}
            sx={{
              display: "flex",
              gap: 2,
              p: 2,
              borderRadius: "12px",
              border: "0.1px solid var(--card-border)",
              background: "var(--card-color)",
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: action.color,
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box sx={{ fontSize: "2rem", lineHeight: 1 }}>{action.emoji}</Box>
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: "var(--font-color)",
                  fontSize: "0.95rem",
                }}
              >
                {action.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "var(--grey-light)",
                  fontSize: "0.8rem",
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

export default function AdminHomeComponent() {
  const { t } = useTranslation([NS_DASHBOARD_HOME]);

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "var(--font-color)",
            fontSize: "1.8rem",
          }}
        >
          {t("welcome-1", { ns: NS_DASHBOARD_HOME })}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "var(--grey-light)",
            fontSize: "0.95rem",
          }}
        >
          {t("admin-dashboard-subtitle", { ns: NS_DASHBOARD_HOME })}
        </Typography>
      </Stack>

      <AdminStatsCards />
      <AdminQuickActions />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AdminUsersList />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AdminCoursesList />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AdminSessionsList />
        </Grid>
      </Grid>
    </Stack>
  );
}
