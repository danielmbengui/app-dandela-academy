'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import { PAGE_HOME } from '@/contexts/constants/constants_pages';
import { usePageActivity } from './hooks/usePageActivity';

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
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const [isErrorSignIn, setIsErrorSignIn] = useState(false);
    const [textErrorSignIn, setTextErrorSignIn] = useState('');
    const [provider, setProvider] = useState('');

    useEffect(() => {
        if (auth) {
            auth.languageCode = lang;
        }
    }, [lang]);
/*
    usePageActivity({
        onVisible: async () => {
            // la page redevient visible → on repart un chrono
            //startTimeRef.current = Date.now();
            if (user) {
                setUser(prev => {
                    if (!prev || prev === null) return null;
                    prev.update({
                        last_connexion_time: new Date(),
                        status: ClassUser.STATUS.ONLINE,
                    });
                    return prev.clone();
                })

                console.log("[Chrono] start (visible)", new Date());
            }
        },
        onHidden: async () => {
            // la page n'est plus visible → on arrête le chrono
            if (user) {
                if (auth.currentUser) {
                    await ClassUser.update(user.uid, {
                        last_connexion_time: new Date(),
                        status: ClassUser.STATUS.AWAY,
                    });
                }
                console.log("[Chrono] hidden → temps passé sur cette session:", new Date(), "s");
            }
        },
        onBeforeUnload: async () => {
            // l'utilisateur ferme/reload/navigue ailleurs
            if (user) {
                if (auth.currentUser) {
                    await ClassUser.update(user.uid, {
                        last_connexion_time: new Date(),
                        status: ClassUser.STATUS.AWAY,
                    });
                }
                console.log("[Chrono] beforeunload → dernière session:", new Date(), "s");
            }
        },
    });
*/
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
                //await updateDoc(ref, { email_verified: fbUser.emailVerified });
            }
            //const myUser = ClassUser.makeUserInstance(uid, data.toJSON());

            //const ref = doc(firestore, ClassUser.COLLECTION, fbUser.uid);
            // Si tu as une classe métier :
            // const model = new ClassUser(data);
            /*
            */
            const _user = data;
            //setUser(_user);
            setUser(prev => {
                if (!prev || prev === null) return _user.clone();
                prev.update(_user.toJSON());
                //console.log('set prev user', _user);
                return prev.clone();
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
        console.log("AUTH", auth)
        const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                console.log("FB", fbUser.uid)
                await ClassUser.update(fbUser.uid, {
                    last_connexion_time: new Date(),
                    status: ClassUser.STATUS.ONLINE,
                });
                const _user = await ClassUser.fetchFromFirestore(fbUser.uid);
                setUser(_user);
                setIsConnected(true);
            setIsLoading(false);
                const unsubUser = listenToUser(fbUser);
                //console.log("FFFF init user", fbUser);
                return () => unsubUser?.();
            } else {
                console.log("no user FB")
                setUser(null);
                setIsConnected(false);
                setIsLoading(false);
            }
        });
        return () => unsubAuth();
    }, [auth]);

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
                console.log("UUUID", uid);
                
                const student = new ClassUserStudent({uid,email});
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
            const _user = await ClassUser.get(uid);
            /*
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
            */
            await ClassUser.update(uid, {
                last_connexion_time: new Date(),
                status: ClassUser.STATUS.ONLINE,
            });
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
        await ClassUser.update(uid, {
            last_connexion_time: new Date(),
            status: ClassUser.STATUS.OFFLINE,
        });
        setUser(null);
        setIsConnected(false);
        setIsErrorSignIn(false);
        setTextErrorSignIn(``);
        await signOut(auth);
        router.replace(PAGE_HOME);
        //console.log("DISC OK");
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
        update,
        processing,
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
