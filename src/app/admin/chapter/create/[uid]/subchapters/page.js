"use client"
import React, { useEffect, useState } from "react"
import { Grid, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { ClassLessonChapter, ClassLessonChapterTranslation } from "@/classes/lessons/ClassLessonChapter"
import SelectComponentDark from "@/components/elements/SelectComponentDark"
import { useLesson } from "@/contexts/LessonProvider"
import { ClassSession, ClassSessionSlot } from "@/classes/ClassSession"
import FieldComponent from "@/components/elements/FieldComponent"
import { NS_LESSONS, NS_LEVELS } from "@/contexts/i18n/settings"
import { ClassLesson } from "@/classes/ClassLesson"
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm"
import { useParams, useRouter } from "next/navigation"
import TextFieldComponent from "@/components/elements/TextFieldComponent"
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel"
import { ClassLessonSubchapter, ClassLessonSubchapterTranslation } from "@/classes/lessons/ClassLessonSubchapter"
import { useChapter } from "@/contexts/ChapterProvider"
import { EXCEL_EXERCICES_CHAPTER_4, EXCEL_EXERCICES_CHAPTER_5, EXCEL_GOALS_CHAPTER_4, EXCEL_GOALS_CHAPTER_5, EXCEL_KEYS_CHAPTER_4, EXCEL_KEYS_CHAPTER_5, EXCEL_TITLES_CHAPTER_4, EXCEL_TITLES_CHAPTER_5 } from "@/contexts/datas-init/subchapters"

const MODE_CREATE_CHAPTER = 'create-chapter';
const MODE_ADD_GOALS = 'add-goals';
const MODE_CREATE_SUB_CHAPTERS = 'create-subchapters';

//const MODE_CREATE_CHAPTER = 'create-chapter';
//const MODE_CREATE_CHAPTER = 'create-chapter';
//const MODE_CREATE_CHAPTER = 'create-chapter';
//const MODE_CREATE_CHAPTER = 'create-chapter';
export default function CreateSubchapters() {
    const { uid } = useParams();
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const [mode, setMode] = useState(MODE_CREATE_SUB_CHAPTERS);
    //const [chapter, setChapter] = useState(null);
    const { chapter, setUidChapter } = useChapter();
    useEffect(() => {
        setUidChapter(uid);
    }, [uid]);
    const { lessons } = useLesson();
    const router = useRouter();
    const [form, setForm] = useState({
        uid_lesson: "",
        level: "",
    })
    const onTranslate = async () => {
        try {
            //setProcessing(true);
            const trans = {
                title: chapter?.title,
                subtitle: chapter?.subtitle,
                description: chapter?.description,
            }
            const qs = encodeURIComponent(JSON.stringify(trans));
            const fetchTranslate = await fetch(`/api/test?lang=fr&translations=${qs}`);
            const result = await fetchTranslate.json();
            const langs = Object.keys(result);
            const translates = Object.values(result)?.map?.((trans, i) => new ClassLessonChapterTranslation({ ...trans, lang: langs[i] }));
            chapter.translates = translates;
            const translatePush = {};
            /*
            for (const trans of translates) {
                translatePush[trans.lang] = trans._convertTranslatesToFirestore(trans);
            }
            */

            //const translates = new ClassLessonChapterTranslation()._convertTranslatesToFirestore(this._translates);
            console.log("TRANSLATES", chapter._convertTranslatesToFirestore(translates))
            console.log("RESULT chapter", Object.keys(result), result);
            const _patch = await chapter?.createFirestore();
            console.log("PATCH", _patch);
            /*
            setProcess(true);
            const INDEX_SUB = 8;
            const quiz = chapter.quiz || [];
            var questions = quiz?.questions || [];
            const trans = questions?.[INDEX_SUB].getTranslate('fr');
            const qs = encodeURIComponent(JSON.stringify(trans));
            //console.log("fect", qs);
            const fetchTranslate = await fetch(`/api/test?lang=fr&translations=${qs}`);
            const result = await fetchTranslate.json();
            const translates = Object.values(result)?.map?.(trans => new ClassLessonChapterQuestionTranslation(trans));
            questions[INDEX_SUB].translates = translates;
            questions = questions.map((q, i) => {
                const final = q;
                const qTrans = q.translates.map(_trans => {
                    var answer = _trans.answer;
                    const proposals = _trans.proposals.map((prop, i) => {
                        var propReturn = {};
                        if (prop.uid_intern) {
                            propReturn = prop;
                        } else {
                            propReturn = { value: prop, uid_intern: i + 1 };
                        }

                        if (!answer.uid_intern && propReturn.value === answer) {
                            answer = { uid_intern: i + 1, value: propReturn.value }
                        }
                        return propReturn;
                    });
                    _trans.proposals = proposals;
                    _trans.answer = answer;
                    return (_trans);
                });

                const trans = q._convertTranslatesToFirestore(qTrans);
                final.translates = trans;
                //final.translates
                return final.toJSON();
            });
            quiz.questions = questions;

            const _patch = await chapter?.updateFirestore({ quiz: quiz.toJSON() });
            console.log("RESUULT", quiz)
            */
        } catch (error) {
            console.log("ERRROR", error);
        } finally {
            //setProcessing(false);
        }
    }
    return (<Stack spacing={2} sx={{ background: 'yellow', px: 1, py: 2 }} alignItems={'center'}>
        <Typography variant="h2">
            Create/Update subchapters - {chapter?.translate?.title} - {uid}
        </Typography>
        {
            mode === MODE_CREATE_SUB_CHAPTERS && <CreateSubchaptersComponent chapter={chapter} />
        }
    </Stack>)
}

function AddGoalsComponent({ subchapter = null, setSubchapter = null }) {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const [newGoal, setNewGoal] = useState("");
    const [goals, setGoals] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const onChangeValue = (e) => {
        const { name, value, type } = e.target;
        //setDisabledNext(!goals?.length);
        setNewGoal(value);
    }
    const onClearValue = () => {
        setNewGoal("");
        //setDisabledNext(false);
    }
    const addValue = () => {
        const _goals = [...goals];
        _goals.push(newGoal.trim());
        setGoals(_goals);
        setNewGoal("");
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ goals: _goals }));
            prev.update({ goals: _goals });
            return prev.clone();
        })
    }
    const removeValue = (index) => {
        const _goals = goals.filter((_, i) => i !== index);
        //_goals.push(newGoal.trim());
        setGoals(_goals);
        //setDisabledNext(false);
        setNewGoal("");
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ goals: _goals }));
            prev.update({ goals: _goals });
            return prev.clone();
        })
    }
    const onChangeListValue = (e, index) => {
        //e.preventDefault();
        const { name, value, type } = e.target;
        //const { value } = e.target;
        //const index = name?.split?.('goal_')?.[1] || -1;
        //if (index < 0) return;
        // console.log("change", name, value, goals?.[index], index,)
        setErrors({ [name]: '' });
        //setDisabledNext(false);
        var _goals = [...goals];
        _goals[index] = value;
        setGoals(prev => {
            if (!prev[index]) return [value];
            prev[index] = value;
            return prev;
        });
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ goals: _goals }));
            prev.update({ goals: _goals });
            return prev.clone();
        });

        /*
        setChapter(prev => {
            if (!prev) return new ClassLessonChapter({ goals: [value] });
            const _goals = [...prev.goals];
            _goals[index] = value;
            prev.update({ goals: _goals });
            //prev.goals = _goals;
            return prev.clone();
        })
        */
    }
    const onClearListValue = (index) => {
        const _goals = [...goals];
        _goals[index] = '';
        setGoals(_goals);
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ goals: _goals }));
            prev.update({ goals: _goals });
            return prev.clone();
        });
    }
    return (<Stack spacing={1} sx={{ p: 1, border: '0.1px solid var(--card-border)', borderRadius: '10px' }}>
        <Typography variant="caption">{'Objectifs'}</Typography>
        <Stack spacing={1}>
            {
                subchapter?.goals.map((goal, i) => {
                    return (<div key={i}>
                        <FieldComponent
                            value={goal}
                            name={`goal_${i}`}
                            label={`${t('goal n°')}${i + 1}`}
                            type={'multiline'}
                            onChange={(e) => onChangeListValue(e, i)}
                            onClear={() => onClearListValue(i)}
                            removable={true}
                            onRemove={() => removeValue(i)}
                            //error={errors?.new_goal}
                            minRows={3}
                            maxRows={10}
                            fullWidth
                            isAdmin={true}
                            style={{ width: '100%' }}
                        />
                    </div>)
                })
            }
        </Stack>
        <Stack sx={{ py: 1 }}>
            <FieldComponent
                value={newGoal}
                name={`default-goal`}
                label={t('new goal')}
                type={'multiline'}
                onChange={onChangeValue}
                onClear={onClearValue}
                editable={true}
                onSubmit={addValue}
                //error={errors?.new_goal}
                minRows={3}
                maxRows={10}
                fullWidth
                isAdmin={true}
                style={{ width: '100%' }}
            />
        </Stack>
    </Stack>)
}
function AddKeysComponent({ subchapter = null, setSubchapter = null }) {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const [newKey, setNewKey] = useState("");
    const [keys, setKeys] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const onChangeValue = (e) => {
        const { name, value, type } = e.target;
        //setDisabledNext(!goals?.length);
        setNewKey(value);
    }
    const onClearValue = () => {
        setNewKey("");
        //setDisabledNext(false);
    }
    const addValue = () => {
        const _keys = [...keys];
        _keys.push(newKey.trim());
        setKeys(_keys);
        setNewKey("");
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ keys: _keys }));
            prev.update({ keys: _keys });
            return prev.clone();
        })
    }
    const removeValue = (index) => {
        const _keys = keys.filter((_, i) => i !== index);
        //_goals.push(newGoal.trim());
        setKeys(_keys);
        //setDisabledNext(false);
        setNewKey("");
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ keys: _keys }));
            prev.update({ keys: _keys });
            return prev.clone();
        });
    }
    const onChangeListValue = (e, index) => {
        //e.preventDefault();
        const { name, value, type } = e.target;
        //const { value } = e.target;
        //const index = name?.split?.('goal_')?.[1] || -1;
        //if (index < 0) return;
        //console.log("change", name, value, keys?.[index], index,)
        setErrors({ [name]: '' });
        //setDisabledNext(false);
        var _keys = [...keys];
        _keys[index] = value;
        setKeys(_keys);
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ keys: _keys }));
            prev.update({ keys: _keys });
            return prev.clone();
        })
        /*
        setChapter(prev => {
            if (!prev) return new ClassLessonChapter({ goals: [value] });
            const _goals = [...prev.goals];
            _goals[index] = value;
            prev.update({ goals: _goals });
            //prev.goals = _goals;
            return prev.clone();
        })
        */
    }
    const onClearListValue = (index) => {
        const _keys = [...keys];
        _keys[index] = '';
        setKeys(_keys);
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ keys: _keys }));
            prev.update({ keys: _keys });
            return prev.clone();
        })
    }
    return (<Stack spacing={1} sx={{ p: 1, border: '0.1px solid var(--card-border)', borderRadius: '10px' }}>
        <Typography variant="caption">{'Points clés'}</Typography>
        <Stack spacing={1}>
            {
                subchapter?.keys.map((key, i) => {
                    return (<div key={i}>
                        <FieldComponent
                            value={key}
                            name={`key_${i}`}
                            label={`${t('key n°')}${i + 1}`}
                            type={'multiline'}
                            onChange={(e) => onChangeListValue(e, i)}
                            onClear={() => onClearListValue(i)}
                            removable={true}
                            onRemove={() => removeValue(i)}
                            //error={errors?.new_goal}
                            minRows={3}
                            maxRows={10}
                            fullWidth
                            isAdmin={true}
                            style={{ width: '100%' }}
                        />
                    </div>)
                })

            }
        </Stack>
        <Stack sx={{ py: 1 }}>
            <FieldComponent
                value={newKey}
                name={`default-key`}
                label={t('new key')}
                type={'multiline'}
                onChange={onChangeValue}
                onClear={onClearValue}
                editable={true}
                onSubmit={addValue}
                //error={errors?.new_goal}
                minRows={3}
                maxRows={10}
                fullWidth
                isAdmin={true}
                style={{ width: '100%' }}
            />
        </Stack>
    </Stack>)
}
function AddExercicesComponent({ subchapter = null, setSubchapter = null }) {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const [newExercice, setNewExercice] = useState("");
    const [exercices, setExercices] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const onChangeValue = (e) => {
        const { name, value, type } = e.target;
        //setDisabledNext(!goals?.length);
        setNewExercice(value);
    }
    const onClearValue = () => {
        setNewExercice("");
        //setDisabledNext(false);
    }
    const addValue = () => {
        const _exercices = [...exercices];
        _exercices.push(newExercice.trim());
        setExercices(_exercices);
        setNewExercice("");
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ exercices: _exercices }));
            prev.update({ exercices: _exercices });
            return prev.clone();
        })
    }
    const removeValue = (index) => {
        const _exercices = exercices.filter((_, i) => i !== index);
        //_goals.push(newGoal.trim());
        setExercices(_exercices);
        //setDisabledNext(false);
        setNewExercice("");
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ exercices: _exercices }));
            prev.update({ exercices: _exercices });
            return prev.clone();
        });
    }
    const onChangeListValue = (e, index) => {
        //e.preventDefault();
        const { name, value, type } = e.target;
        //const { value } = e.target;
        //const index = name?.split?.('goal_')?.[1] || -1;
        //if (index < 0) return;
        //console.log("change", name, value, keys?.[index], index,)
        setErrors({ [name]: '' });
        //setDisabledNext(false);
        var _exercices = [...exercices];
        _exercices[index] = value;
        setExercices(_exercices);
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ exercices: _exercices }));
            prev.update({ exercices: _exercices });
            return prev.clone();
        });
    }
    const onClearListValue = (index) => {
        const _exercices = [...exercices];
        _exercices[index] = '';
        setExercices(_exercices);
        setSubchapter(prev => {
            if (!prev || prev === null) return (new ClassLessonSubchapter({ exercices: _exercices }));
            prev.update({ exercices: _exercices });
            return prev.clone();
        })
    }
    return (<Stack spacing={1} sx={{ p: 1, border: '0.1px solid var(--card-border)', borderRadius: '10px' }}>
        <Typography variant="caption">{'Exercices'}</Typography>
        <Stack spacing={1}>
            {
                subchapter?.exercises?.map((exercice, i) => {
                    return (<div key={i}>
                        <FieldComponent
                            value={exercice}
                            name={`exercice_${i}`}
                            label={`${t('exercice n°')}${i + 1}`}
                            type={'multiline'}
                            onChange={(e) => onChangeListValue(e, i)}
                            onClear={() => onClearListValue(i)}
                            removable={true}
                            onRemove={() => removeValue(i)}
                            //error={errors?.new_goal}
                            minRows={3}
                            maxRows={10}
                            fullWidth
                            isAdmin={true}
                            style={{ width: '100%' }}
                        />
                    </div>)
                })

            }
        </Stack>
        <Stack sx={{ py: 1 }}>
            <FieldComponent
                value={newExercice}
                name={`default-exercice`}
                label={t('new exercice')}
                type={'multiline'}
                onChange={onChangeValue}
                onClear={onClearValue}
                editable={true}
                onSubmit={addValue}
                //error={errors?.new_goal}
                minRows={3}
                maxRows={10}
                fullWidth
                isAdmin={true}
                style={{ width: '100%' }}
            />
        </Stack>
    </Stack>)
}

