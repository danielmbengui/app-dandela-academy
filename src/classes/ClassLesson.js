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
} from "firebase/firestore";
import { firestore } from "@/contexts/firebase/config";
import { defaultLanguage } from "@/contexts/i18n/settings";
import { ClassUserTeacher } from "./users/ClassUser";

export class ClassLesson {
    static COLLECTION = "LESSONS";
    static COLLECTION_TRANSLATE = "i18n";
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
        ADVANCED: 'advanced', // avancé
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
    static ALL_CATEGORIES = [
        ClassLesson.CATEGORY.OFFICE
    ]
    static ALL_LEVELS = [
        ClassLesson.LEVEL.BEGINNER,
        ClassLesson.LEVEL.INTERMEDIATE,
        ClassLesson.LEVEL.COMPETENT,
        ClassLesson.LEVEL.ADVANCED,
        ClassLesson.LEVEL.EXPERT,
    ]
    static ALL_FORMATS = [
        ClassLesson.FORMAT.ONSITE,
        ClassLesson.FORMAT.ONLINE,
        ClassLesson.FORMAT.HYBRID,
    ]
    constructor({
        uid = "",
        uid_intern = "",
        title = "",
        title_normalized = "",
        subtitle = "",
        subtitle_normalized = "",
        description = "",
        category = "",
        level = "",
        lang = "",
        format = "",
        certified = false,
        duration = 0,
        goals = [],
        programs = [],
        prerequisites = [],
        target_audiences = [],
        notes = [],
        photo_url = "",
        status = ClassLesson.STATUS.DRAFT,
        translate = {},
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        this._uid = uid;
        this._uid_intern = uid_intern;
        this._title = title;
        this._title_normalized = title_normalized;
        this._subtitle = subtitle;
        this._subtitle_normalized = subtitle_normalized;
        this._description = description;
        this._category = this._normalizeCategory(category);
        this._level = level;
        this._lang = lang;
        this._format = format;
        this._certified = certified;
        this._duration = duration;
        this._goals = goals;
        this._programs = programs;
        this._prerequisites = prerequisites;
        this._target_audiences = target_audiences;
        this._notes = notes;
        this._photo_url = photo_url;
        this._status = status;
        this._translate = translate;
        this._created_time = created_time;
        this._last_edit_time = last_edit_time;
    }
    _normalizeCategory(category) {
        return Object.values(ClassLesson.CATEGORY).includes(category)
            ? category
            : ClassLesson.CATEGORY.UNKNOWN;
    }
    _normalizeSchedule(schedule) {
        if (!(schedule instanceof Object) || Object.keys(schedule).length === 0) {
            return this._defaultSchedule();
        }
        var base = this._defaultSchedule();

        // on prend au max 7 jours, on complète si moins
        Object.keys(base).map((key, index) => {
            const source = schedule[key] || {};
            base[key] = {
                is_open: typeof source.is_open === "boolean" ? source.is_open : base[key].is_open,
                open_hour: Number.isFinite(source.open_hour) ? source.open_hour : base[key].open_hour,
                close_hour: Number.isFinite(source.close_hour) ? source.close_hour : base[key].close_hour,
            };
        });

        return base;
    }
    _defaultSchedule() {
        return {
            monday: { is_open: false, open_hour: 0, close_hour: 0 }, // lundi
            thuesday: { is_open: false, open_hour: 0, close_hour: 0 },
            wednesday: { is_open: false, open_hour: 0, close_hour: 0 },
            thursday: { is_open: false, open_hour: 0, close_hour: 0 },
            friday: { is_open: false, open_hour: 0, close_hour: 0 },
            saturday: { is_open: false, open_hour: 0, close_hour: 0 },
            sunday: { is_open: false, open_hour: 0, close_hour: 0 }, // dimanche
        };
    }
    // uid
    get uid() {
        return this._uid;
    }
    set uid(value) {
        this._uid = value;
    }

    // uid_intern
    get uid_intern() {
        return this._uid_intern;
    }
    set uid_intern(value) {
        this._uid_intern = value;
    }

    // title
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }

