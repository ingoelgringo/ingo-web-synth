import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";
import "./ADSRSection.css"; // Importera CSS-filen

export const ADSRSection: React.FC = () => {
  const [attack, setAttack] = useState(0.01);
  const [decay, setDecay] = useState(0.1);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(1.0);

  useEffect(() => {
    engine.setADSR(attack, decay, sustain, release);
  }, [attack, decay, sustain, release]);

  return (
    <div
      style={{
        border: "1px solid #666",
        padding: "10px 10px 20px 10px",
        borderRadius: "4px",
        backgroundColor: "#333",
        display: "flex",
        gap: "5px",
        height: "180px",
        alignItems: "center",
      }}
    >
      <h3
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          margin: "0",
          fontSize: "0.9rem",
          color: "#ccc",
          textAlign: "center",
          height: "100%",
        }}
      >
        ENV
      </h3>

      {/* ATTACK */}
      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="0.001"
          max="2"
          step="0.01"
          value={attack}
          onChange={(e) => setAttack(parseFloat(e.target.value))}
        />
        <label className="slider-label">A</label>
      </div>

      {/* DECAY */}
      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="0.01"
          max="2"
          step="0.01"
          value={decay}
          onChange={(e) => setDecay(parseFloat(e.target.value))}
        />
        <label className="slider-label">D</label>
      </div>

      {/* SUSTAIN */}
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
        <label className="slider-label">S</label>
      </div>

      {/* RELEASE */}
      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="0.01"
          max="5"
          step="0.01"
          value={release}
          onChange={(e) => setRelease(parseFloat(e.target.value))}
        />
        <label className="slider-label">R</label>
      </div>
    </div>
  );
};
