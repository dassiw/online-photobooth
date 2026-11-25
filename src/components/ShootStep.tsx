import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Camera,
  FlipHorizontal2,
  Heart,
  RotateCcw,
  Shuffle,
  Sparkles,
  Timer,
  User,
  Users,
  Video,
} from 'lucide-react';
import type {
  BoothMode,
  CapturedShot,
  PartnerState,
  PosePack,
  PosePrompt,
} from '../types/booth';
import { captureShotDataUrl } from '../utils/canvas';
import { playCountdownTick, playShutterSound } from '../utils/sound';
import { PoseIllustration } from './PoseIllustration';

interface ShootStepProps {
  mode: BoothMode;
  posePack: PosePack;
  onChangePosePack: (pack: PosePack) => void;
  slotPoses: PosePrompt[];
  onShufflePose: (slotIndex: number) => void;
  shots: (CapturedShot | null)[];
  activeSlot: number;
  onSelectSlot: (slotIndex: number) => void;
  onCaptureSlot: (slotIndex: number, dataUrl: string, poseId: string) => void;
  localStream: MediaStream | null;
  isDemoCamera: boolean;
  cameraError: string | null;
  onEnableDemoCamera: () => void;
  onRetryWebcam: () => void;
  remoteStream: MediaStream | null;
  localName: string;
  localIsGroup: boolean;
  onToggleLocalIsGroup: () => void;
  partner: PartnerState;
  onStartDemoPartner: () => void;
  onBroadcastCountdown?: (slotIndex: number, durationSec: number) => void;
  incomingCountdownTrigger: { slotIndex: number; durationSec: number; nonce: number } | null;
  muted: boolean;
  requiredCount: number;
  onProceedToPick: () => void;
}

