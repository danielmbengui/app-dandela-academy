// classes/ClassDiploma.js
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
import { defaultLanguage } from "@/contexts/i18n/settings";

/**
 * ClassDiploma — Modèle de diplôme générique (non lié à un utilisateur).
 * Représente la définition d'un diplôme disponible dans l'application.
 */
export class ClassDiploma {
    static COLLECTION = "DIPLOMAS_DEFINITIONS";
    static COLLECTION_TRANSLATE = "i18n";
    static NS_COLLECTION = `classes/diploma`;
    static DIPLOMA_REFERENCE_PREFIX = "DIPL-DAND";

    static ERROR = Object.freeze({
        ALREADY_EXISTS: 'already-exists',
        NOT_FOUND: 'not-found',
        UNKNOWN: 'unknown',
    });

    static FORMAT = Object.freeze({
        ONLINE: 'online',     // en ligne
        ONSITE: 'onsite',     // sur site
        HYBRID: 'hybrid',     // hybride
    });

    static CATEGORY = Object.freeze({
        OFFICE: 'office',     // bureautique
        IT: 'it',             // informatique
        LANGUAGE: 'language', // langues
        MANAGEMENT: 'management', // gestion
        UNKNOWN: 'unknown',
    });

    static LEVEL = Object.freeze({
        BEGINNER: 'beginner',         // débutant
        INTERMEDIATE: 'intermediate', // intermédiaire
        COMPETENT: 'competent',       // compétent
        ADVANCED: 'advanced',         // avancé
        EXPERT: 'expert',             // expert
        UNKNOWN: 'unknown',
    });

    static STATUS = Object.freeze({
        DRAFT: 'draft',       // brouillon
        ACTIVE: 'active',     // actif
        ARCHIVED: 'archived', // archivé
        UNKNOWN: 'unknown',
    });

    static STATUS_CONFIG = Object.freeze({
        draft: {
            label: "draft",
            color: "var(--status-draft)",
            glow: "var(--status-draft-glow)",
        },
        active: {
            label: "active",
            color: "var(--status-active)",
            glow: "var(--status-active-glow)",
        },
        archived: {
            label: "archived",
            color: "var(--status-archived)",
            glow: "var(--status-archived-glow)",
        },
    });

    /** Mentions possibles pour un diplôme */
    static MENTION = Object.freeze({
        FAILED: 'failed',       // Non certifié (< passing)
        CERTIFIED: 'certified', // Certifié sans mention (>= passing, < good)
        GOOD: 'good',           // Mention Bien (>= good, < excellent)
        EXCELLENT: 'excellent', // Mention Excellent (>= excellent)
        MAX: 'max', // Mention Excellent (>= excellent)
    });

    /** Configuration visuelle des mentions */
    static MENTION_CONFIG = Object.freeze({
        failed: {
            label: "Non certifié",
            labelKey: "failed",
            icon: "ph:x-circle-fill",
            color: "#ef4444",
            glow: "#ef444454",
            ribbon: "Non certifié",
            badge: "Score insuffisant — Diplôme non délivré",
        },
        certified: {
            label: "Certifié",
            labelKey: "certified",
            icon: "ph:certificate-fill",
            color: "#3b82f6",
            glow: "#3b82f654",
            ribbon: "Certifié",
            badge: "Parcours réussi — Diplôme délivré",
        },
        good: {
            label: "Mention Bien",
            labelKey: "good",
            icon: "ph:medal-fill",
            color: "#22c55e",
            glow: "#22c55e54",
            ribbon: "Mention Bien",
            badge: "Félicitations ! Résultat remarquable",
        },
        excellent: {
            label: "Mention Excellent",
            labelKey: "excellent",
            icon: "ph:trophy-fill",
            color: "#f59e0b",
            glow: "#f59e0b54",
            ribbon: "Mention Excellent",
            badge: "Félicitations ! Résultat excellent",
        },
        max: {
            label: "Score Parfait",
            labelKey: "max",
            icon: "ph:crown-fill",
            color: "#8b5cf6",
            glow: "#8b5cf654",
            ribbon: "Score Parfait",
            badge: "Exceptionnel ! Score parfait de 100%",
        },
    });

