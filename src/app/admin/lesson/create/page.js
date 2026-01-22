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
import { ClassLesson, ClassLessonTranslate } from "@/classes/ClassLesson"
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm"
import { useRouter } from "next/navigation"
import TextFieldComponent from "@/components/elements/TextFieldComponent"
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel"
import { ClassLessonSubchapter } from "@/classes/lessons/ClassLessonSubchapter"
import { LESSON_IT } from "@/contexts/datas-init/lessons"
import { LESSON_EXCEL_TEACHER_PT } from "@/contexts/datas-init/lessons-teacher"

const LEVEL = 'expert';
const MODE_CREATE_CHAPTER = 'create-chapter';
const MODE_ADD_GOALS = 'add-goals';
const MODE_CREATE_SUB_CHAPTERS = 'create-subchapters';
//const MODE_CREATE_CHAPTER = 'create-chapter';
//const MODE_CREATE_CHAPTER = 'create-chapter';
//const MODE_CREATE_CHAPTER = 'create-chapter';
//const MODE_CREATE_CHAPTER = 'create-chapter';
export default function TestCreateChapter() {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const [mode, setMode] = useState(MODE_ADD_GOALS);
    const [lesson, setLesson] = useState(null);
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
                title: lesson?.title,
                subtitle: lesson?.subtitle,
                description: lesson?.description,
            }
            const qs = encodeURIComponent(JSON.stringify(trans));
            const fetchTranslate = await fetch(`/api/test?lang=fr&translations=${qs}`);
            const result = await fetchTranslate.json();
            const langs = Object.keys(result);
            const translates = Object.values(result)?.map?.((trans, i) => new ClassLessonChapterTranslation({ ...trans, lang: langs[i] }));
            lesson.translates = translates;
            const translatePush = {};
            /*
            for (const trans of translates) {
                translatePush[trans.lang] = trans._convertTranslatesToFirestore(trans);
            }
            */

            //const translates = new ClassLessonChapterTranslation()._convertTranslatesToFirestore(this._translates);
            console.log("TRANSLATES", lesson._convertTranslatesToFirestore(translates))
            console.log("RESULT chapter", Object.keys(result), result);
            const _patch = await lesson?.createFirestore();
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
            Create lesson
        </Typography>
        {
            mode === MODE_ADD_GOALS && <GoalsComponent lesson={lesson} setLesson={setLesson} setMode={setMode} />
        }
    </Stack>)
}
function GoalsComponent({ lesson = null, setLesson = null, setMode = null }) {
    const router = useRouter();
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const { lessons } = useLesson();
    const [disabledNext, setDisabledNext] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [newGoal, setNewGoal] = useState("");
    const [goals, setGoals] = useState([]);
    const LANG = 'pt';
    useEffect(() => {
        setLesson(prev => {
            if (!prev || prev === null) {
                console.log("lesson excel", LESSON_EXCEL_TEACHER_PT)
                console.log("lesson excel clone", LESSON_EXCEL_TEACHER_PT.clone())
                return LESSON_EXCEL_TEACHER_PT.clone();
            }
            return prev.clone();
        });
    }, []);
    const onChangeNewGoalValue = (e) => {
        const { name, value, type } = e.target;
        setDisabledNext(!goals?.length);
        setNewGoal(value);
    }
    const onClearNewGoalValue = () => {
        setNewGoal("");
        setDisabledNext(false);
    }
    const onChangeValue = (e, index) => {
        //e.preventDefault();
        const { name, value, type } = e.target;
        //const { value } = e.target;
        //const index = name?.split?.('goal_')?.[1] || -1;
        //if (index < 0) return;
        console.log("change", name, value, goals?.[index], index,)
        setErrors({ [name]: '' });
        setDisabledNext(false);
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
    const onClearValue = (name) => {
        //const { name, value, type } = e.target;
        //const { value } = e.target;
        const index = name?.split?.('goal_')?.[1] || -1;
        if (index < 0) return;
        setErrors({ [name]: '' });
        setDisabledNext(false);
        setLesson(prev => {
            if (!prev) return new ClassLessonChapter({ goals: [''] });
            const _goals = [...prev.goals];
            _goals[index] = '';
            prev.update({ goals: _goals });
            return prev.clone();
        })
    }
    const onGoBack = () => {
        setMode(MODE_CREATE_CHAPTER);
    }
    const onGoNext = async () => {
        console.log("click next")
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
    }
    const onTranslateGoals = async () => {
        try {
            //setProcessing(true);
            const trans = goals;
            const qs = encodeURIComponent(JSON.stringify(trans));
            const fetchTranslate = await fetch(`/api/test?lang=fr&translations=${qs}`);
            const result = await fetchTranslate.json();
            const langs = Object.keys(result);
            const translates = Object.values(result)?.map?.((trans, i) => new ClassLessonChapterTranslation({ goals: trans, lang: langs[i] }));
            const globalTranslates = { ...lesson.translates, goals: translates };
            lesson.translates = globalTranslates;
            //const translatePush = {};
            /*
            for (const trans of translates) {
                translatePush[trans.lang] = trans._convertTranslatesToFirestore(trans);
            }
            */
            console.log("RESULT", result);
            //const translates = new ClassLessonChapterTranslation()._convertTranslatesToFirestore(this._translates);
            console.log("TRANSLATES", lesson._convertTranslatesToFirestore(translates))

            //const _patch = await chapter?.createFirestore();
            //console.log("PATCH", _patch);
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
    const onSubmit = async () => {
        try {
            setProcessing(true);
            /*
            const _errors = {};
            if (!chapter?.goals?.length) {
                _errors.new_goal = 'error-new-goal';
            }
            setErrors(_errors);
            if (Object.keys(_errors).length > 0) {
                setDisabledNext(true);
                return;
            }
            */
           //console.log("UUUUUID", chapter?.createFirestoreDocUid());
           const uidLesson = lesson?.createFirestoreDocUid();

            const transChapter = {
                title: lesson?.title,
                subtitle: lesson?.subtitle,
                description: lesson?.description,
                goals: lesson?.goals,
                notes: lesson?.notes,
                prerequisites: lesson?.prerequisites,
                programs: lesson?.programs,
                target_audiences: lesson?.target_audiences,
                materials: lesson?.materials,
                tags: lesson?.tags,
            }
            const qsChapter = encodeURIComponent(JSON.stringify(transChapter));
            const fetchTranslateChapter = await fetch(`/api/test?lang=${LANG}&translations=${qsChapter}`);
            const resultChapter = await fetchTranslateChapter.json();
            const langsChapter = Object.keys(resultChapter);
            const translates = Object.values(resultChapter)?.map?.((trans, i) => new ClassLessonTranslate({ ...trans,lang: langsChapter[i] }));
            
            //const trans = chapter?.goals;
            //const qs = encodeURIComponent(JSON.stringify(trans));
            //const fetchTranslate = await fetch(`/api/test?lang=fr&translations=${qs}`);
            //const result = await fetchTranslate.json();
            //const langs = Object.keys(result);
            //const translates = Object.values(result)?.map?.((trans, i) => new ClassLessonChapterTranslation({ goals: trans, lang: langs[i] }));
            lesson.update({uid:uidLesson});
            lesson.translates = translates;
            console.log("translaaaaates", lesson);
            const _patch = await lesson?.createFirestore();
            console.log("PATCH", _patch);
            setLesson(_patch);
            // router.push(`/admin/chapter/create/${_patch.uid}/subchapters`);
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
            setProcessing(false);
        }
    }
    return (<Stack spacing={2} sx={{ minWidth: '500px', py: 2, px: 3, background: 'var(--card-color)', borderRadius: '15px', }}>
        <Typography>{`Les objectifs du chapitre`}</Typography>
        <Stack spacing={1}>
            {
                lesson?.goals.map((goal, i) => {
                    return (<FieldComponent
                        //required
                        key={`${i}`}
                        value={goal}
                        name={`goal_${i}`}
                        label={`${t('goal n°')} ${i + 1}`}
                        type={'multiline'}
                        onChange={(e) => onChangeValue(e, i)}
                        onClear={() => onClearValue(`goal_${i}`)}
                        removable={true}
                        onRemove={() => {
                            const _goals = goals.filter(v => v !== goal);
                            setGoals(_goals);
                            setLesson(prev => {
                                if (!prev) return new ClassLessonChapter({ goals: _goals });
                                //const _goals = prev.goals;
                                //_goals.push(newGoal);
                                //prev.goals.push(newGoal);
                                prev.update({ goals: _goals });
                                return prev.clone();
                            });
                        }}
                        /*
                        editable={true}
                        onSubmit={() => {
                            setChapter(prev => {
                                if (!prev) return new ClassLessonChapter({ goals: [newGoal] });
                                const _goals = prev.goals;
                                _goals.push(newGoal);
                                //prev.goals.push(newGoal);
                                prev.update({ goals: _goals });
                                return prev.clone();
                            })
                            setNewGoal("");
                        }}
                        */
                        error={errors?.goal}

                        minRows={1}
                        maxRows={10}
                        fullWidth
                        style={{ width: '100%' }}
                    />)
                })
            }
            <FieldComponent
                //required
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
                    setLesson(prev => {
                        if (!prev) return new ClassLessonChapter({ goals: [newGoal] });
                        const _goals = prev.goals;
                        _goals.push(newGoal);
                        //prev.goals.push(newGoal);
                        prev.update({ goals: _goals });
                        return prev.clone();
                    });
                    setDisabledNext(false);
                    setNewGoal("");
                }}
                error={errors?.new_goal}

                minRows={3}
                maxRows={10}
                fullWidth
                style={{ width: '100%' }}
            />


            <Stack direction={'row'} spacing={1} sx={{ py: 2, px: 1 }} alignItems={'center'}>
                <ButtonCancel
                    label="Précédent"
                    loading={processing}
                    //disabled={disabledNext}
                    onClick={onGoBack}
                />
                <ButtonConfirm
                    label="Suivant"
                    loading={processing}
                    //disabled={disabledNext || !chapter?.goals?.length}
                    onClick={onSubmit}
                />
            </Stack>
        </Stack>
    </Stack>)
}
