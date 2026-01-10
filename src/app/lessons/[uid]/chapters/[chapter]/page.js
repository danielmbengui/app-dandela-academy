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
    CircularProgress,
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
import { IconArrowBack, IconArrowLeft, IconArrowRight, IconBookOpen, IconCertificate, IconDuration, IconLessons, IconObjective, IconQuizz } from "@/assets/icons/IconsComponent";
import { NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS } from "@/contexts/i18n/settings";
import { PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { ClassLessonChapterQuestion, ClassLessonChapterQuestionTranslation, ClassLessonChapterQuiz } from "@/classes/lessons/ClassLessonChapterQuiz";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import { addDaysToDate, formatChrono, getFormattedDateComplete, getFormattedDateCompleteNumeric, mixArray } from "@/contexts/functions";
import AlertComponent from "@/components/elements/AlertComponent";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useAuth } from "@/contexts/AuthProvider";
import CircularProgressWithLabelComponent from "@/components/elements/CircularProgressWithLabelComponent";
import AccordionComponent from "@/components/dashboard/elements/AccordionComponent";
import { useChapter } from "@/contexts/ChapterProvider";
import { useStat } from "@/contexts/StatProvider";
import Link from "next/link";
import CircularProgressStatComponent from "@/components/elements/CircularProgressStatComponent";

