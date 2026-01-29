"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { IconSearch, IconTeachers } from "@/assets/icons/IconsComponent";
import { NS_BUTTONS, NS_COMMON, NS_DASHBOARD_MENU, NS_TEACHERS } from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import { Box, Grid, Stack, Typography } from '@mui/material';
import FieldComponent from '@/components/elements/FieldComponent';
import { ClassUser, ClassUserTeacher } from '@/classes/users/ClassUser';
import { useUsers } from '@/contexts/UsersProvider';
import { useLessonTeacher } from '@/contexts/LessonTeacherProvider';
import { useRouter } from 'next/navigation';
import { PAGE_TEACHERS } from '@/contexts/constants/constants_pages';
import { NS_LANGS, NS_ROLES } from '@/contexts/i18n/settings';
import { ClassLesson } from '@/classes/ClassLesson';
import { CircularProgress } from '@mui/material';

const TABLE_SPACE = `grid-template-columns:
            minmax(0, 2.5fr)
            minmax(0, 1.5fr)
            minmax(0, 1.5fr)
            minmax(0, 2.3fr)
            minmax(0, 1.4fr)
            ;`

function TeachersComponent() {
  const router = useRouter();
  const { t } = useTranslation([ClassUser.NS_COLLECTION, NS_TEACHERS, NS_ROLES, NS_COMMON, ClassLesson.NS_COLLECTION]);
  const { users, isLoading } = useUsers();
  const { lessons } = useLessonTeacher();
  
  const [filter, setFilter] = useState({
    search: "",
  });

  // Filtrer uniquement les professeurs
  const teachers = useMemo(() => {
    return users.filter(user => user instanceof ClassUserTeacher || user.role === ClassUser.ROLE.TEACHER);
  }, [users]);

  const [teachersFilter, setTeachersFilter] = useState([]);

  useEffect(() => {
    for (const teacher of teachers) {
      router.prefetch(`${PAGE_TEACHERS}/${teacher.uid}`);
    }
  }, [teachers, router]);

  useEffect(() => {
    let list = [...teachers];
    if (filter.search.length) {
      list = list.filter((teacher) => {
        const completeName = teacher.completeName?.()?.toLowerCase() || '';
        const fullName = `${teacher.first_name || ''} ${teacher.last_name || ''}`.toLowerCase();
        return (
          completeName.includes(filter.search.toLowerCase()) ||
          teacher.first_name?.toLowerCase().includes(filter.search.toLowerCase()) ||
          teacher.last_name?.toLowerCase().includes(filter.search.toLowerCase()) ||
          teacher.display_name?.toLowerCase().includes(filter.search.toLowerCase()) ||
          teacher.email?.toLowerCase().includes(filter.search.toLowerCase()) ||
          teacher.email_academy?.toLowerCase().includes(filter.search.toLowerCase()) ||
          fullName.includes(filter.search.toLowerCase())
        );
      });
    }
    setTeachersFilter(list);
  }, [filter.search, teachers]);

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 'calc(100vh - 200px)', width: '100%' }} spacing={2}>
        <CircularProgress size={40} sx={{ color: "var(--primary)" }} />
        <Typography variant="body2" sx={{ color: "var(--grey)" }}>
          {t("loading", { ns: NS_COMMON })}
        </Typography>
      </Stack>
    );
  }

  return (
    <div>
      <main>
        {/* BARRE DE FILTRES */}
        <Grid container sx={{ mb: 2.5 }} direction={'row'} alignItems={'center'} spacing={{ xs: 1, sm: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ background: '' }}>
            <FieldComponent
              name={'search'}
              value={filter.search || ""}
              placeholder={t('placeholder_search', { ns: ClassUser.NS_COLLECTION })}
              fullWidth
              type='text'
              icon={<IconSearch width={18} />}
              onChange={(e) => {
                e.preventDefault();
                setFilter(prev => ({
                  ...prev,
                  search: e.target.value,
                }));
              }}
              onClear={() => setFilter(prev => ({
                ...prev,
                search: "",
              }))}
            />
          </Grid>
        </Grid>

        {/* TABLE / LISTE */}
        <section className="card">
          <div className="table-header">
            <span className="th th-user">{t('teacher', { ns: NS_ROLES })}</span>
            <span className="th th-username">{t('display_name', { ns: ClassUser.NS_COLLECTION })}</span>
            <span className="th th-role">{t('lesson', { ns: ClassLesson.NS_COLLECTION })}</span>
            <span className="th th-email">{t('email', { ns: ClassUser.NS_COLLECTION })}</span>
            <span className="th th-certified">{t('certified_short', { ns: ClassUser.NS_COLLECTION })}</span>
          </div>

          <div className="table-body">
            {teachersFilter.length === 0 && (
              <div className="empty-state">
                {t('not-found', { ns: ClassUser.NS_COLLECTION })}
              </div>
            )}

            {teachersFilter.map((teacher, i) => {
              // Trouver le dernier ClassLessonTeacher pour ce professeur
              const teacherLessons = (lessons || []).filter(lt => lt?.uid_teacher === teacher.uid);
              const lastLessonTeacher = teacherLessons.length > 0 
                ? teacherLessons.sort((a, b) => {
                    const dateA = a?.last_edit_time || a?.created_time || new Date(0);
                    const dateB = b?.last_edit_time || b?.created_time || new Date(0);
                    const timeA = dateA instanceof Date ? dateA.getTime() : (dateA?.toDate?.()?.getTime() || 0);
                    const timeB = dateB instanceof Date ? dateB.getTime() : (dateB?.toDate?.()?.getTime() || 0);
                    return timeB - timeA;
                  })[0]
                : null;
              
              return (
                <Box 
                  key={`${teacher?.uid}-${i}`} 
                  onClick={() => {
                    router.push(`${PAGE_TEACHERS}/${teacher.uid}`);
                  }} 
                  sx={{ cursor: 'pointer' }}
                >
                  <TeacherRow 
                    teacher={teacher} 
                    lastLessonTeacher={lastLessonTeacher}
                    lastChild={i === teachersFilter.length - 1} 
                  />
                </Box>
              );
            })}
          </div>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          width:100%;
          padding:0;
          color: var(--font-color);
        }

        .container {
          width: 100%;
          min-height: 100%;
          padding:0;
        }

        .card {
          background: var(--card-color);
          border-radius: 16px;
          border: 0.1px solid var(--card-border);
          padding: 0;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          ${TABLE_SPACE}
          gap: 8px;
          padding: 8px 15px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: white;
          font-weight: 500;
          border-bottom: 0.1px solid var(--card-border);
          background: var(--blackColor);
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
          color: var(--grey-light);
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

function TeacherRow({ teacher = null, lastLessonTeacher = null, lastChild = false }) {
  const { t } = useTranslation([NS_LANGS, NS_ROLES, ClassUser.NS_COLLECTION, ClassLesson.NS_COLLECTION]);

  return (
    <>
      <div className={`row ${lastChild ? 'last-child' : ''}`}>
        {/* Utilisateur */}
        <div className="cell cell-user">
          {teacher?.showAvatar?.({ size: 30, fontSize: '14px' })}
          <div className="user-text">
            <p className="user-name">
              {teacher.last_name || ''} {teacher.first_name || ''}
            </p>
            <p className="user-id">
              {teacher.bio ? `${teacher.bio.substring(0, 50)}${teacher.bio.length > 50 ? '...' : ''}` : ''}
            </p>
          </div>
        </div>

        {/* Username */}
        <div className="cell cell-username">
          <p className="text-main">@{teacher?.display_name || ''}</p>
          <p className="text-sub">
            {teacher.langs && Array.isArray(teacher.langs) && teacher.langs.length > 0
              ? teacher.langs.map(lang => t(lang, { ns: NS_LANGS })).join(', ')
              : '-'}
          </p>
        </div>

        {/* Dernier cours */}
        <div className="cell cell-role">
          {lastLessonTeacher ? (
            <>
              <p className="text-main">{lastLessonTeacher.translate?.title || lastLessonTeacher.title || ''}</p>
              <p className="text-sub">{lastLessonTeacher.translate?.subtitle || lastLessonTeacher.subtitle || ''}</p>
            </>
          ) : (
            <p className="text-main text-empty">
              -
            </p>
          )}
        </div>

        {/* Email */}
        <div className="cell cell-email">
          <p className="text-main">{teacher.schoolEmail || teacher.email_academy || teacher.email || ''}</p>
          <p className="text-sub" style={{ display: 'none' }}>{teacher.email_academy || ''}</p>
        </div>

        {/* Certifié */}
        <div className="cell cell-certified">
          {teacher.certified ? (
            <p className="text-main text-certified">
              ✓ {t('certified_short', { ns: ClassUser.NS_COLLECTION })}
            </p>
          ) : (
            <p className="text-main text-empty">
              -
            </p>
          )}
        </div>
      </div>

      {/* Styles spécifiques à la row */}
      <style jsx>{`
        .row {
          display: grid;
          ${TABLE_SPACE}
          gap: 8px;
          padding: 10px 16px;
          font-size: 0.85rem;
          border-bottom: 0.1px solid var(--card-border);
          align-items: start;
          transition: background-color 0.2s;
        }

        .row:hover {
          background-color: var(--card-hover);
        }
        
        .row.last-child {
          border-bottom: none;
        }

        .cell {
          min-width: 0;
          overflow: visible;
          color: var(--font-color);
        }

        .cell-user {
          display: flex;
          align-items: start;
          gap: 8px;
          color: var(--font-color);
        }

        .user-text {
          min-width: 0;
          flex: 1;
          color: var(--font-color);
        }

        .user-name {
          margin: 0;
          font-weight: 500;
          word-break: break-word;
          color: var(--font-color);
        }

        .user-id {
          margin: 0;
          font-size: 0.75rem;
          color: var(--grey-light);
          word-break: break-word;
          line-height: 1.4;
        }

        .text-main {
          margin: 0;
          word-break: break-word;
          line-height: 1.4;
          color: var(--font-color);
        }

        .text-sub {
          margin: 0;
          font-size: 0.75rem;
          color: var(--grey-light);
          word-break: break-word;
          line-height: 1.4;
        }
        
        .text-empty {
          color: var(--grey-light);
          font-style: italic;
        }
        
        .text-certified {
          color: var(--primary);
          font-weight: 600;
        }
        
        .cell-role .text-main,
        .cell-email .text-main {
          word-break: break-all;
        }

        @media (max-width: 900px) {
          .row {
            grid-template-columns: 1fr;
            padding: 10px 10px;
            border-radius: 12px;
            margin-bottom: 8px;
            border: 0.1px solid var(--card-border);
          }

          .row.last-child {
            border: 0.1px solid var(--card-border);
          }

          .cell-email,
          .cell-certified {
            margin-top: -4px;
          }
        }
      `}</style>
    </>
  );
}

export default function TeachersPage() {
  const { t } = useTranslation([NS_TEACHERS, NS_DASHBOARD_MENU, NS_BUTTONS]);

  return (
    <DashboardPageWrapper
      titles={[{ name: t('tutors', { ns: NS_DASHBOARD_MENU }), url: '' }]}
      subtitle={t('subtitle')}
      icon={<IconTeachers />}
    >
      <Stack alignItems={'start'} spacing={1.5} sx={{ width: '100%', height: '100%' }}>
        <TeachersComponent />
      </Stack>
    </DashboardPageWrapper>
  );
}
