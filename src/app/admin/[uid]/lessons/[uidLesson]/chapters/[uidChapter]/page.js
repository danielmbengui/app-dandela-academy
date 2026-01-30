"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, CircularProgress, Slide, Snackbar, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { ClassLessonChapter, ClassLessonChapterTranslation } from "@/classes/lessons/ClassLessonChapter";
import { defaultLanguage } from "@/contexts/i18n/settings";
import { ClassLesson } from "@/classes/ClassLesson";
import { ClassUserDandela } from "@/classes/users/ClassUser";
import { useAuth } from "@/contexts/AuthProvider";
import { useLesson } from "@/contexts/LessonProvider";
import { useChapter } from "@/contexts/ChapterProvider";
import { NS_ADMIN_CHAPTERS, NS_BUTTONS, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import {
  PAGE_ADMIN_CHAPTERS,
  PAGE_ADMIN_CHAPTER_SUBCHAPTERS,
  PAGE_ADMIN_LESSONS,
  PAGE_ADMIN_ONE_CHAPTER,
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

export default function EditChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { uid: uidUser, uidLesson, uidChapter } = params;
  const { user } = useAuth();
  const { lesson, isLoading: isLoadingLesson, setUidLesson } = useLesson();
  const { chapter, isLoading: isLoadingChapterContext, setUidChapter } = useChapter();
  const { t } = useTranslation([NS_ADMIN_CHAPTERS, NS_BUTTONS, NS_DASHBOARD_MENU, ClassLesson.NS_COLLECTION, ClassLessonChapter.NS_COLLECTION]);

  const [localChapter, setLocalChapter] = useState(null);
  const [goals, setGoals] = useState([""]);
  const [newGoal, setNewGoal] = useState("");
  const [initialSnapshot, setInitialSnapshot] = useState(null);
  const loadingChapter = Boolean(uidChapter && isLoadingChapterContext);
  const [processing, setProcessing] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [errors, setErrors] = useState({});

  const isAuthorized = useMemo(() => user instanceof ClassUserDandela, [user]);

  const getTranslatesSig = (translates) => {
    if (!translates?.length) return "[]";
    const arr = translates.map((t) => t.toJSON?.() || t).sort((a, b) => (a.lang || "").localeCompare(b.lang || ""));
    return JSON.stringify(arr);
  };

  const hasChanges = useMemo(() => {
    if (!localChapter || !initialSnapshot) return false;
    const goalsNorm = goals?.filter(Boolean) ?? [];
    const initialGoalsNorm = initialSnapshot.goals?.filter(Boolean) ?? [];
    if (goalsNorm.length !== initialGoalsNorm.length) return true;
    if (goalsNorm.some((g, i) => g !== initialGoalsNorm[i])) return true;
    if ((localChapter.title ?? "") !== (initialSnapshot.title ?? "")) return true;
    if ((localChapter.subtitle ?? "") !== (initialSnapshot.subtitle ?? "")) return true;
    if ((localChapter.description ?? "") !== (initialSnapshot.description ?? "")) return true;
    if ((localChapter.level ?? "") !== (initialSnapshot.level ?? "")) return true;
    if ((localChapter.subchapters_title ?? "") !== (initialSnapshot.subchapters_title ?? "")) return true;
    if ((localChapter.estimated_start_duration ?? 0) !== (initialSnapshot.estimated_start_duration ?? 0)) return true;
    if ((localChapter.estimated_end_duration ?? 0) !== (initialSnapshot.estimated_end_duration ?? 0)) return true;
    if (getTranslatesSig(localChapter.translates) !== initialSnapshot.translatesSig) return true;
    return false;
  }, [localChapter, goals, initialSnapshot]);

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

  // Initialiser le formulaire à partir du chapitre fourni par useChapter
  useEffect(() => {
    if (!uidChapter) {
      setLocalChapter(null);
      setGoals([""]);
      setInitialSnapshot(null);
      return;
    }
    if (chapter && chapter.uid === uidChapter) {
      const clone = chapter.clone();
      setLocalChapter(clone);
      const goalsInit = clone.goals?.length ? [...clone.goals] : [""];
      setGoals(goalsInit);
      setInitialSnapshot({
        title: clone.title ?? "",
        subtitle: clone.subtitle ?? "",
        description: clone.description ?? "",
        level: clone.level ?? "",
        subchapters_title: clone.subchapters_title ?? "",
        estimated_start_duration: clone.estimated_start_duration ?? 0,
        estimated_end_duration: clone.estimated_end_duration ?? 0,
        goals: goalsInit,
        translatesSig: getTranslatesSig(clone.translates),
      });
    } else {
      setLocalChapter(null);
      setInitialSnapshot(null);
    }
  }, [chapter, uidChapter]);

  const handleTranslate = async () => {
    if (!localChapter) return;
    setTranslating(true);
    setErrors({});
    try {
      const transChapter = {
        title: localChapter.title || "",
        subtitle: localChapter.subtitle || "",
        description: localChapter.description || "",
        subchapters_title: localChapter.subchapters_title || "",
      };
      const qsChapter = encodeURIComponent(JSON.stringify(transChapter));
      const resChapter = await fetch(`/api/test?lang=${defaultLanguage}&translations=${qsChapter}`);
      if (!resChapter.ok) throw new Error("Translation API error");
      const resultChapter = await resChapter.json();
      const langsChapter = Object.keys(resultChapter);

      const goalsTrans = goals?.filter(Boolean) || [];
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

      setLocalChapter((prev) => {
        if (!prev) return prev;
        const next = prev.clone();
        next.translates = translatesChapter;
        return next;
      });
      setInitialSnapshot((prev) => (prev ? { ...prev, translatesSig: getTranslatesSig(translatesChapter) } : prev));
      setSnackbar({ open: true, message: t("success-updated", { ns: NS_ADMIN_CHAPTERS }), severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: t("error-update", { ns: NS_ADMIN_CHAPTERS }), severity: "error" });
    } finally {
      setTranslating(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!localChapter?.title?.trim()) e.title = "required";
    if (!localChapter?.level) e.level = "required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveChapter = async () => {
    if (!localChapter || !uidLesson || !uidChapter) return;
    if (!validate()) {
      setSnackbar({ open: true, message: t("error-update", { ns: NS_ADMIN_CHAPTERS }), severity: "error" });
      return;
    }
    setProcessing(true);
    try {
      const goalsTrans = goals?.filter(Boolean) || [];
      localChapter.update({ goals: goalsTrans });

      const payload = {
        title: localChapter.title,
        subtitle: localChapter.subtitle,
        description: localChapter.description,
        level: localChapter.level,
        goals: goalsTrans,
        subchapters_title: localChapter.subchapters_title,
        estimated_start_duration: localChapter.estimated_start_duration ?? 0,
        estimated_end_duration: localChapter.estimated_end_duration ?? 0,
      };
      if (localChapter.translates?.length) {
        payload.translates = localChapter._convertTranslatesToFirestore(localChapter.translates);
      }
      const updated = await localChapter.updateFirestore(payload);
      if (updated) {
        const goalsTrans = goals?.filter(Boolean) || [];
        setInitialSnapshot({
          title: localChapter.title ?? "",
          subtitle: localChapter.subtitle ?? "",
          description: localChapter.description ?? "",
          level: localChapter.level ?? "",
          subchapters_title: localChapter.subchapters_title ?? "",
          estimated_start_duration: localChapter.estimated_start_duration ?? 0,
          estimated_end_duration: localChapter.estimated_end_duration ?? 0,
          goals: [...goalsTrans],
          translatesSig: getTranslatesSig(localChapter.translates),
        });
        setSnackbar({ open: true, message: t("success-updated", { ns: NS_ADMIN_CHAPTERS }), severity: "success" });
        setConfirmOpen(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: t("error-update", { ns: NS_ADMIN_CHAPTERS }), severity: "error" });
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

  if (uidChapter && loadingChapter) {
    return (
      <AdminPageWrapper
        titles={[
          { name: t("lessons", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uidUser) },
          { name: lessonTitle, url: PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson) },
          { name: t("chapters", { ns: ClassLessonChapter.NS_COLLECTION }), url: PAGE_ADMIN_CHAPTERS(uidUser, uidLesson) },
          { name: t("edit-title", { ns: NS_ADMIN_CHAPTERS }) },
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

  if (!localChapter) {
    return (
      <AdminPageWrapper
        titles={[
          { name: t("lessons", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uidUser) },
          { name: lessonTitle, url: PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson) },
          { name: t("chapters", { ns: ClassLessonChapter.NS_COLLECTION }), url: PAGE_ADMIN_CHAPTERS(uidUser, uidLesson) },
        ]}
        isAuthorized={isAuthorized}
        icon={<IconLessons width={22} height={22} />}
      >
        <Typography sx={{ color: "var(--font-color)" }}>{t("error-update", { ns: NS_ADMIN_CHAPTERS })}</Typography>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper
      titles={[
        { name: t("lessons", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uidUser) },
        { name: lessonTitle, url: PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson) },
        { name: t("chapters", { ns: ClassLessonChapter.NS_COLLECTION }), url: PAGE_ADMIN_CHAPTERS(uidUser, uidLesson) },
        { name: t("edit-title", { ns: NS_ADMIN_CHAPTERS }) },
      ]}
      isAuthorized={isAuthorized}
      icon={<IconLessons width={22} height={22} />}
    >
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 720 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Link href={PAGE_ADMIN_CHAPTERS(uidUser, uidLesson)} style={{ textDecoration: "none" }}>
            <ButtonCancel label={t("back", { ns: NS_BUTTONS })} isAdmin />
          </Link>
          <Link href={PAGE_ADMIN_CHAPTER_SUBCHAPTERS(uidUser, uidLesson, uidChapter)} style={{ textDecoration: "none" }}>
            <ButtonConfirm label={t("subchapters-button", { ns: NS_ADMIN_CHAPTERS })} isAdmin />
          </Link>
          <ButtonConfirm
            label={t("translate", { ns: NS_ADMIN_CHAPTERS })}
            isAdmin
            loading={translating}
            disabled={!localChapter?.title || translating || !hasChanges}
            onClick={handleTranslate}
          />
          <ButtonConfirm
            label={t("update-chapter", { ns: NS_ADMIN_CHAPTERS })}
            isAdmin
            loading={processing}
            disabled={!localChapter?.title || processing || !hasChanges}
            onClick={() => setConfirmOpen(true)}
          />
        </Stack>

        <Stack spacing={2} sx={{ p: 2, background: "var(--card-color)", borderRadius: 2, border: "1px solid var(--card-border)" }}>
          <Typography variant="h6" sx={{ color: "var(--font-color)", fontWeight: 600 }}>
            {t("edit-title", { ns: NS_ADMIN_CHAPTERS })}
          </Typography>

          <TextFieldComponent
            label={t("title", { ns: ClassLesson.NS_COLLECTION })}
            value={localChapter?.title ?? ""}
            name="title"
            onChange={(e) => setLocalChapter((p) => (p ? (p.update({ title: e.target.value }), p.clone()) : p))}
            error={errors.title}
            fullWidth
            isAdmin
          />
          <TextFieldComponent
            label={t("subtitle", { ns: ClassLesson.NS_COLLECTION })}
            value={localChapter?.subtitle ?? ""}
            name="subtitle"
            onChange={(e) => setLocalChapter((p) => (p ? (p.update({ subtitle: e.target.value }), p.clone()) : p))}
            fullWidth
            isAdmin
          />
          <FieldComponent
            label={t("description", { ns: ClassLesson.NS_COLLECTION })}
            value={localChapter?.description ?? ""}
            name="description"
            type="multiline"
            onChange={(e) => setLocalChapter((p) => (p ? (p.update({ description: e.target.value }), p.clone()) : p))}
            minRows={2}
            maxRows={6}
            fullWidth
          />
          <SelectComponentDark
            label={t("level", { ns: ClassLesson.NS_COLLECTION })}
            value={localChapter?.level ?? ""}
            values={ClassLessonChapter.ALL_LEVELS.map((l) => ({ id: l, value: t(l, { ns: ClassLessonChapter.NS_COLLECTION }) }))}
            onChange={(e) => setLocalChapter((p) => (p ? (p.update({ level: e.target.value }), p.clone()) : p))}
            hasNull={false}
          />
          <TextFieldComponent
            label={t("subchapters_title", { ns: NS_ADMIN_CHAPTERS })}
            value={localChapter?.subchapters_title ?? ""}
            name="subchapters_title"
            onChange={(e) => setLocalChapter((p) => (p ? (p.update({ subchapters_title: e.target.value }), p.clone()) : p))}
            fullWidth
            isAdmin
          />
          <TextFieldComponent
            label={t("duration-start", { ns: NS_ADMIN_CHAPTERS })}
            value={localChapter?.estimated_start_duration != null ? `${localChapter.estimated_start_duration}` : ""}
            name="estimated_start_duration"
            type="number"
            onChange={(e) => setLocalChapter((p) => (p ? (p.update({ estimated_start_duration: Number(e.target.value) || 0 }), p.clone()) : p))}
            fullWidth
            isAdmin
          />
          <TextFieldComponent
            label={t("duration-end", { ns: NS_ADMIN_CHAPTERS })}
            value={localChapter?.estimated_end_duration != null ? `${localChapter.estimated_end_duration}` : ""}
            name="estimated_end_duration"
            type="number"
            onChange={(e) => setLocalChapter((p) => (p ? (p.update({ estimated_end_duration: Number(e.target.value) || 0 }), p.clone()) : p))}
            fullWidth
            isAdmin
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
                setLocalChapter((p) => {
                  if (!p) return p;
                  const g = [...(p.goals || [])];
                  g[i] = v;
                  p.update({ goals: g });
                  return p.clone();
                });
              }}
              onClear={() => {
                setGoals((prev) => prev.filter((_, idx) => idx !== i));
                setLocalChapter((p) => {
                  if (!p) return p;
                  const g = (p.goals || []).filter((_, idx) => idx !== i);
                  p.update({ goals: g });
                  return p.clone();
                });
              }}
              removable
              onRemove={() => {
                setGoals((prev) => prev.filter((_, idx) => idx !== i));
                setLocalChapter((p) => {
                  if (!p) return p;
                  const g = (p.goals || []).filter((_, idx) => idx !== i);
                  p.update({ goals: g });
                  return p.clone();
                });
              }}
              minRows={1}
              maxRows={4}
              fullWidth
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
              setLocalChapter((p) => (p ? (p.update({ goals: [...(p.goals || []), v] }), p.clone()) : p));
              setNewGoal("");
            }}
            minRows={2}
            maxRows={4}
            fullWidth
          />
        </Stack>
      </Stack>

      <DialogConfirmAction
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={t("confirm-update", { ns: NS_ADMIN_CHAPTERS })}
        labelConfirm={t("update-chapter", { ns: NS_ADMIN_CHAPTERS })}
        labelCancel={t("cancel", { ns: NS_BUTTONS })}
        severity="warning"
        actionCancel={() => setConfirmOpen(false)}
        actionConfirm={handleSaveChapter}
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