    static ALL_MENTIONS = Object.values(ClassDiploma.MENTION);
    static ALL_CATEGORIES = Object.values(ClassDiploma.CATEGORY).filter(c => c !== ClassDiploma.CATEGORY.UNKNOWN);
    static ALL_LEVELS = Object.values(ClassDiploma.LEVEL).filter(l => l !== ClassDiploma.LEVEL.UNKNOWN);
    static ALL_FORMATS = Object.values(ClassDiploma.FORMAT);
    static ALL_STATUS = Object.values(ClassDiploma.STATUS).filter(s => s !== ClassDiploma.STATUS.UNKNOWN);

    constructor({
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
        status = "",
        // Leçons associées au diplôme
        uid_lessons = [],
        lessons = [],
        // Seuils de réussite et mentions
        passing_percentage = 70,       // pourcentage minimum pour réussir (certifié)
        good_percentage = 80,          // pourcentage pour mention "Bien"
        excellent_percentage = 90,     // pourcentage pour mention "Excellent"
        max_percentage = 100,          // pourcentage pour score parfait
        // Durées de formation
        duration_hours_online = 0,     // durée en heures (formation en ligne)
        duration_hours_onsite = 0,     // durée en heures (formation en présentiel)
        exam_duration_minutes = 0,     // durée de l'examen en minutes
        // Métadonnées visuelles
        photo_url = "",
        icon = "",
        color = "",
        // Traductions
        translate = {},
        translates = [],
        // Timestamps
        created_time = null,
        last_edit_time = null,
    } = {}) {
        this._uid = uid;
        this._code = code;
        this._uid_intern = uid_intern;
        this._title = title;
        this._title_normalized = title_normalized;
        this._description = description;
        this._enabled = enabled;
        this._category = this._normalizeCategory(category);
        this._level = this._normalizeLevel(level);
        this._format = this._normalizeFormat(format);
        this._status = this._normalizeStatus(status);
        // Leçons
        this._uid_lessons = Array.isArray(uid_lessons) ? uid_lessons : [];
        this._lessons = Array.isArray(lessons) ? lessons : [];
        // Seuils de réussite et mentions
        this._passing_percentage = passing_percentage;
        this._good_percentage = good_percentage;
        this._excellent_percentage = excellent_percentage;
        this._max_percentage = max_percentage;
        // Durées de formation
        this._duration_hours_online = duration_hours_online;
        this._duration_hours_onsite = duration_hours_onsite;
        this._exam_duration_minutes = exam_duration_minutes;
        // Métadonnées visuelles
        this._photo_url = photo_url;
        this._icon = icon;
        this._color = color;
        // Traductions
        this._translate = translate;
        this._translates = Array.isArray(translates) ? translates : [];
        // Timestamps
        this._created_time = created_time;
        this._last_edit_time = last_edit_time;
    }

    // --- Normalisations internes ---
    _normalizeCategory(category) {
        return Object.values(ClassDiploma.CATEGORY).includes(category)
            ? category
            : ClassDiploma.CATEGORY.UNKNOWN;
    }
    _normalizeLevel(level) {
        return Object.values(ClassDiploma.LEVEL).includes(level)
            ? level
            : ClassDiploma.LEVEL.UNKNOWN;
    }
    _normalizeFormat(format) {
        return Object.values(ClassDiploma.FORMAT).includes(format)
            ? format
            : ClassDiploma.FORMAT.ONLINE;
    }
    _normalizeStatus(status) {
        return Object.values(ClassDiploma.STATUS).includes(status)
            ? status
            : ClassDiploma.STATUS.DRAFT;
    }
    _touchLastEdit() {
        this._last_edit_time = new Date();
    }

    // 🔁 Getters & Setters
    get uid() { return this._uid; }
    set uid(v) { this._uid = v; this._touchLastEdit(); }

    get code() { return this._code; }
    set code(v) { this._code = v; this._touchLastEdit(); }

