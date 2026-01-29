"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { useSession } from "@/contexts/SessionProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useSchool } from "@/contexts/SchoolProvider";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LangProvider";
import {
  formatDuration,
  getFormattedDateNumeric,
  getFormattedHour,
  formatPrice,
} from "@/contexts/functions";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { Trans } from "react-i18next";
import {
  ClassSession,
  ClassSessionSlot,
} from "@/classes/ClassSession";
import { ClassLesson, ClassLessonTeacher } from "@/classes/ClassLesson";
import {
  NS_SESSIONS,
  NS_SESSIONS_ONE,
  NS_COMMON,
  NS_DASHBOARD_MENU,
  NS_BUTTONS,
} from "@/contexts/i18n/settings";
import { PAGE_SESSIONS, PAGE_LOGIN } from "@/contexts/constants/constants_pages";
import {
  IconSession,
  IconCalendar,
  IconHour,
  IconDuration,
  IconLocation,
  IconArrowBack,
  IconClock,
} from "@/assets/icons/IconsComponent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BadgeFormatLesson from "@/components/dashboard/lessons/BadgeFormatLesson";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import ButtonRemove from "@/components/dashboard/elements/ButtonRemove";
import AlertComponent from "@/components/elements/AlertComponent";
import Preloader from "@/components/shared/Preloader";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";

const SLOT_STATUSES_SUBSCRIBE = [
  ClassSessionSlot.STATUS.OPEN,
  ClassSessionSlot.STATUS.FULL,
  ClassSessionSlot.STATUS.SUBSCRIPTION_EXPIRED,
];

