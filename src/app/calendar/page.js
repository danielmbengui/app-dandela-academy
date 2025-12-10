"use client";
import React, { useEffect, useState } from 'react';
import { IconCalendar, IconDashboard, IconEmail, IconLogo, IconTiktok } from "@/assets/icons/IconsComponent";
import LoginPageWrapper from "@/components/wrappers/LoginPageWrapper";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { getFormattedHour, translateWithVars } from "@/contexts/functions";
import { NS_DASHBOARD_CALENDAR } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { useLanguage } from '@/contexts/LangProvider';
import { useSession } from '@/contexts/SessionProvider';
import DialogSession from '@/components/dashboard/sessions/DialogSession';
import DialogLesson from '@/components/dashboard/lessons/DialogLesson';
import { ClassLesson } from '@/classes/ClassLesson';

export default function DashboardCalendar() {
  const { theme } = useThemeMode();
  const { text } = theme.palette;
  const { t } = useTranslation([NS_DASHBOARD_CALENDAR, ClassLesson.NS_COLLECTION]);
  const { session, sessions, getOneSession, changeSession, isLoading, setUidSession } = useSession();
  
  const [isOpen, setIsOpen] = useState(false);
  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState(null);

  const {
    today: title_today,
    month: title_month,
    week: title_week,
    day: title_day,
    list: title_list
  } = t('calendar', { returnObjects: true });
  const { lang } = useLanguage();
  const handleDateClick = (info) => {
    console.log('Click sur le jour :', info.dateStr, info)
    //changeSession("pyLG1VRKbJo22kqlnS3Z")
    //alert(info.dateStr)
  }
  useEffect(() => {
    //console.log("xessions change", session);
    //setIsOpen(session !== null);
    if (sessions.length > 0) {
      const _slots = [];
      for (const session of sessions) {
        const sessionOnsiteCapacity = session.seats_availables_onsite || 0;
        const sessionOnlineCapacity = session.seats_availables_online || 0;
        const sessionOnsiteSubscribers = session.subscribers_onsite?.length || 0;
        const sessionOnlineSubscribers = session.subscribers_online?.length || 0;

        const sessionTotal = sessionOnsiteCapacity + sessionOnlineCapacity;
        const sessionRegistered = sessionOnsiteSubscribers + sessionOnlineSubscribers;
        const slots = session.slots || [];
        for (const slot of slots) {
          const onsiteCapacity = slot.seats_availables_onsite || 0;
          const onlineCapacity = slot.seats_availables_online || 0;
          const onsiteSubscribers = slot.subscribers_onsite?.length || 0;
          const onlineSubscribers = slot.subscribers_online?.length || 0;

          const total = onsiteCapacity + onlineCapacity;
          const registered = onsiteSubscribers + onlineSubscribers;
          const today = new Date();
          const status = today.getTime() > slot.end_date ? 'finished' : today.getTime() > slot.last_subscribe_time?.getTime?.() ? 'expired' : slot.status;
          _slots.push({
                  id: session.uid + "-" + slot.uid_intern,
                  title: session.lesson?.translate?.title || session.lesson?.title || "",
                  start: slot.start_date,
                  end: slot.end_date,

                  backgroundColor: '#fecaca',   // “zone occupée”
                  borderColor: '#1d4ed8',
                  textColor: '#fff',

                  // 👇 ici
                  classNames: [
                    'fc-daygrid-event',
                    `${status}`
                  ],

                  extendedProps: {
                    capacity: total,
                    available: total - registered,
                    registered,
                    session: session,
                    lesson: session.lesson,
                    slot,           // pratique si tu veux récupérer le slot exact
                    sessionUid: session.uid,
                  },
                });
        }
      }
      console.log("SLOTS", _slots)
      setSlots(_slots);
    } else {
      setSlots([]);
    }
  }, [sessions]);
  const handleEventClick = (info) => {
    //info.event.preventDefault();
    const { event } = info;
    const uid = info.event.id;
    const { extendedProps } = event;
    const { capacity, session, slot } = extendedProps;
    //console.log(uid, "CAPACACITY,", capacity)

    const _session = getOneSession(uid);
    //console.log('Click sur le evenement :', info.event.id, _session);
    setSlot(slot);
    setUidSession(session.uid);
    //setSession(_session);
    //changeSession(info.event.id);
    // alert("OK")
    //console.log('Click sur event :', info.event.source, info.event.id)
    //alert(info.dateStr)
  }

  const renderEventContent = (arg) => {
    const { event } = arg;
    //const lesson = event
    const lesson = event.extendedProps.lesson ?? 0;
    const capacity = event.extendedProps.capacity ?? 0;
    //const available = event.extendedProps.available ?? 0;
    const registered = event.extendedProps.registered ?? 0;

    const available = Math.max(capacity - registered, 0);
    // console.log("EVENT", event)
    return (
      <>
        <Stack sx={{ height: '100%', width: '100%', fontSize: '0.75rem' }}>

          {/* Nom de l’événement */}
          <Typography fontWeight={600} noWrap sx={{ fontSize: '0.8rem' }}>{event.title}</Typography>
          <div style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            //color:'var(--grey-light)'
          }}>
            {t(lesson.category, { ns: ClassLesson.NS_COLLECTION })?.toUpperCase()}
          </div>
          <div style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {getFormattedHour(new Date(event.start), lang)}-{getFormattedHour(new Date(event.end), lang)}
          </div>
          <div style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: '5px'
          }}>
            <span className={`badge`}>
              <span className="dot" />
              {available} disponibles
            </span>
          </div>
        </Stack>
        <style jsx>{`
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 2px 8px;
            border-radius: 999px;
            border: 0.1px solid var(--primary);
            background-color: var(--primary-shadow);
            color: var(--primary);
            font-size: 0.72rem;
            white-space: nowrap;
          }
  
          .badge-big {
            margin-top: 6px;
            font-size: 0.8rem;
            padding: 3px 10px;
          }
  
          .dot {
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: var(--primary);
            
          }
        `}</style>
      </>
    );
  }

  return (<DashboardPageWrapper title={t('title')} subtitle={t('subtitle')} icon={<IconCalendar width={22} height={22} />}>
    En construction...
    {
      isLoading && <CircularProgress />
    }
    {
      session && slot && <DialogSession session={session} selectedSlot={slot} isOpen={isOpen} />
    }
    <Stack sx={{
      width: '100%',
      flex: 1,
      maxWidth: '100%',         // ne jamais dépasser la largeur écran
      overflowX: 'hidden',       // évite le scroll horizontal global
      //background: 'red'
    }}>
      <Box sx={{
        width: '100%',
        '& .fc': {
          width: '100% !important',   // FullCalendar ne dépasse pas
          maxWidth: '100vw',
          //background: 'cyan',
          width: '100%',
          maxWidth: '100vw',
          '& .fc-header-toolbar': {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.25rem',
            //background:'yellow',
            //margin:0,
            padding: 0,
            width: "100%"
          },
          '@media (max-width:600px)': {
            '& .fc-header-toolbar': {
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
        },
      }}>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          locale={lang}                 // langue française
          firstDay={1}                // semaine commence le lundi
          weekends={true}             // mettre false si tu veux cacher sam/dim
          height="auto"
          expandRows={true}
          aspectRatio={0.5}
          handleWindowResize={true}
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
            today: title_today,
            month: title_month,
            week: title_week,
            day: title_day,
            list: title_list
          }}

          /** 🔹 Événements (occupé / libre) */
          eventColor="#1d4ed8"       // fond
          eventTextColor="#ffffff"   // texte
          events={[
            ...slots,
            {
              id: '1',
              title: 'Cours Excel',
              start: '2025-11-25T08:30:00',
              end: '2025-11-25T12:00:00',
              backgroundColor: '#1d4ed8',   // occupé
              //height: '200%',
              borderColor: '#1d4ed8',
              textColor: '#fff',
              //display: 'background',
              backgroundColor: '#fecaca',    // “zone occupée”
              extendedProps: {
                capacity: 20,        // nombre total de places
                registered: 12       // nombre d’inscrits
              }
            },
            {
              id: '2',
              title: 'Maintenance serveur',
              start: '2025-11-26T18:30:00',
              end: '2025-11-26T22:00:00',
              //display: 'background',        // couleur de fond sur le jour
              backgroundColor: '#fecaca',    // “zone occupée”
              extendedProps: {
                capacity: 18,        // nombre total de places
                registered: 4       // nombre d’inscrits
              }
            }
          ]}

          /** 🔹 Style des cases “libres” / “occupées” via classes */
          dayCellClassNames={(args) => {
            // console.log("args...", args.id)
            // args.date est un objet Date
            const iso = args.date.toISOString().slice(0, 10)
            if (iso === '2025-11-29') {
              return ['fc-day-free']       // classe custom pour ce jour
            }
            return []
          }}

          /** 🔹 Callback quand on clique sur un jour / un event */
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={renderEventContent}

        />
      </Box>
    </Stack>
  </DashboardPageWrapper>);
}
