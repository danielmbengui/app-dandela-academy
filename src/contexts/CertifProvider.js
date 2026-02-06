'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onSnapshot, query, where } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import { ClassUserCertification } from '@/classes/users/ClassUserCertification';
import { LessonProvider, useLesson } from './LessonProvider';
import { UsersProvider, useUsers } from './UsersProvider';
import { useStat } from './StatProvider';
import { useChapter } from './ChapterProvider';
import { useLanguage } from './LangProvider';

const CertifContext = createContext(null);
export const useCertif = () => useContext(CertifContext);

export function CertifProvider({ children, uidUser = null }) {
    const { user } = useAuth();
    const uid = uidUser ?? user?.uid ?? '';
    const { getOneLesson, isLoading: isLoadingLesson } = useLesson();
    const { getOneUser, isLoading: isLoadingUser } = useUsers();
    const { stats, isLoading: isLoadingStat, getBestStat } = useStat();
    const {chapter, chapters, getOneChapter, isLoading: isLoadingChapter} = useChapter();
    const [certifications, setCertifications] = useState([]);
    const [certification, setCertification] = useState(null);
    const [uidCertification, setUidCertification] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {lang} = useLanguage();

    // Écoute en temps réel des certifications de l'utilisateur
    const listenToCertifications = useCallback((uidForUser = '') => {
        // Si les providers dépendants chargent encore, on garde isLoading à true
        console.log("Is loading start function", isLoading)
        if (isLoadingLesson || isLoadingUser || isLoadingStat || isLoadingChapter) {
            return () => { };
        }
        console.log("Is loading start 2", isLoading)
        // Si pas d'utilisateur, on peut mettre isLoading à false
        if (!uidForUser) {
            console.log("Is loading uid user", isLoading)
            setCertifications([]);
            setIsLoading(false);
            return () => { };
        }
        console.log("Is loading certif", isLoading)
        const colRef = ClassUserCertification.colRefForUser(uidForUser);
        if (!colRef) {
            setCertifications([]);
            setIsLoading(false);
            return () => { };
        }
        const q = query(colRef);
        const unsubscribe = onSnapshot(q, (snap) => {
            if (snap.empty) {
                setCertifications([]);
                setIsLoading(false);
                return;
            }
            
            //getBestStat(uidLesson = "", uidChapter = "",statsParam = stats)
            const list = snap.docs.map((docSnap) => {
                const data = docSnap.data();
                const lesson = getOneLesson(data.uid_lesson);
                const user = getOneUser(data.uid_user);
                const _chapters = chapters.filter(c => c.uid_lesson === data.uid_lesson).sort((a, b) => a.uid_intern - b.uid_intern);
                const _stats = _chapters.map(c => getBestStat(data.uid_lesson, c.uid, stats));
                const count_questions = ClassUserCertification.countQuestions(_stats);
                const score = ClassUserCertification.countScore(_stats);
                const percentage = ClassUserCertification.calculatePercentage(score, count_questions);
                const status = ClassUserCertification.getStatusFromPercentage(percentage);
                data.lesson = lesson;
                data.user = user;
                data.stats = _stats;
                data.count_questions = count_questions;
                data.score = score;
                data.status=status;
    
                data.percentage = percentage;
                console.log("CHAPTERS", percentage);
                return data;
            });
            setCertifications(list);
            setIsLoading(false);
        }, (err) => {
            console.error('CertifProvider listenToCertifications', err);
            setIsLoading(false);
        });
        return unsubscribe;
    }, [isLoadingLesson, isLoadingUser, isLoadingStat, isLoadingChapter]);

    /** Écoute une seule certification (sans attendre la liste complète). Met à jour `certification` et `uidCertification`. */
    const listenToOneCertification = useCallback((uidForUser = '', uidCert = '') => {
        if (!uidForUser ||!uidCert || isLoadingLesson || isLoadingUser || isLoadingStat || isLoadingChapter) {
            setCertification(null);
            return () => { };
        }
        console.log("listenToOneCertification OKAY", uidForUser, uidCert);
        const docRef = ClassUserCertification.docRef(uidForUser, uidCert);
        if (!docRef) {
            setCertification(null);
            return () => { };
        }
        setUidCertification(uidCert);
      
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (!docSnap.exists()) {
                setCertification(null);
                return;
            }
            const data = docSnap.data();
            console.log("listenToOneCertification", data);
            const lesson = getOneLesson(data.uid_lesson);
            const user = getOneUser(data.uid_user);
            const _chapters = chapters.filter(c => c.uid_lesson === data.uid_lesson).sort((a, b) => a.uid_intern - b.uid_intern);
            const _stats = _chapters.map(c => getBestStat(data.uid_lesson, c.uid, stats));
            const count_questions = ClassUserCertification.countQuestions(_stats);
            const score = ClassUserCertification.countScore(_stats);
            const percentage = ClassUserCertification.calculatePercentage(score, count_questions);
            const status = ClassUserCertification.getStatusFromPercentage(percentage);
            data.lesson = lesson;
            data.user = user;
            data.stats = _stats;
            data.count_questions = count_questions;
            data.score = score;
            data.status=status;

            data.percentage = percentage;
            console.log("CERTIFICATION change",data, data.score, data.count_questions, data.percentage);
            setCertification(data);
        }, (err) => {
            console.error('CertifProvider listenToOneCertification', err);
            setCertification(null);
        });
        return () => {
            unsubscribe();
            setCertification(null);
        };
    }, [uid,uidCertification, lang,isLoadingLesson,isLoadingUser,isLoadingStat,isLoadingChapter]);

    useEffect(() => {
        if (uid) {
            const unsubscribe = listenToCertifications(uid);
            return () => unsubscribe?.();
        }
    }, [uid,lang, listenToCertifications]);

    useEffect(() => {
        const unsubscribe = listenToOneCertification(uid, uidCertification);
        return () => unsubscribe();
      }, [uid,uidCertification, listenToOneCertification]);

    const getOneCertification = useCallback((uidCert) => {
        if (!uidCert) return null;
        // Priorité : certification courante si elle correspond (vient de listenToOneCertification ou sync)
        if (uidCert === uidCertification && certification) return certification;
        // Fallback : recherche dans la liste complète
        if (certifications.length === 0) return null;
        return certifications.find((c) => c.uid === uidCert) ?? null;
    }, [certifications, certification, uidCertification]);

    const fetchCertification = useCallback(async (id) => {
        try {
            const cert = await ClassUserCertification.fetchFromFirestore(id);
            return cert;
        } catch (err) {
            console.error('CertifProvider fetchCertification', err);
            return null;
        }
    }, []);

    const fetchCertifications = useCallback(async (constraints = []) => {
        try {
            const list = await ClassUserCertification.fetchListFromFirestore(constraints);
            return list ?? [];
        } catch (err) {
            console.error('CertifProvider fetchCertifications', err);
            return [];
        }
    }, []);

    const countCertifications = useCallback(async (uidForUser = '', constraints = []) => {
        try {
            const count = await ClassUserCertification.count(uidForUser || uid, constraints);
            return count ?? 0;
        } catch (err) {
            console.error('CertifProvider countCertifications', err);
            return 0;
        }
    }, [uid]);

    const createCertification = useCallback(async (certifInstance) => {
        if (!certifInstance || !(certifInstance instanceof ClassUserCertification)) {
            return null;
        }
        try {
            const created = await certifInstance.createFirestore();
            return created;
        } catch (err) {
            console.error('CertifProvider createCertification', err);
            return null;
        }
    }, []);

    const updateCertification = useCallback(async (certifInstance, patch = {}) => {
        if (!certifInstance || !(certifInstance instanceof ClassUserCertification)) {
            return null;
        }
        try {
            const updated = await certifInstance.updateFirestore(patch);
            return updated;
        } catch (err) {
            console.error('CertifProvider updateCertification', err);
            return null;
        }
    }, []);

    const removeCertification = useCallback(async (uidForUser, id) => {
        const uidToUse = uidForUser || uid;
        if (!uidToUse || !id) return false;
        try {
            const ref = ClassUserCertification.docRef(uidToUse, id);
            if (!ref) return false;
            await deleteDoc(ref);
            return true;
        } catch (err) {
            console.error('CertifProvider removeCertification', err);
            return false;
        }
    }, [uid]);

    const value = {
        uidUser: uid,
        certifications,
        certification,
        uidCertification,
        setUidCertification,
        isLoading,
        getOneCertification,
        listenToOneCertification,
        fetchCertification,
        fetchCertifications,
        countCertifications,
        createCertification,
        updateCertification,
        removeCertification,
        FORMAT: ClassUserCertification.FORMAT,
        STATUS: ClassUserCertification.STATUS_STATS,
        STATUS_CONFIG: ClassUserCertification.STATUS_CONFIG_STATS,
    };

    return (<CertifContext.Provider value={value}>
        {children}
    </CertifContext.Provider>);
}
