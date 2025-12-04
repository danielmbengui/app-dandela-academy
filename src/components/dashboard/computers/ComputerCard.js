"use client";
import React from 'react';
import { THEME_DARK, THEME_LIGHT } from "@/contexts/constants/constants";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Stack } from '@mui/material';
import { ClassDevice } from '@/classes/ClassDevice';
import { useRoom } from '@/contexts/RoomProvider';
import BadgeStatusDevice from './BadgeStatusDevice';

export default function ComputerCard({ device, isSelected, onClick }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[device.status];
  const { theme, mode } = useThemeMode();
  const { cardColor, text, greyLight } = theme.palette;
  const {getOneRoomName} = useRoom();

  return (
    <button className="pc-card" onClick={onClick} type="button">
      <div className="pc-icon-wrapper">
        <Stack alignItems={'center'}>
          {
            ClassDevice.getIcon({ type: device?.type, size: 'small', status: device?.status })
          }
        </Stack>
      </div>
      <p className="pc-name">{device.name}</p>
      <BadgeStatusDevice status={device.status} />
      <p className="pc-id">{getOneRoomName(device?.uid_room) || ''}</p>
      <p className="pc-id">#{device?.id?.toString().padStart(2, "0") || device.uid_intern || ''}</p>

      <style jsx>{`
      .pc-card {
        height: 100%;
        border-radius: 14px;
        border: 1px solid ${isSelected ? cfg.badgeBorder : "#111827"};
        background: radial-gradient(circle at top, ${cfg.glow},${mode === THEME_DARK ? `${cardColor.main},` : ''}${cardColor.main});
        padding: 8px 8px 9px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        transition: transform 0.12s ease, box-shadow 0.12s ease,
          border-color 0.12s ease, background 0.12s ease;
        
      }

      .pc-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3);
        border-color: ${cfg.badgeBorder};
      }

      .pc-icon-wrapper {
        margin-bottom: 2px;
      }

      .pc-name {
        margin: 0;
        font-size: 0.85rem;
        font-weight: 500;
        color: ${text.main};
        white-space: nowrap;    
      }

      .pc-id {
        margin: 0;
        font-size: 0.75rem;
        color: ${mode === THEME_LIGHT ? text.main : greyLight.main};
      }
    `}</style>
    </button>
  );
}