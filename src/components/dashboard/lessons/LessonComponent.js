import React, { useEffect, useState } from "react";
import { IconVisible } from "@/assets/icons/IconsComponent";
import { ClassLesson } from "@/classes/ClassLesson";
import { formatDuration, getFormattedDateNumeric, getFormattedHour } from "@/contexts/functions";
import { NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS, NS_LESSONS_ONE } from "@/contexts/i18n/settings";
import { Box, CircularProgress, Grid, List, ListItem, Skeleton, Stack, Typography } from "@mui/material";

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
  //const colorSlot = slot?.start_date?.getTime() >= new Date() ? 'green' : 'red';
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
    <div className="slot-row">
      <Stack key={`${slot?.uid_session}-${slot?.uid_intern}`} alignItems={'center'} spacing={1.5} direction={'row'}>
        <span className="slot-dot" style={{
          background: colorSlot?.color,
          boxShadow: `0px 0px 12px ${colorSlot?.glow}`,
        }} />
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--font-color)' }}>{`${session?.code} (${session?.uid_intern})`}</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.85rem', color: 'var(--font-color)', opacity: 0.7 }}>{`${getFormattedDateNumeric(slot?.start_date)} ${getFormattedHour(slot?.start_date)}-${getFormattedHour(slot?.end_date)}`}</Typography>
        <Box
          onClick={() => {
            setMode('read');
            setUidSession(slot?.uid_session);
            setUidSlot(slot?.uid_intern);
            setOpen(true);

          }}
          className="slot-view-icon"
          sx={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            "&:hover": { 
              color: "var(--primary)",
              transform: 'scale(1.1)'
            },
          }}>
          <IconVisible height={20} />
        </Box>
      </Stack>
    </div>
    <style jsx>{`
      .slot-row {
        padding: 12px;
        border-radius: 12px;
        background: var(--card-color);
        border: 1px solid var(--card-border);
        transition: all 0.3s ease;
        margin-bottom: 8px;
      }
      .slot-row:hover {
        background: var(--card-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: translateX(4px);
      }
      .slot-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        flex-shrink: 0;
      }
      .slot-view-icon {
        margin-left: auto;
        color: var(--font-color);
        opacity: 0.6;
      }
      .slot-view-icon:hover {
        opacity: 1;
      }
    `}</style>
  </>)
}

