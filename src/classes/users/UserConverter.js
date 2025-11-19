// firestore/converters/userConverter.js
//import { ClassUser } from "./ClassUser";
import { ClassUserExtern } from "./extern/ClassUserExtern";
import { ClassUserProfessional } from "./extern/ClassUserProfessional";
import { ClassUserStudent } from "./extern/ClassUserStudent";
import { ClassUserAdmin } from "./intern/ClassUserAdmin";
import { ClassUserIntern } from "./intern/ClassUserIntern";
import { ClassUserTutor } from "./intern/ClassUserTutor";
export const UserConverter = {
    toFirestore(userInstance) {
        // chaque classe a un .toJSON() propre
        return userInstance?.toJSON ? userInstance.toJSON() : userInstance;
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options) || {};
        const uid = snapshot.id;
        const { type, role } = data;

        // 🔎 Factory selon type/role
        if (type === ClassUserExtern.TYPE.EXTERN) {
            if (role === ClassUserExtern.ROLE.STUDENT) return new ClassUserStudent({ uid, ...data });
            if (role === ClassUserExtern.ROLE.PROFESSIONAL) return new ClassUserProfessional({ uid, ...data });
            return new ClassUserExtern({ uid, ...data });
        }

        if (type === ClassUserIntern.TYPE.INTERN) {
            if (role === ClassUserIntern.ROLE.ADMIN) return new ClassUserAdmin({ uid, ...data });
            if (role === ClassUserIntern.ROLE.TUTOR) return new ClassUserTutor({ uid, ...data });
            return new ClassUserIntern({ uid, ...data });
        }

        // fallback
        return null;
    },
};
