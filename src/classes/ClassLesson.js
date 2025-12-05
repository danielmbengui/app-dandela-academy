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

export class ClassLesson {
    static ERROR = Object.freeze({
        ALREADY_EXISTS: 'already-exists',
        UNKNOWN: 'unknown',
    });
    static COLLECTION = "LESSONS";

    constructor({
        uid = "",
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        this._uid = uid;
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

    // --- GETTERS ---
    get uid() {
        return this._uid;
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
        //return ClassLesson.makeSchoolInstance(this._uid, this.toJSON());
        return new ClassLesson({});
    }

}