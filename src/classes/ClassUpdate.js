import {
    Timestamp,
} from "firebase/firestore";

export class ClassUpdate {
    static STATUS = Object.freeze({
        CREATED: 'created',
        EDITED: 'edited',
        UNKNOWN: 'unknown',
    });
    static DESCRIPTION = Object.freeze({
        CREATED: 'created_description',
        EDITED: 'edited_description',
        UNKNOWN: 'unknown',
    });
    constructor({
        created_time = null,
        description = ClassUpdate.DESCRIPTION.UNKNOWN,
        status = ClassUpdate.STATUS.UNKNOWN,
    } = {}) {
        this._created_time = this.toJsDate(created_time);
        this._description = description;
        this._status = this._normalizeStatus(status);
    }

    _normalizeStatus(status) {
        return Object.values(ClassUpdate.STATUS).includes(status)
            ? status
            : ClassUpdate.STATUS.UNKNOWN;
    }
    get created_time() { return this._created_time; }
    set created_time(value) { this._created_time = value instanceof Date ? value : new Date(value); }

    get description() { return this._description; }
    set description(val) { this._description = val; }

    get status() { return this._status; }
    set status(value) { this._status = this._normalizeStatus(value); }


    // ✅ toJSON
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
        // console.log('toJson', 'generation class', this.toJSON())
        return new ClassUpdate(this.toJSON());
    }
    // ---------- Converter intégré ----------
    toJsDate(v) {
        if (!v) return null;
        if (v instanceof Date) return v;
        if (v instanceof Timestamp) return v.toDate();
        if (typeof v?.toDate === "function") return v.toDate();
        if (typeof v?.seconds === "number") return new Date(v.seconds * 1000);
        return null;
    }

}
