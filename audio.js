'use strict';
// Local recordings take priority. Otherwise use original synthesized ambience/effects
// and an explicitly selected Malay browser voice (never the default/English voice).
window.createGameAudio = function (getPreferences) {
  const files = window.GAME_AUDIO || {};
  const audio = {
    ctx: null, master: null, musicGain: null, ambienceGain: null,
    timer: null, beat: 0, started: false, track: 'forest', effectNodes: [],
    voicePlayer: null, effectPlayer: null, ambiencePlayer: null,
    speaking: false, voiceGeneration: 0, windSource: null, duckTimer: null,
    init() {
      if (this.ctx) { this.ctx.resume().catch(() => {}); return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination);
        this.musicGain = this.ctx.createGain(); this.musicGain.connect(this.master);
        this.ambienceGain = this.ctx.createGain(); this.ambienceGain.connect(this.master);
        if (files.ambience) {
          this.ambiencePlayer = new Audio(files.ambience);
          this.ambiencePlayer.loop = true;
          this.ambiencePlayer.onerror = () => { this.ambiencePlayer = null; this.makeWind(); this.sync(); };
        } else this.makeWind();
      } catch { /* Written guidance and the game remain available without audio. */ }
    },
    start() { this.started = true; this.init(); this.sync(); },
    makeWind() {
      if (!this.ctx || this.windSource) return;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 4, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const wind = this.ctx.createBufferSource(), filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 650;
      const breeze = this.ctx.createGain(); breeze.gain.value = .06;
      const sway = this.ctx.createOscillator(), depth = this.ctx.createGain();
      sway.frequency.value = .13; depth.gain.value = .018;
      sway.connect(depth); depth.connect(breeze.gain); sway.start();
      wind.buffer = buffer; wind.loop = true; wind.connect(filter);
      filter.connect(breeze); breeze.connect(this.ambienceGain); wind.start();
      this.windSource = wind;
    },
    sync() {
      const p = getPreferences(), factor = this.speaking ? .22 : 1;
      if (this.master) this.master.gain.value = p.volume / 100;
      if (this.musicGain) {
        this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.musicGain.gain.value = p.music ? .22 * factor : 0;
        this.ambienceGain.gain.value = p.music ? .4 * factor : 0;
      }
      if (this.voicePlayer) this.voicePlayer.volume = p.volume / 100;
      if (this.effectPlayer) this.effectPlayer.volume = p.volume / 100 * .4;
      if (this.ambiencePlayer) {
        this.ambiencePlayer.volume = p.volume / 100 * .15 * factor;
        if (p.music && !document.hidden && this.started) this.ambiencePlayer.play().catch(() => {});
        else this.ambiencePlayer.pause();
      }
      if (this.started && !this.timer && this.ctx) {
        this.tick(); this.timer = setInterval(() => this.tick(), 280);
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
      oscillator.connect(envelope); envelope.connect(bus || this.master);
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
        envelope.gain.exponentialRampToValueAtTime(.045, t + .025);
        envelope.gain.exponentialRampToValueAtTime(.0001, t + .13);
        bird.connect(envelope); envelope.connect(this.ambienceGain);
        bird.start(t); bird.stop(t + .14);
        bird.onended = () => { bird.disconnect(); envelope.disconnect(); };
      }
    },
    tick() {
      if (!getPreferences().music || !this.ctx || this.ctx.state !== 'running') return;
      const melody = this.track === 'victory'
        ? [523,659,784,1047,880,784,659,784,523,659,784,1047,1175,1047,784,659]
        : [523,659,784,659,587,784,880,784,659,523,587,659,784,880,784,587,
           659,784,1047,880,784,659,587,523,587,659,784,659,587,523,392,440];
      const step = this.beat++, i = step % melody.length, t = this.ctx.currentTime;
      this.tone(melody[i], t, .24, .16, 'triangle', this.musicGain);
      if (step % 4 === 0) {
        this.tone([131,175,196,175][Math.floor(step / 8) % 4], t, .45, .2, 'sine', this.musicGain);
        this.tone(1100, t, .035, .035, 'triangle', this.musicGain);
      }
      if (step % 16 === 3 || step % 32 === 22) this.chirp(t + .05);
      // An occasional quiet dove-like call, roughly once every 27 seconds.
      if (step % 96 === 60) {
        this.tone(440, t, .25, .035, 'sine', this.ambienceGain);
        this.tone(392, t + .3, .4, .03, 'sine', this.ambienceGain);
      }
    },
    fx(kind) {
      if (!getPreferences().effects) return;
      this.clearEffects();
      const file = files[{correct:'correctSound',wrong:'wrongSound'}[kind] || kind];
      if (file) {
        this.effectPlayer = new Audio(file); this.effectPlayer.volume = getPreferences().volume / 100 * .4;
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
    stopVoice() {
      this.voiceGeneration++;
      if (this.voicePlayer) { this.voicePlayer.pause(); this.voicePlayer = null; }
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      clearTimeout(this.duckTimer); this.duck(false);
    },
    speak(text, role = 'Briar', clipKey) {
      this.stopVoice();
      if (!getPreferences().voice) return;
      const generation = this.voiceGeneration;
      const finish = () => { if (generation === this.voiceGeneration) { clearTimeout(this.duckTimer); this.duck(false); } };
      let fallbackStarted=false;
      const fallback = () => { if(!fallbackStarted && generation===this.voiceGeneration){ fallbackStarted=true; this.browserVoice(text, finish, generation); } };
      if (clipKey && files[clipKey]) {
        const player = new Audio(files[clipKey]); this.voicePlayer = player;
        player.volume = getPreferences().volume / 100;
        player.onended = finish;
        player.onerror = () => { if (generation === this.voiceGeneration) { player.pause(); this.voicePlayer = null; fallback(); } };
        this.duck(true);
        player.play().catch(() => { if (generation === this.voiceGeneration) { this.voicePlayer = null; fallback(); } });
      } else fallback();
      // Role identifies the speaker on screen; one generic Malay TTS voice is shared.
    },
    browserVoice(text, finish, generation) {
      const status = document.querySelector('#voice-status');
      const voices = 'speechSynthesis' in window ? speechSynthesis.getVoices() : [];
      const voice = voices.find(item => /^ms(?:[-_]|$)/i.test(item.lang));
      if (!voice) {
        status.textContent = 'Suara Bahasa Melayu tidak tersedia pada peranti ini. Baca panduan pada skrin.';
        status.hidden = false; finish(); return;
      }
      status.hidden = true;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice; utterance.lang = voice.lang;
      utterance.rate = .94; utterance.pitch = 1.12; utterance.volume = getPreferences().volume / 100;
      utterance.onend = finish; utterance.onerror = finish;
      utterance.onstart = () => { if (generation === this.voiceGeneration) this.duck(true); };
      this.duck(true);
      this.duckTimer = setTimeout(finish, Math.max(7000, text.length * 110));
      speechSynthesis.speak(utterance);
    },
    pause() {
      this.stopVoice(); this.clearEffects();
      if (this.ambiencePlayer) this.ambiencePlayer.pause();
      if (this.ctx) this.ctx.suspend().catch(() => {});
    }
  };
  return audio;
};
