import { useState, useEffect } from "react";
import { engine } from "../audio/engine";
import { generateRange } from "../utils/keyboardUtils";
import "../styles/Sequencer.css";

// Generera alla noter från C2 till C5 (samma som keyboarden)
// och vänd på arrayen så att de högsta noterna hamnar överst i rutnätet
const NOTES = generateRange(2, 5)
  .flatMap((w) => (w.black ? [w.note, w.black] : [w.note]))
  .reverse();

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
      // Vi tar bort engine.stopSequencer() här så att den kan fortsätta spela
      // även om komponenten skulle unmountas (vilket den inte gör längre, men för säkerhets skull)
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
        {NOTES.map((note, nIdx) => {
          const isBlackKey = note.includes("#");
          return (
            <div key={note} className="seq-row">
              <div className="seq-note-label">{note}</div>
              {Array.from({ length: NUM_STEPS }).map((_, sIdx) => (
                <div
                  key={sIdx}
                  className={`seq-cell ${isBlackKey ? "black-key-row" : "white-key-row"} ${
                    grid[nIdx][sIdx] ? "active" : ""
                  } ${currentStep === sIdx ? "playing" : ""}`}
                  onClick={() => toggleCell(nIdx, sIdx)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
