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
import { ClassLesson } from "@/classes/ClassLesson";
import { ClassLessonChapter } from "./ClassLessonChapter";
import { defaultLanguage } from "@/contexts/i18n/settings";

export class ClassLessonSubchapter {
    static COLLECTION = "SUBCHAPTERS";
    static NS_COLLECTION = `classes/subchapters`;

    constructor({
        uid_intern = "",
        uid_lesson = "",
        uid_chapter = "",
        chapter = null,
        title = "",
        photo_url = "",
        exercises = [],
        goals = [],
        keys = [],
        translate = {},
        translates = [],
    } = {}) {
        this._uid_intern = uid_intern;
        this._uid_lesson = String(uid_lesson ?? "");
        this._uid_chapter = String(uid_chapter ?? "");
        this._chapter = chapter;
        this._title = title;
        this._photo_url = photo_url;
        this._exercises = Array.isArray(exercises) ? exercises : [];
        this._goals = Array.isArray(goals) ? goals : [];
        this._keys = Array.isArray(keys) ? keys : [];
        this._translate = translate && typeof translate === "object" ? translate : {};
        this._translates = translates ?? [];
    }
    // uid_intern
    get uid_intern() {
        return this._uid_intern;
    }
    set uid_intern(value) {
        this._uid_intern = value;
    }

    // uid_lesson
    get uid_lesson() {
        return this._uid_lesson;
    }
    set uid_lesson(value) {
        this._uid_lesson = String(value ?? "");
    }

    // uid_chapter
    get uid_chapter() {
        return this._uid_chapter;
    }
    set uid_chapter(value) {
        this._uid_chapter = String(value ?? "");
    }

