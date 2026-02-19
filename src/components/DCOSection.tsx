import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";
import "./ADSRSection.css"; // För sliders

export const DCOSection: React.FC = () => {
  const [sawEnabled, setSawEnabled] = useState(true);
  const [pulseEnabled, setPulseEnabled] = useState(false);
  const [subLevel, setSubLevel] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0);

  // NY STATE: LFO Amount (Vibrato depth)
  const [lfoAmount, setLfoAmount] = useState(0);

  useEffect(() => {
    engine.setWaveform(sawEnabled, pulseEnabled);
  }, [sawEnabled, pulseEnabled]);

  useEffect(() => {
    engine.setSubLevel(subLevel);
  }, [subLevel]);

  useEffect(() => {
    engine.setNoiseLevel(noiseLevel);
  }, [noiseLevel]);

  // NY EFFECT: Skicka LFO-värdet till engine
  useEffect(() => {
    engine.setLFOAmount(lfoAmount);
  }, [lfoAmount]);

  // Gemensam stil för knappar
  const btnStyle = (active: boolean) => ({
    padding: "10px",
    backgroundColor: active ? "#ffcc00" : "#444",
    color: active ? "#000" : "#fff",
    border: "1px solid #222",
    borderRadius: "2px",
    cursor: "pointer",
    fontWeight: "bold" as const,
    fontSize: "0.8rem",
    marginBottom: "10px",
  });

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
      }}
    >
      <h3 style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#ccc" }}>
        DCO
      </h3>

      <div style={{ display: "flex", gap: "15px" }}>
        {/* NY SLIDER: LFO AMOUNT */}
        <div className="slider-container" style={{ height: "120px" }}>
          <input
            type="range"
            className="vertical-slider"
            min="0"
            max="1"
            step="0.01"
            value={lfoAmount}
            onChange={(e) => setLfoAmount(parseFloat(e.target.value))}
          />
          <label className="slider-label" style={{ marginTop: "-40px" }}>
            LFO
          </label>
        </div>

        {/* WAVEFORMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <button
            onClick={() => setSawEnabled(!sawEnabled)}
            style={btnStyle(sawEnabled)}
          >
            SAW
          </button>
          <button
            onClick={() => setPulseEnabled(!pulseEnabled)}
            style={btnStyle(pulseEnabled)}
          >
            PULSE
          </button>
        </div>

        {/* SUB SLIDER */}
        <div className="slider-container" style={{ height: "120px" }}>
          <input
            type="range"
            className="vertical-slider"
            min="0"
            max="1"
            step="0.01"
            value={subLevel}
            onChange={(e) => setSubLevel(parseFloat(e.target.value))}
          />
          <label className="slider-label" style={{ marginTop: "-40px" }}>
            SUB
          </label>
        </div>

        {/* NOISE SLIDER */}
        <div className="slider-container" style={{ height: "120px" }}>
          <input
            type="range"
            className="vertical-slider"
            min="0"
            max="1"
            step="0.01"
            value={noiseLevel}
            onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
          />
          <label className="slider-label" style={{ marginTop: "-40px" }}>
            NOISE
          </label>
        </div>
      </div>
    </div>
  );
};
