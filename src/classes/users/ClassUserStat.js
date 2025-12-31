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
import { ClassSchool } from "../ClassSchool";
import { ClassHardware } from "../ClassDevice";
import { ClassUser } from "./ClassUser";
import { addDaysToDate } from "@/contexts/functions";

export class ClassUserStat {
    static COLLECTION = "STATS";
    static NS_COLLECTION = `classes/stat`;
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
    static STATUS = Object.freeze({
        MAX: 'max', // bureautique
        EXCELLENT: 'excellent', // bureautique
        GOOD: 'good',
        TO_IMPROVE: 'to-improve',
        NOT_GOOD: 'not-good',
        UNKNOWN: 'unknown',
    });
    static STATUS_CONFIG = Object.freeze({
        max: {
            label: "max", // "Inscriptions ouvertes",
            color: "var(--gold)",
            border: "var(--gold)",
            background: "var(--gold-shadow-xs)",
            background_icon: "var(--gold-shadow)",
            background_bubble: "var(--gold-shadow-xs)",
            color_icon: "var(--gold)",
            border_icon: "var(--gold-shadow)",
            background_bar:"var(--gold)",
            glow: "var(--gold-shadow)",

        },
        excellent: {
            label: "excellent", // "Inscriptions ouvertes",
            color: "var(--success)",
            border: "var(--success-shadow)",
            background: "var(--success-shadow-xs)",
            background_icon: "var(--success-shadow)",
            background_bubble: "var(--success-shadow-xs)",
            color_icon: "var(--success)",
            border_icon: "var(--success-shadow-sm)",
            background_bar:"var(--success)",
            glow: "var(--success-shadow)",
        },
        good: {
            label: "good", // "Inscriptions ouvertes",
            color: "var(--info)",
            border: "var(--info-shadow)",
            background: "var(--info-shadow-xs)",
            background_icon: "var(--info-shadow)",
            background_bubble: "var(--info-shadow-xs)",
            color_icon: "var(--info)",
            border_icon: "var(--info-shadow-sm)",
            background_bar:"var(--info)",
            glow: "var(--info-shadow)",
        },
        ['to-improve']: {
            label: "to-improve", // "Inscriptions ouvertes",
            color: "var(--warning)",
            border: "var(--warning-shadow)",
            background: "var(--warning-shadow-xs)",
            background_icon: "var(--warning-shadow)",
            background_bubble: "var(--warning-shadow-xs)",
            color_icon: "var(--warning)",
            border_icon: "var(--warning-shadow-sm)",
            background_bar:"var(--warning)",
            glow: "var(--warning-shadow)",
        },
        ['not-good']: {
            label: "not-good", // "Inscriptions ouvertes",
                        color: "var(--error)",
            border: "var(--error-shadow)",
            background: "var(--error-shadow-xs)",
            background_icon: "var(--error-shadow)",
            background_bubble: "var(--error-shadow-xs)",
            color_icon: "var(--error)",
            border_icon: "var(--error-shadow-sm)",
            background_bar:"var(--error)",
            glow: "var(--error-shadow)",
        },
    });
    static ALL_STATUS = Object.values(ClassUserStat.STATUS).filter(v => v !== ClassUserStat.STATUS.UNKNOWN);
    constructor({
        uid = "",
        uid_user = "",
        uid_lesson = "",
        uid_chapter = "",
        user = null,
        lesson = null,
        chapter = null,
        answers = [],
        score = 0,
        questions_length = 0,
        start_date = null,
        end_date = null,
        duration = 0,
        status = ClassUserStat.STATUS.UNKNOWN,
        next_trying_date = null,
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        // ids
        this._uid = String(uid || "");
        this._uid_user = String(uid_user || "");
        this._uid_lesson = String(uid_lesson || "");
        this._uid_chapter = String(uid_chapter || "");

        // refs (objets déjà chargés)
        this._user = user;
        this._lesson = lesson;
        this._chapter = chapter;

        this._duration = duration;
        this._status = status;

        // data
        this._answers = Array.isArray(answers) ? answers : [];
        this._score = Number.isFinite(Number(score)) ? Number(score) : 0;
        this._questions_length = Number.isFinite(Number(questions_length))
            ? Number(questions_length)
            : 0;

        this._start_date = ClassUserStat._toJsDate(start_date);
        this._end_date = ClassUserStat._toJsDate(end_date);
        this._next_trying_date = ClassUserStat._toJsDate(next_trying_date);

        // dates
        this._created_time = ClassUserStat._toJsDate(created_time);
        this._last_edit_time = ClassUserStat._toJsDate(last_edit_time);
    }

    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }
    // -------------------------
    // Getters / Setters
    // -------------------------
    get uid() {
        return this._uid;
    }
    set uid(v) {
        this._uid = String(v || "");
    }

