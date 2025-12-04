"use client"
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { useState } from "react";

const mockStats = {
  activeStudents: 124,
  activeTeachers: 8,
  todayLessons: 5,
  freeComputers: 17,
  completionRate: 82,
  certificatesThisMonth: 21,
};

const mockNextLessons = [
  {
    id: 1,
    title: "Excel – Niveau Intermédiaire",
    teacher: "Ana Silva",
    time: "Aujourd'hui • 14:00",
    room: "Salle 3",
    enrolled: 18,
    capacity: 22,
  },
  {
    id: 2,
    title: "Initiation à l’IA générative",
    teacher: "João Pereira",
    time: "Aujourd'hui • 16:30",
    room: "Salle 2",
    enrolled: 14,
    capacity: 20,
  },
  {
    id: 3,
    title: "Word – Mise en page avancée",
    teacher: "Marie Dupont",
    time: "Demain • 09:00",
    room: "Salle 1",
    enrolled: 20,
    capacity: 20,
  },
];

const mockMessages = [
  {
    id: 1,
    from: "Support Dandela Academy",
    time: "Il y a 1 h",
    preview: "Un nouveau cours IA a été publié dans le catalogue.",
    type: "info",
  },
  {
    id: 2,
    from: "Système",
    time: "Hier",
    preview: "3 nouveaux étudiants ont rejoint la cohorte 2025.",
    type: "success",
  },
  {
    id: 3,
    from: "Infra",
    time: "Il y a 2 jours",
    preview: "1 ordinateur signalé en maintenance dans la salle principale.",
    type: "warning",
  },
];

