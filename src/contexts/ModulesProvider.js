'use client';
import { ClassModule } from '@/classes/lessons/ClassModule';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LangProvider';
const ModulesContext = createContext(null);

export function useModules() {
    return useContext(ModulesContext);
}

export function ModulesProvider({ children, uid }) {
    const { lang } = useLanguage();
    const [module, setModule] = useState(null);
    const [modules, setModules] = useState([]);
    const [tutor, setTutor] = useState(null);
    const [tutors, setTutors] = useState([]);
    const [duration, setDuration] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [parts, setParts] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [countParts, setCountParts] = useState(0);
    const [countLessons, setCountLessons] = useState(0);

    useEffect(() => {
        async function init() {
            if (uid) {
                try {
                    const _module = await ClassModule.fetchFromFirestore(uid);
                    setModule(_module);
                    if (!_module) throw new Error(`Module ${uid} introuvable`);
                    const _title = _module.getTitle(lang);
                    const _description = _module.getDescriptionHtml(lang);
                    setTitle(_title);
                    setDescription(_description);
                    const [
                        _parts,
                        _lessons,
                        _all_tutors,
                        _duration,        // ex: { totalSeconds, hhmmss, human }
                        _count_parts,
                        _count_lessons,
                    ] = await Promise.all([
                        _module.getModuleParts(),
                        _module.getLessons(),
                        _module.getTutors(),
                        _module.countDurationLessons(),
                        _module.countModuleParts(),
                        _module.countLessons(),
                    ]);
                    setParts(_parts);
                    setLessons(_lessons);
                    setTutors(_all_tutors);
                    setDuration(_duration);
                    setCountParts(_count_parts);
                    setCountLessons(_count_lessons);
                    const _tutor = _all_tutors.length > 0 ? _all_tutors[0] : null;
                    setTutor(_tutor);
                } catch (err) {
                    console.error(err);
                }

            }

        }
        init();
    }, [uid]);

    return <ModulesContext.Provider
        value={{ module, modules, lessons, parts, tutor, tutors, duration, countParts, countLessons, title, description }}
    //value={value}

    >
        {children}
    </ModulesContext.Provider>;
}
