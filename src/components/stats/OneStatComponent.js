"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography,
    Grid,
    LinearProgress,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import { useRouter } from "next/navigation";
import { useStat } from "@/contexts/StatProvider";
import { PAGE_STATS } from "@/contexts/constants/constants_pages";
import SelectComponentDark from "../elements/SelectComponentDark";
import { useTranslation } from "react-i18next";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useChapter } from "@/contexts/ChapterProvider";
import { IconArrowBack, IconArrowRight, IconCalendar, IconCheckFilled, IconClose, IconCloseFilled, IconDuration, IconLevel, IconStats } from "@/assets/icons/IconsComponent";
import { capitalizeFirstLetter, cutString, formatChrono, getFormattedDateCompleteNumeric, getFormattedDateNumeric } from "@/contexts/functions";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { ClassLessonChapterQuiz } from "@/classes/lessons/ClassLessonChapterQuiz";
import CircularProgressStatComponent from "../elements/CircularProgressStatComponent";
/**
 * Page Détail d'un résultat (1 tentative / 1 quiz)
 * ✅ Résumé: score, %, durée, date
 * ✅ Répartition: bonnes / mauvaises (bar)
 * ✅ Liste questions: correct / incorrect + réponse donnée + bonne réponse + explication
 * ✅ Filtre: Toutes / Correctes / Incorrectes
 *
 * À brancher :
 * - Fetch attempt by uid_attempt (Firestore)
 * - attempt.questions[] avec:
 *   { question, choices?, user_answer, correct_answer, is_correct, explanation?, points? }
 */
