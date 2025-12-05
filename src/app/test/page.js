"use client"
import { useMemo, useState } from "react";

const COURSES_MOCK = [
  {
    id: "excel-101",
    title: "Excel – Compétences essentielles pour le travail",
    code: "EXCEL-101",
    category: "Bureautique",
    level: "Débutant",
    language: "Français",
    format: "hybrid", // "online" | "onsite" | "hybrid"
    isCertified: true,
    price: 290,
    currency: "CHF",
    startDate: "2025-03-10",
    endDate: "2025-04-05",
    seatsTotal: 20,
    seatsTaken: 12,
    status: "open", // "open" | "full" | "finished" | "draft"
  },
  {
    id: "excel-102",
    title: "Excel – Niveau intermédiaire",
    code: "EXCEL-102",
    category: "Bureautique",
    level: "Intermédiaire",
    language: "Français",
    format: "onsite",
    isCertified: true,
    price: 350,
    currency: "CHF",
    startDate: "2025-04-15",
    endDate: "2025-05-10",
    seatsTotal: 18,
    seatsTaken: 18,
    status: "full",
  },
  {
    id: "pbi-201",
    title: "Power BI – Visualisation de données",
    code: "PBI-201",
    category: "Data / BI",
    level: "Intermédiaire",
    language: "Portugais",
    format: "online",
    isCertified: true,
    price: 420,
    currency: "CHF",
    startDate: "2025-05-01",
    endDate: "2025-06-05",
    seatsTotal: 25,
    seatsTaken: 19,
    status: "open",
  },
  {
    id: "ia-101",
    title: "Initiation à l’IA générative",
    code: "IA-101",
    category: "IA / Digital",
    level: "Débutant",
    language: "Français",
    format: "online",
    isCertified: false,
    price: 180,
    currency: "CHF",
    startDate: "2025-02-10",
    endDate: "2025-02-28",
    seatsTotal: 30,
    seatsTaken: 30,
    status: "finished",
  },
  {
    id: "office-100",
    title: "Pack Office – Bases essentielles (Word, Excel, PowerPoint)",
    code: "OFFICE-100",
    category: "Bureautique",
    level: "Débutant",
    language: "Français",
    format: "hybrid",
    isCertified: true,
    price: 390,
    currency: "CHF",
    startDate: "2025-06-01",
    endDate: "2025-07-01",
    seatsTotal: 22,
    seatsTaken: 8,
    status: "draft",
  },
];

const LEVEL_OPTIONS = ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"];

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
    label: "Terminé",
    color: "#9ca3af",
    bg: "#0b1120",
  },
  draft: {
    label: "Brouillon",
    color: "#eab308",
    bg: "#422006",
  },
};

