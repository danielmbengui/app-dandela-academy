import React, { useEffect, useMemo, useState } from "react";
import { IconCheck, IconVisible } from "@/assets/icons/IconsComponent";
import { ClassLesson, ClassLessonTeacher } from "@/classes/ClassLesson";
import { formatDuration, formatPrice, getFormattedDateNumeric, getFormattedHour, parseAndValidatePhone } from "@/contexts/functions";
import { NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS, NS_LESSONS_ONE } from "@/contexts/i18n/settings";
import { Box, Chip, CircularProgress, Grid, List, ListItem, Skeleton, Stack, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import { useLesson } from "@/contexts/LessonProvider";
import { useLanguage } from "@/contexts/LangProvider";
import Image from "next/image";
import BadgeStatusLesson from "@/components/dashboard/lessons/BadgeStatusLesson";
import { useAuth } from "@/contexts/AuthProvider";
import { ClassUserIntern } from "@/classes/users/ClassUser";
import { SCHOOL_NAME } from "@/contexts/constants/constants";
import { useSession } from "@/contexts/SessionProvider";
import DialogSession from "../sessions/DialogSession";
import { ClassSessionSlot } from "@/classes/ClassSession";
import Link from "next/link";
import ButtonCancel from "../elements/ButtonCancel";
import TeacherComponent from "../../teacher/TeacherComponent";
import { useChapter } from "@/contexts/ChapterProvider";
import { PAGE_CHAPTERS, PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { usePathname } from "next/navigation";
import ButtonConfirm from "../elements/ButtonConfirm";
import { useUsers } from "@/contexts/UsersProvider";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import { useSchool } from "@/contexts/SchoolProvider";
import OneTeacherLessonComponent from "@/components/teacher/OneTeacherLessonComponent";
import { ClassCountry } from "@/classes/ClassCountry";

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

function SlotRow({ slot = null }) {
  const { sessions, setUidSession, setUidSlot, slots, getOneSession } = useSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('read');
  const STATUS_CONFIG = ClassSessionSlot.STATUS_CONFIG || [];
  const colorSlot = STATUS_CONFIG[slot?.status];
  const session = getOneSession(slot?.uid_session);
  return (<>
    <DialogSession
      mode={mode}
      setMode={setMode}
      isOpen={open}
      setIsOpen={setOpen}
    />
    <Stack key={`${slot?.uid_session}-${slot?.uid_intern}`} alignItems={'center'} spacing={1} direction={'row'}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '999px',
        background: colorSlot?.color,
        boxShadow: `0px 0px 8px ${colorSlot?.glow}`,
      }} />
      <Typography sx={{ fontSize: '0.9rem' }}>{`${session?.uid} ${session?.code} (${session?.uid_intern})`}</Typography>
      <Typography variant="caption">{`${getFormattedDateNumeric(slot?.start_date)} ${getFormattedHour(slot?.start_date)}-${getFormattedHour(slot?.end_date)}`}</Typography>
      <Box
        onClick={() => {
          setMode('read');
          setUidSession(slot?.uid_session);
          setUidSlot(slot?.uid_intern);
          setOpen(true);

        }}
        sx={{
          //color: 'red',
          cursor: 'pointer',
          "&:hover": { color: "var(--primary)" },
        }}>
        <IconVisible height={20} />
      </Box>
    </Stack>
  </>)
}
function NextSessionsComponent() {
  const { t } = useTranslation([NS_LESSONS_ONE]);
  const { slots } = useSession();
  const today = new Date();

  return (<>
    <div className="hero-right-top">
      <Stack spacing={1}>
        <p className="teacher-label">{t('next-sessions')}</p>
        <Stack spacing={0.5}>
          {
            slots.filter(slot => slot.start_date.getTime() > today.getTime())
              .sort((a, b) => a.start_date.getTime() - b.start_date.getTime())
              .map((slot, i) => {
                return (<div key={`${slot.uid_session}-${slot.uid_intern}-${i}`}>
                  <SlotRow slot={slot} />
                </div>)
              })
          }
          {
            slots.filter(slot => slot.start_date.getTime() > today.getTime()).length === 0 && <Stack>
              {t('next-sessions-not')}
            </Stack>

          }
        </Stack>
      </Stack>
    </div>
    <style jsx>{`
                  .hero-right-top {
                  border-radius: 14px;
                  border: 0.1px solid var(--card-border);
                  padding: 10px 10px 12px;
                  padding: 15px;
                }
                                  .teacher-label {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: #9ca3af;
                }
                .teacher-label-text {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: #9ca3af;
                  margin-bottom: 6px;
                }
  `}</style>
  </>)
}
function PreviousSessionsComponent() {
  const { t } = useTranslation([NS_LESSONS_ONE]);
  const { slots } = useSession();
  const today = new Date();

  return (<>
    <div className="hero-right-top">
      <Stack spacing={1}>
        <p className="teacher-label">{t('previous-sessions')}</p>
        <Stack spacing={0.5}>
          {
            slots.filter(slot => slot.start_date.getTime() <= today.getTime())
              .sort((a, b) => a.start_date.getTime() - b.start_date.getTime())
              .map((slot, i) => {
                return (<div key={`${slot.uid_session}-${slot.uid_intern}-${i}`}>
                  <SlotRow slot={slot} />
                </div>)
              })
          }
          {
            slots.filter(slot => slot.start_date.getTime() <= today.getTime()).length === 0 && <Stack>
              {t('previous-sessions-not')}
            </Stack>

          }
        </Stack>
      </Stack>
    </div>
    <style jsx>{`
                  .hero-right-top {
                  border-radius: 14px;
                  border: 0.1px solid var(--card-border);
                  padding: 10px 10px 12px;
                  padding: 15px;
                }
                                  .teacher-label {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: #9ca3af;
                }
                .teacher-label-text {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: #9ca3af;
                  margin-bottom: 6px;
                }
  `}</style>
  </>)
}

