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

/**
 * ✅ Word – Niveau 2 (Intermédiaire)
 * Même structure que ton niveau débutant : Hero, objectifs, structure, accordions, quiz final.
 * Tu peux copier-coller ce fichier tel quel dans une page Next.js.
 */

const quizQuestions = [
  {
    id: 1,
    question: "À quoi servent les styles (Titre 1, Titre 2) dans Word ?",
    options: [
      "À écrire plus vite",
      "À structurer et uniformiser la mise en forme du document",
      "À ajouter automatiquement des images",
      "À protéger le document par mot de passe",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Quelle fonctionnalité permet de générer automatiquement une table des matières ?",
    options: [
      "Insertion → Tableau",
      "Références → Table des matières",
      "Mise en page → Marges",
      "Affichage → Zoom",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Quel est l’intérêt des sauts de section ?",
    options: [
      "Changer la couleur du texte",
      "Avoir des mises en page différentes dans un même document",
      "Ajouter une page blanche",
      "Fusionner des documents",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Quelle option permet de mettre un texte en 2 colonnes (style journal) ?",
    options: [
      "Insertion → Colonnes",
      "Mise en page → Colonnes",
      "Références → Colonnes",
      "Accueil → Colonnes",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "Comment suivre des modifications et voir qui a changé quoi ?",
    options: [
      "Affichage → Lecture",
      "Révision → Suivi des modifications",
      "Insertion → Commentaires",
      "Fichier → Informations",
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    question: "À quoi sert l’outil Rechercher / Remplacer ?",
    options: [
      "À traduire un document",
      "À corriger toutes les fautes automatiquement",
      "À trouver un mot et le remplacer partout rapidement",
      "À créer un sommaire",
    ],
    correctIndex: 2,
  },
  {
    id: 7,
    question: "Quel outil sert à insérer des commentaires pour collaborer ?",
    options: [
      "Insertion → Commentaire",
      "Révision → Nouveau commentaire",
      "Affichage → Commentaires",
      "Mise en page → Commentaires",
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    question: "Comment appliquer une numérotation automatique des titres (1, 1.1, 1.2...) ?",
    options: [
      "Accueil → Puces",
      "Références → Légendes",
      "Accueil → Liste à plusieurs niveaux + styles de titres",
      "Insertion → Numéro de page",
    ],
    correctIndex: 2,
  },
  {
    id: 9,
    question: "Quelle solution est la plus propre pour uniformiser toute la mise en forme d’un document long ?",
    options: [
      "Tout modifier à la main",
      "Utiliser les styles + thèmes",
      "Copier-coller des paragraphes",
      "Changer uniquement la police",
    ],
    correctIndex: 1,
  },
];

export default function WordIntermediateCoursePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* HEADER / HERO */}
      <Box component={Paper} elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography
              variant="overline"
              sx={{ letterSpacing: 0.12, color: "text.secondary" }}
            >
              Cours Word – Niveau intermédiaire
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5 }}>
              Word Intermédiaire : Documents structurés & collaboration
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Apprends à créer des documents plus longs et plus propres : styles,
              table des matières, sections, mise en page avancée, et outils de
              collaboration (commentaires, suivi des modifications).
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Intermédiaire" color="primary" size="small" />
              <Chip label="Bureautique" size="small" variant="outlined" />
              <Chip label="Word" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Durée estimée : 6 à 8 heures • Langue : Français
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
              À la fin de ce cours, l&apos;apprenant sera capable de :
            </Typography>
            <List dense>
              {[
                "Structurer un document long avec des styles (Titres, paragraphes) de façon cohérente.",
                "Créer une table des matières automatique et la mettre à jour.",
                "Gérer la mise en page avancée : sections, colonnes, en-têtes/pieds différents.",
                "Automatiser la présentation : numérotation, thèmes, formats réutilisables.",
                "Collaborer efficacement : commentaires, suivi des modifications et versions.",
                "Réaliser un mini-projet : rapport professionnel multi-pages prêt à être partagé.",
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
              <Typography variant="h6">Structure du cours</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Le cours est organisé en leçons courtes, avec mise en pratique
              immédiate et un projet final.
            </Typography>
            <List dense>
              {[
                "Styles : titres et cohérence visuelle",
                "Numérotation automatique des titres",
                "Table des matières automatique",
                "Sauts de page & sauts de section",
                "Mise en page avancée : colonnes et pages différentes",
                "En-têtes / pieds de page avancés",
                "Rechercher & remplacer efficacement",
                "Collaboration : commentaires & suivi des modifications",
                "Projet final : mini-rapport multi-pages",
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

      {/* LEÇONS (ACCORDIONS) */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Contenu détaillé du cours
      </Typography>

      {/* 0. STYLES */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">0. Styles : titres et cohérence visuelle</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Les styles (Titre 1, Titre 2, Normal…) permettent de garder une mise en forme
                uniforme, propre et facile à modifier, même sur un document long.
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem><ListItemText primary="Différence : mise en forme manuelle vs styles." /></ListItem>
                <ListItem><ListItemText primary="Appliquer Titre 1 / Titre 2 / Normal." /></ListItem>
                <ListItem><ListItemText primary="Modifier un style pour changer tout le document d’un coup." /></ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem><ListItemText primary="Créer un document avec 3 titres principaux (Titre 1) et 6 sous-titres (Titre 2)." /></ListItem>
                <ListItem><ListItemText primary="Changer le style Titre 1 (taille/couleur) et vérifier que tout se met à jour." /></ListItem>
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
                  src="/word-level2-styles.png"
                  alt="Styles Word - Titre 1, Titre 2"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 1. NUMEROTATION AUTOMATIQUE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">1. Numérotation automatique des titres (1, 1.1, 1.2…)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            La numérotation multi-niveaux permet de structurer un document de type rapport.
            Elle marche mieux quand elle est liée aux styles.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Liste à plusieurs niveaux et liaison aux styles (Titre 1 / Titre 2)." /></ListItem>
            <ListItem><ListItemText primary="Garder une structure stable (éviter le bricolage à la main)." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Appliquer une numérotation : Titres 1 = 1,2,3 ; Titres 2 = 1.1, 1.2…" /></ListItem>
            <ListItem><ListItemText primary="Ajouter une nouvelle section au milieu et vérifier que tout se renumérote." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 2. TABLE DES MATIERES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">2. Table des matières automatique</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Une table des matières se génère automatiquement à partir des styles de titres.
                Elle se met à jour en un clic.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Références → Table des matières." /></ListItem>
                <ListItem><ListItemText primary="Mettre à jour : pages uniquement ou tout le tableau." /></ListItem>
                <ListItem><ListItemText primary="Pourquoi les styles sont indispensables pour une table fiable." /></ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Créer une table des matières et l’insérer en page 1." /></ListItem>
                <ListItem><ListItemText primary="Modifier un titre, ajouter une section, puis mettre à jour la table." /></ListItem>
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
                  src="/word-level2-toc.png"
                  alt="Table des matières Word"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 3. SAUTS PAGE / SECTION */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">3. Sauts de page & sauts de section</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Les sauts de page et de section sont essentiels pour contrôler la mise en page,
            surtout quand certaines pages doivent être différentes (orientation, en-tête, colonnes…).
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Différence : saut de page vs saut de section." /></ListItem>
            <ListItem><ListItemText primary="Quand utiliser une section : pages différentes dans le même document." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Ajouter un saut de page entre deux chapitres." /></ListItem>
            <ListItem><ListItemText primary="Créer une nouvelle section et modifier l’orientation uniquement pour cette partie." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 4. MISE EN PAGE AVANCEE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">4. Mise en page avancée : colonnes & pages différentes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Apprends à présenter un texte en colonnes (style journal) et à gérer
            des pages différentes dans un même fichier (grâce aux sections).
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Mise en page → Colonnes (1,2,3) + largeur/espacement." /></ListItem>
            <ListItem><ListItemText primary="Appliquer les colonnes uniquement à une section." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Mettre une partie du document en 2 colonnes." /></ListItem>
            <ListItem><ListItemText primary="Revenir à une colonne sur la section suivante." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 5. EN-TETES / PIEDS DE PAGE AVANCES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">5. En-têtes / pieds de page avancés</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Personnalise tes en-têtes/pieds de page : page de garde sans numéro,
            en-tête différent sur la première page, et sections indépendantes.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Option : première page différente." /></ListItem>
            <ListItem><ListItemText primary="Lier au précédent : comprendre et désactiver si nécessaire." /></ListItem>
            <ListItem><ListItemText primary="Numérotation qui démarre après la page de garde." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer une page de garde sans numéro." /></ListItem>
            <ListItem><ListItemText primary="Faire démarrer la numérotation à la page suivante (page 2 = 1)." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 6. RECHERCHER / REMPLACER */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">6. Rechercher & remplacer efficacement</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Pour gagner du temps sur un document long : rechercher des mots, corriger des répétitions,
            remplacer un terme partout, et gérer les formats.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Ctrl+F (rechercher) et Ctrl+H (remplacer)." /></ListItem>
            <ListItem><ListItemText primary="Remplacer un mot uniquement en majuscule / avec format." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Remplacer un mot (ex: “client”) par “partenaire” dans tout le document." /></ListItem>
            <ListItem><ListItemText primary="Rechercher les doubles espaces et les remplacer par un espace." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 7. COLLABORATION */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">7. Collaboration : commentaires & suivi des modifications</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Word permet de travailler à plusieurs : ajouter des commentaires, proposer des corrections,
            et suivre précisément ce qui a changé.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Révision → Nouveau commentaire." /></ListItem>
            <ListItem><ListItemText primary="Révision → Suivi des modifications : accepter/refuser." /></ListItem>
            <ListItem><ListItemText primary="Afficher : Simple / Toutes les marques." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Ajouter 3 commentaires à des passages précis." /></ListItem>
            <ListItem><ListItemText primary="Activer le suivi, modifier un paragraphe, puis accepter/refuser les changements." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 8. PROJET FINAL */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">8. Projet final : mini-rapport multi-pages</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Crée un mini-rapport de 3 à 5 pages, structuré et professionnel, avec table des matières
            et mise en page avancée.
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Consignes :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Page de garde + titre principal." /></ListItem>
            <ListItem><ListItemText primary="Au moins 3 chapitres (Titre 1) + sous-sections (Titre 2)." /></ListItem>
            <ListItem><ListItemText primary="Numérotation automatique des titres." /></ListItem>
            <ListItem><ListItemText primary="Table des matières en page 2 (mise à jour)." /></ListItem>
            <ListItem><ListItemText primary="Au moins une section avec colonnes." /></ListItem>
            <ListItem><ListItemText primary="Numérotation des pages à partir du contenu (pas sur la page de garde)." /></ListItem>
            <ListItem><ListItemText primary="Exporter en PDF." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 4 }} />

      {/* QUIZ FINAL */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <QuizIcon color="primary" />
          <Typography variant="h5">Quiz de fin de cours</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ce quiz valide les notions intermédiaires : styles, structure, sections, table des matières
          et collaboration.
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
