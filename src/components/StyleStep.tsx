import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  LayoutTemplate,
  Palette,
  RotateCw,
  SlidersHorizontal,
  Sparkles,
  Sticker,
  Trash2,
  Type,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { CANVA_TEMPLATES } from '../data/canvaTemplates';
import {
  FRAME_THEMES,
  PHOTO_FILTERS,
  STICKERS,
  stickerToDataUri,
} from '../data/frames';
import type {
  CanvaOverlayGridId,
  CaptionFontId,
  CapturedShot,
  FrameLayoutId,
  PlacedSticker,
  StripStyleConfig,
} from '../types/booth';
import { getStripDimensions, renderPhotoStrip } from '../utils/canvas';

interface StyleStepProps {
  shots: CapturedShot[];
  layoutId: FrameLayoutId;
  style: StripStyleConfig;
  onChangeStyle: (updater: (prev: StripStyleConfig) => StripStyleConfig) => void;
  onFinish: () => void;
}

type StyleTab = 'canva' | 'frame' | 'filter' | 'stickers' | 'caption';

const CANVA_GRID_OPTIONS: { id: CanvaOverlayGridId; label: string }[] = [
  { id: 'strip-4', label: '4-Cut Strip' },
  { id: 'stack-3', label: '3-Cut Stack' },
  { id: 'grid-2x2', label: '2×2 Grid' },
  { id: 'pair-2', label: '2-Cut Pair' },
];

