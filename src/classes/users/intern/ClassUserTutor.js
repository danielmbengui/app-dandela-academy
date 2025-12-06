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
import { PAGE_DASHBOARD_HOME, PAGE_LESSONS, PAGE_DASHBOARD_PROFILE, PAGE_DASHBOARD_STUDENTS, PAGE_DASHBOARD_TUTORS } from "@/contexts/constants/constants_pages";
import { IconHome, IconLessons, IconProfile, IconStudents, IconTutors } from "@/assets/icons/IconsComponent";
import { ClassUserIntern } from "./ClassUserIntern";

export class ClassUserTutor extends ClassUserIntern {
    constructor({
        uid = "",
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
        status = ClassUserTutor.STATUS.CREATED,
    } = {}) {
        super({
            uid,
            type: ClassUserTutor.TYPE.INTERN,
            role: ClassUserTutor.ROLE.TUTOR,
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
    }

    // --- Serialization ---
    clone() {
        return new ClassUserTutor(this.toJSON());
    }
    // ---------- Converter intégré ----------    
    static get converter() {
        return {
            toFirestore(model) {
                return model.toJSON(); // Firestore convertira Date -> Timestamp
            },
            fromFirestore(snapshot, options) {
                const data = snapshot.data(options) || {};
                return new ClassUserTutor({
                    ...data,
                    uid: data.uid ?? snapshot.id,
                    created_time: ClassUserTutor._toJsDate(data.created_time) ?? new Date(),
                    last_edit_time: ClassUserTutor._toJsDate(data.last_edit_time) ?? new Date(),
                    birthday: ClassUserTutor._toJsDate(data.birthday) ?? new Date(),
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
                });
            },
        };
    }

    /**************** PAGES ****************/
    pageDashboard() {
        return (PAGE_DASHBOARD_HOME)
    }
    /**************** MENU ****************/
    menuDashboard() {
        return [
            {
                name: "dashboard",
                path: PAGE_DASHBOARD_HOME,
                icon: <IconHome width={22} height={22} />,
            },
            {
                name: "lessons",
                path: PAGE_LESSONS,
                icon: <IconLessons width={18} height={18} />,
            },
            {
                name: "tutors",
                path: PAGE_DASHBOARD_TUTORS,
                icon: <IconTutors width={18} height={18} />,
            },
            {
                name: "students",
                path: PAGE_DASHBOARD_STUDENTS,
                icon: <IconStudents width={18} height={18} />,
            },
            {
                name: "profile",
                path: PAGE_DASHBOARD_PROFILE,
                icon: <IconProfile width={22} height={22} />,
            },
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
        return collection(firestore, ClassUserTutor.COLLECTION).withConverter(ClassUserTutor.converter);
    }

    static docRef(id) {
        return doc(firestore, ClassUserTutor.COLLECTION, id).withConverter(ClassUserTutor.converter);
    }

    static async count() {
        const q = query(ClassUserTutor.colRef(), where("type", "==", ClassUserTutor.TYPE.INTERN), where("role", "==", ClassUserTutor.ROLE.TUTOR));
        const qSnap = await getDocs(q);
        return qSnap.docs.length; // -> nombre total
    }

    // Récupérer un module par id
    static async get(id) {
        const snap = await getDoc(ClassUserTutor.docRef(id));
        if (snap.exists()) {
            const data = snap.data();
            return (data);
        }

        return null; // -> ClassModule | null
    }

    // Lister des modules (passer des contraintes Firestore : where(), orderBy(), limit()…)
    static async list(constraints = []) {
        const q = constraints.length ? query(ClassUserTutor.colRef(), where("type", "==", ClassUserTutor.TYPE.INTERN), where("role", "==", ClassUserTutor.ROLE.TUTOR), ...constraints) : query(ClassUserTutor.colRef(), where("type", "==", ClassUserTutor.TYPE.INTERN), where("role", "==", ClassUserTutor.ROLE.TUTOR));
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
        const newRef = doc(ClassUserTutor.colRef()); // id auto
        const model = data instanceof ClassUserTutor ? data : new ClassUserTutor({ uid: newRef.id, ...data });
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
        const ref = ClassUserTutor.docRef(id);
        const data = bumpEditTime ? { ...patch, last_edit_time: serverTimestamp() } : patch;
        await updateDoc(ref, data);
        return (await getDoc(ref)).data(); // -> ClassModule
    }

    // Supprimer un module
    static async remove(id) {
        await deleteDoc(ClassUserTutor.docRef(id));
        return true;
    }

    // (Legacy) méthode de fetch directe
    static async fetchFromFirestore(uid) {
        try {
            if (!uid) throw new Error("UID is required to get module.");
            return await ClassUserTutor.get(uid);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
    static async fetchListFromFirestore(constraints = []) {
        try {
            //if (!uid) throw new Error("UID is required to get module.");
            return await ClassUserTutor.list(constraints);
        } catch (error) {
            console.log("ERROR", error?.message || error);
            return null;
        }
    }
}