    get uid_intern() { return this._uid_intern; }
    set uid_intern(v) { this._uid_intern = v; this._touchLastEdit(); }

    get title() { return this._title; }
    set title(v) { 
        this._title = v; 
        this._title_normalized = this._createTitleNormalized(v);
        this._touchLastEdit(); 
    }

    get title_normalized() { return this._title_normalized; }
    set title_normalized(v) { this._title_normalized = v; this._touchLastEdit(); }

    get description() { return this._description; }
    set description(v) { this._description = v; this._touchLastEdit(); }

    get enabled() { return this._enabled; }
    set enabled(v) { this._enabled = v; this._touchLastEdit(); }

    get category() { return this._category; }
    set category(v) { this._category = this._normalizeCategory(v); this._touchLastEdit(); }

    get level() { return this._level; }
    set level(v) { this._level = this._normalizeLevel(v); this._touchLastEdit(); }

    get format() { return this._format; }
    set format(v) { this._format = this._normalizeFormat(v); this._touchLastEdit(); }

    get status() { return this._status; }
    set status(v) { this._status = this._normalizeStatus(v); this._touchLastEdit(); }

    get uid_lessons() { return this._uid_lessons; }
    set uid_lessons(v) { this._uid_lessons = Array.isArray(v) ? v : []; this._touchLastEdit(); }

    get lessons() { return this._lessons; }
    set lessons(v) { this._lessons = Array.isArray(v) ? v : []; this._touchLastEdit(); }

    get passing_percentage() { return this._passing_percentage; }
    set passing_percentage(v) { this._passing_percentage = v; this._touchLastEdit(); }

    get good_percentage() { return this._good_percentage; }
    set good_percentage(v) { this._good_percentage = v; this._touchLastEdit(); }

    get excellent_percentage() { return this._excellent_percentage; }
    set excellent_percentage(v) { this._excellent_percentage = v; this._touchLastEdit(); }

    get max_percentage() { return this._max_percentage; }
    set max_percentage(v) { this._max_percentage = v; this._touchLastEdit(); }

    get duration_hours_online() { return this._duration_hours_online; }
    set duration_hours_online(v) { this._duration_hours_online = v; this._touchLastEdit(); }

    get duration_hours_onsite() { return this._duration_hours_onsite; }
    set duration_hours_onsite(v) { this._duration_hours_onsite = v; this._touchLastEdit(); }

    get exam_duration_minutes() { return this._exam_duration_minutes; }
    set exam_duration_minutes(v) { this._exam_duration_minutes = v; this._touchLastEdit(); }

    get photo_url() { return this._photo_url; }
    set photo_url(v) { this._photo_url = v; this._touchLastEdit(); }

    get icon() { return this._icon; }
    set icon(v) { this._icon = v; this._touchLastEdit(); }

    get color() { return this._color; }
    set color(v) { this._color = v; this._touchLastEdit(); }

    get translate() { return this._translate; }
    set translate(v) { this._translate = v; this._touchLastEdit(); }

    get translates() { return this._translates; }
    set translates(v) { this._translates = Array.isArray(v) ? v : []; this._touchLastEdit(); }

    get created_time() { return this._created_time; }
    set created_time(v) { this._created_time = v; this._touchLastEdit(); }

    get last_edit_time() { return this._last_edit_time; }
    set last_edit_time(v) { this._last_edit_time = v; this._touchLastEdit(); }

    // --- Méthodes utilitaires ---
    _createTitleNormalized(title = '') {
        return title.toLowerCase().trim().replace(/\s+/g, '_');
    }

    /**
     * Vérifie si un pourcentage donné atteint le seuil de réussite (certifié)
     */
    isPassing(percentage) {
        return percentage >= this._passing_percentage;
    }

    /**
     * Vérifie si un pourcentage donné atteint le seuil "Bien"
     */
    isGood(percentage) {
        return percentage >= this._good_percentage;
    }

    /**
     * Vérifie si un pourcentage donné atteint le seuil "Excellent"
     */
    isExcellent(percentage) {
        return percentage >= this._excellent_percentage;
    }

