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
    collectionGroup,
    where,
    limit,
} from "firebase/firestore";
import { firestore } from "@/libs/firebase/config";
import { ClassModulePart } from "./ClassModulePart";
import { language_fr } from "@/libs/i18n/settings";

export class ClassLesson {
    static COLLECTION = "LESSONS";
    static CLOUD_FUNCTION_GET_ONE = "https://us-central1-dandelapp-bbe09.cloudfunctions.net/getOneLesson";

    constructor({
        uid = "",
        created_time = new Date(),
        last_edit_time = new Date(),
        number = -1,
        title = "",
        subtitle = "",
        duration = 0,
        description = "",
        video = "",

        part_uid = "",
        part_number = -1,
        part_title = "",
        module_uid = "",
        module_number = -1,
        translations = {},
    } = {}) {
        this._uid = uid;
        this._created_time = created_time;
        this._last_edit_time = last_edit_time;
        this._number = number;
        this._title = title;
        this._subtitle = subtitle;
        this._duration = duration;
        this._description = description;
        this._video = video;

        this._part_uid = part_uid;
        this._part_number = part_number;
        this._part_title = part_title;
        this._module_uid = module_uid;
        this._module_number = module_number;
        this._translations = translations;
    }

    // --- GETTERS ---
    get uid() { return this._uid; }
    get created_time() { return this._created_time; }
    get last_edit_time() { return this._last_edit_time; }
    get number() { return this._number; }
    get title() { return this._title; }
    get subtitle() { return this._subtitle; }
    get duration() { return this._duration; }
    get description() { return this._description; }
    get video() { return this._video; }

    get part_uid() { return this._part_uid; }
    get part_number() { return this._part_number; }
    get part_title() { return this._part_title; }
    get module_uid() { return this._module_uid; }
    get module_number() { return this._module_number; }
    get translations() { return this._translations; }

    // --- SETTERS ---
    set uid(v) { this._uid = v; }
    set created_time(v) { this._created_time = v; }
    set last_edit_time(v) { this._last_edit_time = v; }
    set number(v) { this._number = v; }
    set title(v) { this._title = v; }
    set subtitle(v) { this._subtitle = v; }
    set duration(v) { this._duration = v; }
    set description(v) { this._description = v; }
    set video(v) { this._video = v; }

    set part_uid(v) { this._part_uid = v; }
    set part_number(v) { this._part_number = v; }
    set part_title(v) { this._part_title = v; }
    set module_uid(v) { this._module_uid = v; }
    set module_number(v) { this._module_number = v; }
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
            duration:this._duration,
            description: this._description,
            video: this._video,
            part_uid: this._part_uid,
            part_number: this._part_number,
            part_title: this._part_title,
            module_uid: this._module_uid,
            module_number: this._module_number,
            translations: this._translations,
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
        return new ClassLesson(this.toJSON());
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
                return new ClassLesson({
                    ...data,
                    uid: data.uid ?? snapshot.id,
                    created_time: ClassLesson._toJsDate(data.created_time) ?? new Date(),
                    last_edit_time: ClassLesson._toJsDate(data.last_edit_time) ?? new Date(),

                    number: data.number,
                    title: data.title,
                    subtitle: data.subtitle,
                    duration:data.duration,
                    description: data.description,
                    video: data.video,
                    part_uid: data.part_uid,
                    part_number: data.part_number,
                    part_title: data.part_title,
                    module_uid: data.module_uid,
                    module_number: data.module_number,
                    translations: data.translations,
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
        return collectionGroup(firestore, ClassLesson.COLLECTION).withConverter(ClassLesson.converter);
    }
    static async docRef(id) {
        const q = query(this.colRef(), where("uid", "==", id), limit(1));
        const qs = await getDocs(q);
        if (qs.empty) return null;

        const docSnap = qs.docs[0];
        //const data = docSnap.data(); // ta part
        // remonte au parent: (COLLECTION) -> (Document) du module
        //const moduleRef = docSnap.ref.parent.parent;
        //const moduleId = moduleRef ? moduleRef.id : null;

        return docSnap.ref.withConverter(this.converter);
    }
    static async count(constraints = []) {
        const cg = collectionGroup(firestore, ClassLesson.COLLECTION);
        const q = query(
            cg,
            ...constraints
          );
        const snap = await getCountFromServer(q);
        return snap.data().count;
    }

    // Récupérer un module par id
    static async get(id) {
        const snap = await getDoc(await ClassLesson.docRef(id));
        if (snap.exists()) {
            const refTranslate = collection(snap.ref, "i18n");
            const snapTranslate = await getDocs(refTranslate);
            const translations = {};
            for (const snapshotT of snapTranslate.docs) {
                translations[snapshotT.ref.id] = snapshotT.data();
            }
            const data = snap.data();
            data.translations = translations;
            return (data);
        }

        return null; // -> ClassModulePart | null
    }

    // Lister des modules (passer des contraintes Firestore : where(), orderBy(), limit()…)
    static async list(constraints = []) {
        const q = constraints.length ? query(ClassLesson.colRef(), ...constraints) : query(ClassLesson.colRef());
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
            modules.push(data);
        }
        return modules;
    }

    // Créer un module (avec option timestamps serveur)
    static async create(data = {}, { useServerTimestamps = true } = {}) {
        const newRef = doc(ClassLesson.colRef()); // id auto
        const model = data instanceof ClassLesson ? data : new ClassLesson({ uid: newRef.id, ...data });
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
        const ref = ClassLesson.docRef(id);
        const data = bumpEditTime ? { ...patch, last_edit_time: serverTimestamp() } : patch;
        await updateDoc(ref, data);
        return (await getDoc(ref)).data(); // -> ClassModule
    }

    // Supprimer un module
    static async remove(id) {
        await deleteDoc(ClassLesson.docRef(id));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get module.");
            return await ClassLesson.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchListFromFirestore(constraints = []) {
        try {
            //if (!uid) throw new Error("UID is required to get module.");
            return await ClassLesson.list(constraints);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
}
