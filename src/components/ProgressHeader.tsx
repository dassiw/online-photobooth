import React from 'react';
import {
  Camera,
  Check,
  Copy,
  Home,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { BoothMode, PartnerState, StepId } from '../types/booth';

const STEPS: { id: StepId; label: string }[] = [
  { id: 'frame', label: 'Frame' },
  { id: 'shoot', label: 'Shoot' },
  { id: 'pick', label: 'Pick' },
  { id: 'style', label: 'Style' },
  { id: 'done', label: 'Done' },
];

interface ProgressHeaderProps {
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
  canAccessStep: (step: StepId) => boolean;
  mode: BoothMode;
  roomCode: string | null;
  partner: PartnerState;
  muted: boolean;
  onToggleMute: () => void;
  onCopyInvite: () => void;
  copiedInvite: boolean;
  onExitToHome: () => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentStep,
  onSelectStep,
  canAccessStep,
  mode,
  roomCode,
  partner,
  muted,
  onToggleMute,
  onCopyInvite,
  copiedInvite,
  onExitToHome,
}) => {
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <header className="sticky top-0 z-30 border-b border-[#EAE3DC] bg-[#FAF9F6]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand */}
        <button
          type="button"
          onClick={onExitToHome}
          className="flex items-center gap-2.5 rounded-full py-1 pr-2 text-left transition hover:opacity-80"
          title="Back to mode selection"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#FDE8EE] text-[#D96B84] shadow-xs ring-1 ring-[#F9C6D5]">
            <Camera className="h-4.5 w-4.5" />
          </span>
          <div className="leading-tight">
            <span className="font-display block text-sm font-bold tracking-tight text-[#2C2627]">
              Purikura
            </span>
            <span className="block text-[11px] font-medium text-[#7A6F72]">
              {mode === 'together' ? 'Together Mode' : 'Remote Split-Screen'}
            </span>
          </div>
        </button>

        {/* Horizontal 5-Step Progress Stepper */}
        <nav
          aria-label="Photobooth steps"
          className="order-3 flex w-full items-center justify-center gap-1 overflow-x-auto pt-1 sm:order-2 sm:w-auto sm:pt-0"
        >
          {STEPS.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isCompleted = idx < currentIdx;
            const accessible = canAccessStep(step.id);

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  disabled={!accessible}
                  onClick={() => accessible && onSelectStep(step.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#D96B84] text-white shadow-sm'
                      : isCompleted
                        ? 'bg-[#FDE8EE] text-[#D96B84] hover:bg-[#FAD6E1]'
                        : accessible
                          ? 'bg-white text-[#2C2627] ring-1 ring-[#EAE3DC] hover:bg-[#F5EFE9]'
                          : 'cursor-not-allowed bg-transparent text-[#B5A9AC]'
                  }`}
                >
                  <span
                    className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : isCompleted
                          ? 'bg-[#D96B84] text-white'
                          : 'bg-[#F3ECE6] text-[#7A6F72]'
                    }`}
                  >
                    {isCompleted ? <Check className="h-2.5 w-2.5" /> : idx + 1}
                  </span>
                  <span>{step.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <span className="hidden h-px w-3 bg-[#E3D9D0] md:block" />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Right Utility Controls */}
        <div className="order-2 flex items-center gap-2 sm:order-3">
          {mode === 'remote' && roomCode && (
            <button
              type="button"
              onClick={onCopyInvite}
              className="flex items-center gap-1.5 rounded-full border border-[#D4E4F7] bg-[#E8F2FC] px-3 py-1.5 text-xs font-semibold text-[#3C76B0] transition hover:bg-[#DCEBFA]"
              title="Copy shareable invite link"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  partner.connected ? 'bg-emerald-500' : 'animate-pulse bg-[#5B9BD5]'
                }`}
              />
              <Users className="h-3.5 w-3.5" />
              <span className="hidden md:inline">
                {partner.connected ? partner.name : `Room ${roomCode}`}
              </span>
              <Copy className="h-3 w-3 opacity-75" />
              {copiedInvite && (
                <span className="ml-0.5 text-[10px] font-bold text-[#D96B84]">
                  Copied!
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
            title={muted ? 'Unmute shutter sounds' : 'Mute shutter sounds'}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[#EAE3DC] bg-white text-[#7A6F72] transition hover:bg-[#F5EFE9] hover:text-[#2C2627]"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onExitToHome}
            title="Mode & room settings"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[#EAE3DC] bg-white text-[#7A6F72] transition hover:bg-[#F5EFE9] hover:text-[#2C2627]"
          >
            <Home className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
