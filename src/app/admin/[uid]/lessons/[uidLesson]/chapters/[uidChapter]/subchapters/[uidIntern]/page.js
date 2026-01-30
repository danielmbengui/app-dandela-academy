"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Chip, CircularProgress, IconButton, Slide, Snackbar, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

import { ClassLessonChapter } from "@/classes/lessons/ClassLessonChapter";
import { ClassLessonSubchapter, ClassLessonSubchapterTranslation } from "@/classes/lessons/ClassLessonSubchapter";
import { ClassLesson } from "@/classes/ClassLesson";
import { ClassUserDandela } from "@/classes/users/ClassUser";
import { ClassFile } from "@/classes/ClassFile";
import { ClassLang } from "@/classes/ClassLang";
import { useAuth } from "@/contexts/AuthProvider";
import { useLesson } from "@/contexts/LessonProvider";
import { useChapter } from "@/contexts/ChapterProvider";
import { defaultLanguage, languages } from "@/contexts/i18n/settings";
import { NS_ADMIN_CHAPTERS, NS_BUTTONS, NS_DASHBOARD_MENU, NS_LANGS } from "@/contexts/i18n/settings";
import {
  PAGE_ADMIN_CHAPTERS,
  PAGE_ADMIN_CHAPTER_SUBCHAPTERS,
  PAGE_ADMIN_ONE_CHAPTER,
  PAGE_ADMIN_LESSONS,
  PAGE_ADMIN_ONE_LESSON,
} from "@/contexts/constants/constants_pages";
import { IconCamera, IconLessons, IconRemove } from "@/assets/icons/IconsComponent";

import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import DialogConfirmAction from "@/components/dashboard/elements/DialogConfirmAction";
import FieldComponent from "@/components/elements/FieldComponent";
import TextFieldComponent from "@/components/elements/TextFieldComponent";
import ButtonImportFiles from "@/components/elements/ButtonImportFiles";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function ImageComponent({ src = null, uid = "" }) {
  if (!src) return null;
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "var(--grey-hyper-light)",
      }}
    >
      <Image
        src={src}
        alt={`image-subchapter-${uid}`}
        quality={100}
        width={400}
        height={240}
        priority
        style={{
          width: "100%",
          height: "auto",
          maxHeight: 280,
          objectFit: "contain",
        }}
      />
    </Box>
  );
}

function DownloadPhotoComponent({ file = null, setFile = null }) {
  const { t } = useTranslation([NS_BUTTONS]);
  const imageRef = useRef(null);
  useEffect(() => {
    if (!file && imageRef.current) imageRef.current.value = "";
  }, [file]);
  const handleClickFile = () => imageRef.current?.click();
  const handleChangeFile = (e) => {
    const selected = [...(e.target.files || [])];
    const f = selected.length > 0 ? selected[0] : null;
    if (f && setFile) setFile(f);
  };
  const dropzoneSx = {
    width: "100%",
    border: "2px dashed var(--card-border)",
    borderRadius: 2,
    p: 4,
    minHeight: 200,
    textAlign: "center",
    transition: "border-color 0.2s, background 0.2s",
    "&:hover": {
      borderColor: "var(--warning)",
      bgcolor: "var(--warning-shadow-sm)",
      "& button": { borderColor: "var(--warning)", bgcolor: "rgba(255, 152, 0, 0.04)", color: "var(--warning)", fontWeight: 500 },
    },
  };
  return (
    <>
      <input
        ref={imageRef}
        type="file"
        multiple={false}
        accept={ClassFile.SUPPORTED_IMAGES_TYPES.map((type) => type.value)}
        onChange={handleChangeFile}
        style={{ display: "none" }}
      />
      <Stack spacing={1.5} alignItems="center">
        <Box sx={dropzoneSx} onClick={handleClickFile}>
          <Stack spacing={1.5} alignItems="center">
            {!file && (
              <>
                <Box sx={{ color: "var(--warning)", p: 1.5 }}>
                  <IconCamera width={40} height={40} />
                </Box>
                <ButtonCancel
                  label={t("choose-photo")}
                  icon={<Icon icon="material-symbols:upload" width={20} height={20} />}
                  isAdmin={true}
                  sx={{ border: "1px solid var(--card-border)", color: "var(--font-color)", transition: "border-color 0.2s, background 0.2s" }}
                />
              </>
            )}
          </Stack>
        </Box>
      </Stack>
    </>
  );
}

