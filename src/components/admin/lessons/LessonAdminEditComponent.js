import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconArrowDown, IconArrowUp, IconCamera, IconCheck, IconPicture, IconRemove } from "@/assets/icons/IconsComponent";
import { ClassLesson, ClassLessonTeacher, ClassLessonTranslate } from "@/classes/ClassLesson";
import { languages, NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS, NS_LESSONS_ONE } from "@/contexts/i18n/settings";
import { Box, Chip, Container, Grid, IconButton, Stack, Switch, Typography } from "@mui/material";

import { Trans, useTranslation } from "react-i18next";
import { useLesson } from "@/contexts/LessonProvider";
import { useLanguage } from "@/contexts/LangProvider";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import Image from "next/image";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import FieldComponent from "@/components/elements/FieldComponent";
import ButtonImportFiles from "@/components/elements/ButtonImportFiles";
import { ClassFile } from "@/classes/ClassFile";
import { ClassLang } from "@/classes/ClassLang";
import { LessonTeacherProvider, useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import { useUsers } from "@/contexts/UsersProvider";
import { useRouter, useParams } from "next/navigation";
import { PAGE_ADMIN_UPDATE_ONE_LESSON_TEACHER } from "@/contexts/constants/constants_pages";
import { useUserDevice } from "@/contexts/UserDeviceProvider";
import { IconCertificate } from "@/assets/icons/IconsComponent";
import { NS_LESSONS } from "@/contexts/i18n/settings";
import AccordionComponent from "../../dashboard/elements/AccordionComponent";
import ButtonCancel from "../../dashboard/elements/ButtonCancel";
import { Icon } from "@iconify/react";
import { defaultLanguage } from "@/contexts/i18n/settings";

const MIN_LENGTH_TITLE = 3;
const MAX_LENGTH_TITLE = 1_000;

const makeId = () => (crypto?.randomUUID?.() ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

// Helper function for ClassLesson storage path
const getStoragePath = (uidLesson = "", lang = "fr", extension = "") => {
  return `${ClassLesson.COLLECTION}/${uidLesson}/photo_url-${lang}.${extension}`;
};

const CustomAccordion = ({ expanded = false, title = "", subtitle = "", array_name = "" }) => {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS]);
  const { lesson } = useLesson();
  const [lessonEdit, setLessonEdit] = useState(null);
  const [array, setArray] = useState([]);
  const { lang } = useLanguage();
  const originalRef = useRef([]);
  const [newValue, setNewValue] = useState("");
  const [state, setState] = useState({ processing: false, text: "" });
  useEffect(() => {
    console.log("translates", lesson?.translates)
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

  const onMoveValue = useCallback((fromIndex, toIndex) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= array.length || toIndex >= array.length) {
      return;
    }
    setArray(prev => {
      const newArray = [...prev];
      const [movedItem] = newArray.splice(fromIndex, 1);
      newArray.splice(toIndex, 0, movedItem);
      return newArray;
    });
  }, [array]);

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
    "&:hover": { bgcolor: "var(--warning-shadow-sm)" },
  };

  return (
    <AccordionComponent title={t(title)} expanded={expanded} isAdmin={true}>
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
              {
                item.value.length > 0 && <Grid size={'auto'}>
                <Box onClick={()=>{
                  if(i>0) {
                    onMoveValue(i, i-1);
                  }
                }}>
                <IconArrowUp 
                color={`var(--${i>0 ? 'warning' : 'grey-light'})`}
                
                 />
                </Box>
                <Box onClick={()=>{
                  if(i<array.length-1) {
                    onMoveValue(i, i+1);
                  }
                }}>
                <IconArrowDown color={`var(--${i<array.length-1 ? 'warning' : 'grey-light'})`} />
                </Box>
                </Grid>
              }
              <Grid size="auto">
                <Typography variant="body2" sx={{ color: "var(--grey)", fontWeight: 600, minWidth: 24 }}>
                  {i + 1}.
                </Typography>
              </Grid>
              <Grid size="grow">
                <Stack>
                  <FieldComponent
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
                    isAdmin={true}
                  />
                  {
                    subtitle && <FieldComponent
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
                      isAdmin={true}
                    />
                  }
                </Stack>
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
              isAdmin={true}
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
            onClick={onResetAllValues}
            disabled={state.processing}
            label={t("reset", { ns: NS_BUTTONS })}
          />
          <ButtonConfirm
            loading={state.processing}
            onClick={onSubmit}
            label={t("edit", { ns: NS_BUTTONS })}
          />
        </Stack>
      )}
    </AccordionComponent>
  );
}
const CustomAccordionSubtitle = ({ expanded = false, title = "", array_name = "" }) => {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS]);
  const { lesson } = useLesson();
  const [lessonEdit, setLessonEdit] = useState(null);
  const [array, setArray] = useState([]);
  const [errors, setErrors] = useState([]);
  const { lang } = useLanguage();
  const originalRef = useRef([]);
  const [newValue, setNewValue] = useState({
    title: "",
    subtitle: "",
  });
  const [state, setState] = useState({ processing: false, text: "" });
  useEffect(() => {
    if (lesson && array_name) {
      console.log("translates", lesson?.translates)
      setLessonEdit(lesson?.clone());
      const initial = Array.isArray(lesson?.[array_name]) ? lesson[array_name] : [];
      const initialMapped = [...initial].map((val) => ({ id: makeId(), value: { title: val?.title ?? "", subtitle: val?.subtitle ?? "" } }));
      originalRef.current = initialMapped;
      setArray(initialMapped);
      console.log("original", initialMapped[0], "array", initialMapped[0]);
    }
  }, [lesson, array_name]);
  const sameValues = useMemo(() => {
    const current = array.map((r) => ({ title: r.value.title, subtitle: r.value.subtitle }));
    const original = lessonEdit?.[array_name] || [];
    if (current.length !== original.length) return false;
    return current.every((c, i) => (c.title ?? "") === (original[i].title ?? "") && (c.subtitle ?? "") === (original[i].subtitle ?? ""));
  }, [array, lessonEdit, array_name]);
  const onChangeValue = useCallback((e, index) => {
    const { name, value } = e?.target;
    const orig = [...originalRef.current] || [];
    console.log("name", name, "original change", [...orig], "array change", [...array]);
    setErrors(prev => {
      prev[`${name}-${index}`] = null;
      delete prev[`${name}-${index}`];
      return prev;
    });
    setArray((prev) => {
      if (!prev) return orig;
      //prev[index] = { ...prev[index], value: { ...prev[index].value, [name]: value } };
      //console.log("prev on change valur", prev.map((row, i) => (i === index ? { id: row.id, value: { ...row.value, [name]: value } } : row)));
      return [...prev].map((row, i) => (i === index ? { ...row, value: { ...row.value, [name]: value } } : row));
    }
    );

    if (index < 0) setNewValue(prev => ({
      ...prev,
      [name]: value,
    }));
  }, [array]);
  const onClearValue = useCallback((index, name) => {
    //console.log("ARRRRAY",originalRef.current, array, index, array[index])
    setErrors(prev => {
      prev[`${name}-${index}`] = null;
      delete prev[`${name}-${index}`];
      return prev;
    });
    setArray((prev) =>
      prev.map((row, i) => (i === index ? { ...row, value: { ...row.value, [name]: '' } } : row))
    );
    if (index < 0) setNewValue(prev => ({
      ...prev,
      [name]: '',
    }));
  }, []);
  const onResetValue = useCallback((index, name) => {
    const original = originalRef.current || [];
    setErrors(prev => {
      prev[`${name}-${index}`] = null;
      delete prev[`${name}-${index}`];
      return prev;
    });
    setArray((prev) =>
      prev.map((row, i) => (i === index ? { ...row, value: { ...row.value, [name]: original[i].value[name] } } : row))
    );
  }, []);
  const onDeleteValue = useCallback((index) => {
    setErrors(prev => {
      prev[`${'title'}-${index}`] = null;
      prev[`${'subtitle'}-${index}`] = null;
      delete prev[`${'title'}-${index}`];
      delete prev[`${'subtitle'}-${index}`];
      return prev;
    });
    setArray(prev => prev.filter((_, i) => i !== index));
  }, []);
  const onMoveValue = useCallback((fromIndex, toIndex) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= array.length || toIndex >= array.length) {
      return;
    }
    setArray(prev => {
      const newArray = [...prev];
      const [movedItem] = newArray.splice(fromIndex, 1);
      newArray.splice(toIndex, 0, movedItem);
      return newArray;
    });
    // Réindexer les erreurs
    setErrors(prev => {
      const newErrors = {};
      Object.keys(prev).forEach(key => {
        const match = key.match(/^(title|subtitle)-(\d+)$/);
        if (match) {
          const [, field, oldIndex] = match;
          const oldIdx = parseInt(oldIndex);
          let newIdx = oldIdx;
          if (oldIdx === fromIndex) {
            newIdx = toIndex;
          } else if (fromIndex < toIndex && oldIdx > fromIndex && oldIdx <= toIndex) {
            newIdx = oldIdx - 1;
          } else if (fromIndex > toIndex && oldIdx >= toIndex && oldIdx < fromIndex) {
            newIdx = oldIdx + 1;
          }
          newErrors[`${field}-${newIdx}`] = prev[key];
        } else {
          newErrors[key] = prev[key];
        }
      });
      return newErrors;
    });
  }, [array]);
  const onAddValue = useCallback((value) => {
    const _errors = {...errors};
    console.log("ERRRROS", _errors)
    if(value.title?.length < MIN_LENGTH_TITLE || value.title?.length > MAX_LENGTH_TITLE) {
      _errors.title = <Trans t={t} i18nKey={'errors.title'} values={{ min: MIN_LENGTH_TITLE, max: MAX_LENGTH_TITLE }} />;
    }
    if(value.subtitle?.length < MIN_LENGTH_TITLE || value.subtitle?.length > MAX_LENGTH_TITLE) {
      _errors.subtitle = <Trans t={t} i18nKey={'errors.subtitle'} values={{ min: MIN_LENGTH_TITLE, max: MAX_LENGTH_TITLE }} />
    }
    setErrors(_errors);
    if(_errors.title?.length > 0 || _errors.subtitle?.length > 0) {
      return;
    }
    setArray(prev => [...prev, { id: makeId(), value: value }]);
    setNewValue({
      title: "",
      subtitle: "",
    });
  }, [array, errors]);
  const onResetAllValues = useCallback(() => {

    const original = originalRef.current || [];
    //originalRef.current = original;
    //originalRef.current = [...original].map((val) => ({ id: makeId(), value: { title: val?.title ?? "", subtitle: val?.subtitle ?? "" } }));
    //setArray(original.map((val) => ({ id: makeId(), value: val ?? "" })));
    console.log("WAAAAAA", original)
    setArray([...original]);
    setErrors({});
  }, [lessonEdit, array_name]);
  const onSubmit = async () => {
    try {
      const _errors = {...errors};
      setState((p) => ({ ...p, processing: true, text: "Traitement..." }));
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        const title = element.value.title;
        const subtitle = element.value.subtitle;
        if (title?.length < MIN_LENGTH_TITLE || title?.length > MAX_LENGTH_TITLE) {
          _errors[`title-${i}`] =  <Trans t={t} i18nKey={'errors.title'} values={{ min: MIN_LENGTH_TITLE, max: MAX_LENGTH_TITLE }} />;
        }
        if (subtitle?.length < MIN_LENGTH_TITLE || subtitle?.length > MAX_LENGTH_TITLE) {
          _errors[`subtitle-${i}`] =  <Trans t={t} i18nKey={'errors.subtitle'} values={{ min: MIN_LENGTH_TITLE, max: MAX_LENGTH_TITLE }} />;
        }
      }
      setErrors(prev=>({...prev, ..._errors}));
      console.log("ERRRROS SUBMIT", _errors)
      if (Object.keys(_errors).length > 0) {
        return;
      }
      
      setState((p) => ({ ...p, text: "Traductions des valeurs..." }));
      const transChapter = { [array_name]: array.map((a) => ({title: a.value.title, subtitle: a.value.subtitle})) };
      const qs = encodeURIComponent(JSON.stringify(transChapter));
      const res = await fetch(`/api/test?lang=${lang}&translations=${qs}`);
      const data = await res.json();
      
      const langs = Object.keys(data);
      const trs = Object.entries(data)?.map?.((trans, i) =>{
        const lang = trans[0];
        const values = trans[1];
        return new ClassLessonTranslate({ lang: lang, [array_name]: Object.values(values) });
      });
      console.log("TRS",trs)
      
      const actual = lessonEdit?.translates ?? [];
      
      const newTrs = actual.map((trans) => {
        const translate = trs?.find((x) => x.lang === trans.lang);
        console.log("T", translate)
        return new ClassLessonTranslate({ ...trans.toJSON(), [array_name]: translate?.[array_name] });
      });
      
      
      console.log("NEWTRS",data, trs, newTrs)
      
      const tr = newTrs.find((x) => x.lang === lang);
      lessonEdit?.update({ translates: newTrs, translate: tr });
      setState((p) => ({ ...p, text: "Modification du cours..." }));
      console.log("LESSONEDIT", lessonEdit)
      const patched = await lessonEdit?.updateFirestore();
      console.log("PATCHED", patched)
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
    "&:hover": { bgcolor: "var(--warning-shadow-sm)" },
  };
  return (
    <AccordionComponent title={t(title)} expanded={expanded} isAdmin={true}>
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
              {
                item.value.title.length > 0 && item.value.subtitle.length > 0 && <Grid size={'auto'}>
                <Box onClick={()=>{
                  if(i>0) {
                    onMoveValue(i, i-1);
                  }
                }}>
                <IconArrowUp 
                color={`var(--${i>0 ? 'warning' : 'grey-light'})`}
                
                 />
                </Box>
                <Box onClick={()=>{
                  if(i<array.length-1) {
                    onMoveValue(i, i+1);
                  }
                }}>
                <IconArrowDown color={`var(--${i<array.length-1 ? 'warning' : 'grey-light'})`} />
                </Box>
                </Grid>
              }
              <Grid size="auto">
                <Typography variant="body2" sx={{ color: "var(--grey)", fontWeight: 600, minWidth: 24 }}>
                  {i + 1}.
                </Typography>
              </Grid>
              <Grid size="grow">
                <Stack spacing={1}>
                  <FieldComponent
                    index={i}
                    disabled={state.processing}
                    type="multiline"
                    name={'title'}
                    error={errors[`title-${i}`]}
                    value={item.value.title}
                    fullWidth
                    minRows={1}
                    maxRows={10}
                    onChange={(e) => onChangeValue(e, i)}
                    onClear={() => onClearValue(i, 'title')}
                    resetable={orig[i]?.id === item.id && orig[i]?.value?.title !== item.value.title}
                    onCancel={() => onResetValue(i, 'title')}
                    isAdmin={true}
                  // removable={!state.processing}
                  // onRemove={() => onDeleteValue(i)}
                  />
                  {
                    <FieldComponent
                      index={i}
                      disabled={state.processing}
                      type="multiline"
                      name={'subtitle'}
                      error={errors[`subtitle-${i}`]}
                      value={item.value.subtitle}
                      fullWidth
                      minRows={1}
                      maxRows={10}
                      onChange={(e) => onChangeValue(e, i)}
                      onClear={() => onClearValue(i, 'subtitle')}
                      resetable={orig[i]?.id === item.id && orig[i]?.value?.subtitle !== item.value.subtitle}
                      onCancel={() => onResetValue(i, 'subtitle')}
                      isAdmin={true}
                    // removable={!state.processing}
                    // onRemove={() => onDeleteValue(i)}

                    />
                  }
                </Stack>
              </Grid>
              <Grid size="auto">
                <IconButton
                  //loading={processing}
                  onClick={() => {
                    onDeleteValue(i);
                  }}
                  disabled={state.processing}
                  sx={{
                    //display: processing ? 'none' : 'flex',
                    background: 'red',
                    color: "var(--background)",
                    width: '24px',
                    height: '24px',
                    '&:hover': {
                      color: 'background.main',
                      backgroundColor: 'error.main',
                      boxShadow: `0 0 0 0.2rem rgba(255,0,0,0.5)`,
                    },
                  }} aria-label="delete" size="small">
                  <IconRemove width={14} height={14} />
                </IconButton>
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
            <Stack spacing={1}>
              <FieldComponent
                disabled={state.processing}
                type="multiline"
                name="title"
                value={newValue?.title}
                fullWidth
                minRows={1}
                maxRows={10}
                onChange={(e) => onChangeValue(e, -1)}
                onClear={() => onClearValue(-1, 'title')}
                //editable={newValue?.title?.length > 0}
                //onSubmit={() => onAddValue(newValue.title)}
                error={errors[`title`]}
                isAdmin={true}
              />
              <FieldComponent
                disabled={state.processing}
                type="multiline"
                name="subtitle"
                value={newValue.subtitle}
                fullWidth
                minRows={1}
                maxRows={10}
                onChange={(e) => onChangeValue(e, -1)}
                onClear={() => onClearValue(-1, 'subtitle')}
               // editable={newValue.subtitle.length > 0}
                //onSubmit={() => onAddValue(newValue.subtitle)}
                error={errors[`subtitle`]}
                isAdmin={true}
              />
            </Stack>
          </Grid>
          {
            <Grid size="auto">
            <IconButton
              // loading={processing}
              //disabled={!value || processing}
              disabled={state.processing || (newValue?.title?.length === 0  || newValue?.subtitle?.length ===0)}
              onClick={() => onAddValue(newValue)}
              sx={{
                background: 'var(--warning)',
                color: 'var(--background)',
                width: { xs: '25px', sm: '25px' },
                height: { xs: '25px', sm: '25px' },
                '&:hover': {
                  color: 'var(--background)',
                  backgroundColor: 'var(--warning)',
                  boxShadow: `0 0 0 0.2rem var(--warning-shadow-sm)`,
                },
              }} aria-label="delete" size="small">
              <IconCheck sx={{ fontSize: { xs: '15px', sm: '20px' } }} />
            </IconButton>
          </Grid>
          }
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
            onClick={onResetAllValues}
            disabled={state.processing}
            label={t("reset", { ns: NS_BUTTONS })}
            isAdmin={true}
          />
          <ButtonConfirm
            loading={state.processing}
            disabled={state.processing || Object.keys(errors).length > 0}
            onClick={onSubmit}
            label={t("edit", { ns: NS_BUTTONS })}
            isAdmin={true}
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

function EnabledBlock() {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS]);
  const { lesson, update: updateLesson } = useLesson();
  const [saving, setSaving] = useState(false);
  const enabled = lesson?.enabled === true;

  const handleToggle = useCallback(async () => {
    if (!lesson) return;
    setSaving(true);
    try {
      const patched = lesson.clone();
      patched.update({ enabled: !enabled });
      await updateLesson(patched);
    } finally {
      setSaving(false);
    }
  }, [lesson, enabled, updateLesson]);

  if (!lesson) return null;

  const cardSx = {
    bgcolor: 'var(--card-color)',
    color: 'var(--font-color)',
    borderRadius: 2,
    border: '1px solid var(--card-border)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    p: 2.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    flexWrap: 'wrap',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    '&:hover': { boxShadow: '0 4px 14px rgba(0,0,0,0.06)' },
  };

  return (
    <Box sx={cardSx}>
      <Stack direction="row" alignItems="center" spacing={2} flex={1} minWidth={0}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: enabled ? 'var(--warning-shadow-sm)' : 'var(--grey-hyper-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease',
          }}
        >
          <Icon
            icon={enabled ? 'mdi:eye-check' : 'mdi:eye-off-outline'}
            width={26}
            height={26}
            style={{ color: enabled ? 'var(--warning)' : 'var(--grey)' }}
          />
        </Box>
        <Stack spacing={0.25}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--font-color)' }}>
            {t('enabled')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--grey)', fontSize: '0.875rem' }}>
            {t('enabled_description')}
          </Typography>
        </Stack>
      </Stack>
      <Switch
        checked={enabled}
        onChange={handleToggle}
        disabled={saving}
        size="medium"
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: 'var(--warning)',
            '& + .MuiSwitch-track': { bgcolor: 'var(--warning) !important', opacity: 0.4 },
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            bgcolor: 'var(--warning) !important',
          },
        }}
      />
    </Box>
  );
}

