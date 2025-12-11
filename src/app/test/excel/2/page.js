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
    question: "À quoi sert le symbole $ dans une référence comme $A$1 ?",
    options: [
      "À colorer la cellule",
      "À fixer la colonne et la ligne lors de la recopie",
      "À effacer la formule",
      "À transformer la cellule en texte",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "La formule =MOYENNE(B2:B10) calcule :",
    options: [
      "La somme de B2 à B10",
      "Le nombre de cellules non vides",
      "La moyenne des valeurs de B2 à B10",
      "La valeur la plus élevée",
    ],
    correctIndex: 2,
  },
  {
    id: 3,
    question: "Quelle fonction renvoie VRAI/FAUX selon une condition ?",
    options: ["SOMME", "SI", "NB.SI", "MAX"],
    correctIndex: 1,
  },
  {
    id: 4,
    question:
      "La mise en forme conditionnelle permet principalement de :",
    options: [
      "Modifier la mise en page du classeur",
      "Appliquer un style automatiquement selon des règles",
      "Renommer des feuilles",
      "Créer des macros",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question:
      "Quel est l’intérêt d’un tableau croisé dynamique simple ?",
    options: [
      "Dessiner des formes",
      "Faire des mises en forme avancées",
      "Résumer, regrouper et analyser des données rapidement",
      "Changer la langue d’Excel",
    ],
    correctIndex: 2,
  },
  {
    id: 6,
    question: "NBVAL(A1:A10) compte :",
    options: [
      "Toutes les cellules, vides ou non",
      "Uniquement les cellules numériques",
      "Uniquement les cellules texte",
      "Les cellules non vides (texte ou nombre)",
    ],
    correctIndex: 3,
  },
  {
    id: 7,
    question:
      "Pour surligner automatiquement les valeurs supérieures à 1000, on utilisera :",
    options: [
      "Une bordure",
      "Une formule SOMME",
      "Une mise en forme conditionnelle",
      "Un graphique",
    ],
    correctIndex: 2,
  },
  {
    id: 8,
    question:
      "Après avoir appliqué un filtre sur un tableau, que se passe-t-il ?",
    options: [
      "Les données sont supprimées",
      "Les lignes qui ne répondent pas au critère sont masquées",
      "Le fichier est verrouillé",
      "Les formules sont effacées",
    ],
    correctIndex: 1,
  },
];

