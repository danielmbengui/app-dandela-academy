"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { IconSearch, IconSession } from "@/assets/icons/IconsComponent";
import { NS_BUTTONS, NS_COMMON, NS_DASHBOARD_MENU, NS_LANGS, NS_SESSIONS, NS_LEVELS } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import { Box, Grid, Stack, Typography } from '@mui/material';
import SelectComponentDark from '@/components/elements/SelectComponentDark';
import { ClassUser } from '@/classes/users/ClassUser';
import { formatDuration, getFormattedDateComplete, getFormattedDateNumeric, getFormattedHour } from '@/contexts/functions';
import { useLanguage } from '@/contexts/LangProvider';
import FieldComponent from '@/components/elements/FieldComponent';
import { ClassSession, ClassSessionSlot } from '@/classes/ClassSession';
import { ClassLesson } from '@/classes/ClassLesson';
import { ClassLessonChapter } from '@/classes/lessons/ClassLessonChapter';
import BadgeFormatLesson from '@/components/dashboard/lessons/BadgeFormatLesson';
import { useRouter } from 'next/navigation';
import { PAGE_SESSIONS } from '@/contexts/constants/constants_pages';
import { useSession } from '@/contexts/SessionProvider';
import { useLesson } from '@/contexts/LessonProvider';
import { ChapterProvider, useChapter } from '@/contexts/ChapterProvider';
import Image from 'next/image';
import Link from 'next/link';
import { where } from 'firebase/firestore';
import { useLessonTeacher } from '@/contexts/LessonTeacherProvider';

const TABLE_SPACE = `grid-template-columns:
            minmax(0, 0.5fr)
            minmax(0, 2.0fr)
            minmax(0, 1.5fr)
            minmax(0, 1.0fr)
            minmax(0, 1.0fr)
            minmax(0, 1.0fr)
            ;`

