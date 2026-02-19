import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";
import "./ADSRSection.css"; // Vi återanvänder slider-stilen

export const LFOSection: React.FC = () => {
  const [rate, setRate] = useState(50); // Mitten-värde (ca 5 Hz)

  // Uppdatera engine när rate ändras
  useEffect(() => {
    engine.setLFORate(rate);
  }, [rate]);

  return (
    <div
      style={{
        border: "1px solid #666",
        padding: "10px",
        borderRadius: "4px",
        backgroundColor: "#333",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <h3 style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#ccc" }}>
        LFO
      </h3>

      {/* RATE SLIDER */}
      <div className="slider-container" style={{ height: "120px" }}>
        <input
          type="range"
          className="vertical-slider"
          min="0"
          max="100"
          step="1"
          value={rate}
          onChange={(e) => setRate(parseInt(e.target.value))}
        />
        <label className="slider-label" style={{ marginTop: "-40px" }}>
          RATE
        </label>
      </div>
    </div>
  );
};