export default function LessonTeacherComponent() {
  const { user } = useAuth();
  const { t } = useTranslation([ClassLessonTeacher.NS_COLLECTION, NS_BUTTONS, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const { lang } = useLanguage();
  const { path } = usePathname();
  const { getOneUser, isLoading: isLoadingUsers } = useUsers();
  //const [lesson, setLesson] = useState(null);
  const { lesson, lessons } = useLesson();
  const { lesson: lessonTeacher, isLoading: isLoadingLessons } = useLessonTeacher();
  const { chapter, chapters, subchapters, lastStat, setUidChapter, subchapter, setSubchapter, stats } = useChapter();
  const { sessions, isLoading: isLoadingSessions, isLoadingSlots } = useSession();
  const { school } = useSchool();
  const [course, setCourse] = useState(initialCourse);
  const [isEnrolled, setIsEnrolled] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const seatsLeft = Math.max(lessonTeacher?.seats_availables || 0 - lessonTeacher?.seats_taken || 0, 0);
  const isFull = seatsLeft <= 0 && !isEnrolled;
  const formatCfg = FORMAT_CONFIG[lessonTeacher?.format];

  const teacher = useMemo(() => {
    if (isLoadingLessons || isLoadingUsers || !lessonTeacher) return null;
    return getOneUser(lessonTeacher.uid_teacher);
  }, [isLoadingLessons, isLoadingUsers, lessonTeacher]);
  const parsedPhoneNumber = useMemo(() => {
    if(!school) return "";
    const codeCountry = ClassCountry.extractCodeCountryFromPhoneNumber(school?.bank_express);
    const parsedPhoneNumber = parseAndValidatePhone(school?.bank_express || "", codeCountry || "")?.national;
    //console.log("Parsed phone", parsedPhoneNumber)
    return parsedPhoneNumber;
  }, [school]);
  if (!lessonTeacher || !teacher) {
    return (<CircularProgress size={'14px'} />)
  }

  return (<Stack sx={{ color: "var(--font-color)" }}>
    <div className="page">
      <main className="container">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.5} alignItems={{ xs: 'start', sm: 'center' }} sx={{ mb: 1 }}>
          <Link href={`${PAGE_LESSONS}/${lesson?.uid}`}>
            <ButtonCancel label={t('see-lesson', { ns: NS_BUTTONS })} />
          </Link>
          <Link target={'_blank'} href={lessonTeacher?.url || ""}>
            <ButtonConfirm label={t('subscribe-session', { ns: NS_BUTTONS })} />
          </Link>
        </Stack>
        <section className="hero-card">
          <Stack spacing={2} className="hero-left">
            <Grid container spacing={{ xs: 1, sm: 2 }} alignItems={'start'} sx={{ textAlign: 'justify', background: '', lineHeight: '0.8rem' }}>
              <Grid size={{ xs: 12, sm: 'grow' }}>
                <OneTeacherLessonComponent teacher={teacher} />
              </Grid>
              <Grid size={{ xs: 12, sm: 7 }}>
                <Stack spacing={1}>
                  <div className="badges">
                    {lessonTeacher?.certified && (
                      <span className="badge-cert">
                        🎓 {t('certified')}
                      </span>
                    )}
                  </div>
                  <h2 style={{ color: "var(--font-color)", marginTop: '10px' }}>{lessonTeacher?.translate?.subtitle}</h2>
                  <Typography variant="caption" >
                    {lessonTeacher?.translate?.description}
                  </Typography>
                </Stack>
              </Grid>

            </Grid>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 'auto' }} sx={{ background: '' }}>
                {
                  lessonTeacher?.translate?.photo_url && <Box sx={{ background: '', width: '100%' }}>
                    <Image
                      src={lessonTeacher?.translate?.photo_url || ''}
                      alt={`lesson-${lessonTeacher?.uid}`}
                      quality={100}
                      width={300}
                      height={150}
                      //loading="lazy"
                      priority
                      style={{
                        width: '100%',
                        height: 'auto',
                        //maxHeight:'400px',
                        borderRadius: '8px',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                }
              </Grid>
              <Grid size={{ xs: 12, sm: 'grow' }} sx={{ background: '' }}>
                <Stack sx={{ background: '' }} spacing={1}>
                  {
                    lessonTeacher?.translate?.goals?.length > 0 && <div className="card">
                      <h2>{"🎯"} {t('goals')}</h2>
                      <Grid container spacing={0.5}>
                        {lessonTeacher.translate.goals.map((item, idx) => (
                          <Grid key={idx} size='auto'>
                            <Chip size="small" sx={{ margin: 0 }} variant="outlined" label={item} />
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  }
                  {
                    lessonTeacher?.translate?.target_audiences?.length > 0 && <div className="card">
                      <h2>{"👨‍💼"} {t('target_audiences')}</h2>
                      <Grid container spacing={0.5}>
                        {lessonTeacher.translate.target_audiences.map((item, idx) => (
                          <Grid key={idx} size='auto'>
                            <Chip size="small" sx={{ margin: 0 }} variant="outlined" label={item} />
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  }
                  {
                    <div className="card">
                      <h2>{"🏢"} {t('installements-title')}</h2>
                      <Stack spacing={1.5}>
                        <Typography variant="caption">{t('installements-subtitle')}</Typography>
                        <Grid container spacing={0.5}>
                          <Grid size={'auto'}>
                            <Typography>{t('location')} {":"}</Typography>
                          </Grid>
                          <Grid size={'grow'}>
                            <Stack>
                              <Typography sx={{ fontWeight: 200 }}>{school?.address}</Typography>
                              <Typography sx={{ fontWeight: 200 }}>({school?.address_1})</Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Stack>
                    </div>
                  }
                </Stack>
              </Grid>
            </Grid>
          </Stack>

          {/* Bloc inscription intégré dans le hero */}
          <aside className="hero-right">
            {/* PROFESSEUR */}
            <div className="teacher-card">
              <p className="teacher-label-text">{t('modalities')}</p>
              <Typography sx={{
                fontSize: '20px',
                fontWeight: 600,
                //textDecoration: 'line-through',
              }}>{`${t('price')} : ${formatPrice(lessonTeacher?.price, lessonTeacher?.currency)}`} <span style={{ color: 'var(--error)', textDecoration: 'line-through', fontSize: '0.85rem' }}>{`${formatPrice(lessonTeacher?.old_price, lessonTeacher?.currency)}`}</span>
              </Typography>
              <Stack sx={{ py: 1 }}>
                <Typography variant="caption">{t('payment')}</Typography>
                <Stack sx={{ py: 0.5 }}>
                  <Typography variant="caption">{`→ ${t('online')} : ${t('payment_online')}`}</Typography>
                  <Typography variant="caption">{`→ ${t('onsite')} : ${t('payment_onsite')}`}</Typography>
                </Stack>
              </Stack>
              <Stack sx={{ py: 1.5 }}>
                <Stack sx={{ py: 0.5 }}>
                  <Typography variant="caption" sx={{color:'var(--font-color)', fontWeight:550}}>{`${t('bank_account')} : `}<span style={{fontWeight:300}}>{school?.bank_account}</span></Typography>
                  <Typography variant="caption" sx={{color:'var(--font-color)', fontWeight:550}}>{`${t('iban')} : `}<span style={{fontWeight:300}}>{school?.iban}</span></Typography>
                  <Typography variant="caption" sx={{color:'var(--font-color)', fontWeight:550}}>{`${t('bank_express')} : `}<span style={{fontWeight:300}}>{parsedPhoneNumber}</span></Typography>
                  <Typography variant="caption" sx={{color:'var(--font-color)', fontWeight:550}}>{`${t('bank_name')} : `}<span style={{fontWeight:300}}>{school?.bank_name}</span></Typography>
                </Stack>
              </Stack>
              <Stack sx={{ py: 1 }}>
                <Link target={'_blank'} href={lessonTeacher?.url || ""}>
                  <ButtonConfirm label={t('subscribe-session', { ns: NS_BUTTONS })} />
                </Link>
              </Stack>
            </div>
            {
              isLoadingSlots ? <Skeleton variant="rounded" width={'100%'} height={50} sx={{ bgcolor: 'var(--card-border)' }}>
                <NextSessionsComponent />
              </Skeleton> : <NextSessionsComponent />
            }
          </aside>
        </section>
      </main>
      <style jsx>{`
                .page {
                  padding: 0px 0px;
                  color: var(--font-color);
                  display: flex;
                  justify-content: center;
                }
                .link {
                  color: var(--primary);
                  cursor: pointer;
                }
                .link:hover {
                  color: var(--primary);
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
                  gap: 10px;
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
                .teacher-label-text {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: #9ca3af;
                  margin-bottom: 6px;
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
                  color: var(--font-color);
                }
        
                h1 {
                  margin: 0;
                  font-size: 1.5rem;
                  line-height: 1.5rem;
                  color: var(--font-color);
                }
        
                .muted {
                  margin-top: 5px;
                  font-size: 0.9rem;
                  color: #9ca3af;
                }
        
                .badges {
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
                  border:0.1px solid var(--card-border);
                  color: var(--font-color);
                  border-radius: 16px;
                  padding: 14px 14px 16px;
                }
        
                .card h2 {
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
                  list-style: none;
                  padding-left: 0;
                  margin: 0;
                  font-size: 0.88rem;
                            color: var(--grey-light);
                              color: var(--font-color);
                }
        
                .list li {
                  margin-bottom: 4px;
                  position: relative;
                  padding-left: 0.75rem;
                }

                .list li::before {
                  content: "-";
                  position: absolute;
                  left: 0;
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