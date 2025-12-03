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

export class ClassSchool {
    static ERROR = Object.freeze({
        ALREADY_EXISTS: 'already-exists',
        UNKNOWN: 'unknown',
    });
    static COLLECTION = "SCHOOLS";

    constructor({
        uid = "",
        uid_intern = "",
        name = "",
        name_normalized = "",
        photo_url = "",
        address = "",
        schedule = [
            { is_open: true, open_hour: 8, close_hour: 18 }, // lundi
            { is_open: true, open_hour: 8, close_hour: 18 },
            { is_open: true, open_hour: 8, close_hour: 18 },
            { is_open: true, open_hour: 8, close_hour: 18 },
            { is_open: true, open_hour: 8, close_hour: 18 },
            { is_open: true, open_hour: 8, close_hour: 12 },
            { is_open: false, open_hour: 0, close_hour: 0 }, // dimanche
        ],
        enabled = false,
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        this._uid = uid;
        this._uid_intern = uid_intern;
        this._name = name;
        this._name_normalized = name_normalized;
        this._photo_url = photo_url;
        this._address = address;
        this._schedule = this._normalizeSchedule(schedule);
        this._enabled = Boolean(enabled);

        this._created_time = created_time instanceof Date
            ? created_time
            : new Date(created_time);

        this._last_edit_time = last_edit_time instanceof Date
            ? last_edit_time
            : new Date(last_edit_time);
    }

    // 🔁 Getters & Setters
    // --- normalisation interne ---

    _normalizeSchedule(schedule) {
        if (!Array.isArray(schedule)) {
            return this._defaultSchedule();
        }

        const base = this._defaultSchedule();

        // on prend au max 7 jours, on complète si moins
        const normalized = base.map((day, index) => {
            const source = schedule[index] || {};
            return {
                is_open: typeof source.is_open === "boolean" ? source.is_open : day.is_open,
                open_hour: Number.isFinite(source.open_hour) ? source.open_hour : day.open_hour,
                close_hour: Number.isFinite(source.close_hour) ? source.close_hour : day.close_hour,
            };
        });

        return normalized;
    }

    _defaultSchedule() {
        return [
            { is_open: true, open_hour: 8, close_hour: 18 }, // lundi
            { is_open: true, open_hour: 8, close_hour: 18 },
            { is_open: true, open_hour: 8, close_hour: 18 },
            { is_open: true, open_hour: 8, close_hour: 18 },
            { is_open: true, open_hour: 8, close_hour: 18 },
            { is_open: true, open_hour: 8, close_hour: 12 },
            { is_open: false, open_hour: 0, close_hour: 0 }, // dimanche
        ];
    }

    _touchLastEdit() {
        this._last_edit_time = new Date();
    }

    // --- GETTERS ---
    get uid() {
        return this._uid;
    }
    get uid_intern() {
        return this._uid_intern;
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

    get address() {
        return this._address;
    }

    get schedule() {
        // on renvoie une copie pour éviter les mutations directes
        return this._schedule.map(day => ({ ...day }));
    }

    get enabled() {
        return this._enabled;
    }

    get created_time() {
        return this._created_time;
    }

    get last_edit_time() {
        return this._last_edit_time;
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
    set address(value) {
        this._address = value;
        this._touchLastEdit();
    }
    set schedule(value) {
        this._schedule = this._normalizeSchedule(value);
        this._touchLastEdit();
    }
    set enabled(value) {
        this._enabled = Boolean(value);
        this._touchLastEdit();
    }
    set created_time(value) {
        this._created_time = value instanceof Date ? value : new Date(value);
        // on ne touche pas last_edit_time pour la date de création
    }
    set last_edit_time(value) {
        this._last_edit_time = value instanceof Date ? value : new Date(value);
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
        return ClassSchool.makeSchoolInstance(this._uid, this.toJSON());
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
    static makeSchoolInstance(uid, data = {}) {
        return new ClassSchool({ uid, ...data });
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
                var created_time = ClassSchool._toJsDate(data.created_time);
                var last_edit_time = ClassSchool._toJsDate(data.last_edit_time);
                return ClassSchool.makeSchoolInstance(uid, { ...data, created_time, last_edit_time });
            },
        };
    }

    // ---------- Helpers Firestore ----------
    static async alreadyExist(_uid) {
        const q = query(
            collection(firestore, ClassSchool.COLLECTION),
            where("uid", "==", _uid)
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static async alreadyExistByName(_name) {
        const q = query(
            collection(firestore, ClassSchool.COLLECTION),
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
    static indexOf(array = [], uid) {
        if (array.length === 0 || !(array[0] instanceof ClassSchool)) {
            return -1;
        }
        if (!(array[0] instanceof ClassSchool)) {
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
            collection(firestore, ClassSchool.COLLECTION).withConverter(ClassSchool.converter),
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
    async createNameNormalized(name='') {
        return (name.replace(" ", "_").toLowerCase());
    }
    // Créer un user (avec option timestamps serveur)
    async create(data = {}) {
        const newRef = doc(this.constructor.colRef()); // id auto
        //data.uid = newRef.id;
        const model = data instanceof ClassSchool ? data : new ClassSchool({ ...data });
        //model.uid = newRef.id;()

        const countSchool = await this.constructor.count() || 0;
        const idSchool = countSchool + 1;
        this._uid = newRef.id;
        this._uid_intern = idSchool;
        this._name_normalized = createNameNormalized(this._name);
       // const uid = newRef.id;
        //const uid_intern = idSchool;
        //this._enabled = false;
        this._created_time = new Date();
        this._last_edit_time = new Date();
        //const path = { ...model.toJSON(), uid, uid_intern, created_time, last_edit_time };
        await setDoc(newRef, this.toJSON());
        return this.constructor.makeSchoolInstance(this._uid, this.toJSON());// -> ClassModule
    }

    // Mettre à jour un module
    static async update(id, patch = {}) {
        try {
            const ref = ClassSchool.docRef(id);
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
        await deleteDoc(ClassSchool.docRef(id));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await ClassSchool.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchFromFirestoreNeme(_name) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await ClassSchool.getByName(_name);
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