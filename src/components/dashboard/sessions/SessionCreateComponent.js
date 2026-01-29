"use client"
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { ClassLesson, ClassLessonTeacher, ClassLessonTranslate } from "@/classes/ClassLesson";
import { formatDuration, formatPrice, getFormattedDate, getFormattedDateComplete, getFormattedDateCompleteNumeric, getFormattedDateNumeric, getFormattedHour, translateWithVars } from "@/contexts/functions";
import { languages, NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS } from "@/contexts/i18n/settings";
import { Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";

import { Trans, useTranslation } from "react-i18next";
import BadgeFormatLesson from "@/components/dashboard/lessons/BadgeFormatLesson";

import { useLanguage } from "@/contexts/LangProvider";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import Image from "next/image";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { useAuth } from "@/contexts/AuthProvider";
import { SCHOOL_NAME, WEBSITE_NAME } from "@/contexts/constants/constants";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { ClassSession, ClassSessionSlot } from "@/classes/ClassSession";
import Link from "next/link";
import { IconCategory, IconDuration, IconHour, IconLessons, IconLevel, IconLink, IconLocation, IconTranslation } from "@/assets/icons/IconsComponent";
import { useThemeMode } from "@/contexts/ThemeProvider";
import BadgeFormatLessonContained from "../lessons/BadgeFormatLessonContained";
import ButtonRemove from "../elements/ButtonRemove";
import { useSession } from "@/contexts/SessionProvider";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import FieldComponent from "@/components/elements/FieldComponent";
import TextFieldComponentDark from "@/components/elements/TextFieldComponentDark";
import { ClassCountry } from "@/classes/ClassCountry";
import { UsersProvider, useUsers } from "@/contexts/UsersProvider";
import { ClassUser, ClassUserTeacher } from "@/classes/users/ClassUser";
import { RoomProvider, useRoom } from "@/contexts/RoomProvider";
import { ClassRoom } from "@/classes/ClassRoom";
import { TimePicker } from "@mui/x-date-pickers";
import FieldTextComponent from "@/components/elements/FieldTextComponent";
import { ClassHardware } from "@/classes/ClassDevice";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";

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
function MetaChipIcon({ label, value, icon = <></> }) {
  return (
    <>
      <div className="meta-chip">
        <Stack justifyContent={'center'}>
          <Box sx={{ border: `0.1px solid var(--card-border)`, background: '', color: 'var(--primary)', p: 0.3, borderRadius: '100%' }}>
            {icon}
          </Box>
        </Stack>
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
  const { t } = useTranslation(ClassLesson.NS_COLLECTION);

  return (
    <>
      <div className="info-row">
        <span className="info-label">{t(label)}</span>
        <span className="info-value">{value}</span>
      </div>

      <style jsx>{`
        .info-row {
          display: flex;
          justify-content: space-between;
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
            white-space:nowrap;
        }
      `}</style>
    </>
  );
}

function CardFormat({ slot = null, setSession = null, format = "", session = null, errors = {}, setErrors = null }) {
  const { update, slots } = useSession();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const { ONLINE, ONSITE } = ClassSession.FORMAT;
  const { t } = useTranslation(ClassSession.NS_COLLECTION, NS_LANGS);
  const defaultSession = new ClassSession({ slots: [new ClassSessionSlot({ uid_intern: 1, })] });

  const onChangeValue = (e) => {
    const { value, name, type, property } = e.target;
    setErrors(prev => ({ ...prev, [name]: '', main: '' }));
    setSession(prev => {
      if (!prev || prev === null) return defaultSession;
      //IF SESSION
      //onChange={(e)=>onChangeValue(e, 'session')}
      const slot = prev.slots[0] || new ClassSessionSlot();
      slot.update({ [name]: type === 'number' ? parseInt(value) : value });
      prev.update({ slots: [slot] });
      return prev.clone();
    });
  }
  const onClearValue = (name) => {
    //const { value, name, type, property } = e.target;
    setErrors(prev => ({ ...prev, [name]: '', main: '' }));
    setSession(prev => {
      if (!prev || prev === null) return defaultSession;
      //IF SESSION
      //onChange={(e)=>onChangeValue(e, 'session')}
      const slot = prev.slots[0] || new ClassSessionSlot();
      slot.update({ [name]: '' });
      prev.update({ slots: [slot] });
      return prev.clone();
    });
  }
  return (<Grid key={`${format}`} size={12} sx={{
    border: `0.1px solid var(--card-border)`,
    borderRadius: '10px',
    p: 1,
    //background:FORMAT_CONFIG['onsite']?.glow,
    //display: slot?.format === ClassSession.FORMAT.HYBRID || slot?.format === format ? 'block' : 'none'
  }}>
      <Stack spacing={1} alignItems={'start'} sx={{ background: '' }}>
      <BadgeFormatLessonContained format={format} />
      <Stack spacing={1.5} sx={{ background: '', width: '100%' }}>
        <FieldComponent
          name={`seats_availables_${format}`}
          type="number"
          //disablePast={true}
          //disableFuture={false}
          label={t(`seats_availables_${format}`)}
          value={`${slot?.[`seats_availables_${format}`]}`}
          onChange={onChangeValue}
          onClear={() => onClearValue(`seats_availables_${format}`)}
          error={errors[`seats_availables_${format}`]}
        />
        {
          (format === 'online' || slot?.format === ClassSession.FORMAT.HYBRID) &&
          <FieldComponent
            name={`url`}
            type="text"
            //disablePast={true}
            //disableFuture={false}
            label={t(`url`)}
            value={session?.slots?.[0]?.url}
            onChange={onChangeValue}
            onClear={() => onClearValue(`url`)}
            error={errors.url}
            fullWidth={true}
          />
        }
      </Stack>
    </Stack>
    <style jsx>
      {`
        .hero-seats {
          margin-top: 6px;
          font-size: 0.85rem;
        }
        .seats-sub {
          margin: 2px 0 4px;
          font-size: 0.78rem;
          color: var(--grey-dark);
        }
        .seats-bar {
          width: 100%;
          height: 7px;
          border-radius: 999px;
          background: var(--card-color);
          border: 1px solid var(--card-border);
          overflow: hidden;
        }
        .seats-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
        }`}
    </style>
  </Grid>)
}
function CardSlot({ title = "", valueComponent = <></>, icon = <></> }) {
  return (<Stack direction={'row'} spacing={1} sx={{ px: 1, py: 1, borderRadius: '5px', border: `0.1px solid var(--card-border)` }}>
    <Stack justifyContent={'center'}>
      <Box sx={{ border: `0.1px solid var(--card-border)`, background: '', color: 'var(--primary)', p: 0.3, borderRadius: '100%' }}>
        {icon}
      </Box>
    </Stack>
    <Stack>
      <Typography color="var(--grey-dark)">{title}</Typography>
      {valueComponent}
    </Stack>
  </Stack>)
}

function RenderContent({ mode = 'create',
  sessionNew = null, setSessionNew = null,
  errors = {}, setErrors = null,
  initStartDate = null,
  setInitStartDate = null,
}) {
  const { theme } = useThemeMode();
  const { primary } = theme.palette;
  const { user } = useAuth();
  const { t } = useTranslation(ClassSession.NS_COLLECTION,ClassLessonTeacher.NS_COLLECTION, NS_LANGS);
  const errorsTranslate = t('errors', { returnObjects: true });
  const { lang } = useLanguage();
  const { users, getOneUser } = useUsers();
  const { session, update, slots } = useSession();
  const { rooms, getOneRoom } = useRoom();
  const { lessons, getOneLesson, lesson, isLoading: isLoadingLessons } = useLessonTeacher();
  
  // Debug: vérifier si les cours sont chargés
  useEffect(() => {
    console.log("SessionCreateComponent - lessons:", lessons?.length, lessons);
    console.log("SessionCreateComponent - isLoadingLessons:", isLoadingLessons);
    console.log("SessionCreateComponent - user:", user?.uid);
  }, [lessons, isLoadingLessons, user]);
  const [slot, setSlot] = useState(new ClassSessionSlot({ uid_intern: 1, status: ClassSessionSlot.STATUS.OPEN, start_date: initStartDate }));
  //const [sessionNew, setSessionNew] = useState(null);
  //const [errors, setErrors] = useState({});
  const [proessing, setProcessing] = useState(false);
  const { ONLINE, ONSITE } = ClassSession.FORMAT;
  const [course, setCourse] = useState(initialCourse);
  const FORMAT_CONFIG = ClassSession.FORMAT_CONFIG;
  const formatCfg = FORMAT_CONFIG[session?.format];

  
  // Synchroniser slot avec sessionNew.slots[0] seulement quand nécessaire
  const currentSlotRef = useRef(null);
  useEffect(() => {
    if (sessionNew?.slots?.[0]) {
      const currentSlot = sessionNew.slots[0];
      const slotKey = `${currentSlot.uid_intern}-${currentSlot.start_date?.getTime()}-${currentSlot.duration}-${currentSlot.format}-${currentSlot.lang}-${currentSlot.level}`;
      
      if (currentSlotRef.current !== slotKey) {
        currentSlotRef.current = slotKey;
        const needsUpdate = 
          currentSlot.uid_intern !== slot.uid_intern || 
          currentSlot.start_date?.getTime() !== slot.start_date?.getTime() ||
          currentSlot.duration !== slot.duration ||
          currentSlot.format !== slot.format ||
          currentSlot.lang !== slot.lang ||
          currentSlot.level !== slot.level;
        
        if (needsUpdate) {
          setSlot(new ClassSessionSlot(currentSlot));
        }
      }
    } else if (!sessionNew && slot?.uid_intern) {
      // Réinitialiser slot si sessionNew est null seulement si nécessaire
      const resetKey = `reset-${initStartDate?.getTime() || 'default'}`;
      if (currentSlotRef.current !== resetKey) {
        currentSlotRef.current = resetKey;
        setSlot(new ClassSessionSlot({ uid_intern: 1, status: ClassSessionSlot.STATUS.OPEN, start_date: initStartDate }));
      }
    }
  }, [sessionNew?.slots?.[0]?.uid_intern, sessionNew?.slots?.[0]?.start_date?.getTime(), sessionNew?.slots?.[0]?.duration, sessionNew?.slots?.[0]?.format, sessionNew?.slots?.[0]?.lang, sessionNew?.slots?.[0]?.level]);

  // Initialiser sessionNew seulement au montage ou quand mode change
  // Ne pas réinitialiser si sessionNew est déjà défini par le parent
  const modeRef = useRef(mode);
  const initializedRef = useRef(false);
  useEffect(() => {
    if (modeRef.current !== mode) {
      modeRef.current = mode;
      initializedRef.current = false;
    }
    // Ne créer une nouvelle session que si elle n'existe pas déjà (laissé au parent de l'initialiser)
    // Vérifier sessionNew via une fonction pour éviter de l'ajouter aux dépendances
    // En mode 'edit', le parent gère l'initialisation de sessionNew, donc on ne doit pas le remettre à null
    if (mode === 'create' && !sessionNew && !initializedRef.current && setSessionNew) {
      initializedRef.current = true;
      const initialSlot = new ClassSessionSlot({ uid_intern: 1, status: ClassSessionSlot.STATUS.OPEN, start_date: initStartDate });
      const newDefaultSession = new ClassSession({ slots: [initialSlot] });
      setSessionNew(newDefaultSession);
      setSlot(initialSlot);
    }
    // Supprimé: else if qui remettait sessionNew à null en mode edit
    // En mode edit, le parent (EditSessionContent) gère déjà l'initialisation de sessionEdit
  }, [mode]);

  const calculateEndDate = (start_date = null, duration = 0) => {
    if (!start_date || !(start_date instanceof Date) || !duration) return null;
    const newDate = new Date(start_date.toString());
    const hours = parseFloat(duration);
    const minutes = (duration - hours) * 60;
    newDate.setHours(newDate.getHours() + hours);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    newDate.setSeconds(0);
    return newDate;
  }

  const onChangeDateValue = (e, time = new Date()) => {
    const { value, name, type, property } = e.target;
    setErrors(prev => ({ ...prev, [name]: '', main: '' }));
    setSessionNew(prev => {
      if (!prev || prev === null) {
        const initialSlot = new ClassSessionSlot({ uid_intern: 1, status: ClassSessionSlot.STATUS.OPEN, start_date: initStartDate });
        return new ClassSession({ slots: [initialSlot] });
      }
      const currentSlot = prev.slots[0] || new ClassSessionSlot({ uid_intern: 1, status: ClassSessionSlot.STATUS.OPEN });
      const newSlot = new ClassSessionSlot(currentSlot);
      const hours = time?.getHours() || 0;
      const minutes = time?.getMinutes() || 0;
      var date = value ? new Date(value) : null;
      if (date) {
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
      }
      const endDate = calculateEndDate(date, newSlot.duration);
      newSlot.update({ [name]: date, end_date: endDate });
      prev.update({ slots: [newSlot] });
      return prev.clone();
    });
  }
  const onChangeHourValue = (e, day = new Date()) => {
    const { value, name, } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setSessionNew(prev => {
      if (!prev || prev === null) {
        const initialSlot = new ClassSessionSlot({ uid_intern: 1, status: ClassSessionSlot.STATUS.OPEN, start_date: initStartDate });
        return new ClassSession({ slots: [initialSlot] });
      }
      const currentSlot = prev.slots[0] || new ClassSessionSlot({ uid_intern: 1, status: ClassSessionSlot.STATUS.OPEN });
      const newSlot = new ClassSessionSlot(currentSlot);
      var valueData = value ? new Date(value) : null;
      var date = day || new Date();
      const hours = valueData.getHours();
      const minutes = valueData.getMinutes();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0);
      const endDate = calculateEndDate(date, newSlot.duration);
      newSlot.update({ start_date: date, end_date: endDate });
      prev.update({ slots: [newSlot] });
      return prev.clone();
    });
  }
  const onChangeDurationValue = (e, day = new Date()) => {
    const { value, name, type, property } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setSessionNew(prev => {
      if (!prev || prev === null) {
        const initialSlot = new ClassSessionSlot({ uid_intern: 1, status: ClassSessionSlot.STATUS.OPEN, start_date: initStartDate });
        return new ClassSession({ slots: [initialSlot] });
      }
      const currentSlot = prev.slots[0] || new ClassSessionSlot({ uid_intern: 1, status: ClassSessionSlot.STATUS.OPEN });
      const newSlot = new ClassSessionSlot(currentSlot);
      const duration = parseFloat(value);
      const startDate = day || newSlot.start_date || new Date();
      const endDate = calculateEndDate(startDate, duration);
      newSlot.update({ duration: duration, end_date: endDate });
      prev.update({ slots: [newSlot] });
      return prev.clone();
    });
  }
  const onChangeValue = (e, mode = 'session') => {
    const { value, name, type, property } = e.target;
    setErrors(prev => ({ ...prev, [name]: '', main: '' }));
    setSessionNew(prev => {
      if (!prev || prev === null) {
        const initialSlot = new ClassSessionSlot({ uid_intern: 1, status: ClassSessionSlot.STATUS.OPEN, start_date: initStartDate });
        return new ClassSession({ slots: [initialSlot] });
      }

      if (mode === 'slot') {
        const currentSlot = prev.slots[0] || new ClassSessionSlot({ uid_intern: 1, status: ClassSessionSlot.STATUS.OPEN });
        const newSlot = new ClassSessionSlot(currentSlot);
        newSlot.update({ [name]: value });
        prev.update({ slots: [newSlot] });
        
        if (name === 'format') {
          if (value === ClassSessionSlot.FORMAT.HYBRID || value === ClassSessionSlot.FORMAT.ONSITE) {
            const room = getOneRoom(rooms.filter(room => room.type === ClassRoom.TYPE.ROOM)?.[0]?.uid);
            const count = room?.computers?.filter(item => item.status === ClassHardware.STATUS.AVAILABLE || item.status === ClassHardware.STATUS.BUSY).length || 0;
            newSlot.update({ location: `${room?.school?.name} - ${room?.name}`, seats_availables_onsite: count });
            prev.update({ uid_room: room?.uid, room: room, slots: [newSlot] });
            return prev.clone();
          }
          if (value === ClassSessionSlot.FORMAT.ONSITE) {
            const room = getOneRoom(rooms.filter(room => room.type === ClassRoom.TYPE.ROOM)?.[0]?.uid);
            const count = room?.computers?.filter(item => item.status === ClassHardware.STATUS.AVAILABLE || item.status === ClassHardware.STATUS.BUSY).length || 0;
            newSlot.update({ location: `${room?.school?.name} - ${room?.name}`, seats_availables_online: 0, seats_availables_onsite: count });
            prev.update({ uid_room: room?.uid, room: room, slots: [newSlot] });
            return prev.clone();
          }
          if (value === ClassSessionSlot.FORMAT.ONLINE) {
            const room = getOneRoom(rooms.filter(room => room.type === ClassRoom.TYPE.ROOM)?.[0]?.uid);
            newSlot.update({ location: `${room?.school?.name} - ${room?.name}`, seats_availables_onsite: 0 });
            prev.update({ uid_room: room?.uid, room: room, slots: [newSlot] });
            return prev.clone();
          }
        }
      }
      
      if (mode === 'session') {
        if (name === 'uid_lesson') {
          const lesson = lessons.find(l => l.uid_lesson === value) || null;
          prev.update({ uid_lesson: value, lesson: lesson });
        }
        if (name === 'uid_teacher') {
          const teacher = getOneUser(value);
          prev.update({ uid_teacher: value, teacher: teacher });
        }
        if (name === 'price') {
          const priceValue = value === '' || value === null || value === undefined ? 0 : parseFloat(value) || 0;
          prev.update({ price: priceValue });
        }
        if (name === 'currency') {
          prev.update({ currency: value });
        }
      }

      return prev.clone();
    });
  }


  return (<Stack sx={{ width: '100%' }}>
    <div>
      <main>
        <section className="hero-card">
          {
            lesson && (
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid size="auto">
                  <div className="badges">
                    
                    {lesson.certified && (
                      <span className="badge-cert">
                        🎓 {t('certified', { ns: ClassLessonTeacher.NS_COLLECTION })}
                      </span>
                    )}
                  </div>
                </Grid>
              </Grid>
            )
          }
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 'auto' }}>
              <div className="teacher-card">
                <Stack spacing={1.5}>
                  <SelectComponentDark
                  required
                    name={'uid_lesson'}
                    label={t('uid_lesson')}
                    values={lessons?.filter(lesson => lesson.uid_lesson).map(lesson => ({
                      value: lesson.translate?.title || lesson.title,
                      id: lesson.uid_lesson
                    })) || []}
                    value={sessionNew?.uid_lesson || ""}
                    onChange={(e) => onChangeValue(e, 'session')}
                    hasNull={!(sessionNew?.uid_lesson)}
                    error={errors?.uid_lesson}
                  />
                  {!isLoadingLessons && (!lessons || lessons.length === 0) && (
                    <Typography sx={{ color: 'var(--grey-dark)', fontSize: '0.85rem' }}>
                      {t('no-lessons-available', { ns: ClassLessonTeacher.NS_COLLECTION }) || 'Aucun cours disponible'}
                    </Typography>
                  )}

                  <Grid container direction={'row'} spacing={1.5} alignItems={'flex-end'}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FieldComponent
                        required
                        name={'start_date'}
                        type="date"
                        property="slot"
                        disablePast={true}
                        disableFuture={false}
                        label={t('start_date')}
                        value={slot?.start_date || ""}
                        onChange={(e) => onChangeDateValue(e, slot?.start_date)}
                        error={errors?.start_date}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SelectComponentDark
                        required
                        name={'duration'}
                        label={t('duration')}
                        values={ClassSessionSlot.ALL_DURATIONS.map(duration => ({
                          value: formatDuration(duration),
                          id: duration
                        }))}
                        value={slot?.duration || 0}
                        onChange={(e) => onChangeDurationValue(e, slot?.start_date)}
                        error={errors?.duration}
                        hasNull={!(slot?.duration)}
                      />
                    </Grid>
                  </Grid>
                  {
                    slot?.start_date && <Stack spacing={1.5}>
                      <FieldComponent
                        required
                        name={'start_hour'}
                        type="hour"
                        disableFuture={false}
                        label={t('start_hour')}
                        value={slot?.start_date || ""}
                        onChange={(e) => onChangeHourValue(e, slot?.start_date)}
                        error={errors?.start_hour}
                      />
                      {
                        slot?.end_date && slot?.duration && <FieldTextComponent
                          name={'end_date'}
                          label={t('end_date')}
                          value={`${getFormattedDateNumeric(slot?.end_date)} - ${getFormattedHour(slot?.end_date)}`}
                          error={errors?.end_date}
                        />
                      }
                    </Stack>
                  }
                </Stack>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 'grow' }}>
              <div className="teacher-card">
                <Stack spacing={1.5}>
                  <SelectComponentDark
                  required
                    name={'lang'}
                    label={t('lang')}
                    values={languages.map(lang => ({
                      value: t(lang, { ns: NS_LANGS }),
                      id: lang
                    }))}
                    value={slot?.lang || ""}
                    onChange={(e) => onChangeValue(e, 'slot')}
                    hasNull={!(slot?.lang)}
                    error={errors?.lang}
                  />
                  <SelectComponentDark
                  required
                    name={'level'}
                    label={t('level')}
                    values={ClassSession.ALL_LEVELS.map(level => ({
                      value: t(level),
                      id: level
                    }))}
                    value={slot?.level || ""}
                    onChange={(e) => onChangeValue(e, 'slot')}
                    hasNull={!(slot?.level)}
                    error={errors?.level}
                  />
                  <SelectComponentDark
                  required
                    name={'format'}
                    label={t('format')}
                    values={ClassSession.ALL_FORMATS.map(format => ({
                      value: t(format),
                      id: format
                    }))}
                    value={slot?.format || ""}
                    onChange={(e) => onChangeValue(e, 'slot')}
                    hasNull={!(slot?.format)}
                    error={errors?.format}
                  />

                  <Grid container spacing={1.5} alignItems="center">
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextFieldComponentDark
                        name={'price'}
                        type="number"
                        label={t('price')}
                        value={sessionNew?.price !== undefined && sessionNew?.price !== null ? String(sessionNew.price) : ""}
                        onChange={(e) => onChangeValue(e, 'session')}
                        onClear={() => {
                          setErrors(prev => ({ ...prev, price: '', main: '' }));
                          setSessionNew(prev => {
                            if (!prev) return null;
                            prev.update({ price: 0 });
                            return prev.clone();
                          });
                        }}
                        error={errors?.price}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                      <SelectComponentDark
                        name={'currency'}
                        values={ClassCountry.CURRENCIES.map(currency => ({
                          value: currency,
                          id: currency
                        }))}
                        value={sessionNew?.currency || ""}
                        onChange={(e) => onChangeValue(e, 'session')}
                        hasNull={false}
                        error={errors?.currency}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    {
                      (slot?.format === ClassSession.FORMAT.HYBRID || slot?.format === ClassSession.FORMAT.ONLINE) &&
                      <CardFormat
                        session={sessionNew}
                        setSession={setSessionNew}
                        slot={slot}
                        errors={errors}
                        setErrors={setErrors}
                        format={'online'} />
                    }
                    {
                      (slot?.format === ClassSession.FORMAT.HYBRID || slot?.format === ClassSession.FORMAT.ONSITE) &&
                      <CardFormat
                        session={sessionNew}
                        setSession={setSessionNew}
                        slot={slot}
                        errors={errors}
                        setErrors={setErrors}
                        format={'onsite'} />
                    }
                  </Grid>
                </Stack>
              </div>
            </Grid>
          </Grid>
        </section>
      </main>
      <style jsx>{`
                .page {
                  background: transparent;
                  padding: 0px;
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
                  display: flex;
                  flex-direction: column;
                  gap: 5px;
                  border-radius: 18px;
                  border: 1px solid #1f2937;
                  border: transparent;
                  background: radial-gradient(circle at top left, #111827, #020617);
                  background: var(--card-color);
                  padding: 18px 18px 20px;
                  margin-bottom: 10px;
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
                  border-radius: 10px;
                  border: 1px solid #111827;
                  border: 0.1px solid var(--card-border);
                  padding: 10px 10px 12px;
                  padding: 15px;
                  padding: 14px 14px 16px;
                  background: radial-gradient(circle at top left, #111827, #020617);
                  background: transparent;
                  background : var(--card-color);
                  font-size: 0.85rem;
                   
                }
        
                .teacher-label {
                  margin: 0 0 6px;
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: var(--grey-dark);
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
                  color: var(--grey-dark);
                }
                .seats-bar {
                  width: 100%;
                  height: 7px;
                  border-radius: 999px;
                  background: var(--card-color);
                  border: 1px solid var(--card-border);
                  overflow: hidden;
                }
        
                .seats-fill {
                  height: 100%;
                  background: linear-gradient(90deg, #22c55e, #16a34a);
                }
        
                .breadcrumb {
                  margin: 0 0 4px;
                  font-size: 0.75rem;
                  color: var(--grey-dark);
                }
        
                h1 {
                  margin: 0;
                  font-size: 1.5rem;
                  line-height: 1.5rem;
                }
        
                .muted {
                  margin: 0;
                  font-size: 0.9rem;
                  color: var(--grey-dark);
                }
        
                .badges {
                  margin-top: 10px;
                  display: flex;
                  gap: 8px;
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
                  background: var(--card-color);
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
                
                .badges {
                  margin-top: 10px;
                  display: flex;
                  gap: 5px;
                  flex-wrap: wrap;
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
                  color: var(--grey-dark);
                  margin-left: 4px;
                }
        
                .price-helper {
                  margin: 4px 0 0;
                  font-size: 0.8rem;
                  color: var(--grey-dark);
                }
        
                .installments {
                  margin: 8px 0 0;
                  font-size: 0.8rem;
                  color: var(--font-color);
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
                  color: var(--grey-dark);
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
                  color: var(--grey-dark);
                }
        
                .btn {
                  border-radius: 999px;
                  padding: 8px 14px;
                  border: 1px solid var(--card-border);
                  background: var(--card-color);
                  color: var(--font-color);
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
                  background: var(--card-color);
                  cursor: not-allowed;
                  opacity: 0.5;
                }
        
                .secure-note {
                  margin: 8px 0 0;
                  font-size: 0.75rem;
                  color: var(--grey-dark);
                }
        
                .grid {
                  display: grid;
                  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.1fr);
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
                  border: 0.1px solid transparent;
                  padding: 14px 14px 16px;
                }
        
                .card h2 {
                  margin: 0 0 10px;
                  font-size: 1.05rem;
                }
        
                .description {
                  margin: 0;
                  padding-left: 0px;
                  font-size: 0.9rem;
                  color: var(--grey-light);
                  color: var(--font-color);
                }
        
                .list {
                  margin: 0;
                  padding-left: 15px;
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
              .badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 2px 8px;
            border-radius: 999px;
            border: 0.1px solid var(--primary);
            background-color: var(--primary-shadow);
            color: var(--primary);
            font-size: 0.72rem;
            white-space: nowrap;
          }
  
          .badge-big {
            margin-top: 6px;
            font-size: 0.8rem;
            padding: 3px 10px;
          }
  
          .dot {
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: var(--primary);
            
          }
              `}</style>
    </div>
  </Stack>);
}

export default function SessionCreateComponent({
  sessionNew = null, setSessionNew = null,
  errors = {}, setErrors = null,
  mode = 'create',
  initStartDate = null,
  setInitStartDate = null,
}) {
  return (<UsersProvider>
    <RoomProvider>
      <RenderContent
        sessionNew={sessionNew}
        setSessionNew={setSessionNew}
        errors={errors}
        setErrors={setErrors}
        mode={mode}
        initStartDate={initStartDate}
        setInitStartDate={setInitStartDate}
      />
    </RoomProvider>
  </UsersProvider>);
}