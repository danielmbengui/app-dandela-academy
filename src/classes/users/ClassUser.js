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
    serverTimestamp,
    Timestamp,
    where,
    limit,
} from "firebase/firestore";
import { firestore } from "@/contexts/firebase/config";
import { defaultLanguage } from "@/contexts/i18n/settings";
import { isValidEmail, parseAndValidatePhone } from "@/contexts/functions";

export class ClassUser {
    static ERROR = Object.freeze({
        NOT_FOUND: 'auth/user-not-found',
        INVALID_CREDENTIAL: 'auth/invalid-credential',
        WRONG_PASSWORD: 'auth/wrong-password',
        ALREADY_IN_USE: 'auth/email-already-in-use',
        TOO_MANY_REQUESTS: 'auth/too-many-requests',
        FIRST_CONNEXION: 'FIRST_CONNEXION',
        UPDATED: 'UPDATED',
        CONNECTED: 'CONNECTED',
        DISCONNECTED: 'DISCONNECTED',
    });
    static TYPE = Object.freeze({
        INTERN: 'intern',
        EXTERN: 'extern',
        WAITING_LIST: 'waiting-list',
        SPONSOR: 'sponsor',
    });
    static ROLE = Object.freeze({
        SUPER_ADMIN: 'super-admin',
        ADMIN: 'admin',
        TEAM: 'team',
        STUDENT: 'student',
        PROFESSIONAL: 'professional',
        TUTOR: 'tutor',
    });
    static STATUS = Object.freeze({
        CREATED: 'CREATED',
        FIRST_CONNEXION: 'FIRST_CONNEXION',
        MUST_VERIFY_MAIL: 'MUST_VERIFY_MAIL',
        MUST_ACCEPT_PRIVACY: 'MUST_ACCEPT_PRIVACY',
        UPDATED: 'UPDATED',
        CONNECTED: 'CONNECTED',
        DISCONNECTED: 'DISCONNECTED',
    });
    static COLLECTION = "USERS";
    static MIN_YEARS_OLD = 10;
    static MAX_YEARS_OLD = 100;
    static MIN_LENGTH_LAST_NAME = 3;
    static MAX_LENGTH_LAST_NAME = 100;
    static MIN_LENGTH_FIRST_NAME = 3;
    static MAX_LENGTH_FIRST_NAME = 100;
    static MAX_LENGTH_DISPLAY_NAME = 30;
    static MAX_LENGTH_DISPLAY_NAME_FN = 5;
    static ALL_TYPES = [
        ClassUser.TYPE.INTERN,
        ClassUser.TYPE.EXTERN,
        ClassUser.TYPE.WAITING_LIST,
    ];
    static ALL_ROLES = [
        ClassUser.ROLE.SUPER_ADMIN,
        ClassUser.ROLE.ADMIN,
        ClassUser.ROLE.TEAM,
        ClassUser.ROLE.TUTOR,
        ClassUser.ROLE.STUDENT,
        ClassUser.ROLE.PROFESSIONAL,
    ];

    constructor({
        uid = "",
        type = -1,
        role = "",
        first_name = "",
        last_name = "",
        display_name = "",
        photo_url = "",
        email = "",
        email_verified = false,
        created_time = new Date(),
        last_edit_time = new Date(),
        birthday = null,
        phone_number = "",
        preferred_language = defaultLanguage,
        accept_privacy = false,
        status = ClassUser.STATUS.CREATED,
    } = {}) {
        this._uid = uid;
        this._type = type;
        this._role = role;
        this._email = email;
        this._first_name = first_name;
        this._last_name = last_name;
        this._email_verified = email_verified;
        this._created_time = created_time;
        this._last_edit_time = last_edit_time;
        this._birthday = birthday;
        this._display_name = display_name;
        this._photo_url = photo_url;
        this._phone_number = phone_number;
        this._preferred_language = preferred_language;
        this._accept_privacy = accept_privacy;
        this._status = status;
    }

