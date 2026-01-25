"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IconCertificate, IconLessons, IconSearch } from "@/assets/icons/IconsComponent";
import {
  NS_BUTTONS,
  NS_DASHBOARD_MENU,
  NS_LESSONS,
} from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { PAGE_TEACHER_ONE_LESSON } from "@/contexts/constants/constants_pages";
import { useLesson } from "@/contexts/LessonProvider";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import { useUserDevice } from "@/contexts/UserDeviceProvider";
import { ChapterProvider, useChapter } from "@/contexts/ChapterProvider";
import { ClassUserTeacher } from "@/classes/users/ClassUser";
import { ClassLesson } from "@/classes/ClassLesson";
import { ClassLessonChapter } from "@/classes/lessons/ClassLessonChapter";
import TeacherPageWrapper from "@/components/wrappers/TeacherPageWrapper";
import FieldComponent from "@/components/elements/FieldComponent";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";

const GRID_COLUMNS = "minmax(0, 0.3fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.5fr)";

function LessonsComponent() {
  const router = useRouter();
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_LESSONS, ClassLessonChapter.NS_COLLECTION]);
  const { user } = useAuth();
  const { lessons } = useLessonTeacher();
  const [filter, setFilter] = useState({ search: "" });
  const [lessonsFilter, setLessonsFilter] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    lessons.forEach((lesson) => {
      router.prefetch(
        PAGE_TEACHER_ONE_LESSON(user.uid, lesson.uid_lesson, lesson.uid)
      );
    });
  }, [lessons, router, user?.uid]);

  useEffect(() => {
    let list = [...lessons];
    if (filter.search?.trim()) {
      const q = filter.search.toLowerCase();
      list = list.filter((l) => {
        const byTitle = l.translate?.title?.toLowerCase().includes(q);
        const byCategory = t(l.category)?.toLowerCase().includes(q);
        return byTitle || byCategory;
      });
    }
    setLessonsFilter(list);
  }, [filter.search, lessons, t]);

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
      <Grid container spacing={2} sx={{ mb: 2.5 }} alignItems="center">
        <Grid size={{ xs: 12, sm: 6 }} sx={{ maxWidth: 400 }}>
          <FieldComponent
            name="search"
            value={filter.search ?? ""}
            placeholder={t("placeholder_search", { ns: NS_LESSONS })}
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

      <Box sx={cardSx}>
        <Box sx={headerSx}>
          <span />
          <span>{t("lesson")}</span>
          <span>{t("title")}</span>
          <span>{t("certified_short")}</span>
        </Box>

        <Stack component="div" sx={{ flexDirection: "column" }}>
          {lessonsFilter.length === 0 && (
            <Box
              sx={{
                py: 4,
                px: 2,
                textAlign: "center",
                color: "var(--grey)",
                fontSize: "0.95rem",
              }}
            >
              {t("not-found", { ns: NS_LESSONS })}
            </Box>
          )}

          {lessonsFilter.map((lesson, i) => (
            <Box
              key={lesson.uid}
              onClick={() =>
                router.push(
                  PAGE_TEACHER_ONE_LESSON(user?.uid, lesson.uid_lesson, lesson.uid)
                )
              }
              sx={{ cursor: "pointer" }}
            >
              <ChapterProvider uidLesson={lesson.uid}>
                <LessonRow
                  lesson={lesson}
                  lastChild={i === lessonsFilter.length - 1}
                />
              </ChapterProvider>
            </Box>
          ))}
        </Stack>
      </Box>

    </Box>
  );
}

function LessonRow({ lesson = null, lastChild = false }) {
  const { t } = useTranslation([
    ClassLesson.NS_COLLECTION,
    ClassLessonChapter.NS_COLLECTION,
    NS_LESSONS,
  ]);
  const { getOneLesson } = useLesson();
  const { isMobile } = useUserDevice();

  const lessonSource = useMemo(() => {
    if (!lesson) return null;
    return getOneLesson(lesson.uid_lesson);
  }, [lesson, getOneLesson]);

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

  return (
    <Box sx={rowSx}>
      <Box sx={cellSx}>
        {lesson?.translate?.photo_url && (
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
              src={lesson.translate.photo_url}
              alt={`lesson-${lesson.uid}`}
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
            {lessonSource?.title}
          </Typography>
          {lessonSource?.subtitle && (
            <Typography component="p" sx={subSx}>
              {t(lessonSource.subtitle)}
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

      <Box sx={{ ...cellSx, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {lesson?.level && (
          <Typography component="p" sx={{ ...subSx, m: 0 }}>
            {lesson.level}
          </Typography>
        )}
        {lesson?.certified && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconCertificate
              sx={{ color: "var(--primary)", fontSize: 16 }}
              height={14}
              width={14}
            />
            <Typography component="span" sx={{ fontSize: "0.75rem", color: "var(--grey)" }}>
              {t("certified")}
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default function LessonsPage() {
  const { t } = useTranslation([NS_LESSONS, NS_DASHBOARD_MENU, NS_BUTTONS]);
  const { user } = useAuth();
  const isAuthorized = useMemo(
    () => user instanceof ClassUserTeacher,
    [user]
  );

  return (
    <TeacherPageWrapper
      isAuthorized={isAuthorized}
      titles={[{ name: t("lessons", { ns: NS_DASHBOARD_MENU }), url: "" }]}
      icon={<IconLessons width={22} height={22} />}
    >
      <Stack alignItems="flex-start" spacing={2} sx={{ width: "100%", minHeight: "100%" }}>
        <LessonsComponent />
      </Stack>
    </TeacherPageWrapper>
  );
}
