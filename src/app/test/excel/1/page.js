"use client";

import React, { useEffect } from "react";
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
import { ClassLessonChapter } from "@/classes/lessons/ClassLessonChapter";

const quizQuestions = [
  {
    id: 1,
    question: "Comment s'appelle le fichier principal dans Excel ?",
    options: ["Document", "Classeur", "Présentation", "Projet"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Que représente une 'cellule' dans Excel ?",
    options: [
      "Une page entière",
      "L'intersection d'une ligne et d'une colonne",
      "Une colonne complète",
      "Une feuille entière",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Laquelle de ces écritures est une formule valide dans Excel ?",
    options: ["2 + 3", "=2+3", "=2,3", "+2=3"],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "À quoi sert la fonction =SOMME(A1:A5) ?",
    options: [
      "À afficher le texte 'SOMME'",
      "À additionner les valeurs de A1 à A5",
      "À compter le nombre de cellules",
      "À trier les valeurs",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "Que permet un filtre automatique sur un tableau de données ?",
    options: [
      "Modifier la mise en forme",
      "Masquer/afficher les lignes selon des critères",
      "Créer des graphiques",
      "Effacer toutes les données",
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    question:
      "Quel type de graphique est le plus adapté pour comparer des valeurs entre catégories ?",
    options: ["Camembert", "Histogramme (colonnes)", "Courbe", "Nuage de points"],
    correctIndex: 1,
  },
  {
    id: 7,
    question: "Comment enregistrer un classeur Excel au format PDF ?",
    options: [
      "Fichier → Enregistrer sous → Type PDF",
      "Insertion → PDF",
      "Accueil → PDF",
      "Affichage → Exporter",
    ],
    correctIndex: 0,
  },
  {
    id: 8,
    question: "Que signifie la référence de cellule 'B3' ?",
    options: [
      "Colonne 3, ligne B",
      "Colonne B, ligne 3",
      "3e feuille, 2e colonne",
      "3e classeur",
    ],
    correctIndex: 1,
  },
  {
    id: 9,
    question: "Que fait Excel si tu modifies une valeur utilisée dans une formule ?",
    options: [
      "Il ne se passe rien",
      "Il met automatiquement à jour le résultat de la formule",
      "Il supprime la formule",
      "Il affiche un message d'erreur systématique",
    ],
    correctIndex: 1,
  },
];

export default function ExcelBeginnerCoursePage() {
  useEffect(() => {
    async function init() {
      const chapter = await ClassLessonChapter.fetchFromFirestore("IA6ofDlGK8Rna2esFsc8");
      console.log("CHAPTER", chapter)
    }
    init()
  })
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
              Cours Excel – Niveau débutant
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5 }}>
              Initiation à Microsoft Excel
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Découvre les bases d&apos;Excel : cellules, formules simples, tableaux et
              graphiques. Idéal pour démarrer la bureautique orientée chiffres
              et tableaux de données.
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Débutant" color="primary" size="small" />
              <Chip label="Bureautique" size="small" variant="outlined" />
              <Chip label="Excel" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Durée estimée : 4 à 6 heures • Langue : Français
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
                <ListItemText primary="Comprendre la structure d’un classeur, d’une feuille et des cellules." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Saisir et mettre en forme des données simples (texte, nombres, dates)." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Réaliser des calculs de base avec des formules et la fonction SOMME." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Créer un petit tableau de données et appliquer un tri ou un filtre." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Créer un graphique simple à partir d’un tableau de données." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Enregistrer un classeur et l’exporter en PDF." />
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
              Le cours est organisé en leçons courtes, chacune avec une partie
              théorique et un exercice pratique.
            </Typography>
            <List dense>
              {[
                "Introduction à Excel & interface",
                "Classeur, feuilles, lignes, colonnes et cellules",
                "Saisie et types de données (texte, nombre, date)",
                "Mise en forme de base (police, bordures, formats de nombre)",
                "Formules et fonction SOMME",
                "Copier les formules & références de cellules",
                "Tableaux simples, tri & filtres",
                "Graphiques de base",
                "Exporter en PDF & mini-projet",
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

      {/* 0. INTRO + INTERFACE */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            0. Introduction à Excel & interface
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Dans cette leçon, l&apos;apprenant découvre à quoi sert Excel et
                l&apos;organisation générale de l&apos;interface : ruban, onglets, zone
                de cellules, barre de formule.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Excel est un tableur : il sert à manipuler des données sous forme de tableau et à faire des calculs." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Comprendre la grille de cellules : colonnes (A, B, C...) et lignes (1, 2, 3...). " />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Identifier le ruban, les onglets (Accueil, Insertion, Mise en page...) et la barre de formule." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Ouvrir Excel et créer un classeur vierge." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Cliquer sur quelques cellules et observer leur référence (ex: A1, B3, C5)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Repérer la barre de formule et les onglets principaux." />
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
                  src="/excel-interface.png"
                  alt="Interface Excel - grille et ruban"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 1. CLASSEUR / FEUILLES / CELLULES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            1. Classeur, feuilles, lignes, colonnes et cellules
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Cette leçon explique la structure d&apos;un fichier Excel : un
                classeur contient une ou plusieurs feuilles, composées de lignes
                et de colonnes.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Un fichier Excel = un classeur (.xlsx)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Un classeur contient des feuilles (Feuil1, Feuil2, etc.)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Une cellule est l'intersection d'une ligne et d'une colonne (ex: B3)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Renommer une feuille (double clic sur l'onglet de la feuille)." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Renommer la feuille active en « Données »." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Ajouter une nouvelle feuille et la nommer « Calculs »." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Sélectionner la cellule C3 et vérifier que la barre de nom indique bien C3." />
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
                  src="/excel-new-workbook.png"
                  alt="Nouveau classeur Excel avec feuilles"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 2. SAISIE / TYPES DE DONNEES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            2. Saisir des données : texte, nombres, dates
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Dans cette leçon, l&apos;apprenant apprend à saisir correctement différents
            types de données dans les cellules.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Saisir du texte simple (noms, intitulés)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Saisir des nombres (quantités, montants)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Saisir des dates (par ex: 01/01/2025) et voir l'affichage automatique." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Valider une cellule (Entrée) et se déplacer avec les flèches." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="En A1, saisir « Produit », en B1 « Quantité », en C1 « Prix »." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Remplir 3 lignes de produits factices (texte + nombres)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="En D1, saisir « Date » et saisir une date en D2." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 3. MISE EN FORME DE BASE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            3. Mise en forme de base : police, bordures, formats de nombre
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Cette leçon se concentre sur la présentation : rendre le tableau plus
            lisible grâce à la mise en forme.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Mettre en gras les en-têtes (ligne 1)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ajouter des bordures autour du tableau." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ajuster la largeur des colonnes (double clic sur la séparation)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Appliquer un format monétaire sur une colonne de prix." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Mettre la ligne des en-têtes en gras et centrer le texte." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Appliquer un format monétaire à la colonne des prix." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ajouter des bordures au tableau de données." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 4. FORMULES & SOMME + IMAGE FORMULE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            4. Formules de base & fonction SOMME
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                On aborde ici le cœur d&apos;Excel : les formules. Comment écrire une
                formule simple et utiliser la fonction SOMME.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Une formule commence toujours par un signe égal (=)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Formule simple : =2+3, ou =A2*B2." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Fonction SOMME : =SOMME(C2:C4) pour additionner plusieurs cellules." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Utiliser l'assistant Somme automatique (Σ) dans le ruban." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="En D2, saisir une formule =B2*C2 pour calculer le total d’un produit." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Recopier la formule vers le bas (D3, D4...)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="En D5, utiliser =SOMME(D2:D4) pour calculer le total général." />
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
                  src="/excel-basic-formula.png"
                  alt="Exemple de formules de base dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 5. COPIER FORMULES & REFERENCES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            5. Copier les formules & références de cellules
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Cette leçon montre comment Excel recopie les formules en adaptant les
            références de cellules (relatives).
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Recopie de formule avec la poignée de recopie (coin inférieur droit de la cellule)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Comprendre que A2 devient A3, A4... lors de la recopie." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Recopier une formule de D2 jusqu'à D4 et vérifier les références (B3*C3, B4*C4...)." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 6. TABLEAU / TRI / FILTRES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            6. Tableaux simples : tri & filtres
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Ici, l&apos;apprenant découvre comment traiter un petit tableau de
            données : tri et filtres automatiques.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Sélectionner le tableau de données (en-têtes compris)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Activer le filtre automatique (Onglet Données → Filtrer)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Trier par ordre croissant/décroissant une colonne numérique." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Activer le filtre sur ton tableau Produit / Quantité / Prix." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Trier les produits par prix, du moins cher au plus cher." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 7. GRAPHIQUES + IMAGE GRAPHIQUE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            7. Créer un graphique simple
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Cette leçon apprend à transformer un petit tableau de données en
                graphique visuel (histogramme ou camembert).
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Sélectionner les données (ex: A1:A4 et D1:D4 : Produits + Total)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Onglet Insertion → Graphiques (colonnes, secteurs, etc.)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Modifier le titre du graphique." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Créer un graphique en colonnes des totaux par produit." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Renommer le titre du graphique en « Ventes par produit »." />
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
                  src="/excel-chart-example.png"
                  alt="Graphique simple dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 8. EXPORT PDF & MINI PROJET */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            8. Exporter en PDF & mini-projet
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Dernière étape : sauvegarder correctement le classeur et l&apos;exporter
            en PDF. Puis réaliser un mini-projet qui récapitule toutes les
            notions vues.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Exporter en PDF :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Fichier → Enregistrer sous → choisir le type « PDF »." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Vérifier les paramètres de zone d'impression si nécessaire." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Mini-projet de fin de module :
          </Typography>
          <Typography variant="body2">
            Créer un tableau de ventes simples :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="En-têtes : Produit, Quantité, Prix unitaire, Total." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Remplir au moins 4 lignes de produits." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Créer une formule Total = Quantité × Prix unitaire et la recopier." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Calculer le total général avec =SOMME." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Mettre en forme le tableau (gras, bordures, format monétaire)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Créer un graphique en colonnes des totaux par produit." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Enregistrer le classeur et l’exporter en PDF." />
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
          Ce quiz permet de valider la compréhension des notions de base abordées
          dans le cours Excel débutant.
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
