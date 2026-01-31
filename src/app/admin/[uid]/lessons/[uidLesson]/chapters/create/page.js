"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, CircularProgress, Slide, Snackbar, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { ClassLessonChapter, ClassLessonChapterTranslation } from "@/classes/lessons/ClassLessonChapter";
import { ClassLesson } from "@/classes/ClassLesson";
import { ClassUserDandela } from "@/classes/users/ClassUser";
import { useAuth } from "@/contexts/AuthProvider";
import { useLesson } from "@/contexts/LessonProvider";
import { defaultLanguage } from "@/contexts/i18n/settings";
import { NS_ADMIN_CHAPTERS, NS_BUTTONS, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import {
  PAGE_ADMIN_CHAPTERS,
  PAGE_ADMIN_LESSONS,
  PAGE_ADMIN_ONE_LESSON,
} from "@/contexts/constants/constants_pages";
import { IconLessons } from "@/assets/icons/IconsComponent";

import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import DialogConfirmAction from "@/components/dashboard/elements/DialogConfirmAction";
import FieldComponent from "@/components/elements/FieldComponent";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import TextFieldComponent from "@/components/elements/TextFieldComponent";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function CreateChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { uid: uidUser, uidLesson } = params;
  const { user } = useAuth();
  const { lesson, isLoading: isLoadingLesson, setUidLesson } = useLesson();
  const { t } = useTranslation([NS_ADMIN_CHAPTERS, NS_BUTTONS, NS_DASHBOARD_MENU, ClassLesson.NS_COLLECTION, ClassLessonChapter.NS_COLLECTION]);

  const [chapter, setChapter] = useState(null);
  const [goals, setGoals] = useState([""]);
  const [newGoal, setNewGoal] = useState("");
  const [processing, setProcessing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [errors, setErrors] = useState({});

  const isAuthorized = useMemo(() => user instanceof ClassUserDandela, [user]);

  useEffect(() => {
    if (uidLesson && !isLoadingLesson) {
      setUidLesson(uidLesson);
    }
  }, [uidLesson, isLoadingLesson, setUidLesson]);

  useEffect(() => {
    if (!chapter && uidLesson) {
      setChapter(
        new ClassLessonChapter({
          uid_lesson: uidLesson,
          level: ClassLessonChapter.LEVEL.EXPERT,
          title: "",
          subtitle: "",
          description: "",
          subchapters_title: "",
          estimated_start_duration: 0,
          estimated_end_duration: 0,
          photo_url: "",
          goals: [""],
        })
      );
    }
  }, [uidLesson, chapter]);

  const validate = () => {
    const e = {};
    if (!chapter?.title?.trim()) e.title = "required";
    if (!chapter?.level) e.level = "required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddChapter = async () => {
    if (!chapter || !uidLesson) return;
    if (!validate()) {
      setSnackbar({ open: true, message: t("error-add", { ns: NS_ADMIN_CHAPTERS }), severity: "error" });
      return;
    }
    setProcessing(true);
    try {
      const goalsTrans = goals?.filter(Boolean) || [];
      chapter.update({ goals: goalsTrans });

      const transChapter = {
        title: chapter.title || "",
        subtitle: chapter.subtitle || "",
        description: chapter.description || "",
        subchapters_title: chapter.subchapters_title || "",
      };
      const qsChapter = encodeURIComponent(JSON.stringify(transChapter));
      const resChapter = await fetch(`/api/test?lang=${defaultLanguage}&translations=${qsChapter}`);
      if (!resChapter.ok) throw new Error("Translation API error");
      const resultChapter = await resChapter.json();
      const langsChapter = Object.keys(resultChapter);
      let translatesChapter = [];
      if (goalsTrans.length > 0) {
        const qsGoals = encodeURIComponent(JSON.stringify(goalsTrans));
        const resGoals = await fetch(`/api/test?lang=${defaultLanguage}&translations=${qsGoals}`);
        if (!resGoals.ok) throw new Error("Translation API error");
        const resultGoals = await resGoals.json();
        translatesChapter = langsChapter.map((lang) => {
          const ch = resultChapter[lang] || {};
          const g = resultGoals[lang] || goalsTrans;
          return new ClassLessonChapterTranslation({ ...ch, goals: Array.isArray(g) ? g : [g], lang });
        });
      } else {
        translatesChapter = langsChapter.map((lang) => {
          const ch = resultChapter[lang] || {};
          return new ClassLessonChapterTranslation({ ...ch, goals: [], lang });
        });
      }
      chapter.translates = translatesChapter;
      const created = await chapter.createFirestore();
      if (created) {
        setSnackbar({ open: true, message: t("success-added", { ns: NS_ADMIN_CHAPTERS }), severity: "success" });
        setConfirmOpen(false);
        router.push(PAGE_ADMIN_CHAPTERS(uidUser, uidLesson));
      } else {
        throw new Error("Create failed");
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: t("error-add", { ns: NS_ADMIN_CHAPTERS }), severity: "error" });
      setConfirmOpen(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  if (isLoadingLesson || !lesson) {
    return (
      <AdminPageWrapper titles={[{ name: t("lessons", { ns: NS_DASHBOARD_MENU }) }]} isAuthorized={isAuthorized} icon={<IconLessons width={22} height={22} />}>
        <Stack alignItems="center" py={4}>
          <CircularProgress color="warning" />
        </Stack>
      </AdminPageWrapper>
    );
  }

  const lessonTitle = lesson?.title || lesson?.translate?.title || lesson?.uid || "";

  return (
    <AdminPageWrapper
      titles={[
        { name: t("lessons", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uidUser) },
        { name: lessonTitle, url: PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson) },
        { name: t("create-title", { ns: NS_ADMIN_CHAPTERS }) },
      ]}
      isAuthorized={isAuthorized}
      icon={<IconLessons width={22} height={22} />}
    >
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 720 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Link href={PAGE_ADMIN_CHAPTERS(uidUser, uidLesson)} style={{ textDecoration: "none" }}>
            <ButtonCancel label={t("back", { ns: NS_BUTTONS })} isAdmin />
          </Link>
          <ButtonConfirm
            label={t("add-chapter", { ns: NS_ADMIN_CHAPTERS })}
            isAdmin
            loading={processing}
            disabled={!chapter?.title || processing}
            onClick={() => setConfirmOpen(true)}
          />
        </Stack>

        <Stack spacing={2} sx={{ p: 2, background: "var(--card-color)", borderRadius: 2, border: "1px solid var(--card-border)" }}>
          <Typography variant="h6" sx={{ color: "var(--font-color)", fontWeight: 600 }}>
            {t("create-title", { ns: NS_ADMIN_CHAPTERS })}
          </Typography>

          <TextFieldComponent
            label={t("title", { ns: ClassLesson.NS_COLLECTION })}
            value={chapter?.title ?? ""}
            name="title"
            onChange={(e) => setChapter((p) => (p ? (p.update({ title: e.target.value }), p.clone()) : p))}
            error={errors.title}
            fullWidth
            isAdmin={true}
          />
          <TextFieldComponent
            label={t("subtitle", { ns: ClassLesson.NS_COLLECTION })}
            value={chapter?.subtitle ?? ""}
            name="subtitle"
            onChange={(e) => setChapter((p) => (p ? (p.update({ subtitle: e.target.value }), p.clone()) : p))}
            fullWidth
            isAdmin={true}
          />
          <FieldComponent
            label={t("description", { ns: ClassLesson.NS_COLLECTION })}
            value={chapter?.description ?? ""}
            name="description"
            type="multiline"
            onChange={(e) => setChapter((p) => (p ? (p.update({ description: e.target.value }), p.clone()) : p))}
            minRows={2}
            maxRows={6}
            fullWidth
            isAdmin={true}
          />
          <SelectComponentDark
            label={t("level", { ns: ClassLesson.NS_COLLECTION })}
            value={chapter?.level ?? ""}
            values={ClassLessonChapter.ALL_LEVELS.map((l) => ({ id: l, value: t(l, { ns: ClassLessonChapter.NS_COLLECTION }) }))}
            onChange={(e) => setChapter((p) => (p ? (p.update({ level: e.target.value }), p.clone()) : p))}
            hasNull={false}
          />
          <TextFieldComponent
            label={t("subchapters_title", { ns: NS_ADMIN_CHAPTERS })}
            value={chapter?.subchapters_title ?? ""}
            name="subchapters_title"
            onChange={(e) => setChapter((p) => (p ? (p.update({ subchapters_title: e.target.value }), p.clone()) : p))}
            fullWidth
            isAdmin={true}
          />
          <TextFieldComponent
            label={t("duration-start", { ns: NS_ADMIN_CHAPTERS })}
            value={chapter?.estimated_start_duration != null ? `${chapter.estimated_start_duration}` : ""}
            name="estimated_start_duration"
            type="number"
            onChange={(e) => setChapter((p) => (p ? (p.update({ estimated_start_duration: Number(e.target.value) || 0 }), p.clone()) : p))}
            fullWidth
            isAdmin={true}
          />
          <TextFieldComponent
            label={t("duration-end", { ns: NS_ADMIN_CHAPTERS })}
            value={chapter?.estimated_end_duration != null ? `${chapter.estimated_end_duration}` : ""}
            name="estimated_end_duration"
            type="number"
            onChange={(e) => setChapter((p) => (p ? (p.update({ estimated_end_duration: Number(e.target.value) || 0 }), p.clone()) : p))}
            fullWidth
            isAdmin={true}
          />

          <Typography variant="subtitle2" sx={{ color: "var(--font-color)", fontWeight: 600 }}>
            {t("goals", { ns: ClassLesson.NS_COLLECTION })}
          </Typography>
          {goals.map((goal, i) => (
            <FieldComponent
              key={`goal-${i}`}
              label={`${t("goal n°", { ns: ClassLessonChapter.NS_COLLECTION })} ${i + 1}`}
              value={goal}
              name={`goal_${i}`}
              type="multiline"
              onChange={(e) => {
                const v = e.target.value;
                setGoals((prev) => {
                  const next = [...prev];
                  next[i] = v;
                  return next;
                });
                setChapter((p) => {
                  if (!p) return p;
                  const g = [...(p.goals || [])];
                  g[i] = v;
                  p.update({ goals: g });
                  return p.clone();
                });
              }}
              onClear={() => {
                setGoals((prev) => prev.filter((_, idx) => idx !== i));
                setChapter((p) => {
                  if (!p) return p;
                  const g = (p.goals || []).filter((_, idx) => idx !== i);
                  p.update({ goals: g });
                  return p.clone();
                });
              }}
              removable
              onRemove={() => {
                setGoals((prev) => prev.filter((_, idx) => idx !== i));
                setChapter((p) => {
                  if (!p) return p;
                  const g = (p.goals || []).filter((_, idx) => idx !== i);
                  p.update({ goals: g });
                  return p.clone();
                });
              }}
              minRows={1}
              maxRows={4}
              fullWidth
              isAdmin={true}
            />
          ))}
          <FieldComponent
            label={t("new-goal", { ns: NS_ADMIN_CHAPTERS })}
            value={newGoal}
            name="new_goal"
            type="multiline"
            onChange={(e) => setNewGoal(e.target.value)}
            onClear={() => setNewGoal("")}
            editable
            onSubmit={() => {
              const v = newGoal.trim();
              if (!v) return;
              setGoals((prev) => [...prev, v]);
              setChapter((p) => (p ? (p.update({ goals: [...(p.goals || []), v] }), p.clone()) : p));
              setNewGoal("");
            }}
            minRows={2}
            maxRows={4}
            fullWidth
            isAdmin={true}
          />
        </Stack>
      </Stack>

      <DialogConfirmAction
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={t("confirm-add", { ns: NS_ADMIN_CHAPTERS })}
        labelConfirm={t("add-chapter", { ns: NS_ADMIN_CHAPTERS })}
        labelCancel={t("cancel", { ns: NS_BUTTONS })}
        severity="warning"
        actionCancel={() => setConfirmOpen(false)}
        actionConfirm={handleAddChapter}
      />

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        slots={{ transition: SlideTransition }}
      >
        <Alert variant="filled" severity={snackbar.severity} sx={{ width: "100%" }} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminPageWrapper>
  );
}
