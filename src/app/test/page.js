"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EB_Garamond } from "next/font/google";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { IconLogoImage } from "@/assets/icons/IconsComponent";
import { IMAGE_PARTNER_INEFOP } from "@/contexts/constants/constants_images";
import { useCertif } from "@/contexts/CertifProvider";
import { useLanguage } from "@/contexts/LangProvider";
import { NS_CERTIFICATIONS, NS_LANGS } from "@/contexts/i18n/settings";
import { ClassLang } from "@/classes/ClassLang";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import { ClassUserCertification } from "@/classes/users/ClassUserCertification";
import { ClassCountry } from "@/classes/ClassCountry";
import SelectLanguageComponent from "@/components/elements/SelectLanguageComponent";
import { useChapter } from "@/contexts/ChapterProvider";
import { useSchool } from "@/contexts/SchoolProvider";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cert-academic",
});

// Données fictives : certificat obtenu après ≥ 75 % sur le cours Excel
const mockCertificate = {
  id: "CERT-2025-EXCEL-0842",
  course: {
    title: "Excel – Niveau Débutant à Intermédiaire",
    category: "Bureautique",
    duration: "24 heures",
    chaptersCount: 8,
  },
  user: {
    fullName: "Marie Kouadio",
    email: "marie.kouadio@example.com",
    userId: "usr_7f2a9b1c",
  },
  result: {
    score: 44,
    maxScore: 50,
    percentage: 88,
    status: "Réussi",
    rank: "Top 15 %",
  },
  progress: {
    chaptersCompleted: 8,
    chaptersTotal: 8,
    progressPercent: 100,
  },
  dates: {
    started: "2025-01-05",
    completed: "2025-01-28",
    issued: "2025-01-31",
    expires: "2028-01-31",
  },
  issuer: "Dandela Academy",
  verified: true,
  // Résultats fictifs : tous les formats de stats (excellent, certifié, médiocre, faible, mauvais)
  chaptersResults: [
    { title: "Introduction à Excel", score: 5, maxScore: 5, percentage: 100 },      // excellent
    { title: "Saisie et mise en forme", score: 5, maxScore: 6, percentage: 83 },  // certifié
    { title: "Formules et fonctions de base", score: 4, maxScore: 6, percentage: 67 }, // médiocre
    { title: "Graphiques et mise en page", score: 6, maxScore: 6, percentage: 92 },    // excellent
    { title: "Tableaux croisés dynamiques", score: 2, maxScore: 5, percentage: 40 },  // faible
    { title: "Macros et automatisation", score: 1, maxScore: 5, percentage: 20 },     // mauvais
    { title: "Analyse de données", score: 5, maxScore: 6, percentage: 83 },           // certifié
    { title: "Synthèse et bonnes pratiques", score: 5, maxScore: 7, percentage: 71 },  // certifié
  ],
};

/** Utilise ClassUserCertification.getStatusFromPercentage + STATUS_CONFIG pour couleurs, classes/stat pour libellés. */
function getStatusConfig(status) {
  if (!status) return null;
  return ClassUserCertification.STATUS_CONFIG_STATS?.[status] ?? ClassUserCertification.STATUS_CONFIG_STATS?.["not-good"] ?? null;
}

/** Formats de formation et modes pour les différents certificats */
const CERTIFICATE_FORMAT_CONFIG = {
  online: { format: "En ligne", mode: "Standard", icon: "ph:monitor-play-fill" },
  presentiel: { format: "Présentiel", mode: "Standard+", icon: "ph:users-three-fill" },
  hybride: { format: "Hybride", mode: "⭐⭐⭐ Premium", icon: "ph:arrows-left-right-fill" },
};

/** Carte individuelle pour Moyenne ou Score avec icône certificat */
function CertScoreCard({ label, value, unit, sublabel, iconWrapClass, iconClass, variant }) {
  return (
    <div className={`cert-score-card ${variant ? `cert-score-card-${variant}` : ""}`}>
      <div className={`cert-score-card-icon ${iconWrapClass}`}>
        <Icon icon="ph:certificate-fill" className={iconClass} />
      </div>
      <div className="cert-score-card-content">
        <span className="cert-score-modern-label">{label}</span>
        <div className="cert-score-value-wrap">
          <span className="cert-score-value">{value}</span>
          {unit && <span className="cert-score-unit">{unit}</span>}
        </div>
        {sublabel && <span className="cert-score-modern-sublabel">{sublabel}</span>}
      </div>
    </div>
  );
}

/** Bloc résumé moderne : moyenne générale + score (version Excellent). */
function CertificateCongratulationsComponent({ percentage, score, maxScore }) {
  return (
    <div className="cert-score-modern cert-score-excellent">
      <div className="cert-score-ribbon">Excellent</div>
      <div className="cert-score-modern-inner">
        <CertScoreCard
          label="Moyenne générale"
          value={percentage}
          unit="%"
          iconWrapClass="cert-score-hero-wrap"
          iconClass="cert-score-hero-icon"
        />
        <CertScoreCard
          label="Score"
          value={`${score}/${maxScore}`}
          sublabel="points"
          iconWrapClass="cert-score-hero-wrap"
          iconClass="cert-score-hero-icon"
          variant="score"
        />
      </div>
      <div className="cert-score-badge cert-score-badge-excellent">
        <span className="cert-score-badge-inner">Félicitations ! Résultat excellent</span>
      </div>
    </div>
  );
}

