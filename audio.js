'use strict';
// Narration uses local recordings only. No device TTS or English fallback.
// Gentle music, breeze and occasional birds are original browser-generated sounds.
window.createGameAudio = function (getPreferences) {
  const files = window.GAME_AUDIO || {};
  const expected = window.GAME_AUDIO_EXPECTED || {};
  const audio = {
    ctx: null, master: null, musicGain: null, ambienceGain: null, effectsGain: null,
    timer: null, beat: 0, started: false, track: 'forest', effectNodes: [],
    voicePlayer: null, effectPlayer: null, ambiencePlayer: null,
    speaking: false, voiceGeneration: 0, windSource: null, loadTimer: null,
    init() {
      if (this.ctx) { this.ctx.resume().catch(() => {}); return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        this.master = this.ctx.createGain(); this.master.gain.value=1; this.master.connect(this.ctx.destination);
        this.musicGain = this.ctx.createGain(); this.musicGain.connect(this.master);
        this.ambienceGain = this.ctx.createGain(); this.ambienceGain.connect(this.master);
        this.effectsGain = this.ctx.createGain(); this.effectsGain.connect(this.master);
        if (files.ambience) {
          this.ambiencePlayer = new Audio(files.ambience);
          this.ambiencePlayer.loop = true;
          this.ambiencePlayer.onerror = () => { this.ambiencePlayer = null; this.makeWind(); this.sync(); };
        } else this.makeWind();
      } catch { /* Written guidance and the game remain available without audio. */ }
    },
    start() { const first=!this.ctx; this.started = true; this.init(); if(first&&this.ctx?.state==='suspended')this.ctx.resume().catch(()=>{}); this.sync(); },
    makeWind() {
      if (!this.ctx || this.windSource) return;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 4, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const wind = this.ctx.createBufferSource(), filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 500;
      const breeze = this.ctx.createGain(); breeze.gain.value = .04;
      const sway = this.ctx.createOscillator(), depth = this.ctx.createGain();
      sway.frequency.value = .13; depth.gain.value = .012;
      sway.connect(depth); depth.connect(breeze.gain); sway.start();
      wind.buffer = buffer; wind.loop = true; wind.connect(filter);
      filter.connect(breeze); breeze.connect(this.ambienceGain); wind.start();
      this.windSource = wind;
    },
    sync() {
      const p = getPreferences(), factor = this.speaking ? .22 : 1;
      const musicVolume=p.musicVolume/100;
      if(this.effectsGain)this.effectsGain.gain.value=p.effects?p.effectsVolume/100:0;
      if (this.musicGain) {
        this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.musicGain.gain.value = p.music ? .22 * musicVolume * factor : 0;
        this.ambienceGain.gain.value = p.music ? .3 * musicVolume * factor : 0;
      }
      if (this.voicePlayer) this.voicePlayer.volume = p.voiceVolume / 100;
      if (this.effectPlayer) this.effectPlayer.volume = p.effectsVolume / 100;
      if (this.ambiencePlayer) {
        this.ambiencePlayer.volume = musicVolume * .12 * factor;
        if (p.music && !document.hidden && this.started) this.ambiencePlayer.play().catch(() => {});
        else this.ambiencePlayer.pause();
      }
      if (this.started && !this.timer && this.ctx) {
        this.tick(); this.timer = setInterval(() => this.tick(), 340);
      }
    },
    duck(on) { this.speaking = on; this.sync(); },
    tone(frequency, time, duration, gain = .15, type = 'sine', bus) {
      if (!this.ctx) return;
      const oscillator = this.ctx.createOscillator(), envelope = this.ctx.createGain();
      oscillator.type = type; oscillator.frequency.value = frequency;
      envelope.gain.setValueAtTime(.0001, time);
      envelope.gain.exponentialRampToValueAtTime(gain, time + .012);
      envelope.gain.exponentialRampToValueAtTime(.0001, time + duration);
      oscillator.connect(envelope); envelope.connect(bus || this.effectsGain);
      oscillator.start(time); oscillator.stop(time + duration + .02);
      if (!bus) this.effectNodes.push(oscillator);
      oscillator.onended = () => {
        oscillator.disconnect(); envelope.disconnect();
        this.effectNodes = this.effectNodes.filter(node => node !== oscillator);
      };
    },
    chirp(time) {
      if (!this.ctx) return;
      for (let i = 0; i < 2; i++) {
        const bird = this.ctx.createOscillator(), envelope = this.ctx.createGain();
        const t = time + i * .14;
        bird.frequency.setValueAtTime(1700 + Math.random() * 200, t);
        bird.frequency.exponentialRampToValueAtTime(2800, t + .07);
        bird.frequency.exponentialRampToValueAtTime(1900, t + .12);
        envelope.gain.setValueAtTime(.0001, t);
        envelope.gain.exponentialRampToValueAtTime(.025, t + .025);
        envelope.gain.exponentialRampToValueAtTime(.0001, t + .13);
        bird.connect(envelope); envelope.connect(this.ambienceGain);
        bird.start(t); bird.stop(t + .14);
        bird.onended = () => { bird.disconnect(); envelope.disconnect(); };
      }
    },
    tick() {
      if (!getPreferences().music || !this.ctx || this.ctx.state !== 'running') return;
      // Major pentatonic melody: soft marimba notes with a light piano-like octave.
      // No low drone, percussion hits, suspense intervals or animal calls.
      const melody = this.track === 'victory'
        ? [523,659,784,880,1047,880,784,659,523,659,784,1047,880,784,659,523]
        : [523,659,784,659,587,659,784,880,784,659,587,523,587,659,784,659,
           523,587,659,784,880,784,659,587,523,659,784,659,587,523,587,659];
      const step = this.beat++, i = step % melody.length, t = this.ctx.currentTime;
      this.tone(melody[i], t, .48, .12, 'sine', this.musicGain);
      this.tone(melody[i]*2, t+.008, .17, .025, 'sine', this.musicGain);
      if (step % 8 === 0) {
        const root=[262,349,392,349][Math.floor(step/8)%4];
        this.tone(root,t,1.4,.065,'sine',this.musicGain);
        this.tone(root*1.5,t+.09,1.3,.035,'sine',this.musicGain);
      }
      if (step % 32 === 9) this.chirp(t + .05);
    },
    fx(kind) {
      if (!getPreferences().effects) return;
      this.clearEffects();
      const file = files[{correct:'correctSound',wrong:'wrongSound'}[kind] || kind];
      if (file) {
        this.effectPlayer = new Audio(file); this.effectPlayer.volume = getPreferences().effectsVolume / 100;
        this.effectPlayer.play().catch(() => this.synthEffect(kind));
      } else this.synthEffect(kind);
    },
    synthEffect(kind) {
      if (!this.ctx) return;
      const notes = {click:[440],wrong:[330,294],correct:[523,659,784],unlock:[392,523,659,784],
        key:[659,784,1047],chest:[262,392,523,784],win:[523,659,784,1047,784,1047]}[kind] || [440];
      notes.forEach((n,i) => this.tone(n, this.ctx.currentTime + i * .09, .19, kind === 'click' ? .045 : .12));
    },
    clearEffects() {
      if (this.effectPlayer) { this.effectPlayer.pause(); this.effectPlayer = null; }
      this.effectNodes.forEach(node => { try { node.stop(); } catch {} }); this.effectNodes = [];
    },
    voiceNotice(message) {
      const local=document.querySelector('#answer-feedback[open] .recording-status');
      const status=local||document.querySelector('#voice-status');
      if(status){status.textContent=message;status.hidden=false;}
    },
    clearVoiceNotice() {
      document.querySelectorAll('#voice-status,.recording-status').forEach(el=>{el.hidden=true;el.textContent='';});
    },
    stopVoice() {
      this.voiceGeneration++;
      clearTimeout(this.loadTimer);
      if(this.voicePlayer){
        this.voicePlayer.onended=null;this.voicePlayer.onerror=null;this.voicePlayer.onplaying=null;
        this.voicePlayer.pause();try{this.voicePlayer.currentTime=0;}catch{}
        this.voicePlayer=null;
      }
      this.duck(false);
    },
    speak(text, role='Briar', clipKey) {
      this.stopVoice();this.clearVoiceNotice();this.lastVoiceFailure=null;
      if(!getPreferences().voice||getPreferences().voiceVolume===0)return;
      const filename=expected[clipKey]||'rakaman-panduan-ms.mp3';
      if(!files[clipKey]){
        this.voiceNotice(`Rakaman belum disediakan: ${filename}. Baca panduan pada skrin.`);
        return;
      }
      if(!this.started){this.voiceNotice(`Tekan butang dengar untuk memainkan ${filename}.`);return;}
      const generation=this.voiceGeneration, player=new Audio(files[clipKey]);
      this.voicePlayer=player;player.preload='auto';player.volume=getPreferences().voiceVolume/100;
      let finished=false;
      const finish=()=>{
        if(finished||generation!==this.voiceGeneration)return;
        finished=true;clearTimeout(this.loadTimer);this.voicePlayer=null;this.duck(false);
      };
      const fail=(error)=>{
        if(finished||generation!==this.voiceGeneration)return;
        player.pause();finish();this.lastVoiceFailure=error?.name==='NotAllowedError'?'blocked':'file';
        this.voiceNotice(error?.name==='NotAllowedError'
          ? `Pelayar menyekat audio. Tekan butang dengar untuk memainkan ${filename}.`
          : `Rakaman tidak dapat dimainkan: ${filename}. Semak fail audio; baca panduan pada skrin.`);
      };
      player.onended=finish;player.onerror=()=>fail();
      player.onplaying=()=>{if(generation===this.voiceGeneration){clearTimeout(this.loadTimer);this.clearVoiceNotice();this.duck(true);}};
      this.loadTimer=setTimeout(()=>fail(),15000);
      // Duck only when playback actually starts, not while a missing file is loading.
      return player.play().then(()=>generation===this.voiceGeneration).catch(error=>{fail(error);return false;});
      // role labels the on-screen character; voice identity comes only from the supplied recording.
    },
    pause() {
      this.wasRunning=!!(this.ctx&&this.ctx.state==='running');
      this.stopVoice(); this.clearEffects();
      if (this.ambiencePlayer) this.ambiencePlayer.pause();
      if (this.ctx) this.ctx.suspend().catch(() => {});
    }
  };
  return audio;
};
