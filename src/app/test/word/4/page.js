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
 * ✅ Word – Niveau 4 (Avancé)
 * Thème : Mise en page complexe, documents longs, sections avancées, formulaires, automatisation pro.
 */

const quizQuestions = [
  {
    id: 1,
    question: "Quel outil est le plus adapté pour créer un document à remplir (formulaire) dans Word ?",
    options: ["SmartArt", "Contrôles de contenu (Développeur)", "WordArt", "Lettrines"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Pourquoi utiliser des styles + jeux de styles dans un document long ?",
    options: [
      "Pour ralentir Word",
      "Pour uniformiser et modifier la mise en forme rapidement",
      "Pour empêcher l’impression",
      "Pour supprimer les titres",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Quel est l’intérêt de désactiver « Lier au précédent » dans une section ?",
    options: [
      "Changer la langue du document",
      "Avoir un en-tête/pied de page différent entre sections",
      "Augmenter la taille du fichier",
      "Activer le publipostage",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Comment faire pour que la numérotation des pages commence à 1 après une page de garde ?",
    options: [
      "Supprimer la page de garde",
      "Créer une section et redémarrer la numérotation dans la section suivante",
      "Mettre le numéro en gras",
      "Changer la police",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "Quel outil permet de créer des renvois automatiques vers un titre (ex: “voir section 2.3”) ?",
    options: ["Renvoi (cross-reference)", "Colonnes", "Surlignage", "Synonymes"],
    correctIndex: 0,
  },
  {
    id: 6,
    question: "Quelle fonctionnalité permet de garder une image 'ancrée' à un paragraphe ?",
    options: ["Ancrage / habillage + position", "Copier-coller", "Thèmes", "Correction automatique"],
    correctIndex: 0,
  },
  {
    id: 7,
    question: "Quel est le meilleur choix pour créer un document avec chapitres, annexes, et références internes ?",
    options: ["Tout écrire sans titres", "Styles + sections + renvois + table des matières", "Uniquement des tableaux", "Uniquement des images"],
    correctIndex: 1,
  },
  {
    id: 8,
    question: "Quel outil permet de créer automatiquement une liste des tableaux/figures avec pages ?",
    options: ["Table des matières", "Table des illustrations (légendes)", "Colonnes", "Suivi des modifications"],
    correctIndex: 1,
  },
  {
    id: 9,
    question: "Pour protéger un formulaire afin que l’utilisateur ne modifie que les champs, on utilise :",
    options: ["Restreindre la modification", "Mise en page", "Insertion", "Affichage"],
    correctIndex: 0,
  },
];

export default function WordLevel4CoursePage() {
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
            <Typography variant="overline" sx={{ letterSpacing: 0.12, color: "text.secondary" }}>
              Cours Word – Niveau 4 (Avancé)
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5 }}>
              Word Avancé : Documents longs, formulaires & renvois automatiques
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Ce niveau est orienté production “expert” : mise en page complexe, gestion avancée des sections,
              renvois internes (cross-references), formulaires à remplir, et documents multi-parties
              (chapitres, annexes, pages différentes).
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Avancé" color="primary" size="small" />
              <Chip label="Documents longs" size="small" variant="outlined" />
              <Chip label="Word" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Durée estimée : 10 à 12 heures • Langue : Français
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
                "Gérer un document long (chapitres + annexes) avec sections avancées et mises en page différentes.",
                "Créer et utiliser des renvois automatiques (cross-references) vers titres, pages, figures et tableaux.",
                "Construire un formulaire Word à remplir (contrôles de contenu) puis le protéger.",
                "Maîtriser les en-têtes/pieds différents (première page, pages paires/impaires, sections).",
                "Stabiliser la mise en page : ancrage des images, habillage, positions fixes, alignements pro.",
                "Créer des tables automatiques : table des matières, table des illustrations, liste des tableaux.",
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
              Mise en page avancée + automatisation : renvois, formulaires, annexes, tables automatiques.
            </Typography>
            <List dense>
              {[
                "Architecture d’un document long (chapitres / annexes)",
                "Sections avancées : pages différentes & numérotation",
                "En-têtes/pieds avancés : pages paires/impaires",
                "Renvois automatiques (cross-references)",
                "Légendes + tables automatiques (figures/tableaux)",
                "Images : ancrage, habillage, positionnement stable",
                "Formulaires Word : contrôles de contenu",
                "Protection & restrictions de modification",
                "Projet final : dossier multi-parties prêt à diffuser",
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

      {/* 0. DOC LONG */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">0. Architecture d’un document long (chapitres / annexes)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Un document long (rapport, mémoire, dossier administratif) doit être structuré pour rester stable :
                styles, sections, sommaire, légendes et renvois. Ici, on pose la méthode.
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Plan logique : page de garde → sommaire → chapitres → annexes." /></ListItem>
                <ListItem><ListItemText primary="Styles pour titres + sous-titres (structure durable)." /></ListItem>
                <ListItem><ListItemText primary="Sauts de section pour séparer les parties (mise en page différente)." /></ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Créer un document avec : page de garde, sommaire, 3 chapitres, 1 annexe." /></ListItem>
                <ListItem><ListItemText primary="Mettre en place les styles Titre 1/2/3 et insérer une table des matières." /></ListItem>
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
                  src="/word-level4-longdoc.png"
                  alt="Document long Word : chapitres et annexes"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 1. SECTIONS & NUMEROTATION */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">1. Sections avancées : pages différentes & numérotation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Les sections permettent d’avoir des numérotations différentes et des en-têtes/pieds différents
            selon les parties (ex: page de garde sans numéro, chapitre en chiffres arabes, annexes en romains).
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Saut de section : page suivante vs continu." /></ListItem>
            <ListItem><ListItemText primary="Désactiver “Lier au précédent” pour indépendance des sections." /></ListItem>
            <ListItem><ListItemText primary="Redémarrer la numérotation à 1 après la page de garde." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Page de garde sans numéro + contenu qui commence à 1." /></ListItem>
            <ListItem><ListItemText primary="Annexes avec numérotation différente (optionnel)." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 2. EN-TETES PAIRES/IMPAIRES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">2. En-têtes/pieds avancés : pages paires/impaires</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Pour les documents imprimés (livret, rapport), Word peut afficher un en-tête différent
            sur pages paires/impaires + première page différente.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Options : première page différente + pages paires/impaires différentes." /></ListItem>
            <ListItem><ListItemText primary="Combiner avec sections pour chapitres indépendants." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Page impaire : titre du chapitre ; page paire : nom du document." /></ListItem>
            <ListItem><ListItemText primary="Ajouter Page X/Y dans le pied de page." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 3. RENVOIS AUTOMATIQUES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">3. Renvois automatiques (cross-references)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Les renvois permettent de créer des liens automatiques vers un titre, une page, une figure ou un tableau.
            Quand tu modifies le document, les renvois se mettent à jour (au lieu de tout corriger à la main).
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Insertion → Renvoi : titre / numéro de page / numéro de paragraphe." /></ListItem>
            <ListItem><ListItemText primary="Renvois vers légendes : figures/tableaux." /></ListItem>
            <ListItem><ListItemText primary="Mettre à jour : tout le document (champs) avant export PDF." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer 3 renvois : vers un titre, une figure, et une page." /></ListItem>
            <ListItem><ListItemText primary="Ajouter une section au début et vérifier que les renvois restent corrects après mise à jour." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 4. TABLES AUTOMATIQUES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">4. Légendes + tables automatiques (figures/tableaux)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            À partir des légendes, Word peut générer automatiquement :
            table des illustrations, liste des tableaux, et les maintenir à jour.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Références → Insérer une légende (Figure/Tableau)." /></ListItem>
            <ListItem><ListItemText primary="Références → Table des illustrations (mise à jour)." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer 2 tableaux et 2 figures avec légendes." /></ListItem>
            <ListItem><ListItemText primary="Générer une table des illustrations + une liste des tableaux." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 5. IMAGES AVANCEES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">5. Images : ancrage, habillage, positionnement stable</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Dans les documents longs, les images “bougent” si elles ne sont pas bien ancrées.
            Ici, tu apprends à les stabiliser (ancrage, habillage, position fixe).
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Habillage : aligné, carré, rapproché, derrière/devant le texte." /></ListItem>
            <ListItem><ListItemText primary="Ancrer au paragraphe + verrouiller l’ancre." /></ListItem>
            <ListItem><ListItemText primary="Position fixe sur la page vs déplacer avec le texte." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Insérer 2 images, appliquer habillage “Carré” et verrouiller l’ancre." /></ListItem>
            <ListItem><ListItemText primary="Ajouter du texte avant et vérifier que l’image reste maîtrisée." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 6. FORMULAIRES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">6. Formulaires Word : contrôles de contenu</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Créer un formulaire à remplir (nom, date, choix, cases à cocher) grâce à l’onglet Développeur.
                Très utile pour l’administration, RH, inscriptions, demandes, etc.
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Activer l’onglet Développeur (Options Word)." /></ListItem>
                <ListItem><ListItemText primary="Contrôles : texte, date, liste déroulante, cases à cocher." /></ListItem>
                <ListItem><ListItemText primary="Mettre des consignes : placeholders + sections du formulaire." /></ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Créer un formulaire d’inscription (Nom, Email, Date, Choix, Checkbox)." /></ListItem>
                <ListItem><ListItemText primary="Ajouter une zone signature (ou champ texte) et une section “Pièces jointes”." /></ListItem>
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
                  src="/word-level4-form.png"
                  alt="Formulaire Word avec contrôles de contenu"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 7. PROTECTION */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">7. Protection & restrictions de modification</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Pour un formulaire ou un document officiel, tu peux empêcher la modification des textes
            et autoriser uniquement la saisie dans les champs.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Révision → Restreindre la modification (remplissage formulaire)." /></ListItem>
            <ListItem><ListItemText primary="Désactiver la modification des styles si besoin." /></ListItem>
            <ListItem><ListItemText primary="Bonnes pratiques : version PDF finale pour diffusion." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Protéger le formulaire : l’utilisateur ne peut remplir que les champs." /></ListItem>
            <ListItem><ListItemText primary="Tester sur une copie : remplissage + sauvegarde." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 8. PROJET FINAL */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">8. Projet final : dossier multi-parties prêt à diffuser</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Projet final : créer un document complet qui ressemble à un dossier professionnel (3–8 pages),
            avec annexes, renvois, tables automatiques et un formulaire.
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Livrables :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Page de garde sans numéro + sommaire automatique." /></ListItem>
            <ListItem><ListItemText primary="3 chapitres (Titres numérotés) + 1 annexe." /></ListItem>
            <ListItem><ListItemText primary="2 figures + 2 tableaux avec légendes + tables automatiques." /></ListItem>
            <ListItem><ListItemText primary="3 renvois internes (titre/page/figure) corrects après mise à jour." /></ListItem>
            <ListItem><ListItemText primary="1 formulaire protégé (champs + checkbox + liste déroulante)." /></ListItem>
            <ListItem><ListItemText primary="Export PDF final (après mise à jour des champs)." /></ListItem>
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
          Ce quiz valide les notions avancées : sections, renvois, formulaires, protection et tables automatiques.
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
