import React from 'react';
import { ArrowLeft, ArrowRight, Check, Wand2 } from 'lucide-react';
import { FRAME_LAYOUTS } from '../data/frames';
import type { CapturedShot, FrameLayoutId } from '../types/booth';

interface PickStepProps {
  shots: (CapturedShot | null)[];
  layoutId: FrameLayoutId;
  selectedSlotIndices: number[];
  onToggleSlotSelection: (slotIndex: number) => void;
  onAutoPick: () => void;
  onBackToShoot: () => void;
  onProceedToStyle: () => void;
}

export const PickStep: React.FC<PickStepProps> = ({
  shots,
  layoutId,
  selectedSlotIndices,
  onToggleSlotSelection,
  onAutoPick,
  onBackToShoot,
  onProceedToStyle,
}) => {
  const layout = FRAME_LAYOUTS[layoutId];
  const needCount = layout.pickCount;

  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-[#FDE8EE] px-3 py-1 text-xs font-bold text-[#D96B84]">
            Step 3 of 5
          </span>
          <h1 className="font-display mt-2 text-2xl font-bold text-[#2C2627] sm:text-3xl">
            Pick {needCount} favorite shots
          </h1>
          <p className="mt-1 text-sm text-[#7A6F72]">
            Tap photos in the order you want them placed on your {layout.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAutoPick}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3DC] bg-white px-4 py-2 text-xs font-bold text-[#2C2627] transition hover:bg-[#FAF9F6]"
          >
            <Wand2 className="h-3.5 w-3.5 text-[#D96B84]" />
            <span>Auto-Pick</span>
          </button>
          <button
            type="button"
            onClick={onBackToShoot}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3DC] bg-white px-4 py-2 text-xs font-bold text-[#7A6F72] transition hover:text-[#2C2627]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retake Shots</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.75fr]">
        {/* Left: Captured Shots 3x2 Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {shots.map((shot, idx) => {
            const pickOrder = selectedSlotIndices.indexOf(idx);
            const isPicked = pickOrder !== -1;

            return (
              <button
                key={idx}
                type="button"
                disabled={!shot}
                onClick={() => shot && onToggleSlotSelection(idx)}
                className={`group relative aspect-[4/3] overflow-hidden rounded-2xl border-2 bg-white transition ${
                  !shot
                    ? 'cursor-not-allowed border-dashed border-[#DFD5CC] opacity-55'
                    : isPicked
                      ? 'border-[#D96B84] shadow-md ring-4 ring-[#FDE8EE]'
                      : 'border-[#EAE3DC] hover:border-[#D96B84]/60'
                }`}
              >
                {shot ? (
                  <img
                    src={shot.dataUrl}
                    alt={`Captured shot ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-semibold text-[#A5999C]">
                    Shot {idx + 1} empty
                  </div>
                )}

                <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#2C2627]">
                  #{idx + 1}
                </span>

                {isPicked && (
                  <span className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#D96B84] text-xs font-extrabold text-white shadow-sm">
                    {pickOrder + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Live Mini-Strip Arrangement Preview */}
        <div className="flex flex-col justify-between rounded-3xl border border-[#EAE3DC] bg-white p-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-[#2C2627]">
                {layout.name}
              </h2>
              <span className="rounded-full bg-[#FDE8EE] px-2.5 py-0.5 text-xs font-bold text-[#D96B84]">
                {selectedSlotIndices.length}/{needCount} picked
              </span>
            </div>

            <div className="mt-4 flex justify-center rounded-2xl bg-[#FAF9F6] p-4">
              <div
                className={`grid gap-2 rounded-2xl border border-[#EAE3DC] bg-white p-3 shadow-xs ${
                  layout.cols === 2 ? 'w-56 grid-cols-2' : 'w-36 grid-cols-1'
                }`}
              >
                {Array.from({ length: needCount }).map((_, pos) => {
                  const slotIdx = selectedSlotIndices[pos];
                  const pickedShot = slotIdx !== undefined ? shots[slotIdx] : null;
                  return (
                    <div
                      key={pos}
                      className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-[#F5EFE9]"
                    >
                      {pickedShot ? (
                        <img
                          src={pickedShot.dataUrl}
                          alt={`Slot ${pos + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[11px] font-bold text-[#B5A9AC]">
                          {pos + 1}
                        </span>
                      )}
                    </div>
                  );
                })}
                <div
                  className={`pt-1 text-center text-[9px] font-bold text-[#8B7E81] ${
                    layout.cols === 2 ? 'col-span-2' : ''
                  }`}
                >
                  PURIKURA STUDIO
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={selectedSlotIndices.length === 0}
            onClick={onProceedToStyle}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D96B84] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#C95C75] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Check className="h-4 w-4" />
            <span>Style Your Strip</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
