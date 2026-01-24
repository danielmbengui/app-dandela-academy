import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconCamera } from "@/assets/icons/IconsComponent";
import { ClassLesson, ClassLessonTranslate } from "@/classes/ClassLesson";
import { languages, NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS, NS_LESSONS_ONE } from "@/contexts/i18n/settings";
import { Box, Chip, Container, Grid, IconButton, Stack, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import { useLesson } from "@/contexts/LessonProvider";
import { useLanguage } from "@/contexts/LangProvider";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import Image from "next/image";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import FieldComponent from "@/components/elements/FieldComponent";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import AccordionComponent from "../../dashboard/elements/AccordionComponent";
import ButtonCancel from "../../dashboard/elements/ButtonCancel";
import ButtonImportFiles from "@/components/elements/ButtonImportFiles";
import { ClassFile } from "@/classes/ClassFile";
import { ClassCountry } from "@/classes/ClassCountry";
import { ClassLang } from "@/classes/ClassLang";

const makeId = () => (crypto?.randomUUID?.() ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

const CustomAccordion = ({ expanded = false, title = "", array_name = "" }) => {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS]);
  const { lesson } = useLesson();
  const [lessonEdit, setLessonEdit] = useState(null);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [array, setArray] = useState([]);
  const [processing, setProcessing] = useState(false);
  const { lang } = useLanguage();
  const originalRef = useRef([]); // snapshot pour comparer/cancel
  const [newValue, setNewValue] = useState("");
  const [state, setState] = useState({
    processing: false,
    text: ""
  });
  //const [sameValues, setSameValues] = useState(true);
  useEffect(() => {
    setLessonEdit(lesson?.clone());
    const initial = Array.isArray(lesson?.[array_name])
      ? lesson[array_name]
      : [];
    //setArray([...lessonEdit?.translate?.[array_name]]);
    originalRef.current = initial;

    setArray(
      initial.map((val) => ({
        id: makeId(),
        value: val ?? "",
      }))
    );
  }, [lesson]);
  const sameValues = useMemo(() => {
    const current = array.map((r) => r.value);
    const original = lessonEdit?.[array_name] || [];
    // console.log("LEEEENGTH", current.length, original.length)
    if (current.length !== original.length) return false;
    for (let i = 0; i < current.length; i++) {
      if ((current[i] ?? "") !== (original[i] ?? "")) return false;
    }
    return true;
  }, [array]);
  const onChangeValue = useCallback((e, index) => {
    const value = e?.target?.value ?? "";
    console.log("OOOK", value, index);
    setArray((prev) =>
      prev.map((row, i) => (i === index ? { ...row, value } : row))
    );
    if (index < 0) {
      setNewValue(value);
    }
  }, []);
  const onClearValue = useCallback((index) => {
    //const value = e?.target?.value ?? "";
    console.log("OOOK", index);
    setArray((prev) =>
      prev.map((row, i) => (i === index ? { ...row, value: "" } : row))
    );
    if (index < 0) {
      setNewValue(prev => ({ ...prev, value: "" }));
    }
  }, []);
  const onResetValue = useCallback((index) => {
    //const value = e?.target?.value ?? "";
    //console.log("OOOK", value, index);
    const original = originalRef.current || [];
    setArray((prev) =>
      prev.map((row, i) => (i === index ? { ...row, value: original[i] } : row))
    );
  }, []);
  const onDeleteValue = useCallback((index) => {
    //const value = e?.target?.value ?? "";
    //console.log("OOOK", value, index);
    //const original = originalRef.current || [];
    //const initial = originalRef.current || [];
    //console.log("WEEESH", original.filter(uid=>uid!==id))

    const original = originalRef.current || [];
    const _array = original.filter((a, i) => i !== index).map((val) => ({
      id: makeId(),
      value: val ?? "",
    }));
    //  const current = array.map((r) => r.value);
    originalRef.current = _array.map((r) => r.value);
    setArray([..._array]);
    console.log("WEEESH", _array, array, original)
  }, []);
  const onAddValue = useCallback((value) => {
    //const value = e?.target?.value ?? "";
    //console.log("OOOK", value, index);
    //const original = originalRef.current || [];
    //const initial = originalRef.current || [];
    // const _lesson = lessonEdit?.clone();
    const original = originalRef.current || [];
    const _array = original.map((val) => ({
      id: makeId(),
      value: val ?? "",
    }));
    _array.push({ id: makeId(), value: value });
    //_array = [...values, newValue];
    //  const current = array.map((r) => r.value);
    originalRef.current = _array.map((r) => r.value);
    setArray(_array);
    setNewValue('');
    /*
    setLessonEdit(prev=>{
      if(!prev || prev ===null) return lesson?.clone();
      prev.update({[array_name]:_array.map(item=>item.value)});
      return prev.clone();
    })
    */
  }, []);
  const onResetAllValues = useCallback(() => {
    //const value = e?.target?.value ?? "";
    //console.log("OOOK", value, index);
    //const original = originalRef.current || [];
    /*
    setLessonEdit(prev=>{
      if(!prev || prev ===null) return lesson?.clone();
      prev.update({[array_name]:lesson?.[array_name]});
      return prev.clone();
    })
    */
    const original = lessonEdit?.[array_name] || [];
    originalRef.current = original;

    setArray(
      original.map((val) => ({
        id: makeId(),
        value: val ?? "",
      }))
    );
    setNewValue('');
  }, []);
  const onSubmit = async () => {
    try {
      setState(prev => ({ ...prev, processing: true, text: "Traitement..." }));
      //const uidLesson = lessonEd?.createFirestoreDocUid();
      setState(prev => ({ ...prev, text: 'Traductions des valeurs...' }));

      const transChapter = {
        [array_name]: array.map(a => a.value),
        //subtitle: lessonEdit?.subtitle,
        //description: lessonEdit?.description,
      }
      const qsChapter = encodeURIComponent(JSON.stringify(transChapter));
      const fetchTranslateChapter = await fetch(`/api/test?lang=${lang}&translations=${qsChapter}`);
      const resultChapter = await fetchTranslateChapter.json();
      const langsChapter = Object.keys(resultChapter);
      const translates = Object.values(resultChapter)?.map?.((trans, i) => new ClassLessonTranslate({ ...trans, lang: langsChapter[i] }));


      const actualTranslates = lessonEdit?.translates;
      const newTranslates = [...actualTranslates].map(trans => {
        const lang = trans.lang;
        const _translate = translates.find(t => t.lang === lang);
        console.log("translaaate tab", _translate, lang, trans)
        return new ClassLessonTranslate({ ...trans.toJSON(), [array_name]: _translate[array_name] })
      });
      //
      //lessonEdit?.update({ certified: l, translate:translate});
      console.log("translaaaaates actual", actualTranslates);
      console.log("translaaaaates NEW", newTranslates);
      const translate = newTranslates.find(trans => trans.lang === lang);
      lessonEdit?.update({ translates: newTranslates, translate: translate });
      setState(prev => ({ ...prev, text: 'Modification du cours...' }));
      const _patch = await lessonEdit?.updateFirestore();
      console.log("PATCH", _patch);
      setLessonEdit(_patch);
    } catch (error) {
      console.log("ERRROR", error);
    } finally {
      //setProcessing(false);
      setState(prev => ({ ...prev, processing: false, text: "" }));
    }
  }
  return (<AccordionComponent isAdmin={true} title={t(title)} expanded={expanded}>
    <Stack spacing={1.5} alignItems={'stretch'} sx={{ background: '', py: 1.5, px: 1 }}>
      {
        array?.map?.((item, i) => {
          const original = originalRef.current || [];
          //          console.log("MMMAAAP", original[i], item.value)

          return (<Grid key={`${item.id}`} container alignItems={'center'} justifyContent={'stretch'} sx={{ width: '100%' }} direction={'row'} spacing={1}>
            <Grid size={'auto'}>
              <Typography>{`${i + 1}.`}</Typography>
            </Grid>
            <Grid size={'grow'}>
              <FieldComponent
                isAdmin={true}
                index={i}
                disabled={processing}
                //label={`${i + 1}.`}
                type="multiline"
                name={`${item.id}`}
                value={item.value}
                fullWidth={true}
                minRows={1}
                maxRows={10}
                onChange={(e) => onChangeValue(e, i)}
                onClear={() => onClearValue(i)}
                resetable={original[i] !== item.value}
                onCancel={() => {
                  onResetValue(i);
                }}
                removable={!processing}
                onRemove={() => {
                  onDeleteValue(i);
                }}
              />

            </Grid>
            <Grid>
            </Grid>
          </Grid>)
        })
      }
      <Grid key={`create`} container alignItems={'center'} justifyContent={'stretch'} sx={{ width: '100%' }} direction={'row'} spacing={1}>
        <Grid size={'auto'}>
          <Typography>{`${array.length + 1}.`}</Typography>
        </Grid>
        <Grid size={'grow'}>
          <FieldComponent
            //index={i}
            isAdmin={true}
            disabled={processing}
            //label={`${i + 1}.`}
            type="multiline"
            name={`create`}
            value={newValue}
            fullWidth={true}
            minRows={1}
            maxRows={10}
            onChange={(e) => onChangeValue(e, -1)}
            onClear={() => onClearValue(-1)}
            //resetable={original[i] !== item.value}
            editable={newValue.length > 0}
            onSubmit={(e) => { onAddValue(newValue) }}
          />

        </Grid>
        <Grid>
        </Grid>
      </Grid>
    </Stack>
    {
      !sameValues && <Stack spacing={1} direction={'row'} alignItems={'center'} justifyContent={'end'} sx={{ p: 1 }}>
        <ButtonCancel
          isAdmin={true}
          onClick={onResetAllValues}
          disabled={state.processing}
          label={t('reset', { ns: NS_BUTTONS })} />
        <ButtonConfirm
          isAdmin={true}
          loading={state.processing}
          onClick={async () => {
            setProcessing(true);
            await onSubmit();
            setProcessing(false);
          }}
          label={t('edit', { ns: NS_BUTTONS })} />
      </Stack>
    }
  </AccordionComponent>)
}

