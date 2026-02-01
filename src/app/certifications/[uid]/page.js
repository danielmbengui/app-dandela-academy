"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { EB_Garamond } from "next/font/google";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { IconLogoImage } from "@/assets/icons/IconsComponent";
import { IMAGE_PARTNER_INEFOP } from "@/contexts/constants/constants_images";
import { useCertif } from "@/contexts/CertifProvider";
import { useLanguage } from "@/contexts/LangProvider";
import { NS_CERTIFICATIONS, NS_DASHBOARD_MENU, NS_LANGS } from "@/contexts/i18n/settings";
import { PAGE_CERTIFICATIONS } from "@/contexts/constants/constants_pages";
import { ClassUserCertification } from "@/classes/users/ClassUserCertification";
import { useChapter } from "@/contexts/ChapterProvider";
import { useSchool } from "@/contexts/SchoolProvider";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { IconCertificate } from "@/assets/icons/IconsComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { CircularProgress, Stack } from "@mui/material";
import { useAuth } from "@/contexts/AuthProvider";
import ProviderCertifs from "@/contexts/providers/providercertifs";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cert-academic",
});

/** Format Firestore (online, onsite, hybrid) → affichage certificat (online, presentiel, hybride) */
const FORMAT_TO_DISPLAY = {
  online: "online",
  onsite: "presentiel",
  hybrid: "hybride",
};

/** Config format pour bandeaux / libellés (clés d’affichage) */
const CERTIFICATE_FORMAT_CONFIG = {
  online: { format: "En ligne", mode: "Standard", icon: "ph:monitor-play-fill" },
  presentiel: { format: "Présentiel", mode: "Standard+", icon: "ph:users-three-fill" },
  hybride: { format: "Hybride", mode: "⭐⭐⭐ Premium", icon: "ph:arrows-left-right-fill" },
};

function getStatusConfig(status) {
  if (!status) return null;
  return ClassUserCertification.STATUS_CONFIG_STATS?.[status] ?? ClassUserCertification.STATUS_CONFIG_STATS?.["not-good"] ?? null;
}

