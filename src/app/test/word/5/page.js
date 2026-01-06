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
 * ✅ Word – Niveau 5 (Expert)
 * Thème : Standardisation à grande échelle, formulaires avancés, champs, automatisation,
 * modèles robustes, workflows pro (signature, export, collaboration), bonnes pratiques “enterprise”.
 */

const quizQuestions = [
  {
    id: 1,
    question: "Quelle est la meilleure approche pour standardiser tous les documents d’une organisation ?",
    options: [
      "Modifier chaque document à la main",
      "Créer un modèle (.dotx/.dotm) + styles + thèmes + règles d’usage",
      "Tout mettre en gras",
      "Créer des fichiers PDF uniquement",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Pourquoi utiliser un modèle macro-enabled (.dotm) ?",
    options: [
      "Pour empêcher l’enregistrement",
      "Pour ajouter des automatisations (macros) au modèle",
      "Pour réduire la qualité des images",
      "Pour supprimer la mise en page",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Quel outil Word permet d’insérer des champs dynamiques avancés (IF, ASK, REF...) ?",
    options: ["Champs (Fields)", "SmartArt", "WordArt", "Lettrines"],
    correctIndex: 0,
  },
  {
    id: 4,
    question: "Quelle est la bonne pratique avant export PDF d’un document long ?",
    options: [
      "Ne rien faire",
      "Mettre à jour tous les champs (table des matières, renvois, légendes)",
      "Supprimer les images",
      "Désactiver les styles",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "À quoi sert le mode « Restreindre la modification » dans un contexte entreprise ?",
    options: [
      "Empêcher le document de s’ouvrir",
      "Limiter ce que les utilisateurs peuvent modifier (ex: uniquement remplir un formulaire)",
      "Changer la langue",
      "Ajouter une table des matières",
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    question: "Quel élément est le plus important pour un formulaire Word robuste ?",
    options: [
      "Des couleurs vives",
      "Des contrôles de contenu + une protection adaptée + des instructions claires",
      "Beaucoup d’images",
      "Une police différente par paragraphe",
    ],
    correctIndex: 1,
  },
  {
    id: 7,
    question: "Quelle stratégie réduit le risque de “documents cassés” lors de modifications ?",
    options: [
      "Utiliser tabulations et espaces",
      "Utiliser styles + tables + sections bien définies",
      "Écrire tout en une seule page",
      "Mettre tout en majuscules",
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    question: "Quelle fonctionnalité aide à vérifier la qualité et l’accessibilité d’un document (titres, alt text, etc.) ?",
    options: ["Vérificateur d’accessibilité", "Thèmes", "WordArt", "Lettrines"],
    correctIndex: 0,
  },
  {
    id: 9,
    question: "Pour créer un workflow fiable de signature et diffusion, le meilleur combo est :",
    options: [
      "Envoyer le .docx par WhatsApp",
      "Contrôler la version + protéger + exporter PDF + processus de signature",
      "Supprimer tous les styles",
      "Utiliser uniquement des images",
    ],
    correctIndex: 1,
  },
];

export default function WordLevel5CoursePage() {
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
              Cours Word – Niveau 5 (Expert)
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5 }}>
              Word Expert : Standardisation, automatisation & workflows professionnels
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Ce niveau te met au niveau “pro” pour gérer Word à grande échelle : modèles robustes,
              styles et thèmes standardisés, champs avancés, formulaires fiables, bonnes pratiques
              d’accessibilité et workflows (versions, protection, export, signature, diffusion).
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Expert" color="primary" size="small" />
              <Chip label="Enterprise" size="small" variant="outlined" />
              <Chip label="Word" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Durée estimée : 12 à 16 heures • Langue : Français
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
                "Standardiser une charte documentaire : modèles, thèmes, styles, règles d’usage.",
                "Créer des modèles avancés (.dotx) et comprendre les modèles macro (.dotm) pour automatiser.",
                "Construire des formulaires robustes : contrôles de contenu, logiques simples, protection.",
                "Utiliser des champs avancés (IF, REF, ASK, propriétés) et mettre à jour les champs avant export.",
                "Mettre en place un workflow pro : versions, validation, export PDF, diffusion et signature.",
                "Améliorer la qualité : accessibilité, cohérence, réduction des erreurs, documents maintenables.",
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
              Devenir “Word expert” = construire des documents réutilisables, fiables et diffusables.
            </Typography>
            <List dense>
              {[
                "Charte documentaire : styles, thèmes et règles",
                "Modèles avancés (.dotx) & variantes (.dotm)",
                "Champs avancés : IF, REF, ASK, propriétés",
                "Formulaires robustes : contrôles + logique + protection",
                "Qualité & accessibilité (checker, alt text, titres)",
                "Gestion des versions & collaboration (process)",
                "Sécurisation : protection, restrictions, bonnes pratiques",
                "Workflow export : mise à jour champs → PDF → signature → diffusion",
                "Projet final : kit complet d’organisation",
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

      {/* 0. CHARTE */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">0. Charte documentaire : styles, thèmes et règles</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Une organisation gagne énormément de temps quand ses documents suivent une même charte :
                mêmes titres, même mise en page, mêmes couleurs/polices, mêmes éléments (logo, pied de page).
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Définir des styles : Titre 1/2/3, Normal, Citation, Liste." /></ListItem>
                <ListItem><ListItemText primary="Thème : polices + couleurs pour uniformiser tout." /></ListItem>
                <ListItem><ListItemText primary="Règles d’usage : pas d’espaces/tabulations, préférer tables/styles." /></ListItem>
              </List>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Créer une charte simple : 3 styles de titres + 1 style normal + 1 style “Info”." /></ListItem>
                <ListItem><ListItemText primary="Appliquer le thème et vérifier la cohérence sur 4 pages." /></ListItem>
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
                  src="/word-level5-styleguide.png"
                  alt="Charte documentaire Word"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 1. MODELES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">1. Modèles avancés (.dotx) & variantes (.dotm)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Les modèles permettent de générer des documents cohérents à la demande. Les variantes “macro” (.dotm)
            peuvent automatiser certaines actions (si autorisé et sécurisé).
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer un modèle : page de garde, en-tête, styles, champs, blocs." /></ListItem>
            <ListItem><ListItemText primary="Variables : logo, contact, pied de page, mentions légales." /></ListItem>
            <ListItem><ListItemText primary="Comprendre .dotm (macros) : usages + sécurité." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer 2 modèles : lettre officielle + rapport interne." /></ListItem>
            <ListItem><ListItemText primary="Créer un nouveau document basé sur chaque modèle et tester." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 2. CHAMPS AVANCES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">2. Champs avancés : IF, REF, ASK, propriétés</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Les champs avancés permettent d’automatiser des éléments du document : afficher/masquer des blocs,
                réutiliser des valeurs, mettre des renvois intelligents, et créer des documents plus “dynamiques”.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Champs : propriétés document (titre/auteur), date, pages, REF." /></ListItem>
                <ListItem><ListItemText primary="Logique simple : champ IF (afficher un texte selon une condition)." /></ListItem>
                <ListItem><ListItemText primary="Mettre à jour les champs avant export PDF." /></ListItem>
              </List>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Créer un bloc “Confidentiel” qui s’affiche uniquement si une propriété est activée." /></ListItem>
                <ListItem><ListItemText primary="Ajouter des renvois REF et vérifier la mise à jour après modifications." /></ListItem>
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
                  src="/word-level5-fields-advanced.png"
                  alt="Champs avancés Word"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 3. FORMULAIRES ROBUSTES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">3. Formulaires robustes : contrôles + logique + protection</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Tu apprends à créer un formulaire fiable (remplissable) avec instructions, champs propres, listes,
            cases à cocher, sections, puis à verrouiller le document pour éviter les modifications accidentelles.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Contrôles de contenu : texte, date, liste déroulante, checkbox." /></ListItem>
            <ListItem><ListItemText primary="Règles de conception : clarté, groupement, champs obligatoires (méthode)." /></ListItem>
            <ListItem><ListItemText primary="Protection : Restreindre la modification (remplissage uniquement)." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer un formulaire “Demande de service” (infos + choix + validation visuelle)." /></ListItem>
            <ListItem><ListItemText primary="Protéger le document et tester sur une copie." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 4. QUALITE & ACCESSIBILITE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">4. Qualité & accessibilité (checker, alt text, titres)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Un document pro doit être lisible et accessible : bonne structure de titres, textes alternatifs pour images,
            contrastes corrects, et vérification automatique via les outils Word.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Vérificateur d’accessibilité : repérer les problèmes." /></ListItem>
            <ListItem><ListItemText primary="Alt text sur images et tableaux." /></ListItem>
            <ListItem><ListItemText primary="Structure logique des titres (pas de Titre 3 sans Titre 2)." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Corriger 5 points signalés par le vérificateur d’accessibilité." /></ListItem>
            <ListItem><ListItemText primary="Ajouter un alt text à 3 images." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 5. VERSIONS & COLLAB */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">5. Gestion des versions & collaboration (process)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Dans un contexte pro, la qualité vient aussi du processus : nommage, versions, validations,
            commentaires, suivi, et contrôle de ce qui est “final”.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Convention de nommage : Document_v1, v2, FINAL, SIGNÉ…" /></ListItem>
            <ListItem><ListItemText primary="Commentaires + suivi des modifications : règles d’équipe." /></ListItem>
            <ListItem><ListItemText primary="Validation : qui approuve, quand, comment." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Simuler une revue : ajouter 5 commentaires + 5 modifications suivies, puis accepter/refuser." /></ListItem>
            <ListItem><ListItemText primary="Produire une version finale propre (sans marques)." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 6. SECURISATION */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">6. Sécurisation : protection, restrictions, bonnes pratiques</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Apprendre à sécuriser un document : empêcher les modifications, limiter les styles,
            et choisir le bon format (docx vs pdf) selon l’usage.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Restreindre la modification : lecture seule / formulaire." /></ListItem>
            <ListItem><ListItemText primary="Bonnes pratiques : protéger l’original, diffuser une copie/PDF." /></ListItem>
            <ListItem><ListItemText primary="Éviter les secrets dans le document (metadata si besoin)." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer une version “interne” modifiable et une version “diffusion” PDF." /></ListItem>
            <ListItem><ListItemText primary="Vérifier les propriétés document (titre/auteur) avant envoi." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 7. WORKFLOW EXPORT & SIGNATURE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">7. Workflow export : mise à jour champs → PDF → signature → diffusion</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Un workflow pro évite les erreurs : table des matières fausse, renvois incorrects, pages non à jour.
                Ici, tu construis une checklist finale.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Mettre à jour tous les champs avant export (sommaire, renvois, figures)." /></ListItem>
                <ListItem><ListItemText primary="Exporter en PDF : noms de fichiers, qualité, compatibilité." /></ListItem>
                <ListItem><ListItemText primary="Préparer la signature : version figée + diffusion contrôlée." /></ListItem>
              </List>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Créer une checklist “Avant PDF” et l’appliquer sur ton document." /></ListItem>
                <ListItem><ListItemText primary="Exporter PDF final et archiver la version source." /></ListItem>
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
                  src="/word-level5-workflow.png"
                  alt="Workflow Word : export PDF et diffusion"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 8. PROJET FINAL */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">8. Projet final : kit complet d’organisation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Tu construis un kit complet prêt à être utilisé par une organisation (école, ONG, entreprise) :
            modèles, charte, formulaire et workflow d’export.
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Livrables :</Typography>
          <List dense>
            <ListItem><ListItemText primary="1 charte : styles + thème + règles (1 page de consignes)." /></ListItem>
            <ListItem><ListItemText primary="2 modèles (.dotx) : lettre officielle + rapport." /></ListItem>
            <ListItem><ListItemText primary="1 formulaire protégé (demande / inscription) avec contrôles." /></ListItem>
            <ListItem><ListItemText primary="1 document “process” : nommage, versions, validation, checklist export PDF." /></ListItem>
            <ListItem><ListItemText primary="Export PDF final + archive du source." /></ListItem>
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
          Ce quiz valide la logique “expert” : standardisation, champs, formulaires, qualité et workflow pro.
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
