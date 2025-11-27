"use client";
import React, { useState } from 'react';
import { IconDashboard, } from "@/assets/icons/IconsComponent";
import { WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_DASHBOARD_HOME, } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import ComputersComponent from '@/components/dashboard/hub/ComputersComponent';

// Liste mock des 25 ordinateurs
const initialComputers = [
  { id: 1, name: "PC-01", status: "available" },
  { id: 2, name: "PC-02", status: "available" },
  { id: 3, name: "PC-03", status: "in_use" },
  { id: 4, name: "PC-04", status: "in_use" },
  { id: 5, name: "PC-05", status: "maintenance" },
  { id: 6, name: "PC-06", status: "available" },
  { id: 7, name: "PC-07", status: "offline" },
  { id: 8, name: "PC-08", status: "in_use" },
  { id: 9, name: "PC-09", status: "available" },
  { id: 10, name: "PC-10", status: "available" },
  { id: 11, name: "PC-11", status: "in_use" },
  { id: 12, name: "PC-12", status: "maintenance" },
  { id: 13, name: "PC-13", status: "available" },
  { id: 14, name: "PC-14", status: "offline" },
  { id: 15, name: "PC-15", status: "available" },
  { id: 16, name: "PC-16", status: "in_use" },
  { id: 17, name: "PC-17", status: "available" },
  { id: 18, name: "PC-18", status: "maintenance" },
  { id: 19, name: "PC-19", status: "in_use" },
  { id: 20, name: "PC-20", status: "available" },
  { id: 21, name: "PC-21", status: "available" },
  { id: 22, name: "PC-22", status: "offline" },
  { id: 23, name: "PC-23", status: "in_use" },
  { id: 24, name: "PC-24", status: "available" },
  { id: 25, name: "PC-25", status: "available" },
];

// Mapping des statuts → label + couleurs
const STATUS_CONFIG = {
  available: {
    label: "Disponible",
    badgeBg: "#022c22",
    badgeBorder: "#16a34a",
    badgeText: "#bbf7d0",
    glow: "#22c55e55",
  },
  in_use: {
    label: "Occupé",
    badgeBg: "#111827",
    badgeBorder: "#3b82f6",
    badgeText: "#bfdbfe",
    glow: "#3b82f655",
  },
  maintenance: {
    label: "Maintenance",
    badgeBg: "#422006",
    badgeBorder: "#f97316",
    badgeText: "#fed7aa",
    glow: "#f9731655",
  },
  offline: {
    label: "Hors service",
    badgeBg: "#111827",
    badgeBorder: "#6b7280",
    badgeText: "#e5e7eb",
    glow: "#6b728055",
  },
};

