"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IconSearch, IconSession } from "@/assets/icons/IconsComponent";
import {
  NS_BUTTONS,
  NS_COMMON,
  NS_DASHBOARD_MENU,
  NS_SESSIONS,
} from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { PAGE_TEACHER_ONE_LESSON, PAGE_TEACHER_CREATE_SESSION_LIST, PAGE_TEACHER_EDIT_SESSION } from "@/contexts/constants/constants_pages";
import { useSession } from "@/contexts/SessionProvider";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { useUserDevice } from "@/contexts/UserDeviceProvider";
import { ClassUserTeacher } from "@/classes/users/ClassUser";
import { ClassSession, ClassSessionSlot } from "@/classes/ClassSession";
import { ClassLesson } from "@/classes/ClassLesson";
import TeacherPageWrapper from "@/components/wrappers/TeacherPageWrapper";
import FieldComponent from "@/components/elements/FieldComponent";
import { Box, Grid, Stack, Typography, Chip } from "@mui/material";
import Image from "next/image";
import { getFormattedDateNumeric, getFormattedHour } from "@/contexts/functions";
import { useLanguage } from "@/contexts/LangProvider";
import BadgeFormatLesson from "@/components/dashboard/lessons/BadgeFormatLesson";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";

const GRID_COLUMNS = "minmax(0, 0.3fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.8fr) minmax(0, 0.8fr)";