export default function CoursesListPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("Tous les niveaux");
  const [formatFilter, setFormatFilter] = useState("all");
  const [certFilter, setCertFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_start");

  const filteredCourses = useMemo(() => {
    let list = [...COURSES_MOCK];

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((c) => {
        const full = `${c.title} ${c.code} ${c.category}`.toLowerCase();
        return full.includes(s);
      });
    }

    if (levelFilter !== "Tous les niveaux") {
      list = list.filter((c) => c.level === levelFilter);
    }

    if (formatFilter !== "all") {
      list = list.filter((c) => c.format === formatFilter);
    }

    if (certFilter !== "all") {
      const mustBeCertified = certFilter === "certified";
      list = list.filter((c) => c.isCertified === mustBeCertified);
    }

    if (statusFilter !== "all") {
      list = list.filter((c) => c.status === statusFilter);
    }

    if (sortBy === "date_start") {
      list.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    } else if (sortBy === "price") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [search, levelFilter, formatFilter, certFilter, statusFilter, sortBy]);

  return (
    <div className="page">
      <main className="container">
        {/* HEADER */}
        <header className="header">
          <div>
            <p className="breadcrumb">Dashboard / Cours</p>
            <h1>Liste des cours</h1>
            <p className="muted">
              Gère tous les modules de Dandela Academy : état des inscriptions,
              formats, certifications et tarifs.
            </p>
          </div>

          <div className="header-actions">
            <button className="btn ghost">Exporter (.csv)</button>
            <button className="btn primary">Créer un cours</button>
          </div>
        </header>

        {/* BARRE DE FILTRES */}
        <section className="toolbar">
          <div className="search-block">
            <input
              type="text"
              placeholder="Rechercher par titre, code, catégorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filters">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {LEVEL_OPTIONS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
            >
              <option value="all">Tous les formats</option>
              <option value="online">En ligne</option>
              <option value="onsite">Présentiel</option>
              <option value="hybrid">Hybride</option>
            </select>

            <select
              value={certFilter}
              onChange={(e) => setCertFilter(e.target.value)}
            >
              <option value="all">Certifié / non certifié</option>
              <option value="certified">Certifiés</option>
              <option value="not_certified">Non certifiés</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Inscriptions ouvertes</option>
              <option value="full">Complet</option>
              <option value="finished">Terminés</option>
              <option value="draft">Brouillons</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date_start">Trier par date de début</option>
              <option value="price">Trier par prix</option>
              <option value="title">Trier par titre</option>
            </select>
          </div>
        </section>

        {/* TABLE / LISTE */}
        <section className="card">
          <div className="table-header">
            <span className="th th-title">Cours</span>
            <span className="th th-code">Code / Catégorie</span>
            <span className="th th-format">Format</span>
            <span className="th th-level">Niveau / Langue</span>
            <span className="th th-dates">Dates</span>
            <span className="th th-price">Prix</span>
            <span className="th th-seats">Places</span>
            <span className="th th-status">Statut</span>
            <span className="th th-actions">Actions</span>
          </div>

          <div className="table-body">
            {filteredCourses.length === 0 && (
              <div className="empty-state">
                Aucun cours ne correspond à ces critères.
              </div>
            )}

            {filteredCourses.map((course) => (
              <CourseRow key={course.id} course={course} />
            ))}
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
          max-width: 1150px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          align-items: flex-start;
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
          max-width: 480px;
        }

        .header-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
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

        .btn.ghost {
          background: transparent;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .search-block {
          flex: 1;
          min-width: 220px;
        }

        .search-block input {
          width: 100%;
          border-radius: 999px;
          border: 1px solid #1f2937;
          padding: 8px 12px;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.9rem;
          outline: none;
        }

        .search-block input::placeholder {
          color: #6b7280;
        }

        .filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filters select {
          border-radius: 999px;
          border: 1px solid #1f2937;
          background: #020617;
          color: #e5e7eb;
          padding: 6px 10px;
          font-size: 0.83rem;
          outline: none;
        }

        .card {
          background: #020617;
          border-radius: 16px;
          border: 1px solid #1f2937;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
          padding: 8px 0 10px;
        }

        .table-header {
          display: grid;
          grid-template-columns:
            minmax(0, 2.5fr)
            minmax(0, 1.6fr)
            minmax(0, 1.4fr)
            minmax(0, 1.7fr)
            minmax(0, 1.7fr)
            minmax(0, 1.4fr)
            minmax(0, 1.4fr)
            minmax(0, 1.7fr)
            minmax(0, 1.5fr);
          gap: 8px;
          padding: 8px 16px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #6b7280;
          border-bottom: 1px solid #111827;
        }

        @media (max-width: 980px) {
          .table-header {
            display: none;
          }

          .card {
            padding: 10px;
          }
        }

        .th {
          white-space: nowrap;
        }

        .table-body {
          display: flex;
          flex-direction: column;
        }

        .empty-state {
          padding: 16px;
          text-align: center;
          font-size: 0.9rem;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

function CourseRow({ course }) {
  const formatCfg = FORMAT_CONFIG[course.format];
  const statusCfg = STATUS_CONFIG[course.status];
  const seatsLeft = Math.max(course.seatsTotal - course.seatsTaken, 0);

  return (
    <>
      <div className="row">
        {/* Titre / description */}
        <div className="cell cell-title">
          <p className="course-title">{course.title}</p>
          <p className="course-sub">
            {course.category} • {course.isCertified ? "Certifié" : "Non certifié"}
          </p>
        </div>

        {/* Code / catégorie */}
        <div className="cell cell-code">
          <p className="text-main">{course.code}</p>
          <p className="text-sub">{course.category}</p>
        </div>

        {/* Format */}
        <div className="cell cell-format">
          <span
            className="format-pill"
            style={{
              borderColor: formatCfg.color,
              color: formatCfg.color,
            }}
          >
            <span
              className="pill-dot"
              style={{ backgroundColor: formatCfg.color }}
            />
            {formatCfg.label}
          </span>
        </div>

        {/* Niveau / langue */}
        <div className="cell cell-level">
          <p className="text-main">{course.level}</p>
          <p className="text-sub">{course.language}</p>
        </div>

        {/* Dates */}
        <div className="cell cell-dates">
          <p className="text-main">
            Du {formatDate(course.startDate)} au {formatDate(course.endDate)}
          </p>
          <p className="text-sub">
            Durée : {estimateDurationWeeks(course.startDate, course.endDate)}{" "}
            semaines (approx.)
          </p>
        </div>

        {/* Prix */}
        <div className="cell cell-price">
          <p className="text-main">
            {course.price} {course.currency}
          </p>
          {course.isCertified && (
            <p className="text-sub">Éligible certificate</p>
          )}
        </div>

        {/* Places */}
        <div className="cell cell-seats">
          <p className="text-main">
            {course.seatsTaken}/{course.seatsTotal} inscrits
          </p>
          <p className="text-sub">
            {course.status === "finished"
              ? "Session terminée"
              : seatsLeft <= 0
              ? "Aucune place restante"
              : `${seatsLeft} place(s) libre(s)`}
          </p>
        </div>

        {/* Statut */}
        <div className="cell cell-status">
          <span
            className="status-badge"
            style={{
              backgroundColor: statusCfg.bg,
              color: statusCfg.color,
              borderColor: statusCfg.color,
            }}
          >
            {statusCfg.label}
          </span>
        </div>

        {/* Actions */}
        <div className="cell cell-actions">
          <button className="mini-btn">Voir</button>
          <button className="mini-btn ghost">Éditer</button>
        </div>
      </div>

      <style jsx>{`
        .row {
          display: grid;
          grid-template-columns:
            minmax(0, 2.5fr)
            minmax(0, 1.6fr)
            minmax(0, 1.4fr)
            minmax(0, 1.7fr)
            minmax(0, 1.7fr)
            minmax(0, 1.4fr)
            minmax(0, 1.4fr)
            minmax(0, 1.7fr)
            minmax(0, 1.5fr);
          gap: 8px;
          padding: 10px 16px;
          font-size: 0.85rem;
          border-bottom: 1px solid #050816;
          align-items: center;
        }

        .row:hover {
          background: radial-gradient(circle at top left, #1d4ed822, #020617);
        }

        .cell {
          min-width: 0;
        }

        .cell-title {
          min-width: 0;
        }

        .course-title {
          margin: 0;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .course-sub {
          margin: 0;
          font-size: 0.78rem;
          color: #9ca3af;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .text-main {
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .text-sub {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .format-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          border: 1px solid;
          padding: 2px 8px;
          font-size: 0.75rem;
          background: #020617;
        }

        .pill-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          border: 1px solid;
          padding: 2px 8px;
          font-size: 0.75rem;
          white-space: nowrap;
        }

        .cell-actions {
          display: flex;
          gap: 4px;
          justify-content: flex-end;
        }

        .mini-btn {
          border-radius: 999px;
          padding: 4px 8px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .mini-btn.ghost {
          background: transparent;
        }

        @media (max-width: 980px) {
          .row {
            grid-template-columns: 1fr;
            padding: 10px 10px;
            margin-bottom: 8px;
            border-radius: 12px;
            border: 1px solid #111827;
          }

          .cell-actions {
            justify-content: flex-end;
          }
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

/** Estimation très simple en semaines (pour l'affichage) */
function estimateDurationWeeks(start, end) {
  if (!start || !end) return "-";
  const s = new Date(start);
  const e = new Date(end);
  const diffMs = e.getTime() - s.getTime();
  const weeks = diffMs / (1000 * 60 * 60 * 24 * 7);
  return Math.max(1, Math.round(weeks));
}
