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
import { IconComputer, IconLaptop, IconMobile, IconTablet, IconTv, IconUnknown } from "@/assets/icons/IconsComponent";
import { ClassColor } from "./ClassColor";
import { ComputerIconLarge, ComputerIconMedium, ComputerIconSmall, LaptopIconLarge, LaptopIconMedium, LaptopIconSmall, MobileIconLarge, MobileIconMedium, MobileIconSmall, TabletIconLarge, TabletIconMedium, TabletIconSmall, TvIconLarge, TvIconMedium, TvIconSmall, WatchIconLarge, WatchIconMedium, WatchIconSmall } from "@/components/dashboard/computers/ComputerIcons";
import { ClassUpdate } from "./ClassUpdate";
import { getStartOfDay } from "@/contexts/functions";

export class ClassDevice {
    static COLLECTION = "DEVICES";
    static NS_COLLECTION = `classes/device`;

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
    static STATUS_CONFIG = Object.freeze({
        available: {
            label: 'available',
            badgeBg: "#022c22",
            badgeBorder: "#16a34a",
            badgeText: "#bbf7d0",
            glow: "#22c55e55",
        },
        busy: {
            label: 'busy',
            badgeBg: "#111827",
            badgeBorder: "#3b82f6",
            badgeText: "#bfdbfe",
            glow: "#3b82f655",
        },
        maintenance: {
            label: 'maintenance',
            badgeBg: "#422006",
            badgeBorder: "#f97316",
            badgeText: "#fed7aa",
            glow: "#f9731655",
        },
        reparation: {
            label: 'reparation',
            badgeBg: "#111827",
            badgeBorder: "rgb(255,0,0)",
            badgeText: "rgba(253, 214, 214, 1)",
            glow: "rgba(255,0,0,0.3)",
        },
        hs: {
            label: 'hs',
            badgeBg: "#111827",
            badgeBorder: "#6b7280",
            badgeText: "#e5e7eb",
            glow: "#6b728055",
        },
        all: {
            label: 'all',
            badgeBg: "transparent",
            badgeBorder: "var(--font-color)",
            badgeText: "#e5e7eb",
            glow: "#6b728055",
        },
    });
    static CATEGORY = Object.freeze({
        HARDWARE: 'hardware',
        FOOD_MATERIAL: 'food-material',
        OTHER: 'other',
        UNKNOWN: 'unknown',
    });
    static TYPE = Object.freeze({
        UNKNOWN: 'unknown',
    });
    static ALL_CATEGORIES = [
        ClassDevice.CATEGORY.HARDWARE,
        //ClassDevice.CATEGORY.FOOD_MATERIAL,
        //ClassDevice.CATEGORY.OTHER,

    ];
    static ALL_STATUS = [
        ClassDevice.STATUS.AVAILABLE,
        ClassDevice.STATUS.BUSY,
        ClassDevice.STATUS.MAINTENANCE,
        ClassDevice.STATUS.REPARATION,
        ClassDevice.STATUS.HS,

    ];
    static MIN_LENGTH_NAME = 3;
    static MAX_LENGTH_NAME = 100;
    static MIN_LENGTH_BRAND = 2;
    static MAX_LENGTH_BRAND = 100;

