"use client";

import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { IconLogoImage } from "@/assets/icons/IconsComponent";
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

// ≥85% = excellent (couleur winner), ≥70% = certifié (couleur primary), sinon médiocre / faible / mauvais
function getChapterLevel(percentage) {
  if (percentage >= 85) return "excellent";
  if (percentage >= 70) return "certifié";
  if (percentage >= 50) return "mediocre";
  if (percentage >= 40) return "faible";
  return "mauvais";
}

const CHAPTER_LEVEL_LABELS = {
  excellent: "Excellent",
  "certifié": "Certifié",
  mediocre: "Médiocre",
  faible: "Faible",
  mauvais: "Mauvais",
};

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

function formatDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
/**
 * Exporte le certificat (élément DOM) en PDF et déclenche le téléchargement.
 * Utilise html2canvas pour capturer le rendu puis jspdf pour générer le PDF.
 */
async function exportCertificateToPdf(element, filename = "certificat-dandela-academy.pdf") {
  if (!element) return;
  try {
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const scale = 2;
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#fbfbfb",
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
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
  const [exporting, setExporting] = useState(false);
  const [shareDone, setShareDone] = useState(false);
  /** '70' = version Certifié (70%), '85' = version Excellent (85%+) */
  const [scorePreviewMode, setScorePreviewMode] = useState("85");
  /** Format de formation : online | presentiel | hybride */
  const [formatPreviewMode, setFormatPreviewMode] = useState("online");

  const { course, user, result, progress, dates, issuer } = mockCertificate;

  const scoreDisplay = scorePreviewMode === "85"
    ? { percentage: 88, score: 44, maxScore: 50, isExcellent: true }
    : { percentage: 72, score: 36, maxScore: 50, isExcellent: false };

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setExporting(true);
    const ok = await exportCertificateToPdf(
      certificateRef.current,
      `certificat-${mockCertificate.id}.pdf`
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
    <div className="page">
      <main className="container">
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
            {exporting ? "Génération…" : "Télécharger en PDF"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleShare}
          >
            <Icon icon="ph:share-network" width={20} height={20} />
            {shareDone ? "Lien copié !" : "Partager"}
          </button>
        </div>

        {/* Certificat (fond clair pour un rendu type “document” et PDF propre) */}
        <section className="certificate-block">
          <div className="cert-preview-selectors">
            <div className="cert-score-selector-wrap">
              <span className="cert-score-selector-label">Aperçu score</span>
              <select
                className="cert-score-selector"
                value={scorePreviewMode}
                onChange={(e) => setScorePreviewMode(e.target.value)}
                aria-label="Choisir la version du score"
              >
                <option value="70">Certifié (70 %)</option>
                <option value="85">Excellent (85 % ou plus)</option>
              </select>
            </div>
            <div className="cert-score-selector-wrap">
              <span className="cert-score-selector-label">Format</span>
              <select
                className="cert-score-selector"
                value={formatPreviewMode}
                onChange={(e) => setFormatPreviewMode(e.target.value)}
                aria-label="Choisir le format de formation"
              >
                <option value="online">En ligne — Standard</option>
                <option value="presentiel">Présentiel — Standard+</option>
                <option value="hybride">Hybride — ⭐⭐⭐ Premium</option>
              </select>
            </div>
          </div>
          <div className={`certificate-card cert-theme-${scorePreviewMode === "85" ? "excellent" : "certified"} ${formatPreviewMode === "hybride" && scoreDisplay.isExcellent ? "cert-hybride-excellent" : ""} ${formatPreviewMode === "online" && scoreDisplay.isExcellent ? "cert-online-excellent" : ""} ${formatPreviewMode === "presentiel" && scoreDisplay.isExcellent ? "cert-presentiel-excellent" : ""}`} ref={certificateRef}>
            <div className={`certificate-paper cert-floral cert-theme-${scorePreviewMode === "85" ? "excellent" : "certified"} ${formatPreviewMode === "hybride" && scoreDisplay.isExcellent ? "cert-hybride-excellent" : ""} ${formatPreviewMode === "online" && scoreDisplay.isExcellent ? "cert-online-excellent" : ""} ${formatPreviewMode === "presentiel" && scoreDisplay.isExcellent ? "cert-presentiel-excellent" : ""}`}>
              {formatPreviewMode === "hybride" && scoreDisplay.isExcellent && (
                <div className="cert-hybride-excellent-ribbon">
                  <span className="cert-hybride-excellent-stars">⭐⭐⭐</span> EXCELLENT PREMIUM
                </div>
              )}
              {formatPreviewMode === "online" && scoreDisplay.isExcellent && (
                <div className="cert-online-excellent-ribbon">
                  <span className="cert-format-excellent-stars">⭐</span> EXCELLENT STANDARD
                </div>
              )}
              {formatPreviewMode === "presentiel" && scoreDisplay.isExcellent && (
                <div className="cert-presentiel-excellent-ribbon">
                  <span className="cert-format-excellent-stars">⭐⭐</span> EXCELLENT STANDARD+
                </div>
              )}
              <div className="cert-frame cert-frame-outer" />
              <div className="cert-frame cert-frame-inner" />
              <div className="cert-corner cert-corner-tl">
                <Icon icon={scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:star-four-fill" : "ph:flower-lotus"} width={36} height={36} color={scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
              </div>
              <div className="cert-corner cert-corner-tr">
                <Icon icon={scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:star-four-fill" : "ph:flower-lotus"} width={36} height={36} color={scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
              </div>
              <div className="cert-corner cert-corner-bl">
                <Icon icon={scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:star-four-fill" : "ph:flower-lotus"} width={36} height={36} color={scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
              </div>
              <div className="cert-corner cert-corner-br">
                <Icon icon={scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:star-four-fill" : "ph:flower-lotus"} width={36} height={36} color={scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
              </div>

              <div className="certificate-inner">
                <div className="cert-logo-wrap">
                  <IconLogoImage width={30} height={30} color={scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "var(--primary)"} />
                </div>
                <p className="cert-org">{issuer}</p>
                <h1 className="cert-title">
                  {scoreDisplay.isExcellent && formatPreviewMode === "hybride" && "Diplôme Premium Excellent"}
                  {scoreDisplay.isExcellent && formatPreviewMode === "online" && "Diplôme Excellent — Standard"}
                  {scoreDisplay.isExcellent && formatPreviewMode === "presentiel" && "Diplôme Excellent — Standard+"}
                  {(!scoreDisplay.isExcellent || !["hybride", "online", "presentiel"].includes(formatPreviewMode)) && "Diplôme"}
                </h1>
                <div className="cert-line-floral">
                  <Icon icon={scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:sparkle" : "ph:flower"} width={18} height={18} color={scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
                  <span className="line" />
                  <Icon icon={scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:sparkle" : "ph:flower"} width={18} height={18} color={scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
                </div>
                <p className="cert-intro">Ce diplôme est décerné à</p>
                <h2 className="cert-name">{user.fullName}</h2>
                <p className="cert-for">pour avoir réussi avec succès le cours</p>
                <h3 className="cert-course">{course.title}</h3>
                <p className={`cert-format cert-format-${formatPreviewMode}`}>
                  <Icon icon={CERTIFICATE_FORMAT_CONFIG[formatPreviewMode]?.icon || "ph:circle"} width={14} height={14} />
                  {CERTIFICATE_FORMAT_CONFIG[formatPreviewMode]?.format} · {CERTIFICATE_FORMAT_CONFIG[formatPreviewMode]?.mode}
                </p>
                <div className="cert-line-floral cert-line-small">
                  <Icon icon={scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:sparkle" : "ph:leaf"} width={14} height={14} color={scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
                  <span className="line" />
                  <Icon icon={scoreDisplay.isExcellent && ["hybride", "online", "presentiel"].includes(formatPreviewMode) ? "ph:sparkle" : "ph:leaf"} width={14} height={14} color={scoreDisplay.isExcellent ? (formatPreviewMode === "online" ? "var(--primary)" : formatPreviewMode === "presentiel" ? "var(--success)" : "var(--winner)") : "#6366f1"} />
                </div>

                <p className="cert-date-issued">Délivré le {formatDate(dates.issued)}</p>

                <div className="cert-chapters">
                  <p className="cert-chapters-title">Résultats par chapitre</p>
                  <ul className="cert-chapters-list">
                    {mockCertificate.chaptersResults.map((ch, i) => {
                      const level = getChapterLevel(ch.percentage);
                      return (
                        <li key={i} className={`chapter-level chapter-${level}`}>
                          <span className="chapter-name">{ch.title}</span>
                          <span className="chapter-score">
                            {ch.score}/{ch.maxScore} ({ch.percentage} %)
                          </span>
                          <span className="chapter-mention">{CHAPTER_LEVEL_LABELS[level]}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <p className="cert-ref">Réf. {mockCertificate.id}</p>
                {mockCertificate.verified && (
                  <p className="cert-seal">
                    <Icon icon="ph:seal-check-fill" width={16} height={16} color="var(--font-color)" />
                    Vérifiable par les employeurs · {issuer}
                  </p>
                )}
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
        }

        .certificate-paper.cert-presentiel-excellent .certificate-inner {
          padding-top: 56px;
        }

        .certificate-paper.cert-presentiel-excellent .cert-score-card {
          border-color: var(--success) !important;
          background: var(--background) !important;
          box-shadow: 0 4px 16px var(--success-shadow-md);
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
          background: linear-gradient(135deg, #b45309 0%, var(--winner) 50%, #fbbf24 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 2.4rem;
        }

        .certificate-paper.cert-online-excellent .cert-title {
          background: linear-gradient(135deg, #3730a3 0%, var(--primary) 50%, #6366f1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 2.3rem;
        }

        .certificate-paper.cert-presentiel-excellent .cert-title {
          background: linear-gradient(135deg, var(--success-dark) 0%, var(--success) 50%, var(--success-shadow-md) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 2.3rem;
        }

        .cert-line-floral {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
          color: #64748b;
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

        .cert-line-small .line { width: 50px; }
        .cert-line-small { margin: 12px 0 16px; }

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
          background: linear-gradient(135deg, var(--gold-dark) 0%, var(--winner) 50%, var(--gold) 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: certShimmer 4s ease-in-out infinite;
        }

        @keyframes certShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
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

        .cert-chapters-list li.chapter-excellent {
          background: var(--winner-shadow-xs);
          margin: 0 -10px;
          padding: 8px 10px;
          border-radius: 6px;
          border-bottom-color: transparent;
        }

        .cert-chapters-list li.chapter-excellent .chapter-mention {
          background: var(--winner);
          color: #1e293b;
        }

        .cert-chapters-list li.chapter-certifié .chapter-mention {
          background: rgba(99, 102, 241, 0.2);
          color: var(--primary);
        }

        .cert-chapters-list li.chapter-mediocre .chapter-mention {
          background: rgba(245, 158, 11, 0.2);
          color: var(--winner);
        }

        .cert-chapters-list li.chapter-faible .chapter-mention {
          background: rgba(249, 115, 22, 0.2);
          color: #c2410c;
        }

        .cert-chapters-list li.chapter-mauvais .chapter-mention {
          background: rgba(239, 68, 68, 0.2);
          color: #b91c1c;
        }

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