export default function DandelaDashboardHome() {
  const [activeMenu, setActiveMenu] = useState("accueil");

  const handleMenuClick = (key) => {
    // Ici tu peux remplacer par un vrai route.push('/app/...') plus tard
    setActiveMenu(key);
  };

  return (
<DashboardPageWrapper>
<div className="page">
      <div className="shell">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="brand">
            <div className="logo-circle">DA</div>
            <div>
              <p className="brand-name">Dandela Academy</p>
              <p className="brand-sub">Tableau de bord</p>
            </div>
          </div>

          <div className="topbar-right">
            <button className="notif-btn">🔔</button>
            <div className="user-pill">
              <div className="user-avatar">DM</div>
              <div className="user-text">
                <p className="user-name">Daniel</p>
                <p className="user-role">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* LAYOUT AVEC SIDEBAR */}
        <div className="layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <nav className="nav">
              <NavItem
                label="Accueil"
                icon="🏠"
                active={activeMenu === "accueil"}
                onClick={() => handleMenuClick("accueil")}
              />
              <NavItem
                label="Ordinateurs"
                icon="💻"
                active={activeMenu === "ordinateurs"}
                onClick={() => handleMenuClick("ordinateurs")}
              />
              <NavItem
                label="Utilisateurs"
                icon="👥"
                active={activeMenu === "utilisateurs"}
                onClick={() => handleMenuClick("utilisateurs")}
              />
              <NavItem
                label="Calendrier"
                icon="📅"
                active={activeMenu === "calendrier"}
                onClick={() => handleMenuClick("calendrier")}
              />
              <NavItem
                label="Cours"
                icon="📚"
                active={activeMenu === "cours"}
                onClick={() => handleMenuClick("cours")}
              />
              <NavItem
                label="Profil"
                icon="🙋‍♂️"
                active={activeMenu === "profil"}
                onClick={() => handleMenuClick("profil")}
              />
              <NavItem
                label="Paramètres"
                icon="⚙️"
                active={activeMenu === "parametres"}
                onClick={() => handleMenuClick("parametres")}
              />
            </nav>

            <div className="sidebar-footer">
              <p className="sidebar-hint">
                Version <span>v1.0.0</span>
              </p>
            </div>
          </aside>

          {/* CONTENU PRINCIPAL */}
          <main className="content">
            {/* HEADER SECTION */}
            <section className="content-header">
              <div>
                <p className="welcome-text">Bienvenue sur ton dashboard 👋</p>
                <h1>Accueil</h1>
                <p className="muted">
                  Accède rapidement aux ordinateurs, utilisateurs, cours et
                  calendrier de Dandela Academy.
                </p>
              </div>
              <div className="header-actions">
                <button className="btn ghost">Nouvel étudiant</button>
                <button className="btn primary">Créer un cours</button>
              </div>
            </section>

            {/* STATS */}
            <section className="stats-grid">
              <StatCard
                label="Étudiants actifs"
                value={mockStats.activeStudents}
                helper="Connectés / inscrits récemment"
              />
              <StatCard
                label="Professeurs actifs"
                value={mockStats.activeTeachers}
                helper="Sessions à venir"
              />
              <StatCard
                label="Cours aujourd'hui"
                value={mockStats.todayLessons}
                helper="Sur l’ensemble du campus"
              />
              <StatCard
                label="Ordinateurs disponibles"
                value={mockStats.freeComputers}
                helper="Salle informatique principale"
              />
              <StatCard
                label="Taux de complétion"
                value={`${mockStats.completionRate}%`}
                helper="Moyenne globale des cours"
                barValue={mockStats.completionRate}
              />
              <StatCard
                label="Certificats ce mois"
                value={mockStats.certificatesThisMonth}
                helper="Diplômes délivrés"
              />
            </section>

            {/* GRILLE PRINCIPALE */}
            <section className="main-grid">
              {/* COL GAUCHE : cours à venir + raccourcis */}
              <div className="main-col">
                <div className="card">
                  <div className="card-header">
                    <h2>Cours à venir</h2>
                    <button className="link-btn">Voir le calendrier</button>
                  </div>
                  <div className="lesson-list">
                    {mockNextLessons.map((lesson) => (
                      <div key={lesson.id} className="lesson-item">
                        <div>
                          <p className="lesson-title">{lesson.title}</p>
                          <p className="lesson-sub">
                            {lesson.teacher} • {lesson.room}
                          </p>
                          <p className="lesson-time">{lesson.time}</p>
                        </div>
                        <div className="lesson-meta">
                          <p className="lesson-counter">
                            {lesson.enrolled}/{lesson.capacity}
                          </p>
                          <p className="lesson-counter-sub">inscrits</p>
                          <button className="mini-btn">Ouvrir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2>Accès rapide</h2>
                  </div>
                  <div className="quick-links">
                    <QuickLink
                      label="Gérer les ordinateurs"
                      description="Voir l’état des 25 postes de travail."
                      emoji="💻"
                    />
                    <QuickLink
                      label="Liste des utilisateurs"
                      description="Étudiants, professeurs, admins."
                      emoji="👥"
                    />
                    <QuickLink
                      label="Créer un nouveau cours"
                      description="Ajouter un module au catalogue."
                      emoji="📘"
                    />
                    <QuickLink
                      label="Consulter le calendrier"
                      description="Vue globale des sessions."
                      emoji="📅"
                    />
                  </div>
                </div>
              </div>

              {/* COL DROITE : messages + résumé système */}
              <div className="side-col">
                <div className="card">
                  <div className="card-header">
                    <h2>Activité récente</h2>
                    <button className="link-btn">Tout voir</button>
                  </div>
                  <div className="message-list">
                    {mockMessages.map((msg) => (
                      <DashboardMessage key={msg.id} msg={msg} />
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2>Vue système</h2>
                  </div>
                  <ul className="system-list">
                    <li>
                      <span>Utilisateurs totaux :</span> 178 (mock)
                    </li>
                    <li>
                      <span>Cours actifs :</span> 14 (mock)
                    </li>
                    <li>
                      <span>Ordinateurs :</span> 25 (mock)
                    </li>
                    <li>
                      <span>Dernière sauvegarde :</span> Aujourd&apos;hui •
                      03:15
                    </li>
                  </ul>
                  <p className="system-note">
                    Ces données sont fictives. Tu pourras les remplacer par les
                    vraies valeurs venant de Firestore / API.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: radial-gradient(circle at top, #111827, #020617 55%);
          padding: 32px 12px;
          color: #e5e7eb;
          display: flex;
          justify-content: center;
        }

        .shell {
          width: 100%;
          max-width: 1280px;
          border-radius: 24px;
          border: 1px solid #1f2937;
          background: #020617;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.65);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          height: 60px;
          padding: 0 18px;
          border-bottom: 1px solid #111827;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(90deg, #020617, #020617 40%, #0b1120);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-circle {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .brand-name {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .brand-sub {
          margin: 0;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .notif-btn {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          border: 1px solid #1f2937;
          background: #020617;
          cursor: pointer;
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 4px 8px;
          background: #020617;
          border: 1px solid #1f2937;
        }

        .user-avatar {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .user-text {
          font-size: 0.75rem;
        }

        .user-name {
          margin: 0;
        }

        .user-role {
          margin: 0;
          color: #9ca3af;
        }

        .layout {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          min-height: 520px;
        }

        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }

        .sidebar {
          border-right: 1px solid #111827;
          padding: 14px 10px 10px;
          background: radial-gradient(circle at top, #020617, #020617 55%);
        }

        @media (max-width: 900px) {
          .sidebar {
            display: none;
          }
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-footer {
          margin-top: 18px;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .sidebar-hint span {
          color: #e5e7eb;
        }

        .content {
          padding: 18px 18px 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .welcome-text {
          margin: 0 0 4px;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        h1 {
          margin: 0;
          font-size: 1.7rem;
        }

        .muted {
          margin: 4px 0 0;
          font-size: 0.9rem;
          color: #9ca3af;
          max-width: 500px;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.2fr);
          gap: 14px;
          margin-top: 4px;
        }

        @media (max-width: 980px) {
          .main-grid {
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
          border: 1px solid #1f2937;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
          padding: 14px 14px 16px;
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

        .lesson-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .lesson-item {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          border: 1px solid #111827;
          background: #020617;
        }

        .lesson-title {
          margin: 0 0 3px;
          font-size: 0.95rem;
        }

        .lesson-sub {
          margin: 0;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .lesson-time {
          margin: 4px 0 0;
          font-size: 0.78rem;
          color: #60a5fa;
        }

        .lesson-meta {
          min-width: 90px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          gap: 2px;
        }

        .lesson-counter {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .lesson-counter-sub {
          margin: 0;
          font-size: 0.75rem;
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

        .quick-links {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        @media (max-width: 700px) {
          .quick-links {
            grid-template-columns: 1fr;
          }
        }

        .message-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .system-list {
          list-style: none;
          padding: 0;
          margin: 0 0 8px;
          font-size: 0.85rem;
        }

        .system-list li {
          margin-bottom: 4px;
        }

        .system-list span {
          color: #9ca3af;
        }

        .system-note {
          margin: 4px 0 0;
          font-size: 0.78rem;
          color: #6b7280;
        }
      `}</style>
    </div>
</DashboardPageWrapper>
  );
}

/** Nav item dans la sidebar */
function NavItem({ label, icon, active, onClick }) {
  return (
    <>
      <button
        type="button"
        className={`nav-item ${active ? "nav-item-active" : ""}`}
        onClick={onClick}
      >
        <span className="nav-icon">{icon}</span>
        <span className="nav-label">{label}</span>
      </button>

      <style jsx>{`
        .nav-item {
          width: 100%;
          border-radius: 999px;
          padding: 6px 10px;
          border: 1px solid transparent;
          background: transparent;
          color: #9ca3af;
          font-size: 0.88rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          text-align: left;
        }

        .nav-item-active {
          background: linear-gradient(135deg, #1f2937, #111827);
          border-color: #2563eb;
          color: #e5e7eb;
        }

        .nav-icon {
          font-size: 1rem;
        }

        .nav-label {
          flex: 1;
        }
      `}</style>
    </>
  );
}

/** Carte de stats */
function StatCard({ label, value, helper, barValue }) {
  return (
    <>
      <div className="stat-card">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {helper && <p className="stat-helper">{helper}</p>}
        {typeof barValue === "number" && (
          <div className="stat-bar">
            <div
              className="stat-bar-fill"
              style={{ width: `${barValue}%` }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .stat-card {
          background: #020617;
          border-radius: 14px;
          border: 1px solid #1f2937;
          padding: 10px 12px;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
        }

        .stat-label {
          margin: 0 0 4px;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .stat-value {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 600;
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
      `}</style>
    </>
  );
}

/** Carte “accès rapide” */
function QuickLink({ emoji, label, description }) {
  return (
    <>
      <button type="button" className="quick-link">
        <div className="q-emoji">{emoji}</div>
        <div className="q-text">
          <p className="q-label">{label}</p>
          <p className="q-desc">{description}</p>
        </div>
      </button>

      <style jsx>{`
        .quick-link {
          border-radius: 12px;
          border: 1px solid #111827;
          background: #020617;
          padding: 8px 10px;
          display: flex;
          gap: 8px;
          cursor: pointer;
          text-align: left;
        }

        .quick-link:hover {
          background: radial-gradient(circle at top left, #1d4ed822, #020617);
          border-color: #1f2937;
        }

        .q-emoji {
          font-size: 1.2rem;
        }

        .q-text {
          font-size: 0.85rem;
        }

        .q-label {
          margin: 0 0 2px;
          font-weight: 500;
        }

        .q-desc {
          margin: 0;
          font-size: 0.78rem;
          color: #9ca3af;
        }
      `}</style>
    </>
  );
}

/** Messages dans le panneau “Activité récente” */
function DashboardMessage({ msg }) {
  const typeConfig = {
    info: { border: "#3b82f6", emoji: "ℹ️" },
    success: { border: "#22c55e", emoji: "✅" },
    warning: { border: "#f97316", emoji: "⚠️" },
  }[msg.type || "info"];

  return (
    <>
      <div className="dash-msg">
        <div className="dash-emoji">{typeConfig.emoji}</div>
        <div className="dash-body">
          <div className="dash-header">
            <span className="dash-from">{msg.from}</span>
            <span className="dash-time">{msg.time}</span>
          </div>
          <p className="dash-preview">{msg.preview}</p>
        </div>
      </div>

      <style jsx>{`
        .dash-msg {
          display: flex;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 12px;
          border: 1px solid ${typeConfig.border}33;
          background: #020617;
        }

        .dash-emoji {
          font-size: 1.1rem;
        }

        .dash-body {
          flex: 1;
          font-size: 0.82rem;
        }

        .dash-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .dash-from {
          font-weight: 500;
        }

        .dash-time {
          color: #6b7280;
        }

        .dash-preview {
          margin: 3px 0 0;
          color: #e5e7eb;
        }
      `}</style>
    </>
  );
}
