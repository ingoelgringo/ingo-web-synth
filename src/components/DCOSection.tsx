import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";
import "../JunoStyles.css";

export const DCOSection: React.FC = () => {
  const [sawEnabled, setSawEnabled] = useState(true);
  const [pulseEnabled, setPulseEnabled] = useState(false);
  const [subLevel, setSubLevel] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0);

  useEffect(() => {
    engine.setWaveform(sawEnabled, pulseEnabled);
  }, [sawEnabled, pulseEnabled]);

  useEffect(() => {
    engine.setSubLevel(subLevel);
  }, [subLevel]);

  useEffect(() => {
    engine.setNoiseLevel(noiseLevel);
  }, [noiseLevel]);

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "flex-end",
        height: "100%",
      }}
    >
      {/* WAVEFORM BUTTONS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          paddingBottom: "30px",
        }}
      >
        <button
          onClick={() => setSawEnabled(!sawEnabled)}
          className={`juno-btn blue ${sawEnabled ? "active" : ""}`}
          title="Sawtooth Wave"
        >
          SAW
        </button>
        <button
          onClick={() => setPulseEnabled(!pulseEnabled)}
          className={`juno-btn blue ${pulseEnabled ? "active" : ""}`}
          title="Pulse Wave"
        >
          PULSE
        </button>
      </div>
      {/* SUB SLIDER */}
      <div className="slider-container">
        <input
          type="range"
          className="vertical-slider"
          min="0"
          max="1"
          step="0.01"
          value={subLevel}
          onChange={(e) => setSubLevel(parseFloat(e.target.value))}
        />
        <div className="slider-label">SUB</div>
      </div>
      {/* NOISE SLIDER */}
      <div className="slider-container">
        <div className="slider-label">NOISE</div>
        <input
          type="range"
          className="vertical-slider"
          min="0"
          max="1"
          step="0.01"
          value={noiseLevel}
          onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};
