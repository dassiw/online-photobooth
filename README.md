# Purikura — Online Photobooth

A cute, interactive, collaborative Korean/Japanese-style (**Purikura / Life4Cuts** inspired) Online Photobooth web application built for both **in-person hangouts** and **remote / long-distance sessions**.

## Features

- **Flexible Booth Modes**
  - **Together (Same Device):** Instant single-webcam booth for friends or couples sitting side-by-side.
  - **Remote Split-Screen (2 Devices):** Shareable invite link (`?room=XXXXXX`) powered by WebRTC (PeerJS), live multiplayer cursors with floating name tags, synchronized countdown triggers, and seamless side-by-side split-screen stitching.
  - **Hybrid Solo / Group Toggle:** Indicate whether one person or a group is sharing your camera in Remote mode.
- **Pose Prompt Packs:** Switch between **Besties / Friends**, **Couples**, or **All / Mixed** across 16 custom-illustrated pose prompts with instant Shuffle.
- **5-Step Workspace:**
  1. **Frame:** Choose Classic Layouts (**4-Cut Vertical Strip**, **6-Cut 2×3 Grid**, **2-Cut Polaroid**) or pick from **24 Canva Photo Booth Templates**.
  2. **Shoot:** Live webcam (plus animated Demo Camera fallback), `3` / `2` / `1` countdown overlay, white flash burst, Web Audio shutter sound, and 6 numbered thumbnail slots with per-shot retake.
  3. **Pick:** Select favorite shots in order with live mini-strip preview and Auto-Pick.
  4. **Style:** Customize Classic Pastel Frames or Canva Templates (with photo arrangement & frame border controls), 6 photo filters, 14 draggable/resizable/rotatable SVG stickers, captions, and date/studio stamps.
  5. **Done:** Export high-resolution **PNG**, **Animated GIF**, or copy to clipboard.

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Tech Stack

- **React 18 + TypeScript + Vite + Tailwind CSS v4**
- **PeerJS (WebRTC)** for remote video streaming, synced countdowns, and multiplayer cursors
- **HTML5 Canvas & `gifenc`** for crisp strip compositing and animated GIF export
