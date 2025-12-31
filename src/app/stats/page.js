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
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { ClassLessonChapterQuestion, ClassLessonChapterQuestionTranslation, ClassLessonChapterQuiz } from "@/classes/lessons/ClassLessonChapterQuiz";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import { addDaysToDate, formatChrono, getFormattedDateComplete, getFormattedDateCompleteNumeric, mixArray } from "@/contexts/functions";
import AlertComponent from "@/components/elements/AlertComponent";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useAuth } from "@/contexts/AuthProvider";
import CircularProgressWithLabelComponent from "@/components/elements/CircularProgressWithLabelComponent";
import AccordionComponent from "@/components/dashboard/elements/AccordionComponent";
import StatsListComponent from "@/components/stats/StatsListComponent";
import { useStat } from "@/contexts/StatProvider";

const CongratulationsComponent = ({ stat = null }) => {
    const { t } = useTranslation([ClassLessonChapterQuiz.NS_COLLECTION]);
    // score: `${stat?.score}/${stat?.answers?.length}`,
    //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
    //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
    //duration: formatChrono(duration),
    return (<>
        <div className="results-summary-container">
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
            <div className="results-summary-container__result">
                <div className="result-box">
                    <div className="heading-primary">
                        {stat?.score}/{stat?.answers?.length}
                    </div>
                    <p className="result">
                        {`${parseInt(stat?.score / stat?.answers?.length * 100)}%`}
                    </p>
                </div>
                <div className="result-text-box">
                    <div className="heading-secondary">{t('finished.congrats')}</div>
                    <p className="paragraph">
                        {t('finished.max-score')}
                    </p>
                </div>
                <div className="summary__cta" style={{ marginTop: '10px' }}>
                    <ButtonConfirm label={`Voir mes réponses`} />

                </div>
            </div>
        </div>
        <style jsx>{`
.results-summary-container {
  font-family: "Hanken Grotesk", sans-serif;
  display: flex;
  width: 100%;
  max-width:100%;
  border-radius: 30px;
  box-shadow: 10px 20px 20px rgba(120, 87, 255, 0.3);
  box-shadow: none;
  backface-visibility: hidden;
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
  background-image: linear-gradient(to bottom, var(--winner-shadow), var(--card-color));
  animation: gradient 9s infinite alternate linear;

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
  color: var(--success-shadow);
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
const CardHeader = ({ lesson = null, chapter = null }) => {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
     const {stats} = useStat();
     useEffect(()=>{
        console.log("STATTTTS", stats)
     })
    return (<Stack sx={{ background: '', width: '100%' }}>
        <Grid container>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, my: 0.5 }}>
                        {`Résultats & progression`}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                        {`Statistiques par chapitre, par cours, et performance globale.`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, my: 1 }}>
                        <Trans
                            t={t}
                            i18nKey={`count-stats`}
                            values={{
                                countLesson: new Set(stats.map(stat=>stat.uid_lesson)).size,
                                countQuiz: stats.length
                            }}
                        />
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
    const { t } = useTranslation([ClassLessonChapterQuiz.NS_COLLECTION]);
    const [index, setIndex] = useState(-1);
    const { user } = useAuth();
    const [subChapter, setSubChapter] = useState(null);
    const [question, setQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [duration, setDuration] = useState(0);
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [nextDate, setNextDate] = useState(null);
    const [stat, setStat] = useState(null);
    const [stats, setStats] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    const [state, setState] = useState({
        isLoading: true,
        stats: [],
    });
    useEffect(() => {
        async function init() {

            const _user_stat_object = new ClassUserStat({
                uid_user: user.uid,
                uid_lesson: lesson.uid,
                uid_chapter: chapter.uid,
            });
            const _stat = await _user_stat_object.getStat();
            var _stats = await _user_stat_object.getStats();
            _stats = _stats.sort((a, b) => b.end_date.getTime() - a.end_date.getTime())
            console.log("statsss", _stats);
            setStats(_stats);
            setIsLoadingStats(false);
            setState(prev => ({ ...prev, isLoading: false, stats: _stats }))
            if (_stat) {
                const diff = _stat.end_date?.getTime() - _stat.start_date?.getTime();
                setDuration(diff / 1_000);
                setStat(_stat);
            } else {
                setDuration(0);
                setStat(null);
            }
        }
        if (user, lesson && chapter) {
            init();
        }
    }, [lesson, chapter, user])
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
    const submitQuiz = async () => {
        var _score = answers.filter(item => item.uid_proposal === item.uid_answer).length || 0;
        const _user_stat_object = new ClassUserStat(stat.toJSON());
        _user_stat_object.update({
            end_date: new Date(),
            answers: answers,
            next_trying_date: _score === answers.length ? new Date() : addDaysToDate(new Date(), 7),
            score: _score,
        });
        console.log("STAT", _user_stat_object, "SCORE", _score, questions.length, answers);

        const user_stat = await _user_stat_object.createFirestore();
        setStat(prev => {
            if (!prev || prev === null) return user_stat;
            prev.update(user_stat.toJSON());
            return prev;
        });
        setStats(prev => {
            prev.unshift(user_stat);
            return prev;
        })
        //const _stat = await _user_stat_object.getStat();
        setScore(_score);
        setNextDate(addDaysToDate(new Date(), 30));
        setFinished(true);
    }

    return (<Stack alignItems={'start'} spacing={1.5} sx={{ background: '', width: '100%' }}>
        <Grid container spacing={1.5} sx={{ width: '100%' }}>
            <Grid size={{ xs: 12, sm: 8 }}>
                <Stack spacing={1} sx={{ py: 2, px: 1.5, background: 'var(--card-color)', borderRadius: '10px', width: '100%' }}>
                    <Stack maxWidth={'sm'} spacing={0.5}>
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                            <IconQuizz color={'var(--primary)'} />
                            <Typography>{t('title')}</Typography>
                        </Stack>
                        {
                            index < 0 && <Typography variant="caption" sx={{ color: 'red', fontWeight: 300 }}>{t('subtitle')}</Typography>
                        }
                        {
                            index < 0 && <>
                                <AlertComponent
                                    severity="warning"
                                    subtitle={<Trans
                                        t={t}
                                        i18nKey={'warning'}
                                        components={{
                                            b: <strong />
                                        }}
                                    />
                                    }
                                />
                                {
                                    stats?.length > 0 && <AlertComponent
                                        severity={stats?.[0]?.next_trying_date?.getTime() > new Date().getTime() ? "info" : 'success'}
                                        subtitle={<Trans
                                            t={t}
                                            i18nKey={'finished.next-trying-date'}
                                            values={{
                                                nextDate: stats?.[0]?.next_trying_date?.getTime() > new Date().getTime() ? getFormattedDateCompleteNumeric(stats?.[0]?.next_trying_date) : t('now')
                                            }}
                                            components={{
                                                caption: <label />
                                            }}
                                        />
                                        }
                                    />
                                }
                            </>
                        }
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                        {
                            index < 0 && <ButtonCancel label={t('btn-back')} onClick={goBackSub} />
                        }
                        {
                            index < 0 && stats?.[0]?.score < stats?.[0]?.answers?.length && stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() && <ButtonConfirm label={t('btn-start')} onClick={startQuiz} />
                        }
                    </Stack>
                    <Grid container spacing={{ xs: 0.5, sm: 1 }} alignItems={'start'} sx={{ background: '', width: '100%', maxWidth: '100vw', }}>
                        {
                            index >= 0 && <Grid size={{ xs: 12, sm: 10 }}>
                                <Stack alignItems={'start'} spacing={1.5} sx={{ py: 2, px: 1.5, border: '0.1px solid var(--card-border)', borderRadius: '10px', width: '100%' }}>
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
                            </Grid>
                        }
                        {
                            stats.length > 0 && <Grid size={{ xs: 12, sm: 8 }}>
                                <Grid container spacing={{ xs: 0.5, sm: 1 }}>
                                    <Stack spacing={1} sx={{ py: 1 }}>
                                        <Typography>{`Résultats (${stats?.length})`}</Typography>
                                        {
                                            stats.map((stat, i) => {
                                                return (<Grid key={`${stat.uid_user}-${stat.uid}`} size={{ xs: 12, sm: 12 }}>
                                                    <AccordionComponent title={<Stack direction={'row'} spacing={0.5} >
                                                        <Typography sx={{ fontSize: '0.9rem' }}>{`Score`}</Typography>
                                                        <Typography sx={{ fontSize: '0.9rem', color: 'var(--grey-light)' }}>{`/`}</Typography>
                                                        <Typography sx={{ fontSize: '0.9rem', color: 'var(--grey-light)' }}>{getFormattedDateComplete(stat.end_date)}</Typography>
                                                    </Stack>}>
                                                        <Stack maxWidth={'xl'} sx={{ width: '100%', background: '' }}>
                                                            {
                                                                stat?.score < stat?.answers?.length && <>
                                                                    <Stack spacing={1} sx={{ background: '', px: 1.5, py: { xs: 1.5, sm: 1 } }} direction={{ xs: 'column-reverse', sm: 'row' }} alignItems={'center'}>
                                                                        <Stack sx={{ background: '', width: '100%', }}>
                                                                            <Typography>
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
                                                                                        //    div:<Stack direction={'row'} alignItems={'center'} spacing={1} />,
                                                                                        caption: <Typography variant="caption" />,
                                                                                    }}
                                                                                />
                                                                            </Typography>
                                                                            <Typography>
                                                                                <Trans
                                                                                    t={t}
                                                                                    i18nKey={'finished.percentage'}
                                                                                    values={{
                                                                                        //score: `${stat?.score}/${stat?.answers?.length}`,
                                                                                        //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                                                                        percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                                                                        //duration: formatChrono(duration),
                                                                                    }}
                                                                                    components={{
                                                                                        //    div:<Stack direction={'row'} alignItems={'center'} spacing={1} />,
                                                                                        caption: <Typography variant="caption" />,
                                                                                    }}
                                                                                />
                                                                            </Typography>
                                                                            <Typography>
                                                                                <Trans
                                                                                    t={t}
                                                                                    i18nKey={'finished.time'}
                                                                                    values={{
                                                                                        //score: `${stat?.score}/${stat?.answers?.length}`,
                                                                                        //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                                                                        //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                                                                        duration: formatChrono(duration),
                                                                                    }}
                                                                                    components={{
                                                                                        //    div:<Stack direction={'row'} alignItems={'center'} spacing={1} />,
                                                                                        caption: <Typography variant="caption" />,
                                                                                    }}
                                                                                />
                                                                            </Typography>
                                                                            <Trans
                                                                                t={t}
                                                                                i18nKey={'quiz-finished'}
                                                                                values={{
                                                                                    score: `${stat?.score}/${stat?.answers?.length}`,
                                                                                    nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                                                                    percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                                                                    duration: formatChrono(duration),
                                                                                }}
                                                                                components={{
                                                                                    b: <strong />,
                                                                                    br: <br />,
                                                                                }}
                                                                            />
                                                                        </Stack>
                                                                        <Stack alignItems={'center'} justifyContent={'center'} sx={{ p: 1, background: '', height: '100%' }} spacing={0.5}>
                                                                            <CircularProgressWithLabelComponent progress={stat?.score / stat?.answers?.length * 100} />
                                                                        </Stack>
                                                                    </Stack>
                                                                    {
                                                                        i === 0 && <Stack sx={{ width: '100%', background: '', py: 1, px: { xs: 0.5, sm: 1.5 } }}>
                                                                            <Chip
                                                                                sx={{
                                                                                    border: `0.1px solid ${stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() ? 'var(--success)' : 'var(--font-color)'}`,
                                                                                    background: 'var(--card-color)',
                                                                                    color: stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() ? 'var(--success)' : 'var(--font-color)'
                                                                                }}
                                                                                icon={<IconCertificate width={16}
                                                                                    height={16}
                                                                                    color={stats?.[0]?.next_trying_date?.getTime() <= new Date().getTime() ? 'var(--success)' : 'var(--primary)'} />}
                                                                                size={'small'}
                                                                                //label={`⏱ Temps : ${formatChrono(duration)}`} variant="outlined"
                                                                                label={<Trans
                                                                                    t={t}
                                                                                    i18nKey={'finished.next-trying-date'}
                                                                                    values={{
                                                                                        //score: `${stat?.score}/${stat?.answers?.length}`,
                                                                                        nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                                                                        //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                                                                        //duration: formatChrono(duration),
                                                                                    }}
                                                                                    components={{
                                                                                        caption: <label variant="caption" />,
                                                                                        //b: <strong />,
                                                                                        //br: <br />,
                                                                                    }}
                                                                                />}
                                                                            />
                                                                        </Stack>
                                                                    }
                                                                </>
                                                            }
                                                            {
                                                                stat?.score === stat?.answers?.length && <Stack alignItems={'center'}>
                                                                    <CongratulationsComponent stat={stat} />
                                                                </Stack>
                                                            }
                                                        </Stack>
                                                    </AccordionComponent>
                                                </Grid>)
                                            })
                                        }
                                    </Stack>
                                </Grid>
                            </Grid>
                        }


                    </Grid>
                    {
                        isLoadingStats && <CircularProgress />
                    }


                    <Typography>{`${t('quiz-duration')} : ${formatChrono(duration)}`}</Typography>
                    <AlertComponent
                        severity="success"
                        title={<Trans
                            t={t}
                            i18nKey={'finished.title'}

                            components={{
                                b: <strong />,
                                br: <br />,
                            }}
                        />}
                        subtitle={<Stack>
                            <Typography sx={{ color: 'inherit' }} variant="caption">
                                <Trans
                                    t={t}
                                    i18nKey={'finished.score'}
                                    values={{
                                        score: `${stat?.score}/${stat?.answers?.length}`,
                                        //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                        //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                        //duration: formatCh
                                        // rono(duration),
                                    }}
                                    components={{
                                        caption: <span />,
                                        //br: <br />,
                                    }}
                                />
                            </Typography>
                            <Typography sx={{ color: 'inherit' }} variant="caption">
                                <Trans
                                    t={t}
                                    i18nKey={'finished.percentage'}
                                    values={{
                                        //score: `${stat?.score}/${stat?.answers?.length}`,
                                        //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                        percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                        //duration: formatChrono(duration),
                                    }}
                                    components={{
                                        caption: <label />,
                                        //br: <br />,
                                    }}
                                />
                            </Typography>
                            <Typography sx={{ color: 'inherit' }} variant="caption">
                                <Trans
                                    t={t}
                                    i18nKey={'finished.time'}
                                    values={{
                                        //score: `${stat?.score}/${stat?.answers?.length}`,
                                        //nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                        //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                        duration: formatChrono(duration),
                                    }}
                                    components={{
                                        caption: <label />,
                                        //br: <br />,
                                    }}
                                />
                            </Typography>
                            <Typography sx={{ color: 'inherit' }} variant="caption">
                                <Trans
                                    t={t}
                                    i18nKey={stat?.score === stats?.answers?.length ? 'finished.max-score' : 'finished.next-trying-date'}
                                    values={{
                                        //score: `${stat?.score}/${stat?.answers?.length}`,
                                        nextDate: getFormattedDateCompleteNumeric(stat?.next_trying_date),
                                        //percentage: (stat?.score / stat?.answers?.length * 100).toFixed(2),
                                        //duration: formatChrono(duration),
                                    }}
                                    components={{
                                        caption: <label />,
                                        //br: <br />,
                                    }}
                                />
                            </Typography>
                        </Stack>
                        }
                    />

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
                                height={100}
                                width={200}
                                style={{ objectFit: "cover", width: '100%', height: 'auto' }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        }
                    </Stack>
                </Grid>
            }
        </Grid>
    </Stack>)
}

function QuizProgress({ correct = 3, total = 9, size = 160 }) {
    const safeTotal = Math.max(0, Number(total) || 0);
    const safeCorrect = Math.max(0, Math.min(Number(correct) || 0, safeTotal));
    const percent = safeTotal ? Math.round((safeCorrect / safeTotal) * 100) : 0;

    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress variant="determinate" value={percent} size={size} thickness={4} />
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                <Typography sx={{ fontSize: 28, fontWeight: 800 }}>
                    {percent}%
                </Typography>
                <Typography sx={{ fontSize: 12, opacity: 0.8 }}>
                    {safeCorrect} / {safeTotal}
                </Typography>
            </Box>
        </Box>
    );
}
export default function ExcelBeginnerCoursePage() {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION]);
    const { lang } = useLanguage();
    const { user } = useAuth();
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
            // const _user_stat_object = new ClassUserStat();
            // const _stat = await ClassUserStat
            const _chapter = await ClassLessonChapter.fetchFromFirestore(uidChapter, lang);
            const _lesson = getOneLesson(_chapter.uid_lesson);
            _chapter.lesson = _lesson;
            //const finalResult = new ClassLessonChapter({..._chapter.toJSON(), lesson:_lesson});
            //console.log("CHAPTER", _chapter.getTranslate('fr'));
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
            { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: PAGE_LESSONS },
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
                <Grid size={{ xs: 12, sm: 12 }}>
                    <StatsListComponent />
                </Grid>
            </Grid>
        </Container>
    </DashboardPageWrapper>);
}
