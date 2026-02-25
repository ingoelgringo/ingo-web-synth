import * as Tone from "tone";

export class ArpeggiatorController {
  private arpPattern: Tone.Pattern<string>;
  private synth: Tone.PolySynth;
  private subSynth: Tone.PolySynth;
  private activeNotes: Set<string> = new Set();
  private isEnabled: boolean = false;

  constructor(synth: Tone.PolySynth, subSynth: Tone.PolySynth) {
    this.synth = synth;
    this.subSynth = subSynth;

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

  public get enabled(): boolean {
    return this.isEnabled;
  }

  public addNote(note: string) {
    if (!this.activeNotes.has(note)) {
      this.activeNotes.add(note);
      this.updatePattern();

      if (this.arpPattern.state !== "started") {
        if (Tone.getContext().state !== "running") {
          Tone.getContext().resume();
        }
        Tone.getTransport().stop();
        Tone.getTransport().start();
        this.arpPattern.start(0);
      }
    }
  }

  public removeNote(note: string) {
    this.activeNotes.delete(note);
    this.updatePattern();

    if (this.activeNotes.size === 0) {
      this.arpPattern.stop();
      this.synth.releaseAll();
      this.subSynth.releaseAll();
    }
  }

  public clearNotes() {
    this.activeNotes.clear();
    this.arpPattern.stop();
  }

  private updatePattern() {
    const sortedNotes = Array.from(this.activeNotes).sort((a, b) => {
      return Tone.Frequency(a).toFrequency() - Tone.Frequency(b).toFrequency();
    });
    this.arpPattern.values = sortedNotes;
  }

  public setEnabled(
    enabled: boolean,
    currentActiveNotes: Set<string>,
    heldKeys: Set<string>,
    holdEnabled: boolean,
    playNoteCallback: (note: string) => void,
  ) {
    if (this.isEnabled === enabled) return;

    this.isEnabled = enabled;

    if (enabled) {
      // Enabling Arp:
      // 1. Temporarily force a short release to kill sustaining notes quickly
      const currentOpts = this.synth.get();
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
      this.activeNotes = new Set(currentActiveNotes);
      if (this.activeNotes.size > 0) {
        this.updatePattern();
        // 4. Start Arp if we have notes
        if (Tone.getContext().state !== "running") {
          Tone.getContext().resume();
        }
        Tone.getTransport().stop();
        Tone.getTransport().start();
        this.arpPattern.start(0);
      }
    } else {
      // Disabling Arp:
      // 1. Stop Arp
      this.arpPattern.stop();
      this.synth.releaseAll();
      this.subSynth.releaseAll();

      // 2. Resume Polyphonic play for held notes
      const notesToResume = Array.from(this.activeNotes);
      this.activeNotes.clear();

      notesToResume.forEach((note) => {
        // Only resume if physically held or hold is on
        if (holdEnabled || heldKeys.has(note)) {
          playNoteCallback(note);
        }
      });
    }
  }

  public setRate(bpm: number) {
    Tone.getTransport().bpm.value = bpm;
  }

  public setMode(mode: "up" | "down" | "upDown" | "random") {
    this.arpPattern.pattern = mode;
  }
}
