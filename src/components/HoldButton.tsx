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
        display: "flex",
        alignItems: "center",
        paddingRight: "15px",
        borderRight: "1px solid #444",
      }}
    >
      <button
        onClick={() => setActive(!active)}
        className={`juno-btn ${active ? "active red" : ""}`}
        style={{ height: "40px", fontSize: "0.7rem" }}
      >
        HOLD
      </button>
    </div>
  );
};
