import React, { createContext, useCallback, useContext, useState } from "react";
import { engine } from "../audio/engine";

type KeyboardContextType = {
  activeNotes: string[];
  hold: boolean;
  pressNote: (note: string) => void;
  releaseNote: (note: string) => void;
  toggleHold: () => void;
};

const KeyboardContext = createContext<KeyboardContextType | undefined>(
  undefined,
);

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [hold, setHold] = useState(false);

  const pressNote = useCallback((note: string) => {
    setActiveNotes((s) => (s.includes(note) ? s : [...s, note]));
    try {
      engine.playNote(note);
    } catch (e) {
      // ignore
    }
  }, []);

  const releaseNote = useCallback(
    (note: string) => {
      try {
        engine.stopNote(note);
      } catch (e) {
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

export const useKeyboardContext = () => {
  const ctx = useContext(KeyboardContext);
  if (!ctx)
    throw new Error("useKeyboardContext must be used within KeyboardProvider");
  return ctx;
};
