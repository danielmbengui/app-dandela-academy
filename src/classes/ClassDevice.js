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
    static CATEGORY = Object.freeze({
        HARDWARE: 'hardware',
        FOOD: 'food',
        OTHER: 'other',
        UNKNOWN: 'unknown',
    });
    static ALL_STATUS = [
        ClassDevice.STATUS.AVAILABLE,
        ClassDevice.STATUS.BUSY,
        ClassDevice.STATUS.MAINTENANCE,
        ClassDevice.STATUS.REPARATION,
        ClassDevice.STATUS.HS,

    ];
    constructor({
        uid = "",
        uid_intern = "",
        uid_room = "",
        name = "",
        name_normalized = "",
        photo_url = "",
        brand = "",
        enabled = false,
        status = ClassDevice.STATUS.UNKNOWN,
        category = "",
        type = "",
        buy_time = new Date(),
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
        this._brand = brand;
        this._enabled = Boolean(enabled);

        this._status = this._normalizeStatus(status);
        this._type = type;
        this._category = this._normalizeCategory(category);

        this._buy_time = buy_time instanceof Date
            ? buy_time
            : new Date(buy_time);

        this._created_time = created_time instanceof Date
            ? created_time
            : new Date(created_time);

        this._last_edit_time = last_edit_time instanceof Date
            ? last_edit_time
            : new Date(last_edit_time);

        this._updates = Array.isArray(updates) ? updates.slice() : [];
    }
static allStatusToObject() {
    return ClassDevice.ALL_STATUS.map((item)=>({uid:item,name:item}))
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
        this._updates = Array.isArray(value) ? value.slice() : [];
        this._touchLastEdit();
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
        return ClassDevice.makeDeviceInstance(this._uid, this.toJSON());
        //return new ClassDevice(this.toJSON());
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
    static makeDeviceInstance(uid, data = {}) {
        const { category, type } = data || {};
        //console.log("MAKING USER INSTANCE", uid, type, role);
        if (category === ClassDevice.CATEGORY.HARDWARE) {
            return new ClassComputer({ uid, ...data });
        }
        return new ClassDevice({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(deviceInstance) {
                // chaque classe a un .toJSON() propre
                return deviceInstance?.toJSON ? deviceInstance.toJSON() : deviceInstance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                var _buy_time = ClassDevice._toJsDate(data.buy_time);
                var _created_time = ClassDevice._toJsDate(data.created_time);
                var _last_edit_time = ClassDevice._toJsDate(data.last_edit_time);
                return ClassDevice.makeDeviceInstance(uid, { ...data, created_time: _created_time, last_edit_time: _last_edit_time, buy_time: _buy_time });
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
    static async createDeviceName(category, type, isLower = false) {
        var prefix = isLower ? "device" : "DEVICE";
        const count = await this.count();
        if (category === ClassDevice.CATEGORY.HARDWARE) {
            if (type === ClassComputer.TYPE.DESKTOP) {
                prefix = isLower ? "pc" : "PC";
            } else if (type === ClassComputer.TYPE.MOBILE) {
                prefix = isLower ? "mobile" : "MOBILE";
            } else if (type === ClassComputer.TYPE.TABLET) {
                prefix = isLower ? "tablet" : "TABLET";
            } else if (type === ClassComputer.TYPE.TV) {
                prefix = isLower ? "tv" : "TV";
            }
        }
        return `${prefix}-${(count + 1).toString().padStart(2, '0')}`;;
    }
    static async createDeviceNameNormalized(category, type) {
        if (category === ClassDevice.CATEGORY.HARDWARE) {
            if (type === ClassComputer.TYPE.DESKTOP) {
                const count = await ClassComputer.count();
                return `pc-${(count + 1).toString().padStart(2, '0')}`;
            }
        }
        return "NULL";
    }
    static async create(data = {}) {
        const newRef = doc(this.colRef()); // id auto
        //data.uid = newRef.id;
        const model = data instanceof ClassDevice ? data : new ClassDevice({ ...data });
        //model.uid = newRef.id;()
        //console.log("REEEF ID", newRef, model.toJSON());
        const countDevices = await this.count() || 0;
        const idDevice = countDevices + 1;
        const uid = newRef.id;
        const uid_intern = idDevice;
        var name = await this.createDeviceName(data.category, data.type);
        var name_normalized = await this.createDeviceName(data.category, data.type, true);
        const created_time = model.created_time;
        const last_edit_time = new Date();
        const path = { ...model.toJSON(), uid, uid_intern, name, name_normalized, created_time, last_edit_time };
        await setDoc(newRef, path);
        return new ClassDevice(path); // -> ClassModule
    }

    // Mettre à jour un module
    static async update(id, patch = {}) {
        try {
            const ref = this.docRef(id);
            const data = { ...patch, last_edit_time: new Date() };
            await updateDoc(ref, data, { merge: true });
            //console.log("UPDATE COMPLETED")
            return (await getDoc(ref)).data(); // -> ClassDevice
        } catch (e) {
            console.log("ERRROR", e)
            return null;
        }
    }

    // Supprimer un module
    static async remove(id) {
        await deleteDoc(this.docRef(id));
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
}
export class ClassComputer extends ClassDevice {
    static COLLECTION = "COMPUTERS";
    static TYPE = Object.freeze({
        DESKTOP: 'desktop',
        LAPTOP: 'laptop',
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

    constructor(props) {
        super({
            ...props,
            category: ClassDevice.CATEGORY.HARDWARE,
            //type: ClassComputer.TYPE.UNKNOWN
        }); // le parent lit seulement ses clés (uid, email, type, role, ...)
        this._os = props.os || ClassComputer.OPERATING_SYSTEM.UNKNOWN;
        this._os_version = props.os_version || "";
    }
    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _normalizeOs(os) {
        return Object.values(ClassComputer.OPERATING_SYSTEM).includes(os)
            ? os
            : ClassComputer.OPERATING_SYSTEM.UNKNOWN;
    }

    _normalizeType(type) {
        return Object.values(ClassComputer.TYPE).includes(type)
            ? type
            : ClassComputer.TYPE.UNKNOWN;
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

    static getIconType({type, size=20,color='inherit'}) {
        if(type === ClassComputer.TYPE.DESKTOP) {
            return <IconComputer width={size} height={size} color={color} />
        }
        if(type === ClassComputer.TYPE.LAPTOP) {
            return <IconLaptop width={size} height={size} color={color} />
        }
        if(type === ClassComputer.TYPE.MOBILE) {
            return <IconMobile width={size} height={size} color={color} />
        }
        if(type === ClassComputer.TYPE.TABLET) {
            return <IconTablet width={size} height={size} color={color} />
        }
        if(type === ClassComputer.TYPE.TV) {
            return <IconTv width={size} height={size} color={color} />
        }
        return <IconUnknown width={size} height={size} color={color} />
    }
}