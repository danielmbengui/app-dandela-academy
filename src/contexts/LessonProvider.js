'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    onSnapshot,
    where,
} from 'firebase/firestore';
//import { PAGE_DAHBOARD_HOME, PAGE_HOME } from '@/lib/constants_pages';
import { useTranslation } from 'react-i18next';
import { useRoom } from './RoomProvider';
import { ClassLesson, ClassLessonTranslate } from '@/classes/ClassLesson';
import { useLanguage } from './LangProvider';
import { ClassUserTeacher } from '@/classes/users/ClassUser';
import { ClassRoom } from '@/classes/ClassRoom';


const LessonContext = createContext(null);
export const useLesson = () => useContext(LessonContext);

export function LessonProvider({ children }) {
    const { lang } = useLanguage();
    const { t } = useTranslation([ClassLesson.NS_COLLECTION]);
    //const { getOneRoomName } = useRoom();
    const [uidLesson, setUidLesson] = useState(null);           // ton user métier (ou snapshot)
    const [lesson, setLesson] = useState(null);           // ton user métier (ou snapshot)
    const [lessons, setLessons] = useState([]);           // ton user métier (ou snapshot)
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [isLoading, setIsLoading] = useState(true);
    const errorsTranslate = t('errors', { returnObjects: true });
    const successTranslate = t('success', { returnObjects: true });
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState(false);
    useEffect(() => {
        const listener = listenToLessons();
        return () => listener?.();
    }, [lang]);
    useEffect(() => {
        if (uidLesson) {
            const _lesson = getOneLesson(uidLesson);
            setLesson(_lesson);
            const listener = listenToOneLesson(uidLesson);
            return () => listener?.();
        } else {
            setLesson(null);
        }
    }, [uidLesson]);
    // écoute du doc utilisateur
    const listenToLessons = useCallback(() => {
        const colRef = ClassLesson.colRef(); // par ex.
        const snapshotLessons = onSnapshot(colRef, async (snap) => {
            // snap est un QuerySnapshot
            if (snap.empty) {
                setLessons([]);
                setLesson(null);
                setIsLoading(false);
                return;
            }
            var _lessons = [];
            for (const snapshot of snap.docs) {
                const lesson = await snapshot.data();

                //const teacher = await ClassUserTeacher.fetchFromFirestore(lesson.uid_teacher);
                const translate = await ClassLessonTranslate.fetchFromFirestore(lesson.uid, lang);
                const lesson_new = new ClassLesson({
                    ...lesson.toJSON(),
                    //translate: translate,
                });
                lesson_new.translate = translate;
                //lesson_new.teacher = teacher;
                _lessons.push(lesson_new);
            }
            /*
            var _lessons = snap.docs.map(async (doc) => {
                const lesson = doc.data();
                const translates = await ClassLessonTranslate.fetchListFromFirestore(lesson.uid);
                
                return new ClassLesson({
                    ...lesson.toJSON(),
                    translates:translates,
                })
            });
            */
            _lessons = _lessons.sort((a, b) => a.uid_intern - b.uid_intern);
            setLessons(_lessons);
            setIsLoading(false);
        });
        return snapshotLessons;
    }, []);
    const listenToOneLesson = useCallback((uidLesson) => {
        if (!uidLesson) {
            setLesson(null);
            //setIsConnected(false);
            setIsLoading(false);
            return;
        }
        const uid = uidLesson;
        const ref = ClassLesson.docRef(uid);
        const unsubscribe = onSnapshot(ref, async (snap) => {
            if (!snap.exists()) {
                setLesson(null);
                //setIsConnected(false);
                setIsLoading(false);
                return;
            }
            const _lesson = snap.data();
            //const lesson = _lesson.uid_lesson ? await ClassLesson.fetchFromFirestore(_lesson.uid_lesson, lang) : null;
            //const teacher = _lesson.uid_teacher ? await ClassUserTeacher.fetchFromFirestore(_lesson.uid_teacher) : null;
            const room = _lesson.uid_room ? await ClassRoom.fetchFromFirestore(_lesson.uid_room) : null;
            const translate = await ClassLessonTranslate.fetchFromFirestore(_lesson.uid, lang);
            const translates = await ClassLessonTranslate.fetchListFromFirestore(_lesson.uid);
            //const translate = await ClassLessonSessionTranslate.fetchFromFirestore(lesson.uid, lang);
            const lesson_new = new ClassLesson({
                ..._lesson.toJSON(),
                // translate: translate,
            });
            //lesson_new.lesson = lesson;
            //lesson_new.teacher = teacher;
            lesson_new.room = room;
            lesson_new.translate = translate;
            lesson_new.translates = translates;
            setLesson(prev => {
                if (!prev || prev === null) return lesson_new;
                prev.update(lesson_new.toJSON());
                //const session_new = new ClassSession(session_new.toJSON());
                //prev.lesson = lesson;
                //prev.teacher = teacher;
                //prev.room = room;
                return prev;
            });
            //setIsConnected(true);
            setIsLoading(false);
            //setUser(fbUser);
            //setIsConnected(true);
            //setIsLoading(false);
        });
        return unsubscribe;
    }, [uidLesson]);
    async function refreshList() {
        var _lessons = [];
        const constraints = [];
        /*
        if (filterStatus !== 'all') {
            constraints.push(where("status", '==', filterStatus));
        }
        if (filterType !== 'all') {
            constraints.push(where("type", '==', filterType));
        }
        */
        _lessons = await ClassLesson.fetchListFromFirestore(lang, constraints);
        _lessons = _lessons.sort((a, b) => a.uid_intern - b.uid_intern);
        setLessons(_lessons);
    }
    async function create(_lesson = null) {
        if (!_lesson || _lesson === null || !(_lesson instanceof ClassLesson)) return;
        setIsLoading(true);
        var newLesson = await _lesson.createFirestore();
        try {

            if (newLesson) {
                setLesson(newLesson);
                setSuccess(true);
                setTextSuccess(successTranslate.create);
            } else {
                setLesson(null);
                setSuccess(true);
                setTextSuccess('');
            }
        } catch (error) {
            console.log("ERROR", error)
            return;
        } finally {
            setIsLoading(false);
        }
        return newLesson;
    }
    async function update(_lesson = null) {
        if (!_lesson || _lesson === null || !(_lesson instanceof ClassLesson)) return;
        setIsLoading(true);
        //var newDevice = await _device.createFirestore();
        var updatedLesson = await _lesson.updateFirestore();
        try {
            if (updatedLesson) {
                setLesson(updatedLesson);
                setSuccess(true);
                setTextSuccess(successTranslate.edit);
            } else {
                setLesson(null);
                setSuccess(false);
                setTextSuccess('');
            }
        } catch (error) {
            console.log("ERROR", error)
            return;
        } finally {
            setIsLoading(false);
        }
        return updatedLesson;
    }
    async function remove() {
        if (!lesson || lesson === null || !(lesson instanceof ClassLesson)) return;
        setIsLoading(true);
        //var newDevice = await _device.createFirestore();
        const _removed = await lesson.removeFirestore();
        try {
            if (_removed) {
                setLesson(null);
                setSuccess(true);
                setTextSuccess(successTranslate.remove);
            } else {
                setSuccess(false);
                setTextSuccess('');
            }
        } catch (error) {
            console.log("ERROR", error)
            return;
        } finally {
            setIsLoading(false);
        }
        return _removed;
    }
    function getOneLesson(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return null;
        }
        const _lesson = lessons.find(item => item.uid === uid);
        return _lesson;
    }

    // session
    function changeLesson(uid = '', mode = '') {
        var _lesson = lessons.find(item => item.uid === uid) || null;
        if (mode === 'create') {
            _lesson = new ClassLesson();
        }
        setLesson(_lesson);
    }

    const value = {
        setUidLesson,
        create,
        update,
        remove,
        success,
        setSuccess,
        textSuccess,
        lessons,
        lesson,
        setLesson,
        changeLesson,
        refreshList,
        getOneLesson,
        //,
        filterType,
        setFilterType,
        filterStatus,
        setFilterStatus,
        isLoading,
    };
    //if (isLoading) return <LoadingComponent />;
    //if (!user) return (<LoginComponent />);
    return <LessonContext.Provider value={value}>
        {children}
    </LessonContext.Provider>;
}