    // 🔁 Getters & Setters
    get uid() { return this._uid; }
    set uid(val) { this._uid = val; }
    get type() { return this._type; }
    set type(val) { this._type = val; }
    get role() { return this._role; }
    set role(val) { this._role = val; }
    get accept_privacy() { return this._accept_privacy; }
    set accept_privacy(val) { this._accept_privacy = val; }

    get first_name() { return this._first_name; }
    set first_name(val) {
        this._first_name = val;
        this._display_name = this.createDisplayName();
    }
    get last_name() { return this._last_name; }
    set last_name(val) {
        this._last_name = val;
        this._display_name = this.createDisplayName();
    }
    get birthday() { return this._birthday; }
    set birthday(val) { this._birthday = val; }
    get phone_number() { return this._phone_number; }
    set phone_number(val) { this._phone_number = val; }
    get preferred_language() { return this._preferred_language; }

    set preferred_language(val) { this._preferred_language = val; }

    get email() { return this._email; }
    set email(val) { this._email = val; }

    get email_verified() { return this._email_verified; }
    set email_verified(val) { this._email_verified = val; }

    get created_time() { return this._created_time; }
    set created_time(val) { this._created_time = val; }

    get last_edit_time() { return this._last_edit_time; }
    set last_edit_time(val) { this._last_edit_time = val; }

    get display_name() { return this._display_name; }
    set display_name(val) { this._display_name = val; }

    get photo_url() { return this._photo_url; }
    set photo_url(val) { this._photo_url = val; }

    get status() { return this._status; }
    set status(val) { this._status = val; }
    // --- GETTER utils ---
    getCompleteName() {
        return (`${this._first_name} ${this.last_name?.toUpperCase()}`)
    }
    createDisplayName() {
        const firstNames = this._first_name.replace(/-/g, " ").split(/\s+/).slice(0, ClassUser.MAX_LENGTH_DISPLAY_NAME_FN).map(item => item.charAt(0)).join("");
        const lastNames = this._last_name.replace(/-/g, " ").split(/\s+/).join("");
        const result = `${firstNames?.toLowerCase() || ""}${lastNames?.toLowerCase() || ""}`;
        return (result.slice(0, ClassUser.MAX_LENGTH_DISPLAY_NAME));
    }
    getInitials() {
        const firstNames = this._first_name.replace(/-/g, " ").split(/\s+/).map(item => item.charAt(0)).join("");
        const lastNames = this._last_name.replace(/-/g, " ").split(/\s+/).map(item => item.charAt(0)).join("");
        const result = `${firstNames?.slice(0, 2).toLowerCase() || ""}${lastNames?.slice(0, 2).toLowerCase() || ""}`;
        return (result.slice(0, 4).toUpperCase());
    }
    static getMinDate() {
        const now = new Date();
        const actualYear = now.getFullYear();
        const actualMonth = now.getMonth();
        const actualDay = now.getDate();
        const minDate = new Date(actualYear - ClassUser.MIN_YEARS_OLD, actualMonth, actualDay);
        return minDate;
    }

