# Misi Detektif Perasaan — Development plan

## Requirements and assets
Build a static HTML/CSS/vanilla JavaScript game in natural Bahasa Melayu for Tahun 4, SK 5.1 and SP 5.1.3(ii). Exactly two challenges: five safety-story questions and five sentence-order puzzles. Sequential keys unlock the final safety centre. No login, backend or external runtime dependencies.

Inspected all six PNG images supplied in the ZIP; preserve original filenames in assets/. Portraits include their original backgrounds. No supplied audio: use original Web Audio melodies/effects and generic ms-MY SpeechSynthesis narration; voice availability depends on the device. No replacement character art required. Attached README is asset documentation, not additional task instructions.

## Milestones
1. Foundation: responsive homepage, map, two guarded challenges, victory screen and versioned localStorage progress with safe fallback.
2. Learning: five distinct feelings in context, safety guidance, tap-to-order sentence puzzles with retry, first-attempt scores and resume.
3. Presentation: parchment/forest visual system, supplied artwork, drawn map route, animated chest, celebrations and accessible audio controls.
4. Validation: browser checks for navigation, locks, wrong/right answers, exact scoring, persistence, replay, audio controls, asset loading and mobile overflow. Document local hosting, static deployment and Google Sites embedding.

## Scoring and completion
Each item gives one point only when correct on its first attempt (10 maximum). All items must eventually be answered correctly to earn the relevant key. Wrong answers never block further attempts. Save current question, attempted flags, sentence order, keys, scores, page and independent audio preferences. Replay resets game progress but retains audio settings.

## Completion
All four milestones implemented. Full browser journey passes after fixing refresh URL persistence. Phone/tablet layouts, storage fallback, image paths, score calculations, locks and audio scheduling validated. See TESTING.md for evidence and device-specific checks. Running, publishing and embedding instructions are in README.md.
