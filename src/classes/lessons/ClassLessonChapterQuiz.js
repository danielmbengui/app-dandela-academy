// classes/modules/ClassModule.js
import {
    collection,
    getCountFromServer,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    where,
    limit,
    collectionGroup,
} from "firebase/firestore";
import { firestore } from "@/contexts/firebase/config";

import { defaultLanguage } from "@/contexts/i18n/settings";
import { mixArray } from "@/contexts/functions";

export class ClassLessonChapterQuiz {
    static COLLECTION = "SUBCHAPTERS";
    static NS_COLLECTION = `classes/subchapters`;

    constructor({
        uid_intern = "",
        uid_chapter = "",
        chapter = null,
        questions = [],
    } = {}) {
        this._uid_intern = uid_intern;
        this._uid_chapter = uid_chapter;
        this._chapter = chapter;
        this._questions = questions.map(q => {
            const question = new ClassLessonChapterQuestion(q);
            const translates = question._convertTranslatesFromFirestore(q.translates);
            for(const trans of translates) {
                trans.proposals = mixArray(trans.proposals);
            }
            question.translates = translates;
            return(question);
        });
    }
    // uid_intern
    get uid_intern() {
        return this._uid_intern;
    }
    set uid_intern(value) {
        this._uid_intern = String(value ?? "");
    }

    // uid_lesson
    get uid_chapter() {
        return this._uid_chapter;
    }
    set uid_chapter(value) {
        this._uid_chapter = String(value ?? "");
    }

    // lesson
    get chapter() {
        return this._chapter;
    }
    set chapter(value) {
        this._chapter = value ?? null;
    }

    get questions() {
        return this._questions;
    }
    set questions(value) {
        this._questions = value;
    }
    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }
    _convertTranslatesToFirestore(translates = []) {
        var translatesObj = {};
        for (const trans of translates) {
            translatesObj[trans.lang] = trans.toJSON?.() || trans || {};
        }
        return translatesObj;
    }
    _convertTranslatesFromFirestore(translatesObj = {}) {
        const translates = Object.values(translatesObj)?.map?.(trans => new ClassLessonChapterQuizTranslation(trans)) || [];
        return translates;
    }
    static _toJsDate(v) {
        if (!v) return null;
        if (v instanceof Date) return v;
        if (v instanceof Timestamp) return v.toDate();
        if (typeof v?.toDate === "function") return v.toDate();
        if (typeof v?.seconds === "number") return new Date(v.seconds * 1000);
        return null;
    }
    // --- Serialization ---
    toJSON() {
        const out = { ...this };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        cleaned.chapter = null;
        // cleaned.translate = null;
        //cleaned.translates = null;
        //cleaned.computers = null;
        delete cleaned.chapter;
        // delete cleaned.translate;
        //delete cleaned.translates;
        //delete cleaned.computers;
        //console.log("to json session", cleaned.slots.map(slot => slot.toJSON()))
        //cleaned.slots = cleaned.slots.map(slot => slot.toJSON?.());
        return cleaned;
    }
    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }
    clone() {
        return new ClassLessonChapterQuiz({
            ...this.toJSON(),
            lesson: this._lesson,
            translate: this._translate,
            //translates: this._translates,
            //computers: this._computers,
        });
    }

    // ---------- Converter intégré ----------
    static _toJsDate(v) {
        if (!v) return null;
        if (v instanceof Date) return v;
        if (v instanceof Timestamp) return v.toDate();
        if (typeof v?.toDate === "function") return v.toDate();
        if (typeof v?.seconds === "number") return new Date(v.seconds * 1000);
        return null;
    }
    getTranslate(lang = defaultLanguage) {
        if (!lang) return null;
        const translate = this._translates?.find(item => item.lang === lang);
        //if(!translate) return null;
        return translate;
    }
}
export class ClassLessonChapterQuizTranslation {
    static COLLECTION = "i18n";
    static NS_COLLECTION = `classes/lesson`;

    constructor({
        lang = "",
        title = "",
        goals = [],
        keys = [],
        exercises = [],
        photo_url = "",
    } = {}) {
        this._lang = lang;
        this._title = title;
        this._goals = goals;
        this._keys = keys;
        this._exercises = exercises;
        this._photo_url = photo_url;
    }

