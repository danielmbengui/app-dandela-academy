"use client";

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

const ROYAL = "#2563EB";
const NAVY = "#0B1B4D";

export default function TeacherProfileModernBetterLayoutPage() {
  const router = useRouter();

  // ---- MOCK (remplace par Firestore) ----
  const teacher = useMemo(
    () => ({
      uid: "teacher_01",
      first_name: "Maria",
      last_name: "Cruz",
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
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      {/* Top bar + subtle gradient */}
      <Box
        sx={{
          background: `linear-gradient(135deg, rgba(11,27,77,1) 0%, rgba(37,99,235,1) 55%, rgba(96,165,250,1) 100%)`,
          color: "white",
        }}
      >
        <Stack sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, pt: 2.2, pb: 9 }} spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Tooltip title="Retour">
                <IconButton
                  onClick={handleBack}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.14)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.20)" },
                    borderRadius: 2,
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Stack spacing={0.2}>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>
                  Professeur
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Profil moderne • inscription rapide
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                icon={<StarIcon />}
                label={`${teacher.rating_avg.toFixed(1)} • ${teacher.rating_count}`}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderColor: "rgba(255,255,255,0.22)",
                  "& .MuiChip-icon": { color: "white" },
                  fontWeight: 800,
                }}
                variant="outlined"
              />
              <Chip
                icon={teacher.verified ? <VerifiedIcon /> : undefined}
                label={teacher.verified ? "Vérifié" : "Non vérifié"}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderColor: "rgba(255,255,255,0.22)",
                  "& .MuiChip-icon": { color: "white" },
                  fontWeight: 800,
                }}
                variant="outlined"
              />
            </Stack>
          </Stack>

          {/* HERO v2: Avatar + name left, Quick actions right, stats below */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 5,
              overflow: "hidden",
              bgcolor: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack sx={{ p: { xs: 2, md: 2.6 } }} spacing={2}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={2}
              >
                <Stack direction="row" spacing={1.6} alignItems="center" sx={{ minWidth: 0 }}>
                  <Avatar
                    src={teacher.photo_url}
                    sx={{
                      width: 88,
                      height: 88,
                      border: "2px solid rgba(255,255,255,0.6)",
                      boxShadow: "0 14px 40px rgba(2,6,23,0.35)",
                    }}
                  />
                  <Stack spacing={0.3} sx={{ minWidth: 0 }}>
                    <Typography variant="h3" sx={{ fontWeight: 950, lineHeight: 1.05 }} noWrap title={fullName}>
                      {fullName}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.92 }}>
                      {teacher.headline}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.3 }}>
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
                {teacher.about_short}
              </Typography>

              {/* Stats bar */}
              <Grid container spacing={1.4}>
                <Grid item xs={12} md={6}>
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

                <Grid item xs={12} md={6}>
                  <Stack spacing={1.4}>
                    <MiniInfoRow icon={<LanguageIcon fontSize="small" />} label="Langues" value={teacher.languages.join(" • ")} />
                    <MiniInfoRow icon={<RoomIcon fontSize="small" />} label="Zone" value={teacher.location} />
                    <MiniInfoRow icon={<PhoneIcon fontSize="small" />} label="Téléphone" value={teacher.phone} />
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Stack>
      </Box>

      {/* Content */}
      <Stack
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 3 },
          mt: -7,
          pb: 4,
        }}
        spacing={2}
      >
        <Grid container spacing={2}>
          {/* MAIN (courses + sessions) */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CardSection title="Cours proposés" subtitle="Choisis un cours, puis une session pour t’inscrire">
                  <Grid container spacing={1.4}>
                    {courses.map((c) => (
                      <Grid key={c.uid} item xs={12} sm={6}>
                        <ModernCourseTile course={c} onOpen={() => handleGoToCourse(c.uid)} />
                      </Grid>
                    ))}
                  </Grid>
                </CardSection>
              </Grid>

              <Grid item xs={12}>
                <CardSection title="Sessions à venir" subtitle="Inscription rapide (1 clic)">
                  <Stack spacing={1.2}>
                    {upcomingSessions.map((s) => (
                      <ModernSessionRow
                        key={s.uid}
                        session={s}
                        onOpen={() => handleGoToSession(s.uid)}
                        onSubscribe={() => handleSubscribeSession(s)}
                      />
                    ))}
                  </Stack>
                </CardSection>
              </Grid>

              <Grid item xs={12}>
                <CardSection title="Bio" subtitle="Approche & parcours">
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                    {teacher.bio}
                  </Typography>
                </CardSection>
              </Grid>
            </Grid>
          </Grid>

          {/* SIDE (reviews + contact) */}
          <Grid item xs={12} md={4}>
            <CardSection
              title="Avis"
              subtitle="Ce que les étudiants disent"
              right={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={teacher.rating_avg} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ fontWeight: 900, color: NAVY }}>
                    {teacher.rating_avg.toFixed(1)}
                  </Typography>
                </Stack>
              }
            >
              <Stack spacing={1.1}>
                {reviews.map((r) => (
                  <ModernReviewCompact key={r.uid} review={r} />
                ))}
              </Stack>
            </CardSection>

            <CardSection title="Contact direct" subtitle="Message privé au professeur" id="contact-section">
              <Stack spacing={1.2}>
                <TextField
                  label="Sujet"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm((p) => ({ ...p, subject: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                  fullWidth
                  multiline
                  minRows={4}
                />
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSendMessage}
                  disabled={!canSend || sending}
                  sx={primaryBtnSxSolid}
                >
                  {sending ? "Envoi..." : "Envoyer"}
                </Button>

                <Divider sx={{ borderColor: "rgba(15,23,42,0.10)" }} />

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip size="small" icon={<EmailIcon />} label={teacher.email} sx={softChipSx} />
                  <Chip size="small" icon={<PhoneIcon />} label={teacher.phone} sx={softChipSx} />
                </Stack>
              </Stack>
            </CardSection>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

/* -------------------- UI components -------------------- */

function CardSection({ title, subtitle, right, children, id }) {
  return (
    <Paper
      id={id}
      elevation={0}
      sx={{
        borderRadius: 5,
        p: 2.4,
        border: "1px solid rgba(15, 23, 42, 0.10)",
        bgcolor: "#FFFFFF",
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

function MiniInfoRow({ icon, label, value }) {
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
        {icon}
      </Avatar>
      <Stack sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ opacity: 0.85 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 900 }} noWrap title={value}>
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
          </Stack>
          <Typography variant="body2" sx={{ fontWeight: 950, color: NAVY }}>
            {formatMoney(course.price, course.currency)}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip size="small" label={formatLabel(course.format)} sx={softChipSx} />
          <Chip size="small" label="Voir le cours →" sx={softChipGhostSx} />
        </Stack>
      </Stack>
    </Paper>
  );
}

function ModernSessionRow({ session, onOpen, onSubscribe }) {
  const startText = formatDate(session.start_date);
  const endText = formatDate(session.end_date);

  const seatsLeftOnsite = Math.max(
    0,
    Number(session.seats_availables_onsite || 0) - (session.subscribers_onsite?.length || 0)
  );
  const seatsLeftOnline = Math.max(
    0,
    Number(session.seats_availables_online || 0) - (session.subscribers_online?.length || 0)
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.6,
        borderRadius: 5,
        border: "1px solid rgba(15, 23, 42, 0.10)",
        bgcolor: "#fff",
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Stack spacing={0.2} sx={{ minWidth: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 950, color: NAVY }} noWrap title={session.lesson_title}>
              {session.lesson_title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {startText} → {endText}
            </Typography>
          </Stack>

          <Chip
            size="small"
            label={session.status === "PUBLISHED" ? "Ouvert" : session.status}
            sx={{
              bgcolor: session.status === "PUBLISHED" ? "rgba(34,197,94,0.12)" : "rgba(15,23,42,0.06)",
              color: session.status === "PUBLISHED" ? "#15803D" : NAVY,
              border: "1px solid rgba(15,23,42,0.10)",
              fontWeight: 900,
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip size="small" icon={<EventIcon />} label={formatLabel(session.format)} sx={softChipSx} />
          {session.location ? <Chip size="small" icon={<RoomIcon />} label={session.location} sx={softChipSx} /> : null}
          {session.url ? <Chip size="small" icon={<LinkIcon />} label="Lien" sx={softChipSx} /> : null}
          {session.seats_availables_onsite > 0 ? (
            <Chip
              size="small"
              label={`Présentiel: ${seatsLeftOnsite}/${session.seats_availables_onsite}`}
              sx={softChipGhostSx}
            />
          ) : null}
          {session.seats_availables_online > 0 ? (
            <Chip
              size="small"
              label={`En ligne: ${seatsLeftOnline}/${session.seats_availables_online}`}
              sx={softChipGhostSx}
            />
          ) : null}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button variant="outlined" onClick={onOpen} fullWidth sx={outlineBtnSx}>
            Voir la session
          </Button>
          <Button
            variant="contained"
            onClick={onSubscribe}
            fullWidth
            sx={primaryBtnSxSolid}
            disabled={session.status !== "PUBLISHED"}
          >
            S'inscrire
          </Button>
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
  color: NAVY,
  border: "1px solid rgba(37,99,235,0.18)",
  fontWeight: 800,
  "& .MuiChip-icon": { color: ROYAL },
};

const softChipGhostSx = {
  bgcolor: "rgba(15,23,42,0.04)",
  color: NAVY,
  border: "1px solid rgba(15,23,42,0.10)",
  fontWeight: 800,
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
