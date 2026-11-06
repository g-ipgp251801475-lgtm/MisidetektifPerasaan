# Misi Detektif Perasaan: Waspada Selalu

A complete static Bahasa Melayu Tahun 4 educational forest adventure. No account, server-side code, build step, paid API or runtime dependency.

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

Use the Audio button for separate music, voice and effects switches and a shared volume slider. Music starts after interaction. Music/effects are original browser-generated sounds; voice is generic SpeechSynthesis, not imitation of official actors. Malay voice availability and pronunciation depend on the device. Written instructions always remain visible. See assets/audio/README.md for optional future recording filenames. No recordings are necessary and no broken audio links exist.

## Files

```
index.html
style.css
script.js
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
```

All six supplied images retain their original filenames and appearance. The original forest reference is retained as reference artwork. The map illustrations are additional local vector artwork.

## Deploy a static website

For GitHub Pages: push these project files to the repository, then open **Settings → Pages → Deploy from a branch**, select `main` and `/ (root)`, and save. Wait for the Pages deployment to finish. Alternatively upload the folder to a static host such as Netlify. All asset paths are relative and work under a repository subpath. Use the HTTPS URL supplied by your host. Deployment has not been performed by this project.

## Embed in Google Sites

1. Deploy the static website first and open its HTTPS URL to verify it.
2. In Google Sites choose **Insert → Embed → By URL** and paste the deployed URL.
3. Insert and resize the frame to full content width and about 1000–1200 px high, adjusting for your site layout. Publish the Google Site.
4. Test the published site on desktop and phone. Click MULA MISI inside the frame to activate audio. The host must permit iframe embedding; GitHub Pages supports it. Browsers may restrict localStorage inside third-party frames; in that case the game works for the current session, and opening the deployed game directly allows normal saved progress.

The game uses responsive layouts and internal navigation, so no additional page URLs are needed.

## Development checks

`node --check script.js` verifies syntax. `node tests/game.cjs` runs the full browser journey against a server on port 8000. This test requires Playwright in the developer environment and Chromium at `/usr/bin/chromium` (or set `CHROMIUM_PATH`). These are test tools only and are not needed by pupils or hosting. See TESTING.md for verified outcomes and remaining device checks.
