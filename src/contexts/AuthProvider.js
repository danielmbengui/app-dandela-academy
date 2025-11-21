'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ClassUser } from '@/classes/users/ClassUser';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    OAuthProvider,
    GoogleAuthProvider,
    TwitterAuthProvider,
    signInWithPopup,
    fetchSignInMethodsForEmail,
    sendSignInLinkToEmail,
    updatePassword,
} from 'firebase/auth';

import {
    doc,
    onSnapshot,
    collection,
    getDocs,
    query,
    where,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { useLanguage } from './LangProvider';
//import { PAGE_DAHBOARD_HOME, PAGE_HOME } from '@/lib/constants_pages';
import { useTranslation } from 'react-i18next';
import { NS_ERRORS } from '@/contexts/i18n/settings';
import { translateWithVars } from '@/contexts/functions';
import { auth, firestore } from '@/contexts/firebase/config';
import { ClassUserExtern } from '@/classes/users/extern/ClassUserExtern';
import { ClassUserStudent } from '@/classes/users/extern/ClassUserStudent';
import { ClassUserProfessional } from '@/classes/users/extern/ClassUserProfessional';
import { PAGE_HOME } from '@/contexts/constants/constants_pages';
import { ClassUserIntern } from '@/classes/users/intern/ClassUserIntern';
import { ClassUserAdmin } from '@/classes/users/intern/ClassUserAdmin';
import { ClassUserTutor } from '@/classes/users/intern/ClassUserTutor';

// import { ClassUser } from '@/classes/ClassUser';

const COLLECTION_USERS = ClassUser.COLLECTION;
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const router = useRouter();
    const { lang } = useLanguage();
    const { t } = useTranslation([NS_ERRORS])

    const [user, setUser] = useState(null);           // ton user métier (ou snapshot)
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    const [isErrorSignIn, setIsErrorSignIn] = useState(false);
    const [textErrorSignIn, setTextErrorSignIn] = useState('');
    const [provider, setProvider] = useState('');

    useEffect(() => {
        if (auth) {
            auth.languageCode = lang;
        }
    }, [lang])

    // écoute du doc utilisateur
    const listenToUser = useCallback((fbUser) => {
        const { uid } = fbUser;
        const ref = ClassUser.docRef(uid);
        const unsubscribe = onSnapshot(ref, async (snap) => {
            if (!snap.exists()) {
                setUser(null);
                setIsConnected(false);
                setIsLoading(false);
                return;
            }
            const data = snap.data();
            //console.log("DATA listne user", data);
            const { email_verified } = data;
            if (email_verified !== fbUser.emailVerified) {
                await updateDoc(ref, { email_verified: fbUser.emailVerified });
            }
            //const myUser = ClassUser.makeUserInstance(uid, data.toJSON());
            //console.log("DATA listne user admin after", myUser);
            //const ref = doc(firestore, ClassUser.COLLECTION, fbUser.uid);
            // Si tu as une classe métier :
            // const model = new ClassUser(data);
            setUser((prev) => {
                //var _user = prev;

               // console.log("FFFF subbb", data);
                

                if (!prev || prev === null) {
                    return data;
                }
                //return _user;
                // si tu utilises une classe avec .update(), garde-la
                if (prev?.update) { prev.update(data.toJSON()); return prev; }
                return prev;
            });
            setIsConnected(true);
            setIsLoading(false);
            //setUser(fbUser);
            //setIsConnected(true);
            //setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    // session
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                const unsubUser = listenToUser(fbUser);
                //console.log("FFFF init user", fbUser);
                return () => unsubUser?.();
            } else {
                setUser(null);
                setIsConnected(false);
                setIsLoading(false);
            }
        });
        return () => unsubAuth();
    }, [auth]);

    // actions
    const createAccount = async (e, email, password) => {
        e?.preventDefault?.();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
            }
        } catch (err) {
            if (err.code === ClassUser.ERROR.ALREADY_IN_USE) {
                // fallback: login
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                console.error(err);
                throw err;
            }
        }
    };

    const signIn = async (providerName = '') => {
        if (!providerName) return;
        let prov = null;
        if (providerName === 'apple') {
            prov = new OAuthProvider('apple.com');
            prov.addScope('email');
            prov.addScope('name');
        } else if (providerName === 'google') {
            prov = new GoogleAuthProvider();
        } else if (providerName === 'twitter') {
            prov = new TwitterAuthProvider();
        } else {
            throw new Error('Provider non supporté');
        }

        try {
            await signInWithPopup(auth, prov);
            setIsErrorSignIn(false);
            setTextErrorSignIn('');
            setProvider(providerName);
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                const email = error.customData?.email;
                const methods = await fetchSignInMethodsForEmail(auth, email);
                setIsErrorSignIn(true);
                setTextErrorSignIn(`${email} est déjà associée à ${methods[0]?.split('.')[0]} !`);
                setProvider(methods[0]?.split('.')[0] ?? '');
            } else {
                setIsErrorSignIn(true);
                setTextErrorSignIn(error.message || 'Erreur de connexion');
                setProvider('');
            }
        }
    };

    const login = async (email, password) => {
        //e?.preventDefault?.();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const uid = auth.currentUser.uid;
            var _user = await ClassUser.fetchFromFirestore(uid);
            const { type, email_verified, role } = _user.toJSON();
            if (type === ClassUser.TYPE.EXTERN) {
                _user = await ClassUserExtern.fetchFromFirestore(uid);
                if (role === ClassUser.ROLE.STUDENT) {
                    _user = await ClassUserStudent.fetchFromFirestore(uid);
                } else if (role === ClassUser.ROLE.PROFESSIONAL) {
                    _user = await ClassUserProfessional.fetchFromFirestore(uid);
                }
            } else if (type === ClassUser.TYPE.INTERN) {
                _user = await ClassUserIntern.fetchFromFirestore(uid);
                if (role === ClassUserIntern.ROLE.ADMIN) {
                    _user = await ClassUserAdmin.fetchFromFirestore(uid);
                } else if (role === ClassUserIntern.ROLE.TUTOR) {
                    _user = await ClassUserTutor.fetchFromFirestore(uid);
                }
            }
            //setIsErrorSignIn(false);
            //setTextErrorSignIn(``);
            return ({
                success: true, user: _user,error:{}
            })
        } catch (error) {
            const errorCode = error.code;
            var errorMessage = error.message;
            //setUser(null);

            //setIsConnected(false);
            //setIsErrorSignIn(true);
            if (errorCode === ClassUser.ERROR.INVALID_CREDENTIAL) {
                errorMessage = t(`${NS_ERRORS}:invalid-credential`);
            } else if (errorCode === ClassUser.ERROR.NOT_FOUND) {
                errorMessage = translateWithVars(t(`${NS_ERRORS}:wrong-email`), { email: email });
            } else if (errorCode === ClassUser.ERROR.WRONG_PASSWORD) {
                errorMessage = translateWithVars(t(`${NS_ERRORS}:wrong-password`), { password: password });
            } else if (errorCode === ClassUser.ERROR.TOO_MANY_REQUESTS) {
                errorMessage = translateWithVars(t(`${NS_ERRORS}:wrong-password`), { password: password });
            }

            console.log("ERRRRRROR", errorCode, errorMessage, email, password);
            setUser(null);
            setIsConnected(false);
            //setIsErrorSignIn(false);
            //setTextErrorSignIn(``);
            return ({
                success: false,
                error: { code: errorCode, message: errorMessage },
                user:null,
            })
        }
    };

    const logout = async () => {
        setUser(null);
        setIsConnected(false);
        setIsErrorSignIn(false);
        setTextErrorSignIn(``);
        await signOut(auth);
       // router.replace("/");
        console.log("DISC OK");
    };

    const editPassword = async (e, newPassword) => {
        e?.preventDefault?.();
        await updatePassword(auth.currentUser, newPassword).then(async (user) => {
            // Update successful.
            const uid = auth.currentUser.uid;
            const ref = doc(firestore, ClassUser.COLLECTION, uid);
            console.log("NEEEW PASSWORD", newPassword, uid);
            await updateDoc(ref, { default_password: '', password_changed: true });
        }).catch((error) => {
            // An error ocurred
            // ...
            console.log("ERRRROR password", error);
        });
    }

    const sendVerification = async () => {
        if (auth.currentUser) await sendEmailVerification(auth.currentUser);
        console.log("SUCCESS", auth.currentUser.email)
    };

    const sendResetPassword = async (e, email) => {
        e?.preventDefault?.();
        const q = query(collection(firestore, ClassUser.COLLECTION), where('email', '==', email));
        const snap = await getDocs(q);
        if (snap.size > 0) {
            await sendPasswordResetEmail(auth, email);
        }
    };

    const updateUserProfile = async (newProfile) => {
        if (!auth.currentUser) return;
        await updateProfile(auth.currentUser, {
            displayName: newProfile.display_name,
            photoURL: newProfile.photo_url,
        });
        setUser((u) => ({ ...(u || {}), ...newProfile }));
    };

    const removeErrorSigIn = () => {
        setIsErrorSignIn(false);
        setTextErrorSignIn('');
        setProvider('');
    };

    const value = {
        user,
        setUser,
        isLoading,
        isConnected,
        isErrorSignIn,
        textErrorSignIn,
        provider,
        removeErrorSigIn,
        createAccount,
        signIn,
        login,
        logout,
        editPassword,
        sendVerification,
        sendResetPassword,
        updateUserProfile,
    };
    //if (isLoading) return <LoadingComponent />;
    //if (!user) return (<LoginComponent />);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
