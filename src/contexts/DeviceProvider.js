'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    onSnapshot,
    where,
} from 'firebase/firestore';
//import { PAGE_DAHBOARD_HOME, PAGE_HOME } from '@/lib/constants_pages';
import { useTranslation } from 'react-i18next';
import { ClassDevice, ClassHardware } from '@/classes/ClassDevice';
import { useRoom } from './RoomProvider';


const DeviceContext = createContext(null);
export const useDevice = () => useContext(DeviceContext);

export function DeviceProvider({ children, uidRoom = '' }) {
    const { t } = useTranslation([ClassDevice.NS_COLLECTION]);
    const { getOneRoomName } = useRoom();
    const [device, setDevice] = useState(null);           // ton user métier (ou snapshot)
    const [devices, setDevices] = useState([]);           // ton user métier (ou snapshot)
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [isLoading, setIsLoading] = useState(true);
    const errorsTranslate = t('errors', { returnObjects: true });
    const successTranslate = t('success', { returnObjects: true });
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState(false);
    useEffect(() => {
        const listener = listenToDevices(uidRoom);
        //console.log("uid room", uidRoom);
        return () => listener?.();
    }, [uidRoom]);
    useEffect(() => {
        refreshList();
    }, [device, filterType, filterStatus]);
    // écoute du doc utilisateur
    const listenToDevices = useCallback((uidRoom) => {
        const colRef = ClassHardware.colRef(); // par ex.
        // console.log("Col ref provider", colRef);
        const snapshotDevices = onSnapshot(colRef, async (snap) => {
            // snap est un QuerySnapshot
            //console.log("snap", snap.size);
            if (snap.empty) {
                setDevices([]);
                setDevice(null);
                setIsLoading(false);
                return;
            }
            //console.log("is not empty", snap.docs.map(doc => doc.data()));
            var _devices = snap.docs.map(doc => doc.data());
            if (uidRoom && uidRoom.length > 0) {
                _devices = _devices.filter(device => device.uid_room === uidRoom);
            }
            _devices = _devices.sort((a, b) => a.uid_intern - b.uid_intern);
            setDevices(_devices);
            setIsLoading(false);
        });
        return snapshotDevices;
    }, []);
    async function refreshList() {
        var _devices = [];
        const constraints = [];
        if (filterStatus !== 'all') {
            constraints.push(where("status", '==', filterStatus));
        }
        if (filterType !== 'all') {
            constraints.push(where("type", '==', filterType));
        }
        if (uidRoom) {
            constraints.push(where("uid_room", '==', uidRoom));
        }
        _devices = await ClassHardware.fetchListFromFirestore(constraints);
        _devices = _devices.sort((a, b) => a.uid_intern - b.uid_intern);
        setDevices(_devices);
    }
    async function create(_device = null) {
        if (!_device || _device === null || !(_device instanceof ClassDevice)) return;
        setIsLoading(true);
        var newDevice = await _device.createFirestore();
        try {

            if (newDevice) {
                setDevice(newDevice);
                setSuccess(true);
                setTextSuccess(successTranslate.create);
            } else {
                setDevice(null);
                setSuccess(true);
                setTextSuccess('');
            }
        } catch (error) {
            return;
        } finally {
            setIsLoading(false);
        }
        return newDevice;
    }
    async function update(_device_new = null) {
        if (!_device_new || _device_new === null || !(_device_new instanceof ClassDevice)) return;
        setIsLoading(true);
        //var newDevice = await _device.createFirestore();
        var _updated = await _device_new.updateFirestore();
        try {
            if (_updated) {
                setDevice(_updated);
                setSuccess(true);
                setTextSuccess(successTranslate.edit);
            } else {
                setDevice(null);
                setSuccess(false);
                setTextSuccess('');
            }
        } catch (error) {
            return;
        } finally {
            setIsLoading(false);
        }
        return _updated;
    }
    async function remove() {
        if (!device || device === null || !(device instanceof ClassDevice)) return;
        setIsLoading(true);
        //var newDevice = await _device.createFirestore();
        const _removed = await device.removeFirestore();
        try {
            if (_removed) {
                setDevice(null);
                setSuccess(true);
                setTextSuccess(successTranslate.remove);
            } else {
                setSuccess(false);
                setTextSuccess('');
            }
        } catch (error) {
            return;
        } finally {
            setIsLoading(false);
        }
        return _removed;
    }

    function getOneDevice(uid = '') {
        if (!uid || uid === '' || uid === null) {
            return null;
        }
        const _room = devices.find(item => item.uid === uid);
        return _room;
    }

    // session
    function changeDevice(uid = '', mode = '') {
        var _device = devices.find(item => item.uid === uid) || null;
        if (mode === 'create') {
            _device = new ClassHardware({ uid_room: uidRoom || '', status: ClassDevice.STATUS.AVAILABLE })
        }
        setDevice(_device);
    }

    const value = {
        create,
        update,
        remove,
        success,
        setSuccess,
        textSuccess,
        devices,
        device,
        setDevice,
        changeDevice,
        refreshList,
        getOneDevice,
        getOneRoomName,
        filterType,
        setFilterType,
        filterStatus,
        setFilterStatus,
        isLoading,
    };
    //if (isLoading) return <LoadingComponent />;
    //if (!user) return (<LoginComponent />);
    return <DeviceContext.Provider value={value}>
        {children}
    </DeviceContext.Provider>;
}
