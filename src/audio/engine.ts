import * as Tone from "tone";

const DEFAULT_ENVELOPE = { attack: 0.01, decay: 0.1, sustain: 0.5, release: 1 };
const DEFAULT_LFO_SPEED = 5;
const DEFAULT_HPF_FREQ = 20;
const LOOKAHEAD_TIME = 0.05;

class JunoEngine {
  private chorus!: Tone.Chorus;
  private vcf!: Tone.Filter;
  private hpf!: Tone.Filter;
  private synth!: Tone.PolySynth;
  private vibrato!: Tone.Vibrato;

  // Sub & Noise variables ---
  private subSynth!: Tone.PolySynth;
  private subGain!: Tone.Gain;
  private noise!: Tone.Noise;
  private noiseGain!: Tone.Gain;

  // Arpeggiator variables ---
  private arpPattern!: Tone.Pattern<string>;
  private activeNotes: Set<string> = new Set();
  private heldKeys: Set<string> = new Set();
  private arpEnabled: boolean = false;
  private holdEnabled: boolean = false;

  constructor() {
    this.initNodes();
    this.setupRouting();
    this.initArpeggiator();

    Tone.getContext().lookAhead = LOOKAHEAD_TIME;
    Tone.getTransport().start();
  }

  private initNodes() {
    this.chorus = new Tone.Chorus(4, 2.5, 0.5).start();
    this.chorus.wet.value = 0;

    this.vibrato = new Tone.Vibrato({
      frequency: DEFAULT_LFO_SPEED,
      depth: 0,
      type: "sine",
    });

    this.vcf = new Tone.Filter({
      type: "lowpass",
      rolloff: -24,
      Q: 1,
    });

    this.hpf = new Tone.Filter({
      type: "highpass",
      frequency: DEFAULT_HPF_FREQ,
    });

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope: DEFAULT_ENVELOPE,
    });

    this.subSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "square" },
      envelope: DEFAULT_ENVELOPE,
    });
    this.subGain = new Tone.Gain(0);

    this.noise = new Tone.Noise("white").start();
    this.noiseGain = new Tone.Gain(0);
  }

  private setupRouting() {
    this.subSynth.connect(this.subGain);
    this.noise.connect(this.noiseGain);

    // Synth -> Vibrato -> HPF -> VCF -> Chorus -> Ut
    this.synth.connect(this.vibrato);
    this.subGain.connect(this.vibrato);
    this.noiseGain.connect(this.vibrato);

    this.vibrato.connect(this.hpf);
    this.hpf.connect(this.vcf);
    this.vcf.connect(this.chorus);
    this.chorus.toDestination();
  }

  private initArpeggiator() {
    this.arpPattern = new Tone.Pattern<string>(
      (time, note) => {
        this.synth.triggerAttackRelease(note, "16n", time);
        try {
          const subNote = Tone.Frequency(note).transpose(-12).toNote();
          this.subSynth.triggerAttackRelease(subNote, "16n", time);
        } catch (error) {
          console.warn(`Failed to play sub note for ${note}:`, error);
        }
      },
      [],
      "up",
    );
  }

  public async start() {
    await Tone.start();
    console.log("Audio context started");
  }

  // --- METODER FÖR LFO ---

  public setLFORate(rate: number) {
    // Input 0-100 is mapped to 0.5-10 Hz
    const freq = 0.5 + (rate / 100) * 10;
    this.vibrato.frequency.rampTo(freq, 0.1);
  }

  public setLFOAmount(amount: number) {
    // Input 0-1 is mapped to 0-1 depth
    this.vibrato.depth.rampTo(amount, 0.1);
  }

  // --- PLAY/STOP ---
  public playNote(note: string, velocity: number = 0.7) {
    this.heldKeys.add(note);

    if (this.arpEnabled) {
      if (!this.activeNotes.has(note)) {
        this.activeNotes.add(note);
        this.updateArpPattern();

        if (this.arpPattern.state !== "started") {
          Tone.getTransport().stop();
          Tone.getTransport().start();
          this.arpPattern.start(0);
        }
      }
    } else {
      // Regular polyphonic mode
      // Avoid retriggering the same note if it's already active (prevents
      // duplicate layers when UI fires multiple presses).
      if (!this.activeNotes.has(note)) {
        this.synth.triggerAttack(note, Tone.now(), velocity);

        // Play Sub
        try {
          const subNote = Tone.Frequency(note).transpose(-12).toNote();
          this.subSynth.triggerAttack(subNote, Tone.now(), velocity);
        } catch (error) {
          console.warn(`Failed to play sub note for ${note}:`, error);
        }

        this.activeNotes.add(note);
      }
    }
  }

  public stopNote(note: string) {
    this.doRelease(note, false);
  }

  // Internal unified release logic. When `force` is true, release even if
  // `holdEnabled` is set (used for UI toggles and pointer interactions
  // that explicitly want to stop sound).
  private doRelease(note: string, force: boolean) {
    this.heldKeys.delete(note);

    // Hold mode: Ignore release events unless forced
    if (this.holdEnabled && !force) {
      return;
    }

    // Arpeggiator mode
    if (this.arpEnabled) {
      this.activeNotes.delete(note);
      this.updateArpPattern();

      if (this.activeNotes.size === 0) {
        this.arpPattern.stop();
        this.synth.releaseAll();
        this.subSynth.releaseAll();
        Tone.getTransport().stop();
      }
      return;
    }

    // Ordinary polyphonic release
    this.synth.triggerRelease(note, Tone.now());

    // Release Sub
    try {
      const subNote = Tone.Frequency(note).transpose(-12).toNote();
      this.subSynth.triggerRelease(subNote, Tone.now());
    } catch (error) {
      console.warn(`Failed to release sub note for ${note}:`, error);
    }

    this.activeNotes.delete(note);
  }

  // Force-release a note even when hold is enabled (used by UI toggle)
  public forceReleaseNote(note: string) {
    this.doRelease(note, true);
  }

  // Oscillator waveform
  public setWaveform(saw: boolean, pulse: boolean) {
    if (saw && pulse) {
      this.synth.set({ oscillator: { type: "pwm" } });
    } else if (pulse) {
      this.synth.set({ oscillator: { type: "pulse" } });
    } else if (saw) {
      this.synth.set({ oscillator: { type: "sawtooth" } });
    } else {
      // Default to sine if neither is selected
      this.synth.set({ oscillator: { type: "sine" } });
    }
  }

  // Suboscillator & Noise
  public setSubLevel(volume: number) {
    this.subGain.gain.rampTo(volume, 0.1);
  }
  public setNoiseLevel(volume: number) {
    this.noiseGain.gain.rampTo(volume * 0.5, 0.1);
  }

  public setADSR(
    attack: number,
    decay: number,
    sustain: number,
    release: number,
  ) {
    const env = { attack, decay, sustain, release };
    this.synth.set({ envelope: env });
    this.subSynth.set({ envelope: env });
  }

  // Filter
  public updateVCF(cutoff: number, resonance: number) {
    this.vcf.frequency.rampTo(cutoff, 0.05);
    this.vcf.Q.rampTo(resonance, 0.05);
  }

  public setChorus(mode: 0 | 1 | 2) {
    if (mode === 0) {
      this.chorus.wet.value = 0;
    } else if (mode === 1) {
      this.chorus.wet.value = 0.5;
      this.chorus.frequency.value = 0.2;
      this.chorus.depth = 0.7;
    } else if (mode === 2) {
      this.chorus.wet.value = 0.5;
      this.chorus.frequency.value = 0.8;
      this.chorus.depth = 1.0;
    }
  }

  // ARP Controls
  private updateArpPattern() {
    const sortedNotes = Array.from(this.activeNotes).sort((a, b) => {
      return Tone.Frequency(a).toFrequency() - Tone.Frequency(b).toFrequency();
    });
    this.arpPattern.values = sortedNotes;
  }

  public setArpEnabled(enabled: boolean) {
    // If state isn't changing, do nothing
    if (this.arpEnabled === enabled) return;

    this.arpEnabled = enabled;

    if (enabled) {
      // Enabling Arp:
      // 1. Temporarily force a short release to kill sustaining notes quickly
      //    This prevents old polyphonic notes from fading out slowly while Arp starts
      const currentOpts = this.synth.get();
      // Safe fallback for release time if not found
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const oldRelease = (currentOpts.envelope as any)?.release ?? 1;

      this.synth.set({ envelope: { release: 0.005 } });
      this.subSynth.set({ envelope: { release: 0.005 } });

      this.synth.releaseAll();
      this.subSynth.releaseAll();

      // 2. Restore the original release time after a short delay
      setTimeout(() => {
        this.synth.set({ envelope: { release: oldRelease } });
        this.subSynth.set({ envelope: { release: oldRelease } });
      }, 50);

      // 3. Transfer current active notes to Arp Pattern
      if (this.activeNotes.size > 0) {
        this.updateArpPattern();
        // 4. Start Arp if we have notes
        Tone.getTransport().stop();
        Tone.getTransport().start();
        this.arpPattern.start(0);
      }
    } else {
      // Disabling Arp:
      // 1. Stop Arp
      this.arpPattern.stop();
      Tone.getTransport().stop();
      this.synth.releaseAll();
      this.subSynth.releaseAll();

      // 2. Resume Polyphonic play for held notes
      const notesToResume = Array.from(this.activeNotes);
      // Clear them first so playNote re-triggers them
      this.activeNotes.clear();

      notesToResume.forEach((note) => {
        // Only resume if physically held or hold is on
        if (this.holdEnabled || this.heldKeys.has(note)) {
          this.playNote(note);
        }
      });
    }
  }

  public setArpRate(bpm: number) {
    Tone.getTransport().bpm.value = bpm;
  }

  public setArpMode(mode: "up" | "down" | "upDown" | "random") {
    this.arpPattern.pattern = mode;
  }

  public setHold(enabled: boolean) {
    this.holdEnabled = enabled;
    if (!enabled) {
      // Kill all held notes when hold is turned off
      this.synth.releaseAll();
      this.subSynth.releaseAll();
      this.activeNotes.clear();
      this.arpPattern.stop();
    }
  }
}

export const engine = new JunoEngine();
