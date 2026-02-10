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
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "1rem",
    marginBottom: "1.5rem",
  },
  logosLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.9rem",
  },
  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "0.4rem",
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
  logoInefop: {
    height: "44px",
    width: "auto",
    objectFit: "contain",
  },
  headerText: {
    textAlign: "right",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    color: "#6b7280",
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
    marginBottom: "1.4rem",
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
    alignItems: "flex-start",
    gap: "0.5rem",
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
  printFooter: {
    marginTop: "0.4rem",
    fontSize: "0.75rem",
    color: "#6b7280",
    textAlign: "center",
  },
  responsive: `
    .da-print-footer {
      display: none;
      font-size: 0.75rem;
      color: #6b7280;
      text-align: center;
      margin-top: 0.4rem;
    }
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
      .da-flyer-header-text {
        text-align: left;
      }
      .da-flyer-header-right {
        align-items: flex-start;
      }
    }
    @media print {
      body {
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .da-page {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .da-flyer {
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: 100% !important;
      }
      .da-flyer-print-button {
        display: none !important;
      }
      .da-select-lang {
        display: none !important;
      }
      .da-print-footer {
        display: block !important;
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
            <div style={styles.logosLeft}>
              {/* Remplacez les chemins ci-dessous par les vrais fichiers de logo */}
              <img
                src="/images/logo.png"
                alt="Logo Dandela Academy"
                style={styles.logo}
              />
              <img
                src="/images/partners/inefop.png"
                alt="Logo INEFOP"
                style={styles.logoInefop}
              />
            </div>
            <div
              style={styles.headerRight}
              className="da-flyer-header-right"
            >
              <div className="da-select-lang">
                <SelectLanguageComponent />
              </div>
              <div
                style={styles.headerText}
                className="da-flyer-header-text"
              >
                Dandela Academy
                <br />
                {t("tagline")}
              </div>
            </div>
          </header>

          <div>
            <span style={styles.badge}>{t("badge")}</span>
            <h1 style={styles.title}>{t("title")}</h1>
            <p style={styles.subtitle}>{t("subtitle")}</p>
          </div>

          <div style={styles.main} className="da-flyer-main">
            <div>
              <h2 style={styles.sectionTitle}>{t("section_location")}</h2>
              <div style={styles.box}>
                <div>
                  <span style={styles.strong}>Centro Dandela Academy</span>
                  <br />
                  Rua do esferovite, Zango 3
                  <br />
                  Luanda – Angola
                </div>
              </div>

              <h2 style={styles.sectionTitle}>{t("section_trainings")}</h2>
              <div style={styles.box}>{t("trainings_body")}</div>
            </div>

            <aside aria-label="Informations clés">
              <h2 style={styles.sectionTitle}>{t("section_cert")}</h2>
              <div style={styles.certification}>
                <span style={styles.certIcon} aria-hidden>
                  <Icon icon="ph:certificate-fill" width={18} height={18} />
                </span>
                <span>{t("cert_body")}</span>
              </div>

              <h2
                style={{ ...styles.sectionTitle, marginTop: "1.25rem" }}
              >
                {t("section_contacts")}
              </h2>
              <div style={styles.box}>
                <div style={styles.contacts}>
                  +244 974 502 709
                  <br />
                  +244 955 872 494
                </div>
                <div style={styles.contactsHint}>
                  {t("contacts_hint")}
                </div>
              </div>
            </aside>
          </div>

          <footer style={styles.footer}>
            <p style={styles.footerNote}>{t("pdf_hint")}</p>
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
        <div style={styles.printFooter} className="da-print-footer">
          {t("website_line", { url: "https://academy.dandela.co" })}
        </div>
      </main>
    </>
  );
}
