"use client";
import React, { useState } from 'react';
import { IconCalendar, IconDashboard, IconEmail, IconLogo, IconTiktok } from "@/assets/icons/IconsComponent";
import LoginPageWrapper from "@/components/wrappers/LoginPageWrapper";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { translateWithVars } from "@/contexts/functions";
import { NS_DASHBOARD_CALENDAR } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

export default function DashboardCalendar() {
  const { theme } = useThemeMode();
  const { text } = theme.palette;
  const { t } = useTranslation([NS_DASHBOARD_CALENDAR]);
  const handleDateClick = (arg) => {
    alert(arg.dateStr)
  }

function renderEventContent(arg) {
  const { event } = arg;
  const capacity = event.extendedProps.capacity ?? 0;
  const registered = event.extendedProps.registered ?? 0;
  const remaining = Math.max(capacity - registered, 0);

  return (
    <Stack alignItems={'center'} justifyContent={'center'} sx={{height:'100%', fontSize: '0.75rem', lineHeight: 1, p:1 }}>
      {/* Nom de l’événement */}
      <div style={{ fontWeight: 600, textAlign:'center' }}>{event.title}</div>

      {/* Nombre de places dispo / inscrits */}
      <div>
        {remaining} places dispo
      </div>
      <div>
        {registered} inscrits
      </div>
    </Stack>
  );
}
  return (<DashboardPageWrapper title={t('title')} subtitle={t('subtitle')} icon={<IconCalendar width={22} height={22} />}>
    En construction...
    <Stack sx={{ width: '100%', flex: 1 }}>
      <Box sx={{ width: '100%', height: '100%' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          locale="pt"                 // langue française
          firstDay={1}                // semaine commence le lundi
          weekends={true}             // mettre false si tu veux cacher sam/dim
          height="auto"
          expandRows={true}

          //hiddenDays={[0]}  // masque juste dimanche (0), par ex.

          //slotMinTime="08:00:00"  // pour les vues timeGrid
          //slotMaxTime="20:00:00"
          nowIndicator={true}     // petite ligne rouge “maintenant”

          /** 🔹 Barre du haut : boutons & titre */
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}

          /** 🔹 Texte des boutons */
          buttonText={{
            today: 'Aujourd’hui',
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
            list: 'Liste'
          }}

          /** 🔹 Événements (occupé / libre) */
          eventColor="#1d4ed8"       // fond
          eventTextColor="#ffffff"   // texte
          events={[
            {
              id: '1',
              title: 'Cours Excel',
              start: '2025-11-25',
              //end: '2025-11-25T12:00:00',
              backgroundColor: '#1d4ed8',   // occupé
              height:'200%',
              borderColor: '#1d4ed8',
              textColor: '#fff',
              display:'background',
              backgroundColor: '#fecaca',    // “zone occupée”
                  extendedProps: {
      capacity: 20,        // nombre total de places
      registered: 12       // nombre d’inscrits
    }
            },
            {
              id: '2',
              title: 'Maintenance serveur',
              start: '2025-11-26',
              display: 'background',        // couleur de fond sur le jour
              backgroundColor: '#fecaca',    // “zone occupée”
                  extendedProps: {
      capacity: 18,        // nombre total de places
      registered: 4       // nombre d’inscrits
    }
            }
          ]}

          /** 🔹 Style des cases “libres” / “occupées” via classes */
          dayCellClassNames={(args) => {
            // args.date est un objet Date
            const iso = args.date.toISOString().slice(0, 10)
            if (iso === '2025-11-28') {
              return ['fc-day-free']       // classe custom pour ce jour
            }
            return []
          }}

          /** 🔹 Callback quand on clique sur un jour / un event */
          dateClick={(info) => {
            console.log('Click sur le jour :', info.dateStr, info)
          }}
          eventClick={(info) => {
            console.log('Click sur event :', info.event, info)
          }}
          eventContent={renderEventContent}
        />
      </Box>
    </Stack>
  </DashboardPageWrapper>);
}
