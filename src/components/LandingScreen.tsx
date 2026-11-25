import React, { useState } from 'react';
import {
  ArrowRight,
  Camera,
  Check,
  Copy,
  Heart,
  Link2,
  Sparkles,
  User,
  Users,
  Video,
} from 'lucide-react';
import type { BoothMode, PartnerState, PosePack } from '../types/booth';

interface LandingScreenProps {
  mode: BoothMode;
  onChangeMode: (mode: BoothMode) => void;
  posePack: PosePack;
  onChangePosePack: (pack: PosePack) => void;
  localName: string;
  onChangeLocalName: (name: string) => void;
  localIsGroup: boolean;
  onChangeLocalIsGroup: (isGroup: boolean) => void;
  roomCode: string | null;
  roomStatus: 'idle' | 'creating' | 'waiting' | 'connecting' | 'connected' | 'error';
  roomError: string | null;
  partner: PartnerState;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  onStartDemoPartner: () => void;
  onCopyInvite: () => void;
  copiedInvite: boolean;
  onEnterBooth: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  mode,
  onChangeMode,
  posePack,
  onChangePosePack,
  localName,
  onChangeLocalName,
  localIsGroup,
  onChangeLocalIsGroup,
  roomCode,
  roomStatus,
  roomError,
  partner,
  onCreateRoom,
  onJoinRoom,
  onStartDemoPartner,
  onCopyInvite,
  copiedInvite,
  onEnterBooth,
}) => {
  const [joinInput, setJoinInput] = useState(roomCode ?? '');

  const inviteUrl =
    typeof window !== 'undefined' && roomCode
      ? `${window.location.origin}${window.location.pathname}?room=${roomCode}`
      : '';

  return (
    <div className="bg-purikura-dots min-h-screen px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: Hero & Booth Setup Card */}
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F9C6D5] bg-[#FDE8EE] px-3.5 py-1 text-xs font-bold text-[#D96B84]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Purikura &amp; Life4Cuts Inspired Online Booth</span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#2C2627] sm:text-5xl">
            Cute photo strips,{' '}
            <span className="text-[#D96B84]">together or afar.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#7A6F72] sm:text-base">
            Step into a cozy digital photo booth with playful pose prompts, synchronized
            countdowns, cute stickers, and crisp printable strips — right next to each
            other or stitched side-by-side from two cities.
          </p>

          {/* Main Config Card */}
          <div className="mt-7 rounded-3xl border border-[#EAE3DC] bg-white p-5 shadow-sm sm:p-6">
            {/* 1. Booth Mode Selector */}
            <div>
              <label className="text-xs font-bold tracking-wider text-[#7A6F72] uppercase">
                1. Choose Booth Mode
              </label>
              <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onChangeMode('together')}
                  className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                    mode === 'together'
                      ? 'border-[#D96B84] bg-[#FDE8EE]/55 ring-2 ring-[#D96B84]/20'
                      : 'border-[#EAE3DC] bg-[#FAF9F6] hover:border-[#D96B84]/50'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#D96B84] shadow-2xs ring-1 ring-[#F9C6D5]">
                      <Camera className="h-4.5 w-4.5" />
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#D96B84] ring-1 ring-[#F9C6D5]">
                      Instant
                    </span>
                  </div>
                  <span className="font-display mt-3 text-base font-bold text-[#2C2627]">
                    Together (Same Device)
                  </span>
                  <span className="mt-1 text-xs leading-relaxed text-[#7A6F72]">
                    One webcam for friends or couples sitting side-by-side. Zero setup.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeMode('remote')}
                  className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                    mode === 'remote'
                      ? 'border-[#5B9BD5] bg-[#E8F2FC]/65 ring-2 ring-[#5B9BD5]/20'
                      : 'border-[#EAE3DC] bg-[#FAF9F6] hover:border-[#5B9BD5]/50'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#5B9BD5] shadow-2xs ring-1 ring-[#CBE0F7]">
                      <Video className="h-4.5 w-4.5" />
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#5B9BD5] ring-1 ring-[#CBE0F7]">
                      2 Devices
                    </span>
                  </div>
                  <span className="font-display mt-3 text-base font-bold text-[#2C2627]">
                    Remote Split-Screen
                  </span>
                  <span className="mt-1 text-xs leading-relaxed text-[#7A6F72]">
                    Share an invite link, see live cursors, and stitch both cameras side-by-side.
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Relationship / Pose Pack Selector */}
            <div className="mt-5">
              <label className="text-xs font-bold tracking-wider text-[#7A6F72] uppercase">
                2. Pose Prompt Vibe
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'friends', label: 'Besties / Friends', icon: Users },
                    { id: 'couples', label: 'Couples', icon: Heart },
                    { id: 'all', label: 'All / Mixed', icon: Sparkles },
                  ] as const
                ).map(({ id, label, icon: Icon }) => {
                  const active = posePack === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onChangePosePack(id)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                        active
                          ? 'border-[#D96B84] bg-[#FDE8EE] text-[#D96B84]'
                          : 'border-[#EAE3DC] bg-[#FAF9F6] text-[#7A6F72] hover:bg-[#F5EFE9] hover:text-[#2C2627]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Name & Hybrid / Remote Room Controls */}
            <div className="mt-5 rounded-2xl border border-[#EAE3DC] bg-[#FAF9F6] p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <label
                    htmlFor="booth-name"
                    className="block text-xs font-bold text-[#7A6F72]"
                  >
                    Your Booth Name Tag
                  </label>
                  <input
                    id="booth-name"
                    type="text"
                    maxLength={18}
                    value={localName}
                    onChange={(e) => onChangeLocalName(e.target.value)}
                    placeholder="e.g. Aiden"
                    className="mt-1 w-full rounded-xl border border-[#E3D9D0] bg-white px-3.5 py-2 text-sm font-semibold text-[#2C2627] outline-none transition focus:border-[#D96B84] focus:ring-2 focus:ring-[#FDE8EE]"
                  />
                </div>

                {mode === 'remote' && (
                  <button
                    type="button"
                    onClick={() => onChangeLocalIsGroup(!localIsGroup)}
                    className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                      localIsGroup
                        ? 'border-[#5B9BD5] bg-[#E8F2FC] text-[#3C76B0]'
                        : 'border-[#E3D9D0] bg-white text-[#7A6F72] hover:text-[#2C2627]'
                    }`}
                    title="Hybrid toggle: indicate if multiple friends are sharing your camera"
                  >
                    {localIsGroup ? (
                      <Users className="h-4 w-4 text-[#5B9BD5]" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span>{localIsGroup ? 'Group on my cam' : 'Solo on my cam'}</span>
                  </button>
                )}
              </div>

              {mode === 'remote' && (
                <div className="mt-4 space-y-3 border-t border-[#EAE3DC] pt-4">
                  {!roomCode ? (
                    <>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={onCreateRoom}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#5B9BD5] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#4B8BC7]"
                        >
                          <Link2 className="h-4 w-4" />
                          <span>Create Room &amp; Invite Link</span>
                        </button>
                        <button
                          type="button"
                          onClick={onStartDemoPartner}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D4E4F7] bg-white px-3.5 py-2.5 text-xs font-bold text-[#3C76B0] transition hover:bg-[#E8F2FC]"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Preview w/ Demo Partner</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={joinInput}
                          onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                          placeholder="Enter 6-letter room code"
                          maxLength={8}
                          className="font-mono-booth flex-1 rounded-xl border border-[#E3D9D0] bg-white px-3 py-2 text-xs font-bold tracking-wider text-[#2C2627] uppercase outline-none focus:border-[#5B9BD5]"
                        />
                        <button
                          type="button"
                          disabled={!joinInput.trim()}
                          onClick={() => onJoinRoom(joinInput)}
                          className="rounded-xl border border-[#EAE3DC] bg-white px-4 py-2 text-xs font-bold text-[#2C2627] transition hover:bg-[#F5EFE9] disabled:opacity-45"
                        >
                          Join Room
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2.5 rounded-xl border border-[#D4E4F7] bg-white p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              partner.connected
                                ? 'bg-emerald-500'
                                : 'animate-pulse bg-[#5B9BD5]'
                            }`}
                          />
                          <span className="text-xs font-bold text-[#2C2627]">
                            {partner.connected
                              ? partner.isDemo
                                ? `Demo Partner "${partner.name}" connected!`
                                : `${partner.name} joined your booth!`
                              : roomStatus === 'connecting'
                                ? `Joining room ${roomCode}...`
                                : `Waiting for partner in room ${roomCode}...`}
                          </span>
                        </div>
                        <span className="font-mono-booth rounded-lg bg-[#E8F2FC] px-2 py-0.5 text-xs font-bold text-[#3C76B0]">
                          {roomCode}
                        </span>
                      </div>

                      {!partner.isDemo && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={inviteUrl}
                            className="flex-1 truncate rounded-lg border border-[#EAE3DC] bg-[#FAF9F6] px-2.5 py-1.5 text-[11px] text-[#7A6F72]"
                          />
                          <button
                            type="button"
                            onClick={onCopyInvite}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#E8F2FC] px-3 py-1.5 text-xs font-bold text-[#3C76B0] hover:bg-[#D8EAFA]"
                          >
                            {copiedInvite ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {!partner.connected && (
                        <button
                          type="button"
                          onClick={onStartDemoPartner}
                          className="text-[11px] font-semibold text-[#5B9BD5] underline-offset-2 hover:underline"
                        >
                          Don’t have a second device handy? Test with Demo Partner instead
                        </button>
                      )}
                    </div>
                  )}

                  {roomError && (
                    <p className="rounded-xl bg-[#FDE8EE] px-3 py-2 text-xs font-medium text-[#B9435F]">
                      {roomError}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Enter Booth CTA */}
            <button
              type="button"
              onClick={onEnterBooth}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D96B84] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#C95C75] active:scale-[0.99]"
            >
              <span>
                {mode === 'remote' && !roomCode
                  ? 'Start Remote Booth (or Join Inside)'
                  : 'Open Photo Booth'}
              </span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Right: Decorative Life4Cuts Strip Preview */}
        <div className="flex justify-center">
          <div className="animate-float-gentle relative w-full max-w-[300px] rounded-[28px] border border-[#EAE3DC] bg-white p-4 shadow-xl">
            <div className="absolute -top-3 -right-3 rounded-full bg-[#D96B84] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
              4-CUT PREVIEW ♡
            </div>

            <div className="space-y-2.5 rounded-2xl bg-[#FDE8EE]/55 p-3">
              {[
                { left: 'Aiden', right: 'Angie', bgLeft: '#FFE3EC', bgRight: '#E1EFFD', label: '✌ peace!' },
                { left: 'Aiden', right: 'Angie', bgLeft: '#FFF0F4', bgRight: '#E8F2FC', label: '♡ heart!' },
                { left: 'Aiden', right: 'Angie', bgLeft: '#FFE8F0', bgRight: '#DDECFD', label: 'meow :3' },
              ].map((frame, idx) => (
                <div
                  key={idx}
                  className="relative grid h-24 grid-cols-2 overflow-hidden rounded-xl border border-white/80 bg-white shadow-2xs"
                >
                  <div
                    className="relative flex items-center justify-center"
                    style={{ backgroundColor: frame.bgLeft }}
                  >
                    <div className="h-10 w-10 rounded-full border-2 border-[#2C2627] bg-white" />
                    <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-[#D96B84]">
                      {frame.left}
                    </span>
                  </div>
                  <div
                    className="relative flex items-center justify-center border-l border-white/60"
                    style={{ backgroundColor: frame.bgRight }}
                  >
                    <div className="h-10 w-10 rounded-full border-2 border-[#2C2627] bg-white" />
                    <span className="absolute right-1.5 bottom-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-[#5B9BD5]">
                      {frame.right}
                    </span>
                  </div>
                  <span className="absolute top-1.5 right-1.5 rounded-full bg-white/85 px-2 py-0.5 text-[9px] font-bold text-[#7A6F72]">
                    {frame.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 text-center">
              <p className="font-hand text-xl font-bold text-[#2C2627]">
                sunday booth memories ♡
              </p>
              <p className="font-mono-booth text-[10px] tracking-widest text-[#8B7E81]">
                2026.11.25 · PURIKURA STUDIO
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
