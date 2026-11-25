let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playCountdownTick(isFinal: boolean, muted = false): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFinal ? 880 : 620, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  } catch {
    // Ignore audio errors if blocked by autoplay policy
  }
}

export function playShutterSound(muted = false): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Mechanical shutter click using short filtered noise + crisp snap
    const bufferSize = Math.floor(ctx.sampleRate * 0.09);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.exp(-i / (bufferSize * 0.28));
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(1.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    // Cute subtle chime after shutter
    const osc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1046.5, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.14);
    chimeGain.gain.setValueAtTime(0.001, now + 0.05);
    chimeGain.gain.exponentialRampToValueAtTime(0.08, now + 0.07);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    osc.start(now + 0.05);
    osc.stop(now + 0.25);
  } catch {
    // Ignore audio errors
  }
}

export function playPopSound(muted = false): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.08);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Ignore audio errors
  }
}
