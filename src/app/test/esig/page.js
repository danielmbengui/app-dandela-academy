"use client";

import { useRef, useState, useEffect } from "react";
import { EB_Garamond, Cinzel } from "next/font/google";
import { Icon } from "@iconify/react";
import { IconLogoImage } from "@/assets/icons/IconsComponent";
import { useSchool } from "@/contexts/SchoolProvider";
import { ClassDiploma, ClassDiplomaTranslate } from "@/classes/ClassDiploma";
import { ClassLesson } from "@/classes/ClassLesson";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-diploma",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-diploma-title",
});

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
    console.warn("[PDF] Impossible de précharger l'image:", e);
    return null;
  }
}

/**
 * Exporte le diplôme (élément DOM) en PDF et déclenche le téléchargement.
 * Utilise html2canvas pour capturer le rendu puis jspdf pour générer le PDF.
 * Les images externes (signature) sont préchargées via proxy pour garantir leur rendu.
 */
async function exportDiplomaToPdf(element, filename = "diplome.pdf") {
  if (!element) return false;
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  try {
    // Précharger la signature si présente
    const signatureImg = element.querySelector(".signature-img");
    const signatureSrc = signatureImg?.getAttribute?.("src") || signatureImg?.src || "";
    const signatureDataUrl = await preloadImageAsDataUrl(origin, signatureSrc);

    // Attendre le chargement des polices
    if (typeof document !== "undefined" && document.fonts?.ready) {
      await document.fonts.ready;
    }

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const scale = 3;
    // Format A4 paysage : 297mm x 210mm = 842px x 595px à 72dpi
    const pdfWidth = 842;
    const pdfHeight = 595;

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#fffef7",
      logging: false,
      imageTimeout: 15000,
      windowWidth: Math.max(element.scrollWidth, pdfWidth),
      windowHeight: Math.max(element.scrollHeight, pdfHeight),
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc, clonedElement) => {
        // Ajouter les polices Google
        const fontLinkGaramond = clonedDoc.createElement("link");
        fontLinkGaramond.href = "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap";
        fontLinkGaramond.rel = "stylesheet";
        clonedDoc.head.appendChild(fontLinkGaramond);

        const fontLinkCinzel = clonedDoc.createElement("link");
        fontLinkCinzel.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap";
        fontLinkCinzel.rel = "stylesheet";
        clonedDoc.head.appendChild(fontLinkCinzel);

        // Styles de fix pour le PDF
        const style = clonedDoc.createElement("style");
        style.textContent = `
          .diploma-pdf-fix {
            width: ${pdfWidth}px !important;
            min-width: ${pdfWidth}px !important;
            height: ${pdfHeight}px !important;
            min-height: ${pdfHeight}px !important;
            box-sizing: border-box !important;
            font-family: var(--font-diploma), "EB Garamond", Garamond, "Times New Roman", serif !important;
          }
          .diploma-pdf-fix .diploma-title {
            font-family: var(--font-diploma-title), "Cinzel", Georgia, serif !important;
          }
          .diploma-pdf-fix .diploma-corner {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .diploma-pdf-fix .diploma-corner svg {
            display: block !important;
            width: 32px !important;
            height: 32px !important;
          }
          .diploma-pdf-fix .signature-img {
            display: block !important;
            max-width: 140px !important;
            max-height: 50px !important;
          }
          .diploma-pdf-fix .diploma-header {
            padding-top: 10px !important;
          }
          .diploma-pdf-fix .diploma-content {
            padding: 20px 48px 16px !important;
          }
          .diploma-pdf-fix .diploma-legal {
            margin-top: auto !important;
            padding-top: 6px !important;
          }
          .diploma-pdf-fix .diploma-legal p {
            font-size: 8px !important;
            line-height: 1.3 !important;
          }
        `;
        clonedDoc.head.appendChild(style);
        clonedElement.classList.add("diploma-pdf-fix");

        // Injecter la signature préchargée si disponible
        if (signatureDataUrl) {
          clonedElement.querySelectorAll(".signature-img").forEach((img) => {
            img.src = signatureDataUrl;
          });
        }
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const ratio = canvas.height / canvas.width;
    const imgW = pageW;
    let imgH = pageW * ratio;

    // Centrer l'image si elle est plus petite que la page
    if (imgH > pageH) {
      imgH = pageH;
      const scaledW = pageH / ratio;
      const x = (pageW - scaledW) / 2;
      pdf.addImage(imgData, "JPEG", x, 0, scaledW, pageH);
    } else {
      const y = (pageH - imgH) / 2;
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
 * Crée un ClassDiploma de test avec les cours bureautique
 * @param {string[]} uid_lessons - UIDs des leçons depuis Firebase
 * @param {Array} lessons - Objets leçons avec uid, name, order
 */
function createTestDiploma(uid_lessons = [], lessons = []) {
  // Créer les traductions
  const translateFr = new ClassDiplomaTranslate({
    lang: "fr",
    title: "Diplôme Professionnel en Bureautique et Outils Numériques",
    description: "Formation complète aux outils bureautiques essentiels : Word, Excel, PowerPoint et introduction à l'informatique.",
    prerequisites: [
      "Aucun prérequis technique",
      "Connaissance de base en français",
      "Accès à un ordinateur avec connexion internet",
    ],
    goals: [
      "Maîtriser les fondamentaux de l'informatique",
      "Créer et formater des documents professionnels avec Word",
      "Gérer des données et créer des tableaux avec Excel",
      "Concevoir des présentations impactantes avec PowerPoint",
    ],
  });

  const translatePt = new ClassDiplomaTranslate({
    lang: "pt",
    title: "Diploma Profissional em Informática e Ferramentas Digitais",
    description: "Formação completa em ferramentas de escritório essenciais: Word, Excel, PowerPoint e introdução à informática.",
    prerequisites: [
      "Nenhum pré-requisito técnico",
      "Conhecimento básico de português",
      "Acesso a um computador com conexão à internet",
    ],
    goals: [
      "Dominar os fundamentos da informática",
      "Criar e formatar documentos profissionais com Word",
      "Gerenciar dados e criar tabelas com Excel",
      "Criar apresentações impactantes com PowerPoint",
    ],
  });

  const translateEn = new ClassDiplomaTranslate({
    lang: "en",
    title: "Professional Diploma in Office Tools and Digital Skills",
    description: "Complete training in essential office tools: Word, Excel, PowerPoint and introduction to computer science.",
    prerequisites: [
      "No technical prerequisites",
      "Basic knowledge of English",
      "Access to a computer with internet connection",
    ],
    goals: [
      "Master the fundamentals of computer science",
      "Create and format professional documents with Word",
      "Manage data and create spreadsheets with Excel",
      "Design impactful presentations with PowerPoint",
    ],
  });

  // Créer le diplôme avec les cours depuis Firebase
  const diploma = new ClassDiploma({
    // uid: laissé vide pour que Firebase génère un UID automatiquement
    code: "DIPL-DAND-OFFICE-2026",
    // uid_intern: sera défini automatiquement par createFirestore()
    title: "Diplôme Professionnel en Bureautique et Outils Numériques",
    description: "Formation complète aux outils bureautiques essentiels",
    enabled: true,
    category: ClassDiploma.CATEGORY.OFFICE,
    level: ClassDiploma.LEVEL.INTERMEDIATE,
    format: ClassDiploma.FORMAT.HYBRID,
    status: ClassDiploma.STATUS.ACTIVE,
    // Leçons associées depuis Firebase
    uid_lessons,
    lessons,
    // Seuils de réussite
    passing_percentage: 70,
    good_percentage: 80,
    excellent_percentage: 90,
    max_percentage: 100,
    // Durées de formation
    duration_hours_online: 120,
    duration_hours_onsite: 40,
    exam_duration_minutes: 90, // 1h30
    // Métadonnées visuelles
    icon: "ph:desktop-tower-fill",
    color: "#6b4423",
    // Traductions
    translates: [translateFr, translatePt, translateEn],
    translate: translateFr,
    // Timestamps
    created_time: new Date(),
    last_edit_time: new Date(),
  });

  return diploma;
}

export default function DiplomeESIG() {
  const diplomaRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [testDiploma, setTestDiploma] = useState(null);
  const [creatingDiploma, setCreatingDiploma] = useState(false);
  const [firebaseLessons, setFirebaseLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const { school } = useSchool();

  // Charger les leçons depuis Firebase au montage du composant
  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoadingLessons(true);
        const lessons = await ClassLesson.fetchListFromFirestore("fr");
        console.log("Leçons chargées depuis Firebase:", lessons);
        setFirebaseLessons(lessons);
      } catch (error) {
        console.error("Erreur lors du chargement des leçons:", error);
      } finally {
        setLoadingLessons(false);
      }
    };
    loadLessons();
  }, []);

  // Handler pour créer un diplôme de test et l'enregistrer dans Firestore
  const handleCreateTestDiploma = async () => {
    if (firebaseLessons.length === 0) {
      alert("Aucune leçon disponible dans Firebase. Veuillez d'abord créer des leçons.");
      return;
    }

    setCreatingDiploma(true);
    try {
      // Utiliser les vraies leçons de Firebase
      const uid_lessons = firebaseLessons.map(lesson => lesson.uid);
      const lessonsForDiploma = firebaseLessons.map((lesson, index) => ({
        uid: lesson.uid,
        name: lesson.name || lesson.title || `Leçon ${index + 1}`,
        order: index + 1,
      }));

      const diploma = createTestDiploma(uid_lessons, lessonsForDiploma);
      console.log("Diplôme de test créé:", diploma);
      console.log("Diplôme JSON:", diploma.toJSON());
      
      // Enregistrer dans Firestore
      const savedDiploma = await diploma.createFirestore();
      
      if (savedDiploma) {
        setTestDiploma(savedDiploma);
        console.log("Diplôme enregistré dans Firestore:", savedDiploma);
        alert(`Diplôme enregistré avec succès dans Firestore!\n\nUID: ${savedDiploma.uid}\nTitre: ${savedDiploma.title}\nCode: ${savedDiploma.code}\nCatégorie: ${savedDiploma.category}\nNiveau: ${savedDiploma.level}\nCours: ${savedDiploma.lessons.map(l => l.name).join(", ")}`);
      } else {
        throw new Error("Échec de l'enregistrement dans Firestore");
      }
    } catch (error) {
      console.error("Erreur lors de la création du diplôme:", error);
      alert("Erreur lors de la création du diplôme: " + error.message);
    } finally {
      setCreatingDiploma(false);
    }
  };

  // Données du diplôme
  const diplomaData = {
    certification: "Certifié INEFOP",
    title: "DIPLÔME",
    subtitle: "PROFESSIONNEL EN BUREAUTIQUE ET OUTILS NUMÉRIQUES",
    school: "",
    issuer: "Dandela Academy",
    recipient: {
      civility: "Monsieur",
      fullName: "Daniel MBENGUI",
      birthDate: "22 février 1989",
      origin: "Vernier / GE",
    },
    completionDate: "25 juin 2015",
    hoursOnline: 120,
    hoursPractical: 40,
    examDuration: "1h30",
    examInfo: "a terminé avec succès sa formation théorique et pratique et réussi avec mention Bien les examens finaux prévus au règlement de Dandela Academy",
    diplomaNumber: "496",
    issueDate: "14 octobre 2015",
    issuePlace: "Luanda",
    legalMention: "Ce diplôme est délivré par Dandela Academy et certifié par l'INEFOP (Institut National de l'Emploi et de la Formation Professionnelle)",
    schoolSuffix: "",
  };

  const handleDownloadPdf = async () => {
    if (!diplomaRef.current) return;
    setExporting(true);
    const ok = await exportDiplomaToPdf(
      diplomaRef.current,
      `diplome-${diplomaData.recipient.fullName.toLowerCase().replace(/\s+/g, "-")}.pdf`
    );
    setExporting(false);
    if (!ok) alert("Impossible de générer le PDF.");
  };

  return (
    <div className={`page ${ebGaramond.variable} ${cinzel.variable}`}>
      <main className="container">
        <header className="header">
          <h1>Diplôme Officiel</h1>
          <p className="muted">Diplôme Professionnel en Bureautique et Outils Numériques</p>
        </header>

        {/* Affichage des leçons disponibles depuis Firebase */}
        <div className="firebase-lessons-info" style={{ marginBottom: "1rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px" }}>
          <h4 style={{ margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Icon icon="ph:books-fill" width={20} height={20} />
            Leçons Firebase ({firebaseLessons.length})
          </h4>
          {loadingLessons ? (
            <p style={{ margin: 0, color: "#666" }}>Chargement des leçons...</p>
          ) : firebaseLessons.length === 0 ? (
            <p style={{ margin: 0, color: "#dc3545" }}>Aucune leçon trouvée dans Firebase</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: "1.5rem", listStyle: "none" }}>
              {firebaseLessons.map((lesson, idx) => (
                <li key={lesson.uid} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <Icon icon="ph:check-circle-fill" width={16} height={16} style={{ color: "#22c55e" }} />
                  <span style={{ fontWeight: 500 }}>{lesson.name || lesson.title || `Leçon ${idx + 1}`}</span>
                  <span style={{ fontSize: "0.75rem", color: "#999" }}>({lesson.uid})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="action-bar">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCreateTestDiploma}
            disabled={creatingDiploma || loadingLessons || firebaseLessons.length === 0}
          >
            <Icon icon="ph:certificate-fill" width={20} height={20} />
            {creatingDiploma ? "Création..." : loadingLessons ? "Chargement..." : "Créer Diplôme Test"}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDownloadPdf}
            disabled={exporting}
          >
            <Icon icon="ph:download-simple" width={20} height={20} />
            {exporting ? "Génération..." : "Télécharger PDF"}
          </button>
        </div>

        {/* Affichage du diplôme de test créé */}
        {testDiploma && (
          <div className="test-diploma-info">
            <h3>Diplôme de test créé</h3>
            <div className="diploma-details">
              <div className="detail-row">
                <span className="label">Code:</span>
                <span className="value">{testDiploma.code}</span>
              </div>
              <div className="detail-row">
                <span className="label">Titre:</span>
                <span className="value">{testDiploma.title}</span>
              </div>
              <div className="detail-row">
                <span className="label">Catégorie:</span>
                <span className="value">{testDiploma.category}</span>
              </div>
              <div className="detail-row">
                <span className="label">Niveau:</span>
                <span className="value">{testDiploma.level}</span>
              </div>
              <div className="detail-row">
                <span className="label">Format:</span>
                <span className="value">{testDiploma.format}</span>
              </div>
              <div className="detail-row">
                <span className="label">Durée en ligne:</span>
                <span className="value">{testDiploma.duration_hours_online}h</span>
              </div>
              <div className="detail-row">
                <span className="label">Durée présentiel:</span>
                <span className="value">{testDiploma.duration_hours_onsite}h</span>
              </div>
              <div className="detail-row">
                <span className="label">Durée examen:</span>
                <span className="value">{testDiploma.exam_duration_minutes} min</span>
              </div>
              <div className="detail-row">
                <span className="label">Seuil réussite:</span>
                <span className="value">{testDiploma.passing_percentage}%</span>
              </div>
              <div className="lessons-section">
                <span className="label">Cours inclus:</span>
                <ul className="lessons-list">
                  {testDiploma.lessons.map((lesson, idx) => (
                    <li key={lesson.uid}>
                      <Icon icon="ph:check-circle-fill" width={16} height={16} />
                      {lesson.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Diplôme - Format paysage A4 (297x210mm = ratio 1.414) */}
        <section className="diploma-wrapper">
          <div className="diploma" ref={diplomaRef}>
            {/* Cadre décoratif */}
            <div className="diploma-border diploma-border-outer" />
            <div className="diploma-border diploma-border-inner" />
            
            {/* Coins décoratifs */}
            <div className="diploma-corner diploma-corner-tl">
              <Icon icon="ph:flower-lotus-fill" width={32} height={32} />
            </div>
            <div className="diploma-corner diploma-corner-tr">
              <Icon icon="ph:flower-lotus-fill" width={32} height={32} />
            </div>
            <div className="diploma-corner diploma-corner-bl">
              <Icon icon="ph:flower-lotus-fill" width={32} height={32} />
            </div>
            <div className="diploma-corner diploma-corner-br">
              <Icon icon="ph:flower-lotus-fill" width={32} height={32} />
            </div>

            {/* Contenu du diplôme */}
            <div className="diploma-content">
              {/* En-tête avec logo Dandela Academy */}
              <div className="diploma-header">
                <div className="diploma-logo">
                  <IconLogoImage width={40} height={40} color="#6b4423" />
                </div>
                <p className="diploma-org">{diplomaData.issuer}</p>
              </div>

              {/* Titre principal */}
              <h1 className="diploma-title">{diplomaData.title}</h1>

              {/* Sous-titre */}
              <h2 className="diploma-subtitle">{diplomaData.subtitle}</h2>
              <p className="certification-text">{diplomaData.certification}</p>

              {/* Corps du diplôme */}
              <div className="diploma-body">
                <p className="diploma-text">
                  {diplomaData.recipient.civility}{" "}
                  <span className="recipient-name">{diplomaData.recipient.fullName}</span>,
                  né le {diplomaData.recipient.birthDate}, originaire de {diplomaData.recipient.origin}
                </p>
                <p className="diploma-text">
                  {diplomaData.examInfo}.
                </p>
                <p className="diploma-text completion-date">
                  le <strong>{diplomaData.completionDate}</strong>
                </p>
                <div className="diploma-hours">
                  <span className="hours-item">
                    <strong>{diplomaData.hoursOnline}</strong> heures de formation en ligne
                  </span>
                  <span className="hours-separator">•</span>
                  <span className="hours-item">
                    <strong>{diplomaData.hoursPractical}</strong> heures de cours pratique
                  </span>
                </div>
                <p className="diploma-exam-duration">
                  Examen d'une durée de <strong>{diplomaData.examDuration}</strong>
                </p>
              </div>

              {/* Mention de délivrance */}
              <p className="diploma-delivery">
                En foi de quoi nous lui délivrons le présent diplôme dont le numéro est <strong>{diplomaData.diplomaNumber}</strong>.
              </p>

              {/* Date et lieu */}
              <p className="diploma-date">{diplomaData.issuePlace}, le {diplomaData.issueDate}</p>

              {/* Signature */}
              <div className="diploma-signatures">
                <div className="signature-block signature-left">
                  <p className="signature-title">Le Directeur</p>
                  {school?.certificat_sign ? (
                    <img src={school.certificat_sign} alt="" className="signature-img" />
                  ) : (
                    <div className="signature-line" />
                  )}
                </div>
              </div>

              {/* Mention légale */}
              <div className="diploma-legal">
                <p>{diplomaData.legalMention}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #e8e8e0;
          padding: 24px 16px 48px;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 1100px;
        }

        .header {
          margin-bottom: 20px;
          text-align: center;
        }

        .header h1 {
          margin: 0 0 6px;
          font-size: 1.6rem;
          font-weight: 700;
          color: #6b4423;
          font-family: var(--font-diploma-title), Georgia, serif;
        }

        .muted {
          margin: 0;
          font-size: 0.9rem;
          color: #8b6b4a;
        }

        .action-bar {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: transform 0.2s;
        }

        .btn:not(:disabled):hover {
          transform: translateY(-2px);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #6b4423;
          color: #fff;
        }

        .btn-secondary {
          background: #3b82f6;
          color: #fff;
        }

        /* Section diplôme de test */
        .test-diploma-info {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .test-diploma-info h3 {
          margin: 0 0 16px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #6b4423;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .diploma-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-row .label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-row .value {
          font-size: 0.95rem;
          color: #333;
          font-weight: 500;
        }

        .lessons-section {
          grid-column: 1 / -1;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #eee;
        }

        .lessons-section .label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #6b4423;
          display: block;
          margin-bottom: 8px;
        }

        .lessons-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 8px;
        }

        .lessons-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #333;
          padding: 8px 12px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .lessons-list li :global(svg) {
          color: #22c55e;
          flex-shrink: 0;
        }

        /* ========== DIPLÔME FORMAT PAYSAGE ========== */
        .diploma-wrapper {
          display: flex;
          justify-content: center;
          overflow-x: auto;
          padding: 10px;
        }

        .diploma {
          position: relative;
          /* Format A4 paysage : 297mm x 210mm = ratio 1.414 */
          width: 842px;
          height: 595px;
          min-width: 842px;
          min-height: 595px;
          background: linear-gradient(135deg, #fffef7 0%, #fdfcf0 50%, #f8f6e8 100%);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          font-family: var(--font-diploma), "EB Garamond", Georgia, serif;
          overflow: hidden;
        }

        /* Bordures */
        .diploma-border {
          position: absolute;
          pointer-events: none;
          box-sizing: border-box;
        }

        .diploma-border-outer {
          top: 12px;
          left: 12px;
          right: 12px;
          bottom: 12px;
          border: 3px solid #6b4423;
        }

        .diploma-border-inner {
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          border: 1px solid #c4a35a;
        }

        /* Coins */
        .diploma-corner {
          position: absolute;
          color: #6b4423;
          z-index: 2;
        }

        .diploma-corner-tl { top: 8px; left: 8px; }
        .diploma-corner-tr { top: 8px; right: 8px; }
        .diploma-corner-bl { bottom: 8px; left: 8px; }
        .diploma-corner-br { bottom: 8px; right: 8px; }

        /* Contenu */
        .diploma-content {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          padding: 20px 48px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
        }

        /* En-tête */
        .diploma-header {
          text-align: center;
          margin-bottom: 4px;
          padding-top: 10px;
        }

        .diploma-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 4px;
        }

        .diploma-org {
          margin: 0 0 4px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b4423;
        }

        .certification-text {
          margin: 0;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b4423;
        }

        /* Titre */
        .diploma-title {
          margin: 6px 0 4px;
          font-size: 40px;
          font-weight: 700;
          font-family: var(--font-diploma-title), Georgia, serif;
          letter-spacing: 0.18em;
          color: #6b4423;
          text-transform: uppercase;
        }

        /* Sous-titre */
        .diploma-subtitle {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #6b4423;
          text-transform: uppercase;
          text-align: center;
        }

        .diploma-school {
          margin: 2px 0 8px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: #6b4423;
          text-transform: uppercase;
        }

        /* Corps */
        .diploma-body {
          text-align: center;
          max-width: 650px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
        }

        .diploma-text {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          color: #6b4423;
        }

        .recipient-name {
          font-size: 20px;
          font-weight: 700;
          color: #6b4423;
          font-family: var(--font-diploma-title), Georgia, serif;
        }

        .completion-date {
          margin-top: 4px;
        }

        .completion-date strong {
          color: #6b4423;
        }

        .diploma-hours {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 8px;
          font-size: 12px;
          color: #6b4423;
        }

        .hours-item strong {
          font-weight: 700;
        }

        .hours-separator {
          color: #c4a35a;
        }

        .diploma-exam-duration {
          margin: 6px 0 0;
          font-size: 12px;
          color: #6b4423;
          text-align: center;
        }

        .diploma-exam-duration strong {
          font-weight: 700;
        }

        /* Délivrance */
        .diploma-delivery {
          margin: 6px 0;
          font-size: 12px;
          font-style: italic;
          color: #6b4423;
          text-align: center;
        }

        .diploma-delivery strong {
          font-style: normal;
          color: #6b4423;
          font-size: 14px;
        }

        /* Date */
        .diploma-date {
          margin: 0 0 6px;
          font-size: 12px;
          color: #6b4423;
          text-align: center;
        }

        /* Signatures */
        .diploma-signatures {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 600px;
          gap: 60px;
        }

        .signature-block {
          flex: 1;
          text-align: center;
        }

        .signature-block.signature-left {
          text-align: left;
        }

        .signature-line {
          width: 100%;
          height: 1px;
          background: #6b4423;
          margin-bottom: 4px;
        }

        .signature-img {
          display: block;
          max-width: 140px;
          max-height: 50px;
          height: auto;
          margin-bottom: 4px;
          object-fit: contain;
        }

        .signature-title {
          margin: 0;
          font-size: 10px;
          color: #6b4423;
          line-height: 1.3;
        }

        .signature-name {
          margin: 2px 0 0;
          font-size: 12px;
          font-weight: 600;
          font-style: italic;
          color: #6b4423;
        }

        /* Mention légale */
        .diploma-legal {
          margin-top: auto;
          padding-top: 6px;
          border-top: 1px solid #ccc;
          width: 100%;
          max-width: 650px;
        }

        .diploma-legal p {
          margin: 0;
          font-size: 8px;
          color: #888;
          text-align: center;
          line-height: 1.3;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .diploma-wrapper {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
