import React from "react";
import { ClassUser } from "@/classes/users/ClassUser";
import { useTranslation } from "react-i18next";
import { NS_ROLES } from "@/contexts/i18n/settings";
// Mapping des statuts → label + couleurs

export default function BadgeRoleUser({ role, big = false }) {
  const { t } = useTranslation([NS_ROLES]);
  const ROLE_CONFIG = ClassUser.ROLE_CONFIG || [];
  const cfg = ROLE_CONFIG[role];

  return (
    <>
      <span className={`badge ${big ? "badge-big" : ""}`}>
        <span className="dot" />
        {t(role)}
      </span>

      <style jsx>{`
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 2px 8px;
            border-radius: 999px;
            border: 0.1px solid ${cfg?.badgeBorder};
            font-size: 0.75rem;
            white-space: nowrap;
            color: ${cfg?.badgeText};
            background: ${cfg?.badgeBg};
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
            background: ${cfg?.badgeBg};
            display: none;
          }
        `}</style>
    </>
  );
}