    /**
     * Vérifie si un pourcentage donné atteint le score parfait (max)
     */
    isMax(percentage) {
        return percentage >= this._max_percentage;
    }

    /**
     * Retourne la mention en fonction du pourcentage
     * @param {number} percentage - Le pourcentage obtenu
     * @returns {'failed'|'certified'|'good'|'excellent'|'max'} La mention correspondante
     */
    getMention(percentage) {
        if (percentage >= this._max_percentage) return ClassDiploma.MENTION.MAX;
        if (percentage >= this._excellent_percentage) return ClassDiploma.MENTION.EXCELLENT;
        if (percentage >= this._good_percentage) return ClassDiploma.MENTION.GOOD;
        if (percentage >= this._passing_percentage) return ClassDiploma.MENTION.CERTIFIED;
        return ClassDiploma.MENTION.FAILED;
    }

    /**
     * Retourne la configuration visuelle de la mention pour un pourcentage donné
     * @param {number} percentage - Le pourcentage obtenu
     * @returns {Object} La configuration de la mention (label, icon, color, etc.)
     */
    getMentionConfig(percentage) {
        const mention = this.getMention(percentage);
        return ClassDiploma.MENTION_CONFIG[mention] || ClassDiploma.MENTION_CONFIG.failed;
    }

    /**
     * Retourne le statut en fonction du pourcentage (alias de getMention pour compatibilité)
     * @deprecated Utilisez getMention() à la place
     */
    getResultStatus(percentage) {
        return this.getMention(percentage);
    }

    /**
     * Méthode statique pour obtenir la mention sans instance
     * @param {number} percentage - Le pourcentage obtenu
     * @param {number} passingPct - Seuil de réussite (défaut: 70)
     * @param {number} goodPct - Seuil mention Bien (défaut: 80)
     * @param {number} excellentPct - Seuil mention Excellent (défaut: 90)
     * @param {number} maxPct - Seuil score parfait (défaut: 100)
     */
    static getMentionFromPercentage(percentage, passingPct = 70, goodPct = 80, excellentPct = 90, maxPct = 100) {
        if (percentage >= maxPct) return ClassDiploma.MENTION.MAX;
        if (percentage >= excellentPct) return ClassDiploma.MENTION.EXCELLENT;
        if (percentage >= goodPct) return ClassDiploma.MENTION.GOOD;
        if (percentage >= passingPct) return ClassDiploma.MENTION.CERTIFIED;
        return ClassDiploma.MENTION.FAILED;
    }

    /**
     * Méthode statique pour obtenir la config de mention sans instance
     */
    static getMentionConfigFromPercentage(percentage, passingPct = 70, goodPct = 80, excellentPct = 90, maxPct = 100) {
        const mention = ClassDiploma.getMentionFromPercentage(percentage, passingPct, goodPct, excellentPct, maxPct);
        return ClassDiploma.MENTION_CONFIG[mention] || ClassDiploma.MENTION_CONFIG.failed;
    }

    // --- Serialization ---
    toJSON() {
        return DiplomaDefinitionSerializer.toJSON(this);
    }

    clone() {
        // Copie profonde des translates pour éviter les problèmes de référence partagée
        const translatesCloned = this._translates?.length 
            ? this._translates.map(tr => tr?.clone ? tr.clone() : new ClassDiplomaTranslate(tr))
            : [];
        const translateCloned = this._translate?.clone 
            ? this._translate.clone() 
            : this._translate 
                ? new ClassDiplomaTranslate(this._translate) 
                : null;
        return DiplomaDefinitionSerializer.fromJSON({
            ...this.toJSON(),
            translate: translateCloned,
            translates: translatesCloned,
            lessons: this._lessons?.length ? [...this._lessons] : [],
        });
    }

    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
        this._touchLastEdit();
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

    static makeDiplomaInstance(uid, data = {}) {
        return new ClassDiploma({ uid, ...data });
    }