export const ShootStep: React.FC<ShootStepProps> = ({
  mode,
  posePack,
  onChangePosePack,
  slotPoses,
  onShufflePose,
  shots,
  activeSlot,
  onSelectSlot,
  onCaptureSlot,
  localStream,
  isDemoCamera,
  cameraError,
  onEnableDemoCamera,
  onRetryWebcam,
  remoteStream,
  localName,
  localIsGroup,
  onToggleLocalIsGroup,
  partner,
  onStartDemoPartner,
  onBroadcastCountdown,
  incomingCountdownTrigger,
  muted,
  requiredCount,
  onProceedToPick,
}) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [timerSec, setTimerSec] = useState<0 | 3 | 5>(3);
  const [mirrorLocal, setMirrorLocal] = useState(true);
  const [countdownVal, setCountdownVal] = useState<number | null>(null);
  const [flashing, setFlashing] = useState(false);

  const countdownTimerRef = useRef<number | null>(null);
  const isCountingRef = useRef(false);

  const capturedCount = shots.filter(Boolean).length;
  const currentPose = slotPoses[activeSlot] ?? slotPoses[0];

  // Attach local MediaStream whenever stream or mode changes
  useEffect(() => {
    const video = localVideoRef.current;
    if (video && localStream) {
      if (video.srcObject !== localStream) {
        video.srcObject = localStream;
      }
      video.play().catch(() => {});
    }
  }, [localStream, mode]);

  // Attach remote MediaStream in split-screen mode
  useEffect(() => {
    const video = remoteVideoRef.current;
    if (video && remoteStream) {
      if (video.srcObject !== remoteStream) {
        video.srcObject = remoteStream;
      }
      video.play().catch(() => {});
    }
  }, [remoteStream, mode]);

  const executeCapture = useCallback(
    (slotIndex: number) => {
      const pose = slotPoses[slotIndex] ?? slotPoses[0];
      const dataUrl = captureShotDataUrl({
        mode,
        localVideo: localVideoRef.current,
        remoteVideo: remoteVideoRef.current,
        mirrorLocal,
        mirrorRemote: false,
        localLabel:
          mode === 'remote'
            ? `${localName || 'You'}${localIsGroup ? ' · Group' : ''}`
            : undefined,
        remoteLabel:
          mode === 'remote' && partner.connected
            ? `${partner.name}${partner.isGroup ? ' · Group' : ''}`
            : undefined,
      });

      setFlashing(true);
      playShutterSound(muted);
      window.setTimeout(() => setFlashing(false), 450);

      if (dataUrl && pose) {
        onCaptureSlot(slotIndex, dataUrl, pose.id);
      }
    },
    [
      localIsGroup,
      localName,
      mirrorLocal,
      mode,
      muted,
      onCaptureSlot,
      partner.connected,
      partner.isGroup,
      partner.name,
      slotPoses,
    ],
  );

  const runCountdown = useCallback(
    (slotIndex: number, duration: number, broadcast: boolean) => {
      if (isCountingRef.current) return;

      if (broadcast && mode === 'remote') {
        onBroadcastCountdown?.(slotIndex, duration);
      }

      if (duration === 0) {
        executeCapture(slotIndex);
        return;
      }

      isCountingRef.current = true;
      let remaining = duration;
      setCountdownVal(remaining);
      playCountdownTick(false, muted);

      countdownTimerRef.current = window.setInterval(() => {
        remaining -= 1;
        if (remaining > 0) {
          setCountdownVal(remaining);
          playCountdownTick(remaining === 1, muted);
        } else {
          if (countdownTimerRef.current !== null) {
            window.clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          setCountdownVal(null);
          isCountingRef.current = false;
          executeCapture(slotIndex);
        }
      }, 950);
    },
    [executeCapture, mode, muted, onBroadcastCountdown],
  );

  // Listen to synchronized countdown trigger from remote partner
  useEffect(() => {
    if (!incomingCountdownTrigger) return;
    onSelectSlot(incomingCountdownTrigger.slotIndex);
    runCountdown(
      incomingCountdownTrigger.slotIndex,
      incomingCountdownTrigger.durationSec,
      false,
    );
  }, [incomingCountdownTrigger, onSelectSlot, runCountdown]);

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current !== null) {
        window.clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const localDisplayTag = `${localName || 'You'}${
    mode === 'remote' && localIsGroup ? ' · Group' : ''
  }`;
  const partnerDisplayTag = `${partner.name}${partner.isGroup ? ' · Group' : ''}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Bold Centered Heading */}
      <div className="mb-5 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#2C2627] sm:text-3xl">
          {capturedCount === 6 && shots[activeSlot]
            ? `Shot ${activeSlot + 1} of 6 · Ready!`
            : `Shot ${activeSlot + 1} of 6`}
        </h1>
        <p className="mt-1 text-xs font-medium text-[#7A6F72]">
          {capturedCount}/6 captured · Need at least {requiredCount} for your chosen frame
        </p>
      </div>

      {cameraError && (
        <div className="mx-auto mb-4 flex max-w-3xl flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#F9C6D5] bg-[#FDE8EE]/80 px-4 py-2.5 text-xs font-medium text-[#8B3349]">
          <span>{cameraError}</span>
          <button
            type="button"
            onClick={onRetryWebcam}
            className="rounded-lg bg-white px-2.5 py-1 font-bold text-[#D96B84] shadow-2xs"
          >
            Retry Webcam
          </button>
        </div>
      )}

      {/* Main Two-Card Workspace */}
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
        {/* LEFT CARD: Live Camera Frame */}
        <div className="flex flex-col rounded-3xl border border-[#EAE3DC] bg-white p-4 shadow-sm sm:p-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#EAE3DC] bg-[#F3ECE6]">
            {mode === 'together' ? (
              <div className="relative h-full w-full">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                  style={{ transform: mirrorLocal ? 'scaleX(-1)' : 'none' }}
                />

                {/* Cute corner name banner in Together mode */}
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#2C2627] shadow-sm backdrop-blur-xs">
                  <span className="h-2 w-2 rounded-full bg-[#D96B84]" />
                  <span>{localDisplayTag}</span>
                  {isDemoCamera && (
                    <span className="rounded-full bg-[#FDE8EE] px-1.5 py-0.2 text-[10px] text-[#D96B84]">
                      demo
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* REMOTE SPLIT-SCREEN: Seamless side-by-side stitch */
              <div className="grid h-full w-full grid-cols-2">
                {/* User 1 (Local Left Half) */}
                <div className="relative h-full w-full overflow-hidden bg-[#FFF1F5]">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                    style={{ transform: mirrorLocal ? 'scaleX(-1)' : 'none' }}
                  />
                  <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-[#2C2627] shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-[#D96B84]" />
                    <span>{localDisplayTag}</span>
                  </div>
                </div>

                {/* User 2 (Remote Right Half) */}
                <div className="relative h-full w-full overflow-hidden border-l border-white/60 bg-[#E8F2FC]">
                  {remoteStream ? (
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#5B9BD5] shadow-xs">
                        <Video className="h-6 w-6" />
                      </div>
                      <p className="font-display mt-3 text-sm font-bold text-[#2C2627]">
                        Waiting for partner
                      </p>
                      <p className="mt-1 text-[11px] text-[#7A6F72]">
                        Share your room link or preview with a Demo Partner
                      </p>
                      <button
                        type="button"
                        onClick={onStartDemoPartner}
                        className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#5B9BD5] px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-[#4B8BC7]"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Add Demo Partner</span>
                      </button>
                    </div>
                  )}

                  {partner.connected && (
                    <div className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-[#2C2627] shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-[#5B9BD5]" />
                      <span>{partnerDisplayTag}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Centered Semi-Transparent Countdown Overlay (3, 2, 1) */}
            {countdownVal !== null && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/15 backdrop-blur-[1px]">
                <div
                  key={countdownVal}
                  className="animate-countdown-pop flex h-28 w-28 items-center justify-center rounded-full bg-white/80 font-display text-6xl font-extrabold text-[#D96B84] shadow-xl ring-4 ring-white/90"
                >
                  {countdownVal}
                </div>
              </div>
            )}

            {/* White Flash Burst Overlay */}
            {flashing && (
              <div className="animate-flash-burst pointer-events-none absolute inset-0 z-30 bg-white" />
            )}
          </div>

          {/* Camera Controls Row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Timer selector */}
              <div className="inline-flex items-center rounded-xl border border-[#EAE3DC] bg-[#FAF9F6] p-1 text-xs font-bold">
                <Timer className="mr-1 ml-1.5 h-3.5 w-3.5 text-[#7A6F72]" />
                {([3, 5, 0] as const).map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setTimerSec(sec)}
                    className={`rounded-lg px-2 py-1 transition ${
                      timerSec === sec
                        ? 'bg-white text-[#D96B84] shadow-2xs'
                        : 'text-[#7A6F72] hover:text-[#2C2627]'
                    }`}
                  >
                    {sec === 0 ? 'Now' : `${sec}s`}
                  </button>
                ))}
              </div>

              {/* Mirror toggle */}
              <button
                type="button"
                onClick={() => setMirrorLocal((m) => !m)}
                className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition ${
                  mirrorLocal
                    ? 'border-[#F9C6D5] bg-[#FDE8EE]/60 text-[#D96B84]'
                    : 'border-[#EAE3DC] bg-[#FAF9F6] text-[#7A6F72]'
                }`}
                title="Mirror local camera horizontally"
              >
                <FlipHorizontal2 className="h-3.5 w-3.5" />
                <span>Mirror</span>
              </button>

              {/* Hybrid Group Toggle in Remote Mode */}
              {mode === 'remote' && (
                <button
                  type="button"
                  onClick={onToggleLocalIsGroup}
                  className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition ${
                    localIsGroup
                      ? 'border-[#B9D7F5] bg-[#E8F2FC] text-[#3C76B0]'
                      : 'border-[#EAE3DC] bg-[#FAF9F6] text-[#7A6F72]'
                  }`}
                  title="Toggle if multiple friends are sharing your camera"
                >
                  {localIsGroup ? (
                    <Users className="h-3.5 w-3.5" />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                  <span>{localIsGroup ? 'Group' : 'Solo'}</span>
                </button>
              )}

              {/* Demo Cam Switch */}
              <button
                type="button"
                onClick={() => (isDemoCamera ? onRetryWebcam() : onEnableDemoCamera())}
                className="inline-flex items-center gap-1 rounded-xl border border-[#EAE3DC] bg-[#FAF9F6] px-2.5 py-1.5 text-xs font-bold text-[#7A6F72] transition hover:text-[#2C2627]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#D96B84]" />
                <span>{isDemoCamera ? 'Use Webcam' : 'Demo Cam'}</span>
              </button>
            </div>

            {/* Big Rose Shutter Button */}
            <button
              type="button"
              disabled={countdownVal !== null || !localStream}
              onClick={() => runCountdown(activeSlot, timerSec, true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#D96B84] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#C95C75] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial"
            >
              <Camera className="h-4.5 w-4.5" />
              <span>
                {countdownVal !== null
                  ? `Taking in ${countdownVal}...`
                  : shots[activeSlot]
                    ? `Retake Shot ${activeSlot + 1}`
                    : `Take Shot ${activeSlot + 1}`}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT CARD: Pose Reference ("Recreate this") */}
        <div className="flex flex-col justify-between rounded-3xl border border-[#EAE3DC] bg-white p-5 shadow-sm">
          <div>
            {/* Top Header Row: Pink Pill + Counter */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDE8EE] px-3 py-1 text-xs font-bold text-[#D96B84]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Recreate this</span>
              </span>
              <span className="font-mono-booth rounded-full bg-[#FAF9F6] px-2.5 py-1 text-xs font-bold text-[#7A6F72] ring-1 ring-[#EAE3DC]">
                {activeSlot + 1}/6
              </span>
            </div>

            {/* Cute Pose Illustration */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#EAE3DC] bg-[#FAF9F6]">
              <PoseIllustration
                artKey={currentPose.artKey}
                className="aspect-[13/10] w-full"
              />
            </div>

            {/* Pose Title & Caption */}
            <div className="mt-4 text-center">
              <span className="inline-block rounded-full bg-[#E8F2FC] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#3C76B0] uppercase">
                {currentPose.pack === 'friends' ? 'Besties Prompt' : 'Couples Prompt'}
              </span>
              <h2 className="font-display mt-1.5 text-lg font-bold text-[#2C2627]">
                {currentPose.title}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#7A6F72]">
                “{currentPose.caption}”
              </p>
            </div>
          </div>

          {/* Pose Controls: Shuffle + Vibe Switcher */}
          <div className="mt-5 space-y-3 border-t border-[#EAE3DC] pt-4">
            <button
              type="button"
              onClick={() => onShufflePose(activeSlot)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#EAE3DC] bg-[#FAF9F6] px-4 py-2.5 text-xs font-bold text-[#2C2627] transition hover:border-[#D96B84]/50 hover:bg-[#FDE8EE]/50 hover:text-[#D96B84]"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span>Shuffle Pose Prompt</span>
            </button>

            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'friends', label: 'Friends', icon: Users },
                  { id: 'couples', label: 'Couples', icon: Heart },
                  { id: 'all', label: 'All', icon: Sparkles },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangePosePack(id)}
                  className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-[11px] font-bold transition ${
                    posePack === id
                      ? 'bg-[#D96B84] text-white'
                      : 'bg-[#FAF9F6] text-[#7A6F72] hover:text-[#2C2627]'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SHOT THUMBNAIL STRIP (6 numbered square slots) */}
      <div className="mt-6 rounded-3xl border border-[#EAE3DC] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-sm font-bold text-[#2C2627]">
              Your 6 Booth Shots
            </h3>
            <p className="text-xs text-[#7A6F72]">
              Click any slot to preview or retake that shot anytime.
            </p>
          </div>

          <button
            type="button"
            disabled={capturedCount < 1}
            onClick={onProceedToPick}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2C2627] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#3F3739] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>
              {capturedCount >= requiredCount
                ? 'Pick Favorites'
                : `Pick Favorites (${capturedCount}/${requiredCount})`}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {shots.map((shot, idx) => {
            const isActive = activeSlot === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSlot(idx)}
                className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition ${
                  isActive
                    ? 'border-[#D96B84] ring-4 ring-[#FDE8EE]'
                    : shot
                      ? 'border-[#EAE3DC] hover:border-[#D96B84]/60'
                      : 'border-dashed border-[#DFD5CC] bg-[#FAF9F6] hover:border-[#D96B84]/50'
                }`}
              >
                {shot ? (
                  <>
                    <img
                      src={shot.dataUrl}
                      alt={`Shot ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition group-hover:opacity-100">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#2C2627]">
                        <RotateCcw className="h-3 w-3 text-[#D96B84]" />
                        <span>Retake</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-[#A5999C]">
                    <span className="font-display text-lg font-bold">{idx + 1}</span>
                    <span className="text-[10px] font-medium">
                      {isActive ? 'Next' : 'Empty'}
                    </span>
                  </div>
                )}

                <span
                  className={`absolute top-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-[#D96B84] text-white'
                      : 'bg-white/90 text-[#2C2627] shadow-2xs'
                  }`}
                >
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
