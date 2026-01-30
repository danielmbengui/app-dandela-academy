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
import { ClassLesson, ClassLessonTranslate } from '@/classes/ClassLesson';
import { useLanguage } from './LangProvider';
import { ClassUser, ClassUserAdministrator, ClassUserIntern, ClassUserTeacher } from '@/classes/users/ClassUser';
import { ClassRoom } from '@/classes/ClassRoom';
import { useAuth } from './AuthProvider';
import { usePathname } from 'next/navigation';


const LessonContext = createContext(null);
export const useLesson = () => useContext(LessonContext);

export function LessonProvider({ children, uidTeacher = null }) {
    const { lang } = useLanguage();
    const { user } = useAuth();
    const path = usePathname();
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
        if (user) {
            const listener = listenToLessons(uidTeacher);
            return () => listener?.();
        }
    }, [lang, uidTeacher, user]);
    useEffect(() => {
        if (user && uidLesson) {
            // Ne pas pré-remplir depuis la liste : elle peut être filtrée (ex. enabled === true)
            // et afficher une valeur incorrecte. On laisse listenToOneLesson fournir le document réel.
            setLesson(null);
            const listener = listenToOneLesson(uidLesson);
            return () => listener?.();
        } else {
            setLesson(null);
        }
    }, [user, uidLesson]);
    // écoute du doc utilisateur
    const listenToLessons = useCallback((uidTeacher) => {
        //if(!user) return;
        const colRef = ClassLesson.colRef(); // par ex.
        var constraints = [where("enabled", "==", true)];
        if (path.includes('admin')) {
            if (user && user instanceof ClassUserIntern) {
                constraints = constraints.slice(0, -1);
                //constraints.push(where("enabled", "==", true));
                //await ClassLesson.fetchListFromFirestore(lang, where("enabled", "==", true));
            }
        }

        if (uidTeacher) {
            constraints.push(where("uid_teacher", "==", uidTeacher));
        }

        const q = constraints.length > 0
            ? query(colRef, ...constraints)
            : colRef;
        const snapshotLessons = onSnapshot(q, async (snap) => {
            // snap est un QuerySnapshot

            if (snap.empty) {
                setLessons([]);
                setLesson(null);
                setIsLoading(false);
                return;
            }
            try {
                const _lessons = [];
                //await ClassLesson.fetchListFromFirestore(lang, where("enabled", "==", true));
                for (const snapshot of snap.docs) {
                    const _lesson = await snapshot.data();
                    const translate = _lesson.translates?.find(a => a.lang === lang);
                    const title = translate.title;
                    const subtitle = translate.subtitle;
                    const description = translate.description;
                    const photo_url = translate.photo_url;
                    const materials = translate.materials;
                    const goals = translate.goals;
                    const programs = translate.programs;
                    const prerequisites = translate.prerequisites;
                    const target_audiences = translate.target_audiences;
                    const notes = translate.notes;
                    const tags = translate.tags;
                    const teacher = await ClassUser.fetchFromFirestore(_lesson.uid_teacher);
                    const lesson_new = new ClassLesson({
                        ..._lesson.toJSON(),
                        translate,
                        title,
                        subtitle,
                        description,
                        photo_url,
                        teacher,
                        materials,
                        programs,
                        prerequisites,
                        goals,
                        target_audiences,
                        notes,
                        tags,
                        //teacher: teacher,
                    });
                    //lesson_new.translate = translate;
                    //lesson_new.teacher = teacher;
                    //console.log("lessons list provider", lesson_new)
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
                //_lessons = _lessons.sort((a, b) => a.uid_intern - b.uid_intern);
                setLessons(_lessons);
                setIsLoading(false);
            } catch (error) {
                // Error handled silently
            }
        });
        return snapshotLessons;
    }, [user]);
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
            const translate = _lesson.translates?.find(a => a.lang === lang);
            const title = translate.title;
            const subtitle = translate.subtitle;
            const description = translate.description;
            const photo_url = translate.photo_url;
            const materials = translate.materials;
            const goals = translate.goals;
            const programs = translate.programs;
            const prerequisites = translate.prerequisites;
            const target_audiences = translate.target_audiences;
            const notes = translate.notes;
            const tags = translate.tags;
            const teacher = await ClassUser.fetchFromFirestore(_lesson.uid_teacher);
            //const translate = await ClassLessonSessionTranslate.fetchFromFirestore(lesson.uid, lang);
            const lesson_new = new ClassLesson({
                ..._lesson.toJSON(),
                //translates:_lesson.translates,
                translate,
                title,
                subtitle,
                description,
                photo_url,
                teacher,
                materials,
                programs,
                prerequisites,
                goals,
                target_audiences,
                notes,
                tags,
            });
            // console.log("Lesson provider", lesson_new, lesson_new.clone())
            //lesson_new.lesson = lesson;
            //lesson_new.teacher = teacher;
            //lesson_new.room = room;
            //lesson_new.translate = translate;
            //lesson_new.teacher = teacher;
            setLesson(prev => {
                if (!prev || prev === null) return lesson_new.clone();
                //prev.update(lesson_new.toJSON());
                prev = lesson_new.clone();
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
