// classes/modules/ClassModulePart.js
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
    collectionGroup,
    where,
    limit,
} from "firebase/firestore";
import { firestore } from "@/libs/firebase/config";
import { ClassModule } from "./ClassModule";
import { ClassLesson } from "./ClassLesson";
import { language_fr } from "@/libs/i18n/settings";

export class ClassModulePart {
    static COLLECTION = "PARTS";

    constructor({
        uid = "",
        created_time = new Date(),
        last_edit_time = new Date(),
        number = 1,
        title = "",
        subtitle = "",
        module_uid = "",
        module_number = -1,
        lessons = [],
        translations = {},
    } = {}) {
        this._uid = uid;
        this._created_time = created_time;
        this._last_edit_time = last_edit_time;
        this._number = number;
        this._title = title;
        this._subtitle = subtitle;
        this._module_uid = module_uid;
        this._module_number = module_number;
        this._lessons = lessons;
        this._translations = translations;
this._duration = 0;
    }

    // --- GETTERS ---
    get uid() { return this._uid; }
    get created_time() { return this._created_time; }
    get last_edit_time() { return this._last_edit_time; }
    get number() { return this._number; }
    get title() { return this._title; }
    get subtitle() { return this._subtitle; }
    get duration() { return this._duration; }

    get module_uid() { return this._module_uid; }
    get module_number() { return this._module_number; }
    get lessons() { return this._lessons; }
    get translations() { return this._translations; }

    // --- SETTERS ---
    set uid(v) { this._uid = v; }
    set created_time(v) { this._created_time = v; }
    set last_edit_time(v) { this._last_edit_time = v; }
    set number(v) { this._number = v; }
    set title(v) { this._title = v; }
    set subtitle(v) { this._subtitle = v; }
    set duration(v) { this._duration = v; }

    set module_uid(v) { this._module_uid = v; }
    set module_number(v) { this._module_number = v; }
    set lessons(v) { this._lessons = v; }
    set translations(v) { this._translations = v; }

    // --- GETTERS utils ---

    // ---------- GETTERS TRASNLATE ----------
    getTitle(lang = language_fr) {
        return this.translate({ lang, field: "title" })
    }

