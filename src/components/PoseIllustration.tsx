import React from 'react';

interface PoseIllustrationProps {
  artKey: string;
  className?: string;
}

/**
 * Cute, warm Korean/Japanese Purikura-style vector illustrations for all 16 pose prompts.
 * Uses pastel rose (#D96B84), sky blue (#5B9BD5), warm cream (#FAF9F6), and soft charcoal (#2C2627).
 */
export const PoseIllustration: React.FC<PoseIllustrationProps> = ({
  artKey,
  className = 'w-full h-full',
}) => {
  const renderScene = () => {
    switch (artKey) {
      case 'peace-sync':
        return (
          <>
            {/* Two happy besties doing synchronized peace signs */}
            <g transform="translate(88, 128)">
              <path d="M-34 52 C-34 18 34 18 34 52 Z" fill="#F9C6D5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="32" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <path d="M-32 -10 C-30 -36 30 -36 32 -10 C22 -24 -22 -24 -32 -10 Z" fill="#2C2627" />
              <circle cx="-11" cy="-2" r="3.2" fill="#2C2627" />
              <circle cx="11" cy="-2" r="3.2" fill="#2C2627" />
              <ellipse cx="-19" cy="6" rx="5.5" ry="3" fill="#F9C6D5" />
              <ellipse cx="19" cy="6" rx="5.5" ry="3" fill="#F9C6D5" />
              <path d="M-6 8 Q0 15 6 8" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              {/* Peace hand */}
              <g transform="translate(-40, 10) rotate(-14)">
                <rect x="-8" y="-4" width="16" height="16" rx="7" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3" />
                <line x1="-4" y1="-4" x2="-9" y2="-22" stroke="#2C2627" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="4" y1="-4" x2="9" y2="-22" stroke="#2C2627" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            </g>
            <g transform="translate(172, 128)">
              <path d="M-34 52 C-34 18 34 18 34 52 Z" fill="#B9D7F5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="32" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <path d="M-31 -8 C-28 -38 28 -38 31 -8 C16 -22 -16 -22 -31 -8 Z" fill="#4A3B3D" />
              <circle cx="-11" cy="-2" r="3.2" fill="#2C2627" />
              <path d="M7 -3 Q11 -7 15 -3" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="-19" cy="6" rx="5.5" ry="3" fill="#F9C6D5" />
              <ellipse cx="19" cy="6" rx="5.5" ry="3" fill="#F9C6D5" />
              <path d="M-6 8 Q0 15 6 8" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              {/* Peace hand */}
              <g transform="translate(40, 10) rotate(14)">
                <rect x="-8" y="-4" width="16" height="16" rx="7" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3" />
                <line x1="-4" y1="-4" x2="-9" y2="-22" stroke="#2C2627" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="4" y1="-4" x2="9" y2="-22" stroke="#2C2627" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            </g>
            <text x="130" y="54" textAnchor="middle" fontSize="22" fontWeight="700" fill="#D96B84">✌ ✌</text>
          </>
        );

      case 'chaotic-laugh':
        return (
          <>
            <g transform="translate(88, 128) rotate(-10)">
              <path d="M-32 50 C-32 18 32 18 32 50 Z" fill="#FFD166" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="31" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <path d="M-15 -4 L-7 0 L-15 4" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              <path d="M15 -4 L7 0 L15 4" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              <path d="M-10 10 Q0 24 10 10 Z" fill="#D96B84" stroke="#2C2627" strokeWidth="2.8" />
            </g>
            <g transform="translate(172, 132) rotate(11)">
              <path d="M-32 50 C-32 18 32 18 32 50 Z" fill="#F9C6D5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="31" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <path d="M-15 -4 L-7 0 L-15 4" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              <path d="M15 -4 L7 0 L15 4" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              <path d="M-10 10 Q0 24 10 10 Z" fill="#D96B84" stroke="#2C2627" strokeWidth="2.8" />
            </g>
            <text x="64" y="64" fontSize="16" fontWeight="800" fill="#D96B84">HAHA!</text>
            <text x="166" y="58" fontSize="16" fontWeight="800" fill="#5B9BD5">LOL!!</text>
          </>
        );

      case 'back-cool':
        return (
          <>
            <g transform="translate(96, 128)">
              <path d="M-30 52 C-30 16 26 16 26 52 Z" fill="#2C2627" />
              <circle cx="0" cy="-6" r="30" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              {/* Sunglasses */}
              <rect x="-24" y="-12" width="18" height="11" rx="3" fill="#2C2627" />
              <rect x="2" y="-12" width="18" height="11" rx="3" fill="#2C2627" />
              <line x1="-6" y1="-7" x2="2" y2="-7" stroke="#2C2627" strokeWidth="3" />
              <line x1="-6" y1="10" x2="6" y2="10" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
            </g>
            <g transform="translate(164, 128)">
              <path d="M-26 52 C-26 16 30 16 30 52 Z" fill="#5B9BD5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="30" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <rect x="-20" y="-12" width="18" height="11" rx="3" fill="#2C2627" />
              <rect x="6" y="-12" width="18" height="11" rx="3" fill="#2C2627" />
              <line x1="-2" y1="-7" x2="6" y2="-7" stroke="#2C2627" strokeWidth="3" />
              <line x1="-5" y1="10" x2="7" y2="10" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
            </g>
            <text x="130" y="54" textAnchor="middle" fontSize="14" fontWeight="700" fill="#7A6F72">★ TOO COOL ★</text>
          </>
        );

      case 'cheek-heart':
        return (
          <>
            <g transform="translate(88, 128)">
              <path d="M-32 52 C-32 18 32 18 32 52 Z" fill="#F9C6D5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="32" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-11" cy="-4" r="3" fill="#2C2627" />
              <circle cx="11" cy="-4" r="3" fill="#2C2627" />
              <ellipse cx="-18" cy="5" rx="7" ry="4" fill="#F9C6D5" />
              <ellipse cx="18" cy="5" rx="7" ry="4" fill="#F9C6D5" />
              <path d="M-5 8 Q0 13 5 8" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
              {/* Half heart hands on cheeks */}
              <path d="M-32 4 C-38 -6 -24 -12 -22 0" fill="none" stroke="#D96B84" strokeWidth="4" strokeLinecap="round" />
              <path d="M32 4 C38 -6 24 -12 22 0" fill="none" stroke="#D96B84" strokeWidth="4" strokeLinecap="round" />
            </g>
            <g transform="translate(172, 128)">
              <path d="M-32 52 C-32 18 32 18 32 52 Z" fill="#B9D7F5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="32" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-11" cy="-4" r="3" fill="#2C2627" />
              <circle cx="11" cy="-4" r="3" fill="#2C2627" />
              <ellipse cx="-18" cy="5" rx="7" ry="4" fill="#F9C6D5" />
              <ellipse cx="18" cy="5" rx="7" ry="4" fill="#F9C6D5" />
              <path d="M-5 8 Q0 13 5 8" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M-32 4 C-38 -6 -24 -12 -22 0" fill="none" stroke="#5B9BD5" strokeWidth="4" strokeLinecap="round" />
              <path d="M32 4 C38 -6 24 -12 22 0" fill="none" stroke="#5B9BD5" strokeWidth="4" strokeLinecap="round" />
            </g>
          </>
        );

      case 'two-cats':
      case 'cats-nuzzle': {
        const nuzzle = artKey === 'cats-nuzzle';
        return (
          <>
            {/* Cute kitty 1 */}
            <g transform={`translate(${nuzzle ? 98 : 88}, 126) rotate(${nuzzle ? 8 : -4})`}>
              <polygon points="-26,-22 -30,-52 -6,-34" fill="#FFFFFF" stroke="#2C2627" strokeWidth="3.5" strokeLinejoin="round" />
              <polygon points="26,-22 30,-52 6,-34" fill="#FFFFFF" stroke="#2C2627" strokeWidth="3.5" strokeLinejoin="round" />
              <polygon points="-22,-25 -25,-44 -10,-33" fill="#F9C6D5" />
              <polygon points="22,-25 25,-44 10,-33" fill="#F9C6D5" />
              <ellipse cx="0" cy="0" rx="34" ry="29" fill="#FFFFFF" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-12" cy="-2" r="3.2" fill="#2C2627" />
              <circle cx="12" cy="-2" r="3.2" fill="#2C2627" />
              <ellipse cx="-20" cy="6" rx="5" ry="3" fill="#F9C6D5" />
              <ellipse cx="20" cy="6" rx="5" ry="3" fill="#F9C6D5" />
              <path d="M-5 6 Q0 11 5 6" fill="none" stroke="#2C2627" strokeWidth="2.5" strokeLinecap="round" />
              {!nuzzle && (
                <>
                  <circle cx="-24" cy="30" r="10" fill="#FFFFFF" stroke="#2C2627" strokeWidth="3" />
                  <circle cx="24" cy="30" r="10" fill="#FFFFFF" stroke="#2C2627" strokeWidth="3" />
                </>
              )}
            </g>
            {/* Cute kitty 2 */}
            <g transform={`translate(${nuzzle ? 162 : 172}, 128) rotate(${nuzzle ? -8 : 4})`}>
              <polygon points="-26,-22 -30,-52 -6,-34" fill="#FFF4E6" stroke="#2C2627" strokeWidth="3.5" strokeLinejoin="round" />
              <polygon points="26,-22 30,-52 6,-34" fill="#FFF4E6" stroke="#2C2627" strokeWidth="3.5" strokeLinejoin="round" />
              <polygon points="-22,-25 -25,-44 -10,-33" fill="#B9D7F5" />
              <polygon points="22,-25 25,-44 10,-33" fill="#B9D7F5" />
              <ellipse cx="0" cy="0" rx="34" ry="29" fill="#FFF4E6" stroke="#2C2627" strokeWidth="3.5" />
              <path d="M-16 -2 Q-12 -6 -8 -2" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              <path d="M8 -2 Q12 -6 16 -2" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="-20" cy="6" rx="5" ry="3" fill="#F9C6D5" />
              <ellipse cx="20" cy="6" rx="5" ry="3" fill="#F9C6D5" />
              <path d="M-5 6 Q0 11 5 6" fill="none" stroke="#2C2627" strokeWidth="2.5" strokeLinecap="round" />
              {!nuzzle && (
                <>
                  <circle cx="-24" cy="30" r="10" fill="#FFF4E6" stroke="#2C2627" strokeWidth="3" />
                  <circle cx="24" cy="30" r="10" fill="#FFF4E6" stroke="#2C2627" strokeWidth="3" />
                </>
              )}
            </g>
            {nuzzle && (
              <path
                d="M130 66 C130 66 116 56 116 47 C116 42 120 39 124 39 C127 39 129 41 130 43 C131 41 133 39 136 39 C140 39 144 42 144 47 C144 56 130 66 130 66 Z"
                fill="#D96B84"
              />
            )}
          </>
        );
      }

      case 'finger-guns':
        return (
          <>
            <g transform="translate(88, 128)">
              <path d="M-32 52 C-32 18 32 18 32 52 Z" fill="#F9C6D5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="31" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <path d="M-15 -3 Q-10 -8 -5 -3" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              <circle cx="11" cy="-3" r="3" fill="#2C2627" />
              <path d="M-5 9 Q2 15 9 8" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
              {/* Finger gun */}
              <path d="M28 18 L52 10 M30 18 L34 2" stroke="#2C2627" strokeWidth="4" strokeLinecap="round" />
            </g>
            <g transform="translate(172, 128)">
              <path d="M-32 52 C-32 18 32 18 32 52 Z" fill="#B9D7F5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="31" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-11" cy="-3" r="3" fill="#2C2627" />
              <path d="M5 -3 Q10 -8 15 -3" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              <path d="M-9 8 Q-2 15 5 9" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M-28 18 L-52 10 M-30 18 L-34 2" stroke="#2C2627" strokeWidth="4" strokeLinecap="round" />
            </g>
            <text x="130" y="54" textAnchor="middle" fontSize="15" fontWeight="800" fill="#D96B84">PEW! PEW!</text>
          </>
        );

      case 'dramatic-gasp':
        return (
          <>
            <g transform="translate(88, 128)">
              <path d="M-32 52 C-32 18 32 18 32 52 Z" fill="#E8F2FC" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="31" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-11" cy="-5" r="4" fill="#2C2627" />
              <circle cx="11" cy="-5" r="4" fill="#2C2627" />
              <ellipse cx="0" cy="11" rx="7" ry="9" fill="#D96B84" stroke="#2C2627" strokeWidth="2.8" />
              <circle cx="-22" cy="18" r="8" fill="#FFFDF9" stroke="#2C2627" strokeWidth="2.8" />
              <circle cx="22" cy="18" r="8" fill="#FFFDF9" stroke="#2C2627" strokeWidth="2.8" />
            </g>
            <g transform="translate(172, 128)">
              <path d="M-32 52 C-32 18 32 18 32 52 Z" fill="#FDE8EE" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="31" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-11" cy="-5" r="4" fill="#2C2627" />
              <circle cx="11" cy="-5" r="4" fill="#2C2627" />
              <ellipse cx="0" cy="11" rx="7" ry="9" fill="#D96B84" stroke="#2C2627" strokeWidth="2.8" />
              <circle cx="-22" cy="18" r="8" fill="#FFFDF9" stroke="#2C2627" strokeWidth="2.8" />
              <circle cx="22" cy="18" r="8" fill="#FFFDF9" stroke="#2C2627" strokeWidth="2.8" />
            </g>
            <text x="130" y="54" textAnchor="middle" fontSize="22" fontWeight="800" fill="#D96B84">OMG?! !!</text>
          </>
        );

      case 'bunny-ears':
        return (
          <>
            <g transform="translate(88, 130)">
              <path d="M-32 50 C-32 18 32 18 32 50 Z" fill="#F9C6D5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="31" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-11" cy="-3" r="3" fill="#2C2627" />
              <circle cx="11" cy="-3" r="3" fill="#2C2627" />
              <path d="M-6 8 Q0 14 6 8" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
              {/* Sneaky hand reaching over to give bunny ears */}
              <path d="M34 4 Q62 -46 72 -58 M66 -38 L82 -60" stroke="#2C2627" strokeWidth="4" strokeLinecap="round" />
            </g>
            <g transform="translate(172, 130)">
              <path d="M-32 50 C-32 18 32 18 32 50 Z" fill="#B9D7F5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="31" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-11" cy="-3" r="3" fill="#2C2627" />
              <circle cx="11" cy="-3" r="3" fill="#2C2627" />
              <path d="M-6 8 Q0 14 6 8" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
            </g>
          </>
        );

      case 'half-heart':
        return (
          <>
            {/* Giant pink heart bridged between two characters */}
            <path
              d="M130 108 C130 108 86 78 86 52 C86 38 97 29 109 29 C118 29 125 34 130 42 C135 34 142 29 151 29 C163 29 174 38 174 52 C174 78 130 108 130 108 Z"
              fill="#FDE8EE"
              stroke="#D96B84"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            <g transform="translate(82, 134)">
              <path d="M-30 48 C-30 18 30 18 30 48 Z" fill="#F9C6D5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="29" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-9" cy="-4" r="3" fill="#2C2627" />
              <circle cx="10" cy="-4" r="3" fill="#2C2627" />
              <path d="M-4 7 Q1 12 6 7" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
            </g>
            <g transform="translate(178, 134)">
              <path d="M-30 48 C-30 18 30 18 30 48 Z" fill="#B9D7F5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="29" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-10" cy="-4" r="3" fill="#2C2627" />
              <circle cx="9" cy="-4" r="3" fill="#2C2627" />
              <path d="M-6 7 Q-1 12 4 7" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
            </g>
          </>
        );

      case 'lean-away':
        return (
          <>
            <g transform="translate(106, 128) rotate(12)">
              <path d="M-30 52 C-30 18 30 18 30 52 Z" fill="#F9C6D5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="30" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-14" cy="-3" r="3" fill="#2C2627" />
              <circle cx="6" cy="-3" r="3" fill="#2C2627" />
              <ellipse cx="-18" cy="6" rx="5" ry="3" fill="#F9C6D5" />
              <path d="M-8 8 Q-2 13 4 8" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
            </g>
            <g transform="translate(162, 130) rotate(-3)">
              <path d="M-30 52 C-30 18 30 18 30 52 Z" fill="#B9D7F5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="30" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-7" cy="-3" r="3" fill="#2C2627" />
              <circle cx="13" cy="-3" r="3" fill="#2C2627" />
              <ellipse cx="18" cy="6" rx="5" ry="3" fill="#F9C6D5" />
              <path d="M-4 8 Q2 13 8 8" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
            </g>
            <text x="130" y="54" textAnchor="middle" fontSize="18" fill="#D96B84">♡ ~</text>
          </>
        );

      case 'forehead-boop':
        return (
          <>
            <g transform="translate(102, 128) rotate(14)">
              <path d="M-28 52 C-28 18 28 18 28 52 Z" fill="#F9C6D5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="29" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <path d="M-4 -4 Q2 -9 8 -4" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              <path d="M-2 8 Q4 13 10 8" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
            </g>
            <g transform="translate(158, 128) rotate(-14)">
              <path d="M-28 52 C-28 18 28 18 28 52 Z" fill="#B9D7F5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="29" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <path d="M-8 -4 Q-2 -9 4 -4" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              <path d="M-10 8 Q-4 13 2 8" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
            </g>
            <text x="130" y="64" textAnchor="middle" fontSize="16" fontWeight="700" fill="#D96B84">boop! ♥</text>
          </>
        );

      case 'chin-rest':
      case 'cheek-squish':
      case 'mirror-tilt':
      case 'side-wink':
      default: {
        const tilt = artKey === 'mirror-tilt' ? 12 : 6;
        return (
          <>
            <g transform={`translate(90, 130) rotate(-${tilt})`}>
              <path d="M-32 50 C-32 18 32 18 32 50 Z" fill="#F9C6D5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="31" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-10" cy="-3" r="3" fill="#2C2627" />
              {artKey === 'side-wink' ? (
                <path d="M6 -3 Q11 -8 16 -3" fill="none" stroke="#2C2627" strokeWidth="3" strokeLinecap="round" />
              ) : (
                <circle cx="10" cy="-3" r="3" fill="#2C2627" />
              )}
              <ellipse cx="-18" cy="5" rx="6" ry="3.5" fill="#F9C6D5" />
              <ellipse cx="18" cy="5" rx="6" ry="3.5" fill="#F9C6D5" />
              <path d="M-6 8 Q0 14 6 8" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
              {/* Cute hands under chin / on cheeks */}
              <circle cx="-16" cy="22" r="7.5" fill="#FFFDF9" stroke="#2C2627" strokeWidth="2.8" />
              <circle cx="16" cy="22" r="7.5" fill="#FFFDF9" stroke="#2C2627" strokeWidth="2.8" />
            </g>
            <g transform={`translate(170, 130) rotate(${tilt})`}>
              <path d="M-32 50 C-32 18 32 18 32 50 Z" fill="#B9D7F5" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="0" cy="-6" r="31" fill="#FFFDF9" stroke="#2C2627" strokeWidth="3.5" />
              <circle cx="-10" cy="-3" r="3" fill="#2C2627" />
              <circle cx="10" cy="-3" r="3" fill="#2C2627" />
              <ellipse cx="-18" cy="5" rx="6" ry="3.5" fill="#F9C6D5" />
              <ellipse cx="18" cy="5" rx="6" ry="3.5" fill="#F9C6D5" />
              <path d="M-6 8 Q0 14 6 8" fill="none" stroke="#2C2627" strokeWidth="2.8" strokeLinecap="round" />
              <circle cx="-16" cy="22" r="7.5" fill="#FFFDF9" stroke="#2C2627" strokeWidth="2.8" />
              <circle cx="16" cy="22" r="7.5" fill="#FFFDF9" stroke="#2C2627" strokeWidth="2.8" />
            </g>
            <text x="130" y="54" textAnchor="middle" fontSize="18" fontWeight="700" fill="#5B9BD5">✦ ♡ ✦</text>
          </>
        );
      }
    }
  };

  return (
    <svg viewBox="0 0 260 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="poseBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF7F9" />
          <stop offset="100%" stopColor="#F0F7FF" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="260" height="200" rx="22" fill="url(#poseBg)" />
      {/* Decorative soft stars */}
      <circle cx="32" cy="34" r="5" fill="#F9C6D5" />
      <circle cx="228" cy="38" r="6" fill="#B9D7F5" />
      <circle cx="220" cy="166" r="4" fill="#FFD166" />
      {renderScene()}
    </svg>
  );
};