function CreateSubchaptersComponent({ chapter = null, setChapter = null, setMode = null }) {
    const { uid:uidChapter } = useParams();
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const { lessons } = useLesson();
    const [disabledNext, setDisabledNext] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const [subchapter, setSubchapter] = useState(new ClassLessonSubchapter({
            uid_chapter: "7mQDtdYbjFGSBlvtnyrC",
            uid_intern:0,
            title: "",
            goals: [
                ""
            ],
            keys: [
                "",
                "",
                "",
            ],
            exercises: [
                "",
                "",
            ],
        }));
    
    //const subchapters = 
    const [newSubchapter, setNewSubChapter] = useState(null);
    const [subchapters, setSubchapters] = useState(EXCEL_TITLES_CHAPTER_5.map((title, i) => {
        return new ClassLessonSubchapter({
            uid_chapter: uidChapter,
            uid_intern: i+1,
            title: title,
            goals: EXCEL_GOALS_CHAPTER_5[i],
            keys: EXCEL_KEYS_CHAPTER_5[i],
            exercises: EXCEL_EXERCICES_CHAPTER_5[i],
        });
    }));
    //console.log("Suuububuubabu",subchapters)

    const [newGoal, setNewGoal] = useState("");
    const [goals, setGoals] = useState([]);
    const NewSubchapterComponent = () => {
        const [subchapter, setSubchapter] = useState(null);
        const [newGoal, setNewGoal] = useState("");
        const [goals, setGoals] = useState([]);
        const [processing, setProcessing] = useState(false);
        const [errors, setErrors] = useState({});


        const onChangeNewGoalValue = (e) => {
            const { name, value, type } = e.target;
            //setDisabledNext(!goals?.length);
            setNewGoal(value);
        }
        const onClearNewGoalValue = () => {
            setNewGoal("");
            //setDisabledNext(false);
        }
        const onChangeListGoalsValue = (e, index) => {
            //e.preventDefault();
            const { name, value, type } = e.target;
            //const { value } = e.target;
            //const index = name?.split?.('goal_')?.[1] || -1;
            //if (index < 0) return;
            console.log("change", name, value, goals?.[index], index,)
            setErrors({ [name]: '' });
            //setDisabledNext(false);
            var _goals = [...goals];
            _goals[index] = value;
            setGoals(prev => {
                if (!prev[index]) return [value];
                prev[index] = value;
                return prev;
            });
            /*
            setChapter(prev => {
                if (!prev) return new ClassLessonChapter({ goals: [value] });
                const _goals = [...prev.goals];
                _goals[index] = value;
                prev.update({ goals: _goals });
                //prev.goals = _goals;
                return prev.clone();
            })
            */
        }
        const onClearListGoalsValue = (index) => {
            //const { name, value, type } = e.target;
            //const { value } = e.target;
            //const index = name?.split?.('goal_')?.[1] || -1;
            //if (index < 0) return;
            //setErrors({ [name]: '' });
            setDisabledNext(false);
            setChapter(prev => {
                if (!prev) return new ClassLessonChapter({ goals: [''] });
                const _goals = [...prev.goals];
                _goals[index] = '';
                prev.update({ goals: _goals });
                return prev.clone();
            })
        }
        return (<Stack spacing={2} sx={{ borderRadius: '15px', border: '0.1px solid var(--card-border)', p: 1.5 }}>
            <Typography variant="caption">{'Nouvelle section'}</Typography>
            <Stack spacing={1}>

                <Stack>
                    {
                        goals.map((goal, i) => {
                            return (<div key={i}>
                                <FieldComponent
                                    value={goal}
                                    name={`goal_${i}`}
                                    label={`${t('goal')} - ${i + 1}`}
                                    type={'multiline'}
                                    onChange={(e) => onChangeListGoalsValue(e, i)}
                                    onClear={(e) => onClearListGoalsValue(i)}
                                    editable={true}
                                    onSubmit={() => {
                                        const _goals = [...goals];
                                        _goals.push(newGoal.trim());
                                        setGoals(_goals);
                                        /*
                                        setChapter(prev => {
                                            if (!prev) return new ClassLessonChapter({ subchapters: [newGoal] });
                                            const _goals = prev.subchapters;
                                            _goals.push(newGoal);
                                            //prev.goals.push(newGoal);
                                            prev.update({ subchapters: _goals });
                                            return prev.clone();
                                        });
                                        */
                                        //setDisabledNext(false);
                                        setNewGoal("");
                                    }}
                                    //error={errors?.new_goal}
                                    minRows={3}
                                    maxRows={10}
                                    fullWidth
                                    isAdmin={true}
                                    style={{ width: '100%' }}
                                />
                            </div>)
                        })

                    }
                    <FieldComponent
                        value={newGoal}
                        name={`default-goal`}
                        label={t('new goal')}
                        type={'multiline'}
                        onChange={onChangeNewGoalValue}
                        onClear={onClearNewGoalValue}
                        editable={true}
                        onSubmit={() => {
                            const _goals = [...goals];
                            _goals.push(newGoal.trim());
                            setGoals(_goals);
                            /*
                            setChapter(prev => {
                                if (!prev) return new ClassLessonChapter({ subchapters: [newGoal] });
                                const _goals = prev.subchapters;
                                _goals.push(newGoal);
                                //prev.goals.push(newGoal);
                                prev.update({ subchapters: _goals });
                                return prev.clone();
                            });
                            */
                            //setDisabledNext(false);
                            setNewGoal("");
                        }}
                        //error={errors?.new_goal}
                        minRows={3}
                        maxRows={10}
                        fullWidth
                        isAdmin={true}
                        style={{ width: '100%' }}
                    />
                </Stack>

            </Stack>
        </Stack>)
    }
    const onChangeNewGoalValue = (e) => {
        const { name, value, type } = e.target;
        setDisabledNext(!goals?.length);
        setNewGoal(value);
    }
    const onClearNewGoalValue = () => {
        setNewGoal("");
        setDisabledNext(false);
    }
    const onChangeValue = (e) => {
        //e.preventDefault();
        const { name, value, type } = e.target;
        //console.log("change", name, value)
        setSubchapter(prev => {
            if (!prev) return new ClassLessonSubchapter({ [name]: value });
            //const _goals = [...prev.goals];
            //_goals[index] = value;
            prev.update({ [name]: value });
            //prev.goals = _goals;
            return prev.clone();
        });
    }
    const onClearValue = (name) => {
        //const { name, value, type } = e.target;
        //const { value } = e.target;
        //const index = name?.split?.('goal_')?.[1] || -1;
        //if (index < 0) return;
        //setErrors({ [name]: '' });
        //setDisabledNext(false);
        setSubchapter(prev => {
            if (!prev) return new ClassLessonChapter({ [name]: '' });
            prev.update({ [name]: '' });
            return prev.clone();
        })
    }
    const onGoBack = () => {
        setMode(MODE_CREATE_CHAPTER);
    }
    const onGoNext = async () => {
        //chapter.update({ uid_lesson: "zlUoi3t14wzC5cNhfS3J" });
        //console.log("click next", chapter.createFirestoreDocUid())
        setProcessing(true);
        const results = await Promise.all(
            subchapters.map((sub) => onTranslateGoals(sub))
        );
        console.log("RESULTS", results);
        const toFirestore = results.map(res => {
            return res.toJSON();
        });
        console.log("toFirestore", toFirestore);
        const _patch = await chapter?.updateFirestore({ subchapters: toFirestore });
        console.log("PATCH", _patch);
        setProcessing(false);

        /*
        const _errors = {};
        if (!goals?.length) {
            _errors.new_goal = 'error-new-goal';
        }
        setErrors(_errors);
        if (Object.keys(_errors).length > 0) {
            setDisabledNext(true);
            return;
        }
        //await onTranslateGoals();
        setMode(MODE_CREATE_SUB_CHAPTERS);
        */
    }
    const onTranslateGoals = async (subchapter) => {
        try {

            //const subchapters = [...chapter.subchapters];
            //const subchapterUid = subchapters.length + 1;
            const trans = {
                title: subchapter?.title || "",
                goals: subchapter?.goals || [],
                keys: subchapter?.keys || [],
                exercises: subchapter?.exercises || [],
            };
            const qs = encodeURIComponent(JSON.stringify(trans));
            const fetchTranslate = await fetch(`/api/test?lang=fr&translations=${qs}`);
            const result = await fetchTranslate.json();
            const langs = Object.keys(result);
            const translates = Object.values(result)?.map?.((trans, i) => {
                const lang = langs[i];
                return new ClassLessonSubchapterTranslation({
                    ...trans,
                    lang: lang,
                    photo_url: `https://app.academy.dandela.com/images/lessons/excel/competent/chapter_${subchapter.uid_intern}/explaination_${lang}.png`,
                })
            });
            //const globalTranslates = { ...chapter.translates, goals: translates };

            subchapter.translates = translates;
            //subchapter.uid_intern = subchapterUid;
            //subchapter.uid_chapter = chapter?.uid;
            //const translatesToFirestore = translates.map(trans => trans._convertTranslatesToFirestore(trans));
            //subchapters.push(subchapter);
            //chapter.update({ subchapters: subchapters });
            //const translatePush = {};
            /*
            for (const trans of translates) {
                translatePush[trans.lang] = trans._convertTranslatesToFirestore(trans);
            }
            */
            //console.log("RESULT", result);
            //const translates = new ClassLessonChapterTranslation()._convertTranslatesToFirestore(this._translates);
            //console.log("TRANSLATES", chapter.subchapters)


            return subchapter;
            /*
            setProcess(true);
            const INDEX_SUB = 8;
            const quiz = chapter.quiz || [];
            var questions = quiz?.questions || [];
            const trans = questions?.[INDEX_SUB].getTranslate('fr');
            const qs = encodeURIComponent(JSON.stringify(trans));
            //console.log("fect", qs);
            const fetchTranslate = await fetch(`/api/test?lang=fr&translations=${qs}`);
            const result = await fetchTranslate.json();
            const translates = Object.values(result)?.map?.(trans => new ClassLessonChapterQuestionTranslation(trans));
            questions[INDEX_SUB].translates = translates;
            questions = questions.map((q, i) => {
                const final = q;
                const qTrans = q.translates.map(_trans => {
                    var answer = _trans.answer;
                    const proposals = _trans.proposals.map((prop, i) => {
                        var propReturn = {};
                        if (prop.uid_intern) {
                            propReturn = prop;
                        } else {
                            propReturn = { value: prop, uid_intern: i + 1 };
                        }

                        if (!answer.uid_intern && propReturn.value === answer) {
                            answer = { uid_intern: i + 1, value: propReturn.value }
                        }
                        return propReturn;
                    });
                    _trans.proposals = proposals;
                    _trans.answer = answer;
                    return (_trans);
                });

                const trans = q._convertTranslatesToFirestore(qTrans);
                final.translates = trans;
                //final.translates
                return final.toJSON();
            });
            quiz.questions = questions;

            const _patch = await chapter?.updateFirestore({ quiz: quiz.toJSON() });
            console.log("RESUULT", quiz)
            */
        } catch (error) {
            console.log("ERRROR", error);
        } finally {
            //setProcessing(false);
        }
    }
    return (<Stack spacing={2} sx={{ minWidth: '500px', py: 2, px: 3, background: 'var(--card-color)', borderRadius: '15px', }}>
        <Typography>{`Ajouter des sections au chapitre`}</Typography>
        <Stack spacing={1}>
            <FieldComponent
                required
                value={subchapter?.title || ''}
                name={`title`}
                label={t(`title`)}
                type={'text'}
                onChange={onChangeValue}
                onClear={() => onClearValue('title')}
                fullWidth
                isAdmin={true}
                style={{ width: '100%' }}
            />
            <AddGoalsComponent subchapter={subchapter} setSubchapter={setSubchapter} />
            <AddKeysComponent subchapter={subchapter} setSubchapter={setSubchapter} />
            <AddExercicesComponent subchapter={subchapter} setSubchapter={setSubchapter} />

            <Stack direction={'row'} spacing={1} sx={{ py: 2, px: 1 }} justifyContent={'end'} alignItems={'center'}>
                <ButtonCancel
                    label="Précédent"
                    loading={processing}
                    //disabled={disabledNext}
                    onClick={onGoBack}
                />
                <ButtonConfirm
                    label="Suivant"
                    loading={processing}
                    //disabled={!subchapter?.title || !subchapter?.goals?.length || !subchapter?.keys?.length || !subchapter?.exercises?.length}
                    onClick={onGoNext}
                />
            </Stack>
        </Stack>
    </Stack>)
}

function CreateQuizComponent() { }