function SessionsComponent() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { t } = useTranslation([ClassSession.NS_COLLECTION, NS_SESSIONS, ClassLesson.NS_COLLECTION]);
  const { user } = useAuth();
  const { sessions, isLoading } = useSession();
  const [filter, setFilter] = useState({ search: "" });
  const [sessionsFilter, setSessionsFilter] = useState([]);

  useEffect(() => {
    let list = [...sessions];
    if (filter.search?.trim()) {
      const q = filter.search.toLowerCase();
      list = list.filter((s) => {
        const byTitle = s.lesson?.translate?.title?.toLowerCase().includes(q) || 
                       s.lesson?.title?.toLowerCase().includes(q);
        const byCode = s.code?.toLowerCase().includes(q);
        const byCategory = t(s.lesson?.category)?.toLowerCase().includes(q);
        return byTitle || byCode || byCategory;
      });
    }
    setSessionsFilter(list);
  }, [filter.search, sessions, t]);

  const cardSx = {
    bgcolor: "var(--card-color)",
    color: "var(--font-color)",
    borderRadius: 2,
    border: "1px solid var(--card-border)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    overflow: "hidden",
    transition: "box-shadow 0.2s ease",
    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  };

  const headerSx = {
    display: "grid",
    gridTemplateColumns: GRID_COLUMNS,
    gap: 1.5,
    px: 2,
    py: 1.5,
    bgcolor: "var(--grey-hyper-dark)",
    color: "var(--font-reverse-color)",
    borderBottom: "1px solid var(--card-border)",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    "@media (max-width: 900px)": { display: "none" },
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100%" }}>
      <Stack spacing={2} sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <ButtonConfirm
            label={t("dialog.btn-create-session", { ns: ClassSession.NS_COLLECTION })}
            onClick={() => router.push(PAGE_TEACHER_CREATE_SESSION_LIST(user?.uid))}
          />
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }} sx={{ maxWidth: 400 }}>
            <FieldComponent
              name="search"
              value={filter.search ?? ""}
              placeholder={t("placeholder_search", { ns: NS_SESSIONS })}
              fullWidth
              type="text"
              icon={<IconSearch width={18} />}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, search: e.target.value }))
              }
              onClear={() => setFilter((prev) => ({ ...prev, search: "" }))}
            />
          </Grid>
        </Grid>
      </Stack>

      <Box sx={cardSx}>
        <Box sx={headerSx}>
          <span />
          <span>{t("session")}</span>
          <span>{t("lesson")}</span>
          <span>{t("start_date")}</span>
          <span>{t("format")}</span>
          <span>{t("status")}</span>
        </Box>

        <Stack component="div" sx={{ flexDirection: "column" }}>
          {isLoading && (
            <Box
              sx={{
                py: 4,
                px: 2,
                textAlign: "center",
                color: "var(--grey)",
                fontSize: "0.95rem",
              }}
            >
              {t("loading", { ns: NS_COMMON })}
            </Box>
          )}

          {!isLoading && sessionsFilter.length === 0 && (
            <Box
              sx={{
                py: 4,
                px: 2,
                textAlign: "center",
                color: "var(--grey)",
                fontSize: "0.95rem",
              }}
            >
              {t("not-found", { ns: NS_SESSIONS })}
            </Box>
          )}

          {!isLoading && sessionsFilter.map((session, i) => (
            <SessionRow
              key={session.uid}
              session={session}
              lastChild={i === sessionsFilter.length - 1}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

function SessionRow({ session = null, lastChild = false }) {
  const { t } = useTranslation([
    ClassSession.NS_COLLECTION,
    NS_SESSIONS,
    ClassLesson.NS_COLLECTION,
  ]);
  const { isMobile } = useUserDevice();
  const { lang } = useLanguage();
  const {getOneLesson} = useLessonTeacher();
  const { user } = useAuth();
  const router = useRouter();
  const lesson = useMemo(() => {
    if (!session?.uid_lesson) return null;
    return getOneLesson(session.uid_lesson);
  }, [session, getOneLesson]);
  const firstSlot = useMemo(() => {
    if (!session?.slots || session.slots.length === 0) return null;
    return session.slots[0];
  }, [session]);

  const statusConfig = useMemo(() => {
    if (!firstSlot) return null;
    return ClassSessionSlot.STATUS_CONFIG[firstSlot.status] || ClassSessionSlot.STATUS_CONFIG.open;
  }, [firstSlot]);

  const rowSx = {
    display: "grid",
    gridTemplateColumns: GRID_COLUMNS,
    gap: 1.5,
    px: 2,
    py: 1.5,
    alignItems: "center",
    fontSize: "0.9rem",
    borderBottom: lastChild ? "none" : "1px solid var(--card-border)",
    transition: "background 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      bgcolor: "rgba(0,0,0,0.03)",
    },
    "@media (max-width: 900px)": {
      gridTemplateColumns: "1fr",
      gap: 1,
      p: 2,
      borderRadius: 2,
      border: "1px solid var(--card-border)",
      borderBottom: "1px solid var(--card-border)",
      mb: lastChild ? 0 : 1,
    },
  };

  const cellSx = { minWidth: 0 };

  const nameSx = {
    m: 0,
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "var(--font-color)",
  };

  const subSx = {
    m: 0,
    mt: 0.25,
    fontSize: "0.8rem",
    color: "var(--grey)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const handleRowClick = () => {
    if (session?.uid && user instanceof ClassUserTeacher) {
      router.push(PAGE_TEACHER_EDIT_SESSION(user.uid, session.uid));
    }
  };

  return (
    <Box sx={rowSx} onClick={handleRowClick}>
      <Box sx={cellSx}>
        {lesson?.photo_url && (
          <Box
            sx={{
              borderRadius: 1,
              overflow: "hidden",
              bgcolor: "var(--grey-hyper-light)",
              width: isMobile ? "100%" : 72,
              height: 48,
              position: "relative",
            }}
          >
            <Image
              src={lesson.photo_url}
              alt={`session-${session.uid}`}
              fill
              sizes="72px"
              style={{ objectFit: "contain" }}
            />
          </Box>
        )}
      </Box>

      <Box sx={cellSx}>
        <Box>
          <Typography component="p" sx={nameSx}>
            {session?.code || session?.uid_intern}
          </Typography>
          {session?.title && (
            <Typography component="p" sx={subSx}>
              {session.title}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={cellSx}>
        <Box>
          <Typography component="p" sx={nameSx}>
            {lesson?.title}
          </Typography>
          {lesson?.subtitle && (
            <Typography component="p" sx={subSx}>
              {t(lesson.subtitle)}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={cellSx}>
        {firstSlot && (
          <Box>
            <Typography component="p" sx={nameSx}>
              {getFormattedDateNumeric(firstSlot.start_date, lang)}
            </Typography>
            <Typography component="p" sx={subSx}>
              {getFormattedHour(firstSlot.start_date, lang)} - {getFormattedHour(firstSlot.end_date, lang)}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={cellSx}>
        {firstSlot && (
          <BadgeFormatLesson format={firstSlot.format} />
        )}
      </Box>

      <Box sx={cellSx}>
        {statusConfig && (
          <Chip
            label={t(statusConfig.label)}
            size="small"
            sx={{
              bgcolor: statusConfig.color,
              color: "var(--font-reverse-color)",
              fontSize: "0.7rem",
              height: "24px",
              fontWeight: 500,
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default function SessionsPage() {
  const { t } = useTranslation([NS_SESSIONS, NS_DASHBOARD_MENU, NS_BUTTONS]);
  const { user } = useAuth();
  const isAuthorized = useMemo(
    () => user instanceof ClassUserTeacher,
    [user]
  );

  return (
    <TeacherPageWrapper
      isAuthorized={isAuthorized}
      titles={[{ name: t("sessions", { ns: NS_DASHBOARD_MENU }), url: "" }]}
      icon={<IconSession width={22} height={22} />}
    >
      <Stack alignItems="flex-start" spacing={2} sx={{ width: "100%", minHeight: "100%" }}>
        <SessionsComponent />
      </Stack>
    </TeacherPageWrapper>
  );
}