function OnePhotoByLangComponent({ lang, photoUrl, photoFile, setPhotoUrl, setPhotoFile, processing = false }) {
  const { t } = useTranslation([NS_BUTTONS, NS_LANGS]);
  const langInfo = ClassLang.getOneLang(lang);
  const langFlag = langInfo?.flag_str ?? "";
  const langId = langInfo?.id ?? lang;

  const cardSx = {
    bgcolor: "var(--card-color)",
    border: "1px solid var(--card-border)",
    borderRadius: 2,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    p: 2.5,
    minHeight: 340,
    transition: "box-shadow 0.2s ease",
    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  };

  return (
    <Box sx={cardSx}>
      <Stack spacing={2} alignItems="stretch">
        <Chip
          label={`${langFlag} ${t(langId, { ns: NS_LANGS })}`}
          size="medium"
          sx={{
            alignSelf: "flex-start",
            fontWeight: 600,
            fontSize: "0.95rem",
            bgcolor: "transparent",
            color: "var(--font-color)",
            border: "0.1px solid var(--card-border)",
            "& .MuiChip-label": { px: 2, py: 0.75 },
          }}
        />

        {!photoFile && !photoUrl && (
          <DownloadPhotoComponent file={photoFile} setFile={setPhotoFile} />
        )}
        {!photoFile && photoUrl && (
          <Stack spacing={2}>
            <Box sx={{ borderRadius: 1, overflow: "hidden", border: "1px solid var(--card-border)" }}>
              <ImageComponent src={photoUrl} uid={`subchapter-photo-${lang}`} />
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <ButtonConfirm
                isAdmin={true}
                icon={<IconRemove width={12} height={12} />}
                disabled={processing}
                label={t("remove-photo", { ns: NS_BUTTONS })}
                size="small"
                sx={{ bgcolor: "var(--error)", "&:hover": { bgcolor: "var(--error-dark)" } }}
                onClick={() => setPhotoUrl("")}
              />
            </Stack>
            <ButtonImportFiles
              disabled={processing}
              files={[]}
              setFiles={(files) => setPhotoFile(files?.length ? files[0] : null)}
              supported_files={ClassFile.SUPPORTED_IMAGES_TYPES.map((type) => type.value)}
            />
          </Stack>
        )}
        {photoFile && (
          <Stack spacing={2}>
            <Box sx={{ borderRadius: 1, overflow: "hidden", border: "1px solid var(--card-border)" }}>
              <ImageComponent src={URL.createObjectURL(photoFile)} uid={`subchapter-photo-preview-${lang}`} />
            </Box>
            <Stack
              onClick={() => setPhotoFile(null)}
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
              sx={{ color: "var(--error)", cursor: "pointer" }}
            >
              <IconButton sx={{ background: "rgba(0,0,0,0.75)", cursor: "pointer" }}>
                <Icon color="red" icon="mdi:delete-outline" width={12} height={12} />
              </IconButton>
              <Typography>{ClassFile.formatFileName?.(photoFile.name) ?? photoFile.name}</Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

function getTranslatesSig(translates) {
  if (!translates?.length) return "[]";
  const arr = translates.map((t) => t.toJSON?.() || t).sort((a, b) => (a.lang || "").localeCompare(b.lang || ""));
  return JSON.stringify(arr);
}

export default function EditSubchapterPage() {
  const params = useParams();
  const { uid: uidUser, uidLesson, uidChapter, uidIntern } = params;
  const { user } = useAuth();
  const { lesson, isLoading: isLoadingLesson, setUidLesson } = useLesson();
  const { chapter, isLoading: isLoadingChapter, setUidChapter } = useChapter();
  const { t } = useTranslation([NS_ADMIN_CHAPTERS, NS_BUTTONS, NS_DASHBOARD_MENU, ClassLesson.NS_COLLECTION, ClassLessonChapter.NS_COLLECTION]);

  const [title, setTitle] = useState("");
  const [photoUrls, setPhotoUrls] = useState(() => languages.reduce((acc, l) => ({ ...acc, [l]: "" }), {}));
  const [photoFiles, setPhotoFiles] = useState(() => languages.reduce((acc, l) => ({ ...acc, [l]: null }), {}));
  const [goals, setGoals] = useState([""]);
  const [keys, setKeys] = useState([""]);
  const [exercises, setExercises] = useState([""]);
  const [newGoal, setNewGoal] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newExercise, setNewExercise] = useState("");
  const [translates, setTranslates] = useState([]);
  const [initialSnapshot, setInitialSnapshot] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [errors, setErrors] = useState({});

  const isAuthorized = useMemo(() => user instanceof ClassUserDandela, [user]);

  const subchapter = useMemo(() => {
    const arr = chapter?.subchapters ?? [];
    console.log("fiiiiind array", arr.find((s) => String(s?.uid_intern) === String(uidIntern)) ?? null)
    return arr.find((s) => String(s?.uid_intern) === String(uidIntern)) ?? null;
  }, [chapter?.subchapters, uidIntern]);

  const hasChanges = useMemo(() => {
    if (!initialSnapshot) return false;
    const goalsNorm = goals?.filter(Boolean) ?? [];
    const initGoals = initialSnapshot.goals ?? [];
    if (goalsNorm.length !== initGoals.length) return true;
    if (goalsNorm.some((g, i) => g !== initGoals[i])) return true;
    const keysNorm = keys?.filter(Boolean) ?? [];
    const initKeys = initialSnapshot.keys ?? [];
    if (keysNorm.length !== initKeys.length) return true;
    if (keysNorm.some((k, i) => k !== initKeys[i])) return true;
    const exNorm = exercises?.filter(Boolean) ?? [];
    const initEx = initialSnapshot.exercises ?? [];
    if (exNorm.length !== initEx.length) return true;
    if (exNorm.some((e, i) => e !== initEx[i])) return true;
    if ((title ?? "").trim() !== (initialSnapshot.title ?? "").trim()) return true;
    if (translates?.length && getTranslatesSig(translates) !== initialSnapshot.translatesSig) return true;
    for (const lang of languages) {
      if ((photoUrls[lang] ?? "") !== (initialSnapshot.photoUrls?.[lang] ?? "")) return true;
      if (photoFiles[lang]) return true;
    }
    return false;
  }, [title, goals, keys, exercises, translates, photoUrls, photoFiles, initialSnapshot]);

  useEffect(() => {
    if (uidLesson && !isLoadingLesson) setUidLesson(uidLesson);
  }, [uidLesson, isLoadingLesson, setUidLesson]);

  useEffect(() => {
    if (uidChapter) setUidChapter(uidChapter);
  }, [uidChapter, setUidChapter]);

  useEffect(() => {
    if (!subchapter) return;
    setTitle(subchapter.title ?? "");
    const g = subchapter.goals?.length ? [...subchapter.goals] : [""];
    setGoals(g);
    const k = subchapter.keys?.length ? [...subchapter.keys] : [""];
    setKeys(k);
    const e = subchapter.exercises?.length ? [...subchapter.exercises] : [""];
    setExercises(e);
    const urls = languages.reduce((acc, l) => {
      const tr = subchapter.translates?.find((x) => x.lang === l);
      acc[l] = (tr?.photo_url ?? subchapter.photo_url ?? "").trim();
      return acc;
    }, {});
    setPhotoUrls(urls);
    setPhotoFiles(languages.reduce((acc, l) => ({ ...acc, [l]: null }), {}));
    setTranslates(subchapter.translates ?? []);
    setInitialSnapshot({
      title: subchapter.title ?? "",
      goals: g,
      keys: k,
      exercises: e,
      translatesSig: getTranslatesSig(subchapter.translates),
      photoUrls: urls,
    });
  }, [subchapter]);

  const handleTranslate = async () => {
    setTranslating(true);
    setErrors({});
    try {
      const payload = {
        title: title || "",
        goals: goals?.filter(Boolean) || [],
        keys: keys?.filter(Boolean) || [],
        exercises: exercises?.filter(Boolean) || [],
      };
      const qs = encodeURIComponent(JSON.stringify(payload));
      const res = await fetch(`/api/test?lang=${defaultLanguage}&translations=${qs}`);
      if (!res.ok) throw new Error("Translation API error");
      const result = await res.json();
      const langs = Object.keys(result);

      const translated = langs.map((lang) => {
        const data = result[lang] || {};
        return new ClassLessonSubchapterTranslation({
          lang,
          title: typeof data.title === "string" ? data.title : title || "",
          goals: Array.isArray(data.goals) ? data.goals : (data.goals ? [data.goals] : goals?.filter(Boolean) || []),
          keys: Array.isArray(data.keys) ? data.keys : (data.keys ? [data.keys] : keys?.filter(Boolean) || []),
          exercises: Array.isArray(data.exercises) ? data.exercises : (data.exercises ? [data.exercises] : exercises?.filter(Boolean) || []),
          photo_url: data.photo_url ?? photoUrls[lang] ?? "",
        });
      });
      setTranslates(translated);
      setInitialSnapshot((prev) => (prev ? { ...prev, translatesSig: getTranslatesSig(translated) } : prev));
      setSnackbar({ open: true, message: t("success-translated", { ns: NS_ADMIN_CHAPTERS }), severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: t("error-update-subchapter", { ns: NS_ADMIN_CHAPTERS }), severity: "error" });
    } finally {
      setTranslating(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!title?.trim()) e.title = "required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdateSubchapter = async () => {
    if (!chapter || !uidChapter || !uidLesson || !subchapter) return;
    if (!validate()) {
      setSnackbar({ open: true, message: t("error-update-subchapter", { ns: NS_ADMIN_CHAPTERS }), severity: "error" });
      return;
    }
    setProcessing(true);
    try {
      const goalsFiltered = goals?.filter(Boolean) || [];
      const keysFiltered = keys?.filter(Boolean) || [];
      const exercisesFiltered = exercises?.filter(Boolean) || [];

      let finalTranslates = translates;
      if (finalTranslates.length === 0 && (goalsFiltered.length || keysFiltered.length || exercisesFiltered.length || title)) {
        const payload = {
          title: title || "",
          goals: goalsFiltered,
          keys: keysFiltered,
          exercises: exercisesFiltered,
        };
        const qs = encodeURIComponent(JSON.stringify(payload));
        const res = await fetch(`/api/test?lang=${defaultLanguage}&translations=${qs}`);
        if (res.ok) {
          const result = await res.json();
          const langs = Object.keys(result);
          finalTranslates = langs.map((lang) => {
            const data = result[lang] || {};
            const tr = subchapter.translates?.find((x) => x.lang === lang);
            return new ClassLessonSubchapterTranslation({
              lang,
              title: typeof data.title === "string" ? data.title : (tr?.title ?? title ?? ""),
              goals: Array.isArray(data.goals) ? data.goals : (tr?.goals ?? []),
              keys: Array.isArray(data.keys) ? data.keys : (tr?.keys ?? []),
              exercises: Array.isArray(data.exercises) ? data.exercises : (tr?.exercises ?? []),
              photo_url: data.photo_url ?? photoUrls[lang] ?? tr?.photo_url ?? "",
            });
          });
        } else {
          finalTranslates = subchapter.translates ?? [];
        }
      }
      if (finalTranslates.length === 0) {
        finalTranslates = (subchapter.translates ?? []).map((tr) => {
          const trJson = tr.toJSON?.() ?? tr;
          return new ClassLessonSubchapterTranslation(trJson);
        });
      }

      const photoUrlByLang = {};
      for (const lang of languages) {
        const file = photoFiles[lang];
        if (file) {
          const filename = file.name;
          const extension = filename.split(".").pop()?.toLowerCase() || "jpg";
          const path = `${ClassLessonChapter.COLLECTION}/${uidChapter}/subchapters/photo-${lang}-${Date.now()}.${extension}`;
          const resultFile = await ClassFile.uploadFileToFirebase({ file, path });
          const newFile = new ClassFile({
            id: "",
            uri: resultFile?.uri || "",
            path: resultFile?.path,
            name: resultFile?.name,
            type: resultFile?.type,
            size: resultFile?.size,
            tag: "subchapter",
          }).toJSON();
          photoUrlByLang[lang] = newFile?.uri || "";
        } else {
          photoUrlByLang[lang] = (photoUrls[lang] ?? "").trim() || "";
        }
      }

      const finalTranslatesWithPhotos = finalTranslates.map((tr) => {
        const url = photoUrlByLang[tr.lang] ?? "";
        return new ClassLessonSubchapterTranslation({ ...tr.toJSON(), photo_url: url });
      });

      const defaultPhotoUrl = photoUrlByLang[defaultLanguage] || Object.values(photoUrlByLang).find(Boolean) || "";

      const updatedSubchapter = new ClassLessonSubchapter({
        uid_intern: subchapter.uid_intern,
        uid_chapter: uidChapter,
        chapter: null,
        title: title.trim(),
        photo_url: defaultPhotoUrl,
        goals: goalsFiltered,
        keys: keysFiltered,
        exercises: exercisesFiltered,
        translate: {},
        translates: finalTranslatesWithPhotos,
      });

      const chapterClone = chapter.clone();
      const arr = [...(chapterClone.subchapters || [])];
      const idx = arr.findIndex((s) => String(s?.uid_intern) === String(uidIntern));
      if (idx >= 0) arr[idx] = updatedSubchapter;
      else arr.push(updatedSubchapter);
      chapterClone.subchapters = arr;

      const updated = await chapterClone.updateFirestore({ subchapters: arr });
      if (updated) {
        setSnackbar({ open: true, message: t("success-update-subchapter", { ns: NS_ADMIN_CHAPTERS }), severity: "success" });
        setConfirmOpen(false);
        setInitialSnapshot({
          title: title.trim(),
          goals: goalsFiltered,
          keys: keysFiltered,
          exercises: exercisesFiltered,
          translatesSig: getTranslatesSig(finalTranslatesWithPhotos),
          photoUrls: photoUrlByLang,
        });
        setPhotoFiles(languages.reduce((acc, l) => ({ ...acc, [l]: null }), {}));
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: t("error-update-subchapter", { ns: NS_ADMIN_CHAPTERS }), severity: "error" });
      setConfirmOpen(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const lessonTitle = lesson?.title ?? lesson?.translate?.title ?? "";
  const chapterTitle = chapter?.translate?.title ?? chapter?.title ?? "";
  const loading = Boolean(uidChapter && isLoadingChapter);

  if (isLoadingLesson || !lesson) {
    return (
      <AdminPageWrapper titles={[{ name: t("lessons", { ns: NS_DASHBOARD_MENU }) }]} isAuthorized={isAuthorized} icon={<IconLessons width={22} height={22} />}>
        <Stack alignItems="center" py={4}>
          <CircularProgress color="warning" />
        </Stack>
      </AdminPageWrapper>
    );
  }

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

  if (!subchapter) {
    return (
      <AdminPageWrapper
        titles={[
          { name: t("lessons", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uidUser) },
          { name: lessonTitle, url: PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson) },
          { name: t("chapters", { ns: ClassLessonChapter.NS_COLLECTION }), url: PAGE_ADMIN_CHAPTERS(uidUser, uidLesson) },
          ...(chapterTitle ? [{ name: chapterTitle, url: PAGE_ADMIN_ONE_CHAPTER(uidUser, uidLesson, uidChapter) }] : []),
          { name: t("subchapters-button", { ns: NS_ADMIN_CHAPTERS }), url: PAGE_ADMIN_CHAPTER_SUBCHAPTERS(uidUser, uidLesson, uidChapter) },
        ]}
        isAuthorized={isAuthorized}
        icon={<IconLessons width={22} height={22} />}
      >
        <Stack spacing={2} sx={{ width: "100%", maxWidth: 720 }}>
          <Typography sx={{ color: "var(--font-color)" }}>{t("error-update-subchapter", { ns: NS_ADMIN_CHAPTERS })}</Typography>
          <Link href={PAGE_ADMIN_CHAPTER_SUBCHAPTERS(uidUser, uidLesson, uidChapter)} style={{ textDecoration: "none" }}>
            <ButtonCancel label={t("back", { ns: NS_BUTTONS })} isAdmin />
          </Link>
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
        { name: t("subchapters-button", { ns: NS_ADMIN_CHAPTERS }), url: PAGE_ADMIN_CHAPTER_SUBCHAPTERS(uidUser, uidLesson, uidChapter) },
        { name: t("edit-subchapter", { ns: NS_ADMIN_CHAPTERS }) },
      ]}
      isAuthorized={isAuthorized}
      icon={<IconLessons width={22} height={22} />}
    >
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 1024 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Link href={PAGE_ADMIN_CHAPTER_SUBCHAPTERS(uidUser, uidLesson, uidChapter)} style={{ textDecoration: "none" }}>
            <ButtonCancel label={t("back", { ns: NS_BUTTONS })} isAdmin />
          </Link>
          <ButtonConfirm
            label={t("translate", { ns: NS_ADMIN_CHAPTERS })}
            isAdmin
            loading={translating}
            disabled={!title?.trim() || translating}
            onClick={handleTranslate}
          />
          <ButtonConfirm
            label={t("update-subchapter", { ns: NS_ADMIN_CHAPTERS })}
            isAdmin
            loading={processing}
            disabled={!title?.trim() || processing || !hasChanges}
            onClick={() => setConfirmOpen(true)}
          />
        </Stack>

        <Stack spacing={2} sx={{ p: 2, background: "var(--card-color)", borderRadius: 2, border: "1px solid var(--card-border)" }}>
          <Typography variant="h6" sx={{ color: "var(--font-color)", fontWeight: 600 }}>
            {t("edit-subchapter", { ns: NS_ADMIN_CHAPTERS })}
          </Typography>

          <TextFieldComponent
            label={t("title", { ns: ClassLesson.NS_COLLECTION })}
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            fullWidth
            isAdmin
          />

          <Typography variant="subtitle2" sx={{ color: "var(--font-color)", fontWeight: 600 }}>
            {t("photo", { ns: NS_BUTTONS })}
          </Typography>
          <Stack
            spacing={2}
            direction={{ xs: "column", md: "row" }}
            sx={{ "& > *": { flex: 1, minWidth: 0 } }}
          >
            {languages.map((lang) => (
              <OnePhotoByLangComponent
                key={lang}
                lang={lang}
                photoUrl={photoUrls[lang] ?? ""}
                photoFile={photoFiles[lang] ?? null}
                setPhotoUrl={(url) => setPhotoUrls((prev) => ({ ...prev, [lang]: url }))}
                setPhotoFile={(file) => setPhotoFiles((prev) => ({ ...prev, [lang]: file }))}
                processing={processing}
              />
            ))}
          </Stack>

          <Typography variant="subtitle2" sx={{ color: "var(--font-color)", fontWeight: 600 }}>
            {t("goals", { ns: ClassLessonChapter.NS_COLLECTION })}
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
              }}
              removable
              onRemove={() => setGoals((prev) => prev.filter((_, idx) => idx !== i))}
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
              setNewGoal("");
            }}
            minRows={1}
            maxRows={4}
            fullWidth
          />

          <Typography variant="subtitle2" sx={{ color: "var(--font-color)", fontWeight: 600 }}>
            {t("keys", { ns: ClassLessonChapter.NS_COLLECTION })}
          </Typography>
          {keys.map((keyVal, i) => (
            <FieldComponent
              key={`key-${i}`}
              label={`${t("keys", { ns: ClassLessonChapter.NS_COLLECTION })} ${i + 1}`}
              value={keyVal}
              name={`key_${i}`}
              type="multiline"
              onChange={(e) => {
                const v = e.target.value;
                setKeys((prev) => {
                  const next = [...prev];
                  next[i] = v;
                  return next;
                });
              }}
              removable
              onRemove={() => setKeys((prev) => prev.filter((_, idx) => idx !== i))}
              minRows={1}
              maxRows={2}
              fullWidth
            />
          ))}
          <FieldComponent
            label={t("new-key", { ns: NS_ADMIN_CHAPTERS })}
            value={newKey}
            name="new_key"
            type="multiline"
            onChange={(e) => setNewKey(e.target.value)}
            onClear={() => setNewKey("")}
            editable
            onSubmit={() => {
              const v = newKey.trim();
              if (!v) return;
              setKeys((prev) => [...prev, v]);
              setNewKey("");
            }}
            minRows={1}
            maxRows={2}
            fullWidth
          />

          <Typography variant="subtitle2" sx={{ color: "var(--font-color)", fontWeight: 600 }}>
            {t("exercises", { ns: ClassLessonChapter.NS_COLLECTION })}
          </Typography>
          {exercises.map((ex, i) => (
            <FieldComponent
              key={`exercise-${i}`}
              label={`${t("exercises", { ns: ClassLessonChapter.NS_COLLECTION })} ${i + 1}`}
              value={ex}
              name={`exercise_${i}`}
              type="multiline"
              onChange={(e) => {
                const v = e.target.value;
                setExercises((prev) => {
                  const next = [...prev];
                  next[i] = v;
                  return next;
                });
              }}
              removable
              onRemove={() => setExercises((prev) => prev.filter((_, idx) => idx !== i))}
              minRows={2}
              maxRows={6}
              fullWidth
            />
          ))}
          <FieldComponent
            label={t("new-exercise", { ns: NS_ADMIN_CHAPTERS })}
            value={newExercise}
            name="new_exercise"
            type="multiline"
            onChange={(e) => setNewExercise(e.target.value)}
            onClear={() => setNewExercise("")}
            editable
            onSubmit={() => {
              const v = newExercise.trim();
              if (!v) return;
              setExercises((prev) => [...prev, v]);
              setNewExercise("");
            }}
            minRows={2}
            maxRows={6}
            fullWidth
          />
        </Stack>
      </Stack>

      <DialogConfirmAction
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={t("confirm-update-subchapter", { ns: NS_ADMIN_CHAPTERS })}
        labelConfirm={t("update-subchapter", { ns: NS_ADMIN_CHAPTERS })}
        labelCancel={t("cancel", { ns: NS_BUTTONS })}
        severity="warning"
        actionCancel={() => setConfirmOpen(false)}
        actionConfirm={handleUpdateSubchapter}
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
