"use client"
import React, { useEffect, useState } from "react";
import { ClassLesson, ClassLessonTranslate } from "@/classes/ClassLesson";
import { formatDuration, formatPrice, getFormattedDate, getFormattedDateCompleteNumeric, getFormattedDateNumeric, getFormattedHour, translateWithVars } from "@/contexts/functions";
import { NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS } from "@/contexts/i18n/settings";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import BadgeFormatLesson from "@/components/dashboard/lessons/BadgeFormatLesson";
import { useLanguage } from "@/contexts/LangProvider";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import Image from "next/image";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { useAuth } from "@/contexts/AuthProvider";
import { SCHOOL_NAME, WEBSITE_NAME } from "@/contexts/constants/constants";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { ClassSession } from "@/classes/ClassSession";
import Link from "next/link";
import { useSession } from "@/contexts/SessionProvider";

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

export default function SessionSubscribeComponent({ }) {
  const { user } = useAuth();
  const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const { lang } = useLanguage();
  const { session, update, slot, isLoading: processing } = useSession();
  const { ONLINE, ONSITE } = ClassSession.FORMAT;
  //const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(initialCourse);
  const [isEnrolled, setIsEnrolled] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  //const [editing, setEditing] = useState(false);
  //const seatsLeft = Math.max(session?.seats_availables || 0 - session?.seats_taken || 0, 0);
  //const isFull = seatsLeft <= 0 && !isEnrolled;
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
  })
  useEffect(() => {
    if (slot) {
      console.log("get one slot DIALOG", slot)
    }
  }, [slot]);

  return (<Stack>
    <div className="page">
      <main className="container">
        <Stack spacing={2} alignItems={'center'}>
          <Typography variant='h5'>{`T'inscrire à ce cours ?`}</Typography>
        </Stack>
        <Grid container spacing={1} justifyContent={'center'} sx={{ py: 1 }}>
          <Grid size={12}>
            <Grid container spacing={1} justifyContent={'center'}>
              {
                [ONSITE, ONLINE].map((format, i) => {
                  return (<Grid key={`${format}-${i}`} size={{ xs: 12, sm: 6 }} sx={{
                    border: `0.1px solid var(--card-border)`,
                    borderRadius: '10px',
                    p: 1,
                    display: slot?.format === ClassSession.FORMAT.HYBRID || slot?.format === format ? 'block' : 'none'
                  }}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                      <BadgeFormatLesson format={format} />
                      <p className="seats-main">
                        {slot?.countSubscribers?.(format)}/{slot?.[`seats_availables_${format}`]} {t('seats_taken')}
                      </p>
                    </Stack>
                    <div className="hero-seats">

                      <p className="seats-sub">
                        {slot?.isFull?.(format)
                          ? "Cours complet actuellement"
                          : `${slot?.[`seats_availables_${format}`] - slot?.countSubscribers?.(format)} ${t('seats_availables')}`}
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

                    <ButtonConfirm
                      disabled={slot?.isFull?.(format) || processing || slot?.isSubscribe?.(user.uid)}
                      loading={processing}
                      onClick={async () => {
                        //update
                        slot?.subscribeStudent?.(user.uid, format);
                        session.updateSlot(slot);
                        await update(session);
                        console.log("new slot ?", session.slots);
                        //alert('ok');
                        console.log("new slot ?", session.slots)
                      }}
                      label={"M'inscrire"}
                      style={{
                        marginTop: '10px', width: '100%',
                        //display: slot?.isFull?.(format) || processing || slot?.isSubscribe?.(user.uid) ? 'none' : 'flex'
                      }}
                    />
                    <ButtonConfirm
                      disabled={!slot?.isSubscribe?.(user.uid) || processing}
                      loading={processing}
                      color="error"
                      onClick={async () => {
                        //update
                        slot?.unsubscribeStudent?.(user.uid, format);
                        session.updateSlot(slot);
                        await update(session);
                        console.log("new slot ?", slot);
                        //alert('ok');
                        //console.log("new slot ?", session.slots)
                      }}
                      label={"Me désinscrire"}
                      style={{
                        marginTop: '10px', width: '100%',
                        //display: !slot?.isSubscribe?.(user.uid) || processing ? 'none' : 'flex'
                      }}
                    />

                  </Grid>)
                })
              }
            </Grid>
          </Grid>
          {
            !slot?.isSubscribe?.(user.uid) && <Grid size={{ xs: 12, sm: 9 }}>
              <p className="secure-note" style={{ textAlign: 'center' }}>
                ✅ {t('security')}
              </p>
            </Grid>
          }

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
                  font-size: 1.5rem;
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