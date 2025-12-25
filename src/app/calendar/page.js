"use client";
import React, { useMemo, useState } from 'react';
import { IconCalendar } from "@/assets/icons/IconsComponent";
import { getFormattedHour, getStartOfDay } from "@/contexts/functions";
import { NS_DASHBOARD_CALENDAR, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { Box, CircularProgress, Skeleton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { useLanguage } from '@/contexts/LangProvider';
import { useSession } from '@/contexts/SessionProvider';
import { ClassLesson } from '@/classes/ClassLesson';
import ButtonConfirm from '@/components/dashboard/elements/ButtonConfirm';
import DialogSession from '@/components/dashboard/sessions/DialogSession';
import { useAuth } from '@/contexts/AuthProvider';
import { ClassUserIntern } from '@/classes/users/ClassUser';
import CalendarComponent from '@/components/calendar/CalendarComponent';
export default function CalendarPage() {
  const { t } = useTranslation([NS_DASHBOARD_CALENDAR, ClassLesson.NS_COLLECTION]);
  const {isLoadingSlots} = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('');
  const [initStartDate, setInitStartDate] = useState(null);

  return (<DashboardPageWrapper
    title={t('title')}
    subtitle={t('subtitle')}
    icon={<IconCalendar width={22} height={22} />}
    titles={[{ name: t('calendar', { ns: NS_DASHBOARD_MENU }), url: '' }]}
  >
    <Stack
      alignItems={'start'}
      spacing={2}
      sx={{
        width: '100%',
        flex: 1,
        maxWidth: '100%',         // ne jamais dépasser la largeur écran
        overflowX: 'hidden',       // évite le scroll horizontal global
        //background: 'red'
      }}>
      <ButtonConfirm
        label={t('btn-create-session')}
        onClick={() => {
          setMode('create');
          setIsOpen(true);
          setInitStartDate(null);
        }}
      />
      {
        isLoadingSlots && <Skeleton variant="rounded" width={'100%'} height={'100vh'} sx={{ bgcolor: 'var(--card-border)' }} />
      }
      {
        !isLoadingSlots && <CalendarComponent
          mode={mode}
          setMode={setMode}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          initStartDate={initStartDate}
          setInitStartDate={setInitStartDate}
        />
      }
      <DialogSession
        mode={mode}
        setMode={setMode}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        initStartDate={initStartDate}
        setInitStartDate={setInitStartDate}
      />
    </Stack>
  </DashboardPageWrapper>);
}
