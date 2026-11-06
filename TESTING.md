# Visual redesign validation

Executed against the actual existing game in headless Chromium using `node tests/game.cjs` and a Python static server. Syntax checked using `node --check script.js`. Screenshots were inspected with reduced motion enabled for stable captures.

Passed:
- Minimal homepage contains the requested title, subtitle, MULA MISI and audio/speaker controls; teacher learning introduction is absent.
- Full two-level journey through all ten questions and both keys to victory.
- Exactly three map locations, separate character portraits, sequential locks and direct-route guards.
- Five worksheet situations (Mei Mei, Aina, Faris, Siti, Ah Sheng); one unchanged background throughout each level, different backgrounds between levels.
- Correct and incorrect answers open prominent native modal dialogs with keyboard focus inside. Retry stays on the same question without revealing the answer. Next advances once; the fifth answer awards the key.
- First-attempt scoring preserved: one wrong answer in each level gives 4/5 + 4/5 = 8/10. Retry success displays +0 honestly; first-attempt success displays +1. Incomplete word arrangements do not consume an attempt.
- All five sentence answers display capitalized complete sentences ending in exactly one full stop. Punctuation is appended after submission, never appears as a word tile, and forms part of canonical sentence validation. Complete incorrect submissions also receive the automatic stop without revealing the right word order.
- Refresh restores solved feedback and partial sentence order. Replay confirmation and audio preferences remain intact.
- English-only speech environment emits no speech. Injected Malay-voice test explicitly selects ms-MY; each new narration cancels the last one. Real pronunciation remains device-dependent.
- Music starts after interaction; music, voice, effects and volume controls work; key, unlock, correct, wrong, chest and victory notes are scheduled.
- No horizontal overflow at 320, 390, 768 and desktop 1440 pixels. Word add/remove interaction and modal retry work at phone/tablet sizes. Mobile scene windows show complete backgrounds without stretching.
- Every currently active image URL returns 200, visible map images decode, no failed resource responses and no uncaught browser errors during the test journey.
- Denied localStorage still allows play and shows the session-only notice.

## Original image acceptance

All ten exact filenames are now present in `assets/images/` and mapped to their intended roles. ZIP bytes match extracted source files. The mapping includes eleven roles for ten unique originals because the forest-path image is also used for the map. The optional rafting scene is preserved and is not displayed as a competing background. Active image paths return 200, portraits decode, and no resource requests fail.

Inspected all ten images in a contact sheet and checked actual desktop/mobile screenshots of the new homepage, map, story, sentence puzzle, correct and incorrect overlays, and victory page. The second-level card is narrower on desktop to leave the original characters visible. Main backgrounds stay fixed across all five questions per level, and mobile scene windows display the entire image without stretching or cropping faces.

Audio balance, actual Malay pronunciation, physical touchscreen behaviour and the published Google Sites iframe still require device checks. Headless tests verify state and scheduling rather than audible quality. Remote source verification is performed separately during publication; local browser tests do not prove a hosted Pages deployment.


## Final refinement validation

- Added the exact uploaded `Screenshot (310)(2).png` without altering its bytes. Only the Tahap 1 image mapping changes; other background and character paths remain unchanged.
- Uppercase desktop homepage title fits one line, mobile wraps at word boundaries, and all pages carry the same two-line identity. Whole-image character animation remains intact.
- Tahap 1 uses Briar and the exact requested instruction throughout all five questions; Tahap 2 uses Bramble and its exact requested instruction.
- Enlarged question text/options, guide typography, word tiles, answer zone and action buttons checked in browser. Complete scenic windows preserve all background characters alongside the enlarged cards.
- Correct/incorrect overlays automatically request the exact Malay phrases; voice mute prevents narration. Malay-only voice selection, previous-utterance cancellation, and narration duck/restore verified with instrumented speech calls.
- Dedicated `node tests/audio.cjs` passed real HTMLAudio playback with a test-only WAV: recording priority, replay cancellation, narration mute, effects mute, ambience mute, music duck/restore and one-time genuine Malay fallback after a failed recording.
- Synthesized breeze source loops; bird and occasional dove calls are generated along with the instrumental melody. No missing audio URLs are requested.
- Map retains its locks and adds the first-station glow/arrow and next-stage unlock animation. Key and unlock sound triggers remain active.
- Normal-motion browser test confirms the chest lid transforms from closed to open, the lock disappears, and exactly two keys are visible inside. Start/open screenshots inspected. Reduced-motion final state is also open with two visible keys.
- Full journey still produces 8/10 with one failed first attempt per level, and saves/restores existing progress and audio preferences. All five sentence answers retain automatic punctuation.
- Phone/tablet widths 320, 390 and 768 checked without horizontal overflow; all active image and source requests succeeded with no uncaught JavaScript errors.

No Malay recordings were supplied. Automatic spoken feedback is implemented, but audible pronunciation and voice quality require a device with a Malay voice or the optional recordings. Test-only WAV is not a shipped narration recording. Listening balance and physical-device behaviour remain classroom checks.
