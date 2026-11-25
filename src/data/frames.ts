import type {
  FilterId,
  FrameLayoutId,
  FrameThemeId,
} from '../types/booth';

export interface FrameLayoutSpec {
  id: FrameLayoutId;
  name: string;
  subtitle: string;
  badge: string;
  cols: number;
  rows: number;
  pickCount: number;
  width: number;
  height: number;
  paddingX: number;
  paddingTop: number;
  paddingBottom: number;
  gap: number;
  cornerRadius: number;
}

export const FRAME_LAYOUTS: Record<FrameLayoutId, FrameLayoutSpec> = {
  'strip-4': {
    id: 'strip-4',
    name: '4-Cut Vertical Strip',
    subtitle: 'Classic Life4Cuts tall photo strip',
    badge: '4 photos',
    cols: 1,
    rows: 4,
    pickCount: 4,
    width: 600,
    height: 1760,
    paddingX: 44,
    paddingTop: 52,
    paddingBottom: 170,
    gap: 24,
    cornerRadius: 18,
  },
  'grid-6': {
    id: 'grid-6',
    name: '6-Cut 2×3 Grid',
    subtitle: 'Postcard sheet with all six moments',
    badge: '6 photos',
    cols: 2,
    rows: 3,
    pickCount: 6,
    width: 1000,
    height: 1360,
    paddingX: 52,
    paddingTop: 56,
    paddingBottom: 168,
    gap: 24,
    cornerRadius: 20,
  },
  'polaroid-2': {
    id: 'polaroid-2',
    name: '2-Cut Polaroid',
    subtitle: 'Chunky instant print with extra note space',
    badge: '2 photos',
    cols: 1,
    rows: 2,
    pickCount: 2,
    width: 720,
    height: 1220,
    paddingX: 56,
    paddingTop: 56,
    paddingBottom: 220,
    gap: 28,
    cornerRadius: 20,
  },
};

export interface FrameThemeSpec {
  id: FrameThemeId;
  name: string;
  bg: string;
  swatch: string;
  textColor: string;
  mutedTextColor: string;
  pattern?: 'gingham-pink' | 'polka-blue';
}

export const FRAME_THEMES: FrameThemeSpec[] = [
  {
    id: 'cream',
    name: 'Warm Cream',
    bg: '#FFFDF9',
    swatch: '#FFFDF9',
    textColor: '#2C2627',
    mutedTextColor: '#8B7E81',
  },
  {
    id: 'blush',
    name: 'Blush Rose',
    bg: '#FDE8EE',
    swatch: '#F9C6D5',
    textColor: '#692C3B',
    mutedTextColor: '#A65B6E',
  },
  {
    id: 'sky',
    name: 'Sky Milk',
    bg: '#E8F2FC',
    swatch: '#B9D7F5',
    textColor: '#24466B',
    mutedTextColor: '#5B7FA6',
  },
  {
    id: 'butter',
    name: 'Butter Cream',
    bg: '#FFF5D6',
    swatch: '#FCE59B',
    textColor: '#5B4920',
    mutedTextColor: '#957C3E',
  },
  {
    id: 'matcha',
    name: 'Matcha Latte',
    bg: '#E8F3E5',
    swatch: '#C2DEC0',
    textColor: '#2D4B2B',
    mutedTextColor: '#60845D',
  },
  {
    id: 'lavender',
    name: 'Lilac Mist',
    bg: '#F1EBFA',
    swatch: '#D7C4F2',
    textColor: '#453166',
    mutedTextColor: '#7A639E',
  },
  {
    id: 'charcoal',
    name: 'Film Noir',
    bg: '#242021',
    swatch: '#242021',
    textColor: '#FAF9F6',
    mutedTextColor: '#B8AEB1',
  },
  {
    id: 'gingham-pink',
    name: 'Pink Gingham',
    bg: '#FFF6F8',
    swatch: '#F9C6D5',
    textColor: '#732F41',
    mutedTextColor: '#A75E71',
    pattern: 'gingham-pink',
  },
  {
    id: 'polka-blue',
    name: 'Sky Polka',
    bg: '#EEF6FF',
    swatch: '#B9D7F5',
    textColor: '#264970',
    mutedTextColor: '#5E83AC',
    pattern: 'polka-blue',
  },
];

