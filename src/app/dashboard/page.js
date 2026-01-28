"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { IconCertificate, IconDashboard, IconDuration, IconLessons, IconLogoImage, } from "@/assets/icons/IconsComponent";
import { WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_BUTTONS, NS_DASHBOARD_HOME, NS_DASHBOARD_MENU, } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Trans, useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import ComputersComponent from '@/components/dashboard/computers/ComputersComponent';
import { Box, Button, CircularProgress, Container, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { ClassSchool } from '@/classes/ClassSchool';
import { ClassRoom } from '@/classes/ClassRoom';
import { ClassHardware } from '@/classes/ClassDevice';
import { ClassUser, ClassUserStudent, ClassUserTeacher } from '@/classes/users/ClassUser';
import { useSession } from '@/contexts/SessionProvider';
import { ClassColor } from '@/classes/ClassColor';
import Link from 'next/link';
import { PAGE_DASHBOARD_CALENDAR, PAGE_DASHBOARD_COMPUTERS, PAGE_DASHBOARD_HOME, PAGE_DASHBOARD_USERS, PAGE_LESSONS } from '@/contexts/constants/constants_pages';
import { formatChrono, getFormattedDateCompleteNumeric, getFormattedDateNumeric, getFormattedHour } from '@/contexts/functions';
import DialogCompleteProfile from '@/components/dashboard/complete-profile/DialogCompleteProfile';
import DashboardComponent from '@/components/dashboard/DashboardComponent';
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InsightsIcon from "@mui/icons-material/Insights";
import QuizIcon from "@mui/icons-material/Quiz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DashboardChartsComponent from '@/components/dashboard/DashboardChartsComponent';
import { useLesson } from '@/contexts/LessonProvider';
import { useStat } from '@/contexts/StatProvider';
import { useChapter } from '@/contexts/ChapterProvider';
import StatsBarChart from '@/components/stats/StatsBarChart';
import { ClassUserStat } from '@/classes/users/ClassUserStat';
import { PAGE_STATS } from '@/contexts/constants/constants_pages';
import { useRouter } from 'next/navigation';
import Chip from '@mui/material/Chip';

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
          padding: 40px 0px;
          color: #e5e7eb;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          background: red;
          padding:0;
        }

        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          background: green;
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
          background: var(--card-color);
          border-radius: 10px;
          border: 0.1px solid var(--card-border);
          padding: 10px 12px;
        }

        .stat-label {
          margin: 0 0 4px;
          font-size: 0.8rem;
          color: var(--grey-dark);
        }

        .stat-value {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--font-color);
        }

        .stat-helper {
          margin: 4px 0 0;
          font-size: 0.78rem;
          color: var(--grey-dark);
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
function QuickLink({ emoji, label, description, link = "" }) {
  return (
    <>
      <button type="button" className="quick-link">
        <Link href={link}>

          <Stack spacing={1} type="button">
            <div className="q-emoji">{emoji}</div>
            <div className="q-text">
              <p className="q-label">{label}</p>
              <p className="q-desc">{description}</p>
            </div>
          </Stack>
        </Link>
      </button>

      <style jsx>{`
        .quick-link {
          border-radius: 12px;
          border: 0.1px solid var(--card-border);
          background: var(--card-color);
          padding: 10px 10px;
          display: flex;
          gap: 8px;
          cursor: pointer;
          text-align: left;
          color: var(--font-color);
        }

        .quick-link:hover {
          background: radial-gradient(circle at top left, #1d4ed822, #020617);
          border-color: #1f2937;

          background: var(--card-color);
          border-color: var(--primary);
          color:var(-background);
        }

        .q-emoji {
          font-size: 1.2rem;
        }

        .q-text {
          font-size: 0.85rem;
          font-color: var(--font-color);
        }

        .q-label {
          margin: 0 0 2px;
          font-weight: 300;
         
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
function DandelaDashboardHome() {
  const [activeMenu, setActiveMenu] = useState("accueil");
  const { sessions, slots } = useSession();
  const [countObj, setCountObj] = useState({
    students: 0,
    teachers: 0,
    devices: 0,
    sessions: 0,
    slots: 0
  })

  const handleMenuClick = (key) => {
    // Ici tu peux remplacer par un vrai route.push('/app/...') plus tard
    setActiveMenu(key);
  };
  useEffect(() => {
    async function init() {
      const results = await Promise.allSettled([
        ClassUserStudent.count(),
        ClassUserTeacher.count(),
        ClassHardware.count(),
      ]);
      const count_sessions = sessions.length || 0;
      const count_slots = slots.length || 0;

      setCountObj(prev => ({
        ...prev,
        sessions: count_sessions,
        slots: count_slots
      }))

      results.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          //console.log('OK', index, res.value, res);
          setCountObj(prev => ({
            ...prev,
            [Object.keys(prev)[index]]: res.value
          }))
        } else {
          console.error('ERROR', index, res.reason);
        }
      });
    }
    init();
  }, [sessions])

  return (<div className="page">
    <div className="shell">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="brand">
          <IconLogoImage height={45} color={ClassColor.WHITE} />
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
              value={countObj.students}
              helper="Connectés / inscrits récemment"
            />
            <StatCard
              label="Professeurs actifs"
              value={countObj.teachers}
              helper="Sessions à venir"
            />
            <StatCard
              label="Cours à venir"
              value={countObj.slots}
              helper="Sur l’ensemble du campus"
            />
            <StatCard
              label="Ordinateurs disponibles"
              value={countObj.devices}
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
                  <h2>Accès rapide</h2>
                </div>
                <div className="quick-links">
                  <QuickLink
                    label="Consulter le calendrier"
                    description="Vue globale des sessions."
                    emoji="📅"
                    link={PAGE_DASHBOARD_CALENDAR}
                  />
                  <QuickLink
                    label="Créer un nouveau cours"
                    description="Ajouter un module au catalogue."
                    emoji="📘"
                    link={PAGE_LESSONS}
                  />
                  <QuickLink
                    label="Gérer les ordinateurs"
                    description="Voir l’état des 25 postes de travail."
                    emoji="💻"
                    link={PAGE_DASHBOARD_COMPUTERS}
                  />
                  <QuickLink
                    label="Liste des utilisateurs"
                    description="Étudiants, professeurs, admins."
                    emoji="👥"
                    link={PAGE_DASHBOARD_USERS}
                  />


                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h2>Sessions à venir</h2>
                  <Link style={{
                    fontSize: '0.8rem',
                    color: 'var(--primary)'
                  }} href={PAGE_DASHBOARD_CALENDAR} target='_blank'>{`Voir le calendrier`}</Link>
                </div>
                <div className="lesson-list">
                  {slots.filter(a => a.start_date?.getTime() > new Date().getTime()).sort((a, b) => b.start_date?.getTime() - a.start_date?.getTime()).map((slot, i) => {
                    const session = sessions.find(item => item.uid === slot.uid_session);
                    const lesson = session?.lesson;
                    const teacher = session?.teacher;
                    const countAll = slot.seats_availables_online + slot.seats_availables_onsite;
                    const countSubcribers = slot.subscribers_online?.length + slot.subscribers_onsite?.length;
                    return (
                      <div key={`${slot?.uid_intern}-${i}`} className="lesson-item">
                        <div>
                          <p className="lesson-title">{lesson?.translate?.title || lesson?.title}</p>
                          <p className="lesson-sub">
                            {teacher?.getCompleteName?.()} • {`Session ${slot.uid_intern}`}
                          </p>
                          <p className="lesson-time">
                            {getFormattedDateNumeric(slot.start_date)} {"•"} {getFormattedHour(slot.start_date)}{"-"}{getFormattedHour(slot.end_date)}</p>
                          <p className="lesson-time">{slot.format}</p>
                        </div>
                        <div className="lesson-meta">
                          <p className="lesson-counter">
                            {countSubcribers}/{countAll}
                          </p>
                          <p className="lesson-counter-sub">inscrits</p>
                          <button className="mini-btn">Ouvrir</button>
                        </div>
                      </div>
                    )
                  })}
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
        background: transparent;
        padding: 0px 0px;
        color: #e5e7eb;
        display: flex;
        justify-content: center;
      }

      .shell {
        width: 100%;
        max-width: 1280px;
        border-radius: 10px;
        border: 0.1px solid var(--card-border);
        background: var(--card-color);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .topbar {
        height: 60px;
        padding: 0 18px;
        border-bottom: 0.1px solid var(--card-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--blackColor);
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
        grid-template-columns: 220px minmax(1fr, 1fr);
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
        color: ${ClassColor.GREY_LIGHT};
      }

      h1 {
        margin: 0;
        font-size: 1.7rem;
        color:var(--font-color);
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
        background: var(--card-color);
        border-radius: 10px;
        border: 0.1px solid var(--card-border);
        padding: 14px 14px 16px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        color:${ClassColor.GREY_LIGHT};
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
        color: var(--primary);
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
        border: 0.1px solid var(--card-border);
        background: var(--card-color);
        color: var(--font-color);
        font-weight: 300;
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
        color: var(--primary);
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
  </div>);
}
function CardHeader({ user = null }) {
  const { t } = useTranslation([NS_DASHBOARD_HOME]);
  return (
    <Box
      sx={{
        width: "100%",
        py: 2,
        color: "var(--font-color)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "var(--primary-shadow)",
            border: "1px solid var(--primary-shadow-sm)",
          }}
        >
          <IconLogoImage height={28} width={28} color="var(--primary)" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
            <Trans t={t} i18nKey="welcome" values={{ name: user?.first_name || "" }} />,
          </Typography>
          <Typography variant="body1" sx={{ color: "var(--grey)", fontSize: "0.95rem" }}>
            {t("welcome-1")}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
function AvatarIcon({ children, sx = {} }) {
  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "var(--primary-shadow)",
        color: "var(--primary)",
        border: "1px solid var(--primary-shadow-sm)",
        flexShrink: 0,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
function clamp(v) {
  const n = Number(v || 0);
  return Math.max(0, Math.min(100, n));
}

function StatusDistributionCard({ statusDistribution = [] }) {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION, NS_DASHBOARD_HOME]);
  const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 3,
        border: '1px solid var(--card-border)',
        bgcolor: 'var(--card-color)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Stack spacing={2.5}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t("status-distribution", { ns: NS_DASHBOARD_HOME })}
        </Typography>
        <Stack spacing={2}>
          {statusDistribution
            .filter(item => item.count > 0)
            .map(({ status, count, percent }) => {
              const color = STATUS_CONFIG[status];
              return (
                <Stack key={status} spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip
                      size="small"
                      label={t(status)}
                      sx={{
                        fontWeight: 600,
                        bgcolor: color?.background_bubble,
                        color: color?.color,
                        border: `1px solid ${color?.border}`,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--font-color)' }}>
                      {count} ({parseInt(percent)}%)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={clamp(percent)}
                    sx={{
                      height: 6,
                      borderRadius: 999,
                      bgcolor: color?.background_bubble || 'var(--primary-shadow-sm)',
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        bgcolor: color?.background_bar || 'var(--primary)',
                      },
                    }}
                  />
                </Stack>
              );
            })}
          {statusDistribution.filter(item => item.count > 0).length === 0 && (
            <Typography variant="body2" sx={{ color: 'var(--grey-light)', textAlign: 'center', py: 2 }}>
              {t("no-data")}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

function BestStatsCard({ bestStats = [] }) {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION, NS_DASHBOARD_HOME, NS_BUTTONS]);
  const router = useRouter();
  const { getOneLesson } = useLesson();
  const { getOneChapter } = useChapter();
  const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 3,
        border: '1px solid var(--card-border)',
        bgcolor: 'var(--card-color)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t("best-results", { ns: NS_DASHBOARD_HOME })}
          </Typography>
          {bestStats.length > 0 && (
            <Link href={PAGE_STATS} style={{ textDecoration: 'none' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                {t("see-all", { ns: NS_BUTTONS })} →
              </Typography>
            </Link>
          )}
        </Stack>
        <Stack spacing={1.5}>
          {bestStats.length > 0 ? (
            bestStats.map((stat) => {
              const lesson = getOneLesson(stat.uid_lesson);
              const chapter = getOneChapter(stat.uid_chapter);
              const percent = (stat.score / stat.answers?.length) * 100;
              const color = STATUS_CONFIG[stat.status];
              
              return (
                <Paper
                  key={stat.uid}
                  elevation={0}
                  onClick={() => router.push(`${PAGE_STATS}/${stat.uid_lesson}/${stat.uid_chapter}/${stat.uid}`)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${color?.border || 'var(--card-border)'}`,
                    bgcolor: color?.background || 'var(--card-color)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: color?.background_icon || 'var(--primary-shadow-xs)',
                            color: color?.color_icon || 'var(--primary)',
                          }}
                        >
                          <EmojiEventsIcon sx={{ fontSize: 18 }} />
                        </Box>
                        <Stack spacing={0.2}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: color?.color || 'var(--font-color)' }}>
                            {lesson?.uid_intern}. {lesson?.translate?.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'var(--grey-light)' }}>
                            {chapter?.uid_intern}. {chapter?.translate?.title}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Chip
                        size="small"
                        label={`${parseInt(percent)}%`}
                        sx={{
                          fontWeight: 700,
                          bgcolor: color?.background_bubble,
                          color: color?.color,
                          border: `1px solid ${color?.border}`,
                        }}
                      />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={clamp(percent)}
                      sx={{
                        height: 6,
                        borderRadius: 999,
                        bgcolor: color?.background_bubble || 'var(--primary-shadow-sm)',
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 999,
                          bgcolor: color?.background_bar || 'var(--primary)',
                        },
                      }}
                    />
                  </Stack>
                </Paper>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: 'var(--grey-light)', textAlign: 'center', py: 2 }}>
              {t("no-results")}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

