import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useChapter } from "@/contexts/ChapterProvider";
import { capitalizeFirstLetter, formatChrono, getCSSVar, getFormattedDateCompleteNumeric, getFormattedDateNumeric } from "@/contexts/functions";
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

function getStatsByDate(stats = [], date = null) {
    const dateString = date.toString();
    if (!(new Date(dateString) instanceof Date)) return [];
    const startDay = new Date(dateString);
    startDay.setHours(0);
    startDay.setMinutes(0);
    startDay.setSeconds(0);
    const endDay = new Date(dateString);
    endDay.setHours(23);
    endDay.setMinutes(59);
    endDay.setSeconds(59);
    return stats.filter(s => s.end_date.getTime() >= startDay.getTime() && s.end_date <= endDay.getTime());
}

export default function StatsLessonLineChart({ viewMode = ClassUserStat.VIEW_MODE_SCORE }) {
    const isViewScore = viewMode === ClassUserStat.VIEW_MODE_SCORE;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION])
    const { lessons, getOneLesson } = useLesson();
    const { chapters, getOneChapter } = useChapter();
    const { isMobile } = useUserDevice();
    const { getOneStat, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
    const { maxPoints } = useMemo(() => {
        if (!isViewScore) return { maxPoints: 98 }
        var max = 0;
        for (const stat of stats) {
            if (stat.answers.length > max) {
                max = stat.answers.length;
            }
        }
        return {
            maxPoints: max,
        }
    }, [stats]);


    const chaptersColors = chapters.map((_, i) => ({
        bg: getCSSVar(COLORS[i].bg),
        border: getCSSVar(COLORS[i].border),
        bgHover: getCSSVar(COLORS[i].bgHover),
        //border: randomColor(1),
    }));
    const sortedStats = [...stats].sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
    const statsDate = Array.from(new Set(sortedStats.map(s => s.end_date)));
    const statsDateLabel = Array.from(new Set(statsDate.map(d => getFormattedDateNumeric(d))));
    const datas = {
        labels: statsDateLabel,
        datasets: chapters.map((chapter, i) => {
            const chaptersStats = [...sortedStats].filter(s => s.uid_chapter === chapter.uid) || [];
            var chaptersMap = chaptersStats.map(s => ({ x: getFormattedDateNumeric(s.end_date), y: s.score }));
            if (!isViewScore) {
                chaptersMap = chaptersStats.map(s => {
                    const byDate = getStatsByDate(chaptersStats, s.end_date);
                    const percent = getGlobalPercent(chapter.uid_lesson, chapter.uid, byDate);
                    const score = getGlobalScore(chapter.uid_lesson, chapter.uid, byDate);
                    const questions = getGlobalCountQuestions(chapter.uid_lesson, chapter.uid, byDate);
                    return ({ x: getFormattedDateNumeric(s.end_date), y: percent,length:byDate.length, score,questions })
                });
            }
            //
            return ({
                label: `${chapter.uid_intern}. ${chapter.translate?.title}`,
                uidLesson: chapter.uid,
                //data: stats.filter(s => s.uid_lesson === lesson.uid).map(s => s.score),
                data: chaptersMap,
                stat_uids: chaptersStats.map(s => s.uid) || "",
                //end_date:satisfies,
                borderColor: getCSSVar(COLORS[i]),
                borderWidth: 1,
                tension: 0.5,
                stepped: false,
                showLine: true,

                borderColor: chaptersColors[i].border,
                backgroundColor: chaptersColors[i].bg, // couleur des points
                borderWidth: 1,
                tension: 0.5,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: chaptersColors[i].border,

                pointStyle: 'circle',           // forme du point
                pointBackgroundColor: chaptersColors[i].border, // couleur du point
                pointBorderColor: chaptersColors[i].border, // bordure
                spanGaps: false,                // ne relie pas les points manquants
            })
        }),
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
            tooltip: {
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
                        return ` ${capitalizeFirstLetter(t('quiz'))} n°${index + 1} → ${t('score')} : ${stat.score}/${stat.answers.length} (${t(stat.status)})`;
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
                                duration+= stat?.duration || 0;
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
            },
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