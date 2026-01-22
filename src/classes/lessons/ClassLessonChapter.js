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
import { ClassLesson } from "../ClassLesson";
import { defaultLanguage } from "@/contexts/i18n/settings";
import { ClassLessonSubchapter } from "./ClassLessonSubchapter";
import { ClassLessonChapterQuiz } from "./ClassLessonChapterQuiz";

export class ClassLessonChapter {
    static COLLECTION = "CHAPTERS";
    static NS_COLLECTION = `classes/chapter`;

    static ERROR = Object.freeze({
        ALREADY_EXISTS: 'already-exists',
        UNKNOWN: 'unknown',
    });
    static CATEGORY = Object.freeze({
        HARDWARE: 'hardware',
        FOOD_MATERIAL: 'food-material',
        OTHER: 'other',
        UNKNOWN: 'unknown',
    });
    static TYPE = Object.freeze({
        ADMIN: 'admin-room',
        ROOM: 'room',
        CAFETERIA: 'cafeteria',
        UNKNOWN: 'unknown',
    });
    static LEVEL = Object.freeze({
        BEGINNER: 'beginner', // débutant
        INTERMEDIATE: 'intermediate', // intermediraire
        COMPETENT: 'competent', // compétent
        ADVANCED: 'advanced', // avancé
        EXPERT: 'expert', // expert
        UNKNOWN: 'unknown',
    });
    static ALL_LEVELS = Object.values(this.LEVEL).filter(l => l !== this.LEVEL.UNKNOWN);
    static DEFAULT_QUIZ_DELAY_DAYS = 7;

