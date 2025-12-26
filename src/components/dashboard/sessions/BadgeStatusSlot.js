import { ClassLesson } from "@/classes/ClassLesson";
import { ClassSession, ClassSessionSlot } from "@/classes/ClassSession";
import React from "react";
import { useTranslation } from "react-i18next";
// Mapping des statuts → label + couleurs

export default function BadgeStatusSlot({ status="", big = false }) {
    const {t} = useTranslation([ClassSession.NS_COLLECTION]);
    const STATUS_CONFIG = ClassSessionSlot.STATUS_CONFIG;
    const cfg = STATUS_CONFIG[status]; 
    return (
        <>
            <span className={`badge ${big ? "badge-big" : ""}`}>
              <span className="dot" />
                {t(cfg?.label)}
            </span>

            <style jsx>{`
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 2px 8px;
            border-radius: 999px;
            border: 0.1px solid ${cfg?.color};
            background-color: ${cfg?.glow};
            color: ${cfg?.color};
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
            background: ${cfg?.color};
            box-shadow: 0 0 8px ${cfg?.glow};
          }
        `}</style>
        </>
    );
}