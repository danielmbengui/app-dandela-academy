"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IconLessons } from "@/assets/icons/IconsComponent";
import { ClassLesson, ClassLessonTranslate } from "@/classes/ClassLesson";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { formatDuration, getFormattedDate, getFormattedDateCompleteNumeric, getFormattedDateNumeric } from "@/contexts/functions";
import { NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS } from "@/contexts/i18n/settings";
import { RoomProvider, useRoom } from "@/contexts/RoomProvider";
import { useSchool } from "@/contexts/SchoolProvider";
import { Box, Button, Stack } from "@mui/material";

import { useTranslation } from "react-i18next";
import { useLesson } from "@/contexts/LessonProvider";
import { ClassColor } from "@/classes/ClassColor";
import BadgeFormatLesson from "@/components/dashboard/lessons/BadgeFormatLesson";
import { useLanguage } from "@/contexts/LangProvider";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import Image from "next/image";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";

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
          color: var(--grey-ligth);
        }

        .info-value {
          text-align: right;
           color: var(--font-color);
            font-weigth: 100;
        }
      `}</style>
        </>
    );
}
export default function DashboardOneLesson() {
    const params = useParams();
    const { isLoading: isLoadingLessons, getOneLesson } = useLesson();
    const { uid } = params; // <- ici tu récupères l'uid
    //const lesson = getOneLesson(uid);
    const { t } = useTranslation([NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
    const { lang } = useLanguage();
    // const { room, getOneRoomName } = useRoom();
    const [lesson, setLesson] = useState(null);
    // const schedule = { ...lesson.sessions_schedule, saturday: { is_open: true, open_hour: 8, close_hour: 12 } };
    // lesson.sessions_schedule = schedule;
    const [course, setCourse] = useState(initialCourse);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const seatsLeft = Math.max(lesson?.seats_availables || 0 - lesson?.seats_taken || 0, 0);
    const isFull = seatsLeft <= 0 && !isEnrolled;
    const formatCfg = FORMAT_CONFIG[lesson?.format];

    useEffect(() => {
        if (uid && !isLoadingLessons) {
            const _lesson = getOneLesson(uid);
            setLesson(_lesson);
            async function init() {
                //const okay = await ClassLessonTranslate.fetchListFromFirestore("zlUoi3t14wzC5cNhfS3J");
                const okay1 = await ClassLessonTranslate.get("zlUoi3t14wzC5cNhfS3J", lang);
                console.log("OKAY", okay1);
            }
            init();
            console.log("LESSON", getOneLesson(uid), isLoadingLessons)
        }
    }, [uid, isLoadingLessons]);

    const handleToggleEnroll = () => {
        if (isFull && !isEnrolled) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsEnrolled((prev) => !prev);

            setCourse((prev) => {
                const delta = isEnrolled ? -1 : 1; // si on se désinscrit, on libère une place
                return {
                    ...prev,
                    seatsTaken: Math.min(
                        Math.max(prev.seatsTaken + delta, 0),
                        prev.seatsTotal
                    ),
                };
            });

            // Ici tu pourras faire ton appel API / Firestore
            // await fetch(`/api/courses/${course.id}/enroll`, { method: isEnrolled ? "DELETE" : "POST" });

            setIsLoading(false);
        }, 400);
    };

    return (
        <DashboardPageWrapper 
        titles={[
            {name:t('lessons', {ns:NS_DASHBOARD_MENU}), url:PAGE_LESSONS}, 
            {name:lesson?.translate?.title,url:''}
        ]} 
        title={`Cours / ${lesson?.code}`} 
        subtitle={lesson?.translate?.subtitle} 
        icon={<IconLessons />}>
            <div className="page">
                <main className="container">
                    <section className="hero-card">
                        <div className="hero-left">
                            <p className="breadcrumb">{lesson?.category.toUpperCase()} {"/"} {lesson?.code}</p>
                            <h1>{lesson?.translate?.title}</h1>
                            <p className="muted">
                                Niveau : {lesson?.level} • Langue : {t(lesson?.lang, { ns: NS_LANGS })}
                            </p>

                            <div className="badges">
                                <BadgeFormatLesson format={lesson?.format} />
                                {lesson?.certified && (
                                    <span className="badge-cert">
                                        🎓 Certifié {course.certificateProvider}
                                    </span>
                                )}
                            </div>
                            <p className="hero-description">
                                {lesson?.translate?.description}
                            </p>
                            <div className="hero-meta">
                                <MetaChip
                                    label="Type"
                                    value={`${lesson?.category}`}
                                />
                                <MetaChip
                                    label="Durée"
                                    value={`${formatDuration(lesson?.duration || 0)}`}
                                />
                                <MetaChip
                                    label="Rythme"
                                    value={`${lesson?.sessions_count}x/${t(lesson?.sessions_type, { ns: NS_DAYS })}`}
                                />
                                <MetaChip
                                    label="Dates"
                                    value={`${getFormattedDateNumeric(lesson?.start_date, lang)} → ${getFormattedDateNumeric(lesson?.end_date, lang)}`}
                                />
                            </div>
                            {
                                lesson?.photo_url && <Box sx={{mt:1.5,background:'',width:{xs:'100%', sm:'70%'}}}>
                                <Image
                                src={lesson?.photo_url || ''}
                                alt={`lesson-${lesson?.uid}`}
                                quality={100}
                                width={300}
                                height={150}
                                //loading="lazy"
                                priority
                                style={{
                                    width: 'auto',
                                    height: '100%',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                }}
                            />
                            </Box>
                            }
                        </div>

                        {/* Bloc inscription intégré dans le hero */}
                        <aside className="hero-right">
                            <p className="price">
                                {lesson?.price}{" "}
                                <span className="currency">{lesson?.currency}</span>
                            </p>
                            <p className="price-caption">
                                {formatDuration(lesson?.duration || 0)} de formation encadrée
                            </p>

                            {course.hasInstallments && (
                                <p className="price-installments">
                                    Paiement échelonné possible :{" "}
                                    <strong>{course.installmentExample}</strong>
                                </p>
                            )}
                            
                            <div className="hero-seats">
                                <p className="seats-main">
                                    {lesson?.seats_taken}/{course.seats_availables} inscrits
                                </p>
                                <p className="seats-sub">
                                    {isFull
                                        ? "Cours complet actuellement"
                                        : `${lesson?.seats_availables - lesson?.seats_taken} place(s) restante(s)`}
                                </p>

                                <div className="seats-bar">
                                    <div
                                        className="seats-fill"
                                        style={{
                                            width: `${(lesson?.seats_taken / lesson?.seats_availables) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <Stack sx={{ width: '100%', mt: 3 }}>
                                <ButtonConfirm
                                    size="large"
                                    label="M'inscrire à ce cours"
                                />
                            </Stack>
                            <button
                                className={`btn primary btn-enroll ${isFull && !isEnrolled ? "btn-disabled" : ""
                                    }`}
                                    style={{display:'none'}}
                                onClick={handleToggleEnroll}
                                disabled={isLoading || (isFull && !isEnrolled)}
                            >
                                {isLoading
                                    ? "Traitement..."
                                    : isEnrolled
                                        ? "Me désinscrire du cours"
                                        : isFull
                                            ? "Cours complet"
                                            : "M'inscrire à ce cours"}
                            </button>
                            <p className="secure-note">
                                ✅ Inscription sécurisée • Tu recevras un email de confirmation
                                avec toutes les informations pratiques.
                            </p>
                        </aside>
                    </section>


                    {/* GRID PRINCIPALE */}
                    <section className="grid">
                        {/* COL GAUCHE : contenu du cours */}
                        <div className="main-col">
                            <div className="card">
                                <h2>À propos de ce cours</h2>
                                <p className="description">{lesson?.translate?.description}</p>
                            </div>
                            <div className="card">
                                <h2>Objectifs pédagogiques</h2>
                                <ul className="list">
                                    {lesson?.translate?.goals.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="card">
                                <h2>Programme</h2>
                                <ol className="list ordered">
                                    {lesson?.translate?.programs.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ol>
                            </div>
                            <div className="card">
                                <h2>Pré-requis</h2>
                                <ul className="list">
                                    {lesson?.translate?.prerequisites.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="card">
                                <h2>Pour qui ?</h2>
                                <ul className="list">
                                    {lesson?.translate?.target_audiences.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* COL DROITE : infos pratiques & certification */}
                        <div className="side-col">
                            <div className="card">
                                <h2>Modalités pratiques</h2>
                                <InfoRow label="Format" value={formatCfg?.label} />
                                <InfoRow
                                    label="Durée totale"
                                    value={`${formatDuration(lesson?.duration)} heures`}
                                />
                                <InfoRow
                                    label="Rythme"
                                    value={`${lesson?.sessions_count} session(s) / ${t(lesson?.sessions_type, { ns: NS_DAYS })}`}
                                />
                                <InfoRow label="Horaires" value={`${t(Object.keys(lesson?.sessions_schedule || {})?.[5], { ns: NS_DAYS })} • ${formatDuration(lesson?.sessions_schedule.saturday.open_hour)} - ${formatDuration(lesson?.sessions_schedule.saturday.close_hour)}`} />
                                {lesson?.format !== "online" && (
                                    <InfoRow label="Lieu" value={`${lesson?.location}`} />
                                )}
                                {lesson?.format !== "onsite" && (
                                    <InfoRow
                                        label="Plateforme en ligne"
                                        value={course.onlinePlatform}
                                    />
                                )}
                            </div>

                            <div className="card">
                                <h2>Certification</h2>
                                {lesson?.certified ? (
                                    <>
                                        <p className="cert-main">
                                            🎓 Ce cours donne droit à un certificat délivré par{" "}
                                            <strong>{course.certificateProvider}</strong>.
                                        </p>
                                        <ul className="list small">
                                            <li>
                                                Attestation de suivi détaillant les compétences acquises.
                                            </li>
                                            <li>
                                                Certificat remis en format PDF (et éventuellement papier).
                                            </li>
                                            <li>
                                                Idéal pour compléter un CV ou un dossier de candidature.
                                            </li>
                                        </ul>
                                        {course.isOfficialCertificate && (
                                            <p className="cert-badge">
                                                ✅ Certification reconnue dans le cadre des parcours
                                                Dandela Academy.
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="cert-main">
                                        Ce cours ne délivre pas de certificat officiel mais une
                                        attestation de participation peut être fournie sur demande.
                                    </p>
                                )}
                            </div>

                            <div className="card">
                                <h2>Infos importantes</h2>
                                <ul className="list small">
                                    {
                                        lesson?.translate?.notes.map((note, index) => {
                                            return (<li key={`${note}-${index}`}>
                                                {note}
                                            </li>)
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </section>
                </main>
                <style jsx>{`
        .page {
          min-height: 100vh;
          background: transparent;
          padding: 20px 0px;
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
          border: 0.1px solid var(--card-border);
          background: #020617;
          background: transparent;
          padding: 14px 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
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
        </DashboardPageWrapper>
    );
}