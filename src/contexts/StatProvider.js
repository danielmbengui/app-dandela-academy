'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    collectionGroup,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
//import { PAGE_DAHBOARD_HOME, PAGE_HOME } from '@/lib/constants_pages';
import { useTranslation } from 'react-i18next';
import { useRoom } from './RoomProvider';
import { ClassSession, ClassLessonSessionTranslate } from '@/classes/ClassSession';
import { useLanguage } from './LangProvider';
import { ClassUser, ClassUserAdministrator, ClassUserIntern, ClassUserTeacher } from '@/classes/users/ClassUser';
import { ClassRoom } from '@/classes/ClassRoom';
import { ClassLesson } from '@/classes/ClassLesson';
import Preloader from '@/components/shared/Preloader';
import { useAuth } from './AuthProvider';
import { ClassLessonChapter } from '@/classes/lessons/ClassLessonChapter';
import { ClassUserStat } from '@/classes/users/ClassUserStat';
import { useLesson } from './LessonProvider';
import { useChapter } from './ChapterProvider';
import { firestore } from './firebase/config';


const StatContext = createContext(null);
export const useStat = () => useContext(StatContext);

export function StatProvider({ children, uidLesson = "", uidChapter = "" }) {
    const { lang } = useLanguage();
    const { user } = useAuth();
    const { lesson, lessons, setUidLesson, getOneLesson } = useLesson();
    const { chapter, chapters, setUidChapter, getOneChapter } = useChapter();
    //if(!lesson || !chapter) return;
    useEffect(() => {
        async function init() {
            const _duration = await getLessonsEstimatedTime();
            setCountHourTotalLessons(_duration);
            console.log("chapters stat provider", chapters)
        }
        init();
    }, []);
    useEffect(()=>{
        if(uidLesson) {
            setUidLesson(uidLesson);
        } else {
            setUidLesson('')
        }
        if(uidChapter) {
            setUidChapter(uidChapter);
        } else {
            setUidChapter('');
        }
    }, [uidLesson, uidChapter])
    const [countHourTotalLessons, setCountHourTotalLessons] = useState(0);
    //const { t } = useTranslation([ClassSession.NS_COLLECTION]);
    //const { getOneRoomName } = useRoom();
    //const [uidChapter, setUidChapter] = useState(null);           // ton user métier (ou snapshot)
    //const [chapter, setChapter] = useState(null);           // ton user métier (ou snapshot)
    //const [chapters, setChapters] = useState([]);           // ton user métier (ou snapshot)
    const [subchapters, setSubchapters] = useState([]);           // ton user métier (ou snapshot)
    const [subchapter, setSubchapter] = useState([]);           // ton user métier (ou snapshot)
    const [uidStat, setUidStat] = useState(null);           // ton user métier (ou snapshot)
    const [stats, setStats] = useState([]);
    const [stat, setStat] = useState(null);
    const [lastStat, setLastStat] = useState(null);

    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSlots, setIsLoadingSlots] = useState(true);
    // const errorsTranslate = t('errors', { returnObjects: true });
    //  const successTranslate = t('success', { returnObjects: true });
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState(false);
    useEffect(() => {
        if (user && lessons.length>0 && chapters.length>0) {
            const listener = listenToStats(uidLesson, uidChapter);
            return () => listener?.();
        }
    }, [user, uidLesson, uidChapter,lessons, chapters]);
    useEffect(() => {
        if (user && uidStat) {
            const _stat = getOneStat(uidStat);
            //console.log("change uid stat", _stat.uid)
            setStat(_stat);
            const listener = listenToOneStat(uidStat);
            return () => listener?.();
        } else {
            setStat(null);
        }
    }, [user, uidStat]);

    // écoute du doc utilisateur
    const listenToStats = useCallback((uidLesson = "", uidChapter = "") => {
        if (!user || user === null) return;
        const colRef = ClassUserStat.colRef(user.uid); // par ex.
        const ref = collectionGroup(firestore, ClassUserStat.COLLECTION)
            .withConverter(ClassUserStat.converter);
        //const colRef = collection(firestore, ClassUser.COLLECTION, uid_user, this.COLLECTION).withConverter(this.converter);
        const constraints = [];
        if (uidLesson) {
            constraints.push(where("uid_lesson", "==", uidLesson));
            //constraints.push(where("status", "in", [ClassSession.STATUS.OPEN,ClassSession.STATUS.FULL,ClassSession.STATUS.SUBSCRIPTION_EXPIRED]));
        }
        if (uidChapter) {
            constraints.push(where("uid_chapter", "==", uidChapter));
        }                //const coll = this.colRef();
        /*
        const q = constraints.length
            ? query(colRef, ...constraints)
            : colRef;
            */
        const q = query(ref, ...constraints);
        //q.limit(1);
        const snapshotStats = onSnapshot(q, async (snap) => {
            // snap est un QuerySnapshot
            if (snap.empty) {
                setStats([]);
                //setChapter(null);
                setIsLoading(false);
                return;
            }
            var _chapters = [];
            var _stats = [];

            for (const snapshot of snap.docs) {
                const stat = snapshot.data();
                const lesson = lessons.find(l => l.uid === stat.uid_lesson);
                //const lesson = await ClassLesson.fetchFromFirestore(stat.uid_lesson, lang);
                const chapter = chapters.find(c => c.uid === stat.uid_chapter);
                //const chapter = await ClassLessonChapter.fetchFromFirestore(stat.uid_chapter, lang);
                //stat.update({ user: user });
                stat.update({ lesson: lesson });
                stat.update({ chapter: chapter });
                //console.log("staaats", stats)
                _stats.push(stat);
            }
            //_chapters = _chapters.sort((a, b) => a.uid_intern - b.uid_intern);
            _stats = _stats.sort((a, b) => b.end_date.getTime() - a.end_date.getTime());
            console.log("stats provider STAT",lessons, chapters)
            //setChapters(_chapters);
            setStats(_stats);
            //setLastStat(_stats.length > 0 ? _stats[0] : null);
            setIsLoading(false);
            //setStats(_stats);
            //setIsLoadingSlots(false);
        });
        return snapshotStats;
    }, [user, uidLesson, uidChapter,lessons, chapters]);
    const listenToOneStat = useCallback((uidStat = "") => {
        if (!user || !uidStat) {
            setStat(null);
            //setIsConnected(false);
            setIsLoading(false);
            return;
        }
        const uid = uidStat;
        const ref = ClassUserStat.docRef(user?.uid, uid);
        const unsubscribe = onSnapshot(ref, async (snap) => {
            if (!snap.exists()) {
                setStat(null);
                //setIsConnected(false);
                setIsLoading(false);
                return;
            }
            const _stat = snap.data();
            setUidLesson(_stat.uid_lesson);
            setUidChapter(_stat.uid_chapter);
            _stat.lesson = getOneLesson(_stat.uid_lesson);
            _stat.chapter = getOneChapter(_stat.uid_chapter);
            console.log("ONE STAT", _stat, chapters);
            //const lesson = _session.uid_lesson ? await ClassLesson.fetchFromFirestore(_session.uid_lesson, lang) : null;
            //const teacher = _session.uid_teacher ? await ClassUser.fetchFromFirestore(_session.uid_teacher) : null;
            //const room = _session.uid_room ? await ClassRoom.fetchFromFirestore(_session.uid_room) : null;
            //const translate = _stat.translates?.find(trans => trans.lang === lang);
            //_stat.translate = translate;
            /*
            const _quiz = _stat.quiz;
            const _questions = _quiz?.questions?.map(sub => {
                sub.translate = sub.getTranslate(lang);
                return sub;
            });
            _quiz.questions = _questions || [];
            _stat.quiz = _quiz;
            */
            /*
            const _stats = await new ClassUserStat({
                uid_user: user?.uid,
                uid_lesson: uidLesson,
                uid_chapter: _stat.uid,
            }).getStats();
            */

            setStat(_stat);
            /*
            setSubchapters(_stat.subchapters.map(sub => {
                sub.translate = sub.getTranslate(lang);
                return sub;
            }));
            */
            //setIsConnected(true);
            setIsLoading(false);
            //setUser(fbUser);
            //setIsConnected(true);
            //setIsLoading(false);
        });
        return unsubscribe;
    }, [user, uidStat]);

    async function refreshList() {
        var _sessions = [];
        const constraints = [];
        /*
        if (filterStatus !== 'all') {
            constraints.push(where("status", '==', filterStatus));
        }
        if (filterType !== 'all') {
            constraints.push(where("type", '==', filterType));
        }
        */
        _sessions = await ClassSession.fetchListFromFirestore(constraints);
        for (const session of _sessions) {
            //const lesson = snapshot.data();
            //const translate = await ClassLessonSessionTranslate.fetchFromFirestore(lesson.uid, lang);
            _sessions.push(new ClassSession({
                ...session.toJSON(),
                // translate: translate,
            }));
        }

        _sessions = _sessions.sort((a, b) => a.uid_intern - b.uid_intern);
        //setChapters(_sessions);
    }

    function getOneStat(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return null;
        }
        const _stat = stats.find(item => item.uid === uid);
        return _stat;
    }
    function getOneStatIndex(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return -1;
        }
        //const _stat = ;
        return stats.findIndex(item => item.uid === uid);
    }
    function getGlobalScore(uidLesson = "") {
        var total = 0;
        var scoreTotal = 0;
        if (uidLesson) {
            for (const stat of stats) {
                //const score = (stat.score / stat.answers.length) * 100;
                if (uidLesson && uidLesson === stat.uid_lesson) {
                    scoreTotal += stat.score;
                }
                total++;
            }
        } else {
            for (const stat of stats) {
                scoreTotal += stat.score;
                total++;
            }
        }
        return scoreTotal;
    }
    function getGlobalDuration(uidLesson = "") {
        var total = 0;
        var durationTotal = 0;
        if (uidLesson) {
            for (const stat of stats) {
                if (uidLesson === stat.uid_lesson) {
                    //const score = (stat.score / stat.answers.length) * 100;
                    durationTotal += stat.duration;
                    total++;
                }
            }
        } else {
            for (const stat of stats) {
                //const score = (stat.score / stat.answers.length) * 100;
                durationTotal += stat.duration;
                total++;
            }
        }

        return durationTotal;
    }
    function getGlobalCountQuestions() {
        var total = 0;
        var questionsTotal = 0;
        for (const stat of stats) {
            //const score = (stat.score / stat.answers.length) * 100;
            questionsTotal += stat.answers.length;
            total++;
        }
        return questionsTotal;
    }
    function getGlobalPercent(uidLesson = "", uidChapter = "") {
        var total = 0;
        var percentTotal = 0;
        if (uidLesson && uidChapter) {
            for (const stat of stats) {
                if (uidLesson === stat.uid_lesson && uidChapter === stat.uid_chapter) {
                    const percent = stat.answers.length>0 ? (stat.score / stat.answers.length) * 100 : 0;
                    percentTotal += percent;
                    total++;
                    //console.log("OK stats", stat.uid)
                }
            }
        } else if (uidLesson) {
            for (const stat of stats) {
                if (uidLesson === stat.uid_lesson) {
                    const percent = stat.answers.length>0 ? (stat.score / stat.answers.length) * 100 : 0;
                    percentTotal += percent;
                    total++;
                }
            }
        } else if (uidChapter) {
            for (const stat of stats) {
                if (uidChapter === stat.uid_chapter) {
                    const percent = stat.answers.length>0 ? (stat.score / stat.answers.length) * 100 : 0;
                    percentTotal += percent;
                    total++;
                }
            }
        } else {
            for (const stat of stats) {
                const percent = stat.answers.length>0 ? (stat.score / stat.answers.length) * 100 : 0;
                percentTotal += percent;
                total++;
            }
        }
        //console.log("wesh global", percentTotal,total, uidLesson,uidChapter,stats.length)
        return (percentTotal / total);
    }
    function getGlobalCountQuiz(uidLesson = "", uidChapter = "") {
        if (uidLesson && uidChapter) {
            return stats.filter(stat => stat.uid_lesson === uidLesson && stat.uid_chapter === uidChapter).length || 0;
        } else if (uidLesson) {
            return stats.filter(stat => stat.uid_lesson === uidLesson).length || 0;
        } else if (uidChapter) {
            return stats.filter(stat => stat.uid_chapter === uidChapter).length || 0;
        } else {
            return stats.length;
        }
    }
    function getGlobalCountLesson() {
        var total = 0;
        var percentTotal = 0;
        for (const stat of stats) {
            const percent = (stat.score / stat.answers.length) * 100;
            percentTotal += percent;
            total++;
        }
        return new Set(stats.map(stat => stat.uid_lesson)).size || 0;
    }
    function getGlobalCountChapters() {
        return new Set(stats.map(stat => stat.uid_chapter)).size || 0;
    }
    async function getLessonsEstimatedTime() {
        var total = 0;
        var timeTotal = 0;
        const lessons = await ClassLesson.fetchListFromFirestore(lang);
        for (const lesson of lessons) {
            const chapters = await ClassLessonChapter.fetchListFromFirestore(lang, [where("uid_lesson", "==", lesson.uid)]);
            for (const chapter of chapters) {
                timeTotal += chapter.estimated_end_duration;
            }
            //console.log("calculat time", lesson)
        }
        return timeTotal;
    }
    function getBestStat(uidLesson = "", uidChapter = "") {
        var total = 0;
        var percentTotal = 0;
        var maxScore = 0;
        var maxStat = null;
        if (uidLesson && uidChapter) {
            for (const stat of stats) {
                if (uidLesson === stat.uid_lesson && uidChapter === stat.uid_chapter) {
                    if (stat.score > maxScore) {
                        maxScore = stat.score;
                        maxStat = stat;
                    }
                }
            }
        } else if (uidLesson) {
            for (const stat of stats) {
                if (uidLesson === stat.uid_lesson) {
                    if (stat.score > maxScore) {
                        maxScore = stat.score;
                        maxStat = stat;
                    }
                }
            }
        } else if (uidChapter) {
            for (const stat of stats) {
                if (uidChapter === stat.uid_chapter) {
                    if (stat.score > maxScore) {
                        maxScore = stat.score;
                        maxStat = stat;
                    }
                }
            }
        } else {
            for (const stat of stats) {
                if (stat.score > maxScore) {
                    maxScore = stat.score;
                    maxStat = stat;
                }
            }
        }
        return maxStat;
    }
    function getWorstStat(uidLesson = "", uidChapter = "") {
        var total = 0;
        var percentTotal = 0;
        var maxScore = 1_000_000_000;
        var maxStat = null;
        if (uidLesson && uidChapter) {
            for (const stat of stats) {
                if (uidLesson === stat.uid_lesson && uidChapter === stat.uid_chapter) {
                    if (stat.score < maxScore) {
                        maxScore = stat.score;
                        maxStat = stat;
                    }
                }
            }
        } else if (uidLesson) {
            for (const stat of stats) {
                if (uidLesson === stat.uid_lesson) {
                    if (stat.score < maxScore) {
                        maxScore = stat.score;
                        maxStat = stat;
                    }
                }
            }
        } else if (uidChapter) {
            for (const stat of stats) {
                if (uidChapter === stat.uid_chapter) {
                    if (stat.score < maxScore) {
                        maxScore = stat.score;
                        maxStat = stat;
                    }
                }
            }
        } else {
            for (const stat of stats) {
                if (stat.score < maxScore) {
                    maxScore = stat.score;
                    maxStat = stat;
                }
            }
        }
        return maxStat;
    }
    // session
    function changeSession(uid = '', mode = '') {
        if (mode === 'create') {
            return new ClassSession();
        }
        var _lesson = chapters.find(item => item.uid === uid) || null;
        if (_lesson) {
            setStat(prev => {
                if (!prev) return _lesson.clone();
                prev.update(_lesson.toJSON());
                return prev.clone();
                //return(new Classse)
            });
        } else {
            setChapter(null);
        }
    }

    const value = {
        //create,
        //update,
        //remove,
        //success,
        //setSuccess,
        //textSuccess,
        chapters,
        //chapter,
        //setChapter,
        subchapters,
        subchapter,
        setSubchapter,
        changeSession,
        //refreshList,
        getOneStat,
        getOneStatIndex,
        getGlobalScore,
        getGlobalDuration,
        getGlobalCountQuestions,
        getGlobalPercent,
        getGlobalCountLesson,
        getGlobalCountChapters,
        getGlobalCountQuiz,
        getBestStat,
        getWorstStat,
        countHourTotalLessons,
        //,
        //filterType,
        //setFilterType,
        //filterStatus,
        //setFilterStatus,
        isLoading,
        isLoadingSlots,
        //setUidChapter,
        setUidStat,
        stat,
        lastStat,
        stats,
    };
    //if (isLoading) return <Preloader />;
    //if (!user) return (<LoginComponent />);
    return <StatContext.Provider value={value}>
        {children}
    </StatContext.Provider>;
}
