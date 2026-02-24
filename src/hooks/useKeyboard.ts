import { useEffect } from "react";
import { engine } from "../audio/engine";

// Maping of computer keyboard keys to musical notes
const KEY_MAP: Record<string, string> = {
  a: "C3",
  w: "C#3",
  s: "D3",
  e: "D#3",
  d: "E3",
  f: "F3",
  t: "F#3",
  g: "G3",
  y: "G#3",
  h: "A3",
  u: "A#3",
  j: "B3",
  k: "C4",
  o: "C#4",
  l: "D4",
};

export const useKeyboard = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent auto-repeating notes when holding down a key
      if (e.repeat) return;

      const note = KEY_MAP[e.key.toLowerCase()];
      if (note && !pressedKeys.has(note)) {
        engine.playNote(note);
        pressedKeys.add(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = KEY_MAP[e.key.toLowerCase()];
      if (note) {
        engine.stopNote(note);
        pressedKeys.delete(note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enabled]);
};
