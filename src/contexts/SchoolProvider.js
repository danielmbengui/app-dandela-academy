'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    onSnapshot,
} from 'firebase/firestore';
import { ClassSchool } from '@/classes/ClassSchool';
import { useAuth } from './AuthProvider';

const SchoolContext = createContext(null);
export const useSchool = () => useContext(SchoolContext);

export function SchoolProvider({ children }) {
    const {user}=useAuth();
    const [school, setSchool] = useState(null);           // ton user métier (ou snapshot)
    const [schools, setSchools] = useState([]);           // ton user métier (ou snapshot)
    const [isLoading, setIsLoading] = useState(true);
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
            //console.log("SCHOOL provider", _schools);
            // par exemple : garder la première école
            const _school = _schools[0];
            //console.log("one school provider", _school);
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
        if(user) {
            const listener = listenToShools();
        //console.log("FFFF init user", fbUser);
        return () => listener?.();
        }
    }, [user]);

    const value = {
        schools,
        school,
        setSchool,
        isLoading,
    };
    return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
}
