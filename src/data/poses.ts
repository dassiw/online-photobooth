import type { PosePack, PosePrompt } from '../types/booth';

export const POSE_PROMPTS: PosePrompt[] = [
  // Besties / Friends
  {
    id: 'friends-peace',
    pack: 'friends',
    title: 'Synchronized Peace',
    caption: 'synchronized peace signs on three!',
    artKey: 'peace-sync',
  },
  {
    id: 'friends-laugh',
    pack: 'friends',
    title: 'Chaotic Laugh',
    caption: 'chaotic laughing pose — look at each other!',
    artKey: 'chaotic-laugh',
  },
  {
    id: 'friends-cool',
    pack: 'friends',
    title: 'Back-to-Back Cool',
    caption: 'back-to-back cool pose, zero smiling allowed',
    artKey: 'back-cool',
  },
  {
    id: 'friends-cheek-heart',
    pack: 'friends',
    title: 'Double Cheek Heart',
    caption: 'double cheek heart + squishy cheeks',
    artKey: 'cheek-heart',
  },
  {
    id: 'friends-cats',
    pack: 'friends',
    title: 'Purr-fect Cats',
    caption: 'pretend to be grumpy kitties with paws up',
    artKey: 'two-cats',
  },
  {
    id: 'friends-finger-guns',
    pack: 'friends',
    title: 'Finger Guns',
    caption: 'double finger guns & dramatic wink',
    artKey: 'finger-guns',
  },
  {
    id: 'friends-gasp',
    pack: 'friends',
    title: 'Dramatic Gasp',
    caption: 'act like you just heard the wildest gossip',
    artKey: 'dramatic-gasp',
  },
  {
    id: 'friends-bunny',
    pack: 'friends',
    title: 'Bunny Ears',
    caption: 'sneaky bunny ears behind their head',
    artKey: 'bunny-ears',
  },

  // Couples
  {
    id: 'couples-lean',
    pack: 'couples',
    title: 'Shy Lean',
    caption: 'lean on them, look away casually',
    artKey: 'lean-away',
  },
  {
    id: 'couples-heart',
    pack: 'couples',
    title: 'Two-Half Heart',
    caption: 'make one giant heart together across the frame',
    artKey: 'half-heart',
  },
  {
    id: 'couples-boop',
    pack: 'couples',
    title: 'Forehead Boop',
    caption: 'gentle forehead boop (or nose boop towards center!)',
    artKey: 'forehead-boop',
  },
  {
    id: 'couples-chin',
    pack: 'couples',
    title: 'Sweet Chin Rest',
    caption: 'chin rest on hands & softest smile',
    artKey: 'chin-rest',
  },
  {
    id: 'couples-squish',
    pack: 'couples',
    title: 'Cheek Squish',
    caption: 'squish your own cheeks or each other’s!',
    artKey: 'cheek-squish',
  },
  {
    id: 'couples-mirror',
    pack: 'couples',
    title: 'Mirror Match',
    caption: 'mirror each other’s exact expression & tilt',
    artKey: 'mirror-tilt',
  },
  {
    id: 'couples-wink',
    pack: 'couples',
    title: 'Cozy Side Wink',
    caption: 'cozy shoulder lean + playful wink',
    artKey: 'side-wink',
  },
  {
    id: 'couples-nuzzle',
    pack: 'couples',
    title: 'Nuzzling Cats',
    caption: 'two sleepy cats nuzzling side by side',
    artKey: 'cats-nuzzle',
  },
];

export function getPosesForPack(pack: PosePack): PosePrompt[] {
  if (pack === 'all') return POSE_PROMPTS;
  return POSE_PROMPTS.filter((p) => p.pack === pack);
}

export function pickInitialSlotPoses(pack: PosePack, count = 6): PosePrompt[] {
  const pool = getPosesForPack(pack);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected: PosePrompt[] = [];
  for (let i = 0; i < count; i++) {
    selected.push(shuffled[i % shuffled.length]);
  }
  return selected;
}