    // --- Serialization ---
    toJSON() {
        return {
            uid: this._uid,
            created_time: this._created_time,   // si Firestore: remplace par Timestamp.fromDate(...)
            last_edit_time: this._last_edit_time,
            number: this._number,
            title: this._title,
            subtitle: this._subtitle,
            module_uid: this._module_uid,
            module_number: this._module_number,
            lessons: this._lessons,
            //translations: this._translations,
            //duration: this._duration,
        };
    }

    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }

    clone() {
        return new ClassModulePart(this.toJSON());
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

    static get converter() {
        return {
            toFirestore(model) {
                return model.toJSON(); // Firestore convertira Date -> Timestamp
            },
            fromFirestore(snapshot, options) {
                const data = snapshot.data(options) || {};
                return new ClassModulePart({
                    ...data,
                    uid: data.uid ?? snapshot.id,
                    created_time: ClassModulePart._toJsDate(data.created_time) ?? new Date(),
                    last_edit_time: ClassModulePart._toJsDate(data.last_edit_time) ?? new Date(),
                    number: data.number,
                    title: data.title,
                    subtitle: data.subtitle,
                    module_uid: data.module_uid,
                    module_number: data.module_number,
                    lessons: data.lessons,
                    //translations: data.translations ?? {},
                });
            },
        };
    }
    translate({ lang = language_fr, field = "", }) {
        if (!this._uid) throw new Error("UID is required to get module.");
        if (!this.hasOwnProperty(`_${field}`)) throw new Error("field is required to get module.");
        if (lang === language_fr) {
            return this[`_${field}`];
        }
        const _translate = this._translations[lang] || "";
        if (!_translate) throw new Error(`The module with lang ${lang} doesn't exist on the database`);
        return _translate[field] || this[`_${field}`];
    }

    // ---------- Helpers Firestore ----------
    static colRef() {
        return collectionGroup(firestore, ClassModulePart.COLLECTION).withConverter(ClassModulePart.converter);
    }

    /*
        static docRef(id) {
            return doc(firestore, ClassModulePart.COLLECTION, id).withConverter(ClassModulePart.converter);
        }
        */
    static async docRef(id) {
        const q = query(this.colRef(), where("uid", "==", id), limit(1));
        const qs = await getDocs(q);
        if (qs.empty) return null;

        const docSnap = qs.docs[0];
        const data = docSnap.data(); // ta part
        // remonte au parent: (COLLECTION) -> (Document) du module
        const moduleRef = docSnap.ref.parent.parent;
        const moduleId = moduleRef ? moduleRef.id : null;

        return docSnap.ref.withConverter(this.converter);
    }

    static async count(constraints = []) {
        const cg = collectionGroup(firestore, ClassModulePart.COLLECTION);
        const q = query(
            cg,
            ...constraints
        );
        const snap = await getCountFromServer(q);
        return snap.data().count;
    }
    async countLessons() {
        const count = await ClassLesson.count([where("part_uid", "==", this._uid)]);
        return count;
    }
    static async countDurationLessons(uid) {
        const lessons = await ClassLesson.fetchListFromFirestore([where("part_uid", "==", uid)]);
        const totalDuration = (lessons || []).reduce((sum, lesson) => {
            //const { value, unit } = this.constructor._pickDurationValue(lesson, fieldCandidates, unitByField);
            //const seconds = this.constructor._toSeconds(value, unit);
            return sum + lesson.duration;
        }, 0);
        //const count = list;
        return totalDuration;
    }
    // Récupérer un module par id
    static async get(id) {
        const snap = await getDoc(await this.docRef(id));
        if (snap.exists()) {
            const refTranslate = collection(snap.ref, "i18n");
            const snapTranslate = await getDocs(refTranslate);
            const translations = {};
            for (const snapshotT of snapTranslate.docs) {
                translations[snapshotT.ref.id] = snapshotT.data();
            }
            const data = snap.data();
            data.translations = translations;
            data.duration = await this.countDurationLessons(id);
            return (data);
        }
        return null; // -> ClassModulePart | null
    }

    // Lister des modules (passer des contraintes Firestore : where(), orderBy(), limit()…)
    static async list(constraints = []) {
        const q = constraints.length ? query(ClassModulePart.colRef(), ...constraints) : query(ClassModulePart.colRef());
        const qSnap = await getDocs(q);
        const modules = [];
        for (const d of qSnap.docs) {
            const refTranslate = collection(d.ref, "i18n");
            const snapTranslate = await getDocs(refTranslate);
            const translations = {};
            for (const snapshotT of snapTranslate.docs) {
                translations[snapshotT.ref.id] = snapshotT.data();
            }
            //d.data();
            const data = d.data();
            data.translations = translations;
            data.duration = await this.countDurationLessons(d.id);
            modules.push(data);
        }
        return modules;
    }

    // Créer un module (avec option timestamps serveur)
    static async create(data = {}, { useServerTimestamps = true } = {}) {
        const newRef = doc(ClassModulePart.colRef()); // id auto
        const model = data instanceof ClassModulePart ? data : new ClassModulePart({ uid: newRef.id, ...data });
        await setDoc(newRef, model);
        if (useServerTimestamps) {
            await updateDoc(newRef, {
                created_time: serverTimestamp(),
                last_edit_time: serverTimestamp(),
            });
        }
        return (await getDoc(newRef)).data(); // -> ClassModulePart
    }

    // Mettre à jour un module
    static async update(id, patch = {}, { bumpEditTime = true } = {}) {
        const ref = await ClassModulePart.docRef(id);
        const data = bumpEditTime ? { ...patch, last_edit_time: serverTimestamp() } : patch;
        await updateDoc(ref, data);
        return (await getDoc(ref)).data(); // -> ClassModulePart
    }

    // Supprimer un module
    static async remove(id) {
        await deleteDoc(await ClassModulePart.docRef(id));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get module.");
            return await ClassModulePart.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchListFromFirestore(constraints = []) {
        try {
            //if (!uid) throw new Error("UID is required to get module.");
            return await ClassModulePart.list(constraints);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
}
