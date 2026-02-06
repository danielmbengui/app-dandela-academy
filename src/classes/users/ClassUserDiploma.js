// classes/users/ClassUserDiploma.js
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
import { ClassUserStat } from "./ClassUserStat";
import { ClassDiploma } from "../ClassDiploma";

/**
 * ClassUserDiploma — Diplôme obtenu par un utilisateur.
 * Hérite de ClassDiploma (définition du diplôme) et ajoute les données spécifiques à l'utilisateur.
 */
export class ClassUserDiploma extends ClassDiploma {
    static COLLECTION = "DIPLOMAS";
    static NS_COLLECTION = `classes/user-diploma`;
    static USER_DIPLOMA_REFERENCE_PREFIX = "DIPL-USER";

    // Utilise les mentions de ClassDiploma pour le statut du résultat
    static RESULT_STATUS = ClassDiploma.MENTION;
    static RESULT_STATUS_CONFIG = ClassDiploma.MENTION_CONFIG;

    // Compat avec ClassUserStat
    static STATUS_STATS = ClassUserStat.STATUS;
    static ALL_STATUS_STATS = ClassUserStat.ALL_STATUS;
    static STATUS_CONFIG_STATS = ClassUserStat.STATUS_CONFIG;

    constructor({
        // Propriétés héritées de ClassDiploma
        uid = "",
        code = "",
        uid_intern = "",
        title = "",
        title_normalized = "",
        description = "",
        enabled = false,
        category = "",
        level = "",
        format = "",
        status = "", // status du diplôme definition (DRAFT/ACTIVE/ARCHIVED)
        uid_lessons = [],
        lessons = [],
        passing_percentage = 70,
        good_percentage = 80,
        excellent_percentage = 90,
        max_percentage = 100,
        duration_hours_online = 0,
        duration_hours_onsite = 0,
        exam_duration_minutes = 0,
        photo_url = "",
        icon = "",
        color = "",
        translate = {},
        translates = [],
        created_time = null,
        last_edit_time = null,
        // --- Propriétés spécifiques au diplôme utilisateur ---
        uid_diploma = "", // UID de la définition du diplôme parent
        uid_user = "",
        user = null,
        reference = "", // Référence unique du diplôme utilisateur
        mention = "", // Mention obtenue (FAILED/CERTIFIED/GOOD/EXCELLENT/MAX)
        is_excellent = false,
        is_max = false,
        score = 0,
        count_questions = 0,
        percentage = 0,
        stats = [], // Statistiques par chapitre (ClassUserStat[])
        // Informations de passage
        passed_date = null,
        city = "",
        location = "",
        location_address = "",
        obtained_date = null,
    } = {}) {
        // Appel du constructeur parent avec les propriétés de ClassDiploma
        super({
            uid,
            code,
            uid_intern,
            title,
            title_normalized,
            description,
            enabled,
            category,
            level,
            format,
            status,
            uid_lessons,
            lessons,
            passing_percentage,
            good_percentage,
            excellent_percentage,
            max_percentage,
            duration_hours_online,
            duration_hours_onsite,
            exam_duration_minutes,
            photo_url,
            icon,
            color,
            translate,
            translates,
            created_time,
            last_edit_time,
        });

        // Propriétés spécifiques au diplôme utilisateur
        this._uid_diploma = uid_diploma;
        this._uid_user = uid_user;
        this._user = user;
        this._reference = reference;
        this._mention = mention;
        this._is_excellent = is_excellent;
        this._is_max = is_max;
        this._score = score;
        this._count_questions = count_questions;
        this._percentage = percentage;
        this._stats = Array.isArray(stats) ? stats : [];
        // Informations de passage
        this._passed_date = passed_date;
        this._city = city;
        this._location = location;
        this._location_address = location_address;
        this._obtained_date = obtained_date;
    }

    // 🔁 Getters & Setters spécifiques au diplôme utilisateur

    /** UID de la définition du diplôme parent */
    get uid_diploma() { return this._uid_diploma; }
    set uid_diploma(v) { this._uid_diploma = v; this._touchLastEdit(); }

    get uid_user() { return this._uid_user; }
    set uid_user(v) { this._uid_user = v; this._touchLastEdit(); }

