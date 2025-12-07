import { ClassLesson } from "@/classes/ClassLesson";
import { ClassUser } from "@/classes/users/ClassUser";
import React from "react";
import { useTranslation } from "react-i18next";
// Mapping des statuts → label + couleurs



export default function BadgeFormatLesson({ format="", big = false }) {
    const {t} = useTranslation([ClassLesson.NS_COLLECTION]);
    const FORMAT_CONFIG = ClassLesson.FORMAT_CONFIG;
    const cfg = FORMAT_CONFIG[format];

    return (
        <>
            <span className={`badge ${big ? "badge-big" : ""}`}>
                <span className="dot" style={{display:'none'}} />
                {t(cfg?.label)}
            </span>

            <style jsx>{`
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 2px 8px;
            border-radius: 999px;
            border: 1px solid ${cfg?.color};
            border: 1.5px solid ${cfg?.color};
            background-color: ${cfg?.glow};
            color: ${cfg?.color};
            font-size: 0.72rem;
            font-weight: bold;
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