    // title_normalized
    get title_normalized() {
        return this._title_normalized;
    }
    set title_normalized(value) {
        this._title_normalized = value;
    }

    // subtitle
    get subtitle() {
        return this._subtitle;
    }
    set subtitle(value) {
        this._subtitle = value;
    }

    // subtitle_normalized
    get subtitle_normalized() {
        return this._subtitle_normalized;
    }
    set subtitle_normalized(value) {
        this._subtitle_normalized = value;
    }

    // description
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
    }

    // category
    get category() {
        return this._category;
    }
    set category(value) {
        this._category = value;
    }

    // level
    get level() {
        return this._level;
    }
    set level(value) {
        this._level = value;
    }

    // lang
    get lang() {
        return this._lang;
    }
    set lang(value) {
        this._lang = value;
    }

    // format
    get format() {
        return this._format;
    }
    set format(value) {
        this._format = value;
    }

    // certified
    get certified() {
        return this._certified;
    }
    set certified(value) {
        this._certified = value;
    }

    // duration
    get duration() {
        return this._duration;
    }
    set duration(value) {
        this._duration = value;
    }


    // goals
    get goals() {
        return this._goals;
    }
    set goals(value) {
        this._goals = value;
    }

    // programs
    get programs() {
        return this._programs;
    }
    set programs(value) {
        this._programs = value;
    }

    // prerequisites
    get prerequisites() {
        return this._prerequisites;
    }
    set prerequisites(value) {
        this._prerequisites = value;
    }

    // target_audiences
    get target_audiences() {
        return this._target_audiences;
    }
    set target_audiences(value) {
        this._target_audiences = value;
    }

    // notes
    get notes() {
        return this._notes;
    }
    set notes(value) {
        this._notes = value;
    }

    // status
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    // photo_url
    get photo_url() {
        return this._photo_url;
    }
    set photo_url(value) {
        this._photo_url = value;
    }

    // translates
    get translate() {
        return this._translate;
    }
    set translate(value) {
        this._translate = value;
    }

    // created_time
    get created_time() {
        return this._created_time;
    }
    set created_time(value) {
        this._created_time = value;
    }

    // last_edit_time
    get last_edit_time() {
        return this._last_edit_time;
    }
    set last_edit_time(value) {
        this._last_edit_time = value;
    }

    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }

    // --- GETTERS ---


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
        const translate = this._translate?.clone();
        return ClassLesson.makeLessonInstance(this._uid, {...this.toJSON(), translate});
        //return new ClassUser(this.toJSON());
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
    static makeLessonInstance(uid, data = {}) {
        return new ClassLesson({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(lessonInstance) {
                // chaque classe a un .toJSON() propre
                return lessonInstance?.toJSON ? lessonInstance.toJSON() : lessonInstance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                var start_date = ClassLesson._toJsDate(data.start_date);
                var end_date = ClassLesson._toJsDate(data.end_date);
                var created_time = ClassLesson._toJsDate(data.created_time);
                var last_edit_time = ClassLesson._toJsDate(data.last_edit_time);
                //console.log("uid lesson",uid, )
                //console.log("translate", translate)
                return ClassLesson.makeLessonInstance(uid, { ...data, start_date, end_date, created_time, last_edit_time });
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
    static colRef() {
        return collection(firestore, this.COLLECTION).withConverter(this.converter);
    }
    static docRef(id) {
        return doc(firestore, this.COLLECTION, id).withConverter(this.converter);
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
    static async get(uid, lang=defaultLanguage) {
        const snap = await getDoc(this.docRef(uid));
        if (snap.exists()) {
            //const data = await snap.data();
            const lesson = snap.data();
            const translate = await ClassLessonTranslate.fetchFromFirestore(uid, lang);
            //console.log("leson class translate firestore", translate);
            lesson.translate = translate;
            //console.log("leson class get firestore", lesson);
            return (lesson);
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
    static async list(lang='fr',constraints = []) {
        const q = constraints.length ? query(this.colRef(), ...constraints) : query(this.colRef());
        const qSnap = await getDocs(q);
        return qSnap.docs.map(async (item) => {
            const lesson = item.data();
            const translate = await ClassLessonTranslate.fetchFromFirestore(lesson.uid, lang);
            lesson.translate = translate;
            return (lesson);
        });
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
        return this.constructor.makeLessonInstance(this._uid, this.toJSON());// -> ClassModule
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
            //console.log("UPDATE COMPLETED", { ...this })
            //return (await getDoc(ref)).data(); // -> ClassDevice
            return this.constructor.makeLessonInstance(this._uid, this.toJSON()); // -> ClassModule
        } catch (e) {
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
    static async fetchFromFirestore(uid="", lang=defaultLanguage) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            const _lesson = await ClassLesson.get(uid, lang);
           // console.log("leson class fetch firestore", _lesson);
            //const _translate = await ClassLessonTranslate.fetchFromFirestore(uid, lang);
            //_lesson.translate = _translate;
            return _lesson;
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
    static async fetchListFromFirestore(lang='fr',constraints = []) {
        try {
            //if (!uid) throw new Error("UID is required to get module.");
            return await this.list(lang, constraints);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
}
export class ClassLessonTranslate {
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
        uid_lesson = "",
        lang = "",
        description = "",
        goals = [],
        notes = [],
        prerequisites = [],
        programs = [],
        target_audiences = [],
        subtitle = "",
        title = "",
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        this._uid_lesson = uid_lesson;
        this._lang = lang;
        this._description = description;

        this._goals = Array.isArray(goals) ? goals : [];
        this._notes = Array.isArray(notes) ? notes : [];
        this._prerequisites = Array.isArray(prerequisites) ? prerequisites : [];
        this._programs = Array.isArray(programs) ? programs : [];
        this._target_audiences = Array.isArray(target_audiences) ? target_audiences : [];

        this._subtitle = subtitle;
        this._title = title;

        this._created_time = created_time instanceof Date ? created_time : new Date(created_time);
        this._last_edit_time = last_edit_time instanceof Date ? last_edit_time : new Date(last_edit_time);
    }

    // uid_lesson
    get uid_lesson() {
        return this._uid_lesson;
    }
    set uid_lesson(value) {
        this._uid_lesson = value || "";
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

    // notes
    get notes() {
        return this._notes;
    }
    set notes(value) {
        this._notes = Array.isArray(value) ? value : [];
    }

    // prerequisites
    get prerequisites() {
        return this._prerequisites;
    }
    set prerequisites(value) {
        this._prerequisites = Array.isArray(value) ? value : [];
    }

    // programs
    get programs() {
        return this._programs;
    }
    set programs(value) {
        this._programs = Array.isArray(value) ? value : [];
    }

    // target_audiences
    get target_audiences() {
        return this._target_audiences;
    }
    set target_audiences(value) {
        this._target_audiences = Array.isArray(value) ? value : [];
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
        return ClassLessonTranslate.makeLessonTranslateInstance(this._uid_lesson, this.toJSON());
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
        return new ClassLessonTranslate({uid_lesson, ...data });
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
                var created_time = ClassLessonTranslate._toJsDate(data.created_time);
                var last_edit_time = ClassLessonTranslate._toJsDate(data.last_edit_time);
                return ClassLessonTranslate.makeLessonTranslateInstance(lang, { ...data, created_time, last_edit_time, lang });
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
        return collection(firestore, ClassLesson.COLLECTION, uidLesson, ClassLessonTranslate.COLLECTION).withConverter(this.converter);
    }
    static docRef(uidLesson = "", lang) {
        return doc(firestore, ClassLesson.COLLECTION, uidLesson, ClassLessonTranslate.COLLECTION, lang).withConverter(this.converter);
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
            //console.log("UPDATE COMPLETED", { ...this })
            //return (await getDoc(ref)).data(); // -> ClassDevice
            return this.constructor.makeLessonTranslateInstance(this._uid, this.toJSON()); // -> ClassModule
        } catch (e) {
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