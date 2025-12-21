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
import { ClassSchool } from '@/classes/ClassSchool';

// import { ClassUser } from '@/classes/ClassUser';

const COLLECTION_USERS = ClassUser.COLLECTION;
const RoomContext = createContext(null);
export const useRoom = () => useContext(RoomContext);

export function RoomProvider({ children, uidSchool = '' }) {
    const router = useRouter();
    const { lang } = useLanguage();
    const { t } = useTranslation([NS_ERRORS])

    const [room, setRoom] = useState(null);           // ton user métier (ou snapshot)
    const [rooms, setRooms] = useState([]);           // ton user métier (ou snapshot)
    const [computers, setComputers] = useState([]);           // ton user métier (ou snapshot)
    const [filterTypeComputers, setFilterTypeComputers] = useState('all');
    const [filterStatusComputers, setFilterStatusComputers] = useState('all');

    /*
        if (uidRoom !== 'all') {
          const indexRoom = ClassRoom.indexOf(rooms, uidRoom);
          const _room = rooms[indexRoom];
          //setRoom(_room);
          _computers = _computers.filter(item => item.uid_room === uidRoom);
        } else {
          //setRoom(null);
        }
        if (filterStatus !== 'all') {
          _computers = _computers.filter(item => item.status === filterStatus);
        }
    */

    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    const [isErrorSignIn, setIsErrorSignIn] = useState(false);
    const [textErrorSignIn, setTextErrorSignIn] = useState('');
    const [provider, setProvider] = useState('');
    // écoute du doc utilisateur
    const listenToRooms = useCallback((uidSchool) => {
        const colRef = ClassRoom.colRef(); // par ex.
        const constraints = [];
        if (uidSchool) {
            constraints.push(where("uid_school", "==", uidSchool));
        }
        const q = constraints.length
            ? query(colRef, ...constraints)
            : colRef;
        //console.log("Col ref provider", colRef);
        const snapshotRooms = onSnapshot(q, async (snap) => {
            // snap est un QuerySnapshot
            //console.log("snap", snap.size);
            if (snap.empty) {
                setRooms([]);
                setRoom(null);
                setIsLoading(false);
                return;
            }
            //console.log("is not empty");

            var _rooms = [];
            for (const snapshot of snap.docs) {
                const room = snapshot.data();
                const school = room.uid_school ? await ClassSchool.fetchFromFirestore(room.uid_school) : null;
                const computers = await ClassHardware.fetchListFromFirestore([where("uid_room", "==", room.uid)]);
                //const room = room.uid_room ? await ClassRoom.fetchFromFirestore(room.uid_room) : null;
                console.log("IS computer", computers)
                //const translate = await ClassLessonSessionTranslate.fetchFromFirestore(lesson.uid, lang);
                const room_new = new ClassRoom({
                    ...room.toJSON(),
                    // translate: translate,
                });
                room_new.school = school;
                room_new.computers = computers;
                _rooms.push(room_new);
            }
            _rooms.sort((a, b) => a.uid_intern - b.uid_intern);
            setRooms(_rooms);
            console.log("ROOMS provider", _rooms);
            setIsLoading(false);
        });
        return snapshotRooms;
    }, [uidSchool]);
    async function initComputers() {
        var _computers = [];
        const constraints = [];
        if (filterTypeComputers !== 'all') {
            constraints.push(where("type", '==', filterTypeComputers));
        }
        if (filterStatusComputers !== 'all') {
            constraints.push(where("status", '==', filterStatusComputers));
        }
        if (room) {
            constraints.push(where("uid_room", '==', room.uid));
        }
        _computers = await ClassHardware.fetchListFromFirestore(constraints);
        _computers = _computers.sort((a, b) => a.uid_intern - b.uid_intern);
        //console.log("has room", _computers);
        setComputers(_computers);
        //console.log("ROOM computers", _computers)
    }

    function getOneRoom(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return null;
        }
        const _room = rooms.find(item => item.uid === uid);
        return _room;
    }
    function getOneRoomName(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return '';
        }
        const _room = rooms.find(item => item.uid === uid);
        return _room?.name || '';
    }
    // session
    useEffect(() => {
        const listener = listenToRooms(uidSchool);
        //console.log("uid school", uidSchool);
        return () => listener?.();
    }, [uidSchool]);
    useEffect(() => {
        initComputers();
    }, [room, filterTypeComputers, filterStatusComputers]);

    async function changeRoom(uid = '') {
        var _room = null;
        var existsRoom = await ClassRoom.alreadyExist(uid);
        if (existsRoom) {
            _room = await ClassRoom.fetchFromFirestore(uid);
        }
        setRoom(_room);
    }

    async function updateComputersList() {
        await initComputers();
    }

    // actions


    const value = {
        rooms,
        room,
        setRoom,
        changeRoom,
        getOneRoom,
        getOneRoomName,
        //filterTypeComputers,
        //updateComputersList,
        //setFilterTypeComputers,
        //filterStatusComputers,
        //setFilterStatusComputers,
        //computers,
        isLoading,
        isConnected,
        isErrorSignIn,
        textErrorSignIn,

    };
    //if (isLoading) return <LoadingComponent />;
    //if (!user) return (<LoginComponent />);
    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
