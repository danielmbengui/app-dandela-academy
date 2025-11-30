"use client";
import React from 'react';

import { ClassDevice } from '@/classes/ClassDevice';

// 💻 Computer - Small
export function ComputerIconSmall({ status, extraSmall=false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon">
      <div className="screen" />
      <div className="stand" />
      <div className="base" />

      <style jsx>{`
        .icon {
          width: ${extraSmall ? '' : '42px'};
          height: ${extraSmall ? '25px' : '38px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .screen {
          width: 100%;
          height: 22px;
          border-radius: 8px;
          border: 2px solid #111827;
          background: linear-gradient(
            135deg,
            ${cfg?.badgeBorder}33,
            #020617 65%
          );
          box-shadow: inset 0 0 0 1px #020617, 0 0 10px ${cfg?.glow};
        }

        .stand {
          width: 8px;
          height: 6px;
          margin-top: 2px;
          border-radius: 4px;
          background: #0b1120;
          border: 1px solid #111827;
        }

        .base {
          width: 24px;
          height: 4px;
          margin-top: 2px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #111827;
        }
      `}</style>
    </div>
  );
}
// 💻 Laptop - Small
export function LaptopIconSmall({ status, extraSmall = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon">
      <div className="lid" />
      <div className="body" />
      <div className="shadow" />

      <style jsx>{`
        .icon {
          width: ${extraSmall ? '34px' : '42px'};
          height: ${extraSmall ? '26px' : '32px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .lid {
          width: 90%;
          height: 16px;
          border-radius: 6px;
          border: 2px solid #111827;
          background: linear-gradient(
            135deg,
            ${cfg?.badgeBorder}33,
            #020617 65%
          );
          box-shadow: inset 0 0 0 1px #020617, 0 0 10px ${cfg?.glow};
        }

        .body {
          width: 100%;
          height: 6px;
          margin-top: 2px;
          border-radius: 4px;
          background: #020617;
          border: 1px solid #111827;
        }

        .shadow {
          width: 80%;
          height: 3px;
          margin-top: 2px;
          border-radius: 999px;
          background: #020617;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
// 📱 Mobile - Small
export function MobileIconSmall({ status, extraSmall = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon">
      <div className="phone">
        <div className="screen" />
        <div className="dot" />
      </div>

      <style jsx>{`
        .icon {
          width: ${extraSmall ? '18px' : '24px'};
          height: ${extraSmall ? '28px' : '36px'};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .phone {
          width: 70%;
          height: 90%;
          border-radius: 6px;
          border: 2px solid #111827;
          background: #020617;
          box-shadow: 0 0 8px ${cfg?.glow};
          padding: 2px 1px 3px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .screen {
          width: 100%;
          height: 80%;
          border-radius: 4px;
          background: linear-gradient(
            135deg,
            ${cfg?.badgeBorder}33,
            #020617 65%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }

        .dot {
          width: 3px;
          height: 3px;
          margin-top: 2px;
          border-radius: 999px;
          background: #111827;
        }
      `}</style>
    </div>
  );
}
// 📲 Tablette - Small
export function TabletIconSmall({ status, extraSmall = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon">
      <div className="tablet">
        <div className="screen" />
        <div className="dot" />
      </div>

      <style jsx>{`
        .icon {
          width: ${extraSmall ? '30px' : '36px'};
          height: ${extraSmall ? '32px' : '40px'};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tablet {
          width: 80%;
          height: 90%;
          border-radius: 8px;
          border: 2px solid #111827;
          background: #020617;
          box-shadow: 0 0 10px ${cfg?.glow};
          padding: 3px 3px 4px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .screen {
          width: 100%;
          height: 78%;
          border-radius: 6px;
          background: linear-gradient(
            135deg,
            ${cfg?.badgeBorder}33,
            #020617 65%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }

        .dot {
          width: 4px;
          height: 4px;
          margin-top: 3px;
          border-radius: 999px;
          background: #111827;
        }
      `}</style>
    </div>
  );
}
// ⌚ Montre - Small
export function WatchIconSmall({ status, extraSmall = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon">
      <div className="strap top" />
      <div className="case">
        <div className="screen" />
      </div>
      <div className="strap bottom" />

      <style jsx>{`
        .icon {
          width: ${extraSmall ? '18px' : '24px'};
          height: ${extraSmall ? '30px' : '36px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .strap {
          width: 60%;
          height: 5px;
          background: #020617;
          border-radius: 999px;
          border: 1px solid #111827;
        }

        .case {
          width: 18px;
          height: 18px;
          margin: 2px 0;
          border-radius: 8px;
          background: #020617;
          border: 2px solid #111827;
          box-shadow: 0 0 8px ${cfg?.glow};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .screen {
          width: 80%;
          height: 80%;
          border-radius: 6px;
          background: linear-gradient(
            135deg,
            ${cfg?.badgeBorder}33,
            #020617 65%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }
      `}</style>
    </div>
  );
}
// 📺 TV - Small
export function TvIconSmall({ status, extraSmall = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon">
      <div className="tv">
        <div className="screen" />
      </div>
      <div className="feet">
        <div className="foot" />
        <div className="foot" />
      </div>

      <style jsx>{`
        .icon {
          width: ${extraSmall ? '34px' : '42px'};
          height: ${extraSmall ? '28px' : '34px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .tv {
          width: 100%;
          height: 22px;
          border-radius: 6px;
          background: #020617;
          border: 2px solid #111827;
          padding: 3px 3px;
          box-sizing: border-box;
          box-shadow: 0 0 10px ${cfg?.glow};
        }

        .screen {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(
            135deg,
            ${cfg?.badgeBorder}33,
            #020617 65%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }

        .feet {
          margin-top: 3px;
          width: 60%;
          display: flex;
          justify-content: space-between;
        }

        .foot {
          width: 6px;
          height: 3px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #111827;
        }
      `}</style>
    </div>
  );
}

export function ComputerIconMedium({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-medium">
      <div className="screen" />
      <div className="stand" />
      <div className="base" />

      <style jsx>{`
        .icon-medium {
          width: ${extraLarge ? '80px' : '64px'};
          height: ${extraLarge ? '60px' : '50px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .screen {
          width: 100%;
          height: ${extraLarge ? '36px' : '30px'};
          border-radius: ${extraLarge ? '14px' : '12px'};
          border: 2px solid #111827;
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617, 0 0 ${extraLarge ? '20px' : '16px'} ${cfg?.glow};
        }

        .stand {
          width: ${extraLarge ? '12px' : '10px'};
          height: ${extraLarge ? '9px' : '7px'};
          margin-top: 4px;
          border-radius: 6px;
          background: #020617;
          border: 1px solid #111827;
        }

        .base {
          width: ${extraLarge ? '36px' : '30px'};
          height: ${extraLarge ? '7px' : '5px'};
          margin-top: 3px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #111827;
        }
      `}</style>
    </div>
  );
}
export function LaptopIconMedium({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-medium">
      <div className="lid" />
      <div className="body" />
      <div className="shadow" />

      <style jsx>{`
        .icon-medium {
          width: ${extraLarge ? '80px' : '64px'};
          height: ${extraLarge ? '60px' : '50px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .lid {
          width: 86%;
          height: ${extraLarge ? '30px' : '24px'};
          border-radius: ${extraLarge ? '14px' : '12px'};
          border: 2px solid #111827;
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617, 0 0 ${extraLarge ? '20px' : '16px'} ${cfg?.glow};
        }

        .body {
          width: 100%;
          height: ${extraLarge ? '10px' : '8px'};
          margin-top: 4px;
          border-radius: 8px;
          background: #020617;
          border: 1px solid #111827;
        }

        .shadow {
          width: 70%;
          height: ${extraLarge ? '7px' : '5px'};
          margin-top: 4px;
          border-radius: 999px;
          background: #020617;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
export function MobileIconMedium({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-medium">
      <div className="phone">
        <div className="screen" />
        <div className="bar" />
      </div>

      <style jsx>{`
        .icon-medium {
          width: ${extraLarge ? '52px' : '40px'};
          height: ${extraLarge ? '72px' : '60px'};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .phone {
          width: ${extraLarge ? '30px' : '24px'};
          height: ${extraLarge ? '60px' : '48px'};
          border-radius: ${extraLarge ? '12px' : '10px'};
          border: 2px solid #111827;
          background: #020617;
          box-shadow: 0 0 ${extraLarge ? '20px' : '16px'} ${cfg?.glow};
          padding: ${extraLarge ? '5px 3px 7px' : '4px 3px 6px'};
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .screen {
          width: 100%;
          height: 80%;
          border-radius: ${extraLarge ? '10px' : '8px'};
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }

        .bar {
          width: 40%;
          height: ${extraLarge ? '5px' : '4px'};
          margin-top: ${extraLarge ? '7px' : '5px'};
          border-radius: 999px;
          background: #111827;
        }
      `}</style>
    </div>
  );
}
export function TabletIconMedium({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-medium">
      <div className="tablet">
        <div className="screen" />
        <div className="dot" />
      </div>

      <style jsx>{`
        .icon-medium {
          width: ${extraLarge ? '72px' : '56px'};
          height: ${extraLarge ? '78px' : '64px'};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tablet {
          width: ${extraLarge ? '56px' : '44px'};
          height: ${extraLarge ? '68px' : '56px'};
          border-radius: ${extraLarge ? '18px' : '14px'};
          border: 2px solid #111827;
          background: #020617;
          box-shadow: 0 0 ${extraLarge ? '20px' : '16px'} ${cfg?.glow};
          padding: ${extraLarge ? '7px 7px 9px' : '6px 6px 8px'};
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .screen {
          width: 100%;
          height: 78%;
          border-radius: ${extraLarge ? '14px' : '10px'};
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }

        .dot {
          width: ${extraLarge ? '7px' : '6px'};
          height: ${extraLarge ? '7px' : '6px'};
          margin-top: ${extraLarge ? '7px' : '6px'};
          border-radius: 999px;
          background: #111827;
        }
      `}</style>
    </div>
  );
}
export function WatchIconMedium({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-medium">
      <div className="strap top" />
      <div className="case">
        <div className="screen" />
      </div>
      <div className="strap bottom" />

      <style jsx>{`
        .icon-medium {
          width: ${extraLarge ? '52px' : '40px'};
          height: ${extraLarge ? '72px' : '60px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .strap {
          width: ${extraLarge ? '20px' : '18px'};
          height: ${extraLarge ? '9px' : '8px'};
          background: #020617;
          border-radius: 999px;
          border: 1px solid #111827;
        }

        .case {
          width: ${extraLarge ? '34px' : '28px'};
          height: ${extraLarge ? '34px' : '28px'};
          margin: ${extraLarge ? '7px 0' : '5px 0'};
          border-radius: ${extraLarge ? '16px' : '14px'};
          background: #020617;
          border: 2px solid #111827;
          box-shadow: 0 0 ${extraLarge ? '20px' : '16px'} ${cfg?.glow};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .screen {
          width: 80%;
          height: 80%;
          border-radius: ${extraLarge ? '12px' : '10px'};
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }
      `}</style>
    </div>
  );
}
export function TvIconMedium({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-medium">
      <div className="tv">
        <div className="screen" />
      </div>
      <div className="feet">
        <div className="foot" />
        <div className="foot" />
      </div>

      <style jsx>{`
        .icon-medium {
          width: ${extraLarge ? '80px' : '64px'};
          height: ${extraLarge ? '64px' : '52px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .tv {
          width: 100%;
          height: ${extraLarge ? '40px' : '32px'};
          border-radius: ${extraLarge ? '14px' : '12px'};
          background: #020617;
          border: 2px solid #111827;
          padding: ${extraLarge ? '6px 7px' : '5px 6px'};
          box-sizing: border-box;
          box-shadow: 0 0 ${extraLarge ? '20px' : '16px'} ${cfg?.glow};
        }

        .screen {
          width: 100%;
          height: 100%;
          border-radius: ${extraLarge ? '10px' : '8px'};
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }

        .feet {
          margin-top: ${extraLarge ? '7px' : '6px'};
          width: 70%;
          display: flex;
          justify-content: space-between;
        }

        .foot {
          width: ${extraLarge ? '12px' : '10px'};
          height: ${extraLarge ? '6px' : '5px'};
          border-radius: 999px;
          background: #020617;
          border: 1px solid #111827;
        }
      `}</style>
    </div>
  );
}






// 💻 Computer - Large
export function ComputerIconLarge({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-large">
      <div className="screen" />
      <div className="stand" />
      <div className="base" />

      <style jsx>{`
        .icon-large {
          width: ${extraLarge ? '120px' : '90px'};
          height: ${extraLarge ? '90px' : '70px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .screen {
          width: 100%;
          height: ${extraLarge ? '56px' : '42px'};
          border-radius: ${extraLarge ? '16px' : '12px'};
          border: 2px solid #111827;
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder} 44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617, 0 0 ${extraLarge ? '22px' : '16px'} ${cfg?.glow};
        }

        .stand {
          width: ${extraLarge ? '16px' : '12px'};
          height: ${extraLarge ? '14px' : '10px'};
          margin-top: 4px;
          border-radius: 6px;
          background: #020617;
          border: 1px solid #111827;
        }

        .base {
          width: ${extraLarge ? '52px' : '40px'};
          height: ${extraLarge ? '8px' : '6px'};
          margin-top: 3px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #111827;
          


        }
      `}</style>
    </div>
  );
}
  // 💻 Laptop Large
export function LaptopIconLarge({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-large">
      <div className="lid" />
      <div className="body" />
      <div className="shadow" />

      <style jsx>{`
        .icon-large {
          width: ${extraLarge ? '120px' : '90px'};
          height: ${extraLarge ? '90px' : '70px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .lid {
          width: 86%;
          height: ${extraLarge ? '46px' : '34px'};
          border-radius: ${extraLarge ? '16px' : '12px'};
          border: 2px solid #111827;
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617, 0 0 ${extraLarge ? '22px' : '18px'} ${cfg?.glow};
        }

        .body {
          width: 100%;
          height: ${extraLarge ? '14px' : '10px'};
          margin-top: 4px;
          border-radius: 8px;
          background: #020617;
          border: 1px solid #111827;
        }

        .shadow {
          width: 70%;
          height: ${extraLarge ? '8px' : '6px'};
          margin-top: 4px;
          border-radius: 999px;
          background: #020617;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
// 📱 Mobile Large
export function MobileIconLarge({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-large">
      <div className="phone">
        <div className="screen" />
        <div className="bar" />
      </div>

      <style jsx>{`
        .icon-large {
          width: ${extraLarge ? '80px' : '60px'};
          height: ${extraLarge ? '100px' : '80px'};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .phone {
          width: ${extraLarge ? '40px' : '32px'};
          height: ${extraLarge ? '80px' : '64px'};
          border-radius: ${extraLarge ? '14px' : '10px'};
          border: 2px solid #111827;
          background: #020617;
          box-shadow: 0 0 ${extraLarge ? '22px' : '18px'} ${cfg?.glow};
          padding: ${extraLarge ? '6px 4px 8px' : '4px 3px 6px'};
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .screen {
          width: 100%;
          height: 80%;
          border-radius: ${extraLarge ? '10px' : '8px'};
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }

        .bar {
          width: 40%;
          height: ${extraLarge ? '5px' : '4px'};
          margin-top: ${extraLarge ? '7px' : '5px'};
          border-radius: 999px;
          background: #111827;
        }
      `}</style>
    </div>
  );
}
// 📲 Tablette Large
export function TabletIconLarge({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-large">
      <div className="tablet">
        <div className="screen" />
        <div className="dot" />
      </div>

      <style jsx>{`
        .icon-large {
          width: ${extraLarge ? '100px' : '80px'};
          height: ${extraLarge ? '100px' : '80px'};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tablet {
          width: ${extraLarge ? '72px' : '56px'};
          height: ${extraLarge ? '92px' : '72px'};
          border-radius: ${extraLarge ? '18px' : '14px'};
          border: 2px solid #111827;
          background: #020617;
          box-shadow: 0 0 ${extraLarge ? '22px' : '18px'} ${cfg?.glow};
          padding: ${extraLarge ? '8px 8px 10px' : '6px 6px 8px'};
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .screen {
          width: 100%;
          height: 78%;
          border-radius: ${extraLarge ? '14px' : '10px'};
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }

        .dot {
          width: ${extraLarge ? '8px' : '6px'};
          height: ${extraLarge ? '8px' : '6px'};
          margin-top: ${extraLarge ? '8px' : '6px'};
          border-radius: 999px;
          background: #111827;
        }
      `}</style>
    </div>
  );
}
// ⌚ Montre Large
export function WatchIconLarge({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-large">
      <div className="strap top" />
      <div className="case">
        <div className="screen" />
      </div>
      <div className="strap bottom" />

      <style jsx>{`
        .icon-large {
          width: ${extraLarge ? '76px' : '60px'};
          height: ${extraLarge ? '100px' : '80px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .strap {
          width: ${extraLarge ? '22px' : '16px'};
          height: ${extraLarge ? '12px' : '10px'};
          background: #020617;
          border-radius: 999px;
          border: 1px solid #111827;
        }

        .case {
          width: ${extraLarge ? '44px' : '34px'};
          height: ${extraLarge ? '44px' : '34px'};
          margin: ${extraLarge ? '7px 0' : '5px 0'};
          border-radius: ${extraLarge ? '18px' : '14px'};
          background: #020617;
          border: 2px solid #111827;
          box-shadow: 0 0 ${extraLarge ? '22px' : '18px'} ${cfg?.glow};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .screen {
          width: 80%;
          height: 80%;
          border-radius: ${extraLarge ? '14px' : '10px'};
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }
      `}</style>
    </div>
  );
}
// 📺 TV Large
export function TvIconLarge({ status, extraLarge = false }) {
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-large">
      <div className="tv">
        <div className="screen" />
      </div>
      <div className="feet">
        <div className="foot" />
        <div className="foot" />
      </div>

      <style jsx>{`
        .icon-large {
          width: ${extraLarge ? '120px' : '90px'};
          height: ${extraLarge ? '90px' : '70px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .tv {
          width: 100%;
          height: ${extraLarge ? '56px' : '42px'};
          border-radius: ${extraLarge ? '16px' : '12px'};
          background: #020617;
          border: 2px solid #111827;
          padding: ${extraLarge ? '7px 8px' : '5px 6px'};
          box-sizing: border-box;
          box-shadow: 0 0 ${extraLarge ? '22px' : '18px'} ${cfg?.glow};
        }

        .screen {
          width: 100%;
          height: 100%;
          border-radius: ${extraLarge ? '10px' : '8px'};
          background: radial-gradient(
            circle at top left,
            ${cfg?.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617;
        }

        .feet {
          margin-top: ${extraLarge ? '8px' : '6px'};
          width: 70%;
          display: flex;
          justify-content: space-between;
        }

        .foot {
          width: ${extraLarge ? '14px' : '10px'};
          height: ${extraLarge ? '7px' : '5px'};
          border-radius: 999px;
          background: #020617;
          border: 1px solid #111827;
        }
      `}</style>
    </div>
  );
}