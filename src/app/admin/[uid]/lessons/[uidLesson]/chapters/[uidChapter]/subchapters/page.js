"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Slide,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
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

import { IconArrowDown, IconArrowUp, IconLessons } from "@/assets/icons/IconsComponent";
import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function SubchaptersListPage() {
  const params = useParams();
  const { uid: uidUser, uidLesson, uidChapter } = params;
  const { user } = useAuth();
  const { lesson, isLoading: isLoadingLesson, setUidLesson } = useLesson();
  const { chapter, subchapters, isLoading: isLoadingChapter, setUidChapter } = useChapter();
  const { t } = useTranslation([NS_ADMIN_CHAPTERS, NS_BUTTONS, NS_DASHBOARD_MENU, "common", ClassLesson.NS_COLLECTION, ClassLessonChapter.NS_COLLECTION]);

  const isAuthorized = useMemo(() => user instanceof ClassUserDandela, [user]);

  const initialList = useMemo(() => {
    const arr = chapter?.subchapters ?? subchapters ?? [];
    return Array.isArray(arr) ? [...arr].sort((a, b) => (a.uid_intern ?? 0) - (b.uid_intern ?? 0)) : [];
  }, [chapter?.subchapters, subchapters]);

  const [orderedList, setOrderedList] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    setOrderedList([...initialList]);
  }, [initialList]);

  const hasOrderChanged = useMemo(() => {
    if (orderedList.length !== initialList.length) return false;
    const orderedIds = orderedList.map((s) => String(s?.uid_intern ?? ""));
    const initialIds = initialList.map((s) => String(s?.uid_intern ?? ""));
    return JSON.stringify(orderedIds) !== JSON.stringify(initialIds);
  }, [orderedList, initialList]);

  const onMoveUp = (index) => {
    if (index <= 0) return;
    setOrderedList((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const onMoveDown = (index) => {
    if (index >= orderedList.length - 1) return;
    setOrderedList((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleSaveOrder = async () => {
    if (!chapter || !uidLesson || !uidChapter) return;
    setProcessing(true);
    try {
      const chapterClone = chapter.clone();
      const updatedSubchapters = orderedList.map((sub, i) => {
        const next = sub?.clone ? sub.clone() : { ...sub };
        if (next.update) {
          next.update({ uid_intern: i + 1 });
        } else {
          next.uid_intern = i + 1;
        }
        return next;
      });
      chapterClone.subchapters = updatedSubchapters;
      const updated = await chapterClone.updateFirestore({ subchapters: updatedSubchapters });
      if (updated) {
        setOrderedList([...updatedSubchapters].sort((a, b) => (a.uid_intern ?? 0) - (b.uid_intern ?? 0)));
        setSnackbar({ open: true, message: t("success-order-saved", { ns: NS_ADMIN_CHAPTERS }), severity: "success" });
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: t("error-update-subchapter", { ns: NS_ADMIN_CHAPTERS }), severity: "error" });
    } finally {
      setProcessing(false);
    }
  };

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

  const list = orderedList;

  const lessonTitle = lesson?.title ?? lesson?.translate?.title ?? "";
  const chapterTitle = chapter?.translate?.title ?? chapter?.title ?? "";
  const loading = Boolean(uidChapter && isLoadingChapter);

  if (loading) {
    return (
      <AdminPageWrapper
        titles={[
          { name: t("lessons", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uidUser) },
          { name: lessonTitle, url: PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson) },
          { name: t("chapters", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_CHAPTERS(uidUser, uidLesson) },
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
        { name: t("chapters", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_CHAPTERS(uidUser, uidLesson) },
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
          <ButtonConfirm
            label={t("save-order", { ns: NS_ADMIN_CHAPTERS })}
            isAdmin
            loading={processing}
            disabled={!hasOrderChanged || processing}
            onClick={handleSaveOrder}
          />
        </Stack>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "var(--font-color)" }}>
          {t("subchapters-button", { ns: NS_ADMIN_CHAPTERS })}
        </Typography>

        {list.length > 0 ? (
          <Stack spacing={1}>
            {list.map((sub, idx) => {
              const title = sub?.translate?.title ?? sub?.title ?? "";
              const label = title ? `${sub?.uid_intern ?? idx + 1}. ${title}` : `${t("subchapter", { ns: "common" })} ${sub?.uid_intern ?? idx + 1}`;
              const href = PAGE_ADMIN_ONE_SUBCHAPTER(uidUser, uidLesson, uidChapter, sub?.uid_intern ?? idx + 1);
              return (
                <Grid
                  key={`${sub?.uid_intern ?? idx}-${idx}`}
                  container
                  alignItems="center"
                  justifyContent="stretch"
                  direction="row"
                  spacing={1.5}
                  sx={{ width: "100%" }}
                >
                  <Grid size="auto">
                    <Box
                      onClick={() => idx > 0 && onMoveUp(idx)}
                      sx={{ cursor: idx > 0 ? "pointer" : "default", display: "flex" }}
                    >
                      <IconArrowUp color={idx > 0 ? "var(--warning)" : "var(--grey-light)"} width={20} height={20} />
                    </Box>
                    <Box
                      onClick={() => idx < list.length - 1 && onMoveDown(idx)}
                      sx={{ cursor: idx < list.length - 1 ? "pointer" : "default", display: "flex" }}
                    >
                      <IconArrowDown color={idx < list.length - 1 ? "var(--warning)" : "var(--grey-light)"} width={20} height={20} />
                    </Box>
                  </Grid>
                  <Grid size={{xs:12,md:6}}>
                    <Link href={href} style={{ textDecoration: "none", width: "100%" }}>
                      <Box
                        sx={{
                          border: "1px solid var(--card-border)",
                          width: "100%",
                          borderRadius: "10px",
                          py: 1.25,
                          px: 2,
                          minHeight: 44,
                          display: "flex",
                          alignItems: "center",
                          color: "var(--font-color)",
                          fontWeight: 500,
                          transition: "background 0.2s ease, border-color 0.2s ease",
                          "&:hover": {
                            background: "var(--warning-shadow-sm)",
                            borderColor: "var(--warning)",
                          },
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "inherit" }}>
                          {label}
                        </Typography>
                      </Box>
                    </Link>
                  </Grid>
                </Grid>
              );
            })}
          </Stack>
        ) : (
          <Typography variant="body2" sx={{ color: "var(--grey-light)" }}>
            {t("no-subchapters", { ns: NS_ADMIN_CHAPTERS })}
          </Typography>
        )}
      </Stack>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        slots={{ transition: SlideTransition }}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminPageWrapper>
  );
}