function UpcomingChaptersCard({ upcomingChapters = [] }) {
  const { t } = useTranslation([NS_DASHBOARD_HOME, NS_BUTTONS]);
  const router = useRouter();
  const { getOneLesson } = useLesson();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 3,
        border: '1px solid var(--card-border)',
        bgcolor: 'var(--card-color)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t("chapters-to-complete")}
          </Typography>
          {upcomingChapters.length > 0 && (
            <Link href={PAGE_LESSONS} style={{ textDecoration: 'none' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                {t("see-all", { ns: NS_BUTTONS })} →
              </Typography>
            </Link>
          )}
        </Stack>
        <Stack spacing={1.5}>
          {upcomingChapters.length > 0 ? (
            upcomingChapters.map((chapter) => {
              const lesson = getOneLesson(chapter.uid_lesson);
              
              return (
                <Paper
                  key={chapter.uid}
                  elevation={0}
                  onClick={() => router.push(`${PAGE_LESSONS}/${chapter.uid_lesson}/chapters/${chapter.uid}`)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid var(--card-border)',
                    bgcolor: 'var(--card-color)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                      transform: 'translateY(-2px)',
                      borderColor: 'var(--primary)',
                    },
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'var(--primary-shadow-xs)',
                          color: 'var(--primary)',
                        }}
                      >
                        <SchoolIcon sx={{ fontSize: 18 }} />
                      </Box>
                      <Stack spacing={0.2} sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {chapter?.uid_intern}. {chapter?.translate?.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--grey-light)' }}>
                          {lesson?.uid_intern}. {lesson?.translate?.title}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: 'var(--grey-light)', textAlign: 'center', py: 2 }}>
              {t("all-chapters-completed")}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
function KpiCardProgress({ icon, title, value, subtitle, progress = 0, total = null }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 5,
        p: 2.2,
        py: 2,
        px: 1.5,
        //border: "0.1px solid var(--primary-shadow-sm)",
        background: 'var(--primary-shadow)',
        borderRadius: '10px',
        color: "var(--font-color)",
      }}
    >
      <Stack spacing={1.1}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <AvatarIcon>{icon}</AvatarIcon>
          <Stack spacing={0.1} sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="var(--primary-dark)">
              {title}
            </Typography>
            <Typography variant="h4" color="var(--primary)" sx={{ fontWeight: 950, lineHeight: 1.05 }}>
              {value}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="body2" color="var(--grey-dark)">
          {subtitle}
        </Typography>

        <Grid container alignItems={'center'} spacing={1}>
          <Grid size={'grow'}>
            <LinearProgress
              variant="determinate"
              value={clamp(progress)}
              sx={{
                height: 10,
                width: '100%',
                borderRadius: 999,
                bgcolor: "var(--primary-shadow-sm)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  bgcolor: "var(--primary)",
                },
              }}
            />
          </Grid>
          {
            total && <Grid size={'auto'} alignItems={'center'}>
              <Typography variant="caption" sx={{ fontSize: '12px', width: 'auto', height: '100%' }}>{total}</Typography>
            </Grid>
          }
        </Grid>
      </Stack>
    </Paper>
  );
}
function KpiCard({ icon, title, value, subtitle, progress = 0, total = null }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 3,
        bgcolor: "var(--card-color)",
        color: "var(--font-color)",
        border: "1px solid var(--card-border)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
          borderColor: "var(--primary)",
        },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "var(--primary-shadow-xs)",
              color: "var(--primary)",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Stack spacing={0.3} sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: "var(--grey-light)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "0.7rem",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                color: "var(--font-color)",
              }}
            >
              {value}
            </Typography>
          </Stack>
        </Stack>
        <Typography
          variant="body2"
          sx={{
            color: "var(--grey-light)",
            fontSize: "0.85rem",
          }}
        >
          {subtitle}
        </Typography>
        {progress > 0 && (
          <LinearProgress
            variant="determinate"
            value={clamp(progress)}
            sx={{
              height: 6,
              borderRadius: 999,
              bgcolor: "var(--primary-shadow-sm)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                bgcolor: "var(--primary)",
              },
            }}
          />
        )}
      </Stack>
    </Paper>
  );
}
export default function DashboardHomePage() {
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
  const { lessons, isLoading:isLoadingLessons } = useLesson();
  const { chapters, isLoading:isLoadingChapters } = useChapter();
  const { setUidUser, stats, getGlobalPercent, getGlobalDuration, getGlobalCountChapters, isLoading:isLoadingStats } = useStat();
  useEffect(()=>{
setUidUser(user?.uid);
  }, [user]);
  const countLessons = useMemo(()=>{
    return lessons.length;
  }, [lessons]);
  const countChapters = useMemo(()=>{
    return chapters.length;
  }, [chapters]);
  const {countStartedLessons,countCompletedChapters, countStats, averageScore, duration} = useMemo(()=>{
    const countStats = stats.length;
    const countStartedLessons= new Set(stats.map(s => s.uid_lesson)).size;
    const countCompletedChapters = new Set(stats.map(s => s.uid_chapter)).size;
    const averageScore= getGlobalPercent();
    const duration= getGlobalDuration();
    return{
      countStartedLessons,
      countCompletedChapters,
      countStats,
      averageScore, duration
    }
  }, [stats, getGlobalPercent, getGlobalDuration]);
  const countCompletedLessons = useMemo(() => {
      if(countStats===0) return 0;
      var countCompletedLessons = 0;
      for (const lesson of lessons) {
        const filteredChapters = chapters.filter(c => c.uid_lesson === lesson.uid);
        const filteredStats = stats.filter(s => s.uid_lesson === lesson.uid);
        const sizeStats = new Set(filteredStats.map(s => s.uid_chapter)).size;
        if (filteredChapters.length === sizeStats) {
          countCompletedLessons += 1;
        }
      }
      return (countCompletedLessons);
    }, [countStats, lessons, chapters, stats]);

  // Calculs pour les nouvelles sections (AVANT le return conditionnel)
  const { bestStats, statusDistribution, upcomingChapters } = useMemo(() => {
    // Meilleurs résultats récents (top 5)
    const bestStats = [...stats]
      .sort((a, b) => {
        const percentA = (a.score / a.answers?.length) * 100;
        const percentB = (b.score / b.answers?.length) * 100;
        return percentB - percentA;
      })
      .slice(0, 5);

    // Répartition des statuts
    const statusDistribution = ClassUserStat.ALL_STATUS.map(status => {
      const count = stats.filter(s => s.status === status).length;
      return { status, count, percent: stats.length > 0 ? (count / stats.length) * 100 : 0 };
    });

    // Chapitres à compléter (chapitres non commencés)
    const startedChapters = new Set(stats.map(s => s.uid_chapter));
    const upcomingChapters = chapters
      .filter(chapter => !startedChapters.has(chapter.uid))
      .slice(0, 5);

    return { bestStats, statusDistribution, upcomingChapters };
  }, [stats, chapters]);

  const wrapperProps = {
    titles: [{ name: t("dashboard", { ns: NS_DASHBOARD_MENU }), url: PAGE_DASHBOARD_HOME }],
    icon: <IconDashboard />,
  };

  if (isLoadingLessons || isLoadingChapters || isLoadingStats) {
    return (
      <DashboardPageWrapper {...wrapperProps}>
        <Stack 
          alignItems="center" 
          justifyContent="center" 
          sx={{ 
            minHeight: 'calc(100vh - 200px)',
            width: '100%'
          }} 
          spacing={2}
        >
          <CircularProgress size={40} sx={{ color: "var(--primary)" }} />
          <Typography variant="body2" sx={{ color: "var(--grey)" }}>
            {t("loading", { ns: NS_DASHBOARD_HOME })}
          </Typography>
        </Stack>
      </DashboardPageWrapper>
    );
  }

  return (
    <DashboardPageWrapper {...wrapperProps}>
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
        <Stack spacing={3}>
          <CardHeader user={user} />
                    {/* KPI Cards */}
                    <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <KpiCard
                icon={<IconLessons />}
                title={t("lesson-start")}
                value={`${countStartedLessons}/${countLessons}`}
                subtitle={`${t("chapter-completed")} : ${countCompletedChapters}/${countChapters}`}
                progress={countLessons > 0 ? (countStartedLessons / countLessons) * 100 : 0}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <KpiCard
                icon={<IconCertificate />}
                title={t("lesson-completed")}
                value={`${countCompletedLessons}/${countLessons}`}
                subtitle={`${t("average")} : ${parseInt(averageScore)}%`}
                progress={countLessons > 0 ? (countCompletedLessons / countLessons) * 100 : 0}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <KpiCard
                icon={<IconDuration />}
                title={t("duration")}
                value={formatChrono(duration)}
                subtitle={`${countStats} ${t("attempts")}`}
              />
            </Grid>
          </Grid>
          {/* Section principale avec accès rapide et actualités */}
          <Grid size={12}>
            <DashboardComponent stats={stats} />
          </Grid>



          {/* Graphique de progression et répartition */}
          {stats.length > 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    p: 3,
                    border: '1px solid var(--card-border)',
                    bgcolor: 'var(--card-color)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {t("progression")}
                    </Typography>
                    <StatsBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />
                  </Stack>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StatusDistributionCard statusDistribution={statusDistribution} />
              </Grid>
            </Grid>
          )}

          {/* Meilleurs résultats et chapitres à compléter */}
          {(bestStats.length > 0 || upcomingChapters.length > 0) && (
            <Grid container spacing={3}>
              {bestStats.length > 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <BestStatsCard bestStats={bestStats} />
                </Grid>
              )}
              {upcomingChapters.length > 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <UpcomingChaptersCard upcomingChapters={upcomingChapters} />
                </Grid>
              )}
            </Grid>
          )}
        </Stack>
      </Container>
    </DashboardPageWrapper>
  );
}
