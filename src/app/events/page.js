"use client";

import React, { useEffect, useState, useMemo } from "react";
import { IconSearch, IconCalendar } from "@/assets/icons/IconsComponent";
import { NS_BUTTONS, NS_COMMON, NS_DASHBOARD_MENU, NS_EVENTS } from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { ClassEvents } from "@/classes/ClassEvents";
import { getFormattedDateNumeric, getFormattedHour } from "@/contexts/functions";
import { useLanguage } from "@/contexts/LangProvider";
import FieldComponent from "@/components/elements/FieldComponent";
import { useRouter } from "next/navigation";
import { PAGE_EVENTS, PAGE_EVENT_ONE } from "@/contexts/constants/constants_pages";
import { useEvents } from "@/contexts/EventsProvider";
import Image from "next/image";

const TABLE_SPACE = `grid-template-columns:
  minmax(0, 0.5fr)
  minmax(0, 2fr)
  minmax(0, 1.2fr)
  minmax(0, 1fr)
  minmax(0, 1fr);
`;

function EventsListComponent() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { t } = useTranslation([ClassEvents.NS_COLLECTION, NS_EVENTS, NS_COMMON]);
  const { events, isLoading } = useEvents();
  const [filter, setFilter] = useState({ search: "" });
  const [eventsFilter, setEventsFilter] = useState([]);

  useEffect(() => {
    let list = [...events];
    if (filter.search?.trim()) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter((ev) => {
        const title = (ev.translate?.[lang]?.title || ev.title || "").toLowerCase();
        const location = (ev.location || "").toLowerCase();
        return title.includes(q) || location.includes(q);
      });
    }
    list.sort((a, b) => {
      const da = a.start_date?.getTime?.() ?? 0;
      const db = b.start_date?.getTime?.() ?? 0;
      return da - db;
    });
    setEventsFilter(list);
  }, [filter, events, lang]);

  return (
    <div>
      <main>
        <Grid container sx={{ mb: 2.5 }} direction="row" alignItems="center" spacing={{ xs: 1, sm: 1 }}>
          <Grid size={{ xs: 12 }}>
            <FieldComponent
              name="search"
              value={filter.search || ""}
              placeholder={t("placeholder_search", { ns: NS_EVENTS })}
              fullWidth
              type="text"
              icon={<IconSearch width={18} />}
              onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
              onClear={() => setFilter((prev) => ({ ...prev, search: "" }))}
            />
          </Grid>
        </Grid>

        <section className="card">
          <div className="table-header">
            <span className="th">{""}</span>
            <span className="th">{t("event", { ns: ClassEvents.NS_COLLECTION })}</span>
            <span className="th">{t("start_date", { ns: ClassEvents.NS_COLLECTION })}</span>
            <span className="th">{t("location", { ns: ClassEvents.NS_COLLECTION })}</span>
            <span className="th">{t("status", { ns: ClassEvents.NS_COLLECTION })}</span>
          </div>
          <div className="table-body">
            {isLoading ? (
              <div className="empty-state">{t("loading", { ns: NS_COMMON }) || "Chargement..."}</div>
            ) : eventsFilter.length === 0 ? (
              <div className="empty-state">{t("not-found", { ns: NS_EVENTS })}</div>
            ) : (
              eventsFilter.map((ev, i) => (
                <Box
                  key={`${ev.uid}-${i}`}
                  onClick={() => router.push(PAGE_EVENT_ONE(ev.uid))}
                  sx={{ cursor: "pointer" }}
                >
                  <EventRow ev={ev} lastChild={i === eventsFilter.length - 1} />
                </Box>
              ))
            )}
          </div>
        </section>
      </main>
      <style jsx>{`
        .card {
          background: var(--card-color);
          border-radius: 16px;
          border: 0.1px solid var(--card-border);
          padding: 0;
          overflow: hidden;
        }
        .table-header {
          display: grid;
          ${TABLE_SPACE}
          gap: 8px;
          padding: 8px 15px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--font-color);
          font-weight: 500;
          border-bottom: 0.1px solid var(--card-border);
          background: var(--background-menu);
        }
        @media (max-width: 900px) {
          .table-header {
            display: none;
          }
        }
        .th {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .table-body {
          display: flex;
          flex-direction: column;
        }
        .empty-state {
          padding: 16px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--grey-light);
        }
      `}</style>
    </div>
  );
}

