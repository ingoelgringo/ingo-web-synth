import * as Tone from "tone";

class JunoEngine {
  private chorus: Tone.Chorus;
  private vcf: Tone.Filter; // Low pass
  private hpf: Tone.Filter; // High pass
  private synth: Tone.PolySynth;

  // --- NYTT: Sub & Noise variabler ---
  private subSynth: Tone.PolySynth;
  private subGain: Tone.Gain;
  private noise: Tone.Noise;
  private noiseGain: Tone.Gain;

  // Arpeggiator & Logic
  private arpPattern: Tone.Pattern<string>;
  private activeNotes: Set<string> = new Set();
  private heldKeys: Set<string> = new Set();
  private arpEnabled: boolean = false;
  private holdEnabled: boolean = false;

  constructor() {
    // 1. Skapa effekter och filter
    this.chorus = new Tone.Chorus(4, 2.5, 0.5).start();
    this.chorus.wet.value = 0;

    this.vcf = new Tone.Filter({
      type: "lowpass",
      rolloff: -24,
      Q: 1,
    });

    this.hpf = new Tone.Filter({
      type: "highpass",
      frequency: 20,
    });

    // 2. Skapa Huvudsynth (DCO)
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 1,
      },
    });

    // 3. Skapa SUB-SYNTH (Spelar en oktav lägre)
    this.subSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "square" }, // Sub är oftast square på Juno
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 1,
      },
    });
    // Sub-volymkontroll (börjar på 0)
    this.subGain = new Tone.Gain(0);
    this.subSynth.connect(this.subGain);

    // 4. Skapa NOISE
    this.noise = new Tone.Noise("white").start();
    // Noise-volymkontroll (börjar på 0)
    this.noiseGain = new Tone.Gain(0);
    this.noise.connect(this.noiseGain);

    // 5. KOPPLA IHOP ALLT (Routing)
    // Alla ljudkällor -> HPF -> VCF -> Chorus -> Ut
    this.synth.connect(this.hpf); // Huvudljud
    this.subGain.connect(this.hpf); // Sub
    this.noiseGain.connect(this.hpf); // Noise

    this.hpf.connect(this.vcf);
    this.vcf.connect(this.chorus);
    this.chorus.toDestination();

    // 6. Arpeggiator Setup
    this.arpPattern = new Tone.Pattern<string>(
      (time, note) => {
        // Trigga både huvudnoten och sub-noten (en oktav ner)
        this.synth.triggerAttackRelease(note, "16n", time);

        try {
          const subNote = Tone.Frequency(note).transpose(-12).toNote();
          this.subSynth.triggerAttackRelease(subNote, "16n", time);
        } catch (e) {
          // Ignorera fel om frekvensen blir för låg
        }
      },
      [],
      "up",
    );

    Tone.getTransport().start();

    // Minska latency för snabbare respons
    Tone.context.lookAhead = 0.05;
  }

  public async start() {
    await Tone.start();
    console.log("Audio context started");
  }

  // --- LOGIK FÖR PLAY/STOP ---

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
      // Vanligt läge (Poly)
      this.synth.triggerAttack(note, Tone.now(), velocity);

      // Trigga Sub en oktav ner
      try {
        const subNote = Tone.Frequency(note).transpose(-12).toNote();
        this.subSynth.triggerAttack(subNote, Tone.now(), velocity);
      } catch (e) {}

      this.activeNotes.add(note);
    }
  }

  public stopNote(note: string) {
    this.heldKeys.delete(note);

    if (this.holdEnabled) {
      return;
    }

    if (this.arpEnabled) {
      this.activeNotes.delete(note);
      this.updateArpPattern();

      if (this.activeNotes.size === 0) {
        this.arpPattern.stop();
        this.synth.releaseAll();
        // Viktigt: Stäng av sub också för att undvika hängande bas
        this.subSynth.releaseAll();
        Tone.getTransport().stop();
      }
    } else {
      // Vanligt läge (Poly)
      this.synth.triggerRelease(note, Tone.now());

      // Stoppa Sub
      try {
        const subNote = Tone.Frequency(note).transpose(-12).toNote();
        this.subSynth.triggerRelease(subNote, Tone.now());
      } catch (e) {}

      this.activeNotes.delete(note);
    }
  }

  // --- PARAMETER-UPPDATERINGAR ---

  public setWaveform(saw: boolean, pulse: boolean) {
    if (saw && pulse) {
      this.synth.set({ oscillator: { type: "pwm" } });
    } else if (pulse) {
      this.synth.set({ oscillator: { type: "pulse" } });
    } else if (saw) {
      this.synth.set({ oscillator: { type: "sawtooth" } });
    } else {
      this.synth.set({ oscillator: { type: "sine" } }); // Tyst-ish fallback
    }
  }

  // NY: Uppdatera volym för Sub och Noise
  public setSubLevel(volume: number) {
    // volym 0-1
    this.subGain.gain.rampTo(volume, 0.1);
  }

  public setNoiseLevel(volume: number) {
    // Noise är ofta starkt, skala ner lite (0.5 max)
    this.noiseGain.gain.rampTo(volume * 0.5, 0.1);
  }

  // VIKTIGT: ADSR måste sättas på BÅDA syntharna
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

  public updateVCF(cutoff: number, resonance: number) {
    this.vcf.frequency.rampTo(cutoff, 0.05);
    this.vcf.Q.rampTo(resonance, 0.05);
  }

  public setChorus(mode: 0 | 1 | 2) {
    if (mode === 0) {
      this.chorus.wet.value = 0;
    } else if (mode === 1) {
      this.chorus.wet.value = 0.5;
      this.chorus.frequency.value = 0.5;
      this.chorus.depth = 0.7;
    } else if (mode === 2) {
      this.chorus.wet.value = 0.5;
      this.chorus.frequency.value = 0.8;
      this.chorus.depth = 0.4;
    }
  }

  // ARP Kontroller
  private updateArpPattern() {
    const sortedNotes = Array.from(this.activeNotes).sort((a, b) => {
      return Tone.Frequency(a).toFrequency() - Tone.Frequency(b).toFrequency();
    });
    this.arpPattern.values = sortedNotes;
  }

  public setArpEnabled(enabled: boolean) {
    this.arpEnabled = enabled;
    this.synth.releaseAll();
    this.subSynth.releaseAll(); // Glöm inte subben!
    this.activeNotes.clear();
    this.arpPattern.stop();
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
      // Döda allt ljud om vi stänger av hold
      this.synth.releaseAll();
      this.subSynth.releaseAll();
      this.activeNotes.clear();
      this.arpPattern.stop();
    }
  }
}

export const engine = new JunoEngine();