export const StyleStep: React.FC<StyleStepProps> = ({
  shots,
  layoutId,
  style,
  onChangeStyle,
  onFinish,
}) => {
  const [activeTab, setActiveTab] = useState<StyleTab>(
    style.canvaTemplateId ? 'canva' : 'frame',
  );
  const [selectedStickerUid, setSelectedStickerUid] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const draggingUidRef = useRef<string | null>(null);

  const dims = getStripDimensions(layoutId, style);
  const isWidePreview = dims.width / dims.height >= 0.68;

  // Re-render canvas preview whenever strip inputs change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderPhotoStrip(canvas, shots, layoutId, style);
  }, [shots, layoutId, style]);

  const addSticker = (stickerId: string) => {
    const uid = `stk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newSticker: PlacedSticker = {
      uid,
      stickerId,
      x: 0.25 + Math.random() * 0.5,
      y: 0.18 + Math.random() * 0.62,
      scale: 1,
      rotation: Math.round((Math.random() - 0.5) * 18),
    };
    onChangeStyle((prev) => ({
      ...prev,
      stickers: [...prev.stickers, newSticker],
    }));
    setSelectedStickerUid(uid);
  };

  const updateSelectedSticker = (patch: Partial<PlacedSticker>) => {
    if (!selectedStickerUid) return;
    onChangeStyle((prev) => ({
      ...prev,
      stickers: prev.stickers.map((s) =>
        s.uid === selectedStickerUid ? { ...s, ...patch } : s,
      ),
    }));
  };

  const removeSelectedSticker = () => {
    if (!selectedStickerUid) return;
    onChangeStyle((prev) => ({
      ...prev,
      stickers: prev.stickers.filter((s) => s.uid !== selectedStickerUid),
    }));
    setSelectedStickerUid(null);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const uid = draggingUidRef.current;
    const box = previewContainerRef.current;
    if (!uid || !box) return;
    const rect = box.getBoundingClientRect();
    const nx = Math.min(0.95, Math.max(0.05, (e.clientX - rect.left) / rect.width));
    const ny = Math.min(0.95, Math.max(0.05, (e.clientY - rect.top) / rect.height));
    onChangeStyle((prev) => ({
      ...prev,
      stickers: prev.stickers.map((s) =>
        s.uid === uid ? { ...s, x: nx, y: ny } : s,
      ),
    }));
  };

  const selectedSticker =
    style.stickers.find((s) => s.uid === selectedStickerUid) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-[#FDE8EE] px-3 py-1 text-xs font-bold text-[#D96B84]">
            Step 4 of 5
          </span>
          <h1 className="font-display mt-2 text-2xl font-bold text-[#2C2627] sm:text-3xl">
            Decorate your photo strip
          </h1>
          <p className="mt-1 text-sm text-[#7A6F72]">
            Try any of the 24 Canva templates or classic pastel frames, add filters &amp;
            stickers, and drag stickers directly on the strip.
          </p>
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#D96B84] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#C95C75]"
        >
          <span>Finish &amp; Export</span>
          <ArrowRight className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left: Interactive Canvas Preview + Sticker Drag Layer */}
        <div className="flex flex-col items-center rounded-3xl border border-[#EAE3DC] bg-white p-5 shadow-sm">
          <div
            ref={previewContainerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={() => {
              draggingUidRef.current = null;
            }}
            onPointerLeave={() => {
              draggingUidRef.current = null;
            }}
            className="relative overflow-hidden rounded-2xl shadow-lg select-none"
            style={{
              width: isWidePreview ? 'min(100%, 370px)' : 'min(100%, 275px)',
              aspectRatio: `${dims.width} / ${dims.height}`,
            }}
          >
            <canvas ref={canvasRef} className="block h-full w-full" />

            {/* Invisible interactive drag handles over placed stickers */}
            {style.stickers.map((stk) => {
              const def = STICKERS.find((d) => d.id === stk.stickerId);
              if (!def) return null;
              const isSelected = stk.uid === selectedStickerUid;
              const widthPct = 17 * stk.scale;

              return (
                <button
                  key={stk.uid}
                  type="button"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    draggingUidRef.current = stk.uid;
                    setSelectedStickerUid(stk.uid);
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                  }}
                  style={{
                    left: `${stk.x * 100}%`,
                    top: `${stk.y * 100}%`,
                    width: `${widthPct}%`,
                    aspectRatio: `${def.aspect}`,
                    transform: `translate(-50%, -50%) rotate(${stk.rotation}deg)`,
                  }}
                  className={`absolute cursor-grab touch-none rounded-lg transition-shadow active:cursor-grabbing ${
                    isSelected
                      ? 'ring-2 ring-[#D96B84] ring-offset-2'
                      : 'hover:ring-2 hover:ring-[#5B9BD5]/70'
                  }`}
                  title="Drag to move sticker"
                >
                  <span className="sr-only">{def.label}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Sticker Quick Controls */}
          {selectedSticker && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-[#EAE3DC] bg-[#FAF9F6] px-3 py-2 text-xs font-bold">
              <span className="text-[#7A6F72]">Selected sticker:</span>
              <button
                type="button"
                onClick={() =>
                  updateSelectedSticker({
                    scale: Math.min(1.9, +(selectedSticker.scale + 0.15).toFixed(2)),
                  })
                }
                className="rounded-lg bg-white p-1.5 text-[#2C2627] ring-1 ring-[#EAE3DC] hover:text-[#D96B84]"
                title="Make bigger"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  updateSelectedSticker({
                    scale: Math.max(0.55, +(selectedSticker.scale - 0.15).toFixed(2)),
                  })
                }
                className="rounded-lg bg-white p-1.5 text-[#2C2627] ring-1 ring-[#EAE3DC] hover:text-[#D96B84]"
                title="Make smaller"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  updateSelectedSticker({
                    rotation: (selectedSticker.rotation + 15) % 360,
                  })
                }
                className="rounded-lg bg-white p-1.5 text-[#2C2627] ring-1 ring-[#EAE3DC] hover:text-[#D96B84]"
                title="Rotate"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={removeSelectedSticker}
                className="rounded-lg bg-[#FDE8EE] p-1.5 text-[#D96B84] hover:bg-[#FAD6E1]"
                title="Delete sticker"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Style Editor Tabs */}
        <div className="rounded-3xl border border-[#EAE3DC] bg-white p-5 shadow-sm">
          {/* Tab Buttons */}
          <div className="grid grid-cols-5 gap-1.5 rounded-2xl bg-[#FAF9F6] p-1.5">
            {(
              [
                { id: 'canva', label: 'Canva (24)', icon: LayoutTemplate },
                { id: 'frame', label: 'Frame', icon: Palette },
                { id: 'filter', label: 'Filter', icon: SlidersHorizontal },
                { id: 'stickers', label: 'Stickers', icon: Sticker },
                { id: 'caption', label: 'Caption', icon: Type },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center justify-center gap-1 rounded-xl px-1.5 py-2.5 text-[11px] font-bold transition sm:text-xs ${
                  activeTab === id
                    ? 'bg-white text-[#D96B84] shadow-xs'
                    : 'text-[#7A6F72] hover:text-[#2C2627]'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          <div className="mt-5">
            {activeTab === 'canva' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-sm font-bold text-[#2C2627]">
                    Canva Photo Booth Templates ({CANVA_TEMPLATES.length})
                  </h2>
                  {style.canvaTemplateId && (
                    <button
                      type="button"
                      onClick={() =>
                        onChangeStyle((prev) => ({ ...prev, canvaTemplateId: null }))
                      }
                      className="rounded-full bg-[#FDE8EE] px-3 py-1 text-[11px] font-bold text-[#D96B84] hover:bg-[#FAD6E1]"
                    >
                      Use Classic Frame Instead
                    </button>
                  )}
                </div>

                {style.canvaTemplateId && (
                  <div className="space-y-3 rounded-2xl border border-[#EAE3DC] bg-[#FAF9F6] p-3.5">
                    <div>
                      <span className="block text-[11px] font-bold text-[#7A6F72]">
                        Photo Arrangement on Template
                      </span>
                      <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                        {CANVA_GRID_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              onChangeStyle((prev) => ({ ...prev, canvaGrid: opt.id }))
                            }
                            className={`rounded-xl py-1.5 text-[11px] font-bold transition ${
                              style.canvaGrid === opt.id
                                ? 'bg-[#5B9BD5] text-white'
                                : 'bg-white text-[#7A6F72] ring-1 ring-[#EAE3DC] hover:text-[#2C2627]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-bold text-[#7A6F72]">
                        Template Frame Border
                      </span>
                      <input
                        type="range"
                        min={0.05}
                        max={0.18}
                        step={0.01}
                        value={style.canvaInset}
                        onChange={(e) =>
                          onChangeStyle((prev) => ({
                            ...prev,
                            canvaInset: parseFloat(e.target.value),
                          }))
                        }
                        className="w-40 accent-[#5B9BD5]"
                      />
                    </div>
                  </div>
                )}

                <div className="grid max-h-[360px] grid-cols-3 gap-2.5 overflow-y-auto pr-1">
                  {CANVA_TEMPLATES.map((tpl) => {
                    const active = style.canvaTemplateId === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() =>
                          onChangeStyle((prev) => ({
                            ...prev,
                            canvaTemplateId: tpl.id,
                            canvaGrid: tpl.defaultGrid,
                          }))
                        }
                        className={`flex flex-col rounded-2xl border p-2 text-left transition ${
                          active
                            ? 'border-[#5B9BD5] bg-[#E8F2FC]/55 ring-2 ring-[#5B9BD5]/25'
                            : 'border-[#EAE3DC] bg-[#FAF9F6] hover:border-[#5B9BD5]/60'
                        }`}
                      >
                        <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                          <img
                            src={tpl.imageUrl}
                            alt={tpl.title}
                            loading="lazy"
                            className="max-h-full max-w-full rounded-md object-contain"
                          />
                        </div>
                        <span className="mt-1.5 line-clamp-2 text-[10px] leading-tight font-bold text-[#2C2627]">
                          {tpl.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'frame' && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-sm font-bold text-[#2C2627]">
                    Classic Pastel Frames
                  </h2>
                  {style.canvaTemplateId && (
                    <span className="text-[11px] font-medium text-[#7A6F72]">
                      Picking a color switches off Canva template
                    </span>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {FRAME_THEMES.map((theme) => {
                    const active = !style.canvaTemplateId && style.theme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() =>
                          onChangeStyle((prev) => ({
                            ...prev,
                            canvaTemplateId: null,
                            theme: theme.id,
                          }))
                        }
                        className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition ${
                          active
                            ? 'border-[#D96B84] bg-[#FDE8EE]/45 ring-2 ring-[#D96B84]/20'
                            : 'border-[#EAE3DC] bg-[#FAF9F6] hover:border-[#D96B84]/50'
                        }`}
                      >
                        <span
                          className="h-7 w-7 shrink-0 rounded-full border border-black/10 shadow-2xs"
                          style={{
                            backgroundColor: theme.swatch,
                            backgroundImage:
                              theme.pattern === 'gingham-pink'
                                ? 'repeating-linear-gradient(45deg, rgba(217,107,132,0.25) 0 4px, transparent 4px 8px)'
                                : theme.pattern === 'polka-blue'
                                  ? 'radial-gradient(rgba(91,155,213,0.45) 2px, transparent 2px)'
                                  : undefined,
                            backgroundSize:
                              theme.pattern === 'polka-blue' ? '8px 8px' : undefined,
                          }}
                        />
                        <span className="text-xs font-bold text-[#2C2627]">
                          {theme.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'filter' && (
              <div>
                <h2 className="font-display text-sm font-bold text-[#2C2627]">
                  Photo Filter
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {PHOTO_FILTERS.map((filter) => {
                    const active = style.filter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() =>
                          onChangeStyle((prev) => ({ ...prev, filter: filter.id }))
                        }
                        className={`flex flex-col items-center rounded-2xl border p-3 transition ${
                          active
                            ? 'border-[#D96B84] bg-[#FDE8EE]/45 ring-2 ring-[#D96B84]/20'
                            : 'border-[#EAE3DC] bg-[#FAF9F6] hover:border-[#D96B84]/50'
                        }`}
                      >
                        <div
                          className="h-14 w-full overflow-hidden rounded-xl border border-black/5"
                          style={{ background: filter.previewBg }}
                        >
                          {shots[0] && (
                            <img
                              src={shots[0].dataUrl}
                              alt={filter.name}
                              className="h-full w-full object-cover"
                              style={{ filter: filter.cssFilter }}
                            />
                          )}
                        </div>
                        <span className="mt-2 text-xs font-bold text-[#2C2627]">
                          {filter.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'stickers' && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-sm font-bold text-[#2C2627]">
                    Tap to Add Stickers
                  </h2>
                  {style.stickers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onChangeStyle((prev) => ({ ...prev, stickers: [] }));
                        setSelectedStickerUid(null);
                      }}
                      className="text-xs font-bold text-[#D96B84] hover:underline"
                    >
                      Clear all ({style.stickers.length})
                    </button>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2.5 sm:grid-cols-5">
                  {STICKERS.map((sticker) => (
                    <button
                      key={sticker.id}
                      type="button"
                      onClick={() => addSticker(sticker.id)}
                      className="flex flex-col items-center justify-center rounded-2xl border border-[#EAE3DC] bg-[#FAF9F6] p-2.5 transition hover:-translate-y-0.5 hover:border-[#D96B84] hover:bg-[#FDE8EE]/50"
                    >
                      <img
                        src={stickerToDataUri(sticker)}
                        alt={sticker.label}
                        className="h-11 w-11 object-contain"
                      />
                      <span className="mt-1 truncate text-[10px] font-bold text-[#7A6F72]">
                        {sticker.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'caption' && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="strip-caption"
                    className="font-display block text-sm font-bold text-[#2C2627]"
                  >
                    Bottom Strip Caption
                  </label>
                  <input
                    id="strip-caption"
                    type="text"
                    maxLength={36}
                    value={style.caption}
                    onChange={(e) =>
                      onChangeStyle((prev) => ({ ...prev, caption: e.target.value }))
                    }
                    placeholder="sunday memories ♡"
                    className="mt-2 w-full rounded-xl border border-[#EAE3DC] bg-[#FAF9F6] px-4 py-2.5 text-sm font-semibold text-[#2C2627] outline-none focus:border-[#D96B84] focus:bg-white"
                  />
                </div>

                <div>
                  <span className="block text-xs font-bold text-[#7A6F72]">
                    Caption Font
                  </span>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'hand', label: 'Handwritten', cls: 'font-hand text-lg' },
                        { id: 'sans', label: 'Cute Sans', cls: 'font-display text-xs' },
                        { id: 'mono', label: 'Film Mono', cls: 'font-mono-booth text-xs' },
                      ] as { id: CaptionFontId; label: string; cls: string }[]
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() =>
                          onChangeStyle((prev) => ({ ...prev, captionFont: f.id }))
                        }
                        className={`rounded-xl border py-2 font-bold transition ${
                          style.captionFont === f.id
                            ? 'border-[#D96B84] bg-[#FDE8EE] text-[#D96B84]'
                            : 'border-[#EAE3DC] bg-[#FAF9F6] text-[#2C2627]'
                        } ${f.cls}`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      onChangeStyle((prev) => ({ ...prev, showDate: !prev.showDate }))
                    }
                    className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-bold transition ${
                      style.showDate
                        ? 'border-[#D96B84] bg-[#FDE8EE]/50 text-[#D96B84]'
                        : 'border-[#EAE3DC] bg-[#FAF9F6] text-[#7A6F72]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Date Stamp</span>
                    </span>
                    <span>{style.showDate ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onChangeStyle((prev) => ({
                        ...prev,
                        showBrandStamp: !prev.showBrandStamp,
                      }))
                    }
                    className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-bold transition ${
                      style.showBrandStamp
                        ? 'border-[#5B9BD5] bg-[#E8F2FC] text-[#3C76B0]'
                        : 'border-[#EAE3DC] bg-[#FAF9F6] text-[#7A6F72]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Studio Stamp</span>
                    </span>
                    <span>{style.showBrandStamp ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
