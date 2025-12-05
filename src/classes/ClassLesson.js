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

export class ClassLesson {
    static COLLECTION = "LESSONS";
    static NS_COLLECTION = `classes/lesson`;
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
        ADVANCED: 'advaned', // avancé
        EXPERT: 'expert', // expert
        UNKNOWN: 'unknown',
    });
    static FORMAT = Object.freeze({
        HYBRID: 'hybrid', // bureautique
        ONSITE: 'onsite',
        ONLINE: 'online',
        UNKNOWN: 'unknown',
    });
    static STATUS = Object.freeze({
        OPEN: 'open', // bureautique
        FULL: 'full',
        COMPLETED: 'completed',
        DRAFT: 'draft',
        UNKNOWN: 'unknown',
    });
    static SESSION_TYPE = Object.freeze({
        DAILY: 'daily', // bureautique
        WEEKLY: 'weekly',
        MONTHLY: 'monthly',
        YEARLY: 'yearly',
        UNKNOWN: 'unknown',
    });

    constructor({
        uid = "",
        uid_intern = "",
        uid_room = "",
        code = "", // Excel-101
        title = "",
        title_normalized = "",
        subtitle = "",
        subtitle_normalized = "",
        description = "",
        category = "",
        level = "",
        lang = "",
        format = "",
        certified = false,
        price = 0,
        currency = "",
        start_date = null,
        end_date = null,
        seats_availables = 0,
        seats_taken = 0,
        duration = 0,
        sessions_count = 0,
        sessions_type = "",      // ex: "hebdomadaire", "weekend", "intensif"
        sessions_schedule = this._defaultSchedule(),
        goals = [],
        programs = [],
        prerequisites = [],
        target_audiences = [],
        notes = [],
        photo_url = "",
        status = "",
        location = "",           // NOUVEAU
        url = "",                // NOUVEAU
        created_time = null,
        last_edit_time = null,
    } = {}) {
        this._uid = uid;
        this._uid_intern = uid_intern;
        this._uid_room = uid_room;
        this._code = code;
        this._title = title;
        this._title_normalized = title_normalized;
        this._subtitle = subtitle;
        this._subtitle_normalized = subtitle_normalized;
        this._description = description;
        this._category = this._normalizeCategory(category);
        this._level = level;
        this._lang = lang;
        this._format = format;
        this._certified = certified;
        this._price = price;
        this._currency = currency;
        this._start_date = start_date;
        this._end_date = end_date;
        this._seats_availables = seats_availables;
        this._seats_taken = seats_taken;
        this._duration = duration;
        this._sessions_count = sessions_count;
        this._sessions_type = sessions_type;
        this._sessions_schedule = this._normalizeSchedule(sessions_schedule);
        this._goals = goals;
        this._programs = programs;
        this._prerequisites = prerequisites;
        this._target_audiences = target_audiences;
        this._notes = notes;
        this._photo_url = photo_url;
        this._status = status;
        this._location = location;
        this._url = url;
        this._created_time = created_time;
        this._last_edit_time = last_edit_time;
    }
    _normalizeCategory(category) {
        return Object.values(ClassLesson.CATEGORY).includes(category)
            ? category
            : ClassLesson.CATEGORY.UNKNOWN;
    }
    _normalizeSchedule(schedule) {
        if (!(schedule instanceof Object) || Object.keys(schedule).length === 0) {
            return this._defaultSchedule();
        }
        var base = this._defaultSchedule();

        // on prend au max 7 jours, on complète si moins
        Object.keys(base).map((key, index) => {
            const source = schedule[key] || {};
            base[key] = {
                is_open: typeof source.is_open === "boolean" ? source.is_open : base[key].is_open,
                open_hour: Number.isFinite(source.open_hour) ? source.open_hour : base[key].open_hour,
                close_hour: Number.isFinite(source.close_hour) ? source.close_hour : base[key].close_hour,
            };
        });

        return base;
    }
    _defaultSchedule() {
        return {
            monday: { is_open: false, open_hour: 0, close_hour: 0 }, // lundi
            thuesday: { is_open: false, open_hour: 0, close_hour: 0 },
            wednesday: { is_open: false, open_hour: 0, close_hour: 0 },
            thursday: { is_open: false, open_hour: 0, close_hour: 0 },
            friday: { is_open: false, open_hour: 0, close_hour: 0 },
            saturday: { is_open: false, open_hour: 0, close_hour: 0 },
            sunday: { is_open: false, open_hour: 0, close_hour: 0 }, // dimanche
        };
    }
    // uid
    get uid() {
        return this._uid;
    }
    set uid(value) {
        this._uid = value;
    }

    // uid_intern
    get uid_intern() {
        return this._uid_intern;
    }
    set uid_intern(value) {
        this._uid_intern = value;
    }
    
    // uid_room
    get uid_room() {
        return this._uid_room;
    }
    set uid_room(value) {
        this._uid_room = value;
    }

    // code
    get code() {
        return this._code;
    }
    set code(value) {
        this._code = value;
    }

    // title
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }

    // title_normalized
    get title_normalized() {
        return this._title_normalized;
    }
    set title_normalized(value) {
        this._title_normalized = value;
    }

    // subtitle
    get subtitle() {
        return this._subtitle;
    }
    set subtitle(value) {
        this._subtitle = value;
    }

    // subtitle_normalized
    get subtitle_normalized() {
        return this._subtitle_normalized;
    }
    set subtitle_normalized(value) {
        this._subtitle_normalized = value;
    }

    // description
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
    }

    // category
    get category() {
        return this._category;
    }
    set category(value) {
        this._category = value;
    }

    // level
    get level() {
        return this._level;
    }
    set level(value) {
        this._level = value;
    }

    // lang
    get lang() {
        return this._lang;
    }
    set lang(value) {
        this._lang = value;
    }

    // format
    get format() {
        return this._format;
    }
    set format(value) {
        this._format = value;
    }

    // certified
    get certified() {
        return this._certified;
    }
    set certified(value) {
        this._certified = value;
    }

    // price
    get price() {
        return this._price;
    }
    set price(value) {
        this._price = value;
    }

    // currency
    get currency() {
        return this._currency;
    }
    set currency(value) {
        this._currency = value;
    }

    // start_date
    get start_date() {
        return this._start_date;
    }
    set start_date(value) {
        this._start_date = value;
    }

    // end_date
    get end_date() {
        return this._end_date;
    }
    set end_date(value) {
        this._end_date = value;
    }

    // seats_availables
    get seats_availables() {
        return this._seats_availables;
    }
    set seats_availables(value) {
        this._seats_availables = value;
    }

    // seats_taken
    get seats_taken() {
        return this._seats_taken;
    }
    set seats_taken(value) {
        this._seats_taken = value;
    }

    // duration
    get duration() {
        return this._duration;
    }
    set duration(value) {
        this._duration = value;
    }

    // sessions_count
    get sessions_count() {
        return this._sessions_count;
    }
    set sessions_count(value) {
        this._sessions_count = value;
    }

    // sessions_type
    get sessions_type() {
        return this._sessions_type;
    }
    set sessions_type(value) {
        this._sessions_type = value;
    }

    // sessions_schedule
    get sessions_schedule() {
        return this._sessions_schedule;
    }
    set sessions_schedule(value) {
        this._sessions_schedule = value;
    }

    // goals
    get goals() {
        return this._goals;
    }
    set goals(value) {
        this._goals = value;
    }

    // programs
    get programs() {
        return this._programs;
    }
    set programs(value) {
        this._programs = value;
    }

    // prerequisites
    get prerequisites() {
        return this._prerequisites;
    }
    set prerequisites(value) {
        this._prerequisites = value;
    }

    // target_audiences
    get target_audiences() {
        return this._target_audiences;
    }
    set target_audiences(value) {
        this._target_audiences = value;
    }

    // notes
    get notes() {
        return this._notes;
    }
    set notes(value) {
        this._notes = value;
    }

    // status
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    // photo_url
    get photo_url() {
        return this._photo_url;
    }
    set photo_url(value) {
        this._photo_url = value;
    }
    // location
    get location() {
        return this._location;
    }
    set location(value) {
        this._location = value;
    }

    // url
    get url() {
        return this._url;
    }
    set url(value) {
        this._url = value;
    }

    // created_time
    get created_time() {
        return this._created_time;
    }
    set created_time(value) {
        this._created_time = value;
    }

    // last_edit_time
    get last_edit_time() {
        return this._last_edit_time;
    }
    set last_edit_time(value) {
        this._last_edit_time = value;
    }

    // 🔁 Getters & Setters
    // --- normalisation interne ---
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }

    // --- GETTERS ---


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
        return ClassLesson.makeLessonInstance(this._uid, this.toJSON());
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
    static makeLessonInstance(uid, data = {}) {
        return new ClassLesson({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(lessonInstance) {
                // chaque classe a un .toJSON() propre
                return lessonInstance?.toJSON ? lessonInstance.toJSON() : lessonInstance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                var start_date = ClassLesson._toJsDate(data.start_date);
                var end_date = ClassLesson._toJsDate(data.end_date);
                var created_time = ClassLesson._toJsDate(data.created_time);
                var last_edit_time = ClassLesson._toJsDate(data.last_edit_time);
                return ClassLesson.makeLessonInstance(uid, { ...data, start_date, end_date, created_time, last_edit_time });
            },
        };
    }

    // ---------- Helpers Firestore ----------
    static async alreadyExist(_uid) {
        const q = query(
            collection(firestore, ClassLesson.COLLECTION),
            where("uid", "==", _uid)
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    static async alreadyExistByName(_name) {
        const q = query(
            collection(firestore, ClassLesson.COLLECTION),
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
        if (array.length === 0 || !(array[0] instanceof ClassLesson)) {
            return -1;
        }
        if (!(array[0] instanceof ClassLesson)) {
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
            collection(firestore, ClassLesson.COLLECTION).withConverter(ClassLesson.converter),
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
    async createNameNormalized(name = '') {
        return (name.replace(" ", "_").toLowerCase());
    }
    // Créer un user (avec option timestamps serveur)
    async create(data = {}) {
        const newRef = doc(this.constructor.colRef()); // id auto
        //data.uid = newRef.id;
        const model = data instanceof ClassLesson ? data : new ClassLesson({ ...data });
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
            const ref = ClassLesson.docRef(id);
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
        await deleteDoc(ClassLesson.docRef(id));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await ClassLesson.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchFromFirestoreNeme(_name) {
        try {
            if (!uid) throw new Error("UID is required to get school.");
            return await ClassLesson.getByName(_name);
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