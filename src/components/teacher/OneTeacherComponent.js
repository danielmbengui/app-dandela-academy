import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Rating,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Grid,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedIcon from "@mui/icons-material/Verified";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import LanguageIcon from "@mui/icons-material/Language";
import RoomIcon from "@mui/icons-material/Room";
import LinkIcon from "@mui/icons-material/Link";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import StarIcon from "@mui/icons-material/Star";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useTeachers } from "@/contexts/TeachersProvider";
import { IconBio, IconEmail, IconLessons, IconLocation, IconPhone, IconTranslation } from "@/assets/icons/IconsComponent";
import { NS_LANGS, NS_TEACHERS } from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import { ClassLesson } from "@/classes/ClassLesson";
import Link from "next/link";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import BadgeFormatLesson from "../dashboard/lessons/BadgeFormatLesson";
import BadgeStatusLesson from "../dashboard/lessons/BadgeStatusLesson";
import { useSession } from "@/contexts/SessionProvider";
import { useLesson } from "@/contexts/LessonProvider";
import BadgeStatusSlot from "../dashboard/sessions/BadgeStatusSlot";
import { getFormattedDateNumeric, getFormattedHour } from "@/contexts/functions";
import { useLanguage } from "@/contexts/LangProvider";
import { ClassSession, ClassSessionSlot } from "@/classes/ClassSession";
import { t } from "i18next";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import DialogSession from "../dashboard/sessions/DialogSession";

