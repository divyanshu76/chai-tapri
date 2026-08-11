# /public/audio/

Place recorded or AI-generated MP3 voice clips here.

Each file maps to a `chaiQuotes` entry in `src/data/shayari.js`.

## Files expected:

| File                        | Quote text                          |
|-----------------------------|-------------------------------------|
| ek-cutting-idhar-bhi.mp3    | "Ek cutting idhar bhi!"             |
| kadak-banana-bhai.mp3       | "Kadak banana bhai."                |
| chai-garam-hai.mp3          | "Chai garam hai, dil sambhal ke."   |
| ek-aur-bana-dena.mp3        | "Bhaiya, ek aur bana dena."         |
| sukoon-ka-order.mp3         | "Sukoon ka order mil gaya."         |
| thoda-adrak-daalna.mp3      | "Thoda adrak daalna please."        |
| aaj-ki-baat.mp3             | "Aaj ki baat chai pe hi hogi."      |
| ek-sip-aur.mp3              | "Ek sip aur... bas ek sip aur."     |

## Notes:
- Files are loaded lazily (only when user clicks the chai glass).
- Missing files fail silently — only the text quote is shown.
- Replace any file at any time without changing application code.
- Recommended: 16-bit 44.1kHz mono MP3 at 96kbps or higher.