function SessionsComponent() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { t } = useTranslation([ClassSession.NS_COLLECTION, NS_SESSIONS, NS_COMMON, ClassLesson.NS_COLLECTION, ClassLessonChapter.NS_COLLECTION, NS_LANGS, NS_LEVELS]);
  const { sessions, isLoading } = useSession();
  const { lessons } = useLesson();
  const [sessionsFilter, setSessionsFilter] = useState([]);
  
  const [filter, setFilter] = useState({
    search: "",
    lesson: "all",
    chapter: "all",
    status: "all",
    format: "all",
  });

  const [sortBy, setSortBy] = useState("none");
  const [sortOrder, setSortOrder] = useState("asc");

  // Récupérer les chapitres pour chaque leçon
  const [lessonsWithChapters, setLessonsWithChapters] = useState({});
  
  useEffect(() => {
    const fetchChapters = async () => {
      const lessonsChapters = {};
      for (const lesson of lessons) {
        try {
          const chapters = await ClassLessonChapter.fetchListFromFirestore(lang, [
            where("uid_lesson", "==", lesson.uid)
          ]);
          lessonsChapters[lesson.uid] = chapters || [];
        } catch (error) {
          console.error(`Error fetching chapters for lesson ${lesson.uid}:`, error);
          lessonsChapters[lesson.uid] = [];
        }
      }
      setLessonsWithChapters(lessonsChapters);
    };
    
    if (lessons.length > 0) {
      fetchChapters();
    }
  }, [lessons, lang]);

  // Filtrer les sessions
  useEffect(() => {
    let list = [...sessions];
    
    // Filtre par recherche
    if (filter.search.length) {
      list = list.filter((session) => {
        const cond_title = session.lesson?.translate?.title?.toLowerCase().includes(filter.search.toLowerCase());
        const cond_code = session.code?.toLowerCase().includes(filter.search.toLowerCase());
        const cond_category = t(session.lesson?.category, { ns: ClassLesson.NS_COLLECTION })?.toLowerCase().includes(filter.search.toLowerCase());
        return cond_title || cond_code || cond_category;
      });
    }
    
    // Filtre par leçon
    if (filter.lesson !== "all") {
      list = list.filter((session) => session.uid_lesson === filter.lesson);
    }
    
    // Filtre par chapitre (les sessions de la leçon qui contient ce chapitre)
    if (filter.chapter !== "all" && filter.lesson !== "all") {
      list = list.filter((session) => {
        // Vérifier que la session appartient à la leçon sélectionnée
        // et que cette leçon contient le chapitre sélectionné
        return session.uid_lesson === filter.lesson;
      });
    }
    
    // Filtre par statut
    if (filter.status !== "all") {
      list = list.filter((session) => {
        // Vérifier si au moins un slot a le statut recherché
        return session.slots?.some(slot => slot.status === filter.status);
      });
    }
    
    // Filtre par format
    if (filter.format !== "all") {
      list = list.filter((session) => {
        // Vérifier si au moins un slot a le format recherché
        return session.slots?.some(slot => slot.format === filter.format);
      });
    }
    
    // Tri des sessions
    if (sortBy !== "none") {
      list.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case "lesson":
            aValue = a.lesson?.translate?.title || a.lesson?.title || "";
            bValue = b.lesson?.translate?.title || b.lesson?.title || "";
            break;
          case "chapter":
            // Utiliser le premier slot pour obtenir le chapitre
            const aChapter = a.slots?.[0]?.uid_chapter || "";
            const bChapter = b.slots?.[0]?.uid_chapter || "";
            // Récupérer le titre du chapitre depuis lessonsWithChapters
            const aChapterObj = lessonsWithChapters[a.uid_lesson]?.find(ch => ch.uid === aChapter);
            const bChapterObj = lessonsWithChapters[b.uid_lesson]?.find(ch => ch.uid === bChapter);
            aValue = aChapterObj?.translate?.title || aChapterObj?.title || "";
            bValue = bChapterObj?.translate?.title || bChapterObj?.title || "";
            break;
          case "lessonteacher":
            // Professeur de la leçon
            aValue = a.lesson?.teacher?.name || a.lesson?.teacher?.email || "";
            bValue = b.lesson?.teacher?.name || b.lesson?.teacher?.email || "";
            break;
          case "teacher":
            // Professeur de la session
            aValue = a.teacher?.name || a.teacher?.email || "";
            bValue = b.teacher?.name || b.teacher?.email || "";
            break;
          case "status":
            // Utiliser le statut du premier slot
            aValue = a.slots?.[0]?.status || "";
            bValue = b.slots?.[0]?.status || "";
            // Comparer par ordre de priorité des statuts
            const statusOrder = {
              [ClassSessionSlot.STATUS.OPEN]: 1,
              [ClassSessionSlot.STATUS.FULL]: 2,
              [ClassSessionSlot.STATUS.VALID]: 3,
              [ClassSessionSlot.STATUS.FINISHED]: 4,
              [ClassSessionSlot.STATUS.SUBSCRIPTION_EXPIRED]: 5,
              [ClassSessionSlot.STATUS.DRAFT]: 6,
            };
            aValue = statusOrder[aValue] || 999;
            bValue = statusOrder[bValue] || 999;
            break;
          case "format":
            // Utiliser le format du premier slot
            aValue = a.slots?.[0]?.format || "";
            bValue = b.slots?.[0]?.format || "";
            // Comparer par ordre de priorité des formats
            const formatOrder = {
              [ClassSessionSlot.FORMAT.ONLINE]: 1,
              [ClassSessionSlot.FORMAT.ONSITE]: 2,
              [ClassSessionSlot.FORMAT.HYBRID]: 3,
            };
            aValue = formatOrder[aValue] || 999;
            bValue = formatOrder[bValue] || 999;
            break;
          default:
            return 0;
        }
        
        // Comparaison
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    setSessionsFilter(list);
  }, [filter, sessions, t, sortBy, sortOrder, lessonsWithChapters]);

  // Options pour les selects
  const lessonOptions = useMemo(() => {
    return [
      { id: "all", value: `-- ${t('all', { ns: NS_COMMON })} --` },
      ...lessons.map(lesson => ({
        id: lesson.uid,
        value: lesson.translate?.title || lesson.title
      }))
    ];
  }, [lessons, t]);

  const chapterOptions = useMemo(() => {
    if (filter.lesson === "all") {
      return [{ id: "all", value: `-- ${t('all', { ns: NS_COMMON })} --` }];
    }
    const chapters = lessonsWithChapters[filter.lesson] || [];
    return [
      { id: "all", value: `-- ${t('all', { ns: NS_COMMON })} --` },
      ...chapters.map(chapter => ({
        id: chapter.uid,
        value: chapter.translate?.title || chapter.title
      }))
    ];
  }, [filter.lesson, lessonsWithChapters, t]);

  const statusOptions = useMemo(() => {
    return [
      { id: "all", value: `-- ${t('all', { ns: NS_COMMON })} --` },
      ...Object.values(ClassSessionSlot.STATUS)
        .filter(status => status !== ClassSessionSlot.STATUS.UNKNOWN)
        .map(status => ({
          id: status,
          value: t(status, { ns: ClassSession.NS_COLLECTION })
        }))
    ];
  }, [t]);

  const formatOptions = useMemo(() => {
    return [
      { id: "all", value: `-- ${t('all', { ns: NS_COMMON })} --` },
      ...Object.values(ClassSessionSlot.FORMAT)
        .filter(format => format !== ClassSessionSlot.FORMAT.UNKNOWN)
        .map(format => ({
          id: format,
          value: t(format, { ns: ClassSession.NS_COLLECTION })
        }))
    ];
  }, [t]);

  const sortOptions = useMemo(() => {
    return [
      { id: "none", value: `-- ${t('no-sort', { ns: NS_SESSIONS }) || t('sort', { ns: NS_COMMON })} --` },
      { id: "lesson", value: t('lesson', { ns: ClassLesson.NS_COLLECTION }) },
      { id: "chapter", value: t('chapter', { ns: ClassLessonChapter.NS_COLLECTION }) },
      { id: "lessonteacher", value: t('lesson-teacher', { ns: NS_SESSIONS }) || `${t('lesson', { ns: ClassLesson.NS_COLLECTION })} - ${t('teacher', { ns: NS_COMMON })}` },
      { id: "teacher", value: t('teacher', { ns: NS_COMMON }) },
      { id: "status", value: t('status', { ns: NS_COMMON }) },
      { id: "format", value: t('format', { ns: ClassSession.NS_COLLECTION }) },
    ];
  }, [t]);

  const sortOrderOptions = useMemo(() => {
    return [
      { id: "asc", value: t('ascending', { ns: NS_COMMON }) || '↑' },
      { id: "desc", value: t('descending', { ns: NS_COMMON }) || '↓' },
    ];
  }, [t]);

  return (
    <div>
      <main>
        {/* BARRE DE RECHERCHE */}
        <Grid container sx={{ mb: 2.5 }} direction={'row'} alignItems={'center'} spacing={{ xs: 1, sm: 1 }}>
          <Grid size={{ xs: 12 }} sx={{ background: '' }}>
            <FieldComponent
              name={'search'}
              value={filter.search || ""}
              placeholder={t('placeholder_search', { ns: NS_SESSIONS })}
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

        {/* BARRE DE FILTRES ET TRI */}
        <Grid container sx={{ mb: 2.5 }} direction={'row'} alignItems={'center'} spacing={{ xs: 1, sm: 1 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SelectComponentDark
              label={t('lesson', { ns: ClassLesson.NS_COLLECTION })}
              name="lesson"
              value={filter.lesson}
              values={lessonOptions}
              onChange={(e) => {
                setFilter(prev => ({
                  ...prev,
                  lesson: e.target.value,
                  chapter: "all", // Réinitialiser le chapitre quand on change de leçon
                }));
              }}
              hasNull={false}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SelectComponentDark
              label={t('chapter', { ns: ClassLessonChapter.NS_COLLECTION })}
              name="chapter"
              value={filter.chapter}
              values={chapterOptions}
              onChange={(e) => {
                setFilter(prev => ({
                  ...prev,
                  chapter: e.target.value,
                }));
              }}
              hasNull={false}
              disabled={filter.lesson === "all"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SelectComponentDark
              label={t('status', { ns: NS_COMMON })}
              name="status"
              value={filter.status}
              values={statusOptions}
              onChange={(e) => {
                setFilter(prev => ({
                  ...prev,
                  status: e.target.value,
                }));
              }}
              hasNull={false}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SelectComponentDark
              label={t('format', { ns: ClassSession.NS_COLLECTION })}
              name="format"
              value={filter.format}
              values={formatOptions}
              onChange={(e) => {
                setFilter(prev => ({
                  ...prev,
                  format: e.target.value,
                }));
              }}
              hasNull={false}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SelectComponentDark
              label={t('sort-by', { ns: NS_SESSIONS }) || t('sort', { ns: NS_COMMON })}
              name="sortBy"
              value={sortBy}
              values={sortOptions}
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
              hasNull={false}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SelectComponentDark
              label={t('order', { ns: NS_COMMON }) || t('sort-order', { ns: NS_SESSIONS })}
              name="sortOrder"
              value={sortOrder}
              values={sortOrderOptions}
              onChange={(e) => {
                setSortOrder(e.target.value);
              }}
              hasNull={false}
              disabled={sortBy === "none"}
            />
          </Grid>
        </Grid>

        {/* TABLE / LISTE */}
        <section className="card">
          <div className="table-header">
            <span className="th">{""}</span>
            <span className="th">{t('session', { ns: ClassSession.NS_COLLECTION })}</span>
            <span className="th">{t('lesson', { ns: ClassLesson.NS_COLLECTION })}</span>
            <span className="th">{t('dates', { ns: NS_COMMON })}</span>
            <span className="th">{t('format', { ns: ClassSession.NS_COLLECTION })}</span>
            <span className="th">{t('status', { ns: NS_COMMON })}</span>
          </div>

          <div className="table-body">
            {isLoading ? (
              <div className="empty-state">
                {t('loading', { ns: NS_COMMON }) || 'Chargement...'}
              </div>
            ) : sessionsFilter.length === 0 ? (
              <div className="empty-state">
                {t('not-found', { ns: NS_SESSIONS })}
              </div>
            ) : (
              sessionsFilter.map((session, i) => (
                <Box 
                  key={`${session.uid}-${i}`} 
                  onClick={() => {
                    router.push(`${PAGE_SESSIONS}/${session.uid}`);
                  }} 
                  sx={{ cursor: 'pointer' }}
                >
                  <SessionRow session={session} lastChild={i === sessionsFilter.length - 1} />
                </Box>
              ))
            )}
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
          color: var(--font-color);
          font-weight: 500;
          border-bottom: 0.1px solid var(--card-border);
          background: var(--background-menu);
        }

        @media (max-width: 900px) {
          .table-header {
            display: none;
          }
        }

        .th {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
      `}</style>
    </div>
  );
}

function SessionRow({ session = null, lastChild = false }) {
  const { lang } = useLanguage();
  const { t } = useTranslation([ClassSession.NS_COLLECTION, ClassLesson.NS_COLLECTION, NS_LANGS, NS_COMMON, NS_LEVELS]);
  const {getOneLesson} = useLessonTeacher();
  // Trouver le premier slot disponible ou le plus récent
  const lesson = useMemo(() => {
    if (!session?.uid_lesson) return null;
    // Prioriser les slots ouverts
    const _lesson = getOneLesson(session?.uid_lesson);
    return _lesson;
  }, [session]);
  const mainSlot = useMemo(() => {
    if (!session?.slots || session.slots.length === 0) return null;
    // Prioriser les slots ouverts
    const openSlot = session.slots.find(slot => slot.status === ClassSessionSlot.STATUS.OPEN);
    if (openSlot) return openSlot;
    // Sinon prendre le premier
    return session.slots[0];
  }, [session]);

  const statusConfig = useMemo(() => {
    if (!mainSlot) return ClassSessionSlot.STATUS_CONFIG.draft;
    return ClassSessionSlot.STATUS_CONFIG[mainSlot.status] || ClassSessionSlot.STATUS_CONFIG.draft;
  }, [mainSlot]);

  const formatConfig = useMemo(() => {
    if (!mainSlot) return null;
    return ClassSessionSlot.FORMAT_CONFIG[mainSlot.format];
  }, [mainSlot]);

  return (
    <>
      <div className={`row ${lastChild ? 'last-child' : ''}`}>
        {/* Image */}
        <div className="cell cell-image">
          {lesson?.photo_url && (
            <Box sx={{ background: '', width: { sm: '50%' } }}>
              <Image
                src={lesson?.photo_url}
                alt={`session-${session.uid}`}
                quality={100}
                width={300}
                height={150}
                priority
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}
        </div>

        {/* Session */}
        <div className="cell cell-session">
          <div className="session-text">
            <p className="session-name">{session.code || session.title || t('session', { ns: ClassSession.NS_COLLECTION })}</p>
            <p className="session-id">{session.lesson?.translate?.title || session.lesson?.title}</p>
            {session.teacher && (
              <p className="session-teacher" style={{ fontSize: '0.75rem', color: 'var(--grey-light)', marginTop: '4px' }}>
                {t('teacher', { ns: NS_COMMON })}: {session.teacher.name || session.teacher.email}
              </p>
            )}
          </div>
        </div>

        {/* Leçon */}
        <div className="cell cell-lesson">
          <div className="lesson-text">
            <p className="lesson-name">{session.lesson?.translate?.title || session.lesson?.title}</p>
            <p className="lesson-category">{t(session.lesson?.category, { ns: ClassLesson.NS_COLLECTION })}</p>
            {mainSlot && (
              <p className="lesson-level" style={{ fontSize: '0.75rem', color: 'var(--grey-light)', marginTop: '4px' }}>
                {t('level', { ns: NS_COMMON })}: {t(mainSlot.level, { ns: NS_LEVELS })}
              </p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="cell cell-dates">
          {mainSlot ? (
            <>
              <p className="text-main">
                {getFormattedDateNumeric(mainSlot.start_date, lang)}
              </p>
              <p className="text-sub">
                {getFormattedHour(mainSlot.start_date, lang)} - {getFormattedHour(mainSlot.end_date, lang)}
              </p>
              {mainSlot.duration > 0 && (
                <p className="text-sub" style={{ marginTop: '4px' }}>
                  {formatDuration(mainSlot.duration)}
                </p>
              )}
            </>
          ) : (
            <p className="text-main">-</p>
          )}
        </div>

        {/* Format */}
        <div className="cell cell-format">
          {formatConfig ? (
            <Stack direction={'column'} alignItems={'start'} spacing={1} flexWrap="wrap">
              <BadgeFormatLesson format={mainSlot.format} />
              {mainSlot.location && (
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--grey-light)'}}>
                  {mainSlot.location}
                </Typography>
              )}
            </Stack>
          ) : (
            <p className="text-main">-</p>
          )}
        </div>

        {/* Statut */}
        <div className="cell cell-status">
          {mainSlot ? (
            <Stack direction={'row'} alignItems={'center'} spacing={0.5} flexWrap="wrap">
              <div 
                className="status-badge"
                style={{
                  backgroundColor: statusConfig?.glow || statusConfig?.color,
                  color: statusConfig?.color,
                  borderColor: statusConfig?.color,
                }}
              >
                {t(mainSlot.status, { ns: ClassSession.NS_COLLECTION })}
              </div>
              {mainSlot.seats_availables_onsite > 0 && (
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--grey-light)' }}>
                  {t('seats', { ns: ClassSession.NS_COLLECTION })}: {mainSlot.seats_availables_onsite}
                </Typography>
              )}
            </Stack>
          ) : (
            <p className="text-main">-</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .row {
          display: grid;
          ${TABLE_SPACE}
          gap: 8px;
          padding: 10px 16px;
          font-size: 0.85rem;
          border-bottom: 0.1px solid var(--card-border);
          align-items: center;
        }

        .row.last-child {
          border-bottom: none;
        }

        .cell {
          min-width: 0;
        }

        .session-text,
        .lesson-text {
          min-width: 0;
        }

        .session-name,
        .lesson-name {
          margin: 0;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--font-color);
        }

        .session-id,
        .lesson-category {
          margin: 0;
          font-size: 0.75rem;
          color: var(--grey-light);
        }

        .text-main {
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--font-color);
        }

        .text-sub {
          margin: 0;
          font-size: 0.75rem;
          color: var(--grey-light);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          border: 0.1px solid;
          padding: 2px 8px;
          font-size: 0.75rem;
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
        }
      `}</style>
    </>
  );
}

export default function SessionsPage() {
  const { t } = useTranslation([NS_SESSIONS, NS_DASHBOARD_MENU, NS_BUTTONS]);
  const { user } = useAuth();

  return (
    <DashboardPageWrapper
      titles={[{ name: t('sessions', { ns: NS_DASHBOARD_MENU }) || t('title', { ns: NS_SESSIONS }), url: '' }]}
      subtitle={t('subtitle', { ns: NS_SESSIONS })}
      icon={<IconSession width={22} height={22} />}
    >
      <Stack alignItems={'start'} spacing={1.5} sx={{ width: '100%', height: '100%' }}>
        <SessionsComponent />
      </Stack>
    </DashboardPageWrapper>
  );
}
