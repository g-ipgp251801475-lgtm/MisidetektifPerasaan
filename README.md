# Misi Detektif Perasaan: Waspada Selalu

A complete static Bahasa Melayu Tahun 4 educational forest adventure. No account, server-side code, build step, paid API or runtime dependency.

## Visual redesign

The existing game now has a minimal animated homepage, immersive map with separate character stations, fixed distinct level backgrounds, the five worksheet situations, centred modal feedback, and punctuated sentence answers. The two-level structure, keys, first-attempt scores, saved progress and replay are preserved.

All ten original redesign images and the additional Tahap 1 image are included unchanged in `assets/images/`, preserving their exact filenames. `image-map.js` assigns them to their intended roles; `assets/IMAGE-MAPPING.json` records the mapping and confirms original availability. Tahap 1 consistently uses `Screenshot (310)(2).png`. The map retains the original forest-path scene; all other scene and character image mappings are unchanged. `Screenshot (310).png` is retained as the optional alternative, without competing with the main scenes. Earlier supplied artwork is retained but is no longer used by the active scenes.

The homepage uses title-case “Misi Detektif Perasaan” and italic “Waspada Selalu”; the consistent two-line header remains on all pages. Larger activity cards preserve all existing questions and scores. The map highlights the first challenge; victory animates two keys toward the chest, releases the lock, lifts the lid and leaves both keys visible inside. Reduced-motion users see the final open state immediately.

Run `python3 tools/configure-images.py` only when refreshing the image mapping. No build step is needed for normal play or hosting.

## Play locally

From this folder run `python3 -m http.server 8000`, then open `http://localhost:8000` in a browser. Keep the complete assets directory next to index.html. The Python server is for local development only.

## Learning and play

Theme: Keselamatan. Topic: Waspada Selalu.
- SK 5.1 Memahami dan menggunakan golongan kata mengikut konteks.
- SP 5.1.3 Memahami dan menggunakan kata adjektif mengikut konteks; (ii) perasaan.
- Words: takut, risau, cemas, sedih and lega.

Exactly two challenges: **Cabaran Hutan** (five safety-story questions) and **Susun dan Selesaikan** (five sentence-order puzzles). Tap words in sequence; tap selected words to return them to the bank. This works with touch, mouse and keyboard, without requiring drag and drop. Each completed challenge gives one key. Both keys unlock Pusat Keselamatan Hutan.

Each correct first attempt earns one point, maximum 10. Retries remain available until correct, so every pupil can finish. Incomplete sentence submissions do not reduce the score. Progress, unfinished sentence arrangements and completed answers survive refresh when localStorage is available. Replay asks before clearing progress and preserves audio preferences. No pupil identity is collected or transmitted.

## Audio — recordings-only narration

Narration now uses local HTMLAudio MP3 playback only. Device SpeechSynthesis and English fallbacks have been removed. **The six required Malay male recordings have not been supplied yet**, so no consistent male voice is claimed. Missing clips identify the exact filename while written instructions remain visible. The game remains playable without narration.

Music, voice and effects each have an on/off switch and an independent volume slider. Existing shared-volume preferences migrate without clearing scores or progress. Music and ambience duck while a recording actually plays and restore on stop, finish or error. Welcome/guidance/feedback support replay; correct/incorrect feedback automatically requests its recording. The final narration is “Tahniah! Kamu berjaya menyelesaikan misi!”

Background music is a gentle original major-pentatonic marimba/piano-style synthesized loop with soft wind and occasional bird chirps. Low drones, percussion hits and animal calls were removed. It starts only after interaction and continues across in-page navigation.

See [the exact six required filenames and scripts](assets/audio/README.md). After adding the real recordings, run `python3 tools/configure-audio.py` and `python3 tools/check-audio.py`, test actual playback, then deploy. A published-file byte check is available through the checker's `--base-url` option. The actual male Malay recordings and deployed MP3 URLs remain unverified because the files are missing.

## Files

```
index.html
style.css
script.js
image-map.js
audio.js
audio-assets.js
tools/configure-images.py
tools/configure-audio.py
tools/check-audio.py
assets/IMAGE-MAPPING.json
PLAN.md
README.md
TESTING.md
tests/game.cjs
assets/
  01_homepage_group_scene.png
  02_forest_background.png
  03_briar_character.png
  04_bramble_character.png
  05_logger_vick_character.png
  06_user_original_forest_reference.png
  README.txt
  map-illustrations.svg
  audio/README.md
  images/  # Ten original PNGs plus Screenshot (310)(2).png; filenames preserved
```

The ten new originals retain their names, proportions and contents. Separate map characters use neat frames to preserve the white backgrounds without damaging the source images. The complete homepage group moves as one image. No generated substitute characters or Internet images are used.

## Deploy a static website

For GitHub Pages: push these project files to the repository, then open **Settings → Pages → Deploy from a branch**, select `main` and `/ (root)`, and save. Wait for the Pages deployment to finish. Alternatively upload the folder to a static host such as Netlify. All asset paths are relative and work under a repository subpath. Use the HTTPS URL supplied by your host. Deployment has not been performed by this project.

## Embed in Google Sites

1. Deploy the static website first and open its HTTPS URL to verify it.
2. In Google Sites choose **Insert → Embed → By URL** and paste the deployed URL.
3. Insert and resize the frame to full content width and about 1000–1200 px high, adjusting for your site layout. Publish the Google Site.
4. Test the published site on desktop and phone. Click MULA MISI inside the frame to activate audio. The host must permit iframe embedding; GitHub Pages supports it. Browsers may restrict localStorage inside third-party frames; in that case the game works for the current session, and opening the deployed game directly allows normal saved progress.

The game uses responsive layouts and internal navigation, so no additional page URLs are needed.

## Development checks

`node --check script.js` verifies syntax. `node tests/audio.cjs` verifies MP3 playback, ducking, cancellation, missing-file handling and independent volumes using temporary test-tone MP3 responses (FFmpeg required). These are not shipped narration files. `node tests/game.cjs` runs the full browser journey against a server on port 8000. This test requires Playwright in the developer environment and Chromium at `/usr/bin/chromium` (or set `CHROMIUM_PATH`). These are test tools only and are not needed by pupils or hosting. See TESTING.md for verified outcomes and remaining device checks.
