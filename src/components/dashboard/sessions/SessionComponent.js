"use client"
import React, { useEffect, useState } from "react";
import { ClassLesson, ClassLessonTranslate } from "@/classes/ClassLesson";
import { formatDuration, formatPrice, getFormattedDate, getFormattedDateCompleteNumeric, getFormattedDateNumeric, getFormattedHour, translateWithVars } from "@/contexts/functions";
import { NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS } from "@/contexts/i18n/settings";
import { Box, Button, CircularProgress, Grid, Stack, Typography } from "@mui/material";

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
import { IconDuration, IconHour, IconLevel, IconLink, IconLocation, IconTranslation } from "@/assets/icons/IconsComponent";
import { useThemeMode } from "@/contexts/ThemeProvider";
import BadgeFormatLessonContained from "../lessons/BadgeFormatLessonContained";
import ButtonRemove from "../elements/ButtonRemove";
import { useSession } from "@/contexts/SessionProvider";
import AlertComponent from "@/components/elements/AlertComponent";

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


function MetaChip({ label, value,}) {
  return (
    <>
      <div className="meta-chip">
        <Stack alignItems={'center'} direction={'row'} spacing={0.5}>
          <Stack direction={'row'} alignItems={'center'} spacing={0.25}>
            <Typography className="meta-label" sx={{
              fontSize: '0.85rem',
              color: 'var(--grey-dark)',
              fontWeight: 500,
            }}>{label}</Typography>
            <Typography
              className="meta-value"
              //noWrap
              sx={{
                width: '100%',
                fontSize: '0.8rem',
                color: 'var(--font-color)',
                fontWeight: 400,
              }}>{value}</Typography>
          </Stack>
        </Stack>


      </div>

      <style jsx>{`
        .meta-chip {
          border-radius: 999px;
          border: 0.1px solid var(--card-border);
          background: #020617;
          background: transparent;
          padding: 2.5px 7px;
          font-size: 0.78rem;
          display: inline-flex;
          width:'100%;
        }

        .meta-label {
          color: #9ca3af;
          font-size: 0.9rem;
          color: var(--grey-dark);
        }

        .meta-value {
          color: var(--font-color);
          font-weight: 500;
          font-size: 0.85rem;
        }
      `}</style>
    </>
  );
}
function MetaChipIcon({ label, value, icon = <></> }) {
  return (
    <>
      <div className="meta-chip">
        <Stack alignItems={'center'} direction={'row'} spacing={0.5}>
          <Stack justifyContent={'center'}>
            <Box sx={{
              //border: `0.1px solid var(--card-border)`, 
              background: '',
              color: 'var(--card-border)',
              //p: 0.3, 
              //borderRadius: '100%' 
            }}>
              {icon}
            </Box>
          </Stack>
          <Stack direction={'row'} alignItems={'center'} spacing={0.25}>
            <Typography className="meta-label" sx={{
              fontSize: '0.85rem',
              color: 'var(--grey-dark)',
              fontWeight: 500,
            }}>{label}</Typography>
            <Typography
              className="meta-value"
              //noWrap
              sx={{
                width: '100%',
                fontSize: '0.8rem',
                color: 'var(--font-color)',
                fontWeight: 400,
              }}>{value}</Typography>
          </Stack>
        </Stack>


      </div>

      <style jsx>{`
        .meta-chip {
          border-radius: 999px;
          border: 0.1px solid var(--card-border);
          background: #020617;
          background: transparent;
          padding: 2.5px 7px;
          font-size: 0.78rem;
          display: inline-flex;
          width:'100%;
        }

        .meta-label {
          color: #9ca3af;
          font-size: 0.9rem;
          color: var(--grey-dark);
        }

        .meta-value {
          color: var(--font-color);
          font-weight: 500;
          font-size: 0.85rem;
        }
      `}</style>
    </>
  );
}
function MetaChipTitle({ label, value, status = '' }) {
  const STATUS_CONFIG = ClassSession.STATUS_CONFIG;
  const colors = STATUS_CONFIG[status] || [];
  const Icon = () => {
    switch (label) {
      case 'certified':
        return <IconCertificate height={14} width={14} />;
      case 'date':
        return <IconCalendar height={14} width={14} />;
      case 'hour':
        return <IconHour height={14} width={14} />;
      case 'teacher':
        return <IconTeachers height={14} width={14} />;
      default:
        return null;
    }
  }
  console.log("STATUS", status)
  return (
    <>
      <div className="meta-chip">
        <Icon />
        <span className="meta-value">{value}</span>
      </div>

      <style jsx>{`
        .meta-chip {
          border-radius: 999px;
          background: #020617;
          background: transparent;
          border: 0.1px solid ${colors?.color};
          border: 0.1px solid var(--card-border);
          padding: 4px 7px;
          font-size: 0.78rem;
          display: inline-flex;
          gap: 6px;
          color: ${colors?.color};
          color: var(--card-border);
        }

        .meta-label {
          color: #9ca3af;
          color: var(--font-color);
        }

        .meta-value {
          color: var(--font-color);
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

function CardFormat({ slot = null, format = "" }) {
  const { session, update, slots } = useSession();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const { ONLINE, ONSITE } = ClassSession.FORMAT;
  const { t } = useTranslation(ClassSession.NS_COLLECTION, NS_LANGS);
  return (<Grid key={`${format}`} size={{ xs: 12, sm: 6 }} sx={{
    border: `0.1px solid var(--card-border)`,
    borderRadius: '10px',
    p: 1,
    //background:FORMAT_CONFIG['onsite']?.glow,
    //display: slot?.format === ClassSession.FORMAT.HYBRID || slot?.format === format ? 'block' : 'none'
  }}>
    <Stack direction={'row'} spacing={1} alignItems={'center'}>
      <BadgeFormatLessonContained format={format} />
      <Typography variant="caption" sx={{ color: 'var(--font-color)' }}>
        <Trans
          t={t}
          i18nKey={'seats_free'}
          values={{
            total: slot?.[`seats_availables_${format}`],
            taken: slot?.countSubscribers?.(format)
          }}
        />
      </Typography>

    </Stack>
    <div className="hero-seats">
      <p className="seats-sub">
        <Trans
          t={t}
          i18nKey={slot?.isFull?.(format) ? 'full' : 'seats_availables'}
          values={{ count: slot?.countFree?.(format) }}
          className="seats-sub"
        />
      </p>
      <div className="seats-bar">
        <div
          className="seats-fill"
          style={{
            width: `${(slot?.countSubscribers?.(format) / slot?.[`seats_availables_${format}`]) * 100}%`,
          }}
        />
      </div>
    </div>
    <Stack direction={'row'} spacing={0.5}>
      {
        slot?.isSubscribe?.(user.uid, format) && <ButtonRemove
          disabled={!slot?.isSubscribe?.(user.uid, format) || processing}
          //variant='outlined'
          //  disabled={!selectedSlot?.isSubscribe?.(user.uid) || processing}
          loading={processing}
          //color="error"
          onClick={async () => {
            //update
            setProcessing(true);
            slot?.unsubscribeStudent?.(user.uid, format);
            session?.updateSlot(slot);
            await update(session);
            //console.log("new slot ?", slot);
            setProcessing(false);
            //alert('ok');
            //console.log("new slot ?", session.slots)
          }}
          label={t('btn-unsubscribe')}
          style={{
            marginTop: '10px', width: '100%',
            //display: !slot?.isSubscribe?.(user.uid) || processing ? 'none' : 'flex'
          }}
        />
      }

      <ButtonConfirm
        disabled={slot?.isFull?.(format) || slot?.isSubscribe?.(user.uid) || processing}
        loading={processing}
        onClick={async () => {
          //update
          setProcessing(true);
          slot?.subscribeStudent?.(user.uid, format);
          session?.updateSlot(slot);
          //session.update({slots:slots.map(s=>s.uid===selectedSlot.uid?selectedSlot:s)});
          await update(session);
          //console.log("new slot ?", session.slots);
          //alert('ok');
          //console.log("new slot ?", session.slots)
          setProcessing(false);
        }}
        label={t('btn-subscribe')}
        style={{
          marginTop: '10px', width: '100%',
          //display: slot?.isFull?.(format) || processing || slot?.isSubscribe?.(user.uid) ? 'none' : 'flex'
        }}
      />
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
        }`}
    </style>
  </Grid>)
}
function CardSlot({ title = "", valueComponent = <></>, icon = <></> }) {
  return (<Stack direction={'row'} spacing={1} sx={{ width: '100%', px: 0.5, py: 0.25, borderRadius: '5px', border: `0.1px solid var(--card-border)` }}>
    <Stack justifyContent={'center'}>
      <Box sx={{ border: `0.1px solid var(--card-border)`, background: '', color: 'var(--primary)', p: 0.3, borderRadius: '100%' }}>
        {icon}
      </Box>
    </Stack>
    <Stack sx={{ width: '100%' }}>
      <Typography noWrap color="var(--grey-dark)" fontSize={'0.9rem'}>{title}</Typography>
      {valueComponent}
    </Stack>
  </Stack>)
}