export interface FilterSpec {
  id: FilterId;
  name: string;
  cssFilter: string;
  previewBg: string;
}

export const PHOTO_FILTERS: FilterSpec[] = [
  {
    id: 'none',
    name: 'Original',
    cssFilter: 'none',
    previewBg: 'linear-gradient(135deg, #F8FAFC, #E2E8F0)',
  },
  {
    id: 'soft-film',
    name: 'Soft Film',
    cssFilter: 'contrast(0.95) brightness(1.06) saturate(0.88) sepia(0.08)',
    previewBg: 'linear-gradient(135deg, #FDE8EE, #F5EBE0)',
  },
  {
    id: 'warm-pastel',
    name: 'Warm Pastel',
    cssFilter: 'brightness(1.09) contrast(0.92) saturate(1.12) sepia(0.12)',
    previewBg: 'linear-gradient(135deg, #FFF3D6, #FBD5DF)',
  },
  {
    id: 'dreamy-pink',
    name: 'Dreamy Rose',
    cssFilter: 'brightness(1.08) contrast(0.96) saturate(1.15) hue-rotate(-6deg)',
    previewBg: 'linear-gradient(135deg, #FDE2EA, #E8F2FC)',
  },
  {
    id: 'bw',
    name: 'Clean B&W',
    cssFilter: 'grayscale(1) contrast(1.12) brightness(1.04)',
    previewBg: 'linear-gradient(135deg, #4A4446, #D8D4D5)',
  },
  {
    id: 'vintage',
    name: 'Retro 90s',
    cssFilter: 'sepia(0.28) contrast(1.06) brightness(0.98) saturate(0.9)',
    previewBg: 'linear-gradient(135deg, #E8D5B7, #C9A98D)',
  },
];

export interface StickerDef {
  id: string;
  label: string;
  svg: string;
  aspect: number; // width / height
}