const CongratulationsComponent = ({ stat = null, setIndexSub = null }) => {
    const { t } = useTranslation([ClassLessonChapterQuiz.NS_COLLECTION]);
    // score: `${stat?.score}/${stat?.answers?.length}`,
    //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
    //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
    //duration: formatChrono(duration),
    return (<>
        <Stack className="results-summary-container" sx={{ borderRadius: '10px', width: { xs: '100%', sm: '400px' }, border: '0.1px solid var(--card-border)' }}>
            <div className="confetti">
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
            </div>
            <div className="results-summary-container__result" style={{ zIndex: 1_001 }}>
                <div className="result-box">
                    <div className="heading-primary">
                        {stat?.score}/{stat?.answers?.length}
                    </div>
                    <p className="result">
                        {`${parseInt(stat?.score / stat?.answers?.length * 100)}%`}
                    </p>
                    <p className="time">
                        {`${formatChrono(stat?.duration)}`}
                    </p>
                </div>
                <div className="result-text-box">
                    <div className="heading-secondary">{t('finished.congrats')}</div>
                    <p className="paragraph">
                        {t('finished.max-score')}
                    </p>
                </div>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={'center'} sx={{ py: 1.5 }}>
                    <ButtonCancel label={t('btn-back')} onClick={() => setIndexSub(prev => prev - 1)} />
                    <Link href={`${PAGE_STATS}/${stat?.uid}`}>
                        <ButtonConfirm label={t('btn-see-answers')} />
                    </Link>

                </Stack>
                <div className="summary__cta" style={{ marginTop: '10px' }}>


                </div>
            </div>
        </Stack>
        <style jsx>{`
.results-summary-container {
  font-family: "Hanken Grotesk", sans-serif;
  display: flex;
  width: 100%;
  max-width:100%;
  border-radius: 30px;
  border:0.1px solid var(--card-border);
}
@media (min-width: 600px) {
  .results-summary-container {
    width: 330px;
  }
}

.heading-primary,
.heading-secondary,
.heading-tertiary {
  color: var(--grey-dark);
  text-transform: capitalize;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.heading-primary {
  font-size: 2rem;
  font-weight: 600;
  background-image: linear-gradient(to right, var(--success), var(--success));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transform: scale(1.6);
}

.heading-secondary {
  font-size: 20px;
  font-weight: 600;
  margin-top: 20px;
  letter-spacing: 1px;
  
    white-space: nowrap;   
  overflow: hidden;     
  text-overflow: ellipsis; 
}

.heading-tertiary {
  font-size: 20px;
  font-weight: 500;
  color: hsl(221, 100%, 96%);
}

.paragraph {
  font-size: 17px;
  line-height: 1.4;
  color: var(--grey-light);
}

.paragraph-text-box {
  width: 100%;
}

.text-center {
  text-align: center;
}

.margin-1 {
  margin-bottom: 10px;
}

.results-summary-container__result {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 5px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;


  .result-box {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background-image: linear-gradient(-45deg, var(--success), var(--success-shadow));
    background-image: var(--card-color);
    background-color: var(--card-color);
    border: 0.1px solid var(--success);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
   }

    .result {
    margin-top: -8px;
    font-size: 16px;
    font-weight: 400;
    color: var(--font-color);
    }
    .time {
    margin-top: 5px;
    font-size: 16px;
    font-weight: 400;
    color: var(--grey-light);
    }
}

.btn {
  width: 240px;
  padding: 10px;
  color: #ffffff;
  background-image: linear-gradient(to right, #aa076b, #61045f);
  border: none;
  border-radius: 100px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 500;
  cursor: pointer;
  margin: 20px 0 2px 0;
  transition: all 0.3s;
}

.btn:hover {
  transform: translateY(5px);
  background-image: linear-gradient(to left, #aa076b, #61045f);
}

@keyframes gradient {
  0% {
    background-position: 0% 95%;
    background-image: linear-gradient(45deg, var(--card-color),var(--card-color));
  }

  50% {
        background-position: 0% 95%;
    background-image: linear-gradient(to bottom, var(--card-color),var(--card-color));
  }

  100% {
    background-position: 0% 95%;
    background-image: linear-gradient(to bottom, var(--card-color),var(--card-color),var(--card-color));
  }
}

.confetti {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 300px;
  height: 60%;
  overflow: hidden;
  z-index: 1000;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 20px;
  background-color: hsl(39, 100%, 56%);
  top: 0;
  opacity: 0;
  animation: makeItRain 3000ms infinite linear;
}

.confetti-piece:nth-child(1) {
  left: 7%;
  transform: rotate(-10deg);
  animation-delay: 182ms;
  animation-duration: 2000ms;
}

.confetti-piece:nth-child(2) {
  left: 14%;
  transform: rotate(20deg);
  animation-delay: 161ms;
  animation-duration: 2076ms;
}

.confetti-piece:nth-child(3) {
  left: 21%;
  transform: rotate(-51deg);
  animation-delay: 481ms;
  animation-duration: 2103ms;
}

.confetti-piece:nth-child(4) {
  left: 28%;
  transform: rotate(61deg);
  animation-delay: 334ms;
  animation-duration: 1008ms;
}

.confetti-piece:nth-child(5) {
  left: 35%;
  transform: rotate(-52deg);
  animation-delay: 302ms;
  animation-duration: 1776ms;
}

.confetti-piece:nth-child(6) {
  left: 42%;
  transform: rotate(38deg);
  animation-delay: 180ms;
  animation-duration: 1168ms;
}

.confetti-piece:nth-child(7) {
  left: 49%;
  transform: rotate(11deg);
  animation-delay: 395ms;
  animation-duration: 1200ms;
}

.confetti-piece:nth-child(8) {
  left: 56%;
  transform: rotate(49deg);
  animation-delay: 14ms;
  animation-duration: 1887ms;
}

.confetti-piece:nth-child(9) {
  left: 63%;
  transform: rotate(-72deg);
  animation-delay: 149ms;
  animation-duration: 1805ms;
}

.confetti-piece:nth-child(10) {
  left: 70%;
  transform: rotate(10deg);
  animation-delay: 351ms;
  animation-duration: 2059ms;
}

.confetti-piece:nth-child(11) {
  left: 77%;
  transform: rotate(4deg);
  animation-delay: 307ms;
  animation-duration: 1132ms;
}

.confetti-piece:nth-child(12) {
  left: 84%;
  transform: rotate(42deg);
  animation-delay: 464ms;
  animation-duration: 1776ms;
}

.confetti-piece:nth-child(13) {
  left: 91%;
  transform: rotate(-72deg);
  animation-delay: 429ms;
  animation-duration: 1818ms;
}

.confetti-piece:nth-child(14) {
  left: 94%;
  transform: rotate(-72deg);
  animation-delay: 429ms;
  animation-duration: 818ms;
}

.confetti-piece:nth-child(15) {
  left: 96%;
  transform: rotate(-72deg);
  animation-delay: 429ms;
  animation-duration: 2818ms;
}

.confetti-piece:nth-child(16) {
  left: 98%;
  transform: rotate(-72deg);
  animation-delay: 429ms;
  animation-duration: 2818ms;
}

.confetti-piece:nth-child(17) {
  left: 50%;
  transform: rotate(-72deg);
  animation-delay: 429ms;
  animation-duration: 2818ms;
}

.confetti-piece:nth-child(18) {
  left: 60%;
  transform: rotate(-72deg);
  animation-delay: 429ms;
  animation-duration: 1818ms;
}

.confetti-piece:nth-child(odd) {
  background-color: hsl(0, 100%, 67%);
}

.confetti-piece:nth-child(even) {
  z-index: 1;
}

.confetti-piece:nth-child(4n) {
  width: 6px;
  height: 14px;
  animation-duration: 4000ms;
  background-color: #c33764;
}

.confetti-piece:nth-child(5n) {
  width: 3px;
  height: 10px;
  animation-duration: 4000ms;
  background-color: #b06ab3;
}

.confetti-piece:nth-child(3n) {
  width: 4px;
  height: 12px;
  animation-duration: 2500ms;
  animation-delay: 3000ms;
  background-color: #dd2476;
}

.confetti-piece:nth-child(3n-7) {
  background-color: hsl(166, 100%, 37%);
}

@keyframes makeItRain {
  from {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  to {
    transform: translateY(250px);
  }
}

    `}</style>
    </>)
}
const CardHeader = () => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const { chapter } = useChapter();
    const { lesson } = useLesson();
    return (<Stack sx={{ background: '', width: '100%', color: 'var(--font-color)' }}>
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
                    <Typography variant="h4" component="h1" sx={{ color: "var(--font-color)", fontWeight: 700, my: 0.5 }}>
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
const CardGoals = () => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const { chapter } = useChapter();
    return (<Stack sx={{ py: 2, px: 1.5, background: 'var(--card-color)', borderRadius: '10px', width: '100%', color: 'var(--font-color)' }}>
        <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ mb: 1 }}>
            <IconObjective height={18} width={18} color="var(--primary)" />
            <Typography variant="h4" sx={{ fontWeight: '500' }}>{t('goals')}</Typography>
        </Stack>
        <Typography variant="caption" sx={{ mb: 0.5 }}>{t('goals-subtitle')}</Typography>
        <List dense disablePadding>
            {
                chapter?.translate?.goals?.map((goal, i) => {
                    return (<ListItem key={`${goal}`} disableGutters sx={{ px: 1 }}>
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
const CardSubChapters = ({
    index = -1,
    setIndex = null,
    //subchapters = [] 
}) => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
    const { chapter, chapters, subchapters, lastStat, setUidChapter, subchapter, setSubchapter, stats } = useChapter();

    // const { subchapters } = useChapter();
    return (<Stack sx={{ py: 2, px: 1.5, background: 'var(--card-color)', borderRadius: '10px', width: '100%', color: 'var(--font-color)' }}>
        <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ mb: 1 }}>
            <IconBookOpen height={18} width={18} color="var(--primary)" />
            <Typography variant="h4" sx={{ fontWeight: '500' }}>{t('subchapters')}</Typography>
        </Stack>
        <Typography variant="caption" sx={{ mb: 0.5 }}>{t('subchapters-subtitle')} {chapter?.translate?.subchapters_title}</Typography>
        <List dense disablePadding>
            {
                subchapters?.sort((a, b) => a.uid_intern - b.uid_intern).map((sub, i) => {
                    return (<ListItem key={`${sub.uid_intern}`} disableGutters sx={{ px: 1 }}>
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
                    onClick={() => setIndex(subchapters.length)}
                    sx={{
                        color: index === subchapters.length ? 'var(--primary)' : '',
                        ":hover": {
                            color: 'var(--primary)',
                            cursor: index === subchapters.length ? 'text' : 'pointer',
                        }
                    }}>
                    <Typography sx={{ fontSize: '0.85rem' }} >{`${subchapters.length + 1}. `}{t('quiz')}</Typography>
                </Stack>
            </ListItem>
        </List>
    </Stack>)
}
const CardSubChaptersContent = ({
    index = -1,
    setIndex = null,
    //chapter = null,
    //subchapters = [],
    //subchapter = null,
    //setSubchapter = null,
}) => {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
    const { chapter, chapters, subchapters, lastStat, setUidChapter, subchapter, setSubchapter, stats } = useChapter();

    //const { chapter, subchapters, subchapter, setSubchapter } = useChapter();
    //const [subchapter, setSubchapter] = useState(null);
    useEffect(() => {
        if (index >= 0 && subchapters.length > 0) {
            setSubchapter(subchapters[index]);
        } else {
            setSubchapter(null);
        }
    }, [index, subchapters]);
    const goBack = () => {
        setIndex(prev => prev - 1);
    }
    const goNext = () => {
        setIndex(prev => prev + 1);
    }

    return (<Stack sx={{ background: '', width: '100%', color: 'var(--font-color)' }}>
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
                        <Typography>{`${subchapter?.uid_intern}. `}{subchapter?.translate?.title}</Typography>
                        <IconButton
                            onClick={() => setIndex(prev => prev + 1)}
                            disabled={index === subchapters.length - 1}
                            sx={{ color: index === subchapters.length - 1 ? 'var(--grey-light)' : 'var(--primary)' }}>
                            <IconArrowRight />
                        </IconButton>
                    </Stack>
                    <Grid container spacing={1}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack alignItems={'start'} spacing={1.5} sx={{ py: 2, px: 1.5, border: '0.1px solid var(--card-border)', borderRadius: '10px', width: '100%' }}>
                                {
                                    subchapter?.translate?.goals?.map?.((goal, i) => {
                                        return (<Typography sx={{ fontWeight: 600 }} key={`${goal}`}>{goal}</Typography>)
                                    })
                                }
                                <Stack alignItems={'start'} spacing={1}>
                                    <Chip sx={{ border: '0.1px solid var(--primary)' }} label={t('keys')} size="small" variant="outlined" />
                                    <Stack spacing={0.5} sx={{ px: 1.5 }}>
                                        {
                                            subchapter?.translate?.keys?.map?.((key, i) => {
                                                return (<Typography key={`${key}`} sx={{ fontSize: '0.85rem' }} >{`- `}{key}</Typography>)
                                            })
                                        }
                                    </Stack>
                                </Stack>
                                <Stack alignItems={'start'} spacing={1}>
                                    <Chip sx={{ border: '0.1px solid var(--primary)' }} label={t('exercises')} size="small" variant="outlined" />
                                    <Stack spacing={0.5} sx={{ px: 1.5 }}>
                                        {
                                            subchapter?.translate?.exercises?.map?.((exercise, i) => {
                                                return (<Typography key={`${exercise}`} sx={{ fontSize: '0.85rem' }} >{`- `}{exercise}</Typography>)
                                            })
                                        }
                                    </Stack>
                                </Stack>

                                <Stack direction={'row'} sx={{ pt: 3 }} spacing={0.5} alignItems={'center'}>
                                    {
                                        index > 0 && <ButtonCancel onClick={goBack} disabled={index === 0} label={t('previous', { ns: NS_BUTTONS })} />
                                    }
                                    {
                                        index < subchapters.length - 1 && <ButtonConfirm onClick={goNext} disabled={index === subchapters.length - 1} label={t('next', { ns: NS_BUTTONS })} />
                                    }
                                    {
                                        index === subchapters.length - 1 && <ButtonConfirm onClick={goNext} disabled={index < subchapters.length - 1} label={t('quiz-btn')} />
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
                                    subchapter?.translate?.photo_url && <Image
                                        src={subchapter?.translate?.photo_url || ""}
                                        alt={subchapter?.translate.title}
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

const NewQuizComponent = () => {
    const { t } = useTranslation([ClassLessonChapterQuiz.NS_COLLECTION, NS_BUTTONS]);
    const { lesson } = useLesson();
    const { chapter, chapters, subchapters, lastStat, setUidChapter, subchapter, setSubchapter } = useChapter();
    //const { stats } = useStat();
    const { stats, setUidStat, getMostRecentStat, getBestStat, isLoading: isLoadingStats } = useStat();
    const [mostResentStat, setMostResentStat] = useState(null);
    const [bestStat, setBestStat] = useState(null);

    //const { stats, setUidStat } = useStat();
    const { user } = useAuth();
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [stat, setStat] = useState(null);
    const [duration, setDuration] = useState(0);
    const [finished, setFinished] = useState(false);
    useEffect(() => {
        async function init() {
            const _most_recent_stat = getMostRecentStat(chapter.uid_lesson, chapter.uid);
            const _best_stat = getBestStat(chapter.uid_lesson, chapter.uid);
            //setHasStat(stats.length > 0);
            setMostResentStat(_most_recent_stat);
            setBestStat(_best_stat);
            console.log("most recent", stats, _most_recent_stat, _best_stat)
        }
        if (user && lesson && chapter && !isLoadingStats) {
            init();
        }
    }, [lesson, chapter, user, isLoadingStats]);
    useEffect(() => {
        if (user && chapter && chapter?.quiz?.questions?.length > 0) {
            const _questions = chapter.quiz.questions;
            const _answers = _questions.map(q => ({
                uid_question: q.uid_intern,
                uid_answer: q.translate?.answer?.uid_intern,
                uid_proposal: '',
            }));
            setQuestions(_questions);
            setStat(new ClassUserStat({
                //uid_user: user.uid,
                //uid_lesson: chapter?.uid_lesson,
                //uid_chapter: chapter?.uid,
                start_date: new Date(),
                answers: _answers,
            }))
            //const arr = Array(chapter.quiz.questions.length).fill({});
            setAnswers(_answers);
        } else {
            setQuestions([]);
            setAnswers([]);
        }
    }, [user, chapter]);
    useEffect(() => {
        if (index < 0) return;
        if (finished) return;

        const time = 1000;
        const intervalId = setInterval(() => {
            setDuration(prev => {
                const _duration = prev + 1;
                setStat(prev => {
                    if (!prev || prev === null) return new ClassUserStat({
                        start_date: new Date(),
                    });
                    prev.update({ duration: _duration });
                    return prev.clone();
                })
                return _duration;
            });

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
    const goBack = () => {
        setIndex(prev => prev - 1);
    }
    const goNext = () => {
        setIndex(prev => prev + 1);
    }
    const submitQuiz = async () => {
        var _score = answers.filter(item => item.uid_proposal === item.uid_answer).length || 0;
        //const _user_stat_object = new ClassUserStat(stat.toJSON());
        stat.update({
            end_date: new Date(),
            answers: answers,
            uid_user: user.uid,
            user: user,
            uid_lesson: chapter?.uid_lesson,
            lesson: lesson,
            uid_chapter: chapter?.uid,
            chapter: chapter,
            next_trying_date: _score === answers.length ? new Date() : null,
            score: _score,
        });
        console.log("STAT", "SCORE", _score, questions.length, answers);

        const user_stat = await stat.createFirestore();
        setStat(user_stat.clone());
        /*
        setStats(prev => {
            prev.unshift(user_stat);
            return prev;
        });
        */
        //const _stat = await _user_stat_object.getStat();
        //setScore(_score);
        //setNextDate(addDaysToDate(new Date(), 30));
        setFinished(true);
    }
    return (<Grid size={{ xs: 12, sm: 10 }}>
        <Typography>{`${t('quiz-duration')} : ${formatChrono(duration)}`}</Typography>
        <Stack alignItems={'start'} spacing={1.5} sx={{ py: 2, px: 1.5, border: '0.1px solid var(--card-border)', borderRadius: '10px', width: '100%' }}>
            {
                !finished && <>
                    {
                        <Typography sx={{ fontWeight: 500 }}>{question?.uid_intern}. {question?.translate?.question}</Typography>
                    }
                    {
                        proposals?.map?.((proposal, i) => {
                            //console.log("PROP", proposal)
                            return (<CheckboxComponent
                                checked={answers[index].uid_proposal === proposal.uid_intern}
                                onChange={(e) => {
                                    const _answers = [...answers];
                                    _answers[index] = { ..._answers[index], uid_proposal: proposal.uid_intern };
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
                                disabled={index === questions?.length - 1 || !answers[index].uid_proposal}
                                label={t('next', { ns: NS_BUTTONS })} />
                        }
                        {
                            index === questions?.length - 1 && <ButtonConfirm
                                onClick={submitQuiz}
                                disabled={index < questions?.length - 1 || !answers[questions?.length - 1].uid_proposal}
                                label={t('save', { ns: NS_BUTTONS })} />
                        }
                    </Stack>
                </>
            }
            {
                finished && <>
                    {
                        stat?.score < stat?.answers?.length && <AlertComponent
                            severity="success"
                            title={<Trans
                                t={t}
                                i18nKey={'finished.title'}
                                components={{
                                    b: <strong />,
                                    //br: <br />,
                                }}
                            />}
                            subtitle={<Stack spacing={0.5} sx={{ py: 1 }}>
                                <Typography sx={{ color: 'inherit', fontWeight: 500 }} variant="caption">
                                    <Trans
                                        t={t}
                                        i18nKey={'finished.score'}
                                        values={{
                                            score: `${stat?.score}/${stat?.answers?.length}`,
                                            //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                            //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                            //duration: formatChrono(duration),
                                        }}
                                        components={{
                                            caption: <Typography variant="caption" sx={{ color: 'inherit' }} />,
                                            //br: <br />,
                                        }}
                                    />
                                </Typography>
                                <Typography sx={{ color: 'inherit', fontWeight: 500 }} variant="caption">
                                    <Trans
                                        t={t}
                                        i18nKey={'finished.percentage'}
                                        values={{
                                            //score: `${stat?.score}/${stat?.answers?.length}`,
                                            //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                            percentage: stat ? (stat?.score / stat?.answers?.length * 100).toFixed(2) : 0,
                                            //duration: formatChrono(duration),
                                        }}
                                        components={{
                                            caption: <Typography variant="caption" sx={{ color: 'inherit' }} />,                                    //br: <br />,
                                        }}
                                    />
                                </Typography>
                                <Typography sx={{ color: 'inherit', fontWeight: 500 }} variant="caption">
                                    <Trans
                                        t={t}
                                        i18nKey={'finished.time'}
                                        values={{
                                            //score: `${stat?.score}/${stat?.answers?.length}`,
                                            //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                            //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                            duration: formatChrono(stat?.duration),
                                        }}
                                        components={{
                                            caption: <Typography variant="caption" sx={{ color: 'inherit' }} />,
                                            //br: <br />,
                                        }}
                                    />
                                </Typography>
                                <br />
                                <Typography sx={{ color: 'inherit' }} variant="caption">
                                    <Trans
                                        t={t}
                                        i18nKey={stat?.score === stats?.answers?.length ? 'finished.max-score' : 'finished.next-trying-date'}
                                        values={{
                                            //score: `${stat?.score}/${stat?.answers?.length}`,
                                            nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date) || new Date(),
                                            //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                            //duration: formatChrono(duration),
                                        }}
                                        components={{
                                            caption: <Typography variant="caption" sx={{ color: 'inherit' }} />,
                                            b: <strong />,
                                        }}
                                    />
                                </Typography>
                            </Stack>
                            }
                        />
                    }
                    {
                        stat?.score === stat?.answers?.length && <CongratulationsComponent stat={stat} />
                    }
                </>
            }
        </Stack>
    </Grid>)
}
const CardQuizz = ({
    indexSub = -1,
    setIndexSub = null,
    //quiz = null, 
    //subChapters: subchapters = [], 
    //lesson = null,
    //chapter = null 
    //chapter = null,
    //subchapters = [],
    //subchapter, setSubchapter
}) => {
    const { t } = useTranslation([ClassLessonChapterQuiz.NS_COLLECTION, NS_DAYS]);
    const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
    const { chapter, chapters, subchapters, lastStat, setUidChapter, subchapter, setSubchapter } = useChapter();
    const { stats, setUidStat, getMostRecentStat, getBestStat, isLoading: isLoadingStats } = useStat();
    //const { lesson, } = useLesson();
    //const { stats, chapters, lastStat, setUidChapter, subchapter, setSubchapter } = useChapter();
    const [hasStat, setHasStat] = useState(false);
    const [mostResentStat, setMostResentStat] = useState(null);
    const [bestStat, setBestStat] = useState(null);
    const [index, setIndex] = useState(-1);
    const { user } = useAuth();
    //const [subChapter, setSubChapter] = useState(null);
    const [question, setQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [duration, setDuration] = useState(0);
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [nextDate, setNextDate] = useState(null);
    const [stat, setStat] = useState(null);
    const [showComponent, setShowComponent] = useState(false);
    const [canStartQuiz, setCanStartQuiz] = useState(false);
    //const [stats, setStats] = useState([]);
    //const [isLoadingStats, setIsLoadingStats] = useState(true);
    useEffect(() => {
        async function init() {
            const _user_stat_object = new ClassUserStat({
                uid_user: user.uid,
                uid_lesson: lesson.uid,
                uid_chapter: chapter.uid,
            });
            const _stat = await _user_stat_object.getStat();
            const _most_recent_stat = getMostRecentStat(chapter.uid_lesson, chapter.uid);
            const _best_stat = getBestStat(chapter.uid_lesson, chapter.uid);
            setHasStat(stats.length > 0);
            setMostResentStat(_most_recent_stat);
            setBestStat(_best_stat);
            if (!_most_recent_stat) {
                setCanStartQuiz(true);
            } else if (_most_recent_stat) {

                if (_most_recent_stat.next_trying_date?.getTime() <= new Date().getTime()) {
                    setCanStartQuiz(true);
                } else {
                    setCanStartQuiz(false);
                }
            } else if (_best_stat && _best_stat.score < _best_stat.answers?.length) {
                setCanStartQuiz(true);
            }
            //console.log("most recent", stats, _most_recent_stat, _best_stat);
            setShowComponent(true);
        }
        if (user && lesson && chapter && !isLoadingStats) {
            init();

        }
    }, [lesson, chapter, user, isLoadingStats])
    useEffect(() => {
        if (chapter?.quiz?.questions?.length > 0) {
            const _questions = chapter.quiz.questions;
            setQuestions(_questions);
            const arr = Array(chapter.quiz.questions.length).fill({});

            setAnswers(_questions.map(q => ({
                uid_question: q.uid_intern,
                uid_answer: q.translate?.answer?.uid_intern,
                uid_proposal: '',
            })));
        } else {
            setQuestions([]);
            setAnswers([]);
        }
    }, [chapter]);
    useEffect(() => {
        if (indexSub < subchapters.length - 1) {
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
    const startQuiz = () => {
        setIndex(0);
        const _user_stat_object = new ClassUserStat({
            uid_user: user?.uid,
            uid_lesson: lesson?.uid,
            uid_chapter: chapter?.uid,
            start_date: new Date(),
            questions_length: questions?.length || 0
            //next_trying_date:addDaysToDate(new Date(), 30),
        });
        setStat(prev => {
            if (!prev || prev === null) return _user_stat_object;
            prev.update(_user_stat_object.toJSON());
            return prev;
        });
    }


    return (<Stack alignItems={'start'} spacing={1.5} sx={{ background: '', width: '100%' }}>
        <Grid container spacing={1.5} sx={{ width: '100%' }}>
            <Grid size={{ xs: 12, sm: 8 }}>

                <Stack spacing={1} sx={{ py: 2, px: 1.5, background: 'var(--card-color)', borderRadius: '10px', width: '100%' }}>
                    {
                        !showComponent && <CircularProgress size={'16px'} sx={{ fontSize: '16px' }} />
                    }
                    {
                        showComponent && <Stack spacing={1}>
                            <Stack maxWidth={'sm'} spacing={0.5}>
                                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                    <IconQuizz color={'var(--primary)'} />
                                    <Typography sx={{ color: 'var(--font-color)' }}>{t('title')}</Typography>
                                </Stack>
                                {
                                    index < 0 && <Stack spacing={0.5}>
                                        {
                                            !mostResentStat && <>
                                                {
                                                    //(!mostResentStat || mostResentStat===null) && 
                                                    //(bestStat && bestStat.score < bestStat.answers?.length) &&
                                                    //stats?.[0]?.score < stats?.[0]?.answers?.length && stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() && 
                                                    <Typography variant="caption" sx={{ color: 'red', fontWeight: 300 }}>{t('subtitle')}</Typography>
                                                }
                                                {
                                                    <AlertComponent
                                                        severity="warning"
                                                        subtitle={<Typography>
                                                            <Trans
                                                                t={t}
                                                                i18nKey={'warning'}
                                                                values={{
                                                                    quiz_delay_days: chapter?.quiz_delay_days
                                                                }}
                                                                components={{
                                                                    b: <strong />
                                                                }}
                                                            />
                                                        </Typography>}
                                                    />
                                                }
                                            </>
                                        }
                                        {
                                            mostResentStat && bestStat && bestStat.score < bestStat.answers?.length && <>
                                                {
                                                    mostResentStat.next_trying_date.getTime() <= new Date().getTime() &&
                                                    //(bestStat && bestStat.score < bestStat.answers?.length) &&
                                                    //stats?.[0]?.score < stats?.[0]?.answers?.length && stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() && 
                                                    <AlertComponent
                                                        severity={'info'}
                                                        subtitle={<Typography>
                                                            <Trans
                                                                t={t}
                                                                i18nKey={'finished.next-trying-date'}
                                                                values={{
                                                                    nextDate: t('now', { ns: NS_DAYS })
                                                                }}
                                                                components={{
                                                                    b: <strong />
                                                                }}
                                                            />
                                                        </Typography>}
                                                    />
                                                }
                                                {
                                                    mostResentStat.next_trying_date.getTime() > new Date().getTime() &&
                                                    //(bestStat && bestStat.score < bestStat.answers?.length) &&
                                                    //stats?.[0]?.score < stats?.[0]?.answers?.length && stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() && 
                                                    <AlertComponent
                                                        severity={"error"}
                                                        subtitle={<Typography>
                                                            <Trans
                                                                t={t}
                                                                i18nKey={'finished.next-trying-date'}
                                                                values={{
                                                                    nextDate: getFormattedDateCompleteNumeric(stats?.[0]?.next_trying_date)
                                                                }}
                                                                components={{
                                                                    b: <strong />
                                                                }}
                                                            />
                                                        </Typography>}
                                                    />
                                                }
                                            </>
                                        }
                                    </Stack>

                                }

                            </Stack>
                            {
                                index < 0 && <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                                    {
                                        //index < 0 &&
                                        (!mostResentStat || (bestStat && bestStat.score < bestStat.answers?.length)) &&
                                        //stats?.[0]?.score < stats?.[0]?.answers?.length && stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() && 
                                        <ButtonCancel label={t('btn-back')} onClick={goBackSub} />
                                    }
                                    {
                                        // index < 0 &&
                                        canStartQuiz &&
                                        //stats?.[0]?.score < stats?.[0]?.answers?.length && stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() && 
                                        <ButtonConfirm label={t('btn-start')} onClick={startQuiz} />
                                    }
                                    {
                                         // index < 0 &&
                                        //canStartQuiz &&
                                        (mostResentStat && (bestStat && bestStat.score < bestStat.answers?.length)) &&
                                        <Link href={`${PAGE_STATS}/${mostResentStat?.uid}`}>
                                            <ButtonConfirm label={t('btn-see-answers')} />
                                        </Link>
                                    }
                                </Stack>
                            }
                            <Grid container spacing={{ xs: 0.5, sm: 1 }} alignItems={'start'} sx={{ background: '', width: '100%', maxWidth: '100vw', }}>
                                {
                                    index > 0 &&
                                    <NewQuizComponent />
                                }
                            </Grid>
                            {
                                bestStat && bestStat.score === bestStat.answers?.length && <CongratulationsComponent stat={bestStat} setIndexSub={setIndexSub} />
                            }
                        </Stack>
                    }
                </Stack>
            </Grid>
            {
                lesson?.photo_url && <Grid size={{ xs: 12, sm: 'grow' }}>
                    <Stack
                        sx={{
                            position: "relative",
                            width: "100%",
                            //height: 220,
                            //borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid",
                            border: "0.1px solid transparent",
                        }}
                    >
                        {
                            <Image
                                src={lesson?.photo_url}
                                alt="Interface Excel - grille et ruban"
                                //fill
                                priority
                                height={100}
                                width={200}
                                style={{ objectFit: "cover", width: '100%', height: 'auto', borderRadius: '10px' }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        }
                    </Stack>
                </Grid>
            }
        </Grid>
    </Stack>)
}

export default function ExcelBeginnerCoursePage() {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    //const { lang } = useLanguage();
    const { uid: uidLess, chapter: uidChapter } = useParams();
    //const { user } = useAuth();
    const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
    const { chapter, chapters, subchapters, lastStat, setUidChapter, subchapter, setSubchapter, isLoading: isLoadingChapters } = useChapter();
    //const [chapter, setChapter] = useState();
    //const [subchapters, setSubChapters] = useState([]);
    //const [subchapter, setSubchapter] = useState(null);
    const { stats, setUidStat, getMostRecentStat, getBestStat, isLoading: isLoadingStats } = useStat();
    const [showComponent, setShowComponent] = useState(false);
    //const hasPreviousStats = i === 0 ? true : i > 0 && stats?.filter(s => s.uid_chapter === chapters[i - 1].uid)?.length > 0;
    const [hasPreviousStats, setHasPreviousStats] = useState(false);
    const [previousChapter, setPreviousChapter] = useState(null);
    const [process, setProcess] = useState(false);
    const [indexSub, setIndexSub] = useState(0);
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
            console.log("RESUULT", quiz)
        } catch (error) {
            console.log("ERRROR", error);
        } finally {
            setProcess(false);
        }
    }
    useEffect(() => {
        //console.log("CHapters", subchapters);
        if (chapter && indexSub >= 0 && indexSub < subchapters.length) {
            setSubchapter(chapter.subchapters?.[indexSub] || null);
        }
    }, [indexSub]);

    useEffect(() => {
        //console.log("laaaaast stat", uidLess);
        setUidLesson(uidLess);
        //console.log("LESSSSSSON", lesson)
        setUidChapter(uidChapter);
    }, [uidLess, uidChapter]);
    useEffect(() => {
        if (chapter && !isLoadingChapters && !isLoadingStats) {
            // console.log("new chapter", chapter);
            if (chapter?.uid_intern === 1) {
                setHasPreviousStats(true);
                setPreviousChapter(chapter);
                //  console.log("first so true");
            } else {
                const indexChapter = chapters.findIndex(c => c.uid_intern === chapter.uid_intern);
                const _previous = chapters[indexChapter - 1];
                setPreviousChapter(_previous);
                if (stats?.filter(s => s.uid_chapter === _previous.uid)?.length > 0) {
                    // console.log("completed previous");
                    setHasPreviousStats(true);
                } else {
                    //  console.log("NOT completed previous");
                    setHasPreviousStats(false);
                }
            }
        }
        setShowComponent(true);

        //const hasPreviousStats = i === 0 ? true : i > 0 && stats?.filter(s => s.uid_chapter === chapters[i - 1].uid)?.length > 0;

        //setUidLesson(uidLess);
        //console.log("LESSSSSSON", lesson)
        //setUidChapter(uidChapter);
    }, [chapter, isLoadingChapters, isLoadingStats]);
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
                    !showComponent && <Grid size={12}>
                        <CircularProgress size={'16px'} sx={{ fontSize: '20px' }} />
                    </Grid>
                }
                {
                    showComponent && previousChapter && !hasPreviousStats && <Grid size={{ xs: 12, sm: 8 }}>
                        <AlertComponent
                            severity="error"
                            title={t('title-tip')}
                            subtitle={t('tip')}
                            buttonConfirmComponent={<Link href={`${PAGE_LESSONS}/${lesson?.uid}/chapters/${previousChapter?.uid}`}>
                                <ButtonConfirm
                                    label={t('btn-previous-chapter')}
                                    style={{ background: 'var(--error)', color: 'var(--card-color)' }}
                                />
                            </Link>}
                        />
                    </Grid>
                }

                {
                    showComponent && previousChapter && hasPreviousStats && indexSub < subchapters.length && <>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CardGoals
                            //chapter={chapter} 
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CardSubChapters
                                index={indexSub}
                                setIndex={setIndexSub}
                            //subchapters={subchapters}
                            //lesson={lesson}
                            //chapter={chapter}
                            />
                        </Grid>
                        <Grid size={12}>
                            <CardSubChaptersContent
                                index={indexSub}
                                setIndex={setIndexSub}
                            //chapter={chapter}
                            //subchapters={subchapters}
                            //subchapter={subchapter}
                            //setSubchapter={setSubchapter}
                            //lesson={lesson}
                            />
                        </Grid>
                    </>
                }
                {
                    showComponent && previousChapter && hasPreviousStats &&
                    indexSub === subchapters.length &&
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <CardQuizz
                            indexSub={indexSub}
                            setIndexSub={setIndexSub}
                        />
                    </Grid>
                }
            </Grid>
            {/* HEADER / HERO */}
            <Box component={Paper} elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, display: 'none' }}>
                <ButtonConfirm
                    label="Translate"
                    loading={process}
                    onClick={onTranslate}
                />
            </Box>
        </Container>
    </DashboardPageWrapper>);
}
