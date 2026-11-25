import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Film,
  Link2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { CANVA_TEMPLATES } from '../data/canvaTemplates';
import type {
  CapturedShot,
  FrameLayoutId,
  StripStyleConfig,
} from '../types/booth';
import {
  copyStripToClipboard,
  exportStripGif,
  exportStripPng,
  getStripDimensions,
  renderPhotoStrip,
} from '../utils/canvas';

interface DoneStepProps {
  shots: CapturedShot[];
  layoutId: FrameLayoutId;
  style: StripStyleConfig;
  roomCode: string | null;
  onBackToStyle: () => void;
  onStartNewSession: () => void;
}

export const DoneStep: React.FC<DoneStepProps> = ({
  shots,
  layoutId,
  style,
  roomCode,
  onBackToStyle,
  onStartNewSession,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [exportingPng, setExportingPng] = useState(false);
  const [exportingGif, setExportingGif] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const dims = getStripDimensions(layoutId, style);
  const activeCanvaTemplate = style.canvaTemplateId
    ? CANVA_TEMPLATES.find((t) => t.id === style.canvaTemplateId) ?? null
    : null;
  const isWidePreview = dims.width / dims.height >= 0.68;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderPhotoStrip(canvas, shots, layoutId, style);
  }, [shots, layoutId, style]);

  const handleDownloadPng = async () => {
    setExportingPng(true);
    try {
      await exportStripPng(shots, layoutId, style);
    } finally {
      setExportingPng(false);
    }
  };

  const handleDownloadGif = async () => {
    setExportingGif(true);
    try {
      await exportStripGif(shots, style);
    } finally {
      setExportingGif(false);
    }
  };

  const handleCopyImage = async () => {
    try {
      const ok = await copyStripToClipboard(shots, layoutId, style);
      if (ok) {
        setCopiedImage(true);
        window.setTimeout(() => setCopiedImage(false), 2200);
      }
    } catch {
      // Ignore if clipboard image copy is unsupported
    }
  };

  const handleCopyShareLink = async () => {
    const url = roomCode
      ? `${window.location.origin}${window.location.pathname}?room=${roomCode}`
      : window.location.href;
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDE8EE] px-3 py-1 text-xs font-bold text-[#D96B84]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Step 5 of 5 · Strip Ready!</span>
        </span>
        <h1 className="font-display mt-3 text-2xl font-bold text-[#2C2627] sm:text-3xl">
          Your Purikura photo strip is ready ♡
        </h1>
        <p className="mt-1 text-sm text-[#7A6F72]">
          {activeCanvaTemplate
            ? `Styled with Canva template: ${activeCanvaTemplate.title}`
            : 'Save a crisp high-resolution PNG strip or an animated GIF slideshow of your shots.'}
        </p>
      </div>

      <div className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_1fr]">
        {/* Final High-Res Strip Preview */}
        <div className="flex justify-center rounded-3xl border border-[#EAE3DC] bg-white p-6 shadow-sm">
          <div
            className="overflow-hidden rounded-2xl shadow-xl"
            style={{
              width: isWidePreview ? 'min(100%, 360px)' : 'min(100%, 270px)',
              aspectRatio: `${dims.width} / ${dims.height}`,
            }}
          >
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
        </div>

        {/* Export & Share Actions */}
        <div className="space-y-4 rounded-3xl border border-[#EAE3DC] bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-[#2C2627]">
            Download &amp; Share
          </h2>

          <button
            type="button"
            disabled={exportingPng}
            onClick={handleDownloadPng}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D96B84] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#C95C75] disabled:opacity-60"
          >
            <Download className="h-4.5 w-4.5" />
            <span>{exportingPng ? 'Rendering PNG...' : 'Download High-Res PNG'}</span>
          </button>

          <button
            type="button"
            disabled={exportingGif}
            onClick={handleDownloadGif}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5B9BD5] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#4B8BC7] disabled:opacity-60"
          >
            <Film className="h-4.5 w-4.5" />
            <span>{exportingGif ? 'Encoding GIF...' : 'Download Animated GIF'}</span>
          </button>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleCopyImage}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#EAE3DC] bg-[#FAF9F6] px-4 py-2.5 text-xs font-bold text-[#2C2627] transition hover:bg-[#F3ECE6]"
            >
              {copiedImage ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied PNG!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-[#D96B84]" />
                  <span>Copy Image</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyShareLink}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#EAE3DC] bg-[#FAF9F6] px-4 py-2.5 text-xs font-bold text-[#2C2627] transition hover:bg-[#F3ECE6]"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5 text-[#5B9BD5]" />
                  <span>Share Booth Link</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#EAE3DC] pt-4">
            <button
              type="button"
              onClick={onBackToStyle}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-[#7A6F72] transition hover:bg-[#FAF9F6] hover:text-[#2C2627]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Style</span>
            </button>

            <button
              type="button"
              onClick={onStartNewSession}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FDE8EE] px-4 py-2 text-xs font-bold text-[#D96B84] transition hover:bg-[#FAD6E1]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Take New Photos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
