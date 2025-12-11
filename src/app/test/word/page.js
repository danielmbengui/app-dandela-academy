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
    question: "Quel est le raccourci clavier pour enregistrer un document ?",
    options: ["Ctrl + C", "Ctrl + S", "Ctrl + V", "Ctrl + A"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Quel est le format natif de Microsoft Word ?",
    options: [".pdf", ".docx", ".jpg", ".txt"],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Quel raccourci permet d'annuler la dernière action ?",
    options: ["Ctrl + Z", "Ctrl + Y", "Ctrl + B", "Ctrl + N"],
    correctIndex: 0,
  },
  {
    id: 4,
    question:
      "À quoi servent les styles (Titre 1, Titre 2, etc.) dans Word ?",
    options: [
      "À ajouter automatiquement des images",
      "À mettre en forme un texte selon un modèle prédéfini",
      "À créer de nouvelles pages",
      "À envoyer des e-mails",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "Quel type d’alignement permet de centrer un texte ?",
    options: ["Alignement gauche", "Alignement centré", "Alignement droite", "Alignement justifié"],
    correctIndex: 1,
  },
  {
    id: 6,
    question:
      "Comment insérer une image enregistrée sur ton ordinateur dans un document Word ?",
    options: [
      "Fichier → Image",
      "Insertion → Image → À partir de ce périphérique",
      "Accueil → Copier l'image",
      "Mise en page → Image",
    ],
    correctIndex: 1,
  },
  {
    id: 7,
    question: "Comment insérer un tableau simple (ex: 3 colonnes, 2 lignes) ?",
    options: [
      "Accueil → Tableau",
      "Insertion → Tableau → Choisir le nombre de colonnes et de lignes",
      "Affichage → Tableau",
      "Mise en page → Créer un tableau",
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    question:
      "Où ajoute-t-on généralement les numéros de page dans un document ?",
    options: [
      "Dans le corps du texte",
      "Dans l’en-tête ou le pied de page",
      "Dans la marge gauche",
      "Dans le titre du document",
    ],
    correctIndex: 1,
  },
  {
    id: 9,
    question: "Comment exporter un document Word en PDF ?",
    options: [
      "Fichier → Enregistrer sous → Choisir le format PDF",
      "Insertion → Exporter PDF",
      "Accueil → PDF",
      "Affichage → PDF",
    ],
    correctIndex: 0,
  },
];

export default function WordBeginnerCoursePage() {
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
              Cours Word – Niveau débutant
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5 }}>
              Initiation à Microsoft Word
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
              Apprends à créer, mettre en forme et finaliser des documents
              professionnels avec Microsoft Word. Ce cours s’adresse aux personnes
              qui débutent complètement ou qui souhaitent consolider les bases.
            </Typography>
          </Box>

          <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Débutant" color="primary" size="small" />
              <Chip label="Bureautique" size="small" variant="outlined" />
              <Chip label="Word" size="small" variant="outlined" />
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
                <ListItemText primary="Créer, ouvrir et enregistrer des documents Word de manière autonome." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Mettre en forme du texte : police, taille, couleur, alignement, listes." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Organiser un document avec des paragraphes propres et des styles de titres." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Insérer des images et des tableaux simples pour structurer l’information." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Configurer la mise en page, les en-têtes, pieds de page et numéros de page." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Exporter un document professionnel en PDF et le préparer à l’impression." />
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
                "Introduction à Microsoft Word",
                "Créer et enregistrer un document",
                "Saisir et modifier du texte",
                "Mettre en forme le texte",
                "Paragraphes, listes et styles",
                "Insérer des images",
                "Insérer un tableau",
                "Mise en page et numérotation",
                "Exporter en PDF & projet final",
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

      {/* 0. INTRO + IMAGE INTERFACE */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            0. Introduction à Microsoft Word et à l&apos;interface
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{xs:12,md:7}}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Dans cette leçon, l&apos;apprenant découvre ce qu&apos;est un logiciel de
                traitement de texte et à quoi sert Microsoft Word dans la vie
                personnelle et professionnelle.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Présentation des principaux usages : lettres, rapports, CV, comptes rendus." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Découverte de l'interface : ruban, onglets, zone de texte, barre d'état." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Présentation des raccourcis utiles : Ctrl+S, Ctrl+Z, Ctrl+Y, Ctrl+C, Ctrl+V." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <Typography variant="body2">
                Ouvrir Microsoft Word, créer un document vierge et repérer :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="L'onglet Accueil et le ruban associé." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="La barre d'état (nombre de pages, langue, zoom)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Le bouton d'enregistrement dans la barre d'outils rapide." />
                </ListItem>
              </List>
            </Grid>

            <Grid size={{xs:12,md:5}}>
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
                  src="/word-interface.png"
                  alt="Interface Word - Ruban et zone de texte"
                  //fill
                  width={200}
                  height={100}
                  style={{ 
                    width:'100%',
                    height:'auto',
                    objectFit: "cover" 
                  }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 1. CREER / ENREGISTRER + IMAGE NOUVEAU DOC */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            1. Créer, ouvrir et enregistrer un document
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Cette leçon apprend à créer un nouveau document, à ouvrir un document
                existant et à enregistrer son travail correctement.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Créer un document vierge à partir de l'écran d'accueil de Word." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Différence entre « Enregistrer » et « Enregistrer sous »." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Choisir un emplacement logique : Documents, Bureau, Dossier de projet." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Comprendre les formats : .docx (document modifiable) et .pdf (version finale)." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Créer un nouveau document vide." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Taper la phrase : « Ceci est mon premier document Word. »" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Enregistrer le document sous le nom « MonPremierDocument.docx » sur le Bureau." />
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
                  src="/word-new-document.png"
                  alt="Création et enregistrement d'un document Word"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 2. SAISIR / MODIFIER */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            2. Saisir et modifier du texte
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Dans cette leçon, l&apos;apprenant découvre comment saisir du texte, le
            modifier, le déplacer et corriger les erreurs.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Saisie de texte au clavier (lettres, chiffres, caractères spéciaux)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Utilisation des touches Retour arrière et Suppr pour corriger." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Sélection du texte avec la souris ou le clavier (Maj + flèches)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Copier, couper, coller du texte (Ctrl+C, Ctrl+X, Ctrl+V)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Annuler / rétablir une action (Ctrl+Z, Ctrl+Y)." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <Typography variant="body2">
            Écrire un paragraphe de 5 à 6 lignes sur un sujet simple (présentation
            personnelle), puis :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Corriger une faute volontairement ajoutée." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Déplacer une phrase du début vers la fin du paragraphe." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Annuler puis rétablir une modification avec Ctrl+Z et Ctrl+Y." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 3. MISE EN FORME TEXTE */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            3. Mettre en forme le texte (police, taille, couleur, alignement)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Cette leçon aborde la mise en forme de base du texte pour rendre le
            document lisible et professionnel.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Changer la police et la taille du texte." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Mettre un mot ou une phrase en gras, italique, souligné." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Modifier la couleur du texte et la couleur de surbrillance." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Aligner un paragraphe : gauche, centré, droite, justifié." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Créer un titre centré en police plus grande (ex: 20pt), en gras." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Mettre en italique une citation dans le texte." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Justifier le paragraphe principal pour un alignement propre." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 4. PARAGRAPHES / LISTES / STYLES */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            4. Paragraphes, listes et styles
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Cette leçon apprend à structurer le texte avec des paragraphes, des
            listes à puces ou numérotées, et des styles prédéfinis.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Gérer les sauts de ligne et les sauts de paragraphe." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Utiliser des listes à puces pour lister des éléments." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Créer une liste numérotée simple (1, 2, 3...). " />
            </ListItem>
            <ListItem>
              <ListItemText primary="Appliquer un style Titre 1, Titre 2 pour structurer le document." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Créer un titre principal avec le style « Titre 1 »." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Créer une liste à puces de 4 éléments (ex: compétences, qualités)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Créer une liste numérotée de 3 étapes." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 5. INSERER IMAGES + IMAGE D'ILLUSTRATION */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            5. Insérer des images dans un document
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Cette leçon montre comment insérer une image dans le document et
                ajuster sa taille et sa position.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Utiliser l’onglet Insertion → Image → À partir de ce périphérique." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Redimensionner l’image en tirant sur les poignées." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Choisir un mode d’habillage du texte (aligné, carré, etc.)." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Insérer une image (logo, photo simple)." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Réduire sa taille à environ la moitié." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Positionner l’image à droite avec un habillage « Carré »." />
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
                  src="/word-insert-image.png"
                  alt="Exemple d'insertion d'image dans Word"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 6. TABLEAU + IMAGE TABLEAU */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            6. Insérer un tableau simple
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Ici, on apprend à insérer un tableau pour structurer des données
                simples (liste de personnes, inventaire, etc.).
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Points clés :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Insertion → Tableau → glisser pour choisir le nombre de lignes et de colonnes." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Saisir du texte dans les cellules." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Ajouter ou supprimer des lignes/colonnes." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Appliquer un style de tableau simple (bandes de couleur, bordures)." />
                </ListItem>
              </List>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                Exercice pratique :
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Créer un tableau 3 colonnes : Nom, Âge, Ville." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Ajouter 3 lignes avec des informations fictives." />
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
                  src="/word-table-example.png"
                  alt="Exemple de tableau Word"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 7. MISE EN PAGE & NUMEROTATION */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            7. Mise en page, en-têtes, pieds de page et numérotation
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Cette leçon permet de préparer un document à l&apos;impression ou à
            l&apos;envoi : marges, orientation, en-têtes et pieds de page.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Points clés :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Onglet Mise en page : marges, orientation (Portrait/Paysage)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Insertion → En-tête et pied de page." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Insertion → Numéro de page (en bas, centré par exemple)." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Exercice pratique :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Passer le document en orientation Portrait." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ajouter un numéro de page centré en bas de la page." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 8. EXPORT PDF + PROJET FINAL */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            8. Exporter en PDF & projet final
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Dernière étape : transformer le document en fichier PDF prêt à être
            transmis ou imprimé, puis réaliser un mini-projet qui récapitule tout.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Exporter en PDF :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Fichier → Enregistrer sous → Choisir le type PDF." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Donner un nom clair au fichier (ex: « DocumentFinal.pdf »)." />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Projet final :
          </Typography>
          <Typography variant="body2">
            Créer un document d&apos;une page qui contient :
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Un titre centré en haut (style « Titre 1 »)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Un paragraphe de 5 lignes de texte." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Une liste à puces de 4 éléments." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Une image insérée et redimensionnée." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Un tableau avec 3 colonnes et au moins 2 lignes." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Un numéro de page en bas." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Exporter le document en PDF." />
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
          dans le cours. Idéalement, il est réalisé après le projet final.
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
