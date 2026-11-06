# Forest audio and Malay narration

No recorded audio files were supplied. `AVAILABILITY.json` explicitly lists every missing recording. The game does not request missing filenames.

## Working fallback

`audio.js` provides a lively original instrumental loop, filtered breeze, periodic bird chirps and an occasional quiet dove-like call using Web Audio. These are synthesized sounds, not recordings. Music and ambience share the music switch; narration and answer effects have separate switches. All obey the volume slider. Playback starts after interaction, continues across in-page navigation, and pauses when the page is hidden. Narration reduces music and ambience to 22% of their usual level and restores them on completion, cancellation or failure.

SpeechSynthesis is used only with an actual installed Malay voice (`ms` / `ms-MY`). No English/default voice fallback is permitted. One cheerful generic Malay voice is shared by all character roles, at the same pitch and rate; the game does not claim separate character voices or imitate official actors. If no Malay voice is installed, a readable notice appears and the written dialogue remains available.

Briar welcomes pupils and guides Tahap 1. Bramble guides Tahap 2. Correct and incorrect overlays automatically request “Syabas! Jawapan Betul!” and “Cuba Lagi!” respectively, and include replay buttons. Voice OFF prevents both automatic feedback and replay speech. Previous speech/recordings stop before another begins. Recorded clips take precedence when available.

## Optional recordings to provide later

Place licensed Malay recordings in this directory, then run `python3 tools/configure-audio.py` and commit `audio-assets.js`. The browser prefers only registered files that actually exist:

| Filename | Content / purpose |
| --- | --- |
| welcome-briar-ms.mp3 | Hai, detektif muda! Selamat datang ke hutan kami. Bersedia untuk memulakan misi? |
| briar-instruction-ms.mp3 | Baca situasi dengan teliti. Kenal pasti perasaan watak dan pilih jawapan yang paling tepat. |
| bramble-instruction-ms.mp3 | Pilih perkataan mengikut urutan yang betul untuk membina ayat. Ketik perkataan dalam ruang jawapan untuk mengembalikannya. |
| correct-answer-ms.mp3 | Syabas! Jawapan Betul! |
| try-again-ms.mp3 | Cuba Lagi! |
| forest-ambience.mp3 | Seamless quiet forest ambience loop |
| correct-sound.mp3 | Pleasant answer success effect |
| incorrect-sound.mp3 | Gentle retry effect |
| key-collection.mp3 | Key collection effect |
| treasure-opening.mp3 | Treasure opening effect |
| mission-complete.mp3 | Final celebration effect |

No files are required for the synthesized ambience/music/effects. Natural recorded Malay pronunciation requires the recordings above; browser voice availability and quality vary by device. A broken registered recording falls back to genuine Malay TTS or written text, and never to English.
