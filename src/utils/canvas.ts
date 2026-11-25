import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { CANVA_TEMPLATES } from '../data/canvaTemplates';
import {
  FRAME_LAYOUTS,
  FRAME_THEMES,
  PHOTO_FILTERS,
  STICKERS,
  stickerToDataUri,
} from '../data/frames';
import type {
  BoothMode,
  CanvaOverlayGridId,
  CapturedShot,
  FrameLayoutId,
  StripStyleConfig,
} from '../types/booth';

export function getCanvaGridSpec(grid: CanvaOverlayGridId): {
  cols: number;
  rows: number;
  count: number;
  label: string;
} {
  switch (grid) {
    case 'strip-4':
      return { cols: 1, rows: 4, count: 4, label: '4-Cut Strip' };
    case 'stack-3':
      return { cols: 1, rows: 3, count: 3, label: '3-Cut Stack' };
    case 'grid-2x2':
      return { cols: 2, rows: 2, count: 4, label: '2×2 Grid' };
    case 'pair-2':
      return { cols: 1, rows: 2, count: 2, label: '2-Cut Pair' };
  }
}

export function getStripDimensions(
  layoutId: FrameLayoutId,
  style: StripStyleConfig,
): { width: number; height: number } {
  if (style.canvaTemplateId) {
    const tpl = CANVA_TEMPLATES.find((t) => t.id === style.canvaTemplateId);
    if (tpl) return { width: tpl.width, height: tpl.height };
  }
  const layout = FRAME_LAYOUTS[layoutId];
  return { width: layout.width, height: layout.height };
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Center-crops and draws a video element into (dx, dy, dw, dh) without stretching.
 */
export function drawCoverVideo(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  mirror: boolean,
): void {
  const vw = video.videoWidth || 640;
  const vh = video.videoHeight || 480;
  const srcRatio = vw / vh;
  const dstRatio = dw / dh;

  let sx = 0;
  let sy = 0;
  let sw = vw;
  let sh = vh;

  if (srcRatio > dstRatio) {
    sw = vh * dstRatio;
    sx = (vw - sw) / 2;
  } else {
    sh = vw / dstRatio;
    sy = (vh - sh) / 2;
  }

  ctx.save();
  if (mirror) {
    ctx.translate(dx + dw, dy);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, dw, dh);
  } else {
    ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
  }
  ctx.restore();
}

export interface CaptureShotOptions {
  mode: BoothMode;
  localVideo: HTMLVideoElement | null;
  remoteVideo: HTMLVideoElement | null;
  mirrorLocal: boolean;
  mirrorRemote: boolean;
  localLabel?: string;
  remoteLabel?: string;
  width?: number;
  height?: number;
}

export function captureShotDataUrl(options: CaptureShotOptions): string | null {
  const {
    mode,
    localVideo,
    remoteVideo,
    mirrorLocal,
    mirrorRemote,
    localLabel,
    remoteLabel,
    width = 960,
    height = 720,
  } = options;

  if (!localVideo || localVideo.readyState < 2) {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#F3ECE6';
  ctx.fillRect(0, 0, width, height);

  if (mode === 'together') {
    drawCoverVideo(ctx, localVideo, 0, 0, width, height, mirrorLocal);
  } else {
    const halfW = width / 2;
    // Left half: local user
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, halfW, height);
    ctx.clip();
    drawCoverVideo(ctx, localVideo, 0, 0, halfW, height, mirrorLocal);
    ctx.restore();

    // Right half: remote partner
    ctx.save();
    ctx.beginPath();
    ctx.rect(halfW, 0, halfW, height);
    ctx.clip();
    if (remoteVideo && remoteVideo.readyState >= 2) {
      drawCoverVideo(ctx, remoteVideo, halfW, 0, halfW, height, mirrorRemote);
    } else {
      ctx.fillStyle = '#E8F2FC';
      ctx.fillRect(halfW, 0, halfW, height);
      ctx.fillStyle = '#5B9BD5';
      ctx.font = '700 28px "Quicksand", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for partner...', halfW + halfW / 2, height / 2);
    }
    ctx.restore();

    // Soft center seam line
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(halfW - 1.5, 0, 3, height);

    // Subtle corner name pills in split-screen capture
    const drawNameTag = (text: string, x: number, alignRight: boolean, color: string) => {
      if (!text) return;
      ctx.save();
      ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
      const padX = 14;
      const pillH = 32;
      const textW = ctx.measureText(text).width;
      const pillW = textW + padX * 2;
      const px = alignRight ? x - pillW - 18 : x + 18;
      const py = height - pillH - 18;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      drawRoundedRectPath(ctx, px, py, pillW, pillH, 16);
      ctx.fill();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px + 14, py + pillH / 2, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2C2627';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, px + 24, py + pillH / 2 + 0.5);
      ctx.restore();
    };

    if (localLabel) drawNameTag(localLabel, 0, false, '#D96B84');
    if (remoteLabel) drawNameTag(remoteLabel, width, true, '#5B9BD5');
  }

  return canvas.toDataURL('image/png');
}

