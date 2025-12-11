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
import { ClassUserIntern, ClassUserTeacher } from '@/classes/users/ClassUser';
import { ClassRoom } from '@/classes/ClassRoom';
import { ClassLesson } from '@/classes/ClassLesson';
import Preloader from '@/components/shared/Preloader';
import { useAuth } from './AuthProvider';


const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }) {
    const { lang } = useLanguage();
    const { user } = useAuth();
    const { t } = useTranslation([ClassSession.NS_COLLECTION]);
    //const { getOneRoomName } = useRoom();
    const [uidSession, setUidSession] = useState(null);           // ton user métier (ou snapshot)
    const [session, setSession] = useState(null);           // ton user métier (ou snapshot)
    const [sessions, setSessions] = useState([]);           // ton user métier (ou snapshot)
    const [uidSlot, setUidSlot] = useState(null);           // ton user métier (ou snapshot)
    const [slots, setSlots] = useState([]);
    const [slot, setSlot] = useState(null);

    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [isLoading, setIsLoading] = useState(true);
    // const errorsTranslate = t('errors', { returnObjects: true });
    //  const successTranslate = t('success', { returnObjects: true });
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState(false);
    useEffect(() => {
        const listener = listenToSessions();
        return () => listener?.();
    }, []);
    useEffect(() => {
        if (uidSession) {
            const _session = getOneSession(uidSession);
            setSession(_session);
            const listener = listenToOneSession(uidSession);
            return () => listener?.();
        } else {
            setSession(null);
        }
    }, [uidSession]);
    useEffect(() => {
        if (uidSlot && session) {
            //const _session = getOneSession(uidSession);
            const _slot = session.slots?.find?.(a => a.uid_intern === uidSlot);
            //console.log("get one slot", _slot)
            setSlot(_slot);
        } else {
            setSlot(null);
        }
    }, [uidSlot, session]);

    // écoute du doc utilisateur
    const listenToSessions = useCallback(() => {
        const colRef = ClassSession.colRef(); // par ex.
        const constraints = [];
        if (!(user instanceof ClassUserIntern)) {
            constraints.push(where("status", "!=", ClassSession.STATUS.DRAFT));
        }                //const coll = this.colRef();
        const q = constraints.length
            ? query(colRef, ...constraints)
            : colRef;
        // console.log("Col ref provider", colRef);
        const snapshotSessions = onSnapshot(q, async (snap) => {
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
            var _slots = [];
            for (const snapshot of snap.docs) {
                const session = snapshot.data();
                const lesson = session.uid_lesson ? await ClassLesson.fetchFromFirestore(session.uid_lesson, lang) : null;
                const teacher = session.uid_teacher ? await ClassUserTeacher.fetchFromFirestore(session.uid_teacher) : null;
                const room = session.uid_room ? await ClassRoom.fetchFromFirestore(session.uid_room) : null;
                //console.log("IS teacher", teacher)
                //const translate = await ClassLessonSessionTranslate.fetchFromFirestore(lesson.uid, lang);
                const session_new = new ClassSession({
                    ...session.toJSON(),
                    // translate: translate,
                });
                session_new.lesson = lesson;
                session_new.teacher = teacher;
                session_new.room = room;
                _sessions.push(session_new);
                var _slots_session = session_new.slots;
                if (!(user instanceof ClassUserIntern)) {
                    //constraints.push(where("status", "!=", ClassSession.STATUS.DRAFT));
                    _slots_session = session_new.slots.filter(slot=>slot.status!==ClassSession.STATUS.DRAFT);
                }
                _slots.push(..._slots_session);
            }
            _sessions = _sessions.sort((a, b) => a.uid_intern - b.uid_intern);
            _slots = _slots.sort((a, b) => a.uid_intern - b.uid_intern);
           // console.log("OBJECT list SLOTS", _slots)
            setSessions(_sessions);
            setSlots(_slots);
            setIsLoading(false);
        });
        return snapshotSessions;
    }, []);
    const listenToOneSession = useCallback((uidSession) => {
        if (!uidSession) {
            setSession(null);
            //setIsConnected(false);
            setIsLoading(false);
            return;
        }
        const uid = uidSession;
        const ref = ClassSession.docRef(uid);
        const unsubscribe = onSnapshot(ref, async (snap) => {
            if (!snap.exists()) {
                setSession(null);
                //setIsConnected(false);
                setIsLoading(false);
                return;
            }
            const _session = snap.data();
            const lesson = _session.uid_lesson ? await ClassLesson.fetchFromFirestore(_session.uid_lesson, lang) : null;
            const teacher = _session.uid_teacher ? await ClassUserTeacher.fetchFromFirestore(_session.uid_teacher) : null;
            const room = _session.uid_room ? await ClassRoom.fetchFromFirestore(_session.uid_room) : null;
            //console.log("IS teacher", teacher)
            //const translate = await ClassLessonSessionTranslate.fetchFromFirestore(lesson.uid, lang);
            const session_new = new ClassSession({
                ..._session.toJSON(),
                // translate: translate,
            });
            session_new.lesson = lesson;
            session_new.teacher = teacher;
            session_new.room = room;

            setSession(prev => {
                if (!prev || prev === null) return session_new;
                prev.update(session_new.toJSON());
               // console.log('set prev session', session_new);
                return prev;
            });
            //setIsConnected(true);
            setIsLoading(false);
            //setUser(fbUser);
            //setIsConnected(true);
            //setIsLoading(false);
        });
        return unsubscribe;
    }, [uidSession]);

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
        setSessions(_sessions);
    }
    async function create(_lesson = null) {
        if (!_lesson || _lesson === null || !(_lesson instanceof ClassSession)) return;
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
        if (!_lesson || _lesson === null || !(_lesson instanceof ClassSession)) return;
        setIsLoading(true);
       // console.log("start update")
        //var newDevice = await _device.createFirestore();
        var updatedLesson = await _lesson.updateFirestore();
        //console.log("start update firestore", updatedLesson)
        try {
            if (updatedLesson) {
                //setSession(updatedLesson.clone());
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
        if (!session || session === null || !(session instanceof ClassSession)) return;
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
        //console.log("OBJECT list SESSION get one item", sessions)
        const _lesson = sessions.find(item => item.uid === uid);
        return _lesson;
    }

    // session
    function changeSession(uid = '', mode = '') {
        if (mode === 'create') {
            return new ClassSession();
        }
        var _lesson = sessions.find(item => item.uid === uid) || null;
        if (_lesson) {
            setSession(prev => {
                if (!prev) return _lesson.clone();
                prev.update(_lesson.toJSON());
                return prev.clone();
                //return(new Classse)
            });
        } else {
            setSession(null);
        }

     //   console.log("change session", _lesson)

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
        setUidSession,
        setUidSlot,
        slot,
        slots,
    };
    //if (isLoading) return <Preloader />;
    //if (!user) return (<LoginComponent />);
    return <SessionContext.Provider value={value}>
        {children}
    </SessionContext.Provider>;
}
