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

export class ClassRoom {
    static COLLECTION = "ROOMS";
    static NS_COLLECTION = `classes/room`;

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

    constructor({
        uid = "",
        uid_intern = "",
        uid_school = "",
        type = ClassRoom.TYPE.UNKNOWN,
        name = "",
        name_normalized = "",
        photo_url = "",
        floor = "",
        categories = [],
        enabled = false,
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        this._uid = uid;
        this._uid_intern = uid_intern;
        this._uid_school = uid_school;
        this._type = type;
        this._name = name;
        this._name_normalized = name_normalized;
        this._photo_url = photo_url;
        this._floor = floor;
        this._categories = this._normalizeCategories(categories);
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
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }
    _normalizeCategory(category) {
        return Object.values(ClassRoom.CATEGORY).includes(category)
            ? category
            : ClassRoom.CATEGORY.UNKNOWN;
    }
    _normalizeCategories(categories) {
        const array = [];
        for (let i = 0; i < categories.length; i++) {
            const element = categories[i];
            array.push(this._normalizeCategory(element));
        }
        return [...new Set(array)].filter(item=>item!==ClassRoom.CATEGORY.UNKNOWN);
    }

    // --- GETTERS ---
    get uid() {
        return this._uid;
    }
    get uid_intern() {
        return this._uid_intern;
    }
    get uid_school() {
        return this._uid_school;
    }
    get type() {
        return this._type;
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

    get floor() {
        return this._floor;
    }
    get categories() {
        return this._categories;
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
    set uid_school(value) {
        this._uid_school = value;
        this._touchLastEdit();
    }
    set type(value) {
        this._type = value;
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

    set floor(value) {
        this._floor = value;
        this._touchLastEdit();
    }
    set categories(value) {
        this._categories = value;
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
        return ClassRoom.makeRoomInstance(this._uid, this.toJSON());
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
    static makeRoomInstance(uid, data = {}) {
        return new ClassRoom({ uid, ...data });
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
                var _created_time = ClassRoom._toJsDate(data.created_time);
                var _last_edit_time = ClassRoom._toJsDate(data.last_edit_time);
                return ClassRoom.makeRoomInstance(uid, { ...data, created_time: _created_time, last_edit_time: _last_edit_time });
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
    static async list(constraints = []) {
        const q = constraints.length ? query(this.colRef(), ...constraints) : query(this.colRef());
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
        const newRef = doc(this.constructor.colRef()); // id auto
        const count = await this.constructor.count() || 0;
        //const countRoom = await ClassRoom.count() || 0;
        const idRoom = count + 1;
        this._uid = newRef.id;
        this._uid_intern = idRoom;
        this._name = this.createRoomName(idRoom);
        this._name_normalized = this.createRoomName(idRoom, true);
        //this._enabled = true;
        this._created_time = new Date();
        this._last_edit_time = new Date();
        await setDoc(newRef, this.toJSON());
        return this.constructor.makeRoomInstance(this._uid, this.toJSON()); // -> ClassModule
    }

    // Mettre à jour un module
    static async updateFirestore(id, patch = {}) {
        try {
            const ref = ClassRoom.docRef(id);
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
        await deleteDoc(ClassRoom.docRef(id));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await ClassRoom.get(uid);
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