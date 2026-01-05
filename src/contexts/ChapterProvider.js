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
            /*
            async function init() {
                const _chapters = await ClassLessonChapter.fetchListFromFirestore(lang);
                setChapters(_chapters);
                //console.log("LISTEN chapters init", _chapters)
            }
            init();
            */
            const listener = listenToChapters(uidLesson);
            return () => listener?.();
        }
    }, [user, uidLesson]);

    useEffect(() => {
        if (uidChapter) {
            const _chapter = getOneChapter(uidChapter);
            setChapter(_chapter);
            const listener = listenToOneChapter(uidLesson, uidChapter);
            return () => listener?.();
        } else {
            setChapter(null);
        }
    }, [uidLesson, uidChapter]);

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
                /*
                const _quiz = chapter.quiz;
                const _questions = _quiz.questions?.map(sub => {
                    sub.translate = sub.getTranslate(lang);
                    return sub;
                });
                _quiz.questions = _questions;
                chapter.quiz = _quiz;
                */
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
        if (!uidLesson || !uidChapter) {
            setChapter(null);
            //setIsConnected(false);
            setIsLoading(false);
            return;
        }
        const uid = uidChapter;
        const ref = ClassLessonChapter.docRef(uidLesson, uid);
        const unsubscribe = onSnapshot(ref, async (snap) => {
            if (!snap.exists()) {
                setChapter(null);
                //setIsConnected(false);
                setIsLoading(false);
                return;
            }
            const _chapter = snap.data();
            //const lesson = _session.uid_lesson ? await ClassLesson.fetchFromFirestore(_session.uid_lesson, lang) : null;
            //const teacher = _session.uid_teacher ? await ClassUser.fetchFromFirestore(_session.uid_teacher) : null;
            //const room = _session.uid_room ? await ClassRoom.fetchFromFirestore(_session.uid_room) : null;
            const translate = _chapter.translates?.find(trans => trans.lang === lang);
            console.log("Weeeeesh translate", _chapter)
            _chapter.translate = translate;
            /*
            const _quiz = _chapter.quiz;
            const _questions = _quiz.questions?.map(sub => {
                sub.translate = sub.getTranslate(lang);
                return sub;
            });
            _quiz.questions = _questions;
            _chapter.quiz = _quiz;
            */
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

    // session
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
    };
    //if (isLoading) return <Preloader />;
    //if (!user) return (<LoginComponent />);
    return <ChapterContext.Provider value={value}>
        {children}
    </ChapterContext.Provider>;
}
