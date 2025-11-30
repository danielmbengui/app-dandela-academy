import { ClassUser } from "@/classes/users/ClassUser";
import React from "react";
import { useTranslation } from "react-i18next";
// Mapping des statuts → label + couleurs



export default function BadgeStatusUser({ status, big = false }) {
    const {t} = useTranslation([ClassUser.NS_COLLECTION]);
    const STATUS_CONFIG = {
        online: {
            label: t('online'), 
            color: "#022c22",
            badgeBg: "#022c22",
            badgeBorder: "#16a34a",
            badgeText: "#bbf7d0",
            glow: "#22c55e55",
        },
        offline: { 
            label: t('offline'),
            color: "#111827",
            badgeBg: "#111827",
            badgeBorder: "#6b7280",
            badgeText: "#e5e7eb",
            glow: "#6b728055",
         },
        disconnected: { label: "Hors ligne", color: "#6b7280" },
        away: { 
            label: t('away'),
            color: "#eab308",
            badgeBg: "#422006",
            badgeBorder: "#eab308",
            badgeText: "#fed7aa",
            glow: "#f9731655",
        },
        ['must-activate']: { 
            label: t('must-activate'), 
            color: `#111827`,
            badgeBg: "#111827",
            badgeBorder: "rgb(255,0,0)",
            badgeText: "rgba(253, 214, 214, 1)",
            glow: "rgba(255,0,0,0.3)",
        },
    };
    const cfg = STATUS_CONFIG[status];

    return (
        <>
            <span className={`badge ${big ? "badge-big" : ""}`}>
                <span className="dot" />
                {cfg?.label}
            </span>

            <style jsx>{`
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 2px 8px;
            border-radius: 999px;
            border: 1px solid ${cfg?.badgeBorder};
            font-size: 0.72rem;
            white-space: nowrap;
          }
  
          .badge-big {
            margin-top: 6px;
            font-size: 0.8rem;
            padding: 3px 10px;
          }
  
          .dot {
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: ${cfg?.badgeBorder};
            box-shadow: 0 0 8px ${cfg?.glow};
          }
        `}</style>
        </>
    );
}