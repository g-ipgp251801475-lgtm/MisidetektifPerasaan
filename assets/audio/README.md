# Local Malay narration — recordings required

**Current status: all six required narration MP3s and three optional map/completion recordings have been supplied and integrated.** Nine files were checked as valid mono 24 kHz MP3s, with peaks between -5.2 and -2.7 dBFS (no digital clipping detected). Actual browser playback passed for all nine. The uploaded duplicate `.mp3.mp3` extensions were normalized to `.mp3` without altering the audio bytes. Voice wording, identity and naturalness require a listening review; technical validation does not certify them. It now uses local HTMLAudio playback exclusively for narration, never SpeechSynthesis, an installed device voice or an English fallback. Missing recordings are identified by exact filename on the page or inside the feedback dialog. Written instructions remain visible and all game activities remain playable.

## Six required recordings

The supplied recordings are used unchanged. For any future replacements, provide youthful, cheerful, natural Malay male recordings. Briar and Bramble may have separate performers; no distinct voice identity is claimed until the actual recordings are supplied and reviewed. Do not imitate the official actors. Save these exact lowercase filenames in `assets/audio/`:

| Filename | Exact spoken text |
| --- | --- |
| `welcome-briar-ms.mp3` | Hai, detektif muda! Selamat datang ke hutan kami. Bersedia untuk memulakan misi? |
| `briar-instruction-ms.mp3` | Baca situasi dengan teliti. Kenal pasti perasaan watak dan pilih jawapan yang paling tepat. |
| `bramble-instruction-ms.mp3` | Pilih perkataan mengikut urutan yang betul untuk membina ayat. Ketik perkataan dalam ruang jawapan untuk mengembalikannya. |
| `correct-answer-ms.mp3` | Syabas! Jawapan Betul! |
| `try-again-ms.mp3` | Cuba Lagi! |
| `victory-ms.mp3` | Tahniah! Kamu berjaya menyelesaikan misi! |

Use real MP3 encoding, preferably mono 44.1/48 kHz, no loud music underneath, no long leading silence. Do not merely rename WAV files to .mp3. Keep similar perceived loudness and avoid clipping. The exact names and capitalization matter on GitHub Pages.

## Integration and verification

1. Place the actual recordings here. Never substitute test tones or empty files.
2. Run `python3 tools/configure-audio.py`. It registers URLs only for files that exist, and writes an explicit availability report to `AVAILABILITY.json`. Expected filenames in the manifest are metadata for error messages; they are not requested until a real file is registered.
3. Run `python3 tools/check-audio.py` to verify required files and MP3 decoding. It exits with failure while any required recording is missing.
4. Start the development server, then test each speaker button and automatic feedback. Listen for the correct Malay dialogue, male voice style, intelligibility and comfortable balance.
5. Commit the MP3s, `audio-assets.js` and `AVAILABILITY.json` along with the game. After the Pages build finishes, run `python3 tools/check-audio.py --base-url https://g-ipgp251801475-lgtm.github.io/MisidetektifPerasaan/` to check each registered URL against the local file bytes. Then listen to the actual published game on desktop and mobile.

**The supplied recordings have been tested locally; published Pages URLs require a separate deployment check.** `tests/recordings.cjs` exercises all nine actual MP3s; `tests/audio.cjs` additionally uses a temporary MP3 tone for isolated error/volume tests. Test tones are not stored in assets and are not narration.

## Playback behaviour

On the homepage, music and the existing recorded welcome each get one immediate autoplay attempt. If blocked, MULA MISI starts both within its click and retains map navigation. The prompt is suppressed for saved mute settings. An already-playing welcome is not restarted when entering the map. Autoplay depends on browser policy, not a guarantee. Feedback automatically requests its recorded phrase; welcome and guidance offer replay. Previous narration stops before the next clip. Music and ambience reduce to 22% of their usual level only while a clip plays, and restore on completion, cancellation or failure. Music, voice and effects have independent on/off switches and volume sliders, stored separately from game progress. Old shared-volume preferences migrate without clearing progress. Missing, invalid or browser-blocked audio displays a specific message; it never invokes device TTS. HTMLAudio narration also works when Web Audio is unavailable, subject to browser playback policy.

The original synthesized background is now a gentle major-pentatonic marimba/piano-style loop with light harmonics, soft breeze and one occasional bird chirp about every eleven seconds. Low drones, percussive hits and animal calls were removed. This is browser-generated music, not a recorded acoustic performance.

## Optional audio

The three map/completion recordings below are now included. The six optional ambience/effect files remain absent; synthesized music/effects continue to work without them:

- `map-instruction-ms.mp3`: Ikut laluan pada peta. Mulakan dengan Cabaran Hutan. Selepas mendapat kunci pertama, teruskan ke Susun dan Selesaikan.
- `level1-complete-ms.mp3`: Tahniah! Kunci pertama diperoleh. Tahap dua kini dibuka.
- `level2-complete-ms.mp3`: Syabas! Kunci kedua diperoleh. Pusat Keselamatan Hutan kini dibuka.
- `forest-ambience.mp3`, `correct-sound.mp3`, `incorrect-sound.mp3`, `key-collection.mp3`, `treasure-opening.mp3`, `mission-complete.mp3`: optional ambience/effect recordings. Synthesized ambience/effects work without these.
