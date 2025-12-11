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
    question: "La fonction RECHERCHEV permet :",
    options: [
      "De calculer une moyenne",
      "De rechercher une valeur dans la première colonne d’un tableau",
      "De trier un tableau",
      "De créer un graphique",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Quelle syntaxe est la plus proche d’une RECHERCHEV classique ?",
    options: [
      "=RECHERCHEV(valeur;table;no_index_col;[valeur_proche])",
      "=RECHERCHEV(table;valeur;no_index_col;[valeur_proche])",
      "=RECHERCHEV(no_index_col;valeur;table)",
      "=RECHERCHEV(valeur;no_index_col;table)",
    ],
    correctIndex: 0,
  },
  {
    id: 3,
    question: "La fonction GAUCHE(texte;2) renvoie :",
    options: [
      "Les 2 dernières lettres du texte",
      "Les 2 premières lettres du texte",
      "2 mots du texte",
      "La longueur du texte",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Quelle fonction renvoie la date d’aujourd’hui ?",
    options: ["DATE()", "MAINTENANT()", "AUJOURDHUI()", "JOUR()"],
    correctIndex: 2,
  },
  {
    id: 5,
    question: "Quel est l’intérêt de nommer une plage (Nom de cellule) ?",
    options: [
      "Changer la couleur des cellules",
      "Rendre les formules plus lisibles et réutilisables",
      "Protéger le classeur",
      "Créer un graphique automatiquement",
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    question: "Un tableau de bord simple dans Excel contient souvent :",
    options: [
      "Uniquement des textes",
      "Des macros uniquement",
      "Des indicateurs, des graphiques et des chiffres clés",
      "Uniquement des tableaux croisés dynamiques",
    ],
    correctIndex: 2,
  },
  {
    id: 7,
    question:
      "Quelle fonction permet de calculer le nombre de jours entre deux dates ?",
    options: ["JOUR()", "DATEDIF()", "NB.JOURS()", "MOIS()"],
    correctIndex: 1,
  },
  {
    id: 8,
    question:
      "La fonction CONCAT ou CONCATENER sert à :",
    options: [
      "Additionner des chiffres",
      "Fusionner plusieurs textes ou cellules en un seul texte",
      "Supprimer des espaces",
      "Compter des cellules",
    ],
    correctIndex: 1,
  },
];

export default function ExcelLevel3CoursePage() {
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
              Cours Excel – Niveau 3 (Avancé intermédiaire)
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5 }}>
              Excel Niveau 3 : Recherche & Fonctions avancées
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Apprends à utiliser les fonctions de recherche, les fonctions texte
              et date, les plages nommées et à créer une première synthèse de type
              tableau de bord.
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Niveau 3" color="primary" size="small" />
              <Chip label="Excel" size="small" variant="outlined" />
              <Chip label="Analyse" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Niveau recommandé : Excel Intermédiaire (Niveau 2)
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
                <ListItemText primary="Utiliser des fonctions de recherche : RECHERCHEV, RECHERCHEX (si disponible)." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Composer des formules plus lisibles à l’aide de plages nommées." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Utiliser des fonctions texte de base : GAUCHE, DROITE, STXT, CONCAT/CONCATENER, TEXTE." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Utiliser des fonctions de date : AUJOURDHUI, MAINTENANT, DATEDIF, JOUR, MOIS, ANNEE." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Créer une petite synthèse graphique de type tableau de bord simple." />
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
              Ce niveau se concentre sur la manipulation intelligente des données
              et la création de petites synthèses.
            </Typography>
            <List dense>
              {[
                "Préparation des données & rappel Niveau 2",
                "Fonctions de recherche (RECHERCHEV, RECHERCHEX, index simple)",
                "Plages nommées & lisibilité des formules",
                "Fonctions texte (GAUCHE, DROITE, STXT, CONCAT/CONCATENER, TEXTE)",
                "Fonctions de date (AUJOURDHUI, MAINTENANT, DATEDIF, JOUR/MOIS/ANNEE)",
                "Nettoyage simple des données (espaces, format texte/numérique)",
                "Mini tableau de bord (indicateurs + graphiques)",
                "Mini-projet de synthèse",
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
            0. Préparation des données & rappel du Niveau 2
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            On part d’un tableau de données un peu plus riche : ventes par
            produit, dates, clients, montants, etc. L&apos;objectif est de
            s&apos;assurer que les bases du Niveau 2 sont solides.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Vérifier que les formules de base (SOMME, MOYENNE, SI, SOMME.SI) sont maîtrisées." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Créer une feuille Données bien structurée (en-têtes propres, pas de lignes vides)." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Importer ou saisir un tableau de 30 à 50 lignes (Produits, Clients, Dates, Montants)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Contrôler la cohérence des données (pas de textes mélangés aux chiffres dans la colonne Montants)." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 1. RECHERCHEV / RECHERCHEX + IMAGE LOOKUP */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            1. Fonctions de recherche : RECHERCHEV, RECHERCHEX (ou équivalent)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Les fonctions de recherche permettent de retrouver une
                information dans un tableau à partir d’une valeur (par exemple,
                retrouver le prix d’un produit à partir de son nom).
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés (RECHERCHEV) :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Syntaxe : =RECHERCHEV(valeur_cherchée;table_matrice;no_index_col;[valeur_proche])." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="La valeur cherchée doit se trouver dans la première colonne de la table." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="no_index_col = numéro de la colonne à renvoyer dans la table." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 1.5, mb: 0.5 }}>
                Points clés (RECHERCHEX / XLOOKUP si disponible) :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Plus flexible que RECHERCHEV (pas obligé que la donnée soit dans la première colonne)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Permet de définir facilement la valeur en cas de non-trouvée." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Créer une petite table de référence des Produits avec leur Prix unitaire sur une feuille « Référentiel »." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Dans la feuille Données, utiliser RECHERCHEV ou RECHERCHEX pour ramener le Prix unitaire à partir du nom du produit." />
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
                  src="/excel-level3-lookup.png"
                  alt="Fonctions de recherche Excel (RECHERCHEV / RECHERCHEX)"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 2. PLAGES NOMMÉES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            2. Plages nommées & lisibilité des formules
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Nommer des cellules ou des plages facilite la lecture des formules
            et évite les erreurs de référence.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Créer un nom via la zone de nom (à gauche de la barre de formule)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Créer un nom via Formules → Gestionnaire de noms." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Utiliser le nom dans une formule (ex: =Montant_HT * Taux_TVA)." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Nommer une cellule contenant un taux de TVA (ex: Taux_TVA)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Nommer une plage de données (ex: Ventes_2025)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Réécrire une formule en remplaçant les références de cellules par des noms." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 3. FONCTIONS TEXTE + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            3. Fonctions texte (GAUCHE, DROITE, STXT, CONCAT, TEXTE)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Les fonctions texte permettent de nettoyer ou recomposer des
                informations (codes, noms, numéros).
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Fonctions principales :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="GAUCHE(texte; n) : renvoie les n premiers caractères." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="DROITE(texte; n) : renvoie les n derniers caractères." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="STXT(texte; début; n) : renvoie n caractères à partir d’une position." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="CONCAT ou CONCATENER : fusionne plusieurs morceaux de texte." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="TEXTE(valeur; format) : affiche une valeur numérique avec un format texte (ex: « 01/2025 »)." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Sur une colonne de codes clients (ex: « CH-001 », « CH-002 »), extraire le pays (2 premières lettres) avec GAUCHE." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Assembler un texte du type « Client X – Ville Y » avec CONCAT." />
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
                  src="/excel-level3-text-functions.png"
                  alt="Fonctions texte dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 4. FONCTIONS DE DATE + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            4. Fonctions de date : AUJOURDHUI, MAINTENANT, DATEDIF, JOUR/MOIS/ANNEE
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Les fonctions de date sont très utiles pour suivre des délais,
                des durées, des échéances.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Fonctions principales :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="AUJOURDHUI() : renvoie la date du jour." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="MAINTENANT() : renvoie date + heure actuelles." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="DATEDIF(date_début; date_fin; unité) : différence entre deux dates (ex: en jours, mois, années)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="JOUR(date), MOIS(date), ANNEE(date) : extraire le jour, le mois ou l’année." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="À partir d’une date de début de contrat et d’une date de fin, calculer le nombre de jours de contrat avec DATEDIF." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Extraire le mois et l’année des dates de factures pour préparer un regroupement par mois." />
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
                  src="/excel-level3-date-functions.png"
                  alt="Fonctions de date dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 5. NETTOYAGE SIMPLE DES DONNÉES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            5. Nettoyage simple des données (espaces, texte/numérique)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Données “sales” = résultats faux. On voit comment corriger quelques
            problèmes fréquents.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Fonction SUPPRESPACE(texte) pour enlever les espaces superflus." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Fonction CNUM(texte) pour convertir un texte en nombre lorsqu’il est bien formé." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Vérifier s’il y a des espaces cachés dans les cellules qui semblent identiques." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Importer une petite liste avec des noms ou des codes contenant des espaces en trop, puis les nettoyer avec SUPPRESPACE." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 6. MINI TABLEAU DE BORD + IMAGE DASHBOARD */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            6. Créer un mini tableau de bord (KPI + graphiques)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                On assemble tout : indicateurs clés (KPI), graphiques, et
                présentation propre sur une feuille de synthèse.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Contenu d’un mini dashboard :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Total des ventes, moyenne, meilleure vente, etc." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Graphique par produit ou par mois." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Mise en forme claire : titres, couleurs, alignements." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Créer une feuille « Dashboard » avec 3 indicateurs : Total ventes, Moyenne par vente, Nombre de clients." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Ajouter au moins un graphique pertinent (par produit ou par mois)." />
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
                  src="/excel-level3-dashboard.png"
                  alt="Exemple de mini tableau de bord Excel"
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
            7. Mini-projet de synthèse
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Pour consolider toutes les notions du niveau 3, l&apos;apprenant réalise
            une petite analyse à partir d’un jeu de données plus riche.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Objectif :
          </Typography>
          <Typography variant="body2">
            À partir d’une base de données de ventes (Produits, Clients, Dates,
            Montants, Pays, etc.), produire :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Une feuille Données propre (après nettoyage éventuel)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Une feuille Référentiel avec une liste de produits ou clients et des infos associées (prix, catégorie…)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Des RECHERCHEV/RECHERCHEX pour compléter automatiquement des informations dans la feuille Données." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Quelques colonnes calculées avec des fonctions texte ou date (pays, mois, année…)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Une feuille Dashboard avec 3 à 5 indicateurs et 1 à 2 graphiques." />
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
          Ce quiz valide la maîtrise des recherches, fonctions texte/date, et
          des bases d’un tableau de bord Excel.
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
