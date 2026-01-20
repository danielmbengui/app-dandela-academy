"use client";

import InstallPwaBanner from "@/components/pwa/InstallPwaBanner";
import { useState } from "react";

const SLIDES = [
  {
    title: "Bienvenue sur Dandela Academy",
    description:
      "Une plateforme moderne pour apprendre, progresser et certifier tes compétences professionnelles.",
    image: "/onboarding/welcome.svg",
  },
  {
    title: "Explore tes cours",
    description:
      "Accède à des cours structurés par niveaux, chapitres et objectifs clairs.",
    image: "/onboarding/courses.svg",
  },
  {
    title: "Suis ta progression",
    description:
      "Visualise tes résultats par chapitre, par cours et globalement avec des statistiques claires.",
    image: "/onboarding/stats.svg",
  },
  {
    title: "Apprends avec des experts",
    description:
      "Chaque cours est animé par des professeurs qualifiés et expérimentés.",
    image: "/onboarding/teachers.svg",
  },
  {
    title: "Obtiens ta certification",
    description:
      "Valide tes compétences avec des certifications reconnues par Dandela Academy.",
    image: "/onboarding/certificate.svg",
  },
];

export default function OnboardingCarousel({ onFinish }) {
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  const next = () => {
    if (!isLast) setIndex((i) => i + 1);
    else onFinish?.();
  };

  const skip = () => {
    onFinish?.();
  };

  return (
    <div className="overlay">
      <InstallPwaBanner />
      <div className="carousel" style={{display:'none'}}>
        {/* Skip */}
        <button className="skip-btn" onClick={skip}>
          Passer
        </button>

        {/* Slide */}
        <div className="slide">
          <div className="image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SLIDES[index].image} alt="" />
          </div>

          <h2>{SLIDES[index].title}</h2>
          <p>{SLIDES[index].description}</p>
        </div>

        {/* Progress */}
        <div className="progress">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="actions">
          <button className="btn ghost" onClick={skip}>
            Ignorer
          </button>
          <button className="btn primary" onClick={next}>
            {isLast ? "Entrer dans l’app" : "Suivant"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 23, 0.92);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .carousel {
          width: 100%;
          max-width: 420px;
          background: radial-gradient(circle at top, #111827, #020617);
          border: 1px solid #1f2937;
          border-radius: 20px;
          padding: 20px 18px 22px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: center;
        }

        .skip-btn {
          position: absolute;
          top: 12px;
          right: 14px;
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .slide {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          animation: fade 0.3s ease;
        }

        @keyframes fade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .image-wrapper {
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-wrapper img {
          max-width: 100%;
          max-height: 100%;
        }

        h2 {
          margin: 0;
          font-size: 1.35rem;
        }

        p {
          margin: 0;
          font-size: 0.9rem;
          color: #cbd5f5;
          line-height: 1.35rem;
        }

        .progress {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 4px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #334155;
        }

        .dot.active {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          width: 18px;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 6px;
        }

        .btn {
          flex: 1;
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .ghost {
          background: transparent;
          border: 1px solid #1f2937;
          color: #e5e7eb;
        }

        .primary {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border: none;
          color: white;
        }
      `}</style>
    </div>
  );
}