export default function ExcelIntermediateCoursePage() {
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
              Cours Excel – Niveau 2 (Intermédiaire)
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5 }}>
              Excel Intermédiaire : Formules & Analyse de données
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Approfondis les bases d&apos;Excel avec des formules plus avancées,
              des références absolues, de la mise en forme conditionnelle et
              une première approche des tableaux croisés dynamiques.
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Intermédiaire" color="primary" size="small" />
              <Chip label="Bureautique" size="small" variant="outlined" />
              <Chip label="Excel" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Niveau recommandé : Excel débutant validé
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
                <ListItemText primary="Utiliser des fonctions statistiques simples : MOYENNE, MIN, MAX, NB, NBVAL." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Construire des formules conditionnelles simples avec la fonction SI." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Comprendre et utiliser les références absolues avec le symbole $." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Appliquer une mise en forme conditionnelle pour mettre en évidence des valeurs." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Appliquer un tri et des filtres sur un tableau de données plus conséquent." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Créer un premier tableau croisé dynamique pour résumer des données." />
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
              Le cours est organisé en leçons centrées sur les formules, la
              mise en forme avancée et l&apos;analyse simple.
            </Typography>
            <List dense>
              {[
                "Rappel des bases & préparation du fichier",
                "Fonctions statistiques simples (MOYENNE, MIN, MAX, NB, NBVAL)",
                "Formules conditionnelles avec SI",
                "Références relatives & absolues",
                "Mise en forme conditionnelle",
                "Tri, filtres & sous-totaux simples",
                "Introduction aux tableaux croisés dynamiques",
                "Mini-projet & bonnes pratiques",
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

      {/* 0. RAPPEL & PREPA */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            0. Rappel des bases & préparation du fichier
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Cette leçon sert à vérifier que les bases du niveau débutant sont
            acquises et à préparer un fichier de travail qui servira tout au long
            du cours.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Création d’un classeur dédié au cours « Excel Intermédiaire »." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Organisation des feuilles : Données, Calculs, Résumés." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Rappel rapide : SOMME, sélection de cellules, recopie de formule." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Créer un classeur nommé « Excel_Intermediaire.xlsx »." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Renommer Feuil1 en « Données » et créer deux autres feuilles : « Calculs » et « Résumé »." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 1. FONCTIONS STATISTIQUES + IMAGE FORMULES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            1. Fonctions statistiques simples : MOYENNE, MIN, MAX, NB, NBVAL
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                On va au-delà de SOMME pour obtenir des informations clés :
                moyenne, valeur minimale, valeur maximale, nombre de valeurs.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="=MOYENNE(plage) pour calculer la moyenne d’une série de nombres." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="=MIN(plage) et =MAX(plage) pour trouver la plus petite et la plus grande valeur." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="=NB(plage) pour compter les cellules numériques." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="=NBVAL(plage) pour compter les cellules non vides." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Sur la feuille Données, saisir une liste de 10 ventes (montants)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Sur la feuille Calculs, utiliser MOYENNE, MIN, MAX, NB, NBVAL pour analyser ces ventes." />
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
                  src="/excel-level2-formulas.png"
                  alt="Formules Excel intermédiaires"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 2. FORMULES CONDITIONNELLES SI */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            2. Formules conditionnelles avec SI
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            La fonction SI permet d&apos;afficher un résultat différent selon qu&apos;une
            condition est vraie ou fausse (par exemple, appliquer un bonus si une
            vente dépasse un certain montant).
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Structure : =SI(condition; valeur_si_vrai; valeur_si_faux)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Exemple : " />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Dans la feuille Données, ajouter une colonne « Statut »." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Utiliser une formule SI pour afficher « BONUS » si la vente est supérieure à un montant (ex: 1000), sinon « - »." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 3. REFERENCES RELATIVES & ABSOLUES + IMAGE ABSOLUTE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            3. Références relatives & absolues ($A$1)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Comprendre la différence entre les références relatives (A1) et
                absolues ($A$1) est essentiel pour recopier des formules qui
                utilisent des constantes (taux TVA, taux de commission, etc.).
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Référence relative : change lors de la recopie (A1 devient A2, A3...). " />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Référence absolue : reste fixe grâce au symbole $ (ex: $D$1)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Utiliser F4 (sur Windows) pour basculer entre relative / absolue." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Placer un taux TVA en D1 (ex: 0,2)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="En E2, calculer le prix TTC avec =C2*(1+$D$1) puis recopier vers le bas." />
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
                  src="/excel-level2-absolute-ref.png"
                  alt="Références absolues dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 4. MISE EN FORME CONDITIONNELLE + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            4. Mise en forme conditionnelle
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                La mise en forme conditionnelle permet de mettre visuellement en
                évidence les cellules qui respectent une condition (valeurs
                élevées, seuils, doublons, etc.).
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Onglet Accueil → Mise en forme conditionnelle." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Règles simples : « Supérieur à », « Inférieur à », « Égal à »." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Exemples : surligner les ventes supérieures à 1000 en vert." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Appliquer une mise en forme conditionnelle sur la colonne des ventes pour surligner celles qui dépassent un seuil." />
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
                  src="/excel-level2-conditional-formatting.png"
                  alt="Mise en forme conditionnelle dans Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 5. TRI / FILTRES / SOUS-TOTAUX */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            5. Tri, filtres & sous-totaux simples
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Dans cette leçon, l&apos;apprenant va plus loin dans l&apos;analyse de
            données avec des tris combinés et des filtres multi-critères.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Tri sur une ou plusieurs colonnes (ex: trier par vendeur puis par montant)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Filtres pour afficher uniquement les ventes d’un vendeur spécifique." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Comprendre que les lignes non filtrées sont simplement masquées, pas supprimées." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Trier la liste de ventes par vendeur (A–Z), puis par montant décroissant." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Filtrer pour n’afficher que les ventes d’un vendeur donné." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 6. TABLEAU CROISÉ DYNAMIQUE + IMAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            6. Introduction aux tableaux croisés dynamiques
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Le tableau croisé dynamique (TCD) permet de résumer rapidement un
                grand tableau de données : total par vendeur, par produit, par
                mois, etc.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Sélectionner le tableau de données." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Insertion → Tableau croisé dynamique." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Placer par exemple Vendeur en Lignes et Somme des ventes en Valeurs." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Créer un TCD qui affiche le total des ventes par vendeur." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Ajouter éventuellement un filtre par mois si les dates sont disponibles." />
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
                  src="/excel-level2-pivot-table.png"
                  alt="Tableau croisé dynamique Excel"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 7. MINI-PROJET */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            7. Mini-projet : analyse des ventes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Pour clôturer le module, l&apos;apprenant réalise une mini-analyse des
            ventes en réutilisant toutes les notions vues.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Objectif :
          </Typography>
          <Typography variant="body2">
            À partir d&apos;un tableau de ventes (Produit, Vendeur, Date, Quantité,
            Prix unitaire), produire :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Une feuille Données propre (tableau complet)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Une feuille Calculs avec : total général, moyenne, min, max, NB, NBVAL." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Une colonne Statut avec un SI simple (par ex: « Grosse vente » si montant > seuil)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Une mise en forme conditionnelle pour surligner les grosses ventes." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Un TCD résumant les ventes par vendeur ou par produit." />
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
          Ce quiz permet de valider les compétences clés acquises dans le module
          Excel Intermédiaire.
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
