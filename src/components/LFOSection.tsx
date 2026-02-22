import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";

export const LFOSection: React.FC = () => {
  const [rate, setRate] = useState(50);
  const [lfoAmount, setLfoAmount] = useState(0);

  useEffect(() => {
    engine.setLFORate(rate);
  }, [rate]);

  useEffect(() => {
    engine.setLFOAmount(lfoAmount);
  }, [lfoAmount]);

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "flex-end",
        height: "100%",
      }}
    >
      //* LFO RATE SLIDER
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
      //* LFO AMOUNT SLIDER
      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="0"
          max="1"
          step="0.01"
          value={lfoAmount}
          onChange={(e) => setLfoAmount(parseFloat(e.target.value))}
        />
        <div className="slider-label">DEPTH</div>
      </div>
    </div>
  );
};