    static get converter() {
        return {
            toFirestore(diplomaInstance) {
                const translates = diplomaInstance._convertTranslatesToFirestore?.(diplomaInstance.translates) || {};
                return diplomaInstance?.toJSON 
                    ? { ...diplomaInstance.toJSON(), translates } 
                    : { ...diplomaInstance, translates };
            },
            fromFirestore(snapshot, options) {
                const uid = snapshot.id;
                const data = snapshot.data(options) || {};
                const created_time = ClassDiploma._toJsDate(data.created_time);
                const last_edit_time = ClassDiploma._toJsDate(data.last_edit_time);
                const translates = data.translates 
                    ? Object.values(data.translates).map(trans => new ClassDiplomaTranslate(trans))
                    : [];
                // Propager title et description depuis la première traduction si non définis au niveau racine
                const firstTranslate = translates[0] || null;
                const title = data.title || firstTranslate?.title || "";
                const description = data.description || firstTranslate?.description || "";
                return ClassDiploma.makeDiplomaInstance(uid, { 
                    ...data, 
                    title,
                    description,
                    created_time, 
                    last_edit_time, 
                    translates 
                });
            },
        };
    }

    _convertTranslatesToFirestore(translates = []) {
        const translatesObj = {};
        for (const trans of translates) {
            translatesObj[trans.lang] = trans.toJSON?.() || trans || {};
        }
        return translatesObj;
    }

    // ---------- Helpers Firestore ----------
    static colRef() {
        return collection(firestore, this.COLLECTION).withConverter(this.converter);
    }

    static docRef(id) {
        return doc(firestore, this.COLLECTION, id).withConverter(this.converter);
    }

    static async count(constraints = []) {
        try {
            const q = query(this.colRef(), ...constraints);
            const snap = await getCountFromServer(q);
            return snap.data().count;
        } catch (error) {
            console.error("ClassDiploma.count", error);
            return 0;
        }
    }

    static indexOf(array = [], uid) {
        if (array.length === 0 || !(array[0] instanceof ClassDiploma)) {
            return -1;
        }
        return array.findIndex(item => item.uid === uid);
    }

