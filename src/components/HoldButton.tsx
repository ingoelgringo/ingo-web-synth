import React from "react";
import { useKeyboardContext } from "../contexts/KeyboardContext";

export const HoldButton: React.FC = () => {
  const { hold, toggleHold } = useKeyboardContext();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingRight: "15px",
      }}
    >
      <button
        onClick={toggleHold}
        className={`juno-btn ${hold ? "active red" : ""}`}
        style={{ height: "40px", fontSize: "0.7rem" }}
      >
        HOLD
      </button>
    </div>
  );
};
