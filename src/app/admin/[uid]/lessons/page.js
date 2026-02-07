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
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PAGE_ADMIN_LESSONS, PAGE_ADMIN_CREATE_LESSON, PAGE_ADMIN_ONE_LESSON, PAGE_ADMIN_UPDATE_ONE_LESSON, PAGE_ADMIN_UPDATE_ONE_LESSON_TEACHER } from "@/contexts/constants/constants_pages";
import { Icon } from "@iconify/react";
import { useLesson } from "@/contexts/LessonProvider";
import { LessonTeacherProvider, useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import { useUsers } from "@/contexts/UsersProvider";
import { useUserDevice } from "@/contexts/UserDeviceProvider";
import { ChapterProvider, useChapter } from "@/contexts/ChapterProvider";
import { ClassUserAdministrator } from "@/classes/users/ClassUser";
import { ClassLesson } from "@/classes/ClassLesson";
import { ClassLessonChapter } from "@/classes/lessons/ClassLessonChapter";
import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import FieldComponent from "@/components/elements/FieldComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { Box, Grid, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import Image from "next/image";

const GRID_COLUMNS = "minmax(0, 0.3fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.5fr) minmax(0, 0.3fr)";
const GRID_COLUMNS_TEACHER = "minmax(0, 0.3fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.5fr) minmax(0, 1fr)";

function LessonsComponent() {
  const router = useRouter();
  const params = useParams();
  const { uid: uidUser } = params;
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_LESSONS, ClassLessonChapter.NS_COLLECTION, NS_BUTTONS]);
  const { user } = useAuth();
  const { lessons } = useLesson();
  const [filter, setFilter] = useState({ search: "" });
  const [lessonsFilter, setLessonsFilter] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedLessons, setExpandedLessons] = useState(new Set());

  const toggleLesson = (lessonUid) => {
    setExpandedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonUid)) {
        newSet.delete(lessonUid);
        setSelectedLesson(null);
      } else {
        newSet.add(lessonUid);
        const lesson = lessons.find((l) => l.uid === lessonUid);
        if (lesson) {
          setSelectedLesson(lesson);
        }
      }
      return newSet;
    });
  };


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
            isAdmin={true}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
          <Link href={PAGE_ADMIN_CREATE_LESSON(uidUser)} style={{ textDecoration: "none" }}>
            <ButtonConfirm
              label={t("create-lesson", { ns: NS_LESSONS }) || t("create", { ns: NS_BUTTONS })}
              isAdmin={true}
              icon={<Icon icon="ph:plus-bold" width={18} />}
            />
          </Link>
        </Grid>
      </Grid>

      <Box sx={cardSx}>
        <Box sx={headerSx}>
          <span />
          <span>{t("lesson")}</span>
          <span>{t("title")}</span>
          <span>{t("certified_short")}</span>
          <span>{t("actions", { ns: NS_BUTTONS }) || "Actions"}</span>
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

          {lessonsFilter.map((lesson, i) => {
            const isExpanded = expandedLessons.has(lesson.uid);
            return (
              <Box
                key={lesson.uid}
                onClick={() => {
                  if (selectedLesson?.uid === lesson.uid) {
                    setSelectedLesson(null);
                    setExpandedLessons((prev) => {
                      const newSet = new Set(prev);
                      newSet.delete(lesson.uid);
                      return newSet;
                    });
                  } else {
                    setSelectedLesson(lesson);
                    setExpandedLessons((prev) => {
                      const newSet = new Set(prev);
                      newSet.add(lesson.uid);
                      return newSet;
                    });
                  }
                }}
                sx={{ 
                  cursor: "pointer",
                  bgcolor: selectedLesson?.uid === lesson.uid ? "rgba(255, 152, 0, 0.1)" : "transparent",
                  transition: "background 0.2s ease",
                }}
              >
                <ChapterProvider uidLesson={lesson.uid}>
                  <LessonRow
                    lesson={lesson}
                    lastChild={i === lessonsFilter.length - 1}
                    isSelected={selectedLesson?.uid === lesson.uid}
                    isExpanded={isExpanded}
                    editUrl={`${PAGE_ADMIN_ONE_LESSON(uidUser, lesson.uid)}`}
                    onToggleExpand={(e) => {
                      e.stopPropagation();
                      toggleLesson(lesson.uid);
                    }}
                  />
                </ChapterProvider>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {selectedLesson && (
        <LessonTeacherProvider uidSourceLesson={selectedLesson.uid}>
          <LessonsTeacherComponent selectedLesson={selectedLesson} />
        </LessonTeacherProvider>
      )}

    </Box>
  );
}

function LessonRow({ lesson = null, lastChild = false, isSelected = false, isExpanded = false, editUrl = null, onToggleExpand = null }) {
  const { t } = useTranslation([
    ClassLesson.NS_COLLECTION,
    ClassLessonChapter.NS_COLLECTION,
    NS_LESSONS,
    NS_BUTTONS,
  ]);
  const { getOneLesson } = useLesson();
  const { isMobile } = useUserDevice();

  const lessonSource = useMemo(() => {
    if (!lesson) return null;
    return getOneLesson(lesson.uid);
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
    bgcolor: isSelected ? "rgba(255, 152, 0, 0.05)" : "transparent",
    "&:hover": {
      bgcolor: isSelected ? "rgba(255, 152, 0, 0.1)" : "rgba(0,0,0,0.03)",
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
            {lessonSource?.title || lesson?.title}
          </Typography>
          {(lessonSource?.subtitle || lesson?.subtitle) && (
            <Typography component="p" sx={subSx}>
              {t(lessonSource?.subtitle || lesson?.subtitle)}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={cellSx}>
        <Box>
          <Typography component="p" sx={nameSx}>
            {lesson?.translate?.title || lesson?.title}
          </Typography>
          {lesson?.translate?.subtitle && (
            <Typography component="p" sx={subSx}>
              {t(lesson.translate.subtitle)}
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
              sx={{ color: "var(--warning)", fontSize: 16 }}
              height={14}
              width={14}
            />
            <Typography component="span" sx={{ fontSize: "0.75rem", color: "var(--grey)" }}>
              {t("certified")}
            </Typography>
          </Stack>
        )}
      </Box>

      <Box sx={{ ...cellSx, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        {onToggleExpand && (
          <Tooltip title={isExpanded ? (t("see-less", { ns: NS_BUTTONS }) || "Voir moins") : (t("see-more", { ns: NS_BUTTONS }) || "Voir plus")}>
            <IconButton
              onClick={onToggleExpand}
              size="small"
              sx={{
                color: "var(--warning)",
                "&:hover": {
                  bgcolor: "rgba(255, 152, 0, 0.1)",
                },
              }}
            >
              {isExpanded ? <ArrowDropUp /> : <ArrowDropDown />}
            </IconButton>
          </Tooltip>
        )}
        {editUrl && (
          <Link 
            href={editUrl}
            onClick={(e) => e.stopPropagation()}
            style={{ textDecoration: "none" }}
          >
            <ButtonConfirm
              label={t("edit", { ns: NS_BUTTONS }) || "Modifier"}
              isAdmin={true}
              size="small"
            />
          </Link>
        )}
      </Box>
    </Box>
  );
}

function LessonsTeacherComponent({ selectedLesson }) {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_LESSONS, ClassLessonChapter.NS_COLLECTION]);
  const { lessons: lessonsTeacher } = useLessonTeacher();
  const { getOneUser } = useUsers();
  const { isMobile } = useUserDevice();
  const router = useRouter();
  const params = useParams();
  const { uid } = params;

  const cardSx = {
    bgcolor: "var(--card-color)",
    color: "var(--font-color)",
    borderRadius: 2,
    border: "1px solid var(--card-border)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    overflow: "hidden",
    mt: 3,
  };

  const headerSx = {
    display: "grid",
    gridTemplateColumns: GRID_COLUMNS_TEACHER,
    gap: 1.5,
    px: 2,
    py: 1.5,
    bgcolor: "var(--warning)",
    color: "var(--font-reverse-color)",
    borderBottom: "1px solid var(--card-border)",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    "@media (max-width: 900px)": { display: "none" },
  };

  const rowSx = {
    display: "grid",
    gridTemplateColumns: GRID_COLUMNS_TEACHER,
    gap: 1.5,
    px: 2,
    py: 1.5,
    alignItems: "center",
    fontSize: "0.9rem",
    borderBottom: "1px solid var(--card-border)",
    transition: "background 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      bgcolor: "rgba(255, 152, 0, 0.05)",
    },
    "@media (max-width: 900px)": {
      gridTemplateColumns: "1fr",
      gap: 1,
      p: 2,
      borderRadius: 2,
      border: "1px solid var(--card-border)",
      mb: 1,
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

  if (!lessonsTeacher || lessonsTeacher.length === 0) {
    return (
      <Box sx={cardSx}>
        <Box sx={{ py: 4, px: 2, textAlign: "center", color: "var(--grey)", fontSize: "0.95rem" }}>
          {t("not-found", { ns: NS_LESSONS })}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={cardSx}>
      <Box sx={headerSx}>
        <span />
        <span>{t("lesson")}</span>
        <span>{t("title")}</span>
        <span>{t("teacher", { ns: NS_DASHBOARD_MENU })}</span>
        <span>{t("certified_short")}</span>
      </Box>

      <Stack component="div" sx={{ flexDirection: "column" }}>
        {lessonsTeacher.map((lessonTeacher, i) => {
          const teacher = getOneUser(lessonTeacher.uid_teacher);
          return (
            <Box
              key={lessonTeacher.uid}
              onClick={() =>
                router.push(
                  PAGE_ADMIN_UPDATE_ONE_LESSON_TEACHER(uid, selectedLesson?.uid, lessonTeacher.uid)
                )
              }
              sx={rowSx}
            >
              <Box sx={cellSx}>
                {lessonTeacher?.translate?.photo_url && (
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
                      src={lessonTeacher.translate.photo_url}
                      alt={`lesson-teacher-${lessonTeacher.uid}`}
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
                    {selectedLesson?.title || selectedLesson?.translate?.title}
                  </Typography>
                  {selectedLesson?.subtitle && (
                    <Typography component="p" sx={subSx}>
                      {t(selectedLesson.subtitle)}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={cellSx}>
                <Box>
                  <Typography component="p" sx={nameSx}>
                    {lessonTeacher?.title || lessonTeacher?.translate?.title}
                  </Typography>
                  {lessonTeacher?.subtitle && (
                    <Typography component="p" sx={subSx}>
                      {t(lessonTeacher.subtitle)}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={cellSx}>
                <Box>
                  <Typography component="p" sx={nameSx}>
                    {teacher?.name || teacher?.email || "-"}
                  </Typography>
                  {teacher?.email && (
                    <Typography component="p" sx={subSx}>
                      {teacher.email}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ ...cellSx, display: "flex", flexDirection: "column", gap: 0.5 }}>
                {lessonTeacher?.level && (
                  <Typography component="p" sx={{ ...subSx, m: 0 }}>
                    {lessonTeacher.level}
                  </Typography>
                )}
                {lessonTeacher?.certified && (
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconCertificate
                      sx={{ color: "var(--warning)", fontSize: 16 }}
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
        })}
      </Stack>
    </Box>
  );
}

export default function AdminLessonsListPage() {
  const { t } = useTranslation([NS_LESSONS, NS_DASHBOARD_MENU, NS_BUTTONS]);
  const params = useParams();
  const { uid } = params;
  const { user } = useAuth();
  const isAuthorized = useMemo(
    () => user instanceof ClassUserAdministrator,
    [user]
  );

  return (
    <AdminPageWrapper
      isAuthorized={isAuthorized}
      titles={[{ name: t("lessons", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uid) }]}
      icon={<IconLessons width={22} height={22} />}
    >
      <Stack alignItems="flex-start" spacing={2} sx={{ width: "100%", minHeight: "100%" }}>
        <LessonsComponent />
      </Stack>
    </AdminPageWrapper>
  );
}
