// Development-only end-to-end checks. Start python3 -m http.server 8000 first.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],broken=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)broken.push(`${r.status()} ${r.url()}`)});
 const click=async action=>page.locator(`[data-action="${action}"]`).first().click();
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('misi-detektif-v1')));
 const visibleDialog=async title=>{assert(await page.locator('#answer-feedback').isVisible());assert.equal(await page.locator('#feedback-title').innerText(),title);assert(await page.evaluate(()=>document.querySelector('#answer-feedback').contains(document.activeElement)));};
 await page.goto('http://127.0.0.1:8000');await page.evaluate(()=>localStorage.clear());await page.reload();
 assert.equal(await page.locator('h1').innerText(),'Misi Detektif Perasaan');assert.equal(await page.locator('.landing-title p').innerText(),'Waspada Selalu');assert.equal(await page.locator('.learning').count(),0);assert(await page.locator('.brand').isVisible());assert.equal(await page.locator('.brand-lines>span').innerText(),'MISI DETEKTIF PERASAAN');assert.equal(await page.locator('.brand small').innerText(),'WASPADA SELALU');assert(await page.locator('.landing h1').evaluate(el=>el.getBoundingClientRect().height<parseFloat(getComputedStyle(el).fontSize)*1.5));
 assert.equal(await page.evaluate(()=>audio.started),false);
 await page.screenshot({path:'/tmp/misi-redesign-home.png',fullPage:true});
 await click('welcome');assert(await page.locator('#welcome-bubble').isVisible());assert.equal(await page.evaluate(()=>audio.ctx.state),'running');
 // Supplied recordings play directly without querying browser/device TTS.
 await page.waitForFunction(()=>audio.voicePlayer&&!audio.voicePlayer.paused&&audio.voicePlayer.readyState>=2);assert(!(await page.locator('#voice-status').isVisible()));
 await page.evaluate(()=>{window.ttsCalls=0;if('speechSynthesis' in window){speechSynthesis.speak=()=>{ttsCalls++;throw Error('Device TTS must not be used')};speechSynthesis.getVoices=()=>{ttsCalls++;throw Error('Device voices must not be inspected')};}window.voiceRequests=[];const original=audio.speak;audio.speak=function(text,role,key){voiceRequests.push({text,key});return original.call(this,text,role,key)};});
 await click('welcome');assert.equal(await page.evaluate(()=>voiceRequests.at(-1).text),'Hai, detektif muda! Selamat datang ke hutan kami. Bersedia untuk memulakan misi?');await page.waitForFunction(()=>audio.speaking);assert.equal(await page.evaluate(()=>ttsCalls),0);await page.evaluate(()=>audio.stopVoice());
 await click('start');assert.equal((await state()).page,'map');assert.equal(await page.locator('.map-character').count(),3);assert(await page.locator('.mission-arrow').isVisible());assert(await page.locator('.map-stop.first').evaluate(el=>el.classList.contains('start-here')));assert(await page.evaluate(()=>audio.windSource.loop));assert(await page.evaluate(()=>audio.timer!==null));
 await page.screenshot({path:'/tmp/misi-redesign-map.png',fullPage:true});
 assert(await page.locator('[data-action="level2"]').isDisabled());assert(await page.locator('[data-action="victory"]').isDisabled());
 await page.evaluate(()=>navigate('level2'));assert.equal((await state()).page,'map');await page.evaluate(()=>navigate('victory'));assert.equal((await state()).page,'map');
 await page.locator('#audio-toggle').click();await page.locator('#music').uncheck();await page.waitForFunction(()=>audio.musicGain.gain.value===0);assert.equal(await page.evaluate(()=>audio.ambienceGain.gain.value),0);await page.locator('#music').check();await page.locator('#voice').uncheck();await page.locator('#effects').uncheck();await page.locator('#effects').check();await page.locator('#music-volume').fill('25');await page.locator('#voice-volume').fill('80');await page.locator('#effects-volume').fill('45');await page.locator('#audio-toggle').click();
 await click('level1');assert.equal(await page.locator('.guide strong').innerText(),'Briar');assert.equal(await page.locator('.guide p').innerText(),'Baca situasi dengan teliti. Kenal pasti perasaan watak dan pilih jawapan yang paling tepat.');assert(await page.locator('.option').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=20&&el.getBoundingClientRect().height>=72));const background1=await page.evaluate(()=>getComputedStyle(document.body).getPropertyValue('--scene'));
 assert(background1.includes('Screenshot (310)(2).png'));await page.evaluate(()=>{preferences.voice=true;window.voiceRequests=[];});
 const expectedStories=['Mei Mei','Aina','Faris','Siti','Ah Sheng'],answers=[1,2,0,3,2];
 await page.screenshot({path:'/tmp/misi-redesign-story.png',fullPage:true});
 await page.locator('[data-answer="0"]').click();await visibleDialog('CUBA LAGI!');assert.equal(await page.evaluate(()=>voiceRequests.at(-1).text),'Cuba Lagi!');await page.waitForFunction(()=>audio.voicePlayer&&!audio.voicePlayer.paused&&audio.voicePlayer.readyState>=2);assert(!(await page.locator('#answer-feedback .recording-status').isVisible()));assert.equal((await state()).level1.score,0);assert.equal(await page.locator('.correct-sentence').count(),0);
 await page.screenshot({path:'/tmp/misi-redesign-retry.png',fullPage:true});await click('retry');assert(!(await page.locator('#answer-feedback').isVisible()));
 for(let i=0;i<5;i++){
  assert((await page.locator('.story-scene').innerText()).includes(expectedStories[i]));assert.equal(await page.evaluate(()=>getComputedStyle(document.body).getPropertyValue('--scene')),background1);
  await page.locator(`[data-answer="${answers[i]}"]`).click();await visibleDialog('SYABAS! JAWAPAN BETUL!');assert((await page.locator('.points').innerText()).includes(i===0?'+0':'+1'));
  if(i===0){assert.equal(await page.evaluate(()=>voiceRequests.at(-1).text),'Syabas! Jawapan Betul!');await page.reload();await visibleDialog('SYABAS! JAWAPAN BETUL!');}
  await click('next1');
 }
 assert.equal((await state()).level1.score,4);assert((await state()).level1.done);await click('map');assert(!(await page.locator('[data-action="level2"]').isDisabled()));assert(await page.locator('.map-stop.second').evaluate(el=>el.classList.contains('just-unlocked')));await click('level2');assert.equal(await page.locator('.guide strong').innerText(),'Bramble');assert.equal(await page.locator('.guide p').innerText(),'Pilih perkataan mengikut urutan yang betul untuk membina ayat. Ketik perkataan dalam ruang jawapan untuk mengembalikannya.');assert(await page.locator('.tile').first().evaluate(el=>el.getBoundingClientRect().height>=55));
 const background2=await page.evaluate(()=>getComputedStyle(document.body).getPropertyValue('--scene'));assert.notEqual(background1,background2);
 await click('check');assert((await page.locator('#puzzle-hint').innerText()).includes('Susun semua'));assert.equal((await state()).level2.attempted,false);
 // A complete wrong sentence receives punctuation, but no correct sentence is revealed.
 for(const j of [1,0,2,3,4,5])await page.locator(`[data-add="${j}"]`).click();
 await click('check');await visibleDialog('CUBA LAGI!');assert.equal(await page.locator('.sentence-stop').innerText(),'.');assert.equal(await page.locator('.correct-sentence').count(),0);await click('retry');await click('reorder');
 for(let i=0;i<5;i++){
  assert.equal(await page.evaluate(()=>getComputedStyle(document.body).getPropertyValue('--scene')),background2);
  const n=i===2?5:6;
  for(let j=0;j<n;j++)await page.locator(`[data-add="${j}"]`).click();
  if(i===0){await page.screenshot({path:'/tmp/misi-redesign-puzzle.png',fullPage:true});}
  if(i===1){await page.reload();assert.equal((await state()).level2.order.length,6);}
  assert.equal(await page.locator('.tile').filter({hasText:/^\.$/}).count(),0);
  await click('check');await visibleDialog('SYABAS! JAWAPAN BETUL!');const sentence=await page.locator('.correct-sentence').innerText();assert(/^[A-Z].*[^.]\.$/.test(sentence));assert(!sentence.endsWith('..'));assert.equal(await page.locator('.sentence-stop').innerText(),'.');
  if(i===1)await page.screenshot({path:'/tmp/misi-redesign-correct.png',fullPage:true});await click('next2');
 }
 assert.equal((await state()).level2.score,4);assert((await state()).level2.done);await click('victory');assert((await page.locator('main').innerText()).includes('8 / 10'));assert.equal(await page.evaluate(()=>audio.track),'victory');assert.equal(await page.locator('.inside-key').count(),2);assert(await page.locator('.inside-key').first().isVisible());assert(await page.locator('.treasure-lid').evaluate(el=>getComputedStyle(el).transform!=='none'));await page.screenshot({path:'/tmp/misi-redesign-victory.png',fullPage:true});
 // Visibly closed-to-open chest sequence under normal motion.
 const animationPage=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
 await animationPage.goto('http://127.0.0.1:8000');await animationPage.evaluate(()=>{state.level1.done=true;state.level2.done=true;navigate('victory')});
 const lidStart=await animationPage.locator('.treasure-lid').evaluate(el=>getComputedStyle(el).transform);
 await animationPage.screenshot({path:'/tmp/misi-chest-start.png',fullPage:true});
 await animationPage.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.inside-key')).opacity)>.99);
 const lidEnd=await animationPage.locator('.treasure-lid').evaluate(el=>getComputedStyle(el).transform);assert.notEqual(lidStart,lidEnd);assert.equal(await animationPage.locator('.inside-key').count(),2);assert.equal(await animationPage.locator('.treasure-lock').evaluate(el=>getComputedStyle(el).opacity),'0');
 await animationPage.screenshot({path:'/tmp/misi-chest-open.png',fullPage:true});await animationPage.close();
 // Existing progress, route guards and replay remain intact.
 await click('reset');await click('cancel-reset');assert((await state()).level2.done);await click('reset');await click('confirm-reset');assert(!(await state()).level1.done);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('misi-audio-v1')).musicVolume),25);
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:900});
  for(const route of ['home','map','level1']){await page.evaluate(r=>navigate(r),route);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${width} ${route}`);}
  await page.evaluate(()=>{state.level1.done=true;navigate('level2')});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('[data-add="0"]').click();await page.locator('[data-remove="0"]').click();
  await page.evaluate(()=>showFeedback(false));assert(await page.locator('#answer-feedback').isVisible());assert(await page.evaluate(()=>document.querySelector('#answer-feedback').getBoundingClientRect().width<=innerWidth));await click('retry');
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>navigate('home'));await page.screenshot({path:'/tmp/misi-redesign-mobile-home.png',fullPage:true});await page.evaluate(()=>navigate('map'));await page.screenshot({path:'/tmp/misi-redesign-mobile-map.png',fullPage:true});
 // Validate all eleven exact originals, active image mappings and decoded images.
 const report=require('../assets/IMAGE-MAPPING.json');assert(report.every(item=>item.original_available));assert.equal(new Set(report.map(item=>item.required)).size,11);const paths=await page.evaluate(()=>Object.values(IMAGES));for(const path of paths)assert.equal((await page.request.get('http://127.0.0.1:8000/'+encodeURI(path))).status(),200,path);
 assert(await page.locator('img').evaluateAll(images=>images.every(im=>im.complete&&im.naturalWidth>0)));
 for(const kind of ['correct','wrong','key','unlock','chest','win'])assert(await page.evaluate(k=>{audio.fx(k);return audio.effectNodes.length>0},kind));
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.setItem=()=>{throw Error('blocked')};Storage.prototype.getItem=()=>{throw Error('blocked')};});const p2=await blocked.newPage();await p2.goto('http://127.0.0.1:8000');await p2.locator('[data-action="start"]').click();assert((await p2.locator('main').innerText()).includes('Pelayar tidak membenarkan simpanan'));
 assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);
 console.log('PASS: full redesigned journey, worksheet stories, modal focus/retry/next, scoring, punctuation for all 5 sentences, saved progress, supplied recordings-only narration, independent audio controls, assets and responsive layouts. All eleven exact originals are present and mapped.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
