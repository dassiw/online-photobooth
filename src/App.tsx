import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DoneStep } from './components/DoneStep';
import { FrameStep } from './components/FrameStep';
import { LandingScreen } from './components/LandingScreen';
import { MultiplayerCursor } from './components/MultiplayerCursor';
import { PickStep } from './components/PickStep';
import { ProgressHeader } from './components/ProgressHeader';
import { ShootStep } from './components/ShootStep';
import { StyleStep } from './components/StyleStep';
import { FRAME_LAYOUTS } from './data/frames';
import {
  getPosesForPack,
  pickInitialSlotPoses,
  POSE_PROMPTS,
} from './data/poses';
import { useCamera } from './hooks/useCamera';
import { useRemoteRoom } from './hooks/useRemoteRoom';
import type {
  BoothMode,
  CapturedShot,
  FrameLayoutId,
  PosePack,
  PosePrompt,
  RoomMessage,
  StepId,
  StripStyleConfig,
} from './types/booth';
import { playPopSound } from './utils/sound';

const DEFAULT_STYLE: StripStyleConfig = {
  theme: 'blush',
  filter: 'soft-film',
  caption: 'sunday memories ♡',
  captionFont: 'hand',
  showDate: true,
  showBrandStamp: true,
  stickers: [],
  canvaTemplateId: null,
  canvaGrid: 'strip-4',
  canvaInset: 0.1,
};

