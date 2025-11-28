"use client";
import React, { useEffect, useState } from 'react';
import { IconDashboard, } from "@/assets/icons/IconsComponent";
import { WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_DASHBOARD_HOME, NS_DASHBOARD_USERS, NS_LANGS, } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import ComputersComponent from '@/components/dashboard/hub/ComputersComponent';


import { useMemo } from "react";
import { Button, Stack } from '@mui/material';
import { ClassSchool } from '@/classes/ClassSchool';
import { ClassRoom } from '@/classes/ClassRoom';
import { ClassComputer } from '@/classes/ClassDevice';
import SelectComponentDark from '@/components/elements/SelectComponentDark';
import { ClassUser } from '@/classes/users/ClassUser';

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
  team: { label: "Equipe", color: "#daf63bff" },
  teacher: { label: "Professeur", color: "#3b82f6" },
  tutor: { label: "Professeur", color: "#3b82f6" },
  admin: { label: "Admin", color: "#f97316" },
  super_admin: { label: "Super-Admin", color: "#a855f7" },
  ['super-admin']: { label: "Super-Admin", color: "#a855f7" },
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
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    async function init() {
      const _users = await ClassUser.fetchListFromFirestore();
      console.log("USERS", _users);
      setUsers([...filteredUsers, ..._users]);
    }
    init();
  }, [])


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

            {users.map((user) => (
              <UserRow key={user.id || user.uid} user={user} />
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: green;
          width:100%;
          padding:0;
          color: #e5e7eb;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          background: cyan;
          padding:0;
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          align-items: flex-start;
          flex-wrap: wrap;
          background: red;
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
  const {t} = useTranslation([NS_LANGS]);
  const roleCfg = ROLE_CONFIG[user.role];
  const statusCfg = STATUS_CONFIG_1[user.status];

  return (
    <>
      <div className="row">
        {/* Utilisateur */}
        <div className="cell cell-user">
          <Avatar user={user} />
          {user?.showAvatar?.({size:30, fontSize:'14px'})}
          <div className="user-text">
            <p className="user-name">
              {user.firstName || user.first_name || ''} {user.lastName || user.last_name || ''}
            </p>
            <p className="user-id" style={{display:'none'}}>ID: {user.id || user.email_academy || ''}</p>
          </div>
        </div>

        {/* Username */}
        <div className="cell cell-username">
          <p className="text-main">@{user.username || user.display_name || ''}</p>
          <p className="text-sub">{user.type || ''}</p>
        </div>

        {/* Rôle */}
        <div className="cell cell-role">
          <span
            className="role-badge"
            style={{
              borderColor: roleCfg?.color || '',
              color: roleCfg?.color || '',
            }}
          >
            <span
              className="role-dot"
              style={{ backgroundColor: roleCfg?.color || '' }}
            />
            {roleCfg?.label || ''}
          </span>
        </div>

        {/* Email */}
        <div className="cell cell-email">
          <p className="text-main">{user.schoolEmail || ''}</p>
          <p className="text-sub">{user.email_academy || ''}</p>
        </div>

        {/* Statut */}
        <div className="cell cell-status">
          <span className="status-pill">
            <span
              className="status-dot"
              style={{ backgroundColor: statusCfg?.color || ''}}
            />
            {statusCfg?.label || ''}
          </span>
        </div>

        {/* Groupe / Langue */}
        <div className="cell cell-group">
          <p className="text-main">{user.mainGroup || ''}</p>
          <p className="text-sub">Langue : {user.language || t(user.preferred_language, {ns:NS_LANGS}) || ''}</p>
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
  const initials = `${user?.firstName?.[0] || user?.first_name?.[0] || ''}${user.lastName?.[0] || user.last_name?.[0] || ''}`;

  if (user.avatarUrl) {
    return (
      <>
        <div className="avatar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.avatarUrl || user.photo_url || ''} alt={initials} />
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
  const { t } = useTranslation([NS_DASHBOARD_USERS]);
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, logout } = useAuth();
  //static async create(data = {})

  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const filteredUsers = useMemo(() => {
    //const _users = await ClassUser.fetchListFromFirestore();
    //console.log("USERS memo", _users);
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
          os: ClassComputer.OPERATING_SYSTEM.MACOS,
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
            brand: 'iMac 2017',
            //name: `PC-${sizeId.toString().padStart(2, '0')}`,
            //name_normalized: `pc-${sizeId.toString().padStart(2, '0')}`,
            enabled: true,
            status: ClassComputer.STATUS.AVAILABLE,
            type: ClassComputer.TYPE.DESKTOP,
            os: ClassComputer.OPERATING_SYSTEM.MACOS,
            os_version: "13.7.8",
            buy_time: new Date(2023, 7, 12),
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
            brand: 'HP i7',
            //name: `PC-${sizeId.toString().padStart(2, '0')}`,
            //name_normalized: `pc-${sizeId.toString().padStart(2, '0')}`,
            enabled: true,
            status: ClassComputer.STATUS.AVAILABLE,
            type: ClassComputer.TYPE.DESKTOP,
            os: ClassComputer.OPERATING_SYSTEM.WINDOWS,
            os_version: "10",
            buy_time: new Date(2023, 10, 12),
            updates: [
              { status: 'created', description: 'created_description', created_time: new Date() }
            ],
          });
          const computer = await ClassComputer.create(computerClass);
        }

        //await ClassComputer.create(computer);
        setProcessing(false);
      }}
      sx={{ display: 'none' }}
    >
      {'Create computer'}
    </Button>
    <Stack>
      <UsersPage />
    </Stack>
    <Stack sx={{ width: '100%', background: 'yellow' }}>
      YAAA
      <section className="toolbar" style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}>
        <div className="search-block" style={{
          flex: 1,
          minWidth: '220px',
        }}>
          <input
            type="text"
            placeholder="Rechercher par nom, email, username..."
            style={{
              width: '100%',
              borderRadius: '999px',
              border: '1px solid #1f293',
              padding: '8px 12px',
              background: '#020617',
              color: '#e5e7eb',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          //value={search}
          //onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          <SelectComponentDark
            values={ClassUser.ALL_ROLES.map(item => ({ id: item, value: item }))}
          />
          <select
            style={{
              borderRadius: '999px',
              border: '1px solid #1f2937',
              background: '#020617',
              color: '#e5e7eb',
              padding: '6px 10px',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          //value={roleFilter}
          //onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Tous les rôles</option>
            <option value="student">Étudiants</option>
            <option value="teacher">Professeurs</option>
            <option value="admin">Admins</option>
            <option value="super_admin">Super-Admins</option>
            <option value="intern">Stagiaires</option>
          </select>

          <select
            //value={statusFilter}
            //onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              borderRadius: '999px',
              border: '1px solid #1f2937',
              background: '#020617',
              color: '#e5e7eb',
              padding: '6px 10px',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          >
            <option value="all">Tous les statuts</option>
            <option value="online">En ligne</option>
            <option value="away">Absent</option>
            <option value="offline">Hors ligne</option>
          </select>

          <select
            //value={sortBy}
            //onChange={(e) => setSortBy(e.target.value)}
            style={{
              borderRadius: '999px',
              border: '1px solid #1f2937',
              background: '#020617',
              color: '#e5e7eb',
              padding: '10px 10px',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          >
            <option value="name">Trier par nom</option>
            <option value="role">Trier par rôle</option>
          </select>
        </div>
      </section>
      {/* TABLE / LISTE */}
      <section className="card" style={{
        background: '#020617',
        borderRadius: '10px',
        border: '1px solid #1f2937',
        boxShadow: '0 18px 45px rgba(0, 0, 0, 0.4)',
        padding: '8px 0 10px',
      }}>
        <div className="table-header" style={{
          display: 'grid',
          gridTemplateColumns:
            `minmax(0, 2.5fr)
            minmax(0, 1.5fr)
            minmax(0, 1.5fr)
            minmax(0, 2.3fr)
            minmax(0, 1.4fr)
            minmax(0, 2.2fr)
            minmax(0, 1.5fr)`,
          gap: '8px',
          padding: '8px 16px',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#6b7280',
          borderBottom: '1px solid #111827',
        }}>
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
    </Stack>

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