export default function LessonComponent() {
  const { user } = useAuth();
  const { t } = useTranslation([ClassLesson.NS_COLLECTION,NS_BUTTONS, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const { lang } = useLanguage();
  const { path } = usePathname();
  const { getOneUser } = useUsers();
  //const [lesson, setLesson] = useState(null);
  const { lesson } = useLesson();
  const { chapter, chapters, subchapters, lastStat, setUidChapter, subchapter, setSubchapter, stats } = useChapter();
  const { sessions, isLoading: isLoadingSessions, isLoadingSlots } = useSession();
  const [course, setCourse] = useState(initialCourse);
  const [isEnrolled, setIsEnrolled] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const seatsLeft = Math.max(lesson?.seats_availables || 0 - lesson?.seats_taken || 0, 0);
  const isFull = seatsLeft <= 0 && !isEnrolled;
  const formatCfg = FORMAT_CONFIG[lesson?.format];

  useEffect(() => {
    if (lesson) {
      lesson.update({teacher:getOneUser(lesson.uid_teacher)})
    }
  }, [lesson])

  return (<Stack sx={{ color: "var(--font-color)" }}>
    <div>
      <main>
        <section className="hero-card">
          <div className="hero-left">
            <p className="breadcrumb">{t(lesson?.category).toUpperCase()}</p>
            <h1 style={{ color: "var(--font-color)" }}>{lesson?.translate?.title}</h1>
            <p className="muted">
              {lesson?.translate?.subtitle}
            </p>

            <div className="badges">
              {lesson?.certified && (
                <span className="badge-cert">
                  🎓 {t('certified')}
                </span>
              )}
            </div>
            <p className="hero-description">
              {lesson?.translate?.description}
            </p>
            {
              lesson?.translate?.photo_url && <Box sx={{ 
                mt: 2, 
                width: { xs: '100%', sm: '70%' },
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                }
              }}>
                <Image
                  src={lesson?.translate?.photo_url || ''}
                  alt={`lesson-${lesson?.uid}`}
                  quality={100}
                  width={300}
                  height={150}
                  priority
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>
            }
          </div>

          {/* Bloc inscription intégré dans le hero */}
          <aside className="hero-right">
            {/* PROFESSEUR */}
            <div className="teacher-card">
              <p className="teacher-label-text">{t('title-online', { ns: NS_LESSONS_ONE })}</p>
              <List dense disablePadding sx={{ mb: 2 }}>
                {
                  chapters?.sort((a, b) => a.uid_intern - b.uid_intern).map((chapter, i) => {
                    return (<ListItem key={`${chapter.uid_intern}-${i}`} disableGutters sx={{ px: 0, mb: 0.5 }}>
                      <Link href={`${PAGE_LESSONS}/${chapter.uid_lesson}${PAGE_CHAPTERS}/${chapter.uid}`} className="chapter-link">
                        <Stack direction={'row'} alignItems={'center'} spacing={1.5}
                          sx={{
                            padding: '8px 12px',
                            borderRadius: '10px',
                            transition: 'all 0.3s ease',
                            ":hover": {
                              backgroundColor: 'var(--primary-shadow-xs)',
                              color: 'var(--primary)',
                              cursor: 'pointer',
                              transform: 'translateX(4px)',
                            }
                          }}>
                          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }} >{`${chapter.uid_intern}. `}{chapter.translate?.title}</Typography>
                        </Stack>
                      </Link>
                    </ListItem>)
                  })
                }
              </List>
              <Link href={`${PAGE_LESSONS}/${lesson?.uid}${PAGE_CHAPTERS}`}>
                <ButtonConfirm label={t('follow-lesson-online', { ns: NS_BUTTONS })} />
              </Link>
            </div>
            <TeacherComponent />
          </aside>
        </section>

        {
          lesson?.translate?.tags?.length > 0 && <Grid spacing={2} container sx={{ mb: 3 }}>
            {lesson?.translate?.tags?.map((item, i) => (
              <Grid size={{ xs: 12, sm: 4 }} key={`${item.title}${i}`}>
                <div className="tag-card">
                  <h3 className="tag-title">{item.title}</h3>
                  <p className="tag-description">{item.subtitle}</p>
                </div>
              </Grid>
            ))}
          </Grid>

        }



        {/* GRID PRINCIPALE */}
        <section className="grid">
          {/* COL GAUCHE : contenu du cours */}
          <div className="main-col">
            <div className="card">
              <h2>{t('description')}</h2>
              <p className="description">{lesson?.translate?.description}</p>
            </div>
            {
              lesson?.translate?.goals?.length > 0 && <div className="card">
                <h2>{t('goals')}</h2>
                <ul className="list">
                  {lesson.translate.goals.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            }
            {
              lesson?.translate?.programs?.length > 0 && <div className="card">
                <h2>{t('programs')}</h2>
                <ol className="list ordered">
                  {lesson.translate.programs.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            }
            {
              lesson?.translate?.prerequisites?.length > 0 && <div className="card">
                <h2>{t('prerequisites')}</h2>
                <ul className="list">
                  {lesson.translate.prerequisites.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            }
            {
              lesson?.translate?.target_audiences?.length > 0 && <div className="card">
                <h2>{t('target_audiences')}</h2>
                <ul className="list">
                  {lesson.translate.target_audiences.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            }
          </div>

          {/* COL DROITE : infos pratiques & certification */}
          <div className="side-col">
            <div className="card">
              <h2>{"🎓"} {t('certification')}</h2>
              {lesson?.certified ? (
                <>
                  <p className="cert-main">
                    {t('certification_block.title')}{" "}
                    <strong>{SCHOOL_NAME}</strong>.
                  </p>
                  <ul className="list small">
                    {
                      t('certification_block.items', { returnObjects: true })?.map((text, i) => {
                        return (<li key={`${text}-${i}`}>{text}</li>)
                      })
                    }
                  </ul>
                  {course.isOfficialCertificate && (
                    <p className="cert-badge">
                      {t('certification_official')}
                    </p>
                  )}
                </>
              ) : (
                <p className="cert-main">
                  {t('certification_block.no_certification')}
                </p>
              )}
            </div>

            {
              lesson?.translate?.materials?.length > 0 && <div className="card">
                <h2>{t('materials')}</h2>
                <ul className="list small">
                  {
                    lesson.translate.materials.map((material, index) => {
                      return (<li key={`${material}-${index}`}>
                        {material}
                      </li>)
                    })
                  }
                </ul>
              </div>
            }
            {
              lesson?.translate?.notes?.length > 0 && <div className="card">
                <h2>{t('notes')}</h2>
                <ul className="list small">
                  {
                    lesson.translate.notes.map((note, index) => {
                      return (<li key={`${note}-${index}`}>
                        {note}
                      </li>)
                    })
                  }
                </ul>
              </div>
            }
          </div>
        </section>
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
                  background: transparent;
                }
                .hero-description {
                  margin: 12px 0 16px;
                  font-size: 1rem;
                  line-height: 1.6;
                  color: var(--grey-light);
                  max-width: 620px;
                  transition: color 0.3s ease;
                }
        
                .header {
                  display: flex;
                  justify-content: space-between;
                  gap: 16px;
                  margin-bottom: 24px;
                  flex-wrap: wrap;
                }
        
                .hero-card {
                  display: grid;
                  grid-template-columns: minmax(0, 2fr) minmax(260px, 1.2fr);
                  gap: 24px;
                  border-radius: 20px;
                  border: 1px solid var(--card-border);
                  background: var(--card-color);
                  padding: 28px 28px 32px;
                  margin-bottom: 24px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
        
                @media (max-width: 900px) {
                  .hero-card {
                    grid-template-columns: 1fr;
                    padding: 20px;
                    gap: 20px;
                  }
                }
        
                .hero-meta {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 10px;
                }
        
                .hero-right {
                  border-radius: 16px;
                  border: none;
                  background: transparent;
                  padding: 0px;
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                }
                .hero-right-top {
                  border-radius: 16px;
                  border: 1px solid var(--card-border);
                  padding: 20px;
                  background: var(--card-color);
                  transition: all 0.3s ease;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }
                .hero-right-top:hover {
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                  transform: translateY(-2px);
                }
                .teacher-card {
                  margin-top: 0px;
                  border-radius: 16px;
                  border: 1px solid var(--card-border);
                  padding: 20px;
                  background: var(--card-color);
                  font-size: 0.9rem;
                  transition: all 0.3s ease;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }
                .teacher-card:hover {
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                  transform: translateY(-2px);
                }
        
                .teacher-label {
                  font-size: 0.75rem;
                  font-size: 1.1rem;
                  font-weight: 600;
                  color: var(--font-color);
                  letter-spacing: -0.01em;
                }
                .teacher-label-text {
                  font-size: 0.75rem;
                  font-size: 1.1rem;
                  font-weight: 600;
                  color: var(--font-color);
                  margin-bottom: 12px;
                  letter-spacing: -0.01em;
                }
        
                .teacher-main {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  margin-bottom: 12px;
                }
        
                .teacher-text {
                  font-size: 0.9rem;
                }
        
                .teacher-name {
                  margin: 0;
                  font-weight: 600;
                  line-height: 1.4;
                  color: var(--font-color);
                }
        
                .teacher-role {
                  margin: 0;
                  color: var(--grey-light);
                  font-size: 0.85rem;
                }
        
                .teacher-bio {
                  margin: 8px 0 12px;
                  font-size: 0.88rem;
                  color: var(--grey-light);
                  line-height: 1.5;
                }
        
                .teacher-email {
                  margin: 0 0 8px;
                  font-size: 0.82rem;
                  color: var(--grey-light);
                }
        
                .teacher-email span {
                  color: var(--grey-light);
                }
                .hero-seats {
                  margin-top: 8px;
                  font-size: 0.9rem;
                }
                .seats-sub {
                  margin: 4px 0 6px;
                  font-size: 0.82rem;
                  color: var(--grey-light);
                }
                .seats-bar {
                  width: 100%;
                  height: 8px;
                  border-radius: 999px;
                  background: var(--grey-hyper-light);
                  overflow: hidden;
                }
        
                .seats-fill {
                  height: 100%;
                  background: linear-gradient(90deg, var(--success), #16a34a);
                  transition: width 0.3s ease;
                }
        
                .breadcrumb {
                  margin: 0 0 8px;
                  font-size: 0.8rem;
                  font-weight: 600;
                  color: var(--primary);
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  transition: color 0.3s ease;
                }
        
                h1 {
                  margin: 0 0 8px;
                  font-size: 2rem;
                  line-height: 1.2;
                  font-weight: 700;
                  color: var(--font-color);
                  letter-spacing: -0.02em;
                }
        
                @media (max-width: 600px) {
                  h1 {
                    font-size: 1.6rem;
                  }
                }
        
                .muted {
                  margin-top: 8px;
                  font-size: 1rem;
                  color: var(--grey-light);
                  line-height: 1.5;
                }
        
                .badges {
                  margin-top: 16px;
                  display: flex;
                  gap: 8px;
                  flex-wrap: wrap;
                }
        
                .badge-format {
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  border-radius: 12px;
                  border-width: 1px;
                  border-style: solid;
                  padding: 6px 12px;
                  font-size: 0.85rem;
                  font-weight: 500;
                  transition: all 0.3s ease;
                }
        
                .badge-dot {
                  width: 8px;
                  height: 8px;
                  border-radius: 999px;
                }
        
                .badge-cert {
                  border-radius: 12px;
                  padding: 6px 14px;
                  font-size: 0.85rem;
                  font-weight: 500;
                  background: rgba(34, 197, 94, 0.1);
                  color: var(--success);
                  border: 1px solid rgba(34, 197, 94, 0.3);
                  transition: all 0.3s ease;
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                }
                .badge-cert:hover {
                  background: rgba(34, 197, 94, 0.15);
                  transform: translateY(-1px);
                }
        
                .enroll-card {
                  background: var(--card-color);
                  border-radius: 16px;
                  padding: 24px;
                  border: 1px solid var(--card-border);
                  min-width: 260px;
                  max-width: 320px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                  transition: all 0.3s ease;
                }
        
                .price {
                  margin: 0;
                  font-size: 1.9rem;
                  font-weight: 700;
                }
        
                .currency {
                  font-size: 1.1rem;
                  color: var(--grey-light);
                  margin-left: 4px;
                  font-weight: 500;
                }
        
                .price-helper {
                  margin: 6px 0 0;
                  font-size: 0.85rem;
                  color: var(--grey-light);
                }
        
                .installments {
                  margin: 10px 0 0;
                  font-size: 0.85rem;
                  color: var(--font-color);
                }
        
                .dates {
                  display: flex;
                  gap: 16px;
                  margin-top: 12px;
                  font-size: 0.9rem;
                }
        
                .date-label {
                  margin: 0;
                  font-size: 0.8rem;
                  color: var(--grey-light);
                }
        
                .date-value {
                  margin: 4px 0 0;
                  font-weight: 500;
                }
        
                .seats {
                  margin-top: 12px;
                  font-size: 0.9rem;
                }
        
                .seats-line {
                  margin: 0;
                }
        
                .seats-left {
                  margin: 4px 0 0;
                  font-size: 0.82rem;
                  color: var(--grey-light);
                }
        
                .btn {
                  border-radius: 12px;
                  padding: 10px 18px;
                  border: 1px solid var(--card-border);
                  background: var(--card-color);
                  color: var(--font-color);
                  font-size: 0.95rem;
                  font-weight: 500;
                  cursor: pointer;
                  transition: all 0.3s ease;
                }
        
                .primary {
                  background: linear-gradient(135deg, var(--primary), #4f46e5);
                  border-color: transparent;
                  color: white;
                }
        
                .btn-enroll {
                  width: 100%;
                  margin-top: 16px;
                }
        
                .btn-disabled {
                  background: var(--grey-hyper-light);
                  cursor: not-allowed;
                  opacity: 0.6;
                }
        
                .secure-note {
                  margin: 10px 0 0;
                  font-size: 0.78rem;
                  color: var(--grey-light);
                }
        
                .grid {
                  display: grid;
                  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.1fr);
                  gap: 20px;
                  margin-bottom: 40px;
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
                    gap: 16px;
                  }
                }
        
                .main-col,
                .side-col {
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                }
        
                .card {
                  background: var(--card-color);
                  color: var(--font-color);
                  border-radius: 18px;
                  padding: 24px;
                  border: 1px solid var(--card-border);
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }
                .card:hover {
                  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                  transform: translateY(-2px);
                }
        
                .card h2 {
                  margin: 0 0 16px;
                  padding: 0;
                  font-size: 1.25rem;
                  font-weight: 700;
                  color: var(--font-color);
                  letter-spacing: -0.01em;
                }
        
                .description {
                  margin: 0;
                  padding-left: 0;
                  font-size: 0.95rem;
                  color: var(--grey-light);
                  line-height: 1.7;
                }
        
                .list {
                  list-style: none;
                  padding-left: 0;
                  margin: 0;
                  font-size: 0.92rem;
                  color: var(--font-color);
                }
        
                .list li {
                  margin-bottom: 10px;
                  position: relative;
                  padding-left: 24px;
                  line-height: 1.6;
                  color: var(--grey-light);
                }

                .list li::before {
                  content: "✓";
                  position: absolute;
                  left: 0;
                  color: var(--primary);
                  font-weight: 600;
                  font-size: 1rem;
                }
        
                .list.ordered {
                  padding-left: 20px;
                  list-style: decimal;
                }
        
                .list.ordered li {
                  padding-left: 0;
                }
        
                .list.ordered li::marker {
                  color: var(--primary);
                  font-weight: 600;
                }
        
                .list.ordered li::before {
                  display: none;
                }
        
                .list.small {
                  font-size: 0.88rem;
                }
                .list.small li {
                  margin-bottom: 8px;
                  padding-left: 20px;
                }
                .list.small li::before {
                  font-size: 0.9rem;
                }
        
                .cert-main {
                  margin: 0 0 12px;
                  font-size: 0.95rem;
                  color: var(--font-color);
                  line-height: 1.6;
                }
        
                .cert-badge {
                  margin-top: 12px;
                  font-size: 0.85rem;
                  padding: 8px 12px;
                  border-radius: 10px;
                  background: rgba(34, 197, 94, 0.1);
                  color: var(--success);
                  border: 1px solid rgba(34, 197, 94, 0.3);
                  display: inline-block;
                  font-weight: 500;
                  transition: all 0.3s ease;
                }
                .cert-badge:hover {
                  background: rgba(34, 197, 94, 0.15);
                  transform: translateY(-1px);
                }
                
                .tag-card {
                  background: var(--card-color);
                  color: var(--font-color);
                  border-radius: 18px;
                  padding: 24px;
                  border: 1px solid var(--card-border);
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                }
                .tag-card:hover {
                  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                  transform: translateY(-4px);
                  border-color: var(--primary);
                }
                .tag-title {
                  margin: 0 0 12px;
                  font-size: 1.15rem;
                  font-weight: 700;
                  color: var(--font-color);
                  letter-spacing: -0.01em;
                }
                .tag-description {
                  margin: 0;
                  font-size: 0.92rem;
                  color: var(--grey-light);
                  line-height: 1.6;
                  flex: 1;
                }
                
                .chapter-link {
                  text-decoration: none;
                  color: inherit;
                  display: block;
                }
                .chapter-link:hover {
                  text-decoration: none;
                }
              `}</style>
    </div>
  </Stack>);
}