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
    orderBy,
} from "firebase/firestore";
import { firestore } from "@/contexts/firebase/config";

export class ClassComputer {
    static ERROR = Object.freeze({
        ALREADY_EXISTS: 'already-exists',
        UNKNOWN: 'unknown',
    });
    static STATUS = Object.freeze({
        AVAILABLE: 'available',
        BUSY: 'busy',
        MAINTENANCE: 'maintenance',
        REPARATION: 'reparation',
        HS: 'hs',
        UNKNOWN: 'unknown',
    });
    static TYPE = Object.freeze({
        DESKTOP: 'desktop',
        MOBILE: 'mobile',
        TABLET: 'tablet',
        TV: 'tv',
        UNKNOWN: 'unknown',
    });
    static OPERATING_SYSTEM = Object.freeze({
        WINDOWS: 'windows',
        MACOS: 'macos',
        IOS: 'ios',
        LINUX: 'linux',
        UBUNTU: 'ubuntu',
        UNKNOWN: 'unknown',
    });
    static COLLECTION = "COMPUTERS";

    constructor({
        uid = "",
        uid_intern = "",
        uid_room = "",
        name = "",
        name_normalized = "",
        photo_url = "",
        enabled = false,
        status = ClassComputer.STATUS.HS,
        type = ClassComputer.TYPE.DESKTOP,
        last_update = new Date(),
        created_time = new Date(),
        last_edit_time = new Date(),
        updates = [],
    } = {}) {
        this._uid = uid;
        this._uid_intern = uid_intern;
        this._uid_room = uid_room;
        this._name = name;
        this._name_normalized = name_normalized;
        this._photo_url = photo_url;
        this._enabled = Boolean(enabled);

        this._status = this._normalizeStatus(status);
        this._type = this._normalizeType(type);

        this._last_update = last_update instanceof Date
            ? last_update
            : new Date(last_update);

        this._created_time = created_time instanceof Date
            ? created_time
            : new Date(created_time);

        this._last_edit_time = last_edit_time instanceof Date
            ? last_edit_time
            : new Date(last_edit_time);

        this._updates = Array.isArray(updates) ? updates.slice() : [];
    }

    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }

    _normalizeStatus(status) {
        return Object.values(ClassComputer.STATUS).includes(status)
            ? status
            : ClassComputer.STATUS.UNKNOWN;
    }

    _normalizeType(type) {
        return Object.values(ClassComputer.TYPE).includes(type)
            ? type
            : ClassComputer.TYPE.UNKNOWN;
    }
    // --- GETTERS ---

    get uid() {
        return this._uid;
    }

    get uid_intern() {
        return this._uid_intern;
    }

    get uid_room() {
        return this._uid_room;
    }

    get name() {
        return this._name;
    }

    get name_normalized() {
        return this._name_normalized;
    }
    get photo_url() {
        return this._photo_url;
    }

    get enabled() {
        return this._enabled;
    }

    get status() {
        return this._status;
    }

    get type() {
        return this._type;
    }

    get last_update() {
        return this._last_update;
    }

    get created_time() {
        return this._created_time;
    }

    get last_edit_time() {
        return this._last_edit_time;
    }

    get updates() {
        // copie défensive
        return this._updates.slice();
    }

    // --- SETTERS ---

    set uid(value) {
        this._uid = value;
        this._touchLastEdit();
    }

    set uid_intern(value) {
        this._uid_intern = value;
        this._touchLastEdit();
    }

    set uid_room(value) {
        this._uid_room = value;
        this._touchLastEdit();
    }

    set name(value) {
        this._name = value;
        this._touchLastEdit();
    }

    set name_normalized(value) {
        this._name_normalized = value;
        this._touchLastEdit();
    }
    set photo_url(value) {
        this._photo_url = value;
        this._touchLastEdit();
    }

    set enabled(value) {
        this._enabled = Boolean(value);
        this._touchLastEdit();
    }

    set status(value) {
        this._status = this._normalizeStatus(value);
        this._touchLastEdit();
    }

    set type(value) {
        this._type = this._normalizeType(value);
        this._touchLastEdit();
    }

    set last_update(value) {
        this._last_update = value instanceof Date ? value : new Date(value);
        this._touchLastEdit();
    }

    set created_time(value) {
        this._created_time = value instanceof Date ? value : new Date(value);
        // on ne touche pas last_edit_time ici
    }

    set last_edit_time(value) {
        this._last_edit_time = value instanceof Date ? value : new Date(value);
    }

    set updates(value) {
        this._updates = Array.isArray(value) ? value.slice() : [];
        this._touchLastEdit();
    }


    // --- GETTERS ---

    // --- SETTERS ---

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
        return ClassComputer.makeUserInstance(this._uid, this.toJSON());
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
    static makeUserInstance(uid, data = {}) {
        return new ClassComputer({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(schoolInstance) {
                // chaque classe a un .toJSON() propre
                return schoolInstance?.toJSON ? schoolInstance.toJSON() : schoolInstance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                var _created_time = ClassComputer._toJsDate(data.created_time);
                var _last_edit_time = ClassComputer._toJsDate(data.last_edit_time);
                return ClassComputer.makeUserInstance(uid, { ...data, created_time: _created_time, last_edit_time: _last_edit_time });
            },
        };
    }

    // ---------- Helpers Firestore ----------
    static async alreadyExist(_uid) {
        const q = query(
            collection(firestore, ClassComputer.COLLECTION),
            where("uid", "==", _uid)
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static async alreadyExistByName(_name) {
        const q = query(
            collection(firestore, ClassComputer.COLLECTION),
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
            collection(firestore, ClassComputer.COLLECTION).withConverter(ClassComputer.converter),
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
        const q = constraints.length ? query(this.colRef(), [...constraints]) : query(this.colRef());
        const qSnap = await getDocs(q);
        return qSnap.docs.map(item => item.data());
    }

    // Créer un user (avec option timestamps serveur)
    static async create(data = {}) {
        const newRef = doc(this.colRef()); // id auto
        //data.uid = newRef.id;
        const model = data instanceof ClassComputer ? data : new ClassComputer({ ...data });
        //model.uid = newRef.id;()
        //console.log("REEEF ID", newRef, model.toJSON());
        const countComputer = await ClassComputer.count() || 0;
        const idComputer = countComputer + 1;
        const uid = newRef.id;
        const uid_intern = idComputer;
        const created_time = model.created_time;
        const last_edit_time = new Date();
        const path = { ...model.toJSON(), uid, uid_intern,created_time, last_edit_time };
        await setDoc(newRef, path);
        return new ClassComputer(path); // -> ClassModule
    }

    // Mettre à jour un module
    static async update(id, patch = {}) {
        try {
            const ref = ClassComputer.docRef(id);
            const data = { ...patch, last_edit_time: new Date() };
            await updateDoc(ref, data, { merge: true });
            //console.log("UPDATE COMPLETED")
            return (await getDoc(ref)).data(); // -> ClassModule
        } catch (e) {
            return null;
        }
    }

    // Supprimer un module
    static async remove(id) {
        await deleteDoc(ClassComputer.docRef(id));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await ClassComputer.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchFromFirestoreNeme(_name) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await ClassComputer.getByName(_name);
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