const LOCALE_MAP = { fr: "fr-FR", en: "en", pt: "pt" };
function formatDate(str, locale = "fr") {
  if (!str) return "—";
  const d = new Date(str);
  const localeTag = LOCALE_MAP[locale] || locale;
  return d.toLocaleDateString(localeTag, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

async function preloadImageAsDataUrl(origin, imageUrl) {
  if (!origin || !imageUrl || (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://"))) return null;
  try {
    const res = await fetch(`${origin}/api/proxy-image?url=${encodeURIComponent(imageUrl)}`);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("[PDF] Impossible de précharger la signature:", e);
    return null;
  }
}

async function exportCertificateToPdf(element, filename = "certificat-dandela-academy.pdf") {
  if (!element) return false;
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  try {
    const signatureImg = element.querySelector(".cert-director-signature-img");
    const signatureSrc = signatureImg?.getAttribute?.("src") || signatureImg?.src || "";
    const formatIconImg = element.querySelector(".cert-format-icon");
    const formatIconSrc = formatIconImg?.getAttribute?.("src") || formatIconImg?.src || "";

    const [signatureDataUrl, formatIconDataUrl] = await Promise.all([
      preloadImageAsDataUrl(origin, signatureSrc),
      preloadImageAsDataUrl(origin, formatIconSrc),
    ]);

    if (typeof document !== "undefined" && document.fonts?.ready) {
      await document.fonts.ready;
    }

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const scale = 3;
    const pdfWidth = 595;
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#fbfbfb",
      logging: false,
      imageTimeout: 15000,
      windowWidth: Math.max(element.scrollWidth, pdfWidth),
      windowHeight: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc, clonedElement) => {
        const fontLink = clonedDoc.createElement("link");
        fontLink.href = "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap";
        fontLink.rel = "stylesheet";
        clonedDoc.head.appendChild(fontLink);

        const style = clonedDoc.createElement("style");
        style.textContent = `.cert-pdf-fix { width: ${pdfWidth}px !important; min-width: ${pdfWidth}px !important; box-sizing: border-box !important; font-family: "EB Garamond", Garamond, "Times New Roman", serif !important; }
.cert-pdf-fix .cert-seal, .cert-pdf-fix .cert-format { display: inline-flex !important; align-items: center !important; }
.cert-pdf-fix .cert-inefop-text, .cert-pdf-fix .cert-line-floral { display: flex !important; align-items: center !important; }
.cert-pdf-fix .cert-icon-wrap { display: inline-flex !important; align-items: center !important; justify-content: center !important; align-self: center !important; }
.cert-pdf-fix .cert-icon-wrap svg, .cert-pdf-fix .cert-icon-wrap img { display: block !important; width: 1em !important; height: 1em !important; }`;
        clonedDoc.head.appendChild(style);
        clonedElement.classList.add("cert-pdf-fix");

        if (signatureDataUrl) {
          clonedElement.querySelectorAll(".cert-director-signature-img").forEach((img) => { img.src = signatureDataUrl; });
        }
        if (formatIconDataUrl) {
          clonedElement.querySelectorAll(".cert-format-icon").forEach((img) => { img.src = formatIconDataUrl; });
        }
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const ratio = canvas.height / canvas.width;
    const imgW = pageW;
    let imgH = pageW * ratio;
    let y = 0;
    if (imgH > pageH) {
      imgH = pageH;
      const scaledW = pageH / ratio;
      const x = (pageW - scaledW) / 2;
      pdf.addImage(imgData, "JPEG", x, 0, scaledW, pageH);
    } else {
      y = (pageH - imgH) / 2;
      pdf.addImage(imgData, "JPEG", 0, y, imgW, imgH);
    }
    pdf.save(filename);
    return true;
  } catch (err) {
    console.error("Export PDF:", err);
    return false;
  }
}

/**
 * Partage le certificat. Pour éviter que le titre de la page remplace notre titre,
 * on met le titre du document temporairement à notre titre, et on met le message
 * complet dans text pour les apps qui n'utilisent que ce champ.
 */
async function shareCertificate(options = {}) {
  const { title, text, url } = options;
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || "";
  const shareText = text ? (shareTitle ? `${shareTitle}\n\n${text}` : text) : shareTitle;

  if (typeof navigator !== "undefined" && navigator.share) {
    const prevTitle = typeof document !== "undefined" ? document.title : "";
    try {
      if (shareTitle && typeof document !== "undefined") document.title = shareTitle;
      await navigator.share({
        title: shareTitle,
        text: shareText + (shareUrl ? `\n\n${shareUrl}` : ""),
        url: shareUrl,
      });
      return true;
    } catch (e) {
      if (e.name === "AbortError") return false;
      return copyToClipboard(shareUrl);
    } finally {
      if (prevTitle && typeof document !== "undefined") document.title = prevTitle;
    }
  }
  return copyToClipboard(shareUrl);
}

function copyToClipboard(text) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}

function CertificationViewContent({ uidCert }) {
  const certificateRef = useRef(null);
  const { t } = useTranslation([NS_CERTIFICATIONS, NS_LANGS, "classes/stat"]);
  const { lang } = useLanguage();
  const [exporting, setExporting] = useState(false);
  const [shareDone, setShareDone] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);

  const { setUidCertification, certification, STATUS_CONFIG } = useCertif();
  const { getOneChapter } = useChapter();
  const { school } = useSchool();

  useEffect(() => {
    if (uidCert) setUidCertification(uidCert);
  }, [uidCert, setUidCertification]);

  useEffect(() => {
    console.log("loadTimedOut", uidCert, certification)
    if (!uidCert || certification) {
      setLoadTimedOut(false);
      return;
    }
    const timer = setTimeout(() => setLoadTimedOut(true), 6000);
    return () => clearTimeout(timer);
  }, [uidCert, certification]);

  const { reference, userCertification, lessonTitle, score, totalQuestions, percentage, date, expiresDate, stats } = useMemo(() => {
    if (!certification) {
      return {
        reference: "",
        userCertification: null,
        lessonTitle: null,
        score: 0,
        totalQuestions: 0,
        percentage: 0,
        date: null,
        expiresDate: null,
        stats: [],
      };
    }
    const reference = certification?.reference || "";
    const lessonTitle = certification?.lesson?.translates?.find((a) => a.lang === lang)?.title || null;
    const score = certification?.score ?? 0;
    const totalQuestions = certification?.count_questions ?? 0;
    const percentage = certification?.percentage ?? 0;
    const date = certification?.obtained_date ?? null;
    const expiresDate = certification?.expires_date ?? null;
    const stats = certification?.stats ?? [];
    return {
      reference,
      userCertification: certification?.user ?? null,
      lessonTitle,
      score,
      totalQuestions,
      percentage,
      date,
      expiresDate,
      stats,
    };
  }, [certification, lang]);

  const formatDisplay = FORMAT_TO_DISPLAY[certification?.format] ?? "online";
  const scoreDisplay = useMemo(() => {
    const pct = percentage ?? 0;
    const isMax = pct >= 100;
    const isExcellent = pct >= 85 && !isMax;
    return { percentage: Math.round(pct), score, maxScore: totalQuestions, isExcellent, isMax };
  }, [percentage, score, totalQuestions]);

  const issuer = school?.name ?? "Dandela Academy";

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setExporting(true);
    const ok = await exportCertificateToPdf(
      certificateRef.current,
      reference ? `${reference}.pdf` : `certificat-${uidCert}.pdf`
    );
    setExporting(false);
    if (!ok) alert(t("pdf_export_error", { ns: NS_CERTIFICATIONS }));
  };

  const handleShare = async () => {
    const shareTitle = lessonTitle
      ? t("share_title_with_course", { ns: NS_CERTIFICATIONS, lessonTitle, issuer })
      : t("share_title_generic", { ns: NS_CERTIFICATIONS, issuer });
    const shareText = lessonTitle
      ? t("share_text_with_course", { ns: NS_CERTIFICATIONS, lessonTitle, percentage: Math.round(percentage ?? 0), issuer })
      : t("share_text_generic", { ns: NS_CERTIFICATIONS, issuer });
    const ok = await shareCertificate({
      title: shareTitle,
      text: shareText,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    });
    if (ok) setShareDone(true);
    setTimeout(() => setShareDone(false), 2000);
  };

  const wrapperProps = {
    titles: [
      { name: t("certifications", { ns: NS_DASHBOARD_MENU }) || "Certifications", url: PAGE_CERTIFICATIONS },
    ],
    title: lessonTitle || t("header_title", { ns: NS_CERTIFICATIONS }),
    subtitle: reference ? `${t("ref", { ns: NS_CERTIFICATIONS })} ${reference}` : "",
    icon: <IconCertificate width={22} height={22} />,
  };

  if (!uidCert) {
    return (
      <DashboardPageWrapper {...wrapperProps}>
        <div className="page">
          <main className="container">
            <p className="muted">{t("cert_id_missing", { ns: NS_CERTIFICATIONS })}</p>
          </main>
        </div>
      </DashboardPageWrapper>
    );
  }

  if (!certification) {
    return (
      <DashboardPageWrapper {...wrapperProps}>
        <div className="page">
          <main className="container">
            <Stack alignItems="center" justifyContent="center">
              {loadTimedOut ? (
                <p className="muted">{t("cert_load_failed", { ns: NS_CERTIFICATIONS })}</p>
              ) : (
                <CircularProgress size={20} color="primary" />
              )}
            </Stack>
          </main>
        </div>
      </DashboardPageWrapper>
    );
  }

  const themeClass =
    scoreDisplay.isMax
      ? "max"
      : scoreDisplay.isExcellent
        ? "excellent"
        : "certified";
  const paperThemeClass = scoreDisplay.isMax ? "max" : scoreDisplay.isExcellent ? "excellent" : "certified";
  const cardClass = [
    "certificate-card",
    ebGaramond.className,
    `cert-theme-${themeClass}`,
    scoreDisplay.isMax ? "cert-max" : "",
    formatDisplay === "hybride" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-hybride-excellent" : "",
    formatDisplay === "online" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-online-excellent" : "",
    formatDisplay === "presentiel" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-presentiel-excellent" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const paperClass = [
    "certificate-paper",
    "cert-floral",
    `cert-theme-${paperThemeClass}`,
    scoreDisplay.isMax ? "cert-paper-max" : "",
    formatDisplay === "hybride" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-hybride-excellent" : "",
    formatDisplay === "online" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-online-excellent" : "",
    formatDisplay === "presentiel" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-presentiel-excellent" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cornerColor =
    scoreDisplay.isMax
      ? "var(--max-gold)"
      : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatDisplay)
        ? formatDisplay === "online"
          ? "var(--primary)"
          : formatDisplay === "presentiel"
            ? "var(--success)"
            : "var(--winner)"
        : "#6366f1";
  const logoColor = scoreDisplay.isMax ? "var(--max-gold)" : scoreDisplay.isExcellent ? (formatDisplay === "online" ? "var(--primary)" : formatDisplay === "presentiel" ? "var(--success)" : "var(--winner)") : "var(--primary)";
  const lineColor = scoreDisplay.isMax ? "var(--max-gold)" : scoreDisplay.isExcellent ? (formatDisplay === "online" ? "var(--primary)" : formatDisplay === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1";

  return (
    <DashboardPageWrapper {...wrapperProps}>
      <div className={`${ebGaramond.variable}`}>
        <main >
          <Stack direction="row" flexWrap="wrap" gap={1.5} justifyContent="center" sx={{ mb: 3.5 }}>
            <ButtonConfirm
              loading={exporting}
              label={exporting ? t("generating") : t("download_pdf")}
              onClick={handleDownloadPdf}
              disabled={exporting}
              icon={<Icon icon="ph:download-simple" width={20} height={20} />}
            />
            <ButtonCancel
              label={shareDone ? t("link_copied") : t("share")}
              onClick={handleShare}
              icon={<Icon icon="ph:share-network" width={20} height={20} />}
            />
          </Stack>

        <section className="certificate-block">
          <div className={cardClass} ref={certificateRef}>
            <div className={paperClass}>
              {scoreDisplay.isMax && (
                <div className="cert-max-ribbon">
                  <span className="cert-max-crown" aria-hidden>
                    <Icon icon="ph:crown-fill" width={28} height={28} />
                  </span>
                  {t("ribbon_max")}
                </div>
              )}
              {formatDisplay === "hybride" && scoreDisplay.isExcellent && !scoreDisplay.isMax && (
                <div className="cert-hybride-excellent-ribbon">
                  <span className="cert-hybride-excellent-stars">⭐⭐⭐</span> {t("ribbon_excellent_premium")}
                </div>
              )}
              {formatDisplay === "online" && scoreDisplay.isExcellent && (
                <div className="cert-online-excellent-ribbon">
                  <span className="cert-format-excellent-stars">⭐</span> {t("ribbon_excellent_standard")}
                </div>
              )}
              {formatDisplay === "presentiel" && scoreDisplay.isExcellent && (
                <div className="cert-presentiel-excellent-ribbon">
                  <span className="cert-format-excellent-stars">⭐⭐</span> {t("ribbon_excellent_standard_plus")}
                </div>
              )}
              <div className="cert-frame cert-frame-outer" />
              <div className="cert-frame cert-frame-inner" />
              <div className="cert-corner cert-corner-tl">
                <Icon
                  icon={
                    scoreDisplay.isMax
                      ? "ph:crown-fill"
                      : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatDisplay)
                        ? "ph:star-four-fill"
                        : "ph:flower-lotus"
                  }
                  width={36}
                  height={36}
                  color={cornerColor}
                />
              </div>
              <div className="cert-corner cert-corner-tr">
                <Icon
                  icon={
                    scoreDisplay.isMax
                      ? "ph:crown-fill"
                      : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatDisplay)
                        ? "ph:star-four-fill"
                        : "ph:flower-lotus"
                  }
                  width={36}
                  height={36}
                  color={cornerColor}
                />
              </div>
              <div className="cert-corner cert-corner-bl">
                <Icon
                  icon={
                    scoreDisplay.isMax
                      ? "ph:crown-fill"
                      : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatDisplay)
                        ? "ph:star-four-fill"
                        : "ph:flower-lotus"
                  }
                  width={36}
                  height={36}
                  color={cornerColor}
                />
              </div>
              <div className="cert-corner cert-corner-br">
                <Icon
                  icon={
                    scoreDisplay.isMax
                      ? "ph:crown-fill"
                      : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatDisplay)
                        ? "ph:star-four-fill"
                        : "ph:flower-lotus"
                  }
                  width={36}
                  height={36}
                  color={cornerColor}
                />
              </div>

              <div className="certificate-inner">
                <div className="cert-logo-wrap">
                  <IconLogoImage width={30} height={30} color={logoColor} />
                </div>
                <p className="cert-org">{issuer}</p>
                <h1 className="cert-title">
                  {scoreDisplay.isMax && t("title_diploma_max")}
                  {!scoreDisplay.isMax && scoreDisplay.isExcellent && formatDisplay === "hybride" && t("title_diploma_premium")}
                  {!scoreDisplay.isMax && scoreDisplay.isExcellent && formatDisplay === "online" && t("title_diploma_standard")}
                  {!scoreDisplay.isMax && scoreDisplay.isExcellent && formatDisplay === "presentiel" && t("title_diploma_standard_plus")}
                  {!scoreDisplay.isMax &&
                    (!scoreDisplay.isExcellent || !["hybride", "online", "presentiel"].includes(formatDisplay)) &&
                    t("title_diploma")}
                </h1>
                <div className="cert-line-floral">
                  <span className="cert-icon-wrap">
                    <Icon
                      icon={
                        scoreDisplay.isMax
                          ? "ph:sparkle-fill"
                          : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatDisplay)
                            ? "ph:sparkle"
                            : "ph:flower"
                      }
                      width={18}
                      height={18}
                      color={lineColor}
                    />
                  </span>
                  <span className="line" />
                  <span className="cert-icon-wrap">
                    <Icon
                      icon={
                        scoreDisplay.isMax
                          ? "ph:sparkle-fill"
                          : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatDisplay)
                            ? "ph:sparkle"
                            : "ph:flower"
                      }
                      width={18}
                      height={18}
                      color={lineColor}
                    />
                  </span>
                </div>
                <p className="cert-intro">{t("intro_awarded_to")}</p>
                <h2 className="cert-name">{userCertification?.getCompleteName?.() ?? userCertification?.displayName ?? "—"}</h2>
                <p className="cert-for">{t("for_successfully_completed")}</p>
                <h3 className="cert-course">{lessonTitle ?? "—"}</h3>
                <p className={`cert-format cert-format-${formatDisplay}`}>
                  <span className="cert-icon-wrap">
                    <img
                      src={`https://api.iconify.design/${CERTIFICATE_FORMAT_CONFIG[formatDisplay]?.icon || "ph:circle"}.svg`}
                      alt=""
                      className="cert-format-icon"
                      width={14}
                      height={14}
                      aria-hidden
                    />
                  </span>
                  {t(`format_${formatDisplay}`)} · {t(formatDisplay === "online" ? "mode_standard" : formatDisplay === "presentiel" ? "mode_standard_plus" : "mode_premium")}
                </p>
                <div className="cert-line-floral cert-line-small">
                  <span className="cert-icon-wrap">
                    <Icon icon={scoreDisplay.isMax ? "ph:sparkle-fill" : "ph:leaf"} width={14} height={14} color={lineColor} />
                  </span>
                  <span className="line" />
                  <span className="cert-icon-wrap">
                    <Icon icon={scoreDisplay.isMax ? "ph:sparkle-fill" : "ph:leaf"} width={14} height={14} color={lineColor} />
                  </span>
                </div>

                <p className="cert-date-issued">
                  {t("issued_on")} {formatDate(date, lang)}
                </p>
                {expiresDate && (
                  <p className="cert-date-expires">
                    {t("valid_until")} {formatDate(expiresDate, lang)}
                  </p>
                )}

                <div className="cert-score-general-section" aria-label={t("score_general")}>
                  <div className="cert-score-general-stats">
                    <div className="cert-score-general-item">
                      <span className="cert-score-general-label">{t("score_general")}</span>
                      <span className="cert-score-general-value">
                        {scoreDisplay.isMax ? (
                          <span className="cert-score-max-badge">{t("score_max")}</span>
                        ) : (
                          <>
                            {score}
                            <span className="cert-score-general-sep">/</span>
                            {totalQuestions}
                          </>
                        )}
                      </span>
                    </div>
                    <div className="cert-score-general-item">
                      <span className="cert-score-general-label">{t("percentage_general")}</span>
                      <span className="cert-score-general-value">
                        {scoreDisplay.isMax ? (
                          <span className="cert-score-max-badge">
                            100<span className="cert-score-general-unit">%</span>
                          </span>
                        ) : (
                          <>
                            {Math.round(percentage ?? 0)}
                            <span className="cert-score-general-unit">%</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  {scoreDisplay.isMax && (
                    <p className="cert-badge-max" role="status">
                      {t("badge_max")}
                    </p>
                  )}
                </div>

                <div className="cert-chapters">
                  <p className="cert-chapters-title">{t("results_by_chapter")}</p>
                  <ul className="cert-chapters-list">
                    {(stats || []).map((stat, i) => {
                      const chapter = getOneChapter(stat?.uid_chapter);
                      const chapterTitle = chapter?.title || null;
                      const countQuestions = stat?.answers?.length || 0;
                      const chScore = stat?.score ?? 0;
                      const chPercentage = countQuestions ? (chScore / countQuestions) * 100 : 0;
                      const status = ClassUserCertification.getStatusFromPercentage(chPercentage);
                      const statusCfg = STATUS_CONFIG?.[status] ?? getStatusConfig("not-good");
                      const statusLabel = t(status, { ns: "classes/stat" });
                      return (
                        <li key={i} className={`chapter-level chapter-${status}`}>
                          <span className="chapter-name">{chapterTitle}</span>
                          <span className="chapter-score">
                            {chScore}/{countQuestions} ({Math.round(chPercentage)} %)
                          </span>
                          <span
                            className="chapter-mention"
                            style={
                              statusCfg
                                ? {
                                    color: statusCfg.color,
                                    border: `1px solid ${statusCfg.border}`,
                                    backgroundColor: statusCfg.background_bubble,
                                  }
                                : undefined
                            }
                          >
                            {statusLabel}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <p className="cert-ref">
                  {t("ref")} {reference}
                </p>
                <p className="cert-seal">
                  <span className="cert-icon-wrap">
                    <Icon icon="ph:seal-check-fill" width={16} height={16} color="var(--font-color)" />
                  </span>
                  {t("verifiable_by_employers")} · {issuer}
                </p>

                <div className="cert-director">
                  {school?.certificat_sign ? (
                    <img src={school.certificat_sign} alt="" className="cert-director-signature-img" aria-hidden />
                  ) : (
                    <div className="cert-director-signature-line" aria-hidden />
                  )}
                  <p className="cert-director-name">{school?.director || t("director_name")}</p>
                  <p className="cert-director-title">{t("director_title")}</p>
                </div>

                <div
                  className={`cert-inefop ${scoreDisplay.isMax ? "cert-inefop-max" : ""} ${!scoreDisplay.isMax && scoreDisplay.isExcellent && formatDisplay === "online" ? "cert-inefop-online-excellent" : ""} ${!scoreDisplay.isMax && scoreDisplay.isExcellent && formatDisplay === "presentiel" ? "cert-inefop-presentiel-excellent" : ""} ${!scoreDisplay.isMax && scoreDisplay.isExcellent && formatDisplay === "hybride" ? "cert-inefop-hybride-excellent" : ""} ${!scoreDisplay.isMax && (!scoreDisplay.isExcellent || !["online", "presentiel", "hybride"].includes(formatDisplay)) ? "cert-inefop-certified" : ""}`}
                >
                  <a
                    href="https://www.inefop.gov.ao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-inefop-link"
                    aria-label="INEFOP"
                  >
                    <div className="cert-inefop-logo">
                      <img
                        src={IMAGE_PARTNER_INEFOP.src}
                        alt="INEFOP"
                        width={120}
                        height={60}
                        style={{ objectFit: "contain", maxWidth: 120 }}
                      />
                    </div>
                    <p className="cert-inefop-text">
                      <span className="cert-icon-wrap">
                        <Icon icon="ph:seal-check-fill" width={18} height={18} />
                      </span>
                      {t("recognized_inefop")}
                    </p>
                    <p className="cert-inefop-sublabel">{t("inefop_full_name")}</p>
                    <span className="cert-inefop-website">www.inefop.gov.ao</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: var(--background);
          padding: 32px 16px 48px;
          color: var(--font-color);
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 680px;
        }

        .muted {
          margin: 0;
          font-size: 0.95rem;
          color: var(--grey);
        }

        .action-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-bottom: 28px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .btn-primary {
          background: var(--primary);
          color: var(--font-reverse-color);
        }

        .btn-secondary {
          background: var(--card-color);
          color: var(--font-color);
          border: 1px solid var(--card-border);
        }

        .certificate-block {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .certificate-card {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          font-family: var(--font-cert-academic), "EB Garamond", Garamond, "Times New Roman", serif;
        }

        .certificate-paper {
          position: relative;
          padding: 32px 28px;
          background: var(--card-color);
          color: var(--font-color);
          border-radius: 20px;
          border: 1px solid var(--card-border);
        }

        .certificate-paper.cert-floral {
          background: var(--card-color);
          border: 1px solid var(--card-border);
          border-radius: 4px;
          padding: 48px 40px;
        }

        .certificate-paper.cert-theme-certified {
          background: var(--card-color);
          border: 2px solid var(--primary-shadow-sm);
        }

        .certificate-paper.cert-theme-excellent {
          background: var(--card-color);
          border: 2px solid var(--winner-shadow-sm);
        }

        .certificate-card.cert-hybride-excellent {
          box-shadow: 0 0 0 3px var(--winner), 0 25px 50px -12px rgba(247, 187, 0, 0.4), 0 0 60px -10px rgba(247, 187, 0, 0.3);
        }

        .certificate-paper.cert-hybride-excellent {
          background: var(--card-color);
          border: 3px solid var(--winner);
          box-shadow: inset 0 0 40px var(--winner-shadow);
        }

        .cert-hybride-excellent-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 16px 24px;
          background: linear-gradient(90deg, #b45309, var(--winner), #fbbf24, var(--winner));
          color: #1e293b;
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-align: center;
          z-index: 3;
          box-shadow: 0 4px 20px rgba(247, 187, 0, 0.5);
        }

        .cert-hybride-excellent-stars {
          margin-right: 10px;
          font-size: 1.2rem;
          filter: brightness(0) invert(1);
          display: inline-block;
        }

        .certificate-paper.cert-hybride-excellent .certificate-inner {
          padding-top: 56px;
        }

        .certificate-card.cert-online-excellent {
          box-shadow: 0 0 0 3px var(--primary), 0 25px 50px -12px rgba(99, 102, 241, 0.35), 0 0 60px -10px rgba(99, 102, 241, 0.2);
        }

        .certificate-paper.cert-online-excellent {
          background: var(--card-color);
          border: 3px solid var(--primary);
          box-shadow: inset 0 0 40px var(--primary-shadow);
        }

        .cert-online-excellent-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 16px 24px;
          background: linear-gradient(90deg, #4338ca, var(--primary), #818cf8, var(--primary));
          color: #fff;
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-align: center;
          z-index: 3;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        }

        .certificate-paper.cert-online-excellent .certificate-inner {
          padding-top: 56px;
        }

        .certificate-card.cert-presentiel-excellent {
          box-shadow: 0 0 0 3px var(--success), 0 25px 60px -12px var(--success-shadow-md), 0 0 60px -10px var(--success-shadow);
        }

        .certificate-paper.cert-presentiel-excellent {
          background: var(--card-color);
          border: 3px solid var(--success);
          box-shadow: inset 0 0 40px var(--success-shadow);
        }

        .cert-presentiel-excellent-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 16px 24px;
          background: linear-gradient(90deg, var(--success-dark), var(--success), var(--success-shadow-lg), var(--success));
          color: #fff;
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-align: center;
          z-index: 3;
          box-shadow: 0 4px 20px var(--success-shadow-md);
        }

        .cert-format-excellent-stars {
          margin-right: 8px;
          font-size: 1.1rem;
          filter: brightness(0) invert(1);
          display: inline-block;
        }

        .certificate-paper.cert-presentiel-excellent .certificate-inner {
          padding-top: 56px;
        }

        .certificate-card.cert-max {
          --max-gold: #d4af37;
          box-shadow: 0 0 0 4px var(--max-gold), 0 25px 60px -12px rgba(212, 175, 55, 0.5), 0 0 80px -15px rgba(212, 175, 55, 0.35);
        }

        .certificate-paper.cert-paper-max {
          --max-gold: #d4af37;
          background: linear-gradient(180deg, #fefce8 0%, #fef9c3 15%, #fef3c7 50%, #fde68a 100%);
          border: 3px solid var(--max-gold);
          box-shadow: inset 0 0 60px rgba(212, 175, 55, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.2);
        }

        .cert-max-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 18px 24px;
          background: linear-gradient(90deg, #8b6914, #d4af37, #f4e4a6, #d4af37, #8b6914);
          color: #1a1a0a;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.25em;
          text-align: center;
          z-index: 3;
          box-shadow: 0 4px 24px rgba(212, 175, 55, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .cert-max-crown {
          display: inline-flex;
          color: #fff;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .certificate-paper.cert-paper-max .certificate-inner {
          padding-top: 64px;
        }

        .cert-frame {
          position: absolute;
          pointer-events: none;
          border: 1px solid var(--card-border);
          border-radius: 2px;
        }

        .cert-frame-outer {
          top: 24px;
          left: 24px;
          right: 24px;
          bottom: 24px;
          opacity: 0.6;
        }

        .cert-frame-inner {
          top: 32px;
          left: 32px;
          right: 32px;
          bottom: 32px;
          border-color: var(--card-border);
          opacity: 0.4;
        }

        .certificate-paper.cert-theme-certified .cert-frame-outer {
          border-color: var(--primary-shadow-sm);
          opacity: 0.7;
        }

        .certificate-paper.cert-theme-certified .cert-frame-inner {
          border-color: var(--primary);
          opacity: 0.5;
        }

        .certificate-paper.cert-theme-excellent .cert-frame-outer {
          border-color: var(--winner);
          opacity: 0.7;
        }

        .certificate-paper.cert-theme-excellent .cert-frame-inner {
          border-color: var(--winner);
          opacity: 0.5;
        }

        .certificate-paper.cert-online-excellent .cert-frame-outer,
        .certificate-paper.cert-online-excellent .cert-frame-inner {
          border-color: var(--primary) !important;
        }

        .certificate-paper.cert-presentiel-excellent .cert-frame-outer,
        .certificate-paper.cert-presentiel-excellent .cert-frame-inner {
          border-color: var(--success) !important;
        }

        .cert-corner {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .cert-corner-tl { top: 28px; left: 28px; }
        .cert-corner-tr { top: 28px; right: 28px; }
        .cert-corner-bl { bottom: 28px; left: 28px; }
        .cert-corner-br { bottom: 28px; right: 28px; }

        .certificate-inner {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 520px;
          margin: 0 auto;
        }

        .cert-logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 4px;
        }

        .cert-org {
          margin: 0 0 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--font-color);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .cert-title {
          margin: 0 0 16px;
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--font-color);
          letter-spacing: 0.12em;
          font-family: Georgia, "Times New Roman", serif;
        }

        .certificate-paper.cert-hybride-excellent .cert-title {
          color: var(--winner);
          font-size: 2.4rem;
        }

        .certificate-paper.cert-online-excellent .cert-title {
          color: var(--primary);
          font-size: 2.3rem;
        }

        .certificate-paper.cert-presentiel-excellent .cert-title {
          color: var(--success);
          font-size: 2.3rem;
        }

        .cert-line-floral {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
          color: #64748b;
          font-size: 1.125rem;
        }

        .cert-line-floral .line {
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--card-border), transparent);
        }

        .certificate-paper.cert-theme-certified .cert-line-floral .line {
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
        }

        .certificate-paper.cert-theme-excellent .cert-line-floral .line {
          background: linear-gradient(90deg, transparent, var(--winner), transparent);
        }

        .certificate-paper.cert-online-excellent .cert-line-floral .line {
          background: linear-gradient(90deg, transparent, var(--primary), transparent) !important;
        }

        .certificate-paper.cert-presentiel-excellent .cert-line-floral .line {
          background: linear-gradient(90deg, transparent, var(--success), transparent) !important;
        }

        .cert-line-small .line { width: 50px; }
        .cert-line-small { margin: 12px 0 16px; font-size: 0.875rem; }

        .cert-intro,
        .cert-for {
          margin: 0;
          font-size: 0.95rem;
          color: var(--font-color);
          line-height: 1.6;
        }

        .cert-name {
          margin: 12px 0 8px;
          font-size: 1.85rem;
          font-weight: 700;
          color: var(--font-color);
          letter-spacing: 0.02em;
          font-family: Georgia, "Times New Roman", serif;
          line-height: 1.3;
        }

        .cert-course {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--font-color);
          line-height: 1.4;
        }

        .cert-format {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 10px 0 0;
          padding: 6px 14px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--font-color);
          background: var(--background);
          border-radius: 20px;
        }

        .cert-format-icon {
          flex-shrink: 0;
          object-fit: contain;
          vertical-align: middle;
          align-self: center;
        }

        .certificate-paper.cert-theme-certified .cert-format {
          background: var(--primary-shadow-xs);
          color: var(--primary);
        }

        .certificate-paper .cert-format.cert-format-online {
          color: var(--primary) !important;
          background: var(--primary-shadow-xs) !important;
          border: 1px solid var(--primary-shadow-sm) !important;
        }

        .certificate-paper .cert-format.cert-format-presentiel {
          color: var(--success) !important;
          background: var(--success-shadow-xs) !important;
          border: 1px solid var(--success-shadow-sm) !important;
        }

        .certificate-paper .cert-format.cert-format-hybride {
          color: var(--success) !important;
          background: var(--success-shadow-xs) !important;
          border: 1px solid var(--success-shadow-sm) !important;
        }

        .certificate-paper.cert-hybride-excellent .cert-format.cert-format-hybride {
          color: var(--winner) !important;
          background: rgba(247, 187, 0, 0.25) !important;
          border: 2px solid var(--winner) !important;
          font-weight: 800;
        }

        .certificate-paper.cert-online-excellent .cert-format.cert-format-online {
          color: #fff !important;
          background: rgba(67, 56, 202, 0.4) !important;
          border: 2px solid var(--primary) !important;
          font-weight: 800;
        }

        .certificate-paper.cert-presentiel-excellent .cert-format.cert-format-presentiel {
          color: #fff !important;
          background: var(--success-shadow-md) !important;
          border: 2px solid var(--success) !important;
          font-weight: 800;
        }

        .cert-date-issued {
          margin: 14px 0 0;
          font-size: 0.88rem;
          color: var(--font-color);
          text-align: center;
        }

        .cert-date-expires {
          margin: 4px 0 0;
          font-size: 0.72rem;
          color: var(--font-color);
          opacity: 0.7;
          text-align: center;
        }

        .cert-score-general-section {
          margin-top: 20px;
          padding: 14px 16px;
          background: var(--background);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          text-align: center;
        }

        .cert-score-general-stats {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px 28px;
        }

        .cert-score-general-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .cert-score-general-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--grey);
        }

        .cert-score-general-value {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--font-color);
        }

        .cert-score-general-sep { opacity: 0.7; font-weight: 600; }
        .cert-score-general-unit { margin-left: 1px; font-size: 0.95rem; font-weight: 600; }

        .cert-score-max-badge {
          display: inline-block;
          padding: 4px 14px;
          background: linear-gradient(135deg, #d4af37, #f4e4a6);
          color: #1a1a0a;
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: 0.08em;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(212, 175, 55, 0.4);
        }

        .cert-badge-max {
          margin: 14px 0 0;
          padding: 12px 20px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(244, 228, 166, 0.3));
          border: 2px solid var(--max-gold, #d4af37);
          border-radius: 12px;
          color: #92400e;
          font-size: 0.95rem;
          font-weight: 700;
          text-align: center;
        }

        .cert-chapters {
          margin-top: 20px;
          padding: 14px 16px;
          background: var(--background);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          text-align: left;
        }

        .cert-chapters-title {
          margin: 0 0 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--font-color);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .cert-chapters-list {
          margin: 0;
          padding: 0;
          list-style: none;
          font-size: 0.85rem;
          color: var(--font-color);
        }

        .cert-chapters-list li {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 8px 12px;
          padding: 8px 0;
          border-bottom: 1px solid var(--card-border);
        }

        .cert-chapters-list li:last-child {
          border-bottom: none;
        }

        .cert-chapters-list li.chapter-max .chapter-mention { border: 1px solid var(--gold); }
        .cert-chapters-list li.chapter-excellent .chapter-mention { border: 1px solid var(--success); }
        .cert-chapters-list li.chapter-good .chapter-mention { border: 1px solid var(--info); }
        .cert-chapters-list li.chapter-to-improve .chapter-mention { border: 1px solid var(--warning); }
        .cert-chapters-list li.chapter-not-good .chapter-mention { border: 1px solid var(--error); }

        .chapter-name { flex: 1; min-width: 0; font-size: 0.85rem; }
        .chapter-score { flex-shrink: 0; font-weight: 600; font-size: 0.85rem; color: var(--font-color); }
        .chapter-mention {
          flex-shrink: 0;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .cert-ref {
          margin: 16px 0 0;
          font-size: 0.8rem;
          color: var(--grey-light);
          font-family: ui-monospace, monospace;
        }

        .cert-seal {
          margin: 20px 0 0;
          font-size: 0.82rem;
          color: var(--font-color);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .cert-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          align-self: center;
          flex-shrink: 0;
          line-height: 0;
          font-size: inherit;
        }

        .cert-icon-wrap svg,
        .cert-icon-wrap img {
          display: block;
          width: 1em !important;
          height: 1em !important;
          min-width: 1em !important;
          min-height: 1em !important;
        }

        .cert-director {
          margin-top: 28px;
          text-align: right;
          padding-right: 0;
        }

        .cert-director-signature-line {
          width: 140px;
          height: 1px;
          background: var(--font-color);
          margin: 0 0 2px auto;
          opacity: 0.6;
        }

        .cert-director-signature-img {
          display: block;
          max-width: 160px;
          max-height: 56px;
          height: auto;
          margin: 0 0 2px auto;
          object-fit: contain;
        }

        .cert-director-name {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--font-color);
          letter-spacing: 0.02em;
        }

        .cert-director-title {
          margin: 4px 0 0;
          font-size: 0.82rem;
          color: var(--grey-light);
        }

        .cert-inefop {
          margin-top: 24px;
          padding: 20px 24px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }

        .cert-inefop-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: inherit;
          width: 100%;
        }

        .cert-inefop-link:hover { opacity: 0.9; }
        .cert-inefop-website { font-size: 0.75rem; font-weight: 600; opacity: 0.85; text-decoration: underline; }

        .cert-inefop.cert-inefop-certified {
          background: var(--primary-shadow-xs);
          border: 2px solid var(--primary-shadow-sm);
        }

        .cert-inefop.cert-inefop-online-excellent {
          background: var(--primary-shadow-xs);
          border: 2px solid var(--primary-shadow-sm);
        }

        .cert-inefop.cert-inefop-presentiel-excellent {
          background: var(--success-shadow-xs);
          border: 2px solid var(--success-shadow-sm);
        }

        .cert-inefop.cert-inefop-hybride-excellent {
          background: var(--winner-shadow-xs);
          border: 2px solid var(--winner-shadow-sm);
        }

        .cert-inefop.cert-inefop-max .cert-inefop-link {
          border-color: rgba(212, 175, 55, 0.5);
          background: linear-gradient(180deg, rgba(254, 249, 195, 0.5), rgba(254, 243, 199, 0.3));
        }

        .cert-inefop-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
        }

        .cert-inefop-logo img {
          max-width: 120px;
          height: auto;
          object-fit: contain;
        }

        .cert-inefop-text {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cert-inefop-sublabel {
          margin: 0;
          font-size: 0.8rem;
          color: var(--font-color);
          font-weight: 500;
        }

        @media (max-width: 600px) {
          .action-bar { flex-direction: column; }
          .btn { width: 100%; justify-content: center; }
        }
      `}</style>
      </div>
    </DashboardPageWrapper>
  );
}

export default function CertificationViewPage() {
  const params = useParams();
  const { user } = useAuth();
  const uidCert = params?.uid ?? "";

  return (
    <ProviderCertifs uidUser={user?.uid ?? ""}>
      <CertificationViewContent uidCert={uidCert} />
    </ProviderCertifs>
  );
}
