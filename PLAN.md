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

## Visual redesign (current)
Preserve existing project, two levels, keys, localStorage and first-attempt scores. Replace homepage with minimal cinematic scene, forest map with separate character stations, consistent distinct backgrounds for each level, worksheet scenarios, modal feedback and automatically punctuated sentences. Remove teacher voice; speak only when an actual Malay voice is installed. Test full journey, dialogs, retries, points, focus, images and responsive layouts.

Asset prerequisite: ten images are visible in the conversation but the original files are not accessible in /workspace. Exact intended filenames are recorded in tools/configure-images.py. Existing supplied artwork is used temporarily, without renaming it or claiming it is the new artwork. Run the asset configuration script after the original files arrive. Exact-image acceptance remains pending until then.

Redesign implementation and browser validation now pass using explicitly temporary earlier supplied images. Tests cover both full levels, modal focus/retry/next, first-attempt points, punctuation, persistence, Malay-only speech selection, image loading and responsive layouts. Final acceptance and publishing are blocked solely on receiving the ten original image files and verifying their intended scene framing.

## Original asset integration completed
Received the ten-image ZIP, inspected each original, preserved filenames and file bytes, and activated all exact mappings. The optional rafting image remains unused. Full functional and responsive validation passed with the new originals. No additional levels or scoring changes were introduced.


## Final refinement
Preserve questions, sentences, localStorage keys, scores and all existing image mappings except Tahap 1. Activate Screenshot (310)(2).png for every first-level question. Set Briar/Bramble as the consistent guides, enlarge interactions, unify title typography, and highlight the first map station. Add recording-first audio with a manifest of existing files, genuine Malay-only TTS feedback/replay, narration ducking and synthesized forest ambience. Animate keys, lock, lid, interior keys and victory light with a reduced-motion final state. Validate the whole journey and audio separately before updating the existing main branch.
