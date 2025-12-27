"use client";

import React, { useEffect, useState } from "react";
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
    IconButton,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { ClassLessonChapter, ClassLessonChapterTranslation } from "@/classes/lessons/ClassLessonChapter";
import { useLanguage } from "@/contexts/LangProvider";
import { useParams } from "next/navigation";
import { useLesson } from "@/contexts/LessonProvider";
import { useTranslation } from "react-i18next";
import { ClassLesson } from "@/classes/ClassLesson";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { ClassLessonSubchapterTranslation } from "@/classes/lessons/ClassLessonSubchapter";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { IconArrowBack, IconArrowLeft, IconArrowRight, IconBookOpen, IconLessons, IconObjective } from "@/assets/icons/IconsComponent";
import { NS_BUTTONS, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";

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

const CardHeader = ({ lesson = null, chapter = null }) => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    return (<Stack sx={{ background: 'yellow', width: '100%' }}>
        <Grid container>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                    <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                        <Chip label={t(lesson?.category, { ns: ClassLesson.NS_COLLECTION })} size="small" variant="outlined" />
                        <Chip label={chapter?.level} size="small" variant="outlined" />
                    </Stack>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, my: 0.5 }}>
                        {chapter?.translate?.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                        {chapter?.translate?.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
                        {`Durée estimée :`} {chapter?.estimated_start_duration} à {chapter?.estimated_end_duration} heures
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    </Stack>)
}
const CardGoals = ({ lesson = null, chapter = null }) => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    return (<Stack sx={{ py: 2, px: 1.5, background: 'var(--card-color)', borderRadius: '10px', width: '100%' }}>
        <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ mb: 1 }}>
            <IconObjective height={18} width={18} color="var(--primary)" />
            <Typography variant="h4" sx={{ fontWeight: '500' }}>{`Objectifs pédagogiques`}</Typography>
        </Stack>
        <Typography variant="caption" sx={{ mb: 0.5 }}>{`À la fin de ce cours tu seras capable de :`}</Typography>
        <List dense disablePadding>
            {
                chapter?.translate?.goals?.map((goal, i) => {
                    return (<ListItem key={`${goal}-${i}`} disableGutters sx={{ px: 1 }}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <CheckCircleIcon color="success" fontSize="small" />
                            <Typography sx={{ fontSize: '0.85rem' }} >{goal}</Typography>
                        </Stack>
                    </ListItem>)
                })
            }
        </List>
    </Stack>)
}
const CardSubChapters = ({ lesson = null, chapter = null }) => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    return (<Stack sx={{ py: 2, px: 1.5, background: 'var(--card-color)', borderRadius: '10px', width: '100%' }}>
        <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ mb: 1 }}>
            <IconBookOpen height={18} width={18} color="var(--primary)" />
            <Typography variant="h4" sx={{ fontWeight: '500' }}>{`Structure du cours`}</Typography>
        </Stack>
        <Typography variant="caption" sx={{ mb: 0.5 }}>{`Le cours est organisé en leçons courtes, chacune avec une partie théorique et un exercice pratique.`}</Typography>
        <List dense disablePadding>
            {
                chapter?.subchapters?.sort((a, b) => a.uid_intern - b.uid_intern).map((sub, i) => {
                    return (<ListItem key={`${sub.uid_intern}-${i}`} disableGutters sx={{ px: 1 }}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <Typography sx={{ fontSize: '0.85rem' }} >{`${sub.uid_intern}. `}{sub.translate?.title}</Typography>
                        </Stack>
                    </ListItem>)
                })
            }
        </List>
    </Stack>)
}
const CardSubChaptersContent = ({ subChapters = [], lesson = null, chapter = null }) => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const [index, setIndex] = useState(0);
    const [subChapter, setSubChapter] = useState(null);
    useEffect(() => {
        if (index >= 0 && subChapters.length>0) {
            setSubChapter(subChapters[index]);
        } else {
            setSubChapter(null);
        }
    }, [index,subChapters]);
    const goBack = ()=> {
        setIndex(prev => prev - 1);
    }
    const goNext = ()=> {
        setIndex(prev => prev + 1);
    }

    return (<Stack sx={{ background: 'yellow', width: '100%' }}>
        <Grid container>
            <Grid size={{ xs: 12, sm: 12 }}>
                <Stack sx={{ py: 2, px: 1.5, background: 'var(--card-color)', borderRadius: '10px', width: '100%' }}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <IconButton
                            onClick={() => setIndex(prev => prev - 1)}
                            disabled={index === 0}
                            sx={{ color: index === 0 ? 'var(--grey-light)' : 'var(--primary)' }}>
                            <IconArrowLeft />
                        </IconButton>
                        <Typography>{`${subChapter?.uid_intern}. `}{subChapter?.translate?.title}</Typography>
                        <IconButton
                            onClick={() => setIndex(prev => prev + 1)}
                            disabled={index === subChapters.length - 1}
                            sx={{ color: index === subChapters.length - 1 ? 'var(--grey-light)' : 'var(--primary)' }}>
                            <IconArrowRight />
                        </IconButton>
                    </Stack>
                    <Grid container spacing={1}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack alignItems={'start'} spacing={1.5} sx={{ py: 2, px: 1.5, border: '0.1px solid var(--card-border)', borderRadius: '10px', width: '100%' }}>
                                {
                                    subChapter?.translate?.goals?.map?.((goal, i) => {
                                        return (<Typography sx={{ fontWeight: 600 }} key={`${goal}-${i}`}>{goal}</Typography>)
                                    })
                                }
                                <Stack alignItems={'start'} spacing={1}>
                                    <Chip sx={{ border: '0.1px solid var(--primary)' }} label={`Points clés`} size="small" variant="outlined" />
                                    <Stack spacing={0.5} sx={{ px: 1.5 }}>
                                        {
                                            subChapter?.translate?.keys?.map?.((key, i) => {
                                                return (<Typography key={`${key}-${i}`} sx={{ fontSize: '0.85rem' }} >{`- `}{key}</Typography>)
                                            })
                                        }
                                    </Stack>
                                </Stack>
                                <Stack alignItems={'start'} spacing={1}>
                                    <Chip sx={{ border: '0.1px solid var(--primary)' }} label={`Exercice pratique`} size="small" variant="outlined" />
                                    <Stack spacing={0.5} sx={{ px: 1.5 }}>
                                        {
                                            subChapter?.translate?.exercises?.map?.((exercise, i) => {
                                                return (<Typography key={`${exercise}-${i}`} sx={{ fontSize: '0.85rem' }} >{`- `}{exercise}</Typography>)
                                            })
                                        }
                                    </Stack>
                                </Stack>
                                <Stack direction={'row'} sx={{pt:3}} spacing={0.5} alignItems={'center'}>
                                    <ButtonCancel onClick={goBack} disabled={index === 0} label={t('previous', {ns:NS_BUTTONS})} />
                                    <ButtonConfirm onClick={goNext} disabled={index === subChapters.length - 1} label={t('next', {ns:NS_BUTTONS})} />
                                </Stack>
                            </Stack></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    //height: 220,
                                    //borderRadius: 2,
                                    overflow: "hidden",
                                    border: "1px solid",
                                    border: "0.1px solid transparent",
                                    //background:'red',

                                }}
                            >
                                {
                                    subChapter?.translate?.photo_url && <Image
                                        src={subChapter?.translate?.photo_url || ""}
                                        alt="Interface Excel - grille et ruban"
                                        //fill
                                        height={100}
                                        width={200}
                                        style={{ objectFit: "cover", width: '100%', height: 'auto' }}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Grid>
        </Grid>
    </Stack>)
}

