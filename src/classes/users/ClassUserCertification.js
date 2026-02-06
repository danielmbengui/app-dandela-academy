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
import { ClassUser } from "./ClassUser";
import { addDaysToDate } from "@/contexts/functions";
import { PAGE_STATS } from "@/contexts/constants/constants_pages";
import { ClassUserStat } from "./ClassUserStat";

export class ClassUserCertification {
    static COLLECTION = "CERTIFICATIONS";
    static NS_COLLECTION = `classes/certification`;
    static VALIDITY_YEARS = 10;
    static VALIDITY_DAYS = ClassUserCertification.VALIDITY_YEARS * 365;
    static CERTIFICATE_REFERENCE_PREFIX = "CERT";

    static FORMAT = Object.freeze({
        ONLINE: 'online', // bureautique
        ONSITE: 'onsite', // bureautique
        HYBRID: 'hybrid',
    });
    static STATUS = Object.freeze({
        CERTIFIED: 'certified', // bureautique
        EXCELLENT: 'onsite', // bureautique
        HYBRID: 'hybrid',
    });
    static STATUS_STATS = ClassUserStat.STATUS;
    static ALL_STATUS_STATS = ClassUserStat.ALL_STATUS;
    static STATUS_CONFIG_STATS = ClassUserStat.STATUS_CONFIG;

