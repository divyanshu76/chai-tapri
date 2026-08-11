/**
 * scenes.js — Scene configuration for BackgroundScene.jsx
 *
 * This version strictly maps the 3 predefined chai background images.
 */

export const scenes = [
  {
    id: 1,
    name: 'Scene 1',
    desktopImage: '/assets/backgrounds/chai-desktop-1.jpg',
    mobileImage: '/assets/backgrounds/chai-mobile-1.jpg',
    desktopPosition: 'center center',
    mobilePosition: 'center center',
    overlayColor: 'linear-gradient(to bottom, rgba(40,25,15,0.02), rgba(40,25,15,0.12))',
    particles: {
      type: 'dust',
      count: 18,
      color: 'rgba(232, 164, 74, 0.35)',
    },
    audio: 'evening',
    cssVars: {
      '--scene-glow':       'rgba(200, 120, 40, 0.55)',
      '--scene-light':      '#e8a44a',
      '--scene-brightness': '1',
    },
  },
  {
    id: 2,
    name: 'Scene 2',
    desktopImage: '/assets/backgrounds/chai-desktop-2.jpg',
    mobileImage: '/assets/backgrounds/chai-mobile-2.jpg',
    desktopPosition: 'center center',
    mobilePosition: 'center center',
    overlayColor: 'linear-gradient(to bottom, rgba(40,25,15,0.02), rgba(40,25,15,0.12))',
    particles: {
      type: 'dust',
      count: 18,
      color: 'rgba(232, 164, 74, 0.35)',
    },
    audio: 'midnight',
    cssVars: {
      '--scene-glow':       'rgba(180, 100, 20, 0.35)',
      '--scene-light':      '#c4821a',
      '--scene-brightness': '0.9',
    },
  }
];

export const getSceneById = (id) => scenes.find((s) => s.id === id) ?? scenes[0];

/** Map a song index (0-based) to a scene (1-based, alternating 1→2) */
export const songIndexToSceneId = (index) => (index % 2) + 1;
