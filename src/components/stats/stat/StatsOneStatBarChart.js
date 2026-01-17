import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useStat } from "@/contexts/StatProvider";
import { convertToCSSChart, formatChrono, getCSSVar, getFormattedDateCompleteNumeric } from "@/contexts/functions";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useTranslation } from "react-i18next";
import { useChapter } from "@/contexts/ChapterProvider";
import { useUserDevice } from "@/contexts/UserDeviceProvider";
import { Stack, Typography } from "@mui/material";

const COLORS = [
    ClassUserStat.getStatusColor(ClassUserStat.STATUS.EXCELLENT),
    ClassUserStat.getStatusColor(ClassUserStat.STATUS.NOT_GOOD),
];
const COLORS_GRAPH = ClassUserStat.GRAPH_COLORS;
const COLORS_STATS = ClassUserStat.STATUS_CONFIG;
const TRANSLATE_CORRECT = "result.filter-true";
const TRANSLATE_WRONG = "result.filter-false";

const getOneAnswer = (uid = 0, answers = []) => {
    if (uid <= 0 || answers.length === 0) return null;
    return answers.find(a => a.uid_question === uid);

}
function GetLabelsScore() {
    const labelCorrect = TRANSLATE_CORRECT;
    const labelWrong = TRANSLATE_WRONG;
    const { stat, stats, getOneStatIndex } = useStat();
    const answers = stat?.answers.sort((a, b) => a.uid_question - b.uid_question);
    var labels = [...answers].map((answer) => {
        // const uidIntern = getOneStatIndex(stat.uid, sortedStats) + 1;
        return answer.uid_question;
    });
    return labels;
}
function GetDatasetsScore() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const labels = GetLabelsScore();
    const { chapter } = useChapter();
    const { stat, stats, getOneStatIndex } = useStat();
    const answers = stat?.answers.sort((a, b) => a.uid_question - b.uid_question);
    const colors = [...COLORS].map((c, i) => {
        return ({
            label: i === 0 ? TRANSLATE_CORRECT : TRANSLATE_WRONG,
            bg: c.background_bubble?.startsWith('var') ? convertToCSSChart(c.background_bubble) : c.background_bubble,
            border: c.border?.startsWith('var') ? convertToCSSChart(c.border) : c.border,
            bgHover: c.background_bubble?.startsWith('var') ? convertToCSSChart(c.background_bubble) : c.background_bubble,
            //border: randomColor(1),
        });
    });
    const datasets = [...labels].map((uid_question, i) => {
        const answer = answers?.[i];
        const isCorrect = answer.uid_answer === answer.uid_proposal;
        const text = isCorrect ? TRANSLATE_CORRECT : TRANSLATE_WRONG;
        var statsMap = [{ x: uid_question, y: isCorrect ? 1 : 0.1 }];
        const color = colors.find(c => c.label === text);
        return ({
            label: `${t('question')} n°${uid_question}`,
            uid: uid_question,
            correct: isCorrect,
            value: text,
            //data: stats.filter(s => s.uid_lesson === lesson.uid).map(s => s.score),
            data: statsMap.length > 0 ? statsMap : [{ x: uid_question, y: 0.1 }],
            //end_date:satisfies,
            //borderColor: getCSSVar(COLORS[i]),
            borderWidth: 1,
            tension: 0.5,
            stepped: false,
            showLine: true,

            borderColor: color?.border,
            backgroundColor: color?.bg, // couleur des points
            borderWidth: 1,
            tension: 0.5,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: color?.border,

            pointStyle: 'circle',           // forme du point
            pointBackgroundColor: color?.border, // couleur du point
            pointBorderColor: color?.border, // bordure
            spanGaps: false,                // ne relie pas les points manquants
        })
    })
    return datasets;
}
function GetTooltipScore() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const tooltip = {
        enabled: true,
        borderColor: getCSSVar("--primary"),
        borderWidth: 1,
        backgroundColor: getCSSVar("--card-color"),
        titleColor: getCSSVar("--font-color"),
        footerColor: getCSSVar("--grey-light"),
        bodyColor: getCSSVar("--font-color"),
        padding: 12,
        cornerRadius: 10,
        callbacks: {
            // Titre du tooltip
            title: (tooltipItems) => {
                //const item = tooltipItems[0];
                //const uidStat = item.dataset.uid;
                //const stat = getOneAnswer(uidStat, answers);
                // tooltipItems est un array, prend le premier
                //const uidLesson = tooltipItems[0].dataset.uidLesson;
                //const lesson = getOneLesson(uidLesson);
                //console.log("chart tooltip", tooltipItems[0])
                return `${tooltipItems[0].dataset.label}`; // nom de la leçon
                //return `${lesson?.uid_intern}. ${lesson?.translate?.title}` || ''; // nom de la leçon
            },
            label: (tooltipItem) => {
                const item = tooltipItem;
                return ` ${t(item.dataset.value)}`;
            },
            labelColor: function (tooltipItem) {
                return {
                    borderColor: tooltipItem.dataset.borderColor,
                    backgroundColor: tooltipItem.dataset.backgroundColor,
                    borderWidth: 2,
                    //borderDash: [2, 2],
                    borderRadius: 0,
                };
            },
        },
    }
    return tooltip;
}
function GetLabelsAverage() {
    const labelCorrect = TRANSLATE_CORRECT;
    const labelWrong = TRANSLATE_WRONG;
    var labels = [labelCorrect, labelWrong].map((label) => {
        // const uidIntern = getOneStatIndex(stat.uid, sortedStats) + 1;
        return `${label}`;
    });
    return labels;
}
function GetDatasetsAverage() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const labels = GetLabelsScore();
    const { chapter } = useChapter();
    const { stat, stats, getOneStatIndex } = useStat();
    const answers = stat?.answers.sort((a, b) => a.uid_question - b.uid_question);
    const colors = [...COLORS].map((c, i) => {
        return ({
            label: i === 0 ? TRANSLATE_CORRECT : TRANSLATE_WRONG,
            bg: c.background_bubble?.startsWith('var') ? convertToCSSChart(c.background_bubble) : c.background_bubble,
            border: c.border?.startsWith('var') ? convertToCSSChart(c.border) : c.border,
            bgHover: c.background_bubble?.startsWith('var') ? convertToCSSChart(c.background_bubble) : c.background_bubble,
            //border: randomColor(1),
        });
    });
    return [TRANSLATE_CORRECT, TRANSLATE_WRONG].map((status, i) => {
        //const chaptersStats = ClassUserStat.getStatsByStatus(sortedStats, answer);
        //var statsMap = [{ x: t(s.status), y: s.score }];

        //const percent = chaptersStats.length / sortedStats.length * 100;
        //var statsMap = [{ x: t(s.status), y: percent, length: chaptersStats.length, score, questions, quiz }];

        //const ALL_STATUS = [...ClassUserStat.ALL_STATUS].reverse();
        //const answer = answers?.[i];
        const filteredAnswers = [...answers].map(answer => {
            const isCorrect = answer.uid_answer === answer.uid_proposal;
            const text = isCorrect ? TRANSLATE_CORRECT : TRANSLATE_WRONG;
            return ({
                isCorrect,
                text,
                uid: answer.uid_question,
            })
        }).filter(answer => answer.text === status);
        const percent = filteredAnswers.length / answers.length * 100;
        var statsMap = filteredAnswers.map(answer => ({ x: answer.text, y: percent, uid_question: answer.uid }));
        const color = colors.find(c => c.label === status);
        //
        return ({
            label: `${t(status)}`,
            score:filteredAnswers.length,
            total:answers.length,
            //data: stats.filter(s => s.uid_lesson === lesson.uid).map(s => s.score),
            data: statsMap,
            //stat_uids: chaptersStats.map(s => s.uid) || "",
            //end_date:satisfies,
            //borderColor: getCSSVar(COLORS[i]),
            borderWidth: 1,
            tension: 0.5,
            stepped: false,
            showLine: true,

            borderColor: color?.border,
            backgroundColor: color?.bg, // couleur des points
            borderWidth: 1,
            tension: 0.5,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: color?.border,

            pointStyle: 'circle',           // forme du point
            pointBackgroundColor: color?.border, // couleur du point
            pointBorderColor: color?.border, // bordure
            spanGaps: false,                // ne relie pas les points manquants
        })
    });
}
function GetTooltipAverage() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { getGlobalCountQuiz, getOneStat, getOneStatIndex, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();

    const { chapter, } = useChapter();
    const sortedStats = [...stats].filter(s => s.uid_chapter === chapter?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
    const tooltip = {
        enabled: true,
        borderColor: getCSSVar("--primary"),
        borderWidth: 1,
        backgroundColor: getCSSVar("--card-color"),
        titleColor: getCSSVar("--font-color"),
        footerColor: getCSSVar("--grey-light"),
        bodyColor: getCSSVar("--font-color"),
        padding: 12,
        cornerRadius: 10,
        callbacks: {
            // Titre du tooltip
            title: (tooltipItems) => {
                return tooltipItems[0].dataset.label; // nom de la leçon
            },

            // Texte du tooltip
            label: (tooltipItem) => {
                const item = tooltipItem.raw;
                const uid = item.uid_question;
                return ` ${t('question')} n°${uid}`;
            },
            footer: (tooltipItems) => {
                const item = tooltipItems[0];
                const dataset = item.dataset;
                const average = tooltipItems[0].raw.y || 0;
                const length = tooltipItems[0].raw.length || 0;
                const score = dataset.score || 0;
                const questions = dataset.total || 0;
                const quiz = tooltipItems[0].raw.quiz || 0;
                //const lessonsStats = [...sortedStats].filter(s => s.uid_lesson === lesson.uid) || [];
                return `${tooltipItems.length} ${t('questions')} → ${t('score')} : ${score}/${questions} | ${t('average')} : ${average.toFixed(2)}%`;
            },
            labelColor: function (tooltipItem) {
                return {
                    borderColor: tooltipItem.dataset.borderColor,
                    backgroundColor: tooltipItem.dataset.backgroundColor,
                    borderWidth: 2,
                    //borderDash: [2, 2],
                    borderRadius: 0,
                };
            },
        },
    }
    return tooltip;
}
function NoStatsComponent() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    return (<Stack sx={{ p: 1.5, my: 1, border: '0.1px solid var(--card-border)' }} alignItems={'start'}>
        <Typography>{t('no-result')}</Typography>
    </Stack>)
}
export default function StatsOneStatBarChart({ viewMode = ClassUserStat.VIEW_MODE_SCORE }) {
    const isViewScore = viewMode === ClassUserStat.VIEW_MODE_SCORE;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION])
    const { isMobile } = useUserDevice();
    const { stat, stats } = useStat();
    const { maxPoints, hasStats } = useMemo(() => {
        if (!isViewScore) return { maxPoints: 100, hasStats: stats.length > 0 }
        return {
            maxPoints: 2, hasStats: stats.length > 0
        }
    }, [stat, stats]);
    const sortedStats = [...stats].sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
    const statsDate = Array.from(new Set(sortedStats.map(s => s.end_date)));
    const colorsScore = [...COLORS].map((c, i) => {
        return ({
            label: i === 0 ? TRANSLATE_CORRECT : TRANSLATE_WRONG,
            bg: c.background_bubble?.startsWith('var') ? convertToCSSChart(c.background_bubble) : c.background_bubble,
            border: c.border?.startsWith('var') ? convertToCSSChart(c.border) : c.border,
            bgHover: c.background_bubble?.startsWith('var') ? convertToCSSChart(c.background_bubble) : c.background_bubble,
            value: i === 0 ? 1 : 0,
            //border: randomColor(1),
        });
    });
    var labels = GetLabelsScore();
    var datasets = GetDatasetsScore();
    var tooltip = GetTooltipScore();
    if (!isViewScore) {
        labels = GetLabelsAverage();
        datasets = GetDatasetsAverage();
        tooltip = GetTooltipAverage();
    }
    const data = {
        //labels: coursesResults.map(c => c.title),
        labels: labels,
        datasets: datasets,
    };
    const options = {
        responsive: true,
        maintainAspectRatio: isMobile ? false : true,
        //aspectRatio: window.innerWidth < 768 ? 2.5 : 1,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: getCSSVar("--font-color"),
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                },
            },
            tooltip: tooltip,
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: t('lessons'), // titre axe X
                    color: getCSSVar("--grey-light"),
                    font: { size: 14, weight: 500 },
                },
                ticks: {
                    color: '#666',
                    //callback: value => `${value}%`,
                    callback: value => {
                        return isViewScore ? `${t('question')} n°${labels[value]}` : `${!isViewScore ? t(labels[value]) : ''}`
                    },
                },
                grid: {
                    //display: false,
                    color: getCSSVar('--card-border'),
                },
            },
            y: {
                min: 0,
                max: maxPoints,
                //weight:1,
                // stacked: true,
                title: {
                    display: true,
                    text: isViewScore ? `${t('score')}` : `${t('rate')} (%)`, // titre axe Y
                    color: getCSSVar("--grey-light"),
                    font: { size: 14, weight: 500 },
                },
                ticks: {
                    //color: '#666',
                    stepSize: isViewScore ? 1 : 10,
                    //precision: 0,   // sécurité pour éviter les décimales
                    callback: value => {
                        const color = colorsScore.find(c => c.value === value);
                        const result = value > 1 ? '' : color?.label;
                        return isViewScore ? `${t(result)}` : `${t(value)}%`;
                    },
                },
                grid: {
                    color: getCSSVar('--card-border'),
                    borderColor: '#666'
                },
            },
        },
    };

    if (!hasStats) {
        return (<NoStatsComponent />)
    }
    return <Bar data={data} options={options} />;
}