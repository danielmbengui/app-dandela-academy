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
} from "firebase/firestore";
import { firestore } from "@/contexts/firebase/config";
import { defaultLanguage } from "@/contexts/i18n/settings";
import { ClassUser } from "../ClassUser";

export class ClassUserExtern extends ClassUser {
    static ROLE = Object.freeze({
        STUDENT: 'student',
        PROFESSIONAL: 'professional',
    });
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
    static ALL_ROLES = [
        ClassUserExtern.ROLE.STUDENT,
        ClassUserExtern.ROLE.PROFESSIONAL,
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

    constructor({
        uid = "",
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
        status = ClassUserExtern.STATUS.CREATED,
        goals = "",
        level = '',
        okay_whatsapp = false,
        okay_newsletter = true,
        okay_other_news = false,
        how_know = '',
        how_know_text = '',
    } = {}) {
        super({
            uid,
            type: ClassUserExtern.TYPE.EXTERN,
            role,
            email,
            first_name,
            last_name,
            email_verified,
            created_time,
            last_edit_time,
            display_name,
            photo_url,
            birthday,
            phone_number,
            preferred_language,
            accept_privacy,
            status,
        });
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

    // --- Serialization ---
    /*
    toJSON() {
        return {
            ...super.toJSON(),
            goals: this._goals,
            level: this._level,
            okay_whatsapp: this._okay_whatsapp,
            okay_newsletter: this._okay_newsletter,
            okay_other_news: this._okay_other_news,
            how_know: this._how_know,
            how_know_text: this._how_know_text,
        };
    }
    */
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
    // ---------- Converter intégré ----------    
    static get converter() {
        return {
            toFirestore(model) {
                return model.toJSON(); // Firestore convertira Date -> Timestamp
            },
            fromFirestore(snapshot, options) {
                const data = snapshot.data(options) || {};
                return new ClassUserExtern({
                    ...data,
                    uid: data.uid ?? snapshot.id,
                    created_time: ClassUserExtern._toJsDate(data.created_time) ?? new Date(),
                    last_edit_time: ClassUserExtern._toJsDate(data.last_edit_time) ?? new Date(),
                    birthday: ClassUserExtern._toJsDate(data.birthday) ?? new Date(),
                    email: data.email,
                    last_name: data.last_name,
                    first_name: data.first_name,
                    email_verified: data.email_verified,
                    display_name: data.display_name,
                    photo_url: data.photo_url,
                    preferred_language: data.preferred_language,
                    phone_number: data.phone_number,
                    accept_privacy: data.accept_privacy,
                    status: data.status,
                    type: data.type,
                    role: data.role,
                    goals: data.goals,
                    level: data.level,
                    okay_whatsapp: data.okay_whatsapp,
                    okay_newsletter: data.okay_newsletter,
                    okay_other_news: data.okay_other_news,
                    how_know: data.how_know,
                    how_know_text: data.how_know_text,
                });
            },
        };
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

    // ---------- Helpers Firestore ----------    
    static colRef() {
        return collection(firestore, ClassUserExtern.COLLECTION).withConverter(ClassUserExtern.converter);
    }

    static docRef(id) {
        return doc(firestore, ClassUserExtern.COLLECTION, id).withConverter(ClassUserExtern.converter);
    }

    static async count() {
        const q = query(ClassUserExtern.colRef(), where("type", "==", ClassUserExtern.TYPE.EXTERN));
        const qSnap = await getDocs(q);
        return qSnap.docs.length; // -> nombre total
    }

    // Récupérer un module par id
    static async get(id) {
        const snap = await getDoc(ClassUserExtern.docRef(id));
        if (snap.exists()) {
            const data = snap.data();
            return (data);
        }

        return null; // -> ClassModule | null
    }

    // Lister des modules (passer des contraintes Firestore : where(), orderBy(), limit()…)
    static async list(constraints = []) {
        const q = constraints.length ? query(ClassUserExtern.colRef(), where("type", "==", ClassUserExtern.TYPE.EXTERN), ...constraints) : query(ClassUserExtern.colRef(), where("type", "==", ClassUserExtern.TYPE.EXTERN));
        const qSnap = await getDocs(q);
        const users = [];
        for (const d of qSnap.docs) {
            const data = d.data();
            users.push(data);
        }
        return users;
    }

    // Créer un module (avec option timestamps serveur)
    static async create(data = {}, { useServerTimestamps = true } = {}) {
        const newRef = doc(ClassUserExtern.colRef()); // id auto
        const model = data instanceof ClassUserExtern ? data : new ClassUserExtern({ uid: newRef.id, ...data });
        await setDoc(newRef, model);
        if (useServerTimestamps) {
            await updateDoc(newRef, {
                created_time: serverTimestamp(),
                last_edit_time: serverTimestamp(),
            });
        }
        return (await getDoc(newRef)).data(); // -> ClassModule
    }

    // Mettre à jour un module
    static async update(id, patch = {}, { bumpEditTime = true } = {}) {
        const ref = ClassUserExtern.docRef(id);
        const data = bumpEditTime ? { ...patch, last_edit_time: serverTimestamp() } : patch;
        await updateDoc(ref, data);
        return (await getDoc(ref)).data(); // -> ClassModule
    }

    // Supprimer un module
    static async remove(id) {
        await deleteDoc(ClassUserExtern.docRef(id));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get module.");
            return await ClassUserExtern.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchListFromFirestore(constraints = []) {
        try {
            //if (!uid) throw new Error("UID is required to get module.");
            return await ClassUserExtern.list(constraints);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
}