const ROYAL = "#2563EB";
const NAVY = "#0B1B4D";
/* -------------------- UI components -------------------- */
function CardSection({ title, subtitle, right, children, id }) {
  return (
    <Paper
      id={id}
      elevation={0}
      sx={{
        borderRadius: 5,
        p: 1.5,
        border: "1px solid rgba(15, 23, 42, 0.10)",
        bgcolor: "#FFFFFF",
        width: '100%'
      }}
    >
      <Stack spacing={1.2}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Stack spacing={0.15}>
            <Typography variant="h5" sx={{ fontWeight: 950, color: NAVY, lineHeight: 1.1 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Stack>
          {right ? right : null}
        </Stack>

        <Divider sx={{ borderColor: "rgba(15,23,42,0.10)" }} />
        {children}
      </Stack>
    </Paper>
  );
}
function StatCard({ icon, title, value, sub, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.6,
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.18)",
        color: 'white'
      }}
    >
      <Stack spacing={0.8}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 900 }}>
            {title}
          </Typography>
        </Stack>

        <Typography variant="h4" sx={{ fontWeight: 950, lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          {sub}
        </Typography>

        {children}
      </Stack>
    </Paper>
  );
}
function CardBio({ label, value }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        p: 1.1,
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.18)",
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <IconBio />
      </Avatar>
      <Stack sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 900 }} >
          {`Bio`}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.85 }} noWrap title={value}>
          {value || "—"}
        </Typography>
      </Stack>
    </Stack>
  );
}
function MiniInfoRow({ icon, label, value }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        p: 1.1,
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.18)",
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        {icon}
      </Avatar>
      <Stack sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 900 }} noWrap title={value}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.85, color: 'white' }}>
          {value || "—"}
        </Typography>
      </Stack>
    </Stack>
  );
}
function ModernCourseTile({ course, onOpen }) {
  return (
    <Paper
      elevation={0}
      onClick={onOpen}
      sx={{
        p: 1.6,
        borderRadius: 5,
        cursor: "pointer",
        width: '100%',
        border: "1px solid rgba(15, 23, 42, 0.10)",
        "&:hover": {
          borderColor: "rgba(37,99,235,0.35)",
          boxShadow: "0 16px 40px rgba(2,6,23,0.08)",
          transform: "translateY(-1px)",
        },
        transition: "all .18s ease",
      }}
    >
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              width: 52,
              height: 52,
              borderRadius: 4,
              bgcolor: "rgba(37,99,235,0.12)",
              color: ROYAL,
            }}
          >
            <SchoolIcon />
          </Avatar>
          <Stack sx={{ minWidth: 0, flex: 1 }} spacing={0.2}>
            <Typography variant="body1" sx={{ fontWeight: 950, color: NAVY }} noWrap title={course.title}>
              {course.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {course.code} • {course.level}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 950, color: NAVY }}>
              {formatMoney(course.price, course.currency)}
            </Typography>
          </Stack>

        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip size="small" label={formatLabel(course.format)} sx={softChipSx} />
          <Chip size="small" label="Voir le cours →" sx={softChipGhostSx} />
        </Stack>
      </Stack>
    </Paper>
  );
}
function ModernSessionRow({ slot = null, session = null, onOpen, onSubscribe }) {
  const { t } = useTranslation(ClassSession.NS_COLLECTION);
  const startText = formatDate(slot.start_date);
  const endText = formatDate(slot.end_date);
  const { lang } = useLanguage();
  const { setUidSession, setUidSlot } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('');
  const [initStartDate, setInitStartDate] = useState(null);

  const seatsLeftOnsite = Math.max(
    0,
    Number(slot.seats_availables_onsite || 0) - (slot.subscribers_onsite?.length || 0)
  );
  const seatsLeftOnline = Math.max(
    0,
    Number(slot.seats_availables_online || 0) - (slot.subscribers_online?.length || 0)
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.6,
        borderRadius: 5,
        border: "1px solid rgba(15, 23, 42, 0.10)",
        border: "0.1px solid var(--card-border)",
        bgcolor: "var(--card-color)",
      }}
    >
      <Stack spacing={1}>
        {
          mode === 'read' && <DialogSession
            mode={mode}
            setMode={setMode}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            initStartDate={initStartDate}
            setInitStartDate={setInitStartDate}
          />
        }
        <Stack direction={{ xs: 'column-reverse', sm: "row" }} justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Stack spacing={0.2} sx={{ minWidth: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 950, color: "var(--grey-light)" }} title={slot.lesson_title}>
              {slot?.lesson?.translate?.title || slot?.lesson?.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {`${getFormattedDateNumeric(slot?.start_date, lang)} → ${getFormattedHour(slot?.start_date, lang)}-${getFormattedHour(slot?.end_date, lang)}`}
            </Typography>
          </Stack>
          <BadgeStatusSlot status={slot?.status} />
        </Stack>
        <Stack direction={{ xs: 'column', sm: "row" }} justifyContent={'space-between'} spacing={1} flexWrap="wrap">
          {slot.location ? <Chip size="small" icon={<IconLocation height={18} />} label={slot.location} sx={softChipSx} /> : null}
          <Stack alignItems={'center'} direction={'row'} spacing={0.5}>
            {slot.seats_availables_online > 0 ? (
              <Chip
                size="small"
                label={`${t(ClassSessionSlot.FORMAT.ONLINE)}: ${slot?.countFree?.(ClassSessionSlot.FORMAT.ONLINE)}`}
                sx={softChipGhostSx}
              />
            ) : null}
            {slot.seats_availables_onsite > 0 ? (
              <Chip
                size="small"
                label={`${t(ClassSessionSlot.FORMAT.ONSITE)}: ${slot?.countFree?.(ClassSessionSlot.FORMAT.ONSITE)}`}
                sx={softChipGhostSx}
              />
            ) : null}
          </Stack>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={0.5}>
          <Link target="_blank" style={{ width: '100%' }} href={`${PAGE_LESSONS}/${session?.uid_lesson}`}>
            <ButtonCancel fullWidth={true} label={`Voir le cours`} />
          </Link>

          <ButtonConfirm
            fullWidth={true}
            label={`Voir la session`}
            disabled={slot?.status !== ClassSessionSlot.STATUS.OPEN}
            onClick={() => {
              setIsOpen(true);
              setUidSession(slot.uid_session);
              setUidSlot(slot.uid_intern);
              setMode('read');
            }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
function ModernReviewCompact({ review }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 5,
        border: "1px solid rgba(15, 23, 42, 0.10)",
      }}
    >
      <Stack spacing={0.8}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography variant="body2" sx={{ fontWeight: 950, color: NAVY }} noWrap title={review.author}>
            {review.author}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDateOnly(review.date)}
          </Typography>
        </Stack>
        <Rating value={review.rating} readOnly size="small" />
        <Typography variant="body2" color="text.secondary">
          {review.comment}
        </Typography>
      </Stack>
    </Paper>
  );
}
/* -------------------- Styles -------------------- */
const primaryBtnSx = {
  borderRadius: 4,
  fontWeight: 950,
  textTransform: "none",
  bgcolor: "rgba(255,255,255,0.18)",
  border: "1px solid rgba(255,255,255,0.24)",
  "&:hover": { bgcolor: "rgba(255,255,255,0.24)" },
};
const primaryBtnSxSolid = {
  borderRadius: 4,
  fontWeight: 950,
  textTransform: "none",
  bgcolor: ROYAL,
  "&:hover": { bgcolor: "#1D4ED8" },
};
const outlineBtnSx = {
  borderRadius: 4,
  fontWeight: 950,
  textTransform: "none",
  borderColor: "rgba(37,99,235,0.35)",
  color: ROYAL,
  "&:hover": { borderColor: ROYAL, bgcolor: "rgba(37,99,235,0.06)" },
};
const outlineBtnSxWhite = {
  borderRadius: 4,
  fontWeight: 950,
  textTransform: "none",
  borderColor: "rgba(255,255,255,0.45)",
  color: "white",
  "&:hover": { borderColor: "rgba(255,255,255,0.8)", bgcolor: "rgba(255,255,255,0.12)" },
};
const softChipSx = {
  bgcolor: "rgba(37,99,235,0.08)",
  bgcolor: "var(--primary-shadow)",
  color: "var(--primary)",
  border: "0.1px solid var(--primary)",
  fontWeight: 800,
  "& .MuiChip-icon": { color: "var(--primary)" },
  height: 'auto',
  '& .MuiChip-label': {
    display: 'flex',
    whiteSpace: 'normal',
  },
};
const softChipGhostSx = {
  bgcolor: "rgba(15,23,42,0.04)",
  bgcolor: "var(--card-border)",
  //bgcolor: "var(--primary-shadow)",
  color: "var(--font-color)",
  border: "1px solid rgba(15,23,42,0.10)",
  border: "1px solid var(--card-border)",
  fontWeight: 400,
};
/* -------------------- Formatters -------------------- */
function formatLabel(format) {
  if (format === "onsite") return "Présentiel";
  if (format === "online") return "En ligne";
  return "Hybride";
}
function formatDate(value) {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function formatDateOnly(value) {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
function formatMoney(amount, currency) {
  const n = Number(amount || 0);
  try {
    return new Intl.NumberFormat("fr-CH", {
      style: "currency",
      currency: currency || "CHF",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n} ${currency || ""}`.trim();
  }
}

function CardLessonsComponent({ courses = [] }) {
  const { t } = useTranslation([NS_TEACHERS, ClassLesson.NS_COLLECTION]);
  const { lessons } = useLesson();
  //const { slots } = useSession();
  //const today = new Date();

  return (<>
    <div className="hero-right-top">
      <Stack spacing={1} sx={{ width: '100%' }}>
        <Stack sx={{ width: '100%' }}>
          <p className="teacher-title">{t('Cours proposés')}</p>
        </Stack>
        <Divider sx={{ borderColor: 'var(--card-border)', borderWidth: '0.1px', opacity: 0.6 }} />
        <Grid container spacing={1} sx={{ display: 'flex' }}>
          {lessons.map((c) => (<Grid key={c.uid} size={{ xs: 12, sm: 12 }}>
            <Stack alignItems={'end'} spacing={0.5} sx={{ width: '100%', p: 1.5, borderRadius: '10px', border: `0.1px solid var(--card-border)`, background: '' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={'center'} sx={{ width: '100%', background: '' }}>
                <Stack sx={{ p: 1, borderRadius: '10px', background: 'var(--primary-shadow)' }}>
                  <IconLessons color="var(--primary)" width={30} height={30} />
                </Stack>
                <Stack>
                  <p className="teacher-title">{c.translate?.title}</p>
                  <Typography variant="caption">{t(c.category, { ns: ClassLesson.NS_COLLECTION }) || '---'}</Typography>
                  {
                    c.certified && <div className="badges">
                      <span className="badge-cert">
                        🎓 {t('certified', { ns: ClassLesson.NS_COLLECTION })}
                      </span>
                    </div>
                  }
                </Stack>
              </Stack>
              <Link href={`${PAGE_LESSONS}/${c.uid}`} target="_blank">
                <ButtonCancel label="Voir le cours" />
              </Link>
            </Stack>
          </Grid>))}
        </Grid>


      </Stack>
    </div>
    <style jsx>{`
                .badges {
                  margin-top: 5px;
                  display: flex;
                  gap: 5px;
                  flex-wrap: wrap;
                }
                .badge-cert {
                  border-radius: 999px;
                  padding: 2px 10px;
                  font-size: 0.8rem;
                  background: #022c22;
                  background: transparent;
                  color: #bbf7d0;
                  color: var(--font-color);
                  border: 0.1px solid #16a34a;
                   white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
                }
                .hero-right-top {
                width: 100%;
                  border-radius: 14px;
                  border: 0.1px solid var(--card-border);
                  padding: 10px 10px 12px;
                  padding: 15px;
                  background: var(--card-color);
                }
                .teacher-title {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: var(--font-color);
                  line-height: 1.05rem;
                }
                .teacher-subtitle {
                  font-size: 0.75rem;
                  font-size: 0.85rem;
                  font-weight: 300;
                  color: var(--grey-light);
                  line-height: 1rem;
                }
                .teacher-title-text {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: #9ca3af;
                  margin-bottom: 6px;
                }
  `}</style>
  </>)
}
function CardSessionsComponent({ courses = [] }) {
  const { t } = useTranslation([NS_TEACHERS, ClassLesson.NS_COLLECTION]);
  const { teacher } = useTeachers();
  const { sessions, slots, getOneSession, isLoading } = useSession();
  //const { slots } = useSession();
  //const today = new Date();
  //console.log("sessions ", sessions)

  return (<>
    <div className="hero-right-top">
      <Stack spacing={1} sx={{ width: '100%' }}>
        <Stack sx={{ width: '100%' }}>
          <p className="teacher-title">{t('Sessions à venir')}</p>
          <p className="teacher-subtitle">{t('Inscris-toi rapidement à une ou plusieurs sessions')}</p>
        </Stack>
        <Divider sx={{ borderColor: 'var(--card-border)', borderWidth: '0.1px', opacity: 0.6 }} />
        {
          isLoading && <Skeleton variant="rounded" width={'100%'} height={'20px'} sx={{ bgcolor: 'var(--card-border)' }} />
        }
        {
          !isLoading && slots?.length === 0 && <Typography>{`Il n'y a aucune session à venir`}</Typography>
        }
        {
          slots?.length > 0 && <Grid container spacing={1} sx={{ display: 'flex' }}>
            {slots.map((slot) => {
              const session = getOneSession(slot.uid_session);
              return (<Grid key={`${slot.uid_session}-${slot.uid_intern}`} size={{ xs: 12, sm: 12 }}>
                <ModernSessionRow slot={slot} session={session} />
              </Grid>)
            })}
          </Grid>
        }
      </Stack>
    </div>
    <style jsx>{`
                .badges {
                  margin-top: 5px;
                  display: flex;
                  gap: 5px;
                  flex-wrap: wrap;
                }
                .badge-cert {
                  border-radius: 999px;
                  padding: 2px 10px;
                  font-size: 0.8rem;
                  background: #022c22;
                  background: transparent;
                  color: #bbf7d0;
                  color: var(--font-color);
                  border: 0.1px solid #16a34a;
                   white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
                }
                .hero-right-top {
                width: 100%;
                  border-radius: 14px;
                  border: 0.1px solid var(--card-border);
                  padding: 10px 10px 12px;
                  padding: 15px;
                  background: var(--card-color);
                }
                .teacher-title {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: var(--font-color);
                  line-height: 1.05rem;
                }
                .teacher-subtitle {
                  font-size: 0.75rem;
                  font-size: 0.85rem;
                  font-weight: 300;
                  color: var(--grey-light);
                  line-height: 1rem;
                }
                .teacher-title-text {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: #9ca3af;
                  margin-bottom: 6px;
                }
  `}</style>
  </>)
}
export default function OneTeacherComponent() {
  const router = useRouter();
  const { teacher: myTeacher } = useTeachers();

  //console.log("TEACHER", myTeacher)
  // ---- MOCK (remplace par Firestore) ----
  const teacher = useMemo(
    () => ({
      uid: "teacher_01",
      first_name: "Afonso José",
      last_name: "Gila Nhanga ohofhgofdohfd",
      headline: "Formatrice Excel • Bureautique • Productivité",
      verified: true,
      photo_url:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80&auto=format&fit=crop",
      about_short:
        "Cours ultra pratiques, fichiers fournis, objectifs clairs. On avance vite, sans blabla.",
      bio: `Je forme des étudiants et des professionnels depuis 8 ans.
J’accompagne aussi des équipes sur l’automatisation de leurs fichiers : tableaux de bord, reporting, modèles de suivi.

Mon approche : claire, efficace, basée sur des exercices concrets.`,
      languages: ["Français", "Português"],
      location: "Luanda / En ligne",
      email: "maria.cruz@dandela.academy",
      phone: "+244 900 000 000",
      socials: {
        linkedin: "https://linkedin.com/in/teacher-demo",
        instagram: "https://instagram.com/teacher-demo",
        website: "https://example.com",
      },
      tags: ["Excel", "Dashboards", "Formules", "Analyse", "Productivité"],
      rating_avg: 4.8,
      rating_count: 132,
      stats: {
        students: 860,
        courses: 12,
        sessions: 64,
        completion: 96, // %
      },
      ...myTeacher?.toJSON()
    }),
    []
  );
  const courses = useMemo(
    () => [
      { uid: "lesson_excel_101", code: "EXCEL-101", title: "Excel Débutant", level: "Débutant", format: "hybrid", price: 2500, currency: "AOA" },
      { uid: "lesson_excel_dash", code: "EXCEL-240", title: "Excel Tableaux de bord", level: "Avancé", format: "onsite", price: 5000, currency: "AOA" },
      { uid: "lesson_excel_power", code: "EXCEL-320", title: "Excel Power (Formules + Analyse)", level: "Intermédiaire", format: "online", price: 3500, currency: "AOA" },
      { uid: "lesson_excel_clean", code: "EXCEL-180", title: "Nettoyer & Structurer ses données", level: "Intermédiaire", format: "hybrid", price: 3000, currency: "AOA" },
    ],
    []
  );
  const upcomingSessions = useMemo(
    () => [
      {
        uid: "session_001",
        uid_lesson: "lesson_excel_101",
        lesson_title: "Excel Débutant",
        start_date: new Date("2026-01-10T09:00:00"),
        end_date: new Date("2026-01-10T12:00:00"),
        format: "hybrid",
        location: "Luanda - Talatona",
        url: "https://meet.google.com/xxx-xxxx-xxx",
        seats_availables_onsite: 12,
        seats_availables_online: 40,
        subscribers_onsite: ["u1", "u2", "u3"],
        subscribers_online: ["u4", "u5"],
        status: "PUBLISHED",
      },
      {
        uid: "session_002",
        uid_lesson: "lesson_excel_dash",
        lesson_title: "Excel Tableaux de bord",
        start_date: new Date("2026-01-18T14:00:00"),
        end_date: new Date("2026-01-18T18:00:00"),
        format: "onsite",
        location: "Luanda - Centre",
        url: "",
        seats_availables_onsite: 10,
        seats_availables_online: 0,
        subscribers_onsite: ["u1"],
        subscribers_online: [],
        status: "PUBLISHED",
      },
      {
        uid: "session_003",
        uid_lesson: "lesson_excel_power",
        lesson_title: "Excel Power (Formules + Analyse)",
        start_date: new Date("2026-01-25T18:00:00"),
        end_date: new Date("2026-01-25T20:00:00"),
        format: "online",
        location: "",
        url: "https://meet.google.com/yyy-yyyy-yyy",
        seats_availables_onsite: 0,
        seats_availables_online: 80,
        subscribers_onsite: [],
        subscribers_online: ["u3", "u8", "u9"],
        status: "PUBLISHED",
      },
    ],
    []
  );
  const reviews = useMemo(
    () => [
      { uid: "rev_01", author: "João M.", rating: 5, date: new Date("2025-12-02T10:00:00"), comment: "Très pédagogique, j’ai enfin compris les références absolues et les tableaux !" },
      { uid: "rev_02", author: "Aline S.", rating: 5, date: new Date("2025-11-21T16:00:00"), comment: "Exemples concrets + fichiers donnés à la fin. J’ai gagné beaucoup de temps au travail." },
      { uid: "rev_03", author: "Carlos P.", rating: 4, date: new Date("2025-10-12T09:00:00"), comment: "Super cours. Peut-être un peu rapide sur la fin, mais très bon support." },
    ],
    []
  );
  const [contactForm, setContactForm] = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const fullName = `${teacher.first_name} ${teacher.last_name}`.trim();
  const canSend = contactForm.subject.trim().length > 0 && contactForm.message.trim().length > 0;
  const handleBack = () => router.back();
  const handleGoToCourse = (uidLesson) => router.push(`/dashboard/lessons/${uidLesson}`);
  const handleGoToSession = (uidSession) => router.push(`/dashboard/sessions/${uidSession}`);
  const handleSubscribeSession = async (session) => {
    console.log("subscribe session:", session.uid);
    alert("Inscription (mock) ✅");
  };
  const handleOpenExternal = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noreferrer");
  };
  const handleSendMessage = async () => {
    if (!canSend) return;
    try {
      setSending(true);
      setContactForm({ subject: "", message: "" });
      alert("Message envoyé (mock) ✅");
    } finally {
      setSending(false);
    }
  };
  return (
    <Box sx={{ bgcolor: "", minHeight: "100vh", width: '100%' }}>
      <Stack sx={{ background: '', width: '100%', mx: "auto" }} spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            size={'small'}
            icon={teacher.verified_by_team ? <VerifiedIcon /> : undefined}
            label={teacher.verified_by_team ? "Vérifié" : "Non vérifié"}
            sx={{
              color: "var(--font-color)",
              //bgcolor: "rgba(255,255,255,0.12)",
              borderColor: "var(--font-color)",
              "& .MuiChip-icon": { color: "green", fontSize: 14 },
              fontWeight: 500,
              px: 1
              //background: `linear-gradient(135deg, rgba(11,27,77,1) 0%, rgba(37,99,235,1) 55%, rgba(96,165,250,1) 100%)`,
              //color: "white",
            }}
            variant="outlined"
          />
        </Stack>
        {/* HERO v2: Avatar + name left, Quick actions right, stats below */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            bgcolor: "rgba(255,255,255,0.10)",
            //border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
            background: `linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 55%, var(--primary) 100%)`,
            color: "white",
            width: '100%',
          }}
        >
          <Stack sx={{ p: { xs: 1.5, md: 2.6 } }} spacing={2}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}
                //justifyContent="center" 
                alignItems="center"
                sx={{ minWidth: 0, maxWidth: '100%' }}>
                <Avatar
                  src={teacher.photo_url}
                  sx={{
                    width: 70,
                    height: 70,
                    border: "2px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 14px 40px rgba(2,6,23,0.35)",
                  }}
                />
                <Stack spacing={0.3} alignItems={{ xs: 'center', sm: 'start' }} sx={{ minWidth: 0, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 950, lineHeight: 1.05 }} title={fullName}>
                    {fullName}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.92 }}>
                    {teacher.role_title}
                  </Typography>

                  <Stack direction="row" justifyContent={{ xs: 'center', sm: 'start' }} spacing={1} flexWrap="wrap" sx={{ mt: 0.3 }}>
                    {teacher.tags.slice(0, 5).map((t) => (
                      <Chip
                        key={t}
                        size="small"
                        label={t}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.14)",
                          color: "white",
                          borderColor: "rgba(255,255,255,0.22)",
                          fontWeight: 800,
                        }}
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Stack>
              </Stack>

              {/* Quick actions */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", md: "auto" } }}>
                {teacher.socials?.linkedin && (
                  <Button
                    size="large"
                    variant="contained"
                    startIcon={<LinkIcon />}
                    onClick={() => handleOpenExternal(teacher.socials.linkedin)}
                    sx={primaryBtnSx}
                    fullWidth
                  >
                    LinkedIn
                  </Button>
                )}
                <Button
                  size="large"
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  sx={outlineBtnSxWhite}
                  onClick={() => {
                    const el = document.getElementById("contact-section");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  fullWidth
                >
                  Contacter
                </Button>
              </Stack>
            </Stack>

            <Typography variant="body2" sx={{ opacity: 0.92 }}>
              {teacher.bio}
            </Typography>

            {/* Stats bar */}
            <Grid container spacing={1} sx={{ background: '' }}>
              <Grid size={{ xs: 12, sm: 'grow' }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, sm: 'auto' }}>
                    <MiniInfoRow icon={<IconEmail />} label="Email" value={<Link href={`mailto:${teacher?.email}`}>{teacher?.email}</Link>} />
                  </Grid>
                  {
                    teacher?.phone_number && <Grid size={{ xs: 12, sm: 'auto' }}>
                      <MiniInfoRow icon={<IconPhone />} label="Phone" value={<Link href={`tel:${teacher?.phone_number}`}>{teacher?.phone_number}</Link>} />
                    </Grid>
                  }

                  <Grid size={{ xs: 12, sm: 'auto' }}>
                    <MiniInfoRow icon={<IconTranslation fontSize="small" />} label="Langues" value={teacher?.langs?.map(lang => t(lang, { ns: NS_LANGS })).join(" • ")} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <StatCard
                  icon={<WorkspacePremiumIcon fontSize="small" />}
                  title="Taux de réussite"
                  value={`${teacher.stats.completion}%`}
                  sub={`${teacher.stats.students}+ étudiants formés`}
                >
                  <LinearProgress
                    variant="determinate"
                    value={teacher.stats.completion}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      bgcolor: "rgba(255,255,255,0.18)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "rgba(255,255,255,0.82)",
                      },
                    }}
                  />
                </StatCard>
              </Grid>
            </Grid>
          </Stack>
        </Paper>



        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CardLessonsComponent lessons={myTeacher?.lessons} courses={courses} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CardSessionsComponent sessions={myTeacher?.sessions} courses={courses} />
          </Grid>
          <Grid size={'auto'}></Grid>
          <Grid size={'auto'}></Grid>
        </Grid>


      </Stack>
    </Box>
  );
}

