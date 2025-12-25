import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IconCalendar } from "@/assets/icons/IconsComponent";
import { capitalizeFirstLetter, getFormattedHour, getStartOfDay } from "@/contexts/functions";
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
function getPeriodFromText(text = "") {
    if (!text) return;
    const finalText = text.toLowerCase();
    const PERIODS = ['day', 'week', 'month', 'year'];
    for(const period of PERIODS) {
        if(finalText.indexOf(period)>=0) {
            return period;
        }
    }
    return '';
}
export default function CalendarComponent({
    //mode = '',
    setMode = null,
    //isOpen = false,
    setIsOpen = null,
    //initStartDate = null,
    setInitStartDate = null,
}) {
    const { t } = useTranslation([NS_DASHBOARD_CALENDAR, ClassLesson.NS_COLLECTION]);
    const {
        getOneSession,
        isLoadingSlots: isLoading,
        setUidSession,
        setUidSlot,
        slots
    } = useSession();
    const { user } = useAuth();
    const [viewCalendar, setViewCalendar] = useState('dayGridMonth');
    const [viewMode, setViewMode] = useState('calendar');
    const [viewPeriod, setViewPeriod] = useState('month');
    const calendarRef = useRef(null);
    function goNext() {
        const calendarApi = calendarRef.current.getApi()
        calendarApi.next();
        //calendarApi.
    }

    useEffect(() => {
        if (viewMode) {
            console.log("VIEW mode", viewMode)
            const el = document.querySelector(`.fc-${viewMode}-button`);
            const other = viewMode === 'calendar' ? 'list' : 'calendar';
            const el_other = document.querySelector(`.fc-${other}-button`);
            if (!el || !el_other) return;
            el.classList.toggle("is-active", true);
            el_other.classList.toggle("is-active", false);
        }
    }, [viewMode]);

    //const [isOpen, setIsOpen] = useState(false);
    //const [mode, setMode] = useState('');
    //const [initStartDate, setInitStartDate] = useState(new Date());
    const {
        today: title_today,
        year: title_year,
        month: title_month,
        week: title_week,
        day: title_day,
        list: title_list
    } = t('calendar', { returnObjects: true });
    const { lang } = useLanguage();
    const handleChangeMode = (mode = '', period = '') => {
        const api = calendarRef.current?.getApi();
        if (!mode || !period || !api) return;
        setViewMode(mode); // 👈 ton "actif"
        setViewPeriod(period); // 👈 ton "actif"
        var viewTime = '';
        switch (viewCalendar) {
            case 'dayGridYear':
            case 'listYear': viewTime = mode === 'calendar' ? "dayGridYear" : "listYear"; break;
            case 'dayGridMonth':
            case 'listMonth': viewTime = mode === 'calendar' ? "dayGridMonth" : "listMonth"; break;
            case 'timeGridWeek':
            case 'listWeek': viewTime = mode === 'calendar' ? "timeGridWeek" : "listWeek"; break;
            case 'timeGridDay':
            case 'listDay': viewTime = mode === 'calendar' ? "timeGridDay" : "listDay"; break;
            default: viewTime = "";
        }
        if (!viewTime) return;
// finalView = `${viewTime}${formattedPeriod}`;
        setViewCalendar(viewTime);
        api.changeView(viewTime);
    }
    const handleDatesSet = (arg) => {
        // arg.view.type => "dayGridMonth", "timeGridWeek", "timeGridDay", "listWeek", etc.
        // arg.start / arg.end => bornes de la plage visible
       // console.log("view:", arg.view.type);
       // console.log("range:", arg.start, arg.end);
        setViewCalendar(arg.view.type);
        //setViewMode("calendar"); // 👈 ton "actif"
        // Ici tu peux fetch tes events selon start/end + view.type
        // fetchEvents({ start: arg.start, end: arg.end, view: arg.view.type })
    };
    const handleDateClick = (info) => {
        console.log('Click sur le jour :', info.dateStr, "info", info)
        console.log("new date", new Date(info.dateStr),);
        if (user instanceof ClassUserIntern) {
            const date = info.date || new Date(info.dateStr) || null;
            if (date && getStartOfDay(date) < getStartOfDay(new Date())) {
                return;
            }
            setInitStartDate(date);
            setMode('create');
            setIsOpen(true);
        }
        //alert(info.dateStr)
    }
    const handleEventClick = (info) => {
        //info.event.preventDefault();
        const { event } = info;
        const uid = info.event.id;
        const { extendedProps } = event;
        const { capacity, session, slot } = extendedProps;
        //console.log(uid, "CAPACACITY,", capacity)

        //const _session = getOneSession(uid);
        console.log('Click sur le evenement :', slot);
        //setSession(session);
        //setSlot(slot);
        //setSlot(slot);
        setIsOpen(true);
        setUidSession(session.uid);
        setUidSlot(slot.uid_intern);
        setMode('read');
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
    const calendarEvents = useMemo(() => ([
        ...slots.map(slot => {
            const session = getOneSession(slot.uid_session);
            const start = slot.start_date?.toDate ? slot.start_date.toDate() : slot.start_date;
            const end = slot.end_date?.toDate ? slot.end_date.toDate() : slot.end_date;

            const onsiteCapacity = slot.seats_availables_onsite || 0;
            const onlineCapacity = slot.seats_availables_online || 0;
            const onsiteSubscribers = slot.subscribers_onsite?.length || 0;
            const onlineSubscribers = slot.subscribers_online?.length || 0;

            const total = onsiteCapacity + onlineCapacity;
            const registered = onsiteSubscribers + onlineSubscribers;

            return {
                id: `${session?.uid ?? slot.uid_session}-${slot.uid_intern}`,
                title: session?.lesson?.translate?.title || session?.lesson?.title || "",
                start,
                end,
                //classNames: ['fc-daygrid-event',`${slot.status}`],
                classNames: [`${slot.status}`],
                extendedProps: { capacity: total, registered, session, lesson: session?.lesson ?? null, slot },
            };
        })
    ]), [slots, getOneSession]);

    return (<>

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
                    px: 1,
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
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin,]}
                initialView={viewCalendar}
                locale={lang}                 // langue française
                firstDay={1}                // semaine commence le lundi
                weekends={true}             // mettre false si tu veux cacher sam/dim
                height="auto"
                expandRows={true}
                aspectRatio={0.5}
                handleWindowResize={true}
                /** 🔹 Barre du haut : boutons & titre */
                headerToolbar={{
                    left: 'prev,next,today calendar,list',
                    center: 'title',
                    right: viewMode === 'calendar' ?
                        'timeGridDay,timeGridWeek,dayGridMonth,dayGridYear' :
                        'listDay,listWeek,listMonth,listYear'
                }}
                buttonText={{
                    //calendar: 'calendar one',
                    today: title_today,
                    year: title_year,
                    month: title_month,
                    week: title_week,
                    day: title_day,
                    //list: title_list,
                    listYear: title_year,
                }}
                allDayText=''
                titleFormat={{ year: 'numeric', month: 'short', day: 'numeric' }}
                views={{
                    dayGridYear: {
                        titleFormat: { year: 'numeric' }
                    },
                    listYear: {
                        titleFormat: { year: 'numeric' }
                    },
                    dayGridMonth: {
                        titleFormat: { year: 'numeric', month: 'long' }
                    },
                    listMonth: {
                        titleFormat: { year: 'numeric', month: 'long' }
                    },
                    timeGridWeek: {
                        titleFormat: { year: 'numeric', month: 'short', day: '2-digit' }
                    },
                    listWeek: {
                        titleFormat: { year: 'numeric', month: 'short', day: '2-digit' }
                    },
                    timeGridDay: {
                        titleFormat: { year: 'numeric', month: 'short', day: '2-digit' }
                    },
                    listDay: {
                        titleFormat: { year: 'numeric', month: 'short', day: '2-digit' }
                    },
                }}
                //hiddenDays={[0]}  // masque juste dimanche (0), par ex.
                //slotMinTime="08:00:00"  // pour les vues timeGrid
                //slotMaxTime="20:00:00"
                nowIndicator={true}     // petite ligne rouge “maintenant”
                customButtons={{
                    calendar: {
                        text: t('calendar', {ns:NS_DASHBOARD_MENU}),
                        // disabled: true,
                        //hint: "Astuce au survol", // ✅ tooltip (title attr)

                        click: (arg) => {
                            //console.log("view:", arg.view.type);
                            console.log("periode:", getPeriodFromText(viewCalendar));
                            
                            handleChangeMode('calendar', getPeriodFromText(viewCalendar));
                            //setViewMode('calendar');
                            // ex: ouvrir un drawer, reset filtre, ouvrir un dialog, etc.
                        },
                    },
                    list: {
                        text: title_list,
                        //disabled: true,
                        //hint: "Astuce au survol", // ✅ tooltip (title attr)

                        click: (arg) => {
                            //console.log("view:", arg.view.type);
                            //console.log("range:", arg.start, arg.end);
                            //handleChangeMode('list', 'year');
                            handleChangeMode('list', getPeriodFromText(viewCalendar));
                            //setViewMode('list');
                            // ex: ouvrir un drawer, reset filtre, ouvrir un dialog, etc.
                        },
                    },
                }}

                /** 🔹 Texte des boutons */

                /** 🔹 Événements (occupé / libre) */
                events={calendarEvents}
                /** 🔹 Style des cases “libres” / “occupées” via classes */
                dayCellClassNames={(args) => {
                    // console.log("args...", args.id)
                    // args.date est un objet Date
                    const iso = args.date.toISOString().slice(0, 10)
                    if (iso === '2025-11-29') {
                        //return ['fc-day-free']       // classe custom pour ce jour
                    }
                    return []
                }}
                /** 🔹 Callback quand on clique sur un jour / un event */
                datesSet={handleDatesSet}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventContent={renderEventContent}
            />
        </Box>
    </>);
}