function ImageComponent({ src = null, uid = '' }) {
  return (<Box sx={{ background: '', width: '100%' }}>
    <Image
      src={src}
      alt={`image-lesson-${uid}`}
      quality={100}
      width={300}
      height={150}
      //loading="lazy"
      priority
      style={{
        width: '100%',
        height: 'auto',
        maxHeight: '150px',
        //borderRadius: '8px',
        objectFit: 'contain',
      }}
    />
  </Box>)
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
    if (files.length > 0 || lesson?.photo_url !== lessonEdit?.photo_url) return false;
    return true;
  }, [lessonEdit, files.length]);
  const disabledButton = useMemo(() => {
    if (sameLessons) return true;
    if (!lessonEdit?.category) return true;
    if (!lessonEdit?.title) return true;
    if (!lessonEdit?.description) return true;
    return false;
  }, [lessonEdit, files.length]);
  const mustTranslate = useMemo(() => {
    if (lesson?.title !== lessonEdit?.title) return true;
    if (lesson?.subtitle !== lessonEdit?.subtitle) return true;
    if (lesson?.description !== lessonEdit?.description) return true;
    return false;
  }, [lessonEdit]);

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
      var lessonValue = lesson[name];
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
        const translate = translates.find(trans => trans.lang === lang);
        lessonEdit?.update({ translates: translates, translate: translate });
      }
      //lessonEdit?.update({ certified: l, translate:translate});
      console.log("translaaaaates", lessonEdit);
      setState(prev => ({ ...prev, text: 'Modification du cours...' }));
      const _patch = await lessonEdit?.updateFirestore();
      console.log("PATCH", _patch);
      //setLessonEdit(_patch);
    } catch (error) {
      console.log("ERRROR", error);
    } finally {
      //setProcessing(false);
      setState(prev => ({ ...prev, processing: false, text: "" }));
    }
  }

  return (<>
    <Grid size={12}>
      <div className="card">
        <Grid container spacing={{ xs: 1, sm: 3 }}>
          <Grid size={{ xs: 12, sm: 7 }}>
            <Stack spacing={1.5}>
              <Stack alignItems={'start'}>
                <SelectComponentDark
                  required
                  name={'category'}
                  label={t('category')}
                  value={lessonEdit?.category}
                  values={ClassLesson.ALL_CATEGORIES.map(category => ({
                    id: category,
                    value: t(category)
                  }))}
                  onChange={onChangeValue}
                  hasNull={false}
                  disabled={state.processing}
                />
              </Stack>
              <FieldComponent
                isAdmin={true}
                label={t('title')}
                required
                type="text"
                name={'title'}
                value={lessonEdit?.title}
                onChange={onChangeValue}
                onClear={() => onClearValue('title')}
                resetable={lesson?.title !== lessonEdit?.title}
                onCancel={() => {
                  onResetValue('title')
                }}
                fullWidth
                disabled={state.processing}
              />
              <FieldComponent
                isAdmin={true}
                label={t('subtitle')}
                type="text"
                name={'subtitle'}
                value={lessonEdit?.subtitle}
                onChange={onChangeValue}
                onClear={() => onClearValue('subtitle')}
                resetable={lesson?.subtitle !== lessonEdit?.subtitle}
                onCancel={() => {
                  onResetValue('subtitle')
                }}
                disabled={state.processing}
              />
              <FieldComponent
                isAdmin={true}
                label={t('description')}
                required
                type="multiline"
                fullWidth
                name={'description'}
                value={lessonEdit?.description}
                onChange={onChangeValue}
                onClear={() => onClearValue('description')}
                minRows={1}
                maxRows={10}
                resetable={lesson?.description !== lessonEdit?.description}
                onCancel={() => {
                  onResetValue('description')
                }}
                disabled={state.processing}
              />
              <Stack>
                <Stack direction={'row'} alignItems={'center'} spacing={1}>
                  <CheckboxComponent
                    isAdmin={true}
                    name={'certified'}
                    disabled={state.processing}
                    //value={lessonEdit?.certified}
                    required
                    checked={lessonEdit?.certified || false}
                    type="checkbox"
                    label={t('certified')}
                    onChange={onChangeValue}
                  />
                </Stack>
              </Stack>
              {
                <Stack alignItems={'center'} direction={'row'} spacing={1} sx={{ color: 'var(--font-color)' }}>
                  <ButtonCancel
                    isAdmin={true}
                    onClick={() => {
                      setLessonEdit(lesson?.clone());
                      setFiles([]);
                    }}
                    loading={state.processing}
                    disabled={sameLessons}
                    label={t('reset', { ns: NS_BUTTONS })}
                    size="medium" />
                  <ButtonConfirm isAdmin={true} onClick={onSubmit} loading={state.processing} disabled={disabledButton} label={t('edit', { ns: NS_BUTTONS })} size="medium" />
                  <>
                    {
                      state.processing && <Typography>{state.text}</Typography>
                    }
                  </>
                </Stack>
              }
            </Stack>
          </Grid>
        </Grid>
      </div>
    </Grid>
    <style jsx>{`
          .card {
            background: var(--card-color);
            color: var(--font-color);
              color: var(--grey-light);
            border-radius: 16px;
            padding: 14px 14px 16px;
            width:100%;
          }
          .card h2 {
            margin: 0 0 10px;
            font-size: 1.05rem;
          }
          .card .content {
            background: var(--card-color);
            color: var(--font-color);
              color: var(--grey-light);
            border-radius: 16px;
            padding: 14px 14px 16px;
            border: 1px solid red;
          }
          .card .content h2 {
            color:red;
            margin: 0 0 10px;
            font-size: 1.05rem;
          }
      `}</style>
  </>)
}
function PhotosComponent() {
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
    if (files.length > 0 || lesson?.photo_url !== lessonEdit?.photo_url) return false;
    return true;
  }, [lessonEdit, files.length]);
  const disabledButton = useMemo(() => {
    if (sameLessons) return true;
    if (!lessonEdit?.category) return true;
    if (!lessonEdit?.title) return true;
    if (!lessonEdit?.description) return true;
    return false;
  }, [lessonEdit, files.length]);
  const mustTranslate = useMemo(() => {
    if (lesson?.title !== lessonEdit?.title) return true;
    if (lesson?.subtitle !== lessonEdit?.subtitle) return true;
    if (lesson?.description !== lessonEdit?.description) return true;
    return false;
  }, [lessonEdit]);
  const translations = useMemo(() => {
    return lessonEdit?.translates?.sort((a,b)=>{
      if(a.lang === lang) return -1;
      
      return t(a.lang, {ns:NS_LANGS}).localeCompare(t(b.lang, {ns:NS_LANGS}));
    }) || [];
  }, [lessonEdit]);

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
      var lessonValue = lesson[name];
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
        const translate = translates.find(trans => trans.lang === lang);
        lessonEdit?.update({ translates: translates, translate: translate });
      }
      //lessonEdit?.update({ certified: l, translate:translate});
      console.log("translaaaaates", lessonEdit);
      setState(prev => ({ ...prev, text: 'Modification du cours...' }));
      const _patch = await lessonEdit?.updateFirestore();
      console.log("PATCH", _patch);
      //setLessonEdit(_patch);
    } catch (error) {
      console.log("ERRROR", error);
    } finally {
      //setProcessing(false);
      setState(prev => ({ ...prev, processing: false, text: "" }));
    }
  }

  return (<>
    <Grid size={12}>
      <div className="card">
        <Grid container spacing={{ xs: 1, sm: 3 }}>
          {
            translations.map((translation,i)=>{
              return(          <Grid key={i}>
            <OnePhotoComponent translation={translation} lessonEdit={lessonEdit} />
          </Grid>)
            })
          }
        </Grid>
      </div>
    </Grid>
    <style jsx>{`
          .card {
            background: var(--card-color);
            color: var(--font-color);
              color: var(--grey-light);
            border-radius: 16px;
            padding: 14px 14px 16px;
            width:100%;
          }
          .card h2 {
            margin: 0 0 10px;
            font-size: 1.05rem;
          }
          .card .content {
            background: var(--card-color);
            color: var(--font-color);
              color: var(--grey-light);
            border-radius: 16px;
            padding: 14px 14px 16px;
            border: 1px solid red;
          }
          .card .content h2 {
            color:red;
            margin: 0 0 10px;
            font-size: 1.05rem;
          }
      `}</style>
  </>)
}

