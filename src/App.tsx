import { useState } from "react";
import "./JunoStyles.css"; // Importera den nya stilen
import * as Tone from "tone";
import { engine } from "./audio/engine";

// Import Components
import { HoldButton } from "./components/HoldButton";
import { ArpSection } from "./components/ArpSection";
import { LFOSection } from "./components/LFOSection";
import { DCOSection } from "./components/DCOSection";
import { VCFSection } from "./components/VCFSection";
import { ADSRSection } from "./components/ADSRSection";
import { ChorusSection } from "./components/ChorusSection";
import { useKeyboard } from "./hooks/useKeyboard";

function App() {
  const [started, setStarted] = useState(false);
  useKeyboard(started);

  const handleStart = async () => {
    await engine.start();
    Tone.getTransport().start();
    setStarted(true);
  };

  return (
    <div className="App">
      {!started ? (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#ccc", letterSpacing: "2px" }}>
            ROLAND JUNO-60
          </h1>
          <button
            onClick={handleStart}
            style={{
              padding: "15px 30px",
              fontSize: "1.2rem",
              background: "#d94e4e",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            POWER ON
          </button>
        </div>
      ) : (
        <div className="main-container">
          <div
            className="juno-logo-bar"
            style={{
              marginBottom: "20px",
              color: "#ccc",
              fontStyle: "italic",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Juno-60{" "}
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: "normal",
                color: "#888",
              }}
            >
              PROGRAMMABLE POLYPHONIC SYNTHESIZER
            </span>
          </div>

          <div className="juno-panel">
            {/* LFO / CONTROLS SECTION */}
            <div className="juno-section">
              <div className="juno-header juno-header-L">CONTROLS</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <HoldButton />
                <ArpSection />
                <LFOSection />
              </div>
            </div>

            {/* DCO SECTION */}
            <div className="juno-section">
              <div className="juno-header juno-header-C">DCO</div>
              <DCOSection />
            </div>

            {/* VCF SECTION */}
            <div className="juno-section">
              <div className="juno-header juno-header-C">VCF</div>
              <VCFSection />
            </div>

            {/* VCA/ENV SECTION */}
            <div className="juno-section">
              <div className="juno-header juno-header-C">VCA / ENV</div>
              <ADSRSection />
            </div>

            {/* CHORUS SECTION */}
            <div className="juno-section">
              <div className="juno-header juno-header-R">CHORUS</div>
              <ChorusSection />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