function InfosComponent() {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION]);
  const { lang } = useLanguage();
  const { lesson } = useLesson();
  const [lessonEdit, setLessonEdit] = useState(null);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    processing: false,
    text: ""
  });

  useEffect(() => {
    setLessonEdit(lesson?.clone());
  }, [lesson]);
  const sameLessons = useMemo(() => {
    if (lesson?.category !== lessonEdit?.category) return false;
    if (lesson?.title !== lessonEdit?.title) return false;
    if (lesson?.subtitle !== lessonEdit?.subtitle) return false;
    if (lesson?.description !== lessonEdit?.description) return false;
    if (lesson?.certified !== lessonEdit?.certified) return false;
    if (lesson?.enabled !== lessonEdit?.enabled) return false;
    if (files.length > 0 || lesson?.photo_url !== lessonEdit?.photo_url) return false;
    return true;
  }, [lesson, lessonEdit, files.length]);
  const disabledButton = useMemo(() => {
    if (sameLessons) return true;
    if (!lessonEdit?.category) return true;
    if (!lessonEdit?.title) return true;
    if (!lessonEdit?.description) return true;
    return false;
  }, [sameLessons, lessonEdit]);
  const mustTranslate = useMemo(() => {
    if (lesson?.title !== lessonEdit?.title) return true;
    if (lesson?.subtitle !== lessonEdit?.subtitle) return true;
    if (lesson?.description !== lessonEdit?.description) return true;
    return false;
  }, [lesson, lessonEdit]);

  const onChangeValue = (e) => {
    const { name, type, value, checked } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLessonEdit(prev => {
      if (!prev || prev === null) return lesson.clone();
      var newValue = type === 'checkbox' ? checked : value;
      prev.update({ [name]: newValue });
      return prev.clone();
    });

  }
  const onClearValue = (name) => {
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLessonEdit(prev => {
      if (!prev || prev === null) return lesson.clone();
      var newValue = '';
      prev.update({ [name]: newValue });
      return prev.clone();
    })
  }
  const onResetValue = (name) => {
    //const { name, type, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLessonEdit(prev => {
      if (!prev || prev === null) return lesson.clone();
      var lessonValue = lesson[name];
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
              <FieldComponent
                label={t('title')}
                required
                type="text"
                name="title"
                value={lessonEdit?.title}
                onChange={onChangeValue}
                onClear={() => onClearValue('title')}
                resetable={lesson?.title !== lessonEdit?.title}
                onCancel={() => onResetValue('title')}
                fullWidth
                disabled={state.processing}
                isAdmin={true}
              />
              <FieldComponent
                label={t('subtitle')}
                type="text"
                name="subtitle"
                value={lessonEdit?.subtitle}
                onChange={onChangeValue}
                onClear={() => onClearValue('subtitle')}
                resetable={lesson?.subtitle !== lessonEdit?.subtitle}
                onCancel={() => onResetValue('subtitle')}
                fullWidth
                disabled={state.processing}
                isAdmin={true}
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
                resetable={lesson?.description !== lessonEdit?.description}
                onCancel={() => onResetValue('description')}
                disabled={state.processing}
                isAdmin={true}
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
                      setLessonEdit(lesson?.clone());
                      setFiles([]);
                    }}
                    loading={state.processing}
                    disabled={sameLessons}
                    label={t('reset', { ns: NS_BUTTONS })}
                    size="medium"
                    isAdmin={true}
                  />
                  <ButtonConfirm
                    onClick={onSubmit}
                    loading={state.processing}
                    disabled={disabledButton}
                    label={t('edit', { ns: NS_BUTTONS })}
                    size="medium"
                    isAdmin={true}
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
  const { lesson, getOneLesson } = useLesson();
  const [lessonEdit, setLessonEdit] = useState(null);
  const [files, setFiles] = useState([]);
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
      // Initialiser files avec les traductions
      setFiles(_translates.map(trans => ({ lang: trans.lang, file: null })));
    }
  }, [lesson]);
  
  useEffect(() => {
    if (lessonEdit) {
      setTranslates([...lessonEdit._translates]);
    }
  }, [lessonEdit]);

  // Calculer samePhotos en comparant lesson et lessonEdit + fichiers
  useEffect(() => {
    if (!lesson || !lessonEdit) {
      setSamePhotos(true);
      return;
    }
    
    // Vérifier s'il y a des fichiers sélectionnés
    const hasFiles = files.some(item => item?.file);
    if (hasFiles) {
      setSamePhotos(false);
      return;
    }
    
    // Vérifier si les photos ont changé
    // Comparer toutes les traductions de lesson avec celles de lessonEdit
    const allLangs = new Set([
      ...lesson.translates.map(t => t.lang),
      ...(lessonEdit.translates || []).map(t => t.lang)
    ]);
    
    const photosChanged = Array.from(allLangs).some(lang => {
      const origTrans = lesson.translates.find(t => t.lang === lang);
      const editTrans = (lessonEdit.translates || []).find(t => t.lang === lang);
      
      // Si la traduction n'existe pas dans l'original mais existe dans l'édition, c'est un changement
      if (!origTrans && editTrans) return true;
      
      // Si la traduction n'existe pas dans l'édition mais existe dans l'original, c'est un changement
      if (origTrans && !editTrans) return true;
      
      // Si les deux existent, comparer les photo_url
      if (origTrans && editTrans) {
        const origUrl = (origTrans.photo_url || '').trim();
        const editUrl = (editTrans.photo_url || '').trim();
        if (origUrl !== editUrl) {
          return true;
        }
      }
      
      return false;
    });
    
    setSamePhotos(!photosChanged);
  }, [lesson, lessonEdit, files]);

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

  const onResetAllPhotos = useCallback(() => {
    if (!lesson) return;
    setLessonEdit(lesson.clone());
    setFiles([...lesson.translates].map(trans => ({ lang: trans.lang, file: null })));
    setSamePhotos(true);
  }, [lesson]);

  const onEdit = async () => {
    console.log("Files slected", files);
    try {
      setState(prev => ({ ...prev, processing: true, text: "Traitement..." }));
      const _lesson = getOneLesson(lessonEdit?.uid);
      //setState(prev => ({ ...prev, text: 'Traductions des valeurs...' }));
      console.log("compare lessssons", _lesson.translates[0].photo_url, lessonEdit.translates[0].photo_url);
      // Uploader les fichiers sélectionnés
      const uploadedFiles = await Promise.all(
        files
          .filter(({ file }) => file)
          .map(async ({ lang, file }) => {
            const filename = file.name;
            const extension = filename.split('.').pop().toLowerCase();
            const _path = ClassLessonTeacher.getStoragePath(lessonEdit?.uid_lesson, lessonEdit?.uid_teacher, lang, extension);
            const resultFile = await ClassFile.uploadFileToFirebase({
              file: file,
              path: _path,
            });
            const newFile = new ClassFile({
              id: "",
              uri: resultFile?.uri || "",
              path: resultFile?.path,
              name: resultFile?.name,
              type: resultFile?.type,
              size: resultFile?.size,
              tag: `profile`,
            }).toJSON();
            const url = newFile?.uri || "";
            return {
              lang,
              url: url,
            };
          })
      );
      
      // Utiliser lessonEdit.translates comme base (contient déjà les modifications)
      const actualTranslates = lessonEdit?.translates || [];
      console.log("Actual translates before update:", actualTranslates.map(t => ({ lang: t.lang, photo_url: t.photo_url })));
      
      const newTranslates = actualTranslates.map(trans => {
        const l = trans.lang;
        // Chercher si un fichier a été uploadé pour cette langue
        const uploaded = uploadedFiles.find(x => x.lang === l);
        // Si un fichier a été uploadé, utiliser son URL, sinon garder la photo_url actuelle de lessonEdit
        const photoUrl = uploaded ? uploaded.url : (trans.photo_url || '');
        console.log(`Translation ${l}: uploaded=${!!uploaded}, photoUrl=${photoUrl}`);
        // Créer une nouvelle instance avec les données mises à jour
        const updatedTrans = new ClassLessonTranslate({ ...trans.toJSON(), photo_url: photoUrl });
        return updatedTrans;
      });
      
      console.log("New translates before update:", newTranslates.map(t => ({ lang: t.lang, photo_url: t.photo_url })));
      
      // Mettre à jour lessonEdit avec les nouvelles traductions
      const translate = newTranslates.find(trans => trans.lang === lang);
      lessonEdit?.update({ translates: newTranslates, translate });
      
      console.log("LessonEdit translates after update:", lessonEdit.translates.map(t => ({ lang: t.lang, photo_url: t.photo_url })));
      
      setState(prev => ({ ...prev, text: 'Modification du cours...' }));
      
      // Sauvegarder dans Firestore
      const patched = await lessonEdit?.updateFirestore();
      
      console.log("Patched lesson after updateFirestore:", patched?.translates?.map(t => ({ lang: t.lang, photo_url: t.photo_url })));
      
      if (patched) {
        setLessonEdit(patched);
        setTranslates([...patched.translates]);
        setFiles([...patched.translates].map(trans => ({ lang: trans.lang, file: null })));
        console.log("Photos mises à jour avec succès", patched);
      } else {
        console.error("Erreur lors de la mise à jour dans Firestore");
        setState(prev => ({ ...prev, processing: false, text: "Erreur lors de la sauvegarde" }));
      }
    } catch (error) {
      console.log("Error onEdit", error);
    } finally {
      setState(prev => ({ ...prev, processing: false, text: "" }));
    }

  }

  return (
    <Grid size={12} spacing={2}>
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
      <Grid container spacing={1} sx={{ py: 1.5 }}>
        <Grid size={'auto'}>
          <ButtonCancel
            onClick={onResetAllPhotos}
            disabled={state.processing || samePhotos}
            size="medium"
            label={t('reset', { ns: NS_BUTTONS })}
            isAdmin={true}
          />
        </Grid>
        <Grid size={'auto'}>
          <ButtonConfirm loading={state.processing} disabled={state.processing || samePhotos} size="medium" label={t('edit', { ns: NS_BUTTONS })} onClick={onEdit} isAdmin={true} />
        </Grid>
      </Grid>
    </Grid>
  );
}
function DownloadPhotoComponent({ photoUrl = null, uid = '', file = null, setFile = null }) {
  const { t } = useTranslation([NS_BUTTONS]);
  //const [file, setFile] = useState([]);
  const imageRef = useRef(null);
  //const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!file && imageRef.current) {
      imageRef.current.value = "";
    }
  }, [file]);

  const handleClickFile = () => {
    imageRef.current.click(); // déclenche le clic sur l’input caché
  };
  const handleChangeFile = (e) => {
    const _selectedFiles = [...(e.target.files || [])];
    const _file = _selectedFiles.length > 0 ? _selectedFiles[0] : null;
    if (_file && setFile) {
      setFile([_file]);
    }
  };

  const dropzoneSx = {
    width: '100%',
    border: '2px dashed var(--card-border)',
    borderRadius: 2,
    p: 3,
    textAlign: 'center',
    transition: 'border-color 0.2s, background 0.2s',
    '&:hover': {
      borderColor: 'var(--warning)',
      bgcolor: 'var(--warning-shadow-sm)',
      '& button': {
        borderColor: 'var(--warning)',
        bgcolor: 'rgba(255, 152, 0, 0.04)',
        color: 'var(--warning)',
        fontWeight: 500
      }
    },
    color: 'red'
  };
  return (<>
    <input
      ref={imageRef}
      type="file"
      //name="video"
      //accept="video/*"
      required
      multiple={false}
      accept={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value)}
      onChange={handleChangeFile}
      style={{ display: 'none' }}
    />
    <Stack spacing={1.5} alignItems="center">
      <Box sx={dropzoneSx} onClick={handleClickFile}>
        <Stack spacing={1.5} alignItems="center">
          {
            !file && <>
              <Box sx={{ color: 'var(--warning)', p: 1 }}>
                <IconCamera width={32} height={32} />
              </Box>
              <ButtonCancel
                label={t('choose-photo')}
                icon={<Icon icon="material-symbols:upload" width="20" height="20" />}
                isAdmin={true}
                sx={{
                  border: '1px solid var(--card-border)',
                  color: 'var(--font-color)',
                  transition: 'border-color 0.2s, background 0.2s'
                }}
              />
            </>
          }
        </Stack>
      </Box>
    </Stack>
  </>)
}
function OnePhotoComponent({ index = -1, setSamePhotos = null, files = [], setFiles = null, lessonEdit = null, setLessonEdit = null, translations = [], translation = {} }) {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const { lesson } = useLesson();
  const [state, setState] = useState({ processing: false, text: "" });

  // Trouver le fichier correspondant à cette langue dans le tableau files
  const fileItem = useMemo(() => {
    return files.find(f => f?.lang === translation?.lang) || null;
  }, [files, translation?.lang]);

  const { photoUrl, uid, langId, langFlag } = useMemo(() => {
    const l = ClassLang.getOneLang(translation?.lang);
    // Si un fichier est sélectionné, on ne montre pas la photo URL actuelle
    const currentFile = files.find(f => f?.lang === translation?.lang)?.file;
    return {
      photoUrl: currentFile ? null : (translation?.photo_url || null),
      uid: `photo-${translation?.lang}`,
      langId: l?.id,
      langFlag: l?.flag_str ?? "",
    };
  }, [lessonEdit, translation, files]);
  
  const initialPhoto = useMemo(() => {
    if (!lesson) return "";
    const photo = lesson.translates.find(tx => tx?.lang === langId)?.photo_url || "";
    return photo;
  }, [lesson, langId]);

  const handleRemoveFile = () => {
    setFiles(prev => prev.map(f => 
      f?.lang === translation?.lang ? { ...f, file: null } : f
    ));
  };

  const handleSetFile = (newFiles) => {
    const file = newFiles && newFiles.length > 0 ? newFiles[0] : null;
    if (file) {
      setFiles(prev => {
        const updated = prev.map(f => 
          f?.lang === translation?.lang ? { ...f, file } : f
        );
        // Si l'élément n'existe pas encore, l'ajouter
        const exists = updated.some(f => f?.lang === translation?.lang);
        if (!exists) {
          updated.push({ lang: translation?.lang, file });
        }
        return updated;
      });
    }
  };

  const transIndex = translations.findIndex(tr => tr?.lang === translation?.lang);

  const dropzoneSx = {
    border: '2px dashed var(--card-border)',
    borderRadius: 2,
    p: 3,
    textAlign: 'center',
    transition: 'border-color 0.2s, background 0.2s',
    '&:hover': { borderColor: 'var(--warning)', bgcolor: 'rgba(255, 152, 0, 0.04)' },
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
            bgcolor: 'transparent',
            color: 'var(--font-color)',
            border: '0.1px solid var(--card-border)',
            '& .MuiChip-label': { px: 1.5 },
          }}
        />

        {!fileItem?.file && !photoUrl && (
          <Stack spacing={1.5}>
            <DownloadPhotoComponent file={fileItem?.file} setFile={handleSetFile} />
            {initialPhoto && (translation?.photo_url === '' || translation?.photo_url !== initialPhoto) && (
              <ButtonCancel
                disabled={state.processing}
                icon={<IconPicture width={12} height={12} />}
                label={t('reset-photo', { ns: NS_BUTTONS })}
                size="small"
                isAdmin={true}
                onClick={() => {
                  setLessonEdit(prev => {
                    if (!prev) return lesson?.clone();
                    const tr = [...prev.translates];
                    const i = tr.findIndex(tx => tx?.lang === translation?.lang);
                    if (i >= 0 && tr[i]) {
                      tr[i] = new ClassLessonTranslate({ ...tr[i].toJSON(), photo_url: initialPhoto });
                    }
                    prev.update({ translates: tr });
                    return prev.clone();
                  });
                }}
              />
            )}
          </Stack>
        )}
        
        {!fileItem?.file && photoUrl && (
          <Stack spacing={1.5}>
            <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <ImageComponent src={photoUrl} uid={uid} />
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {initialPhoto && (translation?.photo_url !== initialPhoto || translation?.photo_url === '') && (
                <ButtonCancel
                  disabled={state.processing}
                  icon={<IconPicture width={12} height={12} />}
                  label={t('reset-photo', { ns: NS_BUTTONS })}
                  size="small"
                  isAdmin={true}
                  onClick={() => {
                    setLessonEdit(prev => {
                      if (!prev) return lesson?.clone();
                      const tr = [...prev.translates];
                      const i = tr.findIndex(tx => tx?.lang === translation?.lang);
                      if (i >= 0 && tr[i]) {
                        tr[i] = new ClassLessonTranslate({ ...tr[i].toJSON(), photo_url: initialPhoto });
                      }
                      prev.update({ translates: tr });
                      return prev.clone();
                    });
                  }}
                />
              )}
              <ButtonConfirm
                isAdmin={true}
                icon={<IconRemove width={12} height={12} />}
                disabled={state.processing}
                label={t('remove-photo', { ns: NS_BUTTONS })}
                size="small"
                sx={{ bgcolor: 'var(--error)', '&:hover': { bgcolor: 'var(--error-dark)' } }}
                onClick={() => {
                  setLessonEdit(prev => {
                    if (!prev) return lesson?.clone();
                    const tr = [...prev.translates];
                    const i = tr.findIndex(tx => tx?.lang === langId);
                    if (i >= 0 && tr[i]) {
                      tr[i] = new ClassLessonTranslate({ ...tr[i].toJSON(), photo_url: '' });
                    }
                    prev.update({ translates: tr });
                    return prev.clone();
                  });
                }}
              />
            </Stack>
            <ButtonImportFiles
              disabled={state.processing}
              files={[]}
              setFiles={handleSetFile}
              supported_files={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value)}
            />
          </Stack>
        )}
        
        {fileItem?.file && (
          <Stack spacing={1.5}>
            <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <ImageComponent src={URL.createObjectURL(fileItem.file)} uid={lessonEdit?.uid || uid} />
            </Box>
            <Stack onClick={handleRemoveFile} direction={"row"} spacing={1} justifyContent={'center'} alignItems="center" sx={{ color: 'var(--error)', cursor: 'pointer' }}>
              <IconButton sx={{ background: 'rgba(0,0,0,0.75)', cursor: 'pointer' }}>
                <Icon color="red" icon="mdi:delete-outline" width="12" height="12" />
              </IconButton>
              <Typography>{`${ClassFile.formatFileName(fileItem.file.name)}`}</Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

function OnsiteLessonsListComponent() {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_LESSONS, NS_DASHBOARD_MENU]);
  const { lessons: lessonsTeacher } = useLessonTeacher();
  const { getOneUser } = useUsers();
  const { isMobile } = useUserDevice();
  const router = useRouter();
  const params = useParams();
  const { uid } = params;
  const { lesson } = useLesson();

  const GRID_COLUMNS_TEACHER = "minmax(0, 0.3fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.5fr) minmax(0, 1fr)";

  const cardSx = {
    bgcolor: "var(--card-color)",
    color: "var(--font-color)",
    borderRadius: 2,
    border: "1px solid var(--card-border)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    overflow: "hidden",
    mt: 2,
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
                  PAGE_ADMIN_UPDATE_ONE_LESSON_TEACHER(uid, lesson?.uid, lessonTeacher.uid)
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
                    {lesson?.title || lesson?.translate?.title}
                  </Typography>
                  {lesson?.subtitle && (
                    <Typography component="p" sx={subSx}>
                      {t(lesson.subtitle)}
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

export default function LessonAdminEditComponent({ renderAfterContent = null }) {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU, NS_LESSONS]);
  //const [lesson, setLesson] = useState(null);
  const { lesson } = useLesson();

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

  const contentSections = ["goals", "programs", "notes", "target_audiences", "materials", "prerequisites"];

  return (
    <Container disableGutters sx={{ width: "100%" }}>
      <Grid container spacing={1} sx={{ width: "100%" }}>
        {lesson?.uid && (
          <Grid size={12}>
            <EnabledBlock />
          </Grid>
        )}
        <Grid size={12}>
          <Box component="div" onClick={() => setOpenedView("infos")} sx={{ cursor: "pointer" }}>
            <AccordionComponent
            isAdmin={true}
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
            isAdmin={true}
              title={t("photos")}
              onChange={() => setOpenedView("photos")}
              expanded={openedView === "photos"}
            >
              <PhotosComponent />
            </AccordionComponent>
          </Box>
        </Grid>
        <Grid size={12} sx={{ mt: 1.5 }} spacing={1}>
<Stack spacing={1}>
<Typography variant="subtitle1" sx={{ fontWeight: 600, color: "var(--font-color)" }}>
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
              <Box component="div" onClick={() => setModeAccordion('tags')} sx={{ cursor: "pointer" }}>
                <CustomAccordionSubtitle
                  expanded={modeAccordion === 'tags'}
                  title={'tags'}
                  array_name={'tags'}
                />
              </Box>
            </Stack>
</Stack>
        </Grid>
        {renderAfterContent && (
          <Grid size={12} sx={{ mt: 1.5 }} spacing={1}>
            {renderAfterContent}
          </Grid>
        )}
        {lesson?.uid && (
          <Grid size={12} sx={{ mt: 3 }} spacing={1}>
            <Stack spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "var(--font-color)" }}>
                {t("onsite_lessons", { ns: ClassLesson.NS_COLLECTION }) || "Cours en présentiel"}
              </Typography>
              <LessonTeacherProvider uidSourceLesson={lesson.uid}>
                <OnsiteLessonsListComponent />
              </LessonTeacherProvider>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}