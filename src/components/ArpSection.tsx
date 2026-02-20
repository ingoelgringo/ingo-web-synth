import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";
import { HoldButton } from "./HoldButton";

export const ArpSection: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [rate, setRate] = useState(120);
  const [mode, setMode] = useState<"up" | "down" | "upDown" | "random">("up");

  useEffect(() => {
    engine.setArpEnabled(enabled);
  }, [enabled]);
  useEffect(() => {
    engine.setArpRate(rate);
  }, [rate]);
  useEffect(() => {
    engine.setArpMode(mode);
  }, [mode]);

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        alignItems: "flex-end",
        height: "100%",
        paddingRight: "15px",
        marginRight: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          paddingBottom: "30px",
        }}
      >
        <HoldButton />
        <button
          onClick={() => setEnabled(!enabled)}
          className={`juno-btn red ${enabled ? "active" : ""}`}
        >
          {enabled ? "ON" : "ARP"}
        </button>

        <select
          value={mode}
          onChange={(e) =>
            setMode(e.target.value as "up" | "down" | "upDown" | "random")
          }
          style={{
            background: "#222",
            color: "#ccc",
            border: "1px solid #444",
            fontSize: "0.7rem",
          }}
        >
          <option value="up">UP</option>
          <option value="down">DOWN</option>
          <option value="upDown">U/D</option>
          <option value="random">RND</option>
        </select>
      </div>

      <div className="slider-container">
        <div className="slider-label">RATE</div>
        <input
          type="range"
          className="vertical-slider"
          min="80"
          max="600"
          step="1"
          value={rate}
          onChange={(e) => setRate(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};
