import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";

export const ADSRSection: React.FC = () => {
  const [attack, setAttack] = useState(0.01);
  const [decay, setDecay] = useState(0.1);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(1);

  useEffect(() => {
    engine.setADSR(attack, decay, sustain, release);
  }, [attack, decay, sustain, release]);

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "flex-end",
        height: "100%",
      }}
    >
      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="0.01"
          max="2"
          step="0.01"
          value={attack}
          onChange={(e) => setAttack(parseFloat(e.target.value))}
        />
        <div className="slider-label">A</div>
      </div>

      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="0.1"
          max="2"
          step="0.01"
          value={decay}
          onChange={(e) => setDecay(parseFloat(e.target.value))}
        />
        <div className="slider-label">D</div>
      </div>

      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="0"
          max="1"
          step="0.01"
          value={sustain}
          onChange={(e) => setSustain(parseFloat(e.target.value))}
        />
        <div className="slider-label">S</div>
      </div>

      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="0.1"
          max="5"
          step="0.1"
          value={release}
          onChange={(e) => setRelease(parseFloat(e.target.value))}
        />
        <div className="slider-label">R</div>
      </div>
    </div>
  );
};
