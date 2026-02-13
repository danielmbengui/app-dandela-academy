"use client";

import SelectLanguageComponent from "@/components/elements/SelectLanguageComponent";
import { useTranslation } from "react-i18next";
import { NS_EVENT_FLYER } from "@/contexts/i18n/settings";
import { Icon } from "@iconify/react";

const styles = {
  page: {
    minHeight: "100vh",
    margin: 0,
    padding: "2.5rem 1.5rem",
    backgroundColor: "#f3f4f6",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, -system-ui, sans-serif',
    color: "#111827",
    display: "flex",
    justifyContent: "center",
  },
  flyer: {
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.12), 0 0 0 1px rgba(148,163,184,0.25)",
    padding: "2rem 2.25rem",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem 1rem",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "1rem",
    marginBottom: "1.5rem",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.9rem",
    flex: "1 1 auto",
    minWidth: 0,
  },
  logosLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.9rem",
    flexShrink: 0,
    marginRight: "1.25rem",
  },
  headerBrand: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "0.15rem",
  },
  headerBrandName: {
    fontSize: "1rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#111827",
    lineHeight: 1.2,
  },
  headerBrandTagline: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#6b7280",
    lineHeight: 1.2,
  },
  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "0.4rem",
    flexShrink: 0,
  },
  languageBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontSize: "0.78rem",
    color: "#4b5563",
  },
  languageLabel: {
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    fontSize: "0.7rem",
    color: "#9ca3af",
  },
  languageButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.18rem 0.55rem",
    borderRadius: "999px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    fontSize: "0.75rem",
    cursor: "default",
  },
  languageFlag: {
    height: "14px",
    width: "auto",
    objectFit: "contain",
  },
  logo: {
    height: "52px",
    width: "auto",
    objectFit: "contain",
  },
  logoNgLearning: {
    height: "48px",
    width: "auto",
    objectFit: "contain",
  },
  logoInefop: {
    height: "44px",
    width: "auto",
    objectFit: "contain",
  },
  badge: {
    display: "inline-block",
    padding: "0.25rem 0.7rem",
    borderRadius: "999px",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "0.9rem",
  },
  title: {
    fontSize: "1.7rem",
    lineHeight: 1.25,
    fontWeight: 800,
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "0.98rem",
    color: "#4b5563",
    marginBottom: "1rem",
  },
  dateHero: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.75rem 1rem",
    marginBottom: "1.4rem",
    borderRadius: "0.75rem",
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    border: "1px solid rgba(220, 38, 38, 0.4)",
  },
  dateHeroIcon: {
    flexShrink: 0,
    color: "#b91c1c",
  },
  dateHeroText: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#b91c1c",
  },
  dateBoxHighlight: {
    borderRadius: "0.75rem",
    border: "1px solid rgba(220, 38, 38, 0.4)",
    padding: "0.8rem 0.95rem",
    marginBottom: "0.7rem",
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.5,
    backgroundColor: "rgba(220, 38, 38, 0.08)",
    color: "#b91c1c",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.4fr)",
    gap: "1.5rem",
  },
  sectionTitle: {
    fontSize: "0.82rem",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#9ca3af",
    marginBottom: "0.45rem",
    fontWeight: 600,
  },
  box: {
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
    padding: "0.8rem 0.95rem",
    marginBottom: "0.7rem",
    fontSize: "0.96rem",
    lineHeight: 1.5,
  },
  strong: {
    fontWeight: 600,
  },
  contacts: {
    fontSize: "1rem",
    fontWeight: 600,
  },
  contactsHint: {
    fontSize: "0.78rem",
    color: "#6b7280",
    marginTop: "0.15rem",
  },
  certification: {
    borderRadius: "0.75rem",
    border: "1px solid #16a34a",
    backgroundColor: "#ecfdf3",
    padding: "0.8rem 1rem",
    fontSize: "0.9rem",
    lineHeight: 1.6,
    marginTop: "0.6rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "0.75rem",
  },
  certInefopLogo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.35rem",
    marginTop: "0.25rem",
    marginLeft: "26px", /* aligné avec le texte cert_body (icône 18px + gap 0.5rem) */
  },
  certInefopText: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#166534",
    lineHeight: 1.4,
  },
  logoInefopInCert: {
    height: "36px",
    width: "auto",
    objectFit: "contain",
  },
  certIcon: {
    flexShrink: 0,
    marginTop: "0.1rem",
    color: "#16a34a",
  },
  footer: {
    marginTop: "1.6rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "0.9rem",
  },
  footerNote: {
    fontSize: "0.78rem",
    color: "#6b7280",
  },
  printButton: {
    padding: "0.55rem 1.1rem",
    borderRadius: "999px",
    border: "1px solid #9ca3af",
    fontSize: "0.8rem",
    backgroundColor: "#f9fafb",
    cursor: "pointer",
  },
  responsive: `
    @media (max-width: 768px) {
      .da-flyer {
        padding: 1.2rem 1.1rem;
        border-radius: 0.75rem;
      }
      .da-flyer-main {
        grid-template-columns: minmax(0, 1fr);
      }
      .da-flyer-header {
        flex-direction: column;
        align-items: flex-start;
      }
      .da-flyer-header-row {
        width: 100%;
      }
      .da-flyer-header-right {
        align-items: flex-start;
      }
    }
    @media print {
      @page {
        size: A4 landscape;
        margin: 5mm;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        height: 100%;
      }
      .da-page {
        background: #ffffff !important;
        padding: 0 !important;
        min-height: 0 !important;
        height: 100% !important;
        max-height: 210mm !important;
        overflow: hidden !important;
        display: block !important;
      }
      .da-flyer {
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        padding: 14px 18px !important;
        max-height: 100% !important;
        overflow: hidden !important;
      }
      .da-flyer-header {
        padding-bottom: 14px !important;
        margin-bottom: 18px !important;
        border-bottom-width: 1px !important;
        gap: 10px 12px !important;
      }
      .da-flyer-header .da-flyer-header-right {
        gap: 0 !important;
      }
      .da-flyer-header-row {
        justify-content: space-between !important;
      }
      .da-flyer-header-brand span:first-child {
        font-size: 0.75rem !important;
        letter-spacing: 0.08em !important;
      }
      .da-flyer-header-brand span:last-child {
        font-size: 0.6rem !important;
        letter-spacing: 0.1em !important;
      }
      .da-flyer .da-flyer-date-hero {
        padding: 10px 12px !important;
        margin-bottom: 16px !important;
      }
      .da-flyer-main {
        gap: 18px !important;
        margin-top: 8px !important;
      }
      .da-flyer > div:first-of-type {
        margin-bottom: 14px !important;
      }
      .da-flyer-title {
        font-size: 1.05rem !important;
        margin-bottom: 12px !important;
        line-height: 1.25 !important;
      }
      .da-flyer-date-hero span:last-child {
        font-size: 0.8rem !important;
      }
      .da-flyer-section-title,
      .da-flyer h2 {
        font-size: 0.7rem !important;
        margin-bottom: 10px !important;
      }
      .da-flyer-subtitle,
      .da-flyer-box,
      .da-flyer-main .da-flyer-box {
        font-size: 0.72rem !important;
        line-height: 1.5 !important;
      }
      .da-flyer-subtitle {
        margin-bottom: 12px !important;
      }
      .da-flyer-badge {
        font-size: 0.6rem !important;
        padding: 4px 8px !important;
        margin-bottom: 10px !important;
      }
      .da-flyer-box {
        padding: 10px 12px !important;
        margin-bottom: 14px !important;
      }
      .da-flyer-footer {
        margin-top: 18px !important;
        padding-top: 12px !important;
        border-top-width: 1px !important;
      }
      .da-flyer-footer-note {
        font-size: 0.62rem !important;
      }
      .da-flyer-certification {
        padding: 10px 12px !important;
        margin-top: 14px !important;
        gap: 10px !important;
      }
      .da-flyer-main > div > .da-flyer-section-title,
      .da-flyer-main > div > .da-flyer-box {
        margin-bottom: 14px !important;
      }
      .da-flyer-main aside .da-flyer-section-title {
        margin-top: 12px !important;
      }
      .da-flyer-main aside .da-flyer-section-title:first-child {
        margin-top: 0 !important;
      }
      .da-flyer-certification img {
        max-height: 28px !important;
      }
      .da-flyer-cert-inefop-text {
        font-size: 0.68rem !important;
      }
      .da-flyer-header img[alt*="Logo"],
      .da-flyer-header img[alt*="NG"] {
        max-height: 28px !important;
      }
      .da-flyer-print-button {
        display: none !important;
      }
      .da-select-lang {
        display: none !important;
      }
    }
  `,
};

