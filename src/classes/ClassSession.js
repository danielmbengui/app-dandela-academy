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
import { ClassUser, ClassUserTeacher } from "./users/ClassUser";
import { ClassRoom } from "./ClassRoom";
import { ClassLesson } from "./ClassLesson";

export class ClassSession {
    static COLLECTION = "SESSIONS";
    static COLLECTION_TRANSLATE = "i18n";
    static NS_COLLECTION = `classes/session`;
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
        SUBSCRIPTION_EXPIRED: 'expired',
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
        expired: {
            label: "expired", // "Inscriptions ouvertes",
            color: "var(--session-status-expired)",
            glow: "var(--session-status-expired-glow)",
        },
        full: {
            label: "full", // "Complet",
            color: "var(--session-status-full)",
            glow: "var(--session-status-full-glow)",
        },
        finished: {
            label: "finished", // "Terminé",
            color: "var(--session-status-finished)",
            glow: "var(--session-status-finished-glow)",
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
    static ALL_CATEGORIES = Object.values(ClassSession.CATEGORY).filter(item => item !== ClassSession.CATEGORY.UNKNOWN);
    static ALL_LEVELS = Object.values(ClassSession.LEVEL).filter(item => item !== ClassSession.LEVEL.UNKNOWN);
    static ALL_FORMATS = Object.values(ClassSession.FORMAT).filter(item => item !== ClassSession.FORMAT.UNKNOWN);
    constructor({
        uid = "",
        uid_intern = "",
        uid_lesson = "",
        uid_teacher = "",
        uid_room = "",
        lesson = null,
        teacher = null,
        room = null,
        code = "", // Excel-101
        title = "",
        title_normalized = "",
        price = 0,
        old_price = 0,
        currency = "",
        start_date = null,
        end_date = null,
        slots = [],
        status = ClassSession.STATUS.DRAFT,
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        this._uid = uid;
        this._uid_intern = uid_intern;
        this._uid_lesson = uid_lesson;
        this._uid_teacher = uid_teacher;
        this._uid_room = uid_room;
        this._lesson = lesson;
        this._teacher = teacher;
        this._room = room;
        this._code = code;
        this._title = title;
        this._title_normalized = title_normalized;
        this._price = price;
        this._currency = currency;
        this._start_date = start_date;
        this._end_date = end_date;
        this._status = status;
        this._slots = slots;
        this._created_time = created_time;
        this._last_edit_time = last_edit_time;
    }

    get uid() { return this._uid; }
    set uid(value) { this._uid = value; }

    get uid_intern() { return this._uid_intern; }
    set uid_intern(value) { this._uid_intern = value; }

    get uid_lesson() { return this._uid_lesson; }
    set uid_lesson(value) { this._uid_lesson = value; }

    get uid_teacher() { return this._uid_teacher; }
    set uid_teacher(value) { this._uid_teacher = value; }

    get uid_room() { return this._uid_room; }
    set uid_room(value) { this._uid_room = value; }

    get lesson() { return this._lesson; }
    set lesson(value) {
        if (value && !(value instanceof ClassLesson)) return;
        this._lesson = value;
        this._touchLastEdit();
    }
    get teacher() { return this._teacher; }
    set teacher(value) {
        if (value && !(value instanceof ClassUser)) return;
        this._teacher = value;
        this._touchLastEdit();
    }
    get room() { return this._room; }
    set room(value) {
        if (value && !(value instanceof ClassRoom)) return;
        this._room = value;
        this._touchLastEdit();
    }

    get code() { return this._code; }
    set code(value) { this._code = value; }

    get title() { return this._title; }
    set title(value) { this._title = value; }

    get title_normalized() { return this._title_normalized; }
    set title_normalized(value) { this._title_normalized = value; }

    get price() { return this._price; }
    set price(value) { this._price = value; }

    get old_price() { return this._old_price; }
    set old_price(value) { this._old_price = value; }

    get currency() { return this._currency; }
    set currency(value) { this._currency = value; }

    get start_date() { return this._start_date; }
    set start_date(value) { this._start_date = value; }

    get end_date() { return this._end_date; }
    set end_date(value) { this._end_date = value; }

    get status() { return this._status; }
    set status(value) { this._status = value; }

    get slots() { return this._slots; }
    set slots(value) { this._slots = value; }

    get created_time() { return this._created_time; }
    set created_time(value) { this._created_time = value; }

    get last_edit_time() { return this._last_edit_time; }
    set last_edit_time(value) { this._last_edit_time = value; }

    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }

    // --- GETTERS ---
    subscribeStudent(uid = "", format = "") {
        if (!uid || !format) return;
        if (format === ClassSession.FORMAT.ONLINE) {
            this._subscribers_online.push(uid);
        }
        if (format === ClassSession.FORMAT.ONSITE) {
            this._subscribers_onsite.push(uid);
        }
    }
    unsubscribeStudent(uid = "", format = "") {
        if (!uid || !format) return;
        if (format === ClassSession.FORMAT.ONLINE) {
            this._subscribers_online = this._subscribers_online.filter(subscriber => subscriber !== uid);
        }
        if (format === ClassSession.FORMAT.ONSITE) {
            this._subscribers_onsite = this._subscribers_onsite.filter(subscriber => subscriber !== uid);
        }
    }
    sortSlots(sortBy = 'uid_intern', sortDirection = 'asc') {
        if (sortBy === 'uid_intern') {
            if (sortDirection === 'asc') {
                this._slots = this._slots.sort((a, b) => a.uid_intern - b.uid_intern);
            } else {
                this._slots = this._slots.sort((a, b) => b.uid_intern - a.uid_intern);
            }
        } else if (sortBy === 'start_date') {
            if (sortDirection === 'asc') {
                this._slots = this._slots.sort((a, b) => a.start_date.getTime() - b.start_date.getTime());
            } else {
                this._slots = this._slots.sort((a, b) => b.start_date.getTime() - a.start_date.getTime());
            }
        }
    }

    // --- Serialization ---
    toJSON() {
        const out = { ...this };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        cleaned.lesson = null;
        cleaned.teacher = null;
        cleaned.room = null;
        delete cleaned.lesson;
        delete cleaned.teacher;
        delete cleaned.room;
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
        console.log("CLONE SESSION", this._lesson)
        return ClassSession.makeLessonSessionInstance(this._uid, {
            ...this.toJSON(),
            room: this._room,
            lesson: this._lesson,
            teacher: this._teacher,
        });
        //return new ClassUser(this.toJSON());
    }
    addSlot(slot = null) {
        if (!slot || !(slot instanceof ClassSessionSlot)) return;
        const size = this._slots.length || 0;
        const item = new ClassSessionSlot({ ...slot.toJSON(), uid_intern: size + 1 });
        this._slots.push(item);
        this._slots.sort((a, b) => a.uid_intern - b.uid_intern);
    }
    updateSlot(slot = null) {
        if (!slot || !(slot instanceof ClassSessionSlot)) return;
        const uid_intern = slot.uid_intern;
        this._slots = this._slots.map(item => {
            if (item.uid_intern === uid_intern) {
                return slot;
            }
            return item;
        });
        this._slots.sort((a, b) => a.uid_intern - b.uid_intern);
    }
    removeSlot(slot = null) {
        if (!slot || !(slot instanceof ClassSessionSlot)) return;
        const uid_intern = slot.uid_intern;
        this._slots = this._slots.filter(item => item.uid_intern !== uid_intern);
        this._slots.sort((a, b) => a.uid_intern - b.uid_intern);
    }
    countSubscribers(format = "") {
        if (format === ClassSession.FORMAT.ONLINE) {
            return this._subscribers_online.length;
        }
        if (format === ClassSession.FORMAT.ONSITE) {
            return this._subscribers_onsite.length;
        }
        return 0;
    }
    countFree(format = "") {
        if (format === ClassSession.FORMAT.ONLINE) {
            return this._seats_availables_online - this._subscribers_online.length;
        }
        if (format === ClassSession.FORMAT.ONSITE) {
            return this._seats_availables_onsite - this._subscribers_onsite.length;
        }
        return 0;
    }
    isFull(format = "") {
        if (format === ClassSession.FORMAT.ONLINE) {
            if (this._seats_availables_online > this.countSubscribers(ClassSession.FORMAT.ONLINE)) {
                return false;
            }
        }
        if (format === ClassSession.FORMAT.ONSITE) {
            if (this._seats_availables_onsite > this.countSubscribers(ClassSession.FORMAT.ONSITE)) {
                return false;
            }
        }
        return true;
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
    static makeLessonSessionInstance(uid, data = {}) {
        return new ClassSession({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(sessionInstance) {
                // chaque classe a un .toJSON() propre
                //console.log("INSTANCE", sessionInstance)
                //const lesson = lessonInstance;
                //delete sessionInstance.lesson;
                //delete sessionInstance.teacher;
                //delete sessionInstance.room;
                sessionInstance.slots = sessionInstance.slots.map(slot => slot.toJSON());
                //return lesson.toJSON();
                return sessionInstance?.toJSON ? sessionInstance.toJSON() : sessionInstance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                var start_date = ClassSession._toJsDate(data.start_date);
                var end_date = ClassSession._toJsDate(data.end_date);
                const last_subscribe_time = ClassSession._toJsDate(data.last_subscribe_time);
                const created_time = ClassSession._toJsDate(data.created_time);
                const last_edit_time = ClassSession._toJsDate(data.last_edit_time);
                const session = ClassSession.makeLessonSessionInstance(uid, { ...data, start_date, end_date, last_subscribe_time, created_time, last_edit_time });
                const slots = data.slots?.map?.(slot => {
                    const item = new ClassSessionSlot(slot);
                    //const item_session = new ClassSession(session.toJSON());
                    //delete item_session.slots;
                    //delete item_session.slots;
                    //item.session = item_session;
                    return item;
                }) || [];
                slots.sort((a, b) => a.uid_intern - b.uid_intern);
                session.slots = slots;
                return session;
            },
        };
    }
    // ---------- Helpers Firestore ----------
    static async alreadyExist(_uid) {
        const q = query(
            collection(firestore, ClassSession.COLLECTION),
            where("uid", "==", _uid)
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static async alreadyExistByName(_name) {
        const q = query(
            collection(firestore, ClassSession.COLLECTION),
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
        if (array.length === 0 || !(array[0] instanceof ClassSession)) {
            return -1;
        }
        if (!(array[0] instanceof ClassSession)) {
            console.log("ERRROR is not class School")
            return -1;
        }
        const indexof = array.findIndex(item => item.uid === uid);
        return indexof;
    }
    static async get(id) {
        const snap = await getDoc(this.docRef(id));
        if (snap.exists()) {
            const data = snap.data();
            return (data);
        }

        return null; // -> ClassModule | null
    }
    static async getByName(_name) {
        //const usersCol = collection(firestore, ClassUser.COLLECTION).withConverter(ClassUser.converter);
        const q = query(
            collection(firestore, ClassSession.COLLECTION).withConverter(ClassSession.converter),
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
    static async list(constraints = []) {
        const q = constraints.length ? query(this.colRef(), ...constraints) : query(this.colRef());
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
        //const model = data instanceof ClassLessonSession ? data : new ClassLessonSession({ ...data });
        //model.uid = newRef.id;()

        const countSession = await this.constructor.count() || 0;
        const idSession = countSession + 1;
        this._uid = newRef.id;
        this._uid_intern = idSession;
        this._code = `Session${idSession}`;
        this._title_normalized = this.createTitleNormalized(this._title);
        this._slots = this._slots.map((slot, index) => {
            if (!(slot instanceof ClassSessionSlot)) return slot;
            const uid_intern = index + 1;
            const uid_session = newRef.id;
            slot.uid_intern = uid_intern;
            slot.uid_session = uid_session;
            slot.created_time = new Date();
            slot.last_edit_time = new Date();
            return slot;
        });
        //this._subtitle_normalized = this.createTitleNormalized(this.subtitle);
        //this._name_normalized = createNameNormalized(this._name);
        // const uid = newRef.id;
        //const uid_intern = idSchool;
        //this._enabled = false;
        this._created_time = new Date();
        this._last_edit_time = new Date();
        //const path = { ...model.toJSON(), uid, uid_intern, created_time, last_edit_time };
        await setDoc(newRef, this.toJSON());
        return this.constructor.makeLessonSessionInstance(this._uid, this.toJSON());// -> ClassModule
    }
    async updateFirestore() {
        try {
            // const ref = ClassLessonSession.docRef(id);
            //const data = { ...patch, last_edit_time: new Date() };
            //await updateDoc(ref, data, { merge: true });
            //console.log("UPDATE COMPLETED")
            //return (await getDoc(ref)).data(); // -> ClassModule
            const ref = this.constructor.docRef(this._uid);
            this._last_edit_time = new Date();
            //this._slots = this._slots.map(slot => slot.toJSON());
            //this._lesson = null;
            //this._teacher = null;
            //this._room = null;
            const data = { ...this.toJSON(), slots: this._slots.map(slot => slot.toJSON()) };
            await updateDoc(ref, data, { merge: true });
            //console.log("UPDATE COMPLETED", this._slots);
            //return (await getDoc(ref)).data(); // -> ClassDevice
            return this.constructor.makeLessonSessionInstance(this._uid, this.toJSON()); // -> ClassModule
        } catch (e) {
            console.log("ERROR", e.message);
            return null;
        }
    }
    // Mettre à jour un module
    static async update(id, patch = {}) {
        try {
            const ref = ClassSession.docRef(id);
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
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await ClassSession.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchFromFirestoreNeme(_name) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await ClassSession.getByName(_name);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchListFromFirestore(constraints = []) {
        try {
            //if (!uid) throw new Error("UID is required to get module.");
            return await this.list(constraints);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
}

export class ClassSessionSlot {
    static COLLECTION = "SESSIONS_SLOTS";
    static COLLECTION_TRANSLATE = "i18n";
    static NS_COLLECTION = `classes/session/slot`;
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
        SUBSCRIPTION_EXPIRED: 'expired',
        FINISHED: 'finished',
        DRAFT: 'draft',
        UNKNOWN: 'unknown',
    });
    static STATUS_CONFIG = Object.freeze({
        open: {
            label: "open", // "Inscriptions ouvertes",
            color: "var(--session-status-open)",
            glow: "var(--session-status-open-glow)",
        },
        expired: {
            label: "expired", // "Inscriptions ouvertes",
            color: "var(--session-status-expired)",
            glow: "var(--session-status-expired-glow)",
        },
        full: {
            label: "full", // "Complet",
            color: "var(--session-status-full)",
            glow: "var(--session-status-full-glow)",
        },
        finished: {
            label: "finished", // "Terminé",
            color: "var(--session-status-finished)",
            glow: "var(--session-status-finished-glow)",
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
    static ALL_LEVELS = Object.values(ClassSessionSlot.LEVEL).filter(item => item !== ClassSessionSlot.LEVEL.UNKNOWN);
    static ALL_FORMATS = Object.values(ClassSessionSlot.FORMAT).filter(item => item !== ClassSessionSlot.FORMAT.UNKNOWN);
    static ALL_DURATIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8];
    constructor({
        uid_intern = "",
        uid_session = "",
        format = "",
        level = "",
        lang = "",
        start_date = null,
        end_date = null,
        duration = 0,
        seats_availables_onsite = 0,
        seats_availables_online = 0,
        status = ClassSession.STATUS.DRAFT,
        location = "",
        url = "",
        subscribers_online = [],
        subscribers_onsite = [],
        last_subscribe_time = new Date(),
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        this._uid_intern = uid_intern;
        this._uid_session = uid_session;
        //this._session = null;
        this._format = format;
        this._level = level;
        this._lang = lang || defaultLanguage;
        this._start_date = ClassSession._toJsDate(start_date);
        this._end_date = ClassSession._toJsDate(end_date);
        this._duration = parseFloat(duration) || 0;
        this._seats_availables_onsite = parseInt(seats_availables_onsite) || 0;
        this._seats_availables_online = parseInt(seats_availables_online) || 0;
        this._status = status;
        this._location = location;
        this._url = url;
        this._subscribers_online = subscribers_online;
        this._subscribers_onsite = subscribers_onsite;
        this._last_subscribe_time = ClassSession._toJsDate(last_subscribe_time);
        this._created_time = ClassSession._toJsDate(created_time);
        this._last_edit_time = ClassSession._toJsDate(last_edit_time);
        this.teacher = null;
    }

    get uid_intern() { return this._uid_intern; }
    set uid_intern(value) { this._uid_intern = value; }

    get uid_session() { return this._uid_session; }
    set uid_session(value) { this._uid_session = value; }

    get format() { return this._format; }
    set format(value) { this._format = value; }
    get level() { return this._level; }
    set level(value) { this._level = value; }
    get lang() { return this._lang; }
    set lang(value) { this._lang = value; }

    get start_date() { return this._start_date; }
    set start_date(value) { this._start_date = value; }

    get end_date() { return this._end_date; }
    set end_date(value) { this._end_date = value; }

    get duration() { return this._duration; }
    set duration(value) { this._duration = parseFloat(value) || 0; }

    get seats_availables_onsite() { return this._seats_availables_onsite; }
    set seats_availables_onsite(value) { this._seats_availables_onsite = parseInt(value) || 0; }

    get seats_availables_online() { return this._seats_availables_online; }
    set seats_availables_online(value) { this._seats_availables_online = parseInt(value) || 0; }

    get status() { return this._status; }
    set status(value) { this._status = value; }

    get location() { return this._location; }
    set location(value) { this._location = value; }

    get url() { return this._url; }
    set url(value) { this._url = value; }

    get subscribers_online() { return this._subscribers_online; }
    set subscribers_online(value) { this._subscribers_online = value; }

    get subscribers_onsite() { return this._subscribers_onsite; }
    set subscribers_onsite(value) { this._subscribers_onsite = value; }

    get last_subscribe_time() { return this._last_subscribe_time; }
    set last_subscribe_time(value) { this._last_subscribe_time = value; }

    get created_time() { return this._created_time; }
    set created_time(value) { this._created_time = value; }

    get last_edit_time() { return this._last_edit_time; }
    set last_edit_time(value) { this._last_edit_time = value; }

    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }

    getDuration() {
        if (!this._start_date || !this._end_date) return 0;
        const diff = this._end_date.getTime() - this._start_date.getTime();
        return parseInt(diff / (1000 * 60 * 60));
    }

    // --- GETTERS ---
    subscribeStudent(uid = "", format = "") {
        if (!uid || !format) return;
        if (format === ClassSessionSlot.FORMAT.ONLINE) {
            this._subscribers_online.push(uid);
        }
        if (format === ClassSessionSlot.FORMAT.ONSITE) {
            this._subscribers_onsite.push(uid);
        }
        this._subscribers_online = Array.from(new Set(this._subscribers_online));
        this._subscribers_onsite = Array.from(new Set(this._subscribers_onsite));
    }
    unsubscribeStudent(uid = "", format = "") {
        if (!uid || !format) return;
        if (format === ClassSessionSlot.FORMAT.ONLINE) {
            this._subscribers_online = this._subscribers_online.filter(subscriber => subscriber !== uid);
        }
        if (format === ClassSessionSlot.FORMAT.ONSITE) {
            this._subscribers_onsite = this._subscribers_onsite.filter(subscriber => subscriber !== uid);
        }
        this._subscribers_online = Array.from(new Set(this._subscribers_online));
        this._subscribers_onsite = Array.from(new Set(this._subscribers_onsite));
    }
    countSubscribers(format = "") {
        if (format === ClassSessionSlot.FORMAT.ONLINE) {
            return this._subscribers_online.length;
        }
        if (format === ClassSessionSlot.FORMAT.ONSITE) {
            return this._subscribers_onsite.length;
        }
        return this._subscribers_online.length + this._subscribers_onsite.length;
    }
    isSubscribe(uid = "", format = "") {
        if (!uid) return;
        if (format === ClassSessionSlot.FORMAT.ONLINE) {
            return this._subscribers_online.includes(uid);
        }
        if (format === ClassSessionSlot.FORMAT.ONSITE) {
            return this._subscribers_onsite.includes(uid);
        }
        if (this._subscribers_online.includes(uid)) {
            return true;
        }
        if (this._subscribers_onsite.includes(uid)) {
            return true;
        }
        return false;
    }
    occupancyRate(format = "") {
        var filled = this.countSubscribers(format);
        var total = 0;
        if (format === ClassSessionSlot.FORMAT.ONLINE) {
            total = this._seats_availables_online;
        }
        if (format === ClassSessionSlot.FORMAT.ONSITE) {
            total = this._seats_availables_onsite;
        }
        return (total > 0 ? filled / total : 0) * 100;
    }
    countTotalSeats(format = "") {
        if (format === ClassSessionSlot.FORMAT.ONLINE) {
            return this._seats_availables_online;
        }
        if (format === ClassSessionSlot.FORMAT.ONSITE) {
            return this._seats_availables_onsite;
        }
        var total = this._seats_availables_online + this._seats_availables_onsite;
        return (total);
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
                // Utiliser le setter si disponible pour appliquer les conversions de type
                if (typeof this[key] !== 'undefined' || key in this) {
                    this[key] = props[key];
                } else {
                    this[`_${key}`] = props[key];
                }
            }
        }
    }
    clone() {
        return new ClassSessionSlot(this.toJSON());
        //return new ClassUser(this.toJSON());
    }

    countFree(format = "") {
        if (format === ClassSessionSlot.FORMAT.ONLINE) {
            return this._seats_availables_online - this._subscribers_online.length;
        }
        if (format === ClassSessionSlot.FORMAT.ONSITE) {
            return this._seats_availables_onsite - this._subscribers_onsite.length;
        }
        return this.countAvailablesTotal() - this.countSubscribers();
    }
    countAvailablesTotal() {
        return this._seats_availables_online + this._seats_availables_onsite;
    }
    isFull(format = "") {
        if (format === ClassSession.FORMAT.ONLINE) {
            if (this._seats_availables_online > this.countSubscribers(ClassSession.FORMAT.ONLINE)) {
                return false;
            }
        }
        if (format === ClassSession.FORMAT.ONSITE) {
            if (this._seats_availables_onsite > this.countSubscribers(ClassSession.FORMAT.ONSITE)) {
                return false;
            }
        }
        return true;
    }
    // ---------- Converter intégré ----------
}