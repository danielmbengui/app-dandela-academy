"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import NotAuthorizedComponent from "@/components/auth/NotAuthorizedComponent";
import LoginPageWrapper from "@/components/wrappers/LoginPageWrapper";
import OtherPageWrapper from "@/components/wrappers/OtherPageWrapper";
//import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";

export default function ForbiddenRolePage() {
  const router = useRouter();
  //const { firebaseUser, userDoc, loading } = useCurrentUserProfile();
  const { firebaseUser, userDoc, loading } = {
    firebaseUser:null,
    userDoc:null,
    loading:true
  }

  const role = userDoc?.role || "inconnu";

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleLogout = () => {
    router.push("/logout"); // adapte à ta route de déconnexion si besoin
  };

  return (<OtherPageWrapper>
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
      <NotAuthorizedComponent />
      <Paper
        elevation={6}
        sx={{
          maxWidth: 520,
          width: "100%",
          borderRadius: 3,
          px: 4,
          py: 4,
          textAlign: "center",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <LockIcon sx={{ fontSize: 48 }} color="error" />

          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={600}>
              Accès refusé
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tu es bien connecté·e à Dandela Academy, mais ton rôle ne te
              permet pas d’accéder à cette page.
            </Typography>
          </Stack>

          {!loading && firebaseUser && (
            <Stack spacing={1} alignItems="center">
              <Typography variant="body2">
                Rôle actuel :
              </Typography>
              <Chip
                label={role}
                variant="outlined"
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                Si tu penses qu’il s’agit d’une erreur, contacte un
                administrateur de la plateforme.
              </Typography>
            </Stack>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 1, width: "100%" }}>
            <Button
              onClick={handleGoHome}
              variant="contained"
              fullWidth
            >
              Retour au dashboard
            </Button>
            <Button
              onClick={handleLogout}
              variant="outlined"
              fullWidth
            >
              Se déconnecter
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  </OtherPageWrapper>);
}
