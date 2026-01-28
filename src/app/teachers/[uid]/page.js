"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { IconCertificate, IconEmail, IconLessons, IconPhone, IconSearch, IconTeachers } from "@/assets/icons/IconsComponent";
import { NS_BUTTONS, NS_COMMON, NS_DASHBOARD_MENU, NS_TEACHERS } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import { Box, Button, Chip, CircularProgress, Container, Grid, Link as MuiLink, Paper, Stack, Typography } from '@mui/material';
import FieldComponent from '@/components/elements/FieldComponent';
import { ClassUser, ClassUserTeacher } from '@/classes/users/ClassUser';
import { useUsers } from '@/contexts/UsersProvider';
import { useLanguage } from '@/contexts/LangProvider';
import { ClassColor } from '@/classes/ClassColor';
import { useRouter, useParams } from 'next/navigation';
import { PAGE_TEACHERS, PAGE_LESSONS, PAGE_LESSONS_TEACHER } from '@/contexts/constants/constants_pages';
import { NS_LANGS, NS_ROLES } from '@/contexts/i18n/settings';
import { useLessonTeacher } from '@/contexts/LessonTeacherProvider';
import { useSession } from '@/contexts/SessionProvider';
import { ClassSession, ClassSessionSlot } from '@/classes/ClassSession';
import { ClassLesson } from '@/classes/ClassLesson';
import { getFormattedDateNumeric, getFormattedHour, formatPrice } from '@/contexts/functions';
import BadgeStatusSlot from '@/components/dashboard/sessions/BadgeStatusSlot';
import Image from 'next/image';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import LanguageIcon from '@mui/icons-material/Language';

