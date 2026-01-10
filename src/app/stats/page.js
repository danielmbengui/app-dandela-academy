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
import { IconArrowBack, IconArrowLeft, IconArrowRight, IconBookOpen, IconCertificate, IconDuration, IconLessons, IconObjective, IconQuizz, IconStats } from "@/assets/icons/IconsComponent";
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
    const { stats } = useStat();
    useEffect(() => {
        console.log("STATTTTS", stats)
    })
    return (<Stack sx={{ background: '', width: '100%',color:'var(--font-color)' }}>
        <Grid container>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, my: 0.5 }}>
                        {t('title')}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                        {t('subtitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, my: 1 }}>
                        <Trans
                            t={t}
                            i18nKey={`count-stats`}
                            values={{
                                countLesson: new Set(stats.map(stat => stat.uid_lesson)).size,
                                countQuiz: stats.length
                            }}
                        />
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    </Stack>)
}

export default function ExcelBeginnerCoursePage() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
   // const { lang } = useLanguage();
    //const { user } = useAuth();
    //const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
    const { isLoading: isLoadingStats } = useStat();

    return (<DashboardPageWrapper
        titles={[
            { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: '' },
            //{ name: lesson?.translate?.title, url: `${PAGE_LESSONS}/${lesson?.uid}` },
            //{ name: t('chapters', { ns: NS_DASHBOARD_MENU }), url: `${PAGE_LESSONS}/${lesson?.uid}/chapters` },
            //{ name: `${chapter?.uid_intern}. ${chapter?.translate?.title}`, url: '' },
        ]}
        //title={`Cours / ${lesson?.title}`}
        //subtitle={lesson?.translate?.subtitle}
        icon={<IconStats height={18} width={18} />}
    >
        <Container maxWidth="lg" disableGutters sx={{ p: 0, background: '' }}>
            {
                isLoadingStats ? <CircularProgress size={"16px"} /> : <Grid container spacing={1}>
                <Grid size={12}>
                    <CardHeader />
                </Grid>
                <Grid size={{ xs: 12, sm: 12 }}>
                    <StatsListComponent />
                </Grid>
            </Grid>
            }
        </Container>
    </DashboardPageWrapper>);
}
