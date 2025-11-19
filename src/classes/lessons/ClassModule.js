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
    serverTimestamp,
    Timestamp,
    where,
} from "firebase/firestore";
import { firestore } from "@/libs/firebase/config";
import { ClassModulePart } from "./ClassModulePart";
import { ClassUserTutor } from "../users/intern/ClassUserTutor";
import { language_fr } from "@/libs/i18n/settings";
import { ClassLesson } from "./ClassLesson";

export class ClassModule {
    static TYPE = Object.freeze({
        OFFICE: "office",
    });

    static LEVEL = Object.freeze({
        EASY: "easy",
        MEDIUM: "medium",
        DIFFICULT: "difficult",
    });

    static COLLECTION = "MODULES";

    static ALL_LEVELS = [
        ClassModule.LEVEL.EASY,
        ClassModule.LEVEL.MEDIUM,
        ClassModule.LEVEL.DIFFICULT,
    ];

    constructor({
        uid = "",
        created_time = new Date(),
        last_edit_time = new Date(),
        number = -1,
        title = "",
        subtitle = "",
        level = "",
        duration = "",
        description = "",
        description_html = <></>,

        photo = "",
        video = "",
        type = "",
        goals = [],
        required = [],
        tools = [],
        featured = false,
        price = 0,
        is_free = true,
        tag = "",
        categories = [],
        start_date = null,
        end_date = null,
        translations = {},
        tutor_uids = [],
    } = {}) {
        this._uid = uid;
        this._created_time = created_time;
        this._last_edit_time = last_edit_time;
        this._number = number;
        this._title = title;
        this._subtitle = subtitle;
        this._level = level;
        this._duration = duration;
        this._description = description;
        this._description_html = description_html;
        this._photo = photo;
        this._video = video;
        this._type = type;
        this._goals = Array.isArray(goals) ? goals : [];
        this._required = Array.isArray(required) ? required : [];
        this._tools = Array.isArray(tools) ? tools : [];
        this._translations = translations || {};

        this._featured = !!featured;
        this._price = Number.isFinite(+price) ? +price : 0;
        this._is_free = !!is_free;
        this._tag = tag ?? "";
        this._categories = Array.isArray(categories) ? categories : [];
        this._start_date = start_date ?? null;
        this._end_date = end_date ?? null;

        this._tutor_uids = Array.isArray(tutor_uids) ? tutor_uids : [];
    }

    // --- GETTERS ---
    get uid() { return this._uid; }
    get created_time() { return this._created_time; }
    get last_edit_time() { return this._last_edit_time; }
    get number() { return this._number; }
    get title() { return this._title; }
    get subtitle() { return this._subtitle; }
    get level() { return this._level; }
    get duration() { return this._duration; }
    get description() { return this._description; }
    get description_html() { return this._description_html; }
    get photo() { return this._photo; }
    get video() { return this._video; }
    get type() { return this._type; }
    get goals() { return this._goals; }
    get required() { return this._required; }
    get tools() { return this._tools; }
    get translations() { return this._translations; }

    get featured() { return this._featured; }
    get price() { return this._price; }
    get is_free() { return this._is_free; }
    get tag() { return this._tag; }
    get categories() { return this._categories; }
    get start_date() { return this._start_date; }
    get end_date() { return this._end_date; }
    get tutor_uids() { return this._tutor_uids; }



    // --- SETTERS ---
    set uid(v) { this._uid = v; }
    set created_time(v) { this._created_time = v; }
    set last_edit_time(v) { this._last_edit_time = v; }
    set number(v) { this._number = v; }
    set title(v) { this._title = v; }
    set subtitle(v) { this._subtitle = v; }
    set level(v) { this._level = v; }
    set duration(v) { this._duration = v; }
    set description(v) { this._description = v; }
    set description_html(v) { this._description_html = v; }
    set photo(v) { this._photo = v; }
    set video(v) { this._video = v; }
    set type(v) { this._type = v; }
    set goals(v) { this._goals = Array.isArray(v) ? v : []; }
    set required(v) { this._required = Array.isArray(v) ? v : []; }
    set tools(v) { this._tools = Array.isArray(v) ? v : []; }
    set tutor_uids(v) { this._tutor_uids = Array.isArray(v) ? v : []; }
    set translations(v) { this._translations = v || {}; }

