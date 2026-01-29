import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconArrowDown, IconArrowUp, IconCamera, IconCheck, IconPicture, IconRemove } from "@/assets/icons/IconsComponent";
import { ClassLesson, ClassLessonTeacher, ClassLessonTranslate } from "@/classes/ClassLesson";
import { languages, NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS, NS_LESSONS_ONE, NS_ROLES } from "@/contexts/i18n/settings";
import { Box, Chip, Container, Divider, Grid, IconButton, Paper, Stack, Typography, CircularProgress, Button } from "@mui/material";

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
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import AccordionComponent from "../dashboard/elements/AccordionComponent";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import { Icon } from "@iconify/react";
import { useUsers } from "@/contexts/UsersProvider";
import { ClassUser } from "@/classes/users/ClassUser";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useSession } from "@/contexts/SessionProvider";
import { ClassSession } from "@/classes/ClassSession";
import { PAGE_TEACHER_SESSIONS } from "@/contexts/constants/constants_pages";
import { getFormattedDateNumeric, getFormattedHour } from "@/contexts/functions";
import { ClassCountry } from "@/classes/ClassCountry";

const MIN_LENGTH_TITLE = 3;
const MAX_LENGTH_TITLE = 1_000;

const makeId = () => (crypto?.randomUUID?.() ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

const CustomAccordion = ({ expanded = false, title = "", subtitle = "", array_name = "", isAdmin = false, onChange = null }) => {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS]);
  const { lesson } = useLessonTeacher();
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
    "&:hover": { bgcolor: isAdmin ? "var(--warning-shadow-sm)" : "var(--primary-shadow)" },
  };

  return (
    <AccordionComponent title={t(title)} expanded={expanded} isAdmin={isAdmin} onChange={onChange}>
      <Box onClick={(e) => e.stopPropagation()}>
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
                color={`var(--${i>0 ? (isAdmin ? 'warning' : 'primary') : 'grey-light'})`}
                
                 />
                </Box>
                <Box onClick={()=>{
                  if(i<array.length-1) {
                    onMoveValue(i, i+1);
                  }
                }}>
                <IconArrowDown color={`var(--${i<array.length-1 ? (isAdmin ? 'warning' : 'primary') : 'grey-light'})`} />
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
                    isAdmin={isAdmin}
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
                      isAdmin={isAdmin}
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
              isAdmin={isAdmin}
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
            isAdmin={isAdmin}
          />
          <ButtonConfirm
            loading={state.processing}
            onClick={onSubmit}
            label={t("edit", { ns: NS_BUTTONS })}
            isAdmin={isAdmin}
          />
        </Stack>
      )}
      </Box>
    </AccordionComponent>
  );
}
const CustomAccordionSubtitle = ({ expanded = false, title = "", array_name = "", isAdmin = false, onChange = null }) => {
  const { t } = useTranslation([ClassLessonTeacher.NS_COLLECTION, NS_BUTTONS]);
  const { lesson } = useLessonTeacher();
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
    "&:hover": { bgcolor: "var(--primary-shadow)" },
  };
  return (
    <AccordionComponent title={t(title)} expanded={expanded} isAdmin={isAdmin} onChange={onChange}>
      <Box onClick={(e) => e.stopPropagation()}>
        <Stack spacing={1} alignItems="stretch" sx={{ py: 1.5, px: 1 }}>
          {array?.map?.((item, i) => {
            const orig = originalRef.current || [];
            const primaryColor = isAdmin ? 'warning' : 'primary';
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
                color={`var(--${i>0 ? primaryColor : 'grey-light'})`}
                
                 />
                </Box>
                <Box onClick={()=>{
                  if(i<array.length-1) {
                    onMoveValue(i, i+1);
                  }
                }}>
                <IconArrowDown color={`var(--${i<array.length-1 ? primaryColor : 'grey-light'})`} />
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
                    isAdmin={isAdmin}
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
                      isAdmin={isAdmin}
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
                isAdmin={isAdmin}
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
                isAdmin={isAdmin}
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
                background: 'var(--primary)',
                color: 'var(--background)',
                width: { xs: '25px', sm: '25px' },
                height: { xs: '25px', sm: '25px' },
                '&:hover': {
                  color: 'var(--background)',
                  backgroundColor: 'var(--primary)',
                  boxShadow: `0 0 0 0.2rem var(--primary-shadow-sm)`,
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
            isAdmin={isAdmin}
          />
          <ButtonConfirm
            loading={state.processing}
            disabled={state.processing || Object.keys(errors).length > 0}
            onClick={onSubmit}
            label={t("edit", { ns: NS_BUTTONS })}
            isAdmin={isAdmin}
          />
        </Stack>
      )}
      </Box>
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
function InfosComponent({ isAdmin = false }) {
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
                isAdmin={isAdmin}
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
                isAdmin={isAdmin}
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
                isAdmin={isAdmin}
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
                    isAdmin={isAdmin}
                  />
                  <ButtonConfirm
                    onClick={onSubmit}
                    loading={state.processing}
                    disabled={disabledButton}
                    label={t('edit', { ns: NS_BUTTONS })}
                    size="medium"
                    isAdmin={isAdmin}
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

function PhotosComponent({ isAdmin = false }) {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION]);
  const { lang } = useLanguage();
  const { lesson, getOneLesson } = useLessonTeacher();
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
              isAdmin={isAdmin}
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
            isAdmin={isAdmin}
          />
        </Grid>
        <Grid size={'auto'}>
          <ButtonConfirm loading={state.processing} disabled={state.processing || samePhotos} size="medium" label={t('edit', { ns: NS_BUTTONS })} onClick={onEdit} isAdmin={isAdmin} />
        </Grid>
      </Grid>
    </Grid>
  );
}
function DownloadPhotoComponent({ photoUrl = null, uid = '', file = null, setFile = null, isAdmin = false }) {
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
      borderColor: 'var(--primary)',
      bgcolor: 'var(--primary-shadow)',
      '& button': {
        borderColor: 'var(--primary)',
        bgcolor: 'rgba(17, 96, 229, 0.04)',
        color: 'var(--primary)',
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
              <Box sx={{ color: 'var(--primary)', p: 1 }}>
                <IconCamera width={32} height={32} />
              </Box>
              <ButtonCancel
                label={t('choose-photo')}
                icon={<Icon icon="material-symbols:upload" width="20" height="20" />}
                sx={{
                  border: '1px solid var(--card-border)',
                  color: 'var(--font-color)',
                  transition: 'border-color 0.2s, background 0.2s'
                }}
                isAdmin={isAdmin}
              />
            </>
          }
        </Stack>
      </Box>
    </Stack>
  </>)
}
function OnePhotoComponent({ index = -1, setSamePhotos = null, files = [], setFiles = null, lessonEdit = null, setLessonEdit = null, translations = [], translation = {}, isAdmin = false }) {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const { lesson } = useLessonTeacher();
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
            bgcolor: 'transparent',
            color: 'var(--font-color)',
            border: '0.1px solid var(--card-border)',
            '& .MuiChip-label': { px: 1.5 },
          }}
        />

        {!fileItem?.file && !photoUrl && (
          <Stack spacing={1.5}>
            <DownloadPhotoComponent file={fileItem?.file} setFile={handleSetFile} isAdmin={isAdmin} />
            {initialPhoto && (translation?.photo_url === '' || translation?.photo_url !== initialPhoto) && (
              <ButtonCancel
                disabled={state.processing}
                icon={<IconPicture width={12} height={12} />}
                label={t('reset-photo', { ns: NS_BUTTONS })}
                size="small"
                isAdmin={isAdmin}
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
                isAdmin={isAdmin}
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
              isAdmin={isAdmin}
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

function TeacherHighlightComponent() {
  const { lesson } = useLessonTeacher();
  const { getOneUser } = useUsers();
  const { t } = useTranslation([ClassLessonTeacher.NS_COLLECTION, ClassUser.NS_COLLECTION]);
  const pathname = usePathname();
  const isAdmin = pathname?.includes('/admin/');

  const teacher = lesson?.uid_teacher ? getOneUser(lesson.uid_teacher) : null;

  if (!teacher) return null;

  const teacherName = `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim();
  const description = teacher.bio || teacher.about_short || '';
  const tags = Array.isArray(teacher.tags) ? teacher.tags.slice(0, 6) : [];
  const roleLabel = teacher.role ? t(teacher.role, { ns: NS_ROLES }) : '';

  // Couleurs selon le contexte (admin ou teacher)
  const primaryColor = isAdmin ? "var(--warning)" : "var(--primary)";
  const adminColor = isAdmin ? "var(--admin)" : "var(--primary)";
  const primaryColorRgba = isAdmin ? "rgba(255, 152, 0, 0.15)" : "rgba(25, 118, 210, 0.15)";
  const primaryColorBorder = isAdmin ? "rgba(255, 152, 0, 0.3)" : "rgba(25, 118, 210, 0.3)";
  const primaryColorTag = isAdmin ? "rgba(255, 152, 0, 0.1)" : "rgba(25, 118, 210, 0.1)";
  const primaryColorTagBorder = isAdmin ? "rgba(255, 152, 0, 0.2)" : "rgba(25, 118, 210, 0.2)";

  const cardSx = {
    bgcolor: "var(--card-color)",
    color: "var(--font-color)",
    borderRadius: 2,
    border: "1px solid var(--card-border)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    p: 3,
    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  };

  return (
    <Box sx={cardSx}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "center", sm: "flex-start" }}>
        {/* Photo */}
        <Box sx={{ flexShrink: 0 }}>
          {teacher?.showAvatar?.({ size: 80, fontSize: '28px' })}
        </Box>

        {/* Informations */}
        <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
          {/* Nom */}
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--font-color)" }}>
              {teacherName}
            </Typography>
            
            {/* Role et role_title */}
            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
              {roleLabel && (
                <Chip
                  label={roleLabel}
                  size="small"
                  sx={{
                    bgcolor: primaryColorRgba,
                    color: primaryColor,
                    border: `1px solid ${primaryColorBorder}`,
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: "20px",
                  }}
                  variant="outlined"
                />
              )}
              {teacher.role_title && (
                <Typography variant="body2" sx={{ color: "var(--grey-light)", fontSize: "0.9rem" }}>
                  {teacher.role_title}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Email et Téléphone */}
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 0.5 }}>
            {teacher.email && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" sx={{ color: "var(--grey-light)", fontSize: "0.8rem", fontWeight: 600 }}>
                  {t('email', { ns: ClassUser.NS_COLLECTION })}:
                </Typography>
                <Link 
                  href={`mailto:${teacher.email}`}
                  style={{ 
                    fontSize: "0.8rem", 
                    color: adminColor,
                    textDecoration: "none"
                  }}
                >
                  {teacher.email}
                </Link>
              </Stack>
            )}
            {teacher.phone_number && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" sx={{ color: "var(--grey-light)", fontSize: "0.8rem", fontWeight: 600 }}>
                  {t('phone_number', { ns: ClassUser.NS_COLLECTION })}:
                </Typography>
                <Link 
                  href={`tel:${teacher.phone_number}`}
                  style={{ 
                    fontSize: "0.8rem", 
                    color: adminColor,
                    textDecoration: "none"
                  }}
                >
                  {teacher.phone_number}
                </Link>
              </Stack>
            )}
          </Stack>

          {/* Description complète */}
          {description && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: "var(--font-color)", 
                fontSize: "0.85rem",
                lineHeight: 1.6,
                opacity: 0.9,
                whiteSpace: "pre-line"
              }}
            >
              {description}
            </Typography>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    bgcolor: primaryColorTag,
                    color: primaryColor,
                    border: `1px solid ${primaryColorTagBorder}`,
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    height: "24px",
                  }}
                  variant="outlined"
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

function SessionsHighlightComponent() {
  const { sessions, isLoading } = useSession();
  const { t } = useTranslation([ClassSession.NS_COLLECTION]);
  const params = useParams();
  const { uid, uidSourceLesson, uidLesson } = params;

  const cardSx = {
    bgcolor: "var(--card-color)",
    color: "var(--font-color)",
    borderRadius: 2,
    border: "1px solid var(--card-border)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    p: 3,
    transition: "box-shadow 0.2s ease",
    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  };

  if (isLoading) {
    return (
      <Box sx={cardSx}>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--font-color)" }}>
            {t('sessions', { ns: ClassSession.NS_COLLECTION })}
          </Typography>
          <CircularProgress size={20} color="primary" />
        </Stack>
      </Box>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Box sx={cardSx}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--font-color)" }}>
              {t('sessions', { ns: ClassSession.NS_COLLECTION })}
            </Typography>
            <Link
              href={PAGE_TEACHER_SESSIONS(uid, uidSourceLesson, uidLesson)}
              style={{ textDecoration: 'none' }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "var(--primary)",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                {t('view_all', { ns: ClassSession.NS_COLLECTION })}
              </Typography>
            </Link>
          </Stack>
          <Divider />
          <Typography variant="body2" sx={{ color: "var(--grey)", textAlign: "center", py: 2 }}>
            {t('no_sessions', { ns: ClassSession.NS_COLLECTION })}
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={cardSx}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--font-color)" }}>
            {t('sessions', { ns: ClassSession.NS_COLLECTION })} ({sessions.length})
          </Typography>
          <Link
            href={PAGE_TEACHER_SESSIONS(uid, uidSourceLesson, uidLesson)}
            style={{ textDecoration: 'none' }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "var(--primary)",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" }
              }}
            >
              {t('view_all', { ns: ClassSession.NS_COLLECTION })}
            </Typography>
          </Link>
        </Stack>
        <Divider />
        <Grid container spacing={2}>
          {sessions.slice(0, 3).map((session) => {
            const firstSlot = session.slots?.[0];
            let startDate = null;
            let endDate = null;
            
            if (firstSlot?.start_date) {
              if (firstSlot.start_date.seconds) {
                startDate = new Date(firstSlot.start_date.seconds * 1000);
              } else if (firstSlot.start_date instanceof Date) {
                startDate = firstSlot.start_date;
              }
            }
            
            if (firstSlot?.end_date) {
              if (firstSlot.end_date.seconds) {
                endDate = new Date(firstSlot.end_date.seconds * 1000);
              } else if (firstSlot.end_date instanceof Date) {
                endDate = firstSlot.end_date;
              }
            }

            return (
              <Grid key={session.uid} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid var(--card-border)",
                    bgcolor: "var(--card-color)",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      borderColor: "var(--primary)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "var(--font-color)",
                          fontSize: "0.95rem"
                        }}
                        noWrap
                      >
                        {session.title || `${t('session', { ns: ClassSession.NS_COLLECTION })} #${session.uid_intern}`}
                      </Typography>
                      <Chip
                        label={session.status || 'DRAFT'}
                        size="small"
                        sx={{
                          bgcolor: session.status === ClassSession.STATUS.OPEN
                            ? "rgba(34, 197, 94, 0.12)"
                            : "rgba(0,0,0,0.05)",
                          color: session.status === ClassSession.STATUS.OPEN
                            ? "#15803D"
                            : "var(--grey)",
                          border: "1px solid var(--card-border)",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: "20px"
                        }}
                      />
                    </Stack>
                    {startDate && (
                      <Stack spacing={0.5}>
                        <Typography variant="caption" sx={{ color: "var(--grey)", fontSize: "0.75rem" }}>
                          {getFormattedDateNumeric(startDate)} {getFormattedHour(startDate)}
                          {endDate && ` - ${getFormattedHour(endDate)}`}
                        </Typography>
                      </Stack>
                    )}
                    {session.slots && session.slots.length > 0 && (
                      <Typography variant="caption" sx={{ color: "var(--grey)", fontSize: "0.75rem" }}>
                        {session.slots.length} {session.slots.length > 1 
                          ? t('slots_plural', { ns: ClassSession.NS_COLLECTION }) 
                          : t('slot', { ns: ClassSession.NS_COLLECTION })}
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
        {sessions.length > 3 && (
          <Stack alignItems="center" sx={{ pt: 1 }}>
            <Link
              href={PAGE_TEACHER_SESSIONS(uid, uidSourceLesson, uidLesson)}
              style={{ textDecoration: 'none' }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "var(--primary)",
                  cursor: "pointer",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                {t('view_more_sessions', { ns: ClassSession.NS_COLLECTION, count: sessions.length - 3 }) || `Voir ${sessions.length - 3} session(s) supplémentaire(s)`}
              </Typography>
            </Link>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

function PriceComponent({ isAdmin = false }) {
  const { t } = useTranslation([ClassLessonTeacher.NS_COLLECTION, NS_BUTTONS]);
  const { lesson } = useLessonTeacher();
  const [lessonEdit, setLessonEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    processing: false,
    text: ""
  });

  useEffect(() => {
    setLessonEdit(lesson?.clone());
  }, [lesson]);

  const samePrices = useMemo(() => {
    if (!lesson || !lessonEdit) return true;
    if (lesson?.price !== lessonEdit?.price) return false;
    if (lesson?.old_price !== lessonEdit?.old_price) return false;
    if (lesson?.currency !== lessonEdit?.currency) return false;
    return true;
  }, [lesson, lessonEdit]);

  const disabledButton = useMemo(() => {
    if (samePrices) return true;
    if (state.processing) return true;
    return false;
  }, [samePrices, state.processing]);

  const onChangeValue = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLessonEdit(prev => {
      if (!prev || prev === null) return lesson.clone();
      const numValue = name === 'currency' ? value : parseFloat(value) || 0;
      prev.update({ [name]: numValue });
      return prev.clone();
    });
  };

  const onClearValue = (name) => {
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLessonEdit(prev => {
      if (!prev || prev === null) return lesson.clone();
      const newValue = name === 'currency' ? ClassCountry.DEFAULT_CURRENCY : 0;
      prev.update({ [name]: newValue });
      return prev.clone();
    });
  };

  const onResetValue = (name) => {
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLessonEdit(prev => {
      if (!prev || prev === null) return lesson.clone();
      const lessonValue = lesson[name];
      prev.update({ [name]: lessonValue });
      return prev.clone();
    });
  };

  const onResetAllValues = () => {
    setLessonEdit(lesson?.clone());
    setErrors({});
  };

  const onSubmit = async () => {
    try {
      setState(prev => ({ ...prev, processing: true, text: "Traitement..." }));
      setState(prev => ({ ...prev, text: "Modification du prix..." }));
      const patched = await lessonEdit?.updateFirestore();
      setLessonEdit(patched);
    } catch (err) {
      setState(prev => ({ ...prev, processing: false, text: "" }));
    } finally {
      setState(prev => ({ ...prev, processing: false, text: "" }));
    }
  };

  const currencies = ClassCountry.CURRENCIES.map(currency => ({
    id: currency,
    value: currency
  }));

  return (
    <Stack spacing={2} sx={{ py: 1.5, px: 1 }}>
      <FieldComponent
        label={t('price')}
        type="number"
        name="price"
        value={lessonEdit?.price || 0}
        onChange={onChangeValue}
        onClear={() => onClearValue('price')}
        resetable={lesson?.price !== lessonEdit?.price}
        onCancel={() => onResetValue('price')}
        fullWidth
        disabled={state.processing}
        isAdmin={isAdmin}
        inputProps={{ min: 0, step: 0.01 }}
      />
      <FieldComponent
        label={t('old_price')}
        type="number"
        name="old_price"
        value={lessonEdit?.old_price || 0}
        onChange={onChangeValue}
        onClear={() => onClearValue('old_price')}
        resetable={lesson?.old_price !== lessonEdit?.old_price}
        onCancel={() => onResetValue('old_price')}
        fullWidth
        disabled={state.processing}
        isAdmin={isAdmin}
        inputProps={{ min: 0, step: 0.01 }}
      />
      <SelectComponentDark
        label={t('currency')}
        name="currency"
        value={lessonEdit?.currency || ClassCountry.DEFAULT_CURRENCY}
        values={currencies}
        onChange={onChangeValue}
        hasNull={false}
        disabled={state.processing}
      />
      {!samePrices && (
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
            isAdmin={isAdmin}
          />
          <ButtonConfirm
            loading={state.processing}
            onClick={onSubmit}
            disabled={disabledButton}
            label={t("edit", { ns: NS_BUTTONS })}
            isAdmin={isAdmin}
          />
        </Stack>
      )}
    </Stack>
  );
}

export default function LessonTeacherEditComponent({ isAdmin: propIsAdmin = null }) {
  const { t } = useTranslation([ClassLessonTeacher.NS_COLLECTION, NS_BUTTONS, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const pathname = usePathname();
  // Détection automatique du mode admin si la prop n'est pas fournie
  const isAdmin = propIsAdmin !== null ? propIsAdmin : (pathname?.includes('/admin/') || false);
  
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

  const contentSections = ["goals", "programs", "notes", "target_audiences", "materials", "prerequisites"];

  return (
    <Container disableGutters sx={{ width: "100%" }}>
      <Grid container spacing={1} sx={{ width: "100%" }}>
        <Grid size={12}>
            <AccordionComponent
              title={t("infos")}
              onChange={() => {
                if (openedView === "infos") {
                  setOpenedView("");
                } else {
                  setOpenedView("infos");
                  setModeAccordion("");
                }
              }}
              expanded={openedView === "infos"}
              isAdmin={isAdmin}
            >
              <Box onClick={(e) => e.stopPropagation()}>
                <InfosComponent isAdmin={isAdmin} />
              </Box>
            </AccordionComponent>
        </Grid>
        <Grid size={12}>
            <AccordionComponent
              title={t("photos")}
              onChange={() => {
                if (openedView === "photos") {
                  setOpenedView("");
                } else {
                  setOpenedView("photos");
                  setModeAccordion("");
                }
              }}
              expanded={openedView === "photos"}
              isAdmin={isAdmin}
            >
              <Box onClick={(e) => e.stopPropagation()}>
                <PhotosComponent isAdmin={isAdmin} />
              </Box>
            </AccordionComponent>
        </Grid>
        <Grid size={12}>
            <AccordionComponent
              title={t("price")}
              onChange={() => {
                if (openedView === "price") {
                  setOpenedView("");
                } else {
                  setOpenedView("price");
                  setModeAccordion("");
                }
              }}
              expanded={openedView === "price"}
              isAdmin={isAdmin}
            >
              <Box onClick={(e) => e.stopPropagation()}>
                <PriceComponent isAdmin={isAdmin} />
              </Box>
            </AccordionComponent>
        </Grid>
        <Grid size={12} sx={{ mt: 1.5 }} spacing={1}>
<Stack spacing={1}>
<Typography variant="subtitle1" sx={{ fontWeight: 600, color: "var(--font-color)" }}>
              {t("content")}
            </Typography>
            <Stack spacing={0.5}>
              {contentSections.map((item) => (
                <CustomAccordion
                  key={item}
                  expanded={modeAccordion === item}
                  title={item}
                  array_name={item}
                  isAdmin={isAdmin}
                  onChange={() => {
                    if (modeAccordion === item) {
                      setModeAccordion("");
                    } else {
                      setModeAccordion(item);
                      setOpenedView("");
                    }
                  }}
                />
              ))}
              <CustomAccordionSubtitle
                expanded={modeAccordion === 'tags'}
                title={'tags'}
                array_name={'tags'}
                isAdmin={isAdmin}
                onChange={() => {
                  if (modeAccordion === 'tags') {
                    setModeAccordion("");
                  } else {
                    setModeAccordion('tags');
                    setOpenedView("");
                  }
                }}
              />
            </Stack>
</Stack>
        </Grid>
      </Grid>
    </Container>
  );
}