function ComputersPage() {
  const [computers] = useState(initialComputers);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filteredComputers =
    filter === "all"
      ? computers
      : computers.filter((pc) => pc.status === filter);

  const handleCardClick = (pc) => {
    setSelected(pc);
  };

  return (
    <div className="page">
      <main className="container">
        {/* HEADER */}
        <header className="header">
          <div>
            <p className="breadcrumb">Dashboard / Parc machines</p>
            <h1>État des ordinateurs</h1>
            <p className="muted">
              Vue d&apos;ensemble des 25 postes de travail sur le site, avec
              leur disponibilité en temps réel.
            </p>
          </div>

          <div className="legend">
            <LegendItem status="available" />
            <LegendItem status="in_use" />
            <LegendItem status="maintenance" />
            <LegendItem status="offline" />
          </div>
        </header>

        {/* FILTRES + STATS QUICK */}
        <section className="toolbar">
          <div className="chips">
            <button
              className={`chip ${filter === "all" ? "chip-active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Tous
            </button>
            <button
              className={`chip ${filter === "available" ? "chip-active" : ""}`}
              onClick={() => setFilter("available")}
            >
              Disponibles
            </button>
            <button
              className={`chip ${filter === "in_use" ? "chip-active" : ""}`}
              onClick={() => setFilter("in_use")}
            >
              Occupés
            </button>
            <button
              className={`chip ${filter === "maintenance" ? "chip-active" : ""
                }`}
              onClick={() => setFilter("maintenance")}
            >
              Maintenance
            </button>
            <button
              className={`chip ${filter === "offline" ? "chip-active" : ""}`}
              onClick={() => setFilter("offline")}
            >
              HS / Hors ligne
            </button>
          </div>

          <div className="counts">
            <CountBubble
              label="Disponibles"
              value={computers.filter((c) => c.status === "available").length}
            />
            <CountBubble
              label="Occupés"
              value={computers.filter((c) => c.status === "in_use").length}
            />
            <CountBubble
              label="Maintenance"
              value={computers.filter((c) => c.status === "maintenance").length}
            />
            <CountBubble
              label="HS"
              value={computers.filter((c) => c.status === "offline").length}
            />
          </div>
        </section>

        {/* GRID + PANEL */}
        <section className="layout">
          {/* GRID DES ORDIS */}
          <div className="grid">
            {filteredComputers.map((pc) => (
              <ComputerCard
                key={pc.id}
                computer={pc}
                isSelected={selected?.id === pc.id}
                onClick={() => handleCardClick(pc)}
              />
            ))}
          </div>

          {/* PANNEAU DÉTAILS */}
          <aside className="side-panel">
            {selected ? (
              <>
                <h2>Détails du poste</h2>
                <div className="side-icon-wrapper">
                  <ComputerIconLarge status={selected.status} />
                </div>
                <p className="side-name">{selected.name}</p>
                <StatusBadge status={selected.status} big />

                <div className="side-info">
                  <p>
                    <span>Identifiant interne :</span> #{selected.id}
                  </p>
                  <p>
                    <span>Emplacement :</span> Salle informatique principale
                  </p>
                  <p>
                    <span>Type :</span> Poste fixe
                  </p>
                  <p>
                    <span>OS :</span> Windows 11 (exemple)
                  </p>
                  <p>
                    <span>Dernière mise à jour :</span> 14.11.2025
                  </p>
                </div>

                <p className="side-note">
                  Cette partie pourra être reliée à ta vraie base de données
                  (Firestore, API interne) pour afficher les specs, l&apos;état
                  des mises à jour, l&apos;historique des pannes, etc.
                </p>
              </>
            ) : (
              <div className="side-empty">
                <p>Sélectionne un ordinateur dans la grille pour voir les détails.</p>
              </div>
            )}
          </aside>
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
          max-width: 1200px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          align-items: flex-start;
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
          max-width: 460px;
        }

        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: flex-end;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .chip {
          border-radius: 999px;
          padding: 4px 10px;
          border: 1px solid #1f2937;
          background: #020617;
          color: #9ca3af;
          font-size: 0.78rem;
          cursor: pointer;
        }

        .chip-active {
          background: #111827;
          border-color: #2563eb;
          color: #e5e7eb;
        }

        .counts {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 1.1fr);
          gap: 16px;
        }

        @media (max-width: 980px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .header {
            flex-direction: column;
          }
        }

        .grid {
          background: #020617;
          border-radius: 16px;
          border: 1px solid #1f2937;
          padding: 12px;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        @media (max-width: 1000px) {
          .grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (max-width: 800px) {
          .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .side-panel {
          background: #020617;
          border-radius: 16px;
          border: 1px solid #1f2937;
          padding: 16px 16px 18px;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
          min-height: 220px;
        }

        .side-panel h2 {
          margin: 0 0 12px;
          font-size: 1.1rem;
        }

        .side-icon-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
        }

        .side-name {
          text-align: center;
          margin: 0;
          font-weight: 600;
          font-size: 1rem;
        }

        .side-info {
          margin-top: 12px;
          font-size: 0.85rem;
        }

        .side-info p {
          margin: 2px 0;
        }

        .side-info span {
          color: #9ca3af;
        }

        .side-note {
          margin-top: 12px;
          font-size: 0.78rem;
          color: #6b7280;
        }

        .side-empty {
          font-size: 0.9rem;
          color: #9ca3af;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}

/** Composants réutilisables **/

function LegendItem({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="legend-item">
      <span className="legend-dot" />
      <span className="legend-label">{cfg.label}</span>

      <style jsx>{`
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #e5e7eb;
        }
        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 2px solid ${cfg.badgeBorder};
          background: ${cfg.badgeBg};
          box-shadow: 0 0 10px ${cfg.glow};
        }
        .legend-label {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

function CountBubble({ label, value }) {
  return (
    <div className="count-bubble">
      <span className="count-value">{value}</span>
      <span className="count-label">{label}</span>

      <style jsx>{`
        .count-bubble {
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid #1f2937;
          background: #020617;
          font-size: 0.78rem;
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
        }
        .count-value {
          font-weight: 600;
        }
        .count-label {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

function ComputerCard({ computer, isSelected, onClick }) {
  const cfg = STATUS_CONFIG[computer.status];

  return (
    <button className="pc-card" onClick={onClick} type="button">
      <div className="pc-icon-wrapper">
        <ComputerIconSmall status={computer.status} />
      </div>
      <p className="pc-name">{computer.name}</p>
      <StatusBadge status={computer.status} />
      <p className="pc-id">#{computer.id.toString().padStart(2, "0")}</p>

      <style jsx>{`
        .pc-card {
          border-radius: 14px;
          border: 1px solid ${isSelected ? cfg.badgeBorder : "#111827"};
          background: radial-gradient(circle at top, ${cfg.glow}, #020617);
          padding: 8px 8px 9px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease,
            border-color 0.12s ease, background 0.12s ease;
          box-shadow: ${isSelected
          ? "0 0 0 1px #1d4ed8, 0 12px 35px rgba(0,0,0,0.6)"
          : "0 10px 25px rgba(0,0,0,0.5)"};
        }

        .pc-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.6);
          border-color: ${cfg.badgeBorder};
        }

        .pc-icon-wrapper {
          margin-bottom: 2px;
        }

        .pc-name {
          margin: 0;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .pc-id {
          margin: 0;
          font-size: 0.75rem;
          color: #9ca3af;
        }
      `}</style>
    </button>
  );
}

function StatusBadge({ status, big = false }) {
  const cfg = STATUS_CONFIG[status];

  return (
    <>
      <span className={`badge ${big ? "badge-big" : ""}`}>
        <span className="dot" />
        {cfg.label}
      </span>

      <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid ${cfg.badgeBorder};
          background: ${cfg.badgeBg};
          color: ${cfg.badgeText};
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
          background: ${cfg.badgeBorder};
          box-shadow: 0 0 8px ${cfg.glow};
        }
      `}</style>
    </>
  );
}

/** Icône "ordinateur de maison" en mode petit **/
function ComputerIconSmall({ status }) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon">
      <div className="screen" />
      <div className="stand" />
      <div className="base" />

      <style jsx>{`
        .icon {
          width: 42px;
          height: 38px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .screen {
          width: 100%;
          height: 22px;
          border-radius: 8px;
          border: 2px solid #111827;
          background: linear-gradient(
            135deg,
            ${cfg.badgeBorder}33,
            #020617 65%
          );
          box-shadow: inset 0 0 0 1px #020617, 0 0 10px ${cfg.glow};
        }

        .stand {
          width: 8px;
          height: 6px;
          margin-top: 2px;
          border-radius: 4px;
          background: #0b1120;
          border: 1px solid #111827;
        }

        .base {
          width: 24px;
          height: 4px;
          margin-top: 2px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #111827;
        }
      `}</style>
    </div>
  );
}

/** Version "large" pour le panneau de droite **/
function ComputerIconLarge({ status }) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-large">
      <div className="screen" />
      <div className="stand" />
      <div className="base" />

      <style jsx>{`
        .icon-large {
          width: 90px;
          height: 70px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .screen {
          width: 100%;
          height: 42px;
          border-radius: 12px;
          border: 2px solid #111827;
          background: radial-gradient(
            circle at top left,
            ${cfg.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617, 0 0 16px ${cfg.glow};
        }

        .stand {
          width: 12px;
          height: 10px;
          margin-top: 4px;
          border-radius: 6px;
          background: #020617;
          border: 1px solid #111827;
        }

        .base {
          width: 40px;
          height: 6px;
          margin-top: 3px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #111827;
        }
      `}</style>
    </div>
  );
}

/*
const mockUser = {
  firstName: "Daniel",
};
*/

const mockStats = {
  totalCourses: 12,
  activeCourses: 4,
  completedCourses: 8,
  averageScore: 87,
  hoursLearned: 142,
  certificates: 3,
};

const mockCourses = [
  {
    id: 1,
    title: "Excel – Niveau Intermédiaire",
    teacher: "Ana Silva",
    progress: 65,
    nextSession: "Aujourd'hui • 14:00",
    status: "En cours",
  },
  {
    id: 2,
    title: "Initiation à l’IA générative",
    teacher: "João Pereira",
    progress: 30,
    nextSession: "Demain • 09:30",
    status: "En cours",
  },
  {
    id: 3,
    title: "Word – Rédaction professionnelle",
    teacher: "Marie Dupont",
    progress: 100,
    nextSession: "Terminé",
    status: "Terminé",
  },
];

