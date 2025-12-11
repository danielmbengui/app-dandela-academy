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

const quizQuestions = [
  {
    id: 1,
    question: "L’enregistreur de macros permet principalement de :",
    options: [
      "Créer des graphiques 3D",
      "Enregistrer une suite d’actions pour les rejouer automatiquement",
      "Créer un tableau croisé dynamique",
      "Traduire automatiquement des données",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Le langage utilisé derrière les macros Excel est :",
    options: ["JavaScript", "Python", "VBA (Visual Basic for Applications)", "C#"],
    correctIndex: 2,
  },
  {
    id: 3,
    question: "Power Query sert principalement à :",
    options: [
      "Créer des macros",
      "Nettoyer, transformer et charger des données depuis différentes sources",
      "Faire des graphiques avancés",
      "Protéger des feuilles",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question:
      "Power Pivot et le « modèle de données » permettent de :",
    options: [
      "Modifier la mise en page",
      "Créer un modèle relationnel et des mesures DAX",
      "Changer le thème d’Excel",
      "Envoyer des emails",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question:
      "Quel outil Excel permet de tester différents scénarios (par ex : différents niveaux de prix) ?",
    options: [
      "Gestionnaire de scénarios",
      "Graphique combiné",
      "Mise en forme conditionnelle",
      "Validation des données",
    ],
    correctIndex: 0,
  },
  {
    id: 6,
    question:
      "Quel outil permet de trouver automatiquement la valeur nécessaire pour atteindre un résultat donné ?",
    options: [
      "Valeur cible (Goal Seek)",
      "Tableau croisé dynamique",
      "Power Query",
      "Remplissage instantané",
    ],
    correctIndex: 0,
  },
  {
    id: 7,
    question:
      "Une bonne pratique pour un dashboard Excel expert est :",
    options: [
      "Multiplier les couleurs et effets graphiques",
      "Rester minimaliste et orienté sur les indicateurs clés",
      "Éviter les segments et filtres",
      "Mélanger les données brutes avec les visuels",
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    question:
      "Une macro enregistrée avec l’enregistreur peut ensuite être :",
    options: [
      "Supprimée uniquement",
      "Modifiée manuellement dans l’éditeur VBA",
      "Utilisée uniquement une fois",
      "Exportée uniquement en PDF",
    ],
    correctIndex: 1,
  },
];

export default function ExcelLevel5CoursePage() {
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
              Cours Excel – Niveau 5 (Expert)
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5 }}>
              Excel Expert : Macros, Power Query, Power Pivot & Dashboards
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Découvre les fonctionnalités les plus avancées d&apos;Excel : macros &
              VBA, Power Query, Power Pivot, scénarios, Valeur cible et construction
              de dashboards experts.
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Niveau 5" color="primary" size="small" />
              <Chip label="Excel expert" size="small" variant="outlined" />
              <Chip label="Automation & BI" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Prérequis : solide maîtrise des niveaux 3 et 4
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
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Enregistrer et exécuter des macros simples pour automatiser des tâches répétitives." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Comprendre les bases de VBA pour adapter une macro ou écrire un petit script." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Utiliser Power Query pour importer, transformer et nettoyer des données." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Créer un modèle de données avec Power Pivot et des mesures simples." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Utiliser Valeur cible et le Gestionnaire de scénarios pour l’analyse ‘what-if’." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Concevoir un dashboard Excel expert clair, dynamique et orienté décisions." />
              </ListItem>
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
              Dernier niveau : on se rapproche d’un usage “pro” d’Excel en
              entreprise ou en analyse de données.
            </Typography>
            <List dense>
              {[
                "Introduction & bonnes pratiques d’un fichier expert",
                "Macros & enregistreur (VBA niveau débutant)",
                "Power Query : importer, transformer, fusionner",
                "Power Pivot & modèle de données",
                "Scénarios, Valeur cible & analyse ‘what-if’",
                "Optimisation et sécurisation du classeur",
                "Dashboard expert (KPI, segments, interactions)",
                "Mini-projet : Dashboard final automatisé",
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

      {/* LEÇONS */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Contenu détaillé du cours
      </Typography>

      {/* 0. INTRO */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            0. Introduction & bonnes pratiques d’un fichier expert
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Avant d&apos;utiliser des outils très avancés, il est essentiel d&apos;avoir
            une structure de fichier propre : séparation des données, des
            calculs et des visuels.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Bonnes pratiques :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Feuilles dédiées : Données brutes, Données transformées, Calculs, Dashboard." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Nommage cohérent des plages, tableaux et mesures." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Documenter le fichier (feuille « Info » ou « Lire-moi »)." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 1. MACROS & VBA + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            1. Macros & enregistreur (VBA niveau débutant)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Les macros permettent d&apos;automatiser des actions répétitives.
                L’enregistreur de macros convertit tes actions en code VBA.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Activer l’onglet Développeur si nécessaire." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Enregistrer une macro simple (mise en forme, insertion de date, etc.)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Affecter une macro à un bouton (Forme ou Contrôle)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Ouvrir l’éditeur VBA et lire le code généré." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Enregistrer une macro qui met en forme automatiquement un tableau (titres en gras, bordures, format monétaire)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Affecter la macro à un bouton sur la feuille Dashboard." />
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
                  src="/excel-level5-macros.png"
                  alt="Macros & VBA dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 2. POWER QUERY + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            2. Power Query : importer, transformer & nettoyer les données
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Power Query est l’outil ETL (Extract – Transform – Load) d’Excel.
                Il permet d’importer des données de multiples sources et de les
                transformer sans écrire de formule.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Étapes de base :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Données → Obtenir des données (fichiers CSV, Excel, bases de données, web…)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Nettoyer : supprimer des colonnes, filtrer, remplacer des valeurs, fractionner des colonnes." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Fusionner ou ajouter des requêtes (jointures et concaténation de tables)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Charger les données dans Excel ou dans le modèle de données." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Importer un fichier CSV de ventes brutes via Power Query." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Nettoyer les colonnes, filtrer des lignes inutiles et charger le résultat dans une nouvelle feuille." />
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
                  src="/excel-level5-power-query.png"
                  alt="Power Query dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 3. POWER PIVOT + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            3. Power Pivot & modèle de données
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Power Pivot permet de créer un modèle de données relationnel
                (plusieurs tables reliées) et de définir des mesures avec DAX.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Concepts clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Tables de faits (ex: Ventes) et tables de dimensions (ex: Produits, Clients, Dates)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Relations entre les tables (1-n, n-1)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Création de mesures simples (ex: TotalVentes = SOMME(Ventes[Montant])). " />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Charger via Power Query une table Ventes et une table Clients dans le modèle de données." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Créer une relation entre Ventes[IDClient] et Clients[IDClient]." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Créer une mesure TotalVentes et l’utiliser dans un TCD basé sur le modèle de données." />
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
                  src="/excel-level5-power-pivot.png"
                  alt="Power Pivot & modèle de données dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 4. WHAT-IF ANALYSIS */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            4. Scénarios, Valeur cible & analyse ‘what-if’
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            L’analyse « what-if » permet de répondre à des questions du type :
            « Que se passe-t-il si je change tel paramètre ? ».
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Outils principaux :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Valeur cible (Goal Seek) : trouver la valeur d’entrée nécessaire pour obtenir un résultat donné." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Gestionnaire de scénarios : comparer plusieurs jeux de valeurs pour des hypothèses différentes." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Tables de données à une ou deux variables (pour voir l’impact d’un paramètre sur un résultat)." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Utiliser Valeur cible pour trouver le prix de vente nécessaire pour atteindre un chiffre d’affaires donné." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Créer deux scénarios (optimiste / pessimiste) dans le Gestionnaire de scénarios et comparer les résultats." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 5. OPTIMISATION & SECURISATION */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            5. Optimisation et sécurisation du classeur
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Un fichier expert doit être performant et sécurisé pour éviter
            les erreurs de manipulation.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Bonnes pratiques :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Protéger les feuilles critiques (formules, paramètres) et laisser certaines zones éditables." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Utiliser la validation des données pour limiter les valeurs autorisées (listes déroulantes, seuils, etc.)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Limiter les formules volatiles et les calculs inutiles pour éviter les lenteurs." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 6. DASHBOARD EXPERT + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            6. Dashboard expert : KPI, segments & interactions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                On assemble toutes les briques pour créer un dashboard expert
                lisible, interactif et orienté décision.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Contenu recommandé :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="3 à 5 indicateurs clés (KPI) en haut du dashboard." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="1 à 2 grandes zones de graphiques (par période, par segment, par produit)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Segments (slicers) pour filtrer par pays, produit, période, etc." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Interaction avec les TCD/graphes reliés au modèle de données." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Créer une feuille Dashboard final avec KPI, graphiques et segments connectés au modèle de données." />
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
                  src="/excel-level5-advanced-dashboard.png"
                  alt="Dashboard expert dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 7. MINI PROJET */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            7. Mini-projet final : Dashboard automatisé & documenté
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Le mini-projet final réunit toutes les briques du niveau 5 pour
            construire un fichier Excel expert complet.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Objectif :
          </Typography>
          <Typography variant="body2">
            À partir de plusieurs sources de données (CSV, Excel, éventuellement
            base de données ou export système), l’apprenant doit :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Importer les données via Power Query, les nettoyer et les charger dans le modèle de données." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Construire un modèle Power Pivot simple (tables, relations, mesures)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Créer un dashboard avec KPI, TCD, graphiques, segments filtrants." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Automatiser une petite partie (mise en forme, actualisation, etc.) avec une macro." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Documenter le fichier (feuille Info : source des données, fonctionnement global, raccourcis macros)." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 4 }} />

      {/* QUIZ FINAL */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <QuizIcon color="primary" />
          <Typography variant="h5">Quiz de fin de parcours Excel Expert</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ce quiz clôture le parcours Excel Niveau 1 à 5 et valide la maîtrise
          des concepts avancés et experts.
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
