"use client"
import React, { useState } from "react"
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
import { ClassLessonSubchapter } from "@/classes/lessons/ClassLessonSubchapter"

const MODE_CREATE_CHAPTER = 'create-chapter';
const MODE_ADD_GOALS = 'add-goals';
const MODE_CREATE_SUB_CHAPTERS = 'create-subchapters';
//const MODE_CREATE_CHAPTER = 'create-chapter';
//const MODE_CREATE_CHAPTER = 'create-chapter';
//const MODE_CREATE_CHAPTER = 'create-chapter';
//const MODE_CREATE_CHAPTER = 'create-chapter';
export default function CreateSubchapters() {
    const {uid}=useParams();
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const [mode, setMode] = useState(MODE_CREATE_SUB_CHAPTERS);
    const [chapter, setChapter] = useState(null);
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
            Create/Update subchapters - {uid}
        </Typography>
        {
            mode === MODE_CREATE_CHAPTER && <CreateChapterComponent chapter={chapter} setChapter={setChapter} setMode={setMode} />
        }
        {
            mode === MODE_ADD_GOALS && <GoalsComponent chapter={chapter} setChapter={setChapter} setMode={setMode} />
        }
        {
            mode === MODE_CREATE_SUB_CHAPTERS && <CreateSubchaptersComponent chapter={chapter} setChapter={setChapter} setMode={setMode} />
        }
    </Stack>)
}
function CreateChapterComponent({ chapter = null, setChapter = null, setMode = null }) {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const { lessons } = useLesson();
    const [disabledNext, setDisabledNext] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const onChangeValue = (e) => {
        const { name, value, type } = e.target;
        //const { value } = e.target;
        setErrors({ [name]: '' });
        setDisabledNext(false);
        setChapter(prev => {
            if (!prev) return new ClassLessonChapter({ [name]: value });
            prev.update({ [name]: type === 'number' ? parseInt(value) : value });
            return prev.clone();
        })

    }
    const onClearValue = (name) => {
        //const { name, value, type } = e.target;
        //const { value } = e.target;
        setErrors({ [name]: '' });
        setDisabledNext(false);
        setChapter(prev => {
            if (!prev) return new ClassLessonChapter({ [name]: '' });
            prev.update({ [name]: '' });
            return prev.clone();
        });
    }
    const onGoNext = () => {
        console.log("click next")
        const _errors = {};
        if (!chapter?.uid_lesson) {
            _errors.uid_lesson = 'error-lesson';
        }
        console.log("step one", _errors)
        if (!chapter?.level) {
            _errors.level = 'error-level';
        }
        if (!chapter?.title) {
            _errors.title = 'error-title';
        }
        if (!chapter?.subtitle) {
            _errors.subtitle = 'error-subtitle';
        }
        if (!chapter?.description) {
            _errors.description = 'error-description';
        }
        if (!chapter?.estimated_start_duration || chapter?.estimated_start_duration === 0) {
            _errors.estimated_start_duration = 'error-estimated_start_duration';
            //return;
        }
        if (!chapter?.estimated_end_duration || chapter?.estimated_end_duration === 0 || chapter?.estimated_end_duration < chapter?.estimated_start_duration) {
            _errors.estimated_end_duration = 'error-estimated_end_duration';
        }
        setErrors(_errors);
        if (Object.keys(_errors).length > 0) {
            console.log("ERRRRRORS", _errors);
            setDisabledNext(true);
            return;
        }
        chapter.update({ uid: chapter.createFirestoreDocUid() });
        //console.log("click next", chapter.createFirestoreDocUid())
        setMode(MODE_ADD_GOALS);
    }

    return (<Stack spacing={2} sx={{ py: 2, px: 3, background: 'var(--card-color)', borderRadius: '15px', }}>
        <Typography>{`Créer un chapitre`}</Typography>
        <Stack spacing={1}>
            <SelectComponentDark
                label={t('uid_lesson', { ns: ClassSession.NS_COLLECTION })}
                name={'uid_lesson'}
                value={chapter?.uid_lesson}
                values={lessons?.map(lesson => ({ id: lesson.uid, value: lesson.translate?.title }))}
                onChange={onChangeValue}
                hasNull={!chapter?.uid_lesson}
                required
                error={errors?.uid_lesson}

            />
            <SelectComponentDark
                required
                label={t('level')}
                value={chapter?.level}
                values={ClassLesson.ALL_LEVELS.map(level => ({ id: level, value: t(level, { ns: ClassSession.NS_COLLECTION }) }))}
                onChange={(e) => {
                    const { value } = e.target;
                    setChapter(prev => {
                        if (!prev) return new ClassLessonChapter({ level: value });
                        prev.update({ level: value });
                        return prev.clone();
                    })
                }}
                hasNull={!chapter?.level}
                error={errors?.level}
            />
            <FieldComponent
                required
                value={chapter?.title || ""}
                name={'title'}
                label={t('title')}
                type={'text'}
                onChange={onChangeValue}
                onClear={() => onClearValue('title')}
                error={errors?.title}
                //minRows={2}
                //maxRows={10}
                fullWidth
            />
            <FieldComponent
                required
                value={chapter?.subtitle || ""}
                name={'subtitle'}
                label={t('subtitle')}
                type={'text'}
                onChange={onChangeValue}
                onClear={() => onClearValue('subtitle')}
                error={errors?.subtitle}
                //minRows={2}
                //maxRows={10}
                fullWidth

            />
            <FieldComponent
                required
                name={'description'}
                label={t('description')}
                placeholder={t('description')}
                type={'multiline'}
                value={chapter?.description || ''}
                onChange={onChangeValue}
                onClear={() => onClearValue('description')}
                error={errors?.description}
                minRows={5}
                maxRows={10}
                fullWidth
            />
            <Stack direction={'row'} spacing={1} sx={{ width: '100%', background: '' }} justifyContent={'stretch'}>
                <FieldComponent
                    required
                    name={"estimated_start_duration"}
                    label={t('duration-start-estimated')}
                    placeholder={t('duration-start-estimated')}
                    type={'number'}
                    value={chapter?.estimated_start_duration || ''}
                    onChange={onChangeValue}
                    onClear={() => onClearValue('estimated_start_duration')}
                    error={errors?.estimated_start_duration}
                    fullWidth
                    style={{ width: '100%' }}
                />
                <FieldComponent
                    required
                    name={"estimated_end_duration"}
                    label={t('duration-end-estimated')}
                    placeholder={t('duration-end-estimated')}
                    type={'number'}
                    value={chapter?.estimated_end_duration || ''}
                    onChange={onChangeValue}
                    onClear={() => onClearValue('estimated_end_duration')}
                    error={errors?.estimated_end_duration}
                    fullWidth
                    style={{ width: '100%' }}
                />
            </Stack>
            <Stack sx={{ py: 1, px: 1 }} alignItems={'end'}>
                <ButtonConfirm
                    label="Suivant"
                    loading={processing}
                    disabled={disabledNext}
                    onClick={onGoNext}
                />
            </Stack>
        </Stack>
    </Stack>)
}
function GoalsComponent({ chapter = null, setChapter = null, setMode = null }) {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const { lessons } = useLesson();
    const [disabledNext, setDisabledNext] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [newGoal, setNewGoal] = useState("");
    const [goals, setGoals] = useState([]);
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
        setChapter(prev => {
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
            const globalTranslates = { ...chapter.translates, goals: translates };
            chapter.translates = globalTranslates;
            //const translatePush = {};
            /*
            for (const trans of translates) {
                translatePush[trans.lang] = trans._convertTranslatesToFirestore(trans);
            }
            */
            console.log("RESULT", result);
            //const translates = new ClassLessonChapterTranslation()._convertTranslatesToFirestore(this._translates);
            console.log("TRANSLATES", chapter._convertTranslatesToFirestore(translates))

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
    return (<Stack spacing={2} sx={{ minWidth: '500px', py: 2, px: 3, background: 'var(--card-color)', borderRadius: '15px', }}>
        <Typography>{`Les objectifs du chapitre`}</Typography>
        <Stack spacing={1}>

            {

                goals.map((goal, i) => {
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
                    setChapter(prev => {
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
                    disabled={disabledNext || !goals?.length}
                    onClick={onGoNext}
                />
            </Stack>
        </Stack>
    </Stack>)
}
function CreateSubchaptersComponent({ chapter = null, setChapter = null, setMode = null }) {
    const { t } = useTranslation([ClassLessonChapter.NS_COLLECTION, ClassSession.NS_COLLECTION, NS_LEVELS]);
    const { lessons } = useLesson();
    const [disabledNext, setDisabledNext] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const [newSubchapter, setNewSubChapter] = useState(null);
    const [subchapters, setSubchapters] = useState([]);

    const [newGoal, setNewGoal] = useState("");
    const [goals, setGoals] = useState([]);
    const NewSubchapterComponent = () => {
        const [subchapter, setSubchapter] = useState(null);
        const onChangeValue = (e) => {
            //e.preventDefault();
            const { name, value, type } = e.target;
            console.log("change", name, value)
            setSubchapter(prev => {
                if (!prev) return new ClassLessonSubchapter({ [name] :[value] });
                //const _goals = [...prev.goals];
                //_goals[index] = value;
                prev.update({ [name]: value });
                //prev.goals = _goals;
                return prev.clone();
            })
        }
        const onClearValue = (name) => {
            //const { name, value, type } = e.target;
            //const { value } = e.target;
            const index = name?.split?.('goal_')?.[1] || -1;
            if (index < 0) return;
            setErrors({ [name]: '' });
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
                <FieldComponent
                    //required
                  //  value={subchapter}
                   // name={`title-${subchapter?.uid_intern}`}
                    label={t(`title`)}
                    type={'text'}
                    //onChange={onChangeNewGoalValue}
                    //onClear={onClearNewGoalValue}
                    /*
                    editable={true}
                    onSubmit={() => {
                        const _goals = [...goals];
                        _goals.push(newGoal.trim());
                        setGoals(_goals);
                        setChapter(prev => {
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
                    */
                 //   error={errors?.new_goal}

                    minRows={3}
                    maxRows={10}
                    fullWidth
                    style={{ width: '100%' }}
                />
                <FieldComponent
                    //required
                   // value={newGoal}
                    name={`default-goal`}
                    label={t('new goal')}
                    type={'multiline'}
                   // onChange={onChangeNewGoalValue}
                   // onClear={onClearNewGoalValue}
                    /*
                    editable={true}
                    onSubmit={() => {
                        const _goals = [...goals];
                        _goals.push(newGoal.trim());
                        setGoals(_goals);
                        setChapter(prev => {
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
                    */
                 //  error={errors?.new_goal}

                    minRows={3}
                    maxRows={10}
                    fullWidth
                    style={{ width: '100%' }}
                />
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
        setChapter(prev => {
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
        chapter.update({ uid_lesson: "zlUoi3t14wzC5cNhfS3J" });
        console.log("click next", chapter.createFirestoreDocUid())
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
    const onTranslateGoals = async () => {
        try {
            //setProcessing(true);
            const trans = goals;
            const qs = encodeURIComponent(JSON.stringify(trans));
            const fetchTranslate = await fetch(`/api/test?lang=fr&translations=${qs}`);
            const result = await fetchTranslate.json();
            const langs = Object.keys(result);
            const translates = Object.values(result)?.map?.((trans, i) => new ClassLessonChapterTranslation({ goals: trans, lang: langs[i] }));
            const globalTranslates = { ...chapter.translates, goals: translates };
            chapter.translates = globalTranslates;
            //const translatePush = {};
            /*
            for (const trans of translates) {
                translatePush[trans.lang] = trans._convertTranslatesToFirestore(trans);
            }
            */
            console.log("RESULT", result);
            //const translates = new ClassLessonChapterTranslation()._convertTranslatesToFirestore(this._translates);
            console.log("TRANSLATES", chapter._convertTranslatesToFirestore(translates))

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
    return (<Stack spacing={2} sx={{ minWidth: '500px', py: 2, px: 3, background: 'var(--card-color)', borderRadius: '15px', }}>
        <Typography>{`Ajouter des sections au chapitre`}</Typography>
        <Stack spacing={1}>

            {
                subchapters.map((subchapter, i) => {
                    return (<div key={i}>
                        <NewSubchapterComponent mode="list" subchapter={subchapter} />
                    </div>)
                })

            }
            <NewSubchapterComponent mode="new" subchapter={newSubchapter} setSubchapter={setNewSubChapter} />
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
                    const _goals = [...subchapters];
                    _goals.push(newGoal.trim());
                    setSubchapters(_goals);
                    setChapter(prev => {
                        if (!prev) return new ClassLessonChapter({ subchapters: [newGoal] });
                        const _goals = prev.subchapters;
                        _goals.push(newGoal);
                        //prev.goals.push(newGoal);
                        prev.update({ subchapters: _goals });
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
                    disabled={disabledNext || !goals?.length}
                    onClick={onGoNext}
                />
            </Stack>
        </Stack>
    </Stack>)
}

function CreateQuizComponent() { }