    get uid_user() {
        return this._uid_user;
    }
    set uid_user(v) {
        this._uid_user = String(v || "");
    }

    get uid_lesson() {
        return this._uid_lesson;
    }
    set uid_lesson(v) {
        this._uid_lesson = String(v || "");
    }

    get uid_chapter() {
        return this._uid_chapter;
    }
    set uid_chapter(v) {
        this._uid_chapter = String(v || "");
    }

    get user() {
        return this._user;
    }
    set user(v) {
        this._user = v ?? null;
    }

    get lesson() {
        return this._lesson;
    }
    set lesson(v) {
        this._lesson = v ?? null;
    }

    get chapter() {
        return this._chapter;
    }
    set chapter(v) {
        this._chapter = v ?? null;
    }

    get answers() {
        return this._answers;
    }
    set answers(v) {
        this._answers = Array.isArray(v) ? v : [];
    }

    get score() {
        return this._score;
    }
    set score(v) {
        const n = Number(v);
        this._score = Number.isFinite(n) ? n : 0;
    }

    get questions_length() {
        return this._questions_length;
    }
    set questions_length(v) {
        const n = Number(v);
        this._questions_length = Number.isFinite(n) ? n : 0;
    }

    get start_date() {
        return this._start_date;
    }
    set start_date(v) {
        this._start_date = ClassUserStat._toJsDate(v);
    }
    get end_date() {
        return this._end_date;
    }
    set end_date(v) {
        this._end_date = ClassUserStat._toJsDate(v);
    }
    get duration() {
        return this._duration;
    }
    set duration(v) {
        this._duration = v || 0;
    }
    get status() {
        return this._status;
    }
    set status(v) {
        this._status = v || ClassUserStat.STATUS.UNKNOWN;
    }

    get next_trying_date() {
        return this._next_trying_date;
    }
    set next_trying_date(v) {
        this._next_trying_date = ClassUserStat._toJsDate(v);
    }

    get created_time() {
        return this._created_time;
    }
    set created_time(v) {
        this._created_time = ClassUserStat._toJsDate(v);
    }

    get last_edit_time() {
        return this._last_edit_time;
    }
    set last_edit_time(v) {
        this._last_edit_time = ClassUserStat._toJsDate(v);
    }