export default function OneStatComponent() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { stats, isLoading: isLoadingStats, stat, getOneStatIndex, setUidStat } = useStat();
    const { chapters, setUidChapter, chapter } = useChapter();
    const router = useRouter();

    const statsFiltered = useMemo(() => {
        var _stats = [...stats].filter(s => s.uid_chapter === stat?.uid_chapter);
        console.log("????????", _stats)
        return _stats;
    }, [stats, stat]);


    // ---- MOCK (remplace par Firestore) ----
    const attempt = useMemo(
        () => ({
            uid: stat?.uid,
            course_title: "Excel Débutant",
            course_code: "EXCEL-101",
            chapter_title: "Formules (SOMME, MOYENNE)",
            date: getFormattedDateCompleteNumeric(stat?.end_date),
            duration_sec: stat?.duration,
            score: stat?.score || 0,
            total: stat?.answers?.length || 0,
            answers: stat?.answers || [],
            status: stat?.status,
            questions: chapter?.quiz?.questions || [],
        }),
        [stats, stat, chapter]
    );
    const [filter, setFilter] = useState("all"); // all | correct | wrong
    const percent = attempt ? parseInt(attempt?.score / attempt.answers.length * 100) : 0;
    const correctCount = attempt?.answers.filter((q) => q.uid_proposal === q.uid_answer).length || 0;
    const wrongCount = attempt?.answers.filter((q) => q.uid_proposal !== q.uid_answer).length || 0;
    const hasMaxStat = correctCount === attempt?.answers.length;
    //const wrongCount = attempt.questions.filter((q) => !q.is_correct).length;

    const questionsFiltered = useMemo(() => {
        var _questions = attempt.questions.map(q => {
            const _answer = attempt.answers.find(a => a.uid_question === q.uid_intern);
            const _proposal_text = q.translate?.proposals.find(p => p.uid_intern === _answer.uid_proposal);
            const _answer_text = q.translate?.proposals.find(p => p.uid_intern === _answer.uid_answer);
            q.answer = _answer;
            q.answer_text = _answer_text?.value;
            q.proposal_text = _proposal_text?.value;
            //q.answer = _answer;
            q.is_correct = _answer?.uid_answer === _answer?.uid_proposal;
            return q;
        });
        if (filter === "correct") return _questions.filter((q) => q.is_correct);
        if (filter === "wrong") return _questions.filter((q) => !q.is_correct);
        return _questions;
    }, [attempt.uid, attempt.questions, filter]);

    useEffect(() => {
        console.log("filtereeeeeeed", questionsFiltered)
    }, [stat])

    return (
        <Stack spacing={1}>
            <Box sx={{ bgcolor: "", minHeight: "100vh" }}>
                <Stack sx={{ background: '', }} spacing={2}>
                <Grid container spacing={1} sx={{ width: '100%' }}>
                            <Grid size={{ xs: 12, sm: 3.5 }}>
                                <Stack spacing={1}>
                                    {
                                        !hasMaxStat && <Paper
                                            elevation={0}
                                            sx={{
                                                borderRadius: 5,
                                                p: 2.2,
                                                py: 2,
                                                px: { xs: 1.5, sm: 2 },
                                                border: "0.1px solid var(--card-border)",
                                            }}
                                        >
                                            <Stack spacing={1.2}>
                                                <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                                                    {t('distribution')}
                                                </Typography>

                                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                                    <Chip
                                                        icon={<CheckCircleIcon />}
                                                        label={`${correctCount} ${t('result.trues')}`}
                                                        sx={chipGood}
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        icon={<CancelIcon />}
                                                        label={`${wrongCount} ${t('result.falses')}`}
                                                        sx={chipBad}
                                                        variant="outlined"
                                                    />
                                                </Stack>

                                                <Stack spacing={0.8}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {t('result.trues-answers')}
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={attempt.questions.length ? (correctCount / attempt.questions.length) * 100 : 0}
                                                        sx={{
                                                            height: 10,
                                                            borderRadius: 999,
                                                            bgcolor: "rgba(34,197,94,0.10)",
                                                            "& .MuiLinearProgress-bar": { bgcolor: "#22C55E", borderRadius: 999 },
                                                        }}
                                                    />

                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                                        {t('result.falses-answers')}
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={attempt.questions.length ? (wrongCount / attempt.questions.length) * 100 : 0}
                                                        sx={{
                                                            height: 10,
                                                            borderRadius: 999,
                                                            bgcolor: "rgba(239,68,68,0.10)",
                                                            "& .MuiLinearProgress-bar": { bgcolor: "#EF4444", borderRadius: 999 },
                                                        }}
                                                    />
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    }

                                    {
                                        hasMaxStat && <Stack sx={{ position: 'relative' }}>
                                            <CongratulationsComponent stat={stat} />
                                        </Stack>
                                    }
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 'grow' }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: 5,
                                        p: 2.2,
                                        py: 2,
                                        px: { xs: 1.5, sm: 2 },
                                        border: "0.1px solid var(--card-border)",
                                    }}
                                >
                                    <Stack spacing={1.2}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                            <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                                                {t('questions')}
                                            </Typography>

                                            <ToggleButtonGroup
                                                exclusive
                                                value={filter}
                                                onChange={(_, v) => v && setFilter(v)}
                                                size="small"
                                                sx={{
                                                    gap: 1,
                                                    backgroundColor: "var(--primary-shadow)",
                                                    padding: 0.5,
                                                    borderRadius: 4,

                                                    "& .MuiToggleButton-root": {
                                                        /* ÉTAT PAR DÉFAUT */
                                                        borderRadius: 10,
                                                        fontWeight: 600,
                                                        textTransform: "none",
                                                        border: "0.1px solid transparent",
                                                        color: "var(--primary)",
                                                        paddingX: 2,
                                                        transition: "all 0.2s ease",

                                                        "&:hover": {
                                                            backgroundColor: "var(--primary)",
                                                            color: "var(--card-color)",
                                                        },

                                                        "&.Mui-selected": {
                                                            backgroundColor: "var(--primary)",
                                                            color: "var(--card-color)",
                                                            border: "0.1px solid var(--primary)",
                                                            //fontWeight: 700,

                                                            "&:hover": {
                                                                backgroundColor: "var(--primary)",
                                                                color: "var(--card-color)",
                                                            },
                                                        },
                                                        "&.Mui-selected[value='correct']": {
                                                            //backgroundColor: "var(--success)",
                                                            //color: "var(--card-color)",
                                                            //border: "0.1px solid var(--success)",
                                                        },
                                                        "&.Mui-selected[value='wrong']": {
                                                            //backgroundColor: "var(--error)",
                                                            //color: "var(--card-color)",
                                                            //border: "0.1px solid var(--error)",
                                                        },
                                                    },
                                                }}
                                            >
                                                <ToggleButton value="all">{t("result.filter-all")}</ToggleButton>
                                                <ToggleButton value="correct">{t("result.filter-trues")}</ToggleButton>
                                                <ToggleButton value="wrong">{t("result.filter-falses")}</ToggleButton>
                                            </ToggleButtonGroup>

                                        </Stack>

                                        <Divider sx={{ borderColor: "var(--card-border)" }} />

                                        <Stack spacing={1}>
                                            {

                                                questionsFiltered?.map((q, index) => (
                                                    <QuestionCard key={q.uid_intern} stat={attempt} q={q} index={index} isCorrect={q.is_correct} />
                                                ))

                                            }
                                            {!questionsFiltered.length ? (
                                                <Typography variant="body2" color="text.secondary">
                                                    {t('result.filter-no-questions')}
                                                </Typography>
                                            ) : null}
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                </Stack>
            </Box>
        </Stack>
    );
}

