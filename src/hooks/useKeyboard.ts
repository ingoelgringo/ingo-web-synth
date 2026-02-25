import { useEffect, useRef } from "react";
import { useKeyboardContext } from "./useKeyboardContext";

// Map of computer keys to notes (covers approx C2 - C5 across two rows)
export const KEY_MAP: Record<string, string> = {
  // lower row
  z: "C2",
  s: "C#2",
  x: "D2",
  d: "D#2",
  c: "E2",
  v: "F2",
  g: "F#2",
  b: "G2",
  h: "G#2",
  n: "A2",
  j: "A#2",
  m: "B2",
  // top row
  q: "C3",
  "2": "C#3",
  w: "D3",
  "3": "D#3",
  e: "E3",
  r: "F3",
  "5": "F#3",
  t: "G3",
  "6": "G#3",
  y: "A3",
  "7": "A#3",
  u: "B3",
  i: "C4",
  "9": "C#4",
  o: "D4",
  "0": "D#4",
  p: "E4",
  "[": "F4",
  "=": "F#4",
  "]": "G4",
  // lower row continuation (placed after top row so top row keys take precedence in reverse mapping)
  ",": "C3",
  l: "C#3",
  ".": "D3",
  ";": "D#3",
  "/": "E3",
};

export const useKeyboard = (enabled: boolean) => {
  const { pressNote, releaseNote } = useKeyboardContext();
  const physicalMapRef = useRef(new Map<string, string>());

  useEffect(() => {
    if (!enabled) return;

    const map = physicalMapRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      const note = KEY_MAP[key];
      if (note) {
        e.preventDefault();
        if (!map.has(key)) {
          map.set(key, note);
          pressNote(note);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const note = map.get(key) || KEY_MAP[key];
      if (note) {
        e.preventDefault();
        releaseNote(note);
        map.delete(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      map.clear();
    };
  }, [enabled, pressNote, releaseNote]);
};