export function App() {
  const [inBooth, setInBooth] = useState(false);
  const [mode, setMode] = useState<BoothMode>('together');
  const [posePack, setPosePack] = useState<PosePack>('all');
  const [localName, setLocalName] = useState('Aiden');
  const [localIsGroup, setLocalIsGroup] = useState(false);

  const [step, setStep] = useState<StepId>('frame');
  const [layoutId, setLayoutId] = useState<FrameLayoutId>('strip-4');
  const [slotPoses, setSlotPoses] = useState<PosePrompt[]>(() =>
    pickInitialSlotPoses('all', 6),
  );
  const [shots, setShots] = useState<(CapturedShot | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [selectedSlotIndices, setSelectedSlotIndices] = useState<number[]>([]);
  const [stripStyle, setStripStyle] = useState<StripStyleConfig>(DEFAULT_STYLE);

  const [muted, setMuted] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [incomingCountdown, setIncomingCountdown] = useState<{
    slotIndex: number;
    durationSec: number;
    nonce: number;
  } | null>(null);

  const camera = useCamera(localName || 'You');

  const handleRoomMessage = useCallback((msg: RoomMessage) => {
    if (msg.type === 'sync_settings') {
      if (msg.layoutId) setLayoutId(msg.layoutId);
      if (msg.posePack) {
        setPosePack(msg.posePack);
        setSlotPoses(pickInitialSlotPoses(msg.posePack, 6));
      }
    } else if (msg.type === 'pose_change') {
      const found = POSE_PROMPTS.find((p) => p.id === msg.poseId);
      if (found) {
        setSlotPoses((prev) =>
          prev.map((p, i) => (i === msg.slotIndex ? found : p)),
        );
      }
    } else if (msg.type === 'start_countdown') {
      setIncomingCountdown({
        slotIndex: msg.slotIndex,
        durationSec: msg.durationSec,
        nonce: Date.now(),
      });
    } else if (msg.type === 'step_change') {
      setStep(msg.step);
    }
  }, []);

  const remote = useRemoteRoom({
    localName,
    localIsGroup,
    localStream: camera.stream,
    onMessage: handleRoomMessage,
  });

  // Auto-detect ?room=XXXXXX on initial load
  const initializedUrlRoomRef = useRef(false);
  useEffect(() => {
    if (initializedUrlRoomRef.current) return;
    initializedUrlRoomRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && roomParam.trim()) {
      setMode('remote');
      setLocalName('Angie');
      remote.joinRoom(roomParam);
    }
  }, [remote]);

  // Start local camera automatically when entering Shoot step
  useEffect(() => {
    if (inBooth && step === 'shoot' && !camera.stream && !camera.isLoading) {
      camera.startCamera();
    }
  }, [inBooth, step, camera]);

  const handleChangeMode = (nextMode: BoothMode) => {
    setMode(nextMode);
    if (nextMode === 'together' && remote.roomCode) {
      remote.leaveRoom();
    }
  };

  const handleChangePosePack = (nextPack: PosePack) => {
    setPosePack(nextPack);
    const newPoses = pickInitialSlotPoses(nextPack, 6);
    setSlotPoses(newPoses);
    if (mode === 'remote' && remote.partner.connected && !remote.partner.isDemo) {
      remote.sendMessage({ type: 'sync_settings', posePack: nextPack });
    }
  };

  const handleShufflePose = (slotIndex: number) => {
    const pool = getPosesForPack(posePack);
    const current = slotPoses[slotIndex];
    const candidates = pool.filter((p) => p.id !== current?.id);
    const picked =
      candidates[Math.floor(Math.random() * candidates.length)] ?? pool[0];
    if (!picked) return;

    playPopSound(muted);
    setSlotPoses((prev) => prev.map((p, i) => (i === slotIndex ? picked : p)));
    if (mode === 'remote' && remote.partner.connected && !remote.partner.isDemo) {
      remote.sendMessage({
        type: 'pose_change',
        slotIndex,
        poseId: picked.id,
      });
    }
  };

  const handleCaptureSlot = useCallback(
    (slotIndex: number, dataUrl: string, poseId: string) => {
      setShots((prev) => {
        const next = [...prev];
        next[slotIndex] = {
          slotIndex,
          dataUrl,
          poseId,
          timestamp: Date.now(),
        };

        // Advance active slot to next empty slot if available
        const nextEmpty = next.findIndex((s, i) => i > slotIndex && !s);
        if (nextEmpty !== -1) {
          setActiveSlot(nextEmpty);
        } else {
          const firstEmpty = next.findIndex((s) => !s);
          if (firstEmpty !== -1) {
            setActiveSlot(firstEmpty);
          }
        }
        return next;
      });
    },
    [],
  );

  const layout = FRAME_LAYOUTS[layoutId];

  const syncPickedSlotsForLayout = useCallback(
    (targetLayoutId: FrameLayoutId, currentShots: (CapturedShot | null)[]) => {
      const need = FRAME_LAYOUTS[targetLayoutId].pickCount;
      const available = currentShots
        .map((s, idx) => (s ? idx : -1))
        .filter((idx) => idx !== -1);
      setSelectedSlotIndices(available.slice(0, need));
    },
    [],
  );

  const handleProceedToPick = () => {
    syncPickedSlotsForLayout(layoutId, shots);
    setStep('pick');
  };

  const handleToggleSlotSelection = (slotIndex: number) => {
    playPopSound(muted);
    setSelectedSlotIndices((prev) => {
      if (prev.includes(slotIndex)) {
        return prev.filter((i) => i !== slotIndex);
      }
      if (prev.length >= layout.pickCount) {
        return [...prev.slice(1), slotIndex];
      }
      return [...prev, slotIndex];
    });
  };

  const handleAutoPick = () => {
    playPopSound(muted);
    const available = shots
      .map((s, idx) => (s ? idx : -1))
      .filter((idx) => idx !== -1);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    setSelectedSlotIndices(shuffled.slice(0, layout.pickCount));
  };

  const pickedShots = useMemo<CapturedShot[]>(() => {
    return selectedSlotIndices
      .map((slotIdx) => shots[slotIdx])
      .filter((s): s is CapturedShot => Boolean(s));
  }, [selectedSlotIndices, shots]);

  const capturedCount = shots.filter(Boolean).length;

  const canAccessStep = (target: StepId): boolean => {
    if (target === 'frame' || target === 'shoot') return true;
    if (target === 'pick') return capturedCount > 0;
    if (target === 'style' || target === 'done') {
      return capturedCount > 0 && selectedSlotIndices.length > 0;
    }
    return false;
  };

  const handleSelectStep = (target: StepId) => {
    if (target === 'pick' && selectedSlotIndices.length === 0) {
      syncPickedSlotsForLayout(layoutId, shots);
    }
    setStep(target);
  };

  const handleCopyInvite = async () => {
    if (!remote.roomCode) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${remote.roomCode}`;
    await navigator.clipboard.writeText(url);
    setCopiedInvite(true);
    window.setTimeout(() => setCopiedInvite(false), 2200);
  };

  const handleStartNewSession = () => {
    setShots([null, null, null, null, null, null]);
    setSelectedSlotIndices([]);
    setActiveSlot(0);
    setSlotPoses(pickInitialSlotPoses(posePack, 6));
    setStripStyle(DEFAULT_STYLE);
    setStep('frame');
  };

  const handlePointerMoveRoot = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== 'remote' || !remote.partner.connected || remote.partner.isDemo) {
      return;
    }
    const nx = e.clientX / Math.max(1, window.innerWidth);
    const ny = e.clientY / Math.max(1, window.innerHeight);
    remote.sendCursor(nx, ny);
  };

  return (
    <div
      onPointerMove={handlePointerMoveRoot}
      className="min-h-screen bg-[#FAF9F6] text-[#2C2627]"
    >
      {mode === 'remote' && <MultiplayerCursor partner={remote.partner} />}

      {!inBooth ? (
        <LandingScreen
          mode={mode}
          onChangeMode={handleChangeMode}
          posePack={posePack}
          onChangePosePack={handleChangePosePack}
          localName={localName}
          onChangeLocalName={setLocalName}
          localIsGroup={localIsGroup}
          onChangeLocalIsGroup={setLocalIsGroup}
          roomCode={remote.roomCode}
          roomStatus={remote.status}
          roomError={remote.error}
          partner={remote.partner}
          onCreateRoom={remote.createRoom}
          onJoinRoom={remote.joinRoom}
          onStartDemoPartner={remote.startDemoPartner}
          onCopyInvite={handleCopyInvite}
          copiedInvite={copiedInvite}
          onEnterBooth={() => {
            setInBooth(true);
            setStep('frame');
          }}
        />
      ) : (
        <div className="min-h-screen pb-12">
          <ProgressHeader
            currentStep={step}
            onSelectStep={handleSelectStep}
            canAccessStep={canAccessStep}
            mode={mode}
            roomCode={remote.roomCode}
            partner={remote.partner}
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
            onCopyInvite={handleCopyInvite}
            copiedInvite={copiedInvite}
            onExitToHome={() => setInBooth(false)}
          />

          <main>
            {step === 'frame' && (
              <FrameStep
                selectedLayout={layoutId}
                selectedCanvaTemplateId={stripStyle.canvaTemplateId}
                onSelectLayout={(nextLayout) => {
                  setLayoutId(nextLayout);
                  setStripStyle((prev) => ({ ...prev, canvaTemplateId: null }));
                  if (mode === 'remote' && remote.partner.connected && !remote.partner.isDemo) {
                    remote.sendMessage({ type: 'sync_settings', layoutId: nextLayout });
                  }
                }}
                onSelectCanvaTemplate={(tpl) => {
                  const mappedLayout: FrameLayoutId =
                    tpl.defaultGrid === 'pair-2' ? 'polaroid-2' : 'strip-4';
                  setLayoutId(mappedLayout);
                  setStripStyle((prev) => ({
                    ...prev,
                    canvaTemplateId: tpl.id,
                    canvaGrid: tpl.defaultGrid,
                  }));
                }}
                onContinue={() => setStep('shoot')}
              />
            )}

            {step === 'shoot' && (
              <ShootStep
                mode={mode}
                posePack={posePack}
                onChangePosePack={handleChangePosePack}
                slotPoses={slotPoses}
                onShufflePose={handleShufflePose}
                shots={shots}
                activeSlot={activeSlot}
                onSelectSlot={setActiveSlot}
                onCaptureSlot={handleCaptureSlot}
                localStream={camera.stream}
                isDemoCamera={camera.isDemo}
                cameraError={camera.error}
                onEnableDemoCamera={() => camera.enableDemoCamera(localName || 'You')}
                onRetryWebcam={camera.startCamera}
                remoteStream={remote.remoteStream}
                localName={localName}
                localIsGroup={localIsGroup}
                onToggleLocalIsGroup={() => setLocalIsGroup((g) => !g)}
                partner={remote.partner}
                onStartDemoPartner={remote.startDemoPartner}
                onBroadcastCountdown={(slotIndex, durationSec) => {
                  if (remote.partner.connected && !remote.partner.isDemo) {
                    remote.sendMessage({
                      type: 'start_countdown',
                      slotIndex,
                      durationSec,
                      startAt: Date.now(),
                    });
                  }
                }}
                incomingCountdownTrigger={incomingCountdown}
                muted={muted}
                requiredCount={layout.pickCount}
                onProceedToPick={handleProceedToPick}
              />
            )}

            {step === 'pick' && (
              <PickStep
                shots={shots}
                layoutId={layoutId}
                selectedSlotIndices={selectedSlotIndices}
                onToggleSlotSelection={handleToggleSlotSelection}
                onAutoPick={handleAutoPick}
                onBackToShoot={() => setStep('shoot')}
                onProceedToStyle={() => setStep('style')}
              />
            )}

            {step === 'style' && (
              <StyleStep
                shots={pickedShots}
                layoutId={layoutId}
                style={stripStyle}
                onChangeStyle={setStripStyle}
                onFinish={() => setStep('done')}
              />
            )}

            {step === 'done' && (
              <DoneStep
                shots={pickedShots}
                layoutId={layoutId}
                style={stripStyle}
                roomCode={remote.roomCode}
                onBackToStyle={() => setStep('style')}
                onStartNewSession={handleStartNewSession}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