    static async alreadyExist(uid) {
        const q = query(
            collection(firestore, ClassDiploma.COLLECTION),
            where("uid", "==", uid)
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }

    static async alreadyExistByCode(code) {
        const q = query(
            collection(firestore, ClassDiploma.COLLECTION),
            where("code", "==", code)
        );
        const countSnap = await getCountFromServer(q);
        return countSnap.data().count > 0;
    }

    static async get(uid, lang = defaultLanguage) {
        try {
            const snap = await getDoc(this.docRef(uid));
            if (snap.exists()) {
                const diploma = snap.data();
                const translate = diploma.translates?.find(item => item.lang === lang);
                diploma.translate = translate;
                return diploma;
            }
            return null;
        } catch (error) {
            console.error("ClassDiploma.get", error);
            return null;
        }
    }

    static async getByCode(code, lang = defaultLanguage) {
        try {
            const q = query(
                collection(firestore, ClassDiploma.COLLECTION).withConverter(ClassDiploma.converter),
                where("code", "==", code),
                limit(1)
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
                const diploma = snap.docs[0].data();
                const translate = diploma.translates?.find(item => item.lang === lang);
                diploma.translate = translate;
                return diploma;
            }
            return null;
        } catch (error) {
            console.error("ClassDiploma.getByCode", error);
            return null;
        }
    }

    static async list(lang = defaultLanguage, constraints = []) {
        try {
            const q = constraints.length 
                ? query(this.colRef(), ...constraints) 
                : query(this.colRef());
            const qSnap = await getDocs(q);
            const diplomas = [];
            for (const docSnap of qSnap.docs) {
                const diploma = docSnap.data();
                const translate = diploma.translates?.find(item => item.lang === lang);
                diploma.translate = translate;
                diplomas.push(diploma);
            }
            return diplomas;
        } catch (error) {
            console.error("ClassDiploma.list", error);
            return [];
        }
    }

    static async listActive(lang = defaultLanguage) {
        return this.list(lang, [
            where("enabled", "==", true),
            where("status", "==", ClassDiploma.STATUS.ACTIVE),
        ]);
    }

    static async listByCategory(category, lang = defaultLanguage) {
        return this.list(lang, [
            where("category", "==", category),
            where("enabled", "==", true),
        ]);
    }

    static async listByLevel(level, lang = defaultLanguage) {
        return this.list(lang, [
            where("level", "==", level),
            where("enabled", "==", true),
        ]);
    }

    createFirestoreDocUid() {
        try {
            const newRef = doc(this.constructor.colRef());
            return newRef.id;
        } catch (error) {
            console.error("ClassDiploma.createFirestoreDocUid", error);
            return null;
        }
    }

    async createFirestore() {
        try {
            if (!this._uid) {
                const newRef = doc(this.constructor.colRef());
                this._uid = newRef.id;
            }
            if (!this._uid_intern) {
                const countDiploma = await this.constructor.count() || 0;
                this._uid_intern = countDiploma + 1;
            }
            if (!this._title_normalized && this._title) {
                this._title_normalized = this._createTitleNormalized(this._title);
            }
            const ref = this.constructor.docRef(this._uid);
            this._created_time = new Date();
            this._last_edit_time = new Date();
            await setDoc(ref, this, { merge: true });
            return this.constructor.makeDiplomaInstance(this._uid, this.toJSON());
        } catch (error) {
            console.error("ClassDiploma.createFirestore", error);
            return null;
        }
    }

    async updateFirestore(patch = {}) {
        try {
            const ref = this.constructor.docRef(this._uid);
            if (patch && Object.keys(patch).length) {
                this.update(patch);
            }
            this._last_edit_time = new Date();
            await setDoc(ref, this, { merge: true });
            return this.constructor.makeDiplomaInstance(this._uid, this.toJSON());
        } catch (error) {
            console.error("ClassDiploma.updateFirestore", error);
            return null;
        }
    }

    async removeFirestore() {
        try {
            const ref = this.constructor.docRef(this._uid);
            await deleteDoc(ref);
            return true;
        } catch (error) {
            console.error("ClassDiploma.removeFirestore", error);
            return false;
        }
    }

    static async remove(id) {
        try {
            await deleteDoc(ClassDiploma.docRef(id));
            return true;
        } catch (error) {
            console.error("ClassDiploma.remove", error);
            return false;
        }
    }

    static async fetchFromFirestore(uid, lang = defaultLanguage) {
        try {
            if (!uid) throw new Error("UID is required to get diploma.");
            return await ClassDiploma.get(uid, lang);
        } catch (error) {
            console.error("ClassDiploma.fetchFromFirestore", error?.message || error);
            return null;
        }
    }

    static async fetchListFromFirestore(lang = defaultLanguage, constraints = []) {
        try {
            return await this.list(lang, constraints);
        } catch (error) {
            console.error("ClassDiploma.fetchListFromFirestore", error?.message || error);
            return [];
        }
    }
}

/**
 * Serializer pour ClassDiploma
 * Inclut tous les attributs de ClassDiplomaTranslate (lang, title, description, prerequisites, goals, photo_url)
 */
class DiplomaDefinitionSerializer {
    // Champs à supprimer lors de la sérialisation pour Firestore (pas pour clone)
    static fieldsToRemoveForFirestore = [
        'translate',
        'lessons',
        'prerequisites',
        'goals',
        'photo_url',
    ];
    // Champs à supprimer lors de toJSON (garder title et description pour clone)
    static fieldsToRemove = [
        'translate',
        'lessons',
        'prerequisites',
        'goals',
        'photo_url',
    ];

    /** Attributs de ClassDiplomaTranslate pour référence */
    static translateFields = [

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
        return ClassDiploma.makeDiplomaInstance(cleaned.uid ?? "", cleaned);
    }

