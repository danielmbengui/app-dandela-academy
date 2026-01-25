import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconCamera } from "@/assets/icons/IconsComponent";
import { ClassLesson, ClassLessonTranslate } from "@/classes/ClassLesson";
import { languages, NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS, NS_LESSONS_ONE } from "@/contexts/i18n/settings";
import { Box, Chip, Container, Grid, Stack, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import { useLesson } from "@/contexts/LessonProvider";
import { useLanguage } from "@/contexts/LangProvider";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import Image from "next/image";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import FieldComponent from "@/components/elements/FieldComponent";
import ButtonImportFiles from "@/components/elements/ButtonImportFiles";
import { ClassFile } from "@/classes/ClassFile";
import { ClassLang } from "@/classes/ClassLang";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import AccordionComponent from "../dashboard/elements/AccordionComponent";
import ButtonCancel from "../dashboard/elements/ButtonCancel";

const makeId = () => (crypto?.randomUUID?.() ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

const CustomAccordion = ({ expanded = false, title = "", array_name = "" }) => {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS]);
  const { lesson } = useLessonTeacher();
  const [lessonEdit, setLessonEdit] = useState(null);
  const [array, setArray] = useState([]);
  const { lang } = useLanguage();
  const originalRef = useRef([]);
  const [newValue, setNewValue] = useState("");
  const [state, setState] = useState({ processing: false, text: "" });
  useEffect(() => {
    setLessonEdit(lesson?.clone());
    const initial = Array.isArray(lesson?.[array_name]) ? lesson[array_name] : [];
    originalRef.current = initial;
    setArray(initial.map((val) => ({ id: makeId(), value: val ?? "" })));
  }, [lesson, array_name]);

  const sameValues = useMemo(() => {
    const current = array.map((r) => r.value);
    const original = lessonEdit?.[array_name] || [];
    if (current.length !== original.length) return false;
    return current.every((c, i) => (c ?? "") === (original[i] ?? ""));
  }, [array, lessonEdit, array_name]);

  const onChangeValue = useCallback((e, index) => {
    const value = e?.target?.value ?? "";
    setArray((prev) =>
      prev.map((row, i) => (i === index ? { ...row, value } : row))
    );
    if (index < 0) setNewValue(value);
  }, []);

  const onClearValue = useCallback((index) => {
    setArray((prev) =>
      prev.map((row, i) => (i === index ? { ...row, value: "" } : row))
    );
    if (index < 0) setNewValue("");
  }, []);

  const onResetValue = useCallback((index) => {
    const original = originalRef.current || [];
    setArray((prev) =>
      prev.map((row, i) => (i === index ? { ...row, value: original[i] } : row))
    );
  }, []);

  const onDeleteValue = useCallback((index) => {
    const original = originalRef.current || [];
    const next = original.filter((_, i) => i !== index).map((val) => ({
      id: makeId(),
      value: val ?? "",
    }));
    originalRef.current = next.map((r) => r.value);
    setArray(next);
  }, []);

  const onAddValue = useCallback((value) => {
    const original = originalRef.current || [];
    const next = original.map((val) => ({ id: makeId(), value: val ?? "" }));
    next.push({ id: makeId(), value });
    originalRef.current = next.map((r) => r.value);
    setArray(next);
    setNewValue("");
  }, []);

  const onResetAllValues = useCallback(() => {
    const original = lessonEdit?.[array_name] || [];
    originalRef.current = original;
    setArray(original.map((val) => ({ id: makeId(), value: val ?? "" })));
    setNewValue("");
  }, [lessonEdit, array_name]);
  const onSubmit = async () => {
    try {
      setState((p) => ({ ...p, processing: true, text: "Traitement..." }));
      setState((p) => ({ ...p, text: "Traductions des valeurs..." }));
      const transChapter = { [array_name]: array.map((a) => a.value) };
      const qs = encodeURIComponent(JSON.stringify(transChapter));
      const res = await fetch(`/api/test?lang=${lang}&translations=${qs}`);
      const data = await res.json();
      const langs = Object.keys(data);
      const trs = Object.values(data)?.map?.((trans, i) =>
        new ClassLessonTranslate({ ...trans, lang: langs[i] })
      );
      const actual = lessonEdit?.translates ?? [];
      const newTrs = actual.map((trans) => {
        const t = trs?.find((x) => x.lang === trans.lang);
        return new ClassLessonTranslate({ ...trans.toJSON(), [array_name]: t?.[array_name] });
      });
      const tr = newTrs.find((x) => x.lang === lang);
      lessonEdit?.update({ translates: newTrs, translate: tr });
      setState((p) => ({ ...p, text: "Modification du cours..." }));
      const patched = await lessonEdit?.updateFirestore();
      setLessonEdit(patched);
    } catch (err) {
      setState((p) => ({ ...p, processing: false, text: "" }));
    } finally {
      setState((p) => ({ ...p, processing: false, text: "" }));
    }
  };

  const rowSx = {
    p: 1,
    borderRadius: 1,
    bgcolor: "transparent",
    transition: "background 0.2s",
    "&:hover": { bgcolor: "var(--grey-hyper-light)" },
  };

  return (
    <AccordionComponent isAdmin title={t(title)} expanded={expanded}>
      <Stack spacing={1} alignItems="stretch" sx={{ py: 1.5, px: 1 }}>
        {array?.map?.((item, i) => {
          const orig = originalRef.current || [];
          return (
            <Grid
              key={item.id}
              container
              alignItems="center"
              justifyContent="stretch"
              direction="row"
              spacing={1.5}
              sx={{ width: "100%", ...rowSx }}
            >
              <Grid size="auto">
                <Typography variant="body2" sx={{ color: "var(--grey)", fontWeight: 600, minWidth: 24 }}>
                  {i + 1}.
                </Typography>
              </Grid>
              <Grid size="grow">
                <FieldComponent
                  isAdmin
                  index={i}
                  disabled={state.processing}
                  type="multiline"
                  name={item.id}
                  value={item.value}
                  fullWidth
                  minRows={1}
                  maxRows={10}
                  onChange={(e) => onChangeValue(e, i)}
                  onClear={() => onClearValue(i)}
                  resetable={orig[i] !== item.value}
                  onCancel={() => onResetValue(i)}
                  removable={!state.processing}
                  onRemove={() => onDeleteValue(i)}
                />
              </Grid>
            </Grid>
          );
        })}
        <Grid
          container
          alignItems="center"
          justifyContent="stretch"
          direction="row"
          spacing={1.5}
          sx={{ width: "100%", ...rowSx }}
        >
          <Grid size="auto">
            <Typography variant="body2" sx={{ color: "var(--grey)", fontWeight: 600, minWidth: 24 }}>
              {array.length + 1}.
            </Typography>
          </Grid>
          <Grid size="grow">
            <FieldComponent
              isAdmin
              disabled={state.processing}
              type="multiline"
              name="create"
              value={newValue}
              fullWidth
              minRows={1}
              maxRows={10}
              onChange={(e) => onChangeValue(e, -1)}
              onClear={() => onClearValue(-1)}
              editable={newValue.length > 0}
              onSubmit={() => onAddValue(newValue)}
            />
          </Grid>
        </Grid>
      </Stack>
      {!sameValues && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1.5}
          sx={{ px: 1.5, py: 1, borderTop: "1px solid var(--card-border)" }}
        >
          <ButtonCancel
            isAdmin
            onClick={onResetAllValues}
            disabled={state.processing}
            label={t("reset", { ns: NS_BUTTONS })}
          />
          <ButtonConfirm
            isAdmin
            loading={state.processing}
            onClick={onSubmit}
            label={t("edit", { ns: NS_BUTTONS })}
          />
        </Stack>
      )}
    </AccordionComponent>
  );
}
function ImageComponent({ src = null, uid = '' }) {
  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'var(--grey-hyper-light)',
      }}
    >
      <Image
        src={src}
        alt={`image-lesson-${uid}`}
        quality={100}
        width={300}
        height={150}
        priority
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: 180,
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}
function InfosComponent() {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION]);
  const { lang } = useLanguage();
  const { lessons, getOneLesson } = useLesson();
  const { lesson: lessonTeacher } = useLessonTeacher();
  const [lessonEdit, setLessonEdit] = useState(null);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    processing: false,
    text: ""
  });

  useEffect(() => {
    setLessonEdit(lessonTeacher?.clone());
  }, [lessonTeacher]);
  const sameLessons = useMemo(() => {
    if (lessonTeacher?.category !== lessonEdit?.category) return false;
    if (lessonTeacher?.title !== lessonEdit?.title) return false;
    if (lessonTeacher?.subtitle !== lessonEdit?.subtitle) return false;
    if (lessonTeacher?.description !== lessonEdit?.description) return false;
    if (lessonTeacher?.certified !== lessonEdit?.certified) return false;
    if (files.length > 0 || lessonTeacher?.photo_url !== lessonEdit?.photo_url) return false;
    return true;
  }, [lessonTeacher, lessonEdit, files.length]);
  const disabledButton = useMemo(() => {
    if (sameLessons) return true;
    if (!lessonEdit?.category) return true;
    if (!lessonEdit?.title) return true;
    if (!lessonEdit?.description) return true;
    return false;
  }, [sameLessons, lessonEdit]);
  const mustTranslate = useMemo(() => {
    if (lessonTeacher?.title !== lessonEdit?.title) return true;
    if (lessonTeacher?.subtitle !== lessonEdit?.subtitle) return true;
    if (lessonTeacher?.description !== lessonEdit?.description) return true;
    return false;
  }, [lessonTeacher, lessonEdit]);

  const onChangeValue = (e) => {
    const { name, type, value, checked } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLessonEdit(prev => {
      if (!prev || prev === null) return lessonTeacher.clone();
      var newValue = type === 'checkbox' ? checked : value;
      prev.update({ [name]: newValue });
      return prev.clone();
    });

  }
  const onClearValue = (name) => {
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLessonEdit(prev => {
      if (!prev || prev === null) return lessonTeacher.clone();
      var newValue = '';
      prev.update({ [name]: newValue });
      return prev.clone();
    })
  }
  const onResetValue = (name) => {
    //const { name, type, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLessonEdit(prev => {
      if (!prev || prev === null) return lessonTeacher.clone();
      var lessonValue = lessonTeacher[name];
      prev.update({ [name]: lessonValue });
      //setSameDatas(true);
      //console.log("two lesson", lesson.translate, lessonEdit.translate)
      return prev.clone();
    })
  }
  const onSubmit = async () => {
    try {
      setState(prev => ({ ...prev, processing: true, text: "Traitement..." }));
      //const uidLesson = lessonEd?.createFirestoreDocUid();
      if (mustTranslate) {
        setState(prev => ({ ...prev, text: 'Traductions des valeurs...' }));
        const transChapter = {
          title: lessonEdit?.title,
          subtitle: lessonEdit?.subtitle,
          description: lessonEdit?.description,
        }
        const qsChapter = encodeURIComponent(JSON.stringify(transChapter));
        const fetchTranslateChapter = await fetch(`/api/test?lang=${lang}&translations=${qsChapter}`);
        const resultChapter = await fetchTranslateChapter.json();
        const langsChapter = Object.keys(resultChapter);
        const translates = Object.values(resultChapter)?.map?.((trans, i) => new ClassLessonTranslate({ ...trans, lang: langsChapter[i] }));
        //const translate = translates.find(trans => trans.lang === lang);
        const actualTranslates = lessonEdit?.translates;
        const newTranslates = [...actualTranslates].map(trans => {
          const l = trans.lang;
          const tr = translates.find(x => x.lang === l);
          return new ClassLessonTranslate({ ...trans.toJSON(), title: tr?.title, subtitle: tr?.subtitle, description: tr?.description });
        });
        const translate = newTranslates.find(trans => trans.lang === lang);
        lessonEdit?.update({ translates: newTranslates, translate });
      }
      setState(prev => ({ ...prev, text: 'Modification du cours...' }));
      const patched = await lessonEdit?.updateFirestore();
      setLessonEdit(patched);
    } catch (err) {
      setState(prev => ({ ...prev, processing: false, text: '' }));
    } finally {
      //setProcessing(false);
      setState(prev => ({ ...prev, processing: false, text: "" }));
    }
  }

  const cardSx = {
    bgcolor: 'var(--card-color)',
    color: 'var(--font-color)',
    borderRadius: 2,
    border: '1px solid var(--card-border)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    p: 3,
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  };

  return (
    <Grid size={12}>
      <Box sx={cardSx}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid size={{ xs: 12, sm: 7 }}>
            <Stack spacing={2}>
              <Stack alignItems="start">
                <SelectComponentDark
                  required
                  name="uid_lesson"
                  label={t('lesson')}
                  value={lessonEdit?.uid_lesson}
                  values={lessons.map(lesson => ({
                    id: lesson.uid,
                    value: lesson.title
                  }))}
                  onChange={onChangeValue}
                  hasNull={false}
                  disabled={state.processing}
                />
              </Stack>
              <FieldComponent
                label={t('title')}
                required
                type="text"
                name="title"
                value={lessonEdit?.title}
                onChange={onChangeValue}
                onClear={() => onClearValue('title')}
                resetable={lessonTeacher?.title !== lessonEdit?.title}
                onCancel={() => onResetValue('title')}
                fullWidth
                disabled={state.processing}
              />
              <FieldComponent
                label={t('subtitle')}
                type="text"
                name="subtitle"
                value={lessonEdit?.subtitle}
                onChange={onChangeValue}
                onClear={() => onClearValue('subtitle')}
                resetable={lessonTeacher?.subtitle !== lessonEdit?.subtitle}
                onCancel={() => onResetValue('subtitle')}
                fullWidth
                disabled={state.processing}
              />
              <FieldComponent
                label={t('description')}
                required
                type="multiline"
                fullWidth
                name="description"
                value={lessonEdit?.description}
                onChange={onChangeValue}
                onClear={() => onClearValue('description')}
                minRows={1}
                maxRows={10}
                resetable={lessonTeacher?.description !== lessonEdit?.description}
                onCancel={() => onResetValue('description')}
                disabled={state.processing}
              />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1.5}
                sx={{
                  pt: 1,
                  mt: 0.5,
                  borderTop: '1px solid var(--card-border)',
                  color: 'var(--font-color)',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <ButtonCancel
                    onClick={() => {
                      setLessonEdit(lessonTeacher?.clone());
                      setFiles([]);
                    }}
                    loading={state.processing}
                    disabled={sameLessons}
                    label={t('reset', { ns: NS_BUTTONS })}
                    size="medium"
                  />
                  <ButtonConfirm
                    onClick={onSubmit}
                    loading={state.processing}
                    disabled={disabledButton}
                    label={t('edit', { ns: NS_BUTTONS })}
                    size="medium"
                  />
                </Stack>
                {state.processing && state.text && (
                  <Typography variant="body2" sx={{ color: 'var(--grey)', fontWeight: 500 }}>
                    {state.text}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

function PhotosComponent() {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION]);
  const { lang } = useLanguage();
  const { lesson } = useLessonTeacher();
  const [lessonEdit, setLessonEdit] = useState(null);
  const [files, setFiles] = useState(Array(languages.length));
  const [translates, setTranslates] = useState([]);
  const [errors, setErrors] = useState({});
  const [samePhotos, setSamePhotos] = useState(true);
  
  const [state, setState] = useState({
    processing: false,
    text: ""
  });

  useEffect(() => {
    if (lesson) {
      setLessonEdit(lesson.clone());
      const _translates = [...lesson.translates];
      setTranslates(_translates);
    }
  }, [lesson]);


  const translations = useMemo(() => {
    if (!translates || translates.length === 0) return [];
    return [...translates].sort((a, b) => {
      if (a.lang === lang) return -1;
      if (b.lang === lang) return 1;
      return t(a.lang, { ns: NS_LANGS }).localeCompare(t(b.lang, { ns: NS_LANGS }));
    });
  }, [translates, lang, t]);

  const cardSx = {
    bgcolor: 'var(--card-color)',
    color: 'var(--font-color)',
    borderRadius: 2,
    border: '1px solid var(--card-border)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    p: 3,
    transition: 'box-shadow 0.2s ease',
    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  };

  return (
    <Grid size={12}>
      <Box sx={cardSx}>
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ rowGap: 3 }}>
          {translations.map((translation, i) => (
            <Grid key={translation?.lang ?? i} size={{ xs: 12, sm: 6, md: 4 }}>
              <OnePhotoComponent
                index={i}
                setSamePhotos={setSamePhotos}
                files={files}
                setFiles={setFiles}
                translations={translations}
                translation={translation}
                setLessonEdit={setLessonEdit}
                lessonEdit={lessonEdit}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Grid>
  );
}
function OnePhotoComponent({ index = -1, setSamePhotos = null, files = [], setFiles = null, lessonEdit = null, setLessonEdit = null, translations = [], translation = {} }) {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const [initialPhoto, setInitialPhoto] = useState("");
  const [file, setFile] = useState([]);
  const { lesson } = useLessonTeacher();
  const [state, setState] = useState({ processing: false, text: "" });

  useEffect(() => {
    const _files = [...files];
    _files[index] = file[0];
    setFiles(_files);
    if (file?.[0]) setSamePhotos?.(false);
  }, [file]);

  const { photoUrl, uid, langId, langFlag } = useMemo(() => {
    const l = ClassLang.getOneLang(translation?.lang);
    return {
      photoUrl: translation?.photo_url || null,
      uid: `photo-${translation?.lang}`,
      langId: l?.id,
      langFlag: l?.flag_str ?? "",
    };
  }, [translation]);

  const transIndex = translations.findIndex(tr => tr?.lang === translation?.lang);

  const dropzoneSx = {
    border: '2px dashed var(--card-border)',
    borderRadius: 2,
    p: 3,
    textAlign: 'center',
    transition: 'border-color 0.2s, background 0.2s',
    '&:hover': { borderColor: 'var(--primary)', bgcolor: 'rgba(17, 96, 229, 0.04)' },
  };

  const cardSx = {
    bgcolor: 'var(--card-color)',
    border: '1px solid var(--card-border)',
    borderRadius: 2,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    p: 2,
    transition: 'box-shadow 0.2s ease',
    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  };

  return (
    <Box sx={cardSx}>
      <Stack spacing={1.5} alignItems="stretch">
        <Chip
          label={`${langFlag} ${t(langId, { ns: NS_LANGS })}`}
          size="small"
          sx={{
            alignSelf: 'flex-start',
            fontWeight: 600,
            bgcolor: 'var(--grey-hyper-light)',
            color: 'var(--font-color)',
            '& .MuiChip-label': { px: 1.5 },
          }}
        />
        {file.length === 0 && !photoUrl && (
          <Box sx={dropzoneSx}>
            <Stack spacing={1.5} alignItems="center">
              <Box sx={{ color: 'var(--primary)', p: 1 }}>
                <IconCamera width={32} height={32} />
              </Box>
              <ButtonImportFiles
                disabled={state.processing}
                files={file}
                setFiles={setFile}
                supported_files={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value)}
              />
            </Stack>
          </Box>
        )}
        {file.length === 0 && photoUrl && (
          <Stack spacing={1.5}>
            <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <ImageComponent src={photoUrl} uid={uid} />
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <ButtonConfirm
                isAdmin
                disabled={state.processing}
                label={t('remove-photo', { ns: NS_BUTTONS })}
                size="small"
                sx={{ bgcolor: 'var(--error)', '&:hover': { bgcolor: 'var(--error-dark)' } }}
                onClick={() => {
                  setInitialPhoto(lesson?.translate?.photo_url);
                  setLessonEdit(prev => {
                    if (!prev) return lesson?.clone();
                    const tr = [...translations];
                    const i = transIndex >= 0 ? transIndex : translations.findIndex(tx => tx?.lang === translation?.lang);
                    if (i >= 0 && tr[i]) tr[i].update({ photo_url: '' });
                    prev.update({ translates: tr });
                    return prev.clone();
                  });
                }}
              />
              {initialPhoto && (
                <ButtonCancel
                  disabled={state.processing}
                  label={t('reset-photo', { ns: NS_BUTTONS })}
                  size="small"
                  onClick={() => {
                    setLessonEdit(prev => {
                      if (!prev) return lesson?.clone();
                      const tr = [...translations];
                      const i = transIndex >= 0 ? transIndex : translations.findIndex(tx => tx?.lang === translation?.lang);
                      if (i >= 0 && tr[i]) tr[i].update({ photo_url: initialPhoto });
                      prev.update({ translates: tr });
                      return prev.clone();
                    });
                  }}
                />
              )}
            </Stack>
            <ButtonImportFiles
              disabled={state.processing}
              files={file}
              setFiles={setFile}
              supported_files={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value)}
            />
          </Stack>
        )}
        {file.length > 0 && (
          <Stack spacing={1.5}>
            <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <ImageComponent src={URL.createObjectURL(file[0])} uid={lessonEdit?.uid} />
            </Box>
            <ButtonImportFiles
              disabled={state.processing}
              files={file}
              setFiles={setFile}
              supported_files={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value)}
            />
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default function LessonTeacherEditComponent() {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  //const [lesson, setLesson] = useState(null);
  const { lesson } = useLessonTeacher();

  const [lessonEdit, setLessonEdit] = useState(null);
  const [modeAccordion, setModeAccordion] = useState('');

  const [openedView, setOpenedView] = useState('');

  useEffect(() => {
    setLessonEdit(lesson?.clone());
  }, [lesson]);

  const sectionCardSx = {
    bgcolor: "var(--card-color)",
    color: "var(--font-color)",
    borderRadius: 2,
    border: "1px solid var(--card-border)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    p: 3,
    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  };

  const contentSections = ["goals", "programs", "notes", "target_audiences", "prerequisites", "tags"];

  return (
    <Container disableGutters sx={{ width: "100%" }}>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid size={12} sx={{ "& .MuiAccordion-root": { mb: 0.5 } }}>
          <Box component="div" onClick={() => setOpenedView("infos")} sx={{ cursor: "pointer" }}>
            <AccordionComponent
              title={t("infos")}
              onChange={() => setOpenedView("infos")}
              expanded={openedView === "infos"}
            >
              <InfosComponent />
            </AccordionComponent>
          </Box>
        </Grid>
        <Grid size={12}>
          <Box component="div" onClick={() => setOpenedView("photos")} sx={{ cursor: "pointer" }}>
            <AccordionComponent
              title={t("photos")}
              onChange={() => setOpenedView("photos")}
              expanded={openedView === "photos"}
            >
              <PhotosComponent />
            </AccordionComponent>
          </Box>
        </Grid>
        <Grid size={12}>
          <Box sx={sectionCardSx}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: "var(--font-color)" }}>
              {t("content")}
            </Typography>
            <Stack spacing={0.5}>
              {contentSections.map((item) => (
                <Box key={item} component="div" onClick={() => setModeAccordion(item)} sx={{ cursor: "pointer" }}>
                  <CustomAccordion
                    expanded={modeAccordion === item}
                    title={item}
                    array_name={item}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}