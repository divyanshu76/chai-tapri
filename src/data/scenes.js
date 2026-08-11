/**
 * scenes.js — Scene configuration for BackgroundScene.jsx
 *
 * This version strictly maps the 3 predefined chai background images.
 */

export const scenes = [
  {
    id: 1,
    name: 'Evening Tapri',
    nameHi: 'शाम की चाय',
    imageUrl: '/assets/backgrounds/chai1.jpg',
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
    name: 'Rainy Night',
    nameHi: 'बारिश की रात',
    imageUrl: '/assets/backgrounds/chai2.jpg',
    desktopPosition: 'center center',
    mobilePosition: 'center 45%',
    overlayColor: 'linear-gradient(to bottom, rgba(40,25,15,0.02), rgba(40,25,15,0.12))',
    particles: {
      type: 'rain',
      count: 60,
      color: 'rgba(180, 200, 220, 0.4)',
    },
    audio: 'rain',
    cssVars: {
      '--scene-glow':       'rgba(60, 120, 80, 0.4)',
      '--scene-light':      '#a8d8a8',
      '--scene-brightness': '0.82',
    },
  },
  {
    id: 3,
    name: 'Midnight Tapri',
    nameHi: 'आधी रात',
    imageUrl: '/assets/backgrounds/chai3.jpg',
    desktopPosition: 'center center',
    mobilePosition: 'center 40%',
    overlayColor: 'linear-gradient(to bottom, rgba(40,25,15,0.02), rgba(40,25,15,0.12))',
    particles: {
      type: 'smoke',
      count: 8,
      color: 'rgba(180, 160, 130, 0.2)',
    },
    audio: 'midnight',
    cssVars: {
      '--scene-glow':       'rgba(180, 100, 20, 0.35)',
      '--scene-light':      '#c4821a',
      '--scene-brightness': '0.72',
    },
  },
];

export const getSceneById = (id) => scenes.find((s) => s.id === id) ?? scenes[0];

/** Map a song index (0-based) to a scene (1-based, looping 1→2→3) */
export const songIndexToSceneId = (index) => (index % 3) + 1;
