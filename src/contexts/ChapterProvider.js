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
import { firestore } from './firebase/config';


const ChapterContext = createContext(null);
export const useChapter = () => useContext(ChapterContext);

export function ChapterProvider({ children, uidLesson = "" }) {
    const { lang } = useLanguage();
    const { user } = useAuth();
    const { t } = useTranslation([ClassSession.NS_COLLECTION]);
    //const { getOneRoomName } = useRoom();
    const [uidChapter, setUidChapter] = useState(null);           // ton user métier (ou snapshot)
    const [chapter, setChapter] = useState(null);           // ton user métier (ou snapshot)
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
            const listener = listenToChapters(uidLesson);
            return () => listener?.();
        }
    }, [user, uidLesson]);

    useEffect(() => {
        if (user && uidLesson && uidChapter) {
            const _chapter = getOneChapter(uidChapter);
            setChapter(_chapter);
            const listener = listenToOneChapter(uidLesson, uidChapter);
            return () => listener?.();
        } else {
            setChapter(null);
        }
    }, [user, uidLesson, uidChapter]);

    // écoute du doc utilisateur
    const listenToChapters = useCallback((uidLesson = "") => {
        //if (!user || user === null) return;
        //const colRef = ClassLessonChapter.colRef(uidLesson); // par ex.
        const ref = ClassLessonChapter.colRef(); // par ex.;
        const constraints = [];
        if (uidLesson) {
            constraints.push(where("uid_lesson", "==", uidLesson));
        }
        /*           //const coll = this.colRef();
        const q = constraints.length
            ? query(colRef, ...constraints)
            : colRef;
            */
        const q = query(ref, ...constraints);
        const snapshotChapters = onSnapshot(q, async (snap) => {
            // snap est un QuerySnapshot
            if (snap.empty) {
                setChapters([]);
                setChapter(null);
                setIsLoading(false);
                return;
            }
            var _chapters = [];
            var _stats = [];

            for (const snapshot of snap.docs) {
                const chapter = snapshot.data();
                chapter.translate = chapter.translates?.find(trans => trans.lang === lang);
                const _subchapters = chapter.subchapters?.map(sub => {
                    sub.translate = sub.getTranslate(lang);
                    return sub;
                });
                const _quiz = chapter.quiz || null;
                console.log("QUIZ", _quiz);

                if (_quiz && _quiz?.questions) {
                    const _questions = _quiz?.questions?.map(sub => {
                        sub.translate = sub.getTranslate(lang);
                        return sub;
                    });
                    _quiz.questions = _questions;
                }

                chapter.quiz = _quiz;
                chapter.subchapters = _subchapters;

                //console.log("chap", chapter, uidLesson)
                _chapters.push(chapter);
                /*
                const stats = await new ClassUserStat({
                    uid_user: user.uid,
                    uid_lesson: uidLesson,
                    uid_chapter: chapter.uid,
                }).getStats();
                */
                //console.log("staaats", stats)
                //_stats.push(...stats);
            }
            _chapters = _chapters.sort((a, b) => a.uid_intern - b.uid_intern);
            //_stats = _stats.sort((a, b) => b.end_date.getTime() - a.end_date.getTime());
            //console.log("providers CHAPTER", _chapters)
            setChapters(_chapters);
            //setStats(_stats);
            //setLastStat(_stats.length > 0 ? _stats[0] : null);
            setIsLoading(false);
            //setStats(_stats);
            setIsLoadingSlots(false);
        });
        return snapshotChapters;
    }, [uidLesson]);
    const listenToOneChapter = useCallback((uidLesson = "", uidChapter = "") => {
        if (!uidChapter) {
            setChapter(null);
            //setIsConnected(false);
            setIsLoading(false);
            return;
        }
        const uid = uidChapter;
        const ref = ClassLessonChapter.colRef(); // par ex.;
        const constraints = [where("uid", "==", uidChapter)];
        if (uidLesson) {
            constraints.push(where("uid_lesson", "==", uidLesson));
        }
        const q = query(ref, ...constraints);
        const unsubscribe = onSnapshot(q, async (snap) => {
            if (snap.empty) {
                setChapter(null);
                //setIsConnected(false);
                setIsLoading(false);
                return;
            }
            const _chapter = snap.docs[0].data();
            //const lesson = _session.uid_lesson ? await ClassLesson.fetchFromFirestore(_session.uid_lesson, lang) : null;
            //const teacher = _session.uid_teacher ? await ClassUser.fetchFromFirestore(_session.uid_teacher) : null;
            //const room = _session.uid_room ? await ClassRoom.fetchFromFirestore(_session.uid_room) : null;
            const translate = _chapter.translates?.find(trans => trans.lang === lang);
            _chapter.translate = translate;
            const title = translate.title;
            const subtitle = translate.subtitle;
            const description = translate.description;
            const photo_url = translate.photo_url;
            const goals = translate.goals;
            const subchapters_title = translate.subchapters_title;
            _chapter.title = title;
            _chapter.subtitle = subtitle;
            _chapter.description = description;
            _chapter.photo_url = photo_url;
            _chapter.goals = goals;
            _chapter.subchapters_title = subchapters_title;
            const _subchapters = _chapter.subchapters?.map(sub => {
                const _translate = sub.getTranslate(lang);
                sub.translate = _translate;
                sub.title = _translate.title;
                sub.goals = _translate.goals;
                sub.exercises = _translate.exercises;
                sub.keys = _translate.keys;
                return sub;
            });
            const _quiz = _chapter.quiz || null;
            if (_quiz && _quiz?.questions) {
                const _questions = _quiz.questions?.map(sub => {
                    sub.translate = sub.getTranslate(lang);
                    return sub;
                });
                _quiz.questions = _questions;
            }
            _chapter.quiz = _quiz;
            _chapter.subchapters = _subchapters;
            console.log("subchaptersss", _subchapters);
            /*
            const _stats = await new ClassUserStat({
                uid_user: user?.uid,
                uid_lesson: uidLesson,
                uid_chapter: _chapter.uid,
            }).getStats();
            */
            setChapter(prev => {
                if (!prev || prev === null) return _chapter.clone();
                prev.update(_chapter.toJSON());
                //prev.update({quiz:_quiz});
                //console.log("QUESTIONS", _questions)
                //const session_new = new ClassSession(session_new.toJSON());
                //prev.lesson = lesson;
                //prev.teacher = teacher;
                //prev.room = room;
                return prev.clone();
            });
            setSubchapters(_chapter.subchapters.map(sub => {
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
    }, [uidChapter, uidLesson]);

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
    function getOneChapter(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return null;
        }
        const _chapter = chapters.find(item => item.uid === uid);
        return _chapter;
    }
    function changeSession(uid = '', mode = '') {
        if (mode === 'create') {
            return new ClassSession();
        }
        var _lesson = chapters.find(item => item.uid === uid) || null;
        if (_lesson) {
            setChapter(prev => {
                if (!prev) return _lesson.clone();
                prev.update(_lesson.toJSON());
                return prev.clone();
                //return(new Classse)
            });
        } else {
            setChapter(null);
        }
    }
    function getMinLevel(uidLesson = "") {
        const allLevels = ClassLessonChapter.ALL_LEVELS.map((level, i) => ({ id: i + 1, value: level })) || [];
        if (!allLevels.length || chapters.length === 0) return { id: 0, value: 0 };
        const lastIndex = allLevels.length - 1;
        var minChapter = allLevels[lastIndex];
        var chaptersFiletered = [...chapters];
        if (uidLesson) {
            chaptersFiletered = [...chapters].filter(c => c.uid_lesson === uidLesson);
        }
        //const chapters = await ClassLessonChapter.fetchListFromFirestore(lang, [where("uid_lesson", "==", this._uid)]);
        for (const c of chaptersFiletered) {
            const levelChapter = allLevels.find(level => level.value === c.level);
            if (!levelChapter) return;

            if (levelChapter.id < minChapter.id) {
                minChapter = levelChapter;
            }
        }
        return { id: minChapter.id, value: minChapter.value };
    }
    function getMaxLevel(uidLesson = "") {
        const allLevels = ClassLessonChapter.ALL_LEVELS.map((level, i) => ({ id: i + 1, value: level })) || [];
        if (!allLevels.length || chapters.length === 0) return { id: 0, value: 0 };
        const lastIndex = allLevels.length - 1;
        var maxChapter = allLevels[lastIndex];
        var chaptersFiletered = [...chapters];
        if (uidLesson) {
            chaptersFiletered = [...chapters].filter(c => c.uid_lesson === uidLesson);
        }
        //const chapters = await ClassLessonChapter.fetchListFromFirestore(lang, [where("uid_lesson", "==", this._uid)]);
        for (const c of chaptersFiletered) {
            const levelChapter = allLevels.find(level => level.value === c.level);
            if (!levelChapter) continue;
            if (levelChapter.id >= maxChapter.id) {
                maxChapter = levelChapter;
            }
        }
        // console.log("max", maxChapter.value);

        return { id: maxChapter.id, value: maxChapter.value };
    }
    function getCountSubchapters() {
        var count = 0;
        //const chapters = await ClassLessonChapter.fetchListFromFirestore(lang, [where("uid_lesson", "==", this._uid)]);
        for (const c of chapters) {
            count += c.subchapters?.length || 0;
        }
        //console.log("count subchapters", count);

        return count;
    }
    /**
 * Estime le temps par chapitre à partir d'une fourchette totale (min/max) et du niveau.
 * Retourne une liste de chapitres avec duration_min / duration_max (en minutes).
 */
    function estimateChapterTimes({
        totalMinHours,
        totalMaxHours,
        chapterCount,
        level = "beginner", // "beginner" | "intermediate" | "advanced"
    }) {
        if (!Number.isFinite(chapterCount) || chapterCount <= 0) {
            throw new Error("chapterCount invalide");
        }
        if (![totalMinHours, totalMaxHours].every(Number.isFinite) || totalMinHours <= 0 || totalMaxHours <= 0) {
            throw new Error("totalMinHours/totalMaxHours invalides");
        }
        const minH = Math.min(totalMinHours, totalMaxHours);
        const maxH = Math.max(totalMinHours, totalMaxHours);

        const totalMin = Math.round(minH * 60);
        const totalMax = Math.round(maxH * 60);

        // Variance selon niveau (plus avancé => plus hétérogène)
        const levelVariance = {
            [ClassLessonChapter.LEVEL.BEGINNER]: 0.10,
            [ClassLessonChapter.LEVEL.INTERMEDIATE]: 0.18,
            [ClassLessonChapter.LEVEL.COMPETENT]: 0.28,
            [ClassLessonChapter.LEVEL.ADVANCED]: 0.34,
            [ClassLessonChapter.LEVEL.EXPERT]: 0.42,
        }[level] ?? 0.15;

        // Poids progressifs (les chapitres plus loin sont souvent plus denses)
        // Tu peux remplacer ça par des poids venant de tes datas (nb de leçons, vidéos, mots, etc.)
        const baseWeights = Array.from({ length: chapterCount }, (_, i) => {
            const t = chapterCount === 1 ? 1 : i / (chapterCount - 1); // 0..1
            return 1 + (t - 0.5) * 2 * levelVariance; // autour de 1, un peu + vers la fin
        });

        // Normaliser pour que la somme des poids = 1
        const sumW = baseWeights.reduce((a, b) => a + b, 0);
        const weights = baseWeights.map(w => w / sumW);

        // Répartir min/max sur les chapitres
        const rawMin = weights.map(w => w * totalMin);
        const rawMax = weights.map(w => w * totalMax);

        // Arrondir en gardant la somme exacte (méthode des plus grands restes)
        const roundKeepSum = (arr, targetSum) => {
            const floors = arr.map(x => Math.floor(x));
            let diff = targetSum - floors.reduce((a, b) => a + b, 0);
            const remainders = arr
                .map((x, i) => ({ i, r: x - floors[i] }))
                .sort((a, b) => b.r - a.r);

            const out = [...floors];
            for (let k = 0; k < remainders.length && diff > 0; k++, diff--) {
                out[remainders[k].i] += 1;
            }
            return out;
        };

        const chapterMin = roundKeepSum(rawMin, totalMin);
        const chapterMax = roundKeepSum(rawMax, totalMax);
        //console.log("MIN MAX", totalMin, totalMax)
        //var min = 0;
        //var totalMax = 0;

        return Array.from({ length: chapterCount }, (_, i) => ({
            chapterIndex: i + 1,
            duration_min: chapterMin[i],
            duration_max: chapterMax[i],
        }));
    }


    const value = {
        //create,
        //update,
        //remove,
        //success,
        //setSuccess,
        //textSuccess,
        chapters,
        chapter,
        setChapter,
        subchapters,
        subchapter,
        setSubchapter,
        changeSession,
        //refreshList,
        getOneChapter,
        //,
        //filterType,
        //setFilterType,
        //filterStatus,
        //setFilterStatus,
        isLoading,
        isLoadingSlots,
        setUidChapter,
        setUidStat,
        stat,
        lastStat,
        stats,
        getMinLevel,
        getMaxLevel,
        getCountSubchapters,
        estimateChapterTimes,
    };
    //if (isLoading) return <Preloader />;
    //if (!user) return (<LoginComponent />);
    return <ChapterContext.Provider value={value}>
        {children}
    </ChapterContext.Provider>;
}