export default function SessionComponent({ }) {
  const { theme } = useThemeMode();
  const { primary } = theme.palette;
  const { user } = useAuth();
  const { t } = useTranslation(ClassSession.NS_COLLECTION, NS_LANGS);
  const errorsTranslate = t('errors');
  const { lang } = useLanguage();
  const { session, slot, update, slots,isLoading } = useSession();
  const { ONLINE, ONSITE } = ClassSession.FORMAT;
  //const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(initialCourse);
  const [canSubscribe, setCanSubscribe] = useState(true);

  const FORMAT_CONFIG = ClassSession.FORMAT_CONFIG;
  const formatCfg = FORMAT_CONFIG[session?.format];
  const [dialogOptions, setDialogOptions] = useState({
    title: "Souhaites-tu ajouter cet élément ?",
    updateList: null,
    actionConfirm: null,
    actionCancel: null,
    labelConfirm: "Oui",
    labelCancel: "Non",
    open: false,
    setOpen: null
  });

  //const canSubscribe = new Date() >= slot?.last_subscribe_time;

  useEffect(()=>{
    if(session && slots.length>0 && slot && new Date() >= slot.last_subscribe_time) {
      setCanSubscribe(false);
    } else {
      setCanSubscribe(true);
    }
  }, [session]);

  return (<Stack>
    <div className="page">
      <main className="container">
        <section className="hero-card">
          <Grid spacing={1.5} container sx={{ background: '' }}>
            <Grid size={{ xs: 12, sm: 7 }} sx={{ background: '' }}>
              <Stack spacing={1}>
                <div className="hero-left" style={{ background: '' }}>
                  <div style={{ marginBottom: '5px' }}>
                    <MetaChip
                    label={t('lang', { ns: NS_LANGS })}
                    value={t(session?.lesson?.category, { ns: ClassLesson.NS_COLLECTION })}
                    icon={<IconTranslation height={16} width={16} />}
                  />
                  </div>
                  <h1>{session?.lesson?.translate?.title}</h1>
                  <Grid container spacing={0.5} sx={{ marginY: 1, width: '100%' }}>
                    <Grid size={'auto'}>
                      <MetaChipIcon
                        label={t('level')}
                        value={t(slot?.level)}
                        icon={<IconLevel height={16} width={16} />}
                      />
                    </Grid>
                    <Grid size={'auto'}>
                      <MetaChipIcon
                        label={t('duration')}
                        value={formatDuration(slot?.duration)}
                        icon={<IconDuration height={16} width={16} />}
                      />
                    </Grid>
                    <Grid>
                      <MetaChipIcon
                    label={t('lang', { ns: NS_LANGS })}
                    value={t(slot?.lang, { ns: NS_LANGS })}
                    icon={<IconTranslation height={16} width={16} />}
                  />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} sx={{ marginY: 1, width: '100%' }}>
                    {
                      (slot?.format === ClassSessionSlot.FORMAT.HYBRID || slot?.format === ClassSessionSlot.FORMAT.ONSITE) && <Grid>
                        <MetaChipIcon
                          label={t('location')}
                          value={slot?.location}
                          icon={<IconLocation height={16} width={16} />}
                        />
                      </Grid>
                    }
                    {
                      (slot?.format === ClassSessionSlot.FORMAT.HYBRID || slot?.format === ClassSessionSlot.FORMAT.ONLINE) && slot?.url && slot?.isSubscribe?.(user.uid) && <Grid>
                        <MetaChipIcon
                          label={t('url')}
                          value={<Link href={slot?.url || ""} target="_blank" style={{ color: "var(--primary)" }}>{session?.code}</Link>}
                          icon={<IconLink height={16} width={16} />}
                        />
                      </Grid>
                    }
                  </Grid>
                  <Grid container spacing={1}>
                    {
                      canSubscribe && [ONLINE, ONSITE].map((format) => {
                        if (slot?.format === ClassSession.FORMAT.HYBRID || slot?.format === format) {
                          return (<CardFormat key={format} slot={slot} format={format} />)
                        }
                        return null;
                      })
                    }
                    {
                      !canSubscribe && <AlertComponent
                        subtitle={<Trans
                          t={t}
                          i18nKey={'errors.last_subscribe_time'}
                          values={{
                            date: `${getFormattedDateNumeric(slot?.last_subscribe_time, lang)} - ${getFormattedHour(slot?.last_subscribe_time, lang)}`,
                          }}
                          components={{ 
                              //span: <Typography variant="body2" color="text.secondary" />, 
                              b: <strong /> 
                          }}
                        />
                        }
                        severity="warning"
                      />
                      /*
                      last_subscribe_time
                      */
                    }
                  </Grid>
                </div>
                {/* Bloc inscription intégré dans le hero */}
                {
                  canSubscribe && <aside className="hero-right">
                    <div className="teacher-card">
                      <h2 className="teacher-label">{t('certification')}</h2>
                      {session?.lesson?.certified ? (
                        <>
                          <p className="cert-main">
                            {t('certification_block.title')}{" "}
                            <strong>{SCHOOL_NAME}</strong>.
                          </p>
                          <ul className="list small">
                            {
                              t('certification_block.items', { returnObjects: true })?.map?.((text, i) => {
                                return (<li key={`${text}-${i}`}>{text}</li>)
                              })
                            }
                          </ul>
                          <p className="cert-badge">
                            {t('certification_official')}
                          </p>
                        </>
                      ) : (
                        <p className="cert-main">
                          {t('certification_not')}
                        </p>
                      )}
                    </div>
                  </aside>
                }
              </Stack>
            </Grid>
            <Grid size={'grow'} sx={{ background: '' }}>
              <Box sx={{ background: '', width: '100%' }}>
                <Image
                  src={session?.lesson?.photo_url || ''}
                  alt={`lesson-${session?.lesson?.uid}`}
                  quality={100}
                  width={300}
                  height={150}
                  //loading="lazy"
                  priority
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
          </Grid>



        </section>
      </main>
      <style jsx>{`
                .page {
                  background: transparent;
                  padding: 10px 0px;
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
                  font-size: 1.25rem;
                  line-height: 1.5rem;
                }
        
                .muted {
                  margin: 0;
                  font-size: 0.9rem;
                  color: #9ca3af;
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
                  color: #bbf7d0;
                  border: 1px solid #16a34a;
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