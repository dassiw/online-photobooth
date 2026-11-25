export type BoothMode = 'together' | 'remote';

export type PosePack = 'friends' | 'couples' | 'all';

export type StepId = 'frame' | 'shoot' | 'pick' | 'style' | 'done';

export type FrameLayoutId = 'strip-4' | 'grid-6' | 'polaroid-2';

export type CanvaOverlayGridId = 'strip-4' | 'stack-3' | 'grid-2x2' | 'pair-2';

export type FilterId =
  | 'none'
  | 'soft-film'
  | 'warm-pastel'
  | 'bw'
  | 'dreamy-pink'
  | 'vintage';

export type FrameThemeId =
  | 'cream'
  | 'blush'
  | 'sky'
  | 'butter'
  | 'matcha'
  | 'lavender'
  | 'charcoal'
  | 'gingham-pink'
  | 'polka-blue';

export type CaptionFontId = 'sans' | 'hand' | 'mono';

export interface PosePrompt {
  id: string;
  pack: Exclude<PosePack, 'all'>;
  title: string;
  caption: string;
  artKey: string;
}

export interface CapturedShot {
  slotIndex: number;
  dataUrl: string;
  poseId: string;
  timestamp: number;
}

export interface PlacedSticker {
  uid: string;
  stickerId: string;
  /** Normalized horizontal coordinate [0..1] on the strip canvas */
  x: number;
  /** Normalized vertical coordinate [0..1] on the strip canvas */
  y: number;
  /** Relative scale multiplier */
  scale: number;
  /** Rotation in degrees */
  rotation: number;
}

export interface StripStyleConfig {
  theme: FrameThemeId;
  filter: FilterId;
  caption: string;
  captionFont: CaptionFontId;
  showDate: boolean;
  showBrandStamp: boolean;
  stickers: PlacedSticker[];
  canvaTemplateId: string | null;
  canvaGrid: CanvaOverlayGridId;
  canvaInset: number;
}

export interface PartnerState {
  name: string;
  isGroup: boolean;
  connected: boolean;
  isDemo: boolean;
  cursor: { x: number; y: number } | null;
}

export type RoomMessage =
  | { type: 'hello'; name: string; isGroup: boolean }
  | { type: 'cursor'; x: number; y: number }
  | {
      type: 'sync_settings';
      layoutId?: FrameLayoutId;
      posePack?: PosePack;
      isGroup?: boolean;
      name?: string;
    }
  | { type: 'pose_change'; slotIndex: number; poseId: string }
  | { type: 'start_countdown'; slotIndex: number; durationSec: number; startAt: number }
  | { type: 'shot_captured'; slotIndex: number; dataUrl: string; poseId: string }
  | { type: 'step_change'; step: StepId };
