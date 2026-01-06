"use client";

import React from "react";
import Image from "next/image";
import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SecurityIcon from "@mui/icons-material/Security";
import WifiIcon from "@mui/icons-material/Wifi";
import FolderIcon from "@mui/icons-material/Folder";
import MouseIcon from "@mui/icons-material/Mouse";

const quizQuestions = [
  {
    id: 1,
    question: "Quel est le rôle d’un système d’exploitation (Windows/macOS/Android/iOS) ?",
    options: [
      "Créer des photos automatiquement",
      "Permettre d’utiliser l’appareil et lancer des applications",
      "Protéger uniquement contre les virus",
      "Augmenter la vitesse d’Internet",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Une application (app), c’est :",
    options: [
      "Un câble pour charger le téléphone",
      "Un programme qui permet de faire une tâche (ex: WhatsApp, Photos)",
      "Un type de fichier",
      "Un site Internet",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "À quoi sert un navigateur (Chrome, Safari, Edge) ?",
    options: [
      "À écrire un document Word",
      "À aller sur Internet et ouvrir des sites web",
      "À nettoyer l’ordinateur",
      "À installer Windows",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Dans un navigateur, un onglet correspond à :",
    options: [
      "Un dossier de l’ordinateur",
      "Une page ouverte dans le navigateur",
      "Un antivirus",
      "Un fichier PDF",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "Quel est le bon réflexe pour créer un mot de passe solide ?",
    options: [
      "Utiliser 123456",
      "Utiliser son prénom",
      "Utiliser une phrase longue + chiffres + symboles",
      "Utiliser le même mot de passe partout",
    ],
    correctIndex: 2,
  },
  {
    id: 6,
    question: "Que signifie “Wi-Fi” dans la pratique ?",
    options: [
      "Un câble pour Internet",
      "Une connexion Internet sans fil",
      "Un type de batterie",
      "Un format de fichier",
    ],
    correctIndex: 1,
  },
  {
    id: 7,
    question: "Un dossier sert surtout à :",
    options: [
      "Supprimer Windows",
      "Organiser des fichiers (photos, documents, etc.)",
      "Augmenter le volume du son",
      "Changer la langue du clavier",
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    question: "Quel est le bon geste avant d’éteindre un ordinateur ?",
    options: [
      "Débrancher directement",
      "Fermer sans enregistrer",
      "Enregistrer son travail puis éteindre correctement",
      "Supprimer les dossiers",
    ],
    correctIndex: 2,
  },
  {
    id: 9,
    question: "Le clic droit (souris) sert souvent à :",
    options: [
      "Éteindre l’écran",
      "Ouvrir un menu d’options (copier, coller, renommer…)",
      "Changer la langue du document",
      "Installer Internet",
    ],
    correctIndex: 1,
  },
];

export default function IntroInformatiqueLevel1Page() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* HERO */}
      <Box component={Paper} elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 0.12, color: "text.secondary" }}>
              Introduction à l’informatique – Niveau débutant
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mt: 0.5 }}>
              Prise en main : comprendre son ordinateur / mobile
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Ce niveau t’aide à te sentir à l’aise avec les bases : vocabulaire essentiel,
              manipulations simples, fichiers et dossiers, Internet et sécurité.
              Idéal si tu débutes totalement.
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Débutant" color="primary" size="small" />
              <Chip label="Informatique" size="small" variant="outlined" />
              <Chip label="PC & Mobile" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Durée estimée : 3 à 5 heures • Langue : Français
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* OBJECTIFS & STRUCTURE */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Objectifs pédagogiques
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
              À la fin de ce niveau, l&apos;apprenant sera capable de :
            </Typography>
            <List dense>
              {[
                "Comprendre les mots essentiels : système, application, navigateur, onglet.",
                "Faire les actions de base : cliquer, copier/coller, enregistrer.",
                "Organiser ses fichiers : dossiers, noms de fichiers, emplacement (Documents/Bureau).",
                "Se connecter à Internet (Wi-Fi) et naviguer en sécurité.",
                "Créer une adresse e-mail et comprendre les messages (boîte de réception, pièces jointes).",
                "Appliquer des réflexes de sécurité : mots de passe solides, attention aux arnaques.",
              ].map((t) => (
                <ListItem key={t}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <MenuBookIcon color="primary" />
              <Typography variant="h6">Plan du niveau</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Le niveau est découpé en leçons courtes avec exercices.
            </Typography>
            <List dense>
              {[
                "Vocabulaire essentiel (système, app, navigateur, onglet)",
                "Prise en main : souris, clavier, gestes (PC & mobile)",
                "Fichiers & dossiers : organiser et retrouver",
                "Internet : Wi-Fi, sites, recherches",
                "Créer une adresse e-mail + envoyer un message",
                "Sécurité : mots de passe, arnaques, mises à jour",
              ].map((title, index) => (
                <ListItem key={title} sx={{ py: 0.3 }}>
                  <ListItemText
                    primaryTypographyProps={{ variant: "body2" }}
                    primary={`${index}. ${title}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Contenu détaillé
      </Typography>

      {/* 0. VOCABULAIRE */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">0. Vocabulaire essentiel</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Avant de pratiquer, on clarifie les mots de base pour éviter la confusion.
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Un système (Windows/macOS/Android/iOS) permet d’utiliser l’appareil." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Une application est un programme (ex: Photos, WhatsApp, Word)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Un navigateur sert à aller sur Internet (Chrome, Safari, Edge…)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Un onglet est une “page” ouverte dans le navigateur." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Ouvrir le navigateur et ouvrir 2 onglets (ex: un site + une recherche Google)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Fermer un onglet puis revenir sur l’autre." />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 220,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Image
                  src="/intro-it-level1-vocab.png"
                  alt="Vocabulaire informatique : système, application, navigateur, onglet"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 1. PRISE EN MAIN */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">1. Prise en main : souris, clavier & gestes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <MouseIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : être à l’aise avec les actions de base.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Clic gauche : sélectionner / ouvrir. Double-clic : ouvrir (PC)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Clic droit : menu d’options (renommer, copier, coller…)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Raccourcis utiles : Ctrl+C / Ctrl+V / Ctrl+X / Ctrl+Z / Ctrl+S." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Mobile : appui, appui long, glisser, zoomer/dézoomer." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Créer un petit texte (Notes/Word) et tester copier/coller et annuler." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Renommer un fichier (PC) ou renommer une note (mobile)." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 2. FICHIERS & DOSSIERS */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">2. Fichiers & dossiers : organiser et retrouver</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <FolderIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : ne plus perdre ses documents.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Un fichier = un document (photo, PDF, Word…). Un dossier = un “rangement”." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Nommer clairement : ex. “CV_2026.pdf”, “Factures_Janvier”." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Comprendre où ça se trouve : Téléchargements / Documents / Bureau." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Créer un dossier “Mon apprentissage” puis 2 sous-dossiers (Photos, Documents)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Télécharger un fichier (PDF) et le déplacer dans “Documents”." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 3. INTERNET */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">3. Internet : Wi-Fi, recherches & navigation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <WifiIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : chercher une info et éviter les pièges.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Différence : Internet (réseau) vs navigateur (outil) vs site (page web)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Faire une recherche : mots clés simples + ajouter le lieu si besoin." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Reconnaître un lien suspect : promesses trop belles, fautes, pression “urgent”." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Rechercher : “météo Luanda” ou “banque proche de moi”." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ouvrir 2 résultats dans 2 onglets et comparer." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 4. EMAIL */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">4. Créer une adresse e-mail & envoyer un message</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            L’e-mail est indispensable : emplois, administrations, achats en ligne, récupération de mot de passe.
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Créer un compte (Gmail/Outlook) avec un mot de passe solide." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Comprendre : boîte de réception, spam, brouillons, pièces jointes." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Écrire un message clair : objet + message court + formule de politesse." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Créer une adresse e-mail (ou utiliser la tienne) et envoyer un message test." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Joindre un fichier (photo ou PDF) et vérifier la réception." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 5. SECURITE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">5. Sécurité : mots de passe, arnaques, mises à jour</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <SecurityIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : protéger ses comptes et éviter les pertes.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Mot de passe : long + unique (idéalement un gestionnaire de mots de passe)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ne jamais partager un code reçu par SMS/email (2FA)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Mises à jour : elles corrigent des failles et améliorent la sécurité." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Activer la vérification en 2 étapes sur un compte (si possible)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Identifier 3 signes d’un message suspect (urgence, lien bizarre, demande d’argent)." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 4 }} />

      {/* QUIZ */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <QuizIcon color="primary" />
          <Typography variant="h5">Quiz de fin de niveau</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ce quiz valide les notions de base : vocabulaire, gestes, fichiers, Internet, email et sécurité.
        </Typography>

        <Grid container spacing={2}>
          {quizQuestions.map((q) => (
            <Grid item xs={12} md={6} key={q.id}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Question {q.id}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1.5 }}>
                    {q.question}
                  </Typography>

                  <List dense>
                    {q.options.map((opt, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemIcon>
                          <AssignmentTurnedInIcon
                            fontSize="small"
                            color={idx === q.correctIndex ? "success" : "disabled"}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            variant: "body2",
                            color: idx === q.correctIndex ? "success.main" : "text.primary",
                          }}
                          primary={opt}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
