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
import { PAGE_STATS } from "@/contexts/constants/constants_pages";

export class ClassUserStat {
    static COLLECTION = "STATS";
    static NS_COLLECTION = `classes/stat`;
    static VIEW_LIST = "view.list";
    static VIEW_EVOLUTION = "view.evolution";
    static VIEW_COMPARE = "view.compare";
    static VIEW_MODE_SCORE = "view.score";
    static VIEW_MODE_AVERAGE = "view.average";
    static GRAPH_COLORS = [
        { bg: "--primary-shadow-xs", border: "--primary", bgHover: "--primary" },
        { bg: "--success-shadow-xs", border: "--success", bgHover: "--success" },
        { bg: "--warning-shadow-xs", border: "--warning", bgHover: "--warning" },
        { bg: "--error-shadow-xs", border: "--error", bgHover: "--error" },
        { bg: "--winner-shadow-xs", border: "--winner", bgHover: "--winner" },
        //{ bg: "--success-shadow-xs", border: "--success", bgHover: "--success" },
        //{ bg: "--success-shadow-xs", border: "--success", bgHover: "--success" },
        //{ bg: "--success-shadow-xs", border: "--success", bgHover: "--success" },
        { bg: "rgba(217,70,239,0.15)", border: "#D946EF", bgHover: "#D946EF" }, // fuchsia
        { bg: "rgba(6,182,212,0.15)",  border: "#06B6D4", bgHover: "#06B6D4" }, // cyan

        { bg: "rgba(14,165,233,0.15)", border: "#0EA5E9", bgHover: "#0EA5E9" }, // sky
        { bg: "rgba(20,184,166,0.15)", border: "#14B8A6", bgHover: "#14B8A6" }, // teal
        { bg: "rgba(236,72,153,0.15)", border: "#EC4899", bgHover: "#EC4899" }, // pink
        { bg: "rgba(249,115,22,0.15)", border: "#F97316", bgHover: "#F97316" }, // orange
        { bg: "rgba(132,204,22,0.15)", border: "#84CC16", bgHover: "#84CC16" }, // lime

        { bg: "rgba(99,102,241,0.15)", border: "#6366F1", bgHover: "#6366F1" }, // indigo

        { bg: "rgba(251,191,36,0.15)", border: "#FBBF24", bgHover: "#FBBF24" }, // yellow
        { bg: "rgba(16,185,129,0.15)", border: "#10B981", bgHover: "#10B981" }, // emerald

        { bg: "rgba(59,130,246,0.15)", border: "#3B82F6", bgHover: "#3B82F6" }, // blue
        { bg: "rgba(34,197,94,0.15)",  border: "#22C55E", bgHover: "#22C55E" }, // green
        { bg: "rgba(245,158,11,0.15)", border: "#F59E0B", bgHover: "#F59E0B" }, // amber
        { bg: "rgba(239,68,68,0.15)",  border: "#EF4444", bgHover: "#EF4444" }, // red
        { bg: "rgba(168,85,247,0.15)", border: "#A855F7", bgHover: "#A855F7" }, // purple
      

      

      
        { bg: "rgba(244,63,94,0.15)",  border: "#F43F5E", bgHover: "#F43F5E" }, // rose
        { bg: "rgba(139,92,246,0.15)", border: "#8B5CF6", bgHover: "#8B5CF6" }, // violet
        { bg: "rgba(2,132,199,0.15)",  border: "#0284C7", bgHover: "#0284C7" }, // blue dark
        { bg: "rgba(190,24,93,0.15)",  border: "#BE185D", bgHover: "#BE185D" }, // pink dark
        { bg: "rgba(71,85,105,0.15)",  border: "#475569", bgHover: "#475569" }, // slate
      
        { bg: "rgba(120,113,108,0.15)", border: "#78716C", bgHover: "#78716C" }, // stone
        { bg: "rgba(163,163,163,0.15)", border: "#A3A3A3", bgHover: "#A3A3A3" }, // neutral
        { bg: "rgba(82,82,91,0.15)",    border: "#52525B", bgHover: "#52525B" }, // zinc
        { bg: "rgba(107,114,128,0.15)", border: "#6B7280", bgHover: "#6B7280" }, // gray
        { bg: "rgba(37,99,235,0.15)",   border: "#2563EB", bgHover: "#2563EB" }, // blue deep
      
        { bg: "rgba(22,163,74,0.15)",   border: "#16A34A", bgHover: "#16A34A" }, // green dark
        { bg: "rgba(202,138,4,0.15)",   border: "#CA8A04", bgHover: "#CA8A04" }, // yellow dark
        { bg: "rgba(185,28,28,0.15)",   border: "#B91C1C", bgHover: "#B91C1C" }, // red dark
        { bg: "rgba(120,53,15,0.15)",   border: "#78350F", bgHover: "#78350F" }, // brown
        { bg: "rgba(0,0,0,0.15)",       border: "#000000", bgHover: "#000000" }, // black
        //"--success",
        //"--error",
        //"--warning",
        "--info",
        "--winner",
        "--bronze",
    ];
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
            color: "var(--gold-dark)",
            border: "var(--gold)",
            background: "var(--gold-shadow-xs)",
            background_icon: "var(--gold-shadow)",
            background_bubble: "var(--gold-shadow-xs)",
            color_icon: "var(--gold)",
            border_icon: "var(--gold-shadow)",
            background_bar: "var(--gold)",
            glow: "var(--gold-shadow)",

        },
        excellent: {
            label: "excellent", // "Inscriptions ouvertes",
            color: "var(--success-dark)",
            border: "var(--success)",
            background: "var(--success-shadow-xs)",
            background_icon: "var(--success-shadow)",
            background_bubble: "var(--success-shadow-xs)",
            color_icon: "var(--success)",
            border_icon: "var(--success-shadow-sm)",
            background_bar: "var(--success)",
            glow: "var(--success-shadow)",
        },
        good: {
            label: "good", // "Inscriptions ouvertes",
            color: "var(--info-dark)",
            border: "var(--info)",
            background: "var(--info-shadow-xs)",
            background_icon: "var(--info-shadow)",
            background_bubble: "var(--info-shadow-xs)",
            color_icon: "var(--info)",
            border_icon: "var(--info-shadow-sm)",
            background_bar: "var(--info)",
            glow: "var(--info-shadow)",
        },
        ['to-improve']: {
            label: "to-improve", // "Inscriptions ouvertes",
            color: "var(--warning-dark)",
            border: "var(--warning)",
            background: "var(--warning-shadow-xs)",
            background_icon: "var(--warning-shadow)",
            background_bubble: "var(--warning-shadow-xs)",
            color_icon: "var(--warning)",
            border_icon: "var(--warning-shadow-sm)",
            background_bar: "var(--warning)",
            glow: "var(--warning-shadow)",
        },
        ['not-good']: {
            label: "not-good", // "Inscriptions ouvertes",
            color: "var(--error-dark)",
            border: "var(--error)",
            background: "var(--error-shadow-xs)",
            background_icon: "var(--error-shadow)",
            background_bubble: "var(--error-shadow-xs)",
            color_icon: "var(--error)",
            border_icon: "var(--error-shadow-sm)",
            background_bar: "var(--error)",
            glow: "var(--error-shadow)",
        },
        average: {
            label: "good", // "Inscriptions ouvertes",
            color: "var(--primary-dark)",
            border: "var(--primary)",
            background: "var(--primary-shadow-xs)",
            background_icon: "var(--primary-shadow)",
            background_bubble: "var(--primary-shadow-xs)",
            color_icon: "var(--primary)",
            border_icon: "var(--primary-shadow-sm)",
            background_bar: "var(--primary)",
            glow: "var(--primary-shadow)",
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

    static createUrl(uidLesson="",uidChapter="", uidStat="") {
        var url = PAGE_STATS;
        if(uidLesson && uidChapter && uidStat) {
            url += `/${uidLesson}/${uidChapter}/${uidStat}`;
        } else if(uidLesson && uidChapter) {
            url += `/${uidLesson}/${uidChapter}`;
        } else if(uidLesson) {
            url += `/${uidLesson}`;
        }
        return url;
    }

    static getStatsByDate(stats = [], date = null) {
        const dateString = date.toString();
        if (!(new Date(dateString) instanceof Date)) return [];
        const startDay = new Date(dateString);
        startDay.setHours(0);
        startDay.setMinutes(0);
        startDay.setSeconds(0);
        const endDay = new Date(dateString);
        endDay.setHours(23);
        endDay.setMinutes(59);
        endDay.setSeconds(59);
        return stats.filter(s => s.end_date.getTime() >= startDay.getTime() && s.end_date <= endDay.getTime());
    }
    static getStatsByStatus(stats = [], status = "") {
        if (!status || status === "") return [];
        return stats.filter(s => s.status === status);
    }

    static getStatusFromPercentage(percentage) {
        if (percentage === 1) {
            return ClassUserStat.STATUS.MAX;
        } else if (percentage >= 0.8) {
            return ClassUserStat.STATUS.EXCELLENT;
        } else if (percentage >= 0.6) {
            return ClassUserStat.STATUS.GOOD;
        } else if (percentage >= 0.25) {
            return ClassUserStat.STATUS.TO_IMPROVE;
        } else {
            return ClassUserStat.STATUS.NOT_GOOD;
        }
    }
    static getPercentageColor(percentage) {
        if (percentage >= 1) {
            return this.STATUS_CONFIG[ClassUserStat.STATUS.MAX];
        } else if (percentage >= 0.8) {
            return this.STATUS_CONFIG[ClassUserStat.STATUS.EXCELLENT];
        } else if (percentage >= 0.6) {
            return this.STATUS_CONFIG[ClassUserStat.STATUS.GOOD];
        } else if (percentage >= 0.25) {
            return this.STATUS_CONFIG[ClassUserStat.STATUS.TO_IMPROVE];
        } else {
            return this.STATUS_CONFIG[ClassUserStat.STATUS.NOT_GOOD];
        }
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
                const status = ClassUserStat.getStatusFromPercentage(percentage);

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