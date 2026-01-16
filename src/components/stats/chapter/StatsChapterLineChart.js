import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useChapter } from "@/contexts/ChapterProvider";
import { capitalizeFirstLetter, convertToCSSChart, formatChrono, getCSSVar, getFormattedDateCompleteNumeric, getFormattedDateNumeric } from "@/contexts/functions";
import { useLesson } from "@/contexts/LessonProvider";
import { useStat } from "@/contexts/StatProvider";
import { useUserDevice } from "@/contexts/UserDeviceProvider";
import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Filler, // 👈 IMPORTANT
} from 'chart.js';
import { Line, Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";
ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Filler // 👈 OBLIGATOIRE pour fill
);

const COLORS = ClassUserStat.GRAPH_COLORS;
const COLORS_STATS = ClassUserStat.STATUS_CONFIG;

function getLabelsScore() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { chapter } = useChapter();
    const { stats, getOneStatIndex } = useStat();
    const sortedStats = [...stats].filter(s => s.uid_chapter === chapter?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
    var labels = [...sortedStats].map((stat, i) => {
        const uidIntern = getOneStatIndex(stat.uid, sortedStats) + 1;
        return `${t('quiz')} n°${uidIntern}`;
    });
    return labels;
}
function getDatasetsScore() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { chapter } = useChapter();
    const { stats, getOneStatIndex } = useStat();
    const sortedStats = [...stats].filter(s => s.uid_chapter === chapter?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
    const statsColors = [...sortedStats].map((stat, i) => {
        // const colors = COLORS;
        //const color = COLORS[i];
        //const colors = Object.values(COLORS);
        //  const color = colors[i];
        const colors = Object.values(COLORS_STATS);
        const color = colors.find(c => c.label === stat.status);

        console.log("statsColors", color, color.background_bubble)
        return ({
            bg: color.background_bubble?.startsWith('var') ? convertToCSSChart(color.background_bubble) : color.background_bubble,
            border: color.border?.startsWith('var') ? convertToCSSChart(color.border) : color.border,
            bgHover: color.background_bubble?.startsWith('var') ? convertToCSSChart(color.background_bubble) : color.background_bubble,
            //border: randomColor(1),
        });
    });
    const datasets = [...sortedStats].map((stat, i) => {
        const labels = getLabelsScore();
        console.log("statttts lenght", [...sortedStats].length)
        //const uidIntern = getOneStatIndex(stat.uid, sortedStats) + 1;
        var statsMap = [{ x: labels[i], y: stat.score }];
        return ({
            label: labels[i],
            uid: stat.uid,
            uidLesson: stat._lesson,
            //data: stats.filter(s => s.uid_lesson === lesson.uid).map(s => s.score),
            data: statsMap,
            stat_uids: [...sortedStats].map(s => s.uid) || "",
            //end_date:satisfies,
            //borderColor: getCSSVar(COLORS[i]),
            borderWidth: 1,
            tension: 0.5,
            stepped: false,
            showLine: true,

            borderColor: statsColors[i]?.border,
            backgroundColor: statsColors[i]?.bg, // couleur des points
            borderWidth: 1,
            tension: 0.5,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: statsColors[i]?.border,

            pointStyle: 'circle',           // forme du point
            pointBackgroundColor: statsColors[i]?.border, // couleur du point
            pointBorderColor: statsColors[i]?.border, // bordure
            spanGaps: false,                // ne relie pas les points manquants
        })
    })
    return datasets;
}
function getTooltipScore() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { getOneStat, stats } = useStat();
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
                const item = tooltipItems[0];
                const uidStat = item.dataset.uid;
                const stat = getOneStat(uidStat);
                // tooltipItems est un array, prend le premier
                //const uidLesson = tooltipItems[0].dataset.uidLesson;
                //const lesson = getOneLesson(uidLesson);
                //console.log("chart tooltip", tooltipItems[0])
                return `${tooltipItems[0].dataset.label} (${t(stat.status)})`; // nom de la leçon
                //return `${lesson?.uid_intern}. ${lesson?.translate?.title}` || ''; // nom de la leçon
            },

            // Texte du tooltip
            label: (tooltipItem) => {
                const item = tooltipItem;
                const uidStat = item.dataset.uid;
                const stat = getOneStat(uidStat);
                return ` ${t('score')} : ${stat.score}/${stat.answers.length} → ${t('duration_short')} : ${formatChrono(stat.duration)}`;
            },
            footer: (tooltipItems) => {
                const item = tooltipItems[0];
                const uidStat = item.dataset.uid;
                const stat = getOneStat(uidStat);
                return `${getFormattedDateCompleteNumeric(stat?.end_date)}`;
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

function getLabelsAverage() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const ALL_STATUS = [...ClassUserStat.ALL_STATUS].reverse();
    const labels = ALL_STATUS.map(status => t(status));
    return labels;
}
function NoStatsComponent() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    return (<Stack sx={{ p: 1.5, my: 1, border: '0.1px solid var(--card-border)' }} alignItems={'start'}>
        <Typography>{t('no-result')}</Typography>
    </Stack>)
}
export default function StatsChapterLineChart({ viewMode = ClassUserStat.VIEW_MODE_SCORE }) {
    const isViewScore = viewMode === ClassUserStat.VIEW_MODE_SCORE;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION])
    const { lessons, getOneLesson } = useLesson();
    const { chapter, chapters, getOneChapter } = useChapter();
    const { isMobile } = useUserDevice();
    const { getOneStatIndex, getOneStat, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
    const { maxPoints, hasStats } = useMemo(() => {
        const sortedStats = [...stats].filter(s => s.uid_chapter === chapter.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
        if (!isViewScore) return { maxPoints: 98, hasStats: sortedStats.length > 0 }
        var max = 0;
        for (const stat of stats) {
            if (stat.answers.length > max) {
                max = stat.answers.length;
            }
        }
        return {
            maxPoints: max, hasStats: sortedStats.length > 0
        }
    }, [chapter, stats]);

    const ALL_STATUS = [...ClassUserStat.ALL_STATUS].reverse();
    const sortedStats = [...stats].filter(s => s.uid_chapter === chapter.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
    const chaptersColors = ALL_STATUS.map((status, i) => {
        const colors = Object.values(COLORS_STATS);
        const color = colors.find(c => c.label === status);
        console.log("length coors", color.color, convertToCSSChart(color.color))
        return ({
            bg: convertToCSSChart(color.background_bubble),
            border: convertToCSSChart(color.border),
            bgHover: convertToCSSChart(color.background_bubble),
            //border: randomColor(1),
        });
    });
    const labelsDate = stats.sort((a, b) => a.end_date.getTime() - b.end_date.getTime()).map(s => getFormattedDateCompleteNumeric(s.end_date));
    const statsDate = Array.from(new Set(sortedStats.map(s => s.end_date)));
    const statsDateLabel = Array.from(new Set(statsDate.map(d => getFormattedDateNumeric(d))));

    var labels = getLabelsScore();
    var datasets = getDatasetsScore();
    var tooltip = getTooltipScore();
    var filteredStats = [...sortedStats];
    console.log("labeeeeel", labels);
    if (!hasStats) {
        return (<NoStatsComponent />);
    }
    if (!isViewScore) {
        labels = getLabelsAverage();
        filteredStats = [...ALL_STATUS];
        datasets = filteredStats.map((status, i) => {
            const chaptersStats = ClassUserStat.getStatsByStatus(sortedStats, status);
            //var statsMap = [{ x: t(s.status), y: s.score }];
            var statsMap = [...chaptersStats].map(s => ({ x: t(s.status), y: s.score }))
            const uidIntern = getOneStatIndex(status.uid, sortedStats) + 1;
            if (!isViewScore) {
                statsMap = chaptersStats.map(s => {
                    //const byDate = ClassUserStat.getStatsByStatus(chaptersStats, status);
                    const percent = getGlobalPercent(s.uid_lesson, s.uid_chapter, chaptersStats);
                    const score = getGlobalScore(s.uid_lesson, s.uid, chaptersStats);
                    const questions = getGlobalCountQuestions(s.uid_lesson, s.uid, chaptersStats);
                    console.log("Staaaats by date", percent);
                    return ({ x: t(s.status), y: percent, length: chaptersStats.length, score, questions })
                });
            }
            //
            return ({
                label: t(status),
                uidLesson: status.uid,
                //data: stats.filter(s => s.uid_lesson === lesson.uid).map(s => s.score),
                data: statsMap,
                stat_uids: chaptersStats.map(s => s.uid) || "",
                //end_date:satisfies,
                //borderColor: getCSSVar(COLORS[i]),
                borderWidth: 1,
                tension: 0.5,
                stepped: false,
                showLine: true,

                borderColor: chaptersColors[i]?.border,
                backgroundColor: chaptersColors[i]?.bg, // couleur des points
                borderWidth: 1,
                tension: 0.5,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: chaptersColors[i]?.border,

                pointStyle: 'circle',           // forme du point
                pointBackgroundColor: chaptersColors[i]?.border, // couleur du point
                pointBorderColor: chaptersColors[i]?.border, // bordure
                spanGaps: false,                // ne relie pas les points manquants
            })
        });
        tooltip = {
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
                    // tooltipItems est un array, prend le premier
                    //const uidLesson = tooltipItems[0].dataset.uidLesson;
                    //const lesson = getOneLesson(uidLesson);
                    //console.log("chart tooltip", tooltipItems[0])
                    return tooltipItems[0].dataset.label; // nom de la leçon
                    //return `${lesson?.uid_intern}. ${lesson?.translate?.title}` || ''; // nom de la leçon
                },

                // Texte du tooltip
                label: (tooltipItem) => {
                    const index = tooltipItem.dataIndex;
                    const stat_uids = tooltipItem.dataset.stat_uids || "";
                    const uidStat = stat_uids[index];
                    const stat = getOneStat(uidStat);
                    const uidIntern = getOneStatIndex(uidStat, sortedStats) + 1;
                    return ` ${t('quiz')} n°${uidIntern} → ${t('score')} : ${stat.score}/${stat.answers.length}`;
                },
                afterLabel: (tooltipItem) => {
                    const index = tooltipItem.dataIndex;
                    const stat_uids = tooltipItem.dataset.stat_uids || "";
                    const uidStat = stat_uids[index];
                    const stat = getOneStat(uidStat);

                    // Par exemple, afficher le nom du chapitre comme “subtitle”
                    return ` ${t('duration_short')} : ${formatChrono(stat?.duration)}`;
                },
                afterBody: (tooltipItems) => {
                    if (tooltipItems.length > 1) {
                        var duration = 0;
                        for (const item of tooltipItems) {
                            const index = item.dataIndex;
                            const stat_uids = item.dataset.stat_uids || "";
                            const uidStat = stat_uids[index];
                            const stat = getOneStat(uidStat);
                            duration += stat?.duration || 0;
                        }
                        return `${t('duration')} : ${formatChrono(duration)}`;
                    }
                    return ``;
                },
                footer: (tooltipItems) => {
                    if (tooltipItems.length > 1) {
                        var _chapters = [];
                        var text = "";
                        var i = 0;
                        for (const item of tooltipItems) {
                            const index = item.dataIndex;
                            const stat_uids = item.dataset.stat_uids || "";
                            const uidStat = stat_uids[index];
                            const stat = getOneStat(uidStat);
                            text += `${capitalizeFirstLetter(t('quiz'))} n°${index + 1} : ${getFormattedDateCompleteNumeric(stat?.end_date)}`;
                            i++;
                            if (i < tooltipItems.length) {
                                text += '\n';
                            }
                        }
                        return text;
                    }
                    const item = tooltipItems[0];
                    const index = item.dataIndex;
                    const stat_uids = item.dataset.stat_uids || "";
                    const uidStat = stat_uids[index];
                    const stat = getOneStat(uidStat);
                    return `${getFormattedDateCompleteNumeric(stat?.end_date)}`;
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
                labelTextColor: function (tooltipItem) {
                    //return '#543453';
                    // tooltipItem.datasetIndex et tooltipItem.dataIndex disponibles
                    // Si c'est beforeLabel
                    //console.log("chart tooltip raw line", tooltipItem)
                    if (tooltipItem.raw === '2') return getCSSVar("--grey-light");
                    // Si c'est afterLabel
                    if (tooltipItem.rawLine === 'afterLabel') return 'yellow';
                    // Sinon (label)
                    //return getCSSVar("--primary");
                }
            },
        };
    }

    const datas = {
        labels: labels,
        datasets: datasets,
    };
    const options = {
        responsive: true,
        maintainAspectRatio: isMobile ? false : true,
        //aspectRatio: window.innerWidth < 768 ? 2.5 : 1,
        plugins: {
            filler: {
                propagate: true
            },
            legend: {
                position: 'top',
                labels: {
                    color: getCSSVar("--font-color"),
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                },
                generateLabels: (chart) =>
                    chart.data.datasets.map((dataset, i) => ({
                        text: dataset.label,
                        fillStyle: dataset.backgroundColor, // couleur de la légende = couleur des bulles
                        strokeStyle: dataset.borderColor,
                        lineWidth: 2,
                        borderWidth: 1,
                        hidden: false,
                        index: i,
                    })),
            },
            tooltip: tooltip,
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: t('dates'), // titre axe X
                    color: getCSSVar("--grey-light"),
                    font: { size: 14, weight: 500 },
                },
                ticks: {
                    color: '#666',
                    //callback: value => `${value}%`,
                    //callback: value => value,
                },
                grid: {
                    //display: false,
                    color: getCSSVar('--card-border'),
                },
            },
            y: {
                min: 0,
                max: maxPoints + 2,
                title: {
                    display: true,
                    text: isViewScore ? `${t('score')}` : `${t('rate')} (%)`, // titre axe Y
                    color: getCSSVar("--grey-light"),
                    font: { size: 14, weight: 500 },
                },
                ticks: {
                    //color: '#666',
                    callback: value => `${value}`,
                },
                grid: {
                    color: getCSSVar('--card-border'),
                    borderColor: '#666'
                },
            },
        },
    };


    return <Line data={datas} options={options} />;
}