import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";

export const ChorusSection: React.FC = () => {
  const [mode, setMode] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    engine.setChorus(mode);
  }, [mode]);

  const buttonStyle = (active: boolean) => ({
    padding: "15px 10px",
    backgroundColor: active ? "#ffcc00" : "#444",
    color: active ? "#000" : "#ccc",
    border: "1px solid #222",
    borderRadius: "2px",
    cursor: "pointer",
    width: "40px",
    fontWeight: "bold" as const,
    fontSize: "0.9rem",
  });

  return (
    <div
      style={{
        border: "1px solid #666",
        padding: "10px",
        borderRadius: "4px",
        backgroundColor: "#333",
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3 style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#ccc" }}>
        CHORUS
      </h3>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => setMode(mode === 0 ? 0 : 0)} // Klickar man OFF händer inget speciellt, men vi kan ha en dedikerad OFF-knapp
          style={buttonStyle(mode === 0)}
        >
          OFF
        </button>

        <button
          onClick={() => setMode(mode === 1 ? 0 : 1)} // Klickar man igen stängs det av
          style={buttonStyle(mode === 1)}
        >
          I
        </button>

        <button
          onClick={() => setMode(mode === 2 ? 0 : 2)} // Klickar man igen stängs det av
          style={buttonStyle(mode === 2)}
        >
          II
        </button>
      </div>
    </div>
  );
};
