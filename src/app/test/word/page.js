"use client";
import { useState } from "react";

const initialCourse = {
  id: "course_word_101",
  title: "Word – Documents professionnels & mise en page",
  code: "WORD-101",
  category: "Bureautique",
  level: "Débutant",
  language: "Français",
  format: "hybrid", // "online" | "onsite" | "hybrid"
  isCertified: true,
  certificateProvider: "Dandela Academy",
  price: 260,
  currency: "CHF",
  hasInstallments: true,
  installmentExample: "2 x 135 CHF",
  startDate: "2025-03-12",
  endDate: "2025-04-06",
  durationHours: 20,
  sessionsPerWeek: 2,
  scheduleText: "Lundi & Mercredi • 18:30 – 20:30",
  location: "Campus central – Salle 2",
  onlinePlatform: "Classe virtuelle Dandela (via navigateur)",
  seatsTotal: 20,
  seatsTaken: 9,
  description:
    "Apprends à créer des documents propres et professionnels : mise en forme, styles, mise en page, tableaux, images, export PDF et bonnes pratiques pour gagner du temps.",
  objectives: [
    "Comprendre l’interface de Word et les bases de la mise en forme",
    "Structurer un document avec titres, styles et sections",
    "Mettre en page correctement (marges, en-têtes/pieds, numérotation)",
    "Insérer et mettre en forme tableaux, images et éléments graphiques",
    "Exporter un document professionnel (PDF) et préparer l’impression",
  ],
  targetAudience: [
    "Personnes en reconversion ou en recherche d’emploi",
    "Professionnels souhaitant produire des documents plus propres et rapides",
    "Étudiants ou stagiaires qui rédigent rapports, CV ou documents académiques",
  ],
  prerequisites: [
    "Savoir utiliser un ordinateur (souris, clavier, navigation simple)",
    "Aucun prérequis sur Word n’est nécessaire",
  ],
  programOutline: [
    "Découvrir Word & prise en main de l’interface",
    "Mise en forme du texte et mise en page",
    "Styles, titres et structure du document",
    "Insertion d’images, tableaux et éléments",
    "En-têtes/pieds, numérotation, sections",
    "Mini-projet : CV / lettre / rapport + export PDF",
  ],

  // <<< PROFESSEUR >>>
  teacher: {
    id: "teacher_marie_kaya",
    firstName: "Marie",
    lastName: "Kaya",
    title: "Professeure",
    shortRole: "Professeure Word & Rédaction",
    email: "marie.kaya@dandela-academy.com",
    avatarUrl: "",
    bio: "Spécialiste en rédaction professionnelle et bureautique, Marie aide les apprenants à produire des documents clairs, structurés et prêts pour le monde du travail.",
  },
};

const FORMAT_CONFIG = {
  online: { label: "En ligne", color: "#3b82f6" },
  onsite: { label: "Présentiel", color: "#22c55e" },
  hybrid: { label: "Hybride", color: "#a855f7" },
};

