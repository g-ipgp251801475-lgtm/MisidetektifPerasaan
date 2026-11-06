# Current validation — recordings-only audio and homepage refinement

## Passed in Chromium

`node tests/game.cjs` against the Python static server:

- Complete two-level journey, same five worksheet scenarios and five sentence puzzles, sequential locks, both keys and final victory.
- Wrong answer → retry modal → same question; correct answer → next. First-attempt scores remain 4/5 + 4/5 = 8/10 after one wrong answer per level.
- Existing localStorage keys, refresh recovery, partial word arrangements, replay confirmation and punctuation preserved.
- Homepage title is “Misi Detektif Perasaan” with italic “Waspada Selalu”; title fits desktop and wraps naturally on mobile. Original homepage/background and all character paths unchanged.
- Automatic feedback requests the correct recorded phrase. Missing recordings still identify the exact filename inside the modal. No installed device voices are queried or invoked.
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

## Supplied recordings and creator credit

Nine actual uploaded MP3 recordings are now included. The accidental double `.mp3.mp3` extensions were normalized to the expected lowercase `.mp3` filenames without changing file contents. All six required clips and the three optional map/completion clips pass `tools/check-audio.py`. FFmpeg decodes the full streams; all are 24 kHz mono, 2.02–9.91 seconds, peaks -5.2 to -2.7 dBFS with no digital clipping detected.

`node tests/recordings.cjs` passed real loading, decoding, timeline advancement and completion for every supplied clip. The audio-player logic, preference defaults and settings UI were not changed. Voice wording, performer identity and naturalness have not been verified by listening; these are distinct from technical playback checks. Published Pages delivery is also a separate check.

The creator credit is centred below the subtitle, with Cikgu Ong more prominent than Disediakan oleh. Placement checks and screenshots at 320, 390, 768 and 1440 pixels passed; title-area spacing on wider screens keeps the signature above Briar’s face. Main title text, subtitle, homepage artwork, character animation and MULA MISI remain unchanged.

The full gameplay regression and isolated audio suite both passed after registration of the real recordings. Questions, scores, progress schema, page structure, image mappings and audio settings remain unchanged.
