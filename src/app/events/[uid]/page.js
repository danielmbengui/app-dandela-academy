"use client";

import React, { useEffect, useState } from "react";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { useEvents } from "@/contexts/EventsProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LangProvider";
import { getFormattedDateNumeric, getFormattedHour } from "@/contexts/functions";
import { Box, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import {
  NS_EVENTS,
  NS_EVENTS_ONE,
  NS_COMMON,
  NS_DASHBOARD_MENU,
  NS_BUTTONS,
} from "@/contexts/i18n/settings";
import { PAGE_EVENTS, PAGE_LOGIN } from "@/contexts/constants/constants_pages";
import { IconCalendar, IconArrowBack } from "@/assets/icons/IconsComponent";
import { ClassEvents } from "@/classes/ClassEvents";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import ButtonRemove from "@/components/dashboard/elements/ButtonRemove";
import Preloader from "@/components/shared/Preloader";

export default function EventDetailPage() {
  const params = useParams();
  const uid = params?.uid;
  const { lang } = useLanguage();
  const { t } = useTranslation([ClassEvents.NS_COLLECTION, NS_EVENTS_ONE, NS_BUTTONS]);
  const { user } = useAuth();
  const { event, setUidEvent, isLoading, subscribeToEvent, unsubscribeFromEvent } = useEvents();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (uid) setUidEvent(uid);
    return () => setUidEvent(null);
  }, [uid, setUidEvent]);

  const ev = event;
  const instance = ev instanceof ClassEvents ? ev : ev ? new ClassEvents(ev) : null;
  const title = ev?.translate?.[lang]?.title || ev?.title || "";
  const description = ev?.translate?.[lang]?.description || ev?.description || "";
  const isFinished = ev?.status === ClassEvents.STATUS.FINISHED;
  const full = instance ? instance.isFull() : false;
  const subscribed = instance && user ? instance.isSubscribed(user.uid) : false;

  const handleSubscribe = async () => {
    if (!user || !ev) return;
    setProcessing(true);
    setMessage(null);
    try {
      const ok = await subscribeToEvent(ev.uid, user.uid);
      setMessage(ok ? "subscribe_success" : "errors.main");
    } finally {
      setProcessing(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!user || !ev) return;
    setProcessing(true);
    setMessage(null);
    try {
      const ok = await unsubscribeFromEvent(ev.uid, user.uid);
      setMessage(ok ? "unsubscribe_success" : "errors.main");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading && !ev) {
    return (
      <DashboardPageWrapper
        titles={[{ name: t("title", { ns: NS_EVENTS_ONE }), url: PAGE_EVENTS }]}
        icon={<IconCalendar width={22} height={22} />}
      >
        <Preloader />
      </DashboardPageWrapper>
    );
  }

  if (!ev) {
    return (
      <DashboardPageWrapper
        titles={[{ name: t("event", { ns: ClassEvents.NS_COLLECTION }), url: PAGE_EVENTS }]}
        icon={<IconCalendar width={22} height={22} />}
      >
        <Typography color="text.secondary">{t("not-found", { ns: NS_EVENTS })}</Typography>
      </DashboardPageWrapper>
    );
  }

  return (
    <DashboardPageWrapper
      titles={[
        { name: t("events", { ns: NS_DASHBOARD_MENU }), url: PAGE_EVENTS },
        { name: title, url: "" },
      ]}
      icon={<IconCalendar width={22} height={22} />}
    >
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 720 }}>
        <ButtonConfirm
          component={Link}
          href={PAGE_EVENTS}
          label={t("back_to_list", { ns: NS_EVENTS_ONE })}
          variant="outlined"
          size="small"
          startIcon={<IconArrowBack width={18} />}
        />

        {ev.photo_url && (
          <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Image
              src={ev.photo_url}
              alt={title}
              width={720}
              height={360}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </Box>
        )}

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
              {description}
            </Typography>
          )}
          <Stack spacing={1} sx={{ mt: 2 }}>
            {ev.start_date && (
              <Typography variant="body2">
                <strong>{t("start_date", { ns: ClassEvents.NS_COLLECTION })} :</strong>{" "}
                {getFormattedDateNumeric(ev.start_date, lang)}
                {ev.end_date && ` – ${getFormattedHour(ev.start_date, lang)} - ${getFormattedHour(ev.end_date, lang)}`}
              </Typography>
            )}
            {ev.location && (
              <Typography variant="body2">
                <strong>{t("location", { ns: ClassEvents.NS_COLLECTION })} :</strong> {ev.location}
              </Typography>
            )}
            {ev.max_attendees > 0 && (
              <Typography variant="body2">
                <strong>{t("subscribers", { ns: ClassEvents.NS_COLLECTION })} :</strong>{" "}
                {instance.countSubscribers()} / {ev.max_attendees}
              </Typography>
            )}
            <Typography variant="body2">
              <strong>{t("status", { ns: ClassEvents.NS_COLLECTION })} :</strong>{" "}
              {t(ev.status, { ns: ClassEvents.NS_COLLECTION })}
            </Typography>
          </Stack>
        </Paper>

        {message && (
          <Typography color={message.startsWith("errors") ? "error" : "primary"} variant="body2">
            {t(message, { ns: message.startsWith("errors") ? ClassEvents.NS_COLLECTION : NS_EVENTS_ONE })}
          </Typography>
        )}

        {!user ? (
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                {t("login_to_subscribe", { ns: NS_EVENTS_ONE })}
              </Typography>
              <ButtonConfirm
                component={Link}
                href={PAGE_LOGIN}
                label={t("connect", { ns: NS_BUTTONS })}
                variant="outlined"
                size="small"
              />
            </Stack>
          </Paper>
        ) : isFinished ? (
          <Typography color="text.secondary">{t("finished", { ns: ClassEvents.NS_COLLECTION })}</Typography>
        ) : subscribed ? (
          <Stack direction="row" spacing={1}>
            <Typography color="primary" variant="body2" sx={{ alignSelf: "center" }}>
              {t("subscribed", { ns: NS_EVENTS_ONE })}
            </Typography>
            <ButtonRemove
              label={t("btn-unsubscribe", { ns: ClassEvents.NS_COLLECTION })}
              onClick={handleUnsubscribe}
              disabled={processing}
            />
          </Stack>
        ) : full ? (
          <Typography color="text.secondary">{t("errors.full", { ns: ClassEvents.NS_COLLECTION })}</Typography>
        ) : (
          <ButtonConfirm
            label={t("btn-subscribe", { ns: ClassEvents.NS_COLLECTION })}
            onClick={handleSubscribe}
            disabled={processing}
          />
        )}
      </Stack>
    </DashboardPageWrapper>
  );
}
