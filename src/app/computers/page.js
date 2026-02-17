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
