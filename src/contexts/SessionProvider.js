'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    onSnapshot,
    where,
} from 'firebase/firestore';
//import { PAGE_DAHBOARD_HOME, PAGE_HOME } from '@/lib/constants_pages';
import { useTranslation } from 'react-i18next';
import { useRoom } from './RoomProvider';
import { ClassLessonSession, ClassLessonSessionTranslate } from '@/classes/ClassLessonSession';
import { useLanguage } from './LangProvider';
import { ClassUserTeacher } from '@/classes/users/ClassUser';
import { ClassRoom } from '@/classes/ClassRoom';


const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }) {
    const { lang } = useLanguage();
    const { t } = useTranslation([ClassLessonSession.NS_COLLECTION]);
    //const { getOneRoomName } = useRoom();
    const [session, setSession] = useState(null);           // ton user métier (ou snapshot)
    const [sessions, setSessions] = useState([]);           // ton user métier (ou snapshot)
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [isLoading, setIsLoading] = useState(true);
    // const errorsTranslate = t('errors', { returnObjects: true });
    //  const successTranslate = t('success', { returnObjects: true });
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState(false);
    useEffect(() => {
        const listener = listenToLessons();
        return () => listener?.();
    }, [lang]);
    useEffect(() => {
        refreshList();
    }, [session]);
    // écoute du doc utilisateur
    const listenToLessons = useCallback(() => {
        const colRef = ClassLessonSession.colRef(); // par ex.
        // console.log("Col ref provider", colRef);
        const snapshotLessons = onSnapshot(colRef, async (snap) => {
            // snap est un QuerySnapshot
            //console.log("snap", snap.size);
            if (snap.empty) {
                setSessions([]);
                setSession(null);
                setIsLoading(false);
                return;
            }
            //console.log("is not empty", snap.docs.map(doc => doc.data()));
            var _sessions = [];
            for (const snapshot of snap.docs) {
                const lesson = snapshot.data();
                const teacher = lesson.uid_teacher ? await ClassUserTeacher.fetchFromFirestore(lesson.uid_teacher) : null;
                const room = lesson.uid_room ? await ClassRoom.fetchFromFirestore(lesson.uid_room) : null;
                //console.log("IS teacher", teacher)
                //const translate = await ClassLessonSessionTranslate.fetchFromFirestore(lesson.uid, lang);
                const lesson_new = new ClassLessonSession({
                    ...lesson.toJSON(),
                    // translate: translate,
                });
                lesson_new.teacher = teacher;
                lesson_new.room = room;
                _sessions.push(lesson_new);
            }
            _sessions = _sessions.sort((a, b) => a.uid_intern - b.uid_intern);
            console.log("OBJECT list SESSION", _sessions)
            setSessions(_sessions);
            setIsLoading(false);
        });
        return snapshotLessons;
    }, []);
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
        _sessions = await ClassLessonSession.fetchListFromFirestore(constraints);
        for (const session of _sessions) {
            //const lesson = snapshot.data();
            //const translate = await ClassLessonSessionTranslate.fetchFromFirestore(lesson.uid, lang);
            _sessions.push(new ClassLessonSession({
                ...session.toJSON(),
               // translate: translate,
            }));
        }

        _sessions = _sessions.sort((a, b) => a.uid_intern - b.uid_intern);
        setSessions(_sessions);
    }
    async function create(_lesson = null) {
        if (!_lesson || _lesson === null || !(_lesson instanceof ClassLessonSession)) return;
        setIsLoading(true);
        var newLesson = await _lesson.createFirestore();
        try {

            if (newLesson) {
                setSession(newLesson);
                setSuccess(true);
                // setTextSuccess(successTranslate.create);
            } else {
                setSession(null);
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
        if (!_lesson || _lesson === null || !(_lesson instanceof ClassLessonSession)) return;
        setIsLoading(true);
        //var newDevice = await _device.createFirestore();
        var updatedLesson = await _lesson.updateFirestore();
        try {
            if (updatedLesson) {
                setSession(updatedLesson);
                setSuccess(true);
                // setTextSuccess(successTranslate.edit);
            } else {
                setSession(null);
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
        if (!session || session === null || !(session instanceof ClassLessonSession)) return;
        setIsLoading(true);
        //var newDevice = await _device.createFirestore();
        const _removed = await session.removeFirestore();
        try {
            if (_removed) {
                setSession(null);
                setSuccess(true);
                //  setTextSuccess(successTranslate.remove);
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

    function getOneSession(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return null;
        }
        const _lesson = sessions.find(item => item.uid === uid);
        return _lesson;
    }

    // session
    function changeSession(uid = '', mode = '') {
        var _lesson = sessions.find(item => item.uid === uid) || null;
        if (mode === 'create') {
            _lesson = new ClassLessonSession();
        }
        setSession(_lesson);
    }

    const value = {
        create,
        update,
        remove,
        success,
        setSuccess,
        textSuccess,
        sessions,
        session,
        setSession,
        changeSession,
        refreshList,
        getOneSession,
        //,
        filterType,
        setFilterType,
        filterStatus,
        setFilterStatus,
        isLoading,
    };
    //if (isLoading) return <LoadingComponent />;
    //if (!user) return (<LoginComponent />);
    return <SessionContext.Provider value={value}>
        {children}
    </SessionContext.Provider>;
}
