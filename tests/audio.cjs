// Test tone MP3 is synthesized in memory for codec/playback testing; it is NOT Malay narration.
// No test tone is shipped in assets or represented as a character recording.
const {chromium}=require('playwright');const assert=require('node:assert/strict');const {execFileSync}=require('node:child_process');
const mp3=execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-f','lavfi','-i','sine=frequency=440:duration=0.6','-codec:a','libmp3lame','-q:a','5','-f','mp3','pipe:1']);
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});const context=await browser.newContext();
 // Serve at a GitHub Pages-like subpath to check relative MP3 URLs and capitalization.
 await context.route('**/MisidetektifPerasaan/**',route=>{
  const url=new URL(route.request().url()),relative=decodeURIComponent(url.pathname.slice('/MisidetektifPerasaan/'.length));
  if(relative.startsWith('assets/audio/')&&relative.endsWith('.mp3'))return route.fulfill({contentType:'audio/mpeg',body:mp3});
  return route.continue({url:'http://127.0.0.1:8000/'+relative+url.search});
 });
 const page=await context.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000/MisidetektifPerasaan/');await page.evaluate(()=>localStorage.clear());await page.reload();
 await page.locator('[data-action="welcome"]').click();
 assert((await page.locator('#voice-status').innerText()).includes('welcome-briar-ms.mp3'));
 assert.equal(await page.evaluate(()=>audio.voicePlayer),null);
 await page.evaluate(()=>{preferences.voice=true;preferences.music=true;preferences.musicVolume=40;preferences.voiceVolume=70;preferences.effectsVolume=30;window.deviceCalls=0;if('speechSynthesis' in window){speechSynthesis.speak=()=>{deviceCalls++;throw Error('TTS forbidden')};speechSynthesis.getVoices=()=>{deviceCalls++;throw Error('Device voices forbidden')};}});
 const clips={welcome:'welcome-briar-ms.mp3',level1:'briar-instruction-ms.mp3',level2:'bramble-instruction-ms.mp3',correct:'correct-answer-ms.mp3',retry:'try-again-ms.mp3',victory:'victory-ms.mp3'};
 for(const [key,filename] of Object.entries(clips)){
  await page.evaluate(({key,filename})=>{GAME_AUDIO[key]='assets/audio/'+filename;audio.speak('Ujian main balik MP3','Briar',key)},{key,filename});
  await page.waitForFunction(()=>audio.voicePlayer&&!audio.voicePlayer.paused&&audio.voicePlayer.readyState>=2);
  assert(await page.evaluate(()=>audio.speaking));await page.waitForFunction(()=>audio.musicGain.gain.value<.03);
  assert(Math.abs(await page.evaluate(()=>audio.voicePlayer.volume)-.7)<.001);assert(!(await page.locator('#voice-status').isVisible()));
  await page.waitForFunction(()=>!audio.speaking);await page.waitForFunction(()=>audio.musicGain.gain.value>.08);
 }
 // Independent voice/music/effects volumes and replay cancellation.
 await page.evaluate(()=>{audio.speak('Ujian','Briar','welcome');window.previousVoice=audio.voicePlayer;audio.speak('Ujian','Briar','welcome');});assert(await page.evaluate(()=>previousVoice.paused));
 await page.evaluate(()=>{preferences.musicVolume=5;preferences.voiceVolume=85;preferences.effectsVolume=20;audio.sync();});assert(Math.abs(await page.evaluate(()=>audio.voicePlayer.volume)-.85)<.001);assert(Math.abs(await page.evaluate(()=>audio.effectsGain.gain.value)-.2)<.001);
 await page.evaluate(()=>{audio.stopVoice();preferences.voice=false;audio.speak('Ujian','Briar','welcome');});assert.equal(await page.evaluate(()=>audio.voicePlayer),null);
 await page.evaluate(()=>{preferences.music=false;audio.sync()});await page.waitForFunction(()=>audio.musicGain.gain.value===0&&audio.ambienceGain.gain.value===0);
 await page.evaluate(()=>{preferences.effects=false;audio.clearEffects();audio.fx('key')});assert.equal(await page.evaluate(()=>audio.effectNodes.length),0);
 // Broken audio identifies the file and restores music, without speech fallback.
 await page.route('**/broken.mp3',route=>route.fulfill({contentType:'audio/mpeg',body:Buffer.from('invalid mp3')}));
 await page.evaluate(()=>{preferences.voice=true;preferences.music=true;GAME_AUDIO.correct='broken.mp3';audio.speak('Syabas! Jawapan Betul!','Bramble','correct')});
 await page.waitForFunction(()=>document.querySelector('#voice-status').textContent.includes('tidak dapat dimainkan'));
 assert((await page.locator('#voice-status').innerText()).includes('correct-answer-ms.mp3'));assert.equal(await page.evaluate(()=>audio.speaking),false);assert.equal(await page.evaluate(()=>deviceCalls),0);
 // HTMLAudio narration remains independent of Web Audio support.
 const basic=await context.newPage({viewport:{width:390,height:844}});await basic.addInitScript(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined});await basic.goto('http://127.0.0.1:8000/MisidetektifPerasaan/');await basic.locator('[data-action="welcome"]').click();await basic.evaluate(()=>{GAME_AUDIO.welcome='assets/audio/welcome-briar-ms.mp3';audio.speak('Ujian','Briar','welcome')});await basic.waitForFunction(()=>audio.voicePlayer&&!audio.voicePlayer.paused&&audio.voicePlayer.readyState>=2);assert.equal(await basic.evaluate(()=>audio.ctx),null);
 assert.deepEqual(errors,[]);console.log('PASS: MP3 codec/playback for all six slots under a repository subpath, independent volumes, duck/restore, mute, replay cancellation, explicit missing/broken filenames, no TTS calls and HTMLAudio without Web Audio. Test-only tones do not validate real Malay voice quality or deployed recordings.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