export default function CourseWordPage() {
  const [course, setCourse] = useState(initialCourse);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const seatsLeft = Math.max(course.seatsTotal - course.seatsTaken, 0);
  const isFull = seatsLeft <= 0 && !isEnrolled;
  const formatCfg = FORMAT_CONFIG[course.format];

  const handleToggleEnroll = () => {
    if (isFull && !isEnrolled) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsEnrolled((prev) => !prev);
      setCourse((prev) => {
        const delta = isEnrolled ? -1 : 1;
        return {
          ...prev,
          seatsTaken: Math.min(Math.max(prev.seatsTaken + delta, 0), prev.seatsTotal),
        };
      });
      // Ici tu brancheras ton appel Firestore / API
      setIsLoading(false);
    }, 350);
  };

  const teacher = course.teacher;

  return (
    <div className="page">
      <main className="container">
        {/* HERO GLOBAL */}
        <section className="hero-card">
          <div className="hero-left">
            <p className="breadcrumb">
              Catalogue / {course.category} / {course.code}
            </p>
            <h1>{course.title}</h1>
            <p className="subtitle">
              Niveau : {course.level} • Langue : {course.language}
            </p>

            <div className="hero-tags">
              <span
                className="tag-format"
                style={{
                  borderColor: formatCfg.color,
                  color: formatCfg.color,
                }}
              >
                <span className="tag-dot" style={{ backgroundColor: formatCfg.color }} />
                {formatCfg.label}
              </span>

              {course.isCertified && (
                <span className="tag-cert">🎓 Certifié {course.certificateProvider}</span>
              )}

              <span className="tag-category">{course.category}</span>
            </div>

            <p className="hero-description">{course.description}</p>

            <div className="hero-meta">
              <MetaChip label="Durée" value={`${course.durationHours}h`} />
              <MetaChip label="Rythme" value={`${course.sessionsPerWeek}x / semaine`} />
              <MetaChip
                label="Dates"
                value={`${formatDate(course.startDate)} → ${formatDate(course.endDate)}`}
              />
            </div>
          </div>

          {/* Bloc inscription + prof à droite */}
          <aside className="hero-right">
            {/* PRIX / PLACES */}
            <div className="hero-right-top">
              <p className="price">
                {course.price} <span className="currency">{course.currency}</span>
              </p>
              <p className="price-caption">{course.durationHours}h de formation encadrée</p>

              {course.hasInstallments && (
                <p className="price-installments">
                  Paiement échelonné possible : <strong>{course.installmentExample}</strong>
                </p>
              )}

              <div className="hero-seats">
                <p className="seats-main">
                  {course.seatsTaken}/{course.seatsTotal} inscrits
                </p>
                <p className="seats-sub">
                  {isFull ? "Cours complet actuellement" : `${seatsLeft} place(s) restante(s)`}
                </p>

                <div className="seats-bar">
                  <div
                    className="seats-fill"
                    style={{
                      width: `${(course.seatsTaken / course.seatsTotal) * 100}%`,
                      background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                    }}
                  />
                </div>
              </div>

              <button
                className={`btn primary btn-enroll ${isFull && !isEnrolled ? "btn-disabled" : ""}`}
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

              <p className="hero-note">
                ✅ Tu recevras un email avec les infos pratiques (lieu, lien de connexion, matériel, etc.).
              </p>
            </div>

            {/* PROFESSEUR */}
            <div className="teacher-card">
              <p className="teacher-label">Professeur du cours</p>
              <div className="teacher-main">
                <TeacherAvatar teacher={teacher} />
                <div className="teacher-text">
                  <p className="teacher-name">
                    {teacher.firstName} {teacher.lastName}
                  </p>
                  <p className="teacher-role">{teacher.shortRole}</p>
                </div>
              </div>
              <p className="teacher-bio">{teacher.bio}</p>
              <p className="teacher-email">
                📧 <span>{teacher.email}</span>
              </p>
              <button className="btn ghost-btn">Contacter le professeur</button>
            </div>
          </aside>
        </section>

        {/* CONTENU STRUCTURÉ EN 2 COLONNES */}
        <section className="layout">
          {/* COL GAUCHE */}
          <div className="col-left">
            <div className="card">
              <h2>Ce que tu vas apprendre</h2>
              <ul className="list">
                {course.objectives.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2>Programme du cours</h2>
              <ol className="list ordered">
                {course.programOutline.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>

            <div className="card">
              <h2>À qui s&apos;adresse ce cours ?</h2>
              <ul className="list">
                {course.targetAudience.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* COL DROITE */}
          <div className="col-right">
            <div className="card">
              <h2>Modalités pratiques</h2>
              <InfoRow label="Format" value={FORMAT_CONFIG[course.format].label} />
              <InfoRow label="Horaires" value={course.scheduleText} />
              {course.format !== "online" && <InfoRow label="Lieu" value={course.location} />}
              {course.format !== "onsite" && (
                <InfoRow label="Plateforme en ligne" value={course.onlinePlatform} />
              )}
              <InfoRow label="Langue" value={course.language} />
              <InfoRow
                label="Dates"
                value={`${formatDate(course.startDate)} → ${formatDate(course.endDate)}`}
              />
            </div>

            <div className="card">
              <h2>Pré-requis</h2>
              <ul className="list small">
                {course.prerequisites.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2>Certification</h2>
              {course.isCertified ? (
                <>
                  <p className="cert-main">
                    🎓 Ce cours est certifié par <strong>{course.certificateProvider}</strong>.
                  </p>
                  <ul className="list small">
                    <li>Certificat au format PDF téléchargeable.</li>
                    <li>Mention des compétences acquises (parfait pour ton CV).</li>
                    <li>Vérifiable par les employeurs via Dandela Academy.</li>
                  </ul>
                </>
              ) : (
                <p className="cert-main">
                  Ce cours ne délivre pas de certificat officiel, mais une attestation de participation peut être fournie sur demande.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #020617;
          padding: 32px 16px 40px;
          color: #e5e7eb;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 1100px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .hero-card {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(280px, 1.15fr);
          gap: 18px;
          border-radius: 18px;
          border: 1px solid #1f2937;
          background: radial-gradient(circle at top left, #111827, #020617);
          padding: 18px 18px 20px;
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.7);
        }

        @media (max-width: 900px) {
          .hero-card {
            grid-template-columns: 1fr;
          }
        }

        .breadcrumb {
          margin: 0 0 4px;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        h1 {
          margin: 0 0 4px;
          font-size: 1.8rem;
        }

        .subtitle {
          margin: 0 0 8px;
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .hero-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
        }

        .tag-format {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 2px 10px;
          border-radius: 999px;
          border-width: 1px;
          border-style: solid;
          font-size: 0.8rem;
          background: #020617;
        }

        .tag-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
        }

        .tag-cert {
          border-radius: 999px;
          padding: 2px 10px;
          font-size: 0.8rem;
          background: rgba(34, 197, 94, 0.12);
          color: #bbf7d0;
          border: 1px solid rgba(34, 197, 94, 0.22);
        }

        .tag-category {
          border-radius: 999px;
          padding: 2px 10px;
          font-size: 0.8rem;
          border: 1px solid #1f2937;
          background: #020617;
          color: #e5e7eb;
        }

        .hero-description {
          margin: 6px 0 10px;
          font-size: 0.9rem;
          color: #e5e7eb;
          max-width: 620px;
        }

        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .hero-right {
          border-radius: 14px;
          border: 1px solid #1f2937;
          background: #020617;
          padding: 12px 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .hero-right-top {
          border-radius: 10px;
          border: 1px solid #111827;
          padding: 10px 10px 12px;
          background: #020617;
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

        .price-caption {
          margin: 2px 0 0;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .price-installments {
          margin: 4px 0 0;
          font-size: 0.8rem;
        }

        .hero-seats {
          margin-top: 6px;
          font-size: 0.85rem;
        }

        .seats-main {
          margin: 0;
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
          overflow: hidden;
        }

        .seats-fill {
          height: 100%;
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
          margin-top: 6px;
        }

        .btn-disabled {
          background: #111827;
          cursor: not-allowed;
        }

        .hero-note {
          margin: 4px 0 0;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .teacher-card {
          margin-top: 8px;
          border-radius: 10px;
          border: 1px solid #111827;
          padding: 10px 10px 12px;
          background: radial-gradient(circle at top left, #111827, #020617);
          font-size: 0.85rem;
        }

        .teacher-label {
          margin: 0 0 6px;
          font-size: 0.75rem;
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
        }

        .teacher-role {
          margin: 0;
          color: #9ca3af;
          font-size: 0.78rem;
        }

        .teacher-bio {
          margin: 4px 0 4px;
          font-size: 0.8rem;
          color: #e5e7eb;
        }

        .teacher-email {
          margin: 0 0 6px;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .teacher-email span {
          color: #e5e7eb;
        }

        .ghost-btn {
          width: 100%;
          border-radius: 999px;
          padding: 6px 10px;
          border-color: #1f2937;
          background: #020617;
          font-size: 0.8rem;
        }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.2fr);
          gap: 14px;
        }

        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }

        .col-left,
        .col-right {
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
          margin: 0 0 8px;
          font-size: 1.05rem;
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
      `}</style>
    </div>
  );
}

/** Chip d’info dans le hero */
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
          border: 1px solid #1f2937;
          background: #020617;
          padding: 4px 10px;
          font-size: 0.78rem;
          display: inline-flex;
          gap: 6px;
        }

        .meta-label {
          color: #9ca3af;
        }

        .meta-value {
          color: #e5e7eb;
          font-weight: 500;
        }
      `}</style>
    </>
  );
}

/** Avatar du professeur */
function TeacherAvatar({ teacher }) {
  const initials = `${teacher.firstName[0] ?? ""}${teacher.lastName[0] ?? ""}`;

  if (teacher.avatarUrl) {
    return (
      <>
        <div className="teacher-avatar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={teacher.avatarUrl} alt={initials} />
        </div>

        <style jsx>{`
          .teacher-avatar {
            width: 34px;
            height: 34px;
            border-radius: 999px;
            overflow: hidden;
            border: 1px solid #1f2937;
          }
          .teacher-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="teacher-avatar-fallback">{initials}</div>

      <style jsx>{`
        .teacher-avatar-fallback {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

/** Ligne d’info dans la colonne de droite */
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
          padding: 4px 0;
          font-size: 0.85rem;
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