    get user() { return this._user; }
    set user(v) { this._user = v; this._touchLastEdit(); }

    get reference() { return this._reference; }
    set reference(v) { this._reference = v; this._touchLastEdit(); }

    /** Mention obtenue (FAILED/CERTIFIED/GOOD/EXCELLENT/MAX) */
    get mention() { return this._mention; }
    set mention(v) { this._mention = v; this._touchLastEdit(); }

    get is_excellent() { return this._is_excellent; }
    set is_excellent(v) { this._is_excellent = v; this._touchLastEdit(); }

    get is_max() { return this._is_max; }
    set is_max(v) { this._is_max = v; this._touchLastEdit(); }

    get score() { return this._score; }
    set score(v) { this._score = v; this._touchLastEdit(); }

    get count_questions() { return this._count_questions; }
    set count_questions(v) { this._count_questions = v; this._touchLastEdit(); }

    get percentage() { return this._percentage; }
    set percentage(v) { this._percentage = v; this._touchLastEdit(); }

    /** Meilleurs résultats par chapitre (tableau de ClassUserStat, rempli par le Provider). */
    get stats() { return this._stats; }
    set stats(v) { this._stats = Array.isArray(v) ? v : []; this._touchLastEdit(); }

    /** Date de passage du diplôme */
    get passed_date() { return this._passed_date; }
    set passed_date(v) { this._passed_date = v; this._touchLastEdit(); }

    /** Ville de passage du diplôme */
    get city() { return this._city; }
    set city(v) { this._city = v; this._touchLastEdit(); }

    /** Nom des locaux / établissement où le diplôme a été passé */
    get location() { return this._location; }
    set location(v) { this._location = v; this._touchLastEdit(); }

    /** Adresse des locaux */
    get location_address() { return this._location_address; }
    set location_address(v) { this._location_address = v; this._touchLastEdit(); }

    /** Date d'obtention du diplôme */
    get obtained_date() { return this._obtained_date; }
    set obtained_date(v) { this._obtained_date = v; this._touchLastEdit(); }

    // --- Méthodes utilitaires ---

    /**
     * Retourne la configuration de la mention actuelle
     */
    getMentionConfig() {
        return ClassDiploma.MENTION_CONFIG[this._mention] || ClassDiploma.MENTION_CONFIG.failed;
    }

    /**
     * Calcule et met à jour la mention en fonction du pourcentage
     */
    computeMention() {
        this._mention = super.getMention(this._percentage);
        this._is_excellent = this._mention === ClassDiploma.MENTION.EXCELLENT || this._mention === ClassDiploma.MENTION.MAX;
        this._is_max = this._mention === ClassDiploma.MENTION.MAX;
        return this._mention;
    }

    /**
     * Retourne la durée totale de formation (en ligne + présentiel) en heures
     */
    getTotalDurationHours() {
        return (this._duration_hours_online || 0) + (this._duration_hours_onsite || 0);
    }

    // --- Serialization ---
    toJSON() {
        return UserDiplomaSerializer.toJSON(this);
    }

    clone() {
        return UserDiplomaSerializer.fromJSON({
            ...this.toJSON(),
            user: this._user,
            lessons: this._lessons?.length ? [...this._lessons] : [],
            stats: this._stats?.length ? [...this._stats] : [],
            translate: this._translate,
            translates: this._translates?.length ? [...this._translates] : [],
        });
    }

    // Override update pour inclure les nouvelles propriétés
    update(props = {}) {
        super.update(props);
        for (const key of ['uid_diploma', 'uid_user', 'reference', 'mention', 'is_excellent', 'is_max', 'score', 'count_questions', 'percentage', 'passed_date', 'city', 'location', 'location_address', 'obtained_date']) {
            if (props[key] !== undefined && Object.prototype.hasOwnProperty.call(this, `_${key}`)) {
                this[`_${key}`] = props[key];
            }
        }
    }

    // ---------- Méthodes statiques ----------

    static makeUserDiploma(uid, data = {}) {
        return new ClassUserDiploma({ uid, ...data });
    }

    static calculatePercentage(score, count_questions) {
        if (count_questions === 0) return 0;
        return (score / count_questions) * 100;
    }