    // --- Serialization ---
    toJSON() {
        const out = { ...this };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        cleaned.user = null;
        cleaned.lesson = null;
        cleaned.chapter = null;
        cleaned.score = null;
        cleaned.duration = null;
        delete cleaned.user;
        delete cleaned.lesson;
        delete cleaned.chapter;
        delete cleaned.score;
        delete cleaned.duration;
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
        return ClassUserStat.makeUserStat(this._uid, {
            ...this.toJSON(),
            user: this._user,
            lesson: this._lesson,
            chapter: this._chapter,
            score: this._score,
            duration: this._duration,
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
    static makeUserStat(uid, data = {}) {
        return new ClassUserStat({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(statInstance) {
                // chaque classe a un .toJSON() propre
                return statInstance?.toJSON ? statInstance.toJSON() : statInstance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                var start_date = ClassUserStat._toJsDate(data.start_date);
                var end_date = ClassUserStat._toJsDate(data.end_date);
                var next_trying_date = ClassUserStat._toJsDate(data.next_trying_date);
                var created_time = ClassUserStat._toJsDate(data.created_time);
                var last_edit_time = ClassUserStat._toJsDate(data.last_edit_time);

                const score = data.answers?.filter?.(item => item.uid_answer === item.uid_proposal)?.length || 0;
                const duration = parseInt((end_date.getTime() - start_date.getTime()) / 1000);
                const percentage = (score / data.answers?.length);
                var status = "";
                if (percentage >= 0.8) {
                    status = ClassUserStat.STATUS.EXCELLENT;
                } else if (percentage >= 0.6) {
                    status = ClassUserStat.STATUS.GOOD;
                } else if (percentage >= 0.25) {
                    status = ClassUserStat.STATUS.TO_IMPROVE;
                } else {
                    status = ClassUserStat.STATUS.NOT_GOOD;
                }
                /*
                    EXCELLENT: 'excellent', // bureautique
        GOOD: 'good',
        TO_IMPROVE: 'to-improve',
        NOT_GOOD: 'not-good',
                */
                //console.log("fromFirestore", score)
                return ClassUserStat.makeUserStat(uid, { ...data, score, start_date, end_date, duration, status, next_trying_date, created_time, last_edit_time });
            },
        };
    }

    // ---------- Helpers Firestore ----------
    static async alreadyExist(_uid) {
        const q = query(
            collection(firestore, ClassRoom.COLLECTION),
            where("uid", "==", _uid)
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static async alreadyExistByName(_name) {
        const q = query(
            collection(firestore, ClassRoom.COLLECTION),
            where("name_normalized", "==", this._name.toLowerCase().trim())
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static colRef(uid_user = "") {
        if (!uid_user) return;
        return collection(firestore, ClassUser.COLLECTION, uid_user, this.COLLECTION).withConverter(this.converter);
    }

    static docRef(uid_user = "", id) {
        if (!uid_user || !id) return;
        return doc(firestore, ClassUser.COLLECTION, uid_user, this.COLLECTION, id).withConverter(this.converter);
    }

    static async count(uid_user = "", constraints = []) {
        if (!uid_user) return;
        //const finalConstraints = uid_user ? [where("uid_user", "==", uid_user), ...constraints] : constraints;
        const q = query(this.colRef(uid_user), ...constraints);        //const qSnap = await getDocs(q);
        //const coll = collection(firestore, ClassUser.COLLECTION);
        //const coll = this.colRef();
        const snap = await getCountFromServer(q);
        return snap.data().count; // -> nombre total
    }

    // Récupérer un module par id
    static indexOf(array = [], uid) {
        if (array.length === 0 || !(array[0] instanceof ClassRoom)) {
            return -1;
        }
        if (!(array[0] instanceof ClassRoom)) {
            console.log("ERRROR is not class Room")
            return -1;
        }
        const indexof = array.findIndex(item => item.uid === uid);
        return indexof;
    }

    static async get(id) {
        /*
        const snap = await getDoc(this.docRef(id));
        if (snap.exists()) {
            const data = snap.data();
            return (data);
        }

        return null; // -> ClassModule | null
        */
        const q = query(
            collectionGroup(firestore, this.COLLECTION).withConverter(this.converter),
            where("uid", "==", id),
            limit(1)
        );
        const snaps = await getDocs(q);
        if (snaps.empty) return null;

        const docSnap = snaps.docs[0];
        const stat = docSnap.data();
        return stat;
    }
    async getStat(uid_user = "", uid_chapter) {
        try {
            const q = query(
                collectionGroup(firestore, ClassUserStat.COLLECTION).withConverter(ClassUserStat.converter),
                where("uid_user", "==", this._uid_user),
                where("uid_lesson", "==", this._uid_lesson),
                where("uid_chapter", "==", this._uid_chapter),
                limit(1)
            );

            const snaps = await getDocs(q);
            if (snaps.empty) return null;
            const docSnap = snaps.docs[0];
            const stat = docSnap.data();

            return stat;
        } catch (error) {
            console.log("ERRRROR", error);
            return null;
        }
    }
    async getStats(uid_user = "", uid_chapter) {
        try {
            const q = query(
                collectionGroup(firestore, ClassUserStat.COLLECTION).withConverter(ClassUserStat.converter),
                where("uid_user", "==", this._uid_user),
                where("uid_lesson", "==", this._uid_lesson),
                where("uid_chapter", "==", this._uid_chapter),
                //limit(1)
            );

            const snaps = await getDocs(q);
            if (snaps.empty) return null;
            const docs = snaps.docs;
            const stats = [];
            for (const doc of docs) {
                const stat = doc.data();
                //const score = stat.answers.filter?.(item => item.uid_answer === item.uid_proposal)?.length || 0;
                stats.push(stat);
            }
            //console.log("all stats class", stats)
            return stats;
        } catch (error) {
            console.log("ERRRROR", error);
            return null;
        }
    }
    static async getByName(_name) {
        //const usersCol = collection(firestore, ClassUser.COLLECTION).withConverter(ClassUser.converter);
        const q = query(
            collection(firestore, ClassRoom.COLLECTION).withConverter(ClassRoom.converter),
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
    static async list(uid_user = "", constraints = []) {
        if (!uid_user) return;
        const finalConstraints = uid_user ? [where("uid_user", "==", uid_user), ...constraints] : constraints;
        const q = finalConstraints.length ? query(this.colRef(uid_user), ...constraints) : query(this.colRef(uid_user));
        const qSnap = await getDocs(q);
        return qSnap.docs.map(item => item.data());
    }
    // Créer un user (avec option timestamps serveur)
    createRoomName(idRoom = '', isNormalized = false) {
        var prefix = isNormalized ? "room" : "ROOM";

        return `${prefix}-${(idRoom).toString().padStart(2, '0')}`;;
    }
    // Créer un user (avec option timestamps serveur)
    async createFirestore() {
        const newRef = doc(this.constructor.colRef(this._uid_user)); // id auto
        const count = await this.constructor.count(this._uid_user) || 0;
        //const countRoom = await ClassRoom.count() || 0;
        const idStat = count + 1;
        this._uid = newRef.id;
        //this._uid_intern = idStat;
        //this._name = this.createRoomName(idStat);
        //this._name_normalized = this.createRoomName(idStat, true);
        //this._enabled = true;
        this._next_trying_date = this._next_trying_date ? this._next_trying_date : addDaysToDate(new Date(), this._chapter.quiz_delay_days || 30);
        this._created_time = new Date();
        this._last_edit_time = new Date();
        await setDoc(newRef, this.toJSON());
        return await this.constructor.get(newRef.id); // -> ClassModule
    }

    // Mettre à jour un module
    async updateFirestore(patch = {}) {
        try {
            const ref = this.constructor.docRef(this._uid_user, this._uid);
            const data = { ...patch, last_edit_time: new Date() };
            await updateDoc(ref, data, { merge: true });
            //console.log("UPDATE COMPLETED")
            return (await getDoc(ref)).data(); // -> ClassModule
        } catch (e) {
            return null;
        }
    }

    // Supprimer un module
    async remove() {
        await deleteDoc(this.constructor.docRef(this._uid));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await this.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchFromFirestoreNeme(_name) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await ClassRoom.getByName(_name);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchListFromFirestore(uid_user = "", constraints = []) {
        try {
            if (!uid) throw new Error("UID is required to get module.");
            return await this.list(uid_user, constraints);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
}