    // --- Serialization ---
    toJSON() {
        const out = { ...this };
        //Object.keys(out).forEach((k) => out[k] === undefined ? delete out[k] : out[k]);
        const entries = Object.entries(out)
            //.filter(([k, v]) => !k.startsWith("_") && v !== undefined)
            .map(([k, v]) => ({ key: k.replace(/^_/, ''), value: v }));

        //const cleaned = Object.fromEntries(entries);
        //console.log("oooook", cleaned)
        //return entries; // <-- un OBJET, pas un tableau
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]) // <-- paires [key, value], pas {key, value}
        );
        console.log("oooook", cleaned)
        return cleaned;

        //return entries;
    }

    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }

    clone() {
        return ClassUser.makeUserInstance(this._uid, this.toJSON());
        //return new ClassUser(this.toJSON());
    }

    // ---------- VALIDATIONS ----------
    isErrorLastName() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        if (this._last_name.length > 0 && (this._last_name.length < ClassUser.MIN_LENGTH_LAST_NAME || this._last_name.length > ClassUser.MAX_LENGTH_LAST_NAME)) return (true);
        return (false)
    }
    validLastName() {
        if (!this._last_name || this._last_name.length === 0 || this.isErrorLastName()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorFirstName() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        if (this._first_name.length > 0 && (this._first_name.length < ClassUser.MIN_LENGTH_FIRST_NAME || this._first_name.length > ClassUser.MAX_LENGTH_FIRST_NAME)) return (true);
        return (false)
    }
    validFirstName() {
        if (!this._first_name || this._first_name.length === 0 || this.isErrorFirstName()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorEmail() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        if (this._email.length > 0 && !isValidEmail(this._email)) return (true);
        return (false)
    }
    validEmail() {
        if (!this._email || this._email.length === 0 || this.isErrorEmail()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorBirthday() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //const now = new Date();
        const minDate = ClassUser.getMinDate();
        console.log("MINBB", minDate);
        if (this._birthday && this._birthday > minDate) return (true);
        return (false)
    }
    validBirthday() {
        if (!this._birthday || !(this.birthday instanceof Date) || this.isErrorBirthday()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorPhoneNumber(codeCountry = "") {
        //if (!prefixe || prefixe.length === 0) return (true);
        //console.log("YEEEES",this._last_name)
        if (this._phone_number.length > 0 && codeCountry.length > 0 && !parseAndValidatePhone(`${this._phone_number}`, codeCountry).is_valid) return (true);
        return (false)
    }
    validPhoneNumber(codeCountry = "") {
        //if (!prefixe || prefixe.length === 0) return (false);
        //if (!phone || phone.length === 0) return (false);
        //if (!codeCountry || codeCountry.length === 0) return (false);
        //if (!ClassUser.isErrorPhoneNumber({prefixe,phone,codeCountry})) return (false);
        if (!this._phone_number || this._phone_number.length === 0 || this.isErrorPhoneNumber(codeCountry)) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorRole() {
        if (!this._role || this._role < 0 || !ClassUser.ALL_ROLES.includes(this._role)) return (true);
        //console.log("YEEEES",this._last_name)
        //if (!ClassUser.ALL_TYPES.includes(this._type)) return (true);
        return (false)
    }
    validRole() {
        if (!this._role || this._role.length === 0 || this.isErrorRole()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    /**************** PAGES ****************/
    pageDashboard() {
        return;
    }
    /**************** MENU ****************/
    menuDashboard() {
        return [
            /*
            {
                name: "settings",
                path: PAGE_DASHBOARD_SETTINGS,
                icon: <IconSettings width={22} height={22} />,
            },
            */
        ]
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
    static makeUserInstance(uid, data = {}) {
        const { type, role } = data || {};
        if (type === ClassUser.TYPE.EXTERN) {
            if (role === ClassUser.ROLE.STUDENT) return new ClassUserStudent({ uid, ...data });
            //if (role === ClassUserExtern.ROLE.PROFESSIONAL) return new ClassUserProfessional({ uid, ...data });
            return new ClassUserExtern({ uid, ...data });
        }


        if (type === ClassUser.TYPE.INTERN) {
            if (role === ClassUserIntern.ROLE.SUPER_ADMIN) return new ClassUserSuperAdmin({ uid, ...data });
            if (role === ClassUserIntern.ROLE.ADMIN) return new ClassUserAdmin({ uid, ...data });
            //if (role === ClassUserIntern.ROLE.TUTOR) return new ClassUserTutor({ uid, ...data });
            return new ClassUserIntern({ uid, ...data });
        }

        if (type === ClassUser.TYPE.WAITING_LIST) {
            //if (role === ClassUserIntern.ROLE.ADMIN) return new ClassUserAdmin({ uid, ...data });
            //if (role === ClassUserIntern.ROLE.TUTOR) return new ClassUserTutor({ uid, ...data });
            return new ClassUserWaitingList({ uid, ...data });
        }
        return new ClassUser({ uid, ...data });
    }
    static get converter() {
        return {
            toFirestore(userInstance) {
                // chaque classe a un .toJSON() propre
                return userInstance?.toJSON ? userInstance.toJSON() : userInstance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                return ClassUser.makeUserInstance(uid, data);
            },
        };
    }

    // ---------- Helpers Firestore ----------
    async alreadyExist() {
        const q = query(
            collection(firestore, ClassUser.COLLECTION),
            where("email", "==", this._email.toLowerCase())
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
    static async countByDates(start_date=null,end_date=null) {
        //const coll = collection(firestore, ClassUser.COLLECTION);
        const day_s = start_date.getDate();
        const month_s = start_date.getMonth();
        const year_s = start_date.getFullYear();
        const day_e = end_date.getDate();
        const month_e = end_date.getMonth();
        const year_e = end_date.getFullYear();
        const _start_date = new Date(year_s,month_s,day_s,0,0);
        const _end_date = new Date(year_e,month_e,day_e,23,59,59);
        console.log("DATTE", start_date)
        
        const q = query(
            collection(firestore, this.COLLECTION).withConverter(ClassUser.converter),
            where("created_time", ">=", _start_date),
            where("created_time", "<=", _end_date),
            //limit(1),
        );
        const snap = await getDocs(q);
        if(snap.empty) return 0;
        console.log("OUUTN", snap.size, snap.docs[0].data().uid)
        return snap.size;
     
        /*
        const coll = this.colRef();
        const snap = await getCountFromServer(coll);
        return snap.data().count; // -> nombre total
        */
    }

    // Récupérer un module par id
    static async get(id) {
        const snap = await getDoc(this.docRef(id));
        if (snap.exists()) {
            const data = snap.data();
            return (data);
        }

        return null; // -> ClassModule | null
    }
    static async getByEmail(email) {
        //const usersCol = collection(firestore, ClassUser.COLLECTION).withConverter(ClassUser.converter);
        const q = query(
            collection(firestore, ClassUser.COLLECTION).withConverter(ClassUser.converter),
            where("email", "==", email.toLowerCase().trim()),
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
    static async create(data = {}, { useServerTimestamps = true } = {}) {
        const newRef = doc(this.colRef()); // id auto
        //data.uid = newRef.id;
        const model = data instanceof ClassUser ? data : new ClassUser({ ...data });
        //model.uid = newRef.id;()
        console.log("REEEF ID", newRef, model.toJSON());
        const uid = newRef.id;
        const created_time = model.created_time;
        const last_edit_time = new Date();
        await setDoc(newRef, { ...model.toJSON(), uid, created_time, last_edit_time });
        /*
        if (useServerTimestamps) {
            await updateDoc(newRef, {
                //uid: newRef.id,
                created_time: serverTimestamp(),
                last_edit_time: serverTimestamp(),
            });
        }
        */
        return model; // -> ClassModule
    }

    // Mettre à jour un module
    static async update(id, patch = {}, { bumpEditTime = true } = {}) {
        const ref = ClassUser.docRef(id);
        const data = bumpEditTime ? { ...patch, last_edit_time: serverTimestamp() } : patch;
        await updateDoc(ref, data);
        return (await getDoc(ref)).data(); // -> ClassModule
    }

    // Supprimer un module
    static async remove(id) {
        await deleteDoc(ClassUser.docRef(id));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get module.");
            return await ClassUser.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchFromFirestoreEmail(email) {
        try {
            if (!uid) throw new Error("UID is required to get module.");
            return await ClassUser.getByEmail(email);
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
/*************************** INTERNS ************************************************/
{/* INTERN */ }
export class ClassUserIntern extends ClassUser {
    static ALL_TYPES = [
        ClassUser.TYPE.INTERN,
    ];
    static ALL_ROLES = [
        ClassUser.ROLE.SUPER_ADMIN,
        ClassUser.ROLE.ADMIN,
        ClassUser.ROLE.TEAM,
        ClassUser.ROLE.TUTOR,
    ];
    constructor(props = {}) {
        super(props); // le parent lit seulement ses clés (uid, email, type, role, ...)
    }
    clone() {
        return new ClassUserIntern(this.toJSON());
    }
}
{/* SUPER_ADMIN */ }
export class ClassUserSuperAdmin extends ClassUserIntern {
    static ALL_ROLES = [
        ClassUser.ROLE.SUPER_ADMIN,
    ];
    constructor(props = {}) {
        super(props); // le parent lit seulement ses clés (uid, email, type, role, ...)
    }
    clone() {
        return new ClassUserSuperAdmin(this.toJSON());
    }
}
{/* ADMIN */ }
export class ClassUserAdmin extends ClassUserIntern {
    static ALL_ROLES = [
        ClassUser.ROLE.ADMIN,
    ];
    constructor(props = {}) {
        super(props); // le parent lit seulement ses clés (uid, email, type, role, ...)
    }
    clone() {
        return new ClassUserAdmin(this.toJSON());
    }
}
{/* TEAM */ }
{/* TUTOR */ }
/*************************** EXTERNS ************************************************/
{/* EXTERN */ }
export class ClassUserExtern extends ClassUser {
    static LEVEL = Object.freeze({
        BEGINNER: 'beginner',
        INTERMEDIATE: 'intermediate',
        ADVANCED: 'advanced',
    });
    static HOW_KNOW = Object.freeze({
        SOCIALS: 'socials',
        FRIEND: 'friend',
        SCHOOL: 'school',
        WORK: 'work',
        ADVERTISING: 'advertising',
        GOOGLE: 'google',
        IA: 'ia',
        OTHER: 'other',
    });
    static MIN_LENGTH_GOALS = 10;
    static MAX_LENGTH_GOALS = 500;

    static MIN_LENGTH_HOW_KNOW_TEXT = 5;
    static MAX_LENGTH_HOW_KNOW_TEXT = 100;
    static ALL_TYPES = [
        ClassUser.TYPE.EXTERN,
    ];
    static ALL_ROLES = [
        ClassUser.ROLE.STUDENT,
        ClassUser.ROLE.PROFESSIONAL,
    ];
    static ALL_LEVELS = [
        ClassUserExtern.LEVEL.BEGINNER,
        ClassUserExtern.LEVEL.INTERMEDIATE,
        ClassUserExtern.LEVEL.ADVANCED,
    ];
    static ALL_HOW_KNOWS = [
        ClassUserExtern.HOW_KNOW.SOCIALS,
        ClassUserExtern.HOW_KNOW.FRIEND,
        ClassUserExtern.HOW_KNOW.SCHOOL,
        ClassUserExtern.HOW_KNOW.WORK,
        ClassUserExtern.HOW_KNOW.ADVERTISING,
        ClassUserExtern.HOW_KNOW.GOOGLE,
        ClassUserExtern.HOW_KNOW.IA,
        ClassUserExtern.HOW_KNOW.OTHER,
    ];
    constructor(props = { type: ClassUser.TYPE.EXTERN }) {
        super(props); // le parent lit seulement ses clés (uid, email, type, role, ...)
        const { goals = "", level = "", okay_whatsapp = false, okay_newsletter = true, okay_other_news = false, how_know = "", how_know_text = "" } = props;
        this._goals = goals;
        this._level = level;
        this._okay_whatsapp = okay_whatsapp;
        this._okay_newsletter = okay_newsletter;
        this._okay_other_news = okay_other_news;
        this._how_know = how_know;
        this._how_know_text = how_know_text;
    }
    // 🔁 Getters & Setters
    get goals() { return this._goals; }
    get level() { return this._level; }
    get okay_whatsapp() { return this._okay_whatsapp; }
    get okay_newsletter() { return this._okay_newsletter; }
    get okay_other_news() { return this._okay_other_news; }
    get how_know() { return this._how_know; }
    get how_know_text() { return this._how_know_text; }

    set goals(val) { this._goals = val; }
    set level(val) { this._level = val; }
    set okay_whatsapp(val) { this._okay_whatsapp = val; }
    set okay_newsletter(val) { this._okay_newsletter = val; }
    set okay_other_news(val) { this._okay_other_news = val; }
    set how_know(val) { this._how_know = val; }
    set how_know_text(val) { this._how_know_text = val; }
    clone() {
        return new ClassUserExtern(this.toJSON());
    }
    // ---------- VALIDATIONS ----------  
    isErrorGoals() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        if (this._goals.length > 0 && (this._goals.length < ClassUserExtern.MIN_LENGTH_GOALS || this._goals.length > ClassUserExtern.MAX_LENGTH_GOALS)) return (true);
        return (false)
    }
    validGoals() {
        if (!this._goals || this._goals.length === 0 || this.isErrorGoals()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorHowKnow() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        if (!ClassUserExtern.ALL_HOW_KNOWS.includes(this._how_know)) return (true);
        return (false);
    }
    validHowKnow() {
        if (this.isErrorHowKnow()) return (false);
        if (this._how_know === ClassUserExtern.HOW_KNOW.OTHER && (this._how_know_text.length < ClassUserExtern.MIN_LENGTH_HOW_KNOW_TEXT || this._how_know_text.length > ClassUserExtern.MAX_LENGTH_HOW_KNOW_TEXT)) return (false);

        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isOtherHowKnow() {
        if (this._how_know === ClassUserExtern.HOW_KNOW.OTHER) return (true);
        return (false);
    }
}
{/* STUDENT */ }
export class ClassUserStudent extends ClassUserExtern {
    static ALL_ROLES = [
        ClassUser.ROLE.STUDENT,
    ];
    constructor(props = { role: ClassUser.ROLE.STUDENT }) {
        super(props); // le parent lit seulement ses clés (uid, email, type, role, ...)
    }
    clone() {
        return new ClassUserStudent(this.toJSON());
    }
}
{/* PROFESSIONAL */ }
export class ClassUserProfessional extends ClassUserExtern {
    static ALL_ROLES = [
        ClassUser.ROLE.PROFESSIONAL,
    ];
    constructor(props = { role: ClassUser.ROLE.PROFESSIONAL }) {
        super(props); // le parent lit seulement ses clés (uid, email, type, role, ...)
    }
    clone() {
        return new ClassUserProfessional(this.toJSON());
    }
}
/*************************** WAITING LIST ************************************************/
export class ClassUserWaitingList extends ClassUser {
    static COLLECTION = "USERS_WAITING_LIST";
    static LEVEL = Object.freeze({
        BEGINNER: 'beginner',
        INTERMEDIATE: 'intermediate',
        ADVANCED: 'advanced',
    });
    static HOW_KNOW = Object.freeze({
        SOCIALS: 'socials',
        FRIEND: 'friend',
        SCHOOL: 'school',
        WORK: 'work',
        ADVERTISING: 'advertising',
        GOOGLE: 'google',
        IA: 'ia',
        OTHER: 'other',
    });
    static MIN_LENGTH_GOALS = 10;
    static MAX_LENGTH_GOALS = 500;

    static MIN_LENGTH_HOW_KNOW_TEXT = 5;
    static MAX_LENGTH_HOW_KNOW_TEXT = 100;
    static ALL_TYPES = [
        ClassUser.TYPE.WAITING_LIST,
    ];
    static ALL_ROLES = [
        ClassUser.ROLE.STUDENT,
        ClassUser.ROLE.PROFESSIONAL,
    ];
    static ALL_LEVELS = [
        ClassUserWaitingList.LEVEL.BEGINNER,
        ClassUserWaitingList.LEVEL.INTERMEDIATE,
        ClassUserWaitingList.LEVEL.ADVANCED,
    ];
    static ALL_HOW_KNOWS = [
        ClassUserWaitingList.HOW_KNOW.SOCIALS,
        ClassUserWaitingList.HOW_KNOW.FRIEND,
        ClassUserWaitingList.HOW_KNOW.SCHOOL,
        ClassUserWaitingList.HOW_KNOW.WORK,
        ClassUserWaitingList.HOW_KNOW.ADVERTISING,
        ClassUserWaitingList.HOW_KNOW.GOOGLE,
        ClassUserWaitingList.HOW_KNOW.IA,
        ClassUserWaitingList.HOW_KNOW.OTHER,
    ];
    constructor(props = { type: ClassUser.TYPE.WAITING_LIST }) {
        super(props); // le parent lit seulement ses clés (uid, email, type, role, ...)
        const { goals = "", level = "", okay_whatsapp = false, okay_newsletter = true, okay_other_news = false, how_know = "", how_know_text = "" } = props;
        this._goals = goals;
        this._level = level;
        this._okay_whatsapp = okay_whatsapp;
        this._okay_newsletter = okay_newsletter;
        this._okay_other_news = okay_other_news;
        this._how_know = how_know;
        this._how_know_text = how_know_text;
    }
    // 🔁 Getters & Setters
    get goals() { return this._goals; }
    get level() { return this._level; }
    get okay_whatsapp() { return this._okay_whatsapp; }
    get okay_newsletter() { return this._okay_newsletter; }
    get okay_other_news() { return this._okay_other_news; }
    get how_know() { return this._how_know; }
    get how_know_text() { return this._how_know_text; }

    set goals(val) { this._goals = val; }
    set level(val) { this._level = val; }
    set okay_whatsapp(val) { this._okay_whatsapp = val; }
    set okay_newsletter(val) { this._okay_newsletter = val; }
    set okay_other_news(val) { this._okay_other_news = val; }
    set how_know(val) { this._how_know = val; }
    set how_know_text(val) { this._how_know_text = val; }

    // ---------- VALIDATIONS ----------  
    isErrorGoals() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        if (this._goals.length > 0 && (this._goals.length < ClassUserWaitingList.MIN_LENGTH_GOALS || this._goals.length > ClassUserWaitingList.MAX_LENGTH_GOALS)) return (true);
        return (false)
    }
    validGoals() {
        if (!this._goals || this._goals.length === 0 || this.isErrorGoals()) return (false);
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isErrorHowKnow() {
        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        if (!ClassUserWaitingList.ALL_HOW_KNOWS.includes(this._how_know)) return (true);
        return (false);
    }
    validHowKnow() {
        if (this.isErrorHowKnow()) return (false);
        if (this._how_know === ClassUserWaitingList.HOW_KNOW.OTHER && (this._how_know_text.length < ClassUserWaitingList.MIN_LENGTH_HOW_KNOW_TEXT || this._how_know_text.length > ClassUserWaitingList.MAX_LENGTH_HOW_KNOW_TEXT)) return (false);

        //if (!this._last_name || this._last_name.length === 0) return (false);
        //console.log("YEEEES",this._last_name)
        //if (this._last_name.length >= ClassUser.MIN_LENGTH_LAST_NAME && this._last_name.length < ClassUser.MAX_LENGTH_LAST_NAME) (true);
        return (true);
    }
    isOtherHowKnow() {
        if (this._how_know === ClassUserWaitingList.HOW_KNOW.OTHER) return (true);
        return (false);
    }

    async alreadyExist() {
        const q = query(
            collection(firestore, ClassUserWaitingList.COLLECTION),
            where("email", "==", this._email.toLowerCase())
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }
    /*
        static colRef() {
            return collection(firestore, ClassUserWaitingList.COLLECTION).withConverter(ClassUser.converter);
        }
    
        static docRef(id) {
            return doc(firestore, ClassUserWaitingList.COLLECTION, id).withConverter(ClassUser.converter);
        }
        */
}