function OnePhotoComponent({ lessonEdit = null,translation={} }) {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const [files, setFiles] = useState([]);
  const { lesson } = useLesson();
  const [state, setState] = useState({
    processing: false,
    text: ""
  });

  useEffect(() => {
   // setLessonEdit(lesson?.clone());
  }, [lesson]);
  const sameLessons = useMemo(() => {
    if (files.length > 0 || lesson?.photo_url !== lessonEdit?.photo_url) return false;
    return true;
  }, [lessonEdit, files.length]);
  const disabledButton = useMemo(() => {
    if (sameLessons) return true;
    if (!lessonEdit?.category) return true;
    if (!lessonEdit?.title) return true;
    if (!lessonEdit?.description) return true;
    return false;
  }, [lessonEdit, files.length]);

  const {photoUrl,uid, lang} = useMemo(()=>{
    const photoUrl=translation?.photo_url || null;
    const uid = `photo-${translation?.lang}`;
    const lang = ClassLang.getOneLang(translation?.lang);
    return{
      photoUrl,
      uid,lang
    };
  }, [translation]);

  return (<Stack alignItems={'center'} sx={{ height: '70%', background: '' }} spacing={1}>
    <Chip label={`${lang.id} ${lang.flag_str} ${t(lang.id, {ns:NS_LANGS})}`} />
    {
      files.length === 0 && <>
        {
          photoUrl && <>
            <ImageComponent src={photoUrl} uid={uid} />
            <ButtonConfirm
              isAdmin={true}
              disabled={state.processing}
              label={t('remove-photo', { ns: NS_BUTTONS })}
              sx={{ background: 'var(--error)' }}
              onClick={() => {
                /*
                setLessonEdit(prev => {
                  if (!prev || prev === null) return lesson?.clone();
                  prev.update({ photo_url: '' });
                  return prev.clone();
                })
                */
              }}
            />
          </>
        }
        {
          !lessonEdit?.photo_url && <>
            <Box sx={{ color: 'var(--admin)', border: `0.1px solid var(--admin)`, p: 3, borderRadius: '50%' }}>
              <IconCamera width={30} height={30} />
            </Box>
            {
              lesson?.photo_url && <ButtonConfirm
                isAdmin={true}
                label={t('reset-photo', { ns: NS_BUTTONS })}
                disabled={state.processing}
                onClick={() => {
                  setLessonEdit(prev => {
                    if (!prev || prev === null) return lesson?.clone();
                    prev.update({ photo_url: lesson?.photo_url });
                    return prev.clone();
                  })
                }}
              />
            }
          </>
        }

      </>
    }
    {
      files.length > 0 && <ImageComponent src={URL.createObjectURL(files[0])} uid={lessonEdit?.uid} />
    }


    <ButtonImportFiles
      disabled={state.processing}
      files={files}
      setFiles={setFiles}
      supported_files={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value)}
      isAdmin={true}
    />
  </Stack>)
}