export const STICKERS: StickerDef[] = [
  {
    id: 'sparkle',
    label: 'Sparkle',
    aspect: 1,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <path d="M60 8 L70 46 L108 56 L70 66 L60 104 L50 66 L12 56 L50 46 Z" fill="#FFD166" stroke="#2C2627" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="96" cy="24" r="7" fill="#D96B84"/>
      <circle cx="24" cy="92" r="5" fill="#5B9BD5"/>
    </svg>`,
  },
  {
    id: 'heart-rose',
    label: 'Rose Heart',
    aspect: 1,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <path d="M60 102 C60 102 14 73 14 42 C14 24 28 14 43 14 C52 14 57 19 60 25 C63 19 68 14 77 14 C92 14 106 24 106 42 C106 73 60 102 60 102 Z" fill="#D96B84" stroke="#2C2627" stroke-width="5" stroke-linejoin="round"/>
      <path d="M33 34 C33 27 39 24 44 24" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'ribbon-bow',
    label: 'Ribbon Bow',
    aspect: 1.25,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="120" viewBox="0 0 150 120">
      <path d="M68 60 L22 25 C12 38 12 72 22 85 Z" fill="#F6A5B8" stroke="#2C2627" stroke-width="5" stroke-linejoin="round"/>
      <path d="M82 60 L128 25 C138 38 138 72 128 85 Z" fill="#F6A5B8" stroke="#2C2627" stroke-width="5" stroke-linejoin="round"/>
      <path d="M66 66 L44 108 L60 102 L72 72 Z" fill="#D96B84" stroke="#2C2627" stroke-width="4" stroke-linejoin="round"/>
      <path d="M84 66 L106 108 L90 102 L78 72 Z" fill="#D96B84" stroke="#2C2627" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="75" cy="58" r="14" fill="#D96B84" stroke="#2C2627" stroke-width="5"/>
    </svg>`,
  },
  {
    id: 'cat-ears',
    label: 'Kitty Ears',
    aspect: 1.5,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="120" viewBox="0 0 180 120">
      <path d="M20 100 L35 20 L78 74 Z" fill="#FFFFFF" stroke="#2C2627" stroke-width="5" stroke-linejoin="round"/>
      <path d="M31 84 L40 38 L64 70 Z" fill="#F9C6D5"/>
      <path d="M160 100 L145 20 L102 74 Z" fill="#FFFFFF" stroke="#2C2627" stroke-width="5" stroke-linejoin="round"/>
      <path d="M149 84 L140 38 L116 70 Z" fill="#F9C6D5"/>
    </svg>`,
  },
  {
    id: 'cherry',
    label: 'Cherries',
    aspect: 1,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <path d="M38 76 C44 42 58 26 70 16" fill="none" stroke="#4D8B55" stroke-width="5" stroke-linecap="round"/>
      <path d="M82 80 C78 46 72 30 70 16" fill="none" stroke="#4D8B55" stroke-width="5" stroke-linecap="round"/>
      <path d="M70 16 C86 12 96 20 92 32 C80 34 72 28 70 16 Z" fill="#77B87E" stroke="#2C2627" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="36" cy="84" r="20" fill="#E35D76" stroke="#2C2627" stroke-width="5"/>
      <circle cx="82" cy="86" r="20" fill="#E35D76" stroke="#2C2627" stroke-width="5"/>
      <circle cx="29" cy="77" r="4" fill="#FFFFFF"/>
      <circle cx="75" cy="79" r="4" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: 'star-sky',
    label: 'Sky Star',
    aspect: 1,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <path d="M60 12 L73 42 L106 45 L81 67 L89 100 L60 82 L31 100 L39 67 L14 45 L47 42 Z" fill="#5B9BD5" stroke="#2C2627" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="51" cy="56" r="4" fill="#2C2627"/>
      <circle cx="69" cy="56" r="4" fill="#2C2627"/>
      <path d="M55 66 Q60 71 65 66" fill="none" stroke="#2C2627" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'flower',
    label: 'Daisy',
    aspect: 1,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="26" r="18" fill="#FFFFFF" stroke="#2C2627" stroke-width="4"/>
      <circle cx="92" cy="48" r="18" fill="#FFFFFF" stroke="#2C2627" stroke-width="4"/>
      <circle cx="80" cy="86" r="18" fill="#FFFFFF" stroke="#2C2627" stroke-width="4"/>
      <circle cx="40" cy="86" r="18" fill="#FFFFFF" stroke="#2C2627" stroke-width="4"/>
      <circle cx="28" cy="48" r="18" fill="#FFFFFF" stroke="#2C2627" stroke-width="4"/>
      <circle cx="60" cy="60" r="19" fill="#FFD166" stroke="#2C2627" stroke-width="4"/>
      <circle cx="54" cy="57" r="2.8" fill="#2C2627"/>
      <circle cx="66" cy="57" r="2.8" fill="#2C2627"/>
      <path d="M56 64 Q60 68 64 64" fill="none" stroke="#2C2627" stroke-width="2.8" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'crown',
    label: 'Mini Crown',
    aspect: 1.33,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120">
      <path d="M22 96 L16 36 L52 60 L80 20 L108 60 L144 36 L138 96 Z" fill="#FFD166" stroke="#2C2627" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="80" cy="18" r="7" fill="#D96B84" stroke="#2C2627" stroke-width="3.5"/>
      <circle cx="16" cy="34" r="6" fill="#5B9BD5" stroke="#2C2627" stroke-width="3.5"/>
      <circle cx="144" cy="34" r="6" fill="#5B9BD5" stroke="#2C2627" stroke-width="3.5"/>
    </svg>`,
  },
  {
    id: 'paw',
    label: 'Kitty Paw',
    aspect: 1,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <ellipse cx="60" cy="76" rx="28" ry="22" fill="#FFFFFF" stroke="#2C2627" stroke-width="5"/>
      <ellipse cx="26" cy="48" rx="11" ry="14" transform="rotate(-18 26 48)" fill="#FFFFFF" stroke="#2C2627" stroke-width="4.5"/>
      <ellipse cx="49" cy="30" rx="11" ry="15" transform="rotate(-5 49 30)" fill="#FFFFFF" stroke="#2C2627" stroke-width="4.5"/>
      <ellipse cx="73" cy="30" rx="11" ry="15" transform="rotate(5 73 30)" fill="#FFFFFF" stroke="#2C2627" stroke-width="4.5"/>
      <ellipse cx="94" cy="48" rx="11" ry="14" transform="rotate(18 94 48)" fill="#FFFFFF" stroke="#2C2627" stroke-width="4.5"/>
      <ellipse cx="60" cy="78" rx="14" ry="10" fill="#F9C6D5"/>
    </svg>`,
  },
  {
    id: 'blush',
    label: 'Blush Cheeks',
    aspect: 1.8,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="100" viewBox="0 0 180 100">
      <ellipse cx="45" cy="50" rx="34" ry="20" fill="#F6A5B8" fill-opacity="0.72"/>
      <ellipse cx="135" cy="50" rx="34" ry="20" fill="#F6A5B8" fill-opacity="0.72"/>
      <line x1="34" y1="42" x2="28" y2="58" stroke="#D96B84" stroke-width="4" stroke-linecap="round"/>
      <line x1="50" y1="42" x2="44" y2="58" stroke="#D96B84" stroke-width="4" stroke-linecap="round"/>
      <line x1="126" y1="42" x2="120" y2="58" stroke="#D96B84" stroke-width="4" stroke-linecap="round"/>
      <line x1="142" y1="42" x2="136" y2="58" stroke="#D96B84" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'pill-cute',
    label: 'cute!',
    aspect: 2.2,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="100" viewBox="0 0 220 100">
      <rect x="8" y="14" width="204" height="72" rx="36" fill="#FDE8EE" stroke="#D96B84" stroke-width="6"/>
      <text x="110" y="63" text-anchor="middle" font-family="Quicksand, Arial, sans-serif" font-weight="700" font-size="38" fill="#D96B84">cute! ♡</text>
    </svg>`,
  },
  {
    id: 'pill-besties',
    label: 'besties',
    aspect: 2.3,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="230" height="100" viewBox="0 0 230 100">
      <rect x="8" y="14" width="214" height="72" rx="36" fill="#E8F2FC" stroke="#5B9BD5" stroke-width="6"/>
      <text x="115" y="62" text-anchor="middle" font-family="Quicksand, Arial, sans-serif" font-weight="700" font-size="36" fill="#3D7CB8">besties ★</text>
    </svg>`,
  },
  {
    id: 'pill-love',
    label: 'love ya',
    aspect: 2.2,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="100" viewBox="0 0 220 100">
      <rect x="8" y="14" width="204" height="72" rx="36" fill="#FFFFFF" stroke="#2C2627" stroke-width="6"/>
      <text x="110" y="62" text-anchor="middle" font-family="Quicksand, Arial, sans-serif" font-weight="700" font-size="36" fill="#2C2627">love ya ♥</text>
    </svg>`,
  },
  {
    id: 'stamp-film',
    label: 'PURIKURA',
    aspect: 2.2,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="100" viewBox="0 0 220 100">
      <rect x="10" y="16" width="200" height="68" rx="14" fill="none" stroke="#D96B84" stroke-width="6" stroke-dasharray="10 6"/>
      <text x="110" y="60" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="28" fill="#D96B84">PURIKURA</text>
    </svg>`,
  },
];

export function stickerToDataUri(sticker: StickerDef): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sticker.svg)}`;
}
