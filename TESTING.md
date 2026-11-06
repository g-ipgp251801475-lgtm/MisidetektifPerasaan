# Validation report

Executed in headless Chromium with Playwright against the local Python static server.

Passed:
- JavaScript syntax check (`node --check script.js`).
- Complete homepage → map → five story questions → first key → five sentence puzzles → second key → victory journey.
- Direct navigation to locked Tahap 2 and victory returns to the map; locked buttons are disabled.
- Wrong story answer and incorrect sentence order produce retry feedback; corrected answers permit progress.
- One wrong first attempt per level produces 4/5 + 4/5 = 8/10; no extra points from retries.
- Refresh preserves a solved story answer and unfinished sentence order. Fixed an old-hash navigation issue discovered during testing.
- All six supplied PNG paths return HTTP 200; supplied image dimensions and contents inspected.
- AudioContext starts after MULA MISI; looping music timer starts, music mute reaches zero gain, independent voice/effects controls and volume changes persist.
- Correct, incorrect, key, unlock, chest and victory effects each schedule oscillator notes.
- Narration requests use ms-MY and cancel the previous utterance; navigation cancels narration. This check uses instrumented speech calls rather than asserting audible output.
- Victory switches to the victory music sequence.
- Replay cancellation preserves progress; confirmed replay resets it and retains audio preferences.
- No horizontal overflow on home, map and both active challenges at widths 320, 390 and 768 pixels; desktop screenshots inspected at 1440 pixels. Mobile map and desktop victory screenshots inspected.
- Denied localStorage does not crash the game; a visible notice explains session-only progress.
- No uncaught browser JavaScript errors during the journey.

Device checks still needed: listen to music balance and Malay pronunciation on the classroom device, test touch on physical phones/tablets, and test the published Google Sites iframe. Headless browser tests verify playback state and scheduling, not the quality of audible output. No hosted deployment or published Google Site is claimed.
