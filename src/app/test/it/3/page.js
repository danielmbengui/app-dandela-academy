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
  Alert,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import PublicIcon from "@mui/icons-material/Public";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import BackupIcon from "@mui/icons-material/Backup";
import ShieldIcon from "@mui/icons-material/Shield";
import BugReportIcon from "@mui/icons-material/BugReport";
import LinkIcon from "@mui/icons-material/Link";

/**
 * ✅ Introduction à l’informatique – Niveau 3 (Compétent)
 * Thème : productivité + fiabilité + bonnes pratiques (comptes, sauvegardes avancées, partage sécurisé,
 * dépannage, hygiène numérique, bonnes pratiques d’organisation et de confidentialité).
 */

const quizQuestions = [
  {
    id: 1,
    question: "Le meilleur moyen d’éviter de perdre ses données est :",
    options: [
      "Tout garder sur un seul téléphone",
      "Faire des sauvegardes régulières (cloud + copie locale si possible)",
      "Supprimer toutes ses photos",
      "Désactiver les mises à jour",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Qu’est-ce qu’un gestionnaire de mots de passe ?",
    options: [
      "Une app qui crée et stocke des mots de passe uniques de façon sécurisée",
      "Un antivirus",
      "Un navigateur",
      "Un dossier Windows",
    ],
    correctIndex: 0,
  },
  {
    id: 3,
    question: "Quand tu partages un lien Drive/OneDrive, la bonne pratique est :",
    options: [
      "Mettre “Tout le monde peut modifier”",
      "Donner l’accès minimum (lecture) et seulement aux personnes nécessaires",
      "Partager publiquement sur les réseaux",
      "Ne jamais vérifier les autorisations",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Si un site te demande ton code reçu par SMS ou ton code 2FA, tu dois :",
    options: [
      "Le donner rapidement",
      "Le donner uniquement si c’est ton site officiel et que TU es en train de te connecter",
      "Le publier dans un groupe WhatsApp",
      "Le mettre dans ton profil",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "La différence entre “http” et “https” est surtout :",
    options: [
      "https chiffre la connexion (plus sécurisé)",
      "http est plus rapide",
      "https est uniquement pour les vidéos",
      "http empêche les virus",
    ],
    correctIndex: 0,
  },
  {
    id: 6,
    question: "Si ton ordinateur est lent, la première étape logique est :",
    options: [
      "Acheter un nouvel ordinateur",
      "Redémarrer + vérifier l’espace disque + fermer les apps inutiles",
      "Supprimer Windows",
      "Installer 10 antivirus",
    ],
    correctIndex: 1,
  },
  {
    id: 7,
    question: "Pour éviter les fichiers “perdus”, la meilleure organisation est :",
    options: [
      "Tout sur le Bureau",
      "Une structure de dossiers simple + noms clairs + dates",
      "Aucun dossier",
      "Changer les noms au hasard",
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    question: "Un antivirus et les mises à jour servent surtout à :",
    options: [
      "Faire de belles photos",
      "Réduire les risques (malwares, failles, bugs)",
      "Augmenter la RAM",
      "Changer la langue du clavier",
    ],
    correctIndex: 1,
  },
  {
    id: 9,
    question: "Quand tu installes un programme sur PC, le meilleur réflexe est :",
    options: [
      "Télécharger le premier lien trouvé",
      "Télécharger depuis le site officiel / store + vérifier l’éditeur",
      "Désactiver le pare-feu",
      "Donner tous les droits administrateur sans lire",
    ],
    correctIndex: 1,
  },
  {
    id: 10,
    question: "Le “dépannage” efficace commence généralement par :",
    options: [
      "Paniquer",
      "Identifier le problème + lire le message d’erreur + tester une solution simple",
      "Supprimer tout",
      "Réinstaller sans comprendre",
    ],
    correctIndex: 1,
  },
];

export default function IntroInformatiqueLevel3Page() {
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
              Introduction à l’informatique – Niveau 3 (Compétent)
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mt: 0.5 }}>
              Productivité, sécurité & dépannage (niveau “autonome”)
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Ce niveau te fait passer à un usage solide : organisation fiable, partages sécurisés, sauvegardes
              intelligentes, hygiène numérique et dépannage. Tu seras capable d’utiliser ton ordinateur/mobile
              sans dépendre des autres pour les problèmes courants.
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Compétent" color="primary" size="small" />
              <Chip label="Productivité" size="small" variant="outlined" />
              <Chip label="Sécurité" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Durée estimée : 7 à 10 heures • Langue : Français
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
                "Mettre en place une organisation stable (dossiers, règles de nommage, versions).",
                "Gérer ses comptes (e-mail, cloud) : sécurité, récupération, 2FA, gestionnaire de mots de passe.",
                "Partager des fichiers de manière pro (liens, autorisations lecture/édition, expiration).",
                "Mettre en place une stratégie de sauvegarde simple (cloud + copie locale).",
                "Faire un dépannage de base : lenteur, stockage, applis qui plantent, réseau.",
                "Reconnaître les risques (phishing, faux liens, permissions abusives) et appliquer les bons réflexes.",
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
              Ce niveau est orienté “méthodes” + scénarios réels.
            </Typography>

            <List dense>
              {[
                "Organisation & méthodes (dossiers, noms, versions)",
                "Comptes & accès (2FA, récupération, gestionnaire)",
                "Partage sécurisé (liens, droits, bonnes pratiques)",
                "Sauvegardes (stratégie simple & test de restauration)",
                "Hygiène numérique (mises à jour, permissions, nettoyage)",
                "Dépannage : lenteur, réseau, stockage, applis",
                "Mini-projet final : système complet et fiable",
              ].map((title, index) => (
                <ListItem key={title} sx={{ py: 0.3 }}>
                  <ListItemText primaryTypographyProps={{ variant: "body2" }} primary={`${index}. ${title}`} />
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

      {/* 0. ORGANISATION */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">0. Organisation & méthodes (dossiers, noms, versions)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <SettingsSuggestIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  Objectif : retrouver n’importe quel fichier en 10 secondes.
                </Typography>
              </Stack>

              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Structure simple : Documents / Administratif / Travail / Photos / Projets." /></ListItem>
                <ListItem><ListItemText primary="Nommage : Type + Sujet + Date (AAAA-MM-JJ) (ex: CV_Dan_2026-01-06.pdf)." /></ListItem>
                <ListItem><ListItemText primary="Versions : v1, v2, FINAL, SIGNÉ (éviter “final_final2”)." /></ListItem>
                <ListItem><ListItemText primary="Règle : 1 document important = 1 dossier (sources + PDF final)." /></ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Créer une arborescence de dossiers + déplacer 10 fichiers dedans." /></ListItem>
                <ListItem><ListItemText primary="Renommer 5 fichiers avec une règle date + sujet." /></ListItem>
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
                  src="/intro-it-level3-organisation.png"
                  alt="Organisation : dossiers, noms, versions"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            Méthode simple : si tu ne peux pas deviner le contenu d’un fichier juste en lisant son nom, renomme-le.
          </Alert>
        </AccordionDetails>
      </Accordion>

      {/* 1. COMPTES & ACCES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">1. Comptes & accès (2FA, récupération, gestionnaire)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <ManageAccountsIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : sécuriser ses comptes et pouvoir les récupérer.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="E-mail = compte principal : protège-le en priorité." /></ListItem>
            <ListItem><ListItemText primary="Activer 2FA (application d’authentification si possible)." /></ListItem>
            <ListItem><ListItemText primary="Ajouter un e-mail/téléphone de récupération." /></ListItem>
            <ListItem><ListItemText primary="Gestionnaire de mots de passe : mots de passe uniques partout." /></ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Vérifier : récupération + 2FA activés sur ton e-mail." /></ListItem>
            <ListItem><ListItemText primary="Créer 3 mots de passe uniques (longs) et les stocker dans un gestionnaire." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 2. PARTAGE SECURISE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">2. Partage sécurisé (liens, droits, bonnes pratiques)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <LinkIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : partager un document sans se faire voler/modifier.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Droits : Lecture (view) vs Commentaire vs Édition (edit)." /></ListItem>
            <ListItem><ListItemText primary="Donner le minimum : la plupart du temps, “Lecture” suffit." /></ListItem>
            <ListItem><ListItemText primary="Éviter “Tout le monde avec le lien” si c’est sensible." /></ListItem>
            <ListItem><ListItemText primary="Si possible : limiter le téléchargement/copie + définir une expiration." /></ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Partager un PDF en “Lecture seulement” à une personne précise." /></ListItem>
            <ListItem><ListItemText primary="Créer une seconde version “éditable” (doc) réservée à un collaborateur." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 3. SAUVEGARDES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">3. Sauvegardes (stratégie simple & test de restauration)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <BackupIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : pouvoir récupérer ses données après un problème.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Stratégie simple :</Typography>
          <List dense>
            <ListItem><ListItemText primary="1 copie sur l’appareil (travail en cours)." /></ListItem>
            <ListItem><ListItemText primary="1 copie sur le cloud (Drive/iCloud/OneDrive)." /></ListItem>
            <ListItem><ListItemText primary="Optionnel : 1 copie locale (disque externe/clé) pour les fichiers critiques." /></ListItem>
          </List>

          <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
            Une sauvegarde n’existe vraiment que si tu sais restaurer. Teste au moins une fois.
          </Alert>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Sauvegarder 1 dossier important dans le cloud." /></ListItem>
            <ListItem><ListItemText primary="Simuler une restauration : récupérer un fichier supprimé (corbeille cloud) ou depuis “versions”." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 4. HYGIENE NUMERIQUE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">4. Hygiène numérique (mises à jour, permissions, nettoyage)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <ShieldIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : éviter les problèmes avant qu’ils arrivent.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Mises à jour : système + apps (sécurité et bugs corrigés)." /></ListItem>
            <ListItem><ListItemText primary="Permissions : retirer micro/caméra/localisation si inutile." /></ListItem>
            <ListItem><ListItemText primary="Nettoyage mensuel : stockage, téléchargements, doublons, corbeille." /></ListItem>
            <ListItem><ListItemText primary="Navigateur : supprimer extensions inutiles, vérifier les sites (https)." /></ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Retirer 2 permissions inutiles à 2 applications." /></ListItem>
            <ListItem><ListItemText primary="Supprimer 3 apps inutilisées et vérifier l’espace disque." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 5. DEPANNAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">5. Dépannage : lenteur, réseau, stockage, applis</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <BugReportIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : résoudre 80% des problèmes courants.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Méthode en 6 étapes :</Typography>
          <List dense>
            <ListItem><ListItemText primary="1) Décrire le problème (quoi, quand, quelle app) + lire le message d’erreur." /></ListItem>
            <ListItem><ListItemText primary="2) Redémarrer (souvent ça règle beaucoup de choses)." /></ListItem>
            <ListItem><ListItemText primary="3) Vérifier Internet : Wi-Fi, mode avion, autre réseau." /></ListItem>
            <ListItem><ListItemText primary="4) Vérifier stockage (si plein = lenteur, bugs, installation impossible)." /></ListItem>
            <ListItem><ListItemText primary="5) Mettre à jour l’app/le système." /></ListItem>
            <ListItem><ListItemText primary="6) Réinstaller l’app si nécessaire (après sauvegarde des infos)." /></ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Simuler un dépannage : “app ne s’ouvre pas” → appliquer les 6 étapes." /></ListItem>
            <ListItem><ListItemText primary="Faire une capture d’écran d’un message d’erreur et l’envoyer par e-mail (proprement)." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 6. MINI-PROJET */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">6. Mini-projet final : système complet et fiable</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <AdminPanelSettingsIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : prouver que tu es autonome avec un setup complet.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>À réaliser :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer une structure de dossiers “Administratif” et “Travail”." /></ListItem>
            <ListItem><ListItemText primary="Créer/mettre à jour un document (CV ou lettre) + exporter PDF propre." /></ListItem>
            <ListItem><ListItemText primary="Sauvegarder le dossier sur le cloud + tester la restauration d’un fichier." /></ListItem>
            <ListItem><ListItemText primary="Partager le PDF en lecture seule + retirer une permission inutile à une app." /></ListItem>
            <ListItem><ListItemText primary="Activer/valider 2FA (ou au minimum vérifier qu’il est bien configuré)." /></ListItem>
          </List>

          <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
            À la fin, tu dois être capable d’expliquer : où sont tes fichiers, comment tu les sauvegardes,
            comment tu partages sans risques, et comment tu dépannes un souci simple.
          </Alert>
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
          Ce quiz valide les compétences : organisation, sécurité, partage, sauvegardes et dépannage.
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