function EventRow({ ev = null, lastChild = false }) {
  const { lang } = useLanguage();
  const { t } = useTranslation([ClassEvents.NS_COLLECTION, NS_COMMON]);
  const title = ev?.translate?.[lang]?.title || ev?.title || "";
  const statusConfig = ClassEvents.STATUS_CONFIG[ev?.status] || ClassEvents.STATUS_CONFIG.draft;

  return (
    <>
      <div className={`row ${lastChild ? "last-child" : ""}`}>
        <div className="cell cell-image">
          {ev?.photo_url && (
            <Box sx={{ width: { sm: "80px" } }}>
              <Image
                src={ev.photo_url}
                alt={title}
                width={80}
                height={60}
                style={{ width: "100%", height: "auto", borderRadius: "8px", objectFit: "cover" }}
              />
            </Box>
          )}
        </div>
        <div className="cell cell-title">
          <p className="text-main">{title}</p>
          {ev?.max_attendees > 0 && (
            <p className="text-sub">
              {ev.subscribers?.length ?? 0} / {ev.max_attendees} {t("subscribers", { ns: ClassEvents.NS_COLLECTION })}
            </p>
          )}
        </div>
        <div className="cell cell-date">
          {ev?.start_date ? (
            <>
              <p className="text-main">{getFormattedDateNumeric(ev.start_date, lang)}</p>
              {ev.end_date && (
                <p className="text-sub">
                  {getFormattedHour(ev.start_date, lang)} – {getFormattedHour(ev.end_date, lang)}
                </p>
              )}
            </>
          ) : (
            <p className="text-main">–</p>
          )}
        </div>
        <div className="cell cell-location">
          <p className="text-main">{ev?.location || "–"}</p>
        </div>
        <div className="cell cell-status">
          <div
            className="status-badge"
            style={{
              backgroundColor: statusConfig?.glow || statusConfig?.color,
              color: statusConfig?.color,
              borderColor: statusConfig?.color,
            }}
          >
            {t(ev?.status || "draft", { ns: ClassEvents.NS_COLLECTION })}
          </div>
        </div>
      </div>
      <style jsx>{`
        .row {
          display: grid;
          ${TABLE_SPACE}
          gap: 8px;
          padding: 10px 16px;
          font-size: 0.85rem;
          border-bottom: 0.1px solid var(--card-border);
          align-items: center;
        }
        .row.last-child {
          border-bottom: none;
        }
        .cell {
          min-width: 0;
        }
        .text-main {
          margin: 0;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--font-color);
        }
        .text-sub {
          margin: 0;
          font-size: 0.75rem;
          color: var(--grey-light);
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          border: 0.1px solid;
          padding: 2px 8px;
          font-size: 0.75rem;
        }
        @media (max-width: 900px) {
          .row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

export default function EventsPage() {
  const { t } = useTranslation([NS_EVENTS, NS_DASHBOARD_MENU, NS_BUTTONS]);

  return (
    <DashboardPageWrapper
      titles={[{ name: t("events", { ns: NS_DASHBOARD_MENU }) || t("title", { ns: NS_EVENTS }), url: "" }]}
      subtitle={t("subtitle", { ns: NS_EVENTS })}
      icon={<IconCalendar width={22} height={22} />}
    >
      <Stack alignItems="start" spacing={1.5} sx={{ width: "100%", height: "100%" }}>
        <EventsListComponent />
      </Stack>
    </DashboardPageWrapper>
  );
}
