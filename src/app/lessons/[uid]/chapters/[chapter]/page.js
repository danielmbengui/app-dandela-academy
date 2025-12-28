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
import { Trans, useTranslation } from "react-i18next";
import { ClassLesson } from "@/classes/ClassLesson";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { ClassLessonSubchapterTranslation } from "@/classes/lessons/ClassLessonSubchapter";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { IconArrowBack, IconArrowLeft, IconArrowRight, IconBookOpen, IconLessons, IconObjective, IconQuizz } from "@/assets/icons/IconsComponent";
import { NS_BUTTONS, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { ClassLessonChapterQuestion, ClassLessonChapterQuestionTranslation } from "@/classes/lessons/ClassLessonChapterQuiz";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import { addDaysToDate, formatChrono, getFormattedDateCompleteNumeric, mixArray } from "@/contexts/functions";
import AlertComponent from "@/components/elements/AlertComponent";

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
    return (<Stack sx={{ background: '', width: '100%' }}>
        <Grid container>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                    <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                        <Chip label={t(lesson?.category, { ns: ClassLesson.NS_COLLECTION })} size="small" variant="outlined" />
                        <Chip label={t(chapter?.level)} size="small" variant="outlined" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, my: 1 }}>
                        <Trans
                            t={t}
                            i18nKey={'duration'}
                            values={{
                                start: chapter?.estimated_start_duration,
                                end: chapter?.estimated_end_duration
                            }}
                        />
                    </Typography>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, my: 0.5 }}>
                        {chapter?.translate?.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                        {chapter?.translate?.description}
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
            <Typography variant="h4" sx={{ fontWeight: '500' }}>{t('goals')}</Typography>
        </Stack>
        <Typography variant="caption" sx={{ mb: 0.5 }}>{t('goals-subtitle')}</Typography>
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
const CardSubChapters = ({ lesson = null, chapter = null, index = -1, setIndex = null, subChapters = [], }) => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    return (<Stack sx={{ py: 2, px: 1.5, background: 'var(--card-color)', borderRadius: '10px', width: '100%' }}>
        <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ mb: 1 }}>
            <IconBookOpen height={18} width={18} color="var(--primary)" />
            <Typography variant="h4" sx={{ fontWeight: '500' }}>{t('subchapters')}</Typography>
        </Stack>
        <Typography variant="caption" sx={{ mb: 0.5 }}>{t('subchapters-subtitle')}</Typography>
        <List dense disablePadding>
            {
                subChapters?.sort((a, b) => a.uid_intern - b.uid_intern).map((sub, i) => {
                    return (<ListItem key={`${sub.uid_intern}-${i}`} disableGutters sx={{ px: 1 }}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}
                            onClick={() => setIndex(i)}
                            sx={{
                                color: index === i ? 'var(--primary)' : '',
                                ":hover": {
                                    color: 'var(--primary)',
                                    cursor: index === i ? 'text' : 'pointer',
                                }
                            }}>
                            <Typography sx={{ fontSize: '0.85rem' }} >{`${sub.uid_intern}. `}{sub.translate?.title}</Typography>
                        </Stack>
                    </ListItem>)
                })
            }
            <ListItem disableGutters sx={{ px: 1 }}>
                <Stack direction={'row'} alignItems={'center'} spacing={1}
                    onClick={() => setIndex(subChapters.length)}
                    sx={{
                        color: index === subChapters.length ? 'var(--primary)' : '',
                        ":hover": {
                            color: 'var(--primary)',
                            cursor: index === subChapters.length ? 'text' : 'pointer',
                        }
                    }}>
                    <Typography sx={{ fontSize: '0.85rem' }} >{`${subChapters.length + 1}. `}{t('quiz')}</Typography>
                </Stack>
            </ListItem>
        </List>
    </Stack>)
}
const CardSubChaptersContent = ({ index = -1, setIndex = null, subChapters = [], lesson = null, chapter = null }) => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);

    const [subChapter, setSubChapter] = useState(null);
    useEffect(() => {
        if (index >= 0 && subChapters.length > 0) {
            setSubChapter(subChapters[index]);
        } else {
            setSubChapter(null);
        }
    }, [index, subChapters]);
    const goBack = () => {
        setIndex(prev => prev - 1);
    }
    const goNext = () => {
        setIndex(prev => prev + 1);
    }

    return (<Stack sx={{ background: '', width: '100%' }}>
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
                                    <Chip sx={{ border: '0.1px solid var(--primary)' }} label={t('keys')} size="small" variant="outlined" />
                                    <Stack spacing={0.5} sx={{ px: 1.5 }}>
                                        {
                                            subChapter?.translate?.keys?.map?.((key, i) => {
                                                return (<Typography key={`${key}-${i}`} sx={{ fontSize: '0.85rem' }} >{`- `}{key}</Typography>)
                                            })
                                        }
                                    </Stack>
                                </Stack>
                                <Stack alignItems={'start'} spacing={1}>
                                    <Chip sx={{ border: '0.1px solid var(--primary)' }} label={t('exercises')} size="small" variant="outlined" />
                                    <Stack spacing={0.5} sx={{ px: 1.5 }}>
                                        {
                                            subChapter?.translate?.exercises?.map?.((exercise, i) => {
                                                return (<Typography key={`${exercise}-${i}`} sx={{ fontSize: '0.85rem' }} >{`- `}{exercise}</Typography>)
                                            })
                                        }
                                    </Stack>
                                </Stack>

                                <Typography variant="body2" sx={{ fontWeight: 400, mt: 1.5 }}>
                                    <Trans
                                        t={t}
                                        i18nKey={'subchapters-last'}
                                        values={{
                                            start: chapter?.estimated_start_duration,
                                            end: chapter?.estimated_end_duration
                                        }}
                                        components={{
                                            b: <strong />,
                                            br: <br />
                                        }}
                                    />
                                </Typography>

                                <Stack direction={'row'} sx={{ pt: 3 }} spacing={0.5} alignItems={'center'}>
                                    {
                                        index > 0 && <ButtonCancel onClick={goBack} disabled={index === 0} label={t('previous', { ns: NS_BUTTONS })} />
                                    }
                                    {
                                        index < subChapters.length - 1 && <ButtonConfirm onClick={goNext} disabled={index === subChapters.length - 1} label={t('next', { ns: NS_BUTTONS })} />
                                    }
                                    {
                                        index === subChapters.length - 1 && <ButtonConfirm onClick={goNext} disabled={index < subChapters.length - 1} label={t('quiz-btn')} />
                                    }
                                </Stack>
                            </Stack>
                        </Grid>
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
                                        alt={subChapter?.translate.title}
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
const CardQuizz = ({ indexSub = -1, setIndexSub = null, quiz = null, subChapters = [], lesson = null, chapter = null }) => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const [index, setIndex] = useState(-1);
    const [subChapter, setSubChapter] = useState(null);
    const [question, setQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [duration, setDuration] = useState(0);
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [nextDate, setNextDate] = useState(null);
    useEffect(() => {
        if (chapter?.quiz?.questions?.length > 0) {
            setQuestions(chapter.quiz.questions);
            const arr = Array(chapter.quiz.questions.length).fill('');
            setAnswers(arr);
        } else {
            setQuestions([]);
            setAnswers([]);
        }
        // console.log("quiiiiiz", chapter)
    }, [chapter]);
    useEffect(() => {
        if (indexSub < subChapters.length - 1) {
            setDuration(0);
        }
    }, [indexSub]);
    useEffect(() => {
        if (index < 0) return;
        if (finished) return;

        const time = 1000;
        const intervalId = setInterval(() => {
            setDuration(prev => prev + 1);
        }, time);

        return () => clearInterval(intervalId);
    }, [index, finished]);
    useEffect(() => {
        if (index >= 0 && questions?.length > 0) {
            setQuestion(questions[index]);
            setProposals(questions[index].translate?.proposals);
        } else {
            setQuestion(null);
            setProposals([]);
        }
        // console.log("WUESTTTTIONS", questions)
    }, [index, questions]);
    const goBackSub = () => {
        setIndexSub(prev => prev - 1);
    }
    const goBack = () => {
        setIndex(prev => prev - 1);
    }
    const goNext = () => {
        setIndex(prev => prev + 1);
    }
    const submitQuiz = () => {
        var _score = 0;
        for (var i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (question.translate.answer?.uid_intern === answers[i]) {
                _score = _score + 1;
            }
            console.log("ANSWER", question.translate.answer);
        }
        console.log("SCORE", _score, questions.length, answers)
        setScore(_score);
        setNextDate(addDaysToDate(new Date(),30));
        setFinished(true);
    }

    return (<Stack alignItems={'start'} spacing={1.5} sx={{ background: '', width: '100%' }}>
        <Grid container spacing={1.5} sx={{ width: '100%' }}>
            <Grid size={{ xs: 12, sm: 8 }}>
                <Stack spacing={1} sx={{ py: 2, px: 1.5, background: 'var(--card-color)', borderRadius: '10px', width: '100%' }}>
                    <Stack maxWidth={'sm'} spacing={0.5}>
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                            <IconQuizz color={'var(--primary)'} />
                            <Typography>{t('quiz')}</Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: 'red', fontWeight: 300 }}>{t('quiz-subtitle')}</Typography>
                    </Stack>
                    <AlertComponent
                        severity="warning"
                        subtitle={<Trans
                            t={t}
                            i18nKey={'quiz-warning'}
                            components={{
                                b: <strong />
                            }}
                        />
                        }
                    />
                    <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                        {
                            index < 0 && <ButtonCancel label={t('quiz-btn-back')} onClick={goBackSub} />
                        }
                        <ButtonConfirm label={t('quiz-btn-start')} onClick={() => {
                            if (index === 0) {
                                submitQuiz();
                            }
                            setIndex(0);

                        }} />
                    </Stack>
                    <Typography>{`${t('quiz-duration')} : ${formatChrono(duration)}`}</Typography>
                    <AlertComponent
                        severity="success"
                        subtitle={<Trans
                            t={t}
                            i18nKey={'quiz-finished'}
                            values={{
                                score:`${score}/${questions?.length}`,
                                nextDate:getFormattedDateCompleteNumeric(nextDate),
                                percentage:(score/questions?.length * 100).toFixed(2),
                                duration:formatChrono(duration),
                            }}
                            components={{
                                b: <strong />,
                                br:<br />,
                            }}
                        />
                        }
                    />
                    <Stack alignItems={'start'} spacing={1.5} sx={{ py: 2, px: 1.5, border: '0.1px solid var(--card-border)', borderRadius: '10px', width: '100%' }}>
                        {
                            <Typography sx={{ fontWeight: 500 }}>{question?.uid_intern}. {question?.translate?.question}</Typography>
                        }
                        {
                            proposals?.map?.((proposal, i) => {
                                //console.log("PROP", proposal)
                                return (<CheckboxComponent
                                    checked={answers[index] === proposal.uid_intern}
                                    onChange={(e) => {
                                        const _answers = [...answers];
                                        _answers[index] = proposal.uid_intern;
                                        setAnswers(_answers)
                                    }}
                                    //name={`proposal${i}`} 
                                    key={`${proposal.uid_intern}-${i}`}
                                    label={proposal.value}
                                />)
                            })
                        }
                        <Stack direction={'row'} sx={{ pt: 3 }} spacing={0.5} alignItems={'center'}>
                            {
                                index > 0 && <ButtonCancel onClick={goBack} disabled={index === 0} label={t('previous', { ns: NS_BUTTONS })} />
                            }
                            {
                                index < questions?.length - 1 && <ButtonConfirm
                                    onClick={goNext}
                                    disabled={index === questions?.length - 1 || !answers[index]}
                                    label={t('next', { ns: NS_BUTTONS })} />
                            }
                            {
                                index === questions?.length - 1 && <ButtonConfirm
                                    onClick={submitQuiz}
                                    disabled={index < questions?.length - 1 || !answers[questions?.length - 1]}
                                    label={t('save', { ns: NS_BUTTONS })} />
                            }
                        </Stack>
                    </Stack>
                </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 'grow' }}>
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
                        <Image
                            src={lesson?.photo_url}
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
    const [indexSub, setIndexSub] = useState(9);
    const onTranslate = async () => {
        try {
            setProcess(true);
            const INDEX_SUB = 8;
            const quiz = chapter.quiz || [];
            var questions = quiz?.questions || [];
            const trans = questions?.[INDEX_SUB].getTranslate('fr');
            const qs = encodeURIComponent(JSON.stringify(trans));
            //console.log("fect", qs);
            const fetchTranslate = await fetch(`/api/test?lang=fr&translations=${qs}`);
            const result = await fetchTranslate.json();
            const translates = Object.values(result)?.map?.(trans => new ClassLessonChapterQuestionTranslation(trans));
            questions[INDEX_SUB].translates = translates;
            questions = questions.map((q, i) => {
                const final = q;
                const qTrans = q.translates.map(_trans => {
                    var answer = _trans.answer;
                    const proposals = _trans.proposals.map((prop, i) => {
                        var propReturn = {};
                        if (prop.uid_intern) {
                            propReturn = prop;
                        } else {
                            propReturn = { value: prop, uid_intern: i + 1 };
                        }

                        if (!answer.uid_intern && propReturn.value === answer) {
                            answer = { uid_intern: i + 1, value: propReturn.value }
                        }
                        return propReturn;
                    });
                    _trans.proposals = proposals;
                    _trans.answer = answer;
                    return (_trans);
                });

                const trans = q._convertTranslatesToFirestore(qTrans);
                final.translates = trans;
                //final.translates
                return final.toJSON();
            });
            quiz.questions = questions;

            const _patch = await chapter?.updateFirestore({ quiz: quiz.toJSON() });


            //setChapter(_patch?.clone());

            console.log("RESUULT", quiz)
        } catch (error) {
            console.log("ERRROR", error);
        } finally {
            setProcess(false);
        }
    }
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
        <Container maxWidth="lg" disableGutters sx={{ p: 0, background: '' }}>
            <Grid container spacing={1}>
                <Grid size={12}>
                    <CardHeader lesson={lesson} chapter={chapter} />
                </Grid>
                {
                    indexSub < subChapters.length && <>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CardGoals lesson={lesson} chapter={chapter} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CardSubChapters
                                index={indexSub}
                                setIndex={setIndexSub}
                                subChapters={subChapters}
                                lesson={lesson} chapter={chapter} />
                        </Grid>
                        <Grid size={12}>
                            <CardSubChaptersContent
                                index={indexSub}
                                setIndex={setIndexSub}
                                subChapters={subChapters}
                                subChapter={subChapter} setSubChapter={setSubChapter} lesson={lesson} chapter={chapter} />
                        </Grid>
                    </>
                }

                <Grid size={{ xs: 12, sm: 12 }}>
                    {
                        indexSub === subChapters.length && <CardQuizz
                            indexSub={indexSub}
                            setIndexSub={setIndexSub}
                            quiz={chapter?.quizz}
                            subChapters={subChapters}
                            subChapter={subChapter} setSubChapter={setSubChapter}
                            lesson={lesson}
                            chapter={chapter} />
                    }
                </Grid>
            </Grid>
            {/* HEADER / HERO */}
            <Box component={Paper} elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <ButtonConfirm
                    label="Translate"
                    loading={process}
                    onClick={onTranslate}
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
        </Container>
    </DashboardPageWrapper>);
}
