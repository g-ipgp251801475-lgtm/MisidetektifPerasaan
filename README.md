# Misi Detektif Perasaan: Waspada Selalu

A complete static Bahasa Melayu Tahun 4 educational forest adventure. No account, server-side code, build step, paid API or runtime dependency.

## Visual redesign

The existing game now has a minimal animated homepage, immersive map with separate character stations, fixed distinct level backgrounds, the five worksheet situations, centred modal feedback, and punctuated sentence answers. The two-level structure, keys, first-attempt scores, saved progress and replay are preserved.

All ten original redesign images and the additional Tahap 1 image are included unchanged in `assets/images/`, preserving their exact filenames. `image-map.js` assigns them to their intended roles; `assets/IMAGE-MAPPING.json` records the mapping and confirms original availability. Tahap 1 consistently uses `Screenshot (310)(2).png`. The map retains the original forest-path scene; all other scene and character image mappings are unchanged. `Screenshot (310).png` is retained as the optional alternative, without competing with the main scenes. Earlier supplied artwork is retained but is no longer used by the active scenes.

The uppercase title and italic subtitle are consistent throughout. Larger activity cards preserve all existing questions and scores. The map highlights the first challenge; victory animates two keys toward the chest, releases the lock, lifts the lid and leaves both keys visible inside. Reduced-motion users see the final open state immediately.

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

## Audio

Separate music, narration and effects switches plus volume are available on every page. The original synthesized instrumental is accompanied by gentle wind, periodic birds and an occasional quiet dove-like call. It starts after interaction. Narration automatically lowers music/ambience, cancels previous narration, and restores volume afterward.

Briar guides Tahap 1; Bramble guides Tahap 2. Both feedback overlays automatically request their exact Malay phrases and offer replay. There are currently **no supplied Malay recordings**: only a genuine installed Malay browser voice is used, with no English fallback. One generic voice is shared by all character roles; separate character voices are not claimed. If unavailable, read the visible instructions. See `assets/audio/README.md` for all eleven optional filenames, exact dialogue and registration steps. Missing files are not requested.

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

`node --check script.js` verifies syntax. `node tests/audio.cjs` verifies recording priority, ducking, cancellation and audio preferences using a test-only WAV response. `node tests/game.cjs` runs the full browser journey against a server on port 8000. This test requires Playwright in the developer environment and Chromium at `/usr/bin/chromium` (or set `CHROMIUM_PATH`). These are test tools only and are not needed by pupils or hosting. See TESTING.md for verified outcomes and remaining device checks.
