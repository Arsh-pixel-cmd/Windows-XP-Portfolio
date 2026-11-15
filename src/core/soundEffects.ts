// src/core/soundEffects.ts
/**
 * Authentic Windows XP Sound Synthesizer
 * Uses the Web Audio API to procedurally generate classic Windows XP chimes & alerts
 * Zero external audio files or downloads required.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    this.enabled = localStorage.getItem('xp_sound_enabled') !== 'false';
    const savedVol = localStorage.getItem('xp_sound_volume');
    if (savedVol) {
      this.volume = parseFloat(savedVol);
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    localStorage.setItem('xp_sound_enabled', String(val));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('xp_sound_volume', String(this.volume));
  }

  /**
   * Classic Windows XP Startup Chime (synthesized harmonic chord sequence)
   */
  public playStartup() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.35, now);
    masterGain.connect(ctx.destination);

    // Windows XP chord notes (Gb, Db, Ab, Bb, Db5, Eb5)
    const notes = [
      { freq: 185.00, start: 0.00, dur: 2.2, type: 'sine' as OscillatorType }, // Gb3
      { freq: 277.18, start: 0.05, dur: 2.0, type: 'sine' as OscillatorType }, // Db4
      { freq: 415.30, start: 0.25, dur: 1.8, type: 'triangle' as OscillatorType }, // Ab4
      { freq: 466.16, start: 0.45, dur: 1.8, type: 'sine' as OscillatorType }, // Bb4
      { freq: 554.37, start: 0.70, dur: 2.5, type: 'sine' as OscillatorType }, // Db5
      { freq: 622.25, start: 0.95, dur: 3.0, type: 'sine' as OscillatorType }, // Eb5
      { freq: 830.61, start: 1.15, dur: 3.2, type: 'sine' as OscillatorType }, // Ab5 shimmer
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = n.type;
      osc.frequency.setValueAtTime(n.freq, now + n.start);

      gain.gain.setValueAtTime(0.001, now + n.start);
      gain.gain.exponentialRampToValueAtTime(0.3, now + n.start + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur);
    });
  }

  /**
   * Classic Windows XP Critical Stop / Error ("Bong" chord)
   */
  public playError() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.4, now);
    masterGain.connect(ctx.destination);

    // Deep dissonant chord
    const freqs = [155.56, 185.00, 233.08]; // Eb3, Gb3, Bb3
    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.7);
    });
  }

  /**
   * Windows XP Balloon / Information Popup sound (two-tone ascending ping)
   */
  public playBalloon() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.25, now);
    masterGain.connect(ctx.destination);

    const notes = [
      { freq: 587.33, start: 0, dur: 0.15 }, // D5
      { freq: 880.00, start: 0.09, dur: 0.35 }, // A5
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, now + n.start);

      gain.gain.setValueAtTime(0.01, now + n.start);
      gain.gain.linearRampToValueAtTime(0.35, now + n.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur);
    });
  }

  /**
   * Windows XP Navigation Click
   */
  public playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

    gain.gain.setValueAtTime(this.volume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  /**
   * Windows XP Recycle Bin Empty (Paper crinkle)
   */
  public playRecycle() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  /**
   * Windows XP Shutdown Sound (descending harmonic)
   */
  public playShutdown() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.3, now);
    masterGain.connect(ctx.destination);

    const notes = [
      { freq: 659.25, start: 0.0, dur: 1.0 }, // E5
      { freq: 493.88, start: 0.2, dur: 1.2 }, // B4
      { freq: 392.00, start: 0.45, dur: 1.5 }, // G4
      { freq: 329.63, start: 0.75, dur: 2.2 }, // E4
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, now + n.start);

      gain.gain.setValueAtTime(0.01, now + n.start);
      gain.gain.linearRampToValueAtTime(0.3, now + n.start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur);
    });
  }
}

export const soundEffects = new SoundService();
