import { useContext } from "react";
import { KeyboardContext } from "../contexts/keyboardCore";
import type { KeyboardContextType } from "../contexts/keyboardCore";

export const useKeyboardContext = (): KeyboardContextType => {
  const ctx = useContext(KeyboardContext);
  if (!ctx)
    throw new Error("useKeyboardContext must be used within KeyboardProvider");
  return ctx;
};