const mockTeachers = [
  { id: 1, name: "Ana Silva", specialty: "Excel / Power BI", courses: 4 },
  { id: 2, name: "João Pereira", specialty: "IA / Automatisation", courses: 3 },
  { id: 3, name: "Marie Dupont", specialty: "Bureautique avancée", courses: 2 },
];

const mockMessages = [
  {
    id: 1,
    from: "Ana Silva",
    role: "Professeure",
    time: "Il y a 2 h",
    preview: "N’oublie pas de terminer l’exercice 3 avant la prochaine session...",
    unread: true,
  },
  {
    id: 2,
    from: "Support Dandela Academy",
    role: "Support",
    time: "Hier",
    preview: "Ton certificat pour le cours Excel – Débutant est disponible au téléchargement.",
    unread: false,
  },
  {
    id: 3,
    from: "João Pereira",
    role: "Professeur",
    time: "Il y a 3 jours",
    preview: "Bravo pour ta progression, tu es dans le top 10% de ta classe !",
    unread: false,
  },
];

const mockCertificates = [
  {
    id: 1,
    title: "Excel – Débutant",
    date: "12.09.2025",
  },
  {
    id: 2,
    title: "Word – Bases essentielles",
    date: "30.10.2025",
  },
  {
    id: 3,
    title: "Compétences numériques – Niveau 1",
    date: "05.11.2025",
  },
];

