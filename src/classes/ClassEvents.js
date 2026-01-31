// classes/ClassEvents.js
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
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { firestore } from "@/contexts/firebase/config";

export class ClassEvents {
    static COLLECTION = "EVENTS";
    static COLLECTION_TRANSLATE = "i18n";
    static NS_COLLECTION = `classes/event`;
    static ERROR = Object.freeze({
        ALREADY_EXISTS: 'already-exists',
        UNKNOWN: 'unknown',
    });
    static STATUS = Object.freeze({
        OPEN: 'open',
        FULL: 'full',
        FINISHED: 'finished',
        DRAFT: 'draft',
        UNKNOWN: 'unknown',
    });
    static STATUS_CONFIG = Object.freeze({
        open: {
            label: "open",
            color: "var(--session-status-open)",
            glow: "var(--session-status-open-glow)",
        },
        full: {
            label: "full",
            color: "var(--session-status-full)",
            glow: "var(--session-status-full-glow)",
        },
        finished: {
            label: "finished",
            color: "var(--session-status-finished)",
            glow: "var(--session-status-finished-glow)",
        },
        draft: {
            label: "draft",
            color: "var(--session-status-draft)",
            glow: "var(--session-status-draft-glow)",
        },
    });
    static ALL_STATUSES = Object.values(ClassEvents.STATUS).filter(s => s !== ClassEvents.STATUS.UNKNOWN);

