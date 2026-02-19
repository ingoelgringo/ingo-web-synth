import React, { useState, useEffect } from "react";
import { engine } from "../audio/engine";

export const HoldButton: React.FC = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    engine.setHold(active);
  }, [active]);

  return (
    <div
      style={{
        border: "1px solid #666",
        padding: "10px",
        borderRadius: "4px",
        backgroundColor: "#333",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "#ccc" }}>
        KEY
      </h3>
      <button
        onClick={() => setActive(!active)}
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: active ? "#ffcc00" : "#444", // Juno "Orange/Gul" färg
          color: active ? "#000" : "#ccc",
          border: "2px solid #222",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "0.9rem",
          boxShadow: active ? "0 0 10px #ffcc00" : "none",
        }}
      >
        HOLD
      </button>
    </div>
  );
};
