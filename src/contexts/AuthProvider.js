'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ClassUser, ClassUserStudent } from '@/classes/users/ClassUser';
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
    updateEmail,
    verifyBeforeUpdateEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
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
import { auth, firestore, database } from '@/contexts/firebase/config';
import { PAGE_HOME, PAGE_LOGIN } from '@/contexts/constants/constants_pages';
//import { usePageActivity } from './hooks/usePageActivity';

// import { ClassUser } from '@/classes/ClassUser';
// src/hooks/usePresenceRTDB.js

import { ref, onValue, set, onDisconnect, serverTimestamp, get } from "firebase/database";
import { usePageActivity } from './hooks/usePageActivity';

/**
 * Presence RTDB:
 * - écrit online quand connecté
 * - écrit offline automatiquement quand la connexion tombe (onDisconnect)
 */
/*
function usePresenceRTDB(uid) {
    useEffect(() => {
        if (!uid) return;
        const userStatusRef = ref(database, `/status/${uid}`);
        const connectedRef = ref(database, ".info/connected");
        // écoute l'état de connexion au backend Firebase
        const unsubscribe = onValue(connectedRef, async (snap) => {
            const isConnected = snap.val() === true;
            if (!isConnected) return;
            // programmé côté serveur : quand ça coupe -> offline
            onDisconnect(userStatusRef).set({
                status: ClassUser.STATUS.OFFLINE,
                //last_changed: serverTimestamp(),
                last_connexion_time: serverTimestamp(),
                //logged: false
            });
           // const _snap = await get(userStatusRef);
           await setPresence(uid, ClassUser.STATUS.ONLINE);
        });

        // cleanup listener
        return () => unsubscribe();
    }, [uid]);
}

async function setPresence(uid, status = '') {
    if (!uid || !status) return;
    const userStatusRef = ref(database, `/status/${uid}`);
    //const _snap = await get(userStatusRef);
    //const prev = _snap.val() || {};
    const userData = {
        //...prev,
        status: status, // "online" | "away" | "offline"
        last_connexion_time: serverTimestamp(),
    };
    // RTDB write (ok, pas cher)
    await set(userStatusRef, userData);
}
*/
const COLLECTION_USERS = ClassUser.COLLECTION;
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const router = useRouter();
    const { lang } = useLanguage();
    const { t } = useTranslation([NS_ERRORS]);
    const { pathname } = usePathname();
    const [userAuth, setUserAuth] = useState(null);           // ton user métier (ou snapshot)
    const [user, setUser] = useState(null);           // ton user métier (ou snapshot)
    const [isLoading, setIsLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const [isErrorSignIn, setIsErrorSignIn] = useState(false);
    const [textErrorSignIn, setTextErrorSignIn] = useState('');
    const [provider, setProvider] = useState('');

    // ✅ presence
   // usePresenceRTDB(user?.uid);

    useEffect(() => {
        if (user) {
            //set(ref(database, `status/${user?.uid}`), { last_connexion_time:serverTimestamp(),logged: true });
        }
    }, [user]);

    useEffect(() => {
        if (auth) {
            auth.languageCode = lang;
        }
    }, [lang]);

    usePageActivity({
        onVisible: async () => {
            // la page redevient visible → on repart un chrono
            //startTimeRef.current = Date.now();
            if (!user) return;
            /*
            setUser(prev => {
                if (!prev || prev === null) return null;
                prev.update({
                    last_connexion_time: new Date(),
                    status: ClassUser.STATUS.ONLINE,
                });
                return prev.clone();
            });
            */
           // await setPresence(user.uid, ClassUser.STATUS.ONLINE);
        },
        onHidden: async () => {
            // la page n'est plus visible → on arrête le chrono
            /*
            if (!user) return;
            setUser(prev => {
                if (!prev || prev === null) return null;
                prev.update({
                    last_connexion_time: new Date(),
                    status: ClassUser.STATUS.AWAY,
                });
                return prev.clone();
            });
            */
            // ✅ RTDB: away (onglet caché)
            //await setPresence(user.uid, ClassUser.STATUS.AWAY);
        },
        onBeforeUnload: async () => {
            // l'utilisateur ferme/reload/navigue ailleurs
            if (!user) return;
            /*
            setUser(prev => {
                if (!prev || prev === null) return null;
                prev.update({
                    last_connexion_time: new Date(),
                    status: ClassUser.STATUS.AWAY,
                });
                return prev.clone();
            });
            */
            // ✅ RTDB: away (onglet caché)
            //await setPresence(user.uid, ClassUser.STATUS.AWAY);

        },
    });

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
            const { email_verified, status } = data;
            if (email_verified !== fbUser.emailVerified) {
                //await updateDoc(ref, { email_verified: fbUser.emailVerified });
            }
            const _user = data;
            //setUser(_user);
            setUser(prev => {
                if (!prev || prev === null) return _user.clone();
                prev.update(_user.toJSON());
                return prev.clone();
            });
            setIsConnected(true);
            setIsLoading(false);
            //setUser(fbUser);
            //setIsConnected(true);
            //setIsLoading(false);
        });
        return unsubscribe;
    }, [auth]);

    // session
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                await ClassUser.update(fbUser.uid, {
                    last_connexion_time: new Date(),
                    //status: ClassUser.STATUS.ONLINE,
                });
                const _user = await ClassUser.fetchFromFirestore(fbUser.uid);
                setUser(_user);
                setUserAuth(fbUser);
                setIsConnected(true);
                setIsLoading(false);
                //  console.timeEnd("auth");
                const unsubUser = listenToUser(fbUser);
                return () => unsubUser?.();
            } else {
                setUser(null);
                setUserAuth(null);
                setIsConnected(false);
                setIsLoading(false);
            }

        });
        return () => unsubAuth?.();

    }, [auth.currentUser]);

    async function update(_user = null) {
        if (!_user || _user === null || !(_user instanceof ClassUser)) return;
        //setIsLoading(true);
        setProcessing(true);
        //var newDevice = await _device.createFirestore();
        var _updated = await _user.updateFirestore();
        try {
            if (_updated) {
                setUser(_updated);
                //setSuccess(true);
                //setTextSuccess(successTranslate.edit);
            } else {
                setUser(null);
                //setSuccess(false);
                //setTextSuccess('');
            }
        } catch (error) {
            console.log("ERROR", error)
            return;
        } finally {
            //setIsLoading(false);
            setProcessing(false);
        }
        return _updated;
    }

    // actions
    const createAccount = async (e, email, password) => {
        e?.preventDefault?.();
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed up 
                const user = userCredential.user;
                const { uid } = user;
                const student = new ClassUserStudent({ uid, email, status: ClassUser.STATUS.FIRST_CONNEXION, preferred_language: lang });
                //const displayName = student.createDisplayName();
                setIsLoading(true);
                await student.createFirestore();
                if (auth.currentUser) {
                    //await sendEmailVerification(auth.currentUser);
                }
                // ...
            })
            .catch(async (err) => {
                const code = err.code;
                const errorMessage = err.message;
                if (code === ClassUser.ERROR.ALREADY_IN_USE) {
                    // fallback: login
                    await signInWithEmailAndPassword(auth, email, password);
                } else {
                    console.error(err);
                    throw err;
                }
                // ..
            });
        /*
        email: 'modifiedUser@example.com',
        phoneNumber: '+11234567890',
        emailVerified: true,
        password: 'newPassword',
        displayName: 'Jane Doe',
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: true,
        */
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

            await ClassUser.update(uid, {
                last_connexion_time: new Date(),
                //status: ClassUser.STATUS.ONLINE,
            });
            const _user = await ClassUser.fetchFromFirestore(uid);
            setUser(_user);
            setIsLoading(false);
            //setIsErrorSignIn(false);
            //setTextErrorSignIn(``);
            return ({
                success: true, user: _user, error: {}
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
                user: null,
            })
        }
    };
    const logout = async () => {
        const uid = auth.currentUser.uid || '';
        setIsLoading(true);
        await signOut(auth);
        await ClassUser.update(uid, {
            last_connexion_time: new Date(),
            status: ClassUser.STATUS.OFFLINE,
        });
        setUser(null);
        setUserAuth(null);
        setIsConnected(false);
        setIsErrorSignIn(false);
        setTextErrorSignIn(``);
        setIsLoading(false);
        router.replace(PAGE_LOGIN);
    };
    const editEmail = async (e, newEmail) => {
        e?.preventDefault?.();
        //const credential = promptForCredentials();
        const credential = EmailAuthProvider.credential(user.email, "Projetsdevie2025#");
        reauthenticateWithCredential(auth.currentUser, credential).then(async () => {
            // User re-authenticated.
            var now = new Date();
            //now = now.setDate(now.getMinutes),
            now.setMinutes(now.getMinutes() + (20 * 60));        // +20 min
            const actionCodeSettings = {
                // ✅ où l’utilisateur sera renvoyé après avoir cliqué sur le lien
                url: `${window.location.origin}/auth/`,
                // optionnel: true si tu veux gérer le lien dans l'app (mobile / custom flow)
                handleCodeInApp: false,
            };
            await verifyBeforeUpdateEmail(auth.currentUser, newEmail, actionCodeSettings);
        }).catch((error) => {
            // An error ocurred
            console.log("ERRRROR", error)
            // ...
        });
    }
    const editPassword = async (e, newPassword) => {
        e?.preventDefault?.();
        await updatePassword(auth.currentUser, newPassword).then(async (user) => {
            // Update successful.
            const uid = auth.currentUser.uid;
            const ref = doc(firestore, ClassUser.COLLECTION, uid);
            await updateDoc(ref, { default_password: '', password_changed: true });
        }).catch((error) => {
            console.log("ERRRROR password", error);
        });
    }
    const sendVerification = async () => {
        if (!auth.currentUser) return;
        const _user = auth.currentUser;
        if (!_user) throw new Error("No authenticated user");
        var now = new Date();
        //now = now.setDate(now.getMinutes),
        now.setMinutes(now.getMinutes() + (20 * 60));        // +20 min
        const actionCodeSettings = {
            // ✅ où l’utilisateur sera renvoyé après avoir cliqué sur le lien
            url: `${window.location.origin}/auth?returnTo=${encodeURIComponent(`${window.location.pathname}`)}&expiration=${now.toString()}`, // ex: https://tonsite.com/auth/verified
            // optionnel: true si tu veux gérer le lien dans l'app (mobile / custom flow)
            handleCodeInApp: false,
        };
        await sendEmailVerification(_user, actionCodeSettings);

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
    const updateOneUser = async (newUserProfile) => {
        if (!auth.currentUser || !(newUserProfile instanceof ClassUser)) return;
        const newUser = await newUserProfile.updateFirestore();
        if (newUser && newUser instanceof ClassUser) {
            await updateProfile(auth.currentUser, {
                email: newUser.email,
                phoneNumber: newUser.phone_number,
                displayName: newUser.display_name,
                photoURL: newUser.photo_url,
            });
            setUser(newUser.clone());
            await auth.currentUser.reload();
            setUserAuth(auth.currentUser);
        }

        /*
email: 'modifiedUser@example.com',
phoneNumber: '+11234567890',
emailVerified: true,
password: 'newPassword',
displayName: 'Jane Doe',
photoURL: 'http://www.example.com/12345678/photo.png',
disabled: true,
*/
    };
    const removeErrorSigIn = () => {
        setIsErrorSignIn(false);
        setTextErrorSignIn('');
        setProvider('');
    };

    const value = {
        userAuth,
        user,
        setUser,
        updateOneUser,
        isLoading,
        isConnected,
        isErrorSignIn,
        textErrorSignIn,
        provider,
        update,
        processing,
        removeErrorSigIn,
        createAccount,
        signIn,
        login,
        logout,
        editEmail,
        editPassword,
        sendVerification,
        sendResetPassword,
        updateUserProfile,
    };
    //if (isLoading) return <LoadingComponent />;
    //if (!user) return (<LoginComponent />);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
