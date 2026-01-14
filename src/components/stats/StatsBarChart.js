import React, { useMemo } from "react";
import { useLesson } from "@/contexts/LessonProvider";
import { Line, Bar } from "react-chartjs-2";
import { useStat } from "@/contexts/StatProvider";
import { capitalizeFirstLetter, formatChrono, getCSSVar, getFormattedDateCompleteNumeric, getFormattedDateNumeric } from "@/contexts/functions";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useTranslation } from "react-i18next";
import { useChapter } from "@/contexts/ChapterProvider";
import { useUserDevice } from "@/contexts/UserDeviceProvider";
const coursesResults = [
    {
        id: "excel",
        title: "Excel – Fondamentaux",
        history: [
            { date: "01/01", score: 20 },
            { date: "10/01", score: 45 },
            { date: "20/01", score: 70 },
        ],
        progress: 70,
        level: "Intermédiaire",
    },
    {
        id: "it_intro",
        title: "Introduction à l’informatique",
        history: [
            { date: "05/01", score: 30 },
            { date: "18/01", score: 60 },
        ],
        progress: 60,
        level: "Débutant",
    },
];
const COLORS = [
    { bg: "--primary-shadow-xs", border: "--primary", bgHover: "--primary" },
    "--success",
    "--error",
    "--warning",
    "--info",
    "--winner",
    "--bronze",
];
function randomColor(alpha = 0.7) {
    const r = Math.floor(Math.random() * 200 + 30);
    const g = Math.floor(Math.random() * 200 + 30);
    const b = Math.floor(Math.random() * 200 + 30);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
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
export default function StatsBarChart({ viewMode = ClassUserStat.VIEW_MODE_SCORE }) {
    const isViewScore = viewMode === ClassUserStat.VIEW_MODE_SCORE;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION])
    const { isMobile } = useUserDevice();
    const { lessons } = useLesson();
    const { getOneChapter, chapters } = useChapter();
    const { getOneStat, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
    const lessonColors = lessons.map((_, i) => ({
        bg: getCSSVar(COLORS[i].bg),
        border: getCSSVar(COLORS[i].border),
        bgHover: getCSSVar(COLORS[i].bgHover),
        //border: randomColor(1),
    }));
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
    const sortedStats = [...stats].sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
    const labelsDate = stats.sort((a, b) => a.end_date.getTime() - b.end_date.getTime()).map(s => getFormattedDateNumeric(s.end_date));
    const statsDate = Array.from(new Set(sortedStats.map(s => s.end_date)));
    const statsDateLabel = Array.from(new Set(statsDate.map(d => getFormattedDateNumeric(d))));
    const data = {
        //labels: coursesResults.map(c => c.title),
        labels: statsDateLabel,
        datasets: lessons.map((l, i) => {
            const lessonsStats = [...sortedStats].filter(s => s.uid_lesson === l.uid) || [];
            const percent = getGlobalPercent(l.uid);
            const status = ClassUserStat.getStatusFromPercentage(percent / 100);
            const countChapters = getGlobalCountChapters(l.uid);
            const totalChapters = chapters.filter(c => c.uid_lesson === l.uid).length;
            var lessonsMap = lessonsStats.map(s => {
                const chapter = getOneChapter(s.uid_chapter);
                //const score = getGlobalScore("", "", byDate);
                //const questions = getGlobalCountQuestions("", "", byDate);
                return ({
                    x: getFormattedDateNumeric(s.end_date),
                    y: s.score,
                    uid: s.uid,
                    chapter_title: `${chapter.uid_intern}. ${chapter.translate?.title}`,
                    //length: byDate.length,
                    //score,
                    //questions
                });
            });
            if (!isViewScore) {
                lessonsMap = lessonsStats.map(s => {
                    const byDate = getStatsByDate(lessonsStats, s.end_date);
                    const percent = getGlobalPercent("", "", byDate);
                    const score = getGlobalScore("", "", byDate);
                    const questions = getGlobalCountQuestions("", "", byDate);
                    return ({
                        x: getFormattedDateNumeric(s.end_date),
                        y: percent,
                        length: byDate.length,
                        score,
                        questions
                    })
                });
            }
            return ({
                label: `${l.uid_intern}. ${l.translate?.title}`,
                data: [percent],
                data: lessonsMap,
                stat_uids: lessonsStats.map(s => s.uid) || "",
                uidLesson: l.uid,
                status: status,
                //backgroundColor: [getCSSVar('--primary')],
                backgroundColor: lessonColors.map(c => c.bg),
                borderColor: lessonColors.map(c => c.border),
                borderWidth: 1,
                borderRadius: 0,
                hoverBackgroundColor: lessonColors.map(c => c.bgHover),
                countChapters: countChapters,
                totalChapters: totalChapters,
            })
        }),
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
                        console.log("chart tooltip", tooltipItems[0])
                        return tooltipItems[0].dataset.label; // nom de la leçon
                    },
                    afterTitle: (tooltipItems) => {
                        const item = tooltipItems[0];
                        const chapter_title = item.raw.chapter_title;
                        return chapter_title || '';
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
                    // Optionnel : footer
                    footer: (tooltipItems) => {
                        if(isViewScore) {
                            if (tooltipItems.length > 1) {
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
                        }
                        const average = tooltipItems[0].raw.y || 0;
                        const length = tooltipItems[0].raw.length || 0;
                        const score = tooltipItems[0].raw.score || 0;
                        const questions = tooltipItems[0].raw.questions || 0;
                        //const lessonsStats = [...sortedStats].filter(s => s.uid_lesson === lesson.uid) || [];
                        return `${length} ${t('quizs')} → ${t('score')} : ${score}/${questions} | ${t('average')} : ${average.toFixed(2)}%`;
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
                        console.log("chart tooltip raw line", tooltipItem)
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
                    text: t('lessons'), // titre axe X
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
                    callback: value => `${value}${!isViewScore ? '%' : ''}`,
                },
                grid: {
                    color: getCSSVar('--card-border'),
                    borderColor: '#666'
                },
            },
        },
    };


    return <Bar data={data} options={options} />;
}