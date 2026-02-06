"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { useCertif } from "@/contexts/CertifProvider";
import { useLanguage } from "@/contexts/LangProvider";
import { ClassUserCertification } from "@/classes/users/ClassUserCertification";
import { getFormattedDateNumeric } from "@/contexts/functions";
import { Icon } from "@iconify/react";
import Link from "next/link";
import ProviderCertifs from "@/contexts/providers/providercertifs";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { IconCertificate } from "@/assets/icons/IconsComponent";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { NS_CERTIFICATIONS, NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import LoadingComponent from "@/components/shared/LoadingComponent";

const NS_CLASS_CERT = "classes/certification";
function EmptyCertificationsList() {
  return (
    <Stack alignItems={'center'} sx={{ width: 'fit-content'}}>
      <Icon icon="ph:certificate-duotone" className="w-8 h-8 text-gray-500 dark:text-gray-400" />
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{tCertPage("list_empty_title")}</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{tCertPage("list_empty_hint")}</p>
    </Stack>
  );
}
/** Libellé et style du statut (excellent, good, etc.) */
function getStatusConfig(status) {
  if (!status) return null;
  return (
    ClassUserCertification.STATUS_CONFIG_STATS?.[status] ??
    ClassUserCertification.STATUS_CONFIG_STATS?.["not-good"] ??
    null
  );
}
function formatCertDate(date, lang) {
  if (!date) return "—";
  const d = date instanceof Date ? date : new Date(date);
  return getFormattedDateNumeric(d, lang);
}
/** Carte certificat moderne : bandeau de statut, score circulaire, dates et CTA */
function CertificationCard({ cert, lang, tCert }) {
  const statusConfig = getStatusConfig(cert.status);
  const lessonTitle =
    cert?.lesson?.translates?.find((t) => t.lang === lang)?.title ??
    cert?.lesson?.title ??
    "—";
  const percentage = cert.percentage != null ? Math.round(cert.percentage) : 0;

  return (
    <article
      className="cert-card group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/90 shadow-sm border border-gray-200/80 dark:border-gray-700/80 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: statusConfig?.border ?? "var(--gray-400)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-0">
        {/* Bloc principal : titre + métadonnées */}
        <div className="flex-1 p-5 sm:p-6 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
              style={{
                color: statusConfig?.color,
                border: `1px solid ${statusConfig?.border}`,
                background: statusConfig?.background,
              }}
            >
              {statusConfig?.label ?? cert.status}
            </span>
            {cert.code && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {tCert("code")} {cert.code}
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight">
            {lessonTitle}
          </h2>
          {cert.reference && (
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono break-all mb-4">
              {tCert("ref")} {cert.reference}
            </p>
          )}

          {/* Dates */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="ph:calendar-check" className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              {tCert("obtained_on")} {formatCertDate(cert.obtained_date, lang)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="ph:calendar-blank" className="w-4 h-4 text-amber-500 flex-shrink-0" />
              {tCert("valid_until")} {formatCertDate(cert.expires_date, lang)}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-4">
            <Link
              href={`/certifications/${cert.uid}`}
              className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ color: "var(--primary)" }}
            >
              <Icon icon="ph:file-pdf" className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
              {tCert("view_certificate")}
            </Link>
          </div>
        </div>

        {/* Bloc score : cercle + points */}
        <div className="flex sm:flex-col sm:justify-center items-center gap-4 sm:gap-3 px-5 py-4 sm:py-6 sm:px-6 bg-gray-50/80 dark:bg-gray-900/50 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-700/80">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full font-bold text-xl text-white shrink-0"
            style={{
              background: statusConfig?.background ?? "var(--primary)",
              color: statusConfig?.color_icon ?? "#fff",
              boxShadow: `0 4px 14px ${statusConfig?.glow ?? "rgba(0,0,0,0.15)"}`,
            }}
          >
            {Math.round(percentage)}%
          </div>
          <div className="text-center sm:text-center">
            <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">
              {cert.score ?? "—"}
              <span className="text-gray-500 dark:text-gray-400 font-normal text-lg">
                /{cert.count_questions ?? "—"}
              </span>
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {tCert("score")} ({tCert("points")})
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
function CertificationsListContent({isLoadingUser}) {
  const { lang } = useLanguage();
  const { certifications, isLoading } = useCertif();
  const { t: tCert } = useTranslation(NS_CLASS_CERT);
  const { t: tCertPage } = useTranslation(NS_CERTIFICATIONS);

  if (isLoading) {
    return (<LoadingComponent />);
  }

  if (certifications.length === 0) {
    return (
      <Stack className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-10 text-center w-fit"
      style={{borderColor: 'var(--primary-shadow-sm)', backgroundColor: 'var(--primary-shadow)'}}>
        <div className="w-16 h-16 rounded-2xl bg-gray-200/80 dark:bg-gray-700/80 flex items-center justify-center mx-auto mb-4"
        style={{backgroundColor: 'var(--primary-shadow)'}}>
          <Icon color="var(--primary)" icon="ph:certificate-duotone" className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {tCertPage("list_empty_title")}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {tCertPage("list_empty_hint")}
        </p>
      </Stack>
    );
  }

  return (
    <ul className="space-y-4 list-none p-0 m-0">
      {certifications.map((cert) => (
        <li key={cert.uid}>
          <CertificationCard cert={cert} lang={lang} tCert={tCert} />
        </li>
      ))}
    </ul>
  );
}
export default function CertificationsPage() {
  const { user, isLoading: isLoadingUser } = useAuth();
  const { t } = useTranslation([NS_CERTIFICATIONS, NS_DASHBOARD_MENU]);

  return (
    <ProviderCertifs uidUser={user?.uid ?? ""}>
      <DashboardPageWrapper
        titles={[
          { name: t("certifications", { ns: NS_DASHBOARD_MENU }) || "Certifications", url: "" },
        ]}
        title={t("title-page")}
        subtitle={t("subtitle")}
        icon={<IconCertificate width={22} height={22} />}
      >
        <Stack sx={{ width: "100%" }}>
          <CertificationsListContent isLoadingUser={isLoadingUser} />
        </Stack>
      </DashboardPageWrapper>
    </ProviderCertifs>
  );
}