function DashboardPage() {
  const [timeRange, setTimeRange] = useState("30j"); // 7j | 30j | all

  return (
    <div className="page">
      <main className="container">
        {/* HEADER */}
        <header className="header">
          <div>
            <p className="welcome">Bonjour, {mockUser.firstName} 👋</p>
            <h1>Tableau de bord</h1>
            <p className="muted">
              Survole tes cours, messages, professeurs et tes résultats en un coup d&apos;œil.
            </p>
          </div>

          <div className="quick-actions">
            <button className="btn ghost">Voir mon profil</button>
            <button className="btn primary">Continuer un cours</button>
          </div>
        </header>

        {/* STATS CARDS */}
        <section className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Cours actifs</p>
            <p className="stat-value">{mockStats.activeCourses}</p>
            <p className="stat-helper">
              Sur {mockStats.totalCourses} au total
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Cours terminés</p>
            <p className="stat-value">{mockStats.completedCourses}</p>
            <p className="stat-helper">Continue sur ta lancée 💪</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Moyenne générale</p>
            <p className="stat-value">
              {mockStats.averageScore}
              <span className="stat-unit">%</span>
            </p>
            <div className="stat-bar">
              <div
                className="stat-bar-fill"
                style={{ width: `${mockStats.averageScore}%` }}
              />
            </div>
          </div>

          <div className="stat-card">
            <p className="stat-label">Certificats obtenus</p>
            <p className="stat-value">{mockStats.certificates}</p>
            <p className="stat-helper">
              {mockStats.hoursLearned} h d&apos;apprentissage
            </p>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="main-grid">
          {/* LEFT COLUMN */}
          <div className="main-col">
            {/* COURSES */}
            <div className="card">
              <div className="card-header">
                <h2>Mes cours</h2>
                <div className="chips">
                  <button className="chip chip-active">Actifs</button>
                  <button className="chip">Terminés</button>
                  <button className="chip">Tous</button>
                </div>
              </div>

              <div className="course-list">
                {mockCourses.map((course) => (
                  <div key={course.id} className="course-item">
                    <div className="course-main">
                      <p className="course-title">{course.title}</p>
                      <p className="course-sub">
                        {course.teacher} • {course.status}
                      </p>
                      <p className="course-next">{course.nextSession}</p>
                    </div>
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="progress-label">
                        {course.progress}% complété
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STATS DETAIL */}
            <div className="card">
              <div className="card-header">
                <h2>Statistiques détaillées</h2>
                <div className="chips">
                  <button
                    className={`chip ${timeRange === "7j" ? "chip-active" : ""}`}
                    onClick={() => setTimeRange("7j")}
                  >
                    7 jours
                  </button>
                  <button
                    className={`chip ${timeRange === "30j" ? "chip-active" : ""
                      }`}
                    onClick={() => setTimeRange("30j")}
                  >
                    30 jours
                  </button>
                  <button
                    className={`chip ${timeRange === "all" ? "chip-active" : ""
                      }`}
                    onClick={() => setTimeRange("all")}
                  >
                    Tout
                  </button>
                </div>
              </div>

              <div className="stats-detail-grid">
                <div className="stats-detail-item">
                  <p className="stat-detail-value">12</p>
                  <p className="stat-detail-label">Cours suivis</p>
                </div>
                <div className="stats-detail-item">
                  <p className="stat-detail-value">21</p>
                  <p className="stat-detail-label">
                    Quiz complétés ({timeRange})
                  </p>
                </div>
                <div className="stats-detail-item">
                  <p className="stat-detail-value">92%</p>
                  <p className="stat-detail-label">Meilleure note</p>
                </div>
                <div className="stats-detail-item">
                  <p className="stat-detail-value">Top 10%</p>
                  <p className="stat-detail-label">Classement de la promo</p>
                </div>
              </div>

              <p className="stats-note">
                Ces données sont fictives. Tu pourras les remplacer par tes
                vraies stats venant de Firestore / API.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="side-col">
            {/* MESSAGES */}
            <div className="card">
              <div className="card-header">
                <h2>Messages récents</h2>
                <button className="link-btn">Voir tous</button>
              </div>

              <div className="message-list">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item ${msg.unread ? "message-unread" : ""
                      }`}
                  >
                    <div className="message-avatar">
                      {msg.from
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </div>
                    <div className="message-content">
                      <div className="message-top">
                        <span className="message-from">{msg.from}</span>
                        <span className="message-time">{msg.time}</span>
                      </div>
                      <p className="message-role">{msg.role}</p>
                      <p className="message-preview">{msg.preview}</p>
                      {msg.unread && <span className="badge">Nouveau</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TEACHERS */}
            <div className="card">
              <div className="card-header">
                <h2>Professeurs</h2>
                <button className="link-btn">Voir tous</button>
              </div>
              <div className="teacher-list">
                {mockTeachers.map((t) => (
                  <div key={t.id} className="teacher-item">
                    <div className="teacher-avatar">
                      {t.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </div>
                    <div className="teacher-info">
                      <p className="teacher-name">{t.name}</p>
                      <p className="teacher-sub">{t.specialty}</p>
                      <p className="teacher-meta">
                        {t.courses} cours disponibles
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CERTIFICATES */}
            <div className="card">
              <div className="card-header">
                <h2>Diplômes & certificats</h2>
                <button className="link-btn">Télécharger</button>
              </div>
              <div className="cert-list">
                {mockCertificates.map((c) => (
                  <div key={c.id} className="cert-item">
                    <div>
                      <p className="cert-title">{c.title}</p>
                      <p className="cert-date">Obtenu le {c.date}</p>
                    </div>
                    <button className="mini-btn">PDF</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* STYLES */}
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
          max-width: 1200px;
        }

        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .welcome {
          margin: 0;
          font-size: 0.95rem;
          color: #9ca3af;
        }

        h1 {
          margin: 4px 0 8px;
          font-size: 1.9rem;
        }

        .muted {
          margin: 0;
          font-size: 0.9rem;
          color: #9ca3af;
          max-width: 480px;
        }

        .quick-actions {
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: #020617;
          border-radius: 16px;
          padding: 14px 16px;
          border: 1px solid #1f2937;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
        }

        .stat-label {
          margin: 0 0 4px;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .stat-value {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .stat-unit {
          font-size: 0.9rem;
          margin-left: 4px;
          color: #9ca3af;
        }

        .stat-helper {
          margin: 6px 0 0;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .stat-bar {
          margin-top: 8px;
          height: 6px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #1f2937;
          overflow: hidden;
        }

        .stat-bar-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #22c55e, #16a34a);
        }

        .main-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        .main-col,
        .side-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .card {
          background: #020617;
          border-radius: 16px;
          padding: 16px 16px 14px;
          border: 1px solid #1f2937;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 12px;
        }

        .card-header h2 {
          margin: 0;
          font-size: 1.1rem;
        }

        .chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .chip {
          border-radius: 999px;
          padding: 4px 10px;
          border: 1px solid #1f2937;
          background: #020617;
          color: #9ca3af;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .chip-active {
          background: #111827;
          border-color: #2563eb;
          color: #e5e7eb;
        }

        .course-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .course-item {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 10px;
          border-radius: 12px;
          background: #020617;
          border: 1px solid #111827;
        }

        .course-title {
          margin: 0 0 4px;
          font-size: 0.95rem;
        }

        .course-sub {
          margin: 0;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .course-next {
          margin: 4px 0 0;
          font-size: 0.8rem;
          color: #60a5fa;
        }

        .course-progress {
          min-width: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #1f2937;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2563eb, #4f46e5);
        }

        .progress-label {
          font-size: 0.75rem;
          color: #9ca3af;
          text-align: right;
        }

        .stats-detail-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 8px;
        }

        .stats-detail-item {
          padding: 8px 10px;
          border-radius: 10px;
          background: #020617;
          border: 1px solid #111827;
        }

        .stat-detail-value {
          margin: 0;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .stat-detail-label {
          margin: 2px 0 0;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .stats-note {
          margin-top: 10px;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .link-btn {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          font-size: 0.8rem;
          color: #60a5fa;
          cursor: pointer;
        }

        .message-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .message-item {
          display: flex;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          background: #020617;
          border: 1px solid #111827;
        }

        .message-unread {
          border-color: #2563eb;
          background: radial-gradient(circle at top left, #1d4ed81a, #020617);
        }

        .message-avatar {
          min-width: 32px;
          height: 32px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .message-content {
          flex: 1;
          position: relative;
        }

        .message-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 2px;
        }

        .message-from {
          font-weight: 500;
        }

        .message-time {
          color: #6b7280;
        }

        .message-role {
          margin: 0;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .message-preview {
          margin: 4px 0 0;
          font-size: 0.8rem;
          color: #e5e7eb;
        }

        .badge {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 999px;
          background: #22c55e33;
          color: #4ade80;
          border: 1px solid #16a34a;
        }

        .teacher-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .teacher-item {
          display: flex;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          background: #020617;
          border: 1px solid #111827;
        }

        .teacher-avatar {
          min-width: 32px;
          height: 32px;
          border-radius: 999px;
          background: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .teacher-name {
          margin: 0;
          font-size: 0.9rem;
        }

        .teacher-sub {
          margin: 2px 0 0;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .teacher-meta {
          margin: 2px 0 0;
          font-size: 0.75rem;
          color: #60a5fa;
        }

        .cert-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cert-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          background: #020617;
          border: 1px solid #111827;
        }

        .cert-title {
          margin: 0 0 2px;
          font-size: 0.9rem;
        }

        .cert-date {
          margin: 0;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .mini-btn {
          border-radius: 999px;
          padding: 4px 10px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.75rem;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
          }

          .quick-actions {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stats-detail-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .course-item {
            flex-direction: column;
          }

          .course-progress {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

// Mock user connecté
const mockUser = {
  id: "user_1",
  firstName: "Daniel",
  lastName: "Mbengui",
  role: "student", // "student" | "teacher" | "admin"
};


const initialTeacher = {
  firstName: "Ana",
  lastName: "Silva",
  title: "Professeure",
  schoolEmail: "ana.silva@dandela-academy.com",
  personalEmail: "ana.silva@example.com",
  phone: "+41 79 123 45 67",
  role: "Professeur",
  type: "Temps plein",
  teacherId: "T-2025-001",
  bio: "Passionnée par la bureautique et l’analyse de données, j’accompagne les étudiants dans la maîtrise d’Excel, de Power BI et des outils numériques modernes.",
  expertise: ["Excel", "Power BI", "IA appliquée", "Automatisation"],
  languages: ["Français", "Portugais", "Anglais"],
  location: "Campus central - Salle 3",
  officeHours: "Mardi & Jeudi • 16:00 – 18:00",
  notificationsEmail: true,
  notificationsSms: false,
  theme: "dark",
};
/*
const mockStats = {
  activeCourses: 4,
  studentsThisYear: 86,
  averageRating: 4.7,
  messagesUnread: 3,
};

const mockCourses = [
  {
    id: 1,
    title: "Excel – Niveau Débutant",
    code: "EXCEL-101",
    students: 24,
    status: "Actif",
    nextSession: "Aujourd'hui • 10:00",
  },
  {
    id: 2,
    title: "Excel – Niveau Intermédiaire",
    code: "EXCEL-102",
    students: 18,
    status: "Actif",
    nextSession: "Demain • 18:00",
  },
  {
    id: 3,
    title: "Power BI – Visualisation de données",
    code: "PBI-201",
    students: 22,
    status: "Actif",
    nextSession: "Jeudi • 19:00",
  },
];

const mockMessages = [
  {
    id: 1,
    from: "Daniel Mbengui",
    time: "Il y a 1 h",
    preview:
      "Bonjour Madame, j’ai une question sur l’exercice 4 concernant les tableaux croisés...",
    unread: true,
  },
  {
    id: 2,
    from: "Support Dandela Academy",
    time: "Hier",
    preview:
      "Votre cours “Power BI – Visualisation de données” a atteint 20 étudiants inscrits.",
    unread: false,
  },
  {
    id: 3,
    from: "João Pereira",
    time: "Il y a 3 jours",
    preview:
      "On pourrait co-créer un module sur l’IA appliquée à Excel, tu en penses quoi ?",
    unread: false,
  },
];
*/
function TeacherProfilePage() {
  const [teacher, setTeacher] = useState(initialTeacher);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialTeacher);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Gestion arrays simple → string séparée par virgule
    if (name === "expertise" || name === "languages") {
      const arr = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      setDraft((prev) => ({
        ...prev,
        [name]: arr,
      }));
      return;
    }

    setDraft((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = () => {
    setDraft(teacher);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(teacher);
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setTeacher(draft);
    setIsEditing(false);

    // Ici tu pourras appeler ton API / Firestore pour sauvegarder
    // await fetch("/api/teachers/me", { method: "PUT", body: JSON.stringify(draft) })
    console.log("Profil prof sauvegardé :", draft);
  };

  return (
    <div className="page">
      <main className="container">
        {/* HEADER */}
        <header className="header">
          <div className="header-left">
            <div className="avatar">
              {teacher.firstName[0]}
              {teacher.lastName[0]}
            </div>
            <div>
              <p className="badge-role">{teacher.title}</p>
              <h1>
                {teacher.firstName} {teacher.lastName}
              </h1>
              <p className="muted">
                #{teacher.teacherId} • {teacher.role} • {teacher.type}
              </p>
            </div>
          </div>

          <div className="header-right">
            <div className="contact-block">
              <p className="contact-line">
                <span>Email école :</span> {teacher.schoolEmail}
              </p>
              <p className="contact-line">
                <span>Email perso :</span> {teacher.personalEmail}
              </p>
              <p className="contact-line">
                <span>Téléphone :</span> {teacher.phone}
              </p>
            </div>

            <div className="header-actions">
              {!isEditing && (
                <button className="btn primary" onClick={handleEdit}>
                  Modifier le profil
                </button>
              )}
              {isEditing && (
                <>
                  <button className="btn" onClick={handleCancel}>
                    Annuler
                  </button>
                  <button className="btn primary" onClick={handleSave}>
                    Enregistrer
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* STATS */}
        <section className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Cours actifs</p>
            <p className="stat-value">{mockStats.activeCourses}</p>
            <p className="stat-helper">en ce moment</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Étudiants cette année</p>
            <p className="stat-value">{mockStats.studentsThisYear}</p>
            <p className="stat-helper">tous cours confondus</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Note moyenne</p>
            <p className="stat-value">
              {mockStats.averageRating}
              <span className="stat-unit">/5</span>
            </p>
            <div className="stat-bar">
              <div
                className="stat-bar-fill"
                style={{ width: `${(mockStats.averageRating / 5) * 100}%` }}
              />
            </div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Messages non lus</p>
            <p className="stat-value">{mockStats.messagesUnread}</p>
            <p className="stat-helper">à traiter</p>
          </div>
        </section>

        {/* GRILLE PRINCIPALE */}
        <section className="grid">
          {/* COL 1 : infos prof + paramètres */}
          <form className="card" onSubmit={handleSave}>
            <h2>Informations du professeur</h2>

            <div className="field-group">
              <div className="field">
                <label>Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={draft.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="field">
                <label>Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={draft.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="field-group">
              <div className="field">
                <label>Titre / fonction</label>
                <input
                  type="text"
                  name="title"
                  value={draft.title}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="field">
                <label>Rôle</label>
                <select
                  name="role"
                  value={draft.role}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="Professeur">Professeur</option>
                  <option value="Super professeur">Super professeur</option>
                  <option value="Coordinateur">Coordinateur</option>
                </select>
              </div>
            </div>

            <div className="field-group">
              <div className="field">
                <label>Type de contrat</label>
                <select
                  name="type"
                  value={draft.type}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="Temps plein">Temps plein</option>
                  <option value="Temps partiel">Temps partiel</option>
                  <option value="Consultant externe">Consultant externe</option>
                </select>
              </div>
              <div className="field">
                <label>ID professeur</label>
                <input
                  type="text"
                  name="teacherId"
                  value={draft.teacherId}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="field">
              <label>Bio</label>
              <textarea
                name="bio"
                rows={4}
                value={draft.bio}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="field">
              <label>Domaines d&apos;expertise</label>
              <input
                type="text"
                name="expertise"
                value={draft.expertise.join(", ")}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Ex: Excel, IA, Power BI"
              />
              <p className="hint">
                Sépare chaque domaine avec une virgule ( , )
              </p>
            </div>

            <div className="field">
              <label>Langues parlées</label>
              <input
                type="text"
                name="languages"
                value={draft.languages.join(", ")}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Ex: Français, Portugais, Anglais"
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label>Email de l&apos;école</label>
                <input
                  type="email"
                  name="schoolEmail"
                  value={draft.schoolEmail}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="field">
                <label>Email personnel</label>
                <input
                  type="email"
                  name="personalEmail"
                  value={draft.personalEmail}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="field-group">
              <div className="field">
                <label>Téléphone</label>
                <input
                  type="text"
                  name="phone"
                  value={draft.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="field">
                <label>Thème</label>
                <select
                  name="theme"
                  value={draft.theme}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="dark">Sombre</option>
                  <option value="light">Clair</option>
                  <option value="system">Système</option>
                </select>
              </div>
            </div>

            <h3>Paramètres</h3>
            <div className="field inline">
              <label>
                <input
                  type="checkbox"
                  name="notificationsEmail"
                  checked={draft.notificationsEmail}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                Recevoir les notifications par email
              </label>
            </div>
            <div className="field inline">
              <label>
                <input
                  type="checkbox"
                  name="notificationsSms"
                  checked={draft.notificationsSms}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                Recevoir les notifications par SMS
              </label>
            </div>

            {isEditing && (
              <div className="edit-footer">
                <button
                  type="button"
                  className="btn"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
                <button type="submit" className="btn primary">
                  Enregistrer
                </button>
              </div>
            )}
          </form>

          {/* COL 2 : cours, messages, disponibilités */}
          <div className="side-col">
            {/* COURS */}
            <div className="card">
              <div className="card-header">
                <h2>Cours enseignés</h2>
                <button className="link-btn">Voir tous</button>
              </div>
              <div className="course-list">
                {mockCourses.map((course) => (
                  <div key={course.id} className="course-item">
                    <div>
                      <p className="course-title">{course.title}</p>
                      <p className="course-sub">
                        {course.code} • {course.students} étudiants •{" "}
                        {course.status}
                      </p>
                      <p className="course-next">{course.nextSession}</p>
                    </div>
                    <button className="mini-btn">Ouvrir</button>
                  </div>
                ))}
              </div>
            </div>

            {/* MESSAGES */}
            <div className="card">
              <div className="card-header">
                <h2>Messages récents</h2>
                <button className="link-btn">Boîte de réception</button>
              </div>
              <div className="message-list">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item ${msg.unread ? "message-unread" : ""
                      }`}
                  >
                    <div className="message-avatar">
                      {msg.from
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </div>
                    <div className="message-content">
                      <div className="message-top">
                        <span className="message-from">{msg.from}</span>
                        <span className="message-time">{msg.time}</span>
                      </div>
                      <p className="message-preview">{msg.preview}</p>
                      {msg.unread && <span className="badge">Nouveau</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DISPONIBILITÉS */}
            <div className="card">
              <div className="card-header">
                <h2>Horaires & lieu</h2>
              </div>
              <p className="info-line">
                <span>Lieu principal :</span> {teacher.location}
              </p>
              <p className="info-line">
                <span>Heures de réception :</span> {teacher.officeHours}
              </p>
              <p className="info-note">
                Les étudiants peuvent réserver un créneau de rendez-vous pendant
                ces horaires via le calendrier de l&apos;app.
              </p>
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
          max-width: 1150px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          align-items: center;
          flex-wrap: wrap;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.3rem;
        }

        .badge-role {
          margin: 0 0 4px;
          font-size: 0.75rem;
          color: #a5b4fc;
        }

        h1 {
          margin: 0;
          font-size: 1.8rem;
        }

        .muted {
          margin: 2px 0 0;
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .contact-block {
          text-align: right;
          font-size: 0.8rem;
          color: #e5e7eb;
        }

        .contact-line {
          margin: 0;
        }

        .contact-line span {
          color: #9ca3af;
        }

        .header-actions {
          display: flex;
          gap: 8px;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: #020617;
          border-radius: 16px;
          padding: 12px 14px;
          border: 1px solid #1f2937;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
        }

        .stat-label {
          margin: 0 0 4px;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .stat-value {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .stat-unit {
          font-size: 0.9rem;
          margin-left: 3px;
          color: #9ca3af;
        }

        .stat-helper {
          margin: 4px 0 0;
          font-size: 0.78rem;
          color: #6b7280;
        }

        .stat-bar {
          margin-top: 8px;
          height: 6px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #1f2937;
          overflow: hidden;
        }

        .stat-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.2fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        @media (max-width: 980px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .header {
            align-items: flex-start;
          }

          .header-right {
            align-items: flex-start;
            text-align: left;
          }

          .contact-block {
            text-align: left;
          }

          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: #020617;
          border-radius: 16px;
          padding: 16px 16px 18px;
          border: 1px solid #1f2937;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
        }

        .card h2 {
          margin: 0 0 12px;
          font-size: 1.1rem;
        }

        .card h3 {
          margin: 14px 0 8px;
          font-size: 0.98rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .field label {
          margin-bottom: 4px;
          color: #9ca3af;
        }

        .field-group {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        @media (max-width: 800px) {
          .field-group {
            grid-template-columns: 1fr;
          }
        }

        input[type="text"],
        input[type="email"],
        select,
        textarea {
          background: #020617;
          border-radius: 10px;
          border: 1px solid #1f2937;
          padding: 8px 10px;
          color: #e5e7eb;
          outline: none;
          font-size: 0.9rem;
        }

        textarea {
          resize: vertical;
        }

        input:disabled,
        select:disabled,
        textarea:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .field.inline {
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        .field.inline label {
          margin-bottom: 0;
        }

        .hint {
          margin: 3px 0 0;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .edit-footer {
          margin-top: 12px;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .side-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .card-header h2 {
          margin: 0;
          font-size: 1.05rem;
        }

        .link-btn {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          font-size: 0.8rem;
          color: #60a5fa;
          cursor: pointer;
        }

        .course-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .course-item {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          background: #020617;
          border: 1px solid #111827;
        }

        .course-title {
          margin: 0 0 3px;
          font-size: 0.95rem;
        }

        .course-sub {
          margin: 0;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .course-next {
          margin: 3px 0 0;
          font-size: 0.78rem;
          color: #60a5fa;
        }

        .mini-btn {
          border-radius: 999px;
          padding: 4px 10px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.75rem;
          height: fit-content;
          cursor: pointer;
        }

        .message-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .message-item {
          display: flex;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 12px;
          background: #020617;
          border: 1px solid #111827;
          position: relative;
        }

        .message-unread {
          border-color: #2563eb;
          background: radial-gradient(circle at top left, #1d4ed81a, #020617);
        }

        .message-avatar {
          min-width: 32px;
          height: 32px;
          border-radius: 999px;
          background: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .message-content {
          flex: 1;
        }

        .message-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
        }

        .message-from {
          font-weight: 500;
        }

        .message-time {
          color: #6b7280;
        }

        .message-preview {
          margin: 3px 0 0;
          font-size: 0.8rem;
          color: #e5e7eb;
        }

        .badge {
          position: absolute;
          top: 4px;
          right: 6px;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 999px;
          background: #22c55e33;
          color: #4ade80;
          border: 1px solid #16a34a;
        }

        .info-line {
          margin: 4px 0;
          font-size: 0.85rem;
        }

        .info-line span {
          color: #9ca3af;
        }

        .info-note {
          margin-top: 8px;
          font-size: 0.78rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}

import { useMemo } from "react";
import { Button } from '@mui/material';
import { ClassSchool } from '@/classes/ClassSchool';
import { ClassRoom } from '@/classes/ClassRoom';
import { ClassComputer } from '@/classes/ClassDevice';

const USERS_MOCK = [
  {
    id: "u1",
    firstName: "Daniel",
    lastName: "Mbengui",
    username: "daniel.mb",
    role: "student",
    type: "Étudiant",
    email: "daniel@example.com",
    schoolEmail: "daniel@dandela-academy.com",
    avatarUrl: "",
    status: "online", // online | offline | away
    mainGroup: "Cohorte 2025",
    language: "Français",
  },
  {
    id: "u2",
    firstName: "Ana",
    lastName: "Silva",
    username: "ana.silva",
    role: "teacher",
    type: "Professeure",
    email: "ana.silva@example.com",
    schoolEmail: "ana.silva@dandela-academy.com",
    avatarUrl: "",
    status: "online",
    mainGroup: "Formateurs bureautique",
    language: "Portugais",
  },
  {
    id: "u3",
    firstName: "João",
    lastName: "Pereira",
    username: "joao.p",
    role: "teacher",
    type: "Professeur IA",
    email: "joao.p@example.com",
    schoolEmail: "joao.p@dandela-academy.com",
    avatarUrl: "",
    status: "away",
    mainGroup: "Formateurs IA",
    language: "Portugais",
  },
  {
    id: "u4",
    firstName: "Marie",
    lastName: "Dupont",
    username: "marie.d",
    role: "admin",
    type: "Admin pédagogique",
    email: "marie.d@example.com",
    schoolEmail: "marie.d@dandela-academy.com",
    avatarUrl: "",
    status: "online",
    mainGroup: "Administration",
    language: "Français",
  },
  {
    id: "u5",
    firstName: "Alex",
    lastName: "Ngombo",
    username: "alex.ng",
    role: "super_admin",
    type: "Direction",
    email: "alex.ng@example.com",
    schoolEmail: "alex.ng@dandela-academy.com",
    avatarUrl: "",
    status: "online",
    mainGroup: "Direction",
    language: "Français",
  },
  {
    id: "u6",
    firstName: "Inès",
    lastName: "Costa",
    username: "ines.c",
    role: "intern",
    type: "Stagiaire",
    email: "ines.c@example.com",
    schoolEmail: "ines.c@dandela-academy.com",
    avatarUrl: "",
    status: "offline",
    mainGroup: "Support",
    language: "Anglais",
  },
  // tu peux en rajouter facilement
];

const ROLE_CONFIG = {
  student: { label: "Étudiant", color: "#22c55e" },
  teacher: { label: "Professeur", color: "#3b82f6" },
  admin: { label: "Admin", color: "#f97316" },
  super_admin: { label: "Super-Admin", color: "#a855f7" },
  intern: { label: "Stagiaire", color: "#e5e7eb" },
};

const STATUS_CONFIG_1 = {
  online: { label: "En ligne", color: "#22c55e" },
  offline: { label: "Hors ligne", color: "#6b7280" },
  away: { label: "Absent", color: "#eab308" },
};

function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const filteredUsers = useMemo(() => {
    let list = [...USERS_MOCK];

    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }

    if (statusFilter !== "all") {
      list = list.filter((u) => u.status === statusFilter);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((u) => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        return (
          fullName.includes(s) ||
          u.username.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          u.schoolEmail.toLowerCase().includes(s)
        );
      });
    }

    if (sortBy === "name") {
      list.sort((a, b) =>
        `${a.lastName} ${a.firstName}`.localeCompare(
          `${b.lastName} ${b.firstName}`
        )
      );
    } else if (sortBy === "role") {
      list.sort((a, b) => a.role.localeCompare(b.role));
    }

    return list;
  }, [search, roleFilter, statusFilter, sortBy]);

  return (
    <div className="page">
      <main className="container">
        {/* HEADER */}
        <header className="header">
          <div>
            <p className="breadcrumb">Dashboard / Utilisateurs</p>
            <h1>Liste des utilisateurs</h1>
            <p className="muted">
              Gère tous les profils : étudiants, professeurs, admins, super-admins
              et stagiaires.
            </p>
          </div>

          <div className="header-actions">
            <button className="btn ghost">Exporter (.csv)</button>
            <button className="btn primary">Ajouter un utilisateur</button>
          </div>
        </header>

        {/* BARRE DE FILTRES */}
        <section className="toolbar">
          <div className="search-block">
            <input
              type="text"
              placeholder="Rechercher par nom, email, username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filters">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tous les rôles</option>
              <option value="student">Étudiants</option>
              <option value="teacher">Professeurs</option>
              <option value="admin">Admins</option>
              <option value="super_admin">Super-Admins</option>
              <option value="intern">Stagiaires</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="online">En ligne</option>
              <option value="away">Absent</option>
              <option value="offline">Hors ligne</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Trier par nom</option>
              <option value="role">Trier par rôle</option>
            </select>
          </div>
        </section>

        {/* TABLE / LISTE */}
        <section className="card">
          <div className="table-header">
            <span className="th th-user">Utilisateur</span>
            <span className="th th-username">Username</span>
            <span className="th th-role">Rôle</span>
            <span className="th th-email">Email</span>
            <span className="th th-status">Statut</span>
            <span className="th th-group">Groupe / Langue</span>
            <span className="th th-actions">Actions</span>
          </div>

          <div className="table-body">
            {filteredUsers.length === 0 && (
              <div className="empty-state">
                Aucun utilisateur ne correspond à ces critères.
              </div>
            )}

            {filteredUsers.map((user) => (
              <UserRow key={user.id} user={user} />
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
          font-size: 0.85rem;
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
            minmax(0, 1.5fr)
            minmax(0, 1.5fr)
            minmax(0, 2.3fr)
            minmax(0, 1.4fr)
            minmax(0, 2.2fr)
            minmax(0, 1.5fr);
          gap: 8px;
          padding: 8px 16px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #6b7280;
          border-bottom: 1px solid #111827;
        }

        @media (max-width: 900px) {
          .table-header {
            display: none;
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

        @media (max-width: 900px) {
          .card {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}

function UserRow({ user }) {
  const roleCfg = ROLE_CONFIG[user.role];
  const statusCfg = STATUS_CONFIG_1[user.status];

  return (
    <>
      <div className="row">
        {/* Utilisateur */}
        <div className="cell cell-user">
          <Avatar user={user} />
          <div className="user-text">
            <p className="user-name">
              {user.firstName} {user.lastName}
            </p>
            <p className="user-id">ID: {user.id}</p>
          </div>
        </div>

        {/* Username */}
        <div className="cell cell-username">
          <p className="text-main">@{user.username}</p>
          <p className="text-sub">{user.type}</p>
        </div>

        {/* Rôle */}
        <div className="cell cell-role">
          <span
            className="role-badge"
            style={{
              borderColor: roleCfg.color,
              color: roleCfg.color,
            }}
          >
            <span
              className="role-dot"
              style={{ backgroundColor: roleCfg.color }}
            />
            {roleCfg.label}
          </span>
        </div>

        {/* Email */}
        <div className="cell cell-email">
          <p className="text-main">{user.schoolEmail}</p>
          <p className="text-sub">{user.email}</p>
        </div>

        {/* Statut */}
        <div className="cell cell-status">
          <span className="status-pill">
            <span
              className="status-dot"
              style={{ backgroundColor: statusCfg.color }}
            />
            {statusCfg.label}
          </span>
        </div>

        {/* Groupe / Langue */}
        <div className="cell cell-group">
          <p className="text-main">{user.mainGroup}</p>
          <p className="text-sub">Langue : {user.language}</p>
        </div>

        {/* Actions */}
        <div className="cell cell-actions">
          <button className="mini-btn">Voir</button>
          <button className="mini-btn ghost">Éditer</button>
        </div>
      </div>

      {/* Styles spécifiques à la row */}
      <style jsx>{`
        .row {
          display: grid;
          grid-template-columns:
            minmax(0, 2.5fr)
            minmax(0, 1.5fr)
            minmax(0, 1.5fr)
            minmax(0, 2.3fr)
            minmax(0, 1.4fr)
            minmax(0, 2.2fr)
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

        .cell-user {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-text {
          min-width: 0;
        }

        .user-name {
          margin: 0;
          font-weight: 500;
        }

        .user-id {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
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

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          border: 1px solid;
          padding: 2px 8px;
          font-size: 0.75rem;
          background: #020617;
        }

        .role-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          padding: 2px 8px;
          font-size: 0.75rem;
          border: 1px solid #1f2937;
          background: #020617;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
        }

        .mini-btn {
          border-radius: 999px;
          padding: 4px 8px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.75rem;
          cursor: pointer;
          margin-right: 4px;
        }

        .mini-btn.ghost {
          background: transparent;
        }

        @media (max-width: 900px) {
          .row {
            grid-template-columns: 1fr;
            padding: 10px 10px;
            border-radius: 12px;
            margin-bottom: 8px;
            border: 1px solid #111827;
          }

          .cell-email,
          .cell-group {
            margin-top: -4px;
          }

          .cell-actions {
            display: flex;
            justify-content: flex-end;
            gap: 4px;
          }
        }
      `}</style>
    </>
  );
}

function Avatar({ user }) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  if (user.avatarUrl) {
    return (
      <>
        <div className="avatar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.avatarUrl} alt={initials} />
        </div>

        <style jsx>{`
          .avatar {
            width: 32px;
            height: 32px;
            border-radius: 999px;
            overflow: hidden;
            border: 1px solid #1f2937;
          }
          .avatar img {
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
      <div className="avatar-fallback">
        {initials}
      </div>

      <style jsx>{`
        .avatar-fallback {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default function DashboardHome() {
  const { theme } = useThemeMode();
  const { text } = theme.palette;
  const { t } = useTranslation([NS_DASHBOARD_HOME]);
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, logout } = useAuth();
  //static async create(data = {})
  const [processing, setProcessing] = useState(false);


  return (<DashboardPageWrapper title={t('title')} subtitle={t('subtitle')} icon={<IconDashboard width={22} height={22} />}>
    En construction...
    <Button
      loading={processing}
      onClick={async () => {
        setProcessing(true);
        const school = await ClassSchool.create({
          //uid: "",
          //uid_intern: '',
          name: "Dandela Academy Zango III",
          name_normalized: "Dandela Academy Zango III",
          photo_url: "",
          address: "Zango III, Luanda, Angola",
          enabled: true
        });
        const room_admin = await ClassRoom.create({
          // uid : "",
          //uid_intern : "",
          uid_school: school.uid,
          name: "Admin room",
          name_normalized: "admin_room",
          //photo_url:"",
          os:ClassComputer.OPERATING_SYSTEM.MACOS,
          floor: 1,
          enabled: true
        });
        const room = await ClassRoom.create({
          // uid : "",
          //uid_intern : "",
          uid_school: school.uid,
          name: "Root room",
          name_normalized: "root_room",
          //photo_url:"",
          floor: 1,
          enabled: true
        });
        for (let i = 0; i < 2; i++) {
          //const countComputers = await ClassComputer.count() || 0;
          const computerClass = new ClassComputer({
            //uid: "",
            //uid_intern: "1",
            uid_room: room_admin.uid,
            brand:'iMac 2017',
            //name: `PC-${sizeId.toString().padStart(2, '0')}`,
            //name_normalized: `pc-${sizeId.toString().padStart(2, '0')}`,
            enabled: true,
            status: ClassComputer.STATUS.AVAILABLE,
            type: ClassComputer.TYPE.DESKTOP,
            os:ClassComputer.OPERATING_SYSTEM.MACOS,
            os_version:"13.7.8",
            buy_time:new Date(2023, 7, 12),
            updates: [
              { status: 'created', description: 'created_description', created_time: new Date() }
            ],
          });
          const computer = await ClassComputer.create(computerClass);
        }
        for (let i = 0; i < 25; i++) {
          //const countComputers = await ClassComputer.count() || 0;
          const computerClass = new ClassComputer({
            //uid: "",
            //uid_intern: "1",
            uid_room: room.uid,
            brand:'HP i7',
            //name: `PC-${sizeId.toString().padStart(2, '0')}`,
            //name_normalized: `pc-${sizeId.toString().padStart(2, '0')}`,
            enabled: true,
            status: ClassComputer.STATUS.AVAILABLE,
            type: ClassComputer.TYPE.DESKTOP,
            os:ClassComputer.OPERATING_SYSTEM.WINDOWS,
            os_version:"10",
            buy_time:new Date(2023, 10, 12),
            updates: [
              { status: 'created', description: 'created_description', created_time: new Date() }
            ],
          });
          const computer = await ClassComputer.create(computerClass);
        }
        
        //await ClassComputer.create(computer);
        setProcessing(false);
      }}
    >
      {'Create computer'}
    </Button>
    <UsersPage />
  </DashboardPageWrapper>)
  /*
  return (
    <LoginPageWrapper>
            <Typography>
              Se connecter
            </Typography>
            <Stack spacing={1}>
              <TextFieldComponent
                //label='email'
                name='email'
                icon={<IconEmail width={20} />}
                placeholder='adress'
                value={email}
                onChange={(e) => {
                  e.preventDefault();
                  setEmail(e.target.value);
                }}
                onClear={() => {
                  setEmail('');
                }}

              />
              <TextFieldPasswordComponent
                //label='email'
                name='password'
                placeholder='password'
                value={password}
                onChange={(e) => {
                  e.preventDefault();
                  setPassword(e.target.value);
                }}
                onClear={() => {
                  setPassword('');
                }}

              />
            </Stack>
            <ButtonNextComponent 
            label='Se connecter'
            onClick={()=>{
              login(email, password);
            }}
            />
    </LoginPageWrapper>
  );
  */
}
