"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Backdrop,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventIcon from "@mui/icons-material/Event";
import RoomIcon from "@mui/icons-material/Room";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import LanguageIcon from "@mui/icons-material/Language";
import PaymentsIcon from "@mui/icons-material/Payments";

/**
 * Page Session (mini page) — Next.js / App Router / JavaScript + MUI
 *
 * ✅ Affiche infos session
 * ✅ Bouton "Voir le cours"
 * ✅ Bouton "S'inscrire"
 *
 * À brancher :
 * - Récupération session par params (uid)
 * - Actions Firestore (subscribe)
 */
export default function LessonSessionPage() {
  const router = useRouter();

  // ---- MOCK (remplace par ton fetch Firestore / ClassLessonSession.get(uid)) ----
  const session = useMemo(
    () => ({
      uid: "session_001",
      uid_lesson: "lesson_excel_101",
      uid_teacher: "teacher_01",
      uid_room: "room_02",
      code: "EXCEL-101",
      title: "Excel Débutant — Session Janvier",
      format: "hybrid", // "onsite" | "online" | "hybrid"
      price: 2500,
      currency: "AOA",
      start_date: new Date("2026-01-12T09:00:00"),
      end_date: new Date("2026-01-12T12:00:00"),
      location: "Luanda - Talatona",
      url: "https://meet.google.com/xxx-xxxx-xxx",
      seats_availables_onsite: 12,
      seats_availables_online: 40,
      subscribers_onsite: ["u1", "u2", "u3"],
      subscribers_online: ["u4", "u5"],
      photo_url:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop",
      status: "PUBLISHED",
    }),
    []
  );

  const lessonRoute = `/dashboard/lessons/${session.uid_lesson}`; // adapte
  const calendarRoute = `/dashboard/calendar`; // adapte
  const backRoute = calendarRoute;

  const formatLabel =
    session.format === "onsite"
      ? "Présentiel"
      : session.format === "online"
        ? "En ligne"
        : "Hybride";

  const seatsLeftOnsite = Math.max(
    0,
    Number(session.seats_availables_onsite || 0) -
    (session.subscribers_onsite?.length || 0)
  );
  const seatsLeftOnline = Math.max(
    0,
    Number(session.seats_availables_online || 0) -
    (session.subscribers_online?.length || 0)
  );

  const startText = formatDate(session.start_date);
  const endText = formatDate(session.end_date);

  const handleBack = () => router.push(backRoute);

  const handleGoToLesson = () => router.push(lessonRoute);

  const handleSubscribe = async () => {
    // TODO: brancher Firestore
    // - vérifier si déjà inscrit
    // - vérifier places restantes selon mode choisi
    // - pousser uid user dans subscribers_online / subscribers_onsite
    // - ou créer une sous-collection / collection "subscriptions"
    console.log("subscribe to session:", session.uid);
    alert("Inscription (mock) ✅");
  };

  return (
    <Backdrop
      open={true}
      sx={{
        minHeight: "100vh",
        zIndex: (theme) => theme.zIndex.drawer + 1
      }
      }
    >
      <Stack
        sx={{
          height: "100%",
          width: "100%",
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          
        }}
        alignItems={'center'}
        spacing={2}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ maxWidth: 1100, width: "100%", mx: "auto" }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Retour">
              <IconButton onClick={handleBack} sx={{ color: "white" }}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>

            <Stack spacing={0.2}>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                Session
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
                Infos rapides + inscription
              </Typography>
            </Stack>
          </Stack>

          <Chip
            label={session.status === "PUBLISHED" ? "Inscriptions ouvertes" : session.status}
            color={session.status === "PUBLISHED" ? "success" : "default"}
            variant={session.status === "PUBLISHED" ? "filled" : "outlined"}
          />
        </Stack>

        <Stack sx={{ maxWidth: 1100, width: "100%", mx: "auto",overflowY: "auto", }} spacing={2}>
          {/* Hero card */}
          <Paper
            elevation={6}
            sx={{
              borderRadius: 3,
             // overflow: "hidden",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              sx={{ minHeight: 220 }}
            >
              {/* Image */}
              <Stack
                sx={{
                  width: { xs: "100%", md: 360 },
                  minHeight: { xs: 180, md: "auto" },
                  backgroundImage: `url(${session.photo_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Content */}
              <Stack sx={{ p: 2.5, flex: 1 }} spacing={1.2}>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack spacing={0.4} sx={{ minWidth: 0 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700 }}
                      noWrap
                      title={session.title}
                    >
                      {session.title}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Chip size="small" icon={<SchoolIcon />} label={session.code} />
                      <Chip size="small" icon={<EventIcon />} label={`${startText} → ${endText}`} />
                      <Chip size="small" icon={<PersonIcon />} label={`Prof: ${session.uid_teacher}`} />
                    </Stack>
                  </Stack>

                  <Stack spacing={0.6} alignItems="flex-end">
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <PaymentsIcon fontSize="small" />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {formatMoney(session.price, session.currency)}
                      </Typography>
                    </Stack>
                    <Chip size="small" icon={<LanguageIcon />} label={formatLabel} variant="outlined" />
                  </Stack>
                </Stack>

                <Divider />

                <Grid container spacing={1.5}>
                  <Grid item xs={12} md={6}>
                    <InfoLine
                      icon={<RoomIcon fontSize="small" />}
                      label="Lieu"
                      value={session.location || (session.uid_room ? `Salle ${session.uid_room}` : "-")}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InfoLine
                      icon={<LanguageIcon fontSize="small" />}
                      label="Lien (si en ligne)"
                      value={session.url ? session.url : "—"}
                      isLink={!!session.url}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InfoLine
                      label="Places restantes (présentiel)"
                      value={`${seatsLeftOnsite} / ${session.seats_availables_onsite}`}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InfoLine
                      label="Places restantes (en ligne)"
                      value={`${seatsLeftOnline} / ${session.seats_availables_online}`}
                    />
                  </Grid>
                </Grid>

                <Divider />

                {/* Actions */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", sm: "center" }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleGoToLesson}
                    startIcon={<SchoolIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Voir le cours
                  </Button>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                    <Button
                      variant="contained"
                      onClick={handleSubscribe}
                      sx={{ borderRadius: 2 }}
                      disabled={session.status !== "PUBLISHED"}
                    >
                      S’inscrire à la session
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Paper>

          {/* Bloc “infos utiles” */}
          <Paper elevation={2} sx={{ borderRadius: 3, p: 2.5 }}>
            <Stack spacing={1}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Infos utiles
              </Typography>

              <Typography variant="body2" color="text.secondary">
                - Arrive 10 minutes avant le début (présentiel). <br />
                - Si tu choisis “en ligne”, assure-toi d’avoir une bonne connexion. <br />
                - Le lien peut être mis à jour : vérifie le jour J.
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Backdrop>
  );
}

function InfoLine({ icon, label, value, isLink = false }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        p: 1,
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {icon ? <Avatar sx={{ width: 28, height: 28 }}>{icon}</Avatar> : null}
      <Stack sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {isLink ? (
          <Typography
            variant="body2"
            component="a"
            href={value}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "underline" }}
          >
            {value}
          </Typography>
        ) : (
          <Typography variant="body2" noWrap title={value}>
            {value}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
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