    constructor({
        uid = "",
        uid_intern = "",
        uid_room = "",
        name = "",
        name_normalized = "",
        photo_url = "",
        brand = "",
        enabled = false,
        status = "",
        status_text="",
        category = "",
        type = "",
        buy_time = null,
        created_time = null,
        last_edit_time = null,
        updates = [],
    } = {}) {
        this._uid = uid;
        this._uid_intern = uid_intern;
        this._uid_room = uid_room;
        this._name = name;
        this._name_normalized = name_normalized;
        this._photo_url = photo_url;
        this._brand = brand;
        this._enabled = Boolean(enabled);

        this._status = this._normalizeStatus(status);
        this._status_text = status_text;
        this._type = this._normalizeType(type);
        this._category = this._normalizeCategory(category);

        this._buy_time = buy_time instanceof Date
            ? buy_time
            : null;

        this._created_time = created_time instanceof Date
            ? created_time
            : null;

        this._last_edit_time = last_edit_time instanceof Date
            ? last_edit_time
            : null;

        this._updates = Array.isArray(updates) ? this._normalizeUpdates(updates).slice() : [];
    }
    static allStatusToObject() {
        return ClassDevice.ALL_STATUS.map((item) => ({ uid: item, name: item }))
    }
    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }

    _normalizeStatus(status) {
        return Object.values(ClassDevice.STATUS).includes(status)
            ? status
            : ClassDevice.STATUS.UNKNOWN;
    }

    _normalizeCategory(category) {
        return Object.values(ClassDevice.CATEGORY).includes(category)
            ? category
            : ClassDevice.CATEGORY.UNKNOWN;
    }
    _normalizeType(type = "") {
        return ClassDevice.TYPE.UNKNOWN;
    }
    _normalizeUpdates(updates = []) {
        const _updates = [];
        for (let i = 0; i < updates.length; i++) {
            const element = updates[i];
            if(element instanceof ClassUpdate) {
                _updates.push(element);
            } else {
                _updates.push(new ClassUpdate(element));
            }
        }
        return _updates;
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

    get brand() {
        return this._brand;
    }

    get enabled() {
        return this._enabled;
    }

    get status() {
        return this._status;
    }
    get status_text() {
        return this._status_text;
    }

    get type() {
        return this._type;
    }
    get category() {
        return this._category;
    }

    get buy_time() {
        return this._buy_time;
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
    set brand(value) {
        this._brand = value;
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
    set status_text(value) {
        this._status_text = value;
        this._touchLastEdit();
    }

    set type(value) {
        this._touchLastEdit();
    }
    set category(value) {
        this._category = this._normalizeCategory(value);
        this._touchLastEdit();
    }

    set buy_time(value) {
        this._buy_time = value instanceof Date ? value : new Date(value);
        // on ne touche pas last_edit_time ici
    }
    set created_time(value) {
        this._created_time = value instanceof Date ? value : new Date(value);
        // on ne touche pas last_edit_time ici
    }

    set last_edit_time(value) {
        this._last_edit_time = value instanceof Date ? value : new Date(value);
    }

    set updates(value) {
        this._updates = Array.isArray(value) ? value.slice() : this._updates;
        this._touchLastEdit();
    }
    // --- Serialization ---
    toJSON() {
        const out = { ...this };
        //console.log("OUUUT", out)
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => {
                    const key = k.replace(/^_/, "");

                    if (key === 'updates') {
                        //console.log("KKKEY", key)
                        const array = [];

                        for (let i = 0; i < v.length; i++) {
                            //console.log("instance", v[i]);
                            if (v[i] instanceof ClassUpdate) {
                                //  console.log("instance to json KEY", v[i].toJSON());
                                array.push(v[i].toJSON());
                            } else {
                                array.push(v[i]);
                            }
                        }
                        return ([key, array])
                    } else {
                        return ([key, v])
                    }
                }) // <-- paires [key, value], pas {key, value}
        );
        return cleaned;
    }
    same(object) {
        if (!(object instanceof ClassDevice)) {
            return false;
        }
        const objectJson = object.toJSON();
        const objectKeys = Object.keys(objectJson);
        const json = this.toJSON();
        const keys = Object.keys(json);
        if (objectKeys.length !== keys.length) {
            return false;
        }
        var i = 0;
        while (i < keys.length) {
            const key = keys[i];
            //const updates = object['updates']
            if (key === 'buy_time') {
                console.log("BUY", getStartOfDay(object[key]), getStartOfDay(json[key]))
                if (getStartOfDay(object[key]).getTime() !== getStartOfDay(json[key]).getTime()) {
                    console.log("start BUY", getStartOfDay(object[key]), getStartOfDay(json[key]))
                    return false;
                }
            } else {
                if (key !== 'updates') {
                    if (object[key] !== json[key]) {
                        //console.log("NOT SAME", object[key], json[key])
                        return false;
                    }
                }
            }
            i++;
        }
        return true;
    }
    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }
    clone() {
        return ClassDevice.makeDeviceInstance(this._uid, this.toJSON());
        //return new ClassDevice(this.toJSON());
    }

    // ---------- VALIDATIONS ----------
    isErrorName() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        if (this._name.length > 0 && (this._name.length < ClassDevice.MIN_LENGTH_NAME || this._name.length > ClassDevice.MAX_LENGTH_NAME)) return (true);
        //if (this._type.length > 0 && this._type === ClassDevice.TYPE.UNKNOWN) return (true);
        return (false);
    }
    validName() {
        if (!this._name || this._name.length === 0 || this.isErrorName()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorBrand() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        if (this._brand.length > 0 && (this._brand.length < this.MIN_LENGTH_BRAND || this._brand.length > this.MAX_LENGTH_BRAND)) return (true);
        //if (this._type.length > 0 && this._type === ClassDevice.TYPE.UNKNOWN) return (true);
        return (false);
    }
    validBrand() {
        if (!this._brand || this._brand.length === 0 || this.isErrorBrand()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorCategory() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._category.length > 0 && (this._last_name.length < ClassUser.MIN_LENGTH_LAST_NAME || this._last_name.length > ClassUser.MAX_LENGTH_LAST_NAME)) return (true);
        if (this._category.length > 0 && !ClassDevice.ALL_CATEGORIES.includes(this._category)) return (true);
        return (false);
    }
    validCategory() {
        if (!this._category || this._category.length === 0 || this.isErrorCategory()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorType() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._category.length > 0 && (this._last_name.length < ClassUser.MIN_LENGTH_LAST_NAME || this._last_name.length > ClassUser.MAX_LENGTH_LAST_NAME)) return (true);
        if (this._type.length > 0 && this._type === ClassDevice.TYPE.UNKNOWN) return (true);
        return (false);
    }
    validType() {
        if (!this._type || this._type.length === 0 || this.isErrorType()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorStatus() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._category.length > 0 && (this._last_name.length < ClassUser.MIN_LENGTH_LAST_NAME || this._last_name.length > ClassUser.MAX_LENGTH_LAST_NAME)) return (true);
        if (this._status.length > 0 && this._status === ClassDevice.STATUS.UNKNOWN) return (true);
        return (false);
    }
    validStatus() {
        if (!this._status || this._status.length === 0 || this.isErrorStatus()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorOsVersion() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._category.length > 0 && (this._last_name.length < ClassUser.MIN_LENGTH_LAST_NAME || this._last_name.length > ClassUser.MAX_LENGTH_LAST_NAME)) return (true);
        //if (this._type.length > 0 && this._type === ClassDevice.TYPE.UNKNOWN) return (true);
        return (false);
    }
    validOsVersion() {
        //if (!this._type || this._type.length === 0 || this.isErrorType()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorOs() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._os.length > 0 && !ClassHardware.ALL_OS.includes(this._os)) return (true);        //if (this._type.length > 0 && this._type === ClassDevice.TYPE.UNKNOWN) return (true);
        return (false);
    }
    validOs() {
        //if (!this._os || this._os.length === 0 || this.isErrorOs()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorBuyTime() {
        if (!this._buy_time || this._buy_time === null) return (true);
        return (false)
    }
    validBuyTime() {
        if (!this._buy_time || !(this._buy_time instanceof Date) || this.isErrorBuyTime()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
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
    static makeDeviceInstance(uid, data = {}) {
        const { category, type } = data || {};
        //console.log("MAKING USER INSTANCE", uid, type, role);
        if (category === ClassDevice.CATEGORY.HARDWARE) {
            return new ClassHardware({ uid, ...data });
        }
        return new ClassDevice({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(deviceInstance) {
                // chaque classe a un .toJSON() propre
                var updates = [];
                if (deviceInstance?.updates?.length > 0) {
                    updates = deviceInstance.updates.map(update => update?.toJSON ? update.toJSON() : update);
                }
                return deviceInstance?.toJSON ? { ...deviceInstance.toJSON(), updates } : deviceInstance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                var _buy_time = ClassDevice._toJsDate(data.buy_time);
                var _created_time = ClassDevice._toJsDate(data.created_time);
                var _last_edit_time = ClassDevice._toJsDate(data.last_edit_time);
                const updates = data.updates?.map((item) => {
                    return (new ClassUpdate(item));
                })
                return ClassDevice.makeDeviceInstance(uid, { ...data, created_time: _created_time, last_edit_time: _last_edit_time, buy_time: _buy_time, updates });
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
            where("name_normalized", "==", _name.toLowerCase().trim())
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
        if (array.length === 0 || !(array[0] instanceof ClassDevice)) {
            return -1;
        }
        if (!(array[0] instanceof ClassDevice)) {
            console.log("ERRROR is not class Device")
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
            collection(firestore, this.COLLECTION).withConverter(this.converter),
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
        const docs = qSnap.docs.map((item) => {
            return (item.data());
        });
        return docs;
    }
    // Créer un user (avec option timestamps serveur)
    async createDeviceName(idDevice = '', isNormalized = false) {
        var prefix = isNormalized ? "device" : "DEVICE";
        if (this._category === ClassDevice.CATEGORY.HARDWARE) {
            prefix = isNormalized ? this._type.toLocaleLowerCase() : this._type.toUpperCase();
        }
        return `${prefix}-${(idDevice).toString().padStart(2, '0')}`;;
    }
    async createFirestore() {
        const newRef = doc(this.constructor.colRef()); // id auto
        //data.uid = newRef.id;
        // const data = this.toJSON();
        //const model = this.constructor.makeDeviceInstance('', data);
        //model.uid = newRef.id;()
        const countAllDevices = await this.constructor.count() || 0;
        const countTypeDevices = await this.constructor.count([where('type', '==', this._type)]) || 0;
        //console.log("log device count", countTypeDevices, countAllDevices)
        const idDevice = countTypeDevices + 1;
        const uid = newRef.id;
        //const uid_intern = idDevice;
        //var name = await this.createDeviceName(data.category, data.type);
        //var name_normalized = await this.createDeviceName(data.category, data.type, true);
        //const created_time = new Date();
        //const last_edit_time = new Date();
        this._uid = uid;
        this._uid_intern = countAllDevices + 1;
        this._name = await this.createDeviceName(idDevice);
        this._name_normalized = await this.createDeviceName(idDevice, true);
        this._created_time = new Date();
        this._last_edit_time = new Date();
        //const path = { ...model.toJSON(), uid, uid_intern, name, name_normalized, created_time, last_edit_time };
        //console.log("REEEF ID", this.constructor.makeDeviceInstance(uid, this.toJSON()));
        await setDoc(newRef, this.toJSON());
        return this.constructor.makeDeviceInstance(uid, this.toJSON()); // -> ClassModule
    }
    // Mettre à jour un module
    async updateFirestore() {
        try {
            const ref = this.constructor.docRef(this._uid);
            this._last_edit_time = new Date();
            //const data = { ...patch, last_edit_time: new Date() };
            await updateDoc(ref, this.toJSON(), { merge: true });
            //console.log("UPDATE COMPLETED", { ...this })
            //return (await getDoc(ref)).data(); // -> ClassDevice
            return this.constructor.makeDeviceInstance(this._uid, this.toJSON()); // -> ClassModule
        } catch (e) {
            console.log("ERRROR", e)
            return null;
        }
    }
    // Supprimer un device
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
            return await this.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchFromFirestoreName(_name) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await this.getByName(_name);
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
            return [];
        }
    }
    static getIconType({ type, size = 20, color = 'inherit' }) {
        if (type === ClassHardware.TYPE.DESKTOP) {
            return <IconComputer width={size} height={size} color={color} />
        }
        if (type === ClassHardware.TYPE.LAPTOP) {
            return <IconLaptop width={size} height={size} color={color} />
        }
        if (type === ClassHardware.TYPE.MOBILE) {
            return <IconMobile width={size} height={size} color={color} />
        }
        if (type === ClassHardware.TYPE.TABLET) {
            return <IconTablet width={size} height={size} color={color} />
        }
        if (type === ClassHardware.TYPE.TV) {
            return <IconTv width={size} height={size} color={color} />
        }
        return <IconUnknown width={size} height={size} color={color} />
    }
    static getIcon({ type, size = 'small', status = ClassDevice.STATUS.UNKNOWN, extra = false }) {
        if (type === ClassHardware.TYPE.DESKTOP) {
            switch (size) {
                case 'small': return <ComputerIconSmall status={status} extraSmall={extra} />;
                case 'large': return <ComputerIconLarge status={status} extraLarge={extra} />;
                default: return <ComputerIconMedium status={status} extraLarge={extra} />;
            }
        }
        if (type === ClassHardware.TYPE.LAPTOP) {
            switch (size) {
                case 'small': return <LaptopIconSmall status={status} extraSmall={extra} />;
                case 'large': return <LaptopIconLarge status={status} extraLarge={extra} />;
                default: return <LaptopIconMedium status={status} extraLarge={extra} />;
            }
        }
        if (type === ClassHardware.TYPE.MOBILE) {
            switch (size) {
                case 'small': return <MobileIconSmall status={status} extraSmall={extra} />;
                case 'large': return <MobileIconLarge status={status} extraLarge={extra} />;
                default: return <MobileIconMedium status={status} extraLarge={extra} />;
            }
        }
        if (type === ClassHardware.TYPE.TABLET) {
            switch (size) {
                case 'small': return <TabletIconSmall status={status} extraSmall={extra} />;
                case 'large': return <TabletIconLarge status={status} extraLarge={extra} />;
                default: return <TabletIconMedium status={status} extraLarge={extra} />;
            }
        }
        if (type === ClassHardware.TYPE.WATCH) {
            switch (size) {
                case 'small': return <WatchIconSmall status={status} extraSmall={extra} />;
                case 'large': return <WatchIconLarge status={status} extraLarge={extra} />;
                default: return <WatchIconMedium status={status} extraLarge={extra} />;
            }
        }
        if (type === ClassHardware.TYPE.TV) {
            switch (size) {
                case 'small': return <TvIconSmall status={status} extraSmall={extra} />;
                case 'large': return <TvIconLarge status={status} extraLarge={extra} />;
                default: return <TvIconMedium status={status} extraLarge={extra} />;
            }
        }
        return <></>
    }
    static getCategories() {
        const categories = {};
        for (let i = 0; i < this.ALL_CATEGORIES.length; i++) {
            const categoryTitle = this.ALL_CATEGORIES[i];
            const array = categoryTitle === 'hardware' ? ClassHardware.ALL_TYPES : [];
            categories[categoryTitle] = array;
        }
        return categories;
    }
    static getTypesByCategory(category = "") {
        if (!category) return [];
        if (!this.ALL_CATEGORIES.includes(category)) return [];
        if (category === ClassDevice.CATEGORY.HARDWARE) {
            return ClassHardware.ALL_TYPES;
        }
        return [];
    }
}
export class ClassHardware extends ClassDevice {
    static COLLECTION = "COMPUTERS";
    static TYPE = Object.freeze({
        DESKTOP: 'desktop',
        LAPTOP: 'laptop',
        MOBILE: 'mobile',
        TABLET: 'tablet',
        TV: 'tv',
        WATCH: 'watch',
        UNKNOWN: 'unknown',
    });
    static OS = Object.freeze({
        WINDOWS: 'windows',
        MACOS: 'macos',
        IOS: 'ios',
        LINUX: 'linux',
        UBUNTU: 'ubuntu',
        UNKNOWN: 'unknown',
    });
    static MIN_LENGTH_OS_VERSION = 0;
    static MAX_LENGTH_OS_VERSION = 100;
    static ALL_OS = [
        ClassHardware.OS.WINDOWS,
        ClassHardware.OS.MACOS,
        ClassHardware.OS.IOS,
        ClassHardware.OS.LINUX,
        ClassHardware.OS.UBUNTU,
    ]
    static ALL_TYPES = [
        ClassHardware.TYPE.DESKTOP,
        ClassHardware.TYPE.LAPTOP,
        ClassHardware.TYPE.MOBILE,
        ClassHardware.TYPE.TABLET,
        ClassHardware.TYPE.TV,
        ClassHardware.TYPE.WATCH,
    ];

    constructor(props) {
        super({
            ...props,
            category: ClassDevice.CATEGORY.HARDWARE,
            type: props.type || ClassHardware.TYPE.UNKNOWN,
        }); // le parent lit seulement ses clés (uid, email, type, role, ...)
        this._os = props.os || '';
        this._os_version = props.os_version || "";
    }
    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _normalizeOs(os) {
        return Object.values(ClassHardware.OS).includes(os)
            ? os
            : ClassHardware.OS.UNKNOWN;
    }

    _normalizeType(type) {
        return Object.values(ClassHardware.TYPE).includes(type)
            ? type
            : ClassHardware.TYPE.UNKNOWN;
    }
    // --- GETTERS ---

    get os() {
        return this._os;
    }
    get os_version() {
        return this._os_version;
    }

    // --- SETTERS ---

    set os(value) {
        this._os = value;
        this._touchLastEdit();
    }
    set os_version(value) {
        this._os_version = value;
        this._touchLastEdit();
    }

    isErrorType() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._category.length > 0 && (this._last_name.length < ClassUser.MIN_LENGTH_LAST_NAME || this._last_name.length > ClassUser.MAX_LENGTH_LAST_NAME)) return (true);
        if (this._type.length > 0 && !ClassHardware.ALL_TYPES.includes(this._type)) return (true);
        return (false);
    }
    validType() {
        if (!this._type || this._type.length === 0 || this.isErrorType()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorOs() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._os.length > 0 && !ClassHardware.ALL_OS.includes(this._os)) return (true);        //if (this._type.length > 0 && this._type === ClassDevice.TYPE.UNKNOWN) return (true);
        if (this._os.length>0 && this._os.length > ClassHardware.MAX_LENGTH_OS_VERSION) return (true);
        return (false);
    }
    validOs() {
        if (this.isErrorOs()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorOsVersion() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        if (this._os_version.length > 0 && this._os_version.length > ClassHardware.MAX_LENGTH_OS_VERSION) return (true);
        //if (this._type.length > 0 && this._type === ClassDevice.TYPE.UNKNOWN) return (true);
        return (false);
    }
    validOsVersion() {
        if (this.isErrorOsVersion()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }

    static async count(constraints = []) {
        const q = query(this.colRef(), where('category', '==', ClassHardware.CATEGORY.HARDWARE), ...constraints);        //const qSnap = await getDocs(q);
        //const coll = collection(firestore, ClassUser.COLLECTION);
        //const coll = this.colRef();
        const snap = await getCountFromServer(q);
        return snap.data().count; // -> nombre total
    }
}