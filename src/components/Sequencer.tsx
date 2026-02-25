import { useState, useEffect } from "react";
import { engine } from "../audio/engine";
import "../styles/Sequencer.css";

// En oktav av noter för rutnätet (uppifrån och ner)
const NOTES = [
  "C4",
  "B3",
  "A#3",
  "A3",
  "G#3",
  "G3",
  "F#3",
  "F3",
  "E3",
  "D#3",
  "D3",
  "C#3",
  "C3",
];
const NUM_STEPS = 16;

export const Sequencer = () => {
  // 2D-array för rutnätet: grid[rad][kolumn]
  const [grid, setGrid] = useState<boolean[][]>(
    Array(NOTES.length)
      .fill(false)
      .map(() => Array(NUM_STEPS).fill(false)),
  );
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Lyssna på playhead-uppdateringar från ljudmotorn
  useEffect(() => {
    engine.setSequencerCallback((step) => setCurrentStep(step));
    return () => {
      engine.setSequencerCallback(() => {});
      engine.stopSequencer(); // Stanna om vi byter vy
    };
  }, []);

  // Skicka uppdaterat rutnät till ljudmotorn varje gång vi klickar i en ruta
  useEffect(() => {
    const steps: string[][] = Array(NUM_STEPS).fill([]);
    for (let s = 0; s < NUM_STEPS; s++) {
      const stepNotes = [];
      for (let n = 0; n < NOTES.length; n++) {
        if (grid[n][s]) stepNotes.push(NOTES[n]);
      }
      steps[s] = stepNotes;
    }
    engine.updateSequencerSteps(steps);
  }, [grid]);

  const toggleCell = (noteIdx: number, stepIdx: number) => {
    const newGrid = [...grid];
    newGrid[noteIdx] = [...newGrid[noteIdx]];
    newGrid[noteIdx][stepIdx] = !newGrid[noteIdx][stepIdx];
    setGrid(newGrid);
  };

  const togglePlay = () => {
    if (isPlaying) {
      engine.stopSequencer();
      setCurrentStep(-1);
    } else {
      engine.startSequencer();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="sequencer-container">
      <button
        className={`seq-play-btn ${isPlaying ? "active" : ""}`}
        onClick={togglePlay}
      >
        {isPlaying ? "STOP SEQ" : "PLAY SEQ"}
      </button>
      <div className="sequencer-grid">
        {NOTES.map((note, nIdx) => (
          <div key={note} className="seq-row">
            <div className="seq-note-label">{note}</div>
            {Array.from({ length: NUM_STEPS }).map((_, sIdx) => (
              <div
                key={sIdx}
                className={`seq-cell ${grid[nIdx][sIdx] ? "active" : ""} ${
                  currentStep === sIdx ? "playing" : ""
                }`}
                onClick={() => toggleCell(nIdx, sIdx)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
