import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";

export const ChorusSection: React.FC = () => {
  const [mode, setMode] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    engine.setChorus(mode);
  }, [mode]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        padding: "10px 0",
      }}
    >
      <button
        onClick={() => setMode(mode === 0 ? 0 : 0)} // Bara för tydlighet
        className={`juno-btn yellow ${mode === 0 ? "active" : ""}`}
        style={{ opacity: mode === 0 ? 1 : 0.5 }}
      >
        OFF
      </button>

      <button
        onClick={() => setMode(mode === 1 ? 0 : 1)}
        className={`juno-btn yellow ${mode === 1 ? "active" : ""}`}
      >
        I
      </button>

      <button
        onClick={() => setMode(mode === 2 ? 0 : 2)}
        className={`juno-btn yellow ${mode === 2 ? "active" : ""}`}
      >
        II
      </button>
    </div>
  );
};
