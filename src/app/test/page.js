"use client";

import { useRouter } from "next/navigation";
import { Button, Stack, Typography, Paper } from "@mui/material";
// Adapte ce chemin à ton contexte réel
import { useAuth } from "@/contexts/AuthProvider";

export default function DashboardHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth(); // user = null si pas connecté

  const handleGoToApp = () => {
    // TODO: adapte le chemin à ton dashboard réel (ex: "/dashboard/lessons")
    router.push("/dashboard/home");
  };

  const handleGoToLogin = () => {
    router.push("/login"); // adapte si tu as /auth/login
  };

  const handleGoToRegister = () => {
    router.push("/register"); // ou /auth/register, /signup, etc.
  };

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #111827 0, #020617 45%, #000000 100%)",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 480,
          width: "100%",
          borderRadius: 3,
          px: 4,
          py: 4,
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={600}>
              Dandela Academy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accède à ton espace d’apprentissage ou connecte-toi pour
              commencer.
            </Typography>
          </Stack>

          {/* État de chargement de l'auth si nécessaire */}
          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Vérification de ta session en cours...
            </Typography>
          ) : user ? (
            // ✅ Utilisateur connecté
            <Stack spacing={2}>
              <Typography variant="body2">
                Bonjour{" "}
                <strong>{user.displayName || user.email || "👋"}</strong>, tu
                es déjà connecté.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleGoToApp}
                fullWidth
              >
                Accéder à mon espace
              </Button>
            </Stack>
          ) : (
            // ❌ Utilisateur non connecté
            <Stack spacing={2}>
              <Typography variant="body2">
                Tu n’es pas connecté·e. Choisis une option pour continuer :
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleGoToLogin}
                  fullWidth
                >
                  Se connecter
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGoToRegister}
                  fullWidth
                >
                  Créer un compte
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