/** Bloc résumé moderne : moyenne générale + score (version Certifié). */
function CertificateScoreGeneralComponent({ percentage, score, maxScore }) {
  return (
    <div className="cert-score-modern cert-score-certified">
      <div className="cert-score-ribbon cert-score-ribbon-certified">Certifié</div>
      <div className="cert-score-modern-inner">
        <CertScoreCard
          label="Moyenne générale"
          value={percentage}
          unit="%"
          iconWrapClass="cert-score-modern-icon-wrap"
          iconClass="cert-score-hero-icon"
        />
        <CertScoreCard
          label="Score"
          value={`${score}/${maxScore}`}
          sublabel="points"
          iconWrapClass="cert-score-modern-icon-wrap"
          iconClass="cert-score-hero-icon"
          variant="score"
        />
      </div>
      <div className="cert-score-badge certified">Parcours réussi — Certificat délivré</div>
    </div>
  );
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
/**
 * Précharge une image externe via le proxy et retourne une data URL.
 */
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

/**
 * Exporte le certificat (élément DOM) en PDF et déclenche le téléchargement.
 * Utilise html2canvas pour capturer le rendu puis jspdf pour générer le PDF.
 * La signature externe est préchargée via /api/proxy-image puis injectée en data URL pour garantir son rendu.
 */
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
 * Partage le certificat via l’API Web Share (natif) ou copie le lien dans le presse-papier.
 */
async function shareCertificate(options = {}) {
  const { title = "Mon certificat Dandela Academy", text, url } = options;
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = text || `J'ai obtenu mon certificat sur ${shareUrl}`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title,
        text: shareText,
        url: shareUrl,
      });
      return true;
    } catch (e) {
      if (e.name === "AbortError") return false;
      return copyToClipboard(shareUrl);
    }
  }
  return copyToClipboard(shareUrl);
}
function copyToClipboard(text) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}
export default function TEST() {
  const certificateRef = useRef(null);
  const { t } = useTranslation([NS_CERTIFICATIONS, NS_LANGS, "classes/stat"]);
  const { lang } = useLanguage();
  const [processing, setProcessing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [shareDone, setShareDone] = useState(false);
  /** '70' = Certifié (70%), '85' = Excellent (85%+), '100' = MAX (100% — diplôme exceptionnel) */
  const [scorePreviewMode, setScorePreviewMode] = useState("85");
  /** Format de formation : online | presentiel | hybride */
  const [formatPreviewMode, setFormatPreviewMode] = useState("online");
const {getOneChapter} = useChapter();
  const { setUidCertification, uidUser, certifications, uidCertification, certification, getOneCertification, listenToOneCertification, STATUS_CONFIG } = useCertif();
  const { school } = useSchool();
  useEffect(() => {
    console.log("school", school);
    setUidCertification("KPb5QArXDwpOmc0SKnvb");
  }, []);

  const {reference,userCertification, lessonTitle, score,totalQuestions, percentage, date, expiresDate, stats} = useMemo(() => {
    if(!certification) {
      return {
        reference:"",
        userCertification: null,
        lessonCertification: null,
        lessonTitle: null,
        score: 0,
        totalQuestions: 0,
        percentage: 0,
        date: null,
        expiresDate: null,
        stats: [],
      };
    }
    //const certif = getOneCertification(uidCertification);
    const reference = certification?.reference || "";
    const lessonTitle = certification?.lesson?.translates?.find(a => a.lang === lang)?.title || null;
    const score = certification?.score || null;
    const totalQuestions = certification?.count_questions || null;
    const percentage = certification?.percentage || null;
    const date = certification?.obtained_date || null;
    const expiresDate = certification?.expires_date || null;
    const stats = certification?.stats || [];
    return {
      reference:reference,
      userCertification:certification?.user || null,
      lessonTitle,
      score,
      totalQuestions,
      percentage,
      date,
      expiresDate,
      stats
    };
  }, [certification]);
  

  const { course, user, result, progress, dates, issuer } = mockCertificate;

  const scoreDisplay = scorePreviewMode === "100"
    ? { percentage: 100, score: 50, maxScore: 50, isExcellent: true, isMax: true }
    : scorePreviewMode === "85"
      ? { percentage: 88, score: 44, maxScore: 50, isExcellent: true, isMax: false }
      : { percentage: 72, score: 36, maxScore: 50, isExcellent: false, isMax: false };

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setExporting(true);
    const ok = await exportCertificateToPdf(
      certificateRef.current,
      `${reference}.pdf` ||`certificat-${certification?.uid}.pdf`
    );
    setExporting(false);
    if (!ok) alert("Impossible de générer le PDF. Vérifiez que les dépendances sont installées (npm install jspdf html2canvas).");
  };

  const handleShare = async () => {
    const ok = await shareCertificate({
      title: `Certificat ${course.title} – ${issuer}`,
      text: `J'ai obtenu mon certificat "${course.title}" avec ${result.percentage} % sur ${issuer}.`,
    });
    if (ok) setShareDone(true);
    setTimeout(() => setShareDone(false), 2000);
  };

  return (
    <div className={`page ${ebGaramond.variable}`}>
      <main className="container">
        <div className="select-lang-top">
          <SelectLanguageComponent />
        </div>
        <ButtonConfirm loading={processing} label={t("create_certificate")} onClick={async ()=>{
          setProcessing(true);
          const certif = new ClassUserCertification();
          certif.uid_user = "aCZaAjvtK0PKichqLeLoqMvIPX13";
          certif.uid_lesson = "zlUoi3t14wzC5cNhfS3J";
          certif.code = "EXCEL50";
          //certif.status = ClassUserCertification.STATUS.CERTIFIED;
          certif.format = ClassUserCertification.FORMAT.ONLINE;
          //certif.percentage = 48.78048780487805;
          certif.score = 14;
          certif.count_questions = 41;
          //certif.maxScore = 100;
          //certif.created_time = new Date();
          await certif.createFirestore();
          setProcessing(false);
        }} />
        <header className="header">
          <h1>Diplôme obtenu</h1>
          <p className="muted">
            Félicitations ! Tu as réussi ton parcours. Télécharge ou partage ton diplôme.
          </p>
        </header>

        {/* Barre d’actions : Télécharger PDF / Partager */}
        <div className="action-bar">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDownloadPdf}
            disabled={exporting}
          >
            <Icon icon="ph:download-simple" width={20} height={20} />
            {exporting ? t("generating") : t("download_pdf")}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleShare}
          >
            <Icon icon="ph:share-network" width={20} height={20} />
            {shareDone ? t("link_copied") : t("share")}
          </button>
        </div>

        {/* Certificat (fond clair pour un rendu type “document” et PDF propre) */}
        <section className="certificate-block">
          <div className="cert-preview-selectors">
            <div className="cert-score-selector-wrap">
              <span className="cert-score-selector-label">{t("preview_score")}</span>
              <select
                className="cert-score-selector"
                value={scorePreviewMode}
                onChange={(e) => setScorePreviewMode(e.target.value)}
                aria-label={t("preview_score")}
              >
                <option value="70">{t("preview_certified_70")}</option>
                <option value="85">{t("preview_excellent_85")}</option>
                <option value="100">{t("preview_max_100")}</option>
              </select>
            </div>
            <div className="cert-score-selector-wrap">
              <span className="cert-score-selector-label">{t("format_label")}</span>
              <select
                className="cert-score-selector"
                value={formatPreviewMode}
                onChange={(e) => setFormatPreviewMode(e.target.value)}
                aria-label={t("format_label")}
              >
                <option value="online">{t("format_online_opt")}</option>
                <option value="presentiel">{t("format_presentiel_opt")}</option>
                <option value="hybride">{t("format_hybride_opt")}</option>
              </select>
            </div>
          </div>
          <div className={`certificate-card ${ebGaramond.className} cert-theme-${scorePreviewMode === "100" ? "max" : scorePreviewMode === "85" ? "excellent" : "certified"} ${scoreDisplay.isMax ? "cert-max" : ""} ${formatPreviewMode === "hybride" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-hybride-excellent" : ""} ${formatPreviewMode === "online" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-online-excellent" : ""} ${formatPreviewMode === "presentiel" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-presentiel-excellent" : ""}`} ref={certificateRef}>
            <div className={`certificate-paper cert-floral cert-theme-${scorePreviewMode === "100" ? "max" : scorePreviewMode === "85" ? "excellent" : "certified"} ${scoreDisplay.isMax ? "cert-paper-max" : ""} ${formatPreviewMode === "hybride" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-hybride-excellent" : ""} ${formatPreviewMode === "online" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-online-excellent" : ""} ${formatPreviewMode === "presentiel" && scoreDisplay.isExcellent && !scoreDisplay.isMax ? "cert-presentiel-excellent" : ""}`}>
              {scoreDisplay.isMax && (
                <div className="cert-max-ribbon">
                  <span className="cert-max-crown" aria-hidden><Icon icon="ph:crown-fill" width={28} height={28} /></span>
                  {t("ribbon_max")}
                </div>
              )}
              {formatPreviewMode === "hybride" && scoreDisplay.isExcellent && !scoreDisplay.isMax && (
                <div className="cert-hybride-excellent-ribbon">
                  <span className="cert-hybride-excellent-stars">⭐⭐⭐</span> {t("ribbon_excellent_premium")}
                </div>
              )}
              {formatPreviewMode === "online" && scoreDisplay.isExcellent && (
                <div className="cert-online-excellent-ribbon">
                  <span className="cert-format-excellent-stars">⭐</span> {t("ribbon_excellent_standard")}
                </div>
              )}
              {formatPreviewMode === "presentiel" && scoreDisplay.isExcellent && (
                <div className="cert-presentiel-excellent-ribbon">
                  <span className="cert-format-excellent-stars">⭐⭐</span> {t("ribbon_excellent_standard_plus")}
                </div>
              )}
              <div className="cert-frame cert-frame-outer" />
              <div className="cert-frame cert-frame-inner" />
              <div className="cert-corner cert-corner-tl">
                <Icon icon={scoreDisplay.isMax ? "ph:crown-fill" : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:star-four-fill" : "ph:flower-lotus"} width={36} height={36} color={scoreDisplay.isMax ? "var(--max-gold)" : scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
              </div>
              <div className="cert-corner cert-corner-tr">
                <Icon icon={scoreDisplay.isMax ? "ph:crown-fill" : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:star-four-fill" : "ph:flower-lotus"} width={36} height={36} color={scoreDisplay.isMax ? "var(--max-gold)" : scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
              </div>
              <div className="cert-corner cert-corner-bl">
                <Icon icon={scoreDisplay.isMax ? "ph:crown-fill" : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:star-four-fill" : "ph:flower-lotus"} width={36} height={36} color={scoreDisplay.isMax ? "var(--max-gold)" : scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
              </div>
              <div className="cert-corner cert-corner-br">
                <Icon icon={scoreDisplay.isMax ? "ph:crown-fill" : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:star-four-fill" : "ph:flower-lotus"} width={36} height={36} color={scoreDisplay.isMax ? "var(--max-gold)" : scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
              </div>

              <div className="certificate-inner">
                <div className="cert-logo-wrap">
                  <IconLogoImage width={30} height={30} color={scoreDisplay.isMax ? "var(--max-gold)" : scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "var(--primary)"} />
                </div>
                <p className="cert-org">{issuer}</p>
                <h1 className="cert-title">
                  {scoreDisplay.isMax && t("title_diploma_max")}
                  {!scoreDisplay.isMax && scoreDisplay.isExcellent && formatPreviewMode === "hybride" && t("title_diploma_premium")}
                  {!scoreDisplay.isMax && scoreDisplay.isExcellent && formatPreviewMode === "online" && t("title_diploma_standard")}
                  {!scoreDisplay.isMax && scoreDisplay.isExcellent && formatPreviewMode === "presentiel" && t("title_diploma_standard_plus")}
                  {!scoreDisplay.isMax && (!scoreDisplay.isExcellent || !["hybride", "online", "presentiel"].includes(formatPreviewMode)) && t("title_diploma")}
                </h1>
                <div className="cert-line-floral">
                  <span className="cert-icon-wrap"><Icon icon={scoreDisplay.isMax ? "ph:sparkle-fill" : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:sparkle" : "ph:flower"} width={18} height={18} color={scoreDisplay.isMax ? "var(--max-gold)" : scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} /></span>
                  <span className="line" />
                  <span className="cert-icon-wrap"><Icon icon={scoreDisplay.isMax ? "ph:sparkle-fill" : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:sparkle" : "ph:flower"} width={18} height={18} color={scoreDisplay.isMax ? "var(--max-gold)" : scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} /></span>
                </div>
                <p className="cert-intro">{t("intro_awarded_to")}</p>
                <h2 className="cert-name">{userCertification?.getCompleteName()}</h2>
                <p className="cert-for">{t("for_successfully_completed")}</p>
                <h3 className="cert-course">{lessonTitle}</h3>
                <p className={`cert-format cert-format-${formatPreviewMode}`}>
                  <span className="cert-icon-wrap">
                    {/* img pour PDF : l'Icon SVG ne s'affiche pas dans html2canvas */}
                    <img
                      src={`https://api.iconify.design/${CERTIFICATE_FORMAT_CONFIG[formatPreviewMode]?.icon || "ph:circle"}.svg`}
                      alt=""
                      className="cert-format-icon"
                      width={14}
                      height={14}
                      aria-hidden
                    />
                  </span>
                  {t(`format_${formatPreviewMode}`)} · {t(formatPreviewMode === "online" ? "mode_standard" : formatPreviewMode === "presentiel" ? "mode_standard_plus" : "mode_premium")}
                </p>
                <div className="cert-line-floral cert-line-small">
                  <span className="cert-icon-wrap"><Icon icon={scoreDisplay.isMax ? "ph:sparkle-fill" : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:sparkle" : "ph:leaf"} width={14} height={14} color={scoreDisplay.isMax ? "var(--max-gold)" : scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} /></span>
                  <span className="line" />
                  <span className="cert-icon-wrap"><Icon icon={scoreDisplay.isMax ? "ph:sparkle-fill" : scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:sparkle" : "ph:leaf"} width={14} height={14} color={scoreDisplay.isMax ? "var(--max-gold)" : scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} /></span>
                </div>

                <p className="cert-date-issued">{t("issued_on")} {formatDate(date, lang)}</p>
                {expiresDate && (
                  <p className="cert-date-expires">{t("valid_until")} {formatDate(expiresDate, lang)}</p>
                )}

                <div className="cert-score-general-section" aria-label={t("score_general")}>
                  <div className="cert-score-general-stats">
                    <div className="cert-score-general-item">
                      <span className="cert-score-general-label">{t("score_general")}</span>
                      <span className="cert-score-general-value">
                        {scoreDisplay.isMax ? (
                          <span className="cert-score-max-badge">{t("score_max")}</span>
                        ) : (
                          <>{score}<span className="cert-score-general-sep">/</span>{totalQuestions}</>
                        )}
                      </span>
                    </div>
                    <div className="cert-score-general-item">
                      <span className="cert-score-general-label">{t("percentage_general")}</span>
                      <span className="cert-score-general-value">
                        {scoreDisplay.isMax ? (
                          <span className="cert-score-max-badge">100<span className="cert-score-general-unit">%</span></span>
                        ) : (
                          <>{Math.round(percentage)}<span className="cert-score-general-unit">%</span></>
                        )}
                      </span>
                    </div>
                  </div>
                  {scoreDisplay.isMax && (
                    <p className="cert-badge-max" role="status">{t("badge_max")}</p>
                  )}
                </div>

                <div className="cert-chapters">
                  <p className="cert-chapters-title">{t("results_by_chapter")}</p>
                  <ul className="cert-chapters-list">
                    {stats.map((stat, i) => {
                      const chapter = getOneChapter(stat.uid_chapter);
                      const chapterTitle = chapter?.title || null;
                      const countQuestions = stat.answers?.length || 0;
                      const score = stat.score ?? 0;
                      const percentage = countQuestions ? (score / countQuestions) * 100 : 0;
                      const status = ClassUserCertification.getStatusFromPercentage(percentage);
                      const statusCfg = STATUS_CONFIG?.[status] ?? getStatusConfig("not-good");
                      const statusLabel = t(status, { ns: "classes/stat" });
                      return (
                        <li key={i} className={`chapter-level chapter-${status}`}>
                          <span className="chapter-name">{chapterTitle}</span>
                          <span className="chapter-score">
                            {score}/{countQuestions} ({Math.round(percentage)} %)
                          </span>
                          <span
                            className="chapter-mention"
                            style={statusCfg ? { color: statusCfg.color, border: `1px solid ${statusCfg.border}`, backgroundColor: statusCfg.background_bubble } : undefined}
                          >
                            {statusLabel}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <p className="cert-ref">{t("ref")} {reference}</p>
                <p className="cert-seal">
                    <span className="cert-icon-wrap"><Icon icon="ph:seal-check-fill" width={16} height={16} color="var(--font-color)" /></span>
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

                <div className={`cert-inefop ${scoreDisplay.isMax ? "cert-inefop-max" : ""} ${!scoreDisplay.isMax && scoreDisplay.isExcellent && formatPreviewMode === "online" ? "cert-inefop-online-excellent" : ""} ${!scoreDisplay.isMax && scoreDisplay.isExcellent && formatPreviewMode === "presentiel" ? "cert-inefop-presentiel-excellent" : ""} ${!scoreDisplay.isMax && scoreDisplay.isExcellent && formatPreviewMode === "hybride" ? "cert-inefop-hybride-excellent" : ""} ${!scoreDisplay.isMax && (!scoreDisplay.isExcellent || !["online", "presentiel", "hybride"].includes(formatPreviewMode)) ? "cert-inefop-certified" : ""}`}>
                  <a href="https://www.inefop.gov.ao" target="_blank" rel="noopener noreferrer" className="cert-inefop-link" aria-label="INEFOP">
                    <div className="cert-inefop-logo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={IMAGE_PARTNER_INEFOP.src} alt="INEFOP" width={120} height={60} style={{ objectFit: "contain", maxWidth: 120 }} />
                    </div>
                    <p className="cert-inefop-text">
                      <span className="cert-icon-wrap"><Icon icon="ph:seal-check-fill" width={18} height={18} /></span>
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

        .select-lang-top {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 16px;
        }

        .select-lang-top :global(select) {
          min-width: 10rem;
        }

        .header {
          margin-bottom: 24px;
          text-align: center;
        }

        .header h1 {
          margin: 0 0 8px;
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--font-color);
          letter-spacing: -0.03em;
        }

        .muted {
          margin: 0;
          font-size: 0.95rem;
          color: var(--grey);
          line-height: 1.5;
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
          box-shadow: 0 0 0 3px var(--winner),
            0 25px 50px -12px rgba(247, 187, 0, 0.4),
            0 0 60px -10px rgba(247, 187, 0, 0.3);
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
          animation: certHybrideExcellentShimmer 3s ease-in-out infinite;
        }

        @keyframes certHybrideExcellentShimmer {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.08); }
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

        .certificate-paper.cert-hybride-excellent .cert-score-card {
          border-color: var(--winner) !important;
          background: var(--background) !important;
          box-shadow: 0 4px 16px var(--winner-shadow-sm);
        }

        .certificate-card.cert-online-excellent {
          box-shadow: 0 0 0 3px var(--primary),
            0 25px 50px -12px rgba(99, 102, 241, 0.35),
            0 0 60px -10px rgba(99, 102, 241, 0.2);
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

        .certificate-paper.cert-online-excellent .cert-score-card {
          border-color: var(--primary) !important;
          background: var(--background) !important;
          box-shadow: 0 4px 16px var(--primary-shadow-sm);
        }

        .certificate-card.cert-presentiel-excellent {
          box-shadow: 0 0 0 3px var(--success),
            0 25px 50px -12px var(--success-shadow-md),
            0 0 60px -10px var(--success-shadow);
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

        .certificate-paper.cert-presentiel-excellent .cert-score-card {
          border-color: var(--success) !important;
          background: var(--background) !important;
          box-shadow: 0 4px 16px var(--success-shadow-md);
        }

        /* ——— Diplôme exceptionnel : 100 % (MAX) ——— */
        .certificate-card.cert-max {
          --max-gold: #d4af37;
          --max-gold-light: #f4e4a6;
          --max-gradient: linear-gradient(135deg, #1a1a0a 0%, #2d2d14 40%, #3d3516 100%);
          box-shadow: 0 0 0 4px var(--max-gold),
            0 25px 60px -12px rgba(212, 175, 55, 0.5),
            0 0 80px -15px rgba(212, 175, 55, 0.35);
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
          animation: certMaxShine 4s ease-in-out infinite;
        }

        /* En aperçu MAX : tous les bandeaux en or */
        .certificate-paper.cert-paper-max .cert-online-excellent-ribbon,
        .certificate-paper.cert-paper-max .cert-presentiel-excellent-ribbon,
        .certificate-paper.cert-paper-max .cert-hybride-excellent-ribbon {
          background: linear-gradient(90deg, #8b6914, #d4af37, #f4e4a6, #d4af37, #8b6914) !important;
          color: #1a1a0a !important;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.5) !important;
        }

        @keyframes certMaxShine {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.12); }
        }

        .cert-max-crown {
          display: inline-flex;
          color: #fff;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .cert-max-crown :global(svg) {
          color: #fff;
          fill: #fff;
        }

        .certificate-paper.cert-paper-max .certificate-inner {
          padding-top: 64px;
        }

        .certificate-paper.cert-theme-max .cert-frame-outer,
        .certificate-paper.cert-theme-max .cert-frame-inner {
          border-color: var(--max-gold) !important;
          opacity: 0.6;
        }

        .certificate-paper.cert-theme-max .cert-title {
          color: #92400e;
          font-size: 2.35rem;
          font-weight: 800;
          text-shadow: 0 1px 2px rgba(212, 175, 55, 0.3);
        }

        .certificate-paper.cert-theme-max .cert-line-floral .line {
          background: linear-gradient(90deg, transparent, var(--max-gold), transparent) !important;
        }

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
          border: 2px solid var(--max-gold);
          border-radius: 12px;
          color: #92400e;
          font-size: 0.95rem;
          font-weight: 700;
          text-align: center;
        }

        .cert-inefop.cert-inefop-max .cert-inefop-link {
          border-color: rgba(212, 175, 55, 0.5);
          background: linear-gradient(180deg, rgba(254, 249, 195, 0.5), rgba(254, 243, 199, 0.3));
        }

        .cert-inefop.cert-inefop-max .cert-inefop-text {
          color: #92400e;
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

        .cert-line-floral svg {
          flex-shrink: 0;
          vertical-align: middle;
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

        .certificate-paper.cert-theme-excellent .cert-format {
          background: var(--winner-shadow-xs);
          color: var(--winner-dark);
        }

        .certificate-paper .cert-format.cert-format-online {
          color: var(--primary) !important;
        }
        .certificate-paper .cert-format.cert-format-online {
          background: var(--primary-shadow-xs) !important;
          border: 1px solid var(--primary-shadow-sm) !important;
        }

        .certificate-paper .cert-format.cert-format-presentiel {
          color: var(--success) !important;
        }
        .certificate-paper .cert-format.cert-format-presentiel {
          background: var(--success-shadow-xs) !important;
          border: 1px solid var(--success-shadow-sm) !important;
        }

        .certificate-paper .cert-format.cert-format-hybride {
          color: var(--success) !important;
        }
        .certificate-paper .cert-format.cert-format-hybride {
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

        .cert-preview-selectors {
          display: flex;
          flex-wrap: wrap;
          gap: 16px 24px;
          justify-content: center;
          margin-bottom: 16px;
        }

        .cert-score-selector-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cert-score-selector-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--font-color);
        }

        .cert-score-selector {
          padding: 8px 14px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--font-color);
          background: var(--card-color);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          cursor: pointer;
        }

        .cert-score-selector option {
          background: var(--card-color);
          color: var(--font-color);
        }

        .cert-score-modern {
          position: relative;
          margin-top: 20px;
          margin-bottom: 8px;
          padding: 0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
        }

        .cert-score-modern.cert-score-certified {
          background: var(--background);
          border: 3px solid #6366f1;
          box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.1),
            0 10px 40px rgba(99, 102, 241, 0.25),
            0 20px 60px -15px rgba(99, 102, 241, 0.15);
        }

        .cert-score-modern.cert-score-excellent {
          background: var(--background);
          border: 3px solid rgb(247, 187, 0);
          box-shadow: 0 0 0 1px rgba(247, 187, 0, 0.2),
            0 10px 40px rgba(247, 187, 0, 0.3),
            0 20px 60px -15px rgba(247, 187, 0, 0.2);
          animation: certGlow 3s ease-in-out infinite;
        }

        @keyframes certGlow {
          0%, 100% {
            box-shadow: 0 0 0 1px rgba(247, 187, 0, 0.2),
              0 10px 40px rgba(247, 187, 0, 0.25),
              0 20px 60px -15px rgba(247, 187, 0, 0.18);
          }
          50% {
            box-shadow: 0 0 0 1px rgba(247, 187, 0, 0.25),
              0 14px 48px rgba(247, 187, 0, 0.35),
              0 24px 70px -15px rgba(247, 187, 0, 0.25);
          }
        }

        .cert-score-modern-inner {
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 20px;
          padding: 24px 28px;
          flex-wrap: wrap;
        }

        .cert-score-card {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 140px;
          max-width: 240px;
          padding: 20px 24px;
          background: var(--background);
          border-radius: 20px;
          border: 2px solid #ef4444;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        }

        .cert-score-modern.cert-score-certified .cert-score-card {
          background: var(--background);
          border-color: #ef4444;
        }

        .cert-score-modern.cert-score-excellent .cert-score-card {
          background: var(--background);
          border-color: #ef4444;
        }

        .cert-score-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          flex-shrink: 0;
        }

        .cert-score-hero-wrap,
        .cert-score-modern-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          flex-shrink: 0;
        }

        .cert-score-modern.cert-score-certified .cert-score-modern-icon-wrap,
        .cert-score-modern.cert-score-certified .cert-score-card-icon {
          background: rgba(99, 102, 241, 0.2);
        }

        .cert-score-modern.cert-score-excellent .cert-score-hero-wrap,
        .cert-score-modern.cert-score-excellent .cert-score-card-icon {
          background: rgba(247, 187, 0, 0.25);
          animation: certFloat 2.5s ease-in-out infinite;
        }

        .cert-score-card-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        @keyframes certFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .cert-score-modern-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-start;
          text-align: left;
        }

        .cert-score-modern-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--font-color);
        }

        .cert-score-modern.cert-score-excellent .cert-score-modern-label {
          color: var(--winner-dark);
        }

        .cert-score-modern.cert-score-certified .cert-score-modern-label {
          color: var(--primary);
        }

        .cert-score-value-wrap {
          display: flex;
          align-items: baseline;
          gap: 2px;
          white-space: nowrap;
        }

        .cert-score-value {
          font-size: 2.75rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .cert-score-modern.cert-score-excellent .cert-score-value {
          color: var(--winner);
        }

        .cert-score-unit {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary);
          opacity: 0.9;
        }

        .cert-score-modern.cert-score-excellent .cert-score-unit {
          color: var(--winner);
          -webkit-text-fill-color: initial;
          opacity: 0.95;
        }

        .cert-score-card-score .cert-score-value {
          font-size: 1.85rem;
        }

        .cert-score-modern-divider {
          width: 1px;
          background: linear-gradient(180deg, transparent, var(--card-border), transparent);
          flex-shrink: 0;
        }

        .cert-score-modern.cert-score-excellent .cert-score-modern-divider {
          background: linear-gradient(180deg, transparent, var(--winner-shadow-sm), transparent);
        }

        .cert-score-modern-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          min-width: 100px;
          padding-left: 24px;
        }

        .cert-score-modern-points {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--font-color);
          letter-spacing: -0.02em;
        }

        .cert-score-modern-sep {
          font-weight: 600;
          color: var(--grey-light);
          margin: 0 2px;
        }

        .cert-score-modern-sublabel {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--font-color);
        }

        .cert-score-hero-icon {
          width: 32px;
          height: 32px;
          color: #4f46e5;
        }

        .cert-score-modern.cert-score-certified .cert-score-hero-icon {
          width: 32px;
          height: 32px;
          color: #6366f1;
        }

        .cert-score-modern.cert-score-excellent .cert-score-hero-icon {
          width: 34px;
          height: 34px;
          color: var(--winner);
        }

        .cert-score-badge-excellent {
          position: relative;
          overflow: hidden;
          animation: certBadgePulse 2s ease-in-out infinite;
        }

        .cert-score-badge-excellent::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: certShine 3s ease-in-out infinite;
        }

        @keyframes certShine {
          0% { left: -100%; }
          60%, 100% { left: 150%; }
        }

        @keyframes certBadgePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 2px 12px rgba(247, 187, 0, 0.3); }
          50% { transform: scale(1.02); box-shadow: 0 4px 20px rgba(247, 187, 0, 0.4); }
        }

        .cert-score-badge-inner {
          position: relative;
          z-index: 1;
        }

        .cert-score-ribbon {
          position: absolute;
          top: 14px;
          right: -28px;
          padding: 4px 36px;
          font-size: 0.7rem;
          font-weight: 800;
          color: #1e293b;
          background: rgb(247, 187, 0);
          transform: rotate(45deg);
          letter-spacing: 0.08em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .cert-score-ribbon-certified {
          background: #6366f1;
          color: #fff;
        }

        .cert-score-badge {
          display: block;
          margin: 0;
          padding: 14px 24px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          background: rgba(247, 187, 0, 0.35);
          border-top: 1px solid rgba(247, 187, 0, 0.4);
          border-radius: 0 0 18px 18px;
          text-align: center;
        }

        .cert-score-badge.certified {
          background: rgba(99, 102, 241, 0.2);
          border-top: 1px solid rgba(99, 102, 241, 0.3);
          color: #3730a3;
        }

        @media (max-width: 480px) {
          .cert-score-modern-inner {
            flex-direction: column;
            gap: 16px;
            padding: 20px;
          }
          .cert-score-modern-divider {
            width: 100%;
            height: 1px;
            background: rgba(100, 116, 139, 0.25);
          }
          .cert-score-modern.cert-score-excellent .cert-score-modern-divider {
            background: rgba(247, 187, 0, 0.3);
          }
          .cert-score-modern-right {
            padding-left: 0;
            min-width: 0;
          }
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

        .cert-score-general-sep {
          opacity: 0.7;
          font-weight: 600;
        }

        .cert-score-general-unit {
          margin-left: 1px;
          font-size: 0.95rem;
          font-weight: 600;
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

        /* Couleurs des statuts alignées sur ClassUserCertification.STATUS_CONFIG (classes/stat pour libellés) */
        .cert-chapters-list li.chapter-max .chapter-mention { border: 1px solid var(--gold); }
        .cert-chapters-list li.chapter-excellent .chapter-mention { border: 1px solid var(--success); }
        .cert-chapters-list li.chapter-good .chapter-mention { border: 1px solid var(--info); }
        .cert-chapters-list li.chapter-to-improve .chapter-mention { border: 1px solid var(--warning); }
        .cert-chapters-list li.chapter-not-good .chapter-mention { border: 1px solid var(--error); }

        .chapter-name {
          flex: 1;
          min-width: 0;
          font-size: 0.85rem;
        }

        .chapter-score {
          flex-shrink: 0;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--font-color);
        }

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

        .cert-seal svg {
          flex-shrink: 0;
          vertical-align: middle;
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

        .cert-inefop-link:hover {
          opacity: 0.9;
        }

        .cert-inefop-website {
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 0.85;
          text-decoration: underline;
        }

        .cert-inefop.cert-inefop-certified {
          background: var(--primary-shadow-xs);
          border: 2px solid var(--primary-shadow-sm);
        }

        .cert-inefop.cert-inefop-certified .cert-inefop-text,
        .cert-inefop.cert-inefop-certified .cert-inefop-website {
          color: var(--primary);
        }

        .cert-inefop.cert-inefop-online-excellent {
          background: var(--primary-shadow-xs);
          border: 2px solid var(--primary-shadow-sm);
        }

        .cert-inefop.cert-inefop-online-excellent .cert-inefop-text,
        .cert-inefop.cert-inefop-online-excellent .cert-inefop-website {
          color: var(--primary);
        }

        .cert-inefop.cert-inefop-presentiel-excellent {
          background: var(--success-shadow-xs);
          border: 2px solid var(--success-shadow-sm);
        }

        .cert-inefop.cert-inefop-presentiel-excellent .cert-inefop-text,
        .cert-inefop.cert-inefop-presentiel-excellent .cert-inefop-website {
          color: var(--success);
        }

        .cert-inefop.cert-inefop-hybride-excellent {
          background: var(--winner-shadow-xs);
          border: 2px solid var(--winner-shadow-sm);
        }

        .cert-inefop.cert-inefop-hybride-excellent .cert-inefop-text,
        .cert-inefop.cert-inefop-hybride-excellent .cert-inefop-website {
          color: var(--winner);
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

        .cert-inefop-text svg {
          flex-shrink: 0;
          vertical-align: middle;
        }

        .cert-inefop-sublabel {
          margin: 0;
          font-size: 0.8rem;
          color: var(--font-color);
          font-weight: 500;
        }

        .cert-inefop-link .cert-inefop-sublabel {
          color: var(--font-color);
        }

        .certificate-stats {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
          padding: 18px;
          border-radius: 14px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
        }

        .stat-label {
          color: #64748b;
        }

        .stat-value {
          font-weight: 600;
          color: #1e293b;
        }

        .stat-percent,
        .stat-success {
          color: #059669;
        }

        .certificate-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 24px;
          margin-top: 8px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meta-label {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .meta-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }

        .meta-value.mono {
          font-family: ui-monospace, monospace;
          font-size: 0.8rem;
        }

        .certificate-verified {
          margin: 20px 0 0;
          font-size: 0.85rem;
          color: #059669;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 600px) {
          .certificate-meta {
            grid-template-columns: 1fr;
          }
          .action-bar {
            flex-direction: column;
          }
          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