    // lang
    get lang() {
        return this._lang;
    }
    set lang(value) {
        this._lang = value || "";
    }
    // title
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value || "";
    }
    // description
    get exercises() {
        return this._exercises;
    }
    set exercises(value) {
        this._exercises = value || [];
    }
    // goals
    get goals() {
        return this._goals;
    }
    set goals(value) {
        this._goals = value || [];
    }
    // subtitle
    get keys() {
        return this._keys;
    }
    set keys(value) {
        this._keys = value || [];
    }
    get photo_url() {
        return this._photo_url;
    }
    set photo_url(value) {
        this._photo_url = value || "";
    }
    // --- Serialization ---
    toJSON() {
        const out = { ...this };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        return cleaned;
    }
    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }
    clone() {
        return new ClassLessonChapterQuizTranslation(this.toJSON());
        //return new ClassUser(this.toJSON());
    }
}
export class ClassLessonChapterQuestion {
    static COLLECTION = "SUBCHAPTERS";
    static NS_COLLECTION = `classes/subchapters`;

    constructor({
        uid_intern = "",
        translate = {},
        translates = [],
    } = {}) {
        this._uid_intern = uid_intern;
        this._translate = translate && typeof translate === "object" ? translate : {};
        this._translates = translates;
    }
    // uid_intern
    get uid_intern() {
        return this._uid_intern;
    }
    set uid_intern(value) {
        this._uid_intern = String(value ?? "");
    }

    // translate (objet)
    get translate() {
        return this._translate;
    }
    set translate(value) {
        this._translate = value && typeof value === "object" ? value : {};
    }

    // translates (array)
    get translates() {
        return this._translates;
    }
    set translates(value) {
        this._translates = value;
    }
    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }
    _convertTranslatesToFirestore(translates = []) {
        var translatesObj = {};
        for (const trans of translates) {
            translatesObj[trans.lang] = trans.toJSON?.() || trans || {};
        }
        return translatesObj;
    }
    _convertTranslatesFromFirestore(translatesObj = {}) {
        const translates = Object.values(translatesObj)?.map?.(trans => new ClassLessonChapterQuestionTranslation(trans)) || [];
        return translates;
    }
    static _toJsDate(v) {
        if (!v) return null;
        if (v instanceof Date) return v;
        if (v instanceof Timestamp) return v.toDate();
        if (typeof v?.toDate === "function") return v.toDate();
        if (typeof v?.seconds === "number") return new Date(v.seconds * 1000);
        return null;
    }
    // --- Serialization ---
    toJSON() {
        const out = { ...this };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        //cleaned.chapter = null;
        cleaned.translate = null;
        //cleaned.translates = null;
        //cleaned.computers = null;
        //delete cleaned.chapter;
        delete cleaned.translate;
        //delete cleaned.translates;
        //delete cleaned.computers;
        //console.log("to json session", cleaned.slots.map(slot => slot.toJSON()))
        //cleaned.slots = cleaned.slots.map(slot => slot.toJSON?.());
        return cleaned;
    }
    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }
    clone() {
        return new ClassLessonChapterQuestion({
            ...this.toJSON(),
            //lesson: this._lesson,
            translate: this._translate,
            //translates: this._translates,
            //computers: this._computers,
        });
    }

    // ---------- Converter intégré ----------
    static _toJsDate(v) {
        if (!v) return null;
        if (v instanceof Date) return v;
        if (v instanceof Timestamp) return v.toDate();
        if (typeof v?.toDate === "function") return v.toDate();
        if (typeof v?.seconds === "number") return new Date(v.seconds * 1000);
        return null;
    }
    getTranslate(lang = defaultLanguage) {
        if (!lang) return null;
        const translate = this._translates?.find(item => item.lang === lang);
        //if(!translate) return null;
        return translate;
    }
}
export class ClassLessonChapterQuestionTranslation {
    static COLLECTION = "i18n";
    static NS_COLLECTION = `classes/lesson`;

    constructor({
        lang = "",
        question = "",
        proposals = [],
        answer = "",
    } = {}) {
        this._lang = lang;
        this._question = question;
        this._proposals = proposals;
        this._answer = answer;
    }

    // lang
    get lang() {
        return this._lang;
    }
    set lang(value) {
        this._lang = value || "";
    }
    // title
    get question() {
        return this._question;
    }
    set question(value) {
        this._question = value || "";
    }
    get proposals() {
        return this._proposals;
    }
    set proposals(value) {
        this._proposals = value || [];
    }

    get answer() {
        return this._answer;
    }
    set answer(value) {
        this._answer = value || "";
    }
    // --- Serialization ---
    toJSON() {
        const out = { ...this };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        return cleaned;
    }
    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }
    clone() {
        return new ClassLessonChapterQuestionTranslation(this.toJSON());
        //return new ClassUser(this.toJSON());
    }
}