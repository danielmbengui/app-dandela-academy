import React, { useMemo } from "react";
import { useLesson } from "@/contexts/LessonProvider";
import { Line, Bar } from "react-chartjs-2";
import { useStat } from "@/contexts/StatProvider";
import { capitalizeFirstLetter, formatChrono, getCSSVar, getFormattedDateCompleteNumeric, getFormattedDateNumeric } from "@/contexts/functions";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useTranslation } from "react-i18next";
import { useChapter } from "@/contexts/ChapterProvider";
import { useUserDevice } from "@/contexts/UserDeviceProvider";

const COLORS = ClassUserStat.GRAPH_COLORS;

export default function StatsLessonBarChart({ viewMode = ClassUserStat.VIEW_MODE_SCORE }) {
    const isViewScore = viewMode === ClassUserStat.VIEW_MODE_SCORE;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION])
    const { isMobile } = useUserDevice();
    const { lessons } = useLesson();
    const { getOneChapter, chapters } = useChapter();
    const { getOneStat, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
    const chapterColors = chapters.map((_, i) => ({
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
    const statsDate = Array.from(new Set(sortedStats.map(s => s.end_date)));
    const statsDateLabel = Array.from(new Set(statsDate.map(d => getFormattedDateNumeric(d))));
    const data = {
        //labels: coursesResults.map(c => c.title),
        labels: statsDateLabel,
        datasets: chapters.map((_chapter, i) => {
            const chaptersStats = [...sortedStats].filter(s => s.uid_chapter === _chapter.uid) || [];
            const percent = getGlobalPercent(_chapter.uid_lesson,_chapter.uid);
            const status = ClassUserStat.getStatusFromPercentage(percent / 100);
            const countChapters = getGlobalCountChapters(_chapter.uid_lesson,_chapter.uid);
            const totalChapters = chapters.filter(c => c.uid_chapter === _chapter.uid).length;
            var chaptersMap = chaptersStats.map(s => {
                return ({
                    x: getFormattedDateNumeric(s.end_date),
                    y: s.score,
                    uid: s.uid,
                    chapter_title: `${_chapter.uid_intern}. ${_chapter.translate?.title}`,
                    //length: byDate.length,
                    //score,
                    //questions
                });
            });
            if (!isViewScore) {
                chaptersMap = chaptersStats.map(s => {
                    const byDate = ClassUserStat.getStatsByDate(chaptersStats, s.end_date);
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
                label: `${_chapter.uid_intern}. ${_chapter.translate?.title}`,
                data: [percent],
                data: chaptersMap,
                stat_uids: chaptersStats.map(s => s.uid) || "",
                uidLesson: _chapter.uid_lesson,
                status: status,
                //backgroundColor: [getCSSVar('--primary')],
                backgroundColor: chapterColors[i].bg,
                borderColor: chapterColors[i].border,
                borderWidth: 1,
                borderRadius: 0,
                hoverBackgroundColor: chapterColors[i].bgHover,
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