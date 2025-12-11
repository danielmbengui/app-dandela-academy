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
    question: "La fonction SOMME.SI.ENS permet de :",
    options: [
      "Faire une somme sans critère",
      "Faire une somme avec un seul critère",
      "Faire une somme avec plusieurs critères",
      "Calculer une moyenne",
    ],
    correctIndex: 2,
  },
  {
    id: 2,
    question:
      "Quelle combinaison est souvent utilisée pour des recherches avancées plutôt que RECHERCHEV ?",
    options: ["INDEX + EQUIV", "MEDIANE + MOYENNE", "NB + NBVAL", "MIN + MAX"],
    correctIndex: 0,
  },
  {
    id: 3,
    question: "La fonction UNIQUE(plage) permet de :",
    options: [
      "Supprimer les lignes vides",
      "Renommer les colonnes",
      "Renvoyer les valeurs distinctes d’une plage",
      "Trier les valeurs par ordre croissant",
    ],
    correctIndex: 2,
  },
  {
    id: 4,
    question:
      "Dans un tableau croisé dynamique avancé, un « segment » (slicer) sert à :",
    options: [
      "Modifier la mise en forme",
      "Filtrer les données du TCD visuellement",
      "Créer un nouveau TCD",
      "Ajouter une nouvelle feuille",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question:
      "Quel type de graphique est typiquement utilisé pour superposer un chiffre d’affaires (colonnes) et une marge (%) ?",
    options: [
      "Graphique en secteurs",
      "Graphique en aires",
      "Graphique combiné colonnes + courbe",
      "Graphique en radar",
    ],
    correctIndex: 2,
  },
  {
    id: 6,
    question:
      "La fonction FILTRE(plage; condition) permet de :",
    options: [
      "Enlever les doublons",
      "Afficher uniquement les lignes respectant une condition",
      "Transformer le format de la date",
      "Arrondir des nombres",
    ],
    correctIndex: 1,
  },
  {
    id: 7,
    question:
      "ECARTYPE(plage) est une fonction qui sert à :",
    options: [
      "Trouver la valeur maximale",
      "Mesurer la dispersion des valeurs par rapport à la moyenne",
      "Compter les cellules non vides",
      "Trier les valeurs par ordre croissant",
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    question:
      "Power Query est utilisé principalement pour :",
    options: [
      "Créer des macros VBA",
      "Nettoyer, transformer et charger des données",
      "Créer des graphiques 3D",
      "Gérer les droits d’accès au fichier",
    ],
    correctIndex: 1,
  },
];

export default function ExcelLevel4CoursePage() {
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
              Cours Excel – Niveau 4 (Avancé)
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5 }}>
              Excel Avancé : Analyse multi-critères & TCD avancés
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Maîtrise les fonctions conditionnelles avancées, les recherches
              complexes, les fonctions matricielles modernes, les tableaux
              croisés dynamiques avancés et construis des dashboards
              professionnels.
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Niveau 4" color="primary" size="small" />
              <Chip label="Excel avancé" size="small" variant="outlined" />
              <Chip label="Data analysis" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Prérequis : Niveau 2 & 3 validés (ou expérience équivalente)
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
                <ListItemText primary="Construire des formules conditionnelles avancées avec SOMME.SI.ENS, NB.SI.ENS, MOYENNE.SI." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Mettre en place des recherches complexes avec INDEX + EQUIV, y compris multi-critères." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Utiliser des fonctions matricielles modernes (UNIQUE, TRIER, FILTRE, SEQUENCE)." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Construire des tableaux croisés dynamiques avancés avec segments, regroupements et champs calculés." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Créer des graphiques combinés et des mini tableaux de bord dynamiques." />
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
              On se concentre sur la puissance d’Excel pour l’analyse de données,
              avec un fort accent sur les fonctions conditionnelles et les TCD.
            </Typography>
            <List dense>
              {[
                "Préparation des données pour l’analyse avancée",
                "Fonctions conditionnelles avancées (SOMME.SI.ENS, NB.SI.ENS, MOYENNE.SI)",
                "Recherches avancées avec INDEX + EQUIV",
                "Fonctions matricielles modernes (UNIQUE, TRIER, FILTRE, SEQUENCE)",
                "Statistiques avancées simples (ECARTYPE, MEDIANE, QUARTILE)",
                "TCD avancés (segments, regroupements, champs calculés)",
                "Graphiques avancés & combinés",
                "Mini-projet : Dashboard d’analyse avancée",
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

      {/* 0. PREPA */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            0. Préparation des données pour l’analyse avancée
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Avant de lancer des analyses avancées, on vérifie que la base de
            données est propre, structurée en colonnes, et prête pour les
            fonctions et TCD.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Une ligne = un enregistrement (ex: une vente, une facture, une commande)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Chaque colonne a un en-tête clair (Date, Client, Produit, Montant, Catégorie, etc.)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Pas de lignes ou colonnes vides au milieu du tableau." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Sur une base de 200 à 500 lignes (fictive ou réelle), vérifier la cohérence des types de données (pas de texte dans les colonnes de montants, etc.)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Convertir la plage de données en « Tableau » Excel (Insertion → Tableau) pour faciliter les manipulations." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 1. FONCTIONS CONDITIONNELLES AVANCÉES + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            1. Fonctions conditionnelles avancées : SOMME.SI.ENS, NB.SI.ENS, MOYENNE.SI
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Ces fonctions permettent de faire des calculs en tenant compte
                d’un ou plusieurs critères (par exemple : total des ventes pour
                un client donné sur une période donnée).
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Fonctions principales :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="SOMME.SI(plage_critère; critère; plage_somme)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="SOMME.SI.ENS(plage_somme; plage_critère1; critère1; plage_critère2; critère2; ...)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="NB.SI / NB.SI.ENS : compter le nombre de lignes qui répondent aux critères." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="MOYENNE.SI : moyenne des valeurs qui respectent un critère." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exemples :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Total des ventes pour un client donné : SOMME.SI(plage_client; Dupont; plage_montant)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Total des ventes pour un client dans une année donnée : SOMME.SI.ENS(plage_montant; plage_client; Dupont; plage_annee; 2025)." />
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
                  src="/excel-level4-conditional-advanced.png"
                  alt="Fonctions conditionnelles avancées dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 2. INDEX + EQUIV + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            2. Recherches avancées avec INDEX + EQUIV
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                INDEX + EQUIV permet des recherches plus flexibles que RECHERCHEV,
                notamment lorsque la colonne cherchée n’est pas la première du
                tableau, ou pour gérer des recherches bi-dimensionnelles.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Principes :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="EQUIV(valeur_cherchée; plage; type) renvoie la position de la valeur." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="INDEX(plage; no_ligne; [no_colonne]) renvoie la valeur située à une position donnée." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Combinaison : INDEX(plage_valeurs; EQUIV(valeur; plage_recherche; 0))." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Créer une feuille « Référentiel_clients » avec ID, Nom, Pays, Segment." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Dans la feuille Données, récupérer automatiquement le Segment à partir de l’ID client en utilisant INDEX + EQUIV." />
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
                  src="/excel-level4-index-match.png"
                  alt="INDEX + EQUIV dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 3. FONCTIONS MATRICIELLES MODERNES + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            3. Fonctions matricielles modernes : UNIQUE, TRIER, FILTRE, SEQUENCE
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Ces fonctions (disponibles dans les versions récentes d&apos;Excel)
                permettent de travailler avec des plages de données dynamiques,
                qui « se répandent » automatiquement sur plusieurs cellules.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Fonctions clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="UNIQUE(plage) : renvoie la liste des valeurs distinctes." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="TRIER(plage; [indice_col]; [ordre]; [par_colonne]) : trie dynamiquement un tableau." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="FILTRE(plage; condition) : renvoie uniquement les lignes respectant la condition." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="SEQUENCE(lignes; [colonnes]; [début]; [pas]) : génère une série de nombres." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Créer une liste dynamique des pays distincts à partir de la colonne Pays avec UNIQUE." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Créer un sous-tableau des ventes du pays « France » avec FILTRE." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Trier les ventes par montant décroissant avec TRIER." />
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
                  src="/excel-level4-matrix-functions.png"
                  alt="Fonctions matricielles modernes dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 4. STATISTIQUES SIMPLES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            4. Statistiques avancées simples : ECARTYPE, MEDIANE, QUARTILE
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Ces fonctions permettent d&apos;aller au-delà de la moyenne pour mieux
            comprendre la distribution des données.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Fonctions clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="MEDIANE(plage) : valeur médiane (au milieu des données triées)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="ECARTYPE(plage) : mesure de dispersion autour de la moyenne." />
            </ListItem>
            <ListItem>
              <ListItemText primary="QUARTILE(plage; quart) : renvoie les quartiles (quart = 1, 2, 3...). " />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Calculer moyenne, médiane et écart-type des montants de vente, puis comparer ces indicateurs." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 5. TCD AVANCÉS + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            5. Tableaux croisés dynamiques avancés (segments, regroupements, champs calculés)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                On passe au niveau supérieur avec les TCD : regroupements par
                mois/année, segments pour filtrer rapidement, champs calculés
                pour créer des indicateurs.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Fonctions clés des TCD avancés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Regrouper les dates par mois / trimestre / année." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Ajouter des segments (slicers) pour filtrer par pays, produit, etc." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Créer un champ calculé dans le TCD (ex: Marge = Montant - Coût)." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Construire un TCD qui affiche le total des ventes par mois et par pays, avec un segment pour filtrer par pays." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Ajouter un champ calculé pour la marge." />
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
                  src="/excel-level4-tcd-advanced.png"
                  alt="Tableaux croisés dynamiques avancés dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 6. GRAPHIQUES AVANCÉS */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            6. Graphiques avancés et combinés (KPI, colonnes + courbe)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Les graphiques combinés permettent de suivre plusieurs indicateurs
            sur un même visuel (par exemple : chiffre d’affaires en colonnes
            et marge en pourcentage en courbe).
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Créer un graphique combiné (colonnes + courbe) à partir d’un tableau synthétique." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Utiliser un axe secondaire pour l’indicateur en pourcentage." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ajouter des étiquettes de données sur les KPI importants." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 7. MINI PROJET */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            7. Mini-projet : Dashboard d’analyse avancée
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Ce mini-projet rassemble toutes les notions du niveau 4 dans un
            tableau de bord avancé.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Objectif :
          </Typography>
          <Typography variant="body2">
            À partir d’une base de données de ventes réelle ou simulée (plusieurs
            centaines de lignes), l’apprenant doit :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Nettoyer la base si nécessaire et la structurer en Tableau." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Créer des indicateurs clés avec SOMME.SI.ENS / NB.SI.ENS (par pays, par produit, par client)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Mettre en place au moins une recherche avancée avec INDEX + EQUIV." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Utiliser au moins une fonction matricielle (UNIQUE, TRIER, FILTRE) pour préparer des listes dynamiques." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Construire un TCD avancé + graphique combiné sur une feuille Dashboard." />
            </ListItem>
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
          Ce quiz permet de valider la maîtrise des fonctions avancées, des
          recherches complexes, des fonctions matricielles et des TCD avancés.
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
