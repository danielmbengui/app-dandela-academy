'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import { ClassDiploma, ClassDiplomaTranslate } from '@/classes/ClassDiploma';
import { useLanguage } from './LangProvider';
import { useLesson } from './LessonProvider';

const DiplomaContext = createContext(null);
export const useDiploma = () => useContext(DiplomaContext);

/**
 * DiplomaProvider — Gestion des définitions de diplômes (ClassDiploma)
 * Écoute en temps réel les diplômes disponibles dans la base de données.
 */
export function DiplomaProvider({ children }) {
    const { user } = useAuth();
    const { lang } = useLanguage();
    const { lessons, getOneLesson } = useLesson();
    const [diplomas, setDiplomas] = useState([]);
    const [diploma, setDiploma] = useState(null);
    const [uidDiploma, setUidDiploma] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Écoute en temps réel des diplômes
    const listenToDiplomas = useCallback(() => {
        setIsLoading(true);
        const colRef = ClassDiploma.colRef();
        if (!colRef) {
            setDiplomas([]);
            setIsLoading(false);
            return () => { };
        }

        const q = query(colRef, orderBy('created_time', 'desc'));
        const unsubscribe = onSnapshot(q, (snap) => {
            if (snap.empty) {
                setDiplomas([]);
                setIsLoading(false);
                return;
            }

            const list = snap.docs.map((docSnap) => {
                // Le converter retourne déjà une instance ClassDiploma avec translates en ClassDiplomaTranslate
                const diplomaInstance = docSnap.data();
                // S'assurer que les translates sont des instances de ClassDiplomaTranslate
                if (diplomaInstance.translates?.length) {
                    const translatesInstances = diplomaInstance.translates.map(tr => 
                        tr instanceof ClassDiplomaTranslate ? tr : new ClassDiplomaTranslate(tr)
                    );
                    diplomaInstance._translates = translatesInstances;
                    // Associer la traduction active selon la langue
                    const translate = translatesInstances.find(t => t.lang === lang) || translatesInstances[0] || null;
                    diplomaInstance._translate = translate;
                    // Propager title et description depuis la traduction active
                    if (translate) {
                        diplomaInstance._title = translate.title || diplomaInstance._title;
                        diplomaInstance._description = translate.description || diplomaInstance._description;
                    }
                }
                // Associer les leçons
                if (diplomaInstance.uid_lessons?.length && lessons?.length) {
                    diplomaInstance._lessons = diplomaInstance.uid_lessons.map((uidLesson, index) => {
                        const lesson = getOneLesson(uidLesson);
                        return lesson ? { ...lesson, order: index + 1 } : { uid: uidLesson, name: uidLesson, order: index + 1 };
                    }).filter(Boolean);
                }
                return diplomaInstance;
            });
            setDiplomas(list);
            setIsLoading(false);
        }, (err) => {
            console.error('DiplomaProvider listenToDiplomas', err);
            setIsLoading(false);
        });
        return unsubscribe;
    }, [lang, lessons, getOneLesson]);

    /** Écoute un seul diplôme */
    const listenToOneDiploma = useCallback((uidDipl = '') => {
        if (!uidDipl) {
            setDiploma(null);
            return () => { };
        }
        const docRef = ClassDiploma.docRef(uidDipl);
        if (!docRef) {
            setDiploma(null);
            return () => { };
        }
        setUidDiploma(uidDipl);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (!docSnap.exists()) {
                setDiploma(null);
                return;
            }
            // Le converter retourne déjà une instance ClassDiploma avec translates en ClassDiplomaTranslate
            const diplomaInstance = docSnap.data();
            // S'assurer que les translates sont des instances de ClassDiplomaTranslate
            if (diplomaInstance.translates?.length) {
                const translatesInstances = diplomaInstance.translates.map(tr => 
                    tr instanceof ClassDiplomaTranslate ? tr : new ClassDiplomaTranslate(tr)
                );
                diplomaInstance._translates = translatesInstances;
                // Associer la traduction active selon la langue
                const translate = translatesInstances.find(t => t.lang === lang) || translatesInstances[0] || null;
                diplomaInstance._translate = translate;
                // Propager title et description depuis la traduction active
                if (translate) {
                    diplomaInstance._title = translate.title || diplomaInstance._title;
                    diplomaInstance._description = translate.description || diplomaInstance._description;
                }
            }
            // Associer les leçons
            if (diplomaInstance.uid_lessons?.length && lessons?.length) {
                diplomaInstance._lessons = diplomaInstance.uid_lessons.map((uidLesson, index) => {
                    const lesson = getOneLesson(uidLesson);
                    return lesson ? { ...lesson, order: index + 1 } : { uid: uidLesson, name: uidLesson, order: index + 1 };
                }).filter(Boolean);
            }
            setDiploma(diplomaInstance);
        }, (err) => {
            console.error('DiplomaProvider listenToOneDiploma', err);
            setDiploma(null);
        });
        return () => {
            unsubscribe();
            setDiploma(null);
        };
    }, [lang, lessons, getOneLesson]);

    useEffect(() => {
        const unsubscribe = listenToDiplomas();
        return () => unsubscribe?.();
    }, [listenToDiplomas]);

    useEffect(() => {
        if (uidDiploma) {
            const unsubscribe = listenToOneDiploma(uidDiploma);
            return () => unsubscribe();
        }
    }, [uidDiploma, listenToOneDiploma]);

    const getOneDiploma = useCallback((uidDipl) => {
        if (!uidDipl) return null;
        // Priorité : diplôme courant si correspondant
        if (uidDipl === uidDiploma && diploma) return diploma;
        // Fallback : recherche dans la liste
        if (diplomas.length === 0) return null;
        return diplomas.find((d) => d.uid === uidDipl) ?? null;
    }, [diplomas, diploma, uidDiploma]);

    const fetchDiploma = useCallback(async (id, langParam = lang) => {
        try {
            const dipl = await ClassDiploma.fetchFromFirestore(id, langParam);
            return dipl;
        } catch (err) {
            console.error('DiplomaProvider fetchDiploma', err);
            return null;
        }
    }, [lang]);

    const fetchDiplomas = useCallback(async (langParam = lang, constraints = []) => {
        try {
            const list = await ClassDiploma.fetchListFromFirestore(langParam, constraints);
            return list ?? [];
        } catch (err) {
            console.error('DiplomaProvider fetchDiplomas', err);
            return [];
        }
    }, [lang]);

    const countDiplomas = useCallback(async (constraints = []) => {
        try {
            const count = await ClassDiploma.count(constraints);
            return count ?? 0;
        } catch (err) {
            console.error('DiplomaProvider countDiplomas', err);
            return 0;
        }
    }, []);

    const createDiploma = useCallback(async (diplomaInstance) => {
        if (!diplomaInstance || !(diplomaInstance instanceof ClassDiploma)) {
            return null;
        }
        try {
            const created = await diplomaInstance.createFirestore();
            return created;
        } catch (err) {
            console.error('DiplomaProvider createDiploma', err);
            return null;
        }
    }, []);

    const updateDiploma = useCallback(async (diplomaInstance, patch = {}) => {
        if (!diplomaInstance || !(diplomaInstance instanceof ClassDiploma)) {
            return null;
        }
        try {
            const updated = await diplomaInstance.updateFirestore(patch);
            return updated;
        } catch (err) {
            console.error('DiplomaProvider updateDiploma', err);
            return null;
        }
    }, []);

    const removeDiploma = useCallback(async (id) => {
        if (!id) return false;
        try {
            const ref = ClassDiploma.docRef(id);
            if (!ref) return false;
            await deleteDoc(ref);
            return true;
        } catch (err) {
            console.error('DiplomaProvider removeDiploma', err);
            return false;
        }
    }, []);

    const value = {
        diplomas,
        diploma,
        uidDiploma,
        setUidDiploma,
        isLoading,
        getOneDiploma,
        listenToOneDiploma,
        fetchDiploma,
        fetchDiplomas,
        countDiplomas,
        createDiploma,
        updateDiploma,
        removeDiploma,
        // Constantes utilitaires
        STATUS: ClassDiploma.STATUS,
        STATUS_CONFIG: ClassDiploma.STATUS_CONFIG,
        CATEGORY: ClassDiploma.CATEGORY,
        LEVEL: ClassDiploma.LEVEL,
        FORMAT: ClassDiploma.FORMAT,
        MENTION: ClassDiploma.MENTION,
        MENTION_CONFIG: ClassDiploma.MENTION_CONFIG,
        ALL_CATEGORIES: ClassDiploma.ALL_CATEGORIES,
        ALL_LEVELS: ClassDiploma.ALL_LEVELS,
        ALL_FORMATS: ClassDiploma.ALL_FORMATS,
        ALL_STATUS: ClassDiploma.ALL_STATUS,
    };

    return (
        <DiplomaContext.Provider value={value}>
            {children}
        </DiplomaContext.Provider>
    );
}