    constructor({
        uid = "",
        uid_intern = "",
        uid_lesson = "",
        lesson = null,
        quiz = null,
        quiz_delay_days = 7,
        title = "",
        subtitle = "",
        description = "",
        estimated_start_duration = 0,
        estimated_end_duration = 0,

        photo_url = "",
        level = "",
        goals = [],
        subchapters_title = "",
        subchapters = [],
        translate = [],
        translates = [],
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        this._uid = uid;
        this._uid_intern = uid_intern;
        this._uid_lesson = uid_lesson;

        this._lesson = lesson;
        this._quiz = quiz;

        this._title = title;
        this._subtitle = subtitle;
        this._description = description;
        this._level = level;
        this._photo_url = photo_url;

        this._estimated_start_duration = estimated_start_duration;
        this._estimated_end_duration = estimated_end_duration;
        this._quiz_delay_days = quiz_delay_days;

        this._goals = goals;
        this._subchapters_title = subchapters_title;
        this._subchapters = subchapters;

        this._translate = translate && typeof translate === "object" ? translate : {};
        this._translates = translates;

        this._created_time = created_time instanceof Date ? created_time : new Date(created_time);
        this._last_edit_time = last_edit_time instanceof Date ? last_edit_time : new Date(last_edit_time);
    }

    // uid
    get uid() {
        return this._uid;
    }
    set uid(value) {
        this._uid = String(value ?? "");
    }

    // uid_intern
    get uid_intern() {
        return this._uid_intern;
    }
    set uid_intern(value) {
        this._uid_intern = String(value ?? "");
    }

    // uid_lesson
    get uid_lesson() {
        return this._uid_lesson;
    }
    set uid_lesson(value) {
        this._uid_lesson = String(value ?? "");
    }

    // lesson
    get lesson() {
        return this._lesson;
    }
    set lesson(value) {
        this._lesson = value ?? null;
    }
    get quiz() {
        return this._quiz;
    }
    set quiz(value) {
        this._quiz = value ?? null;
    }
    // title
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = String(value ?? "");
    }
    // subtitle
    get subtitle() {
        return this._subtitle;
    }
    set subtitle(value) {
        this._subtitle = String(value ?? "");
    }
    // description
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = String(value ?? "");
    }
    // estimated_start_duration
    get estimated_start_duration() {
        return this._estimated_start_duration;
    }
    set estimated_start_duration(value) {
        this._estimated_start_duration = value;
    }
    // estimated_end_duration
    get estimated_end_duration() {
        return this._estimated_end_duration;
    }
    set estimated_end_duration(value) {
        this._estimated_end_duration = value;
    }
    // quiz_delay_days
    get quiz_delay_days() {
        return this._quiz_delay_days;
    }
    set quiz_delay_days(value) {
        this._quiz_delay_days = value;
    }

    // level
    get photo_url() {
        return this._photo_url;
    }
    set photo_url(value) {
        this._photo_url = String(value ?? "");
    }

    // level
    get level() {
        return this._level;
    }
    set level(value) {
        this._level = String(value ?? "");
    }

    // goals
    get goals() {
        return this._goals;
    }
    set goals(value) {
        this._goals = Array.isArray(value) ? value : [];
    }

    // subchapters_title
    get subchapters_title() {
        return this._subchapters_title;
    }
    set subchapters_title(value) {
        this._subchapters_title = value;
    }

    // subchapters
    get subchapters() {
        return this._subchapters;
    }
    set subchapters(value) {
        this._subchapters = Array.isArray(value) ? value : [];
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

    // created_time
    get created_time() {
        return this._created_time;
    }
    set created_time(value) {
        this._created_time = value instanceof Date ? value : new Date(value);
    }

    // last_edit_time
    get last_edit_time() {
        return this._last_edit_time;
    }
    set last_edit_time(value) {
        this._last_edit_time = value instanceof Date ? value : new Date(value);
    }

    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }
    _normalizeCategory(category) {
        return Object.values(ClassLessonChapter.CATEGORY).includes(category)
            ? category
            : ClassLessonChapter.CATEGORY.UNKNOWN;
    }
    _normalizeCategories(categories) {
        const array = [];
        for (let i = 0; i < categories.length; i++) {
            const element = categories[i];
            array.push(this._normalizeCategory(element));
        }
        return [...new Set(array)].filter(item => item !== ClassLessonChapter.CATEGORY.UNKNOWN);
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
        //cleaned.translates = this._convertTranslatesToFirestore?.(this._translates || []);
        //cleaned.quiz = this._quiz?.toJSON();
        /*
        cleaned.subchapters = this._subchapters?.map?.((sub) => {
           // const subClass = new ClassLessonSubchapter(sub);
            //const translates = subClass._convertTranslatesToFirestore(sub.translates);
            //subClass.translates = translates;
            return sub.toJSON();
        });
        */
        cleaned.lesson = null;
        cleaned.translate = null;
        cleaned.title = null;
        cleaned.subchapters_title = null;
        cleaned.subtitle = null;
        cleaned.description = null;
        cleaned.goals = null;
        //cleaned.translates = null;
        //cleaned.computers = null;
        delete cleaned.lesson;
        delete cleaned.translate;
        delete cleaned.title;
        delete cleaned.subchapters_title;
        delete cleaned.subtitle;
        delete cleaned.description;
        delete cleaned.goals;

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
        return ClassLessonChapter.makeChapterInstance(this._uid, {
            ...this.toJSON(),
            lesson: this._lesson,
            translate: this._translate,
            //translates: this._translates,
            title: this._title,
            subtitle: this._subtitle,
            description: this._description,
            goals: this._goals,
            subchapters_title: this._subchapters_title,
            subchapters: this._subchapters,
            quiz: this._quiz,
            //computers: this._computers,
        });
    }
    // ---------- VALIDATIONS ----------
    /*
    isErrorLastName() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        if (this._last_name.length > 0 && (this._last_name.length < ClassUser.MIN_LENGTH_LAST_NAME || this._last_name.length > ClassUser.MAX_LENGTH_LAST_NAME)) return (true);
        return (false);
    }
    validLastName() {
        if (!this._last_name || this._last_name.length === 0 || this.isErrorLastName()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    */
    // ---------- Converter intégré ----------
    static _toJsDate(v) {
        if (!v) return null;
        if (v instanceof Date) return v;
        if (v instanceof Timestamp) return v.toDate();
        if (typeof v?.toDate === "function") return v.toDate();
        if (typeof v?.seconds === "number") return new Date(v.seconds * 1000);
        return null;
    }
    static makeChapterInstance(uid, data = {}) {
        return new ClassLessonChapter({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(chapterInstance) {
                // chaque classe a un .toJSON() propre
                /*
                var translates = {};
                for (const trans of chapterInstance?.translates) {
                    translates[trans.lang] = trans;
                }
                */
                //const translates = chapterInstance?.translates?._convertTranslatesToFirestore();
                //const translates = ClassLessonChapter._convertTranslatesToFirestore(this._translates);
                //const translates = chapterInstance._convertTranslatesToFirestore(chapterInstance.translates);
                //console.log("TRANSLATES", translates)
                // chaque classe a un .toJSON() propre
                //chapterInstance.quiz = chapterInstance?.quiz?.toJSON ? chapterInstance?.quiz?.toJSON() : chapterInstance?.quiz;
                return chapterInstance?.toJSON ? chapterInstance.toJSON() : chapterInstance;
                //return chapterInstance?.toJSON ? chapterInstance.toJSON() : chapterInstance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                var created_time = ClassLessonChapter._toJsDate(data.created_time);
                var last_edit_time = ClassLessonChapter._toJsDate(data.last_edit_time);
                const translates = Object.values(data.translates)?.map?.(trans => new ClassLessonChapterTranslation(trans));
                const subchapters = data.subchapters?.map?.((sub) => {
                    const subClass = new ClassLessonSubchapter(sub);
                    const translates = subClass._convertTranslatesFromFirestore(sub.translates);
                    subClass.translates = translates;
                    return subClass;
                });
                const quiz = data.quiz ? new ClassLessonChapterQuiz(data.quiz) : {};
                return ClassLessonChapter.makeChapterInstance(uid, { ...data, created_time, last_edit_time, translates: translates, subchapters, quiz });
            },
        };
    }
    _convertTranslatesToFirestore(translates = []) {
        var translatesObj = {};
        for (const trans of translates) {
            translatesObj[trans.lang] = trans.toJSON?.() || trans || {};
        }
        return translatesObj;
    }
    _convertTranslatesFromFirestore(translatesObj = {}) {
        const translates = Object.values(translatesObj)?.map?.(trans => new ClassLessonChapterTranslation(trans)) || [];
        return translates;
    }

    // ---------- Helpers Firestore ----------
    static async alreadyExist(_uid) {
        const q = query(
            collection(firestore, ClassLessonChapter.COLLECTION),
            where("uid", "==", _uid)
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static async alreadyExistByName(_name) {
        const q = query(
            collection(firestore, ClassLessonChapter.COLLECTION),
            where("name_normalized", "==", this._name.toLowerCase().trim())
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static colRef() {
        // if (!uidLesson) return;
        return collectionGroup(firestore, this.COLLECTION).withConverter(this.converter);
        //return collection(firestore, ClassLesson.COLLECTION, uidLesson, this.COLLECTION).withConverter(this.converter);
    }
    static docRef(uidLesson = "", id = "") {
        if (!uidLesson || !id) return;
        return doc(firestore, ClassLesson.COLLECTION, uidLesson, this.COLLECTION, id).withConverter(this.converter);
    }
    static async count(uidLesson = "", constraints = []) {
        try {
            const q = query(this.colRef(), [where("uid_lesson", "==", uidLesson), ...constraints]);        //const qSnap = await getDocs(q);
            //const coll = collection(firestore, ClassUser.COLLECTION);
            //const coll = this.colRef();
            //console.log("waaaa", q)
            const snap = await getCountFromServer(q);
            return snap.data().count; // -> nombre total
        } catch (error) {
            console.log("Errror", error)
        }
    }
    /*
    static async countByDates(start_date = null, end_date = null) {
        //const coll = collection(firestore, ClassUser.COLLECTION);
        const day_s = start_date.getDate();
        const month_s = start_date.getMonth();
        const year_s = start_date.getFullYear();
        const day_e = end_date.getDate();
        const month_e = end_date.getMonth();
        const year_e = end_date.getFullYear();
        const _start_date = new Date(year_s, month_s, day_s, 0, 0);
        const _end_date = new Date(year_e, month_e, day_e, 23, 59, 59);
        console.log("DATTE", start_date)

        const q = query(
            collection(firestore, this.COLLECTION).withConverter(ClassUser.converter),
            where("created_time", ">=", _start_date),
            where("created_time", "<=", _end_date),
            //limit(1),
        );
        const snap = await getDocs(q);
        if (snap.empty) return 0;
        console.log("OUUTN", snap.size, snap.docs[0].data().uid)
        return snap.size;
    }
*/
    // Récupérer un module par id
    static indexOf(array = [], uid) {
        if (array.length === 0 || !(array[0] instanceof ClassLessonChapter)) {
            return -1;
        }
        if (!(array[0] instanceof ClassLessonChapter)) {
            console.log("ERRROR is not class Room")
            return -1;
        }
        const indexof = array.findIndex(item => item.uid === uid);
        return indexof;
    }
    getTranslate(lang = defaultLanguage) {
        if (!lang) return null;
        const translate = this._translates?.find(item => item.lang === lang);
        //if(!translate) return null;
        return translate;
    }
    static async get(id, lang = defaultLanguage) {
        const q = query(
            collectionGroup(firestore, this.COLLECTION).withConverter(this.converter),
            where("uid", "==", id),
            limit(1)
        );


        const snaps = await getDocs(q);
        if (snaps.empty) return null;

        const docSnap = snaps.docs[0];
        const chapter = docSnap.data();
        const translate = chapter.translates?.find(item => item.lang === lang);
        chapter.translate = translate;
        chapter.quiz.questions = chapter.quiz.questions?.map(q => {
            const translate = q.translates?.find(item => item.lang === lang);
            q.translate = translate;
            return (q);
        });
        console.log("chapter get class", chapter)
        return chapter;
    }
    static async getByName(_name) {
        //const usersCol = collection(firestore, ClassUser.COLLECTION).withConverter(ClassUser.converter);
        const q = query(
            collection(firestore, ClassLessonChapter.COLLECTION).withConverter(ClassLessonChapter.converter),
            where("name_normalized", "==", _name.toLowerCase().trim()),
            limit(1),
        );
        const snap = await getDocs(q);
        const myDoc = snap.docs[0];
        if (!snap.empty) {
            return myDoc.data();
        }
        return null; // -> ClassModule | null
    }
    // Lister des modules (passer des contraintes Firestore : where(), orderBy(), limit()…)
    static async list(lang = defaultLanguage, constraints = []) {
        const ref = ClassLessonChapter.colRef(); // par ex.;
        //const constraints = [];
        /*
        if (uidLesson) {
            constraints.push(where("uid_lesson", "==", uidLesson));
        }
        */
        /*           //const coll = this.colRef();
        const q = constraints.length
            ? query(colRef, ...constraints)
            : colRef;
            */
        const q = constraints.length ? query(ref, constraints) : query(ref);
        //const finalConstraints = [...constraints];
        //if(!uidLesson)return;
        //const q = constraints.length ? query(this.colRef(), ...constraints) : query(this.colRef());
        const qSnap = await getDocs(q);
        if(qSnap.size === 0) return [];
        console.log("REEEF", qSnap.size)

        const chapters = qSnap.docs.map(docSnap => {
            const chapter = docSnap.data();
            const translate = chapter.translates?.find(item => item.lang === lang);
            chapter.translate = translate;
            chapter.subchapters = chapter.subchapters?.map(sub => {
                const translate = sub.translates?.find(item => item.lang === lang);
                sub.translate = translate;
                return (sub);
            });
            chapter.quiz.questions = chapter.quiz.questions?.map(q => {
                const translate = q.translates?.find(item => item.lang === lang);
                q.translate = translate;
                return (q);
            });
            return chapter;
        });

        return chapters || [];
    }
    // Créer un user (avec option timestamps serveur)
    createRoomName(idRoom = '', isNormalized = false) {
        var prefix = isNormalized ? "room" : "ROOM";

        return `${prefix}-${(idRoom).toString().padStart(2, '0')}`;;
    }
    // Créer un user (avec option timestamps serveur)
    createFirestoreDocUid() {
        try {
            const colRef = collection(
                firestore,
                ClassLesson.COLLECTION,
                this._uid_lesson,
                this.constructor.COLLECTION
            );
            const newRef = doc(colRef);
            //const newRef = doc(this.constructor.colRef()); // id auto
            console.log("errorrrrrr after")
            return newRef.id;
        } catch (error) {
            console.log("ERRRRROROOOORO", error);
            return null;
        }
    }
    async createFirestore() {
        try {
            console.log("errorrrrrr");
            var newRef = null;
            if (this._uid) {
                newRef = this.constructor.docRef(this._uid_lesson, this._uid);
            } else {
                const colRef = collection(
                    firestore,
                    ClassLesson.COLLECTION,
                    this._uid_lesson,
                    this.constructor.COLLECTION
                );
                newRef = doc(colRef);
            }
            //const newRef = doc(this.constructor.colRef()); // id auto
            console.log("errorrrrrr after")
            const count = await this.constructor.count(this._uid_lesson) || 0;
            //const countRoom = await ClassRoom.count() || 0;
            const idChapter = count + 1;
            this._uid = newRef.id;
            this._uid_intern = idChapter;
            //this._name = this.createRoomName(idRoom);
            //this._name_normalized = this.createRoomName(idRoom, true);
            //this._enabled = true;
            this._created_time = new Date();
            this._last_edit_time = new Date();
            //const translates = new ClassLessonChapterTranslation()._convertTranslatesToFirestore(this._translates);
            //console.log("TRANSLATES", translates)
            //const translates = this._convertTranslatesToFirestore(this._translates);
            await setDoc(newRef, { ...this.toJSON() });
            const translates = Object.values(this._translates)?.map?.(trans => new ClassLessonChapterTranslation(trans));
            return this.constructor.makeChapterInstance(this._uid, { ...this.toJSON(), translates: translates }); // -> ClassModule
        } catch (error) {
            console.log("ERRRRROROOOORO", error)
        }
    }
    // Mettre à jour un module
    async updateFirestore(patch = {}) {
        try {
            const ref = this.constructor.docRef(this._uid_lesson, this._uid);
            const data = { ...patch, last_edit_time: new Date() };

            await updateDoc(ref, data, { merge: true });
            //console.log("weshtest", await this.constructor.fetchFromFirestore(this._uid))
            //console.log("UPDATE COMPLETED")
            return await this.constructor.fetchFromFirestore(this._uid); // -> ClassModule
        } catch (e) {
            console.log("Rrror update chapter", e)
            return null;
        }
    }
    // Supprimer un module
    static async remove(id) {
        await deleteDoc(ClassLessonChapter.docRef(id));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid, lang = defaultLanguage) {
        try {
            if (!uid) throw new Error("UID is required to get CHAPTER.");
            return await ClassLessonChapter.get(uid, lang);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchFromFirestoreNeme(_name) {
        try {
            if (!uid) throw new Error("UID is required to get CHAPTER.");
            return await ClassLessonChapter.getByName(_name);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchListFromFirestore(lang = defaultLanguage, constraints = []) {
        try {
            //if (!uid) throw new Error("UID is required to get module.");
            return await this.list(lang, constraints);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
}

export class ClassLessonChapterTranslation {
    static COLLECTION = "i18n";
    static NS_COLLECTION = `classes/lesson`;
    static ERROR = Object.freeze({
        ALREADY_EXISTS: 'already-exists',
        UNKNOWN: 'unknown',
    });
    static CATEGORY = Object.freeze({
        OFFICE: 'office', // bureautique
        UNKNOWN: 'unknown',
    });
    static LEVEL = Object.freeze({
        BEGINNER: 'beginner', // débutant
        INTERMEDIATE: 'intermediate', // intermediraire
        COMPETENT: 'competent', // compétent
        ADVANCED: 'advaned', // avancé
        EXPERT: 'expert', // expert
        UNKNOWN: 'unknown',
    });
    static FORMAT = Object.freeze({
        HYBRID: 'hybrid', // bureautique
        ONSITE: 'onsite',
        ONLINE: 'online',
        UNKNOWN: 'unknown',
    });
    static FORMAT_CONFIG = Object.freeze({
        online: {
            label: "online",//"En ligne",
            color: "#3b82f6",
            glow: "#3b82f654",
        },
        onsite: {
            label: "onsite",// "Présentiel",
            color: "#22c55e",
            glow: "#22c55e54",
        },
        hybrid: {
            label: "hybrid",// "Hybride",
            color: "#a855f7",
            glow: "#a855f754",
        },
    });
    static STATUS = Object.freeze({
        OPEN: 'open', // bureautique
        FULL: 'full',
        FINISHED: 'finished',
        DRAFT: 'draft',
        UNKNOWN: 'unknown',
    });
    static STATUS_CONFIG = Object.freeze({
        open: {
            label: "open", // "Inscriptions ouvertes",
            color: "#22c55e",
            glow: "#022c22",
        },
        full: {
            label: "full", // "Complet",
            color: "#f97316",
            glow: "#451a03",
        },
        finished: {
            label: "finished", // "Terminé",
            color: "#9ca3af",
            glow: "#0b1120",
        },
        draft: {
            label: "draft", // "Brouillon",
            color: "#eab308",
            glow: "#422006",
        },
    });
    static SESSION_TYPE = Object.freeze({
        DAILY: 'daily', // bureautique
        WEEKLY: 'weekly',
        MONTHLY: 'monthly',
        YEARLY: 'yearly',
        UNKNOWN: 'unknown',
    });
    constructor({
        lang = "",
        title = "",
        subtitle = "",
        description = "",
        goals = [],
        subchapters_title="",
    } = {}) {
        this._lang = lang;
        this._subtitle = subtitle;
        this._title = title;
        this._description = description;
        this._goals = goals;
        this._subchapters_title = subchapters_title;
    }

    // lang
    get lang() {
        return this._lang;
    }
    set lang(value) {
        this._lang = value || "";
    }

    // description
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value || "";
    }

    // goals
    get goals() {
        return this._goals;
    }
    set goals(value) {
        this._goals = Array.isArray(value) ? value : [];
    }

    // subtitle
    get subtitle() {
        return this._subtitle;
    }
    set subtitle(value) {
        this._subtitle = value || "";
    }

    // title
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value || "";
    }
    // subchapters_title
    get subchapters_title() {
        return this._subchapters_title;
    }
    set subchapters_title(value) {
        this._subchapters_title = value || "";
    }

    

    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
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
        return ClassLessonChapterTranslation.makeLessonTranslateInstance(this._uid_lesson, this.toJSON());
        //return new ClassUser(this.toJSON());
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
    static makeLessonTranslateInstance(uid_lesson, data = {}) {
        return new ClassLessonChapterTranslation({ uid_lesson, ...data });
    }
    static get converter() {
        return {
            toFirestore(lessonInstance) {
                // chaque classe a un .toJSON() propre
                return lessonInstance?.toJSON ? lessonInstance.toJSON() : lessonInstance;
            },
            fromFirestore(snapshot, options) {
                const lang = snapshot.id;
                const data = snapshot.data(options) || {};
                var created_time = ClassLessonChapterTranslation._toJsDate(data.created_time);
                var last_edit_time = ClassLessonChapterTranslation._toJsDate(data.last_edit_time);
                return ClassLessonChapterTranslation.makeLessonTranslateInstance(lang, { ...data, created_time, last_edit_time, lang });
            },
        };
    }
    // ---------- Helpers Firestore ----------
    static async alreadyExist(_uid) {
        const q = query(
            collection(firestore, ClassLesson.COLLECTION),
            where("uid", "==", _uid)
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static async alreadyExistByName(_name) {
        const q = query(
            collection(firestore, ClassLesson.COLLECTION),
            where("name_normalized", "==", this._name.toLowerCase().trim())
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static colRef(uidLesson = "") {
        return collection(firestore, ClassLesson.COLLECTION, uidLesson, ClassLessonChapterTranslation.COLLECTION).withConverter(this.converter);
    }
    static docRef(uidLesson = "", lang) {
        return doc(firestore, ClassLesson.COLLECTION, uidLesson, ClassLessonChapterTranslation.COLLECTION, lang).withConverter(this.converter);
    }
    static async count() {
        //const coll = collection(firestore, ClassUser.COLLECTION);
        const coll = this.colRef();
        const snap = await getCountFromServer(coll);
        return snap.data().count; // -> nombre total
    }
    // Récupérer un module par id
    static indexOf(array = [], uid) {
        if (array.length === 0 || !(array[0] instanceof ClassLesson)) {
            return -1;
        }
        if (!(array[0] instanceof ClassLesson)) {
            console.log("ERRROR is not class School")
            return -1;
        }
        const indexof = array.findIndex(item => item.uid === uid);
        return indexof;
    }
    static async get(uidLesson, lang) {
        const snap = await getDoc(this.docRef(uidLesson, lang));
        if (snap.exists()) {
            const data = snap.data();
            return (data);
        }
        return null; // -> ClassModule | null
    }
    static async getByName(_name) {
        //const usersCol = collection(firestore, ClassUser.COLLECTION).withConverter(ClassUser.converter);
        const q = query(
            collection(firestore, ClassLesson.COLLECTION).withConverter(ClassLesson.converter),
            where("name_normalized", "==", _name.toLowerCase().trim()),
            limit(1),
        );
        const snap = await getDocs(q);
        const myDoc = snap.docs[0];
        if (!snap.empty) {
            return myDoc.data();
        }
        return null; // -> ClassModule | null
    }
    // Lister des modules (passer des contraintes Firestore : where(), orderBy(), limit()…)
    static async list(uidLesson = "", constraints = []) {
        const q = constraints.length ? query(this.colRef(uidLesson), ...constraints) : query(this.colRef(uidLesson));
        //console.log("list q", q)
        const qSnap = await getDocs(q);
        return qSnap.docs.map(item => item.data());
    }
    createTitleNormalized(title = '') {
        var result = "";
        for (let i = 0; i < title.length; i++) {
            const element = title[i];
            if (element === " ") {
                result += "_";
            } else {
                result += element;
            }
        }
        return (result.toLowerCase());
    }
    // Créer un user (avec option timestamps serveur)
    async createFirestore() {
        const newRef = doc(this.constructor.colRef()); // id auto
        //data.uid = newRef.id;
        //const model = data instanceof ClassLesson ? data : new ClassLesson({ ...data });
        //model.uid = newRef.id;()

        const countLesson = await this.constructor.count() || 0;
        const idLesson = countLesson + 1;
        this._uid = newRef.id;
        this._uid_intern = idLesson;
        this._title_normalized = this.createTitleNormalized(this._title);
        this._subtitle_normalized = this.createTitleNormalized(this.subtitle);
        //this._name_normalized = createNameNormalized(this._name);
        // const uid = newRef.id;
        //const uid_intern = idSchool;
        //this._enabled = false;
        this._created_time = new Date();
        this._last_edit_time = new Date();
        //const path = { ...model.toJSON(), uid, uid_intern, created_time, last_edit_time };
        await setDoc(newRef, this.toJSON());
        return this.constructor.makeLessonTranslateInstance(this._uid, this.toJSON());// -> ClassModule
    }
    async updateFirestore() {
        try {
            // const ref = ClassLesson.docRef(id);
            //const data = { ...patch, last_edit_time: new Date() };
            //await updateDoc(ref, data, { merge: true });
            //console.log("UPDATE COMPLETED")
            //return (await getDoc(ref)).data(); // -> ClassModule
            const ref = this.constructor.docRef(this._uid);
            this._last_edit_time = new Date();
            //const data = { ...patch, last_edit_time: new Date() };
            await updateDoc(ref, this.toJSON(), { merge: true });
            console.log("UPDATE COMPLETED", { ...this })
            //return (await getDoc(ref)).data(); // -> ClassDevice
            return this.constructor.makeLessonTranslateInstance(this._uid, this.toJSON()); // -> ClassModule
        } catch (e) {
            console.log("error update lesson", e)
            return null;
        }
    }
    // Mettre à jour un module
    static async update(id, patch = {}) {
        try {
            const ref = ClassLesson.docRef(id);
            const data = { ...patch, last_edit_time: new Date() };
            await updateDoc(ref, data, { merge: true });
            //console.log("UPDATE COMPLETED")
            return (await getDoc(ref)).data(); // -> ClassModule
        } catch (e) {
            return null;
        }
    }
    // Supprimer un module
    async removeFirestore() {
        try {
            const ref = this.constructor.docRef(this._uid);
            await deleteDoc(ref);
            //console.log("REMOVED", ref);
            return true;
        } catch (error) {
            console.log("ERRRROR", error);
            return false;
        }
    }
    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uidLesson, lang = defaultLanguage) {
        try {
            //console.log("geeet", uidLesson, lang)
            if (!lang) throw new Error("LANG is required to get school.");
            return await this.get(uidLesson, lang);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchFromFirestoreNeme(_name) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await ClassLesson.getByName(_name);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchListFromFirestore(uidLesson = "", constraints = []) {
        try {
            //if (!uid) throw new Error("UID is required to get module.");
            return await this.list(uidLesson, constraints);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
}