export default function CeremonyPresentationPage() {
  const { t } = useTranslation([NS_EVENT_FLYER]);
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles.responsive }} />
      <main style={styles.page} className="da-page">
        <section style={styles.flyer} className="da-flyer">
          <header style={styles.header} className="da-flyer-header">
            <div style={styles.headerRow} className="da-flyer-header-row">
              <div style={styles.logosLeft}>
                <img
                  src="/images/logo.png"
                  alt="Logo Dandela Academy"
                  style={styles.logo}
                />
                <img
                  src="/images/partners/ng-learning.png"
                  alt="Logo NG Learning"
                  style={styles.logoNgLearning}
                />
              </div>
              <div style={styles.headerBrand} className="da-flyer-header-brand">
                <span style={styles.headerBrandName}>Dandela Academy</span>
                <span style={styles.headerBrandTagline}>{t("tagline")}</span>
              </div>
            </div>
            <div
              style={styles.headerRight}
              className="da-flyer-header-right"
            >
              <div className="da-select-lang">
                <SelectLanguageComponent />
              </div>
            </div>
          </header>

          <div>
            <span style={styles.badge} className="da-flyer-badge">{t("badge")}</span>
            <h1 style={styles.title} className="da-flyer-title">{t("title")}</h1>
            <p style={styles.subtitle} className="da-flyer-subtitle">{t("subtitle")}</p>
            <div style={styles.dateHero} className="da-flyer-date-hero">
              <span style={styles.dateHeroIcon} aria-hidden>
                <Icon icon="ph:calendar-blank-fill" width={22} height={22} />
              </span>
              <span style={styles.dateHeroText}>{t("date_full")}</span>
            </div>
          </div>

          <div style={styles.main} className="da-flyer-main">
            <div>
              <h2 style={styles.sectionTitle} className="da-flyer-section-title">{t("section_location")}</h2>
              <div style={styles.box} className="da-flyer-box">
                <div>
                  <span style={styles.strong}>Centro Dandela Academy</span>
                  <br />
                  Rua do esferovite
                  <br />
                  Zango III - {t("address_last_stop")}
                  <br />
                  Luanda – Angola
                </div>
              </div>

              <h2 style={styles.sectionTitle} className="da-flyer-section-title">{t("section_trainings")}</h2>
              <div style={styles.box} className="da-flyer-box">{t("trainings_body")}</div>

              <h2
                style={{ ...styles.sectionTitle, marginTop: "1.25rem" }}
                className="da-flyer-section-title"
              >
                {t("section_contacts")}
              </h2>
              <div style={styles.box} className="da-flyer-box">
                <div style={styles.contacts}>
                  +244 974 502 709
                  <br />
                  +244 955 872 494
                </div>
                <div style={styles.contactsHint}>
                  {t("contacts_hint")}
                </div>
              </div>
            </div>

            <aside aria-label="Informations clés">
              <h2 style={styles.sectionTitle} className="da-flyer-section-title">{t("section_cert")}</h2>
              <div style={styles.certification} className="da-flyer-certification">
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <span style={styles.certIcon} aria-hidden>
                    <Icon icon="ph:certificate-fill" width={18} height={18} />
                  </span>
                  <span>{t("cert_body")}</span>
                </div>
                <div style={styles.certInefopLogo}>
                  <span style={styles.certInefopText} className="da-flyer-cert-inefop-text">
                    {t("cert_inefop_accredited")} — {t("cert_license")}
                  </span>
                  <img
                    src="/images/partners/inefop.png"
                    alt="INEFOP"
                    style={styles.logoInefopInCert}
                  />
                </div>
              </div>
            </aside>
          </div>

          <footer style={styles.footer} className="da-flyer-footer">
            <p style={styles.footerNote} className="da-flyer-footer-note">
              {t("pdf_hint")}
              <a
                href="https://academy.dandela.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--primary)", fontWeight: 600 }}
              >
                https://academy.dandela.com
              </a>
            </p>
            <button
              type="button"
              style={styles.printButton}
              className="da-flyer-print-button"
              onClick={handlePrint}
            >
              {t("pdf_button")}
            </button>
          </footer>
        </section>
      </main>
    </>
  );
}