export default function LessonEditComponent() {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  //const [lesson, setLesson] = useState(null);
  const { lesson } = useLesson();

  const [lessonEdit, setLessonEdit] = useState(null);
  const [modeAccordion, setModeAccordion] = useState('');

  const [openedView, setOpenedView] = useState('');

  useEffect(() => {
    setLessonEdit(lesson?.clone());
    console.log("lesson component", lesson, lesson?.clone())
  }, [lesson]);

  return (<>
    <Container disableGutters sx={{ width: '100%' }}>
      <Grid container spacing={1} sx={{ width: '100%', background: '' }}>
        <Grid size={12}>
          <div onClick={() => {
            setOpenedView('infos')
            // alert(item)
          }}>
            <AccordionComponent
              isAdmin={true}
              title={t('infos')}
              onChange={() => {
                //setOpenedView('infos')
              }}
              expanded={openedView === 'infos'}
            >
              <InfosComponent />
            </AccordionComponent>
          </div>
        </Grid>
        <Grid size={12}>
          <div onClick={() => {
            setOpenedView('photos')
            // alert(item)
          }}>
            <AccordionComponent
              isAdmin={true}
              title={t('photos')}
              onChange={() => {
                //setOpenedView('infos')
              }}
              expanded={openedView === 'photos'}
            >
              <PhotosComponent />
            </AccordionComponent>
          </div>
        </Grid>

        <Grid size={12}>
          <Stack spacing={1}>
            <div className="card">
              <h2>{t('content')}</h2>
              <Stack spacing={0.5}>
                {
                  ['goals', 'programs', 'notes', 'target_audiences', 'prerequisites', 'tags'].map((item, i) => {
                    return (<div key={`${item}`} onClick={() => {
                      setModeAccordion(item);
                      // alert(item)
                    }} >
                      <CustomAccordion
                        expanded={modeAccordion === item}
                        lessonEdit={lessonEdit}
                        setLessonEdit={setLessonEdit}
                        title={item}
                        array_name={item} />
                    </div>)
                  })
                }
              </Stack>


            </div>
          </Stack>
        </Grid>
      </Grid>
    </Container>
    <style jsx>{`

                .hero-description {
                  margin: 6px 0 10px;
                  font-size: 0.9rem;
                  color: var(--font-color);
                  max-width: 620px;
                }
        
                .header {
                  display: flex;
                  justify-content: space-between;
                  gap: 16px;
                  margin-bottom: 22px;
                  flex-wrap: wrap;
                }
        
                .hero-card {
                  display: grid;
                  grid-template-columns: minmax(0, 2fr) minmax(260px, 1.2fr);
                  gap: 18px;
                  border-radius: 18px;
                  border: 1px solid #1f2937;
                  border: transparent;
                  background: radial-gradient(circle at top left, #111827, #020617);
                  background: var(--card-color);
                  padding: 18px 18px 20px;
                  margin-bottom: 10px;
                }
        
                @media (max-width: 900px) {
                  .hero-card {
                    grid-template-columns: 1fr;
                  }
                }
        
                .hero-meta {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 8px;
                }
        
                .hero-right {
                  border-radius: 14px;
                  border: 1px solid #1f2937;
                  border: none;
                  background: #020617;
                  background: transparent;
                  padding: 14px 14px 16px;
                   padding: 0px;
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                }
                .hero-right-top {
                  border-radius: 14px;
                  border: 0.1px solid var(--card-border);
                  padding: 10px 10px 12px;
                  padding: 15px;
                }
                .teacher-card {
                  margin-top: 8px;
                  border-radius: 10px;
                  border: 1px solid #111827;
                  border: 0.1px solid var(--card-border);
                  padding: 10px 10px 12px;
                  padding: 15px;
                  background: radial-gradient(circle at top left, #111827, #020617);
                  background: transparent;
                  font-size: 0.85rem;
                   
                }
        
                .teacher-label {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: #9ca3af;
                }
        
                .teacher-main {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-bottom: 6px;
                }
        
                .teacher-text {
                  font-size: 0.83rem;
                }
        
                .teacher-name {
                  margin: 0;
                  font-weight: 500;
                  line-height: 1rem;
                }
        
                .teacher-role {
                  margin: 0;
                  color: var(--grey-light);
                  font-size: 0.78rem;
                }
        
                .teacher-bio {
                  margin: 4px 0 4px;
                  font-size: 0.8rem;
                  color: var(--font-color);
                }
        
                .teacher-email {
                  margin: 0 0 6px;
                  font-size: 0.78rem;
                  color: var(--grey-light);
                }
        
                .teacher-email span {
                  color: var(--grey-light);
                }
                .hero-seats {
                  margin-top: 6px;
                  font-size: 0.85rem;
                }
                .seats-sub {
                  margin: 2px 0 4px;
                  font-size: 0.78rem;
                  color: #9ca3af;
                }
                .seats-bar {
                  width: 100%;
                  height: 7px;
                  border-radius: 999px;
                  background: #020617;
                  border: 1px solid #111827;
                  border: 1px solid var(--card-bord);
                  background: linear-gradient(90deg, #22c55e, #16a34a);
                  overflow: hidden;
                }
        
                .seats-fill {
                  height: 100%;
                  background: linear-gradient(90deg, #22c55e, #16a34a);
                  background: red;
                }
        
                .breadcrumb {
                  margin: 0 0 4px;
                  font-size: 0.75rem;
                  color: #6b7280;
                }
        
                h1 {
                  margin: 0;
                  font-size: 1.5rem;
                  line-height: 1.5rem;
                }
        
                .muted {
                  margin-top: 5px;
                  font-size: 0.9rem;
                  color: #9ca3af;
                }
        
                .badges {
                  margin-top: 10px;
                  display: flex;
                  gap: 5px;
                  flex-wrap: wrap;
                }
        
                .badge-format {
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  border-radius: 999px;
                  border-width: 1px;
                  border-style: solid;
                  padding: 2px 9px;
                  font-size: 0.8rem;
                  background: #020617;
                }
        
                .badge-dot {
                  width: 7px;
                  height: 7px;
                  border-radius: 999px;
                }
        
                .badge-cert {
                  border-radius: 999px;
                  padding: 2px 10px;
                  font-size: 0.8rem;
                  background: #022c22;
                  background: transparent;
                  color: #bbf7d0;
                  color: var(--font-color);
                  border: 0.1px solid #16a34a;
                }
        
                .enroll-card {
                  background: var(--card-color);
                  border-radius: 10px;
                  padding: 16px 16px 18px;
                  border: 1px solid var(--card-color);
                  
                  min-width: 260px;
                  max-width: 320px;
                }
        
                .price {
                  margin: 0;
                  font-size: 1.7rem;
                  font-weight: 600;
                }
        
                .currency {
                  font-size: 1rem;
                  color: #9ca3af;
                  margin-left: 4px;
                }
        
                .price-helper {
                  margin: 4px 0 0;
                  font-size: 0.8rem;
                  color: #9ca3af;
                }
        
                .installments {
                  margin: 8px 0 0;
                  font-size: 0.8rem;
                  color: #e5e7eb;
                }
        
                .dates {
                  display: flex;
                  gap: 12px;
                  margin-top: 10px;
                  font-size: 0.85rem;
                }
        
                .date-label {
                  margin: 0;
                  font-size: 0.75rem;
                  color: #9ca3af;
                }
        
                .date-value {
                  margin: 2px 0 0;
                }
        
                .seats {
                  margin-top: 10px;
                  font-size: 0.85rem;
                }
        
                .seats-line {
                  margin: 0;
                }
        
                .seats-left {
                  margin: 2px 0 0;
                  font-size: 0.78rem;
                  color: #9ca3af;
                }
        
                .btn {
                  border-radius: 999px;
                  padding: 8px 14px;
                  border: 1px solid #374151;
                  background: #020617;
                  color: #e5e7eb;
                  font-size: 0.9rem;
                  cursor: pointer;
                }
        
                .primary {
                  background: linear-gradient(135deg, #2563eb, #4f46e5);
                  border-color: transparent;
                }
        
                .btn-enroll {
                  width: 100%;
                  margin-top: 12px;
                }
        
                .btn-disabled {
                  background: #111827;
                  cursor: not-allowed;
                }
        
                .secure-note {
                  margin: 8px 0 0;
                  font-size: 0.75rem;
                  color: #9ca3af;
                }
        
                .grid {
                  display: grid;
                  grid-template-columns: minmax(0, 2.5fr) minmax(0, 2.5fr);
                  gap: 16px;
                  margin-bottom: 30px;
                }
        
                @media (max-width: 900px) {
                  .header {
                    flex-direction: column;
                  }
                  .enroll-card {
                    max-width: 100%;
                    width: 100%;
                  }
                  .grid {
                    grid-template-columns: 1fr;
                  }
                }
        
                .main-col,
                .side-col {
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                }
        
                .card {
                  background: var(--card-color);
                  color: var(--font-color);
                    color: var(--grey-light);
                  border-radius: 16px;
                  padding: 14px 14px 16px;
                  width:100%;
                }
                .card h2 {
                  margin: 0 0 10px;
                  font-size: 1.05rem;
                }
                .card .content {
                  background: var(--card-color);
                  color: var(--font-color);
                    color: var(--grey-light);
                  border-radius: 16px;
                  padding: 14px 14px 16px;
                  border: 1px solid red;
                }
        
                .card .content h2 {
                  color:red;
                  margin: 0 0 10px;
                  font-size: 1.05rem;
                }
        
                .description {
                  margin: 0;
                  padding-left: 10px;
                  font-size: 0.9rem;
                  color: var(--grey-light);
                  color: var(--font-color);
                }
        
                .list {
                  margin: 0;
                  padding-left: 18px;
                  font-size: 0.88rem;
                            color: var(--grey-light);
                              color: var(--font-color);
                }
        
                .list li {
                  margin-bottom: 4px;
                }
        
                .list.ordered {
                  padding-left: 20px;
                }
        
                .list.small {
                  font-size: 0.8rem;
                }
        
                .cert-main {
                  margin: 0 0 8px;
                  font-size: 0.9rem;
                  color: var(--font-color);
                }
        
                .cert-badge {
                  margin-top: 8px;
                  font-size: 0.8rem;
                  padding: 4px 8px;
                  border-radius: 8px;
                  background: #022c22;
                  color: #bbf7d0;
                  border: 1px solid #16a34a;
                }
              `}</style>
  </>);
}