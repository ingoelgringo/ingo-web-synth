import React, { useCallback, useState } from "react";
import { engine } from "../audio/engine";
import { KeyboardContext } from "./keyboardCore";

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [hold, setHold] = useState(false);

  const pressNote = useCallback((note: string) => {
    setActiveNotes((s) => {
      if (s.includes(note)) {
        try {
          // Always force-release when toggling via UI press to avoid
          // playback persisting if the engine hold state is out-of-sync.
          engine.releaseHeldNote(note);
        } catch {
          // ignore
        }
        return s.filter((n) => n !== note);
      }

      try {
        engine.playNote(note);
      } catch {
        // ignore
      }
      return [...s, note];
    });
  }, []);

  const releaseNote = useCallback(
    (note: string) => {
      try {
        // Use normal stopNote here so releases respect `hold` mode.
        engine.stopNote(note);
      } catch {
        // ignore
      }
      setActiveNotes((s) => (hold ? s : s.filter((n) => n !== note)));
    },
    [hold],
  );

  const toggleHold = useCallback(() => {
    setHold((h) => {
      const next = !h;
      engine.setHold(next);
      if (!next) {
        // clear UI active notes when turning hold off
        setActiveNotes([]);
      }
      return next;
    });
  }, []);

  return (
    <KeyboardContext.Provider
      value={{ activeNotes, hold, pressNote, releaseNote, toggleHold }}
    >
      {children}
    </KeyboardContext.Provider>
  );
};

export default KeyboardProvider;

// NOTE: do not export non-component values from this .tsx file — keep it
// limited to the `KeyboardProvider` component so React Fast Refresh works.
