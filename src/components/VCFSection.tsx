import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";

export const VCFSection: React.FC = () => {
  const [cutoff, setCutoff] = useState(2000);
  const [resonance, setResonance] = useState(0);

  useEffect(() => {
    engine.updateVCF(cutoff, resonance);
  }, [cutoff, resonance]);

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        alignItems: "flex-end",
        height: "100%",
      }}
    >
      //* CUTOFF FREQ
      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="20"
          max="10000"
          step="10"
          value={cutoff}
          onChange={(e) => setCutoff(parseFloat(e.target.value))}
        />
        <div className="slider-label">FREQ</div>
      </div>
      //* RESONANCE
      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="0"
          max="20"
          step="0.1"
          value={resonance}
          onChange={(e) => setResonance(parseFloat(e.target.value))}
        />
        <div className="slider-label">RES</div>
      </div>
    </div>
  );
};