    /**
     * @deprecated Utiliser ClassDiploma.getMentionFromPercentage() à la place
     */
    static getStatusFromPercentage(percentage) {
        if (percentage >= 100) return ClassUserDiploma.STATUS_STATS.MAX;
        if (percentage >= 85) return ClassUserDiploma.STATUS_STATS.EXCELLENT;
        if (percentage >= 70) return ClassUserDiploma.STATUS_STATS.GOOD;
        if (percentage >= 50) return ClassUserDiploma.STATUS_STATS.TO_IMPROVE;
        return ClassUserDiploma.STATUS_STATS.NOT_GOOD;
    }

    static countQuestions(stats = []) {
        if (!stats || stats.length === 0) return 0;
        return stats.reduce((acc, stat) => acc + stat.answers.length, 0);
    }

    static countScore(stats = []) {
        if (!stats || stats.length === 0) return 0;
        return stats.reduce((acc, stat) => acc + stat.score, 0);
    }

    // Override converter pour le diplôme utilisateur
    static get converter() {
        return {
            toFirestore(diplomaInstance) {
                return diplomaInstance?.toJSON ? diplomaInstance.toJSON() : diplomaInstance;
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                const created_time = ClassUserDiploma._toJsDate(data.created_time);
                const last_edit_time = ClassUserDiploma._toJsDate(data.last_edit_time);
                const obtained_date = ClassUserDiploma._toJsDate(data.obtained_date);
                const passed_date = ClassUserDiploma._toJsDate(data.passed_date);
                const percentage = ClassUserDiploma.calculatePercentage(data.score, data.count_questions);
                
                // Calcul de la mention en utilisant les seuils du diplôme ou les valeurs par défaut
                const passingPct = data.passing_percentage ?? 70;
                const goodPct = data.good_percentage ?? 80;
                const excellentPct = data.excellent_percentage ?? 90;
                const maxPct = data.max_percentage ?? 100;
                const mention = ClassDiploma.getMentionFromPercentage(percentage, passingPct, goodPct, excellentPct, maxPct);
                const is_excellent = mention === ClassDiploma.MENTION.EXCELLENT || mention === ClassDiploma.MENTION.MAX;
                const is_max = mention === ClassDiploma.MENTION.MAX;
                
                return ClassUserDiploma.makeUserDiploma(uid, { 
                    ...data, 
                    percentage, 
                    mention, 
                    is_excellent,
                    is_max,
                    created_time,
                    last_edit_time,
                    obtained_date, 
                    passed_date 
                });
            },
        };
    }