    set featured(v) { this._featured = !!v; }
    set price(v) { this._price = Number.isFinite(+v) ? +v : 0; }
    set is_free(v) { this._is_free = !!v; }
    set tag(v) { this._tag = v ?? ""; }
    set categories(v) { this._categories = Array.isArray(v) ? v : []; }
    set start_date(v) { this._start_date = v ?? null; }
    set end_date(v) { this._end_date = v ?? null; }
    // ---------- GETTERS utils ----------
    async getTutors() {
        const tutor_uids = this._tutor_uids;
        const tutors = [];
        for (const uid of tutor_uids) {
            const tutor = await ClassUserTutor.fetchFromFirestore(uid);
            tutors.push(tutor);
        }
        return (tutors);
    }
    async getModuleParts() {
        const parts = await ClassModulePart.fetchListFromFirestore([where("module_uid", "==",this._uid)]);
        return (parts);
    }
    async getLessons() {
        const lessons = await ClassLesson.fetchListFromFirestore([where("module_uid", "==",this._uid)]);
        return (lessons);
    }
    async getTranslations() {
        const snap = await getDoc(ClassModule.docRef(this._uid));
        if (snap.exists()) {
            const refTranslate = collection(snap.ref, "i18n");
            const snapTranslate = await getDocs(refTranslate);
            const translations = {};
            for (const snapshotT of snapTranslate.docs) {
                translations[snapshotT.ref.id] = snapshotT.data();
            }
            return (translations);
        }

        return {}; // -> ClassModule | null
    }
    // ---------- GETTERS TRASNLATE ----------
    getTitle(lang = language_fr) {
        return this.translate({ lang, field: "title" })
    }
    getDescription(lang = language_fr) {
        return this.translate({ lang, field: "description" })
    }
    getDescriptionHtml(lang = language_fr) {
        return this.translate({ lang, field: "description_html" })
    }
    // --- Serialization ---
    toJSON() {
        return {
            uid: this._uid,
            created_time: this._created_time,
            last_edit_time: this._last_edit_time,
            number: this._number,
            title: this._title,
            subtitle: this._subtitle,
            level: this._level,
            duration: this._duration,
            description: this._description,
            photo: this._photo,
            video: this._video,
            type: this._type,
            goals: this._goals,
            required: this._required,
            tools: this._tools,
            //translations: this._translations,
            featured: this._featured,
            price: this._price,
            is_free: this._is_free,
            tag: this._tag,
            categories: this._categories,
            start_date: this._start_date,
            end_date: this._end_date,
            tutor_uids: this._tutor_uids,
        };
    }

    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }

    clone() {
        return new ClassModule(this.toJSON());
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

    static get converter() {
        return {
            toFirestore(model) {
                return model.toJSON(); // Firestore convertira Date -> Timestamp
            },
            fromFirestore(snapshot, options) {
                const data = snapshot.data(options) || {};
                return new ClassModule({
                    ...data,
                    uid: data.uid ?? snapshot.id,
                    created_time: ClassModule._toJsDate(data.created_time) ?? new Date(),
                    last_edit_time: ClassModule._toJsDate(data.last_edit_time) ?? new Date(),
                    start_date: ClassModule._toJsDate(data.start_date),
                    end_date: ClassModule._toJsDate(data.end_date),

                    goals: Array.isArray(data.goals) ? data.goals : [],
                    required: Array.isArray(data.required) ? data.required : [],
                    tools: Array.isArray(data.tools) ? data.tools : [],
                    tutor_uids: Array.isArray(data.tutor_uids) ? data.tutor_uids : [],
                    //translations: data.translations ?? {},

                    featured: !!data.featured,
                    price: Number.isFinite(+data.price) ? +data.price : 0,
                    is_free: !!data.is_free,
                    tag: data.tag ?? "",
                    categories: Array.isArray(data.categories) ? data.categories : [],
                });
            },
        };
    }
    translate({ lang = language_fr, field = "", }) {
        if (!this._uid) throw new Error("UID is required to get module.");
        if (!this.hasOwnProperty(`_${field}`)) throw new Error("field is required to get module.");
        if (lang === language_fr) {
            return this[`_${field}`];
        }
        const _translate = this._translations[lang] || "";
        if (!_translate) throw new Error(`The module with lang ${lang} doesn't exist on the database`);
        return _translate[field] || this[`_${field}`];
    }

    // ---------- Helpers Firestore ----------
    static colRef() {
        return collection(firestore, ClassModule.COLLECTION).withConverter(ClassModule.converter);
    }

    static docRef(id) {
        return doc(firestore, ClassModule.COLLECTION, id).withConverter(ClassModule.converter);
    }

    static async count() {
        const coll = collection(firestore, ClassModule.COLLECTION);
        const snap = await getCountFromServer(coll);
        return snap.data().count; // -> nombre total
    }
    async countModuleParts() {
        const count = await ClassModulePart.count([where("module_uid", "==", this._uid)]);
        return count;
    }
    async countLessons() {
        const count = await ClassLesson.count([where("module_uid", "==", this._uid)]);
        return count;
    }
    async countDurationLessons() {
        const lessons = await ClassLesson.fetchListFromFirestore([where("module_uid", "==", this._uid)]);
        const totalDuration = (lessons || []).reduce((sum, lesson) => {
            //const { value, unit } = this.constructor._pickDurationValue(lesson, fieldCandidates, unitByField);
            //const seconds = this.constructor._toSeconds(value, unit);
            return sum + lesson.duration;
          }, 0);
       // const count = list;
        return totalDuration;
    }

    // Récupérer un module par id
    static async get(id) {
        const snap = await getDoc(ClassModule.docRef(id));
        if (snap.exists()) {
            const refTranslate = collection(snap.ref, "i18n");
            const snapTranslate = await getDocs(refTranslate);
            const translations = {};
            for (const snapshotT of snapTranslate.docs) {
                translations[snapshotT.ref.id] = snapshotT.data();
            }
            const data = snap.data();
            data.translations = translations;
            return (data);
        }

        return null; // -> ClassModule | null
    }

    // Lister des modules (passer des contraintes Firestore : where(), orderBy(), limit()…)
    static async list(constraints = []) {
        const q = constraints.length ? query(ClassModule.colRef(), ...constraints) : query(ClassModule.colRef());
        const qSnap = await getDocs(q);
        const modules = [];
        for (const d of qSnap.docs) {
            const refTranslate = collection(d.ref, "i18n");
            const snapTranslate = await getDocs(refTranslate);
            const translations = {};
            for (const snapshotT of snapTranslate.docs) {
                translations[snapshotT.ref.id] = snapshotT.data();
            }
            //d.data();
            console.log("TRASNLATE", translations)
            const data = d.data();
            data.translations = translations;
            modules.push(data);
        }
        return modules;
    }

    // Créer un module (avec option timestamps serveur)
    static async create(data = {}, { useServerTimestamps = true } = {}) {
        const newRef = doc(ClassModule.colRef()); // id auto
        const model = data instanceof ClassModule ? data : new ClassModule({ uid: newRef.id, ...data });
        await setDoc(newRef, model);
        if (useServerTimestamps) {
            await updateDoc(newRef, {
                created_time: serverTimestamp(),
                last_edit_time: serverTimestamp(),
            });
        }
        return (await getDoc(newRef)).data(); // -> ClassModule
    }

    // Mettre à jour un module
    static async update(id, patch = {}, { bumpEditTime = true } = {}) {
        const ref = ClassModule.docRef(id);
        const data = bumpEditTime ? { ...patch, last_edit_time: serverTimestamp() } : patch;
        await updateDoc(ref, data);
        return (await getDoc(ref)).data(); // -> ClassModule
    }

    // Supprimer un module
    static async remove(id) {
        await deleteDoc(ClassModule.docRef(id));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get module.");
            return await ClassModule.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchListFromFirestore(constraints = []) {
        try {
            //if (!uid) throw new Error("UID is required to get module.");
            return await ClassModule.list(constraints);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
}
