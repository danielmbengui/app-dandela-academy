import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { IconLessons, IconRemove, IconReset, IconStudents, IconVisible } from "@/assets/icons/IconsComponent";
import { ClassLesson, ClassLessonTranslate } from "@/classes/ClassLesson";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { formatDuration, formatPrice, getFormattedDate, getFormattedDateCompleteNumeric, getFormattedDateNumeric, getFormattedHour, translateWithVars } from "@/contexts/functions";
import { languages, NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS, NS_LESSONS_ONE } from "@/contexts/i18n/settings";
import { Box, Button, Grid, IconButton, Stack, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import { useLesson } from "@/contexts/LessonProvider";
import { ClassColor } from "@/classes/ClassColor";
import BadgeFormatLesson from "@/components/dashboard/lessons/BadgeFormatLesson";
import { useLanguage } from "@/contexts/LangProvider";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import Image from "next/image";
import BadgeStatusLesson from "@/components/dashboard/lessons/BadgeStatusLesson";
import { useAuth } from "@/contexts/AuthProvider";
import { ClassUserIntern } from "@/classes/users/ClassUser";
import { SCHOOL_NAME, WEBSITE_NAME } from "@/contexts/constants/constants";
import { ClassSession } from "@/classes/ClassSession";
import { useSession } from "@/contexts/SessionProvider";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import { ClassLang } from "@/classes/ClassLang";
import FieldComponent from "@/components/elements/FieldComponent";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import AccordionComponent from "../elements/AccordionComponent";
import ButtonCancel from "../elements/ButtonCancel";

const initialCourse = {
  id: "course_excel_101",
  title: "Excel – Compétences essentielles pour le travail",
  code: "EXCEL-101",
  category: ClassLesson.CATEGORY.OFFICE,
  level: "Débutant",
  level: ClassLesson.LEVEL.BEGINNER,
  language: "Français",
  lang: "pt",
  format: "onsite", // "online" | "onsite" | "hybrid"
  uid_room: "MsIyd1hZKq8l8ayzFS88",
  isCertified: true,
  certified: true,
  certificateProvider: "Dandela Academy",
  isOfficialCertificate: true,
  price: 290,
  currency: "CHF",
  hasInstallments: true,
  installmentExample: "2 x 150 CHF",
  startDate: "2025-03-10",
  endDate: "2025-04-05",
  start_date: new Date(2025, 2, 10),
  end_date: new Date(2025, 3, 5),
  durationHours: 24,
  duration: 16,
  sessionsPerWeek: 2,
  sessions_count: 1,
  sessions_type: 'weekly',
  scheduleText: "Mardi & Jeudi • 18:30 – 20:30",
  //location: "Campus central – Salle 3",
  onlinePlatform: "Classe virtuelle Dandela (via navigateur)",
  seatsTotal: 20,
  seatsTaken: 12,
  seats_availables: 34,
  seats_taken: 19,
  description:
    "Maîtrise les bases d’Excel pour être opérationnel au travail : formules, mises en forme, tableaux, graphiques et bonnes pratiques pour gagner du temps au quotidien.",
  objectives: [
    "Comprendre l’interface et la logique d’Excel",
    "Créer et mettre en forme des tableaux professionnels",
    "Utiliser les formules de base (SOMME, MOYENNE, SI, NB.SI, etc.)",
    "Concevoir des graphiques clairs et lisibles",
    "Gagner du temps grâce aux formats conditionnels et aux filtres",
  ],
  goals: [
    "Comprendre l’interface et la logique d’Excel",
    "Créer et mettre en forme des tableaux professionnels",
    "Utiliser les formules de base (SOMME, MOYENNE, SI, NB.SI, etc.)",
    "Concevoir des graphiques clairs et lisibles",
    "Gagner du temps grâce aux formats conditionnels et aux filtres",
  ],
  targetAudience: [
    "Personnes en reconversion ou en recherche d’emploi",
    "Professionnels souhaitant consolider leurs bases en bureautique",
    "Étudiants ou stagiaires qui utilisent Excel dans leurs études",
  ],
  target_audiences: [
    "Personnes en reconversion ou en recherche d’emploi",
    "Professionnels souhaitant consolider leurs bases en bureautique",
    "Étudiants ou stagiaires qui utilisent Excel dans leurs études",
  ],
  prerequisites: [
    "Savoir utiliser un ordinateur (souris, clavier, navigation simple)",
    "Aucun prérequis sur Excel n’est nécessaire",
  ],
  programOutline: [
    "Introduction à Excel & prise en main de l’interface",
    "Création et mise en forme de tableaux",
    "Formules et fonctions essentielles",
    "Tri, filtres et mises en forme conditionnelles",
    "Graphiques et visualisation de données",
    "Mise en pratique sur un mini-projet",
  ],
  programs: [
    "Introduction à Excel & prise en main de l’interface",
    "Création et mise en forme de tableaux",
    "Formules et fonctions essentielles",
    "Tri, filtres et mises en forme conditionnelles",
    "Graphiques et visualisation de données",
    "Mise en pratique sur un mini-projet",
  ],
  notes: [
    "Une version récente d'Excel est recommandée (2016+ ou Microsoft 365).",
    "En cas d'absence, certaines sessions pourront être rattrapées via la plateforme en ligne.",
    "Le support de cours (PDF, fichiers Excel d&apos;exercices) sera accessible dans ton espace personnel."
  ]
};

const FORMAT_CONFIG = {
  online: {
    label: "En ligne",
    color: "#3b82f6",
  },
  onsite: {
    label: "Présentiel",
    color: "#22c55e",
  },
  hybrid: {
    label: "Hybride",
    color: "#a855f7",
  },
};
function MetaChip({ label, value }) {
  return (
    <>
      <div className="meta-chip">
        <span className="meta-label">{label}</span>
        <span className="meta-value">{value}</span>
      </div>

      <style jsx>{`
        .meta-chip {
          border-radius: 999px;
          border: 0.1px solid var(--card-border);
          background: #020617;
          background: transparent;
          padding: 4px 10px;
          font-size: 0.78rem;
          display: inline-flex;
          gap: 6px;
        }

        .meta-label {
          color: #9ca3af;
          color: var(--font-color);
        }

        .meta-value {
          color: var(--font-color);
          color: #9ca3af;
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
/** Petit composant pour les lignes d'info à droite */
function InfoRow({ label, value }) {
  return (
    <>
      <div className="info-row">
        <span className="info-label">{label}</span>
        <span className="info-value">{value}</span>
      </div>

      <style jsx>{`
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          padding: 4px 0;
          border-bottom: 0.1px solid var(--card-border);
          width: 100%;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
         color: var(--font-color);
        }

        .info-value {
          text-align: right;
           color: var(--grey-dark);
            font-weigth: 100;
        }
      `}</style>
    </>
  );
}
function SlotRow({ session = null, slot = null }) {
  const { sessions, setUidSession, setUidSlot, slots } = useSession();
  const colorSlot = slot?.start_date?.getTime() >= new Date() ? 'green' : 'red';
  return (<Stack key={`${slot?.uid_session}-${slot?.uid_intern}`} alignItems={'center'} spacing={1} direction={'row'}>
    <span style={{
      width: '6px',
      height: '6px',
      borderRadius: '999px',
      background: colorSlot,
      boxShadow: colorSlot === 'green' ? '0 0 8px green' : '',
    }} />
    <Typography sx={{ fontSize: '0.9rem' }}>{`${session?.title} (${slot?.uid_intern})`}</Typography>
    <Typography variant="caption">{`${getFormattedDateNumeric(slot?.start_date)} ${getFormattedHour(slot?.start_date)}-${getFormattedHour(slot?.end_date)}`}</Typography>
    {
      colorSlot === 'green' && <Box
        onClick={() => {
          setUidSession(session?.uid);
          setUidSlot(slot?.uid_intern);
        }}
        sx={{
          //color: 'red',
          cursor: 'pointer',
          "&:hover": { color: "var(--primary)" },
        }}>
        <IconVisible height={20} />
      </Box>
    }
  </Stack>)
}
const makeId = () => (crypto?.randomUUID?.() ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

const CustomAccordion = ({ expanded = false, lessonEdit = null, title = "", array_name = "" }) => {
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const [array, setArray] = useState([]);
  const [processing, setProcessing] = useState(false);
  const { lang } = useLanguage();
  const originalRef = useRef([]); // snapshot pour comparer/cancel
  const [newValue, setNewValue] = useState("");
  //const [sameValues, setSameValues] = useState(true);
  useEffect(() => {
    const initial = Array.isArray(lessonEdit?.[array_name])
      ? lessonEdit[array_name]
      : [];
    //setArray([...lessonEdit?.translate?.[array_name]]);
    originalRef.current = initial;

    setArray(
      initial.map((val) => ({
        id: makeId(),
        value: val ?? "",
      }))
    );
  }, [])
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
    const name = e?.target?.name ?? "";
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
    const _lesson = lessonEdit.clone();

    console.log("WEEESH 1", value, _lesson)

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
    console.log("WEEESH", _array, original)
  }, []);
  const onResetAllValues = useCallback(() => {
    //const value = e?.target?.value ?? "";
    //console.log("OOOK", value, index);
    //const original = originalRef.current || [];
    const original = lessonEdit?.translate?.[array_name] || [];
    originalRef.current = original;

    setArray(
      original.map((val) => ({
        id: makeId(),
        value: val ?? "",
      }))
    );
    setNewValue('');
  }, []);
  const onSubmit = useCallback(async () => {
    //const value = e?.target?.value ?? "";
    //console.log("OOOK", value, index);
    const original = originalRef.current || [];
    //const initial = originalRef.current || [];
    const _lesson = lessonEdit.clone();
    console.log("WEEESH 1", _lesson, original);
    //const result = await fetch(`/api/test?lang=${lang}&translations=${JSON.stringify({ [title]: original })}`);
    //const json = await result.json();

    for (const lang of languages) {

      const fetch = await ClassLessonTranslate.fetchFromFirestore(_lesson.uid, lang);

      const translation = new ClassLessonTranslate({ uid_lesson: _lesson.uid, lang: lang });
      //await translation.updateFirestore()
      console.log("LANG result", translation);
    }

    console.log("RESSSULT", all_translations);
    /*
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
        console.log("WEEESH", _array, original)
        */
  }, []);
  return (<AccordionComponent title={t(title)} expanded={expanded}>
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
          onClick={onResetAllValues}
          disabled={processing}
          label='cancel' />
        <ButtonConfirm
          loading={processing}
          onClick={async () => {
            setProcessing(true);
            await onSubmit();
            setProcessing(false);
          }}
          label='confirm' />
      </Stack>
    }
  </AccordionComponent>)
}

export default function LessonEditComponent({ setSameDatas = null, }) {
  const { user } = useAuth();
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const { lang } = useLanguage();
  //const [lesson, setLesson] = useState(null);
  const { lesson } = useLesson();
  const { sessions } = useSession();

  const [lessonEdit, setLessonEdit] = useState(null);
  const [modeAccordion, setModeAccordion] = useState('');
  const [errors, setErrors] = useState({});
  const [course, setCourse] = useState(initialCourse);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const seatsLeft = Math.max(lesson?.seats_availables || 0 - lesson?.seats_taken || 0, 0);
  const isFull = seatsLeft <= 0 && !isEnrolled;
  const formatCfg = FORMAT_CONFIG[lesson?.format];

  useEffect(() => {
    setLessonEdit(lesson?.clone());
    console.log("lesson component", lesson, lesson?.clone())
  }, [lesson]);

  const onChangeValue = (e) => {
    const { name, type, value, checked } = e.target;
    const finalName = name === 'title' || name === 'subtitle' ? `translate.${name}` : name;

    setErrors(prev => ({ ...prev, [name]: '' }));
    setLessonEdit(prev => {
      if (!prev || prev === null) return lesson.clone();
      var lessonValue = lesson[name];
      var newValue = type === 'checkbox' ? checked : value;
      console.log("VALUUUE", name, type, value, checked, newValue, lessonValue);
      prev.update({ [name]: newValue });
      if (lessonValue !== newValue) {
        //setSameDatas(false);
      } else {
        //setSameDatas(true);
      }
      return prev.clone();
    });

  }
  const onClearValue = (name) => {
    //const { name, type, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLessonEdit(prev => {
      if (!prev || prev === null) return lesson.clone();
      var lessonValue = lesson[name];
      var newValue = '';
      prev.update({ [name]: newValue });
      if (lessonValue !== newValue) {
        setSameDatas(false);
      } else {
        setSameDatas(true);
      }
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
  return (<Stack>
    {
      user instanceof ClassUserIntern && <div style={{ marginTop: '10px', display: 'none' }}>
        <ButtonConfirm
          label="Modifier"
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            const session = await new ClassSession({
              //uid = "",
              //uid_intern = "",
              uid_lesson: "zlUoi3t14wzC5cNhfS3J",
              uid_teacher: "HRY7JbnFftWZocKtrIB1N1YuEJw1",
              //uid_room = "",
              code: "Session14", // Excel-101
              title: "Open session",
              //title_normalized : "",
              format: ClassSession.FORMAT.HYBRID,
              price: 2500,
              currency: "AOA",
              start_date: new Date(2025, 11, 13, 8),
              end_date: new Date(2025, 11, 13, 12, 30),
              seats_availables: 31,
              seats_taken: 14,
              //photo_url : "",
              status: ClassSession.STATUS.DRAFT,
              //location : "",
              //url : "",
              //translate = {},
              last_subscribe_time: new Date(2025, 11, 12, 23, 59, 59),
              //created_time = new Date(),
              //last_edit_time = new Date(),
            }).createFirestore();
            //await session;
            setIsLoading(false);
          }}
        />
      </div>
    }
    <div className="page">
      <main className="container">
        <Grid container spacing={1}>
          <Grid size={12}>
            <div className="card">
              <h2>{"Informations générales"}</h2>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <Stack spacing={1.5}>
                    <SelectComponentDark
                      name={'category'}
                      label={t('category')}
                      value={lessonEdit?.category}
                      values={ClassLesson.ALL_CATEGORIES.map(category => ({
                        id: category,
                        value: t(category)
                      }))}
                      onChange={onChangeValue}
                      hasNull={false}
                    />
                    <FieldComponent
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
                    />
                    <FieldComponent
                      label={t('subtitle')}
                      type="text"
                      name={'subtitle'}
                      value={lessonEdit?.subtitle}
                      onChange={onChangeValue}
                      onClear={() => onClearValue('subtitle')}
                      resetable={lesson?.translate?.subtitle !== lessonEdit?.translate?.subtitle}
                      onCancel={() => {
                        onResetValue('subtitle')
                      }}
                    />
                    <FieldComponent
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
                      resetable={lesson?.translate?.description !== lessonEdit?.translate?.description}
                      onCancel={() => {
                        onResetValue('description')
                      }}
                    />
                    <Stack>
                      <label className="text-contentColor dark:text-contentColor-dark block" style={{ fontSize: '0.9rem', marginBottom: '7px' }}>
                        {t('certified')}{<b style={{ color: 'red' }}>*</b>}
                      </label>
                      <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <CheckboxComponent
                          name={'certified'}
                          //value={lessonEdit?.certified}
                          checked={lessonEdit?.certified}
                          type="checkbox"
                          label={t('yes')}
                          onChange={onChangeValue}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Grid>
                {
                  lessonEdit?.photo_url && <Grid size={{ xs: 12, sm: 4 }} sx={{ background: '' }}>
                    <Stack alignItems={'center'} sx={{ height: '100%', background: '' }} spacing={1}>
                      <Box sx={{ background: '', width: { xs: '100%', sm: '70%' } }}>
                        <Image
                          src={lessonEdit.photo_url || null}
                          alt={`lesson-${lessonEdit?.uid}`}
                          quality={100}
                          width={300}
                          height={150}
                          //loading="lazy"
                          priority
                          style={{
                            width: 'auto',
                            height: '100%',
                            //borderRadius: '8px',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                      <ButtonConfirm
                        label="Modifier image"
                      />
                    </Stack>
                  </Grid>
                }
              </Grid>
            </div>
          </Grid>
                        <Grid size={12}>
                <Stack spacing={1}>
                  <div className="card">
                    <h2>{t('content')}</h2>
                    <Stack spacing={0.5}>
                      {
                        ['programs', 'prerequisites', 'target_audiences', 'goals', 'notes', 'tags'].map((item, i) => {
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
      </main>
      <style jsx>{`
                .page {
                 
                  background: transparent;
                  padding: 0px 0px;
                  color: var(--font-color);
                  display: flex;
                  justify-content: center;
                }
                .container {
                  width: 100%;
                  padding: 0px;
                  background:transparent;
                }
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
    </div>
  </Stack>);
}