    /**
     * Extrait les champs de traduction d'un objet diplôme
     * @param {Object} diploma - Instance de ClassDiploma
     * @param {string} lang - Langue cible
     * @returns {Object} Objet avec les champs de traduction
     */
    static extractTranslateFields(diploma, lang = '') {
        const translate = diploma?.translate || diploma?.translates?.find(t => t.lang === lang);
        if (!translate) return null;
        return {
            lang: translate.lang,
            title: translate.title,
            description: translate.description,
            prerequisites: translate.prerequisites,
            goals: translate.goals,
            photo_url: translate.photo_url,
        };
    }
}

/**
 * ClassDiplomaTranslate — Traduction d'un diplôme
 */
export class ClassDiplomaTranslate {
    static COLLECTION = "i18n";
    static NS_COLLECTION = `classes/diploma`;

    constructor({
        lang = "",
        title = "",
        description = "",
        prerequisites = [],
        goals = [],
        photo_url = "",
    } = {}) {
        this._lang = lang;
        this._title = title;
        this._description = description;
        this._prerequisites = Array.isArray(prerequisites) ? prerequisites : [];
        this._goals = Array.isArray(goals) ? goals : [];
        this._photo_url = photo_url;
    }

    // Getters & Setters
    get lang() { return this._lang; }
    set lang(v) { this._lang = v || ""; }

    get title() { return this._title; }
    set title(v) { this._title = v || ""; }

    get description() { return this._description; }
    set description(v) { this._description = v || ""; }

    get prerequisites() { return this._prerequisites; }
    set prerequisites(v) { this._prerequisites = Array.isArray(v) ? v : []; }

    get goals() { return this._goals; }
    set goals(v) { this._goals = Array.isArray(v) ? v : []; }

    get photo_url() { return this._photo_url; }
    set photo_url(v) { this._photo_url = v || ""; }

    toJSON() {
        const out = { ...this };
        return Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v])
        );
    }

    clone() {
        return new ClassDiplomaTranslate(this.toJSON());
    }

    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
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

    static makeDiplomaTranslateInstance(lang, data = {}) {
        return new ClassDiplomaTranslate({ lang, ...data });
    }

    static get converter() {
        return {
            toFirestore(translateInstance) {
                return translateInstance?.toJSON ? translateInstance.toJSON() : translateInstance;
            },
            fromFirestore(snapshot, options) {
                const lang = snapshot.id;
                const data = snapshot.data(options) || {};
                return ClassDiplomaTranslate.makeDiplomaTranslateInstance(lang, { ...data, lang });
            },
        };
    }

    // ---------- Helpers Firestore ----------
    static colRef(uidDiploma = "") {
        return collection(firestore, ClassDiploma.COLLECTION, uidDiploma, ClassDiplomaTranslate.COLLECTION).withConverter(this.converter);
    }

    static docRef(uidDiploma = "", lang = "") {
        return doc(firestore, ClassDiploma.COLLECTION, uidDiploma, ClassDiplomaTranslate.COLLECTION, lang).withConverter(this.converter);
    }

    static async get(uidDiploma, lang) {
        try {
            const snap = await getDoc(this.docRef(uidDiploma, lang));
            if (snap.exists()) {
                return snap.data();
            }
            return null;
        } catch (error) {
            console.error("ClassDiplomaTranslate.get", error);
            return null;
        }
    }

    static async list(uidDiploma = "", constraints = []) {
        try {
            const q = constraints.length 
                ? query(this.colRef(uidDiploma), ...constraints) 
                : query(this.colRef(uidDiploma));
            const qSnap = await getDocs(q);
            return qSnap.docs.map(item => item.data());
        } catch (error) {
            console.error("ClassDiplomaTranslate.list", error);
            return [];
        }
    }

    static async fetchFromFirestore(uidDiploma, lang = defaultLanguage) {
        try {
            if (!lang) throw new Error("LANG is required.");
            return await this.get(uidDiploma, lang);
        } catch (error) {
            console.error("ClassDiplomaTranslate.fetchFromFirestore", error?.message || error);
            return null;
        }
    }

    static async fetchListFromFirestore(uidDiploma = "", constraints = []) {
        try {
            return await this.list(uidDiploma, constraints);
        } catch (error) {
            console.error("ClassDiplomaTranslate.fetchListFromFirestore", error?.message || error);
            return [];
        }
    }
}
