'use strict';
const IMAGES = window.GAME_IMAGES;
const portraits = {Briar:IMAGES.briar,Bramble:IMAGES.bramble,'Logger Vick':IMAGES.vick};
const stories = [
 {who:'Mei Mei',icon:'🐕',text:'Mei Mei ternampak seekor anjing liar berlari ke arahnya ketika dia dalam perjalanan pulang.',question:'Apakah perasaan Mei Mei?',options:['Lega','Takut','Sedih','Risau'],answer:'Takut'},
 {who:'Aina',icon:'🏠',text:'Aina masih belum melihat ayahnya pulang walaupun hari sudah lewat petang.',question:'Apakah perasaan Aina?',options:['Sedih','Lega','Risau','Takut'],answer:'Risau'},
 {who:'Faris',icon:'🚨',text:'Faris terdengar penggera kebakaran dan ternampak asap keluar dari dapur.',question:'Apakah perasaan Faris?',options:['Cemas','Lega','Sedih','Risau'],answer:'Cemas'},
 {who:'Siti',icon:'🚲',text:'Siti terjatuh ketika berbasikal. Basikal kesayangannya pula rosak.',question:'Apakah perasaan Siti?',options:['Lega','Cemas','Takut','Sedih'],answer:'Sedih'},
 {who:'Ah Sheng',icon:'🛟',text:'Ah Sheng berasa selamat selepas dibantu oleh guru keluar dari kawasan berbahaya.',question:'Apakah perasaan Ah Sheng?',options:['Takut','Risau','Lega','Cemas'],answer:'Lega'}
];
const sentences = [
 ['Ali','berasa','takut','apabila','melihat','ular'],
 ['Ibu','risau','kerana','Amir','belum','pulang'],
 ['Adik','berasa','cemas','apabila','tersesat'],
 ['Mei Ling','berasa','sedih','kerana','kehilangan','kucingnya'],
 ['Pasukan penyelamat','berasa','lega','selepas','menemui','mangsa']
];
const STORE='misi-detektif-v1', AUDIO_STORE='misi-audio-v1';
const fresh = () => ({page:'home',level1:{index:0,score:0,attempted:false,solved:false,done:false},level2:{index:0,score:0,attempted:false,solved:false,done:false,order:[]}});
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)) || fallback;}catch{return fallback;}}
function load(){const s=read(STORE,null), d=fresh();if(!s)return d;for(const k of ['level1','level2']){const x=s[k];if(!x||!Number.isInteger(x.index)||x.index<0||x.index>4||!Number.isInteger(x.score)||x.score<0||x.score>5||['attempted','solved','done'].some(p=>typeof x[p]!=='boolean'))return d;}if(s.level2.done&&!s.level1.done)return d;if(!Array.isArray(s.level2.order)||new Set(s.level2.order).size!==s.level2.order.length||s.level2.order.some(n=>!Number.isInteger(n)||n<0||n>=sentences[s.level2.index].length))return d;return {...d,...s};}
let state=load();let storageOK=true;
let preferences={music:true,voice:true,effects:true,...read(AUDIO_STORE,{})};
// Migrate the old shared slider without clearing saved music switches or game progress.
for(const [channel,fallback] of [['music',35],['voice',80],['effects',45]]){
 const value=preferences[channel+'Volume']??preferences.volume??fallback;
 preferences[channel+'Volume']=Number.isFinite(Number(value))?Math.max(0,Math.min(100,Number(value))):fallback;
}
function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch{storageOK=false;}}
function saveAudio(){try{localStorage.setItem(AUDIO_STORE,JSON.stringify(preferences));}catch{}}
const app=document.querySelector('#app');
const audio=createGameAudio(()=>preferences);
let sceneTimers=[];
let newlyUnlocked=0;
const guideText={home:'Hai, detektif muda! Selamat datang ke hutan kami. Bersedia untuk memulakan misi?',map:'Ikut laluan pada peta. Mulakan dengan Cabaran Hutan. Selepas mendapat kunci pertama, teruskan ke Susun dan Selesaikan.',level1:'Baca situasi dengan teliti. Kenal pasti perasaan watak dan pilih jawapan yang paling tepat.',level2:'Pilih perkataan mengikut urutan yang betul untuk membina ayat. Ketik perkataan dalam ruang jawapan untuk mengembalikannya.',victory:'Tahniah! Kamu berjaya menyelesaikan misi!'};
// One homepage autoplay attempt per document, followed only by explicit user actions.
const homeAudio={
 attempted:false,welcomePlayed:false,musicBlocked:false,voiceBlocked:false,request:0,
 update(){const hint=document.querySelector('#home-audio-hint');if(hint)hint.hidden=!((this.musicBlocked&&preferences.music&&preferences.musicVolume>0)||(this.voiceBlocked&&preferences.voice&&preferences.voiceVolume>0));},
 requestWelcome(){
  const request=++this.request;
  return Promise.resolve(audio.speak(guideText.home,'Briar','welcome')).then(played=>{
   if(request!==this.request)return;
   if(played){this.welcomePlayed=true;this.voiceBlocked=false;}
   else if(audio.lastVoiceFailure==='blocked'){this.voiceBlocked=true;audio.clearVoiceNotice();}
   this.update();
  });
 },
 attempt(){
  if(this.attempted||state.page!=='home')return;
  this.attempted=true;audio.start();
  if(audio.ctx)audio.ctx.addEventListener('statechange',()=>{if(audio.ctx.state==='running'){this.musicBlocked=false;this.update();}});
  if(preferences.voice&&preferences.voiceVolume>0)this.requestWelcome();
  // This checks the outcome once; it never retries resume() or play().
  setTimeout(()=>{this.musicBlocked=!!(preferences.music&&preferences.musicVolume>0&&audio.ctx&&audio.ctx.state!=='running');this.update();},350);
 },
 startMission(){
  const playing=!!(audio.voicePlayer&&!audio.voicePlayer.paused);
  this.musicBlocked=false;this.voiceBlocked=false;this.update();
  // Preserve an already-playing welcome; otherwise start the recording in this click.
  navigate('map',false,playing);
  if(!playing&&!this.welcomePlayed)this.requestWelcome();
 }
};
function button(label,action,cls='button'){return `<button class="${cls}" data-action="${action}">${label}</button>`;}
function replay(role,text,key=''){return `<button class="text-button" data-action="narrate" data-role="${role}" data-text="${text}" data-clip="${key}">◖)) Dengar panduan ${role}</button>`;}
function guide(role,text){return `<aside class="guide"><img src="${portraits[role]}" alt="${role}, pemandu pengembaraan"><div class="guide-content"><strong>${role}</strong><p>${text}</p>${replay(role,guideText[state.page],state.page)}</div></aside>`;}
function allowed(page){if(page==='level2'&&!state.level1.done)return 'map';if(page==='victory'&&!(state.level1.done&&state.level2.done))return 'map';return ['home','map','level1','level2','victory'].includes(page)?page:'home';}
function navigate(page,announce=false,preserveVoice=false){sceneTimers.forEach(clearTimeout);sceneTimers=[];if(!preserveVoice)audio.stopVoice();audio.clearEffects();state.page=allowed(page);history.replaceState(null,'','#'+state.page);audio.track=state.page==='victory'?'victory':'forest';save();render();if(announce&&state.page!=='map'){const role=state.page==='level2'?'Bramble':'Briar';audio.speak(guideText[state.page],role,state.page==='home'?'welcome':state.page);}window.scrollTo({top:0,behavior:'instant'});app.focus({preventScroll:true});if(state.page==='victory'&&audio.started)celebrateVictory();}
function home(){return `<section class="landing"><div class="landing-art"><img src="${IMAGES.home}" alt="Briar, Bramble dan Logger Vick di hutan" fetchpriority="high"></div><div class="landing-title"><h1>Misi Detektif Perasaan</h1><p>Waspada Selalu</p><div class="creator-credit"><span>Disediakan oleh</span> <strong>Cikgu Ong</strong></div></div><div class="landing-actions">${button('MULA MISI','start','button gold start-button')}<p id="home-audio-hint" class="home-audio-hint" role="status" hidden>Tekan MULA MISI untuk memulakan muzik dan suara.</p><button class="welcome-speaker" data-action="welcome" aria-label="Dengar sambutan Briar">♫</button><div class="welcome-bubble" id="welcome-bubble" hidden><p>${guideText.home}</p>${replay('Briar',guideText.home,'welcome')}</div></div></section>`;}
function map(){const a=state.level1.done,b=state.level2.done;const stop=(cls,role,img,title,action,unlocked,done,subtitle)=>`<div class="map-stop ${cls} ${unlocked?'':'locked'} ${cls==='first'&&!a?'start-here':''} ${cls==='second'&&newlyUnlocked===1?'just-unlocked':''} ${cls==='final'&&newlyUnlocked===2?'just-unlocked':''}">${cls==='first'&&!a?'<span class="mission-arrow" aria-hidden="true">↓</span>':''}<img class="map-character" src="${img}" alt="${role}"><button class="wood-sign" data-action="${action}" ${unlocked?'':'disabled'}><small>${subtitle}</small><strong>${title}</strong><span>${done?'✓ Kunci diperoleh':unlocked?'TEROKAI →':'🔒 Terkunci'}</span></button></div>`;return `<div class="section-head"><div><div class="eyebrow">Dua cabaran · Dua kunci</div><h2>Peta Hutan</h2></div>${button('⌂ Laman utama','home','button secondary')}</div><section class="map" aria-label="Dua cabaran dan pusat keselamatan"><svg class="map-route" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><path d="M150 420 C250 560 330 180 500 300 S740 540 860 350"/></svg>${stop('first','Briar',IMAGES.briar,'Cabaran Hutan','level1',true,a,'TAHAP 1')}${stop('second','Bramble',IMAGES.bramble,'Susun dan Selesaikan','level2',a,b,'TAHAP 2')}${stop('final','Logger Vick',IMAGES.vick,'Pusat Keselamatan Hutan','victory',a&&b,a&&b,'DESTINASI AKHIR')}</section><div class="map-footer"><span>🗝 ${Number(a)+Number(b)} / 2 kunci · Markah: ${state.level1.score+state.level2.score} / 10</span>${replay('Briar',guideText.map,'map')}</div><p class="hint">1 markah untuk jawapan betul pada cubaan pertama. Kamu boleh mencuba lagi hingga berjaya.</p>${!storageOK?'<p class="hint">Pelayar tidak membenarkan simpanan. Kemajuan kekal sepanjang halaman ini dibuka sahaja.</p>':''}`;}
function levelHeader(n,title,l){return `${button('← Kembali ke peta','map','text-button back')}<div class="section-head"><div><div class="eyebrow">Tahap ${n} · ${n===1?'Misteri di Hutan':'Teka-teki perkataan'}</div><h2>${title}</h2></div><span class="hint">Soalan ${l.index+1} / 5<br>Markah: ${l.score} / 5</span></div><div class="progress-track" role="progressbar" aria-label="Kemajuan tahap" aria-valuenow="${l.index+Number(l.solved)}" aria-valuemin="0" aria-valuemax="5"><span style="width:${(l.index+Number(l.solved))*20}%"></span></div>`;}
function completion(n){const l=state['level'+n];return `<section class="result"><div class="eyebrow">Cabaran selesai</div><div class="big-key" aria-hidden="true">🗝</div><h2>${n===1?'Kunci Pertama diperoleh!':'Kunci Kedua diperoleh!'}</h2><p>${n===1?'Tahniah, detektif! Kamu berjaya menyelesaikan Cabaran Hutan. Tahap 2 kini dibuka.':'Syabas! Kamu berjaya menyusun semua ayat dengan betul. Pusat Keselamatan Hutan kini dibuka.'}</p><div class="score-boxes"><div class="score-box"><b>${l.score} / 5</b><small>Betul pada cubaan pertama</small></div><div class="score-box"><b>5 / 5</b><small>Soalan diselesaikan</small></div></div>${button('KEMBALI KE PETA','map')}${button(n===1?'TERUSKAN TAHAP 2':'BUKA PETI KEJAYAAN',n===1?'level2':'victory','button gold')}</section>`;}
function story(){const l=state.level1;if(l.done)return completion(1);const q=stories[l.index];return `${levelHeader(1,'Cabaran Hutan',l)}<div class="level-scenery"><img src="${state.page==='level1'?IMAGES.level1:IMAGES.level2}" alt="${state.page==='level1'?'Laluan hutan untuk Cabaran Hutan':'Pengembaraan hutan untuk Susun dan Selesaikan'}"></div><div class="activity">${guide('Briar',guideText.level1)}<section class="card"><div class="scenario-symbol" role="img" aria-label="Ilustrasi situasi ${q.who}">${q.icon}</div><p class="story-scene">${q.text}</p><p class="question">${q.question}</p><div class="options">${q.options.map((o,i)=>`<button class="option" data-answer="${i}" ${l.solved?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${o}</button>`).join('')}</div></section></div>`;}
function shuffledIndices(n){/* A fixed permutation keeps a resumed puzzle stable without displaying the answer. */return Array.from({length:n},(_,i)=>(i+3)%n).reverse();}
function puzzle(){const l=state.level2;if(l.done)return completion(2);const words=sentences[l.index];return `${levelHeader(2,'Susun dan Selesaikan',l)}<div class="level-scenery"><img src="${state.page==='level1'?IMAGES.level1:IMAGES.level2}" alt="${state.page==='level1'?'Laluan hutan untuk Cabaran Hutan':'Pengembaraan hutan untuk Susun dan Selesaikan'}"></div><div class="activity">${guide('Bramble',guideText.level2)}<section class="card"><div class="eyebrow">Ayat ${l.index+1} · Bina ayat kamu</div><p class="question">Susun perkataan menjadi ayat yang gramatis.</p><p class="hint">Mulakan dengan huruf besar. Tanda noktah akan ditambah selepas jawapan disemak.</p><div class="answer-zone" aria-label="Susunan jawapan">${l.order.map(i=>`<button class="tile" data-remove="${i}" ${l.solved?'disabled':''} aria-label="Kembalikan ${words[i]}">${words[i]}</button>`).join('')}${(l.solved||l.submitted)&&l.order.length===words.length?'<span class="sentence-stop">.</span>':''}</div><div class="word-bank" aria-label="Pilihan perkataan">${shuffledIndices(words.length).filter(i=>!l.order.includes(i)).map(i=>`<button class="tile" data-add="${i}">${words[i]}</button>`).join('')}</div><div class="puzzle-actions">${button('Semak Jawapan','check')}${button('Susun Semula','reorder','button secondary')}</div><p id="puzzle-hint" class="hint" role="status"></p></section></div>`;}
function victory(){return `<section class="result"><div class="eyebrow">Pusat Keselamatan Hutan</div><div class="confetti" aria-hidden="true">✧ ✦ ✧ ✦</div><div class="treasure-stage" role="img" aria-label="Dua kunci bergerak ke peti, mangga terbuka dan penutup terangkat. Kedua-dua kunci kelihatan di dalam peti."><span class="flying-key key-one" aria-hidden="true">🗝</span><span class="flying-key key-two" aria-hidden="true">🗝</span><div class="treasure-glow" aria-hidden="true">✦ ✧ ✦</div><div class="treasure-chest"><div class="treasure-interior"><span class="inside-key">🗝</span><span class="inside-key">🗝</span></div><div class="treasure-front"></div><div class="treasure-lid"></div><span class="treasure-lock" aria-hidden="true">▣</span></div></div><h1>MISI BERJAYA!</h1><img class="victory-character" src="${IMAGES.victory}" alt="Briar, Bramble dan Logger Vick meraikan kejayaan kamu"><p>Tahniah, detektif muda! Kamu telah berjaya menyelesaikan kedua-dua cabaran, mengenal pasti kata adjektif perasaan dan menyusun ayat dengan betul. Ingatlah, sentiasa utamakan keselamatan diri!</p><div class="score-boxes"><div class="score-box"><b>🗝 🗝</b><small>Kedua-dua kunci dikumpulkan</small></div><div class="score-box"><b>${state.level1.score+state.level2.score} / 10</b><small>Jumlah markah cubaan pertama</small></div></div><p>✓ Tahap 1: Cabaran Hutan — ${state.level1.score}/5<br>✓ Tahap 2: Susun dan Selesaikan — ${state.level2.score}/5</p>${button('MAIN SEMULA','reset','button gold')}${button('KEMBALI KE PETA','map','button secondary')}<div>${replay('Briar',guideText.victory,'victory')}</div><div id="reset-confirm" hidden class="feedback"><p>Mulakan misi baharu? Kemajuan dan markah akan dikosongkan. Tetapan audio dikekalkan.</p>${button('Ya, mula semula','confirm-reset')}${button('Batal','cancel-reset','button secondary')}</div></section>`;}
function render(){state.page=allowed(state.page);document.querySelector('#key-count').textContent=`🗝 ${Number(state.level1.done)+Number(state.level2.done)} / 2 kunci`;document.body.dataset.page=state.page;document.body.style.setProperty('--forest',`url("${IMAGES.map}")`);document.body.style.setProperty('--scene',`url("${IMAGES[state.page]||IMAGES.map}")`);document.querySelector('#voice-status').hidden=true;app.innerHTML=({home,map,level1:story,level2:puzzle,victory})[state.page]();if(['level1','level2'].includes(state.page)){const l=state[state.page];if(l.solved&&!l.done)showFeedback(true);}document.title=`${{home:'Selamat datang',map:'Peta Hutan',level1:'Cabaran Hutan',level2:'Susun dan Selesaikan',victory:'Misi Berjaya'}[state.page]} · Misi Detektif Perasaan`;}
function completeSentence(words){return words.join(' ').replace(/^./,c=>c.toUpperCase())+'.';}
function showFeedback(correct){audio.stopVoice();document.querySelector('#answer-feedback')?.remove();const n=state.page==='level1'?1:2,l=state['level'+n];const dialog=document.createElement('dialog');dialog.id='answer-feedback';dialog.className='answer-feedback '+(correct?'success':'retry');dialog.setAttribute('aria-labelledby','feedback-title');dialog.innerHTML=`<p class="recording-status" role="status" hidden></p><div class="feedback-header">MISI DETEKTIF PERASAAN<small>WASPADA SELALU</small></div><div class="feedback-stars" aria-hidden="true">${correct?'✦ ✧ ✦':'…'}</div><img class="feedback-character" src="${correct?IMAGES.correct:IMAGES.wrong}" alt="${correct?'Bramble meraikan jawapan betul':'Bramble sedang berfikir'}"><h2 id="feedback-title">${correct?'SYABAS! JAWAPAN BETUL!':'CUBA LAGI!'}</h2><p>${correct?'Hebat! Kamu memang detektif yang bijak!':'Tidak mengapa, detektif! Cuba fikirkan sekali lagi.'}</p>${correct?`<div class="points">${l.attempted?'Selesai selepas mencuba · +0 markah':'+1 markah'}</div>${n===2?`<p class="correct-sentence">${completeSentence(sentences[l.index])}</p>`:''}`:''}${replay('Bramble',correct?'Syabas! Jawapan Betul!':'Cuba Lagi!',correct?'correct':'retry')}${button(correct?'SOALAN SETERUSNYA':'ULANG CUBA',correct?'next'+n:'retry','button gold')}`;app.append(dialog);dialog.addEventListener('cancel',e=>{if(correct)e.preventDefault();});dialog.showModal();audio.speak(correct?'Syabas! Jawapan Betul!':'Cuba Lagi!','Bramble',correct?'correct':'retry');}
function celebrateVictory(){for(const [delay,kind] of [[1300,'unlock'],[1900,'chest'],[2800,'win']])sceneTimers.push(setTimeout(()=>{if(state.page==='victory')audio.fx(kind)},delay));}
function next(n){const l=state['level'+n];if(!l.solved)return;if(l.index===4){l.done=true;newlyUnlocked=n;save();render();audio.fx('key');if(window.GAME_AUDIO['complete'+n])audio.speak(n===1?'Tahniah! Kunci pertama diperoleh. Tahap dua kini dibuka.':'Syabas! Kunci kedua diperoleh. Pusat Keselamatan Hutan kini dibuka.','Briar','complete'+n);/* Distinct unlock cue follows the key cue. */setTimeout(()=>{if(state['level'+n].done&&state.page==='level'+n)audio.fx('unlock');},650);}else{audio.stopVoice();l.index++;l.attempted=false;l.solved=false;l.submitted=false;if(n===2)l.order=[];save();render();}}
app.addEventListener('click',e=>{const el=e.target.closest('button');if(!el||el.disabled)return;audio.start();const action=el.dataset.action;
 if(el.dataset.answer!==undefined){if(state.page!=='level1'||state.level1.solved)return;const l=state.level1,q=stories[l.index],ok=q.options[Number(el.dataset.answer)]===q.answer;if(ok){if(!l.attempted)l.score++;l.solved=true;}else l.attempted=true;save();render();if(!ok)showFeedback(false);audio.fx(ok?'correct':'wrong');return;}
 if(el.dataset.add!==undefined||el.dataset.remove!==undefined){if(state.page!=='level2'||state.level2.solved)return;const l=state.level2;l.submitted=false;if(el.dataset.add!==undefined){const i=Number(el.dataset.add);if(!l.order.includes(i))l.order.push(i);}else l.order=l.order.filter(i=>i!==Number(el.dataset.remove));save();render();audio.fx('click');return;}
 audio.fx('click');
 if(action==='welcome'){document.querySelector('#welcome-bubble').hidden=false;homeAudio.requestWelcome();return;}
 if(action==='retry'){audio.stopVoice();document.querySelector('#answer-feedback').close();document.querySelector('.option,.tile')?.focus();return;}
 if(action==='start'){homeAudio.startMission();return;}
 if(['home','map','level1','level2','victory'].includes(action)){navigate(action,true);return;}
 if(action==='narrate'){if(el.dataset.clip==='welcome')homeAudio.requestWelcome();else audio.speak(el.dataset.text,el.dataset.role,el.dataset.clip);return;}
 if(action==='next1'||action==='next2'){next(action==='next1'?1:2);return;}
 if(action==='check'){const l=state.level2;if(l.solved)return;const words=sentences[l.index];if(l.order.length!==words.length){document.querySelector('#puzzle-hint').textContent='Susun semua perkataan dahulu.';audio.fx('wrong');return;}
 l.submitted=true;const submitted=completeSentence(l.order.map(i=>words[i]));const expected=completeSentence(words);const ok=l.order.every((v,i)=>v===i)&&submitted===expected&&submitted.endsWith('.');if(ok){if(!l.attempted)l.score++;l.solved=true;}else l.attempted=true;save();render();if(!ok)showFeedback(false);audio.fx(ok?'correct':'wrong');return;}
 if(action==='reorder'){if(state.level2.solved)return;state.level2.order=[];state.level2.submitted=false;save();render();return;}
 if(action==='reset'){document.querySelector('#reset-confirm').hidden=false;return;}
 if(action==='cancel-reset'){document.querySelector('#reset-confirm').hidden=true;return;}
 if(action==='confirm-reset'){newlyUnlocked=0;state=fresh();navigate('home');}
});
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();audio.start();navigate('home');});
document.querySelector('#audio-toggle').addEventListener('click',()=>{const p=document.querySelector('#audio-panel');p.hidden=!p.hidden;document.querySelector('#audio-toggle').setAttribute('aria-expanded',String(!p.hidden));});
for(const id of ['music','voice','effects']){const input=document.getElementById(id);input.checked=!!preferences[id];input.addEventListener('change',()=>{preferences[id]=input.checked;audio.start();if(id==='voice'&&!input.checked)audio.stopVoice();if(id==='effects'&&!input.checked)audio.clearEffects();audio.sync();homeAudio.update();saveAudio();});}
for(const channel of ['music','voice','effects']){
 const slider=document.getElementById(channel+'-volume');
 slider.value=preferences[channel+'Volume'];
 slider.addEventListener('input',()=>{preferences[channel+'Volume']=Number(slider.value);audio.start();audio.sync();if(channel==='voice'&&Number(slider.value)===0)audio.stopVoice();homeAudio.update();saveAudio();});
}
document.addEventListener('visibilitychange',()=>{if(document.hidden){audio.pause();}else if(audio.started&&audio.ctx&&audio.wasRunning)audio.ctx.resume().then(()=>audio.sync()).catch(()=>{});});
window.addEventListener('pagehide',()=>{audio.pause();});
// Hash navigation is guarded as well as every visible route.
window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)||'home'));
if(location.hash)state.page=allowed(location.hash.slice(1));audio.track=state.page==='victory'?'victory':'forest';render();save();homeAudio.attempt();
