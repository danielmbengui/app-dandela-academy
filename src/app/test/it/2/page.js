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
import CloudIcon from "@mui/icons-material/Cloud";
import StorageIcon from "@mui/icons-material/Storage";
import PrintIcon from "@mui/icons-material/Print";
import AppsIcon from "@mui/icons-material/Apps";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";

/**
 * ✅ Introduction à l’informatique – Niveau 2 (Intermédiaire)
 * Thème : utilisation quotidienne + autonomie (cloud, stockage, PDF, imprimante, installations, permissions, sauvegardes).
 */

const quizQuestions = [
  {
    id: 1,
    question: "Le “cloud” (Google Drive / iCloud / OneDrive) sert principalement à :",
    options: [
      "Accélérer l’ordinateur",
      "Stocker et synchroniser des fichiers en ligne",
      "Supprimer les virus",
      "Créer automatiquement des mots de passe",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Quelle différence essentielle entre “Télécharger” et “Importer/Envoyer” ?",
    options: [
      "Télécharger = envoyer vers Internet, Importer = recevoir",
      "Télécharger = récupérer un fichier depuis Internet, Importer/Envoyer = mettre un fichier en ligne",
      "C’est la même chose",
      "Importer = supprimer un fichier",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Un fichier .pdf est souvent utilisé car :",
    options: [
      "Il se modifie facilement comme Word",
      "Il garde la mise en page et s’ouvre sur presque tous les appareils",
      "Il ne peut pas être envoyé par e-mail",
      "Il sert uniquement aux images",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Quand une application demande l’accès aux Photos/Contacts, cela s’appelle :",
    options: ["Un bug", "Une permission", "Une mise à jour", "Un virus"],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "La meilleure pratique avant d’installer une application est :",
    options: [
      "Installer depuis n’importe quel site",
      "Vérifier la source (Store officiel) + avis + permissions",
      "Désactiver la sécurité",
      "Donner toutes les permissions",
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    question: "Si ton stockage est presque plein, tu dois en priorité :",
    options: [
      "Ignorer, ça n’a aucun impact",
      "Supprimer fichiers inutiles / vider corbeille / déplacer au cloud",
      "Changer la couleur du fond d’écran",
      "Installer plus d’applications",
    ],
    correctIndex: 1,
  },
  {
    id: 7,
    question: "À quoi sert une sauvegarde (backup) ?",
    options: [
      "À augmenter la vitesse du Wi-Fi",
      "À récupérer ses données en cas de perte/casse/vol",
      "À rendre les photos plus belles",
      "À empêcher les mails",
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    question: "Imprimer un document en PDF signifie généralement :",
    options: [
      "Le document sort sur papier automatiquement",
      "Créer un fichier PDF à partir d’un document, sans imprimante papier",
      "Supprimer le document",
      "Changer la langue",
    ],
    correctIndex: 1,
  },
  {
    id: 9,
    question: "Qu’est-ce qu’une authentification à 2 facteurs (2FA) ?",
    options: [
      "Un deuxième écran",
      "Un code supplémentaire (SMS/app) en plus du mot de passe",
      "Un antivirus",
      "Un réglage Wi-Fi",
    ],
    correctIndex: 1,
  },
];

export default function IntroInformatiqueLevel2Page() {
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
              Introduction à l’informatique – Niveau intermédiaire
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mt: 0.5 }}>
              Devenir autonome au quotidien (cloud, stockage, PDF, apps)
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Ce niveau te rend autonome : gérer tes fichiers entre téléphone/ordinateur, comprendre le cloud,
              installer/désinstaller des applications correctement, utiliser le PDF, imprimer/scanner, gérer le stockage
              et appliquer des bonnes pratiques de sécurité.
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Intermédiaire" color="primary" size="small" />
              <Chip label="Autonomie" size="small" variant="outlined" />
              <Chip label="PC & Mobile" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Durée estimée : 5 à 7 heures • Langue : Français
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
                "Comprendre le cloud (Drive/iCloud/OneDrive) et synchroniser des fichiers.",
                "Transférer des fichiers entre mobile ↔ PC (câble, AirDrop/Nearby Share, cloud).",
                "Gérer le stockage : nettoyer, organiser, compresser, déplacer vers le cloud.",
                "Installer/désinstaller des applications en sécurité et gérer les permissions.",
                "Créer, partager et “imprimer en PDF” un document propre.",
                "Scanner un document (mobile) et l’envoyer par e-mail ou WhatsApp en PDF.",
                "Mettre en place des sauvegardes simples (photos, contacts, documents).",
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
              Le niveau est orienté pratique (scénarios de la vraie vie).
            </Typography>
            <List dense>
              {[
                "Cloud & synchronisation (Drive/iCloud/OneDrive)",
                "Transferts mobile ↔ PC (câble, partage, cloud)",
                "Stockage & organisation (nettoyage, compression)",
                "PDF : créer, partager, signer (bases)",
                "Imprimer & scanner (smartphone / imprimante)",
                "Applications & permissions (installation propre)",
                "Sécurité : 2FA, mises à jour, confidentialité",
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

      {/* 0. CLOUD */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">0. Cloud & synchronisation (Drive/iCloud/OneDrive)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <CloudIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  Objectif : comprendre où sont tes fichiers et comment les retrouver partout.
                </Typography>
              </Stack>

              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem><ListItemText primary="Cloud = stockage en ligne + synchronisation sur plusieurs appareils." /></ListItem>
                <ListItem><ListItemText primary="Avantage : retrouver ses fichiers même si l’appareil est perdu/cassé." /></ListItem>
                <ListItem><ListItemText primary="Différence : “Télécharger” (download) vs “Envoyer/Importer” (upload)." /></ListItem>
                <ListItem><ListItemText primary="Organiser dans Drive : dossiers + noms clairs + recherche." /></ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem><ListItemText primary="Créer un dossier “Documents importants” dans le cloud." /></ListItem>
                <ListItem><ListItemText primary="Y envoyer 2 fichiers (photo + PDF) et les retrouver sur un autre appareil." /></ListItem>
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
                  src="/intro-it-level2-cloud.png"
                  alt="Cloud : synchronisation et dossiers"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 1. TRANSFERTS */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">1. Transferts mobile ↔ PC (câble, partage, cloud)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Savoir transférer des fichiers te rend autonome : photos, CV, PDF, documents administratifs…
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Méthodes :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Câble USB : copier/coller depuis le dossier du téléphone (selon système)." /></ListItem>
            <ListItem><ListItemText primary="Partage sans fil : AirDrop (Apple) / Nearby Share (Android/Windows)." /></ListItem>
            <ListItem><ListItemText primary="Cloud : envoyer dans Drive puis récupérer sur l’ordinateur." /></ListItem>
            <ListItem><ListItemText primary="E-mail/WhatsApp : OK pour petits fichiers (attention à la qualité des photos)." /></ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Envoyer une photo du téléphone vers le PC (au choix : câble ou cloud)." /></ListItem>
            <ListItem><ListItemText primary="Créer un dossier “Transferts” sur le PC et y ranger le fichier." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 2. STOCKAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">2. Stockage & organisation (nettoyage, compression)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <StorageIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : libérer de la place sans perdre l’essentiel.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Identifier ce qui prend de la place : vidéos, téléchargements, doublons." /></ListItem>
            <ListItem><ListItemText primary="Nettoyage : supprimer inutiles + vider corbeille." /></ListItem>
            <ListItem><ListItemText primary="Déplacer vers le cloud / disque externe si besoin." /></ListItem>
            <ListItem><ListItemText primary="Compression (zip) : regrouper plusieurs fichiers pour partager plus facilement." /></ListItem>
          </List>

          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            Astuce : avant de supprimer, vérifie si le fichier est déjà sauvegardé (cloud / copie).
          </Alert>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Vider le dossier Téléchargements (supprimer ce qui est inutile)." /></ListItem>
            <ListItem><ListItemText primary="Créer une archive .zip de 5 fichiers et l’envoyer par e-mail." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 3. PDF */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">3. PDF : créer, partager, signer (bases)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Le PDF est le format le plus utilisé pour envoyer un document “pro” qui garde sa mise en page.
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Exporter en PDF depuis Word/Google Docs : Fichier → Exporter/Enregistrer sous." /></ListItem>
            <ListItem><ListItemText primary="“Imprimer en PDF” : créer un PDF même sans imprimante papier." /></ListItem>
            <ListItem><ListItemText primary="Partager : e-mail, WhatsApp, Drive (lien de partage)." /></ListItem>
            <ListItem><ListItemText primary="Signature (bases) : ajouter une signature scannée ou signer via une app (selon appareil)." /></ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer un document simple (1 page) et l’exporter en PDF." /></ListItem>
            <ListItem><ListItemText primary="Renommer le PDF de façon propre : “Demande_2026-01.pdf”." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 4. IMPRIMER / SCANNER */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">4. Imprimer & scanner (smartphone / imprimante)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <PrintIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : envoyer un dossier administratif en PDF propre.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Scanner avec smartphone : document à plat, bonne lumière, cadrage propre." /></ListItem>
            <ListItem><ListItemText primary="Exporter le scan en PDF (plus propre que des photos séparées)." /></ListItem>
            <ListItem><ListItemText primary="Imprimer : choisir imprimante, pages, orientation, recto/verso si dispo." /></ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Scanner 2 pages (ex: pièce d’identité + attestation) et créer un PDF unique." /></ListItem>
            <ListItem><ListItemText primary="Envoyer le PDF par e-mail avec un objet clair." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 5. APPS & PERMISSIONS */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">5. Applications & permissions (installation propre)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <AppsIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : installer sans risques et contrôler ce que l’app peut faire.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Installer via stores officiels (Play Store / App Store / Microsoft Store) quand possible." /></ListItem>
            <ListItem><ListItemText primary="Vérifier : éditeur, avis, nombre de téléchargements, permissions demandées." /></ListItem>
            <ListItem><ListItemText primary="Désinstaller proprement si inutile + supprimer les fichiers associés si besoin." /></ListItem>
            <ListItem><ListItemText primary="Permissions : Photos, Micro, Localisation… n’autoriser que si nécessaire." /></ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Installer une app utile (ex: lecteur PDF) et vérifier ses permissions." /></ListItem>
            <ListItem><ListItemText primary="Retirer une permission inutile (ex: localisation) dans les réglages." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 6. SECURITE & CONFIDENTIALITE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">6. Sécurité : 2FA, mises à jour, confidentialité</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <SecurityIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Objectif : protéger tes comptes et ton appareil.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Activer 2FA sur e-mail (important) + réseaux sociaux." /></ListItem>
            <ListItem><ListItemText primary="Mises à jour système/apps : sécurité + stabilité." /></ListItem>
            <ListItem><ListItemText primary="Écran verrouillé + code/PIN + biométrie si possible." /></ListItem>
            <ListItem><ListItemText primary="Confidentialité : vérifier ce que les apps peuvent accéder (micro, caméra…)." /></ListItem>
          </List>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
            <SettingsIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Mini-rituel : 1×/mois → mises à jour + nettoyage stockage + vérifier comptes.
            </Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Activer 2FA sur un compte important (ou au moins vérifier si c’est activé)." /></ListItem>
            <ListItem><ListItemText primary="Mettre à jour 3 applications et redémarrer l’appareil." /></ListItem>
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
          Ce quiz valide l’autonomie : cloud, transferts, stockage, PDF, apps/permissions et sécurité.
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