    constructor({
        uid = "",
        uid_intern = "",
        title = "",
        description = "",
        translate = {},
        start_date = null,
        end_date = null,
        location = "",
        max_attendees = 0,
        subscribers = [],
        status = ClassEvents.STATUS.DRAFT,
        photo_url = "",
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        this._uid = uid;
        this._uid_intern = uid_intern;
        this._title = title;
        this._description = description;
        this._translate = translate || {};
        this._start_date = start_date;
        this._end_date = end_date;
        this._location = location;
        this._max_attendees = Math.max(0, parseInt(max_attendees) || 0);
        this._subscribers = Array.isArray(subscribers) ? [...subscribers] : [];
        this._status = status;
        this._photo_url = photo_url;
        this._created_time = created_time;
        this._last_edit_time = last_edit_time;
    }

    get uid() { return this._uid; }
    set uid(value) { this._uid = value; }
    get uid_intern() { return this._uid_intern; }
    set uid_intern(value) { this._uid_intern = value; }
    get title() { return this._title; }
    set title(value) { this._title = value; }
    get description() { return this._description; }
    set description(value) { this._description = value; }
    get translate() { return this._translate; }
    set translate(value) { this._translate = value || {}; }
    get start_date() { return this._start_date; }
    set start_date(value) { this._start_date = value; }
    get end_date() { return this._end_date; }
    set end_date(value) { this._end_date = value; }
    get location() { return this._location; }
    set location(value) { this._location = value; }
    get max_attendees() { return this._max_attendees; }
    set max_attendees(value) { this._max_attendees = Math.max(0, parseInt(value) || 0); }
    get subscribers() { return this._subscribers; }
    set subscribers(value) { this._subscribers = Array.isArray(value) ? [...value] : []; }
    get status() { return this._status; }
    set status(value) { this._status = value; }
    get photo_url() { return this._photo_url; }
    set photo_url(value) { this._photo_url = value; }
    get created_time() { return this._created_time; }
    set created_time(value) { this._created_time = value; }
    get last_edit_time() { return this._last_edit_time; }
    set last_edit_time(value) { this._last_edit_time = value; }

    _touchLastEdit() {
        this._last_edit_time = new Date();
    }

    /** Inscrit un élève (uid) à l'événement. Retourne true si inscrit, false si déjà inscrit ou complet. */
    subscribeStudent(uid = "") {
        if (!uid) return false;
        if (this.isFull()) return false;
        if (this._subscribers.includes(uid)) return false;
        this._subscribers.push(uid);
        this._touchLastEdit();
        this._recomputeStatus();
        return true;
    }

    /** Désinscrit un élève. */
    unsubscribeStudent(uid = "") {
        if (!uid) return false;
        const before = this._subscribers.length;
        this._subscribers = this._subscribers.filter(id => id !== uid);
        if (this._subscribers.length !== before) {
            this._touchLastEdit();
            this._recomputeStatus();
            return true;
        }
        return false;
    }

    isSubscribed(uid = "") {
        return !!uid && this._subscribers.includes(uid);
    }

    countSubscribers() {
        return this._subscribers.length;
    }

    isFull() {
        if (this._max_attendees <= 0) return false;
        return this._subscribers.length >= this._max_attendees;
    }

    seatsLeft() {
        if (this._max_attendees <= 0) return Infinity;
        return Math.max(0, this._max_attendees - this._subscribers.length);
    }

    _recomputeStatus() {
        if (this._status === ClassEvents.STATUS.FINISHED || this._status === ClassEvents.STATUS.DRAFT) return;
        if (this.isFull()) this._status = ClassEvents.STATUS.FULL;
        else this._status = ClassEvents.STATUS.OPEN;
    }

    toJSON() {
        const out = { ...this };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v])
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
        return new ClassEvents(this.toJSON());
    }

    // ---------- Date helpers ----------
    static _toJsDate(v) {
        if (!v) return null;
        if (v instanceof Date) return v;
        if (v && typeof v.toDate === "function") return v.toDate();
        if (v && typeof v.seconds === "number") return new Date(v.seconds * 1000);
        return null;
    }

    static makeInstance(uid, data = {}) {
        return new ClassEvents({ uid, ...data });
    }

    static get converter() {
        return {
            toFirestore(instance) {
                return instance?.toJSON ? instance.toJSON() : instance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                const start_date = ClassEvents._toJsDate(data.start_date);
                const end_date = ClassEvents._toJsDate(data.end_date);
                const created_time = ClassEvents._toJsDate(data.created_time);
                const last_edit_time = ClassEvents._toJsDate(data.last_edit_time);
                return ClassEvents.makeInstance(uid, {
                    ...data,
                    start_date,
                    end_date,
                    created_time,
                    last_edit_time,
                });
            },
        };
    }

    static colRef() {
        return collection(firestore, this.COLLECTION).withConverter(this.converter);
    }

    static docRef(id) {
        return doc(firestore, this.COLLECTION, id).withConverter(this.converter);
    }

    static async count(constraints = []) {
        const q = constraints.length ? query(this.colRef(), ...constraints) : query(this.colRef());
        const snap = await getCountFromServer(q);
        return snap.data().count;
    }

    static async get(id) {
        const snap = await getDoc(this.docRef(id));
        if (snap.exists()) return snap.data();
        return null;
    }

    static async list(constraints = []) {
        const q = constraints.length ? query(this.colRef(), ...constraints) : query(this.colRef());
        const qSnap = await getDocs(q);
        return qSnap.docs.map(d => d.data());
    }

    async createFirestore() {
        const newRef = doc(this.constructor.colRef());
        const count = await this.constructor.count() || 0;
        this._uid = newRef.id;
        this._uid_intern = count + 1;
        this._created_time = new Date();
        this._last_edit_time = new Date();
        this._recomputeStatus();
        await setDoc(newRef, this.toJSON());
        return this.constructor.makeInstance(this._uid, this.toJSON());
    }

    async updateFirestore() {
        try {
            const ref = this.constructor.docRef(this._uid);
            this._last_edit_time = new Date();
            this._recomputeStatus();
            await updateDoc(ref, this.toJSON(), { merge: true });
            return this.constructor.makeInstance(this._uid, this.toJSON());
        } catch (e) {
            console.error("ClassEvents updateFirestore", e.message);
            return null;
        }
    }

    /** Inscrit l'utilisateur uid à l'événement (mise à jour Firestore avec arrayUnion). */
    async subscribeStudentFirestore(uid) {
        if (!uid || this.isSubscribed(uid) || this.isFull()) return false;
        try {
            const ref = this.constructor.docRef(this._uid);
            await updateDoc(ref, {
                subscribers: arrayUnion(uid),
                last_edit_time: new Date(),
            });
            this._subscribers = [...this._subscribers, uid];
            this._recomputeStatus();
            return true;
        } catch (e) {
            console.error("ClassEvents subscribeStudentFirestore", e.message);
            return false;
        }
    }

    /** Désinscrit l'utilisateur uid. */
    async unsubscribeStudentFirestore(uid) {
        if (!uid || !this.isSubscribed(uid)) return false;
        try {
            const ref = this.constructor.docRef(this._uid);
            await updateDoc(ref, {
                subscribers: arrayRemove(uid),
                last_edit_time: new Date(),
            });
            this._subscribers = this._subscribers.filter(id => id !== uid);
            this._recomputeStatus();
            return true;
        } catch (e) {
            console.error("ClassEvents unsubscribeStudentFirestore", e.message);
            return false;
        }
    }

    async removeFirestore() {
        try {
            const ref = this.constructor.docRef(this._uid);
            await deleteDoc(ref);
            return true;
        } catch (e) {
            console.error("ClassEvents removeFirestore", e.message);
            return false;
        }
    }

    static async fetchFromFirestore(uid) {
        try {
            if (!uid) return null;
            return await this.get(uid);
        } catch (e) {
            console.error("ClassEvents fetchFromFirestore", e.message);
            return null;
        }
    }

    static async fetchListFromFirestore(constraints = []) {
        try {
            return await this.list(constraints);
        } catch (e) {
            console.error("ClassEvents fetchListFromFirestore", e.message);
            return [];
        }
    }
}
