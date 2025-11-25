"use client";
import React, { useEffect, useState } from 'react';
import { IconDashboard, } from "@/assets/icons/IconsComponent";
import { WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_DASHBOARD_HOME, } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import { ClassColor } from '@/classes/ClassColor';
import { Stack } from '@mui/material';
import { ClassComputer } from '@/classes/ClassComputer';
import { orderBy } from 'firebase/firestore';

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
  busy: {
    label: "Occupé",
    badgeBg: "#111827",
    badgeBorder: "#3b82f6",
    badgeText: "#bfdbfe",
    glow: "#3b82f655",
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
  reparation: {
    label: "Réparation",
    badgeBg: "#111827",
    badgeBorder: "rgb(255,0,0)",
    badgeText: "rgba(253, 214, 214, 1)",
    glow: "rgba(255,0,0,0.3)",
  },
  offline: {
    label: "Hors service",
    badgeBg: "#111827",
    badgeBorder: "#6b7280",
    badgeText: "#e5e7eb",
    glow: "#6b728055",
  },
  hs: {
    label: "Hors service",
    badgeBg: "#111827",
    badgeBorder: "#6b7280",
    badgeText: "#e5e7eb",
    glow: "#6b728055",
  },
};
/** Composants réutilisables **/

function LegendItem({ value = 0, status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="legend-item">
      <span className="legend-dot" />
      <span className="legend-label">{cfg.label} ({value})</span>

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
          border: 1px solid ${ClassColor.GREY_LIGHT};
          background: transparent;
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
      <p className="pc-id">#{computer?.id?.toString().padStart(2, "0") || computer.uid_intern || ''}</p>

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
          box-shadow: ${"0 10px 25px rgba(0,0,0,0.5)"};
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

export default function ComputersComponent() {
  const [computers] = useState(initialComputers);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const [allComputers, setAllComputers] = useState([]);
  useEffect(() => {
    async function initComputers() {
      const _computers = await ClassComputer.fetchListFromFirestore([
        //where("school_uid", "==", schoolUid),
        orderBy("uid_intern"),
        //limit(25),
      ]);
      setAllComputers(_computers.sort((a, b) => a.uid_intern - b.uid_intern));
    }
    initComputers();
  }, [])

  const filteredComputers =
    filter === "all"
      ? computers
      : computers.filter((pc) => pc.status === filter);

  const handleCardClick = (pc) => {
    setSelected(pc);
  };

  return (
    <div className="page" style={{ background: '' }}>
      <main className="container" style={{ background: '' }}>
        {/* HEADER */}
        <header className="header" style={{display:'none'}}>
          <div>
            <h1>État des ordinateurs</h1>
            <p className="muted">
              Vue d&apos;ensemble des 25 postes de travail sur le site, avec
              leur disponibilité en temps réel.
            </p>
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
        </section>

        {/* GRID + PANEL */}
        <section className="layout">
          {/* GRID DES ORDIS */}

          <Stack
            spacing={1}
            sx={{
              background: '#020617',
              borderRadius: '16px',
              border: '1px solid #1f2937',
              padding: '12px',
              boxShadow: '0 18px 45px rgba(0, 0, 0, 0.4)',
            }}>
            <Stack spacing={1} direction={'row'} sx={{ background: '' }} className='legend'>
              <LegendItem status="available" value={computers.filter((c) => c.status === "available").length} />
              <LegendItem status="in_use" value={computers.filter((c) => c.status === "in_use").length} />
              <LegendItem status="maintenance" value={computers.filter((c) => c.status === "maintenance").length} />
              <LegendItem status="offline" value={computers.filter((c) => c.status === "available").length} />
            </Stack>
            <div className="grid">
              {allComputers.map((pc, i) => (
                <ComputerCard
                  key={`${pc.uid}-${i}`}
                  computer={pc}
                  isSelected={selected?.id === pc.id}
                  onClick={() => handleCardClick(pc)}
                />
              ))}
              {filteredComputers.map((pc, i) => (
                <ComputerCard
                  key={pc.id}
                  computer={pc}
                  isSelected={selected?.id === pc.id}
                  onClick={() => handleCardClick(pc)}
                />
              ))}
            </div>
          </Stack>

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
          padding: 0px;
          color: #e5e7eb;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          min-height: 100vh;
          height: 100%;
          padding: 0px;
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
          color:var(--font-color);
        }

        .muted {
          margin: 0;
          font-size: 0.9rem;
          color: ${ClassColor.GREY_LIGHT};
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
          flex-direction: column;
          justify-content: center;
          align-items: start;
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
          border: 1px solid var(--primary);
          background: var(--card-color);
          color: var(--primary);
          font-size: 0.78rem;
          cursor: pointer;
        }

        .chip-active {
          background: var(--primary);
          border-color: var(--primary);
          border: 1px solid var(--primary);
          color: var(--background);
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