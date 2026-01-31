'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onSnapshot, query, where } from 'firebase/firestore';
import { ClassEvents } from '@/classes/ClassEvents';
import { useLanguage } from './LangProvider';

const EventsContext = createContext(null);
export const useEvents = () => useContext(EventsContext);

export function EventsProvider({ children }) {
    const { lang } = useLanguage();
    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(null);
    const [uidEvent, setUidEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const listenToEvents = useCallback(() => {
        const colRef = ClassEvents.colRef();
        const constraints = [
            where("status", "in", [ClassEvents.STATUS.OPEN, ClassEvents.STATUS.FULL, ClassEvents.STATUS.FINISHED])
        ];
        const q = query(colRef, ...constraints);
        const unsubscribe = onSnapshot(q, (snap) => {
            if (snap.empty) {
                setEvents([]);
                setIsLoading(false);
                return;
            }
            const _events = snap.docs.map(doc => doc.data());
            _events.sort((a, b) => (a.uid_intern || 0) - (b.uid_intern || 0));
            setEvents(_events);
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    const listenToOneEvent = useCallback((uid) => {
        if (!uid) {
            setEvent(null);
            setIsLoading(false);
            return () => {};
        }
        const ref = ClassEvents.docRef(uid);
        const unsubscribe = onSnapshot(ref, (snap) => {
            if (!snap.exists()) {
                setEvent(null);
                setIsLoading(false);
                return;
            }
            setEvent(snap.data());
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsub = listenToEvents();
        return () => unsub?.();
    }, [listenToEvents]);

    useEffect(() => {
        if (uidEvent) {
            setIsLoading(true);
            const unsub = listenToOneEvent(uidEvent);
            return () => unsub?.();
        } else {
            setEvent(null);
            setIsLoading(false);
        }
    }, [uidEvent, listenToOneEvent]);

    const getOneEvent = useCallback((uid) => {
        return events.find(e => e.uid === uid) || null;
    }, [events]);

    const setUidEventOne = useCallback((uid) => {
        setUidEvent(uid);
    }, []);

    async function subscribeToEvent(uidEventId, userUid) {
        const ev = event?.uid === uidEventId ? event : getOneEvent(uidEventId);
        if (!ev) return false;
        const instance = ev instanceof ClassEvents ? ev : new ClassEvents(ev);
        return await instance.subscribeStudentFirestore(userUid);
    }

    async function unsubscribeFromEvent(uidEventId, userUid) {
        const ev = event?.uid === uidEventId ? event : getOneEvent(uidEventId);
        if (!ev) return false;
        const instance = ev instanceof ClassEvents ? ev : new ClassEvents(ev);
        return await instance.unsubscribeStudentFirestore(userUid);
    }

    const value = {
        events,
        event,
        uidEvent,
        setUidEvent: setUidEventOne,
        isLoading,
        getOneEvent,
        subscribeToEvent,
        unsubscribeFromEvent,
    };

    return (
        <EventsContext.Provider value={value}>
            {children}
        </EventsContext.Provider>
    );
}
