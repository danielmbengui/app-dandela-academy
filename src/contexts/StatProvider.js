'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
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


const StatContext = createContext(null);
export const useStat = () => useContext(StatContext);

export function StatProvider({ children, uidLesson = "", uidChapter = "" }) {
    const { lang } = useLanguage();
    const { user } = useAuth();
    const { lesson } = useLesson();
    const { chapter } = useChapter();
    //if(!lesson || !chapter) return;
    useEffect(()=>{
        async function init() {
            const _duration = await getLessonsEstimatedTime();
            setCountHourTotalLessons(_duration);
        }
        init();
    }, []);
    const [countHourTotalLessons,setCountHourTotalLessons] = useState(0);
    //const { t } = useTranslation([ClassSession.NS_COLLECTION]);
    //const { getOneRoomName } = useRoom();
    //const [uidChapter, setUidChapter] = useState(null);           // ton user métier (ou snapshot)
    //const [chapter, setChapter] = useState(null);           // ton user métier (ou snapshot)
    const [chapters, setChapters] = useState([]);           // ton user métier (ou snapshot)
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
        if (user) {
            const listener = listenToStats(uidLesson, uidChapter);
            return () => listener?.();
        }
    }, [user, uidLesson, uidChapter]);
    useEffect(() => {
        if (user && uidLesson && uidChapter && uidStat) {
            const _stat = getOneStat(uidStat);
            console.log("change uid stat", _stat.uid)
            setStat(_stat);
            const listener = listenToOneStat(uidLesson, uidChapter, uidStat);
            return () => listener?.();
        } else {
            setStat(null);
        }
    }, [user, uidLesson, uidChapter, uidStat]);

    // écoute du doc utilisateur
    const listenToStats = useCallback((uidLesson = "", uidChapter = "") => {
        if (!user || user === null) return;
        const colRef = ClassUserStat.colRef(user.uid); // par ex.
        const constraints = [];
        if (uidLesson) {
            constraints.push(where("uid_lesson", "==", uidLesson));
            //constraints.push(where("status", "in", [ClassSession.STATUS.OPEN,ClassSession.STATUS.FULL,ClassSession.STATUS.SUBSCRIPTION_EXPIRED]));
        }
        if (uidChapter) {
            constraints.push(where("uid_chapter", "==", uidChapter));
        }                //const coll = this.colRef();
        const q = constraints.length
            ? query(colRef, ...constraints)
            : colRef;
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
                //const lesson = await ClassLesson.fetchFromFirestore(uidLesson,lang);
                //const chapter = await ClassLessonChapter.fetchFromFirestore(uidChapter,lang);
                stat.update({ user: user });
                stat.update({ lesson: lesson });
                stat.update({ chapter: chapter });
                //console.log("staaats", stats)
                _stats.push(stat);
            }
            //_chapters = _chapters.sort((a, b) => a.uid_intern - b.uid_intern);
            _stats = _stats.sort((a, b) => b.end_date.getTime() - a.end_date.getTime());
            console.log("stats provider STAT", _stats)
            //setChapters(_chapters);
            setStats(_stats);
            //setLastStat(_stats.length > 0 ? _stats[0] : null);
            setIsLoading(false);
            //setStats(_stats);
            //setIsLoadingSlots(false);
        });
        return snapshotStats;
    }, [user, uidLesson, uidChapter]);
    const listenToOneStat = useCallback((uidStat = "") => {
        if (!user || !uidStat) {
            setStat(null);
            //setIsConnected(false);
            setIsLoading(false);
            return;
        }
        const uid = uidChapter;
        const ref = ClassUserStat.docRef(user?.uid, uid);
        const unsubscribe = onSnapshot(ref, async (snap) => {
            if (!snap.exists()) {
                setStat(null);
                //setIsConnected(false);
                setIsLoading(false);
                return;
            }
            const _stat = snap.data();
            console.log("ONE STAT", _stat)
            //const lesson = _session.uid_lesson ? await ClassLesson.fetchFromFirestore(_session.uid_lesson, lang) : null;
            //const teacher = _session.uid_teacher ? await ClassUser.fetchFromFirestore(_session.uid_teacher) : null;
            //const room = _session.uid_room ? await ClassRoom.fetchFromFirestore(_session.uid_room) : null;
            const translate = _stat.translates?.find(trans => trans.lang === lang);
            _stat.translate = translate;
            const _quiz = _stat.quiz;
            const _questions = _quiz.questions?.map(sub => {
                sub.translate = sub.getTranslate(lang);
                return sub;
            });
            _quiz.questions = _questions;
            _stat.quiz = _quiz;
            const _stats = await new ClassUserStat({
                uid_user: user?.uid,
                uid_lesson: uidLesson,
                uid_chapter: _stat.uid,
            }).getStats();
            setStat(prev => {
                if (!prev || prev === null) return _stat.clone();
                prev.update(_stat.toJSON());
                //prev.update({quiz:_quiz});
                //console.log("QUESTIONS", _questions)
                //const session_new = new ClassSession(session_new.toJSON());
                //prev.lesson = lesson;
                //prev.teacher = teacher;
                //prev.room = room;
                return prev.clone();
            });
            setSubchapters(_stat.subchapters.map(sub => {
                sub.translate = sub.getTranslate(lang);
                return sub;
            }));
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
        setChapters(_sessions);
    }

    function getOneStat(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return null;
        }
        const _stat = stats.find(item => item.uid === uid);
        return _stat;
    }
    function getGlobalScore() {
        var total = 0;
        var scoreTotal = 0;
        for (const stat of stats) {
            //const score = (stat.score / stat.answers.length) * 100;
            scoreTotal += stat.score;
            total++;
        }
        return scoreTotal;
    }
    function getGlobalDuration() {
        var total = 0;
        var scoreTotal = 0;
        for (const stat of stats) {
            //const score = (stat.score / stat.answers.length) * 100;
            scoreTotal += stat.duration;
            total++;
        }
        return scoreTotal;
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
    function getGlobalPercent() {
        var total = 0;
        var percentTotal = 0;
        for (const stat of stats) {
            const percent = (stat.score / stat.answers.length) * 100;
            percentTotal += percent;
            total++;
        }
        return (percentTotal / total);
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
            const chapters = await ClassLessonChapter.fetchListFromFirestore(lesson.uid,lang);
            for(const chapter of chapters) {
                timeTotal += chapter.estimated_end_duration;
            }
            //console.log("calculat time", lesson)
        }
        return timeTotal;
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
        getGlobalScore,
        getGlobalDuration,
        getGlobalCountQuestions,
        getGlobalPercent,
        getGlobalCountLesson,
        getGlobalCountChapters,
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
