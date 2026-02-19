import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";

export const LFOSection: React.FC = () => {
  const [rate, setRate] = useState(50);

  useEffect(() => {
    engine.setLFORate(rate);
  }, [rate]);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: "100%" }}>
      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="0"
          max="100"
          step="1"
          value={rate}
          onChange={(e) => setRate(parseInt(e.target.value))}
        />
        <div className="slider-label">RATE</div>
      </div>
    </div>
  );
};
