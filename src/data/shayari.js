/**
 * shayari.js — Text pools for Chai Tapri Radio
 *
 * Three pools:
 * 1. shayariPool     — Displayed on every song change
 * 2. chaiQuotes      — Displayed when user clicks the chai glass
 * 3. tapriNews       — "Breaking news" from the tapri
 */

export const shayariPool = [
  'Kuch baatein chai ke saath hi achhi lagti hain.',
  'Chai garam thi, mausam thanda tha.',
  'Ek cup chai aur thodi si khamoshi —\nkabhi kabhi dono kaafi hote hain.',
  'Raat lambi thi, chai chhoti si.',
  'Kuch log chai jaise hote hain,\naadat ban jaate hain.',
  'Sukoon ka pata poocha,\nchai wale ne tapri dikha di.',
  'Ek chai aur tumhari yaad —\ndono bina bulaye aa jaate hain.',
  'Sheher sota raha, tapri jaagti rahi.',
  'Baarish, chai aur purane gaane —\nbas itna hi kaafi tha.',
  'Kuch safar manzil ke liye nahi,\nek cup chai ke liye hote hain.',
  'Is raat ka rang kuch alag hai,\nchai ka rangat bhi.',
  'Jo kahe nahi ja sakta,\nvoh chai ke dhuaan mein keh diya.',
  'Aawaz kam hai, par gaana poora hai.',
  'Kabhi kabhi khamoshi bhi\nkuch keh jaati hai.',
  'Raat ke is pehre mein,\nsirf chai aur tum yaad aate ho.',
];

/**
 * chaiQuotes — each quote paired with an audio file path.
 *
 * AUDIO ARCHITECTURE:
 * Place recorded/AI-generated .mp3 files in /public/audio/.
 * When a file doesn't exist yet, the app fails silently and only
 * shows the text quote. Replace paths with real files at any time.
 *
 * Text and audio are always kept in sync by this single source.
 */
export const chaiQuotes = [
  { text: 'Ek cutting idhar bhi!',           audio: '/audio/ek-cutting-idhar-bhi.mp3' },
  { text: 'Kadak banana bhai.',               audio: '/audio/kadak-banana-bhai.mp3' },
  { text: 'Chai garam hai, dil sambhal ke.',  audio: '/audio/chai-garam-hai.mp3' },
  { text: 'Bhaiya, ek aur bana dena.',        audio: '/audio/ek-aur-bana-dena.mp3' },
  { text: 'Sukoon ka order mil gaya.',        audio: '/audio/sukoon-ka-order.mp3' },
  { text: 'Thoda adrak daalna please.',       audio: '/audio/thoda-adrak-daalna.mp3' },
  { text: 'Aaj ki baat chai pe hi hogi.',     audio: '/audio/aaj-ki-baat.mp3' },
  { text: 'Ek sip aur... bas ek sip aur.',   audio: '/audio/ek-sip-aur.mp3' },
];

export const tapriNews = [
  '📰 BREAKING: Chai wale ne aaj phir udhaar dene se mana kar diya.',
  '📰 TAPRI NEWS: Baarish ki wajah se aaj bench full hai.',
  '📰 LATEST: Radio ki battery abhi bhi chal rahi hai — miracle!',
  '📰 EXCLUSIVE: Udhaar kal se band hai. Kal se band hai. Kal se.',
  '📰 SPECIAL: Aaj ki chai mein thoda extra sukoon milaya gaya hai.',
];

/** Pick a random item from any array, avoiding the last-shown one */
export const randomFrom = (arr, excludeIndex = -1) => {
  const filtered = arr.length > 1
    ? arr.filter((_, i) => i !== excludeIndex)
    : arr;
  const idx = Math.floor(Math.random() * filtered.length);
  return { text: filtered[idx], index: arr.indexOf(filtered[idx]) };
};

/** Time-based mood label */
export const moodByHour = {
  0:  'Aadhi Raat',
  1:  'Gehri Khamoshi',
  2:  'Neend Nahi Aai',
  3:  'Raat Ka Akhir',
  4:  'Subah Se Pehle',
  5:  'Fajr Ki Chai',
  6:  'Subah Subah',
  7:  'Uthe Hain Mushkil Se',
  8:  'Pehli Chai',
  9:  'Dheera Dheera',
  10: 'Dhoop Nikal Rahi Hai',
  11: 'Mehnat Ka Waqt',
  12: 'Dopahar Ki Chai',
  13: 'Dhoop Aur Chai',
  14: 'Aaram Ka Waqt',
  15: 'Shaam Ka Intezaar',
  16: 'Shaam Dhale',
  17: 'Sunahri Shaam',
  18: 'Tapri Ka Waqt',
  19: 'Raat Utarne Lagi',
  20: 'Shaam Ki Chai',
  21: 'Raat Aur Baarish',
  22: 'Raat Gahere Hue',
  23: 'Khamosh Raat',
  default: 'Tapri Waqt',
};
