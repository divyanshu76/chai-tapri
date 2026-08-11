/**
 * songs.js — Song list for Chai Tapri Radio
 *
 * Each song maps to a scene via `sceneId` (1, 2, or 3).
 * In practice the app uses songIndexToSceneId() from scenes.js
 * so the cycle is automatic — sceneId here is informational.
 *
 * youtubeId: the 11-char video ID from youtube.com/watch?v=XXXXX
 * Set playlistId in musicConfig to use a full playlist instead.
 *
 * To add more songs, append objects to this array.
 */

export const musicConfig = {
  /**
   * 'youtube' | 'spotify'
   * Switch this flag + set the corresponding ID below.
   */
  source: 'youtube',

  /**
   * YouTube playlist ID — replace with your playlist.
   * Example: PLxxxxxxxxxxxxxxxx
   */
  youtubePlaylistId: 'PLsXKC3pHk-XiIHKHWR-a1lJWNf8aAWrfX',

  /**
   * Spotify playlist ID — replace with your playlist.
   * Example: 37i9dQZF1DX...
   */
  spotifyPlaylistId: 'YOUR_SPOTIFY_PLAYLIST_ID',

  /**
   * Individual YouTube video IDs used as fallback / demo tracks
   * when no playlist is loaded or for local demo mode.
   */
  demoMode: true,
};

export const songs = [
  {
    id: 1,
    title: 'Tum Se Hi',
    artist: 'Mohit Chauhan',
    film: 'Jab We Met',
    sceneId: 1,
    youtubeId: 'hTCBSBjFA28',
  },
  {
    id: 2,
    title: 'Iktara',
    artist: 'Kavita Seth & Amitabh Bhattacharya',
    film: 'Wake Up Sid',
    sceneId: 2,
    youtubeId: 'FYuHiCMqxFg',
  },
  {
    id: 3,
    title: 'Gul',
    artist: 'Anuv Jain',
    film: '',
    sceneId: 3,
    youtubeId: 'Q3h5RiHsBkY',
  },
  {
    id: 4,
    title: 'Phir Le Aya Dil',
    artist: 'Arijit Singh',
    film: 'Barfi!',
    sceneId: 1,
    youtubeId: 'a9PEFB7Ghkk',
  },
  {
    id: 5,
    title: 'Kabira',
    artist: 'Rekha Bhardwaj & Tochi Raina',
    film: 'Yeh Jawaani Hai Deewani',
    sceneId: 2,
    youtubeId: 'eSV70iFgbSk',
  },
  {
    id: 6,
    title: 'Channa Mereya',
    artist: 'Arijit Singh',
    film: 'Ae Dil Hai Mushkil',
    sceneId: 3,
    youtubeId: 'zaRsNl0bCMQ',
  },
  {
    id: 7,
    title: 'Ae Dil Hai Mushkil',
    artist: 'Arijit Singh',
    film: 'Ae Dil Hai Mushkil',
    sceneId: 1,
    youtubeId: 'eOfnJ6h5e0E',
  },
  {
    id: 8,
    title: 'Tera Yaar Hoon Main',
    artist: 'Arijit Singh',
    film: 'Sonu Ke Titu Ki Sweety',
    sceneId: 2,
    youtubeId: 'J4U3TJyWqJ4',
  },
  {
    id: 9,
    title: 'Dil Dhadakne Do',
    artist: 'Priyanka Chopra & Farhan Akhtar',
    film: 'Dil Dhadakne Do',
    sceneId: 3,
    youtubeId: 'TiyL-dBr08E',
  },
  {
    id: 10,
    title: 'Raabta',
    artist: 'Arijit Singh',
    film: 'Agent Sai Srinivasa Athreya',
    sceneId: 1,
    youtubeId: '0N0OKiKDHW4',
  },
];
