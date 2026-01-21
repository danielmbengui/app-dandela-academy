"use client";
import { useState } from "react";

const MOCK_MESSAGES = [
  {
    id: "msg_1",
    from: "Dandela Academy",
    type: "school",
    subject: "Bienvenue sur la plateforme 🎉",
    preview: "Nous sommes ravis de t’accueillir sur Dandela Academy...",
    date: "2025-03-02",
    isRead: false,
  },
  {
    id: "msg_2",
    from: "Support",
    type: "support",
    subject: "Ticket #45812 – Résolu",
    preview: "Ton problème a été résolu. N’hésite pas à revenir vers nous.",
    date: "2025-02-27",
    isRead: true,
  },
  {
    id: "msg_3",
    from: "Marie Kaya",
    type: "teacher",
    subject: "Infos sur le prochain cours",
    preview: "Pour la prochaine session, pense à préparer...",
    date: "2025-02-25",
    isRead: false,
  },
];

const FILTERS = [
  { id: "all", label: "Tous" },
  { id: "unread", label: "Non lus" },
  { id: "school", label: "École" },
  { id: "teacher", label: "Professeurs" },
  { id: "support", label: "Support" },
];

export default function MessagesPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredMessages = MOCK_MESSAGES.filter((msg) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !msg.isRead;
    return msg.type === activeFilter;
  });

  return (
    <div className="page">
      <main className="container">
        {/* HEADER */}
        <header className="header">
          <h1>Messagerie</h1>
          <p className="subtitle">
            Communications de l’école, professeurs et support
          </p>
        </header>

        {/* FILTRES */}
        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`filter-btn ${activeFilter === f.id ? "active" : ""}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* LISTE */}
        <section className="messages">
          {filteredMessages.length === 0 && (
            <p className="empty">Aucun message à afficher</p>
          )}

          {filteredMessages.map((msg) => (
            <article
              key={msg.id}
              className={`message-card ${!msg.isRead ? "unread" : ""}`}
            >
              <div className="left">
                <span className={`dot ${msg.type}`} />
              </div>

              <div className="content">
                <div className="top">
                  <p className="from">{msg.from}</p>
                  <span className="date">{formatDate(msg.date)}</span>
                </div>

                <p className="subject">{msg.subject}</p>
                <p className="preview">{msg.preview}</p>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* STYLES */}
      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 24px 16px;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .header h1 {
          margin: 0;
          font-size: 1.6rem;
        }

        .subtitle {
          margin: 4px 0 0;
          font-size: 0.9rem;
          color: #64748b;
        }

        .filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: white;
          border-color: transparent;
        }

        .messages {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .message-card {
          display: flex;
          gap: 10px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: white;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .message-card:hover {
          background: #f1f5f9;
        }

        .message-card.unread {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .left {
          display: flex;
          align-items: flex-start;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          margin-top: 6px;
        }

        .dot.school {
          background: #2563eb;
        }

        .dot.teacher {
          background: #22c55e;
        }

        .dot.support {
          background: #f59e0b;
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }

        .from {
          margin: 0;
          font-weight: 500;
          font-size: 0.85rem;
        }

        .date {
          font-size: 0.75rem;
          color: #64748b;
        }

        .subject {
          margin: 0;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .preview {
          margin: 0;
          font-size: 0.82rem;
          color: #475569;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .empty {
          font-size: 0.9rem;
          color: #64748b;
          text-align: center;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}

function formatDate(date) {
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}
