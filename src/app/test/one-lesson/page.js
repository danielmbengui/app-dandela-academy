"use client"
import { ClassLesson } from "@/classes/ClassLesson";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { getFormattedDate, getFormattedDateCompleteNumeric, getFormattedDateNumeric } from "@/contexts/functions";
import { NS_LANGS } from "@/contexts/i18n/settings";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const initialCourse = {
  id: "course_excel_101",
  title: "Excel – Compétences essentielles pour le travail",
  code: "EXCEL-101",
  category: "Bureautique",
  level: "Débutant",
  language: "Français",
  lang: "fr",
  format: "onsite", // "online" | "onsite" | "hybrid"
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
  start_date: new Date(2025,2,10),
  end_date: new Date(2025,3,5),
  durationHours: 24,
  duration:16,
  sessionsPerWeek: 2,
  sessions_count: 1,
  sessions_type:'weekly',
  scheduleText: "Mardi & Jeudi • 18:30 – 20:30",
  location: "Campus central – Salle 3",
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

export default function CourseEnrollmentPage() {
  const {t} = useTranslation([NS_LANGS]);
  const lesson = new ClassLesson(initialCourse);
  const schedule = {...lesson.sessions_schedule, saturday:{is_open:true,open_hour:8,close_hour:12}};
  lesson.sessions_schedule = schedule;
  const [course, setCourse] = useState(initialCourse);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const seatsLeft = Math.max(lesson.seats_availables - lesson.seats_taken, 0);
  const isFull = seatsLeft <= 0 && !isEnrolled;
  const formatCfg = FORMAT_CONFIG[lesson.format];

  

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
    <DashboardPageWrapper>
      <div className="page">
      <main className="container">
        {/* HEADER */}
        <header className="header">
          <div>
          <p className="breadcrumb">Catalogue / Cours / {lesson.code}</p>
          <h1>{lesson.title}</h1>
            <p className="muted">
              Code : {lesson.code} • Niveau : {lesson.level} • Langue :{" "}
              {t(lesson.lang)}
            </p>

            <div className="badges">
              <span
                className="badge-format"
                style={{ borderColor: formatCfg.color, color: formatCfg.color }}
              >
                <span
                  className="badge-dot"
                  style={{ backgroundColor: formatCfg.color }}
                />
                {formatCfg.label}
              </span>

              {lesson.certified && (
                <span className="badge-cert">
                  🎓 Certifié {course.certificateProvider}
                </span>
              )}
            </div>
          </div>

          {/* CARTE INSCRIPTION */}
          <aside className="enroll-card">
            <p className="price">
              {lesson.price}{" "}
              <span className="currency">{lesson.currency}</span>
            </p>
            <p className="price-helper">
              {lesson.duration}h de formation •{" "}
              {lesson.sessions_count} séance(s) / semaine {lesson.sessions_type}
            </p>

            {course.hasInstallments && (
              <p className="installments">
                Possibilité de payer en plusieurs fois :{" "}
                <strong>{course.installmentExample}</strong>
              </p>
            )}

            <div className="dates">
              <div>
                <p className="date-label">Début</p>
                <p className="date-value">
                  {getFormattedDateNumeric(lesson.start_date)}
                </p>
              </div>
              <div>
                <p className="date-label">Fin</p>
                <p className="date-value">
                  {getFormattedDateNumeric(lesson.end_date)}
                </p>
              </div>
            </div>

            <div className="seats">
              <p className="seats-line">
                {lesson.seats_taken}/{lesson.seats_availables} places occupées
              </p>
              <p className="seats-left">
                {isFull
                  ? "Cours actuellement complet"
                  : `${seatsLeft} place(s) restante(s)`}
              </p>
            </div>

            <button
              className={`btn primary btn-enroll ${
                isFull && !isEnrolled ? "btn-disabled" : ""
              }`}
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
        </header>

        {/* GRID PRINCIPALE */}
        <section className="grid">
          {/* COL GAUCHE : contenu du cours */}
          <div className="main-col">
            <div className="card">
              <h2>À propos de ce cours</h2>
              <p className="description">{lesson.description}</p>
            </div>

            <div className="card">
              <h2>Objectifs pédagogiques</h2>
              <ul className="list">
                {lesson.goals.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2>Programme</h2>
              <ol className="list ordered">
                {lesson.programs.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>

            <div className="card">
              <h2>Pré-requis</h2>
              <ul className="list">
                {lesson.prerequisites.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2>Pour qui ?</h2>
              <ul className="list">
                {lesson.target_audiences.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* COL DROITE : infos pratiques & certification */}
          <div className="side-col">
            <div className="card">
              <h2>Modalités pratiques</h2>
              <InfoRow label="Format" value={formatCfg.label} />
              <InfoRow
                label="Durée totale"
                value={`${lesson.duration} heures`}
              />
              <InfoRow
                label="Rythme"
                value={`${lesson.sessions_count} sessions par semaine ${lesson.sessions_type}`}
              />
              <InfoRow label="Horaires" value={`${Object.keys(lesson.sessions_schedule)[5]} • ${lesson.sessions_schedule.saturday.open_hour} - ${lesson.sessions_schedule.saturday.close_hour}`} />
              {course.format !== "online" && (
                <InfoRow label="Lieu" value={course.location} />
              )}
              {course.format !== "onsite" && (
                <InfoRow
                  label="Plateforme en ligne"
                  value={course.onlinePlatform}
                />
              )}
            </div>

            <div className="card">
              <h2>Certification</h2>
              {course.isCertified ? (
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
                <li>
                  Une version récente d&apos;Excel est recommandée (2016+ ou
                  Microsoft 365).
                </li>
                <li>
                  En cas d&apos;absence, certaines sessions pourront être
                  rattrapées via la plateforme en ligne.
                </li>
                <li>
                  Le support de cours (PDF, fichiers Excel d&apos;exercices)
                  sera accessible dans ton espace Dandela.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #020617;
          padding: 40px 16px;
          color: #e5e7eb;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 1100px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .breadcrumb {
          margin: 0 0 4px;
          font-size: 0.75rem;
          color: #6b7280;
        }

        h1 {
          margin: 0 0 6px;
          font-size: 1.8rem;
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
          background: #020617;
          border-radius: 18px;
          padding: 16px 16px 18px;
          border: 1px solid #1f2937;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
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
          background: #020617;
          border-radius: 16px;
          padding: 14px 14px 16px;
          border: 1px solid #1f2937;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
        }

        .card h2 {
          margin: 0 0 10px;
          font-size: 1.05rem;
        }

        .description {
          margin: 0;
          font-size: 0.9rem;
          color: #e5e7eb;
        }

        .list {
          margin: 0;
          padding-left: 18px;
          font-size: 0.88rem;
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
          border-bottom: 1px solid #111827;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #9ca3af;
        }

        .info-value {
          text-align: right;
        }
      `}</style>
    </>
  );
}

/** Helper pour formater une date YYYY-MM-DD → JJ.MM.AAAA */
function formatDate(iso) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
