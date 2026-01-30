"use client";

import React, { useEffect, useMemo } from "react";
import { CircularProgress, List, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import Link from "next/link";

import { ClassLessonChapter } from "@/classes/lessons/ClassLessonChapter";
import { ClassLesson } from "@/classes/ClassLesson";
import { ClassUserDandela } from "@/classes/users/ClassUser";
import { useAuth } from "@/contexts/AuthProvider";
import { useLesson } from "@/contexts/LessonProvider";
import { useChapter } from "@/contexts/ChapterProvider";
import { NS_ADMIN_CHAPTERS, NS_BUTTONS, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import {
  PAGE_ADMIN_CHAPTERS,
  PAGE_ADMIN_CREATE_SUBCHAPTER,
  PAGE_ADMIN_ONE_CHAPTER,
  PAGE_ADMIN_ONE_SUBCHAPTER,
  PAGE_ADMIN_LESSONS,
  PAGE_ADMIN_ONE_LESSON,
} from "@/contexts/constants/constants_pages";
import { IconLessons } from "@/assets/icons/IconsComponent";

import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";

export default function SubchaptersListPage() {
  const params = useParams();
  const { uid: uidUser, uidLesson, uidChapter } = params;
  const { user } = useAuth();
  const { lesson, isLoading: isLoadingLesson, setUidLesson } = useLesson();
  const { chapter, subchapters, isLoading: isLoadingChapter, setUidChapter } = useChapter();
  const { t } = useTranslation([NS_ADMIN_CHAPTERS, NS_BUTTONS, NS_DASHBOARD_MENU, "common", ClassLesson.NS_COLLECTION, ClassLessonChapter.NS_COLLECTION]);

  const isAuthorized = useMemo(() => user instanceof ClassUserDandela, [user]);

  useEffect(() => {
    if (uidLesson && !isLoadingLesson) {
      setUidLesson(uidLesson);
    }
  }, [uidLesson, isLoadingLesson, setUidLesson]);

  useEffect(() => {
    if (uidChapter) {
      setUidChapter(uidChapter);
    }
  }, [uidChapter, setUidChapter]);

  const list = useMemo(() => {
    const arr = chapter?.subchapters ?? subchapters ?? [];
    return Array.isArray(arr) ? [...arr].sort((a, b) => (a.uid_intern ?? 0) - (b.uid_intern ?? 0)) : [];
  }, [chapter?.subchapters, subchapters]);

  const lessonTitle = lesson?.title ?? lesson?.translate?.title ?? "";
  const chapterTitle = chapter?.translate?.title ?? chapter?.title ?? "";
  const loading = Boolean(uidChapter && isLoadingChapter);

  if (loading) {
    return (
      <AdminPageWrapper
        titles={[
          { name: t("lessons", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uidUser) },
          { name: lessonTitle, url: PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson) },
          { name: t("chapters", { ns: ClassLessonChapter.NS_COLLECTION }), url: PAGE_ADMIN_CHAPTERS(uidUser, uidLesson) },
          { name: t("subchapters-button", { ns: NS_ADMIN_CHAPTERS }) },
        ]}
        isAuthorized={isAuthorized}
        icon={<IconLessons width={22} height={22} />}
      >
        <Stack alignItems="center" py={4}>
          <CircularProgress color="warning" />
        </Stack>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper
      titles={[
        { name: t("lessons", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uidUser) },
        { name: lessonTitle, url: PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson) },
        { name: t("chapters", { ns: ClassLessonChapter.NS_COLLECTION }), url: PAGE_ADMIN_CHAPTERS(uidUser, uidLesson) },
        ...(chapterTitle ? [{ name: chapterTitle, url: PAGE_ADMIN_ONE_CHAPTER(uidUser, uidLesson, uidChapter) }] : []),
        { name: t("subchapters-button", { ns: NS_ADMIN_CHAPTERS }) },
      ]}
      isAuthorized={isAuthorized}
      icon={<IconLessons width={22} height={22} />}
    >
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Link href={PAGE_ADMIN_ONE_CHAPTER(uidUser, uidLesson, uidChapter)} style={{ textDecoration: "none" }}>
            <ButtonCancel label={t("back", { ns: NS_BUTTONS })} isAdmin />
          </Link>
          <Link href={PAGE_ADMIN_CREATE_SUBCHAPTER(uidUser, uidLesson, uidChapter)} style={{ textDecoration: "none" }}>
            <ButtonConfirm label={t("create-subchapter", { ns: NS_BUTTONS })} isAdmin />
          </Link>
        </Stack>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "var(--font-color)" }}>
          {t("subchapters-button", { ns: NS_ADMIN_CHAPTERS })}
        </Typography>

        {list.length > 0 ? (
          <List
            disablePadding
            sx={{
              bgcolor: "var(--card-bg)",
              borderRadius: 1,
              border: "1px solid var(--card-border)",
            }}
          >
            {list.map((sub, idx) => {
              const title = sub?.translate?.title ?? sub?.title ?? "";
              const label = title ? `${sub?.uid_intern ?? idx + 1}. ${title}` : `${t("subchapter", { ns: "common" })} ${sub?.uid_intern ?? idx + 1}`;
              const href = PAGE_ADMIN_ONE_SUBCHAPTER(uidUser, uidLesson, uidChapter, sub?.uid_intern ?? idx + 1);
              return (
                <ListItemButton
                  key={sub?.uid_intern ?? idx}
                  component={Link}
                  href={href}
                  sx={{
                    borderBottom: "1px solid var(--card-border)",
                    "&:last-child": { borderBottom: 0 },
                  }}
                >
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ sx: { color: "var(--font-color)" } }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        ) : (
          <Typography variant="body2" sx={{ color: "var(--grey-light)" }}>
            {t("no-subchapters", { ns: NS_ADMIN_CHAPTERS })}
          </Typography>
        )}
      </Stack>
    </AdminPageWrapper>
  );
}
