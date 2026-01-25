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
import { ClassUser, ClassUserTeacher } from "./users/ClassUser";
import { ClassLessonChapter } from "./lessons/ClassLessonChapter";
import { ClassCountry } from "./ClassCountry";

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
        IT: 'it', // informatique
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
        VALID: 'valid',
        DRAFT: 'draft',
        UNKNOWN: 'unknown',
    });
    static STATUS_CONFIG = Object.freeze({
        open: {
            label: "open", // "Inscriptions ouvertes",
            color: "var(--session-status-open)",
            glow: "var(--session-status-open-glow)",
        },
        valid: {
            label: "open", // "Inscriptions ouvertes",
            color: "var(--session-status-open)",
            glow: "var(--session-status-open-glow)",
        },
        draft: {
            label: "draft", // "Brouillon",
            color: "var(--session-status-draft)",
            glow: "var(--session-status-draft-glow)",
        },
    });
    static SESSION_TYPE = Object.freeze({
        DAILY: 'daily', // bureautique
        WEEKLY: 'weekly',
        MONTHLY: 'monthly',
        YEARLY: 'yearly',
        UNKNOWN: 'unknown',
    });
    static ALL_CATEGORIES = Object.values(this.CATEGORY).filter(category=>category!==this.CATEGORY.UNKNOWN);
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
        uid_teacher = "",
        teacher = null,
        enabled = false,
        title = "",
        subtitle = "",
        description = "",
        category = "",
        certified = false,
        goals = [],
        programs = [],
        prerequisites = [],
        target_audiences = [],
        tags = [],
        materials = [],
        notes = [],
        photo_url = "",
        translate = {},
        translates = [],
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        this._uid = uid;
        this._uid_intern = uid_intern;
        this._uid_teacher = uid_teacher;
        this._teacher = teacher;
        this._enabled = enabled;
        this._title = title;
        //this._title_normalized = title_normalized;
        this._subtitle = subtitle;
        // this._subtitle_normalized = subtitle_normalized;
        this._description = description;
        this._category = this._normalizeCategory(category);
        this._certified = certified;
        this._goals = goals;
        this._programs = programs;
        this._prerequisites = prerequisites;
        this._target_audiences = target_audiences;
        this._tags = tags;
        this._materials = materials;
        this._notes = notes;
        this._photo_url = photo_url;
        // this._status = status;
        this._translate = translate;
        this._translates = translates;
        this._created_time = created_time;
        this._last_edit_time = last_edit_time;
    }
    _normalizeCategory(category) {
        return Object.values(ClassLesson.CATEGORY).includes(category)
            ? category
            : ClassLesson.CATEGORY.UNKNOWN;
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
    // uid_teacher
    get uid_teacher() {
        return this._uid_teacher;
    }
    set uid_teacher(value) {
        this._uid_teacher = value;
    }
    // teacher
    get teacher() {
        return this._teacher;
    }
    set teacher(value) {
        this._teacher = value;
    }
    // teacher
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
    }
    // title
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }
    // subtitle
    get subtitle() {
        return this._subtitle;
    }
    set subtitle(value) {
        this._subtitle = value;
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
        this._category = this._normalizeCategory(value);
    }

    // certified
    get certified() {
        return this._certified;
    }
    set certified(value) {
        this._certified = value;
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

    // tags
    get tags() {
        return this._tags;
    }
    set tags(value) {
        this._tags = value;
    }

    // target_audiences
    get materials() {
        return this._materials;
    }
    set materials(value) {
        this._materials = value;
    }



    // notes
    get notes() {
        return this._notes;
    }
    set notes(value) {
        this._notes = value;
    }

    // status
    /*
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    */
    // photo_url
    get photo_url() {
        return this._photo_url;
    }
    set photo_url(value) {
        this._photo_url = value;
    }

    // translate
    get translate() {
        return this._translate;
    }
    set translate(value) {
        this._translate = value;
    }
    // translates
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

    // --- Serialization ---
    toJSON() {
        /*
        const fieldsToRemove = [
            'teacher',
            'translate',
            'title',
            'subtitle',
            'description',
            'materials',
            'goals',
            'programs',
            'prerequisites',
            'target_audiences',
            'notes',
            'photo_url',
            'tags'
        ];
        const out = { ...this };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        for (const field of fieldsToRemove) {
            delete cleaned[field];
        }
        cleaned.teacher = null;
        cleaned.translate = null;
        //cleaned.translates = this._convertTranslatesToFirestore(this._translates);
        cleaned.title = null;
        cleaned.subtitle = null;
        cleaned.description = null;
        cleaned.materials = null;
        cleaned.goals = null;
        cleaned.programs = null;
        cleaned.prerequisites = null;
        cleaned.target_audiences = null;
        cleaned.materials = null;
        cleaned.notes = null;
        cleaned.photo_url = null;
        cleaned.tags = null;

        delete cleaned.teacher;
        delete cleaned.translate;
        delete cleaned.title;
        delete cleaned.subtitle;
        delete cleaned.description;
        delete cleaned.materials;
        delete cleaned.goals;
        delete cleaned.programs;
        delete cleaned.prerequisites;
        delete cleaned.target_audiences;
        delete cleaned.materials;
        delete cleaned.notes;
        delete cleaned.photo_url;
        delete cleaned.tags;
        return cleaned;
        */
        return LessonSerializer.toJSON(this);
    }
    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }
    clone() {
        //const translate = this._translate?.clone();
        //  const translates = this._translates?.map();
        const fromJson = LessonSerializer.fromJSON({ ...this });
        return fromJson;
        /*
        return ClassLesson.makeLessonInstance(this._uid, {
            ...this.toJSON(),
            teacher: this._teacher,
            translate: this._translate,
            translates: this._translates,
            title: this._title,
            subtitle: this._subtitle,
            description: this._description,
            materials: this._materials,
            goals: this._goals,
            programs: this._programs,
            prerequisites: this._prerequisites,
            target_audiences: this._target_audiences,
            materials: this._materials,
            notes: this._notes,
            photo_url: this._photo_url,
            tags: this._tags,
        });
        */
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
    _convertTranslatesToFirestore(translates = []) {
        var translatesObj = {};
        for (const trans of translates) {
            translatesObj[trans.lang] = trans.toJSON?.() || trans || {};
        }
        return translatesObj;
    }
    _convertTranslatesFromFirestore(translatesObj = {}) {
        const translates = Object.values(translatesObj)?.map?.(trans => new ClassLessonTranslate(trans)) || [];
        return translates;
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
    static makeLessonInstance(uid, data = {}) {
        return new ClassLesson({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(lessonInstance) {
                const translates = lessonInstance._convertTranslatesToFirestore(lessonInstance.translates);

                // chaque classe a un .toJSON() propre
                return lessonInstance?.toJSON ? { ...lessonInstance.toJSON(), translates: translates } : { ...lessonInstance, translates: translates }
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                var start_date = ClassLesson._toJsDate(data.start_date);
                var end_date = ClassLesson._toJsDate(data.end_date);
                var created_time = ClassLesson._toJsDate(data.created_time);
                var last_edit_time = ClassLesson._toJsDate(data.last_edit_time);
                const translates = Object.values(data.translates)?.map?.(trans => new ClassLessonTranslate(trans));
                //const translates = Object.values(data.translates)?.map?.(trans => new ClassLessonTranslate(trans));
                //console.log("uid lesson",uid, )
                //console.log("translate classLesson", Object.values(data.translates))
                return ClassLesson.makeLessonInstance(uid, { ...data, start_date, end_date, created_time, last_edit_time, translates });
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

    static async count(constraints = []) {
        const q = query(this.colRef(), ...constraints);        //const qSnap = await getDocs(q);
        //const coll = collection(firestore, ClassUser.COLLECTION);
        //const coll = this.colRef();
        const snap = await getCountFromServer(q);
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
    static async get(uid, lang = defaultLanguage) {
        const snap = await getDoc(this.docRef(uid));
        if (snap.exists()) {
            //const data = await snap.data();
            const lesson = snap.data();
            const translate = lesson.translates?.find(item => item.lang === lang);
            lesson.translate = translate;
            //const translates = await ClassLessonTranslate.fetchListFromFirestore(uid);
            //const teacher = await ClassUser.fetchFromFirestore(lesson.uid_teacher);
            //console.log("leson class translate firestore", translate);
            //lesson.translates = translates;
            //lesson.teacher = teacher;
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
    static async list(lang = 'fr', constraints = []) {
        const q = constraints.length ? query(this.colRef(), ...constraints) : query(this.colRef());
        const qSnap = await getDocs(q);
        const lessons = [];
        for (const doc of qSnap.docs) {
            const lesson = doc.data();
            const translate = lesson.translates?.find(item => item.lang === lang);
            lesson.translate = translate;
            lessons.push(lesson);
        }
        return lessons;
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
    createFirestoreDocUid() {
        try {
            const newRef = doc(this.constructor.colRef());
            //const newRef = doc(this.constructor.colRef()); // id auto
            console.log("errorrrrrr after")
            return newRef.id;
        } catch (error) {
            console.log("ERRRRROROOOORO", error);
            return null;
        }
    }
    // Créer un user (avec option timestamps serveur)
    async createFirestore() {

        if (!this._uid) {
            const newRef = doc(this.constructor.colRef()); // id auto
            this._uid = newRef.id;
        }
        if (!this._uid_intern) {
            const countLesson = await this.constructor.count() || 0;
            const idLesson = countLesson + 1;
            this._uid_intern = idLesson;
        }
        //data.uid = newRef.id;
        //const model = data instanceof ClassLesson ? data : new ClassLesson({ ...data });
        //model.uid = newRef.id;()

        //const countLesson = await this.constructor.count() || 0;
        //const idLesson = countLesson + 1;
        //this._uid_intern = idLesson;
        //this._title_normalized = this.createTitleNormalized(this._title);
        //this._subtitle_normalized = this.createTitleNormalized(this.subtitle);
        //this._name_normalized = createNameNormalized(this._name);
        // const uid = newRef.id;
        //const uid_intern = idSchool;
        //this._enabled = false;
        const newRef = this.constructor.docRef(this._uid);
        this._created_time = new Date();
        this._last_edit_time = new Date();
        //const path = { ...model.toJSON(), uid, uid_intern, created_time, last_edit_time };
        await setDoc(newRef, { ...this.toJSON() }, { merge: true });
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

            const updated = { ...this};
            //delete updated.translate;
            //updated.translates = updated.translates.map(item=>item.toJSON());
            console.log("want update", this);
            await setDoc(ref, this, {merge:true});
            //console.log("UPDATE COMPLETED", { ...this })
            //return (await getDoc(ref)).data(); // -> ClassDevice
            return this.constructor.makeLessonInstance(this._uid, this.toJSON()); // -> ClassModule
        } catch (e) {
            console.log("ERRRRROR", e)
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
    static async fetchFromFirestore(uid = "", lang = defaultLanguage) {
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
class LessonSerializer {
    static fieldsToRemove = [
        'teacher',
        'translate',
        'title',
        'subtitle',
        'description',
        'materials',
        'goals',
        'programs',
        'prerequisites',
        'target_audiences',
        'notes',
        'photo_url',
        'tags'
    ];
    static toJSON(lesson) {
        const fields = [...this.fieldsToRemove];
        const out = { ...lesson };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        for (const field of fields) {
            delete cleaned[field];
        }
        return cleaned;
    }
    static fromJSON(data) {
        const cleaned = Object.fromEntries(
            Object.entries(data)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        return new ClassLesson(cleaned);
    }
}
export class ClassLessonTeacher extends ClassLesson {
    static COLLECTION = "LESSONS_TEACHER";
    static COLLECTION_TRANSLATE = "i18n";
    static NS_COLLECTION = `classes/lesson-teacher`;
    static getStoragePath(uidLesson="", uidLessonTeacher="", fileName="") {
        return `${ClassLesson.COLLECTION}/${uidLesson}/${ClassLessonTeacher.COLLECTION}/${uidLessonTeacher}/${fileName}`;
        //${ClassUser.COLLECTION}/${user.uid}/profile-photo,
    }

    constructor(props = { uid_lesson: "", url:"",price:0,old_price:0,currency:ClassCountry.DEFAULT_CURRENCY }) {
        super(props); // le parent lit seulement ses clés (uid, email, type, role, ...);
        this._uid_lesson = props.uid_lesson;
        this._lesson = null;
        this._url = props.url;
        this._price = props.price;
        this._old_price = props.old_price;
        this._currency = props.currency;
    }
    // uid_lesson
    get uid_lesson() {
        return this._uid_lesson;
    }
    set uid_lesson(value) {
        this._uid_lesson = value;
        this._touchLastEdit();
    }
    // lesson
    get lesson() {
        return this._lesson;
    }
    set lesson(value) {
        this._lesson = value;
    }
    // url
    get url() {
        return this._url;
    }
    set url(value) {
        this._url = value;
    }

        // price
    get price() {
        return this._price;
    }
    set price(value) {
        this._price = value;
    }
    // old_price
    get old_price() {
        return this._old_price;
    }
    set old_price(value) {
        this._old_price = value;
    }
    // currency
    get currency() {
        return this._currency;
    }
    set currency(value) {
        this._currency = value;
    }
    /*
        toJSON() {
            const out = { ...this };
            const cleaned = Object.fromEntries(
                Object.entries(out)
                    .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                    .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
            );
            cleaned.lesson = null;
                    cleaned.teacher = null;
            cleaned.translate = null;
            //cleaned.translates = this._convertTranslatesToFirestore(this._translates);
            cleaned.title = null;
            cleaned.subtitle = null;
            cleaned.description = null;
            cleaned.materials = null;
            cleaned.goals = null;
            cleaned.programs = null;
            cleaned.prerequisites = null;
            cleaned.target_audiences = null;
            cleaned.materials = null;
            cleaned.notes = null;
            cleaned.photo_url = null;
            cleaned.tags = null;
    
            delete cleaned.teacher;
            delete cleaned.translate;
            delete cleaned.title;
            delete cleaned.subtitle;
            delete cleaned.description;
            delete cleaned.materials;
            delete cleaned.goals;
            delete cleaned.programs;
            delete cleaned.prerequisites;
            delete cleaned.target_audiences;
            delete cleaned.materials;
            delete cleaned.notes;
            delete cleaned.photo_url;
            delete cleaned.tags;
            delete cleaned.lesson;
            return cleaned;
        }
        */
    toJSON() {
        return LessonTeacherSerializer.toJSON(this);
    }
    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }
    clone() {
        return LessonTeacherSerializer.fromJSON({ ...this });
    }
    static makeLessonTeacherInstance(uid, data = {}) {
        return new ClassLessonTeacher({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(lessonInstance) {
                const translates = lessonInstance._convertTranslatesToFirestore(lessonInstance.translates);

                // chaque classe a un .toJSON() propre
                return lessonInstance?.toJSON ? { ...lessonInstance.toJSON(), translates: translates } : { ...lessonInstance, translates: translates }
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                var start_date = ClassLessonTeacher._toJsDate(data.start_date);
                var end_date = ClassLessonTeacher._toJsDate(data.end_date);
                var created_time = ClassLessonTeacher._toJsDate(data.created_time);
                var last_edit_time = ClassLessonTeacher._toJsDate(data.last_edit_time);
                const translates = Object.values(data.translates)?.map?.(trans => new ClassLessonTranslate(trans));
                //console.log("uid lesson",uid, )
                //console.log("translate classLesson", Object.values(data.translates))
                return ClassLessonTeacher.makeLessonTeacherInstance(uid, { ...data, start_date, end_date, created_time, last_edit_time, translates });
            },
        };
    }
    // ---------- Helpers Firestore ----------
    static async alreadyExist(_uid) {
        const q = query(
            collection(firestore, this.COLLECTION),
            where("uid", "==", _uid)
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static async alreadyExistByName(_name) {
        const q = query(
            collection(firestore, this.COLLECTION),
            where("name_normalized", "==", this._name.toLowerCase().trim())
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static colRef() {
        // if (!uidLesson) return;
        return collectionGroup(firestore, ClassLessonTeacher.COLLECTION).withConverter(this.converter);
        //return collection(firestore, ClassLesson.COLLECTION, uidLesson, this.COLLECTION).withConverter(this.converter);
    }
    static docRef(uidLesson, id) {
        if (!uidLesson || !id) return;
        return doc(firestore, super.COLLECTION, uidLesson, this.COLLECTION, id).withConverter(this.converter);
    }

    static async count(uidLesson = "", constraints = []) {
        if (!uidLesson) return;
        const q = query(this.colRef(), ...constraints);        //const qSnap = await getDocs(q);
        //const coll = collection(firestore, ClassUser.COLLECTION);
        const snap = await getCountFromServer(q);
        return snap.data().count; // -> nombre total
    }
    // Récupérer un module par id
    static indexOf(array = [], uid) {
        if (array.length === 0 || !(array[0] instanceof ClassLessonTeacher)) {
            return -1;
        }
        if (!(array[0] instanceof ClassLessonTeacher)) {
            console.log("ERRROR is not class ClassLessonTeacher")
            return -1;
        }
        const indexof = array.findIndex(item => item.uid === uid);
        return indexof;
    }
    static async get(uid, lang = defaultLanguage) {
        const q = query(
            collectionGroup(firestore, this.COLLECTION).withConverter(this.converter),
            where("uid", "==", uid),
            limit(1)
        );
        const snaps = await getDocs(q);
        if (snaps.empty) return null;

        const docSnap = snaps.docs[0];
        const chapter = docSnap.data();
        const translate = chapter.translates?.find(item => item.lang === lang);
        chapter.translate = translate;
        return chapter;
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
    static async list(lang = defaultLanguage, constraints = []) {
        const q = constraints.length ? query(this.colRef(), ...constraints) : query(this.colRef());
        const qSnap = await getDocs(q);
        const lessons = [];
        for (const doc of qSnap.docs) {
            const lesson = doc.data();
            const translate = lesson.translates?.find(item => item.lang === lang);
            lesson.translate = translate;
            lessons.push(lesson);
        }
        return lessons;
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
    createFirestoreDocUid() {
        try {
            const colRef = collection(
                firestore,
                ClassLesson.COLLECTION,
                this._uid_lesson,
                this.constructor.COLLECTION
            );
            const newRef = doc(colRef);
            return newRef.id;
        } catch (error) {
            console.log("ERRRRROROOOORO", error);
            return null;
        }
    }
    // Créer un user (avec option timestamps serveur)
    async createFirestore() {
        if (!this._uid_lesson) throw new Error("The lesson teacher must have a 'uid_lesson'");
        if (!this._uid_teacher) throw new Error("The lesson teacher must have a 'uid_teacher'");
        if (!this._uid) {
            this._uid = this.createFirestoreDocUid();
        }
        const newRef = this.constructor.docRef(this._uid_lesson, this._uid);
        /*
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
        */
        if (!this._uid_intern) {
            const countLesson = await this.constructor.count(this._uid_lesson, [where("uid_teacher", "==", this._uid_teacher)]) || 0;
            const idLesson = countLesson + 1;
            this._uid_intern = idLesson;
        }
        //const newRef = this.constructor.docRef(this._uid_lesson, this._uid);
        this._created_time = new Date();
        this._last_edit_time = new Date();
        //const path = { ...model.toJSON(), uid, uid_intern, created_time, last_edit_time };
        //await setDoc(newRef, this);
        console.log("translates from create firestore", this._translates, this._convertTranslatesToFirestore(this._translates))
        await setDoc(newRef, this);
        const _lesson = this.constructor.makeLessonTeacherInstance(this._uid, this.toJSON());
        console.log("lessssson", _lesson);
        return _lesson;// -> ClassModule
    }
    async updateFirestore() {
        try {
            const ref = this.constructor.docRef(this._uid_lesson, this._uid);
            this._last_edit_time = new Date();
            //const data = { ...patch, last_edit_time: new Date() };

            const updated = { ...this.toJSON() };
           // delete updated.translate;
            //updated.translates = updated.translates.map(item=>item.toJSON());
            console.log("want update", this);
            await setDoc(ref, this, { merge: true });
            //console.log("UPDATE COMPLETED", { ...this })
            //return (await getDoc(ref)).data(); // -> ClassDevice
            return this; // -> ClassModule
        } catch (e) {
            console.log("ERRRRROR", e)
            return null;
        }
    }
    // Supprimer un module
    async removeFirestore() {
        try {
            const ref = this.constructor.docRef(this._uid_lesson, this._uid);
            await deleteDoc(ref);
            //console.log("REMOVED", ref);
            return true;
        } catch (error) {
            console.log("ERRRROR", error);
            return false;
        }
    }
    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid = "", lang = defaultLanguage) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            const _lesson = await ClassLessonTeacher.get(uid, lang);
            // console.log("leson class fetch firestore", _lesson);
            //const _translate = await ClassLessonTranslate.fetchFromFirestore(uid, lang);
            //_lesson.translate = _translate;
            return _lesson;
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
class LessonTeacherSerializer {
    static fieldsToRemove = [
        'lesson'
    ];
    static toJSON(lesson) {
        const fields = [...LessonSerializer.fieldsToRemove, ...this.fieldsToRemove];
        const out = { ...lesson };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        for (const field of fields) {
            delete cleaned[field];
        }
        return cleaned;
    }
    static fromJSON(data) {
        const cleaned = Object.fromEntries(
            Object.entries(data)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        return new ClassLessonTeacher(cleaned);
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
        lang = "",
        title = "",
        subtitle = "",
        description = "",
        goals = [],
        notes = [],
        prerequisites = [],
        programs = [],
        target_audiences = [],
        materials = [],
        tags = [],
        photo_url = "",
    } = {}) {
        //this._uid_lesson = uid_lesson;
        this._lang = lang;
        this._description = description;
        this._materials = materials;
        this._goals = Array.isArray(goals) ? goals : [];
        this._notes = Array.isArray(notes) ? notes : [];
        this._prerequisites = Array.isArray(prerequisites) ? prerequisites : [];
        this._programs = Array.isArray(programs) ? programs : [];
        this._target_audiences = Array.isArray(target_audiences) ? target_audiences : [];
        this._photo_url = photo_url;
        this._tags = tags;

        this._subtitle = subtitle;
        this._title = title;

    }

    // uid_lesson
    /*
    get uid_lesson() {
        return this._uid_lesson;
    }
    set uid_lesson(value) {
        this._uid_lesson = value || "";
    }
    */

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

    // tags
    get tags() {
        return this._tags;
    }
    set tags(value) {
        this._tags = Array.isArray(value) ? value : [];
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

    // materials
    get materials() {
        return this._materials;
    }
    set materials(value) {
        this._materials = Array.isArray(value) ? value : [];
    }

    // photo_url
    get photo_url() {
        return this._photo_url;
    }
    set photo_url(value) {
        this._photo_url = value;
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
        return new ClassLessonTranslate({ uid_lesson, ...data });
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
        //this._created_time = new Date();
        //this._last_edit_time = new Date();
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