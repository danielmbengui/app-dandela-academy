"use client"
import { SessionProvider } from "@/contexts/SessionProvider";
import { useState } from "react";

const initialSession = {
    id: "session_excel_101_mars_2025",
    label: "Session Soir – Mars 2025",
    status: "open", // "open" | "full" | "finished" | "cancelled"
    startDate: "2025-03-10",
    endDate: "2025-04-05",
    inscriptionDeadline: "2025-03-05",
    scheduleText: "Mardi & Jeudi • 18:30 – 20:30",
    format: "hybrid", // "online" | "onsite" | "hybrid"
    location: "Campus central – Salle 3",
    onlinePlatform: "Classe virtuelle Dandela (via navigateur)",
    seatsTotal: 18,
    seatsTaken: 11,
    price: 290,
    currency: "CHF",

    course: {
        id: "course_excel_101",
        title: "Excel – Compétences essentielles pour le travail",
        code: "EXCEL-101",
        category: "Bureautique",
        level: "Débutant",
        language: "Français",
        isCertified: true,
    },

    teacher: {
        id: "teacher_ana_silva",
        firstName: "Ana",
        lastName: "Silva",
        shortRole: "Professeure Excel & Data",
        email: "ana.silva@dandela-academy.com",
    },
};

const FORMAT_CONFIG = {
    online: { label: "En ligne", color: "#3b82f6" },
    onsite: { label: "Présentiel", color: "#22c55e" },
    hybrid: { label: "Hybride", color: "#a855f7" },
};

const STATUS_CONFIG = {
    open: {
        label: "Inscriptions ouvertes",
        color: "#22c55e",
        bg: "#022c22",
    },
    full: {
        label: "Complet",
        color: "#f97316",
        bg: "#451a03",
    },
    finished: {
        label: "Session terminée",
        color: "#9ca3af",
        bg: "#020617",
    },
    cancelled: {
        label: "Session annulée",
        color: "#ef4444",
        bg: "#450a0a",
    },
};

