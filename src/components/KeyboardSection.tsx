import React, { useState } from "react";
import "../styles/Keyboard.css";
import { useKeyboardContext } from "../hooks/useKeyboardContext";
import { generateRange } from "../utils/keyboardUtils";
import { KEY_MAP } from "../hooks/useKeyboard";
import { Sequencer } from "./Sequencer";

export const KeyboardSection: React.FC = () => {
  const { activeNotes, pressNote, releaseNote } = useKeyboardContext();
  const [showKeyHints, setShowKeyHints] = useState(false);
  const [showSequencer, setShowSequencer] = useState(false);
  const layout = generateRange(2, 5);

  // Create a reverse map to find the computer key for a given note
  const noteToKeyMap = Object.entries(KEY_MAP).reduce(
    (acc, [key, note]) => {
      // If multiple keys map to the same note, we just keep the first one we find
      if (!acc[note]) {
        acc[note] = key.toUpperCase();
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  // measurements must match CSS: keyWidth + gap (margin) => 40 + 2 = 42
  const keyStep = 42;
  const blackWidth = 30;
  const tweak = 21; // visual tweak to better center black keys
  // center black key between adjacent white keys: step/2 - blackWidth/2
  const blackOffset = keyStep / 2 - blackWidth / 2 + tweak; // 21 - 15 = 6
  const containerWidth = layout.length * keyStep;

  return (
    <div className="keyboard-section">
      <div className="keyboard-controls">
        <label className="key-hint-toggle">
          <div className="switch-hole">
            <input
              type="checkbox"
              checked={showSequencer}
              onChange={(e) => setShowSequencer(e.target.checked)}
              className="switch-input"
            />
            <div className="switch-handle"></div>
          </div>
          <span className="switch-label">SEQ / KEYS</span>
        </label>

        <label className="key-hint-toggle">
          <div className="switch-hole">
            <input
              type="checkbox"
              checked={showKeyHints}
              onChange={(e) => setShowKeyHints(e.target.checked)}
              className="switch-input"
            />
            <div className="switch-handle"></div>
          </div>
          <span className="switch-label">KEY HINTS</span>
        </label>
      </div>

      {showSequencer ? (
        <Sequencer />
      ) : (
        <div
          className="keyboard-container"
          style={{ width: `${containerWidth}px` }}
        >
          <div className="white-keys" style={{ display: "flex" }}>
            {layout.map((w) => {
              const whiteActive = activeNotes.includes(w.note);
              const keyHint = noteToKeyMap[w.note];
              return (
                <div
                  key={w.note}
                  className={`keyboard-key${whiteActive ? " active" : ""}`}
                  onPointerDown={() => pressNote(w.note)}
                  onPointerUp={() => releaseNote(w.note)}
                  onPointerLeave={() => releaseNote(w.note)}
                >
                  {showKeyHints && keyHint && (
                    <span className="key-hint white-key-hint">{keyHint}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="black-keys-overlay">
            {layout.map((w, i) => {
              if (!w.black) return null;
              const blackActive = activeNotes.includes(w.black);
              const left = i * keyStep + blackOffset;
              const keyHint = noteToKeyMap[w.black];
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
                >
                  {showKeyHints && keyHint && (
                    <span className="key-hint black-key-hint">{keyHint}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
