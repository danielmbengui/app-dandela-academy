"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { useParams, useRouter } from "next/navigation";
import { useLesson } from "@/contexts/LessonProvider";
import { Trans, useTranslation } from "react-i18next";
import { ClassLesson } from "@/classes/ClassLesson";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { ClassLessonSubchapterTranslation } from "@/classes/lessons/ClassLessonSubchapter";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { IconArrowBack, IconArrowLeft, IconArrowRight, IconBookOpen, IconCalendar, IconCertificate, IconDuration, IconLessons, IconLevel, IconObjective, IconQuizz, IconStats } from "@/assets/icons/IconsComponent";
import { NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS, NS_STATS_ONE } from "@/contexts/i18n/settings";
import { PAGE_LESSONS, PAGE_STATS } from "@/contexts/constants/constants_pages";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { ClassLessonChapterQuestion, ClassLessonChapterQuestionTranslation, ClassLessonChapterQuiz } from "@/classes/lessons/ClassLessonChapterQuiz";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import { addDaysToDate, capitalizeFirstLetter, formatChrono, getFormattedDateComplete, getFormattedDateCompleteNumeric, mixArray } from "@/contexts/functions";
import AlertComponent from "@/components/elements/AlertComponent";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useAuth } from "@/contexts/AuthProvider";
import CircularProgressWithLabelComponent from "@/components/elements/CircularProgressWithLabelComponent";
import AccordionComponent from "@/components/dashboard/elements/AccordionComponent";
import StatsListComponent from "@/components/stats/StatsListComponent";
import { useStat } from "@/contexts/StatProvider";
import OneStatComponent from "@/components/stats/OneStatComponent";
import { useChapter } from "@/contexts/ChapterProvider";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import Link from "next/link";
import StatsChartsComponent from "@/components/stats/StatsChartsComponent";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StatsOneStatListComponent from "@/components/stats/stat/StatsOneStatListComponent";
import StatsOneStatBarChart from "@/components/stats/stat/StatsOneStatBarChart";
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
const CardHeader = ({indexStat=-1}) => {
  const router = useRouter();
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const { lesson } = useLesson();
  const { chapter } = useChapter();
  const { stat, stats, setUidStat } = useStat();
  const disabledBack = useMemo(() => {
    return indexStat === 0;
  }, [stats, stat]);
  const disabledNext = useMemo(() => {
    return indexStat === stats?.length - 1;
  }, [stats, stat]);

  return (<Stack sx={{ background: '', width: '100%' }}>
    <Grid container>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, my: 0.5 }}>
            {`${lesson?.uid_intern}. `}{lesson?.translate?.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {`${chapter?.uid_intern}. `}{chapter?.translate?.title} • {t(chapter?.level)} • {capitalizeFirstLetter(t('quiz'))}{" n°"}{indexStat+1}
          </Typography>

          <Stack spacing={1} direction={'row'} sx={{pt:1}} alignItems={'center'}>
          <Link href={`${PAGE_STATS}/${stat?.uid_lesson}/${stat?.uid_chapter}`}>
          <ButtonCancel label={t('btn-see-results')} />
          </Link>
          </Stack>

          <Stack maxWidth={'xl'} direction={'row'} spacing={1} alignItems={'center'} sx={{
            py: 1,
            background: 'var(--primary-shadow)',
            borderRadius: '10px',
            my: 1.5,
            py: 1.5,
            px: 1,
            color:'var(--primary-dark)',
            width:{xs:'100%', sm:'50%'}
          }}>
            <IconButton
              disabled={disabledBack}
              onClick={() => {
                //const currentIndex = getOneStatIndex(stat?.uid);
                const uid = stats?.[indexStat - 1]?.uid || "";
                //setUidStat(uid);
                router.push(`${PAGE_STATS}/${stat?.uid_lesson}/${stat?.uid_chapter}/${uid}`);
              }}
              sx={{
                color: !disabledBack ? 'var(--primary)' : ''
              }}
            >
              <IconArrowBack />
            </IconButton>
            {
              <Typography>{capitalizeFirstLetter(t('quiz'))} {indexStat + 1}{"/"}{stats?.length}</Typography>
            }                <IconButton
              disabled={disabledNext}
              onClick={() => {
                const uid = stats?.[indexStat + 1]?.uid || "";
                //setUidStat(uid);
                router.push(`${PAGE_STATS}/${stat?.uid_lesson}/${stat?.uid_chapter}/${uid}`);
              }}
              sx={{
                color: !disabledNext ? 'var(--primary)' : ''
              }}
            >
              <IconArrowRight />
            </IconButton>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  </Stack>)
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
export default function OneStatPage() {
  const router = useRouter();
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const { uidLesson,uidChapter, uid: uidStat } = useParams();
  console.log("uid", uidStat)
  // const { lang } = useLanguage();
  //const { user } = useAuth();
  const { lesson, setUidLesson, getOneLesson, isLoading: isLoadingLesson } = useLesson();
  const { chapter, setUidChapter } = useChapter();
  const { getOneStatIndex,getGlobalCountQuiz, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();

  useEffect(() => {
    for (const s of stats) {
      router.prefetch(`${PAGE_STATS}/${uidLesson}/${uidChapter}/${s.uid}`);
    }
  }, [stats]);
  useEffect(() => {
    setUidLesson(uidLesson);
    setUidChapter(uidChapter);
    setUidStat(uidStat);
  }, [uidLesson,uidChapter,uidStat]);
  const {indexStat, level, score, countQuestions,average, duration, endDate} = useMemo(() => {
    const indexStat = getOneStatIndex(uidStat, stats);
    const level = chapter?.level;
    const score = stat?.score;
    const countQuestions = stat?.answers?.length;
    const average = stat?.percentage;
    const duration = stat?.duration;
    const endDate = stat?.end_date;
    return {
      indexStat,
      level,
      score,
      countQuestions,
      average,
      duration,
      endDate
    }
  }, [chapter,stats, uidStat]);

  return (<DashboardPageWrapper
    titles={[
      { name: t('stats', { ns: NS_DASHBOARD_MENU }), url: PAGE_STATS },
      { name: lesson?.translate?.title, url: `${PAGE_STATS}/${lesson?.uid}` },
      { name: chapter?.translate?.title, url: `${PAGE_STATS}/${lesson?.uid}/${chapter?.uid}` },
      { name: `${capitalizeFirstLetter(t('quiz'))} n°${indexStat+1}`, url: `` },
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
            <CardHeader indexStat={indexStat} />
          </Grid>
          <Stack sx={{ background: '' }} alignItems={'start'} maxWidth={'md'} spacing={1.5}>
                        {/* Quick stats */}
                        <Grid container spacing={1} sx={{ width: '100%', background: '' }}>
                            <Grid size={{ xs: 6, sm: 'auto' }}>
                                <MiniStat label={t('level')} value={`${t(level)}`} icon={<IconLevel height={25} width={25} color="var(--primary)" />} />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 'auto' }}>
                                <MiniStat label={t('score')} value={`${score}/${countQuestions}`} icon={<EmojiEventsIcon height={15} fontSize="small" sx={{ color: "var(--primary)" }} />} />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 'auto' }}>
                                <MiniStat label={t('average')} value={`${parseInt(average)}%`} icon={<IconStats height={15} fontSize="small" color="var(--primary)" />} />
                            </Grid>

                            <Grid size={{ xs: 6, sm: 'auto' }}>
                                <MiniStat label={t('duration_short')} value={formatChrono(duration)} icon={<IconDuration color="var(--primary)" fontSize="small" />} />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 'auto' }}>
                                <MiniStat label={t('date')} value={getFormattedDateCompleteNumeric(endDate)} icon={<IconCalendar color="var(--primary)" fontSize="small" />} />
                            </Grid>
                        </Grid>
                    </Stack>
          <Grid size={12}>
            <StatsChartsComponent
              listComponent={<OneStatComponent stat={stat} viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              listAverageComponent={<StatsOneStatListComponent viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
              //listAverageComponent={<StatsChapterListComponent viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
              //evolutionComponent={<StatsChapterLineChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              //evolutionAverageComponent={<StatsChapterLineChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
              showEvolution={false}
              showEvolutionAverage={false}
              compareComponent={<StatsOneStatBarChart viewMode={ClassUserStat.VIEW_MODE_SCORE} />}
              compareAverageComponent={<StatsOneStatBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
              //={<StatsChapterBarChart viewMode={ClassUserStat.VIEW_MODE_AVERAGE} />}
            />
          </Grid>
        </Grid>
      }
    </Container>
  </DashboardPageWrapper>);
}