    // chapter
    get chapter() {
        return this._chapter;
    }
    set chapter(value) {
        this._chapter = value ?? null;
    }

    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value ?? "";
    }
    get photo_url() {
        return this._photo_url;
    }
    set photo_url(value) {
        this._photo_url = String(value ?? "");
    }
    get exercises() {
        return this._exercises;
    }
    set exercises(value) {
        this._exercises = Array.isArray(value) ? value : [];
    }
    get goals() {
        return this._goals;
    }
    set goals(value) {
        this._goals = Array.isArray(value) ? value : [];
    }
    get keys() {
        return this._keys;
    }
    set keys(value) {
        this._keys = Array.isArray(value) ? value : [];
    }

    get translate() {
        return this._translate;
    }
    set translate(value) {
        this._translate = value && typeof value === "object" ? value : {};
    }

    get translates() {
        return this._translates;
    }
    set translates(value) {
        this._translates = value ?? [];
    }

    // --- normalisation interne ---
    _convertTranslatesToFirestore(translates = []) {
        const translatesObj = {};
        for (const trans of translates) {
            translatesObj[trans.lang] = trans.toJSON?.() || trans || {};
        }
        return translatesObj;
    }
    _convertTranslatesFromFirestore(translatesObj = {}) {
        return Object.values(translatesObj)?.map?.(trans => new ClassLessonSubchapterTranslation(trans)) || [];
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
        return SubchapterSerializer.toJSON(this);
    }
    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }
    clone() {
        return SubchapterSerializer.fromJSON({
            ...this.toJSON(),
            chapter: this._chapter,
            translate: this._translate,
            translates: this._translates,
            title: this._title,
            photo_url: this._photo_url,
            exercises: this._exercises,
            goals: this._goals,
            keys: this._keys,
        });
    }

    // ---------- Converter Firestore ----------
    static makeSubchapterInstance(uid, data = {}) {
        return new ClassLessonSubchapter({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(subchapterInstance) {
                if (!subchapterInstance?.toJSON) return subchapterInstance;
                return subchapterInstance.toJSON();
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                const translates = (data.translates && typeof data.translates === "object" && !Array.isArray(data.translates))
                    ? (() => {
                        const sub = new ClassLessonSubchapter(data);
                        return sub._convertTranslatesFromFirestore(data.translates);
                    })()
                    : (data.translates || []).map(trans => new ClassLessonSubchapterTranslation(trans));
                return ClassLessonSubchapter.makeSubchapterInstance(uid, {
                    ...data,
                    translates,
                });
            },
        };
    }

    // ---------- Helpers Firestore ----------
    static colRef(uidLesson = "", uidChapter = "") {
        if (!uidLesson || !uidChapter) return null;
        return collection(
            firestore,
            ClassLesson.COLLECTION,
            uidLesson,
            ClassLessonChapter.COLLECTION,
            uidChapter,
            this.COLLECTION
        ).withConverter(this.converter);
    }
    static docRef(uidLesson = "", uidChapter = "", id = "") {
        if (!uidLesson || !uidChapter || !id) return null;
        return doc(
            firestore,
            ClassLesson.COLLECTION,
            uidLesson,
            ClassLessonChapter.COLLECTION,
            uidChapter,
            this.COLLECTION,
            id
        ).withConverter(this.converter);
    }
    static async count(uidLesson = "", uidChapter = "", constraints = []) {
        try {
            const col = this.colRef(uidLesson, uidChapter);
            if (!col) return 0;
            const q = constraints.length ? query(col, ...constraints) : query(col);
            const snap = await getCountFromServer(q);
            return snap.data().count ?? 0;
        } catch (error) {
            console.error("ClassLessonSubchapter.count", error);
            return 0;
        }
    }

    createFirestoreDocUid() {
        try {
            const uidLesson = this._uid_lesson || this._chapter?.uid_lesson || "";
            const uidChapter = this._uid_chapter || "";
            if (!uidLesson || !uidChapter) return null;
            const colRef = collection(
                firestore,
                ClassLesson.COLLECTION,
                uidLesson,
                ClassLessonChapter.COLLECTION,
                uidChapter,
                this.constructor.COLLECTION
            );
            const newRef = doc(colRef);
            return newRef.id;
        } catch (error) {
            console.error("ClassLessonSubchapter.createFirestoreDocUid", error);
            return null;
        }
    }
    async createFirestore() {
        try {
            const uidLesson = this._uid_lesson || this._chapter?.uid_lesson || "";
            const uidChapter = this._uid_chapter || "";
            if (!uidLesson || !uidChapter) {
                console.error("ClassLessonSubchapter.createFirestore: uid_lesson / uid_chapter manquants");
                return null;
            }
            let newRef = null;
            if (this._uid) {
                newRef = this.constructor.docRef(uidLesson, uidChapter, this._uid);
            } else {
                const colRef = this.constructor.colRef(uidLesson, uidChapter);
                if (!colRef) return null;
                newRef = doc(colRef).withConverter(this.constructor.converter);
            }
            if (!this._uid) {
                this._uid = newRef.id;
            }
            if (!this._uid_lesson) this._uid_lesson = uidLesson;
            if (!this._uid_chapter) this._uid_chapter = uidChapter;
            await setDoc(newRef, this, { merge: true });
            return this.constructor.makeSubchapterInstance(this._uid, this.toJSON());
        } catch (error) {
            console.error("ClassLessonSubchapter.createFirestore", error);
            return null;
        }
    }
    async updateFirestore(patch = {}) {
        try {
            const uidLesson = this._uid_lesson || this._chapter?.uid_lesson || "";
            const uidChapter = this._uid_chapter || "";
            if (!uidLesson || !uidChapter || !this._uid) {
                console.error("ClassLessonSubchapter.updateFirestore: uid_lesson / uid_chapter / uid manquants");
                return null;
            }
            const ref = this.constructor.docRef(uidLesson, uidChapter, this._uid);
            if (patch && Object.keys(patch).length) {
                this.update(patch);
            }
            await setDoc(ref, this, { merge: true });
            return this.constructor.makeSubchapterInstance(this._uid, this.toJSON());
        } catch (e) {
            console.error("ClassLessonSubchapter.updateFirestore", e);
            return null;
        }
    }

    getTranslate(lang = defaultLanguage) {
        if (!lang) return null;
        return this._translates?.find(item => item.lang === lang) ?? null;
    }
}

/** Serialiseur pour ClassLessonSubchapter (même logique que ChapterSerializer). */
class SubchapterSerializer {
    static fieldsToRemove = ["chapter", "translate","exercises","goals","keys","photo_url", "title"];
    static toJSON(subchapter) {
        const out = { ...subchapter };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v])
        );
        cleaned.translates = subchapter._convertTranslatesToFirestore(subchapter.translates || []);
        for (const field of this.fieldsToRemove) {
            delete cleaned[field];
        }
        return cleaned;
    }
    static fromJSON(data) {
        const hasUnderscoreKeys = Object.keys(data).some((k) => k.startsWith("_"));
        const cleaned = hasUnderscoreKeys
            ? Object.fromEntries(
                Object.entries(data)
                    .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                    .map(([k, v]) => [k.replace(/^_/, ""), v])
            )
            : { ...data };
        const translates =
            cleaned.translates && typeof cleaned.translates === "object" && !Array.isArray(cleaned.translates)
                ? Object.values(cleaned.translates).map((t) => new ClassLessonSubchapterTranslation(t))
                : (cleaned.translates || []).map((t) => (t && (t.lang != null || t._lang != null) ? new ClassLessonSubchapterTranslation(t) : t));
        const uid = cleaned.uid ?? "";
        return ClassLessonSubchapter.makeSubchapterInstance(uid, { ...cleaned, translates });
    }
}
export class ClassLessonSubchapterTranslation {
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
        return new ClassLessonSubchapterTranslation(this.toJSON());
        //return new ClassUser(this.toJSON());
    }
}