export default function ExcelBeginnerCoursePage() {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const { lang } = useLanguage();
    const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
    const { chapter: uidChapter } = useParams();
    const [chapter, setChapter] = useState();
    const [subChapters, setSubChapters] = useState([]);
    const [subChapter, setSubChapter] = useState(null);
    const [process, setProcess] = useState(false);
    const [indexSub, setIndexSub] = useState(0);

    useEffect(() => {
        async function init() {
            const _chapter = await ClassLessonChapter.fetchFromFirestore(uidChapter, lang);
            const _lesson = getOneLesson(_chapter.uid_lesson);
            _chapter.lesson = _lesson;
            //const finalResult = new ClassLessonChapter({..._chapter.toJSON(), lesson:_lesson});
            console.log("CHAPTER", _chapter.getTranslate('fr'));
            setChapter(_chapter);
            setSubChapters(_chapter.subchapters);
            setSubChapter(_chapter.subchapters?.[0] || null);
            setUidLesson(_chapter.uid_lesson);
        }
        if (!isLoadingLesson && uidChapter) {
            init();
        }
    }, [uidChapter, isLoadingLesson])
    return (<DashboardPageWrapper
        titles={[
            { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_LESSONS },
            { name: lesson?.translate?.title, url: `${PAGE_LESSONS}/${lesson?.uid}` },
            { name: t('chapters', { ns: NS_DASHBOARD_MENU }), url: `${PAGE_LESSONS}/${lesson?.uid}/chapters` },
            { name: `${chapter?.uid_intern}. ${chapter?.translate?.title}`, url: '' },
        ]}
        //title={`Cours / ${lesson?.title}`}
        //subtitle={lesson?.translate?.subtitle}
        icon={<IconLessons />}
    >
        <Container maxWidth="lg" disableGutters sx={{ p: 0, background: 'red' }}>
            <Grid container spacing={1}>
                <Grid size={12}>
                    <CardHeader lesson={lesson} chapter={chapter} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CardGoals lesson={lesson} chapter={chapter} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CardSubChapters lesson={lesson} chapter={chapter} />
                </Grid>
                <Grid size={12}>
                    <CardSubChaptersContent
                        subChapters={subChapters}
                        subChapter={subChapter} setSubChapter={setSubChapter} lesson={lesson} chapter={chapter} />
                </Grid>
            </Grid>
            {/* HEADER / HERO */}
            <Box component={Paper} elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <ButtonConfirm
                    label="Translate"
                    loading={process}
                    onClick={async () => {
                        try {
                            setProcess(true);
                            //console.log("CHAPTER", chapter.getTranslate('fr'));
                            const INDEX_SUB = 8;
                            const subchapters = chapter.subchapters || [];
                            const trans = subchapters?.[INDEX_SUB].getTranslate('fr');
                            const qs = encodeURIComponent(JSON.stringify(trans));
                            const fetchTranslate = await fetch(`/api/test?lang=fr&translations=${qs}`);
                            const result = await fetchTranslate.json();
                            const translates = Object.values(result)?.map?.(trans => new ClassLessonSubchapterTranslation(trans));
                            subchapters[INDEX_SUB].translates = translates;
                            
                            const _patch = await chapter?.updateFirestore({
                                subchapters: subchapters.map(sub => {
                                    const final = sub.toJSON();
                                    const trans = sub._convertTranslatesToFirestore(sub.translates);
                                    final.translates = trans;
                                    return final;
                                })
                            });
                            
                            setChapter(_patch?.clone());
                            console.log("RESUULT", trans, result)
                        } catch (error) {
                            console.log("ERRROR", error);
                        } finally {
                            setProcess(false);
                        }
                    }}
                />
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
                            {chapter?.translate?.subtitle}
                        </Typography>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5 }}>
                            {chapter?.translate?.title}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1.5, color: "text.secondary" }}>
                            {chapter?.translate?.description}
                        </Typography>
                    </Box>

                    <Stack direction="column" spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip label={t(chapter?.level)} color="primary" size="small" />
                            <Chip label={t(lesson?.category, { ns: ClassLesson.NS_COLLECTION })} size="small" variant="outlined" />
                            <Chip label="Excel" size="small" variant="outlined" />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            Durée estimée : {chapter?.estimated_start_duration} à {chapter?.estimated_end_duration} heures
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
                            {
                                chapter?.translate?.goals?.map((goal, i) => {
                                    return (<ListItem key={`${goal}-${i}`}>
                                        <ListItemIcon>
                                            <CheckCircleIcon color="success" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={goal} />
                                    </ListItem>)
                                })
                            }
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
                            {
                                chapter?.subchapters?.map((sub, i) => {
                                    return (<ListItem key={`${sub.uid_intern}-${i}`} sx={{ py: 0.3 }}>
                                        <ListItemText
                                            primaryTypographyProps={{ variant: "body2" }}
                                            primary={`${i}. ${sub.translate?.title}`}
                                        />
                                    </ListItem>)
                                })
                            }
                            {[
                                //...,
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
            {
                chapter?.subchapters?.map?.((sub, i) => {
                    return (<Accordion key={`${sub.uid_intern}-${i}`}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1">
                                {i}. {sub.translate?.title}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={7}>
                                    {
                                        sub.translate?.goals?.map?.((goal, i) => {
                                            return (<Typography key={`${goal}-${i}`} variant="body2" sx={{ mb: 1.5 }}>
                                                {goal}
                                            </Typography>)
                                        })
                                    }
                                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                                        Dans cette leçon, l&apos;apprenant découvre à quoi sert Excel et
                                        l&apos;organisation générale de l&apos;interface : ruban, onglets, zone
                                        de cellules, barre de formule.
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                        Points clés :
                                    </Typography>
                                    <List dense>
                                        {
                                            sub.translate?.keys?.map?.((key, i) => {
                                                return (<ListItem key={`${key}-${i}`}>
                                                    <ListItemText primary={key} />
                                                </ListItem>)
                                            })
                                        }
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
                                        {
                                            sub.translate?.exercises?.map?.((exercise, i) => {
                                                return (<ListItem key={`${exercise}-${i}`}>
                                                    <ListItemText primary={exercise} />
                                                </ListItem>)
                                            })
                                        }
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
                                    <Stack
                                        sx={{
                                            position: "relative",
                                            width: "100%",
                                            //height: 220,
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            border: "1px solid",
                                            borderColor: "divider",
                                            //background:'red',

                                        }}
                                    >
                                        {
                                            sub.translate?.photo_url && <Image
                                                src={sub.translate?.photo_url || ""}
                                                alt="Interface Excel - grille et ruban"
                                                //fill
                                                height={100}
                                                width={200}
                                                style={{ objectFit: "cover", width: '100%', height: 'auto' }}
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        }
                                    </Stack>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>)
                })
            }

            {/* 0. INTRO + INTERFACE */}
            <Accordion>
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
    </DashboardPageWrapper>);
}
