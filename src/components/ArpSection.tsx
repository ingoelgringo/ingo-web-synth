import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";
import "./ADSRSection.css"; // Vi återanvänder slider-stilen här, smart va?

export const ArpSection: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [rate, setRate] = useState(120);
  const [mode, setMode] = useState<"up" | "down" | "upDown" | "random">("up");

  // Effekt: Uppdatera engine när enabled ändras
  useEffect(() => {
    engine.setArpEnabled(enabled);
  }, [enabled]);

  // Effekt: Uppdatera BPM när rate ändras
  useEffect(() => {
    engine.setArpRate(rate);
  }, [rate]);

  // Effekt: Uppdatera läge när mode ändras
  useEffect(() => {
    engine.setArpMode(mode);
  }, [mode]);

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
        ARPEGGIO
      </h3>

      {/* ON/OFF Switch */}
      <button
        onClick={() => setEnabled(!enabled)}
        style={{
          padding: "5px 10px",
          backgroundColor: enabled ? "#ff4444" : "#444",
          color: "white",
          border: "1px solid #222",
          borderRadius: "2px",
          marginBottom: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          width: "100%",
        }}
      >
        {enabled ? "ON" : "OFF"}
      </button>

      <div style={{ display: "flex", gap: "15px" }}>
        {/* MODE SELECTOR */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#aaa", fontSize: "0.7rem" }}>MODE</label>
          <select
            value={mode}
            onChange={(e) =>
              setMode(e.target.value as "up" | "down" | "upDown" | "random")
            }
            style={{
              backgroundColor: "#222",
              color: "#fff",
              border: "1px solid #555",
              padding: "2px",
              fontSize: "0.8rem",
              width: "60px",
            }}
          >
            <option value="up">UP</option>
            <option value="down">DOWN</option>
            <option value="upDown">U/D</option>
            <option value="random">RND</option>
          </select>
        </div>

        {/* RATE SLIDER */}
        <div className="slider-container" style={{ height: "120px" }}>
          <input
            type="range"
            className="vertical-slider"
            min="60"
            max="240"
            step="1"
            value={rate}
            onChange={(e) => setRate(parseInt(e.target.value))}
            style={{ width: "80px" }}
          />
          <label className="slider-label" style={{ marginTop: "-40px" }}>
            RATE
          </label>
        </div>
      </div>
    </div>
  );
};
