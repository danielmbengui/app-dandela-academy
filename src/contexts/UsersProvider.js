'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ClassUser } from '@/classes/users/ClassUser';
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
import { ClassRoom } from '@/classes/ClassRoom';
import { ClassHardware } from '@/classes/ClassDevice';

// import { ClassUser } from '@/classes/ClassUser';

const UsersContext = createContext(null);
export const useUsers = () => useContext(UsersContext);

export function UsersProvider({ children}) {
    const router = useRouter();
    const { lang } = useLanguage();
    const { t } = useTranslation([NS_ERRORS])

    const [user, setUser] = useState(null);           // ton user métier (ou snapshot)
    const [users, setUsers] = useState([]);           // ton user métier (ou snapshot)
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    const [isErrorSignIn, setIsErrorSignIn] = useState(false);
    const [textErrorSignIn, setTextErrorSignIn] = useState('');
    const [provider, setProvider] = useState('');
    
    useEffect(() => {
        const listener = listenToUsers();
        //console.log("uid school", uidSchool);
        return () => listener?.();
    }, []);
    // écoute du doc utilisateur
    const listenToUsers = useCallback(() => {
        const colRef = ClassUser.colRef(); // par ex.
        //console.log("Col ref provider", colRef);
        const snapshotUsers = onSnapshot(colRef, async (snap) => {
            // snap est un QuerySnapshot
            //console.log("snap", snap.size);
            if (snap.empty) {
                setUsers([]);
                setUser(null);
                setIsLoading(false);
                return;
            }
            
            var _users = snap.docs.map(doc => doc.data());
            console.log("is not empty", _users[2]);
            //_users =_users.sort((a, b) => a.first_name?.localeCompare(b.first_name));
            setUsers(_users);
            //console.log("ROOMS provider", _rooms);
            setIsLoading(false);
        });
        return snapshotUsers;
    }, []);


    function getOneRoom(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return null;
        }
        const _room = users.find(item => item.uid === uid);
        return _room;
    }
    function getOneRoomName(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return '';
        }
        const _room = users.find(item => item.uid === uid);
        return _room?.name || '';
    }
    // session
    async function changeRoom(uid = '') {
        var _room = null;
        var existsRoom = await ClassRoom.alreadyExist(uid);
        if (existsRoom) {
            _room = await ClassRoom.fetchFromFirestore(uid);
        }
        setUser(_room);
    }
    // actions
    const value = {
        users,
        user,
        setUser,
        changeRoom,
        getOneRoom,
        getOneRoomName,
        isLoading,
        isConnected,
        isErrorSignIn,
        textErrorSignIn,
    };
    //if (isLoading) return <LoadingComponent />;
    //if (!user) return (<LoginComponent />);
    return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}
