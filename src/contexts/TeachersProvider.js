'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ClassUser, ClassUserIntern, ClassUserTeacher } from '@/classes/users/ClassUser';
import {
    doc,
    onSnapshot,
    collection,
    getDocs,
    query,
    where,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { useLanguage } from './LangProvider';
//import { PAGE_DAHBOARD_HOME, PAGE_HOME } from '@/lib/constants_pages';
import { useTranslation } from 'react-i18next';
import { NS_ERRORS } from '@/contexts/i18n/settings';
import { ClassRoom } from '@/classes/ClassRoom';
import { ClassHardware } from '@/classes/ClassDevice';
import { ClassLesson } from '@/classes/ClassLesson';
import { ClassSession } from '@/classes/ClassSession';

// import { ClassUser } from '@/classes/ClassUser';

const TeachersContext = createContext(null);
export const useTeachers = () => useContext(TeachersContext);

export function TeachersProvider({ children }) {
    const router = useRouter();
    const { lang } = useLanguage();
    const { t } = useTranslation([NS_ERRORS])

    const [uidTeacher, setUidTeacher] = useState('');           // ton user métier (ou snapshot)
    const [teacher, setTeacher] = useState(null);           // ton user métier (ou snapshot)
    const [teachers, setTeachers] = useState([]);           // ton user métier (ou snapshot)
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    const [isErrorSignIn, setIsErrorSignIn] = useState(false);
    const [textErrorSignIn, setTextErrorSignIn] = useState('');
    const [provider, setProvider] = useState('');

    useEffect(() => {
        const listener = listenToTeachers();
        //console.log("uid school", uidSchool);
        return () => listener?.();
    }, []);
    // écoute du doc utilisateur
    const listenToTeachers = useCallback(() => {
        const colRef = ClassUserTeacher.colRef(); // par ex.
        const constraints = [where('role', '==', ClassUser.ROLE.TEACHER)];
        const q = constraints.length
            ? query(colRef, ...constraints)
            : colRef;
        //console.log("Col ref provider", colRef);
        const snapshotTeachers = onSnapshot(q, async (snap) => {
            // snap est un QuerySnapshot
            //console.log("snap", snap.size);
            if (snap.empty) {
                setTeachers([]);
                setTeacher(null);
                setIsLoading(false);
                return;
            }

            var _users = [];
            for (const doc of snap.docs) {
                const userData = doc.data();
                const lessons = await ClassLesson.fetchListFromFirestore(lang, [where("uid_teacher", "==", userData.uid)]);
                //console.log("list lessons", lessons);
                const teacher = new ClassUserTeacher({
                    ...userData.toJSON(),
                    lessons_uid: lessons.map(lesson => lesson.uid),
                    lessons: lessons,
                    // translate: translate,
                });
                _users.push(teacher);
            }
            //console.log("is not empty", _users);
            //_users =_users.sort((a, b) => a.first_name?.localeCompare(b.first_name));
            setTeachers(_users);
            //console.log("ROOMS provider", _rooms);
            setIsLoading(false);
        });
        return snapshotTeachers;
    }, []);
    // écoute du doc utilisateur
    const listenToTeacher = useCallback((uidTeacher) => {
       
        if (!uidTeacher) return;
        //const { uid } = uidTeacher;
        const ref = ClassUser.docRef(uidTeacher);
        const unsubscribe = onSnapshot(ref, async (snap) => {
            if (!snap.exists()) {
                setTeacher(null);
                //setIsConnected(false);
                //setIsLoading(false);
                return;
            }
            const teacher = snap.data();
            const { email_verified, status } = teacher;
            
            const lessons = await ClassLesson.fetchListFromFirestore(lang, [where("uid_teacher", "==", teacher.uid)]);
            const sessions = await ClassSession.fetchListFromFirestore([where("uid_teacher", "==", teacher.uid)]);
            teacher.lessons_uid = lessons.map(item => item.uid);
            teacher.lessons = lessons;
            teacher.sessions_uid = sessions.map(item => item.uid);
            teacher.sessions = sessions.map(session=>{
                session.lesson = lessons.find(lesson=>lesson.uid === session.uid_lesson);
                return session;
            });
            //setUser(_user);
            setTeacher(prev => {
                if (!prev || prev === null) return teacher.clone();
                prev.update(teacher.toJSON());
                return prev.clone();
            });
             console.log("0bject teacher", teacher);
            //setIsConnected(true);
            //setIsLoading(false);
            //setUser(fbUser);
            //setIsConnected(true);
            //setIsLoading(false);
        });
        return unsubscribe;
    }, []);
    useEffect(() => {
        const unsubUser = listenToTeacher(uidTeacher);
        return () => unsubUser?.();
    }, [uidTeacher]);

    function getOneTeacher(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return null;
        }
        const _user = teachers.find(item => item.uid === uid);
        return _user;
    }
    function getOneRoomName(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return '';
        }
        const _room = teachers.find(item => item.uid === uid);
        return _room?.name || '';
    }
    // session
    async function changeRoom(uid = '') {
        var _room = null;
        var existsRoom = await ClassRoom.alreadyExist(uid);
        if (existsRoom) {
            _room = await ClassRoom.fetchFromFirestore(uid);
        }
        setTeacher(_room);
    }
    // actions
    const value = {
        teachers,
        teacher,
        setUidTeacher,
        setTeacher,
        changeRoom,
        getOneTeacher,
        getOneRoomName,
        isLoading,
        isConnected,
        isErrorSignIn,
        textErrorSignIn,
    };
    //if (isLoading) return <LoadingComponent />;
    //if (!user) return (<LoginComponent />);
    return <TeachersContext.Provider value={value}>{children}</TeachersContext.Provider>;
}