const imageCache = new Map<string, Promise<HTMLImageElement>>();

function loadImageCached(src: string): Promise<HTMLImageElement> {
  const existing = imageCache.get(src);
  if (existing) return existing;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => {
      imageCache.delete(src);
      reject(err);
    };
    img.src = src;
  });
  imageCache.set(src, promise);
  return promise;
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
): void {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const srcRatio = iw / ih;
  const dstRatio = dw / dh;

  let sx = 0;
  let sy = 0;
  let sw = iw;
  let sh = ih;

  if (srcRatio > dstRatio) {
    sw = ih * dstRatio;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / dstRatio;
    sy = (ih - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function drawThemeBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  themeId: StripStyleConfig['theme'],
): { textColor: string; mutedTextColor: string } {
  const theme = FRAME_THEMES.find((t) => t.id === themeId) ?? FRAME_THEMES[0];
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, w, h);

  if (theme.pattern === 'gingham-pink') {
    const step = 48;
    ctx.fillStyle = 'rgba(249, 198, 213, 0.36)';
    for (let x = 0; x < w; x += step * 2) {
      ctx.fillRect(x, 0, step, h);
    }
    for (let y = 0; y < h; y += step * 2) {
      ctx.fillRect(0, y, w, step);
    }
  } else if (theme.pattern === 'polka-blue') {
    const spacing = 54;
    ctx.fillStyle = 'rgba(143, 192, 240, 0.36)';
    for (let row = 0; row * spacing < h + spacing; row++) {
      const offset = (row % 2) * (spacing / 2);
      for (let col = -1; col * spacing < w + spacing; col++) {
        ctx.beginPath();
        ctx.arc(col * spacing + offset, row * spacing, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  return {
    textColor: theme.textColor,
    mutedTextColor: theme.mutedTextColor,
  };
}

export async function renderPhotoStrip(
  canvas: HTMLCanvasElement,
  shots: CapturedShot[],
  layoutId: FrameLayoutId,
  style: StripStyleConfig,
): Promise<void> {
  const canvaTemplate = style.canvaTemplateId
    ? CANVA_TEMPLATES.find((t) => t.id === style.canvaTemplateId) ?? null
    : null;

  const layout = FRAME_LAYOUTS[layoutId];
  const filterSpec = PHOTO_FILTERS.find((f) => f.id === style.filter) ?? PHOTO_FILTERS[0];

  const today = new Date();
  const dateText = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(today.getDate()).padStart(2, '0')}`;
  const metaParts: string[] = [];
  if (style.showDate) metaParts.push(dateText);
  if (style.showBrandStamp) metaParts.push('PURIKURA STUDIO');

  if (canvaTemplate) {
    canvas.width = canvaTemplate.width;
    canvas.height = canvaTemplate.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvaTemplate.width;
    const h = canvaTemplate.height;

    ctx.fillStyle = '#FAF9F6';
    ctx.fillRect(0, 0, w, h);

    try {
      const bgImg = await loadImageCached(canvaTemplate.imageUrl);
      ctx.drawImage(bgImg, 0, 0, w, h);
    } catch {
      // Fallback to theme background if template fails to load
      drawThemeBackground(ctx, w, h, style.theme);
    }

    const grid = getCanvaGridSpec(style.canvaGrid);
    const inset = style.canvaInset ?? 0.1;
    const hasFooter = Boolean(style.caption.trim()) || metaParts.length > 0;
    const padX = w * inset;
    const padTop = h * (inset * 1.15);
    const padBottom = h * (inset * 1.2 + (hasFooter ? 0.085 : 0.015));
    const gap = Math.round(Math.min(w, h) * 0.022);

    const availW = w - padX * 2 - gap * (grid.cols - 1);
    const availH = h - padTop - padBottom - gap * (grid.rows - 1);
    const cellW = availW / grid.cols;
    const cellH = availH / grid.rows;
    const mattePad = Math.max(6, Math.round(Math.min(cellW, cellH) * 0.032));
    const cornerRadius = Math.max(10, Math.round(Math.min(cellW, cellH) * 0.05));

    const loadedShotImgs = await Promise.all(
      Array.from({ length: grid.count }).map(async (_, idx) => {
        const shot = shots[idx] ?? shots[idx % Math.max(1, shots.length)];
        if (!shot) return null;
        try {
          return await loadImageCached(shot.dataUrl);
        } catch {
          return null;
        }
      }),
    );

    for (let i = 0; i < grid.count; i++) {
      const col = i % grid.cols;
      const row = Math.floor(i / grid.cols);
      const x = padX + col * (cellW + gap);
      const y = padTop + row * (cellH + gap);

      // Soft white polaroid frame backing around each photo so it pops over busy templates
      ctx.save();
      ctx.shadowColor = 'rgba(44, 38, 39, 0.18)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = '#FFFFFF';
      drawRoundedRectPath(ctx, x, y, cellW, cellH, cornerRadius);
      ctx.fill();
      ctx.restore();

      const innerX = x + mattePad;
      const innerY = y + mattePad;
      const innerW = cellW - mattePad * 2;
      const innerH = cellH - mattePad * 2;

      ctx.save();
      drawRoundedRectPath(ctx, innerX, innerY, innerW, innerH, Math.max(6, cornerRadius - 4));
      ctx.clip();

      const img = loadedShotImgs[i];
      if (img) {
        ctx.filter = filterSpec.cssFilter;
        drawCoverImage(ctx, img, innerX, innerY, innerW, innerH);
        ctx.filter = 'none';
      } else {
        ctx.fillStyle = '#F3ECE6';
        ctx.fillRect(innerX, innerY, innerW, innerH);
        ctx.fillStyle = '#8B7E81';
        ctx.font = '700 24px "Quicksand", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Shot ${i + 1}`, innerX + innerW / 2, innerY + innerH / 2);
      }
      ctx.restore();
    }

    if (hasFooter) {
      const pillW = Math.min(w - 64, Math.max(w * 0.64, 360));
      const pillH = style.caption.trim() && metaParts.length > 0 ? 78 : 48;
      const pillX = (w - pillW) / 2;
      const pillY = h - padBottom + (padBottom - pillH) * 0.45;

      ctx.save();
      ctx.fillStyle = 'rgba(255, 253, 249, 0.88)';
      drawRoundedRectPath(ctx, pillX, pillY, pillW, pillH, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(44, 38, 39, 0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (style.caption.trim()) {
        ctx.fillStyle = '#2C2627';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (style.captionFont === 'hand') {
          ctx.font = '700 34px "Caveat", cursive';
        } else if (style.captionFont === 'mono') {
          ctx.font = '700 20px "Space Mono", monospace';
        } else {
          ctx.font = '700 24px "Quicksand", sans-serif';
        }
        const capY = metaParts.length > 0 ? pillY + 28 : pillY + pillH / 2;
        ctx.fillText(style.caption.trim(), w / 2, capY, pillW - 36);
      }

      if (metaParts.length > 0) {
        ctx.fillStyle = '#7A6F72';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '700 15px "Space Mono", monospace';
        const metaY = style.caption.trim() ? pillY + 58 : pillY + pillH / 2;
        ctx.fillText(metaParts.join('  ·  '), w / 2, metaY, pillW - 32);
      }
      ctx.restore();
    }

    // Draw placed stickers on top
    for (const placed of style.stickers) {
      const def = STICKERS.find((s) => s.id === placed.stickerId);
      if (!def) continue;
      try {
        const stickerImg = await loadImageCached(stickerToDataUri(def));
        const baseW = w * 0.17 * placed.scale;
        const baseH = baseW / def.aspect;
        const cx = placed.x * w;
        const cy = placed.y * h;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((placed.rotation * Math.PI) / 180);
        ctx.drawImage(stickerImg, -baseW / 2, -baseH / 2, baseW, baseH);
        ctx.restore();
      } catch {
        // Skip broken sticker silently
      }
    }
    return;
  }

  canvas.width = layout.width;
  canvas.height = layout.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { textColor, mutedTextColor } = drawThemeBackground(
    ctx,
    layout.width,
    layout.height,
    style.theme,
  );

  // Subtle inner border
  ctx.strokeStyle =
    style.theme === 'charcoal' ? 'rgba(255,255,255,0.08)' : 'rgba(44,38,39,0.08)';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, layout.width - 20, layout.height - 20);

  const availW = layout.width - layout.paddingX * 2 - layout.gap * (layout.cols - 1);
  const availH =
    layout.height - layout.paddingTop - layout.paddingBottom - layout.gap * (layout.rows - 1);
  const cellW = availW / layout.cols;
  const cellH = availH / layout.rows;

  // Load shot images in parallel
  const loadedShotImgs = await Promise.all(
    Array.from({ length: layout.pickCount }).map(async (_, idx) => {
      const shot = shots[idx];
      if (!shot) return null;
      try {
        return await loadImageCached(shot.dataUrl);
      } catch {
        return null;
      }
    }),
  );

  for (let i = 0; i < layout.pickCount; i++) {
    const col = i % layout.cols;
    const row = Math.floor(i / layout.cols);
    const x = layout.paddingX + col * (cellW + layout.gap);
    const y = layout.paddingTop + row * (cellH + layout.gap);

    ctx.save();
    drawRoundedRectPath(ctx, x, y, cellW, cellH, layout.cornerRadius);
    ctx.clip();

    const img = loadedShotImgs[i];
    if (img) {
      ctx.filter = filterSpec.cssFilter;
      drawCoverImage(ctx, img, x, y, cellW, cellH);
      ctx.filter = 'none';
    } else {
      ctx.fillStyle = style.theme === 'charcoal' ? '#363132' : '#F3ECE6';
      ctx.fillRect(x, y, cellW, cellH);
      ctx.fillStyle = mutedTextColor;
      ctx.font = '700 28px "Quicksand", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Shot ${i + 1}`, x + cellW / 2, y + cellH / 2);
    }
    ctx.restore();

    // Delicate border around each photo cell
    ctx.save();
    ctx.strokeStyle =
      style.theme === 'charcoal' ? 'rgba(255,255,255,0.12)' : 'rgba(44,38,39,0.08)';
    ctx.lineWidth = 2;
    drawRoundedRectPath(ctx, x, y, cellW, cellH, layout.cornerRadius);
    ctx.stroke();
    ctx.restore();
  }

  // Footer caption, date stamp, and studio signature
  const footerTop = layout.height - layout.paddingBottom;
  const centerX = layout.width / 2;

  if (style.caption.trim()) {
    ctx.save();
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (style.captionFont === 'hand') {
      ctx.font = '700 44px "Caveat", cursive';
    } else if (style.captionFont === 'mono') {
      ctx.font = '700 26px "Space Mono", monospace';
    } else {
      ctx.font = '700 32px "Quicksand", sans-serif';
    }
    ctx.fillText(style.caption.trim(), centerX, footerTop + 56, layout.width - 96);
    ctx.restore();
  }

  ctx.save();
  ctx.fillStyle = mutedTextColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 20px "Space Mono", monospace';
  if (metaParts.length > 0) {
    const metaY = style.caption.trim() ? footerTop + 114 : footerTop + 76;
    ctx.fillText(metaParts.join('  ·  '), centerX, metaY);
  }
  ctx.restore();

  // Draw placed stickers on top
  for (const placed of style.stickers) {
    const def = STICKERS.find((s) => s.id === placed.stickerId);
    if (!def) continue;
    try {
      const stickerImg = await loadImageCached(stickerToDataUri(def));
      const baseW = layout.width * 0.17 * placed.scale;
      const baseH = baseW / def.aspect;
      const cx = placed.x * layout.width;
      const cy = placed.y * layout.height;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((placed.rotation * Math.PI) / 180);
      ctx.drawImage(stickerImg, -baseW / 2, -baseH / 2, baseW, baseH);
      ctx.restore();
    } catch {
      // Skip broken sticker silently
    }
  }
}

export async function exportStripPng(
  shots: CapturedShot[],
  layoutId: FrameLayoutId,
  style: StripStyleConfig,
): Promise<string> {
  const offscreen = document.createElement('canvas');
  await renderPhotoStrip(offscreen, shots, layoutId, style);
  const dataUrl = offscreen.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `purikura-strip-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return dataUrl;
}

export async function copyStripToClipboard(
  shots: CapturedShot[],
  layoutId: FrameLayoutId,
  style: StripStyleConfig,
): Promise<boolean> {
  if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
    return false;
  }
  const offscreen = document.createElement('canvas');
  await renderPhotoStrip(offscreen, shots, layoutId, style);
  const blob = await new Promise<Blob | null>((resolve) =>
    offscreen.toBlob((b) => resolve(b), 'image/png'),
  );
  if (!blob) return false;
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  return true;
}

/**
 * Generates an animated GIF cycling through the selected shots inside a cute
 * styled Purikura polaroid frame and triggers a .gif download.
 */
export async function exportStripGif(
  shots: CapturedShot[],
  style: StripStyleConfig,
): Promise<void> {
  const validShots = shots.filter((s) => Boolean(s?.dataUrl));
  if (validShots.length === 0) return;

  const width = 480;
  const height = 460;
  const pad = 28;
  const photoW = width - pad * 2;
  const photoH = 315;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const filterSpec = PHOTO_FILTERS.find((f) => f.id === style.filter) ?? PHOTO_FILTERS[0];
  const canvaTemplate = style.canvaTemplateId
    ? CANVA_TEMPLATES.find((t) => t.id === style.canvaTemplateId) ?? null
    : null;
  const canvaBgImg = canvaTemplate
    ? await loadImageCached(canvaTemplate.imageUrl).catch(() => null)
    : null;
  const gif = GIFEncoder();

  for (let idx = 0; idx < validShots.length; idx++) {
    const shot = validShots[idx];
    const img = await loadImageCached(shot.dataUrl);

    let textColor = '#2C2627';
    let mutedTextColor = '#7A6F72';

    if (canvaBgImg) {
      drawCoverImage(ctx, canvaBgImg, 0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 253, 249, 0.72)';
      ctx.fillRect(0, height - 108, width, 108);
    } else {
      const colors = drawThemeBackground(ctx, width, height, style.theme);
      textColor = colors.textColor;
      mutedTextColor = colors.mutedTextColor;
    }

    ctx.save();
    drawRoundedRectPath(ctx, pad, pad, photoW, photoH, 18);
    ctx.clip();
    ctx.filter = filterSpec.cssFilter;
    drawCoverImage(ctx, img, pad, pad, photoW, photoH);
    ctx.filter = 'none';
    ctx.restore();

    // Cute frame badge
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    drawRoundedRectPath(ctx, pad + 14, pad + 14, 72, 28, 14);
    ctx.fill();
    ctx.fillStyle = '#D96B84';
    ctx.font = '700 14px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${idx + 1}/${validShots.length}`, pad + 50, pad + 29);
    ctx.restore();

    // Caption & date footer
    ctx.save();
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font =
      style.captionFont === 'hand'
        ? '700 32px "Caveat", cursive'
        : style.captionFont === 'mono'
          ? '700 18px "Space Mono", monospace'
          : '700 22px "Quicksand", sans-serif';
    ctx.fillText(
      style.caption.trim() || 'purikura memories ♡',
      width / 2,
      pad + photoH + 46,
      width - 64,
    );
    ctx.fillStyle = mutedTextColor;
    ctx.font = '700 13px "Space Mono", monospace';
    ctx.fillText('PURIKURA STUDIO', width / 2, height - 26);
    ctx.restore();

    const imageData = ctx.getImageData(0, 0, width, height);
    const palette = quantize(imageData.data, 256);
    const index = applyPalette(imageData.data, palette);
    gif.writeFrame(index, width, height, {
      palette,
      delay: 680,
      repeat: 0,
    });
  }

  gif.finish();
  const bytes = gif.bytes();
  const blob = new Blob([new Uint8Array(bytes)], { type: 'image/gif' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `purikura-animated-${Date.now()}.gif`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
