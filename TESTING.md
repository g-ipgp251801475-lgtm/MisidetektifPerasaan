# Current validation — recordings-only audio and homepage refinement

## Passed in Chromium

`node tests/game.cjs` against the Python static server:

- Complete two-level journey, same five worksheet scenarios and five sentence puzzles, sequential locks, both keys and final victory.
- Wrong answer → retry modal → same question; correct answer → next. First-attempt scores remain 4/5 + 4/5 = 8/10 after one wrong answer per level.
- Existing localStorage keys, refresh recovery, partial word arrangements, replay confirmation and punctuation preserved.
- Homepage title is “Misi Detektif Perasaan” with italic “Waspada Selalu”; title fits desktop and wraps naturally on mobile. Original homepage/background and all character paths unchanged.
- Automatic feedback requests the correct recorded phrase. Without recordings, the exact missing filename is readable inside the modal. No installed device voices are queried or invoked.
- Music, voice and effect switches/sliders work independently; saved music-volume preference survives replay.
- Briar/Bramble guide roles, fixed distinct level backgrounds, all active images, enlarged controls and actual two-key chest opening remain functional.
- Responsive widths 320, 390, 768 and 1440 have no horizontal overflow. Storage denial still permits session play. No failed resource requests for known-missing MP3s and no uncaught browser errors.

`node tests/audio.cjs` uses a real, temporary MP3 test tone encoded by FFmpeg and served only through Playwright routes:

- All six narration slots actually decode and play through HTMLAudio after interaction at a GitHub Pages-like repository subpath.
- Narration ducks music/ambience only when playing and restores volume at end/error/cancel.
- Independent music, voice and effect volumes; narration/effect mute; replay stops the previous clip.
- A missing recording identifies its filename without requesting a nonexistent URL.
- A malformed registered recording identifies its filename, restores background volume and invokes no SpeechSynthesis fallback.
- Valid MP3 playback does not show the previous device-voice warning.
- HTMLAudio narration plays without AudioContext support, tested at a phone viewport.

JavaScript syntax and `git diff --check` passed. Screenshot inspection confirms the new title-case homepage without altered images.

## Required recordings still missing

`python3 tools/check-audio.py` intentionally fails while the following actual narration files are absent:

1. welcome-briar-ms.mp3
2. briar-instruction-ms.mp3
3. bramble-instruction-ms.mp3
4. correct-answer-ms.mp3
5. try-again-ms.mp3
6. victory-ms.mp3

**No actual male Malay narration or deployed MP3 files have been tested.** Temporary test tones prove playback mechanics, not voice gender, language, pronunciation, naturalness, recording quality or deployment. No test tone is included in assets. The exact scripts and future published-file check command are in `assets/audio/README.md`.

Physical Windows/Android/iOS playback and listening balance must be checked using the supplied real recordings. Browser-size tests are not physical-device compatibility certification. The lighter background music is synthesized, not a recorded acoustic track.