    // ---------- Helpers Firestore spécifiques au diplôme utilisateur ----------

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
            console.log("Error", error);
        }
    }

    static indexOf(array = [], uid) {
        if (array.length === 0 || !(array[0] instanceof ClassUserDiploma)) {
            return -1;
        }
        return array.findIndex(item => item.uid === uid);
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
        const diploma = docSnap.data();
        return diploma;
    }

    static async getByDiplomaAndUser(uidDiploma, uidUser) {
        try {
            const col = this.colRefForUser(uidUser);
            if (!col) return null;
            const q = query(col, where("uid_diploma", "==", uidDiploma), limit(1));
            const snaps = await getDocs(q);
            if (snaps.empty) return null;
            return snaps.docs[0].data();
        } catch (error) {
            console.error("ClassUserDiploma.getByDiplomaAndUser", error);
            return null;
        }
    }

    static async list(constraints = []) {
        const ref = ClassUserDiploma.colRef();
        const q = constraints.length ? query(ref, constraints) : query(ref);
        const qSnap = await getDocs(q);
        if (qSnap.size === 0) return [];
        const diplomas = qSnap.docs.map(docSnap => docSnap.data());
        return diplomas || [];
    }

    static async listForUser(uidUser = "", constraints = []) {
        try {
            const col = this.colRefForUser(uidUser);
            if (!col) return [];
            const q = constraints.length ? query(col, ...constraints) : query(col);
            const qSnap = await getDocs(q);
            return qSnap.docs.map(docSnap => docSnap.data());
        } catch (error) {
            console.error("ClassUserDiploma.listForUser", error);
            return [];
        }
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
            console.log("ERROR createFirestoreDoc", error);
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
            console.log("ERROR createFirestoreDocUid", error);
            return null;
        }
    }

    static createReference(code = "", uidUser = "", uidLessons = [], uid = "") {
        const today = new Date();
        const lessonPart = uidLessons.length === 1 
            ? uidLessons[0]?.slice(0, 8) 
            : uidLessons.length > 1 
                ? "MULTI" 
                : "NONE";
        return `${ClassUserDiploma.USER_DIPLOMA_REFERENCE_PREFIX}-${uidUser?.slice(0, 8)}-${code}-${lessonPart}-${today.getFullYear()}-${uid?.slice(0, 8)}`;
    }

    /**
     * Crée un ClassUserDiploma à partir d'une définition de diplôme (ClassDiploma)
     * @param {ClassDiploma} diploma - La définition du diplôme
     * @param {string} uidUser - L'UID de l'utilisateur
     * @param {Object} userDiplomaData - Données spécifiques au diplôme utilisateur
     */
    static fromDiplomaDefinition(diploma, uidUser, userDiplomaData = {}) {
        return new ClassUserDiploma({
            // Propriétés copiées depuis la définition du diplôme
            uid_diploma: diploma.uid,
            code: diploma.code,
            uid_intern: diploma.uid_intern,
            title: diploma.title,
            title_normalized: diploma.title_normalized,
            description: diploma.description,
            category: diploma.category,
            level: diploma.level,
            format: diploma.format,
            uid_lessons: diploma.uid_lessons,
            passing_percentage: diploma.passing_percentage,
            good_percentage: diploma.good_percentage,
            excellent_percentage: diploma.excellent_percentage,
            max_percentage: diploma.max_percentage,
            duration_hours_online: diploma.duration_hours_online,
            duration_hours_onsite: diploma.duration_hours_onsite,
            exam_duration_minutes: diploma.exam_duration_minutes,
            photo_url: diploma.photo_url,
            icon: diploma.icon,
            color: diploma.color,
            translate: diploma.translate,
            translates: diploma.translates,
            // Propriétés spécifiques à l'utilisateur
            uid_user: uidUser,
            ...userDiplomaData,
        });
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
            // Si passed_date n'est pas définie, utiliser la date actuelle
            if (!this._passed_date) {
                this._passed_date = new Date();
            }
            if (!this._reference) {
                this._reference = this.constructor.createReference(this._code ?? "", this._uid_user, this._uid_lessons, this._uid);
            }
            // Calculer la mention si pas déjà définie
            if (!this._mention && this._percentage > 0) {
                this.computeMention();
            }
            await setDoc(newRef, this, { merge: true });
            return this.constructor.makeUserDiploma(this._uid, this.toJSON());
        } catch (error) {
            console.error("ClassUserDiploma.createFirestore", error);
            return null;
        }
    }

    async updateFirestore(patch = {}) {
        try {
            const ref = this.constructor.docRef(this._uid_user, this._uid);
            if (patch && Object.keys(patch).length) {
                this.update(patch);
            }
            this._last_edit_time = new Date();
            await setDoc(ref, this, { merge: true });
            return this.constructor.makeUserDiploma(this._uid, this.toJSON());
        } catch (e) {
            console.error("ClassUserDiploma.updateFirestore", e);
            return null;
        }
    }

    static async remove(uidUser, id) {
        await deleteDoc(ClassUserDiploma.docRef(uidUser, id));
        return true;
    }

    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get DIPLOMA.");
            return await ClassUserDiploma.get(uid);
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

/**
 * Serializer pour ClassUserDiploma
 */
class UserDiplomaSerializer {
    static fieldsToRemove = [
        "lessons",      // tableau d'objets leçons (non persisté)
        "user",         // objet user (non persisté)
        "stats",        // tableau ClassUserStat (non persisté en Firestore)
        "translate",    // traduc active (non persisté directement)
        "translates",   // traduc array (optionnel en Firestore)
    ];

    static toJSON(diploma) {
        const fields = [...this.fieldsToRemove];
        const out = { ...diploma };
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
        return ClassUserDiploma.makeUserDiploma(cleaned.uid ?? "", cleaned);
    }
}
