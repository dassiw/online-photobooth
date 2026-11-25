import React from 'react';
import type { PartnerState } from '../types/booth';

interface MultiplayerCursorProps {
  partner: PartnerState;
}

export const MultiplayerCursor: React.FC<MultiplayerCursorProps> = ({ partner }) => {
  if (!partner.connected || !partner.cursor) return null;

  const leftPct = Math.min(96, Math.max(2, partner.cursor.x * 100));
  const topPct = Math.min(94, Math.max(2, partner.cursor.y * 100));

  return (
    <div
      className="pointer-events-none fixed z-50 transition-all duration-75 ease-out"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
      }}
      aria-hidden="true"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className="-translate-x-1 -translate-y-1 drop-shadow-sm"
      >
        <path
          d="M4 3L20 11L13 13.5L10.5 20.5L4 3Z"
          fill="#5B9BD5"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <div className="ml-3 -mt-1 inline-flex items-center gap-1 rounded-full bg-[#5B9BD5] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md ring-2 ring-white">
        <span>{partner.name}</span>
        {partner.isGroup && (
          <span className="rounded-full bg-white/25 px-1.5 text-[9px]">
            +friends
          </span>
        )}
      </div>
    </div>
  );
};
