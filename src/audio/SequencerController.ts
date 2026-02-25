import * as Tone from "tone";

export class SequencerController {
  private sequence: Tone.Sequence | null = null;
  private synth: Tone.PolySynth;
  private subSynth: Tone.PolySynth;
  private steps: string[][] = Array(16).fill([]);
  private onStepCallback?: (step: number) => void;

  constructor(synth: Tone.PolySynth, subSynth: Tone.PolySynth) {
    this.synth = synth;
    this.subSynth = subSynth;
    this.initSequence();
  }

  private initSequence() {
    // Skapa en array [0, 1, 2 ... 15] för våra 16 steg
    const stepIndices = Array.from({ length: 16 }, (_, i) => i);

    this.sequence = new Tone.Sequence(
      (time, stepIndex) => {
        const notes = this.steps[stepIndex];
        if (notes && notes.length > 0) {
          // Spela alla aktiva noter för detta steg
          this.synth.triggerAttackRelease(notes, "16n", time);

          // Spela sub-noter (en oktav ner)
          try {
            const subNotes = notes.map((note) =>
              Tone.Frequency(note).transpose(-12).toNote(),
            );
            this.subSynth.triggerAttackRelease(subNotes, "16n", time);
          } catch (error) {
            console.warn(`Failed to play sub notes for ${notes}:`, error);
          }
        }

        // Uppdatera UI:t (Playhead) exakt när ljudet spelas
        if (this.onStepCallback) {
          Tone.Draw.schedule(() => {
            this.onStepCallback!(stepIndex);
          }, time);
        }
      },
      stepIndices,
      "16n", // 16-delsnoter
    );

    // Ensure the sequence loops
    this.sequence.loop = true;
  }

  public setSteps(steps: string[][]) {
    this.steps = steps;
  }

  public setOnStepCallback(cb: (step: number) => void) {
    this.onStepCallback = cb;
  }

  public start() {
    if (this.sequence) {
      if (Tone.getContext().state !== "running") {
        Tone.getContext().resume();
      }
      if (Tone.getTransport().state !== "started") {
        Tone.getTransport().start();
      }
      // Start the sequence at the next even 16th note to avoid scheduling in the past
      this.sequence.start("@16n");
    }
  }

  public stop() {
    if (this.sequence) {
      this.sequence.stop();
    }
  }
}