/* -------------------- UI components -------------------- */
const CongratulationsComponent = ({ stat = null }) => {
    const { t } = useTranslation([ClassLessonChapterQuiz.NS_COLLECTION]);
    const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
    const colorStat = STATUS_CONFIG[stat?.status];
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
                <Stack justifyContent={'center'} alignItems={'center'} spacing={1}
                    sx={{
                        //py: 1,
                        //px: 1.5,
                        //border: '0.1px solid var(--card-border)',
                        //borderRadius: '10px',
                        width: '100%'
                    }}>
                    {
                        /*
                        worstStat && worstStat.score === worstStat.answers?.length ?
                            <EmojiEventsIcon sx={{ color: colorWorst?.color_icon, fontSize: '30px' }} /> :
                            <IconCharts height={30} width={30} color={colorWorst?.color_icon} />
                            */
                    }
                    <Typography variant="h4" sx={{ color: colorStat?.color, fontWeight: 500 }}>{t(stat?.status)?.toUpperCase()}</Typography>
                    <CircularProgressStatComponent
                        score={stat?.score}
                        questions={stat?.answers?.length}
                        percent={stat?.score / stat?.answers?.length * 100}
                        duration={stat?.duration}
                        size="large"
                        status={stat?.status}
                    />
                    <Chip size="small" label={getFormattedDateNumeric(stat?.end_date)} sx={{
                        fontWeight: 950,
                        bgcolor: colorStat?.background_bubble,
                        color: colorStat?.color,
                        border: `1px solid ${colorStat?.border}`,
                    }} />
                </Stack>
                <div className="result-text-box">
                    <div className="heading-secondary">{t('finished.congrats')}</div>
                    <p className="paragraph">
                        {t('finished.max-score')}
                    </p>
                </div>
            </div>
        </div>
        <style jsx>{`
.results-summary-container {
  font-family: "Hanken Grotesk", sans-serif;
  display: flex;
  width: 100%;
  max-width:100%;
  border-radius: 10px;
  border:0.1px solid var(--card-border);
  height: 100%;
}
@media (min-width: 600px) {
  .results-summary-container {
    width: 100%;
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
  border-radius:10px;
  padding: 20px;  
  animation: gradient 9s infinite alternate linear;
}

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
function MiniStat({ label, value, icon }) {
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: '10px',
                p: 1.6,
                bgcolor: "rgba(255,255,255,0.12)",
                bgcolor: "var(--primary-shadow)",
                border: "0.1px solid var(--primary-shadow-xs)",
                color: "white",
            }}
        >
            <Stack direction="row" spacing={1.1} alignItems="center">
                <Box
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 3,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "var(--primary-shadow-xs)",
                        coor: "var(--primary)",
                        border: "1px solid var(--primary-shadow-xs)",
                    }}
                >
                    {icon}
                </Box>
                <Stack spacing={0.1} sx={{ minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: "var(--primary-dark)", opacity: 0.9 }}>
                        {label}
                    </Typography>
                    <Typography variant="h6" sx={{ color: "var(--primary)", fontWeight: 950, lineHeight: 1.05 }} noWrap title={String(value)}>
                        {value}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
function QuestionCard({ stat = null, q, index, isCorrect = false }) {
    //const isCorrect = !!q.is_correct;
    //const {stat} = useStat();
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 5,
                p: 1.8,
                border: `0.1px solid ${isCorrect ? "var(--success-shadow-sm)" : "var(--error-shadow-sm)"}`,
                bgcolor: isCorrect ? "var(--success-shadow)" : "var(--error-shadow)",
            }}
        >
            <Stack spacing={1.1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Stack spacing={0.35} sx={{ minWidth: 0 }}>
                        <Typography variant="body2" color={`var(--${isCorrect ? 'success' : 'error'}-dark)`} sx={{ fontWeight: 900 }}>
                            {t('question')} {q?.uid_intern}
                        </Typography>
                        <Typography variant="body1" sx={{ color: `var(--${isCorrect ? 'success' : 'error'}-dark)`, fontWeight: 950, lineHeight: 1.1 }}>
                            {q.translate?.question || q.question}
                        </Typography>
                    </Stack>

                    <Chip
                        icon={isCorrect ? <IconCheckFilled color="var(--success)" height={22} width={22} /> : <IconCloseFilled color="var(--error)" height={20} width={20} />}
                        label={isCorrect ? t('result.filter-true') : t('result.filter-false')}
                        sx={isCorrect ? chipGood : chipBad}
                        variant="outlined"
                    />
                </Stack>

                {/* Choices */}
                {<Stack spacing={0.6}>
                    <Typography variant="caption" color="var(--grey-light)">
                        {t('choices')}
                    </Typography>
                    <Grid container spacing={1}>
                        {q.translate?.proposals?.map((c) => {
                            const isUser = c.uid_intern === q.answer.uid_proposal;
                            const isRight = (isUser && c.uid_intern === q.answer.uid_answer) || stat?.status === ClassUserStat.STATUS.MAX;
                            //isRight || stat?.status === ClassUserStat.STATUS.MAX
                            return (
                                <Grid size={{ xs: 12, sm: 'auto' }} key={c.uid_intern}>
                                    <Chip
                                        label={c.value}
                                        icon={isRight ? <IconCheckFilled height={18} width={18} /> : isUser ? <IconCloseFilled height={18} width={18} /> : undefined}
                                        sx={{
                                            fontWeight: 800,
                                            borderRadius: 3,
                                            border: "1px solid rgba(15,23,42,0.10)",
                                            bgcolor: isRight
                                                ? "rgba(34,197,94,0.12)"
                                                : isUser
                                                    ? "var(--error-shadow-xs)"
                                                    : "rgba(15,23,42,0.04)",
                                            color: isRight ? "var(--success)" : isUser ? "var(--error)" : "#0B1B4D",
                                            "& .MuiChip-icon": { color: isRight ? "var(--success)" : "var(--error)" },
                                            maxWidth: "100%",
                                            minWidth: 0,
                                            height: 'auto',
                                            //display: "flex",

                                            // 👇 le vrai ellipsis doit être sur le label
                                            "& .MuiChip-label": {
                                                display: 'block',
                                                whiteSpace: 'normal',
                                            },
                                        }}
                                        size="small"
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Grid container spacing={1.2}>
                        <Grid item xs={12} md={6}>
                            <InfoBox
                                label={t('your-answer')}
                                value={q.proposal_text || "—"}
                                tone={isCorrect ? "good" : "bad"}
                            />
                        </Grid>
                    </Grid>
                </Stack>}

            </Stack>
        </Paper>
    );
}
function InfoBox({ label, value, tone }) {
    const isGood = tone === "good";
    const isBad = tone === "bad";

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                p: 1.3,
                border: "1px solid rgba(15,23,42,0.10)",
                bgcolor: isGood ? "rgba(34,197,94,0.06)" : isBad ? "rgba(239,68,68,0.06)" : "rgba(15,23,42,0.04)",
            }}
        >
            <Stack spacing={0.3}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
                    {label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 900, color: "#0B1B4D" }} noWrap title={String(value)}>
                    {value}
                </Typography>
            </Stack>
        </Paper>
    );
}
/* -------------------- Helpers -------------------- */
function formatDuration(sec) {
    const s = Math.max(0, Number(sec || 0));
    const m = Math.floor(s / 60);
    const r = s % 60;
    if (m < 60) return `${m}m ${String(r).padStart(2, "0")}s`;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${String(mm).padStart(2, "0")}m`;
}
/* -------------------- Styles -------------------- */
const chipGood = {
    fontWeight: 950,
    borderRadius: 3,
    bgcolor: "var(--success-shadow-xs)",
    color: "var(--success)",
    borderColor: "var(--success-shadow-md)",
    "& .MuiChip-icon": { color: "var(--success)" },
};
const chipBad = {
    fontWeight: 950,
    borderRadius: 3,
    bgcolor: "var(--error-shadow-xs)",
    color: "var(--error)",
    borderColor: "var(--error-shadow-md)",
    "& .MuiChip-icon": { color: "var(--error)" },
};
