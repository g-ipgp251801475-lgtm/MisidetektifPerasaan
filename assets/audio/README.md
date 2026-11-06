# Audio

No audio recordings were supplied. The game currently creates its own gentle looping forest melody, a separate victory melody and short effects with Web Audio. Narration uses generic browser SpeechSynthesis only when an actual Malay (`ms` / `ms-MY`) voice is installed. Otherwise it stays silent and displays a readable notice; it never falls back to English. Briar’s exact welcome is replayed by the homepage speaker. Teacher narration has been removed. These are not official character voices. There are no missing MP3 references and no audio downloads.

No files are required to play. For studio recordings later, provide licensed `background-music.mp3`, `victory-music.mp3`, `correct-answer.mp3`, `incorrect-answer.mp3`, `button-click.mp3`, `level-unlocked.mp3`, `key-collection.mp3`, `treasure-chest.mp3`, `mission-complete.mp3`, and Malay instruction recordings for Briar, Bramble and Logger Vick. Place them here and replace the corresponding `audio` methods in script.js; simply adding files does not switch playback automatically.

Music starts only after an interaction and persists across in-page navigation. Page hiding suspends audio and cancels narration. Each new narration cancels the previous one; effects cancel older effect notes. Controls and volume persist separately from game progress.