export default function SessionPage() {
return(<SessionProvider>
    <SessionComponent />
</SessionProvider>)
}
function SessionComponent() {
    const [session, setSession] = useState(initialSession);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const seatsLeft = Math.max(session.seatsTotal - session.seatsTaken, 0);
    const isFull = seatsLeft <= 0 && !isEnrolled;
    const formatCfg = FORMAT_CONFIG[session.format];
    const statusCfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.open;

    const canEnroll =
        session.status === "open" &&
        !isFull &&
        new Date(session.inscriptionDeadline) >= new Date();

    const teacher = session.teacher;
    const course = session.course;

    const handleToggleEnroll = () => {
        if (!canEnroll && !isEnrolled) return;

        setIsLoading(true);

        setTimeout(() => {
            setIsEnrolled((prev) => !prev);
            setSession((prev) => {
                const delta = isEnrolled ? -1 : 1;
                return {
                    ...prev,
                    seatsTaken: Math.min(
                        Math.max(prev.seatsTaken + delta, 0),
                        prev.seatsTotal
                    ),
                };
            });

            // TODO: ici tu branches Firestore / API (inscription / désinscription)
            setIsLoading(false);
        }, 300);
    };

    const mainButtonLabel = (() => {
        if (isLoading) return "Traitement...";
        if (isEnrolled) return "Me désinscrire de cette session";
        if (!canEnroll) {
            if (session.status === "finished") return "Session terminée";
            if (session.status === "cancelled") return "Session annulée";
            if (isFull) return "Session complète";
            if (new Date(session.inscriptionDeadline) < new Date())
                return "Inscriptions clôturées";
        }
        return "M'inscrire à cette session";
    })();

    const mainButtonDisabled = isLoading || (!isEnrolled && !canEnroll);

    return (
        <div className="page">
            <main className="container">
                {/* HEADER / HERO */}
                <section className="hero">
                    <div className="hero-left">
                        <p className="breadcrumb">
                            Dashboard / Cours / {course.code} / Sessions
                        </p>

                        <h1>{session.label}</h1>

                        <p className="course-ref">
                            Session du cours{" "}
                            <span className="course-title">{course.title}</span>{" "}
                            <span className="course-code">({course.code})</span>
                        </p>

                        <div className="hero-meta-top">
                            <span
                                className="status-pill"
                                style={{
                                    backgroundColor: statusCfg.bg,
                                    color: statusCfg.color,
                                    borderColor: statusCfg.color,
                                }}
                            >
                                {statusCfg.label}
                            </span>

                            <span
                                className="format-pill"
                                style={{
                                    borderColor: formatCfg.color,
                                    color: formatCfg.color,
                                }}
                            >
                                <span
                                    className="format-dot"
                                    style={{ backgroundColor: formatCfg.color }}
                                />
                                {formatCfg.label}
                            </span>
                        </div>

                        {/* Infos rapides */}
                        <div className="chips">
                            <MetaChip
                                label="Dates"
                                value={`${formatDate(session.startDate)} → ${formatDate(
                                    session.endDate
                                )}`}
                            />
                            <MetaChip label="Horaires" value={session.scheduleText} />
                            <MetaChip label="Niveau" value={course.level} />
                            <MetaChip label="Langue" value={course.language} />
                        </div>

                        {/* Prof rapide */}
                        <div className="teacher-inline">
                            <TeacherAvatar teacher={teacher} />
                            <div className="teacher-inline-text">
                                <p className="teacher-inline-name">
                                    {teacher.firstName} {teacher.lastName}
                                </p>
                                <p className="teacher-inline-role">{teacher.shortRole}</p>
                            </div>
                        </div>
                    </div>

                    {/* Carte inscription rapide */}
                    <aside className="enroll-card">
                        <p className="price">
                            {formatPrice(session.price, session.currency)}{" "}
                        </p>
                        <p className="price-sub">
                            Pour cette session spécifique du cours {course.code}
                        </p>

                        <div className="dates-block">
                            <InfoRow
                                label="Début"
                                value={formatDate(session.startDate)}
                            />
                            <InfoRow
                                label="Fin"
                                value={formatDate(session.endDate)}
                            />
                            <InfoRow
                                label="Clôture inscriptions"
                                value={formatDate(session.inscriptionDeadline)}
                            />
                        </div>

                        <div className="seats-block">
                            <p className="seats-main">
                                {session.seatsTaken}/{session.seatsTotal} inscrit(s)
                            </p>
                            <p className="seats-sub">
                                {session.status === "finished"
                                    ? "Session terminée"
                                    : session.status === "cancelled"
                                        ? "Session annulée"
                                        : seatsLeft <= 0
                                            ? "Aucune place restante"
                                            : `${seatsLeft} place(s) restante(s)`}
                            </p>
                            <div className="seats-bar">
                                <div
                                    className="seats-fill"
                                    style={{
                                        width: `${(session.seatsTaken / session.seatsTotal) * 100
                                            }%`,
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            className={`btn primary btn-main ${mainButtonDisabled ? "btn-disabled" : ""
                                }`}
                            onClick={handleToggleEnroll}
                            disabled={mainButtonDisabled}
                        >
                            {mainButtonLabel}
                        </button>

                        <p className="hint">
                            Tu recevras un email avec tous les détails liés à cette
                            session (dates exactes, lieu, lien de connexion, etc.).
                        </p>
                    </aside>
                </section>

                {/* CONTENU RAPIDE */}
                <section className="layout">
                    <div className="col-left">
                        <div className="card">
                            <h2>Résumé du cours</h2>
                            <p className="text">
                                Ce cours t&apos;apprend à maîtriser les bases d&apos;Excel
                                pour être pleinement opérationnel au travail : formules,
                                mises en forme, tableaux, graphiques et bonnes pratiques
                                pour gagner du temps au quotidien.
                            </p>

                            <ul className="list">
                                <li>
                                    Cours : <strong>{course.title}</strong> ({course.code})
                                </li>
                                <li>Catégorie : {course.category}</li>
                                <li>
                                    Certification :{" "}
                                    {course.isCertified ? "Oui (Dandela Academy)" : "Non"}
                                </li>
                            </ul>

                            <button className="btn ghost">
                                Voir la page complète du cours
                            </button>
                        </div>
                    </div>

                    <div className="col-right">
                        <div className="card">
                            <h2>Détails pratiques de la session</h2>
                            <InfoRow label="Format" value={formatCfg.label} />
                            <InfoRow label="Horaires" value={session.scheduleText} />
                            {session.format !== "online" && (
                                <InfoRow label="Lieu" value={session.location} />
                            )}
                            {session.format !== "onsite" && (
                                <InfoRow
                                    label="Plateforme en ligne"
                                    value={session.onlinePlatform}
                                />
                            )}
                        </div>

                        <div className="card">
                            <h2>Professeur responsable</h2>
                            <div className="teacher-block">
                                <TeacherAvatar teacher={teacher} size="large" />
                                <div>
                                    <p className="teacher-name">
                                        {teacher.firstName} {teacher.lastName}
                                    </p>
                                    <p className="teacher-role">{teacher.shortRole}</p>
                                    <p className="teacher-email">
                                        📧 <span>{teacher.email}</span>
                                    </p>
                                </div>
                            </div>
                            <button className="btn ghost small-btn">
                                Envoyer un message au professeur
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <style jsx>{`
        .page {
          min-height: 100vh;
          background: #020617;
          padding: 32px 16px 40px;
          display: flex;
          justify-content: center;
          color: #e5e7eb;
        }

        .container {
          width: 100%;
          max-width: 960px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.8fr) minmax(260px, 1.2fr);
          gap: 16px;
          border-radius: 18px;
          border: 1px solid #1f2937;
          background: radial-gradient(circle at top left, #111827, #020617);
          padding: 16px 16px 18px;
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.7);
        }

        @media (max-width: 900px) {
          .hero {
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
          font-size: 1.6rem;
        }

        .course-ref {
          margin: 0 0 6px;
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .course-title {
          color: #e5e7eb;
          font-weight: 500;
        }

        .course-code {
          color: #6b7280;
        }

        .hero-meta-top {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .status-pill {
          border-radius: 999px;
          padding: 2px 10px;
          font-size: 0.78rem;
          border: 1px solid;
        }

        .format-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          border: 1px solid;
          padding: 2px 10px;
          font-size: 0.78rem;
          background: #020617;
        }

        .format-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
        }

        .teacher-inline {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
        }

        .teacher-inline-text {
          font-size: 0.8rem;
        }

        .teacher-inline-name {
          margin: 0;
          font-weight: 500;
        }

        .teacher-inline-role {
          margin: 0;
          color: #9ca3af;
        }

        .enroll-card {
          border-radius: 14px;
          border: 1px solid #1f2937;
          background: #020617;
          padding: 12px 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .price {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 600;
        }

        .price-sub {
          margin: 2px 0 4px;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .dates-block {
          margin-top: 4px;
          font-size: 0.84rem;
        }

        .seats-block {
          margin-top: 6px;
          font-size: 0.84rem;
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
          background: linear-gradient(90deg, #22c55e, #16a34a);
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

        .btn.primary {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border-color: transparent;
        }

        .btn-main {
          width: 100%;
          margin-top: 6px;
        }

        .btn-disabled {
          background: #111827;
          cursor: not-allowed;
        }

        .hint {
          margin: 4px 0 0;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1.2fr);
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
          gap: 10px;
        }

        .card {
          background: #020617;
          border-radius: 16px;
          border: 1px solid #1f2937;
          padding: 12px 12px 14px;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
        }

        .card h2 {
          margin: 0 0 8px;
          font-size: 1.05rem;
        }

        .text {
          margin: 0 0 6px;
          font-size: 0.88rem;
        }

        .list {
          margin: 0 0 8px;
          padding-left: 16px;
          font-size: 0.84rem;
        }

        .ghost {
          margin-top: 2px;
          font-size: 0.82rem;
        }

        .teacher-block {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .teacher-name {
          margin: 0;
          font-weight: 500;
        }

        .teacher-role {
          margin: 0;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .teacher-email {
          margin: 2px 0 0;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .teacher-email span {
          color: #e5e7eb;
        }

        .small-btn {
          margin-top: 8px;
          font-size: 0.8rem;
          padding: 6px 10px;
        }
      `}</style>
        </div>
    );
}

/** Petit chip d’info */
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

/** Avatar prof */
function TeacherAvatar({ teacher, size = "small" }) {
    const initials = `${teacher.firstName?.[0] ?? ""}${teacher.lastName?.[0] ?? ""}`;
    const dimension = size === "large" ? 40 : 30;

    return (
        <>
            <div
                className="teacher-avatar"
                style={{ width: dimension, height: dimension }}
            >
                {initials}
            </div>

            <style jsx>{`
        .teacher-avatar {
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

/** Ligne d'info */
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
          padding: 3px 0;
          font-size: 0.82rem;
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

/** Formatage très simple des prix */
function formatPrice(amount, currency = "CHF") {
    if (amount == null || isNaN(amount)) return "-";
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
        }).format(amount);
    } catch {
        return `${amount} ${currency}`;
    }
}

/** Date YYYY-MM-DD → JJ.MM.AAAA */
function formatDate(iso) {
    if (!iso) return "-";
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}`;
}
