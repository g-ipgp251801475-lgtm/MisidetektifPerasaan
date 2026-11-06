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

## Stale release regression

The reported screenshot matched the previous script (no creator credit) and empty audio manifest. GitHub's public Pages Actions page confirmed that commit a1fb71b had successfully deployed, distinguishing stale frontend assets from a missing source commit. Direct access to the Pages host from this environment remains blocked by network policy.

`node tests/release-cache.cjs` reproduced the exact symptoms by serving the old aaeb7ef script/manifest at the unversioned URLs. The updated index.html requests CSS and every root JS file using content hashes. With the stale-cache simulation still active, the new page shows Cikgu Ong, loads all nine manifest entries, and plays the actual welcome MP3. No gameplay, scores, audio settings or existing saved progress were changed by this fix.


## Homepage typography and autoplay refinement

`node tests/homepage-audio.cjs` passed with the actual existing welcome-briar-ms.mp3:
- Chromium permitted-autoplay policy: AudioContext runs, recorded welcome advances, music ducks, and clicking MULA MISI preserves the same welcome player, music context and timer while navigating to the map. No duplicate recorded playback.
- Chromium blocked-autoplay policy: exactly one initial MP3 play and one resume attempt, a visible MULA MISI hint, no automatic retries, then actual MP3/music playback after clicking the existing start button. No separate Audio-button interaction required.
- Saved mute preferences are respected; live muted channels do not show a misleading fallback prompt.
- Title-case bold serif title, italic stroked subtitle, and one-line credit are centred at 320/390/768/1440 pixels. Screenshots inspected; no horizontal overflow or collision with subtitle/start button.
- Full game regression passed with the unchanged questions, scoring, progress and recordings.

Existing MP3 and image files are unchanged. These checks demonstrate actual recorded playback under both controlled Chromium policies, not universal browser autoplay permission. Physical mobile autoplay policy may differ; the same start-button fallback remains available.
