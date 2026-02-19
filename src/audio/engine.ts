import * as Tone from "tone";

class JunoEngine {
  public synth: Tone.PolySynth;
  private hpf: Tone.Filter;
  private vcf: Tone.Filter;
  private chorus: Tone.Chorus;
  private arpPattern: Tone.Pattern<string>;
  private activeNotes: Set<string> = new Set();
  private arpEnabled: boolean = false;

  constructor() {
    // Chorus - Juno-stilen har en väldigt specifik bredd
    this.chorus = new Tone.Chorus(4, 2.5, 0.5).start();
    this.chorus.wet.value = 0;

    // Konfigurera Arpeggiatorn
    // "up" är standardläget. Vi skickar in en tom array initialt.
    this.arpPattern = new Tone.Pattern<string>(
      (time, note) => {
        this.synth.triggerAttackRelease(note, "16n", time);
      },
      [],
      "up",
    );

    // Starta Transport (klockan) så att mönster kan spela
    Tone.getTransport().start();

    // VCF - 24dB/oct Low Pass Filter
    this.vcf = new Tone.Filter({
      type: "lowpass",
      rolloff: -24,
      Q: 1,
    });

    // HPF - Statiskt högpassfilter
    this.hpf = new Tone.Filter({
      type: "highpass",
      frequency: 20,
    });

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 1,
      },
    });

    // Signalväg: Osc -> HPF -> VCF -> Chorus -> Master
    this.synth.chain(this.hpf, this.vcf, this.chorus, Tone.Destination);
  }

  public setWaveform(saw: boolean, pulse: boolean) {
    // Förenklad logik: Tone.js PolySynth hanterar en typ åt gången enkelt.
    // Vi prioriterar Pulse om båda är valda, eller "pwm" för det klassiska ljudet.
    if (saw && pulse) {
      this.synth.set({ oscillator: { type: "pwm" } });
    } else if (pulse) {
      this.synth.set({ oscillator: { type: "pulse" } });
    } else if (saw) {
      this.synth.set({ oscillator: { type: "sawtooth" } });
    } else {
      // Tyst om inget är valt (eller väldigt låg volym)
      this.synth.set({ oscillator: { type: "sine" } }); // Fallback
    }
  }

  public setADSR(
    attack: number,
    decay: number,
    sustain: number,
    release: number,
  ) {
    this.synth.set({
      envelope: {
        attack: attack,
        decay: decay,
        sustain: sustain,
        release: release,
      },
    });
  }

  public setChorus(mode: 0 | 1 | 2) {
    if (mode === 0) {
      // OFF
      this.chorus.wet.value = 0;
    } else if (mode === 1) {
      // CHORUS I: Långsammare, djupare
      this.chorus.wet.value = 0.5; // Balans mellan torrt/vått
      this.chorus.frequency.value = 0.5; // Långsam LFO (Hz)
      this.chorus.depth = 0.7; // Djupare modulering
    } else if (mode === 2) {
      // CHORUS II: Snabbare, fladdrigare
      this.chorus.wet.value = 0.5;
      this.chorus.frequency.value = 0.8; // Snabbare LFO
      this.chorus.depth = 0.4; // Grundare
    }
    // "Mode 3" (båda knapparna intryckta) kan vi simulera senare om vi vill vara nördigt exakta!
  }

  public setSubLevel(volume: number) {
    // Detta är en approximation. I en riktig Juno mixas sub in.
    // I Tone.PolySynth är det svårt att lägga till en sub-osc per röst dynamiskt utan custom synth-definition.
    // Vi lämnar denna tom för nu och fokuserar på huvudvågformerna först.
    console.log("Sub volume:", volume);
  }

  public setNoise(volume: number) {
    // Implementeras senare med en egen Noise-källa
    console.log("Noise volume:", volume);
  }

  public async start() {
    await Tone.start();
    console.log("Audio context started");
  }

  public playNote(note: string, velocity: number = 0.7) {
    if (this.arpEnabled) {
      if (!this.activeNotes.has(note)) {
        this.activeNotes.add(note);
        this.updateArpPattern();

        // Om detta är den första noten och arpeggiatorn inte körs
        if (this.activeNotes.size > 0 && this.arpPattern.state !== "started") {
          // Stoppa och starta om transporten för att nollställa rutnätet helt
          Tone.getTransport().stop();
          Tone.getTransport().start();

          // Starta mönstret omedelbart (0) relativt till transportens start
          this.arpPattern.start(0);
        }
      }
    } else {
      this.synth.triggerAttack(note, Tone.now(), velocity);
    }
  }

  public stopNote(note: string) {
    if (this.arpEnabled) {
      this.activeNotes.delete(note);
      this.updateArpPattern();

      if (this.activeNotes.size === 0) {
        this.arpPattern.stop();
        this.synth.releaseAll();
        // Stoppa transporten när vi inte spelar, så den är redo för nästa "Attack"
        Tone.getTransport().stop();
      }
    } else {
      this.synth.triggerRelease(note, Tone.now());
    }
  }

  public updateVCF(cutoff: number, resonance: number) {
    this.vcf.frequency.rampTo(cutoff, 0.05);
    this.vcf.Q.rampTo(resonance, 0.05);
  } // Hjälpfunktion för att uppdatera noterna i arpeggiatorn
  private updateArpPattern() {
    // Sortera noterna musikaliskt (frekvens) istället för alfabetiskt
    const sortedNotes = Array.from(this.activeNotes).sort((a, b) => {
      // Använd Tone.Frequency för att jämföra tonhöjd
      return Tone.Frequency(a).toFrequency() - Tone.Frequency(b).toFrequency();
    });

    this.arpPattern.values = sortedNotes;
  }

  // --- LÄGG TILL DESSA METODER HÄR ---

  public setArpEnabled(enabled: boolean) {
    this.arpEnabled = enabled;
    // Stäng av ev. hängande noter om vi byter läge
    this.synth.releaseAll();
    this.activeNotes.clear();
    this.arpPattern.stop();
  }

  public setArpRate(bpm: number) {
    Tone.getTransport().bpm.value = bpm;
  }

  public setArpMode(mode: "up" | "down" | "upDown" | "random") {
    this.arpPattern.pattern = mode;
  }
}

export const engine = new JunoEngine();
