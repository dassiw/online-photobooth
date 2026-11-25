export interface DemoStreamHandle {
  stream: MediaStream;
  stop: () => void;
}

/**
 * Generates an animated kawaii pastel studio MediaStream on an offscreen canvas
 * so users without a physical webcam (or testing Remote Split-Screen solo) can
 * experience the full photo booth flow seamlessly.
 */
export function createDemoCameraStream(
  variant: 'local' | 'partner',
  label: string,
): DemoStreamHandle {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  let rafId = 0;
  let stopped = false;
  const start = performance.now();

  const isLocal = variant === 'local';
  const bgTop = isLocal ? '#FFF1F5' : '#ECF5FF';
  const bgBottom = isLocal ? '#FFE3EC' : '#DBEBFD';
  const accent = isLocal ? '#D96B84' : '#5B9BD5';
  const earInner = isLocal ? '#F9C6D5' : '#B9D7F5';

  const drawFrame = (now: number) => {
    if (stopped || !ctx) return;
    const t = (now - start) / 1000;

    // Soft pastel gradient backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, bgTop);
    grad.addColorStop(1, bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Floating background sparkles
    for (let i = 0; i < 6; i++) {
      const px = 80 + i * 96 + Math.sin(t * 1.4 + i) * 14;
      const py = 75 + (i % 2) * 280 + Math.cos(t * 1.7 + i) * 12;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(217,107,132,0.22)' : 'rgba(91,155,213,0.22)';
      ctx.beginPath();
      ctx.arc(px, py, 10 + (i % 3) * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center character(s)
    const drawKitty = (cx: number, cy: number, phase: number, scale = 1) => {
      const bob = Math.sin(t * 2.4 + phase) * 8;
      const blink = (t + phase) % 3.8 > 3.62;

      ctx.save();
      ctx.translate(cx, cy + bob);
      ctx.scale(scale, scale);

      // Shoulders
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.ellipse(0, 128, 86, 56, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#2C2627';
      ctx.stroke();

      // Ears
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(-64, -36);
      ctx.lineTo(-78, -96);
      ctx.lineTo(-22, -68);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(64, -36);
      ctx.lineTo(78, -96);
      ctx.lineTo(22, -68);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner ears
      ctx.fillStyle = earInner;
      ctx.beginPath();
      ctx.moveTo(-58, -44);
      ctx.lineTo(-68, -82);
      ctx.lineTo(-30, -64);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(58, -44);
      ctx.lineTo(68, -82);
      ctx.lineTo(30, -64);
      ctx.closePath();
      ctx.fill();

      // Head
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, 0, 82, 70, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Blush cheeks
      ctx.fillStyle = 'rgba(249, 168, 188, 0.72)';
      ctx.beginPath();
      ctx.ellipse(-44, 14, 14, 9, 0, 0, Math.PI * 2);
      ctx.ellipse(44, 14, 14, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#2C2627';
      if (blink) {
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(-28, -2, 8, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(28, -2, 8, 0, Math.PI);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(-28, -4, 7, 0, Math.PI * 2);
        ctx.arc(28, -4, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-30, -6, 2.5, 0, Math.PI * 2);
        ctx.arc(26, -6, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cute kitty nose & smile
      ctx.fillStyle = '#D96B84';
      ctx.beginPath();
      ctx.ellipse(0, 6, 5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#2C2627';
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(-6, 12, 6, 0, Math.PI * 0.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(6, 12, 6, Math.PI * 0.1, Math.PI);
      ctx.stroke();

      // Cute waving paw making peace sign
      const wave = Math.sin(t * 3 + phase) * 0.12;
      ctx.save();
      ctx.translate(72, 54);
      ctx.rotate(wave);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Peace fingers
      ctx.beginPath();
      ctx.moveTo(-5, -15);
      ctx.lineTo(-10, -34);
      ctx.moveTo(5, -15);
      ctx.lineTo(10, -34);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    if (isLocal) {
      drawKitty(245, 255, 0, 0.92);
      drawKitty(405, 265, 1.3, 0.88);
    } else {
      drawKitty(320, 260, 0.8, 1);
    }

    // Subtle studio watermark
    ctx.fillStyle = 'rgba(44, 38, 39, 0.45)';
    ctx.font = '600 18px "Quicksand", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`DEMO CAM · ${label.toUpperCase()}`, canvas.width / 2, 42);

    rafId = requestAnimationFrame(drawFrame);
  };

  rafId = requestAnimationFrame(drawFrame);
  const stream = canvas.captureStream(30);

  return {
    stream,
    stop: () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      stream.getTracks().forEach((track) => track.stop());
    },
  };
}
