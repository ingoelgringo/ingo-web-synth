import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";

export const DCOSection: React.FC = () => {
  const [sawEnabled, setSawEnabled] = useState(true);
  const [pulseEnabled, setPulseEnabled] = useState(false);

  // Uppdatera ljudmotorn när state ändras
  useEffect(() => {
    engine.setWaveform(sawEnabled, pulseEnabled);
  }, [sawEnabled, pulseEnabled]);

  return (
    <div
      style={{
        border: "1px solid #666",
        padding: "10px",
        borderRadius: "4px",
        backgroundColor: "#333",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "#ccc" }}>
        DCO
      </h3>

      <div style={{ display: "flex", gap: "10px" }}>
        {/* SAW Button */}
        <button
          onClick={() => setSawEnabled(!sawEnabled)}
          style={{
            padding: "10px",
            backgroundColor: sawEnabled ? "#ffcc00" : "#444",
            color: sawEnabled ? "#000" : "#fff",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
          }}
        >
          SAW
        </button>

        {/* PULSE Button */}
        <button
          onClick={() => setPulseEnabled(!pulseEnabled)}
          style={{
            padding: "10px",
            backgroundColor: pulseEnabled ? "#ffcc00" : "#444",
            color: pulseEnabled ? "#000" : "#fff",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
          }}
        >
          PULSE
        </button>
      </div>
    </div>
  );
};
