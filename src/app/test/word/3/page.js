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
 * ✅ Word – Niveau 3 (Compétent)
 * Thème : Documents professionnels, modèles, publipostage, styles avancés, références.
 */

const quizQuestions = [
  {
    id: 1,
    question: "Quel outil permet de créer plusieurs lettres personnalisées à partir d’une liste de contacts ?",
    options: ["Table des matières", "Publipostage", "Suivi des modifications", "Colonnes"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Pourquoi utiliser un modèle (template) Word ?",
    options: [
      "Pour empêcher la sauvegarde",
      "Pour gagner du temps avec une mise en forme réutilisable",
      "Pour supprimer les styles",
      "Pour remplacer Excel",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Quel élément sert à gérer des citations et une bibliographie automatiquement ?",
    options: ["Références", "Insertion", "Mise en page", "Affichage"],
    correctIndex: 0,
  },
  {
    id: 4,
    question: "À quoi sert une table des illustrations (figures) ?",
    options: [
      "À afficher la liste des images légendées avec numéros de pages",
      "À convertir le document en PDF",
      "À créer des colonnes",
      "À corriger l’orthographe",
    ],
    correctIndex: 0,
  },
  {
    id: 5,
    question: "Quelle fonctionnalité permet d’insérer un champ dynamique comme la date ou le numéro de page ?",
    options: ["Champs (fields)", "SmartArt", "WordArt", "Styles rapides"],
    correctIndex: 0,
  },
  {
    id: 6,
    question: "Quel est l’avantage d’utiliser une table (format tableau) plutôt que des tabulations ?",
    options: [
      "C’est moins précis",
      "C’est plus difficile à modifier",
      "C’est plus stable et plus propre pour l’alignement",
      "Ça supprime les marges",
    ],
    correctIndex: 2,
  },
  {
    id: 7,
    question: "Quel outil permet de protéger un document contre les modifications non désirées ?",
    options: ["Révision → Protéger", "Insertion → Protection", "Affichage → Verrouillage", "Accueil → Protéger"],
    correctIndex: 0,
  },
  {
    id: 8,
    question: "Quelle option Word permet de créer une liste de numérotation très structurée (1, 1.1, 1.1.1) ?",
    options: ["Puces", "Liste à plusieurs niveaux", "Styles rapides", "Lettrines"],
    correctIndex: 1,
  },
  {
    id: 9,
    question: "Quelle est la meilleure façon de standardiser les titres, sous-titres et paragraphes dans un document pro ?",
    options: ["Modifier chaque paragraphe à la main", "Utiliser styles + thème + modèle", "Tout mettre en gras", "Copier-coller des pages"],
    correctIndex: 1,
  },
];

export default function WordLevel3CoursePage() {
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
              Cours Word – Niveau 3 (Compétent)
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5 }}>
              Word Compétent : Documents professionnels & automatisation
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Ce niveau te permet de produire des documents professionnels réutilisables (modèles),
              d’automatiser des tâches (publipostage, champs), et de gérer des références (citations,
              légendes, tables). Idéal pour le travail, l’administration, les rapports et les études.
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Compétent" color="primary" size="small" />
              <Chip label="Documents pro" size="small" variant="outlined" />
              <Chip label="Word" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Durée estimée : 8 à 10 heures • Langue : Français
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
                "Créer un modèle Word (template) réutilisable pour des documents pro (lettres, rapports, CV).",
                "Maîtriser les styles avancés et la numérotation multi-niveaux pour structurer proprement.",
                "Créer un publipostage : lettres/enveloppes/étiquettes à partir d’une liste (Excel/CSV).",
                "Insérer des champs dynamiques : date, auteur, numéro de page, propriétés de document.",
                "Gérer des références : citations, bibliographie, légendes et table des illustrations.",
                "Protéger un document (lecture seule, restrictions de modifications) selon le contexte.",
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
              Ce niveau est orienté “production pro” : modèles, automatisation et références.
            </Typography>
            <List dense>
              {[
                "Modèles Word & thèmes (templates)",
                "Styles avancés & numérotation multi-niveaux",
                "Champs dynamiques (date, auteur, propriétés)",
                "Publipostage (Mail Merge) : lettres et étiquettes",
                "Tableaux & mise en page propre (alignement pro)",
                "Références : citations & bibliographie",
                "Légendes & table des illustrations",
                "Protection & partage du document",
                "Projet final : dossier pro réutilisable",
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

      {/* 0. MODELES */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">0. Modèles Word & thèmes (templates)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Un modèle te permet de réutiliser une structure professionnelle (styles, en-têtes, couleurs, polices)
                sans recommencer à zéro à chaque document.
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Différence : document .docx vs modèle .dotx." /></ListItem>
                <ListItem><ListItemText primary="Thèmes : polices + couleurs cohérentes sur tout le document." /></ListItem>
                <ListItem><ListItemText primary="Créer un modèle : page de garde, styles, en-tête/pied, blocs." /></ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Créer un modèle de lettre pro avec en-tête (Nom, contact, logo)." /></ListItem>
                <ListItem><ListItemText primary="Enregistrer en .dotx et créer un nouveau document basé dessus." /></ListItem>
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
                  src="/word-level3-template.png"
                  alt="Modèle Word (template) et thème"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 1. STYLES AVANCES & NUMEROTATION */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">1. Styles avancés & numérotation multi-niveaux</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            On va plus loin : lier proprement la numérotation aux styles (Titre 1, Titre 2, Titre 3)
            pour un document de type rapport ou mémoire.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Liste à plusieurs niveaux liée aux styles (structure stable)." /></ListItem>
            <ListItem><ListItemText primary="Éviter les numéros tapés à la main (ça casse tout)." /></ListItem>
            <ListItem><ListItemText primary="Créer un plan : Titre 1 → 1 ; Titre 2 → 1.1 ; Titre 3 → 1.1.1." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer une structure de 3 niveaux et insérer de nouvelles sections au milieu." /></ListItem>
            <ListItem><ListItemText primary="Mettre à jour et vérifier que tout se renumérote automatiquement." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 2. CHAMPS DYNAMIQUES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">2. Champs dynamiques (date, auteur, propriétés)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Les champs permettent d’afficher des infos qui se mettent à jour automatiquement (date, auteur,
                numéro de page, titre du document…).
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Insertion de champs : date, page, total pages, titre." /></ListItem>
                <ListItem><ListItemText primary="Propriétés du document : titre, auteur, mots clés." /></ListItem>
                <ListItem><ListItemText primary="Mettre à jour les champs (au besoin) pour refléter les changements." /></ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Ajouter dans l’en-tête : Titre du document + date." /></ListItem>
                <ListItem><ListItemText primary="Ajouter un pied de page : Page X / Y." /></ListItem>
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
                  src="/word-level3-fields.png"
                  alt="Champs dynamiques Word (date, pages)"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 3. PUBLIPOSTAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">3. Publipostage (Mail Merge) : lettres et étiquettes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Le publipostage permet de générer automatiquement plusieurs documents personnalisés
            (lettres, attestations, étiquettes) à partir d’une liste de contacts (Excel/CSV).
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Préparer une liste : Nom, Prénom, Email, Adresse…" /></ListItem>
            <ListItem><ListItemText primary="Publipostage → Sélectionner les destinataires (Excel/CSV)." /></ListItem>
            <ListItem><ListItemText primary="Insérer les champs (Nom, Adresse) et prévisualiser." /></ListItem>
            <ListItem><ListItemText primary="Terminer et fusionner : documents individuels ou impression." /></ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer une liste de 8 contacts (Excel ou tableau Word)." /></ListItem>
            <ListItem><ListItemText primary="Générer 8 lettres personnalisées avec Nom + Ville." /></ListItem>
            <ListItem><ListItemText primary="Exporter le résultat en PDF." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 4. TABLEAUX & ALIGNEMENT PRO */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">4. Tableaux & mise en page propre (alignement pro)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Pour une présentation professionnelle, on évite les tabulations “à la main” et on utilise
            des tableaux, marges et alignements stables.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Utiliser un tableau invisible (bordures masquées) pour aligner proprement." /></ListItem>
            <ListItem><ListItemText primary="Colonnes avec largeurs fixes + alignements (gauche/droite)." /></ListItem>
            <ListItem><ListItemText primary="Espacements cohérents (avant/après paragraphe)." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Créer un en-tête pro : logo à gauche, contact à droite (tableau invisible)." /></ListItem>
            <ListItem><ListItemText primary="Créer un tableau de prix (Produit, Quantité, Prix, Total) avec style pro." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 5. REFERENCES : CITATIONS */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">5. Références : citations & bibliographie</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Word peut gérer des sources (auteurs, livres, sites) et générer une bibliographie automatiquement.
                C’est utile pour les rapports, mémoires et documents académiques.
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Références → Gérer les sources." /></ListItem>
                <ListItem><ListItemText primary="Insérer une citation dans le texte." /></ListItem>
                <ListItem><ListItemText primary="Générer une bibliographie automatique." /></ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
              <List dense>
                <ListItem><ListItemText primary="Ajouter 2 sources (un livre + un site web)." /></ListItem>
                <ListItem><ListItemText primary="Insérer 2 citations et générer la bibliographie en fin de document." /></ListItem>
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
                  src="/word-level3-references.png"
                  alt="Références Word : citations et bibliographie"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 6. LEGENDES & TABLE DES ILLUSTRATIONS */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">6. Légendes & table des illustrations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Ajouter des légendes aux images/tableaux permet de générer automatiquement une table des figures.
            Très utile dans les documents structurés (rapports, projets, mémoires).
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Références → Insérer une légende (Figure 1, Figure 2...)." /></ListItem>
            <ListItem><ListItemText primary="Générer une table des illustrations + mise à jour automatique." /></ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Insérer 3 images + ajouter une légende à chacune." /></ListItem>
            <ListItem><ListItemText primary="Créer une table des illustrations et la mettre à jour après ajout d’une 4ème image." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 7. PROTECTION & PARTAGE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">7. Protection & partage du document</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Selon le contexte, tu peux limiter la modification (lecture seule, modifications restreintes)
            ou préparer un PDF final.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Points clés :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Révision → Restreindre la modification (lecture seule / remplissage formulaire)." /></ListItem>
            <ListItem><ListItemText primary="Mot de passe (si nécessaire) + bonnes pratiques." /></ListItem>
            <ListItem><ListItemText primary="Export PDF propre : qualité, compatibilité, noms de fichiers." /></ListItem>
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Exercice pratique :</Typography>
          <List dense>
            <ListItem><ListItemText primary="Protéger un document en lecture seule." /></ListItem>
            <ListItem><ListItemText primary="Exporter une version finale en PDF avec un nom clair." /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 8. PROJET FINAL */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">8. Projet final : dossier pro réutilisable</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Crée un pack professionnel : un modèle de lettre, un rapport simple, et un publipostage.
            Objectif : pouvoir réutiliser tes fichiers pour le travail ou l’administration.
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Livrables :</Typography>
          <List dense>
            <ListItem><ListItemText primary="1 modèle (.dotx) de lettre pro (en-tête + styles + champs date/pages)." /></ListItem>
            <ListItem><ListItemText primary="1 rapport (.docx) avec titres numérotés + table des matières + 1 table des figures." /></ListItem>
            <ListItem><ListItemText primary="1 publipostage : 8 lettres personnalisées + export PDF." /></ListItem>
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
          Ce quiz valide les notions “pro” : modèles, champs, publipostage et références.
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