function SlotSubscribeBlock({ slot, session, update, user }) {
  const { t } = useTranslation([ClassSession.NS_COLLECTION, NS_SESSIONS_ONE, NS_BUTTONS]);
  const { lang } = useLanguage();
  const [processing, setProcessing] = useState(false);

  const isExpired = useMemo(() => {
    if (!slot?.last_subscribe_time) return false;
    return new Date() >= slot.last_subscribe_time;
  }, [slot?.last_subscribe_time]);

  const formats = useMemo(() => {
    const { ONLINE, ONSITE } = ClassSessionSlot.FORMAT;
    if (slot?.format === ClassSessionSlot.FORMAT.HYBRID) return [ONLINE, ONSITE];
    if (slot?.format === ClassSessionSlot.FORMAT.ONLINE) return [ONLINE];
    if (slot?.format === ClassSessionSlot.FORMAT.ONSITE) return [ONSITE];
    return [];
  }, [slot?.format]);

  const handleSubscribe = async (format) => {
    if (!user || !slot || !session) return;
    setProcessing(true);
    try {
      slot.subscribeStudent(user.uid, format);
      session.updateSlot(slot);
      await update(session);
    } finally {
      setProcessing(false);
    }
  };

  const handleUnsubscribe = async (format) => {
    if (!user || !slot || !session) return;
    setProcessing(true);
    try {
      slot.unsubscribeStudent(user.uid, format);
      session.updateSlot(slot);
      await update(session);
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'var(--primary-shadow)',
          borderColor: 'var(--primary-shadow-sm)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
          <Typography variant="body2" sx={{ color: 'var(--grey-light)' }}>
            {t("login_to_subscribe", { ns: NS_SESSIONS_ONE })}
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
    );
  }

  if (slot?.status === ClassSessionSlot.STATUS.SUBSCRIPTION_EXPIRED || isExpired) {
    return (
      <AlertComponent
        severity="error"
        subtitle={
          <Trans
            t={t}
            i18nKey="errors.last_subscribe_time"
            ns={ClassSession.NS_COLLECTION}
            values={{
              date: `${getFormattedDateNumeric(slot?.last_subscribe_time, lang)} – ${getFormattedHour(slot?.last_subscribe_time, lang)}`,
            }}
            components={{ b: <strong /> }}
          />
        }
      />
    );
  }

  if (slot?.status === ClassSessionSlot.STATUS.FULL && !slot?.isSubscribe?.(user?.uid)) {
    return (
      <AlertComponent
        severity="warning"
        subtitle={t("errors.full", { ns: ClassSession.NS_COLLECTION })}
      />
    );
  }

  if (slot?.status === ClassSessionSlot.STATUS.FINISHED || slot?.status === ClassSessionSlot.STATUS.DRAFT) {
    return (
      <Typography variant="body2" sx={{ color: 'var(--grey-light)' }}>
        {t(slot?.status, { ns: ClassSession.NS_COLLECTION })}
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2" sx={{ color: 'var(--grey-light)' }} fontWeight={600}>
        {t("seats_taken", { ns: ClassSession.NS_COLLECTION })}
      </Typography>
      <Grid container spacing={1.5}>
        {formats.map((format) => {
          const seatsKey = `seats_availables_${format}`;
          const total = slot?.[seatsKey] ?? 0;
          const subs = slot?.countSubscribers?.(format) ?? 0;
          const pct = total > 0 ? (subs / total) * 100 : 0;
          const full = slot?.isFull?.(format);
          const subscribed = !!slot?.isSubscribe?.(user?.uid, format);
          const barColor =
            pct >= 100 ? "var(--error)" : pct >= 80 ? "var(--warning)" : "var(--success)";

          return (
            <Grid key={format} size={{ xs: 12, sm: formats.length > 1 ? 6 : 12 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "var(--card-border)",
                  bgcolor: "var(--card-color)",
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={0.5}>
                    <BadgeFormatLesson format={format} />
                    <Typography variant="body2" sx={{ color: 'var(--grey-light)' }}>
                      {subs} / {total}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      bgcolor: 'var(--card-border)',
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${Math.min(pct, 100)}%`,
                        bgcolor: barColor,
                        borderRadius: 999,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Box>
                  {subscribed ? (
                    <ButtonRemove
                      disabled={processing}
                      loading={processing}
                      onClick={() => handleUnsubscribe(format)}
                      label={t("btn-unsubscribe", { ns: ClassSession.NS_COLLECTION })}
                      fullWidth
                      size="medium"
                    />
                  ) : (
                    <ButtonConfirm
                      disabled={full || processing}
                      loading={processing}
                      onClick={() => handleSubscribe(format)}
                      label={t("btn-subscribe", { ns: ClassSession.NS_COLLECTION })}
                      fullWidth
                      size="medium"
                    />
                  )}
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}

function MetaRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ minWidth: 0 }}>
      <Box sx={{ color: 'var(--grey-light)', mt: 0.25, flexShrink: 0 }}>
        {icon}
      </Box>
      <Stack spacing={0.25} sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'var(--grey-light)' }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500} sx={{ color: 'var(--font-color)' }}>
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
}

function SlotCard({ slot, session, update, user }) {
  const { t } = useTranslation([
    ClassSession.NS_COLLECTION,
    ClassLesson.NS_COLLECTION,
    NS_COMMON,
    NS_SESSIONS_ONE,
  ]);
  const { lang } = useLanguage();
  const { school } = useSchool();

  const statusCfg = ClassSessionSlot.STATUS_CONFIG[slot?.status];
  const iconProps = { width: 18, height: 18 };
  const showPrice = session?.price > 0;

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 0,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "var(--card-border)",
        bgcolor: "var(--card-color)",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: "var(--primary)",
          boxShadow: '0 4px 20px var(--primary-shadow-md)',
        },
      }}
    >
      <Stack spacing={0}>
        <Stack
          direction="row"
          flexWrap="wrap"
          alignItems="center"
          gap={1.5}
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 2,
            borderBottom: "1px solid",
            borderColor: "var(--card-border)",
          }}
        >
          {statusCfg && (
            <Chip
              size="small"
              label={t(slot?.status, { ns: ClassSession.NS_COLLECTION })}
              sx={{
                height: 24,
                fontWeight: 600,
                bgcolor: statusCfg.glow,
                color: statusCfg.color,
                border: `1px solid ${statusCfg.color}`,
                "& .MuiChip-label": { px: 1.25 },
              }}
            />
          )}
          <BadgeFormatLesson format={slot?.format} />
          {showPrice && (
            <Chip
              size="small"
              icon={<AttachMoneyIcon sx={{ fontSize: 14 }} />}
              label={formatPrice(session.price, session.currency)}
              sx={{
                height: 24,
                fontWeight: 600,
                bgcolor: 'var(--primary-shadow)',
                color: 'var(--primary)',
                border: '1px solid var(--primary)',
                "& .MuiChip-label": { px: 1.25 },
              }}
            />
          )}
          {slot?.last_subscribe_time && (
            <Typography variant="caption" sx={{ color: "var(--grey-light)", ml: "auto" }}>
              {t("slot_subscribe_before", {
                ns: NS_SESSIONS_ONE,
                date: getFormattedDateNumeric(slot.last_subscribe_time, lang),
                hour: getFormattedHour(slot.last_subscribe_time, lang),
              })}
            </Typography>
          )}
        </Stack>

        <Stack spacing={2} sx={{ p: { xs: 2, sm: 2.5 } }}>
          {showPrice && school && (
            <Box
              sx={{
                pb: 2,
                borderBottom: "1px solid",
                borderColor: "var(--card-border)",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <AccountBalanceIcon sx={{ fontSize: 18, color: 'var(--grey-light)' }} />
                <Typography variant="subtitle2" sx={{ color: 'var(--grey-light)' }} fontWeight={600}>
                  {t("bank_account", { ns: ClassLesson.NS_COLLECTION })}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                {school?.bank_account && (
                  <MetaRow
                    icon={<Box sx={{ width: 18, height: 18 }} />}
                    label={t("bank_account", { ns: ClassLesson.NS_COLLECTION })}
                    value={school.bank_account}
                  />
                )}
                {school?.iban && (
                  <MetaRow
                    icon={<Box sx={{ width: 18, height: 18 }} />}
                    label={t("iban", { ns: ClassLesson.NS_COLLECTION })}
                    value={school.iban}
                  />
                )}
                {school?.bank_name && (
                  <MetaRow
                    icon={<Box sx={{ width: 18, height: 18 }} />}
                    label={t("bank_name", { ns: ClassLesson.NS_COLLECTION })}
                    value={school.bank_name}
                  />
                )}
                {school?.bank_express && (
                  <MetaRow
                    icon={<Box sx={{ width: 18, height: 18 }} />}
                    label={t("bank_express", { ns: ClassLesson.NS_COLLECTION })}
                    value={school.bank_express}
                  />
                )}
              </Stack>
              <Box sx={{ mt: 2.5, mb: 1 }}>
                <AlertComponent
                  severity="error"
                  subtitle={
                    <Stack spacing={0.5}>
                      <Typography variant="body2" component="span">
                        {t("payment", { ns: ClassLesson.NS_COLLECTION })}
                      </Typography>
                      <Typography variant="body2" component="span">
                        {t("payment_online", { ns: ClassLesson.NS_COLLECTION })}
                      </Typography>
                      <Typography variant="body2" component="span">
                        {t("payment_onsite", { ns: ClassLesson.NS_COLLECTION })}
                      </Typography>
                    </Stack>
                  }
                />
              </Box>
            </Box>
          )}
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <MetaRow
                icon={<IconCalendar {...iconProps} />}
                label={t("start_date", { ns: ClassSession.NS_COLLECTION })}
                value={
                  slot?.start_date
                    ? `${getFormattedDateNumeric(slot.start_date, lang)} – ${getFormattedHour(slot.start_date, lang)}`
                    : null
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <MetaRow
                icon={<IconHour {...iconProps} />}
                label={t("end_date", { ns: ClassSession.NS_COLLECTION })}
                value={
                  slot?.end_date
                    ? `${getFormattedDateNumeric(slot.end_date, lang)} – ${getFormattedHour(slot.end_date, lang)}`
                    : null
                }
              />
            </Grid>
            {slot?.last_subscribe_time && (
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <MetaRow
                  icon={<IconClock {...iconProps} />}
                  label={t("subscribe_deadline", { ns: NS_SESSIONS_ONE })}
                  value={`${getFormattedDateNumeric(slot.last_subscribe_time, lang)} – ${getFormattedHour(slot.last_subscribe_time, lang)}`}
                />
              </Grid>
            )}
            {slot?.duration > 0 && (
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <MetaRow
                  icon={<IconDuration {...iconProps} />}
                  label={t("duration", { ns: ClassSession.NS_COLLECTION })}
                  value={formatDuration(slot.duration)}
                />
              </Grid>
            )}
            {slot?.location && (
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <MetaRow
                  icon={<IconLocation {...iconProps} />}
                  label={t("location", { ns: ClassSession.NS_COLLECTION })}
                  value={slot.location}
                />
              </Grid>
            )}
          </Grid>

          <Box
            sx={{
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: "var(--card-border)",
            }}
          >
            <SlotSubscribeBlock
              slot={slot}
              session={session}
              update={update}
              user={user}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function OneSessionPage() {
  const params = useParams();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { setUidLesson, lessons, getOneLesson } = useLessonTeacher();
  const { session, update, setUidSession, isLoading } = useSession();
  const { t } = useTranslation([
    ClassSession.NS_COLLECTION,
    ClassLesson.NS_COLLECTION,
    NS_SESSIONS,
    NS_SESSIONS_ONE,
    NS_DASHBOARD_MENU,
    NS_COMMON,
  ]);

  const uid = params?.uid;
  const [lessonTeacher, setLessonTeacher] = useState(null);

  useEffect(() => {
    if (uid) setUidSession(uid);
    return () => setUidSession(null);
  }, [uid, setUidSession]);


  const slotsToShow = useMemo(() => {
    if (!session?.slots?.length) return [];
    return session.slots.filter((s) =>
      SLOT_STATUSES_SUBSCRIBE.includes(s.status)
    );
  }, [session?.slots]);
  const lesson = useMemo(() => {
    if (!session?.uid_lesson) return null;
    return getOneLesson(session.uid_lesson);
  }, [session?.uid_lesson]);

  const sessionTitle = useMemo(
    () =>
      session?.code ||
      session?.title ||
      t("session", { ns: ClassSession.NS_COLLECTION }),
    [session?.code, session?.title, t]
  );

  const lessonTitle = useMemo(
    () =>
      lesson?.title || ""
    [lesson]
  );

  const courseImage = useMemo(
    () =>
      lesson?.photo_url || ""
    [lesson]
  );

  const courseDescription = useMemo(
    () =>
      lesson?.description || ""
    [lesson]
  );

  const courseSubtitle = useMemo(
    () =>
      lesson?.subtitle || ""
    [lesson]
  );

  if (isLoading && !session) {
    return <Preloader />;
  }

  if (!session && !isLoading) {
    return (
      <DashboardPageWrapper
        titles={[
          { name: t("title", { ns: NS_SESSIONS }), url: PAGE_SESSIONS },
          { name: t("not_found", { ns: NS_SESSIONS_ONE }), url: "" },
        ]}
        icon={<IconSession />}
      >
        <Stack alignItems="center" justifyContent="center" spacing={3} sx={{ py: 6, px: 2 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: 'var(--card-border)',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: 'var(--grey-light)',
            }}
          >
            <IconSession width={40} height={40} />
          </Box>
          <Typography variant="h6" textAlign="center" sx={{ color: 'var(--grey-light)' }}>
            {t("not_found", { ns: NS_SESSIONS_ONE })}
          </Typography>
          <ButtonConfirm
            component={Link}
            href={PAGE_SESSIONS}
            label={t("back_to_list", { ns: NS_SESSIONS_ONE })}
            variant="outlined"
            icon={<IconArrowBack width={20} height={20} />}
          />
        </Stack>
      </DashboardPageWrapper>
    );
  }

  return (
    <DashboardPageWrapper
      titles={[
        { name: t("title", { ns: NS_SESSIONS }), url: PAGE_SESSIONS },
        { name: sessionTitle, url: "" },
      ]}
      icon={<IconSession />}
    >
      <Stack spacing={3}>
        {/* Hero */}
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            borderRadius: 2.5,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "var(--card-border)",
            bgcolor: "var(--card-color)",
          }}
        >
          <Grid container spacing={0} sx={{ alignItems: "stretch" }}>
            {courseImage && (
              <Grid size={{ xs: 12, md: 2 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 220, md: "100%" },
                    minHeight: { xs: 220 },
                    bgcolor: 'var(--card-color)',
                    overflow: "hidden",
                    "& img": {
                      objectFit: { xs: "cover", md: "contain" },
                      objectPosition: { xs: "center center", md: "left center" },
                    },
                  }}
                >
                  <Image
                    src={courseImage}
                    alt={lessonTitle ?? ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    priority
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Grid>
            )}

            <Grid size={{ xs: 12, md: courseImage ? 7 : 12 }}>
              <Stack
                spacing={2}
                sx={{
                  p: { xs: 2, sm: 3, md: 3.5 },
                  minWidth: 0,
                  width: "100%",
                }}
                justifyContent="center"
              >
              <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.3, color: 'var(--font-color)' }}>
                {lessonTitle}
              </Typography>
              {courseSubtitle && (
                <Typography variant="subtitle1" sx={{ color: 'var(--grey-light)', lineHeight: 1.4 }}>
                  {courseSubtitle}
                </Typography>
              )}
              <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
                {session?.code && (
                  <Chip
                    size="small"
                    label={session.code}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {lesson?.category && (
                  <Chip
                    size="small"
                    label={t(lesson.category, { ns: ClassLesson.NS_COLLECTION })}
                    sx={{ bgcolor: 'var(--primary-shadow)' }}
                  />
                )}
              </Stack>
              {session?.teacher && (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  {session.teacher.showAvatar?.({ size: 40, fontSize: '16px' })}
                  <Stack spacing={0.25}>
                    <Typography variant="caption" sx={{ color: 'var(--grey-light)' }}>
                      {t("teacher", { ns: NS_COMMON })}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: 'var(--font-color)' }}>
                      {session.teacher.name || session.teacher.email}
                    </Typography>
                  </Stack>
                </Stack>
              )}
              {courseDescription && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'var(--grey-light)',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5,
                  }}
                >
                  {courseDescription}
                </Typography>
              )}
              </Stack>
            </Grid>
          </Grid>

        </Paper>

        {/* Slots */}
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'var(--font-color)' }}>
              {t("slots_plural", { ns: ClassSession.NS_COLLECTION })}
            </Typography>
            <ButtonConfirm
              component={Link}
              href={PAGE_SESSIONS}
              label={t("back_to_list", { ns: NS_SESSIONS_ONE })}
              variant="outlined"
              size="small"
              icon={<IconArrowBack width={18} height={18} />}
            />
          </Stack>

          {slotsToShow.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                borderRadius: 2.5,
                textAlign: "center",
                borderColor: "var(--card-border)",
                bgcolor: "var(--card-color)",
              }}
            >
              <Typography sx={{ color: 'var(--grey-light)' }}>
                {t("not_found", { ns: NS_SESSIONS_ONE })}
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {slotsToShow.map((slot) => (
                <Grid key={slot.uid_intern} size={{ xs: 12 }}>
                  <SlotCard
                    slot={slot}
                    session={session}
                    update={update}
                    user={user}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Stack>
    </DashboardPageWrapper>
  );
}
