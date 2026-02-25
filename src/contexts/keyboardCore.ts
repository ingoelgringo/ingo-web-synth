import { createContext } from "react";

export type KeyboardContextType = {
  activeNotes: string[];
  hold: boolean;
  pressNote: (note: string) => void;
  releaseNote: (note: string) => void;
  toggleHold: () => void;
};

export const KeyboardContext = createContext<KeyboardContextType | undefined>(
  undefined,
);