function TeacherProfileComponent() {
  const router = useRouter();
  const params = useParams();
  const uid = params?.uid;
  const { lang } = useLanguage();
  const { theme } = useThemeMode();
  const { text, cardColor } = theme.palette;
  const { t } = useTranslation([ClassUser.NS_COLLECTION, NS_TEACHERS, NS_ROLES, NS_LANGS, ClassSession.NS_COLLECTION, ClassLesson.NS_COLLECTION]);
  const { getOneUser, isLoading: isLoadingUsers } = useUsers();
  const { lessons, isLoading: isLoadingLessons } = useLessonTeacher();
  const { slots, sessions, isLoading: isLoadingSessions, getOneSession } = useSession();
  
  const [filter, setFilter] = useState({
    search: "",
  });

  // Récupérer le professeur
  const teacher = useMemo(() => {
    if (!uid) return null;
    return getOneUser(uid);
  }, [uid, getOneUser]);

  // Filtrer les cours du professeur
  const teacherLessons = useMemo(() => {
    if (!teacher || !lessons) return [];
    return lessons.filter(lt => lt?.uid_teacher === teacher.uid);
  }, [teacher, lessons]);

  // Filtrer les cours par recherche
  const [lessonsFilter, setLessonsFilter] = useState([]);
  useEffect(() => {
    let list = [...teacherLessons];
    if (filter.search.length) {
      list = list.filter((lesson) => {
        const cond_title = lesson.title?.toLowerCase().includes(filter.search.toLowerCase()) ||
                          lesson.translate?.title?.toLowerCase().includes(filter.search.toLowerCase());
        const cond_subtitle = lesson.subtitle?.toLowerCase().includes(filter.search.toLowerCase()) ||
                             lesson.translate?.subtitle?.toLowerCase().includes(filter.search.toLowerCase());
        return cond_title || cond_subtitle;
      });
    }
    setLessonsFilter(list);
  }, [filter.search, teacherLessons]);

  // Filtrer les sessions ouvertes du professeur
  const openSessions = useMemo(() => {
    if (!teacher || !slots) return [];
    return slots.filter(slot => {
      const session = getOneSession(slot.uid_session);
      return session?.uid_teacher === teacher.uid && 
             (slot.status === ClassSessionSlot.STATUS.OPEN || slot.status === ClassSessionSlot.STATUS.FULL);
    }).sort((a, b) => {
      const dateA = a.start_date instanceof Date ? a.start_date : (a.start_date?.toDate?.() || new Date(0));
      const dateB = b.start_date instanceof Date ? b.start_date : (b.start_date?.toDate?.() || new Date(0));
      return dateA.getTime() - dateB.getTime();
    });
  }, [teacher, slots, getOneSession]);

  if (isLoadingUsers || !teacher) {
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
    <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
      <Stack spacing={3}>
        {/* Header avec informations du professeur */}
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
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              {/* Avatar */}
              <Box>
                {teacher.showAvatar?.({ size: 120, fontSize: '48px' })}
              </Box>
              
              {/* Informations principales */}
              <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {teacher.last_name || ''} {teacher.first_name || ''}
                  </Typography>
                  {teacher.certified && (
                    <Chip
                      icon={<IconCertificate height={18} width={18} color="var(--primary)" />}
                      label={t('certified', { ns: ClassUser.NS_COLLECTION })}
                      size="small"
                      sx={{
                        bgcolor: 'var(--primary-shadow-xs)',
                        color: 'var(--primary)',
                        border: '1px solid var(--primary-shadow-md)',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Stack>
                
                {teacher.role_title && (
                  <Typography variant="h6" sx={{ color: 'var(--grey)', fontWeight: 500 }}>
                    {teacher.role_title}
                  </Typography>
                )}
                
                {teacher.bio && (
                  <Typography variant="body1" sx={{ color: 'var(--font-color)', lineHeight: 1.6 }}>
                    {teacher.bio}
                  </Typography>
                )}

                {/* Tags */}
                {teacher.tags && Array.isArray(teacher.tags) && teacher.tags.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {teacher.tags.map((tag, i) => (
                      <Chip
                        key={i}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: 'var(--primary-shadow-xs)',
                          border: '1px solid var(--primary-shadow-md)',
                          color: 'var(--primary)',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          height: '28px',
                          '&:hover': {
                            bgcolor: 'var(--primary-shadow-sm)',
                            borderColor: 'var(--primary)',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      />
                    ))}
                  </Stack>
                )}

                {/* Contact */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                  {teacher.email && (
                    <Button
                      component={MuiLink}
                      href={`mailto:${teacher.email}`}
                      startIcon={<EmailIcon />}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        borderColor: 'var(--primary)',
                        color: 'var(--primary)',
                        '&:hover': {
                          borderColor: 'var(--primary)',
                          bgcolor: 'var(--primary-shadow-xs)',
                        },
                      }}
                    >
                      {teacher.email}
                    </Button>
                  )}
                  {teacher.phone_number && (
                    <Button
                      component={MuiLink}
                      href={`tel:${teacher.phone_number}`}
                      startIcon={<PhoneIcon />}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        borderColor: 'var(--primary)',
                        color: 'var(--primary)',
                        '&:hover': {
                          borderColor: 'var(--primary)',
                          bgcolor: 'var(--primary-shadow-xs)',
                        },
                      }}
                    >
                      {teacher.phone_number}
                    </Button>
                  )}
                </Stack>

                {/* Langues */}
                {teacher.langs && Array.isArray(teacher.langs) && teacher.langs.length > 0 && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LanguageIcon sx={{ fontSize: 18, color: 'var(--grey)' }} />
                    <Typography variant="body2" sx={{ color: 'var(--grey)' }}>
                      {teacher.langs.map(lang => t(lang, { ns: NS_LANGS })).join(', ')}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        {/* Sessions ouvertes */}
        {openSessions.length > 0 && (
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
              <Stack direction="row" spacing={1} alignItems="center">
                <EventIcon sx={{ color: 'var(--primary)', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t('open-sessions', { ns: NS_TEACHERS, defaultValue: 'Sessions ouvertes' })}
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {isLoadingSessions ? (
                  <Stack alignItems="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} sx={{ color: "var(--primary)" }} />
                  </Stack>
                ) : openSessions.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'var(--grey-light)', textAlign: 'center', py: 2 }}>
                    {t('no-open-sessions', { ns: NS_TEACHERS, defaultValue: 'Aucune session ouverte' })}
                  </Typography>
                ) : (
                  openSessions.map((slot) => {
                    const session = getOneSession(slot.uid_session);
                    return (
                      <Paper
                        key={`${slot.uid_session}-${slot.uid_intern}`}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid var(--card-border)',
                          bgcolor: 'var(--card-color)',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            transform: 'translateY(-2px)',
                            borderColor: 'var(--primary)',
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                            <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {session?.lesson?.translate?.title || session?.lesson?.title || ''}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'var(--grey)' }}>
                                {`${getFormattedDateNumeric(slot.start_date, lang)} → ${getFormattedHour(slot.start_date, lang)}-${getFormattedHour(slot.end_date, lang)}`}
                              </Typography>
                            </Stack>
                            <BadgeStatusSlot status={slot.status} />
                          </Stack>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {slot.location && (
                              <Chip
                                size="small"
                                label={slot.location}
                                sx={{
                                  bgcolor: 'var(--card-color)',
                                  border: '1px solid var(--card-border)',
                                  color: 'var(--font-color)',
                                }}
                              />
                            )}
                            {slot.seats_availables_online > 0 && (
                              <Chip
                                size="small"
                                label={`${t(ClassSessionSlot.FORMAT.ONLINE)}: ${slot.countFree?.(ClassSessionSlot.FORMAT.ONLINE) || 0}`}
                                sx={{
                                  bgcolor: 'var(--card-color)',
                                  border: '1px solid var(--card-border)',
                                  color: 'var(--font-color)',
                                }}
                              />
                            )}
                            {slot.seats_availables_onsite > 0 && (
                              <Chip
                                size="small"
                                label={`${t(ClassSessionSlot.FORMAT.ONSITE)}: ${slot.countFree?.(ClassSessionSlot.FORMAT.ONSITE) || 0}`}
                                sx={{
                                  bgcolor: 'var(--card-color)',
                                  border: '1px solid var(--card-border)',
                                  color: 'var(--font-color)',
                                }}
                              />
                            )}
                          </Stack>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => router.push(`${PAGE_LESSONS}/${session?.uid_lesson}`)}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                borderColor: 'var(--primary)',
                                color: 'var(--primary)',
                                '&:hover': {
                                  borderColor: 'var(--primary)',
                                  bgcolor: 'var(--primary-shadow-xs)',
                                },
                              }}
                            >
                              {t('see-lesson', { ns: NS_BUTTONS })}
                            </Button>
                          </Stack>
                        </Stack>
                      </Paper>
                    );
                  })
                )}
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Liste des cours */}
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
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" flexWrap="wrap">
              <Stack direction="row" spacing={1} alignItems="center">
                <SchoolIcon sx={{ color: 'var(--primary)', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t('lessons', { ns: ClassLesson.NS_COLLECTION })}
                </Typography>
              </Stack>
            </Stack>

            {/* Barre de recherche */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FieldComponent
                  name={'search'}
                  value={filter.search || ""}
                  placeholder={t('placeholder_search', { ns: NS_TEACHERS, defaultValue: 'Rechercher un cours...' })}
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

            {/* Liste des cours */}
            <Stack spacing={2}>
              {isLoadingLessons ? (
                <Stack alignItems="center" sx={{ py: 3 }}>
                  <CircularProgress size={30} sx={{ color: "var(--primary)" }} />
                </Stack>
              ) : lessonsFilter.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'var(--grey-light)', textAlign: 'center', py: 2 }}>
                  {t('no-lessons', { ns: NS_TEACHERS, defaultValue: 'Aucun cours disponible' })}
                </Typography>
              ) : (
                lessonsFilter.map((lesson, i) => (
                  <Paper
                    key={lesson.uid}
                    elevation={0}
                    onClick={() => router.push(`${PAGE_LESSONS}/${lesson.uid_lesson}${PAGE_LESSONS_TEACHER}/${lesson.uid}`)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid var(--card-border)',
                      bgcolor: 'var(--card-color)',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        transform: 'translateY(-2px)',
                        borderColor: 'var(--primary)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                      {lesson.translate?.photo_url && (
                        <Box
                          sx={{
                            width: { xs: '100%', sm: 120 },
                            height: { xs: 150, sm: 200 },
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative',
                            bgcolor: 'var(--grey-hyper-light)',
                            flexShrink: 0,
                          }}
                        >
                          <Image
                            src={lesson.translate.photo_url}
                            alt={lesson.title || lesson.translate?.title}
                            fill
                            sizes="120px"
                            style={{ objectFit: 'cover' }}
                          />
                        </Box>
                      )}
                      <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {lesson.title || lesson.translate?.title || ''}
                        </Typography>
                        {lesson.subtitle || lesson.translate?.subtitle ? (
                          <Typography variant="body2" sx={{ color: 'var(--grey)' }}>
                            {lesson.subtitle || lesson.translate?.subtitle}
                          </Typography>
                        ) : null}
                        {lesson.translate?.description || lesson.description ? (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'var(--grey-light)', 
                              lineHeight: 1.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {lesson.translate?.description || lesson.description}
                          </Typography>
                        ) : null}
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          {lesson.level && (
                            <Chip
                              size="small"
                              label={lesson.level}
                              sx={{
                                bgcolor: 'var(--card-color)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--font-color)',
                              }}
                            />
                          )}
                          {lesson.certified && (
                            <span className="badge-cert">
                              🎓 {t('certified', { ns: ClassLesson.NS_COLLECTION })}
                            </span>
                          )}
                        </Stack>
                        {(lesson.price || lesson.old_price) && (
                          <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap">
                            {lesson.price && (
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: 700,
                                  color: 'var(--font-color)',
                                }}
                              >
                                {formatPrice(lesson.price, lesson.currency)}
                              </Typography>
                            )}
                            {lesson.old_price && lesson.old_price > 0 && (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'var(--error)',
                                  textDecoration: 'line-through',
                                  opacity: 0.7,
                                }}
                              >
                                {formatPrice(lesson.old_price, lesson.currency)}
                              </Typography>
                            )}
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </Stack>
        </Paper>
      </Stack>

      <style jsx>{`
        .badge-cert {
          border-radius: 12px;
          padding: 6px 14px;
          font-size: 0.85rem;
          font-weight: 500;
          background: rgba(34, 197, 94, 0.1);
          color: var(--success);
          border: 1px solid rgba(34, 197, 94, 0.3);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .badge-cert:hover {
          background: rgba(34, 197, 94, 0.15);
          transform: translateY(-1px);
        }
      `}</style>
    </Container>
  );
}

export default function TeacherProfilePage() {
  const { t } = useTranslation([NS_TEACHERS, NS_DASHBOARD_MENU, NS_BUTTONS]);
  const params = useParams();
  const uid = params?.uid;
  const { getOneUser } = useUsers();
  const teacher = useMemo(() => {
    if (!uid) return null;
    return getOneUser(uid);
  }, [uid, getOneUser]);

  return (
    <DashboardPageWrapper
      titles={[
        { name: t('tutors', { ns: NS_DASHBOARD_MENU }), url: PAGE_TEACHERS },
        { name: teacher ? `${teacher.last_name || ''} ${teacher.first_name || ''}` : '', url: '' }
      ]}
      subtitle={teacher?.role_title || ''}
      icon={<IconTeachers width={22} height={22} />}
    >
      <Stack alignItems={'start'} spacing={1.5} sx={{ width: '100%', height: '100%' }}>
        <TeacherProfileComponent />
      </Stack>
    </DashboardPageWrapper>
  );
}
