import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useStat } from "@/contexts/StatProvider";
import { convertToCSSChart, formatChrono, getCSSVar, getFormattedDateCompleteNumeric } from "@/contexts/functions";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import { useTranslation } from "react-i18next";
import { useChapter } from "@/contexts/ChapterProvider";
import { useUserDevice } from "@/contexts/UserDeviceProvider";

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
        var statsMap = [{ x: labels[i], y: stat.score > 0 ? stat.score : 0.1 }];
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
function getDatasetsAverage() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { chapter, chapters } = useChapter();
    const ALL_STATUS = [...ClassUserStat.ALL_STATUS].reverse();
    const { getGlobalCountQuiz,getOneStat, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();
    const sortedStats = [...stats].filter(s => s.uid_chapter === chapter?.uid).sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
    const statsColors = [...ALL_STATUS].map((status, i) => {
        // const colors = COLORS;
        //const color = COLORS[i];
        //const colors = Object.values(COLORS);
        //  const color = colors[i];
        const colors = Object.values(COLORS_STATS);
        const color = colors.find(c => c.label === status);

        console.log("statsColors", color, color.background_bubble)
        return ({
            bg: color.background_bubble?.startsWith('var') ? convertToCSSChart(color.background_bubble) : color.background_bubble,
            border: color.border?.startsWith('var') ? convertToCSSChart(color.border) : color.border,
            bgHover: color.background_bubble?.startsWith('var') ? convertToCSSChart(color.background_bubble) : color.background_bubble,
            //border: randomColor(1),
        });
    });
    return ALL_STATUS.map((status, i) => {
        const chaptersStats = ClassUserStat.getStatsByStatus(sortedStats, status);
        //var statsMap = [{ x: t(s.status), y: s.score }];
        
        const percent = chaptersStats.length/sortedStats.length*100;
        var statsMap = chaptersStats.map(s => {
            //const byDate = ClassUserStat.getStatsByStatus(chaptersStats, status);
            const quiz = getGlobalCountQuiz(s.uid_lesson, s.uid_chapter, chaptersStats);
            
            const score = getGlobalScore(s.uid_lesson, s.uid_chapter, chaptersStats);
            const questions = getGlobalCountQuestions(s.uid_lesson, s.uid_chapter, chaptersStats);
            
            console.log("Staaaats by date", percent);
            return ({ x: t(s.status), y: percent, length: chaptersStats.length, score, questions,quiz })
        });
        //
        return ({
            label: `${t(status)} (${percent.toFixed(2)}%)` ,
            uidLesson:"",
            //data: stats.filter(s => s.uid_lesson === lesson.uid).map(s => s.score),
            data: statsMap,
            stat_uids: chaptersStats.map(s => s.uid) || "",
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
    });
}
function getTooltipAverage() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    const { getGlobalCountQuiz,getOneStat,getOneStatIndex, stat, setUidStat, isLoading: isLoadingStats, stats, getGlobalScore, getGlobalDuration, getGlobalCountQuestions, getGlobalPercent, getBestStat, getWorstStat, getGlobalCountLesson, getGlobalCountChapters, countHourTotalLessons } = useStat();

    const { chapter,} = useChapter();
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
                // tooltipItems est un array, prend le premier
                console.log("chart tooltip", tooltipItems[0])
                return tooltipItems[0].dataset.label; // nom de la leçon
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
            // Optionnel : footer
            footer: (tooltipItems) => {
                const average = tooltipItems[0].raw.y || 0;
                const length = tooltipItems[0].raw.length || 0;
                const score = tooltipItems[0].raw.score || 0;
                const questions = tooltipItems[0].raw.questions || 0;
                const quiz = tooltipItems[0].raw.quiz || 0;
                //const lessonsStats = [...sortedStats].filter(s => s.uid_lesson === lesson.uid) || [];
                return `${quiz} ${t('quizs')} → ${t('score')} : ${score}/${questions} | ${t('average')} : ${average.toFixed(2)}%`;
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
    }
    return tooltip;
}
export default function StatsChapterBarChart({ viewMode = ClassUserStat.VIEW_MODE_SCORE }) {
    const isViewScore = viewMode === ClassUserStat.VIEW_MODE_SCORE;
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION])
    const { isMobile } = useUserDevice();
    const {stats } = useStat();
    const { maxPoints, hasStats } = useMemo(() => {
        if (!isViewScore) return { maxPoints: 98, hasStats: stats.length > 0 }
        var max = 0;
        for (const stat of stats) {
            if (stat.answers.length > max) {
                max = stat.answers.length;
            }
        }
        return {
            maxPoints: max, hasStats: stats.length > 0
        }
    }, [stats]);
    const sortedStats = [...stats].sort((a, b) => a.end_date.getTime() - b.end_date.getTime());
    const statsDate = Array.from(new Set(sortedStats.map(s => s.end_date)));
    var labels = getLabelsScore();
    var datasets = getDatasetsScore();
    var tooltip = getTooltipScore();
    if (!isViewScore) {
        labels = getLabelsAverage();
        datasets = getDatasetsAverage();
        tooltip = getTooltipAverage();
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

    if (!hasStats) {
        return (<NoStatsComponent />)
    }
    return <Bar data={data} options={options} />;
}
function NoStatsComponent() {
    const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
    return (<Stack sx={{ p: 1.5, my: 1, border: '0.1px solid var(--card-border)' }} alignItems={'start'}>
        <Typography>{t('no-result')}</Typography>
    </Stack>)
}