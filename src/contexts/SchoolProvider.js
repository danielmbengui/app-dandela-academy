'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ClassUser } from '@/classes/users/ClassUser';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    OAuthProvider,
    GoogleAuthProvider,
    TwitterAuthProvider,
    signInWithPopup,
    fetchSignInMethodsForEmail,
    sendSignInLinkToEmail,
    updatePassword,
} from 'firebase/auth';

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
import { translateWithVars } from '@/contexts/functions';
import { auth, firestore } from '@/contexts/firebase/config';
import { ClassUserExtern } from '@/classes/users/extern/ClassUserExtern';
import { ClassUserStudent } from '@/classes/users/extern/ClassUserStudent';
import { ClassUserProfessional } from '@/classes/users/extern/ClassUserProfessional';
import { PAGE_HOME } from '@/contexts/constants/constants_pages';
import { ClassUserIntern } from '@/classes/users/intern/ClassUserIntern';
import { ClassUserAdmin } from '@/classes/users/intern/ClassUserAdmin';
import { ClassUserTutor } from '@/classes/users/intern/ClassUserTutor';
import { ClassSchool } from '@/classes/ClassSchool';

// import { ClassUser } from '@/classes/ClassUser';

const COLLECTION_USERS = ClassUser.COLLECTION;
const SchoolContext = createContext(null);
export const useSchool = () => useContext(SchoolContext);

export function SchoolProvider({ children }) {
    const router = useRouter();
    const { lang } = useLanguage();
    const { t } = useTranslation([NS_ERRORS])

    const [school, setSchool] = useState(null);           // ton user métier (ou snapshot)
    const [schools, setSchools] = useState([]);           // ton user métier (ou snapshot)


    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    const [isErrorSignIn, setIsErrorSignIn] = useState(false);
    const [textErrorSignIn, setTextErrorSignIn] = useState('');
    const [provider, setProvider] = useState('');
    // écoute du doc utilisateur
    const listenToShools = useCallback(() => {
        const colRef = ClassSchool.colRef(); // par ex.
        const snapshotSchools = onSnapshot(colRef, async (snap) => {
            // snap est un QuerySnapshot
            if (snap.empty) {
                setSchools([]);
                setSchool(null);
                setIsLoading(false);
                return;
            }

            const _schools = snap.docs.map(docSnap => docSnap.data());
            setSchools(_schools);
            console.log("SCHOOL provider", _schools);
            // par exemple : garder la première école
            const _school = _schools[0];
            console.log("one school provider", _school);
            setSchool(prev => {
                if (!prev) return _school;
                if (prev?.update) {
                    prev.update(_school.toJSON()); // ou data.toJSON() si besoin
                    return prev.clone();
                }
                return prev;
            });
            setIsLoading(false);
        });
        return snapshotSchools;
    }, []);

    // session
    useEffect(() => {
        const listener = listenToShools();
        //console.log("FFFF init user", fbUser);
        return () => listener?.();
    }, []);
    useEffect(() => {
        console.log("is loading sschool provider", isLoading)
    }, [isLoading])
    // actions


    const value = {
        schools,
        school,
        setSchool,
        isLoading,
        isConnected,
        isErrorSignIn,
        textErrorSignIn,

    };
    //if (isLoading) return <LoadingComponent />;
    //if (!user) return (<LoginComponent />);
    return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
}
