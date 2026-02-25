import React from "react";
import "../styles/Keyboard.css";
import { useKeyboardContext } from "../hooks/useKeyboardContext";
import { generateRange } from "../utils/keyboardUtils";

export const KeyboardSection: React.FC = () => {
  const { activeNotes, pressNote, releaseNote } = useKeyboardContext();
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
