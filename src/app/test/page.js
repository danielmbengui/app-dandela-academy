"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function FirstConnectionPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    address: "",
    phone: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const isValid =
    form.first_name.trim().length > 0 &&
    form.last_name.trim().length > 0 &&
    form.age &&
    Number(form.age) > 0 &&
    form.phone.trim().length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) return;

    try {
      setSubmitting(true);

      // TODO : envoie tes données vers ton backend / Firestore
      // Exemple pseudo-code :
      // const fd = new FormData();
      // Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      // if (photoFile) fd.append("photo", photoFile);
      // await fetch("/api/profile/first-connection", { method: "POST", body: fd });

      // Une fois le profil complété, on redirige vers le dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur sauvegarde profil", error);
      setSubmitting(false);
    }
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
          maxWidth: 520,
          width: "100%",
          borderRadius: 3,
          px: 4,
          py: 4,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography variant="h4" fontWeight={600}>
                Première connexion
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bienvenue sur Dandela Academy 👋<br />
                Complète ton profil pour accéder à la plateforme.
              </Typography>
            </Stack>

            {/* Avatar + upload photo */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Avatar
                src={photoPreview || undefined}
                sx={{ width: 72, height: 72 }}
              />
              <div>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Photo de profil (optionnel)
                </Typography>
                <IconButton
                  component="label"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  <PhotoCameraIcon fontSize="small" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handlePhotoChange}
                  />
                </IconButton>
              </div>
            </Stack>

            {/* Nom / Prénom */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Prénom"
                value={form.first_name}
                onChange={handleChange("first_name")}
                fullWidth
                required
              />
              <TextField
                label="Nom"
                value={form.last_name}
                onChange={handleChange("last_name")}
                fullWidth
                required
              />
            </Stack>

            {/* Âge / Téléphone */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Âge"
                type="number"
                value={form.age}
                onChange={handleChange("age")}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Téléphone"
                value={form.phone}
                onChange={handleChange("phone")}
                fullWidth
                required
              />
            </Stack>

            {/* Adresse */}
            <TextField
              label="Adresse"
              value={form.address}
              onChange={handleChange("address")}
              fullWidth
              multiline
              minRows={2}
            />

            {/* Zone pour ajouter d’autres champs si besoin */}
            {/* Par ex. profession, pays, objectifs, etc. */}

            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Ces informations nous permettent de personnaliser ton
                expérience sur Dandela Academy.
              </Typography>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isValid || submitting}
              >
                {submitting ? "Enregistrement..." : "Valider et continuer"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
