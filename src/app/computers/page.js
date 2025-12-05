"use client";
import React, { useState } from 'react';
import { IconDashboard, } from "@/assets/icons/IconsComponent";
import { WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_DASHBOARD_COMPUTERS, NS_DASHBOARD_HOME, } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import ComputersComponent from '@/components/dashboard/computers/ComputersComponent';
import { SchoolProvider, useSchool } from '@/contexts/SchoolProvider';
import { RoomProvider } from '@/contexts/RoomProvider';

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

// Mock cours initial
const initialCourse = {
  id: "course_1",
  title: "Excel – Niveau Intermédiaire",
  code: "EXCEL-102",
  description:
    "Approfondis les fonctions essentielles d’Excel : formules, tableaux, graphiques, mises en forme conditionnelles, et introduction à l’automatisation.",
  teacher: {
    id: "teacher_1",
    name: "Ana Silva",
    email: "ana.silva@dandela-academy.com",
  },
  schedule: {
    day: "Mardi & Jeudi",
    time: "18:00 – 20:00",
    location: "Salle 3 • Campus central",
  },
  meta: {
    level: "Intermédiaire",
    language: "Français",
    category: "Bureautique",
  },
  capacity: 20,
  enrolledCount: 12,
  isUserEnrolled: false,
};

function CoursePage() {
  // Simule si l'utilisateur est le prof du cours
  const isTeacherOfCourse = mockUser.role === "teacher"; // à adapter avec ton vrai contexte

  const [course, setCourse] = useState(initialCourse);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialCourse);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Gestion de quelques champs imbriqués (meta.* / schedule.*)
    if (name.startsWith("meta.")) {
      const key = name.split(".")[1];
      setDraft((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [key]: value,
        },
      }));
    } else if (name.startsWith("schedule.")) {
      const key = name.split(".")[1];
      setDraft((prev) => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [key]: value,
        },
      }));
    } else if (name.startsWith("teacher.")) {
      const key = name.split(".")[1];
      setDraft((prev) => ({
        ...prev,
        teacher: {
          ...prev.teacher,
          [key]: value,
        },
      }));
    } else {
      setDraft((prev) => ({
        ...prev,
        [name]: name === "capacity" ? Number(value) : value,
      }));
    }
  };

  const handleEdit = () => {
    setDraft(course);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraft(course);
    setIsEditing(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setCourse(draft);
    setIsEditing(false);

    // Ici tu pourrais appeler ton API pour sauvegarder
    // await fetch(`/api/courses/${course.id}`, { method: "PUT", body: JSON.stringify(draft) });
    console.log("Cours mis à jour :", draft);
  };

  const handleToggleEnrollment = async () => {
    setLoadingAction(true);

    // Simule appel API
    setTimeout(() => {
      setCourse((prev) => {
        const isCurrentlyEnrolled = prev.isUserEnrolled;
        const delta = isCurrentlyEnrolled ? -1 : 1;

        const updated = {
          ...prev,
          isUserEnrolled: !isCurrentlyEnrolled,
          enrolledCount: Math.max(prev.enrolledCount + delta, 0),
        };

        // Ici tu pourrais appeler ton API
        // await fetch(`/api/courses/${prev.id}/enroll`, { method: isCurrentlyEnrolled ? "DELETE" : "POST" });

        console.log(
          isCurrentlyEnrolled ? "Désinscription effectuée" : "Inscription effectuée",
          updated
        );
        return updated;
      });

      setLoadingAction(false);
    }, 400);
  };

  const remainingSeats = Math.max(course.capacity - course.enrolledCount, 0);
  const isFull = remainingSeats <= 0;

  return (
    <div className="page">
      <main className="container">
        {/* HEADER */}
        <header className="header">
          <div>
            <p className="breadcrumb">Dashboard / Cours / {course.code}</p>
            <h1>{course.title}</h1>
            <p className="muted">
              Code : {course.code} • Niveau : {course.meta.level} • {course.meta.language}
            </p>
          </div>

          <div className="header-actions">
            {/* Bouton inscription/désinscription pour les étudiants */}
            {mockUser.role === "student" && (
              <button
                className={`btn ${course.isUserEnrolled ? "btn-secondary" : "primary"}`}
                onClick={handleToggleEnrollment}
                disabled={loadingAction || (isFull && !course.isUserEnrolled)}
              >
                {loadingAction
                  ? "Chargement..."
                  : course.isUserEnrolled
                    ? "Me désinscrire"
                    : isFull
                      ? "Cours complet"
                      : "M'inscrire à ce cours"}
              </button>
            )}

            {/* Boutons pour le prof du cours */}
            {isTeacherOfCourse && !isEditing && (
              <button className="btn" onClick={handleEdit}>
                Modifier le cours
              </button>
            )}
            {isTeacherOfCourse && isEditing && (
              <>
                <button className="btn ghost" onClick={handleCancelEdit}>
                  Annuler
                </button>
                <button className="btn primary" onClick={handleSaveEdit}>
                  Enregistrer
                </button>
              </>
            )}
          </div>
        </header>

        <section className="grid">
          {/* COL 1 : description + infos éditables */}
          <form className="card" onSubmit={handleSaveEdit}>
            <h2>Informations du cours</h2>

            <div className="field">
              <label>Titre</label>
              <input
                type="text"
                name="title"
                value={draft.title}
                onChange={handleChange}
                disabled={!isTeacherOfCourse || !isEditing}
              />
            </div>

            <div className="field">
              <label>Code du cours</label>
              <input
                type="text"
                name="code"
                value={draft.code}
                onChange={handleChange}
                disabled={!isTeacherOfCourse || !isEditing}
              />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                name="description"
                value={draft.description}
                onChange={handleChange}
                disabled={!isTeacherOfCourse || !isEditing}
                rows={5}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label>Niveau</label>
                <select
                  name="meta.level"
                  value={draft.meta.level}
                  onChange={handleChange}
                  disabled={!isTeacherOfCourse || !isEditing}
                >
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                </select>
              </div>

              <div className="field">
                <label>Langue</label>
                <select
                  name="meta.language"
                  value={draft.meta.language}
                  onChange={handleChange}
                  disabled={!isTeacherOfCourse || !isEditing}
                >
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Portugais">Portugais</option>
                </select>
              </div>

              <div className="field">
                <label>Catégorie</label>
                <input
                  type="text"
                  name="meta.category"
                  value={draft.meta.category}
                  onChange={handleChange}
                  disabled={!isTeacherOfCourse || !isEditing}
                />
              </div>
            </div>

            {isTeacherOfCourse && isEditing && (
              <div className="edit-footer">
                <button type="button" className="btn ghost" onClick={handleCancelEdit}>
                  Annuler
                </button>
                <button type="submit" className="btn primary">
                  Enregistrer les modifications
                </button>
              </div>
            )}
          </form>

          {/* COL 2 : infos prof, horaires, capacité, stats */}
          <div className="side-col">
            <div className="card">
              <h2>Professeur responsable</h2>
              <div className="teacher-block">
                <div className="teacher-avatar">
                  {course.teacher.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <div>
                  <p className="teacher-name">{course.teacher.name}</p>
                  <p className="teacher-email">{course.teacher.email}</p>
                </div>
              </div>

              {isTeacherOfCourse && (
                <>
                  <div className="field">
                    <label>Nom du professeur</label>
                    <input
                      type="text"
                      name="teacher.name"
                      value={draft.teacher.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="field">
                    <label>Email du professeur</label>
                    <input
                      type="email"
                      name="teacher.email"
                      value={draft.teacher.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="card">
              <h2>Horaires & lieu</h2>

              <div className="field">
                <label>Jours</label>
                <input
                  type="text"
                  name="schedule.day"
                  value={draft.schedule.day}
                  onChange={handleChange}
                  disabled={!isTeacherOfCourse || !isEditing}
                />
              </div>

              <div className="field">
                <label>Heure</label>
                <input
                  type="text"
                  name="schedule.time"
                  value={draft.schedule.time}
                  onChange={handleChange}
                  disabled={!isTeacherOfCourse || !isEditing}
                />
              </div>

              <div className="field">
                <label>Lieu</label>
                <input
                  type="text"
                  name="schedule.location"
                  value={draft.schedule.location}
                  onChange={handleChange}
                  disabled={!isTeacherOfCourse || !isEditing}
                />
              </div>
            </div>

            <div className="card">
              <h2>Participants</h2>
              <div className="capacity-row">
                <div>
                  <p className="capacity-main">
                    {course.enrolledCount} / {course.capacity} inscrits
                  </p>
                  <p className="capacity-sub">
                    {isFull ? "Cours complet" : `${remainingSeats} place(s) restante(s)`}
                  </p>
                </div>
                <div className="capacity-chip">
                  {course.isUserEnrolled ? "Tu es inscrit" : "Non inscrit"}
                </div>
              </div>

              <div className="capacity-bar">
                <div
                  className="capacity-fill"
                  style={{ width: `${(course.enrolledCount / course.capacity) * 100}%` }}
                />
              </div>

              {isTeacherOfCourse && (
                <div className="field" style={{ marginTop: 12 }}>
                  <label>Capacité maximale</label>
                  <input
                    type="number"
                    min={1}
                    name="capacity"
                    value={draft.capacity}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              )}
            </div>

            <div className="card">
              <h2>Informations utiles</h2>
              <ul className="info-list">
                <li>
                  <span>Pré-requis :</span> Bases d&apos;Excel (niveau débutant)
                </li>
                <li>
                  <span>Matériel conseillé :</span> Ordinateur portable + Excel installé
                </li>
                <li>
                  <span>Mode :</span> Présentiel / hybride possible
                </li>
                <li>
                  <span>Certificat :</span> délivré si assiduité & moyenne ≥ 60%
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
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
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

        .btn.btn-secondary {
          background: transparent;
          border-color: #f97316;
          color: #fed7aa;
        }

        .btn.ghost {
          background: transparent;
          border-color: #374151;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(0, 1.1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .header {
            flex-direction: column;
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
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        @media (max-width: 800px) {
          .field-group {
            grid-template-columns: 1fr;
          }
        }

        input[type="text"],
        input[type="email"],
        input[type="number"],
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

        .teacher-block {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .teacher-avatar {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .teacher-name {
          margin: 0 0 2px;
          font-size: 0.95rem;
        }

        .teacher-email {
          margin: 0;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .capacity-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          margin-bottom: 8px;
        }

        .capacity-main {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .capacity-sub {
          margin: 2px 0 0;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .capacity-chip {
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 0.75rem;
          border: 1px solid #1f2937;
          background: #020617;
          color: #9ca3af;
        }

        .capacity-bar {
          width: 100%;
          height: 8px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #1f2937;
          overflow: hidden;
        }

        .capacity-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 0.85rem;
          color: #d1d5db;
        }

        .info-list li {
          margin-bottom: 6px;
        }

        .info-list span {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

export default function DashboardComputersHome() {
  const { theme } = useThemeMode();
  const { text } = theme.palette;
  const { t } = useTranslation([NS_DASHBOARD_COMPUTERS]);
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, logout } = useAuth();
  const { school } = useSchool();

  return (<RoomProvider uidSchool={school?.uid}>
    <DashboardPageWrapper title={t('title')} subtitle={t('subtitle')} icon={<IconDashboard width={22} height={22} />}>
      <ComputersComponent />
    </DashboardPageWrapper>
  </RoomProvider>)
}
