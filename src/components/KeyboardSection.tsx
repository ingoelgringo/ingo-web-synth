import React from "react";
import "../KeyboardStyles.css";
import { useKeyboardContext } from "../contexts/KeyboardContext";

const WHITE_ORDER = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_AFTER: Record<string, string> = {
  C: "C#",
  D: "D#",
  F: "F#",
  G: "G#",
  A: "A#",
};

function generateRange(startOct = 2, endOct = 5) {
  const whites: { note: string; black?: string }[] = [];
  for (let oct = startOct; oct <= endOct; oct++) {
    for (const w of WHITE_ORDER) {
      const whiteNote = `${w}${oct}`;
      const blackName = BLACK_AFTER[w];
      // do not create black key for octave end if black would be in next octave beyond C5
      const blackNote = blackName ? `${blackName}${oct}` : undefined;
      whites.push({ note: whiteNote, black: blackNote });
    }
  }
  // Trim to C2..C5 inclusive: keep until C5 and stop
  const endIndex = whites.findIndex((w) => w.note === "C5");
  if (endIndex >= 0) return whites.slice(0, endIndex + 1);
  return whites;
}

export const KeyboardSection: React.FC = () => {
  const { activeNotes, pressNote, releaseNote, hold, toggleHold } =
    useKeyboardContext();
  const layout = generateRange(2, 5);

  // measurements must match CSS: keyWidth + gap (margin) => 40 + 2 = 42
  const keyStep = 42;
  const blackWidth = 30;
  const tweak = 21; // visual tweak to better center black keys
  // center black key between adjacent white keys: step/2 - blackWidth/2
  const blackOffset = keyStep / 2 - blackWidth / 2 + tweak; // 21 - 15 = 6
  const containerWidth = layout.length * keyStep;

  return (
    <div className="keyboard-section">
      {/* Hold button removed from keyboard UI; centralized in HoldButton component */}

      <div
        className="keyboard-container"
        style={{ width: `${containerWidth}px` }}
      >
        <div className="white-keys" style={{ display: "flex" }}>
          {layout.map((w) => {
            const whiteActive = activeNotes.includes(w.note);
            return (
              <div
                key={w.note}
                className={`keyboard-key${whiteActive ? " active" : ""}`}
                onPointerDown={() => pressNote(w.note)}
                onPointerUp={() => releaseNote(w.note)}
                onPointerLeave={() => releaseNote(w.note)}
              />
            );
          })}
        </div>

        <div className="black-keys-overlay">
          {layout.map((w, i) => {
            if (!w.black) return null;
            const blackActive = activeNotes.includes(w.black);
            const left = i * keyStep + blackOffset;
            return (
              <div
                key={w.black}
                className={`keyboard-key-black${blackActive ? " active" : ""}`}
                style={{ position: "absolute", left: `${left}px` }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  pressNote(w.black!);
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  releaseNote(w.black!);
                }}
                onPointerLeave={(e) => {
                  e.stopPropagation();
                  releaseNote(w.black!);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