    constructor({
        uid = "",
        code = "",
        uid_user = "",
        uid_lesson = "",
        user = null,
        lesson = null,
        reference = "",
        status = "",
        is_excellent = false,
        format = "",
        score = 0,
        count_questions = 0,
        percentage = 0,
        stats = [],
        obtained_date = null,
        expires_date = null,
        created_time = null,
    } = {}) {
        this._uid = uid;
        this._code = code;
        this._uid_user = uid_user;
        this._uid_lesson = uid_lesson;
        this._user = user;
        this._lesson = lesson;
        this._reference = reference;
        this._status = status;
        this._is_excellent = is_excellent;
        this._format = format;
        this._score = score;
        this._count_questions = count_questions;
        this._percentage = percentage;
        this._stats = Array.isArray(stats) ? stats : [];
        this._obtained_date = obtained_date;
        this._expires_date = expires_date;
        this._created_time = created_time;
    }

    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }

    get uid() { return this._uid; }
    set uid(v) { this._uid = v; this._touchLastEdit(); }

    get code() { return this._code; }
    set code(v) { this._code = v; this._touchLastEdit(); }

    get uid_user() { return this._uid_user; }
    set uid_user(v) { this._uid_user = v; this._touchLastEdit(); }

    get uid_lesson() { return this._uid_lesson; }
    set uid_lesson(v) { this._uid_lesson = v; this._touchLastEdit(); }

    get user() { return this._user; }
    set user(v) { this._user = v; this._touchLastEdit(); }

    get lesson() { return this._lesson; }
    set lesson(v) { this._lesson = v; this._touchLastEdit(); }

    get reference() { return this._reference; }
    set reference(v) { this._reference = v; this._touchLastEdit(); }

    get status() { return this._status; }
    set status(v) { this._status = v; this._touchLastEdit(); }

    get is_excellent() { return this._is_excellent; }
    set is_excellent(v) { this._is_excellent = v; this._touchLastEdit(); }

    get format() { return this._format; }
    set format(v) { this._format = v; this._touchLastEdit(); }

    get score() { return this._score; }
    set score(v) { this._score = v; this._touchLastEdit(); }

    get count_questions() { return this._count_questions; }
    set count_questions(v) { this._count_questions = v; this._touchLastEdit(); }

    get percentage() { return this._percentage; }
    set percentage(v) { this._percentage = v; this._touchLastEdit(); }

    /** Meilleurs résultats par chapitre (tableau de ClassUserStat, rempli par le CertifProvider). */
    get stats() { return this._stats; }
    set stats(v) { this._stats = Array.isArray(v) ? v : []; this._touchLastEdit(); }

    get obtained_date() { return this._obtained_date; }
    set obtained_date(v) { this._obtained_date = v; this._touchLastEdit(); }

    get expires_date() { return this._expires_date; }
    set expires_date(v) { this._expires_date = v; this._touchLastEdit(); }

    get created_time() { return this._created_time; }
    set created_time(v) { this._created_time = v; this._touchLastEdit(); }


    // --- Serialization ---
    toJSON() {
        return CertificationSerializer.toJSON(this);
    }
    clone() {
        return CertificationSerializer.fromJSON({
            ...this.toJSON(),
            user: this._user,
            lesson: this._lesson,
            stats: this._stats?.length ? [...this._stats] : [],
        });
    }
    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
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
    static makeUserCertification(uid, data = {}) {
        return new ClassUserCertification({ uid, ...data });
    }
    static calculatePercentage(score, count_questions) {
        if (count_questions === 0) return 0;
        return (score / count_questions) * 100;
    }
    static getStatusFromPercentage(percentage) {
        if (percentage >= 100) return ClassUserCertification.STATUS_STATS.MAX;
        if (percentage >= 85) return ClassUserCertification.STATUS_STATS.EXCELLENT;
        if (percentage >= 70) return ClassUserCertification.STATUS_STATS.GOOD;
        if (percentage >= 50) return ClassUserCertification.STATUS_STATS.TO_IMPROVE;
        return ClassUserCertification.STATUS_STATS.NOT_GOOD;
    }
    static countQuestions(stats = []) {
        if (!stats || stats.length === 0) return 0;
        return stats.reduce((acc, stat) => acc + stat.answers.length, 0);
    }
    static countScore(stats = []) {
        if (!stats || stats.length === 0) return 0;
        return stats.reduce((acc, stat) => acc + stat.score, 0);
    }
    static get converter() {
        return {
            toFirestore(certifInstance) {
                // chaque classe a un .toJSON() propre
                return certifInstance?.toJSON ? certifInstance.toJSON() : certifInstance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                const created_time = ClassUserCertification._toJsDate(data.created_time);
                const obtained_date = ClassUserCertification._toJsDate(data.obtained_date);
                const expires_date = ClassUserCertification._toJsDate(data.expires_date);
                const percentage = ClassUserCertification.calculatePercentage(data.score, data.count_questions);
                const status = ClassUserCertification.getStatusFromPercentage(percentage);
                const is_excellent = status === ClassUserCertification.STATUS_STATS.EXCELLENT || status === ClassUserCertification.STATUS_STATS.MAX;
                return ClassUserCertification.makeUserCertification(uid, { ...data, percentage, status, is_excellent, created_time, obtained_date, expires_date });
            },
        };
    }
    static colRef() {
        return collectionGroup(firestore, this.COLLECTION).withConverter(this.converter);
    }
    static colRefForUser(uidUser = "") {
        if (!uidUser) return null;
        return collection(firestore, ClassUser.COLLECTION, uidUser, this.COLLECTION).withConverter(this.converter);
    }
    static docRef(uidUser = "", id = "") {
        if (!uidUser || !id) return;
        return doc(firestore, ClassUser.COLLECTION, uidUser, this.COLLECTION, id).withConverter(this.converter);
    }
    static async count(uidUser = "", constraints = []) {
        try {
            if (uidUser) {
                const col = this.colRefForUser(uidUser);
                if (!col) return 0;
                const q = constraints.length ? query(col, ...constraints) : query(col);
                const snap = await getCountFromServer(q);
                return snap.data().count;
            }
            const finalConstraints = [...constraints];
            const q = query(this.colRef(), ...finalConstraints);
            const snap = await getCountFromServer(q);
            return snap.data().count;
        } catch (error) {
            console.log("Errror", error);
        }
    }
    static indexOf(array = [], uid) {
        if (array.length === 0 || !(array[0] instanceof ClassUserCertification)) {
            return -1;
        }
        if (!(array[0] instanceof ClassUserCertification)) {
            return -1;
        }
        const indexof = array.findIndex(item => item.uid === uid);
        return indexof;
    }
    static async get(id) {
        const q = query(
            collectionGroup(firestore, this.COLLECTION).withConverter(this.converter),
            where("uid", "==", id),
            limit(1)
        );
        const snaps = await getDocs(q);
        if (snaps.empty) return null;
        const docSnap = snaps.docs[0];
        const certification = docSnap.data();
        return certification;
    }
    static async list(constraints = []) {
        const ref = ClassUserCertification.colRef(); // par ex.;
        const q = constraints.length ? query(ref, constraints) : query(ref);
        const qSnap = await getDocs(q);
        if (qSnap.size === 0) return [];
        const certifications = qSnap.docs.map(docSnap => {
            const certification = docSnap.data();
            return certification;
        });
        return certifications || [];
    }
    createFirestoreDoc() {
        try {
            const colRef = collection(
                firestore,
                ClassUser.COLLECTION,
                this._uid_user,
                this.constructor.COLLECTION
            );
            const newRef = doc(colRef).withConverter(this.constructor.converter);
            return newRef;
        } catch (error) {
            console.log("ERRRRROROOOORO", error);
            return null;
        }
    }
    createFirestoreDocUid() {
        try {
            const colRef = collection(
                firestore,
                ClassUser.COLLECTION,
                this._uid_user,
                this.constructor.COLLECTION
            );
            const newRef = doc(colRef).withConverter(this.constructor.converter);
            return newRef.id;
        } catch (error) {
            console.log("ERRRRROROOOORO", error);
            return null;
        }
    }
    static createReference(code = "", uidUser = "", uidLesson = "", uid = "") {
        const today = new Date();
        return `${ClassUserCertification.CERTIFICATE_REFERENCE_PREFIX}-${uidUser?.slice(0, 8)}-${code}-${uidLesson?.slice(0, 8)}-${today.getFullYear()}-${uid?.slice(0, 8)}`;
    }
    async createFirestore() {
        try {
            let newRef = null;
            if (this._uid) {
                newRef = this.constructor.docRef(this._uid_user, this._uid);
            } else {
                newRef = this.createFirestoreDoc();
            }
            this._uid = newRef.id;
            this._created_time = new Date();
            this._obtained_date = new Date();
            this._expires_date = addDaysToDate(new Date(), ClassUserCertification.VALIDITY_DAYS);
            if (!this._reference) {
                this._reference = this.constructor.createReference(this._code ?? "", this._uid_user, this._uid_lesson, this._uid);
            }
            await setDoc(newRef, this, { merge: true });
            return this.constructor.makeUserCertification(this._uid, this.toJSON());
        } catch (error) {
            console.error("ClassUserCertification.createFirestore", error);
            return null;
        }
    }
    async updateFirestore(patch = {}) {
        try {
            const ref = this.constructor.docRef(this._uid_user, this._uid);
            //this._last_edit_time = new Date();
            if (patch && Object.keys(patch).length) {
                this.update(patch);
            }
            await setDoc(ref, this, { merge: true });
            return this.constructor.makeUserCertification(this._uid, this.toJSON());
        } catch (e) {
            console.error("ClassUserCertification.updateFirestore", e);
            return null;
        }
    }
    static async remove(id) {
        await deleteDoc(ClassUserCertification.docRef(id));
        return true;
    }
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get CERTIFICATION.");
            return await ClassUserCertification.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchListFromFirestore(constraints = []) {
        try {
            return await this.list(constraints);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }

}
class CertificationSerializer {
    static fieldsToRemove = [
        "lesson",
        "user",
        "percentage",
        "status",
        "is_excellent",
        "percentage",
        "stats", // tableau ClassUserStat, rempli côté provider (non persisté en Firestore)
    ];
    static toJSON(chapter) {
        const fields = [...this.fieldsToRemove];
        const out = { ...chapter };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v])
        );
        for (const field of fields) {
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
        return ClassUserCertification.makeUserCertification(cleaned.uid ?? "", cleaned);
    }
}